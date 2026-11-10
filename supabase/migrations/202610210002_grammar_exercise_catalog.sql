-- Verbatim imported English grammar cloze exercises for the demo app.
-- Content is imported from the attributed GitHub source by scripts/import-content.mjs.

create table if not exists public.grammar_exercises (
  id text primary key,
  source_dataset text not null,
  source_record_id integer not null,
  grammar_topic text not null,
  gapped_text text not null,
  solution text not null,
  distractors jsonb not null check (
    jsonb_typeof(distractors) = 'array'
    and jsonb_array_length(distractors) between 1 and 3
  ),
  filled_text text not null,
  source_url text not null,
  source_license text not null,
  sort_order integer not null default 0,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint grammar_exercises_source_record_unique unique (source_dataset, source_record_id)
);

create index if not exists grammar_exercises_published_topic_order_idx
  on public.grammar_exercises (grammar_topic, sort_order)
  where is_published;

alter table public.grammar_exercises enable row level security;

drop policy if exists "published_grammar_exercises_read" on public.grammar_exercises;
create policy "published_grammar_exercises_read"
on public.grammar_exercises for select
to anon, authenticated
using (is_published);

revoke all on table public.grammar_exercises from anon, authenticated;
grant select on table public.grammar_exercises to anon, authenticated;
grant all on table public.grammar_exercises to service_role;
