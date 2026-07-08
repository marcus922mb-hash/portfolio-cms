import { Sparkles, Shield, Zap, Star, Heart, Lightbulb } from "lucide-react";
import type { DemoContent } from "@/features/demos/types";
import { SectionHeading } from "../section-heading";
import styles from "../live-preview.module.css";

const ICONS = [Sparkles, Shield, Zap, Star, Heart, Lightbulb];

export function FeaturesSection({
  content,
  id,
}: {
  content: DemoContent;
  id: string;
}) {
  return (
    <section id={id} className={`${styles.section} ${styles.softSection}`}>
      <SectionHeading {...content.headings.features} align="center" />
      <div className={styles.featureGrid}>
        {content.features.map((feature, index) => {
          const Icon = ICONS[index % ICONS.length];
          return (
            <article className={styles.featureCard} key={feature.title}>
              <div className={styles.featureIcon}>
                <Icon size={18} />
              </div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
