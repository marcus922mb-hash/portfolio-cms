"use server";

import { createClient } from "@/lib/supabase/server";
import type { BuilderComponent, BuilderPageSettings, BuilderPage } from "@/features/builder/types";
import type { Json } from "@/types/database";

export async function getBuilderPage(demoId: string): Promise<BuilderPage | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("builder_pages")
    .select("*")
    .eq("demo_id", demoId)
    .maybeSingle();
  if (error || !data) return null;
  return data as unknown as BuilderPage;
}

export async function saveBuilderPage(args: {
  demoId: string;
  name: string;
  components: BuilderComponent[];
  settings: BuilderPageSettings;
}): Promise<{ success: boolean; pageId?: string; error?: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Brak autoryzacji" };

  const { data, error } = await supabase
    .from("builder_pages")
    .upsert(
      {
        demo_id: args.demoId,
        name: args.name,
        components: args.components as unknown as Json,
        settings: args.settings as unknown as Json,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "demo_id", ignoreDuplicates: false }
    )
    .select("id")
    .single();

  if (error) return { success: false, error: error.message };
  return { success: true, pageId: data?.id };
}

export async function listBuilderPages(): Promise<Array<{
  id: string;
  demo_id: string;
  name: string;
  updated_at: string;
  demo_name: string | null;
}>> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("builder_pages")
    .select("id, demo_id, name, updated_at, demos(title)")
    .order("updated_at", { ascending: false });

  return (data ?? []).map((row: Record<string, unknown>) => ({
    id: row.id as string,
    demo_id: row.demo_id as string,
    name: row.name as string,
    updated_at: row.updated_at as string,
    demo_name: ((row.demos as Record<string, unknown> | null)?.title as string) ?? null,
  }));
}
