-- Teacher Appreciation Spirit Week — idea submissions
-- Run this in the Supabase SQL editor. Idempotent.

create table if not exists public.spirit_week_ideas (
  id              uuid primary key default gen_random_uuid(),
  created_at      timestamptz not null default now(),
  idea            text not null,
  submitter_name  text
);

alter table public.spirit_week_ideas enable row level security;

drop policy if exists "spirit_week_ideas_open" on public.spirit_week_ideas;
create policy "spirit_week_ideas_open"
  on public.spirit_week_ideas
  as permissive
  for all
  to public
  using (true)
  with check (true);

create index if not exists spirit_week_ideas_created_idx
  on public.spirit_week_ideas (created_at desc);
