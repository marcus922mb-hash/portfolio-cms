import type { DemoContent } from "@/features/demos/types";
import { DemoImageMedia } from "../demo-image-media";
import styles from "../live-preview.module.css";

export function AboutSection({
  content,
  id,
}: {
  content: DemoContent;
  id: string;
}) {
  return (
    <section id={id} className={`${styles.section} ${styles.about}`}>
      <DemoImageMedia image={content.about.image} className={styles.aboutMedia} />
      <div className={styles.aboutCopy}>
        <p className={styles.eyebrow}>{content.about.eyebrow}</p>
        <h2>{content.about.title}</h2>
        <p>{content.about.content}</p>
      </div>
    </section>
  );
}

