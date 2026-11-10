-- Additive AI Tutor runtime. Existing catalog tables and their rows stay untouched.
begin;

create table if not exists public.tutor_profile_details (
  tutor_id text primary key references public.ai_tutors(id),
  specialties text[] not null default '{}',
  suitable_levels text[] not null default '{}'
);
create table if not exists public.tutor_scenario_details (
  scenario_id text primary key references public.tutor_scenarios(id),
  objective text not null,
  learner_role text not null,
  suggested_phrases text[] not null default '{}',
  topic_ids text[] not null default '{}',
  starter_prompt text not null,
  roleplay_rules text not null
);
alter table public.tutor_profile_details enable row level security;
alter table public.tutor_scenario_details enable row level security;
create policy tutor_profile_details_read on public.tutor_profile_details
for select to anon, authenticated using (exists (
  select 1 from public.ai_tutors t where t.id=tutor_id and t.is_published
));
create policy tutor_scenario_details_read on public.tutor_scenario_details
for select to anon, authenticated using (exists (
  select 1 from public.tutor_scenarios s join public.ai_tutors t on t.id=s.tutor_id
  where s.id=scenario_id and s.is_published and t.is_published
));
revoke all on public.tutor_profile_details, public.tutor_scenario_details from anon, authenticated;
grant select on public.tutor_profile_details, public.tutor_scenario_details to anon, authenticated;
grant all on public.tutor_profile_details, public.tutor_scenario_details to service_role;

create table if not exists public.tutor_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  tutor_id text not null,
  scenario_id text not null,
  status text not null default 'active' check(status in ('active','paused','completed','abandoned')),
  summary jsonb,
  started_at timestamptz not null default now(),
  ended_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
-- These ALTERs only concern the Tutor-owned runtime tables, including older installs.
alter table public.tutor_sessions add column if not exists learner_turns integer not null default 0;
alter table public.tutor_sessions add column if not exists pending_request_id uuid;
alter table public.tutor_sessions add column if not exists pending_until timestamptz;
create table if not exists public.tutor_messages (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.tutor_sessions(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check(role in ('tutor','learner')),
  content text not null check(char_length(content) between 1 and 5000),
  metadata jsonb,
  created_at timestamptz not null default now()
);
alter table public.tutor_messages add column if not exists request_id uuid;
create table if not exists public.tutor_requests (
  session_id uuid not null references public.tutor_sessions(id) on delete cascade,
  request_id uuid not null,
  user_id uuid not null references auth.users(id) on delete cascade,
  action text not null check(action in ('message','hint','correct','summary')),
  message text not null default '',
  state text not null default 'pending' check(state in ('pending','completed','failed')),
  lease_id uuid not null,
  response jsonb,
  created_at timestamptz not null default now(),
  primary key(session_id,request_id)
);
create unique index if not exists tutor_messages_request_role_idx
  on public.tutor_messages(session_id,request_id,role);
create index if not exists tutor_messages_session_created_idx on public.tutor_messages(session_id,created_at,id);
create index if not exists tutor_sessions_user_updated_idx on public.tutor_sessions(user_id,updated_at desc);
create index if not exists tutor_requests_user_created_idx on public.tutor_requests(user_id,created_at desc);
alter table public.tutor_sessions enable row level security;
alter table public.tutor_messages enable row level security;
alter table public.tutor_requests enable row level security;
-- Runtime writes go through the authenticated Edge Function, never directly from Expo.
drop policy if exists tutor_sessions_select_own on public.tutor_sessions;
drop policy if exists tutor_messages_select_own on public.tutor_messages;
create policy tutor_sessions_select_own on public.tutor_sessions for select to authenticated
using ((select auth.uid())=user_id);
create policy tutor_messages_select_own on public.tutor_messages for select to authenticated
using ((select auth.uid())=user_id);
revoke all on public.tutor_sessions,public.tutor_messages,public.tutor_requests from anon,authenticated;
grant select on public.tutor_sessions,public.tutor_messages to authenticated;
grant all on public.tutor_sessions,public.tutor_messages,public.tutor_requests to service_role;

create or replace function public.tutor_claim_request(
  p_user_id uuid,p_session_id uuid,p_tutor_id text,p_scenario_id text,
  p_request_id uuid,p_action text,p_message text
) returns jsonb language plpgsql security invoker set search_path='' as $$
declare s public.tutor_sessions; r public.tutor_requests; lease uuid := gen_random_uuid();
begin
  if not exists(select 1 from public.profiles where id=p_user_id and status='active') then
    return jsonb_build_object('error','This account cannot use Tutor AI.','status',403);
  end if;
  if not exists(select 1 from public.tutor_scenarios sc join public.ai_tutors t on t.id=sc.tutor_id
    join public.tutor_scenario_details d on d.scenario_id=sc.id
    where sc.id=p_scenario_id and t.id=p_tutor_id and sc.is_published and t.is_published) then
    return jsonb_build_object('error','This scenario is not available for practice.','status',404);
  end if;
  insert into public.tutor_sessions(id,user_id,tutor_id,scenario_id)
    values(p_session_id,p_user_id,p_tutor_id,p_scenario_id) on conflict(id) do nothing;
  select * into s from public.tutor_sessions where id=p_session_id for update;
  if s.user_id<>p_user_id or s.tutor_id<>p_tutor_id or s.scenario_id<>p_scenario_id then
    return jsonb_build_object('error','Tutor session context does not match.','status',409);
  end if;
  select * into r from public.tutor_requests where session_id=p_session_id and request_id=p_request_id;
  if found then
    if r.action<>p_action or r.message<>coalesce(p_message,'') then
      return jsonb_build_object('error','Request ID was already used for different content.','status',409);
    end if;
    if r.state='completed' then return jsonb_build_object('replay',r.response); end if;
  end if;
  if s.status not in ('active','paused') then
    return jsonb_build_object('error','This tutor session has already ended.','status',409);
  end if;
  if s.pending_until>now() then
    return jsonb_build_object('error','A tutor request is still running. Please retry shortly.','status',409);
  end if;
  if p_action='message' and s.learner_turns>=30 then
    return jsonb_build_object('error','This practice session has reached 30 turns.','status',409);
  end if;
  if p_action<>'summary' and (select count(*) from public.tutor_requests
    where user_id=p_user_id and created_at>now()-interval '1 minute')>=20 then
    return jsonb_build_object('error','Too many requests. Please wait a minute.','status',429);
  end if;
  insert into public.tutor_requests(session_id,request_id,user_id,action,message,lease_id)
    values(p_session_id,p_request_id,p_user_id,p_action,coalesce(p_message,''),lease)
    on conflict(session_id,request_id) do update set state='pending',lease_id=excluded.lease_id;
  update public.tutor_sessions set pending_request_id=p_request_id,
    pending_until=now()+interval '90 seconds',updated_at=now() where id=p_session_id;
  return jsonb_build_object('leaseId',lease);
end $$;

create or replace function public.tutor_complete_request(
  p_user_id uuid,p_session_id uuid,p_request_id uuid,p_lease_id uuid,p_response jsonb
) returns jsonb language plpgsql security invoker set search_path='' as $$
declare s public.tutor_sessions; r public.tutor_requests; result jsonb := p_response;
  learner_id uuid; tutor_id uuid;
begin
  select * into s from public.tutor_sessions where id=p_session_id and user_id=p_user_id for update;
  if not found then raise exception 'Unknown tutor session'; end if;
  select * into r from public.tutor_requests where session_id=p_session_id and request_id=p_request_id;
  if r.state='completed' then return r.response; end if;
  if r.lease_id is distinct from p_lease_id or s.pending_request_id is distinct from p_request_id
    or s.status not in ('active','paused') then raise exception 'Tutor request lease expired'; end if;
  if r.action='message' then
    insert into public.tutor_messages(session_id,user_id,request_id,role,content)
      values(p_session_id,p_user_id,p_request_id,'learner',r.message) returning id into learner_id;
    update public.tutor_sessions set learner_turns=learner_turns+1 where id=p_session_id;
  end if;
  if r.action in ('message','correct') then
    insert into public.tutor_messages(session_id,user_id,request_id,role,content,metadata)
      values(p_session_id,p_user_id,p_request_id,'tutor',p_response->>'message',p_response) returning id into tutor_id;
    result := result || jsonb_build_object('tutorMessageId',tutor_id,'learnerMessageId',learner_id);
  end if;
  if r.action='summary' then
    update public.tutor_sessions set status='completed',summary=p_response->'summary',ended_at=now() where id=p_session_id;
  end if;
  update public.tutor_requests set state='completed',response=result where session_id=p_session_id and request_id=p_request_id;
  update public.tutor_sessions set pending_request_id=null,pending_until=null,updated_at=now() where id=p_session_id;
  return result;
end $$;

create or replace function public.tutor_release_request(
  p_user_id uuid,p_session_id uuid,p_request_id uuid,p_lease_id uuid
) returns void language plpgsql security invoker set search_path='' as $$
begin
  perform 1 from public.tutor_sessions where id=p_session_id and user_id=p_user_id for update;
  update public.tutor_requests set state='failed' where session_id=p_session_id and request_id=p_request_id
    and user_id=p_user_id and lease_id=p_lease_id and state='pending';
  if found then
    update public.tutor_sessions set pending_request_id=null,pending_until=null
      where id=p_session_id and user_id=p_user_id and pending_request_id=p_request_id;
  end if;
end $$;
revoke all on function public.tutor_claim_request(uuid,uuid,text,text,uuid,text,text) from public,anon,authenticated;
revoke all on function public.tutor_complete_request(uuid,uuid,uuid,uuid,jsonb) from public,anon,authenticated;
revoke all on function public.tutor_release_request(uuid,uuid,uuid,uuid) from public,anon,authenticated;
grant execute on function public.tutor_claim_request(uuid,uuid,text,text,uuid,text,text) to service_role;
grant execute on function public.tutor_complete_request(uuid,uuid,uuid,uuid,jsonb) to service_role;
grant execute on function public.tutor_release_request(uuid,uuid,uuid,uuid) to service_role;

-- Seed extension rows only; never upsert the original shared catalog.
insert into public.tutor_profile_details(tutor_id,specialties,suitable_levels)
select t.id,v.specialties,v.levels from public.ai_tutors t join (values
  ('emma',array['Daily conversation','Travel','Confidence'],array['Beginner','Intermediate']),
  ('david',array['Interview','Presentation','Workplace'],array['Intermediate','Advanced'])
) v(id,specialties,levels) on v.id=t.id on conflict(tutor_id) do nothing;

insert into public.tutor_scenario_details(scenario_id,objective,learner_role,suggested_phrases,topic_ids,starter_prompt,roleplay_rules)
select s.id,v.objective,v.learner_role,v.phrases,v.topics,v.starter,v.rules
from public.tutor_scenarios s join (values
 ('coffee','Order a drink politely and handle a simple follow-up question.','A customer ordering a drink before class.',
  array['I would like...','Could I have...?','That will be all, thank you.'],array['food','shopping','daily'],
  'Welcome to the coffee shop. What would you like to order?','Act as a friendly barista. Keep sentences short and natural.'),
 ('university','Ask for help around campus and keep a short conversation going.','A new student looking for the language lab.',
  array['Could you tell me where...?','I am looking for...','Thanks for your help.'],array['education','communication','daily'],
  'Hi! You look a little lost. What are you looking for?','Act as a helpful university student. Use simple everyday English.'),
 ('travel','Ask for directions and solve a small travel problem.','A traveler checking in and asking about transport.',
  array['How do I get to...?','Is there a shuttle...?','Could you recommend...?'],array['travel','communication','daily'],
  'Welcome to the hotel. How can I help you today?','Act as a hotel or travel staff member. Be practical and polite.'),
 ('interview','Give a clear self-introduction and answer common interview questions.','A university student interviewing for an internship.',
  array['I am responsible for...','One strength I have is...','I learned that...'],array['workplace','business','communication'],
  'Thanks for joining us. Could you tell me about yourself?','Act as a supportive interviewer. Ask one focused question at a time.'),
 ('presentation','Open a presentation, explain one idea and handle a question.','A presenter sharing a project update with a team.',
  array['Today I would like to...','The key point is...','That is a great question.'],array['academic','business','communication'],
  'You have five minutes to present your project. How would you open?','Act as a professional presentation coach. Push for clear structure.'),
 ('meeting','Share an opinion, disagree politely and agree on an action.','A team member discussing a project deadline.',
  array['I see your point, but...','My suggestion would be...','Let us agree on...'],array['workplace','business','communication'],
  'We need to decide how to handle the project deadline. What do you think?','Act as a workplace colleague. Model concise, professional language.')
) v(id,objective,learner_role,phrases,topics,starter,rules) on v.id=s.id
on conflict(scenario_id) do nothing;
notify pgrst,'reload schema';
commit;
