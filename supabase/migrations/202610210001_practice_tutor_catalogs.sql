-- Published catalog content for Practice and AI Tutor.
-- Import content with scripts/import-content.mjs using a server-only key.

alter table public.topics
  add column if not exists subtitle text,
  add column if not exists icon text,
  add column if not exists cefr_level text,
  add column if not exists accent_color text,
  add column if not exists sort_order integer not null default 0;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'topics_cefr_level_check'
      and conrelid = 'public.topics'::regclass
  ) then
    alter table public.topics
      add constraint topics_cefr_level_check
      check (cefr_level is null or cefr_level in ('A1', 'A2', 'B1', 'B2', 'C1', 'C2'));
  end if;
end $$;

create table if not exists public.practice_content (
  id text primary key,
  skill text not null check (skill in ('listening', 'reading', 'writing', 'speaking')),
  cefr_level text not null check (cefr_level in ('A1', 'A2', 'B1', 'B2', 'C1', 'C2')),
  title text,
  payload jsonb not null check (jsonb_typeof(payload) = 'object'),
  sort_order integer not null default 0,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.ai_tutors (
  id text primary key,
  name text not null,
  role text not null,
  initials text not null,
  description text not null,
  tone text,
  accent_color text,
  sort_order integer not null default 0,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.tutor_scenarios (
  id text primary key,
  tutor_id text not null references public.ai_tutors(id) on delete cascade,
  title text not null,
  subtitle text not null,
  level text not null check (level in ('Beginner', 'Intermediate', 'Advanced')),
  icon text,
  sort_order integer not null default 0,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.tutor_scenario_messages (
  scenario_id text not null references public.tutor_scenarios(id) on delete cascade,
  position integer not null check (position > 0),
  role text not null check (role in ('tutor', 'learner')),
  text text not null,
  primary key (scenario_id, position)
);

create index if not exists practice_content_published_skill_level_order_idx
  on public.practice_content (skill, cefr_level, sort_order)
  where is_published;
create index if not exists ai_tutors_published_order_idx
  on public.ai_tutors (sort_order)
  where is_published;
create index if not exists tutor_scenarios_published_tutor_order_idx
  on public.tutor_scenarios (tutor_id, sort_order)
  where is_published;

alter table public.practice_content enable row level security;
alter table public.ai_tutors enable row level security;
alter table public.tutor_scenarios enable row level security;
alter table public.tutor_scenario_messages enable row level security;

drop policy if exists "published_practice_content_read" on public.practice_content;
drop policy if exists "published_ai_tutors_read" on public.ai_tutors;
drop policy if exists "published_tutor_scenarios_read" on public.tutor_scenarios;
drop policy if exists "published_tutor_scenario_messages_read" on public.tutor_scenario_messages;

create policy "published_practice_content_read"
on public.practice_content for select
to anon, authenticated
using (is_published);

create policy "published_ai_tutors_read"
on public.ai_tutors for select
to anon, authenticated
using (is_published);

create policy "published_tutor_scenarios_read"
on public.tutor_scenarios for select
to anon, authenticated
using (
  is_published
  and exists (
    select 1 from public.ai_tutors tutor
    where tutor.id = tutor_scenarios.tutor_id
      and tutor.is_published
  )
);

create policy "published_tutor_scenario_messages_read"
on public.tutor_scenario_messages for select
to anon, authenticated
using (
  exists (
    select 1 from public.tutor_scenarios scenario
    join public.ai_tutors tutor on tutor.id = scenario.tutor_id
    where scenario.id = tutor_scenario_messages.scenario_id
      and scenario.is_published
      and tutor.is_published
  )
);

revoke all on table public.practice_content from anon, authenticated;
revoke all on table public.ai_tutors from anon, authenticated;
revoke all on table public.tutor_scenarios from anon, authenticated;
revoke all on table public.tutor_scenario_messages from anon, authenticated;

grant select on table public.practice_content to anon, authenticated;
grant select on table public.ai_tutors to anon, authenticated;
grant select on table public.tutor_scenarios to anon, authenticated;
grant select on table public.tutor_scenario_messages to anon, authenticated;

grant all on table public.practice_content to service_role;
grant all on table public.ai_tutors to service_role;
grant all on table public.tutor_scenarios to service_role;
grant all on table public.tutor_scenario_messages to service_role;
