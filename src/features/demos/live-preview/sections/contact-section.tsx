import { Mail, MapPin, Phone } from "lucide-react";
import type { DemoContent } from "@/features/demos/types";
import styles from "../live-preview.module.css";

export function ContactSection({
  content,
  id,
}: {
  content: DemoContent;
  id: string;
}) {
  const contact = content.contact;
  return (
    <section id={id} className={`${styles.section} ${styles.contactSection}`}>
      <div>
        <p className={styles.eyebrow}>{contact.eyebrow}</p>
        <h2>{contact.title}</h2>
        <p>{contact.description}</p>
        <div className={styles.contactDetails}>
          {contact.email ? <a href={`mailto:${contact.email}`}><Mail size={16} />{contact.email}</a> : null}
          {contact.phone ? <a href={`tel:${contact.phone}`}><Phone size={16} />{contact.phone}</a> : null}
          {contact.address ? <span><MapPin size={16} />{contact.address}</span> : null}
        </div>
      </div>
      <form className={styles.contactForm}>
        <label>Imię i nazwisko<input name="name" placeholder="Jak możemy się do Ciebie zwracać?" /></label>
        <label>Adres e-mail<input name="email" type="email" placeholder="twoj@email.pl" /></label>
        <label>Wiadomość<textarea name="message" rows={5} placeholder="Napisz krótko, czego potrzebujesz." /></label>
        <button type="button">{contact.cta}</button>
      </form>
    </section>
  );
}

