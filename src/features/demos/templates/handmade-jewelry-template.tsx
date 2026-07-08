import { WebsiteLivePreview } from "@/features/demos/live-preview/website-live-preview";
import { parseDemoContent, type Demo } from "@/features/demos/types";

type Props = {
  demo: Demo;
};

function clientName(demo: Demo) {
  const client = demo.clients;
  if (!client) return demo.title;
  return (
    client.company_name ||
    [client.first_name, client.last_name].filter(Boolean).join(" ") ||
    demo.title
  );
}

/**
 * Zachowany eksport utrzymuje kompatybilność istniejących tras i importów.
 * Renderer nie jest już związany z jedną branżą — obsługuje pełny dokument v2.
 */
export function HandmadeJewelryTemplate({ demo }: Props) {
  const content = parseDemoContent(demo.content);
  const themedContent = {
    ...content,
    site: {
      ...content.site,
      colors: {
        ...content.site.colors,
        primary: demo.primary_color || content.site.colors.primary,
        secondary: demo.secondary_color || content.site.colors.secondary,
      },
    },
  };

  return (
    <WebsiteLivePreview
      content={themedContent}
      demoLabel={`Wersja demonstracyjna przygotowana dla: ${clientName(demo)}`}
    />
  );
}
