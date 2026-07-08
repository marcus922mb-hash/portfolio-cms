"use server";

import type { Json } from "@/types/database";
import { createClient } from "@/lib/supabase/server";
import { getTemplateById } from "@/features/templates/catalog";
import { aiRouter } from "@/lib/ai/router";
import type { BuilderComponent } from "@/features/builder/types";

export type GenerateFromTemplateResult =
  | { success: true; demoId: string; builderPageId: string }
  | { success: false; error: string };

interface TemplateCopy {
  eyebrow: string;
  heroTitle: string;
  heroSubtitle: string;
  aboutTitle: string;
  aboutText: string;
  services: string[];
  ctaTitle: string;
}

function buildPrompt(template: { name: string; industry: string; group: string; copy: TemplateCopy }, input: {
  companyName: string;
  companyDescription: string;
  services: string;
  city: string;
  tone: string;
}): string {
  const isLinkInBio = template.group === "link-in-bio";
  const isOnePage = template.group === "one-page";

  const basePrompt = `Jesteś copywriterem tworzącym treści dla stron internetowych po polsku.

Klient: ${input.companyName || template.name}
Branża: ${template.industry}
Typ strony: ${isLinkInBio ? "Link in Bio (strona profilu z listą linków)" : isOnePage ? "One Page (prosta, minimalna strona lądowania)" : "Strona internetowa (pełna)"}
Miasto: ${input.city || "Polska"}
Opis firmy: ${input.companyDescription || "Firma oferująca profesjonalne usługi"}
Usługi: ${input.services || template.copy.services.join(", ")}
Ton: ${input.tone || "profesjonalny, ciepły"}

Wygeneruj copy dla tej strony. Zwróć TYLKO JSON bez markdown:

{
  "eyebrow": "krótkie hasło (2-4 słowa, duże litery)",
  "heroTitle": "główny tytuł hero (5-12 słów, mocny, konkretny)",
  "heroSubtitle": "podtytuł hero (15-25 słów, wyjaśnia ofertę)",
  "aboutTitle": "tytuł sekcji O nas (4-8 słów)",
  "aboutText": "tekst sekcji O nas (30-50 słów, ciepły i autentyczny)",
  "services": ["usługa 1", "usługa 2", "usługa 3"],
  "ctaTitle": "tytuł sekcji CTA (8-12 słów, motywujący do działania)",
  "companyName": "${input.companyName || template.name}"
}

Zasady:
- Pisz po polsku, naturalnie, bez sztuczności
- Dostosuj ton do branży (${template.industry})
- Usługi muszą być konkretne i pasować do firmy
- Dla Link in Bio: krótsze teksty, bardziej osobiste
- Nie używaj ogólników jak "najlepsza jakość"`;

  return basePrompt;
}

function applyGeneratedCopy(
  components: BuilderComponent[],
  copy: TemplateCopy & { companyName?: string },
  companyName: string
): BuilderComponent[] {
  return components.map((comp) => {
    const p = { ...comp.props };

    switch (comp.type) {
      case "navbar":
        p.logoText = copy.companyName || companyName;
        break;
      case "hero":
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
        p.items = copy.services.map((title, i) => ({
          ...(Array.isArray(p.items) ? (p.items as Record<string, unknown>[])[i] ?? {} : {}),
          title,
          description: `${title} — profesjonalnie i z zaangażowaniem.`,
        }));
        break;
      case "cta":
        p.title = copy.ctaTitle;
        break;
      case "footer":
        p.logoText = copy.companyName || companyName;
        p.copyright = `© 2026 ${copy.companyName || companyName}. Wszelkie prawa zastrzeżone.`;
        break;
      case "linkinbio":
        p.name = copy.companyName || companyName;
        p.bio = copy.aboutText;
        p.links = copy.services.map((label, i) => ({
          label,
          url: "#",
          icon: ["Globe", "Instagram", "ShoppingBag", "Mail", "Youtube", "Phone"][i] ?? "Link",
        }));
        break;
    }

    return { ...comp, props: p };
  });
}

export async function generateFromTemplateAction(
  templateId: string,
  input: {
    companyName: string;
    companyDescription: string;
    services: string;
    city: string;
    tone: string;
  }
): Promise<GenerateFromTemplateResult> {
  const template = getTemplateById(templateId);
  if (!template) return { success: false, error: "Nie znaleziono szablonu." };

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Sesja wygasła. Zaloguj się ponownie." };

  const userMeta = user.user_metadata ?? {};
  const preferredProvider = typeof userMeta.ai_preferred_provider === "string"
    ? userMeta.ai_preferred_provider as "openrouter" | "cloudflare"
    : "openrouter";
  const preferredModel = typeof userMeta.ai_preferred_model === "string" && userMeta.ai_preferred_model
    ? userMeta.ai_preferred_model
    : undefined;

  let generatedCopy: TemplateCopy & { companyName?: string } = { ...template.copy };

  try {
    const result = await aiRouter.generate({
      task: "content_generation",
      preferredProvider,
      preferredModel,
      messages: [
        { role: "system", content: "Jesteś copywriterem. Zwracasz TYLKO poprawny JSON bez markdown, komentarzy ani dodatkowego tekstu." },
        { role: "user", content: buildPrompt(template, input) },
      ],
      temperature: 0.7,
    });

    try {
      const parsed = JSON.parse(result.text.trim().replace(/^```(?:json)?|```$/g, "").trim());
      generatedCopy = { ...template.copy, ...parsed };
    } catch {
      // AI returned bad JSON — use template defaults
    }
  } catch {
    // AI failed — use template defaults
  }

  const companyName = input.companyName || generatedCopy.companyName || template.name;
  const customizedComponents = applyGeneratedCopy(template.components, generatedCopy, companyName);

  const uniquePart = crypto.randomUUID().slice(0, 8);
  const slug = `${template.id}-${uniquePart}`;

  const { data: demo, error: demoError } = await supabase
    .from("demos")
    .insert({
      slug,
      title: `${companyName} — szkic`,
      industry: template.industry,
      style: template.style,
      primary_color: template.colors.primary,
      secondary_color: template.colors.secondary,
      images: [],
      content: {
        sourceTemplateId: template.id,
        seo: { ...template.settings.seo, title: `${companyName} — ${template.industry}` },
        notFound: template.settings.notFound,
      },
      status: "draft",
      is_active: false,
    })
    .select("id")
    .single();

  if (demoError || !demo) {
    return { success: false, error: demoError?.message ?? "Nie udało się utworzyć szkicu." };
  }

  const { data: builderPage, error: builderError } = await supabase
    .from("builder_pages")
    .insert({
      demo_id: demo.id,
      name: companyName,
      components: customizedComponents as unknown as Json,
      settings: { ...template.settings, seo: { title: `${companyName} — ${template.industry}`, description: template.summary } } as unknown as Json,
    })
    .select("id")
    .single();

  if (builderError || !builderPage) {
    await supabase.from("demos").delete().eq("id", demo.id);
    return { success: false, error: builderError?.message ?? "Nie udało się zapisać strony." };
  }

  await supabase.from("activity_logs").insert({
    entity_type: "demo",
    entity_id: demo.id,
    action: "generated_from_template",
    description: `Wygenerowano z szablonu: ${template.name}`,
    metadata: { template_id: template.id, company_name: companyName, ai_used: true },
  });

  return { success: true, demoId: demo.id, builderPageId: builderPage.id };
}
