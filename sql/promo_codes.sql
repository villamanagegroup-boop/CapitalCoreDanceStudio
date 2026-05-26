-- Promo codes
-- Run this in the Supabase SQL editor. Idempotent.
-- Reusable across signup forms (summer classes, future class forms, camps, etc).

create table if not exists public.promo_codes (
  id              uuid primary key default gen_random_uuid(),
  created_at      timestamptz not null default now(),
  code            text not null unique,        -- stored uppercase; matched case-insensitively
  label           text not null,               -- friendly description shown in UI / admin emails
  discount_type   text not null check (discount_type in ('full', 'percent', 'fixed')),
  discount_value  numeric not null default 0,  -- percent: 0–100; fixed: dollars; full: ignored
  applies_to      text not null default 'any', -- 'any' | 'summer_classes' | 'camps' | etc.
  active          boolean not null default true,
  expires_at      timestamptz,
  notes           text
);

-- Seed the trial code (idempotent)
insert into public.promo_codes (code, label, discount_type, discount_value, applies_to, notes)
values (
  'TRYITFREE',
  'Try it Free · First-class trial',
  'full',
  0,
  'summer_classes',
  'Zeros out the order for new dancers trying a class. Studio confirms selection before classes start.'
)
on conflict (code) do nothing;

alter table public.promo_codes enable row level security;

-- Anon can read active promos so the form can validate. No insert/update from client.
drop policy if exists "promo_codes_anon_read" on public.promo_codes;
create policy "promo_codes_anon_read"
  on public.promo_codes
  as permissive
  for select
  to public
  using (active = true);

-- Add promo tracking columns to summer_class_registrations.
alter table public.summer_class_registrations
  add column if not exists promo_code       text,
  add column if not exists promo_label      text,
  add column if not exists discount_amount  numeric not null default 0;
