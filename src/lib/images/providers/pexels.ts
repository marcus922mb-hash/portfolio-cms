import { imageFetchOptions } from "@/lib/images/provider-utils";
import type { ImageProvider } from "@/lib/images/types";

type PexelsResponse = {
  photos?: Array<{
    id: number;
    width: number;
    height: number;
    url: string;
    photographer?: string;
    alt?: string;
    src: { large2x?: string; large?: string; original?: string };
  }>;
};

export const pexelsProvider: ImageProvider = {
  id: "pexels",

  isConfigured() {
    return Boolean(process.env.PEXELS_API_KEY);
  },

  async search(request) {
    const apiKey = process.env.PEXELS_API_KEY;
    if (!apiKey) return [];
    const params = new URLSearchParams({
      query: request.query,
      per_page: String(Math.min(request.count, 80)),
      ...(request.orientation ? { orientation: request.orientation } : {}),
    });
    const response = await fetch(
      `https://api.pexels.com/v1/search?${params}`,
      imageFetchOptions({ Authorization: apiKey })
    );
    if (!response.ok) throw new Error(`Pexels zwrócił status ${response.status}.`);
    const payload = (await response.json()) as PexelsResponse;

    return (payload.photos ?? []).flatMap((photo) => {
      const url = photo.src.large2x || photo.src.large || photo.src.original;
      if (!url) return [];
      const alt = photo.alt?.trim() || request.query;
      return [{
        url,
        alt,
        description: alt,
        provider: "pexels" as const,
        photographer: photo.photographer,
        sourceUrl: photo.url,
        width: photo.width,
        height: photo.height,
      }];
    });
  },
};

