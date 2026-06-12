-- 2026-06-11 — Internal /orders page: read access + fulfillment check-offs.
--
-- The Orders.jsx viewer reads recital_orders with the public anon key and
-- lets staff/volunteers check off which items have been handed out.
--
-- 1) anon was missing SELECT on recital_orders (PostgREST returned
--    "42501 permission denied for table recital_orders"), so reads failed.
-- 2) Adds a `fulfillment` jsonb column ({"tickets":true,"programs":true,
--    "shirts":true}) and lets anon UPDATE it so check-offs persist and are
--    shared across everyone viewing the page.
--
-- This mirrors the table-level posture the other form tables already have
-- from sql/2026-05-31_form_table_grants_rollback.sql. NOTE: this makes
-- recital_orders rows readable/updatable by anyone holding the public anon
-- key (it ships in the client bundle), gated only by the page passcode —
-- accepted tradeoff for now; the long-term fix is a server-side route using
-- the service-role key.
--
-- Idempotent. Run once in the Supabase SQL editor.

-- ── Fulfillment state column ─────────────────────────────────────────
ALTER TABLE public.recital_orders
  ADD COLUMN IF NOT EXISTS fulfillment jsonb NOT NULL DEFAULT '{}'::jsonb;

-- ── Grants ───────────────────────────────────────────────────────────
GRANT SELECT ON public.recital_orders TO anon;
GRANT UPDATE ON public.recital_orders TO anon;

-- ── RLS policies ─────────────────────────────────────────────────────
-- Permissive SELECT so reads (and UPDATE...RETURNING) return rows.
DROP POLICY IF EXISTS "anon select for returning" ON public.recital_orders;
CREATE POLICY "anon select for returning"
  ON public.recital_orders
  FOR SELECT
  TO anon
  USING (true);

-- Allow anon to update rows (used only to toggle the fulfillment column).
DROP POLICY IF EXISTS "anon update fulfillment" ON public.recital_orders;
CREATE POLICY "anon update fulfillment"
  ON public.recital_orders
  FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);
