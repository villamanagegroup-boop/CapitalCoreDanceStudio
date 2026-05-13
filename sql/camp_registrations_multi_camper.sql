-- Camp Registrations · multi-camper migration
-- Adds the `campers` JSONB and `camper_count` columns so a single registration
-- row can hold an array of campers (each with their own weeks, attendance, and
-- before/after care). Legacy single-camper columns are kept and continue to be
-- populated from the first camper for backwards-compatible admin queries.
--
-- Idempotent: safe to re-run.

alter table public.camp_registrations
  add column if not exists campers      jsonb,
  add column if not exists camper_count int not null default 1;

-- The existing camper_name NOT NULL constraint still applies — the form
-- populates it from the first camper, so multi-camper inserts continue to
-- satisfy it.
