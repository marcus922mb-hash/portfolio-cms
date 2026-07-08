-- AI demo content generation logs for existing environments.
-- Fresh installs already include this table in supabase/schema.sql.

CREATE TABLE IF NOT EXISTS public.ai_generations (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL    DEFAULT NOW(),
  demo_id    UUID        REFERENCES public.demos(id) ON DELETE SET NULL,
  provider   TEXT        NOT NULL,
  model      TEXT        NOT NULL,
  prompt     TEXT        NOT NULL,
  response   TEXT,
  status     TEXT        NOT NULL    DEFAULT 'pending'
    CHECK (status IN ('pending', 'completed', 'error')),
  error      TEXT
);

CREATE INDEX IF NOT EXISTS idx_ai_generations_demo_id
  ON public.ai_generations(demo_id);

CREATE INDEX IF NOT EXISTS idx_ai_generations_created_at
  ON public.ai_generations(created_at DESC);

ALTER TABLE public.ai_generations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "auth_all" ON public.ai_generations;
CREATE POLICY "auth_all" ON public.ai_generations
  FOR ALL TO authenticated USING (true) WITH CHECK (true);
