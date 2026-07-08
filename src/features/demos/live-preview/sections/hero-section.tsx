import { ArrowUpRight } from "lucide-react";
import type { DemoContent } from "@/features/demos/types";
import { DemoImageMedia } from "../demo-image-media";
import styles from "../live-preview.module.css";

export function HeroSection({
  content,
  id,
}: {
  content: DemoContent;
  id: string;
}) {
  return (
    <section id={id} className={styles.hero}>
      <div className={styles.heroDecor} aria-hidden="true" />
      <div className={styles.heroCopy}>
        {content.hero.eyebrow ? (
          <p className={styles.eyebrow}>{content.hero.eyebrow}</p>
        ) : null}
        <h1>{content.hero.title}</h1>
        <p className={styles.heroLead}>{content.hero.subtitle}</p>
        <div className={styles.actions}>
          <a className={styles.primaryButton} href={content.hero.primaryCta.href}>
            {content.hero.primaryCta.label}
            <ArrowUpRight size={16} />
          </a>
          {content.hero.secondaryCta.label ? (
            <a className={styles.textButton} href={content.hero.secondaryCta.href}>
              {content.hero.secondaryCta.label}
            </a>
          ) : null}
        </div>
      </div>
      <DemoImageMedia
        image={content.hero.image}
        className={styles.heroMedia}
        priority
      />
    </section>
  );
}
