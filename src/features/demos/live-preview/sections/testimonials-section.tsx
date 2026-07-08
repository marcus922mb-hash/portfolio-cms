import type { DemoContent } from "@/features/demos/types";
import { SectionHeading } from "../section-heading";
import styles from "../live-preview.module.css";

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function TestimonialsSection({
  content,
  id,
}: {
  content: DemoContent;
  id: string;
}) {
  return (
    <section id={id} className={styles.section}>
      <SectionHeading {...content.headings.testimonials} align="center" />
      <div className={styles.testimonialGrid}>
        {content.testimonials.map((testimonial, index) => (
          <figure className={styles.testimonial} key={`${testimonial.name}-${index}`}>
            <p className={styles.testimonialQuote}>&ldquo;{testimonial.content}&rdquo;</p>
            <div className={styles.testimonialAuthor}>
              <div className={styles.testimonialAvatar}>{initials(testimonial.name)}</div>
              <div className={styles.testimonialMeta}>
                <strong>{testimonial.name}</strong>
                <span>{testimonial.role}</span>
              </div>
            </div>
          </figure>
        ))}
      </div>
    </section>
  );
}
