"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Calculator,
  FolderOpen,
  Globe,
  Sparkles,
  Layout,
  ShoppingBag,
  Settings,
  ChevronLeft,
  PanelsTopLeft,
  Layers,
  Bot,
  History,
  FileText,
  Code,
  MessagesSquare,
  Palette,
  LayoutTemplate,
  Wand2,
  MonitorPlay,
  Component,
  Film,
  Image,
  Search,
  Code2,
} from "lucide-react";
import type { PanelShellUser } from "./shell";

const EXTERNAL_LINKS = [
  {
    href: "https://vengenceui-ivory.vercel.app",
    label: "VengeanceUI",
    Icon: Palette,
    description: "Biblioteka animowanych komponentów",
  },
];

const sections = [
  {
    label: "Główne",
    items: [
      { href: "/panel", label: "Dashboard", Icon: LayoutDashboard },
      { href: "/panel/klienci", label: "Klienci", Icon: Users },
      { href: "/panel/wyceny", label: "Wyceny", Icon: Calculator },
      { href: "/panel/projekty", label: "Projekty", Icon: FolderOpen },
    ],
  },
  {
    label: "Studio",
    items: [
      { href: "/panel/studio", label: "Studio Hub", Icon: Wand2 },
      { href: "/panel/studio/visual-builder", label: "Visual Builder", Icon: MonitorPlay },
      { href: "/panel/studio/components", label: "Component Builder", Icon: Component },
      { href: "/panel/studio/animations", label: "Animation Studio", Icon: Film },
      { href: "/panel/studio/themes", label: "Theme Builder", Icon: Palette },
      { href: "/panel/studio/templates", label: "Template Builder", Icon: LayoutTemplate },
      { href: "/panel/studio/media", label: "Media Studio", Icon: Image },
      { href: "/panel/studio/seo", label: "SEO Studio", Icon: Search },
      { href: "/panel/studio/code", label: "Code Studio", Icon: Code2 },
    ],
  },
  {
    label: "AI Hub",
    items: [
      { href: "/panel/ai/chat", label: "AI Chat (multi)", Icon: MessagesSquare },
      { href: "/panel/ai/narzedzia", label: "Narzędzia AI", Icon: Bot },
      { href: "/panel/ai/wyniki", label: "Wyniki AI", Icon: History },
      { href: "/panel/ai/szablony", label: "Szablony branżowe", Icon: FileText },
      { href: "/panel/ai/prototypy", label: "Prototypy HTML", Icon: Code },
      { href: "/panel/ai", label: "AI Monitor", Icon: Sparkles },
    ],
  },
  {
    label: "Narzędzia",
    items: [
      { href: "/panel/demo", label: "Demo", Icon: Globe },
      { href: "/panel/templates", label: "Szablony", Icon: PanelsTopLeft },
      { href: "/panel/sekcje", label: "Biblioteka sekcji", Icon: LayoutTemplate },
      { href: "/panel/builder", label: "Builder", Icon: Layers },
      { href: "/panel/wordpress", label: "WordPress", Icon: Layout },
      { href: "/panel/woocommerce", label: "WooCommerce", Icon: ShoppingBag },
    ],
  },
  {
    label: "System",
    items: [{ href: "/panel/ustawienia", label: "Ustawienia", Icon: Settings }],
  },
];

type PanelSidebarProps = {
  user: PanelShellUser;
  open: boolean;
  collapsed: boolean;
  onClose: () => void;
  onToggleCollapse: () => void;
};

export function PanelSidebar({ user, open, collapsed, onClose, onToggleCollapse }: PanelSidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {open && (
        <div className="panel-overlay" onClick={onClose} aria-hidden="true" />
      )}

      <aside
        className={[
          "panel-sidebar",
          open ? "is-open" : "",
          collapsed ? "is-collapsed" : "",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {/* Logo */}
        <div className="panel-sidebar-logo">
          <Link href="/panel" onClick={onClose}>
            <span className="panel-logo-mark">M</span>
            <span className="panel-logo-text">
              <span>MA ATELIER</span>
              <span>Studio</span>
            </span>
          </Link>
        </div>

        {/* Navigation */}
        <nav aria-label="Panel nawigacja">
          {sections.map((section) => (
            <div key={section.label}>
              {!collapsed && (
                <span className="panel-nav-section">{section.label}</span>
              )}
              {section.items.map(({ href, label, Icon }) => {
                const isActive =
                  href === "/panel"
                    ? pathname === "/panel"
                    : pathname.startsWith(href);
                return (
                  <Link
                    key={href}
                    href={href}
                    title={collapsed ? label : undefined}
                    className={`panel-nav-item${isActive ? " is-active" : ""}`}
                    onClick={onClose}
                  >
                    <Icon size={15} aria-hidden="true" />
                    {!collapsed && (
                      <span className="panel-nav-label">{label}</span>
                    )}
                  </Link>
                );
              })}
            </div>
          ))}

          {/* External tools */}
          {!collapsed && (
            <span className="panel-nav-section">Zasoby</span>
          )}
          {EXTERNAL_LINKS.map(({ href, label, Icon }) => (
            <a
              key={href}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              title={collapsed ? label : undefined}
              className="panel-nav-item panel-nav-item--external"
            >
              <Icon size={15} aria-hidden="true" />
              {!collapsed && <span className="panel-nav-label">{label}</span>}
            </a>
          ))}

          {/* Collapse toggle */}
          <button
            type="button"
            className="panel-collapse-btn"
            onClick={onToggleCollapse}
            title={collapsed ? "Rozwiń panel" : "Zwiń panel"}
            aria-label={collapsed ? "Rozwiń panel" : "Zwiń panel"}
          >
            <ChevronLeft size={13} />
          </button>
        </nav>

        {/* Footer */}
        <div className="panel-sidebar-footer">
          <div className="panel-user">
            <span className="panel-user-avatar">{user.initials}</span>
            <div className="panel-user-info">
              <p className="panel-user-name">{user.fullName}</p>
              <p className="panel-user-role">{user.role}</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
