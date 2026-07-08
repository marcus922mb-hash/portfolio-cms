import type { DemoContent } from "@/features/demos/types";
import { SectionHeading } from "../section-heading";
import styles from "../live-preview.module.css";

export function ServicesSection({
  content,
  id,
}: {
  content: DemoContent;
  id: string;
}) {
  return (
    <section id={id} className={styles.section}>
      <SectionHeading {...content.headings.services} />
      <div className={styles.serviceGrid}>
        {content.services.map((service, index) => (
          <article className={styles.serviceCard} key={`${service.title}-${index}`}>
            <span className={styles.serviceNum}>{String(index + 1).padStart(2, "0")}</span>
            <h3>{service.title}</h3>
            <p>{service.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
