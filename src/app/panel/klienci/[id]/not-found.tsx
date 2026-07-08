import Link from "next/link";
import { UserX } from "lucide-react";

export default function KlientNotFound() {
  return (
    <div className="panel-error">
      <div className="panel-error-icon">
        <UserX size={36} strokeWidth={1.2} />
      </div>
      <h3>Nie znaleziono klienta</h3>
      <p>
        Klient o podanym identyfikatorze nie istnieje lub został usunięty.
      </p>
      <Link href="/panel/klienci" className="panel-error-btn">
        ← Wróć do listy klientów
      </Link>
    </div>
  );
}
