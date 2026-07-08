CREATE TABLE IF NOT EXISTS public.woocommerce_connections (
  id                        UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at                TIMESTAMPTZ NOT NULL    DEFAULT NOW(),
  updated_at                TIMESTAMPTZ NOT NULL    DEFAULT NOW(),
  client_id                 UUID        REFERENCES public.clients(id) ON DELETE SET NULL,
  wordpress_connection_id   UUID,
  name                      TEXT        NOT NULL,
  store_url                 TEXT        NOT NULL,
  consumer_key_encrypted    TEXT,
  consumer_secret_encrypted TEXT,
  status                    TEXT        NOT NULL    DEFAULT 'draft'
    CHECK (status IN ('draft', 'connected', 'error', 'disabled')),
  last_sync_at              TIMESTAMPTZ,
  notes                     TEXT
);

DROP TRIGGER IF EXISTS trg_woocommerce_connections_updated_at ON public.woocommerce_connections;
CREATE TRIGGER trg_woocommerce_connections_updated_at
  BEFORE UPDATE ON public.woocommerce_connections
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE INDEX IF NOT EXISTS idx_woocommerce_connections_client_id
  ON public.woocommerce_connections(client_id);

CREATE INDEX IF NOT EXISTS idx_woocommerce_connections_status
  ON public.woocommerce_connections(status);

ALTER TABLE public.woocommerce_connections ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "auth_all" ON public.woocommerce_connections;
CREATE POLICY "auth_all" ON public.woocommerce_connections
  FOR ALL TO authenticated USING (true) WITH CHECK (true);
