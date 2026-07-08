import Link from "next/link";
import { WrapText } from "lucide-react";

export default function WPConnectionNotFound() {
  return (
    <div className="panel-not-found">
      <WrapText size={40} strokeWidth={1.2} />
      <h1>Połączenie nie znalezione</h1>
      <p>Połączenie WordPress o podanym ID nie istnieje lub zostało usunięte.</p>
      <Link href="/panel/wordpress" className="crm-btn crm-btn--primary crm-btn--sm">
        Wróć do listy
      </Link>
    </div>
  );
}
