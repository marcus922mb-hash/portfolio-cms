import {
  type GitHubRepositoryInput,
  type SectionImportResult,
  type SectionRecord,
  type SectionSource,
} from "@/features/section-library/types";
import { analyzeSectionCode } from "@/features/section-library/analysis";
import { dataUriSvg, escapeHtml, nowIso, slugify } from "@/features/section-library/utils";
import { scanSectionCode } from "@/features/section-library/security";

type GitHubRepoMetadata = {
  full_name: string;
  default_branch: string;
  license?: { spdx_id?: string | null; name?: string | null } | null;
  owner?: { login?: string | null } | null;
};

type GitHubTreeEntry = {
  path: string;
  type: string;
};

type PackageJson = {
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  peerDependencies?: Record<string, string>;
};

type PreviewTheme = {
  surface: string;
  surfaceSoft: string;
  border: string;
  text: string;
  accent: string;
  muted: string;
};

function parseRepositoryUrl(repositoryUrl: string) {
  const url = new URL(repositoryUrl);
  if (!/github\.com$/i.test(url.hostname)) {
    throw new Error("Link musi wskazywać na GitHub.");
  }
  const parts = url.pathname.replace(/\.git$/i, "").split("/").filter(Boolean);
  if (parts.length < 2) {
    throw new Error("Nie udało się odczytać owner/repo.");
  }
  return {
    owner: parts[0],
    repo: parts[1],
  };
}

async function fetchJson<T>(input: RequestInfo | URL, init?: RequestInit): Promise<T> {
  const response = await fetch(input, {
    ...init,
    headers: {
      "User-Agent": "Braided-Digital-Section-Scanner",
      Accept: "application/vnd.github+json",
      ...(init?.headers ?? {}),
    },
  });

  if (!response.ok) {
    throw new Error(`GitHub API zwróciło HTTP ${response.status}.`);
  }

  return (await response.json()) as T;
}

async function fetchText(url: string): Promise<string> {
  const response = await fetch(url, {
    headers: { "User-Agent": "Braided-Digital-Section-Scanner" },
  });
  if (!response.ok) throw new Error(`Nie udało się pobrać pliku ${url}.`);
  return response.text();
}

function buildThumbnail(title: string, accent = "#b68d5e", text = "#111") {
  return dataUriSvg(`
    <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800" viewBox="0 0 1200 800">
      <rect width="1200" height="800" rx="48" fill="#101010"/>
      <circle cx="970" cy="110" r="190" fill="${accent}" opacity=".35"/>
      <circle cx="980" cy="630" r="240" fill="${accent}" opacity=".16"/>
      <rect x="70" y="70" width="1060" height="660" rx="36" fill="rgba(255,255,255,.05)" stroke="rgba(255,255,255,.14)"/>
      <text x="110" y="170" fill="${text}" font-size="54" font-family="Arial, sans-serif" font-weight="700">${escapeHtml(title)}</text>
      <rect x="110" y="220" width="300" height="14" rx="7" fill="rgba(255,255,255,.5)"/>
      <rect x="110" y="290" width="520" height="18" rx="9" fill="rgba(255,255,255,.22)"/>
      <rect x="110" y="342" width="420" height="18" rx="9" fill="rgba(255,255,255,.14)"/>
      <rect x="110" y="500" width="280" height="74" rx="18" fill="${accent}"/>
    </svg>
  `);
}

function humanizePathSegment(value: string) {
  return value
    .replace(/\.[^.]+$/, "")
    .replace(/[_.-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function fileStem(path: string) {
  const parts = path.split("/");
  return parts[parts.length - 1] ?? path;
}

function inferSectionName(path: string, content: string, kind: string, sourceName?: string | null) {
  const exportNameMatch =
    content.match(/export\s+(?:default\s+)?function\s+([A-Z][A-Za-z0-9_]*)/) ??
    content.match(/export\s+const\s+([A-Z][A-Za-z0-9_]*)/) ??
    content.match(/function\s+([A-Z][A-Za-z0-9_]*)\s*\(/);

  const exported = exportNameMatch?.[1] ? humanizePathSegment(exportNameMatch[1]) : humanizePathSegment(fileStem(path));
  const sourcePrefix = sourceName ? humanizePathSegment(sourceName) : "";

  if (sourcePrefix && exported) {
    return `${sourcePrefix} - ${exported}`;
  }
  if (exported) {
    return exported;
  }
  return `${kind.replace(/(^|-)([a-z])/g, (_, p1, p2) => p2.toUpperCase())}`;
}

function previewTheme(kind: string, dark = false): PreviewTheme {
  const themes: Record<string, PreviewTheme> = dark
    ? {
        navbar: { surface: "#0f1012", surfaceSoft: "#17181c", border: "rgba(255,255,255,.12)", text: "#f7f5f2", accent: "#d6b06d", muted: "rgba(255,255,255,.72)" },
        hero: { surface: "#0b1220", surfaceSoft: "#111a2f", border: "rgba(255,255,255,.12)", text: "#f8fafc", accent: "#8fb1ff", muted: "rgba(248,250,252,.74)" },
        pricing: { surface: "#111111", surfaceSoft: "#181818", border: "rgba(255,255,255,.12)", text: "#f5efe2", accent: "#d6b06d", muted: "rgba(245,239,226,.72)" },
        faq: { surface: "#101114", surfaceSoft: "#17181d", border: "rgba(255,255,255,.1)", text: "#f5f5f5", accent: "#c9a86a", muted: "rgba(255,255,255,.74)" },
        footer: { surface: "#0e0e0f", surfaceSoft: "#161617", border: "rgba(255,255,255,.1)", text: "#f5f2ea", accent: "#c9a86a", muted: "rgba(245,242,234,.72)" },
        contact: { surface: "#111827", surfaceSoft: "#172033", border: "rgba(255,255,255,.12)", text: "#eff6ff", accent: "#7da7ff", muted: "rgba(239,246,255,.74)" },
        testimonials: { surface: "#120f13", surfaceSoft: "#1b1620", border: "rgba(255,255,255,.12)", text: "#faf5ff", accent: "#cf9fff", muted: "rgba(250,245,255,.74)" },
        gallery: { surface: "#0e1014", surfaceSoft: "#161a20", border: "rgba(255,255,255,.1)", text: "#f8fafc", accent: "#8fb1ff", muted: "rgba(248,250,252,.74)" },
        ecommerce: { surface: "#0f1410", surfaceSoft: "#161d17", border: "rgba(255,255,255,.12)", text: "#f4faf2", accent: "#8ec37a", muted: "rgba(244,250,242,.74)" },
        special: { surface: "#101014", surfaceSoft: "#171820", border: "rgba(255,255,255,.1)", text: "#f8fafc", accent: "#f59e0b", muted: "rgba(248,250,252,.74)" },
        section: { surface: "#111111", surfaceSoft: "#181818", border: "rgba(255,255,255,.12)", text: "#f5f2ea", accent: "#d6b06d", muted: "rgba(245,242,234,.72)" },
      }
    : {
        navbar: { surface: "#f6f0e7", surfaceSoft: "#ebe2d5", border: "rgba(25,17,12,.08)", text: "#1b1512", accent: "#b68d5e", muted: "#5d4e42" },
        hero: { surface: "#f4efe6", surfaceSoft: "#eae2d4", border: "rgba(25,17,12,.08)", text: "#1a1815", accent: "#b68d5e", muted: "#5f5244" },
        pricing: { surface: "#f4efe6", surfaceSoft: "#e8dfcf", border: "rgba(25,17,12,.08)", text: "#1c1714", accent: "#b68d5e", muted: "#614f40" },
        faq: { surface: "#f5f1ea", surfaceSoft: "#e8e0d4", border: "rgba(25,17,12,.08)", text: "#1b1714", accent: "#b68d5e", muted: "#5d5144" },
        footer: { surface: "#efe8dd", surfaceSoft: "#e3d9c8", border: "rgba(25,17,12,.08)", text: "#201812", accent: "#b68d5e", muted: "#5d5144" },
        contact: { surface: "#f4efe6", surfaceSoft: "#e8e0d6", border: "rgba(25,17,12,.08)", text: "#181512", accent: "#b68d5e", muted: "#615548" },
        testimonials: { surface: "#f7f3ed", surfaceSoft: "#ece3d5", border: "rgba(25,17,12,.08)", text: "#1a1714", accent: "#b68d5e", muted: "#5e5144" },
        gallery: { surface: "#f5f2ed", surfaceSoft: "#eae2d8", border: "rgba(25,17,12,.08)", text: "#1a1714", accent: "#b68d5e", muted: "#5e5144" },
        ecommerce: { surface: "#f3f2ec", surfaceSoft: "#e7e0d2", border: "rgba(25,17,12,.08)", text: "#161514", accent: "#6f9e6d", muted: "#5d5347" },
        special: { surface: "#f2efe8", surfaceSoft: "#e5ddce", border: "rgba(25,17,12,.08)", text: "#171614", accent: "#b68d5e", muted: "#5c5347" },
        section: { surface: "#f4efe6", surfaceSoft: "#e8e0d6", border: "rgba(25,17,12,.08)", text: "#181512", accent: "#b68d5e", muted: "#615548" },
      };

  return themes[kind] ?? themes.section;
}

function previewDocument(theme: PreviewTheme, kind: string, title: string, description: string, path: string, content: string, dark = false) {
  const excerpt = content
    .replace(/\s+/g, " ")
    .slice(0, 160)
    .trim();
  const cards = {
    navbar: `<header class="topbar"><strong>Logo</strong><nav><span>Oferta</span><span>O nas</span><span>Kontakt</span></nav><a class="button">CTA</a></header><section class="hero-split"><div><span class="eyebrow">Navigation</span><h1>${escapeHtml(title)}</h1><p>${escapeHtml(description)}</p></div><div class="visual"></div></section>`,
    hero: `<section class="hero-split"><div><span class="eyebrow">Hero section</span><h1>${escapeHtml(title)}</h1><p>${escapeHtml(description)}</p><div class="actions"><a class="button">Zobacz</a><a class="button button--ghost">Kontakt</a></div></div><div class="visual visual--hero"><div class="visual__card"></div></div></section>`,
    pricing: `<section class="pricing-grid">${["Basic", "Pro", "Enterprise"].map((plan, index) => `<article class="pricing-card ${index === 1 ? "pricing-card--featured" : ""}"><span>${plan}</span><strong>${index === 0 ? "149 zł" : index === 1 ? "299 zł" : "599 zł"}</strong><p>Realistyczny pakiet dla klienta.</p></article>`).join("")}</section>`,
    faq: `<section class="faq-list">${["Pytanie 1", "Pytanie 2", "Pytanie 3"].map((question, index) => `<article class="faq-item"><span>${String(index + 1).padStart(2, "0")}</span><div><strong>${question}</strong><p>Odpowiedź z treścią i kontekstem.</p></div></article>`).join("")}</section>`,
    footer: `<footer class="footer"><div><strong>${escapeHtml(title)}</strong><p>${escapeHtml(description)}</p></div><div class="cols">${["Oferta", "Firma", "Kontakt"].map((col) => `<div><span>${col}</span><a href="#">Link 1</a><a href="#">Link 2</a></div>`).join("")}</div></footer>`,
    contact: `<section class="contact-grid"><div class="form">${["Imię", "E-mail", "Wiadomość"].map((label) => `<label><span>${label}</span><div class="input"></div></label>`).join("")}<button class="button">Wyślij</button></div><aside class="aside"><div class="stat"><strong>24h</strong><span>Czas odpowiedzi</span></div><div class="stat"><strong>25+</strong><span>Branże</span></div></aside></section>`,
    testimonials: `<section class="testimonials-grid">${["Anna", "Marek", "Julia"].map((name) => `<article class="testimonial-card"><div class="avatar"></div><strong>${name}</strong><p>Realna opinia klienta o sekcji i jakości projektu.</p></article>`).join("")}</section>`,
    gallery: `<section class="gallery-grid">${Array.from({ length: 6 }, (_, index) => `<div class="tile tile--${(index % 3) + 1}"></div>`).join("")}</section>`,
    ecommerce: `<section class="product-grid">${["Produkt 01", "Produkt 02", "Produkt 03", "Produkt 04"].map((item) => `<article class="product-card"><div class="product-media"></div><strong>${item}</strong><span>149 zł</span></article>`).join("")}</section>`,
    process: `<section class="timeline">${["Brief", "Projekt", "Wdrożenie", "Publikacja"].map((step, index) => `<article><span>${String(index + 1).padStart(2, "0")}</span><div><strong>${step}</strong><p>Wyraźny etap procesu.</p></div></article>`).join("")}</section>`,
    cta: `<section class="cta-banner"><div><span class="eyebrow">Call to action</span><h2>${escapeHtml(title)}</h2><p>${escapeHtml(description)}</p></div><div class="actions"><a class="button">Start</a><a class="button button--ghost">Demo</a></div></section>`,
    default: `<section class="generic"><div><span class="eyebrow">${escapeHtml(kind)}</span><h1>${escapeHtml(title)}</h1><p>${escapeHtml(description)}</p></div><div class="code-sample"><code>${escapeHtml(excerpt || "Brak wycinka kodu.")}</code></div></section>`,
  } as Record<string, string>;

  const body = cards[kind] ?? cards.default;
  return `<!doctype html>
  <html lang="pl">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      :root { color-scheme: ${dark ? "dark" : "light"}; }
      html,body{margin:0;height:100%;font-family:Inter,Arial,sans-serif;background:${theme.surface};color:${theme.text};}
      body{padding:18px}
      .canvas{min-height:calc(100vh - 36px);padding:26px;border-radius:28px;background:linear-gradient(145deg, ${theme.surfaceSoft}, ${theme.surface});border:1px solid ${theme.border};box-shadow:0 24px 70px rgba(0,0,0,.18)}
      .eyebrow{display:inline-flex;align-items:center;gap:10px;font-size:11px;letter-spacing:.28em;text-transform:uppercase;color:${theme.accent};font-weight:800}
      h1,h2,strong{margin:0}
      h1{font-size:clamp(30px,4vw,48px);line-height:1.02}
      h2{font-size:clamp(24px,3vw,36px);line-height:1.05}
      p{margin:12px 0 0;font-size:15px;line-height:1.7;color:${theme.muted}}
      .button{display:inline-flex;align-items:center;justify-content:center;padding:12px 18px;border-radius:999px;background:${theme.accent};color:#fff;font-weight:700;text-decoration:none}
      .button--ghost{background:transparent;border:1px solid ${theme.border};color:${theme.text}}
      .topbar,.footer,.generic,.cta-banner{display:grid;gap:18px}
      .topbar,.cta-banner{grid-template-columns:1.2fr .8fr;align-items:center}
      .topbar{padding:16px 18px;border-radius:22px;background:rgba(255,255,255,.05);border:1px solid ${theme.border}}
      .topbar nav{display:flex;gap:14px;flex-wrap:wrap;color:${theme.muted}}
      .hero-split,.contact-grid,.pricing-grid,.testimonials-grid,.gallery-grid,.product-grid,.timeline,.faq-list{display:grid;gap:14px}
      .hero-split,.contact-grid,.cta-banner,.generic{grid-template-columns:repeat(2,minmax(0,1fr));align-items:center}
      .visual,.visual--hero,.product-media,.avatar,.tile,.code-sample,.faq-item,.testimonial-card,.pricing-card,.stat,.input{border-radius:22px;background:rgba(255,255,255,.05);border:1px solid ${theme.border}}
      .visual,.visual--hero,.product-media,.tile{min-height:180px}
      .visual__card{width:72%;height:72%;margin:14% auto;border-radius:24px;background:linear-gradient(145deg, rgba(255,255,255,.1), rgba(255,255,255,.03));border:1px solid ${theme.border}}
      .actions{display:flex;gap:12px;flex-wrap:wrap;margin-top:18px}
      .pricing-grid,.testimonials-grid,.gallery-grid,.product-grid{grid-template-columns:repeat(3,minmax(0,1fr))}
      .pricing-card,.testimonial-card,.faq-item,.stat{padding:18px;display:grid;gap:10px}
      .pricing-card--featured{outline:2px solid ${theme.accent}}
      .faq-item{grid-template-columns:56px 1fr;align-items:start}
      .faq-item span{color:${theme.accent};font-weight:800;letter-spacing:.2em;font-size:11px}
      .avatar{width:64px;height:64px;border-radius:999px}
      .footer .cols{display:grid;gap:12px;grid-template-columns:repeat(3,minmax(0,1fr))}
      .footer .cols div{display:grid;gap:8px;padding:14px;border-radius:18px;background:rgba(255,255,255,.04);border:1px solid ${theme.border}}
      .footer .cols span{font-size:11px;text-transform:uppercase;letter-spacing:.2em;color:${theme.accent}}
      .input{min-height:48px}
      .code-sample{padding:18px;font-size:12px;line-height:1.6;overflow:hidden}
      .tile--2{min-height:220px}.tile--3{min-height:260px}
      @media (max-width: 900px){
        body{padding:12px}
        .canvas{padding:18px}
        .topbar,.cta-banner,.hero-split,.contact-grid,.generic,.pricing-grid,.testimonials-grid,.gallery-grid,.product-grid,.footer .cols{grid-template-columns:1fr}
      }
    </style>
  </head>
  <body>
    <div class="canvas">
      <div class="eyebrow">${escapeHtml(kind)} · ${escapeHtml(fileStem(path))}</div>
      ${body}
    </div>
  </body>
  </html>`;
}

function detectSectionKind(path: string, content: string) {
  const haystack = `${path} ${content}`.toLowerCase();
  if (/navbar|nav-bar|navigation|header/.test(haystack)) return "navbar";
  if (/hero|masthead|banner/.test(haystack)) return "hero";
  if (/pricing|price|plans?/.test(haystack)) return "pricing";
  if (/faq|accordion|questions?/.test(haystack)) return "faq";
  if (/footer/.test(haystack)) return "footer";
  if (/contact|form|lead/.test(haystack)) return "contact";
  if (/testimonial|review|quote/.test(haystack)) return "testimonials";
  if (/gallery|portfolio|project|work/.test(haystack)) return "gallery";
  if (/product|products|shop|cart|checkout|collection/.test(haystack)) return "ecommerce";
  if (/process|steps|timeline/.test(haystack)) return "process";
  if (/services?/.test(haystack)) return "services";
  if (/feature/.test(haystack)) return "features";
  if (/benefit/.test(haystack)) return "benefits";
  if (/about/.test(haystack)) return "about";
  if (/team/.test(haystack)) return "team";
  if (/cta|call to action/.test(haystack)) return "cta";
  if (/newsletter/.test(haystack)) return "newsletter";
  if (/blog/.test(haystack)) return "blog";
  if (/sidebar/.test(haystack)) return "sidebar";
  if (/dashboard/.test(haystack)) return "dashboard";
  if (/comparison/.test(haystack)) return "comparison";
  if (/banner/.test(haystack)) return "banner";
  if (/card/.test(haystack)) return "card";
  if (/section/.test(haystack)) return "section";
  return "section";
}

function detectTechnology(path: string, content: string) {
  const lower = `${path} ${content}`.toLowerCase();
  if (lower.includes("next/link") || lower.includes("next/image") || lower.includes("use client")) {
    return "Next.js + Tailwind";
  }
  if (lower.includes("class=") && /tailwind|tw-|bg-|text-|grid|flex/.test(lower)) {
    return "HTML + Tailwind";
  }
  if (path.endsWith(".tsx") || path.endsWith(".jsx") || path.endsWith(".mdx")) {
    return "React + Tailwind";
  }
  if (path.endsWith(".css")) return "CSS";
  return path.endsWith(".html") ? "HTML" : "React";
}

function detectTags(kind: string, path: string, content: string) {
  const tags = new Set<string>([kind]);
  const lower = `${path} ${content}`.toLowerCase();
  if (lower.includes("framer-motion")) tags.add("framer-motion");
  if (lower.includes("lucide-react")) tags.add("lucide");
  if (lower.includes("tailwind")) tags.add("tailwind");
  if (lower.includes("dark")) tags.add("dark");
  if (lower.includes("glass")) tags.add("glass");
  if (lower.includes("gradient")) tags.add("gradient");
  if (lower.includes("responsive")) tags.add("responsive");
  return [...tags];
}

function splitDependencies(packageJson: PackageJson | null) {
  const dependencies = {
    ...(packageJson?.dependencies ?? {}),
    ...(packageJson?.peerDependencies ?? {}),
    ...(packageJson?.devDependencies ?? {}),
  };
  return Object.keys(dependencies);
}

function buildSectionRecord(args: {
  name: string;
  description: string;
  kind: string;
  technology: string;
  path: string;
  content: string;
  dependencies: string[];
  license: string;
  author: string | null;
  repoUrl: string;
}): SectionRecord {
  const slug = slugify(`${args.kind}-${args.name}`);
  const analysis = scanSectionCode(args.content, args.dependencies);
  const normalizedLicense = args.license.trim().toLowerCase();
  const isKnownLicense = /^(mit|apache-2\.0|bsd|isc|mpl|lgpl|gpl)/i.test(normalizedLicense);
  const ecommerceKinds = new Set(["ecommerce", "product", "cart", "checkout", "collection", "dashboard"]);
  const offerKinds = new Set([
    "section",
    "services",
    "features",
    "benefits",
    "about",
    "team",
    "cta",
    "newsletter",
    "blog",
    "comparison",
    "banner",
    "card",
    "process",
    "contact",
    "testimonials",
    "pricing",
    "faq",
    "footer",
    "sidebar",
  ]);
  const categoryId =
    args.kind === "navbar" ? "menu-i-nawigacje" :
    args.kind === "hero" ? "sekcje-hero" :
    ecommerceKinds.has(args.kind) ? "sekcje-ecommerce" :
    offerKinds.has(args.kind) ? "sekcje-ofertowe" :
    "sekcje-ofertowe";
  const categoryName =
    categoryId === "menu-i-nawigacje" ? "Menu i nawigacje" :
    categoryId === "sekcje-hero" ? "Sekcje Hero" :
    categoryId === "sekcje-ecommerce" ? "Sekcje e-commerce" :
    "Sekcje ofertowe";
  return {
    id: `github-${slug}`,
    slug,
    name: args.name,
    categoryId,
    categoryName,
    tags: detectTags(args.kind, args.path, args.content),
    thumbnailUrl: buildThumbnail(args.name.slice(0, 18)),
    description: args.description,
    technology: args.technology as SectionRecord["technology"],
    componentCode: args.content,
    styleCode: "",
    dependencies: args.dependencies,
    difficulty: analysis.riskScore > 20 ? "hard" : "medium",
    requiresJavaScript: /use client|useEffect|window|document/.test(args.content),
    responsive: /@media|sm:|md:|lg:|grid|flex/.test(args.content) || analysis.safe,
    animated: /framer-motion|animate|motion\./i.test(args.content),
    sourceType: "github",
    sourceUrl: args.repoUrl,
    author: args.author,
    licenseId: normalizedLicense.includes("mit") ? "mit" : normalizedLicense.includes("apache") ? "apache-2.0" : "unknown",
    licenseName: args.license || "Wymaga sprawdzenia",
    licenseStatus: isKnownLicense ? "known" : "requires_check",
    isFree: isKnownLicense,
    commercialUse: isKnownLicense,
    attributionRequired: isKnownLicense && !normalizedLicense.includes("mit"),
    dateAdded: nowIso(),
    status: analysis.safe ? "active" : "draft",
    industryTags: [kindToIndustry(args.kind)],
    styleTags: detectTags(args.kind, args.path, args.content).filter((tag) => tag !== args.kind),
    isFavorite: false,
    isPremium: false,
    previewHtml: previewDocument(previewTheme(args.kind, false), args.kind, args.name, args.description, args.path, args.content, false),
    previewDarkHtml: previewDocument(previewTheme(args.kind, true), args.kind, args.name, args.description, args.path, args.content, true),
    aiAnalysis: null,
    variants: [],
  };
}

function kindToIndustry(kind: string) {
  if (kind === "ecommerce") return "ecommerce";
  if (kind === "hero") return "startup";
  if (kind === "pricing") return "saas";
  if (kind === "gallery") return "portfolio";
  if (kind === "services") return "services";
  if (kind === "features") return "saas";
  if (kind === "team") return "agency";
  if (kind === "contact") return "business";
  if (kind === "newsletter") return "blog";
  return "business";
}

function detectCandidateSections(tree: GitHubTreeEntry[]) {
  return tree.filter((entry) =>
    /\.(tsx|jsx|ts|js|mjs|cjs|mts|cts|html|mdx|css|scss|less|astro|vue|svelte|stories\.tsx|stories\.jsx)$/i.test(entry.path)
  );
}

export async function scanGitHubRepository(input: GitHubRepositoryInput): Promise<SectionImportResult> {
  const { owner, repo } = parseRepositoryUrl(input.repositoryUrl);
  const repoMeta = await fetchJson<GitHubRepoMetadata>(`https://api.github.com/repos/${owner}/${repo}`);
  const branch = repoMeta.default_branch || "main";
  const treeResponse = await fetchJson<{ tree: GitHubTreeEntry[] }>(
    `https://api.github.com/repos/${owner}/${repo}/git/trees/${encodeURIComponent(branch)}?recursive=1`
  );
  const files = detectCandidateSections(treeResponse.tree);
  const packageJsonEntry = treeResponse.tree.find((entry) => entry.path === "package.json");
  let packageDependencies: string[] = [];
  if (packageJsonEntry) {
    try {
      const pkg = await fetchText(`https://raw.githubusercontent.com/${owner}/${repo}/${branch}/package.json`);
      const parsed = JSON.parse(pkg) as PackageJson;
      packageDependencies = splitDependencies(parsed);
    } catch {
      packageDependencies = [];
    }
  }

  const warnings: string[] = [];
  const sections = await Promise.all(
    files.slice(0, 200).map(async (entry) => {
      const raw = await fetchText(`https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${entry.path}`);
      const kind = detectSectionKind(entry.path, raw);
      const technology = detectTechnology(entry.path, raw);
      const name = inferSectionName(entry.path, raw, kind, input.sourceName);
      const description = input.sourceDescription || `Sekcja wykryta w pliku ${entry.path}`;
      const dependencies = [
        ...packageDependencies,
        ...((raw.match(/from\s+["']([^"']+)["']/g) ?? []).map((line) => line.replace(/^from\s+["']|["']$/g, ""))),
      ].slice(0, 12);
      const section = buildSectionRecord({
        name,
        description,
        kind,
        technology,
        path: entry.path,
        content: raw.slice(0, 24000),
        dependencies,
        license: input.license ?? repoMeta.license?.spdx_id ?? repoMeta.license?.name ?? "Wymaga sprawdzenia",
        author: input.author ?? repoMeta.owner?.login ?? null,
        repoUrl: input.repositoryUrl,
      });

      const ai = await analyzeSectionCode({
        name: section.name,
        categoryName: section.categoryName,
        code: section.componentCode,
        styleCode: section.styleCode,
        dependencies: section.dependencies,
        technology: section.technology,
        useAi: true,
      });
      section.aiAnalysis = ai.analysis;
      if (!ai.analysis.security.safe) {
        section.status = "draft";
        warnings.push(`${entry.path}: wymaga sandboxa lub ręcznej weryfikacji.`);
      }
      return section;
    })
  );

  const uniqueSections = sections.filter((section, index, all) => all.findIndex((candidate) => candidate.slug === section.slug) === index);

  const variants = uniqueSections.flatMap((section) => section.variants ?? []);
  const source: SectionSource = {
    id: `${owner}-${repo}`,
    name: input.sourceName || `${owner}/${repo}`,
    description: input.sourceDescription || `Repozytorium GitHub ${owner}/${repo}`,
    githubUrl: input.repositoryUrl,
    technology: uniqueSections[0]?.technology ?? "React + Tailwind",
    license: input.license || repoMeta.license?.spdx_id || repoMeta.license?.name || "Wymaga sprawdzenia",
    author: input.author || repoMeta.owner?.login || null,
    lastSyncedAt: nowIso(),
    componentCount: files.length,
    sectionCount: uniqueSections.length,
    syncStatus: warnings.length ? "needs_review" : "synced",
    autoSync: input.autoSync ?? true,
    tags: [...new Set(uniqueSections.flatMap((section) => section.tags))].slice(0, 12),
    categories: ["menu-i-nawigacje", "sekcje-hero", "sekcje-ofertowe", "sekcje-ecommerce", "sekcje-specjalne"],
    thumbnailUrl: uniqueSections[0]?.thumbnailUrl ?? null,
  };

  return {
    source,
    sections: uniqueSections,
    variants,
    filesScanned: files.length,
    packageDependencies,
    warnings,
  };
}
