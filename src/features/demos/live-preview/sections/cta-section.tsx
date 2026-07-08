import { ArrowRight } from "lucide-react";
import type { DemoContent } from "@/features/demos/types";
import styles from "../live-preview.module.css";

export function CtaSection({
  content,
  id,
}: {
  content: DemoContent;
  id: string;
}) {
  return (
    <section id={id} className={styles.ctaSection}>
      <p className={styles.eyebrow}>{content.cta.eyebrow}</p>
      <h2>{content.cta.title}</h2>
      <p>{content.cta.description}</p>
      <div className={styles.actions}>
        <a className={styles.lightButton} href={content.cta.primaryCta.href}>
          {content.cta.primaryCta.label}
          <ArrowRight size={17} />
        </a>
        <a className={styles.lightTextButton} href={content.cta.secondaryCta.href}>
          {content.cta.secondaryCta.label}
        </a>
      </div>
    </section>
  );
}

