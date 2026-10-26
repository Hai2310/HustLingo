-- Published learning content for the HustLingo app.
-- Content is imported by scripts/import-content.mjs using a server-side service key.

create table if not exists public.topics (
  id text primary key,
  title text not null,
  description text,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.vocabulary_entries (
  id text primary key,
  language_code text not null default 'en',
  term text not null,
  translation text not null,
  part_of_speech text,
  pronunciation text,
  ipa text,
  example_sentence text,
  example_translation text,
  topic_id text references public.topics(id) on delete set null,
  difficulty text check (difficulty is null or difficulty in ('A1', 'A2', 'B1', 'B2', 'C1', 'C2')),
  exam_tags text[] not null default '{}',
  frequency_rank integer,
  cefr_level text check (cefr_level is null or cefr_level in ('A1', 'A2', 'B1', 'B2', 'C1', 'C2')),
  cefr_source text,
  cefr_confidence text check (cefr_confidence is null or cefr_confidence in ('high', 'medium', 'low')),
  toeic_relevance text,
  ielts_relevance text,
  academic_relevance text,
  business_relevance text,
  quality text not null check (quality in ('production', 'review')),
  is_active boolean not null default true,
  is_published boolean not null default false,
  source_segment text,
  translation_source text,
  pronunciation_source text,
  example_quality text,
  review_flags text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint vocabulary_published_quality check (not is_published or (quality = 'production' and is_active))
);

create table if not exists public.grammar_points (
  id text primary key,
  cefr_level text not null check (cefr_level in ('A1', 'A2', 'B1', 'B2', 'C1')),
  category text not null,
  title text not null,
  title_vi text not null,
  pattern text not null,
  explanation text not null,
  common_mistake jsonb not null check (jsonb_typeof(common_mistake) = 'object'),
  sort_order integer not null default 0,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.grammar_examples (
  grammar_point_id text not null references public.grammar_points(id) on delete cascade,
  position integer not null check (position > 0),
  sentence text not null,
  translation text not null,
  primary key (grammar_point_id, position)
);

create table if not exists public.lessons (
  id text primary key,
  topic_id text references public.topics(id) on delete set null,
  cefr_level text not null check (cefr_level in ('A1', 'A2', 'B1', 'B2', 'C1', 'C2')),
  lesson_type text not null check (lesson_type in ('vocabulary', 'grammar')),
  title text not null,
  description text,
  sort_order integer not null default 0,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.lesson_items (
  lesson_id text not null references public.lessons(id) on delete cascade,
  position integer not null check (position > 0),
  vocabulary_id text references public.vocabulary_entries(id) on delete cascade,
  grammar_point_id text references public.grammar_points(id) on delete cascade,
  primary key (lesson_id, position),
  constraint lesson_item_has_one_content check (
    (vocabulary_id is not null and grammar_point_id is null)
    or (vocabulary_id is null and grammar_point_id is not null)
  ),
  constraint lesson_item_unique_vocabulary unique (lesson_id, vocabulary_id),
  constraint lesson_item_unique_grammar unique (lesson_id, grammar_point_id)
);

create index if not exists vocabulary_published_level_topic_rank_idx
  on public.vocabulary_entries (cefr_level, topic_id, frequency_rank)
  where is_published;
create index if not exists vocabulary_published_term_idx
  on public.vocabulary_entries (lower(term))
  where is_published;
create index if not exists grammar_points_published_level_order_idx
  on public.grammar_points (cefr_level, sort_order)
  where is_published;
create index if not exists lessons_published_level_order_idx
  on public.lessons (cefr_level, sort_order)
  where is_published;
create index if not exists lesson_items_vocabulary_idx
  on public.lesson_items (vocabulary_id)
  where vocabulary_id is not null;
create index if not exists lesson_items_grammar_idx
  on public.lesson_items (grammar_point_id)
  where grammar_point_id is not null;

alter table public.topics enable row level security;
alter table public.vocabulary_entries enable row level security;
alter table public.grammar_points enable row level security;
alter table public.grammar_examples enable row level security;
alter table public.lessons enable row level security;
alter table public.lesson_items enable row level security;

drop policy if exists "published_topics_read" on public.topics;
drop policy if exists "published_vocabulary_read" on public.vocabulary_entries;
drop policy if exists "published_grammar_read" on public.grammar_points;
drop policy if exists "published_grammar_examples_read" on public.grammar_examples;
drop policy if exists "published_lessons_read" on public.lessons;
drop policy if exists "published_lesson_items_read" on public.lesson_items;

create policy "published_topics_read"
on public.topics for select
to anon, authenticated
using (is_published);

create policy "published_vocabulary_read"
on public.vocabulary_entries for select
to anon, authenticated
using (is_published);

create policy "published_grammar_read"
on public.grammar_points for select
to anon, authenticated
using (is_published);

create policy "published_grammar_examples_read"
on public.grammar_examples for select
to anon, authenticated
using (
  exists (
    select 1 from public.grammar_points grammar
    where grammar.id = grammar_examples.grammar_point_id
      and grammar.is_published
  )
);

create policy "published_lessons_read"
on public.lessons for select
to anon, authenticated
using (is_published);

create policy "published_lesson_items_read"
on public.lesson_items for select
to anon, authenticated
using (
  exists (
    select 1 from public.lessons lesson
    where lesson.id = lesson_items.lesson_id
      and lesson.is_published
  )
  and (
    exists (
      select 1 from public.vocabulary_entries vocabulary
      where vocabulary.id = lesson_items.vocabulary_id
        and vocabulary.is_published
    )
    or exists (
      select 1 from public.grammar_points grammar
      where grammar.id = lesson_items.grammar_point_id
        and grammar.is_published
    )
  )
);

revoke all on table public.topics from anon, authenticated;
revoke all on table public.vocabulary_entries from anon, authenticated;
revoke all on table public.grammar_points from anon, authenticated;
revoke all on table public.grammar_examples from anon, authenticated;
revoke all on table public.lessons from anon, authenticated;
revoke all on table public.lesson_items from anon, authenticated;

grant select on table public.topics to anon, authenticated;
grant select on table public.vocabulary_entries to anon, authenticated;
grant select on table public.grammar_points to anon, authenticated;
grant select on table public.grammar_examples to anon, authenticated;
grant select on table public.lessons to anon, authenticated;
grant select on table public.lesson_items to anon, authenticated;

grant all on table public.topics to service_role;
grant all on table public.vocabulary_entries to service_role;
grant all on table public.grammar_points to service_role;
grant all on table public.grammar_examples to service_role;
grant all on table public.lessons to service_role;
grant all on table public.lesson_items to service_role;
