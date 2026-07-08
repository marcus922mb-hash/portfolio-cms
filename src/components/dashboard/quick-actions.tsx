import Link from "next/link";
import { UserPlus, Calculator, Globe, FolderPlus } from "lucide-react";

const actions = [
  { href: "/panel/klienci/nowy", label: "Nowy klient", Icon: UserPlus, primary: true },
  { href: "/panel/wyceny/nowa", label: "Nowa wycena", Icon: Calculator, primary: false },
  { href: "/panel/demo/nowe", label: "Nowe demo", Icon: Globe, primary: false },
  { href: "/panel/projekty/nowy", label: "Nowy projekt", Icon: FolderPlus, primary: false },
];

export function QuickActions() {
  return (
    <div className="panel-quick-actions">
      {actions.map(({ href, label, Icon, primary }) => (
        <Link
          key={href}
          href={href}
          className={`panel-quick-btn${primary ? " panel-quick-btn--primary" : ""}`}
        >
          <Icon size={13} aria-hidden="true" />
          {label}
        </Link>
      ))}
    </div>
  );
}
