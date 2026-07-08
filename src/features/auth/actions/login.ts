"use server";

import { createClient } from "@/lib/supabase/server";
import { SupabaseConfigError } from "@/lib/supabase/env";
import { redirect } from "next/navigation";

export type LoginState = { error: string } | null;

export async function loginAction(
  _prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const email = (formData.get("email") as string | null)?.trim() ?? "";
  const password = (formData.get("password") as string | null) ?? "";

  if (!email || !password) {
    return { error: "Podaj e-mail i hasło." };
  }

  let supabase;
  try {
    supabase = await createClient();
  } catch (error) {
    if (error instanceof SupabaseConfigError) {
      return { error: error.message };
    }
    return { error: "Nie udało się połączyć z Supabase." };
  }

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    // Deliberately vague — don't hint whether email or password is wrong
    return { error: "Nieprawidłowy e-mail lub hasło." };
  }

  redirect("/panel");
}
