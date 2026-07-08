import { nanoid } from "nanoid";
import type { BuilderComponent, ComponentVisibility, ComponentAnimation } from "@/features/builder/types";
import type { DemoContent } from "@/features/demos/types";

function vis(visible: boolean): ComponentVisibility {
  return { desktop: visible, tablet: visible, mobile: visible };
}

const ANIM_NONE: ComponentAnimation = { type: "none", duration: 0, delay: 0, easing: "ease" };
const ANIM_FADE: ComponentAnimation = { type: "fadeIn", duration: 600, delay: 0, easing: "ease" };
const ANIM_UP: ComponentAnimation = { type: "slideUp", duration: 500, delay: 0, easing: "ease" };

export function demoContentToBuilderComponents(
  content: DemoContent,
  demo: { style?: string | null; primary_color?: string | null; secondary_color?: string | null }
): BuilderComponent[] {
  const structure = content.structure ?? [];
  const colors = content.site?.colors ?? {};
  const headings = content.headings;

  const primaryColor = demo.primary_color || colors.primary || "#1a1a2e";
  const bgColor = colors.background || "#ffffff";
  const textColor = colors.text || "#24201d";

  const components: BuilderComponent[] = [];

  for (const section of structure) {
    const show = section.visible !== false;
    let comp: BuilderComponent | null = null;

    switch (section.type) {
      case "navigation":
        comp = {
          id: nanoid(),
          type: "navbar",
          label: "Nawigacja",
          props: {
            logoText: content.navigation?.logoText ?? "Firma",
            logoUrl: "/",
            links: content.navigation?.links ?? [],
            ctaText: content.navigation?.cta?.label ?? "Kontakt",
            ctaUrl: content.navigation?.cta?.href ?? "#kontakt",
            sticky: true,
          },
          styles: { background: "#ffffff", paddingTop: "1rem", paddingBottom: "1rem" },
          animations: ANIM_NONE,
          visibility: vis(show),
          children: [],
        };
        break;

      case "hero":
        comp = {
          id: nanoid(),
          type: "hero",
          label: "Hero",
          props: {
            eyebrow: content.hero?.eyebrow ?? "",
            title: content.hero?.title ?? "",
            subtitle: content.hero?.subtitle ?? "",
            ctaText: content.hero?.primaryCta?.label ?? "Dowiedz się więcej",
            ctaUrl: content.hero?.primaryCta?.href ?? "#",
            ctaSecondText: content.hero?.secondaryCta?.label ?? "",
            ctaSecondUrl: content.hero?.secondaryCta?.href ?? "",
            imageUrl: content.hero?.image?.url ?? "",
            imageAlt: content.hero?.image?.alt ?? "",
            backgroundImage: content.hero?.image?.url ?? "",
          },
          styles: {
            background: primaryColor,
            color: "#ffffff",
            paddingTop: "8rem",
            paddingBottom: "8rem",
            textAlign: "center",
            minHeight: "80vh",
          },
          animations: ANIM_FADE,
          visibility: vis(show),
          children: [],
        };
        break;

      case "about":
        comp = {
          id: nanoid(),
          type: "about",
          label: "O nas",
          props: {
            badge: content.about?.eyebrow ?? "O nas",
            title: content.about?.title ?? "",
            content: content.about?.content ?? "",
            imageUrl: content.about?.image?.url ?? "",
            imageAlt: content.about?.image?.alt ?? "",
            layout: "left",
          },
          styles: { background: bgColor, color: textColor, paddingTop: "5rem", paddingBottom: "5rem" },
          animations: ANIM_FADE,
          visibility: vis(show),
          children: [],
        };
        break;

      case "services":
        comp = {
          id: nanoid(),
          type: "services",
          label: "Usługi",
          props: {
            eyebrow: headings?.services?.eyebrow ?? "Oferta",
            title: headings?.services?.title ?? "Nasze usługi",
            subtitle: headings?.services?.subtitle ?? "",
            columns: 3,
            items: (content.services ?? []).map((s) => ({
              icon: "Star",
              title: s.title,
              description: s.description,
            })),
          },
          styles: { background: bgColor, color: textColor, paddingTop: "5rem", paddingBottom: "5rem", textAlign: "center" },
          animations: ANIM_UP,
          visibility: vis(show),
          children: [],
        };
        break;

      case "features":
        comp = {
          id: nanoid(),
          type: "features",
          label: "Cechy",
          props: {
            eyebrow: headings?.features?.eyebrow ?? "Dlaczego warto",
            title: headings?.features?.title ?? "Nasze cechy",
            subtitle: headings?.features?.subtitle ?? "",
            items: (content.features ?? []).map((f) => ({
              icon: "CheckCircle",
              title: f.title,
              description: f.description,
            })),
          },
          styles: { background: bgColor, color: textColor, paddingTop: "5rem", paddingBottom: "5rem" },
          animations: ANIM_UP,
          visibility: vis(show),
          children: [],
        };
        break;

      case "gallery":
        comp = {
          id: nanoid(),
          type: "gallery",
          label: "Galeria",
          props: {
            eyebrow: content.gallery?.eyebrow ?? "Galeria",
            title: content.gallery?.title ?? "Zobacz nasze prace",
            subtitle: content.gallery?.subtitle ?? "",
            columns: 3,
            items: (content.gallery?.items ?? []).map((img) => ({
              imageUrl: img.url,
              alt: img.alt,
              caption: img.description,
            })),
          },
          styles: { background: bgColor, color: textColor, paddingTop: "5rem", paddingBottom: "5rem" },
          animations: ANIM_FADE,
          visibility: vis(show),
          children: [],
        };
        break;

      case "process":
        comp = {
          id: nanoid(),
          type: "steps",
          label: "Proces",
          props: {
            eyebrow: headings?.process?.eyebrow ?? "Proces",
            title: headings?.process?.title ?? "Jak działamy",
            subtitle: headings?.process?.subtitle ?? "",
            items: (content.process ?? []).map((p, idx) => ({
              step: String(idx + 1).padStart(2, "0"),
              title: p.title,
              description: p.description,
            })),
          },
          styles: { background: bgColor, color: textColor, paddingTop: "5rem", paddingBottom: "5rem" },
          animations: ANIM_UP,
          visibility: vis(show),
          children: [],
        };
        break;

      case "testimonials":
        comp = {
          id: nanoid(),
          type: "testimonials",
          label: "Opinie",
          props: {
            eyebrow: headings?.testimonials?.eyebrow ?? "Opinie",
            title: headings?.testimonials?.title ?? "Co mówią klienci",
            subtitle: headings?.testimonials?.subtitle ?? "",
            items: (content.testimonials ?? []).map((t) => ({
              name: t.name,
              role: t.role,
              company: "",
              quote: t.content,
              avatar: t.image?.url ?? "",
            })),
          },
          styles: { background: "#f9f9f9", color: textColor, paddingTop: "5rem", paddingBottom: "5rem" },
          animations: ANIM_FADE,
          visibility: vis(show),
          children: [],
        };
        break;

      case "faq":
        comp = {
          id: nanoid(),
          type: "faq",
          label: "FAQ",
          props: {
            eyebrow: headings?.faq?.eyebrow ?? "FAQ",
            title: headings?.faq?.title ?? "Najczęściej zadawane pytania",
            subtitle: headings?.faq?.subtitle ?? "",
            items: (content.faq ?? []).map((f) => ({
              question: f.question,
              answer: f.answer,
            })),
          },
          styles: { background: bgColor, color: textColor, paddingTop: "5rem", paddingBottom: "5rem" },
          animations: ANIM_FADE,
          visibility: vis(show),
          children: [],
        };
        break;

      case "cta":
        comp = {
          id: nanoid(),
          type: "cta",
          label: "CTA",
          props: {
            eyebrow: content.cta?.eyebrow ?? "",
            title: content.cta?.title ?? "",
            subtitle: content.cta?.description ?? "",
            primaryText: content.cta?.primaryCta?.label ?? "Skontaktuj się",
            primaryUrl: content.cta?.primaryCta?.href ?? "#kontakt",
            secondaryText: content.cta?.secondaryCta?.label ?? "",
            secondaryUrl: content.cta?.secondaryCta?.href ?? "",
          },
          styles: {
            background: primaryColor,
            color: "#ffffff",
            paddingTop: "5rem",
            paddingBottom: "5rem",
            textAlign: "center",
          },
          animations: ANIM_FADE,
          visibility: vis(show),
          children: [],
        };
        break;

      case "contact":
        comp = {
          id: nanoid(),
          type: "contact",
          label: "Kontakt",
          props: {
            eyebrow: content.contact?.eyebrow ?? "Kontakt",
            title: content.contact?.title ?? "Napisz do nas",
            subtitle: content.contact?.description ?? "",
            email: content.contact?.email ?? "",
            phone: content.contact?.phone ?? "",
            address: content.contact?.address ?? "",
            showForm: true,
          },
          styles: { background: bgColor, color: textColor, paddingTop: "5rem", paddingBottom: "5rem" },
          animations: ANIM_FADE,
          visibility: vis(show),
          children: [],
        };
        break;

      case "footer":
        comp = {
          id: nanoid(),
          type: "footer",
          label: "Stopka",
          props: {
            logoText: content.navigation?.logoText ?? "Firma",
            description: content.footer?.description ?? "",
            columns: content.footer?.columns ?? [],
            copyright: content.footer?.copyright ?? `© ${new Date().getFullYear()}`,
          },
          styles: { background: "#111111", color: "#ffffff", paddingTop: "4rem", paddingBottom: "2rem" },
          animations: ANIM_NONE,
          visibility: vis(show),
          children: [],
        };
        break;
    }

    if (comp) components.push(comp);
  }

  return components;
}
