import { createCipheriv, createDecipheriv, randomBytes } from "node:crypto";

const ALGORITHM = "aes-256-gcm";
const KEY_ENV = "WORDPRESS_ENCRYPTION_KEY";

export function isEncryptionAvailable(): boolean {
  const key = process.env[KEY_ENV];
  return typeof key === "string" && key.length === 64;
}

function getKey(): Buffer {
  const hexKey = process.env[KEY_ENV] ?? "";
  if (hexKey.length !== 64) {
    throw new Error(
      `${KEY_ENV} must be a 64-character hex string (32 bytes). ` +
        `Generate: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
    );
  }
  return Buffer.from(hexKey, "hex");
}

// Format: iv(12 bytes) + authTag(16 bytes) + ciphertext → base64
export function encryptPassword(plain: string): string {
  const key = getKey();
  const iv = randomBytes(12);
  const cipher = createCipheriv(ALGORITHM, key, iv);
  const encrypted = Buffer.concat([cipher.update(plain, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, tag, encrypted]).toString("base64");
}

export function decryptPassword(ciphertext: string): string {
  const key = getKey();
  const buf = Buffer.from(ciphertext, "base64");
  const iv = buf.subarray(0, 12);
  const tag = buf.subarray(12, 28);
  const encrypted = buf.subarray(28);
  const decipher = createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(tag);
  return Buffer.concat([decipher.update(encrypted), decipher.final()]).toString("utf8");
}
