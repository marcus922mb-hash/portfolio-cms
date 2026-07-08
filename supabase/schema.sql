-- ============================================================
-- MA Atelier Studio — Supabase Schema
-- Wklej ten SQL do Supabase SQL Editor i uruchom jednorazowo.
-- ============================================================

-- ── Tabele ──────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.clients (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at   TIMESTAMPTZ NOT NULL    DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL    DEFAULT NOW(),
  first_name   TEXT        NOT NULL,
  last_name    TEXT        NOT NULL,
  company_name TEXT,
  email        TEXT,
  phone        TEXT,
  industry     TEXT,
  city         TEXT,
  website_url  TEXT,
  social_links JSONB,
  notes        TEXT,
  status       TEXT        NOT NULL    DEFAULT 'new'
    CHECK (status IN ('new', 'contacted', 'qualified', 'demo_prepared', 'demo_sent', 'accepted', 'rejected', 'inactive'))
);

CREATE TABLE IF NOT EXISTS public.estimates (
  id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at       TIMESTAMPTZ NOT NULL    DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL    DEFAULT NOW(),
  client_id        UUID        REFERENCES public.clients(id) ON DELETE SET NULL,
  website_type     TEXT        NOT NULL,
  pages_count      INTEGER,
  needs_wordpress  BOOLEAN     NOT NULL    DEFAULT false,
  needs_woocommerce BOOLEAN    NOT NULL    DEFAULT false,
  needs_nextjs     BOOLEAN     NOT NULL    DEFAULT false,
  needs_seo        BOOLEAN     NOT NULL    DEFAULT false,
  needs_ai          BOOLEAN     NOT NULL    DEFAULT false,
  needs_copywriting BOOLEAN     NOT NULL    DEFAULT false,
  needs_branding    BOOLEAN     NOT NULL    DEFAULT false,
  needs_maintenance BOOLEAN     NOT NULL    DEFAULT false,
  base_price        NUMERIC(10, 2),
  final_price       NUMERIC(10, 2),
  status            TEXT        NOT NULL    DEFAULT 'draft'
    CHECK (status IN ('draft', 'prepared', 'sent', 'accepted', 'rejected', 'expired')),
  notes             TEXT
);

CREATE TABLE IF NOT EXISTS public.demos (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at      TIMESTAMPTZ NOT NULL    DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL    DEFAULT NOW(),
  client_id       UUID        REFERENCES public.clients(id) ON DELETE SET NULL,
  estimate_id     UUID        REFERENCES public.estimates(id) ON DELETE SET NULL,
  slug            TEXT        NOT NULL    UNIQUE,
  title           TEXT        NOT NULL,
  industry        TEXT,
  style           TEXT,
  primary_color   TEXT,
  secondary_color TEXT,
  logo_url        TEXT,
  images          JSONB,
  content         JSONB,
  status          TEXT        NOT NULL    DEFAULT 'draft'
    CHECK (status IN ('draft', 'generated', 'sent', 'viewed', 'accepted', 'revision_requested', 'rejected', 'inactive', 'expired')),
  is_active       BOOLEAN     NOT NULL    DEFAULT false,
  views_count     INTEGER     NOT NULL    DEFAULT 0,
  sent_at         TIMESTAMPTZ,
  first_viewed_at TIMESTAMPTZ,
  expires_at      TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS public.demo_sections (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at    TIMESTAMPTZ NOT NULL    DEFAULT NOW(),
  demo_id       UUID        NOT NULL    REFERENCES public.demos(id) ON DELETE CASCADE,
  section_type  TEXT        NOT NULL,
  section_order INTEGER     NOT NULL    DEFAULT 0,
  title         TEXT,
  subtitle      TEXT,
  content       JSONB,
  is_visible    BOOLEAN     NOT NULL    DEFAULT true
);

CREATE TABLE IF NOT EXISTS public.projects (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at  TIMESTAMPTZ NOT NULL    DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL    DEFAULT NOW(),
  client_id   UUID        REFERENCES public.clients(id) ON DELETE SET NULL,
  estimate_id UUID        REFERENCES public.estimates(id) ON DELETE SET NULL,
  demo_id     UUID        REFERENCES public.demos(id) ON DELETE SET NULL,
  name        TEXT        NOT NULL,
  status      TEXT        NOT NULL    DEFAULT 'discovery'
    CHECK (status IN ('discovery', 'design', 'build', 'review', 'launch', 'support', 'closed')),
  start_date  DATE,
  deadline    DATE,
  technology  TEXT,
  notes       TEXT
);

CREATE TABLE IF NOT EXISTS public.notes (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL    DEFAULT NOW(),
  client_id  UUID        REFERENCES public.clients(id)  ON DELETE CASCADE,
  project_id UUID        REFERENCES public.projects(id) ON DELETE CASCADE,
  demo_id    UUID        REFERENCES public.demos(id)    ON DELETE CASCADE,
  content    TEXT        NOT NULL,
  created_by UUID        REFERENCES auth.users(id)      ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS public.activity_logs (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at  TIMESTAMPTZ NOT NULL    DEFAULT NOW(),
  entity_type TEXT        NOT NULL,
  entity_id   UUID,
  action      TEXT        NOT NULL,
  description TEXT,
  metadata    JSONB
);

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

CREATE TABLE IF NOT EXISTS public.leads (
  id                 TEXT        PRIMARY KEY,
  created_at         TIMESTAMPTZ NOT NULL    DEFAULT NOW(),
  submitted_at       TIMESTAMPTZ NOT NULL,
  project_type       TEXT        NOT NULL,
  project_type_label TEXT        NOT NULL,
  name               TEXT,
  email              TEXT,
  phone              TEXT,
  min_price          INTEGER,
  max_price          INTEGER,
  timeline           TEXT,
  budget             TEXT,
  description        TEXT,
  form_data          JSONB       NOT NULL,
  estimate           JSONB       NOT NULL,
  status             TEXT        NOT NULL    DEFAULT 'new'
    CHECK (status IN ('new', 'contacted', 'qualified', 'converted', 'rejected', 'archived'))
);

CREATE TABLE IF NOT EXISTS public.email_logs (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL    DEFAULT NOW(),
  client_id  UUID        REFERENCES public.clients(id) ON DELETE SET NULL,
  demo_id    UUID        REFERENCES public.demos(id)   ON DELETE SET NULL,
  to_email   TEXT        NOT NULL,
  subject    TEXT        NOT NULL,
  body       TEXT,
  provider   TEXT        NOT NULL    DEFAULT 'resend',
  status     TEXT        NOT NULL    DEFAULT 'pending'
    CHECK (status IN ('pending', 'sent', 'failed')),
  error      TEXT
);

-- ── Triggery updated_at ──────────────────────────────────────

CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_clients_updated_at ON public.clients;
CREATE TRIGGER trg_clients_updated_at
  BEFORE UPDATE ON public.clients
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trg_estimates_updated_at ON public.estimates;
CREATE TRIGGER trg_estimates_updated_at
  BEFORE UPDATE ON public.estimates
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trg_demos_updated_at ON public.demos;
CREATE TRIGGER trg_demos_updated_at
  BEFORE UPDATE ON public.demos
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trg_projects_updated_at ON public.projects;
CREATE TRIGGER trg_projects_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ── Indeksy ──────────────────────────────────────────────────

CREATE INDEX IF NOT EXISTS idx_clients_email      ON public.clients(email);
CREATE INDEX IF NOT EXISTS idx_clients_status     ON public.clients(status);
CREATE INDEX IF NOT EXISTS idx_estimates_client   ON public.estimates(client_id);
CREATE INDEX IF NOT EXISTS idx_estimates_status   ON public.estimates(status);
CREATE INDEX IF NOT EXISTS idx_demos_slug         ON public.demos(slug);
CREATE INDEX IF NOT EXISTS idx_demos_client       ON public.demos(client_id);
CREATE INDEX IF NOT EXISTS idx_demos_estimate     ON public.demos(estimate_id);
CREATE INDEX IF NOT EXISTS idx_demo_sections_demo ON public.demo_sections(demo_id, section_order);
CREATE INDEX IF NOT EXISTS idx_projects_client    ON public.projects(client_id);
CREATE INDEX IF NOT EXISTS idx_activity_entity    ON public.activity_logs(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_ai_progress
  ON public.activity_logs(entity_id, created_at ASC)
  WHERE entity_type = 'demo' AND action = 'ai_generation_progress';
CREATE INDEX IF NOT EXISTS idx_email_logs_client  ON public.email_logs(client_id);
CREATE INDEX IF NOT EXISTS idx_leads_submitted_at ON public.leads(submitted_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_status       ON public.leads(status);

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

-- ── Row Level Security ────────────────────────────────────────
-- Reguła: dane klientów, projektów i wycen są prywatne.
-- Dostęp tylko dla zalogowanego użytkownika (authenticated role).
-- /demo/[slug] — publiczny odczyt tylko aktywnych demo (anon role).

ALTER TABLE public.clients       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.estimates     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.demos         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.demo_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notes         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_generations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_logs    ENABLE ROW LEVEL SECURITY;

-- Prywatne tabele — dostęp tylko dla authenticated
DROP POLICY IF EXISTS "auth_all" ON public.clients;
CREATE POLICY "auth_all" ON public.clients
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_all" ON public.estimates;
CREATE POLICY "auth_all" ON public.estimates
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_all" ON public.projects;
CREATE POLICY "auth_all" ON public.projects
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_all" ON public.notes;
CREATE POLICY "auth_all" ON public.notes
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_all" ON public.activity_logs;
CREATE POLICY "auth_all" ON public.activity_logs
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_all" ON public.ai_generations;
CREATE POLICY "auth_all" ON public.ai_generations
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_all" ON public.leads;
CREATE POLICY "auth_all" ON public.leads
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_all" ON public.email_logs;
CREATE POLICY "auth_all" ON public.email_logs
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- demos: admin może wszystko; publiczny może tylko odczytać aktywne
DROP POLICY IF EXISTS "auth_all" ON public.demos;
CREATE POLICY "auth_all" ON public.demos
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_read_active" ON public.demos;
CREATE POLICY "anon_read_active" ON public.demos
  FOR SELECT TO anon
  USING (is_active = true AND status IN ('generated', 'sent', 'viewed', 'accepted'));

-- demo_sections: admin może wszystko; publiczny widzi sekcje aktywnych demo
DROP POLICY IF EXISTS "auth_all" ON public.demo_sections;
CREATE POLICY "auth_all" ON public.demo_sections
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_read_active" ON public.demo_sections;
CREATE POLICY "anon_read_active" ON public.demo_sections
  FOR SELECT TO anon
  USING (
    is_visible = true AND
    demo_id IN (
      SELECT id FROM public.demos WHERE is_active = true AND status IN ('generated', 'sent', 'viewed', 'accepted')
    )
  );

-- ── WordPress Connections ────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.wordpress_connections (
  id                              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at                      TIMESTAMPTZ NOT NULL    DEFAULT NOW(),
  updated_at                      TIMESTAMPTZ NOT NULL    DEFAULT NOW(),
  client_id                       UUID        REFERENCES public.clients(id) ON DELETE SET NULL,
  name                            TEXT,
  site_url                        TEXT        NOT NULL,
  api_base_url                    TEXT,
  auth_type                       TEXT        NOT NULL    DEFAULT 'application_password'
    CHECK (auth_type IN ('application_password', 'none')),
  username                        TEXT,
  application_password_encrypted  TEXT,
  status                          TEXT        NOT NULL    DEFAULT 'draft'
    CHECK (status IN ('draft', 'connected', 'error', 'disabled')),
  last_sync_at                    TIMESTAMPTZ,
  notes                           TEXT
);

CREATE OR REPLACE FUNCTION update_wordpress_connections_updated_at()
  RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END; $$;

DROP TRIGGER IF EXISTS trg_wordpress_connections_updated_at ON public.wordpress_connections;
CREATE TRIGGER trg_wordpress_connections_updated_at
  BEFORE UPDATE ON public.wordpress_connections
  FOR EACH ROW EXECUTE FUNCTION update_wordpress_connections_updated_at();

ALTER TABLE public.wordpress_connections ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "auth_all" ON public.wordpress_connections;
CREATE POLICY "auth_all" ON public.wordpress_connections
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ── WooCommerce Connections ─────────────────────────────────

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

-- ── Builder Pages ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.builder_pages (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL    DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL    DEFAULT NOW(),
  demo_id    UUID        REFERENCES public.demos(id) ON DELETE CASCADE,
  name       TEXT        NOT NULL    DEFAULT 'Strona',
  components JSONB       NOT NULL    DEFAULT '[]'::jsonb,
  settings   JSONB       NOT NULL    DEFAULT '{}'::jsonb,
  CONSTRAINT builder_pages_demo_id_unique UNIQUE (demo_id)
);

DROP TRIGGER IF EXISTS trg_builder_pages_updated_at ON public.builder_pages;
CREATE TRIGGER trg_builder_pages_updated_at
  BEFORE UPDATE ON public.builder_pages
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX IF NOT EXISTS idx_builder_pages_demo_id ON public.builder_pages(demo_id);

ALTER TABLE public.builder_pages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated full access on builder_pages"
  ON public.builder_pages FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ============================================================
-- Aby dodać pierwszego administratora:
-- 1. Utwórz użytkownika w Supabase Dashboard → Authentication → Users
-- 2. Podaj e-mail i silne hasło
-- 3. Zaloguj się przez /login
-- ============================================================
