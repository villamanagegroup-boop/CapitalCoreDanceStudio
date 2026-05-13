-- Summer Class Registrations table
-- Run this in the Supabase SQL editor BEFORE collecting live sign-ups.
-- Idempotent: safe to re-run.

create table if not exists public.summer_class_registrations (
  id                    uuid primary key default gen_random_uuid(),
  created_at            timestamptz not null default now(),

  -- Parent / guardian
  parent_name           text not null,
  email                 text not null,
  phone                 text,

  -- Legacy single-dancer columns (kept for backwards-compat; populated from
  -- the first dancer in multi-dancer registrations).
  dancer_name           text not null,
  dancer_age            text,
  dancer_gender         text,
  current_student       text,
  signup_type           text,
  class_selection       jsonb,
  drop_in_class         text,
  drop_in_week          text,
  summary_text          text,

  -- Multi-dancer payload — primary source of truth going forward.
  dancers               jsonb,
  dancer_count          int not null default 1,

  -- Pricing
  tuition_total         numeric(10,2) not null default 0,
  payment_choice        text not null default 'deposit',
  amount_due_today      numeric(10,2) not null default 0,

  -- Payment outcome
  payment_received      boolean not null default false,
  amount_paid           numeric(10,2),
  paypal_order_id       text,
  payment_received_at   timestamptz,

  additional_notes      text
);

-- If the table already exists from the earlier single-dancer version, add the
-- new multi-dancer columns. ALTER ... ADD IF NOT EXISTS is idempotent.
alter table public.summer_class_registrations
  add column if not exists dancers      jsonb,
  add column if not exists dancer_count int not null default 1;

-- Phone is optional on the form now — drop the NOT NULL if an older run set it.
alter table public.summer_class_registrations alter column phone drop not null;

-- Relax old NOT NULL / CHECK constraints so multi-dancer rows can use
-- aggregate signup_type = 'multi' and skip drop_in_class/week.
alter table public.summer_class_registrations
  drop constraint if exists summer_class_registrations_signup_type_check;

-- RLS: anonymous sign-ups need INSERT, and the payment step needs UPDATE on the
-- row it just created. Reads stay locked down (admin work happens in Supabase
-- Studio via the service role).
alter table public.summer_class_registrations enable row level security;

drop policy if exists "summer_classes_anon_insert" on public.summer_class_registrations;
create policy "summer_classes_anon_insert"
  on public.summer_class_registrations
  for insert
  to anon
  with check (true);

drop policy if exists "summer_classes_anon_update_payment" on public.summer_class_registrations;
create policy "summer_classes_anon_update_payment"
  on public.summer_class_registrations
  for update
  to anon
  using (true)
  with check (true);

create index if not exists summer_class_registrations_created_idx
  on public.summer_class_registrations (created_at desc);
