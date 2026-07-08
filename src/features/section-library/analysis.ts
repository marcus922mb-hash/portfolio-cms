import { aiRouter, type AIProvider } from "@/lib/ai/router";
import { scanSectionCode } from "@/features/section-library/security";
import type { SectionAnalysis, SectionRecord } from "@/features/section-library/types";
import { tailwindToCss, htmlToReactSection, reactToSectionBuilder, cssToTailwind } from "@/features/section-library/converters";

function heuristicAnalysis(section: Partial<SectionRecord> & { componentCode: string; dependencies?: string[] }): SectionAnalysis {
  const code = `${section.componentCode}\n${section.styleCode ?? ""}`;
  const safe = scanSectionCode(code, section.dependencies ?? []);
  const title = section.name ?? "Sekcja";
  const tags = (section.tags ?? []).join(" ");
  const sectionType =
    tags.includes("navbar") ? "navbar" :
    tags.includes("hero") ? "hero" :
    tags.includes("pricing") ? "pricing" :
    tags.includes("faq") ? "faq" :
    tags.includes("contact") ? "contact" :
    tags.includes("footer") ? "footer" :
    tags.includes("ecommerce") ? "ecommerce" :
    "content";

  return {
    summary: `${title} wygląda jak ${sectionType}.`,
    sectionType,
    industryMatches: section.industryTags ?? [],
    responsive: section.responsive !== false,
    elements: [
      ...(section.tags ?? []).slice(0, 5),
      ...(section.dependencies ?? []).slice(0, 5),
    ],
    dependencies: section.dependencies ?? [],
    security: {
      safe: safe.safe,
      notes: safe.findings.map((finding) => finding.message),
    },
    builderReady: safe.safe && Boolean(section.componentCode),
    simplifySuggested: safe.riskScore > 20 || code.length > 15000,
    transformNotes: [
      safe.safe ? "Można użyć w builderze." : "Wymaga sandboxa i ręcznego sprawdzenia.",
      section.requiresJavaScript ? "Kod wymaga JavaScript." : "Możliwy eksport bez JS.",
    ],
  };
}

export async function analyzeSectionCode(input: {
  name?: string;
  categoryName?: string;
  code: string;
  styleCode?: string;
  dependencies?: string[];
  technology?: string;
  useAi?: boolean;
}): Promise<{ analysis: SectionAnalysis; provider?: AIProvider; rawText?: string }> {
  const mergedCode = [input.code, input.styleCode ?? ""].filter(Boolean).join("\n\n");
  const heuristics = heuristicAnalysis({
    name: input.name,
    categoryName: input.categoryName,
    componentCode: mergedCode,
    dependencies: input.dependencies,
    tags: [],
    industryTags: [],
    responsive: true,
  });

  if (!input.useAi) {
    return { analysis: heuristics };
  }

  try {
    const result = await aiRouter.generate({
      task: "content_generation",
      responseFormat: "json",
      temperature: 0.2,
      maxTokens: 1800,
      messages: [
        {
          role: "system",
          content:
            "Jesteś ekspertem od bibliotek sekcji stron. Odpowiadasz wyłącznie poprawnym JSON-em w języku polskim. Analizujesz sekcję, bezpieczeństwo, responsywność i przydatność w builderze.",
        },
        {
          role: "user",
          content: JSON.stringify({
            name: input.name,
            categoryName: input.categoryName,
            technology: input.technology,
            dependencies: input.dependencies ?? [],
            code: mergedCode.slice(0, 12000),
          }),
        },
      ],
    });

    const text = result.text.trim();
    const parsed = JSON.parse(text) as Partial<SectionAnalysis>;
    return {
      provider: result.provider,
      rawText: text,
      analysis: {
        summary: parsed.summary ?? heuristics.summary,
        sectionType: parsed.sectionType ?? heuristics.sectionType,
        industryMatches: Array.isArray(parsed.industryMatches) ? parsed.industryMatches : heuristics.industryMatches,
        responsive: parsed.responsive ?? heuristics.responsive,
        elements: Array.isArray(parsed.elements) ? parsed.elements : heuristics.elements,
        dependencies: Array.isArray(parsed.dependencies) ? parsed.dependencies : heuristics.dependencies,
        security: parsed.security ?? heuristics.security,
        builderReady: parsed.builderReady ?? heuristics.builderReady,
        simplifySuggested: parsed.simplifySuggested ?? heuristics.simplifySuggested,
        transformNotes: Array.isArray(parsed.transformNotes) ? parsed.transformNotes : heuristics.transformNotes,
      },
    };
  } catch {
    return { analysis: heuristics };
  }
}

export function localImproveSection(section: Partial<SectionRecord>) {
  const updated: Partial<SectionRecord> = { ...section };
  const text = `${section.name ?? ""} ${section.description ?? ""}`.trim();
  if (text && !/cta/i.test(text)) {
    updated.description = `${section.description ?? ""} Dodaj wyraźne CTA i krótsze sekcje na mobile.`.trim();
  }
  if (section.componentCode && !/framer-motion/i.test(section.componentCode)) {
    updated.componentCode = `${section.componentCode}\n\n// AI suggestion: add subtle Framer Motion entrance animation`;
  }
  return updated;
}

export function localGenerateSimilarSection(section: Partial<SectionRecord>) {
  const source = section.componentCode ?? "";
  return {
    ...section,
    name: `${section.name ?? "Sekcja"} - nowy wariant`,
    slug: `${section.slug ?? "sekcja"}-variant`,
    componentCode: source.replace(/(premium|luxury|modern|minimal)/gi, "custom"),
    styleCode: section.styleCode ?? "",
    aiAnalysis: section.aiAnalysis ?? null,
  } as Partial<SectionRecord>;
}

export function localConvertSection(
  input: { source: string; from: "html" | "react" | "tailwind" | "css"; to: "react" | "builder" | "css" | "tailwind" }
): { componentCode: string; styleCode: string; notes: string[] } {
  if (input.from === "html" && input.to === "react") {
    const result = htmlToReactSection(input.source);
    return { componentCode: result.componentCode, styleCode: result.styleCode, notes: result.notes };
  }
  if (input.from === "react" && input.to === "builder") {
    const result = reactToSectionBuilder(input.source);
    return { componentCode: result.componentCode, styleCode: result.styleCode, notes: result.notes };
  }
  if (input.from === "tailwind" && input.to === "css") {
    const result = tailwindToCss(input.source);
    return { componentCode: result.componentCode, styleCode: result.styleCode, notes: result.notes };
  }
  if (input.from === "css" && input.to === "tailwind") {
    const result = cssToTailwind(input.source);
    return { componentCode: result.componentCode, styleCode: result.styleCode, notes: result.notes };
  }
  return {
    componentCode: input.source,
    styleCode: "",
    notes: ["Brak specjalistycznej konwersji. Zachowano źródłowy kod."],
  };
}
