import Image from "next/image";
import type { DemoImage } from "@/features/demos/types";
import styles from "./live-preview.module.css";

export function DemoImageMedia({
  image,
  priority = false,
  className,
}: {
  image: DemoImage;
  priority?: boolean;
  className?: string;
}) {
  return (
    <div className={`${styles.media} ${className ?? ""}`}>
      {image.url ? (
        <Image
          src={image.url}
          alt={image.alt}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          priority={priority}
          className={styles.mediaImage}
        />
      ) : (
        <div className={styles.placeholder}>
          <span>Planowany kadr</span>
          <p>{image.description}</p>
        </div>
      )}
      {image.photographer ? (
        <small className={styles.credit}>
          Zdjęcie: {image.photographer}
        </small>
      ) : null}
    </div>
  );
}

