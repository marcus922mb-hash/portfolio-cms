import { randomBytes } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

import { createClient } from "@supabase/supabase-js";

const envPath = resolve(process.cwd(), ".env.local");

function loadLocalEnv() {
  if (!existsSync(envPath)) {
    return;
  }

  const lines = readFileSync(envPath, "utf8").split(/\r?\n/);

  for (const line of lines) {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }

    const separatorIndex = trimmed.indexOf("=");

    if (separatorIndex === -1) {
      continue;
    }

    const key = trimmed.slice(0, separatorIndex).trim();
    let value = trimmed.slice(separatorIndex + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

function readRequiredEnv(name) {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`Brakuje ${name}. Uzupełnij go w .env.local.`);
  }

  return value;
}

function createPassword() {
  return `${randomBytes(24).toString("base64url")}Aa1!`;
}

loadLocalEnv();

const email = process.env.ADMIN_EMAIL?.trim() || process.argv[2]?.trim();
let password = process.env.ADMIN_PASSWORD?.trim() || process.argv[3]?.trim();
const generatedPassword = !password;

if (!email) {
  throw new Error(
    "Podaj email: ADMIN_EMAIL=admin@example.com npm run supabase:create-admin",
  );
}

if (!email.includes("@")) {
  throw new Error("Email administratora wygląda niepoprawnie.");
}

if (!password) {
  password = createPassword();
}

const supabaseUrl = readRequiredEnv("NEXT_PUBLIC_SUPABASE_URL");
const serviceRoleKey = readRequiredEnv("SUPABASE_SERVICE_ROLE_KEY");

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

const { data, error } = await supabase.auth.admin.createUser({
  email,
  email_confirm: true,
  password,
});

if (error) {
  throw new Error(`Supabase nie utworzył użytkownika: ${error.message}`);
}

console.log("Utworzono użytkownika Supabase.");
console.log(`Email: ${email}`);
console.log(`User ID: ${data.user?.id ?? "brak id w odpowiedzi"}`);

if (generatedPassword) {
  console.log(`Wygenerowane hasło: ${password}`);
} else {
  console.log("Hasło: ustawione z ADMIN_PASSWORD albo drugiego argumentu.");
}
