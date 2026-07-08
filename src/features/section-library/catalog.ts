import {
  SECTION_LIBRARY_CATEGORIES,
  type SectionCategory,
  type SectionDifficulty,
  type SectionLicense,
  type SectionPageTemplate,
  type SectionRecord,
  type SectionSource,
  type SectionTechnology,
} from "@/features/section-library/types";
import { dataUriSvg, escapeHtml, nowIso } from "@/features/section-library/utils";

type FamilyStyle = {
  key: string;
  name: string;
  accent: string;
  surface: string;
  text: string;
  tags: string[];
  license: string;
  technology: SectionTechnology;
  difficulty: SectionDifficulty;
  animated: boolean;
  requiresJavaScript: boolean;
  dependencies: string[];
  isPremium?: boolean;
};

type FamilyVariant = {
  key: string;
  name: string;
  description: string;
  title: string;
  subtitle: string;
  cta: string;
  tags: string[];
  industryTags: string[];
  styleTags: string[];
};

type FamilyDefinition = {
  categoryId: (typeof SECTION_LIBRARY_CATEGORIES)[number];
  categoryName: string;
  prefix: string;
  baseTags: string[];
  sourceUrl?: string;
  author?: string;
  variants: FamilyVariant[];
  styles: FamilyStyle[];
};

const LICENSES: SectionLicense[] = [
  { id: "proprietary", name: "Proprietary", isFree: true, commercialUse: true, attributionRequired: false, status: "known", author: "MA Atelier Studio" },
  { id: "mit", name: "MIT", isFree: true, commercialUse: true, attributionRequired: true, status: "known", author: "Community" },
  { id: "apache-2.0", name: "Apache-2.0", isFree: true, commercialUse: true, attributionRequired: true, status: "known", author: "Community" },
  { id: "unknown", name: "Wymaga sprawdzenia", isFree: false, commercialUse: false, attributionRequired: false, status: "requires_check" },
];

const SOURCES: SectionSource[] = [
  {
    id: "flowbite-react",
    name: "Flowbite React",
    description: "React + Tailwind CSS komponenty dla sekcji, dashboardów i ecommerce.",
    githubUrl: "https://github.com/themesberg/flowbite-react",
    technology: "React + Tailwind",
    license: "MIT",
    author: "Themesberg",
    lastSyncedAt: null,
    componentCount: 0,
    sectionCount: 0,
    syncStatus: "idle",
    autoSync: true,
    tags: ["navbar", "hero", "pricing", "footer", "dashboard"],
    categories: ["menu-i-nawigacje", "sekcje-hero", "sekcje-ofertowe", "sekcje-ecommerce"],
    thumbnailUrl: null,
  },
  {
    id: "meraki-ui",
    name: "Meraki UI",
    description: "Czyste, eleganckie układy HTML + Tailwind.",
    githubUrl: "https://merakiui.com/",
    technology: "HTML + Tailwind",
    license: "MIT",
    author: "Meraki UI",
    lastSyncedAt: null,
    componentCount: 0,
    sectionCount: 0,
    syncStatus: "idle",
    autoSync: true,
    tags: ["hero", "contact", "pricing", "faq", "footer"],
    categories: ["sekcje-hero", "sekcje-ofertowe"],
    thumbnailUrl: null,
  },
  {
    id: "play-tailwind",
    name: "Play Tailwind",
    description: "Zestaw sekcji i landing pages budowanych w Tailwind.",
    githubUrl: "https://play.tailwindcss.com/",
    technology: "Tailwind",
    license: "MIT",
    author: "Community",
    lastSyncedAt: null,
    componentCount: 0,
    sectionCount: 0,
    syncStatus: "idle",
    autoSync: true,
    tags: ["landing", "saas", "startup", "ecommerce"],
    categories: ["sekcje-hero", "sekcje-ofertowe", "sekcje-ecommerce"],
    thumbnailUrl: null,
  },
  {
    id: "seamless-ui",
    name: "Seamless UI",
    description: "Komponenty HTML / React / Next.js do stron produktowych i portfolio.",
    githubUrl: "https://github.com/",
    technology: "React + Tailwind",
    license: "MIT",
    author: "Community",
    lastSyncedAt: null,
    componentCount: 0,
    sectionCount: 0,
    syncStatus: "idle",
    autoSync: true,
    tags: ["hero", "pricing", "contact", "portfolio"],
    categories: ["sekcje-hero", "sekcje-ofertowe"],
    thumbnailUrl: null,
  },
  {
    id: "gravity-ui",
    name: "Gravity UI Page Constructor",
    description: "Komponenty konstruktora stron i dynamicznych layoutów.",
    githubUrl: "https://github.com/",
    technology: "React",
    license: "Apache-2.0",
    author: "Gravity UI",
    lastSyncedAt: null,
    componentCount: 0,
    sectionCount: 0,
    syncStatus: "idle",
    autoSync: true,
    tags: ["page-builder", "templates", "dynamic"],
    categories: ["sekcje-ofertowe", "sekcje-specjalne"],
    thumbnailUrl: null,
  },
  {
    id: "ui-layouts",
    name: "UI Layouts",
    description: "Układy hero, services, gallery, pricing i footer w różnych stylach.",
    githubUrl: "https://github.com/",
    technology: "HTML + React + Tailwind",
    license: "MIT",
    author: "Community",
    lastSyncedAt: null,
    componentCount: 0,
    sectionCount: 0,
    syncStatus: "idle",
    autoSync: true,
    tags: ["hero", "services", "gallery", "faq", "footer"],
    categories: ["menu-i-nawigacje", "sekcje-hero", "sekcje-ofertowe"],
    thumbnailUrl: null,
  },
  {
    id: "tailgrids",
    name: "TailGrids",
    description: "Open-source React UI library z blokami i gotowymi templates do szybkiego składania stron.",
    githubUrl: "https://github.com/tailgrids/tailgrids",
    technology: "React + Tailwind",
    license: "MIT",
    author: "TailGrids",
    lastSyncedAt: null,
    componentCount: 0,
    sectionCount: 0,
    syncStatus: "idle",
    autoSync: true,
    tags: ["components", "blocks", "templates", "navbar", "hero", "pricing", "footer"],
    categories: ["menu-i-nawigacje", "sekcje-hero", "sekcje-ofertowe", "sekcje-ecommerce"],
    thumbnailUrl: null,
  },
  {
    id: "magic-ui",
    name: "Magic UI",
    description: "Animowane komponenty i efekty dla nowoczesnych sekcji, hero i landing pages.",
    githubUrl: "https://github.com/magicuidesign/magicui",
    technology: "Next.js + Tailwind",
    license: "MIT",
    author: "Magic UI",
    lastSyncedAt: null,
    componentCount: 0,
    sectionCount: 0,
    syncStatus: "idle",
    autoSync: true,
    tags: ["animated", "framer-motion", "hero", "landing", "effects"],
    categories: ["sekcje-hero", "sekcje-specjalne", "sekcje-ofertowe"],
    thumbnailUrl: null,
  },
  {
    id: "shadcn-ui",
    name: "shadcn/ui",
    description: "Accessible components i wzorce, które dobrze mapują się na builder sections i elementy edytora.",
    githubUrl: "https://github.com/shadcn-ui/ui",
    technology: "React + Tailwind",
    license: "MIT",
    author: "shadcn",
    lastSyncedAt: null,
    componentCount: 0,
    sectionCount: 0,
    syncStatus: "idle",
    autoSync: true,
    tags: ["components", "radix", "accessible", "ui", "react"],
    categories: ["sekcje-ofertowe", "sekcje-specjalne"],
    thumbnailUrl: null,
  },
  {
    id: "daisyui",
    name: "daisyUI",
    description: "Popularna biblioteka komponentów Tailwind, dobra baza pod prostsze sekcje i layouty.",
    githubUrl: "https://github.com/saadeghi/daisyui",
    technology: "Tailwind",
    license: "MIT",
    author: "daisyUI",
    lastSyncedAt: null,
    componentCount: 0,
    sectionCount: 0,
    syncStatus: "idle",
    autoSync: true,
    tags: ["components", "tailwind", "ui-kit", "buttons", "cards"],
    categories: ["sekcje-ofertowe", "sekcje-ecommerce", "sekcje-specjalne"],
    thumbnailUrl: null,
  },
  {
    id: "material-tailwind",
    name: "Material Tailwind",
    description: "Komponenty Tailwind + Material Design z sekcjami i layoutami do stron produktowych.",
    githubUrl: "https://github.com/creativetimofficial/material-tailwind",
    technology: "React + Tailwind",
    license: "MIT",
    author: "Creative Tim",
    lastSyncedAt: null,
    componentCount: 0,
    sectionCount: 0,
    syncStatus: "idle",
    autoSync: true,
    tags: ["components", "material", "cards", "navbar", "footer", "forms"],
    categories: ["menu-i-nawigacje", "sekcje-hero", "sekcje-ofertowe"],
    thumbnailUrl: null,
  },
  {
    id: "cruip-open-react-template",
    name: "Cruip Open React Template",
    description: "Gotowy landing page template z sekcjami dla SaaS, online services i produktów cyfrowych.",
    githubUrl: "https://github.com/cruip/open-react-template",
    technology: "React + Tailwind",
    license: "MIT",
    author: "Cruip",
    lastSyncedAt: null,
    componentCount: 0,
    sectionCount: 0,
    syncStatus: "idle",
    autoSync: true,
    tags: ["landing", "saas", "hero", "pricing", "faq", "contact", "footer"],
    categories: ["sekcje-hero", "sekcje-ofertowe"],
    thumbnailUrl: null,
  },
  {
    id: "preline",
    name: "Preline UI",
    description: "Rozbudowana biblioteka komponentów i sekcji dla stron biznesowych, SaaS i landing page.",
    githubUrl: "https://github.com/htmlstreamofficial/preline",
    technology: "HTML + Tailwind",
    license: "MIT",
    author: "htmlstream",
    lastSyncedAt: null,
    componentCount: 0,
    sectionCount: 0,
    syncStatus: "idle",
    autoSync: true,
    tags: ["navbar", "hero", "pricing", "faq", "footer", "forms", "dashboard"],
    categories: ["menu-i-nawigacje", "sekcje-hero", "sekcje-ofertowe", "sekcje-ecommerce"],
    thumbnailUrl: null,
  },
];

const categories: SectionCategory[] = [
  {
    id: "menu-i-nawigacje",
    name: "Menu i nawigacje",
    description: "Klasyczne menu, sticky nav, mobile menu, mega menu i warianty SaaS / sklepowe.",
    tags: ["navbar", "menu", "navigation", "sticky", "cta"],
  },
  {
    id: "sekcje-hero",
    name: "Sekcje Hero",
    description: "Hero dla firm usługowych, sklepów, portfolio, SaaS, z formą, wideo i animacjami.",
    tags: ["hero", "landing", "headline", "cta", "animated"],
  },
  {
    id: "sekcje-ofertowe",
    name: "Sekcje ofertowe",
    description: "Usługi, pricing, FAQ, opinie, contact, gallery, footer, CTA i bloki specjalistyczne.",
    tags: ["services", "pricing", "faq", "contact", "footer"],
  },
  {
    id: "sekcje-ecommerce",
    name: "Sekcje e-commerce",
    description: "Produkty, kategorie, bestsellery, promocje, koszyk preview i kolekcje.",
    tags: ["ecommerce", "product", "shop", "cart", "collection"],
  },
  {
    id: "sekcje-specjalne",
    name: "Sekcje specjalne",
    description: "Glassmorphism, dark mode, animowane tła, timeline, before/after i duża typografia.",
    tags: ["animated", "glass", "gradient", "dark", "comparison"],
  },
];

function thumb(title: string, accent: string, surface: string, text: string) {
  return dataUriSvg(`
    <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800" viewBox="0 0 1200 800">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="${accent}" />
          <stop offset="100%" stop-color="${surface}" />
        </linearGradient>
      </defs>
      <rect width="1200" height="800" rx="48" fill="url(#g)"/>
      <rect x="70" y="70" width="1060" height="660" rx="34" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.18)"/>
      <text x="110" y="170" fill="${text}" font-size="54" font-weight="700" font-family="Arial, sans-serif">${escapeHtml(title)}</text>
      <rect x="110" y="214" width="280" height="14" rx="7" fill="rgba(255,255,255,0.55)"/>
      <rect x="110" y="260" width="460" height="18" rx="9" fill="rgba(255,255,255,0.28)"/>
      <rect x="110" y="304" width="540" height="18" rx="9" fill="rgba(255,255,255,0.18)"/>
      <rect x="110" y="430" width="310" height="72" rx="18" fill="${accent}" opacity="0.95"/>
      <rect x="110" y="530" width="750" height="140" rx="22" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.14)"/>
    </svg>
  `);
}

function buildReactSectionCode(name: string, title: string, subtitle: string, cta: string, style: FamilyStyle) {
  return `import { ArrowRight } from "lucide-react";

export function ${name}() {
  return (
    <section className="relative overflow-hidden bg-${style.key}-surface text-${style.key}-text">
      <div className="mx-auto grid min-h-[520px] max-w-6xl gap-8 px-6 py-20 lg:grid-cols-2 lg:items-center">
        <div>
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.35em] text-${style.key}-accent">Nowa sekcja</p>
          <h2 className="max-w-xl text-4xl font-semibold leading-tight lg:text-6xl">${escapeHtml(title)}</h2>
          <p className="mt-6 max-w-2xl text-base/8 opacity-80">${escapeHtml(subtitle)}</p>
          <a href="#kontakt" className="mt-8 inline-flex items-center gap-2 rounded-full bg-${style.key}-accent px-6 py-3 font-medium text-white">
            ${escapeHtml(cta)} <ArrowRight className="h-4 w-4" />
          </a>
        </div>
        <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-md">
          <div className="h-[320px] rounded-[1.5rem] bg-gradient-to-br from-white/20 to-white/5" />
        </div>
      </div>
    </section>
  );
}`;
}

function buildHtmlSectionCode(title: string, subtitle: string, cta: string, style: FamilyStyle) {
  return `<section class="section section--${style.key}">
  <div class="section__inner">
    <div class="section__copy">
      <p class="section__eyebrow">Nowa sekcja</p>
      <h2>${escapeHtml(title)}</h2>
      <p>${escapeHtml(subtitle)}</p>
      <a href="#kontakt" class="section__cta">${escapeHtml(cta)}</a>
    </div>
    <div class="section__visual"></div>
  </div>
</section>`;
}

function buildStyleCode(style: FamilyStyle, technology: SectionTechnology) {
  if (technology.includes("Tailwind")) {
    return `bg-${style.key}-surface text-${style.key}-text border-${style.key}-accent/20`;
  }
  return `
.section--${style.key} {
  background: ${style.surface};
  color: ${style.text};
}
.section--${style.key} .section__cta {
  background: ${style.accent};
}
`.trim();
}

function previewCard(title: string, text: string, accent: string) {
  return `<article class="card">
    <div class="card__accent" style="background:${accent}"></div>
    <strong>${escapeHtml(title)}</strong>
    <p>${escapeHtml(text)}</p>
  </article>`;
}

function previewMiniStat(label: string, value: string, accent: string) {
  return `<div class="stat">
    <span class="stat__value" style="color:${accent}">${escapeHtml(value)}</span>
    <span class="stat__label">${escapeHtml(label)}</span>
  </div>`;
}

function isDarkHexColor(value: string) {
  const hex = value.replace("#", "");
  if (hex.length !== 6) return false;
  const numeric = Number.parseInt(hex, 16);
  const red = (numeric >> 16) & 255;
  const green = (numeric >> 8) & 255;
  const blue = numeric & 255;
  return (0.299 * red + 0.587 * green + 0.114 * blue) < 140;
}

function buildPreviewHtml(sectionFamily: string, variantKey: string, title: string, subtitle: string, style: FamilyStyle) {
  const accent = style.accent;
  const isDarkSurface = isDarkHexColor(style.surface);
  const panelBg = isDarkSurface ? "rgba(255,255,255,.07)" : "rgba(0,0,0,.05)";
  const panelBgSoft = isDarkSurface ? "rgba(255,255,255,.05)" : "rgba(0,0,0,.03)";
  const borderTone = isDarkSurface ? "rgba(255,255,255,.14)" : "rgba(0,0,0,.08)";
  const textTone = isDarkSurface ? style.text : "#221a16";
  const brightness = isDarkSurface ? "1" : ".94";
  const cards = {
    services: [
      previewCard("Strategia", "Analiza i plan działania dopasowany do marki.", accent),
      previewCard("Projekt", "Układ i wizualna hierarchia treści.", accent),
      previewCard("Wdrożenie", "Gotowy blok do wykorzystania w builderze.", accent),
    ].join(""),
    pricing: [
      previewCard("Start", "Dla mniejszych projektów i testów.", accent),
      previewCard("Pro", "Najczęściej wybierany wariant.", accent),
      previewCard("Premium", "Dla wymagających klientów.", accent),
    ].join(""),
    faq: [
      previewCard("Czy sekcja jest responsywna?", "Tak, projekt jest przystosowany do mobile.", accent),
      previewCard("Czy mogę ją edytować?", "Tak, każdy blok trafia do biblioteki.", accent),
      previewCard("Czy wspiera SEO?", "Tak, przygotowujemy strukturę pod publikację.", accent),
    ].join(""),
    testimonials: [
      previewCard("5/5", "Bardzo dobry UX i szybkie wdrożenie.", accent),
      previewCard("Anna K.", "Sekcja wygląda jak gotowa strona klienta.", accent),
      previewCard("Marek P.", "Realny, nie-demo wygląd w panelu.", accent),
    ].join(""),
    contact: [
      `<div class="form">${["Imię", "E-mail", "Wiadomość"].map((label) => `<label><span>${escapeHtml(label)}</span><div class="input"></div></label>`).join("")}<button class="button">Wyślij wiadomość</button></div>`,
      `<aside class="aside">${previewMiniStat("Czas odpowiedzi", "24h", accent)}${previewMiniStat("Obsługiwane branże", "25+", accent)}</aside>`,
    ].join(""),
    cta: `<div class="banner">
      <div><span class="eyebrow">Działanie</span><h2>${escapeHtml(title)}</h2><p>${escapeHtml(subtitle)}</p></div>
      <div class="actions"><a class="button">Kontakt</a><a class="button button--ghost">Podgląd</a></div>
    </div>`,
    gallery: `<div class="masonry">${Array.from({ length: 6 }, (_, index) => `<div class="tile tile--${(index % 3) + 1}"></div>`).join("")}</div>`,
    footer: `<footer class="footer">
      <div><strong>${escapeHtml(title)}</strong><p>${escapeHtml(subtitle)}</p></div>
      <div class="footer__columns">${["Oferta", "Firma", "Kontakt"].map((col) => `<div><span>${col}</span><a href="#">Link 1</a><a href="#">Link 2</a></div>`).join("")}</div>
    </footer>`,
    packages: `<div class="pricing">${["Basic", "Pro", "Enterprise"].map((plan, index) => `<article class="pricing__card ${index === 1 ? "pricing__card--featured" : ""}"><span>${plan}</span><strong>${index === 0 ? "149 zł" : index === 1 ? "299 zł" : "599 zł"}</strong><p>Realistyczny pakiet do oferty.</p></article>`).join("")}</div>`,
    comparison: `<table class="comparison"><thead><tr><th>Cecha</th><th>Basic</th><th>Pro</th></tr></thead><tbody>${["Responsywność", "SEO", "Animacje"].map((row) => `<tr><td>${row}</td><td>Tak</td><td>Tak</td></tr>`).join("")}</tbody></table>`,
    features: `<div class="features">${["Szybki start", "Responsywność", "SEO", "Edytowalność"].map((item) => previewCard(item, "Jasny opis funkcji i korzyści.", accent)).join("")}</div>`,
    benefits: `<div class="benefits">${["Więcej leadów", "Lepszy UX", "Szybsze wdrożenie"].map((item) => previewCard(item, "Realny benefit biznesowy.", accent)).join("")}</div>`,
    process: `<ol class="timeline">${["Brief", "Projekt", "Wdrożenie", "Publikacja"].map((item, index) => `<li><span>${String(index + 1).padStart(2, "0")}</span><strong>${item}</strong></li>`).join("")}</ol>`,
    caseStudy: `<div class="case-study"><div class="case-study__hero"></div><div class="case-study__stats">${previewMiniStat("Wzrost konwersji", "+42%", accent)}${previewMiniStat("Czas wdrożenia", "7 dni", accent)}</div></div>`,
    portfolio: `<div class="portfolio">${["Projekt 01", "Projekt 02", "Projekt 03"].map((item) => `<article class="portfolio__item"><div class="portfolio__visual"></div><strong>${item}</strong></article>`).join("")}</div>`,
    team: `<div class="team">${["Anna", "Bartek", "Celina", "Daniel"].map((item) => `<article class="team__member"><div class="avatar"></div><strong>${item}</strong><span>Specjalista</span></article>`).join("")}</div>`,
    map: `<div class="map-layout"><div class="map"></div><div class="map-layout__aside">${previewCard("Adres", "Warszawa, ul. Przykładowa 12", accent)}${previewCard("Godziny", "Pon - Pt 9:00 - 17:00", accent)}</div></div>`,
    forms: `<div class="forms">${previewCard("Lead form", "Imię, e-mail i wiadomość.", accent)}${previewCard("Walidacja", "Pola są gotowe do podłączenia.", accent)}</div>`,
    newsletter: `<div class="newsletter"><div><span class="eyebrow">Newsletter</span><h2>${escapeHtml(title)}</h2><p>${escapeHtml(subtitle)}</p></div><div class="newsletter__form"><div class="input"></div><button class="button">Zapisz mnie</button></div></div>`,
    blog: `<div class="blog">${["Wpis 01", "Wpis 02", "Wpis 03"].map((item) => `<article class="blog__card"><div class="blog__thumb"></div><strong>${item}</strong><p>Krótki, realistyczny opis wpisu.</p></article>`).join("")}</div>`,
  } as Record<string, string>;

  const navbarLayouts = {
    classic: `<header class="topbar"><strong>Logo</strong><nav><span>Oferta</span><span>Realizacje</span><span>Kontakt</span></nav><a class="button">CTA</a></header><div class="hero-split"><div><span class="eyebrow">Menu klasyczne</span><h1>${escapeHtml(title)}</h1><p>${escapeHtml(subtitle)}</p></div><div class="mock-card"></div></div>`,
    sticky: `<header class="topbar topbar--sticky"><strong>Sticky</strong><nav><span>Home</span><span>Usługi</span><span>FAQ</span></nav><a class="button">Rezerwuj</a></header><div class="stack"><div class="panel"></div><div class="panel panel--small"></div></div>`,
    transparent: `<header class="topbar topbar--ghost"><strong>Transparent</strong><nav><span>O nas</span><span>Portfolio</span><span>Kontakt</span></nav></header><div class="hero-media"><div class="hero-media__image"></div><div class="hero-media__text"><h1>${escapeHtml(title)}</h1><p>${escapeHtml(subtitle)}</p></div></div>`,
    mobile: `<header class="phone"><div class="phone__bar"></div><div class="phone__menu">${["Start", "Oferta", "Kontakt"].map((item) => `<span>${item}</span>`).join("")}</div><div class="phone__content"></div></header>`,
    mega: `<div class="mega"><div class="mega__sidebar"><span>Kategorie</span><span>Nowości</span><span>Promocje</span></div><div class="mega__grid">${cards.services}</div></div>`,
    sidebar: `<div class="sidebar-layout"><aside class="sidebar-nav">${["Dashboard", "Sekcje", "Szablony", "Ustawienia"].map((item) => `<span>${item}</span>`).join("")}</aside><div class="sidebar-layout__content">${cards.features}</div></div>`,
    logo: `<div class="logo-layout"><div class="logo-mark">MA</div><div><h1>${escapeHtml(title)}</h1><p>${escapeHtml(subtitle)}</p></div></div>`,
    cta: `<div class="topbar topbar--cta"><strong>Brand</strong><nav><span>Strona</span><span>Oferta</span></nav><a class="button">Umów rozmowę</a></div><div class="hero-split">${cards.benefits}</div>`,
    shop: `<div class="shop-nav"><strong>Sklep</strong><div class="cart">Koszyk 2</div></div><div class="shop-grid">${cards.packages}</div>`,
    saas: `<div class="saas-layout"><div class="saas-layout__left"><span class="eyebrow">SaaS</span><h1>${escapeHtml(title)}</h1><p>${escapeHtml(subtitle)}</p></div><div class="saas-layout__right">${previewMiniStat("Aktywni użytkownicy", "12k", accent)}${previewMiniStat("Konwersja", "8.4%", accent)}</div></div>`,
    animated: `<div class="animated-preview"><div class="floating floating--one"></div><div class="floating floating--two"></div><div class="animated-preview__card"><h1>${escapeHtml(title)}</h1><p>${escapeHtml(subtitle)}</p></div></div>`,
  } as Record<string, string>;

  const heroLayouts = {
    service: `<section class="hero-split"><div><span class="eyebrow">Hero usługowy</span><h1>${escapeHtml(title)}</h1><p>${escapeHtml(subtitle)}</p></div><div class="mock-card">${cards.services}</div></section>`,
    shop: `<section class="hero-split"><div><span class="eyebrow">Hero sklepu</span><h1>${escapeHtml(title)}</h1><p>${escapeHtml(subtitle)}</p></div><div class="mock-card">${cards.packages}</div></section>`,
    portfolio: `<section class="hero-split"><div><span class="eyebrow">Hero portfolio</span><h1>${escapeHtml(title)}</h1><p>${escapeHtml(subtitle)}</p></div><div class="mock-card">${cards.portfolio}</div></section>`,
    "big-text": `<section class="big-type"><span class="eyebrow">Typografia</span><h1>${escapeHtml(title)}</h1><p>${escapeHtml(subtitle)}</p></section>`,
    image: `<section class="hero-media"><div class="hero-media__image"></div><div class="hero-media__text"><h1>${escapeHtml(title)}</h1><p>${escapeHtml(subtitle)}</p></div></section>`,
    video: `<section class="video-hero"><div class="video-frame"></div><div class="video-copy"><h1>${escapeHtml(title)}</h1><p>${escapeHtml(subtitle)}</p></div></section>`,
    animated: `<section class="animated-preview"><div class="floating floating--one"></div><div class="floating floating--two"></div><div class="animated-preview__card"><h1>${escapeHtml(title)}</h1><p>${escapeHtml(subtitle)}</p></div></section>`,
    form: `<section class="hero-form"><div><h1>${escapeHtml(title)}</h1><p>${escapeHtml(subtitle)}</p></div><div class="form">${["Imię", "E-mail"].map((label) => `<label><span>${label}</span><div class="input"></div></label>`).join("")}<button class="button">Wyślij</button></div></section>`,
    reviews: `<section class="hero-reviews"><div><h1>${escapeHtml(title)}</h1><p>${escapeHtml(subtitle)}</p></div><div class="review-strip">${cards.testimonials}</div></section>`,
    luxury: `<section class="luxury-hero"><span class="eyebrow">Premium</span><h1>${escapeHtml(title)}</h1><p>${escapeHtml(subtitle)}</p><div class="luxury-hero__bar"></div></section>`,
  } as Record<string, string>;

  const ecommerceLayouts = {
    products: `<div class="product-grid">${["Produkt 01", "Produkt 02", "Produkt 03", "Produkt 04"].map((item) => `<article class="product"><div class="product__image"></div><strong>${item}</strong><span>149 zł</span></article>`).join("")}</div>`,
    "product-card": `<div class="product-card"><div class="product-card__image"></div><div><h1>${escapeHtml(title)}</h1><p>${escapeHtml(subtitle)}</p><div class="button">Dodaj do koszyka</div></div></div>`,
    categories: `<div class="categories">${["Biżuteria", "Nowości", "Promocje", "Bestsellery"].map((item) => `<div class="category">${item}</div>`).join("")}</div>`,
    bestsellers: `<div class="product-grid">${["Bestseller 01", "Bestseller 02", "Bestseller 03"].map((item) => `<article class="product product--highlight"><div class="product__image"></div><strong>${item}</strong><span>Najlepiej sprzedawany</span></article>`).join("")}</div>`,
    promotions: `<div class="promo-banner"><h1>${escapeHtml(title)}</h1><p>${escapeHtml(subtitle)}</p><div class="button">Sprawdź rabat</div></div>`,
    "cart-preview": `<div class="cart-preview"><div class="cart-preview__item"></div><div class="cart-preview__item"></div><strong>Razem: 298 zł</strong></div>`,
    reviews: cards.testimonials,
    banner: `<div class="promo-banner promo-banner--large"><h1>${escapeHtml(title)}</h1><p>${escapeHtml(subtitle)}</p></div>`,
    collections: `<div class="collection-grid">${["Kolekcja A", "Kolekcja B", "Kolekcja C"].map((item) => `<div class="collection">${item}</div>`).join("")}</div>`,
    new: `<div class="product-grid">${["Nowość 01", "Nowość 02", "Nowość 03"].map((item) => `<article class="product"><div class="product__image"></div><strong>${item}</strong><span>Nowy drop</span></article>`).join("")}</div>`,
    featured: `<div class="product-grid">${["Polecane 01", "Polecane 02", "Polecane 03"].map((item) => `<article class="product product--highlight"><div class="product__image"></div><strong>${item}</strong><span>Polecany produkt</span></article>`).join("")}</div>`,
  } as Record<string, string>;

  const specialLayouts = {
    "animated-bg": `<div class="animated-bg"><div class="floating floating--one"></div><div class="floating floating--two"></div><div class="animated-preview__card"><h1>${escapeHtml(title)}</h1><p>${escapeHtml(subtitle)}</p></div></div>`,
    glassmorphism: `<div class="glass-panel"><h1>${escapeHtml(title)}</h1><p>${escapeHtml(subtitle)}</p></div>`,
    "dark-mode": `<div class="dark-panel"><h1>${escapeHtml(title)}</h1><p>${escapeHtml(subtitle)}</p></div>`,
    gradient: `<div class="gradient-panel"><h1>${escapeHtml(title)}</h1><p>${escapeHtml(subtitle)}</p></div>`,
    "3d": `<div class="three-d"><div class="three-d__cube"></div><h1>${escapeHtml(title)}</h1></div>`,
    scroll: `<div class="scroll-panel"><div class="scroll-panel__track"></div><h1>${escapeHtml(title)}</h1></div>`,
    counters: `<div class="counter-row">${["1024", "2048", "4096"].map((item) => previewMiniStat("Stat", item, accent)).join("")}</div>`,
    timeline: `<ol class="timeline">${["2021", "2022", "2023", "2024"].map((item, index) => `<li><span>${item}</span><strong>Krok ${index + 1}</strong></li>`).join("")}</ol>`,
    comparison: `<div class="comparison-panel">${cards.comparison}</div>`,
    "before-after": `<div class="before-after"><div class="before-after__box">Przed</div><div class="before-after__box before-after__box--after">Po</div></div>`,
    icons: `<div class="icon-grid">${["Icon 01", "Icon 02", "Icon 03", "Icon 04"].map((item) => previewCard(item, "Lucide / Heroicons / Tabler", accent)).join("")}</div>`,
    typography: `<div class="big-type"><span class="eyebrow">Typografia</span><h1>${escapeHtml(title)}</h1><p>${escapeHtml(subtitle)}</p></div>`,
  } as Record<string, string>;

  const offeringLayouts = {
    "case-study": cards.caseStudy,
  } as Record<string, string>;
  const genericOffering = offeringLayouts[sectionFamily] ?? cards[sectionFamily] ?? `<div class="generic-grid">${previewCard(title, subtitle, accent)}${previewCard("Dane", "Sekcja gotowa do edycji i zapisu.", accent)}</div>`;
  const renderers = {
    navbar: navbarLayouts[variantKey] ?? navbarLayouts.classic,
    hero: heroLayouts[variantKey] ?? heroLayouts.service,
    ecommerce: ecommerceLayouts[variantKey] ?? ecommerceLayouts.products,
    special: specialLayouts[variantKey] ?? specialLayouts.gradient,
  } as Record<string, string>;
  const body = renderers[sectionFamily] ?? genericOffering;

  return `<!doctype html>
  <html lang="pl">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      html,body{margin:0;height:100%;font-family:Inter,Arial,sans-serif;background:${style.surface};color:${textTone};}
      body{padding:22px}
      .canvas{min-height:calc(100vh - 44px);padding:28px;border-radius:32px;background:linear-gradient(145deg, ${panelBg}, ${panelBgSoft});border:1px solid ${borderTone};backdrop-filter:blur(22px);box-shadow:0 30px 80px rgba(0,0,0,.18);filter:brightness(${brightness})}
      .eyebrow{display:inline-flex;align-items:center;gap:10px;font-size:11px;letter-spacing:.28em;text-transform:uppercase;color:${style.accent};font-weight:800}
      h1,h2,strong{margin:0}
      h1{font-size:clamp(28px,4vw,48px);line-height:1.02}
      h2{font-size:clamp(22px,3vw,34px);line-height:1.05}
      p{margin:12px 0 0;font-size:15px;line-height:1.7;opacity:.86;max-width:720px}
      .button{display:inline-flex;align-items:center;justify-content:center;padding:12px 18px;border-radius:999px;background:${style.accent};color:#fff;font-weight:700;text-decoration:none}
      .button--ghost{background:transparent;border:1px solid rgba(255,255,255,.16);color:${style.text}}
      .card,.panel,.product,.pricing__card,.blog__card,.team__member,.category,.collection,.footer__columns div,.portfolio__item,.stat,.map,.grid-item{border-radius:22px;background:${panelBg};border:1px solid ${borderTone}}
      .card{position:relative;padding:18px}
      .card__accent{height:5px;border-radius:999px;margin-bottom:14px}
      .card p,.stat__label,.portfolio__item span,.team__member span,.blog__card p,.footer p,.product span,.pricing__card p{font-size:13px;line-height:1.6;color:${isDarkSurface ? "rgba(255,255,255,.78)" : "#2b201a"};opacity:1}
      .stat{padding:16px}
      .stat__value{display:block;font-size:28px;font-weight:800;line-height:1.1}
      .stat__label{display:block;margin-top:8px}
      .grid,.features,.benefits,.team,.blog,.portfolio,.product-grid,.collection-grid,.categories,.pricing,.forms,.footer__columns,.icon-grid,.masonry{display:grid;gap:14px}
      .grid,.features,.benefits,.team,.blog,.portfolio,.product-grid,.collection-grid,.categories,.pricing,.forms,.icon-grid{grid-template-columns:repeat(3,minmax(0,1fr))}
      .masonry{grid-template-columns:repeat(3,minmax(0,1fr))}
      .masonry .tile{min-height:110px;border-radius:22px;background:linear-gradient(145deg, ${panelBg}, ${panelBgSoft});}
      .masonry .tile--2{min-height:150px}
      .masonry .tile--3{min-height:190px}
      .topbar,.shop-nav,.topbar--sticky,.topbar--ghost{display:flex;align-items:center;justify-content:space-between;gap:16px;padding:16px 18px;border-radius:24px;background:${panelBg};border:1px solid ${borderTone}}
      .topbar nav,.shop-nav .cart,.phone__menu,.sidebar-nav{display:flex;gap:14px;flex-wrap:wrap}
      .topbar nav span,.sidebar-nav span,.phone__menu span{font-size:12px;opacity:.82}
      .hero-split,.hero-media,.hero-form,.hero-reviews,.saas-layout,.newsletter,.map-layout,.case-study,.logo-layout,.big-type,.video-hero,.luxury-hero,.animated-preview,.stack,.sidebar-layout,.shop-grid,.count-row,.banner,.promo-banner{display:grid;gap:18px}
      .hero-split,.hero-media,.hero-form,.hero-reviews,.saas-layout,.newsletter,.map-layout,.case-study,.logo-layout,.video-hero,.luxury-hero,.animated-preview,.sidebar-layout,.shop-grid{grid-template-columns:repeat(2,minmax(0,1fr));align-items:center}
      .mock-card,.hero-media__image,.video-frame,.product__image,.product-card__image,.portfolio__visual,.blog__thumb,.avatar,.map,.hero-media__text,.animated-preview__card,.dark-panel,.glass-panel,.gradient-panel,.three-d__cube,.scroll-panel,.before-after__box,.cart-preview__item,.footer,.comparison,.case-study__hero,.shop-grid .pricing__card{min-height:120px;border-radius:28px;background:linear-gradient(145deg, ${panelBg}, ${panelBgSoft});border:1px solid ${borderTone}}
      .hero-media__image,.video-frame,.product__image,.product-card__image,.portfolio__visual,.blog__thumb,.avatar,.map,.case-study__hero,.three-d__cube,.scroll-panel__track,.before-after__box,.cart-preview__item{min-height:180px}
      .hero-media__text,.animated-preview__card,.dark-panel,.glass-panel,.gradient-panel,.luxury-hero,.newsletter__form,.promo-banner,.big-type,.footer{padding:22px}
      .floating{position:absolute;width:120px;height:120px;border-radius:999px;background:${style.accent};opacity:.22;filter:blur(12px)}
      .floating--one{top:12%;right:12%}.floating--two{bottom:10%;left:10%}
      .phone{max-width:360px;margin:0 auto;padding:14px;border-radius:34px;background:${panelBg};border:1px solid ${borderTone}}
      .phone__bar{height:16px;border-radius:999px;background:${panelBgSoft};margin-bottom:14px}
      .phone__menu,.phone__content{border-radius:22px;background:${panelBgSoft};border:1px solid ${borderTone};padding:14px}
      .phone__content{min-height:220px;margin-top:14px}
      .sidebar-layout{grid-template-columns:280px 1fr}
      .sidebar-nav{flex-direction:column;padding:20px}
      .sidebar-layout__content{min-height:260px}
      .mega,.comparison-panel,.cart-preview{display:grid;gap:16px}
      .mega{grid-template-columns:260px 1fr}
      .mega__sidebar{display:grid;gap:10px;padding:20px;border-radius:24px;background:${panelBgSoft};border:1px solid ${borderTone}}
      .mega__grid{display:grid;gap:14px;grid-template-columns:repeat(2,minmax(0,1fr))}
      .timeline{list-style:none;padding:0;margin:0;display:grid;gap:12px}
      .timeline li{display:flex;align-items:center;gap:14px;padding:14px 16px;border-radius:20px;background:${panelBgSoft};border:1px solid ${borderTone}}
      .timeline span{font-size:12px;letter-spacing:.2em;text-transform:uppercase;color:${style.accent};font-weight:800}
      .comparison{width:100%;border-collapse:collapse;overflow:hidden}
      .comparison th,.comparison td{padding:12px 14px;border-bottom:1px solid rgba(255,255,255,.08);text-align:left}
      .comparison th{color:${style.accent}}
      .input{height:48px;border-radius:16px;background:${panelBgSoft};border:1px solid ${borderTone}}
      label{display:grid;gap:8px}
      .form{display:grid;gap:12px}
      .aside{display:grid;gap:12px}
      .banner,.newsletter,.luxury-hero,.map-layout{grid-template-columns:1.3fr .7fr}
      .banner,.promo-banner,.newsletter,.luxury-hero,.big-type{padding:24px;border-radius:28px;background:${panelBg};border:1px solid ${borderTone}}
      .promo-banner,.promo-banner--large{display:grid;gap:10px}
      .button--ghost{display:inline-flex}
      .review-strip{display:grid;gap:12px}
      .dark-panel,.glass-panel,.gradient-panel,.three-d,.scroll-panel,.before-after{display:grid;place-items:center;min-height:260px}
      .dark-panel{background:${isDarkSurface ? "#0b0b0d" : "rgba(0,0,0,.12)"}}
      .glass-panel{backdrop-filter:blur(24px)}
      .gradient-panel{background:linear-gradient(135deg, ${style.accent}, rgba(255,255,255,.06))}
      .three-d__cube{width:180px;height:180px;transform:rotate(18deg);background:linear-gradient(145deg, rgba(255,255,255,.24), rgba(255,255,255,.05))}
      .scroll-panel__track{width:80%;height:12px;border-radius:999px;background:linear-gradient(90deg, transparent, ${style.accent}, transparent)}
      .before-after{grid-template-columns:1fr 1fr}
      .before-after__box{display:grid;place-items:center;min-height:220px}
      .before-after__box--after{background:linear-gradient(145deg, ${style.accent}, rgba(255,255,255,.08))}
      .product,.pricing__card,.blog__card,.team__member,.category,.collection,.portfolio__item{padding:16px;display:grid;gap:10px}
      .pricing__card--featured{outline:2px solid ${style.accent}}
      .avatar{width:72px;height:72px;border-radius:999px}
      .footer{grid-template-columns:1fr 1.4fr;align-items:start}
      .footer__columns{grid-template-columns:repeat(3,minmax(0,1fr))}
      .footer__columns div{padding:14px;display:grid;gap:8px}
      .footer__columns span{font-size:12px;letter-spacing:.18em;text-transform:uppercase;color:${style.accent}}
      .footer__columns a{color:inherit;text-decoration:none;opacity:.78;font-size:13px}
      @media(max-width:900px){
        body{padding:12px}
        .canvas{padding:18px}
        .grid,.features,.benefits,.team,.blog,.portfolio,.product-grid,.collection-grid,.categories,.pricing,.forms,.icon-grid,.mega__grid,.footer__columns,.hero-split,.hero-media,.hero-form,.hero-reviews,.saas-layout,.newsletter,.map-layout,.case-study,.logo-layout,.video-hero,.luxury-hero,.animated-preview,.sidebar-layout,.shop-grid,.banner,.before-after,.footer,.mega{grid-template-columns:1fr}
        .sidebar-layout{grid-template-columns:1fr}
        .hero-split,.hero-media,.hero-form,.hero-reviews,.saas-layout,.newsletter,.map-layout,.case-study,.logo-layout,.video-hero,.luxury-hero,.animated-preview,.sidebar-layout,.shop-grid,.banner,.footer,.mega{gap:14px}
      }
    </style>
  </head>
  <body>
    <div class="canvas">
      <span class="eyebrow">Biblioteka Sekcji · ${escapeHtml(sectionFamily)}</span>
      ${body}
    </div>
  </body>
  </html>`;
}

function makeSectionRecord(
  family: FamilyDefinition,
  variant: FamilyVariant,
  style: FamilyStyle,
  index: number
): SectionRecord {
  const name = `${variant.name} ${style.name}`;
  const slug = `${family.prefix}-${variant.key}-${style.key}-${String(index + 1).padStart(2, "0")}`;
  const title = variant.title;
  const subtitle = variant.subtitle;
  const sectionCodeName = slug
    .split("-")
    .map((part) => part[0]?.toUpperCase() + part.slice(1))
    .join("")
    .replace(/[^A-Za-z0-9]/g, "");

  return {
    id: slug,
    slug,
    name,
    categoryId: family.categoryId,
    categoryName: family.categoryName,
    tags: [...new Set([...family.baseTags, ...variant.tags, ...style.tags])],
    thumbnailUrl: thumb(name, style.accent, style.surface, style.text),
    description: variant.description,
    technology: style.technology,
    componentCode:
      style.technology.includes("HTML")
        ? buildHtmlSectionCode(title, subtitle, variant.cta, style)
        : buildReactSectionCode(sectionCodeName || "SectionBlock", title, subtitle, variant.cta, style),
    styleCode: buildStyleCode(style, style.technology),
    dependencies: style.dependencies,
    difficulty: style.difficulty,
    requiresJavaScript: style.requiresJavaScript,
    responsive: true,
    animated: style.animated,
    sourceType: "own",
    sourceUrl: family.sourceUrl ?? null,
    author: family.author ?? "MA Atelier Studio",
    licenseId: style.license === "MIT" ? "mit" : style.license === "Apache-2.0" ? "apache-2.0" : "proprietary",
    licenseName: style.license,
    licenseStatus: "known",
    isFree: true,
    commercialUse: true,
    attributionRequired: false,
    dateAdded: nowIso(),
    status: "active",
    industryTags: variant.industryTags,
    styleTags: variant.styleTags,
    isFavorite: false,
    isPremium: Boolean(style.isPremium),
    previewHtml: buildPreviewHtml(family.prefix, variant.key, title, subtitle, style),
    previewDarkHtml: buildPreviewHtml(family.prefix, variant.key, title, subtitle, style),
    aiAnalysis: null,
    variants: [
      {
        id: `${slug}-default`,
        sectionId: slug,
        name: "Domyślny wariant",
        key: "default",
        componentCode: style.technology.includes("HTML")
          ? buildHtmlSectionCode(title, subtitle, variant.cta, style)
          : buildReactSectionCode(sectionCodeName || "SectionBlock", title, subtitle, variant.cta, style),
        styleCode: buildStyleCode(style, style.technology),
        thumbnailUrl: thumb(`${name} - default`, style.accent, style.surface, style.text),
        notes: "Wariant początkowy do edycji.",
        isDefault: true,
      },
    ],
  };
}

function expandFamily(family: FamilyDefinition): SectionRecord[] {
  const result: SectionRecord[] = [];
  family.variants.forEach((variant, variantIndex) => {
    family.styles.forEach((style, styleIndex) => {
      const index = variantIndex * family.styles.length + styleIndex;
      result.push(makeSectionRecord(family, variant, style, index));
    });
  });
  return result;
}

function buildFamilyDefinition(
  categoryId: SectionCategory["id"],
  categoryName: string,
  prefix: string,
  baseTags: string[],
  variants: FamilyVariant[],
  styles: FamilyStyle[],
  sourceUrl?: string,
  author?: string
): FamilyDefinition {
  return {
    categoryId,
    categoryName,
    prefix,
    baseTags,
    variants,
    styles,
    sourceUrl,
    author,
  };
}

const NAVBAR_STYLES: FamilyStyle[] = [
  { key: "light", name: "jasny", accent: "#b68d5e", surface: "#f7f3ed", text: "#171614", tags: ["light", "navbar"], license: "MIT", technology: "React + Tailwind", difficulty: "easy", animated: false, requiresJavaScript: false, dependencies: ["lucide-react"] },
  { key: "dark", name: "dark", accent: "#e8c98b", surface: "#121212", text: "#f5f0e6", tags: ["dark", "navbar"], license: "MIT", technology: "React + Tailwind", difficulty: "easy", animated: true, requiresJavaScript: true, dependencies: ["framer-motion", "lucide-react"] },
  { key: "luxury", name: "premium", accent: "#c9a86a", surface: "#0f0f10", text: "#f7f1e6", tags: ["premium", "navbar"], license: "MIT", technology: "Next.js + Tailwind", difficulty: "medium", animated: false, requiresJavaScript: false, dependencies: ["lucide-react"], isPremium: true },
  { key: "glass", name: "glass", accent: "#7da7ff", surface: "#101828", text: "#eff6ff", tags: ["glass", "navbar"], license: "MIT", technology: "React + Tailwind", difficulty: "medium", animated: true, requiresJavaScript: true, dependencies: ["framer-motion", "lucide-react"], isPremium: true },
  { key: "gradient", name: "gradient", accent: "#f59e0b", surface: "#1f2937", text: "#f8fafc", tags: ["gradient", "navbar"], license: "MIT", technology: "HTML + Tailwind", difficulty: "easy", animated: false, requiresJavaScript: false, dependencies: [] },
];

const HERO_STYLES: FamilyStyle[] = [
  { key: "modern", name: "nowoczesny", accent: "#b68d5e", surface: "#f4efe6", text: "#191815", tags: ["modern", "hero"], license: "MIT", technology: "React + Tailwind", difficulty: "medium", animated: true, requiresJavaScript: true, dependencies: ["framer-motion", "lucide-react"] },
  { key: "luxury", name: "luxury", accent: "#d9b56d", surface: "#111111", text: "#f5efe2", tags: ["luxury", "hero"], license: "MIT", technology: "Next.js + Tailwind", difficulty: "medium", animated: true, requiresJavaScript: true, dependencies: ["framer-motion", "lucide-react"], isPremium: true },
  { key: "glass", name: "glass", accent: "#7da7ff", surface: "#101828", text: "#eff6ff", tags: ["glass", "hero"], license: "MIT", technology: "React + Tailwind", difficulty: "medium", animated: true, requiresJavaScript: true, dependencies: ["framer-motion", "lucide-react"], isPremium: true },
  { key: "editorial", name: "editorialny", accent: "#b68d5e", surface: "#f7f1e8", text: "#1b1714", tags: ["editorial", "hero"], license: "MIT", technology: "HTML + Tailwind", difficulty: "easy", animated: false, requiresJavaScript: false, dependencies: [] },
  { key: "bold", name: "bold", accent: "#f97316", surface: "#101010", text: "#fff7ed", tags: ["bold", "hero"], license: "MIT", technology: "React + Tailwind", difficulty: "medium", animated: true, requiresJavaScript: true, dependencies: ["framer-motion", "lucide-react"] },
];

const OFFERING_STYLES: FamilyStyle[] = [
  { key: "editorial", name: "editorialny", accent: "#b68d5e", surface: "#f4efe6", text: "#191815", tags: ["minimal", "business"], license: "MIT", technology: "HTML + Tailwind", difficulty: "easy", animated: false, requiresJavaScript: false, dependencies: [] },
  { key: "premium", name: "premium", accent: "#caa86a", surface: "#14110f", text: "#f7f1e6", tags: ["premium", "business"], license: "MIT", technology: "React + Tailwind", difficulty: "medium", animated: false, requiresJavaScript: false, dependencies: ["lucide-react"] },
  { key: "animated", name: "animowany", accent: "#6d8cff", surface: "#0f172a", text: "#eff6ff", tags: ["animated", "business"], license: "MIT", technology: "Next.js + Tailwind", difficulty: "medium", animated: true, requiresJavaScript: true, dependencies: ["framer-motion", "lucide-react"] },
  { key: "glass", name: "glass", accent: "#9f7aea", surface: "#111827", text: "#f8fafc", tags: ["glass", "gradient"], license: "MIT", technology: "React + Tailwind", difficulty: "medium", animated: true, requiresJavaScript: true, dependencies: ["framer-motion", "lucide-react"], isPremium: true },
  { key: "dark", name: "dark", accent: "#8b5cf6", surface: "#09090b", text: "#f4f4f5", tags: ["dark", "business"], license: "MIT", technology: "React + CSS", difficulty: "medium", animated: true, requiresJavaScript: true, dependencies: ["framer-motion"] },
  { key: "technical", name: "technical", accent: "#7dd3fc", surface: "#0f172a", text: "#e2e8f0", tags: ["technical", "business"], license: "MIT", technology: "Next.js + Tailwind", difficulty: "hard", animated: false, requiresJavaScript: true, dependencies: ["lucide-react"] },
];

const ECOMMERCE_STYLES: FamilyStyle[] = [
  { key: "shop", name: "sklepowy", accent: "#6f9e6d", surface: "#f4f2ec", text: "#151515", tags: ["ecommerce", "shop"], license: "MIT", technology: "React + Tailwind", difficulty: "easy", animated: false, requiresJavaScript: false, dependencies: ["lucide-react"] },
  { key: "promo", name: "promocyjny", accent: "#f97316", surface: "#111111", text: "#fff7ed", tags: ["ecommerce", "promo"], license: "MIT", technology: "Next.js + Tailwind", difficulty: "medium", animated: true, requiresJavaScript: true, dependencies: ["framer-motion", "lucide-react"] },
  { key: "luxury", name: "luxury", accent: "#d9b56d", surface: "#111111", text: "#f7f1e6", tags: ["ecommerce", "luxury"], license: "MIT", technology: "React + Tailwind", difficulty: "medium", animated: false, requiresJavaScript: false, dependencies: ["lucide-react"], isPremium: true },
  { key: "dark", name: "dark", accent: "#8ec37a", surface: "#0b0f0c", text: "#f4faf2", tags: ["ecommerce", "dark"], license: "MIT", technology: "Next.js + Tailwind", difficulty: "medium", animated: true, requiresJavaScript: true, dependencies: ["framer-motion", "lucide-react"] },
  { key: "editorial", name: "editorialny", accent: "#b68d5e", surface: "#f4efe6", text: "#191815", tags: ["ecommerce", "editorial"], license: "MIT", technology: "HTML + Tailwind", difficulty: "easy", animated: false, requiresJavaScript: false, dependencies: [] },
];

const SPECIAL_STYLES: FamilyStyle[] = [
  { key: "dark", name: "dark mode", accent: "#8b5cf6", surface: "#09090b", text: "#f4f4f5", tags: ["dark", "special"], license: "MIT", technology: "React + CSS", difficulty: "medium", animated: true, requiresJavaScript: true, dependencies: ["framer-motion"] },
  { key: "gradient", name: "gradientowy", accent: "#f59e0b", surface: "#0f172a", text: "#f8fafc", tags: ["gradient", "special"], license: "MIT", technology: "HTML + Tailwind", difficulty: "easy", animated: false, requiresJavaScript: false, dependencies: [] },
  { key: "glass", name: "glassmorphism", accent: "#7da7ff", surface: "#101828", text: "#eff6ff", tags: ["glass", "special"], license: "MIT", technology: "React + Tailwind", difficulty: "medium", animated: true, requiresJavaScript: true, dependencies: ["framer-motion", "lucide-react"], isPremium: true },
  { key: "light", name: "light", accent: "#b68d5e", surface: "#f7f3ed", text: "#181512", tags: ["light", "special"], license: "MIT", technology: "HTML", difficulty: "easy", animated: false, requiresJavaScript: false, dependencies: [] },
  { key: "floating", name: "floating", accent: "#f472b6", surface: "#111827", text: "#f8fafc", tags: ["animated", "special"], license: "MIT", technology: "Next.js + Tailwind", difficulty: "medium", animated: true, requiresJavaScript: true, dependencies: ["framer-motion", "lucide-react"] },
];

type SeriesTheme = {
  key: string;
  name: string;
  description: string;
  subtitleSuffix: string;
  cta?: string;
  extraTags?: string[];
  styleTags?: string[];
  industryTags?: string[];
};

type SeriesBase = {
  key: string;
  name: string;
  description: string;
  title: string;
  subtitle: string;
  cta: string;
  tags: string[];
  industryTags: string[];
  styleTags: string[];
};

function createSeriesVariants(base: SeriesBase, themes: SeriesTheme[]): FamilyVariant[] {
  return themes.map((theme) => ({
    key: `${base.key}-${theme.key}`,
    name: `${base.name} ${theme.name}`,
    description: `${base.description} ${theme.description}`,
    title: base.title,
    subtitle: `${base.subtitle} ${theme.subtitleSuffix}`.trim(),
    cta: theme.cta ?? base.cta,
    tags: [...new Set([...base.tags, ...(theme.extraTags ?? [theme.key])])],
    industryTags: [...new Set([...base.industryTags, ...(theme.industryTags ?? [])])],
    styleTags: [...new Set([...base.styleTags, ...(theme.styleTags ?? [])])],
  }));
}

const CORE_SERIES_THEMES: SeriesTheme[] = [
  {
    key: "classic",
    name: "klasyczna",
    description: "w klasycznym układzie z mocną hierarchią treści.",
    subtitleSuffix: "Wersja klasyczna dla stron, które mają być czytelne od pierwszego ekranu.",
    cta: "Poznaj więcej",
    extraTags: ["classic", "clean"],
    styleTags: ["classic", "minimal"],
  },
  {
    key: "split",
    name: "split",
    description: "w układzie dzielonym z wyraźnym podziałem treści.",
    subtitleSuffix: "Układ split pomaga wprowadzić więcej kontekstu bez utraty przejrzystości.",
    cta: "Zobacz układ",
    extraTags: ["split", "layout"],
    styleTags: ["split", "modern"],
  },
  {
    key: "cards",
    name: "karty",
    description: "w modularnych kartach i sekcjach blokowych.",
    subtitleSuffix: "Modułowe karty dobrze działają przy większej liczbie informacji.",
    cta: "Przeglądaj",
    extraTags: ["cards", "grid"],
    styleTags: ["cards", "structured"],
  },
  {
    key: "premium",
    name: "premium",
    description: "w bardziej dopracowanej, luksusowej odsłonie.",
    subtitleSuffix: "Premium akcenty dodają sekcji lepszego odbioru i większej wartości wizualnej.",
    cta: "Umów demo",
    extraTags: ["premium", "elegant"],
    styleTags: ["premium", "luxury"],
  },
  {
    key: "animated",
    name: "animowana",
    description: "z lekkimi animacjami i interakcjami mikro.",
    subtitleSuffix: "Subtelny ruch poprawia odbiór sekcji i kieruje uwagę na najważniejsze elementy.",
    cta: "Zobacz animację",
    extraTags: ["animated", "motion"],
    styleTags: ["animated", "motion"],
    industryTags: ["creative"],
  },
];

const NAVBAR_VARIANTS: FamilyVariant[] = [
  { key: "classic", name: "Klasyczne menu", description: "Prosta, czytelna nawigacja z logo i CTA.", title: "Klasyczne menu", subtitle: "Przejrzysta nawigacja dla strony firmowej.", cta: "Skontaktuj się", tags: ["navbar", "classic"], industryTags: ["business"], styleTags: ["minimal"] },
  { key: "sticky", name: "Sticky navbar", description: "Przyklejone menu, które zostaje przy przewijaniu.", title: "Sticky navbar", subtitle: "Zawsze widoczna nawigacja dla dłuższych stron.", cta: "Zobacz ofertę", tags: ["sticky", "navbar"], industryTags: ["startup", "saas"], styleTags: ["modern"] },
  { key: "transparent", name: "Transparent navbar", description: "Transparentna nawigacja do hero z tłem wideo lub obrazu.", title: "Transparent navbar", subtitle: "Świetnie działa z dużym hero i wideo w tle.", cta: "Poznaj", tags: ["transparent", "navbar"], industryTags: ["portfolio", "luxury"], styleTags: ["luxury"] },
  { key: "mobile", name: "Mobile menu", description: "Menu zoptymalizowane pod urządzenia mobilne.", title: "Mobile menu", subtitle: "Pełna kontrola UX na małych ekranach.", cta: "Otwórz menu", tags: ["mobile", "navbar"], industryTags: ["local-services"], styleTags: ["responsive"] },
  { key: "mega", name: "Mega menu", description: "Rozbudowane menu z wieloma kolumnami i sekcjami.", title: "Mega menu", subtitle: "Dla sklepów i większych serwisów.", cta: "Sprawdź kategorie", tags: ["mega-menu", "navbar"], industryTags: ["ecommerce"], styleTags: ["shop"] },
  { key: "sidebar", name: "Sidebar menu", description: "Menu boczne do dashboardów i aplikacji.", title: "Sidebar menu", subtitle: "Idealne dla aplikacji i paneli.", cta: "Zaloguj się", tags: ["sidebar", "navbar"], industryTags: ["saas", "application"], styleTags: ["technical"] },
  { key: "logo", name: "Menu z logo", description: "Nawigacja z mocnym akcentem marki.", title: "Menu z logo", subtitle: "Buduje rozpoznawalność od pierwszego ekranu.", cta: "O marce", tags: ["logo", "navbar"], industryTags: ["branding"], styleTags: ["premium"] },
  { key: "cta", name: "Menu z CTA", description: "Menu z wyróżnionym przyciskiem konwersji.", title: "Menu z CTA", subtitle: "Lepsza konwersja bez zagłuszania layoutu.", cta: "Umów rozmowę", tags: ["cta", "navbar"], industryTags: ["agency", "services"], styleTags: ["agency"] },
  { key: "shop", name: "Menu dla sklepu", description: "Nawigacja z koszykiem, kategoriami i filtrem.", title: "Menu dla sklepu", subtitle: "Przyjazne dla ecommerce i dużych katalogów.", cta: "Koszyk", tags: ["ecommerce", "navbar"], industryTags: ["ecommerce"], styleTags: ["shop"] },
  { key: "saas", name: "Menu dla SaaS", description: "Nowoczesne menu produktu z linkami do sekcji i logowania.", title: "Menu dla SaaS", subtitle: "Sprawdza się przy produktach cyfrowych.", cta: "Wypróbuj demo", tags: ["saas", "navbar"], industryTags: ["saas"], styleTags: ["startup"] },
  { key: "animated", name: "Menu z animacjami", description: "Animowane elementy, hover i mikrointerakcje.", title: "Menu z animacjami", subtitle: "Przyciąga uwagę bez nadmiaru ruchu.", cta: "Zobacz animacje", tags: ["animated", "navbar"], industryTags: ["creative"], styleTags: ["animated"] },
];

const HERO_VARIANTS: FamilyVariant[] = [
  { key: "service", name: "Hero dla firm usługowych", description: "Hero pod usługi lokalne i firmy B2B.", title: "Zaprojektuj stronę, która sprzedaje", subtitle: "Gotowe sekcje dla firm usługowych z jasnym CTA i dowodem społecznym.", cta: "Bezpłatna wycena", tags: ["hero", "service"], industryTags: ["business", "local-services"], styleTags: ["modern"] },
  { key: "shop", name: "Hero dla sklepu", description: "Hero pod ecommerce z produktami i promocją.", title: "Twoje produkty w centrum uwagi", subtitle: "Sekcja hero skoncentrowana na konwersji, promocjach i kolekcjach.", cta: "Kup teraz", tags: ["hero", "ecommerce"], industryTags: ["ecommerce"], styleTags: ["shop"] },
  { key: "portfolio", name: "Hero dla portfolio", description: "Hero pod portfolio z mocnym wizualem.", title: "Pokaż projekty, które robią wrażenie", subtitle: "Eleganckie układy do prezentacji prac, case studies i referencji.", cta: "Zobacz realizacje", tags: ["hero", "portfolio"], industryTags: ["portfolio", "creative"], styleTags: ["minimal"] },
  { key: "big-text", name: "Hero z dużym tekstem", description: "Typograficzne hero z wyrazistym headline.", title: "Duża typografia", subtitle: "Sekcja, która buduje skalę i pewność marki już na starcie.", cta: "Poznaj markę", tags: ["hero", "typography"], industryTags: ["agency", "startup"], styleTags: ["editorial"] },
  { key: "image", name: "Hero z obrazem", description: "Układ z dużym zdjęciem i kopią.", title: "Pracujemy na pięknym obrazie i precyzyjnym copy", subtitle: "Hero z mocnym wizualem dla stron premium i usług.", cta: "Zobacz więcej", tags: ["hero", "image"], industryTags: ["photography", "luxury"], styleTags: ["luxury"] },
  { key: "video", name: "Hero z wideo", description: "Hero z odtwarzaczem lub tłem wideo.", title: "Wideo, które opowiada historię", subtitle: "Najlepszy wybór dla produktów, studiów i marek premium.", cta: "Odtwórz", tags: ["hero", "video"], industryTags: ["saas", "creative"], styleTags: ["animated"] },
  { key: "animated", name: "Hero z animacją", description: "Dynamiczne przejścia, floating shapes i parallax.", title: "Hero, który żyje", subtitle: "Ruch przyciąga uwagę i pozwala podbić percepcję jakości.", cta: "Sprawdź", tags: ["hero", "animated"], industryTags: ["startup", "agency"], styleTags: ["animated"] },
  { key: "form", name: "Hero z formularzem", description: "Hero z formularzem leadowym lub bookingowym.", title: "Zbieraj leady od pierwszego ekranu", subtitle: "Formularz w hero skraca drogę do konwersji.", cta: "Wyślij zapytanie", tags: ["hero", "form"], industryTags: ["services", "medical"], styleTags: ["responsive"] },
  { key: "reviews", name: "Hero z opiniami", description: "Hero z ocenami i social proof.", title: "Zaufanie jeszcze przed scrollowaniem", subtitle: "Opinie i gwiazdki wzmacniają wiarygodność marki.", cta: "Czytaj opinie", tags: ["hero", "testimonials"], industryTags: ["local-services", "restaurant"], styleTags: ["trust"] },
  { key: "luxury", name: "Hero premium/luxury", description: "Ekskluzywne hero z luksusową typografią.", title: "Wrażenie premium od pierwszego kontaktu", subtitle: "Stworzony dla marek high-end, biżuterii i designu.", cta: "Umów rozmowę", tags: ["hero", "luxury"], industryTags: ["jewelry", "luxury"], styleTags: ["luxury"] },
];

const OFFERING_VARIANTS: Record<string, FamilyVariant[]> = {
  services: createSeriesVariants(
    {
      key: "services",
      name: "Usługi",
      description: "Siatka usług z ikonami i opisami.",
      title: "Nasze usługi",
      subtitle: "Wyjaśnij zakres oferty w kilku kartach.",
      cta: "Poznaj usługi",
      tags: ["services"],
      industryTags: ["services"],
      styleTags: ["business"],
    },
    CORE_SERIES_THEMES
  ),
  pricing: createSeriesVariants(
    {
      key: "pricing",
      name: "Cennik",
      description: "Klasyczne pakiety cenowe.",
      title: "Cennik",
      subtitle: "Pokazuj pakiety i warianty cenowe.",
      cta: "Wybierz pakiet",
      tags: ["pricing"],
      industryTags: ["business"],
      styleTags: ["premium"],
    },
    CORE_SERIES_THEMES
  ),
  packages: [
    { key: "packages", name: "Pakiety", description: "Pakiety startowe, pro i premium.", title: "Pakiety dopasowane do potrzeb", subtitle: "Idealne do sprzedaży usług i abonamentów.", cta: "Porównaj pakiety", tags: ["packages"], industryTags: ["saas", "services"], styleTags: ["modern"] },
  ],
  comparison: [
    { key: "comparison", name: "Porównanie pakietów", description: "Tabela porównawcza z highlightem.", title: "Porównanie pakietów", subtitle: "Ułatwia decyzję na etapie wyboru oferty.", cta: "Porównaj", tags: ["comparison"], industryTags: ["saas", "services"], styleTags: ["technical"] },
  ],
  features: [
    { key: "features", name: "Funkcje", description: "Lista funkcji i możliwości produktu.", title: "Funkcje", subtitle: "Pokaż, co realnie dostaje użytkownik.", cta: "Sprawdź funkcje", tags: ["features"], industryTags: ["saas"], styleTags: ["startup"] },
  ],
  benefits: [
    { key: "benefits", name: "Korzyści", description: "Korzyści biznesowe i emocjonalne.", title: "Korzyści", subtitle: "Nie tylko funkcje, ale też rezultaty.", cta: "Zobacz korzyści", tags: ["benefits"], industryTags: ["business"], styleTags: ["editorial"] },
  ],
  process: [
    { key: "process", name: "Proces współpracy", description: "Kroki realizacji i onboarding.", title: "Proces współpracy", subtitle: "Transparentny proces podnosi zaufanie.", cta: "Jak pracujemy", tags: ["process"], industryTags: ["agency", "services"], styleTags: ["modern"] },
  ],
  cta: createSeriesVariants(
    {
      key: "cta",
      name: "Call to action",
      description: "Sekcja domykająca sprzedaż.",
      title: "Gotowy, by zacząć?",
      subtitle: "CTA z dwoma przyciskami i krótkim argumentem.",
      cta: "Napisz do nas",
      tags: ["cta"],
      industryTags: ["business"],
      styleTags: ["bold"],
    },
    CORE_SERIES_THEMES
  ),
  faq: createSeriesVariants(
    {
      key: "faq",
      name: "FAQ",
      description: "Pytania i odpowiedzi z akordeonem.",
      title: "FAQ",
      subtitle: "Usuń bariery decyzyjne.",
      cta: "Pokaż pytania",
      tags: ["faq"],
      industryTags: ["business"],
      styleTags: ["minimal"],
    },
    CORE_SERIES_THEMES
  ),
  testimonials: createSeriesVariants(
    {
      key: "testimonials",
      name: "Opinie klientów",
      description: "Recenzje i cytaty klientów.",
      title: "Opinie klientów",
      subtitle: "Pokaż social proof i cytaty z projektów.",
      cta: "Czytaj opinie",
      tags: ["testimonials"],
      industryTags: ["business"],
      styleTags: ["trust"],
    },
    CORE_SERIES_THEMES
  ),
  "case-study": [
    { key: "case-study", name: "Case study", description: "Studium przypadku z rezultatami.", title: "Case study", subtitle: "Pokazuje realne wyniki i przebieg współpracy.", cta: "Zobacz case study", tags: ["case-study"], industryTags: ["agency", "saas"], styleTags: ["technical"] },
  ],
  portfolio: [
    { key: "portfolio", name: "Portfolio", description: "Kafelki realizacji i projektów.", title: "Portfolio", subtitle: "Dla kreatywnych marek i freelancerów.", cta: "Zobacz projekty", tags: ["portfolio"], industryTags: ["portfolio"], styleTags: ["minimal"] },
  ],
  gallery: createSeriesVariants(
    {
      key: "gallery",
      name: "Galeria",
      description: "Galeria zdjęć lub realizacji.",
      title: "Galeria",
      subtitle: "Wizualna prezentacja produktów i miejsc.",
      cta: "Przeglądaj galerię",
      tags: ["gallery"],
      industryTags: ["restaurant", "hotel"],
      styleTags: ["visual"],
    },
    CORE_SERIES_THEMES
  ),
  team: [
    { key: "team", name: "Zespół", description: "Prezentacja ekspertów i twarzy marki.", title: "Zespół", subtitle: "Pokazuje ludzi stojących za marką.", cta: "Poznaj zespół", tags: ["team"], industryTags: ["agency", "medical"], styleTags: ["professional"] },
  ],
  contact: createSeriesVariants(
    {
      key: "contact",
      name: "Kontakt",
      description: "Sekcja kontaktowa z formularzem i danymi.",
      title: "Kontakt",
      subtitle: "Wygodny kontakt przez formularz lub telefon.",
      cta: "Napisz wiadomość",
      tags: ["contact"],
      industryTags: ["business", "local-services"],
      styleTags: ["responsive"],
    },
    CORE_SERIES_THEMES
  ),
  map: [
    { key: "map", name: "Mapa", description: "Adres, mapa i dane lokalne.", title: "Mapa dojazdu", subtitle: "Idealne dla lokalnych biznesów i miejsc usług.", cta: "Wyznacz trasę", tags: ["map"], industryTags: ["local-services"], styleTags: ["practical"] },
  ],
  forms: [
    { key: "forms", name: "Formularze", description: "Formularze kontaktowe i leadowe.", title: "Formularze", subtitle: "Sekcja nastawiona na konwersję leadów.", cta: "Wyślij formularz", tags: ["forms"], industryTags: ["business"], styleTags: ["conversion"] },
  ],
  newsletter: [
    { key: "newsletter", name: "Newsletter", description: "Zapis do newslettera i lead magnet.", title: "Newsletter", subtitle: "Buduj listę mailingową z wartościowym lead magnetem.", cta: "Zapisz mnie", tags: ["newsletter"], industryTags: ["blog", "saas"], styleTags: ["minimal"] },
  ],
  blog: [
    { key: "blog", name: "Blog", description: "Kafelki wpisów i archiwum.", title: "Blog", subtitle: "Aktualności, case studies i wiedza branżowa.", cta: "Czytaj blog", tags: ["blog"], industryTags: ["blog"], styleTags: ["editorial"] },
  ],
  footer: createSeriesVariants(
    {
      key: "footer",
      name: "Stopka",
      description: "Kompletna stopka z linkami i CTA.",
      title: "Stopka",
      subtitle: "Domknięcie strony z linkami i informacjami.",
      cta: "Powrót do góry",
      tags: ["footer"],
      industryTags: ["business"],
      styleTags: ["footer"],
    },
    CORE_SERIES_THEMES
  ),
};

const ECOMMERCE_VARIANTS: FamilyVariant[] = [
  { key: "products", name: "Lista produktów", description: "Katalog produktów z kartami i filtrami.", title: "Lista produktów", subtitle: "Pokaż produkty w przejrzystej siatce.", cta: "Przeglądaj produkty", tags: ["ecommerce", "products"], industryTags: ["ecommerce"], styleTags: ["shop"] },
  { key: "product-card", name: "Karta produktu", description: "Duża karta pojedynczego produktu.", title: "Karta produktu", subtitle: "Podkreśla cenę, zdjęcia i warianty.", cta: "Dodaj do koszyka", tags: ["ecommerce", "product"], industryTags: ["ecommerce"], styleTags: ["shop"] },
  { key: "categories", name: "Kategorie produktów", description: "Kategorie i podkategorie sklepu.", title: "Kategorie produktów", subtitle: "Pomaga klientom szybciej odnaleźć asortyment.", cta: "Zobacz kategorie", tags: ["categories"], industryTags: ["ecommerce"], styleTags: ["shop"] },
  { key: "bestsellers", name: "Bestsellery", description: "Produkty najlepiej sprzedające się.", title: "Bestsellery", subtitle: "Wspiera sprzedaż przez społeczny dowód słuszności.", cta: "Kup bestseller", tags: ["bestsellers"], industryTags: ["ecommerce"], styleTags: ["promo"] },
  { key: "promotions", name: "Promocje", description: "Sekcja z rabatami i promocjami.", title: "Promocje", subtitle: "Wyróżnij czasowe okazje i oferty specjalne.", cta: "Zobacz rabaty", tags: ["promotions"], industryTags: ["ecommerce"], styleTags: ["promo"] },
  { key: "cart-preview", name: "Koszyk preview", description: "Mini podgląd koszyka w sidebarze.", title: "Koszyk preview", subtitle: "Przyspiesza decyzję zakupową i podgląd wartości koszyka.", cta: "Przejdź do kasy", tags: ["cart"], industryTags: ["ecommerce"], styleTags: ["shop"] },
  { key: "reviews", name: "Opinie produktów", description: "Opinie i oceny dla produktu.", title: "Opinie produktów", subtitle: "Buduje zaufanie na poziomie kart produktu.", cta: "Czytaj opinie", tags: ["reviews"], industryTags: ["ecommerce"], styleTags: ["trust"] },
  { key: "banner", name: "Banery sprzedażowe", description: "Banery promujące kategorie i sezonowe akcje.", title: "Banery sprzedażowe", subtitle: "Idealne do wyróżniania kampanii sprzedażowych.", cta: "Sprawdź ofertę", tags: ["banner"], industryTags: ["ecommerce"], styleTags: ["promo"] },
  { key: "collections", name: "Kolekcje", description: "Wybrane kolekcje produktów.", title: "Kolekcje", subtitle: "Łatwo grupuj produkty wg linii i stylu.", cta: "Zobacz kolekcje", tags: ["collections"], industryTags: ["ecommerce"], styleTags: ["minimal"] },
  { key: "new", name: "Nowości", description: "Świeże produkty i nowości w katalogu.", title: "Nowości", subtitle: "Promuje nowe dostawy i premiery.", cta: "Nowe produkty", tags: ["new", "ecommerce"], industryTags: ["ecommerce"], styleTags: ["shop"] },
  { key: "featured", name: "Polecane", description: "Polecane produkty i top picks.", title: "Polecane", subtitle: "Sekcja do podbijania najważniejszych pozycji.", cta: "Sprawdź polecane", tags: ["featured"], industryTags: ["ecommerce"], styleTags: ["premium"] },
];

const SPECIAL_VARIANTS: FamilyVariant[] = [
  { key: "animated-bg", name: "Animowane tła", description: "Sekcja z dynamicznym tłem i blurem.", title: "Animowane tła", subtitle: "Wzmacnia nowoczesny i aktywny charakter strony.", cta: "Zobacz efekt", tags: ["animated-background"], industryTags: ["startup"], styleTags: ["animated"] },
  { key: "glassmorphism", name: "Glassmorphism", description: "Szkło, blur i lekkość UI.", title: "Glassmorphism", subtitle: "Świetne dla premium, SaaS i nowoczesnych layoutów.", cta: "Sprawdź szkło", tags: ["glassmorphism"], industryTags: ["saas", "startup"], styleTags: ["glass"] },
  { key: "dark-mode", name: "Dark mode", description: "Ciemna sekcja z wyraźnym kontrastem.", title: "Dark mode", subtitle: "Dla marek premium i technologicznych.", cta: "Tryb ciemny", tags: ["dark-mode"], industryTags: ["saas", "agency"], styleTags: ["dark"] },
  { key: "gradient", name: "Gradientowe", description: "Gradienty i miękkie przejścia.", title: "Gradientowe sekcje", subtitle: "Dodają energii i głębi wizualnej.", cta: "Sprawdź gradient", tags: ["gradient"], industryTags: ["creative"], styleTags: ["gradient"] },
  { key: "3d", name: "3D", description: "Sekcje z efektem przestrzeni 3D.", title: "3D section", subtitle: "Mocny akcent dla nowoczesnych projektów.", cta: "Zobacz 3D", tags: ["3d"], industryTags: ["startup", "creative"], styleTags: ["futuristic"] },
  { key: "scroll", name: "Efekty scroll", description: "Sekcje z reakcją na przewijanie.", title: "Scroll effects", subtitle: "Przyciąga uwagę na długich stronach.", cta: "Uruchom scroll", tags: ["scroll-effects"], industryTags: ["creative"], styleTags: ["animated"] },
  { key: "counters", name: "Liczniki", description: "Liczby i statystyki z animacją.", title: "Liczniki", subtitle: "Pokazuje skalę firmy lub efekt projektu.", cta: "Zobacz liczby", tags: ["counters"], industryTags: ["business"], styleTags: ["technical"] },
  { key: "timeline", name: "Timeline", description: "Oś czasu i historia marki.", title: "Timeline", subtitle: "Idealna do prezentacji historii projektu.", cta: "Oś czasu", tags: ["timeline"], industryTags: ["agency", "portfolio"], styleTags: ["editorial"] },
  { key: "comparison", name: "Porównania", description: "Sekcja porównawcza produktów lub pakietów.", title: "Porównania", subtitle: "Pomaga pokazać przewagi oferty.", cta: "Porównaj", tags: ["comparison"], industryTags: ["business"], styleTags: ["technical"] },
  { key: "before-after", name: "Przed / po", description: "Porównanie efektów przed i po.", title: "Przed / po", subtitle: "Świetne do beauty, renovation i UX.", cta: "Zobacz zmianę", tags: ["before-after"], industryTags: ["beauty", "construction"], styleTags: ["visual"] },
  { key: "icons", name: "Z ikonami", description: "Sekcje z dużym zestawem ikon.", title: "Sekcje z ikonami", subtitle: "Nadają treści lekkości i czytelności.", cta: "Zobacz ikony", tags: ["icons"], industryTags: ["business"], styleTags: ["minimal"] },
  { key: "typography", name: "Duża typografia", description: "Typograficzne sekcje z mocnym layoutem.", title: "Duża typografia", subtitle: "Dla marek śmiałych i rozpoznawalnych.", cta: "Poznaj styl", tags: ["typography"], industryTags: ["luxury", "portfolio"], styleTags: ["editorial"] },
];

function buildSections() {
  return [
    ...expandFamily(buildFamilyDefinition("menu-i-nawigacje", "Menu i nawigacje", "navbar", ["navbar", "menu", "navigation"], NAVBAR_VARIANTS, NAVBAR_STYLES, "https://github.com/themesberg/flowbite-react", "Themesberg")),
    ...expandFamily(buildFamilyDefinition("sekcje-hero", "Sekcje Hero", "hero", ["hero", "landing"], HERO_VARIANTS, HERO_STYLES, "https://github.com/", "Community")),
    ...Object.entries(OFFERING_VARIANTS).flatMap(([familyKey, variants]) =>
      expandFamily(
        buildFamilyDefinition(
          "sekcje-ofertowe",
          "Sekcje ofertowe",
          familyKey,
          ["offer", familyKey],
          variants,
          OFFERING_STYLES,
          "https://github.com/",
          "Community"
        )
      )
    ),
    ...expandFamily(buildFamilyDefinition("sekcje-ecommerce", "Sekcje e-commerce", "ecommerce", ["ecommerce", "shop"], ECOMMERCE_VARIANTS, ECOMMERCE_STYLES, "https://github.com/", "Community")),
    ...expandFamily(buildFamilyDefinition("sekcje-specjalne", "Sekcje specjalne", "special", ["special", "animated"], SPECIAL_VARIANTS, SPECIAL_STYLES, "https://github.com/", "Community")),
  ];
}

const seedSections: SectionRecord[] = buildSections();

const pageTemplates: SectionPageTemplate[] = [
  {
    id: "service-business",
    slug: "firma-uslugowa",
    name: "Szablon dla firmy usługowej",
    industry: "usługi",
    style: "nowoczesny",
    description: "Navbar, hero, usługi, proces, opinie, FAQ, kontakt i footer.",
    sectionIds: seedSections.filter((section) => ["navbar", "hero", "services", "process", "testimonials", "faq", "contact", "footer"].some((tag) => section.tags.includes(tag))).slice(0, 8).map((section) => section.id),
    seoTitle: "Firma usługowa | Nowoczesna strona",
    seoDescription: "Szablon strony usługowej z sekcjami pod konwersję i zaufanie.",
    thumbnailUrl: seedSections[0]?.thumbnailUrl ?? "",
    status: "active",
    isPremium: false,
  },
  {
    id: "shop-template",
    slug: "sklep-internetowy",
    name: "Szablon dla sklepu",
    industry: "sklep internetowy",
    style: "sklepowy",
    description: "Navbar sklepowy, hero, kategorie, bestsellery, nowości i footer.",
    sectionIds: seedSections.filter((section) => ["ecommerce"].some((tag) => section.tags.includes(tag))).slice(0, 8).map((section) => section.id),
    seoTitle: "Sklep internetowy | Sekcje ecommerce",
    seoDescription: "Pełny szablon sklepu z gotowymi sekcjami sprzedażowymi.",
    thumbnailUrl: seedSections.find((section) => section.tags.includes("ecommerce"))?.thumbnailUrl ?? "",
    status: "active",
    isPremium: false,
  },
  {
    id: "portfolio-template",
    slug: "portfolio",
    name: "Szablon dla portfolio",
    industry: "portfolio",
    style: "elegancki",
    description: "Navbar, hero, o mnie, projekty, proces, opinie, kontakt i footer.",
    sectionIds: seedSections.filter((section) => ["portfolio", "gallery", "testimonials", "contact", "footer"].some((tag) => section.tags.includes(tag))).slice(0, 8).map((section) => section.id),
    seoTitle: "Portfolio | Kompletna strona",
    seoDescription: "Szablon portfolio z sekcjami prezentującymi projekty i kontakt.",
    thumbnailUrl: seedSections.find((section) => section.tags.includes("portfolio"))?.thumbnailUrl ?? "",
    status: "active",
    isPremium: false,
  },
  {
    id: "saas-template",
    slug: "saas",
    name: "Szablon SaaS",
    industry: "SaaS",
    style: "startupowy",
    description: "Navbar SaaS, hero, funkcje, pricing, FAQ, kontakt i footer.",
    sectionIds: seedSections.filter((section) => ["saas", "features", "pricing", "faq", "contact", "footer"].some((tag) => section.tags.includes(tag))).slice(0, 8).map((section) => section.id),
    seoTitle: "SaaS | Szablon landing page",
    seoDescription: "Szablon SaaS nastawiony na prezentację funkcji i sprzedaż.",
    thumbnailUrl: seedSections.find((section) => section.tags.includes("saas"))?.thumbnailUrl ?? "",
    status: "active",
    isPremium: true,
  },
];

export { categories as SECTION_LIBRARY_CATEGORY_DATA };
export { seedSections as SECTION_LIBRARY_SEED_SECTIONS };
export { pageTemplates as SECTION_LIBRARY_PAGE_TEMPLATES };
export { SOURCES as SECTION_LIBRARY_SOURCES };
export { LICENSES as SECTION_LIBRARY_LICENSES };

export function getSectionLibrarySeeds() {
  return seedSections;
}

export function getSectionLibrarySources() {
  return SOURCES;
}

export function getSectionLibraryPageTemplates() {
  return pageTemplates;
}

export function getSectionLibraryLicenses() {
  return LICENSES;
}

export function getSectionLibraryCategories() {
  return categories;
}
