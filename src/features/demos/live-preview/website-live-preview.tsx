import type { DemoContent, DemoSectionType } from "@/features/demos/types";
import { AboutSection } from "./sections/about-section";
import { ContactSection } from "./sections/contact-section";
import { CtaSection } from "./sections/cta-section";
import { FaqSection } from "./sections/faq-section";
import { FeaturesSection } from "./sections/features-section";
import { FooterSection } from "./sections/footer-section";
import { GallerySection } from "./sections/gallery-section";
import { HeroSection } from "./sections/hero-section";
import { NavigationSection } from "./sections/navigation-section";
import { ProcessSection } from "./sections/process-section";
import { ServicesSection } from "./sections/services-section";
import { TestimonialsSection } from "./sections/testimonials-section";
import styles from "./live-preview.module.css";

const sectionComponents: Record<
  DemoSectionType,
  React.ComponentType<{ content: DemoContent; id: string }>
> = {
  navigation: NavigationSection,
  hero: HeroSection,
  about: AboutSection,
  services: ServicesSection,
  features: FeaturesSection,
  gallery: GallerySection,
  process: ProcessSection,
  testimonials: TestimonialsSection,
  faq: FaqSection,
  cta: CtaSection,
  contact: ContactSection,
  footer: FooterSection,
};

export function WebsiteLivePreview({
  content,
  demoLabel,
}: {
  content: DemoContent;
  demoLabel?: string;
}) {
  const style = {
    "--preview-primary": content.site.colors.primary,
    "--preview-secondary": content.site.colors.secondary,
    "--preview-background": content.site.colors.background,
    "--preview-text": content.site.colors.text,
  } as React.CSSProperties;

  return (
    <main className={styles.preview} style={style}>
      <aside className={styles.demoBanner}>
        <div className={styles.demoBannerLeft}>
          <span className={styles.demoBannerTag}>Podgląd demonstracyjny</span>
          {demoLabel && <span className={styles.demoBannerText}>{demoLabel}</span>}
        </div>
        <a href="/kontakt" className={styles.demoBannerCta}>
          Podoba Ci się? Skontaktuj się →
        </a>
      </aside>
      {content.structure
        .filter((section) => section.visible)
        .map((section) => {
          const Section = sectionComponents[section.type];
          return <Section content={content} id={section.id} key={`${section.type}-${section.id}`} />;
        })}
    </main>
  );
}

