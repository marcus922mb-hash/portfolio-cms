import type { DemoContent } from "@/features/demos/types";
import styles from "../live-preview.module.css";

export function FooterSection({
  content,
  id,
}: {
  content: DemoContent;
  id: string;
}) {
  return (
    <footer id={id} className={styles.footer}>
      <div className={styles.footerBrand}>
        <strong>{content.site.name}</strong>
        <p>{content.footer.description}</p>
      </div>
      <div className={styles.footerColumns}>
        {content.footer.columns.map((column) => (
          <div key={column.title}>
            <strong>{column.title}</strong>
            {column.links.map((link) => (
              <a href={link.href} key={`${link.href}-${link.label}`}>{link.label}</a>
            ))}
          </div>
        ))}
      </div>
      <small>{content.footer.copyright}</small>
    </footer>
  );
}

