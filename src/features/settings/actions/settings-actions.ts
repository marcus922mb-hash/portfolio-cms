"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import type { SettingsActionState } from "@/features/settings/types";

const profileSchema = z.object({
  full_name: z.string().trim().min(2, "Podaj imię i nazwisko.").max(80),
  company_name: z.string().trim().max(120).optional(),
  phone: z.string().trim().max(30).optional(),
});

const preferencesSchema = z.object({
  language: z.enum(["pl", "en"]),
  timezone: z.string().trim().min(1).max(80),
  default_builder_device: z.enum(["desktop", "tablet", "mobile"]),
  reduced_motion: z.boolean(),
  email_notifications: z.boolean(),
  demo_notifications: z.boolean(),
  weekly_summary: z.boolean(),
});

const passwordSchema = z.object({
  password: z.string().min(10, "Hasło musi mieć co najmniej 10 znaków."),
  password_confirmation: z.string(),
}).refine((data) => data.password === data.password_confirmation, {
  path: ["password_confirmation"],
  message: "Hasła nie są takie same.",
});

async function getAuthenticatedClient() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return { supabase, user };
}

export async function updateProfileAction(
  _state: SettingsActionState,
  formData: FormData
): Promise<SettingsActionState> {
  const parsed = profileSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    return {
      error: "Sprawdź dane profilu.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const { supabase, user } = await getAuthenticatedClient();
  if (!user) return { error: "Sesja wygasła. Zaloguj się ponownie." };

  const { error } = await supabase.auth.updateUser({
    data: {
      ...user.user_metadata,
      full_name: parsed.data.full_name,
      company_name: parsed.data.company_name || "",
      phone: parsed.data.phone || "",
    },
  });

  if (error) return { error: `Nie udało się zapisać profilu: ${error.message}` };

  revalidatePath("/panel", "layout");
  return { success: "Dane profilu zostały zapisane." };
}

export async function updatePreferencesAction(
  _state: SettingsActionState,
  formData: FormData
): Promise<SettingsActionState> {
  const parsed = preferencesSchema.safeParse({
    language: formData.get("language"),
    timezone: formData.get("timezone"),
    default_builder_device: formData.get("default_builder_device"),
    reduced_motion: formData.get("reduced_motion") === "on",
    email_notifications: formData.get("email_notifications") === "on",
    demo_notifications: formData.get("demo_notifications") === "on",
    weekly_summary: formData.get("weekly_summary") === "on",
  });

  if (!parsed.success) {
    return {
      error: "Sprawdź ustawienia preferencji.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const { supabase, user } = await getAuthenticatedClient();
  if (!user) return { error: "Sesja wygasła. Zaloguj się ponownie." };

  const { error } = await supabase.auth.updateUser({
    data: {
      ...user.user_metadata,
      ...parsed.data,
    },
  });

  if (error) return { error: `Nie udało się zapisać preferencji: ${error.message}` };

  revalidatePath("/panel/ustawienia");
  return { success: "Preferencje zostały zapisane." };
}

export async function updateAISettingsAction(
  _state: SettingsActionState,
  formData: FormData
): Promise<SettingsActionState> {
  const provider = formData.get("ai_preferred_provider");
  const model = formData.get("ai_preferred_model");

  if (typeof provider !== "string" || typeof model !== "string" || !model.trim()) {
    return { error: "Wybierz dostawcę i model." };
  }

  const { supabase, user } = await getAuthenticatedClient();
  if (!user) return { error: "Sesja wygasła. Zaloguj się ponownie." };

  const { error } = await supabase.auth.updateUser({
    data: {
      ...user.user_metadata,
      ai_preferred_provider: provider,
      ai_preferred_model: model.trim(),
    },
  });

  if (error) return { error: `Nie udało się zapisać ustawień AI: ${error.message}` };

  revalidatePath("/panel/ustawienia");
  return { success: "Ustawienia AI zostały zapisane." };
}

export async function updatePasswordAction(
  _state: SettingsActionState,
  formData: FormData
): Promise<SettingsActionState> {
  const parsed = passwordSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    return {
      error: "Hasło nie spełnia wymagań.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const { supabase, user } = await getAuthenticatedClient();
  if (!user) return { error: "Sesja wygasła. Zaloguj się ponownie." };

  const { error } = await supabase.auth.updateUser({ password: parsed.data.password });
  if (error) return { error: `Nie udało się zmienić hasła: ${error.message}` };

  return { success: "Hasło zostało zmienione." };
}
