export class SupabaseConfigError extends Error {
  constructor(message = "Supabase nie jest skonfigurowany.") {
    super(message);
    this.name = "SupabaseConfigError";
  }
}

function readEnv(name: string) {
  const value = process.env[name]?.trim();
  return value && value.length > 0 ? value : null;
}

export function getSupabasePublicEnv() {
  const url = readEnv("NEXT_PUBLIC_SUPABASE_URL");
  const anonKey = readEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY");

  if (!url || !anonKey) {
    throw new SupabaseConfigError(
      "Brakuje NEXT_PUBLIC_SUPABASE_URL lub NEXT_PUBLIC_SUPABASE_ANON_KEY w .env.local."
    );
  }

  return { url, anonKey };
}

export function getSupabaseAdminEnv() {
  const { url } = getSupabasePublicEnv();
  const serviceRoleKey = readEnv("SUPABASE_SERVICE_ROLE_KEY");

  if (!serviceRoleKey) {
    throw new SupabaseConfigError("Brakuje SUPABASE_SERVICE_ROLE_KEY w .env.local.");
  }

  return { url, serviceRoleKey };
}

export function isSupabaseConfigured() {
  return Boolean(
    readEnv("NEXT_PUBLIC_SUPABASE_URL") &&
      readEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY") &&
      readEnv("SUPABASE_SERVICE_ROLE_KEY")
  );
}

export function isSupabaseAuthConfigured() {
  return Boolean(readEnv("NEXT_PUBLIC_SUPABASE_URL") && readEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY"));
}
