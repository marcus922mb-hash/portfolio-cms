import type {
  WPConnectionTestResult,
  WPFetchResult,
  WPMedia,
  WPPage,
  WPPost,
  WPSiteInfo,
} from "./types";

type WPClientOptions = {
  siteUrl: string;
  apiBase?: string | null;
  username?: string | null;
  password?: string | null;
};

export class WordPressClient {
  private readonly apiBase: string;
  private readonly rootBase: string;
  private readonly authHeader: string | null;

  constructor({ siteUrl, apiBase, username, password }: WPClientOptions) {
    const base = siteUrl.replace(/\/$/, "");
    this.rootBase = apiBase ? apiBase.replace(/\/wp\/v2$/, "") : `${base}/wp-json`;
    this.apiBase = apiBase ?? `${base}/wp-json/wp/v2`;
    this.authHeader =
      username && password
        ? `Basic ${Buffer.from(`${username}:${password}`).toString("base64")}`
        : null;
  }

  private headers(): Record<string, string> {
    const h: Record<string, string> = { "User-Agent": "MA-Atelier-Studio/1.0" };
    if (this.authHeader) h["Authorization"] = this.authHeader;
    return h;
  }

  private async get<T>(path: string): Promise<WPFetchResult<T>> {
    try {
      const res = await fetch(`${this.apiBase}${path}`, {
        headers: this.headers(),
        cache: "no-store",
      });
      if (res.status === 401 || res.status === 403) {
        return { success: false, error: `Błąd autoryzacji (HTTP ${res.status}). Sprawdź login i Application Password.` };
      }
      if (!res.ok) {
        return { success: false, error: `HTTP ${res.status}: ${res.statusText}` };
      }
      return { success: true, data: (await res.json()) as T };
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : "Nie udało się połączyć z WordPress",
      };
    }
  }

  async getSiteInfo(): Promise<WPFetchResult<WPSiteInfo>> {
    try {
      const res = await fetch(this.rootBase, {
        headers: this.headers(),
        cache: "no-store",
      });
      if (!res.ok) return { success: false, error: `HTTP ${res.status}: ${res.statusText}` };
      return { success: true, data: (await res.json()) as WPSiteInfo };
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : "Nie udało się połączyć z WordPress",
      };
    }
  }

  async getPages(perPage = 10): Promise<WPFetchResult<WPPage[]>> {
    return this.get<WPPage[]>(`/pages?per_page=${perPage}&status=publish&_fields=id,date,link,slug,status,title`);
  }

  async getPosts(perPage = 10): Promise<WPFetchResult<WPPost[]>> {
    return this.get<WPPost[]>(`/posts?per_page=${perPage}&status=publish&_fields=id,date,link,slug,status,title,excerpt`);
  }

  async getMedia(perPage = 8): Promise<WPFetchResult<WPMedia[]>> {
    return this.get<WPMedia[]>(`/media?per_page=${perPage}&_fields=id,date,link,source_url,media_type,mime_type,title`);
  }
}

export async function testWordPressConnection(
  opts: WPClientOptions
): Promise<WPConnectionTestResult> {
  const client = new WordPressClient(opts);
  const result = await client.getSiteInfo();
  if (result.success) {
    return {
      success: true,
      siteName: result.data.name,
      siteUrl: result.data.url,
    };
  }
  return { success: false, error: result.error };
}

export function buildWordPressClient(connection: {
  site_url: string;
  api_base_url?: string | null;
  username?: string | null;
  decryptedPassword?: string | null;
}): WordPressClient {
  return new WordPressClient({
    siteUrl: connection.site_url,
    apiBase: connection.api_base_url,
    username: connection.username,
    password: connection.decryptedPassword,
  });
}
