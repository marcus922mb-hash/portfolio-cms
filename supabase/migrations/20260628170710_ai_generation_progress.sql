-- Przyspiesza pobieranie zdarzeń postępu dla jednego demo.
CREATE INDEX IF NOT EXISTS idx_activity_logs_ai_progress
  ON public.activity_logs (entity_id, created_at ASC)
  WHERE entity_type = 'demo' AND action = 'ai_generation_progress';

-- Postgres Changes wymaga jawnego dodania tabeli do publikacji Realtime.
-- Blok jest idempotentny, ponieważ activity_logs może już należeć do publikacji.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime'
      AND schemaname = 'public'
      AND tablename = 'activity_logs'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.activity_logs;
  END IF;
END
$$;
