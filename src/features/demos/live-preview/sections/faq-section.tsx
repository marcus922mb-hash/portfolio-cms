import type { DemoContent } from "@/features/demos/types";
import { SectionHeading } from "../section-heading";
import styles from "../live-preview.module.css";

export function FaqSection({
  content,
  id,
}: {
  content: DemoContent;
  id: string;
}) {
  return (
    <section id={id} className={`${styles.section} ${styles.faqSection}`}>
      <SectionHeading {...content.headings.faq} />
      <div className={styles.faqList}>
        {content.faq.map((item, index) => (
          <details key={`${item.question}-${index}`}>
            <summary>
              {item.question}
              <span>+</span>
            </summary>
            <p>{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

