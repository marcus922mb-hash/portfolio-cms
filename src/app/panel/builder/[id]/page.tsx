import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BuilderEditor } from "@/features/builder/components/builder-editor";
import { createClient } from "@/lib/supabase/server";
import { demoContentToBuilderComponents } from "@/lib/builder/demo-to-builder";
import { parseDemoContent } from "@/features/demos/types";
import type { BuilderPage } from "@/features/builder/types";
import type { Json } from "@/types/database";

export const metadata: Metadata = { title: "Builder" };

type Props = { params: Promise<{ id: string }> };

async function getOrCreateBuilderPage(demoId: string): Promise<BuilderPage | null> {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  // Verify the demo exists and fetch its content for auto-import
  const { data: demo } = await supabase
    .from("demos")
    .select("id, title, content, style, primary_color, secondary_color")
    .eq("id", demoId)
    .maybeSingle();
  if (!demo) return null;

  // Try to load existing builder page
  const { data: existing } = await supabase
    .from("builder_pages")
    .select("*")
    .eq("demo_id", demoId)
    .maybeSingle();

  if (existing) {
    // If page has no components but demo has content, auto-import
    const existingComponents = Array.isArray(existing.components) ? existing.components : [];
    if (existingComponents.length === 0 && demo.content) {
      const content = parseDemoContent(demo.content);
      const components = demoContentToBuilderComponents(content, demo);
      if (components.length > 0) {
        await supabase
          .from("builder_pages")
          .update({ components: components as unknown as Json, updated_at: new Date().toISOString() })
          .eq("demo_id", demoId);
        return { ...existing, components } as unknown as BuilderPage;
      }
    }
    return existing as unknown as BuilderPage;
  }

  // Create a new page — auto-import from demo content if available
  let initialComponents: unknown[] = [];
  if (demo.content) {
    const content = parseDemoContent(demo.content);
    initialComponents = demoContentToBuilderComponents(content, demo);
  }

  const { data: created } = await supabase
    .from("builder_pages")
    .insert({
      demo_id: demoId,
      name: demo.title || "Nowa strona",
      components: initialComponents as unknown as Json,
      settings: {},
    })
    .select("*")
    .single();

  return created as unknown as BuilderPage | null;
}

export default async function BuilderPage({ params }: Props) {
  const { id } = await params;
  const [page, supabase] = await Promise.all([getOrCreateBuilderPage(id), createClient()]);
  if (!page) notFound();
  const { data: { user } } = await supabase.auth.getUser();
  const preferredDevice = user?.user_metadata?.default_builder_device;
  const initialDevice =
    preferredDevice === "tablet" || preferredDevice === "mobile"
      ? preferredDevice
      : "desktop";
  return <BuilderEditor page={page} initialDevice={initialDevice} />;
}
