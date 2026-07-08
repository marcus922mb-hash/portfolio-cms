"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { decryptWooCommerceSecret, encryptWooCommerceSecret, testWooCommerceConnection } from "@/lib/woocommerce/client";
import { createClient as createSupabaseClient } from "@/lib/supabase/server";
import { woocommerceConnectionFormSchema } from "@/features/woocommerce/schemas/woocommerce-schema";
import type { WooCommerceConnection } from "@/features/woocommerce/types";

export type WooCommerceActionState =
  | {
      error?: string;
      fieldErrors?: Partial<Record<string, string[]>>;
    }
  | null;

export type WooCommerceQuickActionState =
  | {
      success?: boolean;
      error?: string;
    }
  | null;

async function requireUser() {
  const supabase = await createSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Brak dostępu. Zaloguj się ponownie.");
  }

  return supabase;
}

export async function createWooCommerceConnectionAction(
  _prevState: WooCommerceActionState,
  formData: FormData
): Promise<WooCommerceActionState> {
  const parsed = woocommerceConnectionFormSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!parsed.success) {
    return {
      error: "Formularz zawiera błędy — sprawdź pola poniżej.",
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  try {
    const supabase = await requireUser();
    const input = parsed.data;

    const { data: connection, error } = await supabase
      .from("woocommerce_connections")
      .insert({
        client_id: input.client_id,
        wordpress_connection_id: input.wordpress_connection_id || null,
        name: input.name,
        store_url: input.store_url.replace(/\/+$/, ""),
        consumer_key_encrypted: encryptWooCommerceSecret(input.consumer_key),
        consumer_secret_encrypted: encryptWooCommerceSecret(input.consumer_secret),
        status: input.status,
        notes: input.notes?.trim() || null,
      })
      .select("id, name")
      .single();

    if (error || !connection) {
      return { error: `Nie udało się zapisać połączenia WooCommerce: ${error?.message ?? "nieznany błąd"}` };
    }

    await supabase.from("activity_logs").insert({
      entity_type: "woocommerce_connection",
      entity_id: connection.id,
      action: "created",
      description: `Dodano połączenie WooCommerce: ${connection.name}`,
    });

    revalidatePath("/panel/woocommerce/polaczenia");
    revalidatePath("/panel/woocommerce");
    revalidatePath(`/panel/klienci/${input.client_id}`);
    redirect(`/panel/woocommerce/${connection.id}`);
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Nie udało się zapisać połączenia WooCommerce.",
    };
  }
}

export async function testWooCommerceConnectionAction(
  connectionId: string,
  _prevState: WooCommerceQuickActionState,
  _formData: FormData
): Promise<WooCommerceQuickActionState> {

  try {
    const supabase = await requireUser();
    const { data, error } = await supabase
      .from("woocommerce_connections")
      .select("*")
      .eq("id", connectionId)
      .single();

    if (error || !data) {
      return { error: "Nie znaleziono połączenia WooCommerce." };
    }

    const connection = data as WooCommerceConnection;
    const credentials = {
      storeUrl: connection.store_url,
      consumerKey: decryptWooCommerceSecret(connection.consumer_key_encrypted),
      consumerSecret: decryptWooCommerceSecret(connection.consumer_secret_encrypted),
    };

    const result = await testWooCommerceConnection(credentials);
    const now = new Date().toISOString();

    await supabase
      .from("woocommerce_connections")
      .update({
        status: "connected",
        last_sync_at: now,
      })
      .eq("id", connection.id);

    await supabase.from("activity_logs").insert({
      entity_type: "woocommerce_connection",
      entity_id: connection.id,
      action: "tested",
      description: "Przetestowano połączenie WooCommerce",
      metadata: {
        status: "connected",
        product_count: result.products.length,
        category_count: result.categories.length,
        order_count: result.orders.length,
        tested_at: now,
      },
    });

    revalidatePath(`/panel/woocommerce/${connection.id}`);
    revalidatePath("/panel/woocommerce/polaczenia");
    revalidatePath("/panel/woocommerce");
    if (connection.client_id) {
      revalidatePath(`/panel/klienci/${connection.client_id}`);
    }

    return { success: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Nie udało się przetestować połączenia WooCommerce.";

    try {
      const supabase = await createSupabaseClient();
      await supabase
        .from("woocommerce_connections")
        .update({ status: "error" })
        .eq("id", connectionId);

      await supabase.from("activity_logs").insert({
        entity_type: "woocommerce_connection",
        entity_id: connectionId,
        action: "test_failed",
        description: "Błąd testu połączenia WooCommerce",
        metadata: { error: message },
      });

      revalidatePath(`/panel/woocommerce/${connectionId}`);
      revalidatePath("/panel/woocommerce/polaczenia");
      revalidatePath("/panel/woocommerce");
    } catch {
      // Best effort logging only.
    }

    return { error: message };
  }
}
