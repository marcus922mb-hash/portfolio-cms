import { z } from "zod";
import { demoContentSchema } from "@/features/demos/schemas/demo-schema";
import {
  buildDemoContentPrompt,
  DEMO_CONTENT_SYSTEM_PROMPT,
} from "@/lib/ai/prompts";
import type { AIProgressReporter } from "@/lib/ai/progress";
import { aiRouter } from "@/lib/ai/router";
import { imageService } from "@/lib/images";
import type { ImageSearchProgressEvent } from "@/lib/images";
import type {
  AIProvider,
  GenerateDemoContentInput,
  GenerateDemoContentOutput,
} from "@/lib/ai/types";

export class AIJsonParseError extends Error {
  constructor(message = "AI zwróciło niepoprawny JSON.") {
    super(message);
    this.name = "AIJsonParseError";
  }
}

export function extractJsonObject(rawText: string) {
  const trimmed = rawText.trim();
  const withoutFence = trimmed
    .replace(/^```(?:json)?/i, "")
    .replace(/```$/i, "")
    .trim();

  if (withoutFence.startsWith("{")) return withoutFence;

  const start = withoutFence.indexOf("{");
  const end = withoutFence.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) {
    throw new AIJsonParseError();
  }

  return withoutFence.slice(start, end + 1);
}

const VALID_PROVIDERS = ["pexels", "pixabay", "unsplash", "placeholder"] as const;
const VALID_STRUCTURE_TYPES = [
  "navigation","hero","about","services","features","gallery",
  "process","testimonials","faq","cta","contact","footer",
] as const;
const DEFAULT_HEADING = { eyebrow: "", title: "", subtitle: "" };
const DEFAULT_IMAGE = { url: "", alt: "", description: "", provider: "placeholder" as const };

function fixImage(img: unknown) {
  if (typeof img !== "object" || img === null) return DEFAULT_IMAGE;
  const i = img as Record<string, unknown>;
  return {
    url: typeof i.url === "string" ? i.url : "",
    alt: typeof i.alt === "string" ? i.alt : "",
    description: typeof i.description === "string" ? i.description : "",
    provider: VALID_PROVIDERS.includes(i.provider as (typeof VALID_PROVIDERS)[number])
      ? (i.provider as (typeof VALID_PROVIDERS)[number])
      : "placeholder",
    ...(typeof i.photographer === "string" && { photographer: i.photographer }),
    ...(typeof i.sourceUrl === "string" && { sourceUrl: i.sourceUrl }),
  };
}

function fixHeading(h: unknown) {
  if (typeof h !== "object" || h === null) return DEFAULT_HEADING;
  const hh = h as Record<string, unknown>;
  return {
    eyebrow: typeof hh.eyebrow === "string" ? hh.eyebrow : "",
    title: typeof hh.title === "string" ? hh.title : "",
    subtitle: typeof hh.subtitle === "string" ? hh.subtitle : "",
  };
}

function str(v: unknown, fallback = ""): string {
  return typeof v === "string" ? v : fallback;
}

function fixLink(v: unknown, defaultHref = "#"): { label: string; href: string } {
  if (typeof v !== "object" || v === null) return { label: "", href: defaultHref };
  const l = v as Record<string, unknown>;
  return {
    label: str(l.label ?? l.text ?? l.name ?? l.title),
    href: str(l.href ?? l.url ?? l.link, defaultHref),
  };
}

function fixLinks(arr: unknown): Array<{ label: string; href: string }> {
  if (!Array.isArray(arr)) return [];
  return arr.map((item) => fixLink(item));
}

function fixColors(c: unknown): { primary: string; secondary: string; background: string; text: string } {
  const d = { primary: "#000000", secondary: "#000000", background: "#ffffff", text: "#111111" };
  if (typeof c !== "object" || c === null) return d;
  const cc = c as Record<string, unknown>;
  return {
    primary: str(cc.primary, d.primary),
    secondary: str(cc.secondary, d.secondary),
    background: str(cc.background ?? cc.bg ?? cc.backgroundColor, d.background),
    text: str(cc.text ?? cc.foreground ?? cc.textColor, d.text),
  };
}

function fixContentItems(arr: unknown): Array<{ title: string; description: string; icon?: string }> {
  if (!Array.isArray(arr)) return [];
  return arr.map((item: unknown) => {
    if (typeof item !== "object" || item === null) return { title: "", description: "" };
    const it = item as Record<string, unknown>;
    return {
      title: str(it.title ?? it.name ?? it.heading),
      description: str(it.description ?? it.content ?? it.text ?? it.body ?? it.summary),
      ...(typeof it.icon === "string" && { icon: it.icon }),
    };
  });
}

// Fixes all known AI output quirks before Zod validation
function normalizeAiOutput(raw: Record<string, unknown>): Record<string, unknown> {
  raw.schemaVersion = 2;

  // site
  const site = (typeof raw.site === "object" && raw.site !== null)
    ? raw.site as Record<string, unknown>
    : {};
  site.name = str(site.name);
  site.language = str(site.language, "pl");
  site.style = str(site.style);
  site.colors = fixColors(site.colors);
  raw.site = site;

  // navigation
  const nav = (typeof raw.navigation === "object" && raw.navigation !== null)
    ? raw.navigation as Record<string, unknown>
    : {};
  nav.logoText = str(nav.logoText ?? nav.logo ?? nav.brand);
  nav.links = fixLinks(nav.links ?? nav.items ?? nav.menu);
  nav.cta = fixLink(nav.cta ?? nav.ctaButton ?? nav.button, "#kontakt");
  raw.navigation = nav;

  // headings
  const HEADING_KEYS = ["services", "features", "process", "testimonials", "faq"] as const;
  const headings = (typeof raw.headings === "object" && raw.headings !== null)
    ? raw.headings as Record<string, unknown>
    : {};
  const fixedHeadings: Record<string, unknown> = {};
  for (const key of HEADING_KEYS) {
    fixedHeadings[key] = fixHeading(headings[key]);
  }
  raw.headings = fixedHeadings;

  // hero
  const hero = (typeof raw.hero === "object" && raw.hero !== null)
    ? raw.hero as Record<string, unknown>
    : {};
  hero.eyebrow = str(hero.eyebrow ?? hero.badge ?? hero.tag);
  hero.title = str(hero.title ?? hero.heading ?? hero.h1);
  hero.subtitle = str(hero.subtitle ?? hero.description ?? hero.subheading ?? hero.tagline);
  hero.cta = str(hero.cta ?? hero.ctaText ?? hero.buttonText);
  hero.primaryCta = fixLink(hero.primaryCta ?? hero.cta_primary ?? hero.ctaPrimary ?? { label: hero.cta, href: "#kontakt" }, "#kontakt");
  hero.secondaryCta = fixLink(hero.secondaryCta ?? hero.cta_secondary ?? hero.ctaSecondary, "#o-nas");
  hero.image = fixImage(hero.image ?? hero.backgroundImage ?? hero.bg);
  raw.hero = hero;

  // about
  const about = (typeof raw.about === "object" && raw.about !== null)
    ? raw.about as Record<string, unknown>
    : {};
  about.eyebrow = str(about.eyebrow ?? about.badge);
  about.title = str(about.title ?? about.heading);
  about.content = str(about.content ?? about.description ?? about.text ?? about.body);
  about.image = fixImage(about.image ?? about.photo);
  raw.about = about;

  // services, features, process — normalize items
  for (const key of ["services", "features", "process"] as const) {
    raw[key] = fixContentItems(raw[key]);
  }

  // gallery
  const gallery = (typeof raw.gallery === "object" && raw.gallery !== null)
    ? raw.gallery as Record<string, unknown>
    : {};
  gallery.eyebrow = str(gallery.eyebrow ?? gallery.badge);
  gallery.title = str(gallery.title ?? gallery.heading);
  gallery.subtitle = str(gallery.subtitle ?? gallery.description);
  gallery.items = Array.isArray(gallery.items) ? gallery.items.map(fixImage) : [];
  raw.gallery = gallery;

  // testimonials
  if (Array.isArray(raw.testimonials)) {
    raw.testimonials = raw.testimonials.map((t: unknown) => {
      if (typeof t !== "object" || t === null) return t;
      const tt = t as Record<string, unknown>;
      return {
        name: str(tt.name ?? tt.author ?? tt.person),
        role: str(tt.role ?? tt.position ?? tt.title ?? tt.company),
        content: str(tt.content ?? tt.quote ?? tt.text ?? tt.review ?? tt.testimonial ?? tt.body),
        ...(tt.image !== undefined && { image: fixImage(tt.image) }),
      };
    });
  } else {
    raw.testimonials = [];
  }

  // faq
  if (Array.isArray(raw.faq)) {
    raw.faq = raw.faq.map((item: unknown) => {
      if (typeof item !== "object" || item === null) return { question: "", answer: "" };
      const f = item as Record<string, unknown>;
      return {
        question: str(f.question ?? f.q ?? f.title),
        answer: str(f.answer ?? f.a ?? f.content ?? f.text ?? f.response),
      };
    });
  } else {
    raw.faq = [];
  }

  // cta section
  const cta = (typeof raw.cta === "object" && raw.cta !== null)
    ? raw.cta as Record<string, unknown>
    : {};
  cta.eyebrow = str(cta.eyebrow ?? cta.badge);
  cta.title = str(cta.title ?? cta.heading);
  cta.description = str(cta.description ?? cta.subtitle ?? cta.content ?? cta.text);
  cta.primaryCta = fixLink(cta.primaryCta ?? cta.cta_primary ?? cta.button, "#kontakt");
  cta.secondaryCta = fixLink(cta.secondaryCta ?? cta.cta_secondary, "#galeria");
  raw.cta = cta;

  // contact
  const contact = (typeof raw.contact === "object" && raw.contact !== null)
    ? raw.contact as Record<string, unknown>
    : {};
  contact.eyebrow = str(contact.eyebrow ?? contact.badge);
  contact.title = str(contact.title ?? contact.heading);
  contact.description = str(contact.description ?? contact.subtitle ?? contact.content);
  contact.cta = str(contact.cta ?? contact.ctaText ?? contact.buttonText);
  contact.email = typeof contact.email === "string" ? contact.email || null : null;
  contact.phone = typeof contact.phone === "string" ? contact.phone || null : null;
  contact.address = typeof contact.address === "string" ? contact.address || null : null;
  raw.contact = contact;

  // footer
  const footer = (typeof raw.footer === "object" && raw.footer !== null)
    ? raw.footer as Record<string, unknown>
    : {};
  footer.description = str(footer.description ?? footer.tagline ?? footer.about);
  footer.copyright = str(footer.copyright ?? footer.rights);
  if (!Array.isArray(footer.columns)) footer.columns = [];
  footer.columns = (footer.columns as unknown[]).map((col: unknown) => {
    if (typeof col !== "object" || col === null) return { title: "", links: [] };
    const c = col as Record<string, unknown>;
    return {
      title: str(c.title ?? c.heading ?? c.name),
      links: fixLinks(c.links ?? c.items),
    };
  });
  raw.footer = footer;

  // seo
  const seo = (typeof raw.seo === "object" && raw.seo !== null)
    ? raw.seo as Record<string, unknown>
    : {};
  seo.title = str(seo.title);
  seo.description = str(seo.description);
  seo.keywords = Array.isArray(seo.keywords) ? seo.keywords.map((k: unknown) => str(k)) : [];
  seo.ogImage = fixImage(seo.ogImage ?? seo.og_image ?? seo.image);
  raw.seo = seo;

  // structure
  if (Array.isArray(raw.structure)) {
    raw.structure = raw.structure
      .filter((s: unknown) =>
        typeof s === "object" && s !== null &&
        VALID_STRUCTURE_TYPES.includes((s as Record<string, unknown>).type as (typeof VALID_STRUCTURE_TYPES)[number])
      )
      .map((s: unknown) => {
        const item = s as Record<string, unknown>;
        return {
          type: item.type,
          id: str(item.id ?? item.sectionId ?? item.name, String(item.type)),
          visible: item.visible !== false,
        };
      });
  } else {
    raw.structure = VALID_STRUCTURE_TYPES.map((type) => ({ type, id: type, visible: true }));
  }

  return raw;
}

export function parseGeneratedDemoContent(rawText: string) {
  try {
    const parsed = JSON.parse(extractJsonObject(rawText));
    const normalized = normalizeAiOutput(parsed as Record<string, unknown>);
    const result = demoContentSchema.safeParse(normalized);
    if (!result.success) {
      const allPaths = result.error.issues
        .slice(0, 8)
        .map((i) => `${i.path?.join(".") ?? "?"}: ${i.message}`)
        .join(" | ");
      console.error("[parseGeneratedDemoContent] Zod validation failed:", allPaths);
      console.error("[parseGeneratedDemoContent] Normalized keys:", Object.keys(normalized));
      throw new AIJsonParseError(`AI zwróciło niepoprawną strukturę JSON. Pola: ${allPaths}`);
    }
    return result.data;
  } catch (error) {
    if (error instanceof AIJsonParseError) throw error;
    const msg = error instanceof Error ? error.message : String(error);
    console.error("[parseGeneratedDemoContent] Unexpected error:", msg);
    throw new AIJsonParseError(`AI zwróciło JSON, ale struktura treści jest niepoprawna. (${msg})`);
  }
}

export async function generateDemoContent(
  input: GenerateDemoContentInput,
  options?: {
    preferredProvider?: AIProvider;
    preferredModel?: string;
    onProgress?: AIProgressReporter;
    onAttemptStart?: (
      provider: AIProvider,
      model: string,
      prompt: string,
      attempt: number
    ) => Promise<string | null>;
    onAttemptEnd?: (
      logId: string | null,
      result: {
        response?: string;
        error?: string;
        durationMs: number;
        attempt: number;
        provider: AIProvider;
        model: string;
      }
    ) => Promise<void>;
  }
): Promise<GenerateDemoContentOutput> {
  const prompt = buildDemoContentPrompt(input);
  await options?.onProgress?.({
    stage: "prompt_prepared",
    status: "completed",
    progress: 20,
    message: "Zbudowano prompt na podstawie danych klienta.",
    details: {
      promptCharacters: prompt.length,
      hasCurrentContent: Boolean(input.currentContent),
      requestedProvider: options.preferredProvider ?? "automatyczny fallback",
      requestedModel: options.preferredModel ?? "automatyczny wybór",
    },
  });

  const result = await aiRouter.generate(
    {
      task: "demo_generation",
      preferredProvider: options?.preferredProvider,
      preferredModel: options?.preferredModel,
      messages: [
        { role: "system", content: DEMO_CONTENT_SYSTEM_PROMPT },
        { role: "user", content: prompt },
      ],
      temperature: 0.55,
      maxTokens: 8192,
      validateResponse: (text) => {
        parseGeneratedDemoContent(text);
      },
    },
    {
      onAttemptStart: async ({ provider, model, prompt: attemptPrompt, attempt }) => {
        await options?.onProgress?.({
          stage: "model_attempt_started",
          status: "running",
          progress: 30,
          message: `Wysłano zapytanie do ${provider}.`,
          details: { provider, model, attempt },
        });
        return options?.onAttemptStart
          ? options.onAttemptStart(provider, model, attemptPrompt, attempt)
          : null;
      },
      onAttemptEnd: async (logId, context, attemptResult) => {
        await options?.onAttemptEnd?.(logId, {
          response: attemptResult.response,
          error: attemptResult.error,
          durationMs: attemptResult.durationMs,
          attempt: context.attempt,
          provider: context.provider,
          model: context.model,
        });
        await options?.onProgress?.(
          attemptResult.error
            ? {
                stage: "model_attempt_failed",
                status: "warning",
                progress: 35,
                message: `${context.provider} nie zakończył próby poprawnie. Router wybierze kolejny model.`,
                details: {
                  provider: context.provider,
                  model: context.model,
                  attempt: context.attempt,
                  durationMs: attemptResult.durationMs,
                  error: attemptResult.error,
                },
              }
            : {
                stage: "content_received",
                status: "completed",
                progress: 62,
                message: `Odebrano odpowiedź z ${context.provider}.`,
                details: {
                  provider: context.provider,
                  model: context.model,
                  attempt: context.attempt,
                  durationMs: attemptResult.durationMs,
                  responseCharacters: attemptResult.response?.length ?? 0,
                },
              }
        );
      },
    }
  );
  const generatedContent = parseGeneratedDemoContent(result.text);
  await options?.onProgress?.({
    stage: "content_validated",
    status: "completed",
    progress: 70,
    message: "JSON przeszedł walidację pełnej struktury strony.",
    details: {
      services: generatedContent.services.length,
      features: generatedContent.features.length,
      galleryBriefs: generatedContent.gallery.items.length,
      testimonials: generatedContent.testimonials.length,
      faqItems: generatedContent.faq.length,
      sections: generatedContent.structure.filter((section) => section.visible).length,
    },
  });
  const content = await imageService.enrichDemoContent({
    content: generatedContent,
    industry: input.industry,
    city: input.city,
    onProgress: async (event) => {
      await reportImageProgress(options?.onProgress, event);
    },
  });

  return {
    content,
    provider: result.provider,
    model: result.model,
    generatedAt: new Date().toISOString(),
  };
}

async function reportImageProgress(
  report: AIProgressReporter | undefined,
  event: ImageSearchProgressEvent
) {
  if (!report) return;
  switch (event.type) {
    case "search_started":
      await report({
        stage: "image_search_started",
        status: "running",
        progress: 76,
        message: "Rozpoczęto wyszukiwanie zdjęć dopasowanych do branży.",
        details: {
          query: event.query,
          providers: event.providers.join(", ") || "brak skonfigurowanych",
          requestedCount: event.requestedCount,
        },
      });
      return;
    case "provider_started":
      await report({
        stage: "image_provider_started",
        status: "running",
        progress: 80,
        message: `Przeszukiwanie biblioteki ${event.provider}.`,
        details: { provider: event.provider },
      });
      return;
    case "provider_completed":
      await report({
        stage: "image_provider_completed",
        status: "completed",
        progress: 84,
        message: `${event.provider} zwrócił ${event.resultCount} wyników.`,
        details: { provider: event.provider, resultCount: event.resultCount },
      });
      return;
    case "provider_failed":
      await report({
        stage: "image_provider_failed",
        status: "warning",
        progress: 84,
        message: `${event.provider} zgłosił błąd. Pozostałe biblioteki nadal pracują.`,
        details: { provider: event.provider, error: event.error },
      });
      return;
    case "search_completed":
      await report({
        stage: "images_selected",
        status: "completed",
        progress: 94,
        message: `Wybrano zdjęcia do ${event.selectedCount} miejsc na stronie.`,
        details: {
          resultCount: event.resultCount,
          selectedCount: event.selectedCount,
          providers: event.providerSummary,
        },
      });
      return;
    case "placeholders_used":
      await report({
        stage: "placeholders_selected",
        status: "warning",
        progress: 94,
        message: "Nie znaleziono zdjęć — zachowano opisowe placeholdery.",
        details: {
          placeholderCount: event.placeholderCount,
          reason: event.reason,
        },
      });
  }
}
