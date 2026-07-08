"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient as createSupabaseClient } from "@/lib/supabase/server";
import { clientSchema, noteSchema } from "@/features/clients/schemas/client-schema";
import type { ClientStatus } from "@/features/clients/types";

export type ClientActionState = {
  error?: string;
  fieldErrors?: Partial<Record<string, string[]>>;
} | null;

export type NoteActionState = {
  error?: string;
  success?: boolean;
} | null;

export type StatusActionState = {
  error?: string;
  success?: boolean;
} | null;

// ── Tworzenie klienta ─────────────────────────────────────────

export async function createClientAction(
  _prevState: ClientActionState,
  formData: FormData
): Promise<ClientActionState> {
  const supabase = await createSupabaseClient();

  const parsed = clientSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    return {
      error: "Formularz zawiera błędy — sprawdź pola poniżej.",
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  const d = parsed.data;
  const socialLinks = {
    linkedin: d.social_linkedin || null,
    facebook: d.social_facebook || null,
    instagram: d.social_instagram || null,
  };

  const { data: client, error } = await supabase
    .from("clients")
    .insert({
      first_name: d.first_name,
      last_name: d.last_name,
      company_name: d.company_name || null,
      email: d.email || null,
      phone: d.phone || null,
      industry: d.industry || null,
      city: d.city || null,
      website_url: d.website_url || null,
      notes: d.notes || null,
      status: d.status,
      social_links: socialLinks,
    })
    .select("id, first_name, last_name, company_name")
    .single();

  if (error) {
    return { error: `Nie udało się zapisać klienta: ${error.message}` };
  }

  await supabase.from("activity_logs").insert({
    entity_type: "client",
    entity_id: client.id,
    action: "created",
    description: `Dodano klienta ${[client.first_name, client.last_name].filter(Boolean).join(" ") || client.company_name || ""}`,
  });

  redirect(`/panel/klienci/${client.id}`);
}

// ── Edycja klienta ────────────────────────────────────────────

export async function updateClientAction(
  clientId: string,
  _prevState: ClientActionState,
  formData: FormData
): Promise<ClientActionState> {
  const supabase = await createSupabaseClient();

  const parsed = clientSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    return {
      error: "Formularz zawiera błędy — sprawdź pola poniżej.",
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  const d = parsed.data;
  const socialLinks = {
    linkedin: d.social_linkedin || null,
    facebook: d.social_facebook || null,
    instagram: d.social_instagram || null,
  };

  const { data: client, error } = await supabase
    .from("clients")
    .update({
      first_name: d.first_name,
      last_name: d.last_name,
      company_name: d.company_name || null,
      email: d.email || null,
      phone: d.phone || null,
      industry: d.industry || null,
      city: d.city || null,
      website_url: d.website_url || null,
      notes: d.notes || null,
      status: d.status,
      social_links: socialLinks,
    })
    .eq("id", clientId)
    .select("id, first_name, last_name")
    .single();

  if (error) {
    return { error: `Nie udało się zaktualizować klienta: ${error.message}` };
  }

  await supabase.from("activity_logs").insert({
    entity_type: "client",
    entity_id: client.id,
    action: "updated",
    description: `Zaktualizowano dane klienta`,
  });

  revalidatePath(`/panel/klienci/${clientId}`);
  redirect(`/panel/klienci/${clientId}`);
}

// ── Zmiana statusu klienta ────────────────────────────────────

export async function updateClientStatusAction(
  clientId: string,
  _prevState: StatusActionState,
  formData: FormData
): Promise<StatusActionState> {
  const newStatus = formData.get("status") as ClientStatus | null;

  if (!newStatus) return { error: "Brak statusu." };

  const supabase = await createSupabaseClient();

  const { error } = await supabase
    .from("clients")
    .update({ status: newStatus })
    .eq("id", clientId);

  if (error) return { error: `Nie udało się zmienić statusu: ${error.message}` };

  await supabase.from("activity_logs").insert({
    entity_type: "client",
    entity_id: clientId,
    action: "status_changed",
    description: `Zmieniono status na: ${newStatus}`,
    metadata: { status: newStatus },
  });

  revalidatePath(`/panel/klienci/${clientId}`);
  return { success: true };
}

// ── Dodawanie notatki ─────────────────────────────────────────

export async function addNoteAction(
  clientId: string,
  _prevState: NoteActionState,
  formData: FormData
): Promise<NoteActionState> {
  const parsed = noteSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Nieprawidłowe dane." };
  }

  const supabase = await createSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error } = await supabase.from("notes").insert({
    client_id: clientId,
    content: parsed.data.content,
    created_by: user?.id ?? null,
  });

  if (error) return { error: `Nie udało się dodać notatki: ${error.message}` };

  await supabase.from("activity_logs").insert({
    entity_type: "client",
    entity_id: clientId,
    action: "note_added",
    description: "Dodano notatkę",
  });

  revalidatePath(`/panel/klienci/${clientId}`);
  return { success: true };
}
