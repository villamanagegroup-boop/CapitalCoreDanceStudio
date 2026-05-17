-- Add kids (4–11) ticket tier to recital_orders
-- Adult tickets stay at $25, new "kid" tier is $15, children 3 & under remain free.
-- Run once against the Supabase project.

ALTER TABLE public.recital_orders
  ADD COLUMN IF NOT EXISTS ticket_kid_qty integer NOT NULL DEFAULT 0;
