-- Generator demo stron MA Atelier Studio
-- Uruchom w Supabase SQL Editor lub przez własny Supabase CLI.

ALTER TABLE public.demos
  ADD COLUMN IF NOT EXISTS estimate_id UUID REFERENCES public.estimates(id) ON DELETE SET NULL;

UPDATE public.demos
SET status = CASE status
  WHEN 'active' THEN 'generated'
  WHEN 'archived' THEN 'inactive'
  ELSE status
END
WHERE status IN ('active', 'archived');

ALTER TABLE public.demos
  DROP CONSTRAINT IF EXISTS demos_status_check;

ALTER TABLE public.demos
  ADD CONSTRAINT demos_status_check
  CHECK (status IN (
    'draft',
    'generated',
    'sent',
    'viewed',
    'accepted',
    'revision_requested',
    'rejected',
    'inactive',
    'expired'
  ));

CREATE INDEX IF NOT EXISTS idx_demos_estimate ON public.demos(estimate_id);

DROP POLICY IF EXISTS "anon_read_active" ON public.demos;
CREATE POLICY "anon_read_active" ON public.demos
  FOR SELECT TO anon
  USING (is_active = true AND status IN ('generated', 'sent', 'viewed', 'accepted'));

DROP POLICY IF EXISTS "anon_read_active" ON public.demo_sections;
CREATE POLICY "anon_read_active" ON public.demo_sections
  FOR SELECT TO anon
  USING (
    is_visible = true AND
    demo_id IN (
      SELECT id
      FROM public.demos
      WHERE is_active = true
        AND status IN ('generated', 'sent', 'viewed', 'accepted')
    )
  );
