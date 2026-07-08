import type { DemoImage } from "@/features/demos/types";
import {
  normalizeQuery,
  scoreImage,
} from "@/lib/images/provider-utils";
import { pexelsProvider } from "@/lib/images/providers/pexels";
import { pixabayProvider } from "@/lib/images/providers/pixabay";
import { unsplashProvider } from "@/lib/images/providers/unsplash";
import type {
  EnrichDemoImagesInput,
  ImageCandidate,
  ImageProvider,
  ImageProviderName,
  ImageSearchProgressEvent,
  ImageSearchRequest,
} from "@/lib/images/types";

const providers: ImageProvider[] = [
  pexelsProvider,
  pixabayProvider,
  unsplashProvider,
];

function providerOrder() {
  const allowed = new Set<ImageProviderName>(["pexels", "pixabay", "unsplash"]);
  const configured = (process.env.IMAGE_PROVIDER_ORDER || "pexels,unsplash,pixabay")
    .split(",")
    .map((item) => item.trim())
    .filter((item): item is ImageProviderName =>
      allowed.has(item as ImageProviderName)
    );
  const rank = new Map(configured.map((provider, index) => [provider, index]));
  return [...providers].sort(
    (a, b) => (rank.get(a.id) ?? 99) - (rank.get(b.id) ?? 99)
  );
}

function deduplicate(images: ImageCandidate[]) {
  const seen = new Set<string>();
  return images.filter((image) => {
    const key = image.url.split("?")[0];
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export class ImageService {
  constructor(private readonly adapters: ImageProvider[] = providerOrder()) {}

  async search(
    request: ImageSearchRequest,
    onProgress?: (event: ImageSearchProgressEvent) => Promise<void>
  ): Promise<ImageCandidate[]> {
    const active = this.adapters.filter((provider) => provider.isConfigured());
    await onProgress?.({
      type: "search_started",
      query: request.query,
      providers: active.map((provider) => provider.id),
      requestedCount: request.count,
    });
    if (!active.length) return [];

    const searches = await Promise.allSettled(
      active.map(async (provider) => {
        await onProgress?.({ type: "provider_started", provider: provider.id });
        try {
          const result = await provider.search(request);
          await onProgress?.({
            type: "provider_completed",
            provider: provider.id,
            resultCount: result.length,
          });
          return result;
        } catch (error) {
          await onProgress?.({
            type: "provider_failed",
            provider: provider.id,
            error:
              error instanceof Error ? error.message : "Nieznany błąd providera.",
          });
          throw error;
        }
      })
    );
    const combined = searches.flatMap((result, index) => {
      if (result.status === "fulfilled") return result.value;
      console.error("[image-provider] Wyszukiwanie nie powiodło się", {
        provider: active[index]?.id,
        error:
          result.reason instanceof Error
            ? result.reason.message
            : "Nieznany błąd.",
      });
      return [];
    });

    return deduplicate(combined)
      .map((image) => ({
        ...image,
        score: scoreImage(image, request.orientation),
      }))
      .sort((a, b) => (b.score ?? 0) - (a.score ?? 0))
      .slice(0, request.count);
  }

  async enrichDemoContent({
    content,
    industry,
    city,
    onProgress,
  }: EnrichDemoImagesInput) {
    const query = normalizeQuery(
      [industry, city, content.site.name, "professional business"]
        .filter(Boolean)
        .join(" ")
    );
    const requestedCount = Math.max(content.gallery.items.length + 3, 8);
    const images = await this.search({
      query,
      count: requestedCount,
      orientation: "landscape",
    }, onProgress);
    const placeholderCount = content.gallery.items.length + 3;
    if (!images.length) {
      await onProgress?.({
        type: "placeholders_used",
        placeholderCount,
        reason: "Biblioteki zdjęć nie zwróciły pasujących wyników.",
      });
      return content;
    }

    let cursor = 0;
    const take = (placeholder: DemoImage): DemoImage => {
      const candidate = images[cursor % images.length];
      cursor += 1;
      if (!candidate) return placeholder;
      return {
        url: candidate.url,
        alt: placeholder.alt || candidate.alt,
        description: placeholder.description || candidate.description,
        provider: candidate.provider,
        photographer: candidate.photographer,
        sourceUrl: candidate.sourceUrl,
      };
    };

    const enriched = {
      ...content,
      hero: { ...content.hero, image: take(content.hero.image) },
      about: { ...content.about, image: take(content.about.image) },
      gallery: {
        ...content.gallery,
        items: content.gallery.items.map(take),
      },
      seo: { ...content.seo, ogImage: take(content.seo.ogImage) },
    };
    const summary = new Map<string, number>();
    for (const image of images) {
      summary.set(image.provider, (summary.get(image.provider) ?? 0) + 1);
    }
    await onProgress?.({
      type: "search_completed",
      resultCount: images.length,
      selectedCount: placeholderCount,
      providerSummary: [...summary.entries()]
        .map(([provider, count]) => `${provider}: ${count}`)
        .join(", "),
    });
    return enriched;
  }
}

export const imageService = new ImageService();
