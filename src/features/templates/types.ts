import type { BuilderComponent, BuilderPageSettings } from "@/features/builder/types";

export const TEMPLATE_GROUPS = [
  "handmade",
  "beauty",
  "restaurant",
  "services",
  "medical",
  "creative",
  "ecommerce",
  "one-page",
  "link-in-bio",
  "digital-card",
] as const;

export type TemplateGroup = (typeof TEMPLATE_GROUPS)[number];

export type TemplateColors = {
  primary: string;
  secondary: string;
  accent: string;
  neutral: string;
  dark: string;
  light: string;
};

export const TEMPLATE_WEBSITE_TYPES = [
  "digital-card",
  "link-in-bio",
  "one-page",
  "business-website",
  "mini-shop",
  "online-shop",
] as const;

export type TemplateWebsiteType = (typeof TEMPLATE_WEBSITE_TYPES)[number];

export const TEMPLATE_WEBSITE_TYPE_LABELS: Record<TemplateWebsiteType, string> = {
  "digital-card": "Cyfrowa wizytówka",
  "link-in-bio": "Link w bio",
  "one-page": "One page",
  "business-website": "Strona firmowa",
  "mini-shop": "Mini sklep handmade",
  "online-shop": "Sklep online",
};

export type TemplateDefinition = {
  id: string;
  name: string;
  industry: string;
  group: TemplateGroup;
  websiteType: TemplateWebsiteType;
  priceFrom: number;
  previewImages: string[];
  imageQuery: string;
  summary: string;
  style: string;
  tags: string[];
  rating: number;
  featured?: boolean;
  colors: TemplateColors;
  fonts: { heading: string; body: string };
  animations: string[];
  sections: string[];
  copy: {
    eyebrow: string;
    heroTitle: string;
    heroSubtitle: string;
    aboutTitle: string;
    aboutText: string;
    services: string[];
    ctaTitle: string;
  };
};

export type ResolvedTemplate = TemplateDefinition & {
  components: BuilderComponent[];
  settings: BuilderPageSettings;
};
