-- Adds dancer_name + dancer_age columns to contact_submissions so the
-- Contact form's "Register for a Free Trial" option can capture them.
-- Idempotent.

alter table public.contact_submissions
  add column if not exists dancer_name text,
  add column if not exists dancer_age  text;
