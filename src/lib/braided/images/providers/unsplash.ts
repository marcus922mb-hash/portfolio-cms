import { imageFetchOptions } from "@/lib/images/provider-utils";
import type { ImageProvider } from "@/lib/images/types";

type UnsplashResponse = {
  results?: Array<{
    id: string;
    width: number;
    height: number;
    alt_description?: string | null;
    description?: string | null;
    links: { html?: string };
    urls: { regular?: string; full?: string };
    user?: { name?: string };
  }>;
};

export const unsplashProvider: ImageProvider = {
  id: "unsplash",

  isConfigured() {
    return Boolean(process.env.UNSPLASH_ACCESS_KEY);
  },

  async search(request) {
    const accessKey = process.env.UNSPLASH_ACCESS_KEY;
    if (!accessKey) return [];
    const params = new URLSearchParams({
      query: request.query,
      per_page: String(Math.min(request.count, 30)),
      content_filter: "high",
      ...(request.orientation ? { orientation: request.orientation } : {}),
    });
    const response = await fetch(
      `https://api.unsplash.com/search/photos?${params}`,
      imageFetchOptions({
        Authorization: `Client-ID ${accessKey}`,
        "Accept-Version": "v1",
      })
    );
    if (!response.ok) throw new Error(`Unsplash zwrócił status ${response.status}.`);
    const payload = (await response.json()) as UnsplashResponse;

    return (payload.results ?? []).flatMap((image) => {
      const url = image.urls.regular || image.urls.full;
      if (!url) return [];
      const alt =
        image.alt_description?.trim() ||
        image.description?.trim() ||
        request.query;
      return [{
        url,
        alt,
        description: image.description?.trim() || alt,
        provider: "unsplash" as const,
        photographer: image.user?.name,
        sourceUrl: image.links.html,
        width: image.width,
        height: image.height,
      }];
    });
  },
};

