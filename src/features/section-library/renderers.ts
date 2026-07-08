import type { SectionRecord } from "@/features/section-library/types";
import { escapeHtml } from "@/features/section-library/utils";

function titleOf(section: SectionRecord) {
  return escapeHtml(section.name);
}

export function sectionToHtml(section: SectionRecord) {
  return `<section id="${escapeHtml(section.slug)}" data-section="${escapeHtml(section.id)}">
  <div class="section-shell">
    <div class="section-shell__content">
      <p class="eyebrow">${escapeHtml(section.categoryName)}</p>
      <h2>${titleOf(section)}</h2>
      <p>${escapeHtml(section.description)}</p>
      <div class="section-shell__tags">${section.tags.slice(0, 6).map((tag) => `<span>${escapeHtml(tag)}</span>`).join("")}</div>
    </div>
  </div>
</section>`;
}

export function sectionsToHtmlDocument(
  sections: SectionRecord[],
  args: {
    title: string;
    description: string;
    slug: string;
  }
) {
  return `<!doctype html>
<html lang="pl">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(args.title)}</title>
  <meta name="description" content="${escapeHtml(args.description)}" />
  <style>
    html,body{margin:0;padding:0;font-family:Inter,Arial,sans-serif;background:#f6f3ef;color:#1a1a1a}
    .page{width:min(100%,1200px);margin:0 auto;padding:32px}
    .hero{padding:72px 0 36px}
    .hero h1{font-size:clamp(2.5rem,6vw,5rem);line-height:1.05;margin:0}
    .hero p{max-width:760px;font-size:1.05rem;line-height:1.7;opacity:.76}
    .section-shell{padding:28px 0;border-top:1px solid rgba(0,0,0,.08)}
    .section-shell__content{display:grid;grid-template-columns:1.1fr .9fr;gap:24px;align-items:start}
    .eyebrow{font-size:.75rem;letter-spacing:.3em;text-transform:uppercase;color:#9a6b2c;font-weight:700}
    .section-shell h2{font-size:2rem;line-height:1.1;margin:.4rem 0 0}
    .section-shell p{margin:1rem 0 0;opacity:.74;line-height:1.7}
    .section-shell__tags{display:flex;flex-wrap:wrap;gap:.5rem;margin-top:1rem}
    .section-shell__tags span{padding:.4rem .8rem;border-radius:999px;background:#fff;border:1px solid rgba(0,0,0,.08);font-size:.75rem}
    @media(max-width:820px){.section-shell__content{grid-template-columns:1fr}.hero{padding-top:42px}}
  </style>
</head>
<body>
  <main class="page">
    <header class="hero">
      <p class="eyebrow">AI Builder Demo</p>
      <h1>${escapeHtml(args.title)}</h1>
      <p>${escapeHtml(args.description)}</p>
    </header>
    ${sections.map((section) => sectionToHtml(section)).join("\n")}
  </main>
</body>
</html>`;
}

export function sectionsToReactPage(sections: SectionRecord[], args: { title: string; description: string; slug: string }) {
  const imports = `import type { Metadata } from "next";

export const metadata: Metadata = {
  title: ${JSON.stringify(args.title)},
  description: ${JSON.stringify(args.description)},
};`;
  const body = sections
    .map(
      (section) => `function Section_${section.slug.replace(/[^a-zA-Z0-9_]/g, "_")}() {
  return (
    <section id="${section.slug}" className="py-16 border-t border-stone-200">
      <div className="mx-auto grid max-w-6xl gap-8 px-6 lg:grid-cols-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-600">${escapeHtml(section.categoryName)}</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-stone-950">${escapeHtml(section.name)}</h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-stone-600">${escapeHtml(section.description)}</p>
        </div>
        <div className="rounded-3xl border border-stone-200 bg-stone-50 p-6 text-sm text-stone-600">
          ${section.tags.slice(0, 6).map((tag) => `<span className="mr-2 inline-flex rounded-full bg-white px-3 py-1 text-xs font-medium text-stone-700">${escapeHtml(tag)}</span>`).join("")}
        </div>
      </div>
    </section>
  );
}`
    )
    .join("\n\n");

  return `${imports}

${body}

export default function Page() {
  return (
    <main className="bg-[#f6f3ef] text-stone-950">
      <header className="mx-auto max-w-6xl px-6 py-20">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-600">AI Builder Demo</p>
        <h1 className="mt-4 max-w-4xl text-5xl font-semibold tracking-tight">${escapeHtml(args.title)}</h1>
        <p className="mt-6 max-w-3xl text-base leading-8 text-stone-600">${escapeHtml(args.description)}</p>
      </header>
      ${sections.map((section) => `<Section_${section.slug.replace(/[^a-zA-Z0-9_]/g, "_")} />`).join("\n      ")}
    </main>
  );
}`;
}

export function sectionsToJson(sections: SectionRecord[], args: { title: string; description: string; slug: string }) {
  return {
    title: args.title,
    description: args.description,
    slug: args.slug,
    sections: sections.map((section) => ({
      id: section.id,
      slug: section.slug,
      name: section.name,
      categoryId: section.categoryId,
      tags: section.tags,
      technology: section.technology,
      status: section.status,
      sourceType: section.sourceType,
      isPremium: section.isPremium,
      previewHtml: section.previewHtml,
      previewDarkHtml: section.previewDarkHtml,
      componentCode: section.componentCode,
      styleCode: section.styleCode,
      aiAnalysis: section.aiAnalysis,
    })),
  };
}

