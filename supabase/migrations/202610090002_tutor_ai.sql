-- Tutor AI sessions and long-term learning signals.
-- AI provider secrets stay in the Edge Function environment, never in the app bundle.

create table if not exists public.tutor_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  tutor_id text not null,
  scenario_id text not null,
  status text not null default 'active'
    check (status in ('active', 'paused', 'completed', 'abandoned')),
  summary jsonb,
  started_at timestamptz not null default now(),
  ended_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.tutor_messages (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.tutor_sessions(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('tutor', 'learner')),
  content text not null check (char_length(content) between 1 and 5000),
  metadata jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.tutor_memories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  kind text not null check (kind in ('goal', 'preference', 'recurring_error', 'vocabulary', 'skill')),
  memory_key text not null,
  value text not null,
  confidence numeric(4,3) not null default 0.5 check (confidence between 0 and 1),
  source_session_id uuid references public.tutor_sessions(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists tutor_sessions_user_updated_idx
  on public.tutor_sessions (user_id, updated_at desc);
create index if not exists tutor_messages_session_created_idx
  on public.tutor_messages (session_id, created_at);
create index if not exists tutor_memories_user_updated_idx
  on public.tutor_memories (user_id, updated_at desc);

alter table public.tutor_sessions enable row level security;
alter table public.tutor_messages enable row level security;
alter table public.tutor_memories enable row level security;

drop policy if exists "tutor_sessions_select_own" on public.tutor_sessions;
drop policy if exists "tutor_sessions_insert_own" on public.tutor_sessions;
drop policy if exists "tutor_sessions_update_own" on public.tutor_sessions;
drop policy if exists "tutor_messages_select_own" on public.tutor_messages;
drop policy if exists "tutor_messages_insert_own" on public.tutor_messages;
drop policy if exists "tutor_memories_select_own" on public.tutor_memories;

create policy "tutor_sessions_select_own"
on public.tutor_sessions for select to authenticated
using ((select auth.uid()) = user_id);

create policy "tutor_sessions_insert_own"
on public.tutor_sessions for insert to authenticated
with check ((select auth.uid()) = user_id);

create policy "tutor_sessions_update_own"
on public.tutor_sessions for update to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "tutor_messages_select_own"
on public.tutor_messages for select to authenticated
using ((select auth.uid()) = user_id);

create policy "tutor_messages_insert_own"
on public.tutor_messages for insert to authenticated
with check (
  (select auth.uid()) = user_id
  and exists (
    select 1
    from public.tutor_sessions
    where tutor_sessions.id = tutor_messages.session_id
      and tutor_sessions.user_id = (select auth.uid())
  )
);

create policy "tutor_memories_select_own"
on public.tutor_memories for select to authenticated
using ((select auth.uid()) = user_id);

revoke all on table public.tutor_sessions from anon;
revoke all on table public.tutor_messages from anon;
revoke all on table public.tutor_memories from anon;

grant select, insert, update on table public.tutor_sessions to authenticated;
grant select, insert on table public.tutor_messages to authenticated;
grant select on table public.tutor_memories to authenticated;
