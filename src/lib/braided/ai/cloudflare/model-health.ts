/**
 * In-memory cache dostępności modeli Cloudflare Workers AI.
 *
 * Gdy model zwróci błąd 404, 5007 lub 5028 (wycofany/niedostępny),
 * zostaje oznaczony jako niedostępny i pomijany przez router przez 10 minut.
 * Po 10 minutach cache wygasa i model jest ponownie testowany.
 */

type ModelStatus = "available" | "unavailable";

type CacheEntry = {
  status: ModelStatus;
  reason: string;
  markedAt: number;
};

const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minut

// Singleton per process (Next.js server-side)
const statusCache = new Map<string, CacheEntry>();

/** Kody błędów Cloudflare oznaczające trwałą niedostępność modelu */
const UNAVAILABLE_CF_CODES = ["5007", "5028", "404"];

/** Słowa kluczowe w treści błędu oznaczające niedostępność modelu */
const UNAVAILABLE_KEYWORDS = [
  "deprecated",
  "not found",
  "not available",
  "removed",
  "model not found",
  "no longer supported",
  "5007",
  "5028",
];

export function isModelUnavailableError(message: string, httpStatus?: number): boolean {
  if (httpStatus === 404) return true;
  const lower = message.toLowerCase();
  if (UNAVAILABLE_CF_CODES.some((code) => lower.includes(code))) return true;
  return UNAVAILABLE_KEYWORDS.some((kw) => lower.includes(kw));
}

export function markModelUnavailable(modelId: string, reason: string): void {
  statusCache.set(modelId, { status: "unavailable", reason, markedAt: Date.now() });
  console.warn(`[cf-model-health] Oznaczono jako niedostępny: ${modelId} — ${reason}`);
}

export function markModelAvailable(modelId: string): void {
  statusCache.delete(modelId);
}

export function isModelAvailable(modelId: string): boolean {
  const entry = statusCache.get(modelId);
  if (!entry) return true;
  if (Date.now() - entry.markedAt > CACHE_TTL_MS) {
    // Cache wygasł — zresetuj i spróbuj ponownie
    statusCache.delete(modelId);
    return true;
  }
  return entry.status === "available";
}

/** Filtruje listę modeli, zwracając tylko te które są (prawdopodobnie) dostępne */
export function filterAvailableModels(modelIds: readonly string[]): string[] {
  return modelIds.filter(isModelAvailable);
}

/** Raport stanu dla wszystkich modeli w cache (debug) */
export function getModelHealthReport(): Array<{
  modelId: string;
  status: ModelStatus;
  reason: string;
  minutesLeft: number;
}> {
  const now = Date.now();
  return Array.from(statusCache.entries()).map(([modelId, entry]) => ({
    modelId,
    status: entry.status,
    reason: entry.reason,
    minutesLeft: Math.max(0, Math.round((CACHE_TTL_MS - (now - entry.markedAt)) / 60_000)),
  }));
}
