import type { DemoContent } from "@/features/demos/types";
import { DemoImageMedia } from "../demo-image-media";
import { SectionHeading } from "../section-heading";
import styles from "../live-preview.module.css";

export function GallerySection({
  content,
  id,
}: {
  content: DemoContent;
  id: string;
}) {
  return (
    <section id={id} className={styles.section}>
      <SectionHeading
        eyebrow={content.gallery.eyebrow}
        title={content.gallery.title}
        subtitle={content.gallery.subtitle}
      />
      <div className={styles.galleryGrid}>
        {content.gallery.items.map((image, index) => (
          <DemoImageMedia
            image={image}
            className={index === 0 ? styles.galleryFeatured : styles.galleryItem}
            key={`${image.url}-${image.alt}-${index}`}
          />
        ))}
      </div>
    </section>
  );
}

