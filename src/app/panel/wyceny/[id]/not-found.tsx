import Link from "next/link";
import { FileQuestion } from "lucide-react";

export default function WycenaNotFound() {
  return (
    <div className="crm-not-found">
      <FileQuestion size={44} strokeWidth={1.1} className="crm-not-found-icon" />
      <h1 className="crm-not-found-title">Wycena nie istnieje</h1>
      <p className="crm-not-found-desc">
        Wycena mogła zostać usunięta lub podany adres jest nieprawidłowy.
      </p>
      <Link href="/panel/wyceny" className="crm-btn crm-btn--primary crm-btn--sm">
        Wróć do listy wycen
      </Link>
    </div>
  );
}
