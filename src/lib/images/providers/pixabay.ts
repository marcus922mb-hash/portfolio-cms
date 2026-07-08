import { imageFetchOptions } from "@/lib/images/provider-utils";
import type { ImageProvider } from "@/lib/images/types";

type PixabayResponse = {
  hits?: Array<{
    id: number;
    pageURL: string;
    tags?: string;
    user?: string;
    largeImageURL?: string;
    webformatURL?: string;
    imageWidth: number;
    imageHeight: number;
  }>;
};

export const pixabayProvider: ImageProvider = {
  id: "pixabay",

  isConfigured() {
    return Boolean(process.env.PIXABAY_API_KEY);
  },

  async search(request) {
    const apiKey = process.env.PIXABAY_API_KEY;
    if (!apiKey) return [];
    const params = new URLSearchParams({
      key: apiKey,
      q: request.query,
      per_page: String(Math.max(3, Math.min(request.count, 200))),
      image_type: "photo",
      safesearch: "true",
      ...(request.orientation && request.orientation !== "square"
        ? { orientation: request.orientation === "portrait" ? "vertical" : "horizontal" }
        : {}),
    });
    const response = await fetch(
      `https://pixabay.com/api/?${params}`,
      imageFetchOptions()
    );
    if (!response.ok) throw new Error(`Pixabay zwrócił status ${response.status}.`);
    const payload = (await response.json()) as PixabayResponse;

    return (payload.hits ?? []).flatMap((image) => {
      const url = image.largeImageURL || image.webformatURL;
      if (!url) return [];
      const alt = image.tags?.trim() || request.query;
      return [{
        url,
        alt,
        description: alt,
        provider: "pixabay" as const,
        photographer: image.user,
        sourceUrl: image.pageURL,
        width: image.imageWidth,
        height: image.imageHeight,
      }];
    });
  },
};

