"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  GripVertical, Copy, Trash2, ChevronUp, ChevronDown,
  Layout, Type, Image as ImageIconLucide, Grid, MessageSquare, HelpCircle,
  DollarSign, Megaphone, BarChart2, Users, Clock, List,
  Phone, Anchor, Video, MapPin, Mail,
  ShoppingBag, FileText, Newspaper, Play,
  Minus, AlignLeft, Building2, Briefcase, LayoutTemplate,
  Quote, ImageIcon, Menu, Award, Table2, Timer, Clipboard,
  Star, Columns, Calendar,
} from "lucide-react";
import type { BuilderComponent } from "@/features/builder/types";
import { useBuilderStore } from "@/features/builder/store/builder-store";

const TYPE_ICONS: Record<string, React.ElementType> = {
  hero: ImageIconLucide,
  navbar: Layout,
  about: Type,
  services: Grid,
  features: List,
  gallery: ImageIconLucide,
  testimonials: MessageSquare,
  faq: HelpCircle,
  pricing: DollarSign,
  cta: Megaphone,
  statistics: BarChart2,
  team: Users,
  timeline: Clock,
  steps: List,
  contact: Phone,
  footer: Anchor,
  video: Play,
  map: MapPin,
  newsletter: Mail,
  instagram: ImageIconLucide,
  tiktok: Video,
  "woo-products": ShoppingBag,
  blog: Newspaper,
  linkinbio: Users,
  separator: Minus,
  text: AlignLeft,
  logos: Building2,
  portfolio: Briefcase,
  banner: Megaphone,
  columns: LayoutTemplate,
  quote: Quote,
  image: ImageIcon,
  "navbar-minimal": Menu,
  "navbar-centered": Layout,
  "footer-minimal": Anchor,
  "footer-extended": Mail,
  "hero-split": ImageIconLucide,
  process: List,
  awards: Award,
  comparison: Table2,
  countdown: Timer,
  careers: Clipboard,
  "menu-section": FileText,
  "reservation": Phone,
  "accordion": List,
  "tabs": Layout,
  "slider": ImageIconLucide,
  "hero-video": Play,
  "hero-fullscreen": ImageIconLucide,
  "reviews-grid": Star,
  "media-row": Columns,
  "icon-grid": Grid,
  "pricing-toggle": DollarSign,
  "sticky-cta": Megaphone,
  "before-after": ImageIconLucide,
  "links-list": FileText,
  "event": Calendar,
};

const CATEGORY_COLORS: Record<string, string> = {
  layout: "#7b8fc9",
  content: "#4caf7a",
  media: "#c97bba",
  social: "#c9a47b",
  commerce: "#7bc9c0",
};

const COMPONENT_CATEGORIES: Record<string, string> = {
  hero: "content", navbar: "layout", about: "content",
  services: "content", features: "content", gallery: "media",
  testimonials: "content", faq: "content", pricing: "content",
  cta: "content", statistics: "content", team: "content",
  timeline: "content", steps: "content", contact: "content",
  footer: "layout", video: "media", map: "media",
  newsletter: "social", instagram: "social", tiktok: "social",
  "woo-products": "commerce", blog: "commerce",
  linkinbio: "social",
  separator: "layout", text: "content", logos: "content",
  portfolio: "content", banner: "content", columns: "layout",
  quote: "content", image: "media",
  "navbar-minimal": "layout", "navbar-centered": "layout",
  "footer-minimal": "layout", "footer-extended": "layout",
  "hero-split": "content", process: "content", awards: "content",
  comparison: "content", countdown: "content", careers: "content",
  "menu-section": "content", "reservation": "content", "accordion": "content",
  "tabs": "content", "slider": "media", "hero-video": "content",
  "hero-fullscreen": "content", "reviews-grid": "content", "media-row": "content",
  "icon-grid": "content", "pricing-toggle": "content", "sticky-cta": "layout",
  "before-after": "media", "links-list": "content", "event": "content",
};

function BlockPreview({ component }: { component: BuilderComponent }) {
  const p = component.props;
  const title = (p.title || p.logoText || p.copyright || "") as string;
  const subtitle = (p.subtitle || p.content || p.description || "") as string;

  switch (component.type) {
    case "hero": {
      const heroImage = (p.backgroundImage || p.imageUrl) as string | undefined;
      return (
        <div className="bldr-preview bldr-preview--hero">
          <div
            className="bldr-preview-hero-bg"
            style={{
              backgroundColor: component.styles.background || "#1a1a2e",
              backgroundImage: heroImage
                ? `linear-gradient(rgba(8,8,12,.48), rgba(8,8,12,.65)), url("${heroImage}")`
                : undefined,
              backgroundPosition: "center",
              backgroundSize: "cover",
            }}
          />
          <div className="bldr-preview-hero-content">
            <div className="bldr-preview-tag">Hero</div>
            <div className="bldr-preview-h1">{title || "Tytuł hero"}</div>
            <div className="bldr-preview-sub">{subtitle || "Podtytuł..."}</div>
            <div className="bldr-preview-buttons">
              <div className="bldr-preview-btn bldr-preview-btn--primary">{(p.ctaText as string) || "CTA"}</div>
              {Boolean(p.ctaSecondText) && <div className="bldr-preview-btn bldr-preview-btn--ghost">{p.ctaSecondText as string}</div>}
            </div>
          </div>
        </div>
      );
    }

    case "navbar":
      return (
        <div className="bldr-preview bldr-preview--navbar">
          <div className="bldr-preview-nav-logo">{(p.logoText as string) || "Logo"}</div>
          <div className="bldr-preview-nav-links">
            {((p.links || []) as Array<{ label: string }>).slice(0, 4).map((l, i) => (
              <span key={i} className="bldr-preview-nav-link">{l.label}</span>
            ))}
          </div>
          {Boolean(p.ctaText) && <div className="bldr-preview-btn bldr-preview-btn--sm">{p.ctaText as string}</div>}
        </div>
      );

    case "about":
      return (
        <div className="bldr-preview bldr-preview--two-col">
          <div className="bldr-preview-text-block">
            {Boolean(p.badge) && <div className="bldr-preview-tag">{p.badge as string}</div>}
            <div className="bldr-preview-h2">{title || "O nas"}</div>
            <div className="bldr-preview-body">{(subtitle || "").slice(0, 120)}</div>
          </div>
          <div
            className="bldr-preview-image-placeholder"
            style={{
              backgroundImage: p.imageUrl ? `url("${p.imageUrl as string}")` : undefined,
              backgroundPosition: "center",
              backgroundSize: "cover",
            }}
          >
            {!p.imageUrl && <ImageIconLucide size={20} style={{ opacity: .3 }} />}
          </div>
        </div>
      );

    case "services":
    case "features":
      return (
        <div className="bldr-preview bldr-preview--grid-section">
          <div className="bldr-preview-section-header">
            <div className="bldr-preview-h2">{title || component.label}</div>
            {subtitle && <div className="bldr-preview-sub">{subtitle.slice(0, 60)}</div>}
          </div>
          <div className="bldr-preview-cards">
            {((p.items || []) as Array<{ title: string }>).slice(0, 3).map((item, i) => (
              <div key={i} className="bldr-preview-card">
                <div className="bldr-preview-card-icon" />
                <div className="bldr-preview-card-title">{item.title}</div>
              </div>
            ))}
          </div>
        </div>
      );

    case "gallery": {
      const galleryItems = (p.items as Array<{ imageUrl?: string }> | undefined) ?? [];
      const visibleGalleryItems: Array<{ imageUrl?: string }> = galleryItems.length
        ? galleryItems
        : Array.from({ length: 6 }, () => ({}));
      return (
        <div className="bldr-preview bldr-preview--gallery">
          <div className="bldr-preview-h2">{title || "Galeria"}</div>
          <div className="bldr-preview-gallery-grid">
            {visibleGalleryItems.slice(0, 6).map((item, i) => (
              <div
                key={i}
                className="bldr-preview-gallery-item"
                style={{
                  backgroundImage: item.imageUrl ? `url("${item.imageUrl}")` : undefined,
                  backgroundPosition: "center",
                  backgroundSize: "cover",
                }}
              />
            ))}
          </div>
        </div>
      );
    }

    case "testimonials":
      return (
        <div className="bldr-preview bldr-preview--testimonials">
          <div className="bldr-preview-h2">{title || "Opinie"}</div>
          <div className="bldr-preview-testimonial-cards">
            {((p.items || []) as Array<{ name: string; quote: string }>).slice(0, 3).map((item, i) => (
              <div key={i} className="bldr-preview-testimonial-card">
                <div className="bldr-preview-quote">&ldquo;{(item.quote || "").slice(0, 60)}&rdquo;</div>
                <div className="bldr-preview-author">{item.name}</div>
              </div>
            ))}
          </div>
        </div>
      );

    case "faq":
      return (
        <div className="bldr-preview bldr-preview--faq">
          <div className="bldr-preview-h2">{title || "FAQ"}</div>
          {((p.items || []) as Array<{ question: string }>).slice(0, 4).map((item, i) => (
            <div key={i} className="bldr-preview-faq-row">
              <span>{item.question || `Pytanie ${i + 1}`}</span>
              <ChevronDown size={12} />
            </div>
          ))}
        </div>
      );

    case "pricing":
      return (
        <div className="bldr-preview bldr-preview--pricing">
          <div className="bldr-preview-h2">{title || "Cennik"}</div>
          <div className="bldr-preview-pricing-cards">
            {((p.items || []) as Array<{ name: string; price: string; highlighted?: boolean }>).map((item, i) => (
              <div key={i} className={`bldr-preview-pricing-card${item.highlighted ? " bldr-preview-pricing-card--hl" : ""}`}>
                <div className="bldr-preview-pricing-name">{item.name}</div>
                <div className="bldr-preview-pricing-price">{item.price}</div>
              </div>
            ))}
          </div>
        </div>
      );

    case "cta":
      return (
        <div className="bldr-preview bldr-preview--cta" style={{ background: component.styles.background || "#d4a83a" }}>
          <div className="bldr-preview-h2" style={{ color: component.styles.color || "#000" }}>{title || "CTA"}</div>
          {subtitle && <div className="bldr-preview-sub" style={{ color: component.styles.color || "#000" }}>{subtitle.slice(0, 80)}</div>}
          <div className="bldr-preview-btn bldr-preview-btn--dark">{(p.primaryText as string) || "Akcja"}</div>
        </div>
      );

    case "statistics":
      return (
        <div className="bldr-preview bldr-preview--statistics">
          {title && <div className="bldr-preview-h2">{title}</div>}
          <div className="bldr-preview-stats-row">
            {((p.items || []) as Array<{ number?: string; value?: string; label: string }>).map((s, i) => (
              <div key={i} className="bldr-preview-stat">
                <div className="bldr-preview-stat-num">{s.number || s.value}</div>
                <div className="bldr-preview-stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      );

    case "team":
      return (
        <div className="bldr-preview bldr-preview--team">
          <div className="bldr-preview-h2">{title || "Zespół"}</div>
          <div className="bldr-preview-team-row">
            {((p.items || []) as Array<{ name: string; role: string }>).slice(0, 4).map((m, i) => (
              <div key={i} className="bldr-preview-team-card">
                <div className="bldr-preview-avatar" />
                <div className="bldr-preview-team-name">{m.name}</div>
                <div className="bldr-preview-team-role">{m.role}</div>
              </div>
            ))}
          </div>
        </div>
      );

    case "timeline":
      return (
        <div className="bldr-preview bldr-preview--timeline">
          <div className="bldr-preview-h2">{title || "Historia"}</div>
          {((p.items || []) as Array<{ year: string; title: string }>).slice(0, 4).map((item, i) => (
            <div key={i} className="bldr-preview-timeline-row">
              <div className="bldr-preview-timeline-year">{item.year}</div>
              <div className="bldr-preview-timeline-dot" />
              <div className="bldr-preview-timeline-title">{item.title}</div>
            </div>
          ))}
        </div>
      );

    case "steps":
      return (
        <div className="bldr-preview bldr-preview--steps">
          <div className="bldr-preview-h2">{title || "Kroki"}</div>
          <div className="bldr-preview-steps-row">
            {((p.items || []) as Array<{ step: string; title: string }>).slice(0, 4).map((item, i) => (
              <div key={i} className="bldr-preview-step">
                <div className="bldr-preview-step-num">{item.step}</div>
                <div className="bldr-preview-step-title">{item.title}</div>
              </div>
            ))}
          </div>
        </div>
      );

    case "contact":
      return (
        <div className="bldr-preview bldr-preview--contact">
          <div className="bldr-preview-h2">{title || "Kontakt"}</div>
          <div className="bldr-preview-contact-row">
            <div className="bldr-preview-contact-info">
              {Boolean(p.email) && <div className="bldr-preview-contact-line">✉ {p.email as string}</div>}
              {Boolean(p.phone) && <div className="bldr-preview-contact-line">✆ {p.phone as string}</div>}
              {Boolean(p.address) && <div className="bldr-preview-contact-line">⊙ {p.address as string}</div>}
            </div>
            {Boolean(p.showForm) && (
              <div className="bldr-preview-form-skeleton">
                <div className="bldr-preview-input" />
                <div className="bldr-preview-input" />
                <div className="bldr-preview-textarea" />
                <div className="bldr-preview-btn bldr-preview-btn--primary" style={{ width: "100%" }}>Wyślij</div>
              </div>
            )}
          </div>
        </div>
      );

    case "footer":
      return (
        <div className="bldr-preview bldr-preview--footer" style={{ background: component.styles.background || "#111" }}>
          <div className="bldr-preview-footer-logo">{(p.logoText as string) || "Logo"}</div>
          <div className="bldr-preview-footer-cols">
            {((p.columns || []) as Array<{ title: string }>).map((col, i) => (
              <div key={i} className="bldr-preview-footer-col">
                <div className="bldr-preview-footer-col-title">{col.title}</div>
                <div className="bldr-preview-footer-link-ph" />
                <div className="bldr-preview-footer-link-ph" />
              </div>
            ))}
          </div>
          <div className="bldr-preview-footer-copy">{(p.copyright as string) || "© 2025"}</div>
        </div>
      );

    case "video":
      return (
        <div className="bldr-preview bldr-preview--video">
          {title && <div className="bldr-preview-h2">{title}</div>}
          <div className="bldr-preview-video-box">
            <Play size={28} style={{ opacity: .4 }} />
            <div className="bldr-preview-sub">{(p.videoUrl as string) || "URL wideo nie ustawiony"}</div>
          </div>
        </div>
      );

    case "map":
      return (
        <div className="bldr-preview bldr-preview--map">
          {title && <div className="bldr-preview-h2">{title}</div>}
          <div className="bldr-preview-map-box">
            <MapPin size={24} style={{ opacity: .4 }} />
            <div className="bldr-preview-sub">{(p.address as string) || "Adres nie ustawiony"}</div>
          </div>
        </div>
      );

    case "newsletter":
      return (
        <div className="bldr-preview bldr-preview--newsletter" style={{ background: component.styles.background || "#f5f5f5" }}>
          <div className="bldr-preview-h2">{title || "Newsletter"}</div>
          {subtitle && <div className="bldr-preview-sub">{subtitle.slice(0, 80)}</div>}
          <div className="bldr-preview-newsletter-row">
            <div className="bldr-preview-input" style={{ flexGrow: 1 }}>{(p.placeholder as string) || "Email"}</div>
            <div className="bldr-preview-btn bldr-preview-btn--primary">{(p.buttonText as string) || "Zapisz się"}</div>
          </div>
        </div>
      );

    case "instagram":
    case "tiktok":
      return (
        <div className="bldr-preview bldr-preview--social-feed">
          <div className="bldr-preview-h2">{title || (component.type === "instagram" ? "Instagram" : "TikTok")}</div>
          <div className="bldr-preview-social-handle">{(p.handle as string) || "@handle"}</div>
          <div className="bldr-preview-gallery-grid">
            {Array.from({ length: 6 }).map((_, i) => <div key={i} className="bldr-preview-gallery-item" />)}
          </div>
        </div>
      );

    case "woo-products": {
      const products = (p.items as Array<{ name?: string; price?: string; imageUrl?: string }> | undefined) ?? [];
      const visibleProducts: Array<{ name?: string; price?: string; imageUrl?: string }> = products.length
        ? products
        : Array.from({ length: 3 }, (_, i) => ({
            name: `Produkt ${i + 1}`,
            price: "99,00 zł",
          }));
      return (
        <div className="bldr-preview bldr-preview--woo">
          <div className="bldr-preview-h2">{title || "Produkty"}</div>
          <div className="bldr-preview-cards">
            {visibleProducts.slice(0, 4).map((product, i) => (
              <div key={i} className="bldr-preview-card">
                <div
                  className="bldr-preview-card-image"
                  style={{
                    backgroundImage: product.imageUrl ? `url("${product.imageUrl}")` : undefined,
                    backgroundPosition: "center",
                    backgroundSize: "cover",
                  }}
                />
                <div className="bldr-preview-card-title">{product.name}</div>
                <div className="bldr-preview-card-price">{product.price}</div>
              </div>
            ))}
          </div>
          <div className="bldr-preview-placeholder-badge">Placeholder — wymaga WooCommerce</div>
        </div>
      );
    }

    case "blog":
      return (
        <div className="bldr-preview bldr-preview--blog">
          <div className="bldr-preview-h2">{title || "Blog"}</div>
          <div className="bldr-preview-cards">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bldr-preview-card">
                <div className="bldr-preview-card-image" />
                <div className="bldr-preview-card-title">Wpis blogowy {i + 1}</div>
                <div className="bldr-preview-card-desc" />
              </div>
            ))}
          </div>
          <div className="bldr-preview-placeholder-badge">Placeholder — wymaga WordPress</div>
        </div>
      );

    case "linkinbio": {
      const links = (p.links as Array<{ label: string; url: string }> | undefined) ?? [];
      return (
        <div className="bldr-preview bldr-preview--linkinbio">
          <div
            className="bldr-preview-lib-avatar"
            style={{
              backgroundImage: p.avatarUrl ? `url("${p.avatarUrl as string}")` : undefined,
              backgroundPosition: "center",
              backgroundSize: "cover",
            }}
          />
          <div className="bldr-preview-lib-name">{(p.name as string) || "Imię / Marka"}</div>
          <div className="bldr-preview-lib-bio">{(p.bio as string) || "Krótki opis..."}</div>
          <div className="bldr-preview-lib-links">
            {(links.length ? links : [{ label: "Link 1" }, { label: "Link 2" }, { label: "Link 3" }]).slice(0, 4).map((l, i) => (
              <div key={i} className="bldr-preview-lib-link">{l.label}</div>
            ))}
          </div>
        </div>
      );
    }

    case "separator": {
      const sepHeight = (p.height as number) || 60;
      const sepStyle = (p.style as string) || "none";
      const sepColor = (p.color as string) || "#e5e7eb";
      const sepLabel = (p.label as string) || "";
      return (
        <div className="bldr-preview bldr-preview--separator" style={{ minHeight: `${Math.min(sepHeight, 80)}px` }}>
          {sepStyle !== "none" ? (
            <div className="bldr-preview-sep-line" style={{ borderTopStyle: sepStyle as "solid" | "dashed" | "dotted", borderTopColor: sepColor }}>
              {sepLabel && <span className="bldr-preview-sep-label">{sepLabel}</span>}
            </div>
          ) : (
            <div className="bldr-preview-sub" style={{ fontSize: "11px", opacity: .5 }}>Odstęp: {sepHeight}px</div>
          )}
        </div>
      );
    }

    case "text":
      return (
        <div className="bldr-preview bldr-preview--text">
          {Boolean(p.eyebrow) && <div className="bldr-preview-tag">{p.eyebrow as string}</div>}
          <div className="bldr-preview-h2">{(p.heading as string) || "Nagłówek"}</div>
          <div className="bldr-preview-body">{((p.content as string) || "").slice(0, 100)}</div>
        </div>
      );

    case "logos":
      return (
        <div className="bldr-preview bldr-preview--logos">
          {title && <div className="bldr-preview-h2">{title}</div>}
          <div className="bldr-preview-logos-row">
            {((p.items || []) as Array<string | { name: string }>).slice(0, 6).map((item, i) => (
              <div key={i} className="bldr-preview-logo-box">
                {typeof item === "string" ? item : item.name}
              </div>
            ))}
          </div>
        </div>
      );

    case "portfolio":
      return (
        <div className="bldr-preview bldr-preview--portfolio">
          <div className="bldr-preview-h2">{title || "Portfolio"}</div>
          <div className="bldr-preview-cards">
            {((p.items || []) as Array<{ title: string; category: string }>).slice(0, 3).map((item, i) => (
              <div key={i} className="bldr-preview-card">
                <div className="bldr-preview-card-image" />
                <div className="bldr-preview-card-category">{item.category}</div>
                <div className="bldr-preview-card-title">{item.title}</div>
              </div>
            ))}
          </div>
        </div>
      );

    case "banner":
      return (
        <div className="bldr-preview bldr-preview--banner" style={{ background: component.styles.background || "#d4a83a" }}>
          <div className="bldr-preview-banner-text" style={{ color: component.styles.color || "#000" }}>{(p.text as string) || "Tekst bannera"}</div>
          {Boolean(p.subtext) && <div className="bldr-preview-banner-sub" style={{ color: component.styles.color || "#000", opacity: .75 }}>{p.subtext as string}</div>}
          {Boolean(p.ctaText) && <div className="bldr-preview-btn bldr-preview-btn--dark" style={{ marginTop: "6px" }}>{p.ctaText as string}</div>}
        </div>
      );

    case "columns": {
      const colItems = (p.columns as Array<{ icon: string; heading: string; content: string }> | undefined) ?? [];
      return (
        <div className="bldr-preview bldr-preview--columns">
          <div className="bldr-preview-two-col-grid">
            {(colItems.length ? colItems : [{ heading: "Kolumna 1", content: "" }, { heading: "Kolumna 2", content: "" }]).slice(0, 2).map((col, i) => (
              <div key={i} className="bldr-preview-text-block">
                <div className="bldr-preview-card-icon" />
                <div className="bldr-preview-h3">{col.heading || `Kolumna ${i + 1}`}</div>
                <div className="bldr-preview-body">{(col.content || "").slice(0, 60)}</div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    case "quote":
      return (
        <div className="bldr-preview bldr-preview--quote" style={{ background: component.styles.background || "#f9f9f9" }}>
          <div className="bldr-preview-quote-mark">&ldquo;</div>
          <div className="bldr-preview-quote-text">{((p.quote as string) || "Treść cytatu...").slice(0, 120)}</div>
          <div className="bldr-preview-author">— {(p.author as string) || "Autor"}{Boolean(p.company) ? `, ${p.company as string}` : ""}</div>
        </div>
      );

    case "image":
      return (
        <div className="bldr-preview bldr-preview--image">
          {Boolean(p.imageUrl) ? (
            <div className="bldr-preview-image-real" style={{ backgroundImage: `url(${p.imageUrl as string})` }} />
          ) : (
            <div className="bldr-preview-image-placeholder">
              <ImageIcon size={24} style={{ opacity: .3 }} />
              <div className="bldr-preview-sub" style={{ fontSize: "11px" }}>Zdjęcie nie ustawione</div>
            </div>
          )}
          {Boolean(p.caption) && <div className="bldr-preview-caption">{p.caption as string}</div>}
        </div>
      );

    case "navbar-minimal":
      return (
        <div className="bldr-preview bldr-preview--navbar">
          <div className="bldr-preview-nav-logo">{(p.logoText as string) || "Logo"}</div>
          <div style={{ flex: 1 }} />
          {Boolean(p.ctaText) && <div className="bldr-preview-btn bldr-preview-btn--sm">{p.ctaText as string}</div>}
          <div className="bldr-preview-hamburger"><span /><span /><span /></div>
        </div>
      );

    case "navbar-centered":
      return (
        <div className="bldr-preview bldr-preview--navbar-centered">
          <div className="bldr-preview-nav-logo" style={{ textAlign: "center", width: "100%" }}>{(p.logoText as string) || "Logo"}</div>
          <div className="bldr-preview-nav-links" style={{ justifyContent: "center", width: "100%" }}>
            {((p.links || []) as Array<{ label: string }>).slice(0, 5).map((l, i) => (
              <span key={i} className="bldr-preview-nav-link">{l.label}</span>
            ))}
          </div>
        </div>
      );

    case "footer-minimal":
      return (
        <div className="bldr-preview bldr-preview--footer-minimal" style={{ background: component.styles.background || "#111" }}>
          <div className="bldr-preview-footer-logo">{(p.logoText as string) || "Logo"}</div>
          <div className="bldr-preview-footer-minimal-links">
            {((p.links || []) as Array<{ label: string }>).map((l, i) => (
              <span key={i} className="bldr-preview-nav-link">{l.label}</span>
            ))}
          </div>
          <div className="bldr-preview-footer-copy">{(p.copyright as string) || "© 2025"}</div>
        </div>
      );

    case "footer-extended":
      return (
        <div className="bldr-preview bldr-preview--footer" style={{ background: component.styles.background || "#0f0f1a" }}>
          <div className="bldr-preview-footer-logo">{(p.logoText as string) || "Logo"}</div>
          <div className="bldr-preview-footer-cols">
            {((p.columns || []) as Array<{ title: string }>).map((col, i) => (
              <div key={i} className="bldr-preview-footer-col">
                <div className="bldr-preview-footer-col-title">{col.title}</div>
                <div className="bldr-preview-footer-link-ph" />
                <div className="bldr-preview-footer-link-ph" />
              </div>
            ))}
            <div className="bldr-preview-footer-col">
              <div className="bldr-preview-footer-col-title">{(p.newsletterTitle as string) || "Newsletter"}</div>
              <div className="bldr-preview-newsletter-row" style={{ marginTop: ".25rem" }}>
                <div className="bldr-preview-input" style={{ flexGrow: 1, fontSize: ".55rem" }}>Email</div>
                <div className="bldr-preview-btn bldr-preview-btn--sm">{(p.newsletterButton as string) || "OK"}</div>
              </div>
            </div>
          </div>
          <div className="bldr-preview-footer-copy">{(p.copyright as string) || "© 2025"}</div>
        </div>
      );

    case "hero-split":
      return (
        <div className="bldr-preview bldr-preview--two-col">
          <div className="bldr-preview-text-block">
            {Boolean(p.eyebrow) && <div className="bldr-preview-tag">{p.eyebrow as string}</div>}
            <div className="bldr-preview-h1">{(p.title as string) || "Tytuł hero"}</div>
            <div className="bldr-preview-sub">{((p.subtitle as string) || "").slice(0, 80)}</div>
            <div className="bldr-preview-buttons">
              <div className="bldr-preview-btn bldr-preview-btn--primary">{(p.ctaText as string) || "CTA"}</div>
              {Boolean(p.ctaSecondText) && <div className="bldr-preview-btn bldr-preview-btn--ghost">{p.ctaSecondText as string}</div>}
            </div>
          </div>
          <div className="bldr-preview-image-placeholder" style={{ background: component.styles.background || "#1a1a2e" }}>
            <ImageIconLucide size={20} style={{ opacity: .3 }} />
          </div>
        </div>
      );

    case "process": {
      const items = (p.items as Array<{ number: string; title: string }> | undefined) ?? [];
      return (
        <div className="bldr-preview bldr-preview--process">
          {Boolean(p.eyebrow) && <div className="bldr-preview-tag">{p.eyebrow as string}</div>}
          <div className="bldr-preview-h2">{(p.title as string) || "Jak to działa"}</div>
          <div className="bldr-preview-process-row">
            {(items.length ? items : Array.from({ length: 4 }, (_, i) => ({ number: `0${i + 1}`, title: `Krok ${i + 1}` }))).slice(0, 4).map((item, i) => (
              <div key={i} className="bldr-preview-process-step">
                <div className="bldr-preview-process-num">{item.number}</div>
                <div className="bldr-preview-card-title">{item.title}</div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    case "awards": {
      const items = (p.items as Array<{ name: string; year?: string }> | undefined) ?? [];
      return (
        <div className="bldr-preview bldr-preview--awards">
          <div className="bldr-preview-h2">{(p.title as string) || "Certyfikaty"}</div>
          <div className="bldr-preview-logos-row">
            {(items.length ? items : Array.from({ length: 4 }, (_, i) => ({ name: `Nagroda ${i + 1}` }))).slice(0, 4).map((item, i) => (
              <div key={i} className="bldr-preview-award-box">
                <Award size={16} style={{ opacity: .4 }} />
                <div className="bldr-preview-card-title" style={{ fontSize: ".6rem" }}>{item.name}</div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    case "comparison": {
      const rows = (p.rows as Array<{ feature: string; values: string[] }> | undefined) ?? [];
      const cols = (p.columns as string[] | undefined) ?? ["Opcja A", "Opcja B"];
      return (
        <div className="bldr-preview bldr-preview--comparison">
          <div className="bldr-preview-h2">{(p.title as string) || "Porównanie"}</div>
          <div className="bldr-preview-comparison-table">
            <div className="bldr-preview-comparison-row bldr-preview-comparison-header">
              <div className="bldr-preview-comparison-cell" />
              {cols.map((c, i) => <div key={i} className="bldr-preview-comparison-cell">{c}</div>)}
            </div>
            {(rows.length ? rows : Array.from({ length: 3 }, (_, i) => ({ feature: `Cecha ${i + 1}`, values: ["—", "✓"] }))).slice(0, 4).map((row, i) => (
              <div key={i} className="bldr-preview-comparison-row">
                <div className="bldr-preview-comparison-cell bldr-preview-comparison-feature">{row.feature}</div>
                {row.values.map((v, j) => <div key={j} className="bldr-preview-comparison-cell">{v}</div>)}
              </div>
            ))}
          </div>
        </div>
      );
    }

    case "countdown":
      return (
        <div className="bldr-preview bldr-preview--countdown" style={{ background: component.styles.background || "#1a1a2e" }}>
          <div className="bldr-preview-h2" style={{ color: component.styles.color || "#fff" }}>{(p.title as string) || "Oferta kończy się za:"}</div>
          <div className="bldr-preview-countdown-row">
            {[["00", "Dni"], ["00", "Godz"], ["00", "Min"], ["00", "Sek"]].map(([n, l], i) => (
              <div key={i} className="bldr-preview-countdown-unit">
                <div className="bldr-preview-countdown-num">{n}</div>
                <div className="bldr-preview-countdown-label">{l}</div>
              </div>
            ))}
          </div>
          {Boolean(p.ctaText) && <div className="bldr-preview-btn bldr-preview-btn--primary" style={{ marginTop: ".5rem" }}>{p.ctaText as string}</div>}
        </div>
      );

    case "careers": {
      const items = (p.items as Array<{ title: string; type?: string; location?: string }> | undefined) ?? [];
      return (
        <div className="bldr-preview bldr-preview--careers">
          <div className="bldr-preview-h2">{(p.title as string) || "Kariera"}</div>
          {(items.length ? items : Array.from({ length: 2 }, (_, i) => ({ title: `Stanowisko ${i + 1}`, type: "Pełny etat", location: "Warszawa" }))).slice(0, 3).map((item, i) => (
            <div key={i} className="bldr-preview-career-row">
              <div className="bldr-preview-card-title">{item.title}</div>
              <div className="bldr-preview-career-meta">{[item.type, item.location].filter(Boolean).join(" · ")}</div>
            </div>
          ))}
        </div>
      );
    }

    case "hero-video":
    case "hero-fullscreen":
      return (
        <div className="bldr-preview bldr-preview--hero">
          <div className="bldr-preview-hero-bg" style={{ background: component.styles.background || "#0f0f1a" }} />
          <div className="bldr-preview-hero-content">
            <div className="bldr-preview-tag">{component.type === "hero-video" ? "Hero + Video" : "Hero Fullscreen"}</div>
            <div className="bldr-preview-h1">{title || "Tytuł hero"}</div>
            <div className="bldr-preview-sub">{subtitle}</div>
            <div className="bldr-preview-buttons">
              <div className="bldr-preview-btn bldr-preview-btn--primary">{(p.ctaText as string) || "CTA"}</div>
            </div>
          </div>
        </div>
      );

    case "menu-section":
      return (
        <div className="bldr-preview bldr-preview--grid-section">
          <div className="bldr-preview-section-header">
            <div className="bldr-preview-h2">{title || "Menu"}</div>
          </div>
          <div className="bldr-preview-cards">
            {((p.categories || []) as Array<{ name: string }>).slice(0, 3).map((cat, i) => (
              <div key={i} className="bldr-preview-card">
                <div className="bldr-preview-card-title">{cat.name}</div>
              </div>
            ))}
          </div>
        </div>
      );

    case "reservation":
      return (
        <div className="bldr-preview bldr-preview--contact">
          <div className="bldr-preview-h2">{title || "Rezerwacja"}</div>
          <div className="bldr-preview-form-placeholder">
            {[1, 2, 3].map((i) => <div key={i} className="bldr-preview-form-row" />)}
            <div className="bldr-preview-btn bldr-preview-btn--primary">Zarezerwuj</div>
          </div>
        </div>
      );

    case "accordion":
      return (
        <div className="bldr-preview bldr-preview--faq">
          <div className="bldr-preview-h2">{title || "Akordeon"}</div>
          {((p.items || []) as Array<{ heading: string }>).slice(0, 3).map((item, i) => (
            <div key={i} className="bldr-preview-faq-row">
              <span>{item.heading}</span>
              <ChevronDown size={12} />
            </div>
          ))}
        </div>
      );

    case "tabs":
      return (
        <div className="bldr-preview bldr-preview--tabs-preview">
          <div className="bldr-preview-tabs-row">
            {((p.tabs || []) as Array<{ label: string }>).slice(0, 4).map((tab, i) => (
              <div key={i} className={`bldr-preview-tab-btn${i === 0 ? " bldr-preview-tab-btn--active" : ""}`}>{tab.label}</div>
            ))}
          </div>
          <div className="bldr-preview-body" style={{ marginTop: ".5rem" }}>Treść zakładki...</div>
        </div>
      );

    case "slider":
      return (
        <div className="bldr-preview bldr-preview--gallery">
          <div className="bldr-preview-h2">Slider</div>
          <div className="bldr-preview-gallery-grid" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bldr-preview-gallery-item" />
            ))}
          </div>
        </div>
      );

    case "reviews-grid":
      return (
        <div className="bldr-preview bldr-preview--testimonials">
          <div className="bldr-preview-h2">{title || "Opinie"}</div>
          <div className="bldr-preview-testimonial-cards">
            {((p.items || []) as Array<{ name: string; text: string }>).slice(0, 3).map((item, i) => (
              <div key={i} className="bldr-preview-testimonial-card">
                <div className="bldr-preview-quote">★★★★★</div>
                <div className="bldr-preview-author">{item.name}</div>
              </div>
            ))}
          </div>
        </div>
      );

    case "media-row":
      return (
        <div className="bldr-preview bldr-preview--faq">
          <div className="bldr-preview-h2">Tekst + Media</div>
          {((p.rows || []) as Array<{ heading: string }>).slice(0, 2).map((row, i) => (
            <div key={i} className="bldr-preview-faq-row">
              <span>{row.heading}</span>
            </div>
          ))}
        </div>
      );

    case "icon-grid":
      return (
        <div className="bldr-preview bldr-preview--grid-section">
          <div className="bldr-preview-section-header">
            <div className="bldr-preview-h2">{title || "Siatka ikon"}</div>
          </div>
          <div className="bldr-preview-cards">
            {((p.items || []) as Array<{ label: string }>).slice(0, 4).map((item, i) => (
              <div key={i} className="bldr-preview-card">
                <div className="bldr-preview-card-icon" />
                <div className="bldr-preview-card-title">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      );

    case "pricing-toggle":
      return (
        <div className="bldr-preview bldr-preview--pricing">
          <div className="bldr-preview-h2">{title || "Cennik"}</div>
          <div className="bldr-preview-pricing-cards">
            {((p.items || []) as Array<{ name: string; monthlyPrice: string; highlighted?: boolean }>).map((item, i) => (
              <div key={i} className={`bldr-preview-pricing-card${item.highlighted ? " bldr-preview-pricing-card--hl" : ""}`}>
                <div className="bldr-preview-pricing-name">{item.name}</div>
                <div className="bldr-preview-pricing-price">{item.monthlyPrice}/mies.</div>
              </div>
            ))}
          </div>
        </div>
      );

    case "sticky-cta":
      return (
        <div className="bldr-preview bldr-preview--cta" style={{ background: component.styles.background || "#1a1a2e", padding: ".75rem" }}>
          <div className="bldr-preview-h2" style={{ color: "#fff", fontSize: ".75rem" }}>{(p.text as string) || "Pasek CTA"}</div>
          <div className="bldr-preview-btn bldr-preview-btn--dark" style={{ fontSize: ".65rem" }}>{(p.ctaText as string) || "Akcja"}</div>
        </div>
      );

    case "event":
      return (
        <div className="bldr-preview bldr-preview--faq">
          <div className="bldr-preview-h2">{title || "Wydarzenia"}</div>
          {((p.items || []) as Array<{ date: string; title: string }>).slice(0, 3).map((item, i) => (
            <div key={i} className="bldr-preview-faq-row">
              <span style={{ fontWeight: 700, marginRight: ".5rem" }}>{item.date}</span>
              <span>{item.title}</span>
            </div>
          ))}
        </div>
      );

    case "links-list":
      return (
        <div className="bldr-preview bldr-preview--faq">
          <div className="bldr-preview-h2">{title || "Lista linków"}</div>
          {((p.items || []) as Array<{ label: string }>).slice(0, 3).map((item, i) => (
            <div key={i} className="bldr-preview-faq-row"><span>→ {item.label}</span></div>
          ))}
        </div>
      );

    case "before-after":
      return (
        <div className="bldr-preview bldr-preview--gallery">
          <div className="bldr-preview-h2">{title || "Przed / Po"}</div>
          <div className="bldr-preview-gallery-grid" style={{ gridTemplateColumns: "1fr 1fr" }}>
            <div className="bldr-preview-gallery-item" style={{ position: "relative" }}>
              <span style={{ position: "absolute", bottom: "4px", left: "4px", fontSize: ".55rem", background: "rgba(0,0,0,.5)", color: "#fff", padding: "1px 4px", borderRadius: "2px" }}>Przed</span>
            </div>
            <div className="bldr-preview-gallery-item" style={{ position: "relative" }}>
              <span style={{ position: "absolute", bottom: "4px", right: "4px", fontSize: ".55rem", background: "rgba(0,0,0,.5)", color: "#fff", padding: "1px 4px", borderRadius: "2px" }}>Po</span>
            </div>
          </div>
        </div>
      );

    default:
      return <div className="bldr-preview-default">{component.label}</div>;
  }
}

type CanvasBlockProps = {
  component: BuilderComponent;
  isSelected: boolean;
  index: number;
  totalCount: number;
};

export function CanvasBlock({ component, isSelected, index, totalCount }: CanvasBlockProps) {
  const { selectComponent, removeComponent, duplicateComponent, moveComponent } = useBuilderStore();
  const Icon = TYPE_ICONS[component.type] ?? FileText;
  const category = COMPONENT_CATEGORIES[component.type] ?? "content";
  const accent = CATEGORY_COLORS[category] ?? "#4caf7a";

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: component.id, data: { type: "canvas", component } });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bldr-block${isSelected ? " bldr-block--selected" : ""}${isDragging ? " bldr-block--dragging" : ""}`}
      onClick={(e) => {
        e.stopPropagation();
        selectComponent(component.id);
      }}
    >
      {/* Block header */}
      <div className="bldr-block-header">
        <div
          className="bldr-block-drag"
          {...attributes}
          {...listeners}
          title="Przeciągnij aby zmienić kolejność"
        >
          <GripVertical size={14} />
        </div>
        <span className="bldr-block-icon" style={{ color: accent }}>
          <Icon size={13} />
        </span>
        <span className="bldr-block-label">{component.label}</span>
        <span className="bldr-block-type" style={{ color: accent }}>
          {category}
        </span>

        <div className="bldr-block-actions">
          {index > 0 && (
            <button
              className="bldr-block-action"
              title="Przesuń wyżej"
              onClick={(e) => { e.stopPropagation(); moveComponent(index, index - 1); }}
            >
              <ChevronUp size={12} />
            </button>
          )}
          {index < totalCount - 1 && (
            <button
              className="bldr-block-action"
              title="Przesuń niżej"
              onClick={(e) => { e.stopPropagation(); moveComponent(index, index + 1); }}
            >
              <ChevronDown size={12} />
            </button>
          )}
          <button
            className="bldr-block-action"
            title="Duplikuj"
            onClick={(e) => { e.stopPropagation(); duplicateComponent(component.id); }}
          >
            <Copy size={12} />
          </button>
          <button
            className="bldr-block-action bldr-block-action--danger"
            title="Usuń"
            onClick={(e) => {
              e.stopPropagation();
              if (confirm(`Usunąć sekcję "${component.label}"?`)) removeComponent(component.id);
            }}
          >
            <Trash2 size={12} />
          </button>
        </div>
      </div>

      {/* Block preview */}
      <div className="bldr-block-preview">
        <BlockPreview component={component} />
      </div>

      {/* Selected indicator */}
      {isSelected && <div className="bldr-block-selected-bar" style={{ background: accent }} />}
    </div>
  );
}
