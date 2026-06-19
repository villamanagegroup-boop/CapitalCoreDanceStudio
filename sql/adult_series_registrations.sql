-- Adult Summer Series registrations (paid)
-- Replaces the old interest-list flow (adult_series_interest) with real
-- registrations + PayPal payment. Run this in the Supabase SQL editor BEFORE
-- collecting live sign-ups. Idempotent: safe to re-run.

create table if not exists public.adult_series_registrations (
  id                    uuid primary key default gen_random_uuid(),
  created_at            timestamptz not null default now(),

  -- Registrant
  name                  text not null,
  email                 text not null,
  phone                 text,

  -- What they signed up for
  registration_type     text not null default 'pass',  -- 'pass' | 'drop_in'
  drop_in_date          text,                           -- which Monday, null for pass
  experience            text,                           -- optional self-reported level

  -- Pricing
  amount_due            numeric(10,2) not null default 0,
  promo_code            text,
  promo_label           text,
  discount_amount       numeric(10,2) not null default 0,

  -- Payment outcome
  payment_received      boolean not null default false,
  amount_paid           numeric(10,2),
  paypal_order_id       text,
  payment_received_at   timestamptz,

  notes                 text
);

-- RLS: anonymous sign-ups need INSERT, and the payment step needs UPDATE on the
-- row it just created. Reads stay locked down (admin work happens in Supabase
-- Studio via the service role).
alter table public.adult_series_registrations enable row level security;

drop policy if exists "adult_series_reg_anon_insert" on public.adult_series_registrations;
create policy "adult_series_reg_anon_insert"
  on public.adult_series_registrations
  for insert
  to anon
  with check (true);

drop policy if exists "adult_series_reg_anon_update_payment" on public.adult_series_registrations;
create policy "adult_series_reg_anon_update_payment"
  on public.adult_series_registrations
  for update
  to anon
  using (true)
  with check (true);

create index if not exists adult_series_registrations_created_idx
  on public.adult_series_registrations (created_at desc);
