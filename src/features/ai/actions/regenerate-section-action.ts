"use server";

import { createClient } from "@/lib/supabase/server";
import { aiRouter } from "@/lib/ai/router";
import { revalidatePath } from "next/cache";
import type { Json } from "@/types/database";
import type { DemoContent } from "@/features/demos/types";

export type SectionKey =
  | "hero"
  | "about"
  | "services"
  | "features"
  | "process"
  | "testimonials"
  | "faq"
  | "contact"
  | "seo";

export const SECTION_LABELS: Record<SectionKey, string> = {
  hero: "Hero (nagłówek)",
  about: "O firmie",
  services: "Usługi",
  features: "Korzyści",
  process: "Proces współpracy",
  testimonials: "Opinie klientów",
  faq: "FAQ",
  contact: "Kontakt",
  seo: "SEO",
};

export type RegenerateSectionState =
  | { success: true; section: SectionKey }
  | { success: false; error: string };

function buildSectionPrompt(
  section: SectionKey,
  context: {
    companyName: string;
    industry: string;
    city: string;
    currentContent: Partial<DemoContent>;
  }
): string {
  const base = `Firma: ${context.companyName}, branża: ${context.industry}, miasto: ${context.city}.
Obecna treść całej strony:
${JSON.stringify(context.currentContent, null, 2)}

Wygeneruj TYLKO sekcję "${section}" jako obiekt JSON (bez kluczy nadrzędnych). `;

  const extras: Record<SectionKey, string> = {
    hero: `Zwróć: { "eyebrow": "", "title": "", "subtitle": "", "primaryCta": { "label": "", "href": "#kontakt" }, "secondaryCta": { "label": "", "href": "#uslugi" } }`,
    about: `Zwróć: { "eyebrow": "", "title": "", "content": "" }`,
    services: `Zwróć tablicę [ { "title": "", "description": "", "icon": "" } ] (3-5 usług)`,
    features: `Zwróć tablicę [ { "title": "", "description": "", "icon": "" } ] (3-6 korzyści)`,
    process: `Zwróć tablicę [ { "title": "", "description": "" } ] (3-5 kroków)`,
    testimonials: `Zwróć tablicę [ { "author": "", "role": "", "content": "" } ] (3 opinie)`,
    faq: `Zwróć tablicę [ { "question": "", "answer": "" } ] (5-7 pytań)`,
    contact: `Zwróć: { "title": "", "description": "", "cta": "" }`,
    seo: `Zwróć: { "title": "", "description": "", "keywords": ["", ""] }`,
  };

  return base + extras[section] + "\n\nOdpowiedz TYLKO surowym JSON, bez komentarzy.";
}

export async function regenerateSectionAction(
  demoId: string,
  section: SectionKey
): Promise<RegenerateSectionState> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Brak autoryzacji." };

  const { data: demoRaw } = await supabase
    .from("demos")
    .select("id, content, industry")
    .eq("id", demoId)
    .single();

  if (!demoRaw) return { success: false, error: "Nie znaleziono demo." };

  // Fetch client separately to avoid complex join typing
  const { data: demoWithClient } = await supabase
    .from("demos")
    .select("client_id")
    .eq("id", demoId)
    .single();

  let companyName = "Firma";
  let city = "Polska";
  if (demoWithClient?.client_id) {
    const { data: clientData } = await supabase
      .from("clients")
      .select("company_name, city")
      .eq("id", demoWithClient.client_id)
      .single();
    companyName = clientData?.company_name ?? "Firma";
    city = (clientData as { city?: string | null } | null)?.city ?? "Polska";
  }

  const demo = demoRaw;

  const prompt = buildSectionPrompt(section, {
    companyName,
    industry: demo.industry ?? "usługi",
    city,
    currentContent: (demo.content ?? {}) as Partial<DemoContent>,
  });

  let rawResult: string;
  try {
    const result = await aiRouter.generate({
      task: "content_generation",
      messages: [
        {
          role: "system",
          content: "Jesteś copywriterem tworzącym treści dla polskich firm. Odpowiadasz TYLKO surowym JSON — bez markdown, bez komentarzy.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.65,
      maxTokens: 1500,
    });
    rawResult = result.text;
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "Błąd AI." };
  }

  let parsed: unknown;
  try {
    const clean = rawResult.replace(/^```json\s*/i, "").replace(/```$/i, "").trim();
    parsed = JSON.parse(clean);
  } catch {
    return { success: false, error: "AI zwróciło nieprawidłowy JSON." };
  }

  // Merge new section into content JSON
  const existingContent = (demo.content ?? {}) as Record<string, unknown>;
  const updatedContent: Json = { ...existingContent, [section]: parsed } as Json;

  const { error: updateError } = await supabase
    .from("demos")
    .update({
      content: updatedContent,
      section_overrides: { [section]: parsed } as Json,
    })
    .eq("id", demoId);

  if (updateError) {
    return { success: false, error: updateError.message };
  }

  await supabase.from("activity_logs").insert({
    entity_type: "demo",
    entity_id: demoId,
    action: "section_regenerated",
    description: `Zregenerowano sekcję: ${SECTION_LABELS[section]}`,
  });

  revalidatePath(`/panel/demo/${demoId}`);
  return { success: true, section };
}
