import type { DemoContent } from "@/features/demos/types";
import styles from "../live-preview.module.css";

export function NavigationSection({
  content,
  id,
}: {
  content: DemoContent;
  id: string;
}) {
  return (
    <nav id={id} className={styles.navigation} aria-label="Główna nawigacja">
      <a className={styles.logo} href="#start">
        {content.navigation.logoText}
      </a>
      <div className={styles.navLinks}>
        {content.navigation.links.map((link) => (
          <a href={link.href} key={`${link.href}-${link.label}`}>
            {link.label}
          </a>
        ))}
      </div>
      <a className={styles.navCta} href={content.navigation.cta.href}>
        {content.navigation.cta.label}
      </a>
    </nav>
  );
}

