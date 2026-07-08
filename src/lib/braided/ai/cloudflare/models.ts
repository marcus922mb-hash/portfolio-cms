/**
 * Centralny rejestr modeli Cloudflare Workers AI
 *
 * Źródło: https://developers.cloudflare.com/workers-ai/models/
 * Ceny:   https://developers.cloudflare.com/workers-ai/platform/pricing/
 * Data:   2026-06-28
 *
 * Zawiera wyłącznie modele aktywne (bez Deprecated/Removed).
 * Free tier: 10 000 Neurons dziennie (reset o 00:00 UTC).
 */

export type CloudflareModelPurpose =
  | "fast"       // krótkie odpowiedzi, tanie zapytania
  | "document"   // generowanie dużych dokumentów (strony, HTML)
  | "code"       // TypeScript / React / Next.js
  | "json"       // poprawna struktura JSON
  | "reasoning"  // rozumowanie, planowanie, analiza
  | "vision"     // analiza obrazów
  | "image-gen"; // generowanie grafik

export type CloudflareModelEntry = {
  id: string;
  name: string;
  purpose: CloudflareModelPurpose[];
  /** Neurons na milion tokenów wejściowych */
  inputNeuronsPerM: number;
  /** Neurons na milion tokenów wyjściowych */
  outputNeuronsPerM: number;
  /** Rozmiar okna kontekstowego (tokeny) */
  contextWindow: number;
  notes?: string;
};

// ---------------------------------------------------------------------------
// Rejestr — wyłącznie modele aktywne na 2026-06-28
// ---------------------------------------------------------------------------

export const CF_MODEL_REGISTRY: readonly CloudflareModelEntry[] = [

  // ── FAST ──────────────────────────────────────────────────────────────────
  {
    id: "@cf/ibm-granite/granite-4.0-h-micro",
    name: "Granite 4.0 Micro",
    purpose: ["fast"],
    inputNeuronsPerM: 1_542,
    outputNeuronsPerM: 10_158,
    contextWindow: 128_000,
    notes: "Najtańszy model, zoptymalizowany pod edge",
  },
  {
    id: "@cf/meta/llama-3.2-1b-instruct",
    name: "Llama 3.2 1B",
    purpose: ["fast"],
    inputNeuronsPerM: 2_457,
    outputNeuronsPerM: 18_252,
    contextWindow: 128_000,
    notes: "Bardzo mały, wielojęzyczny",
  },
  {
    id: "@cf/meta/llama-3.2-3b-instruct",
    name: "Llama 3.2 3B",
    purpose: ["fast", "json"],
    inputNeuronsPerM: 4_625,
    outputNeuronsPerM: 30_475,
    contextWindow: 128_000,
    notes: "Mały, ale dobry przy JSON",
  },

  // ── DOCUMENT + JSON (główny use-case: generator stron) ───────────────────
  {
    id: "@cf/qwen/qwen3-30b-a3b-fp8",
    name: "Qwen3 30B-A3B",
    purpose: ["document", "json", "reasoning"],
    inputNeuronsPerM: 4_625,
    outputNeuronsPerM: 30_475,
    contextWindow: 32_768,
    notes: "Architektura MoE — jakość 30B w cenie 3B. Najlepsza wartość.",
  },
  {
    id: "@cf/zai-org/glm-4.7-flash",
    name: "GLM 4.7 Flash",
    purpose: ["document", "json"],
    inputNeuronsPerM: 5_500,
    outputNeuronsPerM: 36_400,
    contextWindow: 131_072,
    notes: "131k kontekst, wielojęzyczny",
  },
  {
    id: "@cf/google/gemma-4-26b-a4b-it",
    name: "Gemma 4 26B",
    purpose: ["document", "json", "vision"],
    inputNeuronsPerM: 9_091,
    outputNeuronsPerM: 27_273,
    contextWindow: 128_000,
    notes: "Dobra jakość, tanie tokeny wyjściowe, obsługa obrazów",
  },
  {
    id: "@cf/meta/llama-4-scout-17b-16e-instruct",
    name: "Llama 4 Scout 17B",
    purpose: ["document", "json", "vision"],
    inputNeuronsPerM: 24_545,
    outputNeuronsPerM: 77_273,
    contextWindow: 128_000,
    notes: "Multimodalny, dobry w podążaniu za instrukcjami",
  },
  {
    id: "@cf/meta/llama-3.3-70b-instruct-fp8-fast",
    name: "Llama 3.3 70B FP8",
    purpose: ["document", "json"],
    inputNeuronsPerM: 26_668,
    outputNeuronsPerM: 204_805,
    contextWindow: 128_000,
    notes: "Najwyższa jakość na CF, zoptymalizowana prędkość",
  },

  // ── CODE ──────────────────────────────────────────────────────────────────
  {
    id: "@cf/meta/llama-3.1-8b-instruct-fp8",
    name: "Llama 3.1 8B FP8",
    purpose: ["code"],
    inputNeuronsPerM: 13_778,
    outputNeuronsPerM: 26_128,
    contextWindow: 128_000,
    notes: "Dobry do kodu w rozsądnej cenie",
  },
  {
    id: "@cf/qwen/qwen2.5-coder-32b-instruct",
    name: "Qwen 2.5 Coder 32B",
    purpose: ["code"],
    inputNeuronsPerM: 60_000,
    outputNeuronsPerM: 90_909,
    contextWindow: 128_000,
    notes: "Najlepszy model do kodu, ale drogi na free tier",
  },

  // ── REASONING ─────────────────────────────────────────────────────────────
  {
    id: "@cf/openai/gpt-oss-20b",
    name: "GPT OSS 20B",
    purpose: ["reasoning"],
    inputNeuronsPerM: 18_182,
    outputNeuronsPerM: 27_273,
    contextWindow: 128_000,
    notes: "Balans cena/jakość do rozumowania",
  },
  {
    id: "@cf/deepseek-ai/deepseek-r1-distill-qwen-32b",
    name: "DeepSeek R1 Qwen 32B",
    purpose: ["reasoning"],
    inputNeuronsPerM: 45_170,
    outputNeuronsPerM: 443_756,
    contextWindow: 128_000,
    notes: "Silne rozumowanie, ale bardzo drogie tokeny wyjściowe",
  },

  // ── VISION ────────────────────────────────────────────────────────────────
  {
    id: "@cf/meta/llama-3.2-11b-vision-instruct",
    name: "Llama 3.2 11B Vision",
    purpose: ["vision"],
    inputNeuronsPerM: 4_410,
    outputNeuronsPerM: 61_493,
    contextWindow: 128_000,
    notes: "Analiza obrazów",
  },

  // ── IMAGE GENERATION ──────────────────────────────────────────────────────
  {
    id: "@cf/black-forest-labs/flux-1-schnell",
    name: "FLUX.1 Schnell",
    purpose: ["image-gen"],
    inputNeuronsPerM: 0,
    outputNeuronsPerM: 0,
    contextWindow: 0,
    notes: "Najszybsza generacja obrazów, ~4.8 N/kafelek 512×512",
  },
  {
    id: "@cf/black-forest-labs/flux-2-klein-4b",
    name: "FLUX.2 Klein 4B",
    purpose: ["image-gen"],
    inputNeuronsPerM: 0,
    outputNeuronsPerM: 0,
    contextWindow: 0,
    notes: "Ultra-szybki, zdestylowany z FLUX.2",
  },
] as const;

// ---------------------------------------------------------------------------
// Łańcuch fallback dla generowania treści stron internetowych
// Priorytety: jakość JSON + koszt Neurons + rozmiar kontekstu
// ---------------------------------------------------------------------------

/**
 * Kolejność fallbacków dla zadania generowania treści strony:
 *
 * 1. qwen3-30b-a3b   — architektura MoE, jakość 30B w cenie 3B (136 N/gen)
 * 2. llama-3.2-3b    — najtańszy który radzi sobie z JSON (136 N/gen)
 * 3. glm-4.7-flash   — 131k kontekst, wielojęzyczny (162 N/gen)
 * 4. gemma-4-26b     — dobra jakość, tanie wyjście (136 N/gen)
 * 5. llama-4-scout   — multimodalny (383 N/gen)
 * 6. llama-3.3-70b   — najlepsza jakość, 11 gen/dzień na free (899 N/gen)
 *
 * Szacunek: ~3k tokenów wejściowych + ~4k tokenów wyjściowych na generację.
 */
export const CF_WEBSITE_GENERATION_FALLBACKS: readonly string[] = [
  "@cf/qwen/qwen3-30b-a3b-fp8",
  "@cf/meta/llama-3.2-3b-instruct",
  "@cf/zai-org/glm-4.7-flash",
  "@cf/google/gemma-4-26b-a4b-it",
  "@cf/meta/llama-4-scout-17b-16e-instruct",
  "@cf/meta/llama-3.3-70b-instruct-fp8-fast",
] as const;

/** Wszystkie aktywne IDs modeli tekstowych (bez image-gen) */
export const CF_ACTIVE_TEXT_MODEL_IDS: readonly string[] = CF_MODEL_REGISTRY
  .filter((m) => !m.purpose.includes("image-gen"))
  .map((m) => m.id);

export function cfModelById(id: string): CloudflareModelEntry | undefined {
  return CF_MODEL_REGISTRY.find((m) => m.id === id);
}

export function cfModelsByPurpose(purpose: CloudflareModelPurpose): CloudflareModelEntry[] {
  return CF_MODEL_REGISTRY.filter((m) => m.purpose.includes(purpose)) as CloudflareModelEntry[];
}

/** Szacowane Neurons dla jednej generacji przy podanej liczbie tokenów */
export function estimateNeurons(
  modelId: string,
  inputTokens: number,
  outputTokens: number
): number {
  const model = cfModelById(modelId);
  if (!model) return 0;
  return (
    (model.inputNeuronsPerM * inputTokens) / 1_000_000 +
    (model.outputNeuronsPerM * outputTokens) / 1_000_000
  );
}
