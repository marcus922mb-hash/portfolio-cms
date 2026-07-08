import type { DemoContent } from "@/features/demos/types";
import { SectionHeading } from "../section-heading";
import styles from "../live-preview.module.css";

export function ProcessSection({
  content,
  id,
}: {
  content: DemoContent;
  id: string;
}) {
  return (
    <section id={id} className={`${styles.section} ${styles.darkSection}`}>
      <SectionHeading {...content.headings.process} />
      <div className={styles.processGrid}>
        {content.process.map((step, index) => (
          <article className={styles.processStep} key={`${step.title}-${index}`}>
            <p className={styles.processStepNum}>{String(index + 1).padStart(2, "0")}</p>
            <h3>{step.title}</h3>
            <p>{step.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
