import { createCipheriv, createDecipheriv, createHash, randomBytes } from "node:crypto";
import { WooCommerceApiError, WooCommerceConfigError, WooCommerceEncryptionError } from "@/lib/woocommerce/errors";
import {
  normalizeWooCommerceCategory,
  normalizeWooCommerceOrder,
  normalizeWooCommerceProduct,
  normalizeWooCommerceStoreInfo,
} from "@/lib/woocommerce/normalize";
import type {
  WooCommerceCategory,
  WooCommerceConnectionTestResult,
  WooCommerceCredentials,
  WooCommerceOrder,
  WooCommerceProduct,
  WooCommerceStoreInfo,
} from "@/lib/woocommerce/types";

function normalizeStoreUrl(storeUrl: string) {
  const trimmed = storeUrl.trim();
  const value = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  const url = new URL(value);
  url.pathname = url.pathname.replace(/\/+$/, "");
  url.search = "";
  url.hash = "";
  return url.toString().replace(/\/+$/, "");
}

function buildWooUrl(storeUrl: string, path: string, params?: Record<string, string | number>) {
  const url = new URL(`/wp-json/wc/v3/${path.replace(/^\/+/, "")}`, `${normalizeStoreUrl(storeUrl)}/`);
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      url.searchParams.set(key, String(value));
    }
  }
  return url;
}

async function fetchWooJson(
  credentials: WooCommerceCredentials,
  path: string,
  params?: Record<string, string | number>
) {
  const url = buildWooUrl(credentials.storeUrl, path, params);
  url.searchParams.set("consumer_key", credentials.consumerKey);
  url.searchParams.set("consumer_secret", credentials.consumerSecret);

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
    cache: "no-store",
  });

  const text = await response.text();
  const payload = text ? (() => {
    try {
      return JSON.parse(text);
    } catch {
      return text;
    }
  })() : null;

  if (!response.ok) {
    const message =
      typeof payload === "object" && payload && "message" in payload && typeof payload.message === "string"
        ? payload.message
        : `WooCommerce API zwróciło status ${response.status}.`;
    throw new WooCommerceApiError(message);
  }

  return payload;
}

async function fetchStoreRoot(storeUrl: string) {
  const url = new URL("/wp-json", `${normalizeStoreUrl(storeUrl)}/`);
  const response = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new WooCommerceApiError(`Nie udało się pobrać informacji o sklepie. Status ${response.status}.`);
  }

  return response.json();
}

function getEncryptionKey() {
  const rawKey = process.env.APP_ENCRYPTION_KEY?.trim();

  if (!rawKey) {
    throw new WooCommerceEncryptionError("Brakuje APP_ENCRYPTION_KEY w .env.local.");
  }

  return createHash("sha256").update(rawKey).digest();
}

export function encryptWooCommerceSecret(value: string) {
  const key = getEncryptionKey();
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key, iv);

  const encrypted = Buffer.concat([cipher.update(value, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();

  return `v1:${iv.toString("base64")}:${tag.toString("base64")}:${encrypted.toString("base64")}`;
}

export function decryptWooCommerceSecret(payload: string | null) {
  if (!payload) {
    throw new WooCommerceEncryptionError("Brakuje zaszyfrowanego sekretu WooCommerce.");
  }

  const [version, ivBase64, tagBase64, encryptedBase64] = payload.split(":");
  if (version !== "v1" || !ivBase64 || !tagBase64 || !encryptedBase64) {
    throw new WooCommerceEncryptionError("Niepoprawny format zaszyfrowanego sekretu WooCommerce.");
  }

  const key = getEncryptionKey();
  const decipher = createDecipheriv("aes-256-gcm", key, Buffer.from(ivBase64, "base64"));
  decipher.setAuthTag(Buffer.from(tagBase64, "base64"));

  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(encryptedBase64, "base64")),
    decipher.final(),
  ]);

  return decrypted.toString("utf8");
}

export function maskSecret(secret: string | null | undefined) {
  if (!secret) return "—";
  const trimmed = secret.trim();
  if (trimmed.length <= 6) return "••••••";
  return `${trimmed.slice(0, 4)}••••${trimmed.slice(-4)}`;
}

export async function getWooCommerceProducts(
  credentials: WooCommerceCredentials,
  perPage = 6
): Promise<WooCommerceProduct[]> {
  const payload = await fetchWooJson(credentials, "products", { per_page: perPage });
  if (!Array.isArray(payload)) {
    throw new WooCommerceApiError("WooCommerce nie zwróciło listy produktów.");
  }
  return payload.map(normalizeWooCommerceProduct);
}

export async function getWooCommerceProductCategories(
  credentials: WooCommerceCredentials,
  perPage = 10
): Promise<WooCommerceCategory[]> {
  const payload = await fetchWooJson(credentials, "products/categories", { per_page: perPage });
  if (!Array.isArray(payload)) {
    throw new WooCommerceApiError("WooCommerce nie zwróciło listy kategorii.");
  }
  return payload.map(normalizeWooCommerceCategory);
}

export async function getWooCommerceOrders(
  credentials: WooCommerceCredentials,
  perPage = 5
): Promise<WooCommerceOrder[]> {
  const payload = await fetchWooJson(credentials, "orders", { per_page: perPage });
  if (!Array.isArray(payload)) {
    throw new WooCommerceApiError("WooCommerce nie zwróciło listy zamówień.");
  }
  return payload.map(normalizeWooCommerceOrder);
}

export async function getWooCommerceStoreInfo(
  credentials: Pick<WooCommerceCredentials, "storeUrl">
): Promise<WooCommerceStoreInfo> {
  const payload = await fetchStoreRoot(credentials.storeUrl);
  return normalizeWooCommerceStoreInfo(payload, normalizeStoreUrl(credentials.storeUrl));
}

export async function testWooCommerceConnection(
  credentials: WooCommerceCredentials
): Promise<WooCommerceConnectionTestResult> {
  if (!credentials.consumerKey || !credentials.consumerSecret) {
    throw new WooCommerceConfigError("Brakuje klucza Consumer Key lub Consumer Secret.");
  }

  const [store, products, categories, orders] = await Promise.all([
    getWooCommerceStoreInfo(credentials),
    getWooCommerceProducts(credentials, 6),
    getWooCommerceProductCategories(credentials, 8),
    getWooCommerceOrders(credentials, 5),
  ]);

  return {
    testedAt: new Date().toISOString(),
    store,
    products,
    categories,
    orders,
  };
}
