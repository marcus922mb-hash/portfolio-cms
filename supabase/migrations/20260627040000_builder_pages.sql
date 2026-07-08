CREATE TABLE IF NOT EXISTS public.builder_pages (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  demo_id     UUID        NOT NULL UNIQUE REFERENCES public.demos(id) ON DELETE CASCADE,
  name        TEXT        NOT NULL,
  components  JSONB       NOT NULL DEFAULT '[]'::jsonb,
  settings    JSONB       NOT NULL DEFAULT '{}'::jsonb
);

CREATE INDEX IF NOT EXISTS idx_builder_pages_demo_id ON public.builder_pages(demo_id);

ALTER TABLE public.builder_pages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "authenticated_manage_builder_pages" ON public.builder_pages;
CREATE POLICY "authenticated_manage_builder_pages" ON public.builder_pages
  FOR ALL TO authenticated
  USING (true)
  WITH CHECK (true);

DROP TRIGGER IF EXISTS trg_builder_pages_updated_at ON public.builder_pages;
CREATE TRIGGER trg_builder_pages_updated_at
  BEFORE UPDATE ON public.builder_pages
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
