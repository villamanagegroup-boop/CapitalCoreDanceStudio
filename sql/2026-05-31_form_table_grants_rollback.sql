-- 2026-05-31 — Roll back Path A's column-level grants on form tables, plus
-- apply the two outstanding schema migrations that were missing in prod
-- (camp payment_choice and recital ticket_kid_qty).
--
-- Why this exists: Path A (2026-05-05) used column-level INSERT grants on the
-- form tables for security-lint reasons. PostgREST attaches `?columns=...` to
-- every insert, and validates anon's permission per column. As features added
-- new columns (e.g. dancer_name on contact_submissions, payment_choice on
-- camp_registrations) without matching grants, the entire request would 401
-- with `42501 permission denied for table <name>` — even though most columns
-- were grant-allowed. We also briefly tried a restrictive SELECT policy
-- (USING(false)) which blocked PostgREST's default INSERT...RETURNING and
-- caused "new row violates row-level security policy".
--
-- Net: revert to table-level INSERT/SELECT grants on the 5 form tables,
-- matching the 2026-05-06 hotfix posture for camp_registrations. RLS still
-- gates row visibility through policies; the table-level GRANT only enables
-- PostgREST's representation return.
--
-- This re-opens 5 Supabase security lints (anon-INSERT-with-WITH-CHECK-true)
-- that Path B will close permanently by moving writes server-side.
--
-- Idempotent.

-- ─────────────────────────────────────────────────────────────────────
-- 1. Drop any restrictive SELECT policies that block INSERT...RETURNING
-- ─────────────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "anon no read" ON public.contact_submissions;
DROP POLICY IF EXISTS "anon no read" ON public.birthday_bookings;
DROP POLICY IF EXISTS "anon no read" ON public.recital_orders;
DROP POLICY IF EXISTS "anon no read" ON public.recital_shirt_orders;
DROP POLICY IF EXISTS "anon no read" ON public.spirit_week_ideas;

-- ─────────────────────────────────────────────────────────────────────
-- 2. Add permissive SELECT policy so INSERT...RETURNING succeeds.
--    Matches the camp_registrations posture from the 2026-05-06 hotfix.
-- ─────────────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "anon select for returning" ON public.contact_submissions;
CREATE POLICY "anon select for returning" ON public.contact_submissions FOR SELECT TO anon USING (true);

DROP POLICY IF EXISTS "anon select for returning" ON public.birthday_bookings;
CREATE POLICY "anon select for returning" ON public.birthday_bookings FOR SELECT TO anon USING (true);

DROP POLICY IF EXISTS "anon select for returning" ON public.recital_orders;
CREATE POLICY "anon select for returning" ON public.recital_orders FOR SELECT TO anon USING (true);

DROP POLICY IF EXISTS "anon select for returning" ON public.recital_shirt_orders;
CREATE POLICY "anon select for returning" ON public.recital_shirt_orders FOR SELECT TO anon USING (true);

DROP POLICY IF EXISTS "anon select for returning" ON public.spirit_week_ideas;
CREATE POLICY "anon select for returning" ON public.spirit_week_ideas FOR SELECT TO anon USING (true);

-- ─────────────────────────────────────────────────────────────────────
-- 3. Replace column-level INSERT grants with table-level. Table-level
--    grants supersede column-level for permission checks, so any future
--    columns added to these tables stay write-allowed without needing
--    a follow-up grant migration.
-- ─────────────────────────────────────────────────────────────────────
GRANT INSERT ON public.contact_submissions        TO anon;
GRANT INSERT ON public.birthday_bookings          TO anon;
GRANT INSERT ON public.recital_orders             TO anon;
GRANT INSERT ON public.recital_shirt_orders       TO anon;
GRANT INSERT ON public.spirit_week_ideas          TO anon;
GRANT INSERT ON public.summer_class_registrations TO anon;
-- camp_registrations already has table-level INSERT from 2026-05-06 hotfix.

-- SELECT needed at table level so PostgREST's default RETURNING works,
-- and so .insert(...).select() chains (CampForm, SummerClassesForm) succeed.
GRANT SELECT ON public.contact_submissions        TO anon;
GRANT SELECT ON public.birthday_bookings          TO anon;
GRANT SELECT ON public.camp_registrations         TO anon;
GRANT SELECT ON public.recital_orders             TO anon;
GRANT SELECT ON public.recital_shirt_orders       TO anon;
GRANT SELECT ON public.spirit_week_ideas          TO anon;
GRANT SELECT ON public.summer_class_registrations TO anon;

-- UPDATE needed for the deposit-paid flows (BirthdayPayment.jsx, CampPayment.jsx).
GRANT UPDATE ON public.birthday_bookings  TO anon;
GRANT UPDATE ON public.camp_registrations TO anon;

-- ─────────────────────────────────────────────────────────────────────
-- 4. Missing column migrations that hadn't been applied in prod
--    (matching files in sql/ already exist; consolidated here so a
--    single run brings prod into shape).
-- ─────────────────────────────────────────────────────────────────────

-- 4a. camp_registrations.payment_choice (sql/camp_registrations_payment_choice.sql)
ALTER TABLE public.camp_registrations
  ADD COLUMN IF NOT EXISTS payment_choice text    NOT NULL DEFAULT 'deposit',
  ADD COLUMN IF NOT EXISTS paid_in_full   boolean NOT NULL DEFAULT false;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'camp_registrations_payment_choice_check'
  ) THEN
    ALTER TABLE public.camp_registrations
      ADD CONSTRAINT camp_registrations_payment_choice_check
      CHECK (payment_choice IN ('deposit', 'full'));
  END IF;
END $$;

-- 4b. recital_orders.ticket_kid_qty (sql/recital_orders_kid_ticket.sql)
ALTER TABLE public.recital_orders
  ADD COLUMN IF NOT EXISTS ticket_kid_qty integer NOT NULL DEFAULT 0;
