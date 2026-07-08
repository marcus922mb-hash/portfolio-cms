"use server";

import { createClient } from "@/lib/supabase/server";
import { builderComponentsToDemoContent } from "@/lib/builder/builder-to-demo";
import { parseDemoContent } from "@/features/demos/types";
import type { BuilderComponent } from "@/features/builder/types";
import type { Json } from "@/types/database";

export async function publishBuilderToDemo(
  demoId: string,
  components: BuilderComponent[]
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Brak autoryzacji" };

  const { data: demo } = await supabase
    .from("demos")
    .select("content")
    .eq("id", demoId)
    .maybeSingle();

  if (!demo) return { success: false, error: "Demo nie istnieje" };

  const base = parseDemoContent(demo.content);
  const updated = builderComponentsToDemoContent(components, base);

  const { error } = await supabase
    .from("demos")
    .update({ content: updated as unknown as Json, updated_at: new Date().toISOString() })
    .eq("id", demoId);

  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function importDemoToBuilder(
  demoId: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Brak autoryzacji" };

  const { data: demo } = await supabase
    .from("demos")
    .select("content, style, primary_color, secondary_color")
    .eq("id", demoId)
    .maybeSingle();

  if (!demo) return { success: false, error: "Demo nie istnieje" };

  const { demoContentToBuilderComponents } = await import("@/lib/builder/demo-to-builder");
  const content = parseDemoContent(demo.content);
  const components = demoContentToBuilderComponents(content, demo);

  const { error } = await supabase
    .from("builder_pages")
    .update({ components: components as unknown as Json, updated_at: new Date().toISOString() })
    .eq("demo_id", demoId);

  if (error) return { success: false, error: error.message };
  return { success: true };
}
