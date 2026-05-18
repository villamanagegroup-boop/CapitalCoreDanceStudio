-- Add payment choice + paid-in-full flag to camp_registrations
-- Lets parents pay either the $50/camper deposit OR the full camp balance
-- up front at registration. Run once against the Supabase project.

ALTER TABLE public.camp_registrations
  ADD COLUMN IF NOT EXISTS payment_choice text NOT NULL DEFAULT 'deposit',
  ADD COLUMN IF NOT EXISTS paid_in_full boolean NOT NULL DEFAULT false;

-- Constrain payment_choice to known values.
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
