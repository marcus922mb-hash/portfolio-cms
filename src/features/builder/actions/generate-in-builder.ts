"use server";

import { aiRouter } from "@/lib/ai/router";
import { COMPONENT_DEFINITIONS } from "@/lib/builder/component-definitions";
import { nanoid } from "nanoid";
import type { BuilderComponent } from "@/features/builder/types";

// ── Preset definitions (same as builder-sidebar but server-side) ──
const PRESETS = [
  { id: "agencja",       label: "Agencja / Studio",          industry: "agencja",      components: ["navbar", "hero-split", "statistics", "services", "process", "portfolio", "testimonials", "cta", "contact", "footer"] },
  { id: "restauracja",   label: "Restauracja / Gastronomia",  industry: "restauracja",  components: ["navbar-centered", "hero-video", "about", "menu-section", "gallery", "reviews-grid", "reservation", "contact", "footer-minimal"] },
  { id: "salon",         label: "Salon / Beauty / SPA",       industry: "beauty",       components: ["navbar", "hero", "services", "pricing", "gallery", "testimonials", "reservation", "contact", "footer-minimal"] },
  { id: "lekarz",        label: "Lekarz / Klinika",           industry: "medycyna",     components: ["navbar", "hero-split", "about", "services", "team", "pricing", "faq", "reservation", "contact", "footer"] },
  { id: "portfolio",     label: "Portfolio / Freelancer",     industry: "kreatywny",    components: ["navbar-minimal", "hero-fullscreen", "about", "features", "portfolio", "testimonials", "contact", "footer-minimal"] },
  { id: "landing",       label: "Landing Page / Produkt",     industry: "SaaS/produkt", components: ["navbar-minimal", "hero", "features", "statistics", "testimonials", "pricing", "faq", "cta", "footer-minimal"] },
  { id: "sklep",         label: "Sklep online",               industry: "e-commerce",   components: ["navbar", "hero", "woo-products", "features", "testimonials", "newsletter", "footer"] },
  { id: "nieruchomosci", label: "Nieruchomości",              industry: "nieruchomości",components: ["navbar", "hero-split", "about", "services", "gallery", "statistics", "faq", "contact", "map", "footer"] },
  { id: "edukacja",      label: "Edukacja / Kursy",           industry: "edukacja",     components: ["navbar", "hero", "about", "features", "event", "pricing-toggle", "testimonials", "faq", "contact", "footer"] },
  { id: "linkinbio",     label: "Link in Bio",                industry: "social media", components: ["linkinbio"] },
] as const;

export type PresetId = (typeof PRESETS)[number]["id"];

export type GeneratorInput = {
  presetId: PresetId;
  companyName: string;
  description: string;
  services: string;
  city: string;
  tone: string;
};

type AICopy = {
  eyebrow: string;
  heroTitle: string;
  heroSubtitle: string;
  aboutTitle: string;
  aboutText: string;
  services: string[];
  ctaTitle: string;
  companyName: string;
};

function makeComponent(type: string): BuilderComponent | null {
  const def = COMPONENT_DEFINITIONS.find((d) => d.type === type);
  if (!def) return null;
  return {
    id: nanoid(),
    type: def.type,
    label: def.label,
    props: { ...def.defaultProps },
    styles: { ...def.defaultStyles },
    animations: { type: "none", duration: 400, delay: 0, easing: "ease-out" },
    visibility: { desktop: true, tablet: true, mobile: true },
    children: [],
  };
}

function applyCopy(components: BuilderComponent[], copy: AICopy): BuilderComponent[] {
  return components.map((comp) => {
    const p = { ...comp.props };
    switch (comp.type) {
      case "navbar":
      case "navbar-minimal":
      case "navbar-centered":
        p.logoText = copy.companyName;
        break;
      case "hero":
      case "hero-split":
      case "hero-fullscreen":
      case "hero-video":
        p.eyebrow = copy.eyebrow;
        p.badge = copy.eyebrow;
        p.title = copy.heroTitle;
        p.subtitle = copy.heroSubtitle;
        break;
      case "about":
        p.title = copy.aboutTitle;
        p.content = copy.aboutText;
        break;
      case "services":
      case "features":
      case "menu-section":
        p.items = copy.services.map((title, i) => ({
          ...(Array.isArray(p.items) ? (p.items as Record<string, unknown>[])[i] ?? {} : {}),
          title,
          description: `${title} — profesjonalnie i z pełnym zaangażowaniem.`,
        }));
        break;
      case "cta":
        p.title = copy.ctaTitle;
        p.subtitle = `Skontaktuj się z ${copy.companyName} już dziś.`;
        break;
      case "contact":
        p.title = `Kontakt — ${copy.companyName}`;
        break;
      case "footer":
      case "footer-minimal":
      case "footer-extended":
        p.logoText = copy.companyName;
        p.copyright = `© ${new Date().getFullYear()} ${copy.companyName}. Wszelkie prawa zastrzeżone.`;
        break;
      case "linkinbio":
        p.name = copy.companyName;
        p.bio = copy.aboutText;
        break;
    }
    return { ...comp, props: p };
  });
}

export async function generateInBuilderAction(
  input: GeneratorInput
): Promise<{ success: true; components: BuilderComponent[] } | { success: false; error: string }> {
  const preset = PRESETS.find((p) => p.id === input.presetId);
  if (!preset) return { success: false, error: "Nieznany szablon." };

  // Build components from preset
  const baseComponents = preset.components
    .map((type) => makeComponent(type))
    .filter((c): c is BuilderComponent => c !== null);

  // Default copy fallback (if AI fails)
  const fallbackCopy: AICopy = {
    eyebrow: preset.industry.toUpperCase(),
    heroTitle: `${input.companyName || preset.label} — profesjonalnie i z pasją`,
    heroSubtitle: input.description || `Zapraszamy do skorzystania z naszej oferty w branży ${preset.industry}.`,
    aboutTitle: `O firmie ${input.companyName || preset.label}`,
    aboutText: input.description || `Działamy w branży ${preset.industry} z pełnym zaangażowaniem. Nasz zespół zapewnia najwyższą jakość usług.`,
    services: input.services ? input.services.split(",").map((s) => s.trim()).filter(Boolean).slice(0, 6) : ["Usługa 1", "Usługa 2", "Usługa 3"],
    ctaTitle: `Zacznijmy współpracę z ${input.companyName || preset.label}`,
    companyName: input.companyName || preset.label,
  };

  // Try AI generation
  const prompt = `Jesteś copywriterem tworzącym treści dla polskich stron www.

Firma: ${input.companyName || preset.label}
Branża: ${preset.industry}
Opis: ${input.description || "Firma oferuje profesjonalne usługi"}
Usługi/oferta: ${input.services || "profesjonalne usługi"}
Miasto: ${input.city || "Polska"}
Ton: ${input.tone || "profesjonalny, ciepły, bezpośredni"}

Zwróć TYLKO JSON (bez markdown):
{
  "eyebrow": "krótkie hasło (2-4 słowa)",
  "heroTitle": "główny tytuł (6-10 słów, konkretny)",
  "heroSubtitle": "podtytuł (15-25 słów)",
  "aboutTitle": "tytuł sekcji O nas (4-7 słów)",
  "aboutText": "tekst O nas (30-50 słów, ciepły)",
  "services": ["usługa 1", "usługa 2", "usługa 3", "usługa 4"],
  "ctaTitle": "tytuł CTA (8-12 słów, motywujący)",
  "companyName": "${input.companyName || preset.label}"
}`;

  try {
    const result = await aiRouter.generate({
      task: "content_generation",
      messages: [
        { role: "system", content: "Zwracasz TYLKO poprawny JSON, bez markdown ani komentarzy." },
        { role: "user", content: prompt },
      ],
      temperature: 0.75,
      maxTokens: 800,
    });

    try {
      const cleaned = result.text.trim().replace(/^```(?:json)?|```$/gm, "").trim();
      const parsed = JSON.parse(cleaned) as Partial<AICopy>;
      const copy: AICopy = { ...fallbackCopy, ...parsed };
      return { success: true, components: applyCopy(baseComponents, copy) };
    } catch {
      return { success: true, components: applyCopy(baseComponents, fallbackCopy) };
    }
  } catch {
    return { success: true, components: applyCopy(baseComponents, fallbackCopy) };
  }
}

export { PRESETS };
