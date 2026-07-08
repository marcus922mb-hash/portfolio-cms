-- Section library and AI builder support tables

CREATE TABLE IF NOT EXISTS public.component_licenses (
  id                   TEXT        PRIMARY KEY,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  name                 TEXT        NOT NULL,
  is_free              BOOLEAN     NOT NULL DEFAULT true,
  commercial_use       BOOLEAN     NOT NULL DEFAULT true,
  attribution_required BOOLEAN     NOT NULL DEFAULT false,
  source_url           TEXT,
  author               TEXT,
  status               TEXT        NOT NULL DEFAULT 'known'
    CHECK (status IN ('known', 'requires_check'))
);

CREATE TABLE IF NOT EXISTS public.section_categories (
  id           TEXT        PRIMARY KEY,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  name         TEXT        NOT NULL,
  description  TEXT,
  tags         JSONB       NOT NULL DEFAULT '[]'::jsonb,
  sort_order   INTEGER     NOT NULL DEFAULT 0,
  is_active    BOOLEAN     NOT NULL DEFAULT true
);

CREATE TABLE IF NOT EXISTS public.section_tags (
  id           TEXT        PRIMARY KEY,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  name         TEXT        NOT NULL,
  slug         TEXT        NOT NULL UNIQUE,
  category_id  TEXT        REFERENCES public.section_categories(id) ON DELETE SET NULL,
  usage_count  INTEGER     NOT NULL DEFAULT 0,
  is_active    BOOLEAN     NOT NULL DEFAULT true
);

CREATE TABLE IF NOT EXISTS public.section_sources (
  id              TEXT        PRIMARY KEY,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  name            TEXT        NOT NULL,
  description     TEXT,
  github_url      TEXT        NOT NULL,
  technology      TEXT        NOT NULL,
  license         TEXT        NOT NULL,
  author          TEXT,
  last_synced_at  TIMESTAMPTZ,
  component_count INTEGER     NOT NULL DEFAULT 0,
  section_count   INTEGER     NOT NULL DEFAULT 0,
  sync_status     TEXT        NOT NULL DEFAULT 'idle'
    CHECK (sync_status IN ('idle', 'syncing', 'synced', 'error', 'needs_review')),
  auto_sync       BOOLEAN     NOT NULL DEFAULT true,
  tags            JSONB       NOT NULL DEFAULT '[]'::jsonb,
  categories      JSONB       NOT NULL DEFAULT '[]'::jsonb,
  thumbnail_url   TEXT
);

CREATE TABLE IF NOT EXISTS public.components (
  id                   TEXT        PRIMARY KEY,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  name                 TEXT        NOT NULL,
  slug                 TEXT        NOT NULL UNIQUE,
  category_id          TEXT        NOT NULL REFERENCES public.section_categories(id) ON DELETE RESTRICT,
  category_name        TEXT        NOT NULL,
  tags                 JSONB       NOT NULL DEFAULT '[]'::jsonb,
  thumbnail_url        TEXT,
  description          TEXT,
  technology           TEXT        NOT NULL,
  component_code       TEXT        NOT NULL,
  style_code           TEXT        NOT NULL,
  dependencies         JSONB       NOT NULL DEFAULT '[]'::jsonb,
  difficulty           TEXT        NOT NULL DEFAULT 'medium',
  requires_javascript   BOOLEAN     NOT NULL DEFAULT false,
  responsive           BOOLEAN     NOT NULL DEFAULT true,
  animated             BOOLEAN     NOT NULL DEFAULT false,
  source_type          TEXT        NOT NULL DEFAULT 'own',
  source_url           TEXT,
  author               TEXT,
  license_id           TEXT        NOT NULL REFERENCES public.component_licenses(id) ON DELETE RESTRICT,
  license_name         TEXT        NOT NULL,
  license_status       TEXT        NOT NULL DEFAULT 'known'
    CHECK (license_status IN ('known', 'requires_check')),
  is_free              BOOLEAN     NOT NULL DEFAULT true,
  commercial_use       BOOLEAN     NOT NULL DEFAULT true,
  attribution_required BOOLEAN     NOT NULL DEFAULT false,
  date_added           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  status               TEXT        NOT NULL DEFAULT 'active'
    CHECK (status IN ('active', 'draft', 'hidden')),
  industry_tags        JSONB       NOT NULL DEFAULT '[]'::jsonb,
  style_tags           JSONB       NOT NULL DEFAULT '[]'::jsonb,
  is_favorite          BOOLEAN     NOT NULL DEFAULT false,
  is_premium           BOOLEAN     NOT NULL DEFAULT false,
  preview_html         TEXT        NOT NULL,
  preview_dark_html    TEXT        NOT NULL,
  ai_analysis          JSONB
);

CREATE TABLE IF NOT EXISTS public.sections (
  id                   TEXT        PRIMARY KEY,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  name                 TEXT        NOT NULL,
  slug                 TEXT        NOT NULL UNIQUE,
  category_id          TEXT        NOT NULL REFERENCES public.section_categories(id) ON DELETE RESTRICT,
  category_name        TEXT        NOT NULL,
  tags                 JSONB       NOT NULL DEFAULT '[]'::jsonb,
  thumbnail_url        TEXT,
  description          TEXT,
  technology           TEXT        NOT NULL,
  component_code       TEXT        NOT NULL,
  style_code           TEXT        NOT NULL,
  dependencies         JSONB       NOT NULL DEFAULT '[]'::jsonb,
  difficulty           TEXT        NOT NULL DEFAULT 'medium',
  requires_javascript   BOOLEAN     NOT NULL DEFAULT false,
  responsive           BOOLEAN     NOT NULL DEFAULT true,
  animated             BOOLEAN     NOT NULL DEFAULT false,
  source_type          TEXT        NOT NULL DEFAULT 'own',
  source_url           TEXT,
  author               TEXT,
  license_id           TEXT        NOT NULL REFERENCES public.component_licenses(id) ON DELETE RESTRICT,
  license_name         TEXT        NOT NULL,
  license_status       TEXT        NOT NULL DEFAULT 'known'
    CHECK (license_status IN ('known', 'requires_check')),
  is_free              BOOLEAN     NOT NULL DEFAULT true,
  commercial_use       BOOLEAN     NOT NULL DEFAULT true,
  attribution_required BOOLEAN     NOT NULL DEFAULT false,
  date_added           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  status               TEXT        NOT NULL DEFAULT 'active'
    CHECK (status IN ('active', 'draft', 'hidden')),
  industry_tags        JSONB       NOT NULL DEFAULT '[]'::jsonb,
  style_tags           JSONB       NOT NULL DEFAULT '[]'::jsonb,
  is_favorite          BOOLEAN     NOT NULL DEFAULT false,
  is_premium           BOOLEAN     NOT NULL DEFAULT false,
  preview_html         TEXT        NOT NULL,
  preview_dark_html    TEXT        NOT NULL,
  ai_analysis          JSONB,
  variants             JSONB       NOT NULL DEFAULT '[]'::jsonb
);

CREATE TABLE IF NOT EXISTS public.section_variants (
  id            TEXT        PRIMARY KEY,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  section_id    TEXT        NOT NULL REFERENCES public.sections(id) ON DELETE CASCADE,
  name          TEXT        NOT NULL,
  variant_key   TEXT        NOT NULL,
  component_code TEXT       NOT NULL,
  style_code    TEXT        NOT NULL,
  thumbnail_url TEXT,
  notes         TEXT,
  is_default    BOOLEAN     NOT NULL DEFAULT false
);

CREATE TABLE IF NOT EXISTS public.page_templates (
  id              TEXT        PRIMARY KEY,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  slug            TEXT        NOT NULL UNIQUE,
  name            TEXT        NOT NULL,
  industry        TEXT        NOT NULL,
  style           TEXT        NOT NULL,
  description     TEXT,
  section_ids     JSONB       NOT NULL DEFAULT '[]'::jsonb,
  seo_title       TEXT        NOT NULL,
  seo_description TEXT        NOT NULL,
  thumbnail_url   TEXT,
  status          TEXT        NOT NULL DEFAULT 'active'
    CHECK (status IN ('active', 'draft', 'hidden')),
  is_premium      BOOLEAN     NOT NULL DEFAULT false
);

CREATE TABLE IF NOT EXISTS public.generated_pages (
  id              TEXT        PRIMARY KEY,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  title           TEXT        NOT NULL,
  slug            TEXT        NOT NULL UNIQUE,
  template_id     TEXT        REFERENCES public.page_templates(id) ON DELETE SET NULL,
  status          TEXT        NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft', 'demo', 'template', 'published', 'archived')),
  seo_title       TEXT        NOT NULL,
  seo_description TEXT        NOT NULL,
  section_ids     JSONB       NOT NULL DEFAULT '[]'::jsonb,
  published_at    TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS public.github_imports (
  id               TEXT        PRIMARY KEY,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  repository_url   TEXT        NOT NULL,
  source_name      TEXT,
  source_description TEXT,
  license          TEXT,
  author           TEXT,
  auto_sync        BOOLEAN     NOT NULL DEFAULT true,
  status           TEXT        NOT NULL DEFAULT 'idle'
    CHECK (status IN ('idle', 'syncing', 'synced', 'error', 'needs_review')),
  files_scanned    INTEGER     NOT NULL DEFAULT 0,
  component_count  INTEGER     NOT NULL DEFAULT 0,
  section_count    INTEGER     NOT NULL DEFAULT 0,
  warnings         JSONB       NOT NULL DEFAULT '[]'::jsonb,
  last_sync_at     TIMESTAMPTZ,
  last_error       TEXT
);

CREATE INDEX IF NOT EXISTS idx_components_category_id ON public.components(category_id);
CREATE INDEX IF NOT EXISTS idx_components_slug ON public.components(slug);
CREATE INDEX IF NOT EXISTS idx_sections_category_id ON public.sections(category_id);
CREATE INDEX IF NOT EXISTS idx_sections_slug ON public.sections(slug);
CREATE INDEX IF NOT EXISTS idx_sections_status ON public.sections(status);
CREATE INDEX IF NOT EXISTS idx_section_variants_section_id ON public.section_variants(section_id);
CREATE INDEX IF NOT EXISTS idx_page_templates_industry ON public.page_templates(industry);
CREATE INDEX IF NOT EXISTS idx_generated_pages_slug ON public.generated_pages(slug);
CREATE INDEX IF NOT EXISTS idx_github_imports_repo ON public.github_imports(repository_url);

DROP TRIGGER IF EXISTS trg_components_updated_at ON public.components;
CREATE TRIGGER trg_components_updated_at
  BEFORE UPDATE ON public.components
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trg_sections_updated_at ON public.sections;
CREATE TRIGGER trg_sections_updated_at
  BEFORE UPDATE ON public.sections
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trg_section_sources_updated_at ON public.section_sources;
CREATE TRIGGER trg_section_sources_updated_at
  BEFORE UPDATE ON public.section_sources
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trg_section_variants_updated_at ON public.section_variants;
CREATE TRIGGER trg_section_variants_updated_at
  BEFORE UPDATE ON public.section_variants
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trg_page_templates_updated_at ON public.page_templates;
CREATE TRIGGER trg_page_templates_updated_at
  BEFORE UPDATE ON public.page_templates
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trg_generated_pages_updated_at ON public.generated_pages;
CREATE TRIGGER trg_generated_pages_updated_at
  BEFORE UPDATE ON public.generated_pages
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trg_github_imports_updated_at ON public.github_imports;
CREATE TRIGGER trg_github_imports_updated_at
  BEFORE UPDATE ON public.github_imports
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

ALTER TABLE public.component_licenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.section_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.section_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.section_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.components ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.section_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.page_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.generated_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.github_imports ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "auth_all" ON public.component_licenses;
CREATE POLICY "auth_all" ON public.component_licenses
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_all" ON public.section_categories;
CREATE POLICY "auth_all" ON public.section_categories
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_all" ON public.section_tags;
CREATE POLICY "auth_all" ON public.section_tags
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_all" ON public.section_sources;
CREATE POLICY "auth_all" ON public.section_sources
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_all" ON public.components;
CREATE POLICY "auth_all" ON public.components
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_all" ON public.sections;
CREATE POLICY "auth_all" ON public.sections
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_all" ON public.section_variants;
CREATE POLICY "auth_all" ON public.section_variants
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_all" ON public.page_templates;
CREATE POLICY "auth_all" ON public.page_templates
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_all" ON public.generated_pages;
CREATE POLICY "auth_all" ON public.generated_pages
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_all" ON public.github_imports;
CREATE POLICY "auth_all" ON public.github_imports
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

INSERT INTO public.component_licenses (id, name, is_free, commercial_use, attribution_required, source_url, author, status)
VALUES
  ('proprietary', 'Proprietary', true, true, false, NULL, 'MA Atelier Studio', 'known'),
  ('mit', 'MIT', true, true, true, 'https://opensource.org/license/mit/', 'Community', 'known'),
  ('apache-2.0', 'Apache-2.0', true, true, true, 'https://www.apache.org/licenses/LICENSE-2.0', 'Community', 'known'),
  ('unknown', 'Wymaga sprawdzenia', false, false, false, NULL, NULL, 'requires_check')
ON CONFLICT DO NOTHING;

INSERT INTO public.section_categories (id, name, description, tags, sort_order) VALUES
  ('menu-i-nawigacje', 'Menu i nawigacje', 'Navbar, sticky menu, mobile menu i mega menu.', '["navbar","menu","navigation","sticky","cta"]'::jsonb, 10),
  ('sekcje-hero', 'Sekcje Hero', 'Hero dla usług, sklepów, portfolio i SaaS.', '["hero","landing","headline","cta","animated"]'::jsonb, 20),
  ('sekcje-ofertowe', 'Sekcje ofertowe', 'Usługi, pricing, FAQ, kontakt, opinie i footer.', '["services","pricing","faq","contact","footer"]'::jsonb, 30),
  ('sekcje-ecommerce', 'Sekcje e-commerce', 'Lista produktów, bestsellery, kolekcje i koszyk.', '["ecommerce","product","shop","cart","collection"]'::jsonb, 40),
  ('sekcje-specjalne', 'Sekcje specjalne', 'Glassmorphism, dark mode, timeline, before-after i inne.', '["animated","glass","gradient","dark","comparison"]'::jsonb, 50)
ON CONFLICT DO NOTHING;

INSERT INTO public.section_sources (id, name, description, github_url, technology, license, author, sync_status, auto_sync, tags, categories) VALUES
  ('flowbite-react', 'Flowbite React', 'React + Tailwind CSS komponenty dla sekcji, dashboardów i ecommerce.', 'https://github.com/themesberg/flowbite-react', 'React + Tailwind', 'MIT', 'Themesberg', 'idle', true, '["navbar","hero","pricing","footer","dashboard"]'::jsonb, '["menu-i-nawigacje","sekcje-hero","sekcje-ofertowe","sekcje-ecommerce"]'::jsonb),
  ('meraki-ui', 'Meraki UI', 'Czyste, eleganckie układy HTML + Tailwind.', 'https://merakiui.com/', 'HTML + Tailwind', 'MIT', 'Meraki UI', 'idle', true, '["hero","contact","pricing","faq","footer"]'::jsonb, '["sekcje-hero","sekcje-ofertowe"]'::jsonb),
  ('play-tailwind', 'Play Tailwind', 'Zestaw sekcji i landing pages budowanych w Tailwind.', 'https://play.tailwindcss.com/', 'Tailwind', 'MIT', 'Community', 'idle', true, '["landing","saas","startup","ecommerce"]'::jsonb, '["sekcje-hero","sekcje-ofertowe","sekcje-ecommerce"]'::jsonb),
  ('seamless-ui', 'Seamless UI', 'Komponenty HTML / React / Next.js do stron produktowych i portfolio.', 'https://github.com/', 'React + Tailwind', 'MIT', 'Community', 'idle', true, '["hero","pricing","contact","portfolio"]'::jsonb, '["sekcje-hero","sekcje-ofertowe"]'::jsonb),
  ('gravity-ui', 'Gravity UI Page Constructor', 'Komponenty konstruktora stron i dynamicznych layoutów.', 'https://github.com/', 'React', 'Apache-2.0', 'Gravity UI', 'idle', true, '["page-builder","templates","dynamic"]'::jsonb, '["sekcje-ofertowe","sekcje-specjalne"]'::jsonb),
  ('ui-layouts', 'UI Layouts', 'Układy hero, services, gallery, pricing i footer w różnych stylach.', 'https://github.com/', 'HTML / React / Tailwind', 'MIT', 'Community', 'idle', true, '["hero","services","gallery","faq","footer"]'::jsonb, '["menu-i-nawigacje","sekcje-hero","sekcje-ofertowe"]'::jsonb),
  ('tailgrids', 'TailGrids', 'Open-source React UI library z blokami i gotowymi templates do szybkiego składania stron.', 'https://github.com/tailgrids/tailgrids', 'React + Tailwind', 'MIT', 'TailGrids', 'idle', true, '["components","blocks","templates","navbar","hero","pricing","footer"]'::jsonb, '["menu-i-nawigacje","sekcje-hero","sekcje-ofertowe","sekcje-ecommerce"]'::jsonb),
  ('magic-ui', 'Magic UI', 'Animowane komponenty i efekty dla nowoczesnych sekcji, hero i landing pages.', 'https://github.com/magicuidesign/magicui', 'Next.js + Tailwind', 'MIT', 'Magic UI', 'idle', true, '["animated","framer-motion","hero","landing","effects"]'::jsonb, '["sekcje-hero","sekcje-specjalne","sekcje-ofertowe"]'::jsonb),
  ('shadcn-ui', 'shadcn/ui', 'Accessible components i wzorce, które dobrze mapują się na builder sections i elementy edytora.', 'https://github.com/shadcn-ui/ui', 'React + Tailwind', 'MIT', 'shadcn', 'idle', true, '["components","radix","accessible","ui","react"]'::jsonb, '["sekcje-ofertowe","sekcje-specjalne"]'::jsonb),
  ('daisyui', 'daisyUI', 'Popularna biblioteka komponentów Tailwind, dobra baza pod prostsze sekcje i layouty.', 'https://github.com/saadeghi/daisyui', 'Tailwind', 'MIT', 'daisyUI', 'idle', true, '["components","tailwind","ui-kit","buttons","cards"]'::jsonb, '["sekcje-ofertowe","sekcje-ecommerce","sekcje-specjalne"]'::jsonb),
  ('material-tailwind', 'Material Tailwind', 'Komponenty Tailwind + Material Design z sekcjami i layoutami do stron produktowych.', 'https://github.com/creativetimofficial/material-tailwind', 'React + Tailwind', 'MIT', 'Creative Tim', 'idle', true, '["components","material","cards","navbar","footer","forms"]'::jsonb, '["menu-i-nawigacje","sekcje-hero","sekcje-ofertowe"]'::jsonb),
  ('cruip-open-react-template', 'Cruip Open React Template', 'Gotowy landing page template z sekcjami dla SaaS, online services i produktów cyfrowych.', 'https://github.com/cruip/open-react-template', 'React + Tailwind', 'MIT', 'Cruip', 'idle', true, '["landing","saas","hero","pricing","faq","contact","footer"]'::jsonb, '["sekcje-hero","sekcje-ofertowe"]'::jsonb),
  ('preline', 'Preline UI', 'Rozbudowana biblioteka komponentów i sekcji dla stron biznesowych, SaaS i landing page.', 'https://github.com/htmlstreamofficial/preline', 'HTML + Tailwind', 'MIT', 'htmlstream', 'idle', true, '["navbar","hero","pricing","faq","footer","forms","dashboard"]'::jsonb, '["menu-i-nawigacje","sekcje-hero","sekcje-ofertowe","sekcje-ecommerce"]'::jsonb)
ON CONFLICT DO NOTHING;

INSERT INTO public.page_templates (id, slug, name, industry, style, description, section_ids, seo_title, seo_description, thumbnail_url, status, is_premium) VALUES
  ('service-business', 'firma-uslugowa', 'Szablon dla firmy usługowej', 'usługi', 'nowoczesny', 'Navbar, hero, usługi, proces, opinie, FAQ, kontakt i footer.', '["navbar","hero","services","process","testimonials","faq","contact","footer"]'::jsonb, 'Firma usługowa | Nowoczesna strona', 'Szablon strony usługowej z sekcjami pod konwersję i zaufanie.', NULL, 'active', false),
  ('shop-template', 'sklep-internetowy', 'Szablon dla sklepu', 'sklep internetowy', 'sklepowy', 'Navbar sklepowy, hero, kategorie, bestsellery, nowości i footer.', '["ecommerce"]'::jsonb, 'Sklep internetowy | Sekcje ecommerce', 'Pełny szablon sklepu z gotowymi sekcjami sprzedażowymi.', NULL, 'active', false),
  ('portfolio-template', 'portfolio', 'Szablon dla portfolio', 'portfolio', 'elegancki', 'Navbar, hero, o mnie, projekty, proces, opinie, kontakt i footer.', '["portfolio","gallery","testimonials","contact","footer"]'::jsonb, 'Portfolio | Kompletna strona', 'Szablon portfolio z sekcjami prezentującymi projekty i kontakt.', NULL, 'active', false),
  ('saas-template', 'saas', 'Szablon SaaS', 'SaaS', 'startupowy', 'Navbar SaaS, hero, funkcje, pricing, FAQ, kontakt i footer.', '["saas","features","pricing","faq","contact","footer"]'::jsonb, 'SaaS | Szablon landing page', 'Szablon SaaS nastawiony na prezentację funkcji i sprzedaż.', NULL, 'active', true)
ON CONFLICT DO NOTHING;
