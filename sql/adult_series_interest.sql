-- Adult Summer Series interest list
-- Run this in the Supabase SQL editor. Idempotent.

create table if not exists public.adult_series_interest (
  id              uuid primary key default gen_random_uuid(),
  created_at      timestamptz not null default now(),
  name            text not null,
  email           text not null,
  phone           text,
  class_interest  jsonb,
  preferred_times jsonb,
  pass_interest   text,
  notes           text
);

alter table public.adult_series_interest
  add column if not exists preferred_times jsonb;

alter table public.adult_series_interest enable row level security;

drop policy if exists "adult_series_interest_open" on public.adult_series_interest;
create policy "adult_series_interest_open"
  on public.adult_series_interest
  as permissive
  for all
  to public
  using (true)
  with check (true);

create index if not exists adult_series_interest_created_idx
  on public.adult_series_interest (created_at desc);
