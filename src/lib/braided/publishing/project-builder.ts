import type { Demo, DemoContent, DemoImage } from "@/features/demos/types";
import type {
  WebsiteProject,
  WebsiteProjectAsset,
} from "@/lib/publishing/types";

function asset(
  key: string,
  purpose: WebsiteProjectAsset["purpose"],
  image: DemoImage
): WebsiteProjectAsset {
  return { key, purpose, ...image };
}

export function buildWebsiteProject(
  demo: Pick<Demo, "id" | "slug" | "title">,
  content: DemoContent
): WebsiteProject {
  const assets = [
    asset("hero", "hero", content.hero.image),
    asset("about", "about", content.about.image),
    ...content.gallery.items.map((image, index) =>
      asset(`gallery-${index + 1}`, "gallery", image)
    ),
    asset("open-graph", "seo", content.seo.ogImage),
  ];

  return {
    schemaVersion: 1,
    id: demo.id,
    slug: demo.slug,
    name: content.site.name || demo.title,
    content,
    assets,
    createdAt: new Date().toISOString(),
  };
}

