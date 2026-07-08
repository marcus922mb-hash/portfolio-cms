"use server";

import type { Json } from "@/types/database";
import { createClient } from "@/lib/supabase/server";
import { getTemplateById } from "@/features/templates/catalog";
import { hydrateTemplateImages } from "@/features/templates/image-library";
import { imageService } from "@/lib/images";

export type CreateTemplateResult =
  | { success: true; demoId: string }
  | { success: false; error: string };

export async function createFromTemplate(templateId: string): Promise<CreateTemplateResult> {
  const template = getTemplateById(templateId);
  if (!template) return { success: false, error: "Nie znaleziono szablonu." };

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Sesja wygasła. Zaloguj się ponownie." };

  const uniquePart = crypto.randomUUID().slice(0, 8);
  const slug = `${template.id}-${uniquePart}`;
  const libraryImages = await imageService.search({
    query: template.imageQuery,
    count: 10,
    orientation: "landscape",
  });
  const selectedUrls = libraryImages.length
    ? libraryImages.map((image) => image.url)
    : template.previewImages;
  const components = hydrateTemplateImages(template.components, selectedUrls);
  const { data: demo, error: demoError } = await supabase
    .from("demos")
    .insert({
      slug,
      title: `${template.name} — szkic`,
      industry: template.industry,
      style: template.style,
      primary_color: template.colors.primary,
      secondary_color: template.colors.secondary,
      images: libraryImages as unknown as Json,
      content: {
        sourceTemplateId: template.id,
        seo: template.settings.seo,
        notFound: template.settings.notFound,
      },
      status: "draft",
      is_active: false,
    })
    .select("id")
    .single();

  if (demoError || !demo) {
    return { success: false, error: demoError?.message ?? "Nie udało się utworzyć szkicu." };
  }

  const { error: builderError } = await supabase.from("builder_pages").insert({
    demo_id: demo.id,
    name: template.name,
    components: components as unknown as Json,
    settings: template.settings as unknown as Json,
  });

  if (builderError) {
    await supabase.from("demos").delete().eq("id", demo.id);
    return { success: false, error: builderError.message };
  }

  await supabase.from("activity_logs").insert({
    entity_type: "demo",
    entity_id: demo.id,
    action: "created_from_template",
    description: `Utworzono szkic z szablonu: ${template.name}`,
    metadata: {
      template_id: template.id,
      website_type: template.websiteType,
      image_query: template.imageQuery,
      image_count: selectedUrls.length,
      image_source: libraryImages.length ? "connected-library" : "template-fallback",
    },
  });

  return { success: true, demoId: demo.id };
}
