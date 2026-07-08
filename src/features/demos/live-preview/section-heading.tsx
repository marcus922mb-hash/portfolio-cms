import styles from "./live-preview.module.css";

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "left",
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
}) {
  return (
    <header
      className={`${styles.sectionHeading} ${
        align === "center" ? styles.center : ""
      }`}
    >
      <p className={styles.eyebrow}>{eyebrow}</p>
      <h2>{title}</h2>
      {subtitle ? <p className={styles.sectionSubtitle}>{subtitle}</p> : null}
    </header>
  );
}

