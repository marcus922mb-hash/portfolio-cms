import { lookup } from "node:dns/promises";
import { createCipheriv, createDecipheriv, randomBytes } from "node:crypto";
import { isIP } from "node:net";

export type ClientModelProvider = "openai" | "openrouter" | "groq" | "custom";

export type ClientModelConfig = {
  provider: ClientModelProvider;
  model: string;
  apiKey: string;
  endpoint?: string;
};

type ModelMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

const ALGORITHM = "aes-256-gcm";
const KEY_ENV = "APP_ENCRYPTION_KEY";
const PROVIDER_ENDPOINTS: Record<Exclude<ClientModelProvider, "custom">, string> = {
  openai: "https://api.openai.com/v1/chat/completions",
  openrouter: "https://openrouter.ai/api/v1/chat/completions",
  groq: "https://api.groq.com/openai/v1/chat/completions",
};

function encryptionKey() {
  const value = process.env[KEY_ENV]?.trim() ?? "";
  if (!/^[0-9a-f]{64}$/i.test(value)) {
    throw new Error(`${KEY_ENV} musi być 64-znakowym kluczem hex.`);
  }
  return Buffer.from(value, "hex");
}

export function encryptClientApiKey(plainText: string) {
  const iv = randomBytes(12);
  const cipher = createCipheriv(ALGORITHM, encryptionKey(), iv);
  const encrypted = Buffer.concat([
    cipher.update(plainText, "utf8"),
    cipher.final(),
  ]);
  return Buffer.concat([iv, cipher.getAuthTag(), encrypted]).toString("base64");
}

export function decryptClientApiKey(cipherText: string) {
  const payload = Buffer.from(cipherText, "base64");
  if (payload.length < 29) throw new Error("Nieprawidłowy zaszyfrowany klucz.");
  const decipher = createDecipheriv(
    ALGORITHM,
    encryptionKey(),
    payload.subarray(0, 12)
  );
  decipher.setAuthTag(payload.subarray(12, 28));
  return Buffer.concat([
    decipher.update(payload.subarray(28)),
    decipher.final(),
  ]).toString("utf8");
}

function isPrivateIp(address: string) {
  const normalized = address.toLowerCase();
  if (
    normalized === "::1" ||
    normalized === "::" ||
    normalized.startsWith("fc") ||
    normalized.startsWith("fd") ||
    normalized.startsWith("fe80:")
  ) {
    return true;
  }
  const parts = normalized.split(".").map(Number);
  if (parts.length !== 4 || parts.some((part) => !Number.isInteger(part))) return false;
  return (
    parts[0] === 10 ||
    parts[0] === 127 ||
    (parts[0] === 169 && parts[1] === 254) ||
    (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) ||
    (parts[0] === 192 && parts[1] === 168) ||
    parts[0] === 0
  );
}

async function safeCustomEndpoint(rawEndpoint: string) {
  let url: URL;
  try {
    url = new URL(rawEndpoint);
  } catch {
    throw new Error("Podaj prawidłowy adres endpointu modelu.");
  }
  if (url.protocol !== "https:") {
    throw new Error("Własny endpoint modelu musi korzystać z HTTPS.");
  }
  if (url.username || url.password || url.port) {
    throw new Error("Endpoint nie może zawierać danych logowania ani niestandardowego portu.");
  }
  const hostname = url.hostname.toLowerCase();
  if (hostname === "localhost" || hostname.endsWith(".local")) {
    throw new Error("Lokalny endpoint nie może być użyty we wdrożeniu.");
  }
  if (isIP(hostname) && isPrivateIp(hostname)) {
    throw new Error("Prywatny adres endpointu nie może być użyty.");
  }
  const addresses = await lookup(hostname, { all: true });
  if (!addresses.length || addresses.some(({ address }) => isPrivateIp(address))) {
    throw new Error("Endpoint wskazuje na niedozwolony adres sieciowy.");
  }
  return url.toString();
}

export async function resolveClientModelEndpoint(config: ClientModelConfig) {
  if (config.provider === "custom") {
    if (!config.endpoint) throw new Error("Brakuje endpointu własnego modelu.");
    return safeCustomEndpoint(config.endpoint);
  }
  return PROVIDER_ENDPOINTS[config.provider];
}

export async function generateWithClientModel(
  config: ClientModelConfig,
  messages: ModelMessage[],
  maxTokens = 700
) {
  const endpoint = await resolveClientModelEndpoint(config);
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.apiKey}`,
      "Content-Type": "application/json",
      ...(config.provider === "openrouter"
        ? {
            "HTTP-Referer":
              process.env.NEXT_PUBLIC_SITE_URL || "https://web.ma-atelier.pl",
            "X-Title": "Braided Digital Client Chat",
          }
        : {}),
    },
    body: JSON.stringify({
      model: config.model,
      messages,
      temperature: 0.45,
      max_tokens: maxTokens,
    }),
    signal: AbortSignal.timeout(30_000),
  });

  const text = await response.text();
  let payload: unknown;
  try {
    payload = JSON.parse(text);
  } catch {
    payload = null;
  }

  if (!response.ok) {
    const providerMessage =
      payload &&
      typeof payload === "object" &&
      "error" in payload &&
      payload.error &&
      typeof payload.error === "object" &&
      "message" in payload.error &&
      typeof payload.error.message === "string"
        ? payload.error.message
        : `Provider zwrócił status ${response.status}.`;
    throw new Error(providerMessage);
  }

  const content =
    payload &&
    typeof payload === "object" &&
    "choices" in payload &&
    Array.isArray(payload.choices) &&
    payload.choices[0] &&
    typeof payload.choices[0] === "object" &&
    "message" in payload.choices[0] &&
    payload.choices[0].message &&
    typeof payload.choices[0].message === "object" &&
    "content" in payload.choices[0].message &&
    typeof payload.choices[0].message.content === "string"
      ? payload.choices[0].message.content.trim()
      : "";

  if (!content) throw new Error("Model klienta nie zwrócił treści.");
  return content;
}
