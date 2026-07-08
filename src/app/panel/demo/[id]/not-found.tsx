import Link from "next/link";
import { Globe2 } from "lucide-react";

export default function DemoNotFound() {
  return (
    <div className="panel-error">
      <div className="panel-error-icon">
        <Globe2 size={36} strokeWidth={1.2} />
      </div>
      <h3>Nie znaleziono demo</h3>
      <p>Demo o podanym identyfikatorze nie istnieje lub zostało usunięte.</p>
      <Link href="/panel/demo" className="panel-error-btn">
        ← Wróć do listy demo
      </Link>
    </div>
  );
}
