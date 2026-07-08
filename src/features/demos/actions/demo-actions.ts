"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient as createSupabaseClient } from "@/lib/supabase/server";
import {
  buildDemoContent,
  demoFormSchema,
  parseImagesText,
  slugify,
} from "@/features/demos/schemas/demo-schema";
import { DEMO_STATUS_LABELS, type DemoStatus } from "@/features/demos/types";
import { isDemoSlugTaken } from "@/features/demos/queries/demo-queries";

export type DemoActionState =
  | {
      error?: string;
      fieldErrors?: Partial<Record<string, string[]>>;
    }
  | null;

export type DemoQuickActionState =
  | {
      error?: string;
      success?: boolean;
    }
  | null;

async function ensureUniqueSlug(slug: string) {
  let candidate = slug || "demo";
  let suffix = 2;
  while (await isDemoSlugTaken(candidate)) {
    candidate = `${slug}-${suffix}`;
    suffix += 1;
  }
  return candidate;
}

function toDateOrNull(value?: string) {
  return value?.trim() ? new Date(value).toISOString() : null;
}

export async function createDemoAction(
  _prevState: DemoActionState,
  formData: FormData
): Promise<DemoActionState> {
  const supabase = await createSupabaseClient();
  const parsed = demoFormSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!parsed.success) {
    return {
      error: "Formularz zawiera błędy — sprawdź pola poniżej.",
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  const d = parsed.data;
  const slug = await ensureUniqueSlug(slugify(d.slug || d.title));
  const content = buildDemoContent(d);
  const images = parseImagesText(d.images_text);

  const { data: demo, error } = await supabase
    .from("demos")
    .insert({
      client_id: d.client_id,
      estimate_id: d.estimate_id || null,
      slug,
      title: d.title,
      industry: d.industry,
      style: d.style,
      generation_mode: d.generation_mode ?? "full",
      primary_color: d.primary_color || null,
      secondary_color: d.secondary_color || null,
      logo_url: d.logo_url || null,
      images,
      content,
      status: d.status,
      is_active: d.is_active === "on",
      expires_at: toDateOrNull(d.expires_at),
    })
    .select("id, title")
    .single();

  if (error) return { error: `Nie udało się utworzyć demo: ${error.message}` };

  await supabase.from("activity_logs").insert({
    entity_type: "demo",
    entity_id: demo.id,
    action: "created",
    description: `Utworzono demo: ${demo.title}`,
    metadata: { slug },
  });

  revalidatePath("/panel/demo");
  redirect(`/panel/demo/${demo.id}`);
}

export async function updateDemoAction(
  demoId: string,
  _prevState: DemoActionState,
  formData: FormData
): Promise<DemoActionState> {
  const supabase = await createSupabaseClient();
  const parsed = demoFormSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!parsed.success) {
    return {
      error: "Formularz zawiera błędy — sprawdź pola poniżej.",
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  const d = parsed.data;
  const slug = slugify(d.slug || d.title);
  if (await isDemoSlugTaken(slug, demoId)) {
    return { error: "Ten slug jest już zajęty. Wybierz inny adres demo." };
  }

  const content = buildDemoContent(d);
  const images = parseImagesText(d.images_text);

  const { data: demo, error } = await supabase
    .from("demos")
    .update({
      client_id: d.client_id,
      estimate_id: d.estimate_id || null,
      slug,
      title: d.title,
      industry: d.industry,
      style: d.style,
      generation_mode: d.generation_mode ?? "full",
      primary_color: d.primary_color || null,
      secondary_color: d.secondary_color || null,
      logo_url: d.logo_url || null,
      images,
      content,
      status: d.status,
      is_active: d.is_active === "on",
      expires_at: toDateOrNull(d.expires_at),
    })
    .eq("id", demoId)
    .select("id, title")
    .single();

  if (error) return { error: `Nie udało się zaktualizować demo: ${error.message}` };

  await supabase.from("activity_logs").insert({
    entity_type: "demo",
    entity_id: demo.id,
    action: "updated",
    description: "Zaktualizowano demo",
    metadata: { slug },
  });

  revalidatePath("/panel/demo");
  revalidatePath(`/panel/demo/${demoId}`);
  redirect(`/panel/demo/${demoId}`);
}

export async function updateDemoStatusAction(
  demoId: string,
  _prevState: DemoQuickActionState,
  formData: FormData
): Promise<DemoQuickActionState> {
  const status = formData.get("status") as DemoStatus | null;
  if (!status) return { error: "Brak statusu." };

  const supabase = await createSupabaseClient();
  const { error } = await supabase.from("demos").update({ status }).eq("id", demoId);
  if (error) return { error: `Nie udało się zmienić statusu: ${error.message}` };

  await supabase.from("activity_logs").insert({
    entity_type: "demo",
    entity_id: demoId,
    action: "status_changed",
    description: `Zmieniono status na: ${DEMO_STATUS_LABELS[status]}`,
    metadata: { status },
  });

  revalidatePath(`/panel/demo/${demoId}`);
  return { success: true };
}

export async function markDemoSentAction(
  demoId: string,
  _prevState: DemoQuickActionState
): Promise<DemoQuickActionState> {
  void _prevState;
  const supabase = await createSupabaseClient();
  const now = new Date().toISOString();
  const { error } = await supabase.from("demos").update({ status: "sent", sent_at: now }).eq("id", demoId);
  if (error) return { error: `Nie udało się oznaczyć demo jako wysłane: ${error.message}` };

  await supabase.from("activity_logs").insert({
    entity_type: "demo",
    entity_id: demoId,
    action: "sent",
    description: "Oznaczono demo jako wysłane",
    metadata: { status: "sent", sent_at: now },
  });

  revalidatePath(`/panel/demo/${demoId}`);
  return { success: true };
}

export async function deactivateDemoAction(
  demoId: string,
  _prevState: DemoQuickActionState
): Promise<DemoQuickActionState> {
  void _prevState;
  const supabase = await createSupabaseClient();
  const { error } = await supabase
    .from("demos")
    .update({ is_active: false, status: "inactive" })
    .eq("id", demoId);

  if (error) return { error: `Nie udało się dezaktywować demo: ${error.message}` };

  await supabase.from("activity_logs").insert({
    entity_type: "demo",
    entity_id: demoId,
    action: "deactivated",
    description: "Dezaktywowano demo",
    metadata: { status: "inactive" },
  });

  revalidatePath(`/panel/demo/${demoId}`);
  return { success: true };
}
