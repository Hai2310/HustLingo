create table if not exists public.pronunciation_usage (
  user_id uuid not null references auth.users(id) on delete cascade,
  usage_day date not null,
  attempts integer not null check (attempts between 1 and 15),
  primary key (user_id, usage_day)
);

alter table public.pronunciation_usage enable row level security;
revoke all on table public.pronunciation_usage from public, anon, authenticated;

create or replace function public.claim_pronunciation_attempt(p_user_id uuid)
returns text
language plpgsql
security definer
set search_path = ''
as $$
declare
  updated_attempts integer;
begin
  if not exists (select 1 from public.profiles where id = p_user_id and status = 'active') then
    return 'account_inactive';
  end if;

  insert into public.pronunciation_usage as daily (user_id, usage_day, attempts)
  values (p_user_id, (now() at time zone 'Asia/Ho_Chi_Minh')::date, 1)
  on conflict (user_id, usage_day) do update set attempts = daily.attempts + 1
  where daily.attempts < 15
  returning attempts into updated_attempts;

  if updated_attempts is null then
    return 'daily_limit';
  end if;
  return 'ok';
end;
$$;

revoke all on function public.claim_pronunciation_attempt(uuid) from public, anon, authenticated;
grant execute on function public.claim_pronunciation_attempt(uuid) to service_role;
