-- Expose published group names while keeping the exercise table's RLS in force.
create or replace view public.practice_grammar_topics
with (security_invoker = true) as
select distinct grammar_topic
from public.grammar_exercises
where is_published;

revoke all on table public.practice_grammar_topics from public, anon, authenticated;
grant select on table public.practice_grammar_topics to anon, authenticated;
