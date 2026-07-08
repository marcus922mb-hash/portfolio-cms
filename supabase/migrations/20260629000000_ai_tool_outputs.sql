-- AI Tool Outputs — results from the 20 public/admin AI tools
-- Separate from ai_generations (which tracks demo content generation)

CREATE TABLE IF NOT EXISTS public.ai_tool_outputs (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Tool identity
  tool_id      TEXT        NOT NULL,   -- e.g. "generator-nazwy-firmy"
  tool_name    TEXT        NOT NULL,   -- e.g. "Generator nazwy firmy"
  tool_category TEXT       NOT NULL DEFAULT 'content',

  -- Input / output
  input_values JSONB       NOT NULL DEFAULT '{}',
  output_text  TEXT        NOT NULL,

  -- AI metadata
  provider     TEXT        NOT NULL,
  model        TEXT        NOT NULL,

  -- Admin management
  label        TEXT,                   -- admin-assigned name for this result
  notes        TEXT,
  status       TEXT        NOT NULL DEFAULT 'new'
    CHECK (status IN ('new', 'saved', 'archived')),

  -- Associations
  client_id    UUID        REFERENCES public.clients(id) ON DELETE SET NULL,
  lead_id      TEXT        REFERENCES public.leads(id)   ON DELETE SET NULL
);

-- Industry templates
CREATE TABLE IF NOT EXISTS public.ai_templates (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  name         TEXT        NOT NULL,   -- e.g. "Fryzjer premium"
  industry     TEXT        NOT NULL,   -- e.g. "fryzjer"
  generation_mode TEXT     NOT NULL DEFAULT 'full'
    CHECK (generation_mode IN ('quick', 'full', 'premium', 'publish')),

  description  TEXT,
  preview_url  TEXT,
  thumbnail_url TEXT,

  -- Template data (pre-filled form values for demo generator)
  demo_defaults JSONB      NOT NULL DEFAULT '{}',
  -- Override prompts / extra instructions
  system_additions TEXT,

  is_active    BOOLEAN     NOT NULL DEFAULT true
);

-- Update demos table: add generation_mode + last_error
ALTER TABLE public.demos
  ADD COLUMN IF NOT EXISTS generation_mode TEXT NOT NULL DEFAULT 'full'
    CHECK (generation_mode IN ('quick', 'full', 'premium', 'publish')),
  ADD COLUMN IF NOT EXISTS template_id UUID REFERENCES public.ai_templates(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS last_ai_error TEXT,
  ADD COLUMN IF NOT EXISTS section_overrides JSONB NOT NULL DEFAULT '{}';

-- Indexes
CREATE INDEX IF NOT EXISTS idx_ai_tool_outputs_tool_id   ON public.ai_tool_outputs(tool_id);
CREATE INDEX IF NOT EXISTS idx_ai_tool_outputs_created_at ON public.ai_tool_outputs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ai_tool_outputs_client_id  ON public.ai_tool_outputs(client_id);
CREATE INDEX IF NOT EXISTS idx_ai_templates_industry      ON public.ai_templates(industry);

-- RLS
ALTER TABLE public.ai_tool_outputs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "auth_all" ON public.ai_tool_outputs;
CREATE POLICY "auth_all" ON public.ai_tool_outputs
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

ALTER TABLE public.ai_templates ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "auth_all" ON public.ai_templates;
CREATE POLICY "auth_all" ON public.ai_templates
  FOR ALL TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_read" ON public.ai_templates;
CREATE POLICY "anon_read" ON public.ai_templates
  FOR SELECT TO anon USING (is_active = true);

-- Seed industry templates
INSERT INTO public.ai_templates (name, industry, generation_mode, description, demo_defaults) VALUES
  ('Fryzjer', 'fryzjer', 'full', 'Salon fryzjerski — pełna strona z galerią i cennikiem',
    '{"businessType": "Salon fryzjerski", "primaryColor": "#c8a96e", "style": "elegant"}'),
  ('Kosmetyczka', 'kosmetyczka', 'full', 'Gabinet kosmetyczny — relaks i profesjonalizm',
    '{"businessType": "Gabinet kosmetyczny", "primaryColor": "#d4a5b5", "style": "minimal"}'),
  ('Mechanik', 'mechanik', 'full', 'Warsztat samochodowy — zaufanie i fachowość',
    '{"businessType": "Warsztat samochodowy", "primaryColor": "#2c4a7c", "style": "bold"}'),
  ('Hydraulik', 'hydraulik', 'full', 'Usługi hydrauliczne — lokalnie i szybko',
    '{"businessType": "Hydraulik", "primaryColor": "#1a5276", "style": "professional"}'),
  ('Elektryk', 'elektryk', 'full', 'Usługi elektryczne — bezpiecznie i solidnie',
    '{"businessType": "Elektryk", "primaryColor": "#f39c12", "style": "bold"}'),
  ('Restauracja', 'restauracja', 'full', 'Restauracja z menu i galerią dań',
    '{"businessType": "Restauracja", "primaryColor": "#922b21", "style": "warm"}'),
  ('Hotel', 'hotel', 'premium', 'Hotel z rezerwacjami i galerią pokoi',
    '{"businessType": "Hotel", "primaryColor": "#1a3a5c", "style": "luxury"}'),
  ('Fotograf', 'fotograf', 'premium', 'Portfolio fotografa — minimalizm i jakość',
    '{"businessType": "Fotograf", "primaryColor": "#2c2c2c", "style": "portfolio"}'),
  ('Prawnik', 'prawnik', 'full', 'Kancelaria prawna — zaufanie i profesjonalizm',
    '{"businessType": "Kancelaria prawna", "primaryColor": "#1c2833", "style": "corporate"}'),
  ('Biuro rachunkowe', 'rachunkowosc', 'full', 'Biuro rachunkowe — precyzja i bezpieczeństwo',
    '{"businessType": "Biuro rachunkowe", "primaryColor": "#154360", "style": "professional"}'),
  ('Trener personalny', 'fitness', 'full', 'Trener personalny — energia i motywacja',
    '{"businessType": "Trener personalny", "primaryColor": "#e74c3c", "style": "energetic"}'),
  ('Sklep internetowy', 'sklep', 'premium', 'E-commerce — produkty i konwersja',
    '{"businessType": "Sklep internetowy", "primaryColor": "#27ae60", "style": "ecommerce"}'),
  ('Rękodzieło', 'rekodzelo', 'full', 'Studio rękodzieła — autentyczność i pasja',
    '{"businessType": "Studio rękodzieła", "primaryColor": "#a04000", "style": "handcraft"}'),
  ('Jubiler', 'jubiler', 'premium', 'Pracownia jubilerska — luksus i precyzja',
    '{"businessType": "Jubiler", "primaryColor": "#c8a000", "style": "luxury"}'),
  ('Budowlaniec', 'budowlaniec', 'full', 'Firma budowlana — jakość i terminowość',
    '{"businessType": "Firma budowlana", "primaryColor": "#e67e22", "style": "bold"}'),
  ('Dentysta', 'dentysta', 'full', 'Gabinet stomatologiczny — zdrowie i uśmiech',
    '{"businessType": "Gabinet stomatologiczny", "primaryColor": "#2e86c1", "style": "medical"}'),
  ('Fizjoterapeuta', 'fizjoterapeuta', 'full', 'Gabinet fizjoterapii — rehabilitacja i zdrowie',
    '{"businessType": "Gabinet fizjoterapii", "primaryColor": "#1e8449", "style": "health"}'),
  ('Architekt', 'architekt', 'premium', 'Pracownia architektoniczna — portfolio i projekty',
    '{"businessType": "Pracownia architektoniczna", "primaryColor": "#1a1a1a", "style": "minimal"}'),
  ('Agencja marketingowa', 'agencja', 'premium', 'Agencja marketingowa — kreatywność i wyniki',
    '{"businessType": "Agencja marketingowa", "primaryColor": "#6c3483", "style": "creative"}'),
  ('Firma lokalna', 'lokalna', 'full', 'Lokalny biznes — sąsiedztwo i zaufanie',
    '{"businessType": "Firma lokalna", "primaryColor": "#1a5276", "style": "friendly"}')
ON CONFLICT DO NOTHING;
