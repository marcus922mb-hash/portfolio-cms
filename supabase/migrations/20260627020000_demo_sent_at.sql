-- Demo email delivery timestamp for existing environments.

ALTER TABLE public.demos
  ADD COLUMN IF NOT EXISTS sent_at TIMESTAMPTZ;
