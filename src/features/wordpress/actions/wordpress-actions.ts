"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient as createSupabaseClient } from "@/lib/supabase/server";
import { wordPressConnectionSchema } from "@/features/wordpress/schemas/wordpress-schema";
import { WP_CONNECTION_STATUS_LABELS } from "@/features/wordpress/types";
import type { WPConnectionStatus } from "@/features/wordpress/types";
import {
  encryptPassword,
  decryptPassword,
  isEncryptionAvailable,
} from "@/lib/wordpress/encryption";
import { testWordPressConnection } from "@/lib/wordpress/client";

export type WPConnectionActionState = {
  error?: string;
  fieldErrors?: Partial<Record<string, string[]>>;
} | null;

export type WPTestActionState = {
  success?: boolean;
  siteName?: string;
  siteUrl?: string;
  error?: string;
} | null;

export type WPStatusActionState = {
  success?: boolean;
  error?: string;
} | null;

export async function createWordPressConnectionAction(
  _prevState: WPConnectionActionState,
  formData: FormData
): Promise<WPConnectionActionState> {
  const supabase = await createSupabaseClient();
  const parsed = wordPressConnectionSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!parsed.success) {
    return {
      error: "Formularz zawiera błędy — sprawdź pola poniżej.",
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  const d = parsed.data;
  const rawPassword = d.application_password?.trim() ?? "";

  let encryptedPassword: string | null = null;
  if (rawPassword) {
    if (!isEncryptionAvailable()) {
      return {
        error:
          "WORDPRESS_ENCRYPTION_KEY nie jest skonfigurowany. Ustaw zmienną środowiskową przed zapisaniem hasła.",
      };
    }
    try {
      encryptedPassword = encryptPassword(rawPassword);
    } catch (err) {
      return { error: `Błąd szyfrowania: ${err instanceof Error ? err.message : "nieznany błąd"}` };
    }
  }

  const { data: conn, error } = await supabase
    .from("wordpress_connections")
    .insert({
      client_id: d.client_id || null,
      name: d.name || null,
      site_url: d.site_url,
      api_base_url: d.api_base_url || null,
      auth_type: d.auth_type,
      username: d.username || null,
      application_password_encrypted: encryptedPassword,
      status: "draft",
      notes: d.notes || null,
    })
    .select("id, name, site_url")
    .single();

  if (error) return { error: `Nie udało się zapisać połączenia: ${error.message}` };

  await supabase.from("activity_logs").insert({
    entity_type: "wordpress_connection",
    entity_id: conn.id,
    action: "created",
    description: `Dodano połączenie WordPress: ${conn.name || conn.site_url}`,
    metadata: { site_url: conn.site_url },
  });

  revalidatePath("/panel/wordpress");
  redirect(`/panel/wordpress/${conn.id}`);
}

export async function updateWordPressConnectionAction(
  connectionId: string,
  _prevState: WPConnectionActionState,
  formData: FormData
): Promise<WPConnectionActionState> {
  const supabase = await createSupabaseClient();
  const parsed = wordPressConnectionSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!parsed.success) {
    return {
      error: "Formularz zawiera błędy — sprawdź pola poniżej.",
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  const d = parsed.data;
  const rawPassword = d.application_password?.trim() ?? "";

  // Fetch current encrypted password to preserve it if no new one provided
  const { data: current } = await supabase
    .from("wordpress_connections")
    .select("application_password_encrypted")
    .eq("id", connectionId)
    .single();

  let encryptedPassword = current?.application_password_encrypted ?? null;

  if (rawPassword) {
    if (!isEncryptionAvailable()) {
      return { error: "WORDPRESS_ENCRYPTION_KEY nie jest skonfigurowany. Nie można zapisać hasła." };
    }
    try {
      encryptedPassword = encryptPassword(rawPassword);
    } catch (err) {
      return { error: `Błąd szyfrowania: ${err instanceof Error ? err.message : "nieznany błąd"}` };
    }
  }

  const { error } = await supabase
    .from("wordpress_connections")
    .update({
      client_id: d.client_id || null,
      name: d.name || null,
      site_url: d.site_url,
      api_base_url: d.api_base_url || null,
      auth_type: d.auth_type,
      username: d.username || null,
      application_password_encrypted: encryptedPassword,
      notes: d.notes || null,
    })
    .eq("id", connectionId);

  if (error) return { error: `Nie udało się zaktualizować połączenia: ${error.message}` };

  await supabase.from("activity_logs").insert({
    entity_type: "wordpress_connection",
    entity_id: connectionId,
    action: "updated",
    description: "Zaktualizowano dane połączenia WordPress",
    metadata: { site_url: d.site_url },
  });

  revalidatePath("/panel/wordpress");
  revalidatePath(`/panel/wordpress/${connectionId}`);
  redirect(`/panel/wordpress/${connectionId}`);
}

export async function testWordPressConnectionAction(
  connectionId: string,
  _prevState: WPTestActionState,
  _formData: FormData
): Promise<WPTestActionState> {
  const supabase = await createSupabaseClient();

  const { data: conn, error: fetchError } = await supabase
    .from("wordpress_connections")
    .select("*")
    .eq("id", connectionId)
    .single();

  if (fetchError || !conn) return { error: "Nie znaleziono połączenia." };

  let password: string | undefined;
  if (conn.application_password_encrypted && isEncryptionAvailable()) {
    try {
      password = decryptPassword(conn.application_password_encrypted);
    } catch {
      // proceed without decrypted password — public endpoints may still work
    }
  }

  const result = await testWordPressConnection({
    siteUrl: conn.site_url,
    apiBase: conn.api_base_url,
    username: conn.username,
    password,
  });

  const now = new Date().toISOString();
  const newStatus: WPConnectionStatus = result.success ? "connected" : "error";

  await supabase
    .from("wordpress_connections")
    .update({ status: newStatus, last_sync_at: now })
    .eq("id", connectionId);

  await supabase.from("activity_logs").insert({
    entity_type: "wordpress_connection",
    entity_id: connectionId,
    action: result.success ? "test_success" : "test_error",
    description: result.success
      ? `Test połączenia zakończony sukcesem: ${result.siteName ?? conn.site_url}`
      : `Test połączenia nie powiódł się: ${result.error}`,
    metadata: { ...result, tested_at: now },
  });

  revalidatePath(`/panel/wordpress/${connectionId}`);
  return result;
}

export async function updateWPConnectionStatusAction(
  connectionId: string,
  _prevState: WPStatusActionState,
  formData: FormData
): Promise<WPStatusActionState> {
  const status = formData.get("status") as WPConnectionStatus | null;
  if (!status) return { error: "Brak statusu." };

  const supabase = await createSupabaseClient();
  const { error } = await supabase
    .from("wordpress_connections")
    .update({ status })
    .eq("id", connectionId);
  if (error) return { error: `Nie udało się zmienić statusu: ${error.message}` };

  await supabase.from("activity_logs").insert({
    entity_type: "wordpress_connection",
    entity_id: connectionId,
    action: "status_changed",
    description: `Zmieniono status na: ${WP_CONNECTION_STATUS_LABELS[status]}`,
    metadata: { status },
  });

  revalidatePath(`/panel/wordpress/${connectionId}`);
  return { success: true };
}
