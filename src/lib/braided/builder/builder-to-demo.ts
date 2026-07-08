import type { BuilderComponent } from "@/features/builder/types";
import type { DemoContent, DemoSectionType } from "@/features/demos/types";

function str(v: unknown, fallback = ""): string {
  return v != null ? String(v) : fallback;
}

function arr<T>(v: unknown): T[] {
  return Array.isArray(v) ? (v as T[]) : [];
}

export function builderComponentsToDemoContent(
  components: BuilderComponent[],
  base: DemoContent
): DemoContent {
  const result: DemoContent = JSON.parse(JSON.stringify(base));
  const structure: { type: DemoSectionType; id: string; visible: boolean }[] = [];

  for (const comp of components) {
    const p = comp.props;
    const visible = comp.visibility?.desktop !== false;

    switch (comp.type) {
      case "navbar":
      case "navbar-minimal":
      case "navbar-centered":
        result.navigation = {
          logoText: str(p.logoText, base.navigation.logoText),
          links: arr<{ label: string; href: string }>(p.links).length > 0
            ? arr<{ label: string; href: string }>(p.links)
            : base.navigation.links,
          cta: {
            label: str(p.ctaText, base.navigation.cta.label),
            href: str(p.ctaUrl, base.navigation.cta.href),
          },
        };
        structure.push({ type: "navigation", id: "nawigacja", visible });
        break;

      case "hero":
      case "hero-video":
      case "hero-fullscreen":
        result.hero = {
          ...base.hero,
          eyebrow: str(p.eyebrow, base.hero.eyebrow),
          title: str(p.title, base.hero.title),
          subtitle: str(p.subtitle, base.hero.subtitle),
          cta: str(p.ctaText, base.hero.cta),
          primaryCta: {
            label: str(p.ctaText, base.hero.primaryCta.label),
            href: str(p.ctaUrl, base.hero.primaryCta.href),
          },
          secondaryCta: {
            label: str(p.ctaSecondText, base.hero.secondaryCta.label),
            href: str(p.ctaSecondUrl, base.hero.secondaryCta.href),
          },
          image: {
            ...base.hero.image,
            url: str(p.imageUrl ?? p.backgroundImage, base.hero.image.url),
            alt: str(p.imageAlt, base.hero.image.alt),
          },
        };
        structure.push({ type: "hero", id: "start", visible });
        break;

      case "about":
        result.about = {
          eyebrow: str(p.badge ?? p.eyebrow, base.about.eyebrow),
          title: str(p.title, base.about.title),
          content: str(p.content, base.about.content),
          image: {
            ...base.about.image,
            url: str(p.imageUrl, base.about.image.url),
            alt: str(p.imageAlt, base.about.image.alt),
          },
        };
        structure.push({ type: "about", id: "o-nas", visible });
        break;

      case "services": {
        const serviceItems = arr<{ title: string; description: string; icon?: string }>(p.items);
        result.services = serviceItems.length > 0
          ? serviceItems.map((item) => ({ title: item.title, description: item.description, icon: item.icon }))
          : base.services;
        result.headings = {
          ...result.headings,
          services: {
            eyebrow: str(p.eyebrow, base.headings.services.eyebrow),
            title: str(p.title, base.headings.services.title),
            subtitle: str(p.subtitle, base.headings.services.subtitle),
          },
        };
        structure.push({ type: "services", id: "uslugi", visible });
        break;
      }

      case "features": {
        const featureItems = arr<{ title: string; description: string }>(p.items);
        result.features = featureItems.length > 0
          ? featureItems.map((item) => ({ title: item.title, description: item.description }))
          : base.features;
        result.headings = {
          ...result.headings,
          features: {
            eyebrow: str(p.eyebrow, base.headings.features.eyebrow),
            title: str(p.title, base.headings.features.title),
            subtitle: str(p.subtitle, base.headings.features.subtitle),
          },
        };
        structure.push({ type: "features", id: "wyrozniki", visible });
        break;
      }

      case "gallery": {
        const galleryItems = arr<{ imageUrl?: string; alt?: string; caption?: string }>(p.items);
        result.gallery = {
          eyebrow: str(p.eyebrow, base.gallery.eyebrow),
          title: str(p.title, base.gallery.title),
          subtitle: str(p.subtitle, base.gallery.subtitle),
          items: galleryItems.length > 0
            ? galleryItems.map((item) => ({
                url: item.imageUrl ?? "",
                alt: item.alt ?? "",
                description: item.caption ?? "",
                provider: "placeholder" as const,
              }))
            : base.gallery.items,
        };
        structure.push({ type: "gallery", id: "galeria", visible });
        break;
      }

      case "steps":
      case "process": {
        const processItems = arr<{ title: string; description: string }>(p.items);
        result.process = processItems.length > 0
          ? processItems.map((item) => ({ title: item.title, description: item.description }))
          : base.process;
        result.headings = {
          ...result.headings,
          process: {
            eyebrow: str(p.eyebrow, base.headings.process.eyebrow),
            title: str(p.title, base.headings.process.title),
            subtitle: str(p.subtitle, base.headings.process.subtitle),
          },
        };
        structure.push({ type: "process", id: "proces", visible });
        break;
      }

      case "testimonials":
      case "reviews-grid": {
        const testimonialItems = arr<{ name: string; role: string; quote?: string; content?: string; avatar?: string }>(p.items);
        result.testimonials = testimonialItems.length > 0
          ? testimonialItems.map((item) => ({
              name: item.name,
              role: item.role,
              content: item.quote ?? item.content ?? "",
              image: item.avatar ? { url: item.avatar, alt: item.name, description: "", provider: "placeholder" as const } : undefined,
            }))
          : base.testimonials;
        result.headings = {
          ...result.headings,
          testimonials: {
            eyebrow: str(p.eyebrow, base.headings.testimonials.eyebrow),
            title: str(p.title, base.headings.testimonials.title),
            subtitle: str(p.subtitle, base.headings.testimonials.subtitle),
          },
        };
        structure.push({ type: "testimonials", id: "opinie", visible });
        break;
      }

      case "faq":
      case "accordion": {
        const faqItems = arr<{ question: string; answer: string }>(p.items);
        result.faq = faqItems.length > 0 ? faqItems : base.faq;
        result.headings = {
          ...result.headings,
          faq: {
            eyebrow: str(p.eyebrow, base.headings.faq.eyebrow),
            title: str(p.title, base.headings.faq.title),
            subtitle: str(p.subtitle, base.headings.faq.subtitle),
          },
        };
        structure.push({ type: "faq", id: "faq", visible });
        break;
      }

      case "cta":
        result.cta = {
          eyebrow: str(p.eyebrow, base.cta.eyebrow),
          title: str(p.title, base.cta.title),
          description: str(p.subtitle, base.cta.description),
          primaryCta: {
            label: str(p.primaryText, base.cta.primaryCta.label),
            href: str(p.primaryUrl, base.cta.primaryCta.href),
          },
          secondaryCta: {
            label: str(p.secondaryText, base.cta.secondaryCta.label),
            href: str(p.secondaryUrl, base.cta.secondaryCta.href),
          },
        };
        structure.push({ type: "cta", id: "cta", visible });
        break;

      case "contact":
        result.contact = {
          ...base.contact,
          eyebrow: str(p.eyebrow, base.contact.eyebrow),
          title: str(p.title, base.contact.title),
          description: str(p.subtitle, base.contact.description),
          cta: str(p.ctaText, base.contact.cta),
          email: p.email ? str(p.email) : null,
          phone: p.phone ? str(p.phone) : null,
          address: p.address ? str(p.address) : null,
        };
        structure.push({ type: "contact", id: "kontakt", visible });
        break;

      case "footer":
      case "footer-minimal":
      case "footer-extended": {
        const footerCols = arr<{ title: string; links: { label: string; href: string }[] }>(p.columns);
        result.footer = {
          description: str(p.description, base.footer.description),
          columns: footerCols.length > 0 ? footerCols : base.footer.columns,
          copyright: str(p.copyright, base.footer.copyright),
        };
        if (p.logoText) {
          result.navigation = { ...result.navigation, logoText: str(p.logoText) };
        }
        structure.push({ type: "footer", id: "stopka", visible });
        break;
      }
    }
  }

  if (structure.length > 0) result.structure = structure;
  return result;
}
