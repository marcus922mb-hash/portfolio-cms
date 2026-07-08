import { z } from "zod";
import {
  DEMO_INDUSTRIES,
  DEMO_STATUSES,
  DEMO_STYLES,
  DEMO_GENERATION_MODES,
  defaultDemoContent,
} from "@/features/demos/types";

const hexColor = z
  .string()
  .trim()
  .regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, "Podaj kolor w formacie HEX, np. #c9a96e")
  .or(z.literal(""))
  .optional();

const contentItemSchema = z.object({
  title: z.string(),
  description: z.string(),
  icon: z.string().optional(),
});

const linkSchema = z.object({
  label: z.string(),
  href: z.string(),
});

const imageSchema = z.object({
  url: z.string(),
  alt: z.string(),
  description: z.string(),
  provider: z.enum(["pexels", "pixabay", "unsplash", "placeholder"]),
  photographer: z.string().optional(),
  sourceUrl: z.string().optional(),
});

export const demoContentSchema = z.object({
  schemaVersion: z.literal(2),
  site: z.object({
    name: z.string(),
    language: z.string(),
    style: z.string(),
    colors: z.object({
      primary: z.string(),
      secondary: z.string(),
      background: z.string(),
      text: z.string(),
    }),
  }),
  navigation: z.object({
    logoText: z.string(),
    links: z.array(linkSchema),
    cta: linkSchema,
  }),
  headings: z.record(
    z.enum(["services", "features", "process", "testimonials", "faq"]),
    z.object({
      eyebrow: z.string(),
      title: z.string(),
      subtitle: z.string(),
    })
  ),
  hero: z.object({
    eyebrow: z.string(),
    title: z.string(),
    subtitle: z.string(),
    cta: z.string(),
    primaryCta: linkSchema,
    secondaryCta: linkSchema,
    image: imageSchema,
  }),
  about: z.object({
    eyebrow: z.string(),
    title: z.string(),
    content: z.string(),
    image: imageSchema,
  }),
  services: z.array(contentItemSchema),
  features: z.array(contentItemSchema),
  process: z.array(contentItemSchema),
  gallery: z.object({
    eyebrow: z.string(),
    title: z.string(),
    subtitle: z.string(),
    items: z.array(imageSchema),
  }),
  testimonials: z.array(
    z.object({
      name: z.string(),
      role: z.string(),
      content: z.string(),
      image: imageSchema.optional(),
    })
  ),
  faq: z.array(z.object({ question: z.string(), answer: z.string() })),
  cta: z.object({
    eyebrow: z.string(),
    title: z.string(),
    description: z.string(),
    primaryCta: linkSchema,
    secondaryCta: linkSchema,
  }),
  contact: z.object({
    eyebrow: z.string(),
    title: z.string(),
    description: z.string(),
    cta: z.string(),
    email: z.string().nullable(),
    phone: z.string().nullable(),
    address: z.string().nullable(),
  }),
  footer: z.object({
    description: z.string(),
    columns: z.array(
      z.object({
        title: z.string(),
        links: z.array(linkSchema),
      })
    ),
    copyright: z.string(),
  }),
  seo: z.object({
    title: z.string(),
    description: z.string(),
    keywords: z.array(z.string()),
    ogImage: imageSchema,
  }),
  structure: z.array(
    z.object({
      type: z.enum([
        "navigation",
        "hero",
        "about",
        "services",
        "features",
        "gallery",
        "process",
        "testimonials",
        "faq",
        "cta",
        "contact",
        "footer",
      ]),
      id: z.string(),
      visible: z.boolean(),
    })
  ),
});

export const DemoGeneratedContentSchema = demoContentSchema;

export const demoFormSchema = z.object({
  client_id: z.string().uuid("Wybierz klienta."),
  estimate_id: z.string().uuid().or(z.literal("")).optional(),
  title: z.string().trim().min(1, "Tytuł demo jest wymagany."),
  slug: z
    .string()
    .trim()
    .min(1, "Slug jest wymagany.")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Użyj małych liter, cyfr i myślników."),
  industry: z.enum(DEMO_INDUSTRIES, { message: "Wybierz branżę." }),
  style: z.enum(DEMO_STYLES, { message: "Wybierz styl." }),
  primary_color: hexColor,
  secondary_color: hexColor,
  logo_url: z.string().trim().url("Podaj poprawny adres URL.").or(z.literal("")).optional(),
  images_text: z.string().optional(),
  generation_mode: z.enum(DEMO_GENERATION_MODES).optional(),
  status: z.enum(DEMO_STATUSES, { message: "Wybierz poprawny status." }),
  is_active: z.string().optional(),
  expires_at: z.string().optional(),
  hero_title: z.string().optional(),
  hero_subtitle: z.string().optional(),
  hero_cta: z.string().optional(),
  about_title: z.string().optional(),
  about_content: z.string().optional(),
  services_text: z.string().optional(),
  features_text: z.string().optional(),
  process_text: z.string().optional(),
  testimonials_text: z.string().optional(),
  faq_text: z.string().optional(),
  contact_title: z.string().optional(),
  contact_description: z.string().optional(),
  contact_cta: z.string().optional(),
  seo_title: z.string().optional(),
  seo_description: z.string().optional(),
});

export type DemoFormInput = z.infer<typeof demoFormSchema>;

function parseLines(value: string | undefined, fallback: { title: string; description: string }[]) {
  const rows = (value ?? "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [title, ...rest] = line.split("|");
      return {
        title: title?.trim() ?? "",
        description: rest.join("|").trim(),
      };
    })
    .filter((item) => item.title || item.description);

  return rows.length ? rows : fallback;
}

function parseTestimonials(value: string | undefined) {
  const rows = (value ?? "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [name, ...rest] = line.split("|");
      return {
        name: name?.trim() ?? "",
        role: "Klient",
        content: rest.join("|").trim(),
      };
    })
    .filter((item) => item.name || item.content);

  return rows.length ? rows : defaultDemoContent.testimonials;
}

function parseFaq(value: string | undefined) {
  const rows = (value ?? "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [question, ...rest] = line.split("|");
      return { question: question?.trim() ?? "", answer: rest.join("|").trim() };
    })
    .filter((item) => item.question || item.answer);

  return rows.length ? rows : defaultDemoContent.faq;
}

export function buildDemoContent(input: DemoFormInput) {
  const content = {
    ...defaultDemoContent,
    site: {
      ...defaultDemoContent.site,
      name: input.title,
      style: input.style,
      colors: {
        ...defaultDemoContent.site.colors,
        primary: input.primary_color || defaultDemoContent.site.colors.primary,
        secondary: input.secondary_color || defaultDemoContent.site.colors.secondary,
      },
    },
    navigation: {
      ...defaultDemoContent.navigation,
      logoText: input.title,
    },
    hero: {
      ...defaultDemoContent.hero,
      title: input.hero_title || defaultDemoContent.hero.title,
      subtitle: input.hero_subtitle || defaultDemoContent.hero.subtitle,
      cta: input.hero_cta || defaultDemoContent.hero.cta,
      primaryCta: {
        ...defaultDemoContent.hero.primaryCta,
        label: input.hero_cta || defaultDemoContent.hero.primaryCta.label,
      },
    },
    about: {
      ...defaultDemoContent.about,
      title: input.about_title || defaultDemoContent.about.title,
      content: input.about_content || defaultDemoContent.about.content,
    },
    services: parseLines(input.services_text, defaultDemoContent.services),
    features: parseLines(input.features_text, defaultDemoContent.features),
    process: parseLines(input.process_text, defaultDemoContent.process),
    testimonials: parseTestimonials(input.testimonials_text),
    faq: parseFaq(input.faq_text),
    contact: {
      ...defaultDemoContent.contact,
      title: input.contact_title || defaultDemoContent.contact.title,
      description: input.contact_description || defaultDemoContent.contact.description,
      cta: input.contact_cta || defaultDemoContent.contact.cta,
    },
    seo: {
      ...defaultDemoContent.seo,
      title: input.seo_title || input.title,
      description: input.seo_description || defaultDemoContent.seo.description,
    },
  };

  return demoContentSchema.parse(content);
}

export function parseImagesText(value: string | undefined) {
  return (value ?? "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

export function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/ł/g, "l")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-")
    .slice(0, 80);
}
