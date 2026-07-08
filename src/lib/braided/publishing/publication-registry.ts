import { CloudflarePublicationAdapter } from "@/lib/publishing/adapters/cloudflare-adapter";
import { VercelPublicationAdapter } from "@/lib/publishing/adapters/vercel-adapter";
import { WordPressPublicationAdapter } from "@/lib/publishing/adapters/wordpress-adapter";
import { ZipPublicationAdapter } from "@/lib/publishing/adapters/zip-adapter";
import type {
  PublicationAdapter,
  PublicationRequest,
  PublicationTarget,
} from "@/lib/publishing/types";

const defaultAdapters: PublicationAdapter[] = [
  new VercelPublicationAdapter(),
  new CloudflarePublicationAdapter(),
  new WordPressPublicationAdapter(),
  new ZipPublicationAdapter(),
];

export class PublicationRegistry {
  private readonly adapters: Map<PublicationTarget, PublicationAdapter>;

  constructor(adapters: PublicationAdapter[] = defaultAdapters) {
    this.adapters = new Map(adapters.map((adapter) => [adapter.target, adapter]));
  }

  get(target: PublicationTarget) {
    const adapter = this.adapters.get(target);
    if (!adapter) throw new Error(`Nie zarejestrowano adaptera ${target}.`);
    return adapter;
  }

  list() {
    return [...this.adapters.values()].map((adapter) => ({
      ...adapter.capability,
      configured: adapter.isConfigured(),
    }));
  }

  async validate(target: PublicationTarget, request: PublicationRequest) {
    return this.get(target).validate(request);
  }

  async publish(target: PublicationTarget, request: PublicationRequest) {
    return this.get(target).publish(request);
  }
}

export const publicationRegistry = new PublicationRegistry();

