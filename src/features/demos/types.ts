import type { Json } from "@/types/database";

export const DEMO_STATUSES = [
  "draft",
  "generated",
  "sent",
  "viewed",
  "accepted",
  "revision_requested",
  "rejected",
  "inactive",
  "expired",
] as const;

export type DemoStatus = (typeof DEMO_STATUSES)[number];

export const DEMO_STATUS_LABELS: Record<DemoStatus, string> = {
  draft: "Szkic",
  generated: "Wygenerowane",
  sent: "Wysłane",
  viewed: "Obejrzane",
  accepted: "Zaakceptowane",
  revision_requested: "Do poprawy",
  rejected: "Odrzucone",
  inactive: "Nieaktywne",
  expired: "Wygasłe",
};

export const DEMO_INDUSTRIES = [
  "handmade",
  "handmade_jewelry",
  "soy_candles",
  "ceramics",
  "macrame",
  "beauty",
  "photography",
  "local_services",
  "restaurant",
  "fitness",
] as const;

export type DemoIndustry = (typeof DEMO_INDUSTRIES)[number];

export const DEMO_INDUSTRY_LABELS: Record<DemoIndustry, string> = {
  handmade: "Rękodzieło",
  handmade_jewelry: "Biżuteria handmade",
  soy_candles: "Świece sojowe",
  ceramics: "Ceramika",
  macrame: "Makrama",
  beauty: "Beauty",
  photography: "Fotografia",
  local_services: "Lokalne usługi",
  restaurant: "Restauracja",
  fitness: "Fitness",
};

export const DEMO_GENERATION_MODES = ["quick", "full", "premium", "publish"] as const;
export type DemoGenerationMode = (typeof DEMO_GENERATION_MODES)[number];
export const DEMO_GENERATION_MODE_LABELS: Record<DemoGenerationMode, string> = {
  quick: "Szybkie demo",
  full: "Pełne demo",
  premium: "Wersja premium",
  publish: "Gotowe do publikacji",
};
export const DEMO_GENERATION_MODE_DESC: Record<DemoGenerationMode, string> = {
  quick: "Krótszy prompt, mniej sekcji, szybsza generacja",
  full: "Kompletna strona — hero, usługi, opinie, FAQ, kontakt",
  premium: "Więcej sekcji, bogatsze treści, lepsze SEO",
  publish: "Zoptymalizowana pod wdrożenie — Vercel / eksport HTML",
};

export const DEMO_STYLES = [
  "premium",
  "minimal",
  "elegant",
  "modern",
  "natural",
  "dark_luxury",
  "soft_feminine",
  "creative",
] as const;

export type DemoStyle = (typeof DEMO_STYLES)[number];

export const DEMO_STYLE_LABELS: Record<DemoStyle, string> = {
  premium: "Premium",
  minimal: "Minimalistyczny",
  elegant: "Elegancki",
  modern: "Nowoczesny",
  natural: "Naturalny",
  dark_luxury: "Ciemny luksus",
  soft_feminine: "Delikatny kobiecy",
  creative: "Kreatywny",
};

export type DemoContentItem = {
  title: string;
  description: string;
  icon?: string;
};

export type DemoImage = {
  url: string;
  alt: string;
  description: string;
  provider: "pexels" | "pixabay" | "unsplash" | "placeholder";
  photographer?: string;
  sourceUrl?: string;
};

export type DemoSectionType =
  | "navigation"
  | "hero"
  | "about"
  | "services"
  | "features"
  | "gallery"
  | "process"
  | "testimonials"
  | "faq"
  | "cta"
  | "contact"
  | "footer";

export type DemoContent = {
  schemaVersion: 2;
  site: {
    name: string;
    language: string;
    style: string;
    colors: { primary: string; secondary: string; background: string; text: string };
  };
  navigation: {
    logoText: string;
    links: { label: string; href: string }[];
    cta: { label: string; href: string };
  };
  headings: Record<
    "services" | "features" | "process" | "testimonials" | "faq",
    { eyebrow: string; title: string; subtitle: string }
  >;
  hero: {
    eyebrow: string;
    title: string;
    subtitle: string;
    cta: string;
    primaryCta: { label: string; href: string };
    secondaryCta: { label: string; href: string };
    image: DemoImage;
  };
  about: { eyebrow: string; title: string; content: string; image: DemoImage };
  services: DemoContentItem[];
  features: DemoContentItem[];
  process: DemoContentItem[];
  gallery: {
    eyebrow: string;
    title: string;
    subtitle: string;
    items: DemoImage[];
  };
  testimonials: { name: string; role: string; content: string; image?: DemoImage }[];
  faq: { question: string; answer: string }[];
  cta: {
    eyebrow: string;
    title: string;
    description: string;
    primaryCta: { label: string; href: string };
    secondaryCta: { label: string; href: string };
  };
  contact: {
    eyebrow: string;
    title: string;
    description: string;
    cta: string;
    email: string | null;
    phone: string | null;
    address: string | null;
  };
  footer: {
    description: string;
    columns: { title: string; links: { label: string; href: string }[] }[];
    copyright: string;
  };
  seo: {
    title: string;
    description: string;
    keywords: string[];
    ogImage: DemoImage;
  };
  structure: { type: DemoSectionType; id: string; visible: boolean }[];
};

export type DemoClient = {
  first_name: string;
  last_name: string;
  company_name: string | null;
  email?: string | null;
};

export type DemoEstimate = {
  id: string;
  website_type: string;
  final_price: number | null;
};

export type Demo = {
  id: string;
  created_at: string;
  updated_at: string;
  client_id: string | null;
  estimate_id: string | null;
  slug: string;
  title: string;
  industry: DemoIndustry | null;
  style: DemoStyle | null;
  primary_color: string | null;
  secondary_color: string | null;
  logo_url: string | null;
  images: Json | null;
  content: Json | null;
  status: DemoStatus;
  is_active: boolean;
  views_count: number;
  sent_at: string | null;
  first_viewed_at: string | null;
  expires_at: string | null;
  generation_mode: DemoGenerationMode | null;
  last_ai_error: string | null;
  section_overrides: Json | null;
  clients?: DemoClient | null;
  estimates?: DemoEstimate | null;
};

export type DemoActivity = {
  id: string;
  created_at: string;
  action: string;
  description: string | null;
  metadata: Json | null;
};

export type ClientOption = {
  id: string;
  label: string;
  companyName: string;
};

export type EstimateOption = {
  id: string;
  client_id: string | null;
  label: string;
};

export function getDemoClientLabel(client?: DemoClient | null) {
  if (!client) return "—";
  const name = [client.first_name, client.last_name].filter(Boolean).join(" ");
  return client.company_name || name || "—";
}

export function parseDemoContent(json: Json | null | undefined): DemoContent {
  if (!json || typeof json !== "object" || Array.isArray(json)) {
    return defaultDemoContent;
  }
  const input = json as Partial<DemoContent>;
  return {
    ...defaultDemoContent,
    ...input,
    site: { ...defaultDemoContent.site, ...input.site },
    navigation: { ...defaultDemoContent.navigation, ...input.navigation },
    headings: { ...defaultDemoContent.headings, ...input.headings },
    hero: { ...defaultDemoContent.hero, ...input.hero },
    about: { ...defaultDemoContent.about, ...input.about },
    gallery: { ...defaultDemoContent.gallery, ...input.gallery },
    cta: { ...defaultDemoContent.cta, ...input.cta },
    contact: { ...defaultDemoContent.contact, ...input.contact },
    footer: { ...defaultDemoContent.footer, ...input.footer },
    seo: { ...defaultDemoContent.seo, ...input.seo },
  };
}

export function parseDemoImages(json: Json | null | undefined): string[] {
  if (!Array.isArray(json)) return [];
  return json.filter((item): item is string => typeof item === "string" && item.trim().length > 0);
}

export const defaultDemoContent: DemoContent = {
  schemaVersion: 2,
  site: {
    name: "Luna Atelier",
    language: "pl",
    style: "natural",
    colors: {
      primary: "#8f6f58",
      secondary: "#d8c4ae",
      background: "#fbf8f3",
      text: "#24201d",
    },
  },
  navigation: {
    logoText: "Luna Atelier",
    links: [
      { label: "O nas", href: "#o-nas" },
      { label: "Usługi", href: "#uslugi" },
      { label: "Galeria", href: "#galeria" },
      { label: "FAQ", href: "#faq" },
    ],
    cta: { label: "Kontakt", href: "#kontakt" },
  },
  headings: {
    services: {
      eyebrow: "Oferta",
      title: "Rzeczy tworzone z myślą o ważnych momentach",
      subtitle: "Wybierz gotowy projekt albo opowiedz o własnym pomyśle.",
    },
    features: {
      eyebrow: "Dlaczego warto",
      title: "Uważność widoczna w każdym detalu",
      subtitle: "Materiały, proces i oprawa tworzą jedno spójne doświadczenie.",
    },
    process: {
      eyebrow: "Proces",
      title: "Od inspiracji do gotowego projektu",
      subtitle: "Prosta, spokojna droga z jasnym kolejnym krokiem.",
    },
    testimonials: {
      eyebrow: "Opinie",
      title: "Historie osób, które wybrały pracownię",
      subtitle: "Przykładowe wypowiedzi pokazujące charakter współpracy.",
    },
    faq: {
      eyebrow: "FAQ",
      title: "Najczęściej zadawane pytania",
      subtitle: "Wszystko, co warto wiedzieć przed złożeniem zamówienia.",
    },
  },
  hero: {
    eyebrow: "Autorska pracownia",
    title: "Biżuteria tworzona spokojnym rytmem natury",
    subtitle:
      "Autorskie kolczyki, naszyjniki i pierścionki z kamieni naturalnych, projektowane w krótkich seriach dla kobiet, które lubią rzeczy z duszą.",
    cta: "Zobacz kolekcję",
    primaryCta: { label: "Zobacz kolekcję", href: "#uslugi" },
    secondaryCta: { label: "Poznaj pracownię", href: "#o-nas" },
    image: {
      url: "",
      alt: "Ręcznie tworzona biżuteria z naturalnych materiałów",
      description: "Detal autorskiej biżuterii w miękkim, naturalnym świetle",
      provider: "placeholder",
    },
  },
  about: {
    eyebrow: "O pracowni",
    title: "Mała pracownia, wielka uważność",
    content:
      "Każdy projekt powstaje ręcznie: od wyboru kamieni, przez dobór proporcji, aż po ostatni detal wykończenia. Dzięki temu biżuteria jest lekka, trwała i naprawdę osobista.",
    image: {
      url: "",
      alt: "Praca nad biżuterią w kameralnej pracowni",
      description: "Rzemieślniczka podczas pracy w jasnej, spokojnej pracowni",
      provider: "placeholder",
    },
  },
  services: [
    {
      title: "Kolekcje autorskie",
      description: "Gotowe modele w krótkich seriach, dostępne sezonowo i pakowane prezentowo.",
    },
    {
      title: "Biżuteria na zamówienie",
      description: "Indywidualny projekt dobrany do okazji, stylu i ulubionych materiałów klientki.",
    },
    {
      title: "Prezent z dedykacją",
      description: "Eleganckie opakowanie, bilecik i pomoc w wyborze modelu dla bliskiej osoby.",
    },
  ],
  features: [
    { title: "Kamienie naturalne", description: "Selekcjonowane odcienie, faktury i subtelne nieregularności." },
    { title: "Krótkie serie", description: "Mniej powtarzalności, więcej charakteru i poczucia wyjątkowości." },
    { title: "Delikatne wykończenie", description: "Komfort noszenia i estetyka dopracowana w każdym detalu." },
  ],
  process: [
    { title: "Wybór inspiracji", description: "Rozmawiamy o kolorach, okazji i stylu osoby, która będzie nosić biżuterię." },
    { title: "Projekt i dobór materiałów", description: "Powstaje kompozycja, a każdy kamień trafia na swoje miejsce." },
    { title: "Ręczne wykonanie", description: "Biżuteria jest składana, testowana i przygotowywana do wysyłki." },
  ],
  gallery: {
    eyebrow: "Galeria",
    title: "Zobacz detale",
    subtitle: "Wybrane projekty i kadry z pracowni.",
    items: [
      {
        url: "",
        alt: "Detal ręcznie wykonanej biżuterii",
        description: "Makro detal produktu na neutralnym tle",
        provider: "placeholder",
      },
      {
        url: "",
        alt: "Naturalne materiały używane w pracowni",
        description: "Kamienie i narzędzia ułożone na stole rzemieślniczym",
        provider: "placeholder",
      },
      {
        url: "",
        alt: "Gotowa kolekcja biżuterii",
        description: "Spójna kolekcja produktów w naturalnej aranżacji",
        provider: "placeholder",
      },
    ],
  },
  testimonials: [
    { name: "Karolina", role: "Klientka pracowni", content: "Naszyjnik wygląda jeszcze piękniej na żywo. Czuć w nim ręczną pracę i spokój." },
    { name: "Magda", role: "Klientka pracowni", content: "Świetny kontakt, piękne opakowanie i projekt dokładnie taki, jak sobie wymarzyłam." },
  ],
  faq: [
    { question: "Czy mogę zamówić zmianę koloru kamieni?", answer: "Tak, przy zamówieniach indywidualnych dobieramy kolorystykę i materiały do Twoich preferencji." },
    { question: "Ile trwa realizacja?", answer: "Gotowe modele wysyłane są zwykle w 2-3 dni robocze, a projekty na zamówienie w 7-14 dni." },
    { question: "Czy biżuteria jest pakowana na prezent?", answer: "Tak, każde zamówienie otrzymuje eleganckie pudełko i może mieć bilecik z dedykacją." },
  ],
  cta: {
    eyebrow: "Twój pomysł",
    title: "Biżuteria, która opowiada Twoją historię",
    description: "Porozmawiajmy o kolorach, okazji i detalach ważnych właśnie dla Ciebie.",
    primaryCta: { label: "Napisz do pracowni", href: "#kontakt" },
    secondaryCta: { label: "Zobacz galerię", href: "#galeria" },
  },
  contact: {
    eyebrow: "Kontakt",
    title: "Stwórzmy coś delikatnego i osobistego",
    description:
      "Napisz, jeśli szukasz gotowego modelu, prezentu albo biżuterii zaprojektowanej specjalnie dla Ciebie.",
    cta: "Napisz do pracowni",
    email: null,
    phone: null,
    address: null,
  },
  footer: {
    description: "Autorska biżuteria tworzona ręcznie w krótkich seriach.",
    columns: [
      {
        title: "Strona",
        links: [
          { label: "O nas", href: "#o-nas" },
          { label: "Usługi", href: "#uslugi" },
          { label: "Kontakt", href: "#kontakt" },
        ],
      },
    ],
    copyright: "© 2026 Luna Atelier. Wszelkie prawa zastrzeżone.",
  },
  seo: {
    title: "Biżuteria handmade z kamieni naturalnych",
    description: "Premium demo strony dla pracowni biżuterii handmade.",
    keywords: ["biżuteria handmade", "kamienie naturalne", "autorska biżuteria"],
    ogImage: {
      url: "",
      alt: "Autorska biżuteria Luna Atelier",
      description: "Reprezentacyjny kadr kolekcji do udostępniania w social media",
      provider: "placeholder",
    },
  },
  structure: [
    { type: "navigation", id: "nawigacja", visible: true },
    { type: "hero", id: "start", visible: true },
    { type: "about", id: "o-nas", visible: true },
    { type: "services", id: "uslugi", visible: true },
    { type: "features", id: "wyrozniki", visible: true },
    { type: "gallery", id: "galeria", visible: true },
    { type: "process", id: "proces", visible: true },
    { type: "testimonials", id: "opinie", visible: true },
    { type: "faq", id: "faq", visible: true },
    { type: "cta", id: "cta", visible: true },
    { type: "contact", id: "kontakt", visible: true },
    { type: "footer", id: "stopka", visible: true },
  ],
};
