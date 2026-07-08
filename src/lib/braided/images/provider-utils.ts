import type {
  ImageCandidate,
  ImageOrientation,
} from "@/lib/images/types";

export const IMAGE_CACHE_SECONDS = 60 * 60 * 24 * 7;

export function imageFetchOptions(headers?: HeadersInit): RequestInit & {
  next: { revalidate: number; tags: string[] };
} {
  return {
    headers,
    cache: "force-cache",
    next: {
      revalidate: IMAGE_CACHE_SECONDS,
      tags: ["image-search"],
    },
  };
}

export function requestedOrientation(
  width: number,
  height: number
): ImageOrientation {
  const ratio = width / height;
  if (ratio > 1.2) return "landscape";
  if (ratio < 0.8) return "portrait";
  return "square";
}

export function scoreImage(
  image: ImageCandidate,
  orientation: ImageOrientation = "landscape"
) {
  const actual = requestedOrientation(image.width, image.height);
  const orientationScore = actual === orientation ? 50 : 0;
  const resolutionScore = Math.min((image.width * image.height) / 100_000, 40);
  const metadataScore = image.alt && image.description ? 10 : 0;
  return orientationScore + resolutionScore + metadataScore;
}

export function normalizeQuery(value: string) {
  return value.replace(/[_-]+/g, " ").replace(/\s+/g, " ").trim();
}

