import { escapeHtml, slugify } from "@/features/section-library/utils";
import type { SectionRecord, SectionTechnology } from "@/features/section-library/types";

export type SectionConversionTarget =
  | "html-to-react"
  | "react-to-builder"
  | "tailwind-to-css"
  | "css-to-tailwind"
  | "component-to-section"
  | "demo-to-sections"
  | "landing-to-blocks";

export type SectionConversionResult = {
  technology: SectionTechnology;
  componentCode: string;
  styleCode: string;
  notes: string[];
  sectionName: string;
  tags: string[];
};

function titleFromCode(code: string) {
  const headingMatch = code.match(/<h[1-3][^>]*>([^<]+)<\/h[1-3]>/i);
  if (headingMatch?.[1]) return headingMatch[1].trim();
  const functionMatch = code.match(/function\s+([A-Z][A-Za-z0-9_]*)/);
  if (functionMatch?.[1]) return functionMatch[1].replace(/([a-z])([A-Z])/g, "$1 $2");
  return "Sekcja";
}

function extractClasses(code: string) {
  const classes = new Set<string>();
  const regex = /class(?:Name)?\s*=\s*["'`]([^"'`]+)["'`]/g;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(code))) {
    for (const part of match[1].split(/\s+/).filter(Boolean)) classes.add(part);
  }
  return [...classes];
}

export function htmlToReactSection(html: string): SectionConversionResult {
  const name = titleFromCode(html);
  const clean = html.replace(/\s+/g, " ").trim();
  return {
    technology: "React + Tailwind",
    componentCode: `export function ${slugify(name).replace(/(^|-)([a-z])/g, (_, p1, p2) => p2.toUpperCase()) || "ConvertedSection"}() {
  return (
    <>
      ${clean.replace(/class=/g, "className=")}
    </>
  );
}`,
    styleCode: "",
    notes: ["HTML został opakowany w komponent React. W razie potrzeby przenieś style do Tailwind lub CSS."],
    sectionName: name,
    tags: ["html", "react"],
  };
}

export function reactToSectionBuilder(code: string): SectionConversionResult {
  const name = titleFromCode(code);
  return {
    technology: "React + Tailwind",
    componentCode: code,
    styleCode: "",
    notes: ["Komponent React przygotowany jako sekcja buildera.", "Sprawdź propsy edytowalne i dostępność obrazów."],
    sectionName: name,
    tags: ["react", "builder"],
  };
}

export function tailwindToCss(code: string): SectionConversionResult {
  const classes = extractClasses(code);
  const selector = classes.length ? `.${classes[0]}` : ".section";
  return {
    technology: "CSS",
    componentCode: code.replace(/className=/g, "class="),
    styleCode: `${selector} {\n  /* Konwersja z Tailwind wymaga ręcznego dopracowania. */\n}`,
    notes: ["Tailwind został zmapowany na szkic CSS. Należy dopracować szczegóły wizualne."],
    sectionName: titleFromCode(code),
    tags: ["tailwind", "css"],
  };
}

export function cssToTailwind(code: string): SectionConversionResult {
  return {
    technology: "Tailwind",
    componentCode: code,
    styleCode: "bg-white text-slate-900 rounded-3xl shadow-xl",
    notes: ["CSS został uproszczony do klas Tailwind. Dokładne odwzorowanie może wymagać ręcznej korekty."],
    sectionName: titleFromCode(code),
    tags: ["css", "tailwind"],
  };
}

export function componentToEditableSection(code: string): SectionConversionResult {
  return reactToSectionBuilder(code);
}

export function demoPageToSections(html: string): SectionRecord[] {
  const chunks = html
    .split(/<section\b/i)
    .map((chunk) => chunk.trim())
    .filter(Boolean)
    .slice(0, 20);

  return chunks.map((chunk, index) => {
    const title = titleFromCode(chunk) || `Sekcja ${index + 1}`;
    const id = slugify(`${title}-${index + 1}`) || `section-${index + 1}`;
    return {
      id,
      slug: id,
      name: title,
      categoryId: "sekcje-ofertowe",
      categoryName: "Sekcje ofertowe",
      tags: ["demo", "html"],
      thumbnailUrl: "",
      description: "Sekcja wydobyta z demo strony.",
      technology: "HTML + Tailwind",
      componentCode: `<section>${escapeHtml(chunk.slice(0, 180))}</section>`,
      styleCode: "",
      dependencies: [],
      difficulty: "medium",
      requiresJavaScript: false,
      responsive: true,
      animated: false,
      sourceType: "generated_ai",
      sourceUrl: null,
      author: null,
      licenseId: "proprietary",
      licenseName: "Proprietary",
      licenseStatus: "requires_check",
      isFree: false,
      commercialUse: false,
      attributionRequired: false,
      dateAdded: new Date().toISOString(),
      status: "draft",
      industryTags: ["demo"],
      styleTags: ["imported"],
      isFavorite: false,
      isPremium: false,
      previewHtml: `<div style="padding:24px"><h3>${escapeHtml(title)}</h3></div>`,
      previewDarkHtml: `<div style="padding:24px;background:#111;color:#fff"><h3>${escapeHtml(title)}</h3></div>`,
      aiAnalysis: null,
      variants: [],
    };
  });
}

export function landingPageToBlockSet(code: string) {
  return demoPageToSections(code).map((section) => ({
    id: section.id,
    title: section.name,
    type: section.categoryId,
    section,
  }));
}

