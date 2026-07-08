"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Search, Bell, ExternalLink, ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { LogoutButton } from "@/components/auth/logout-button";
import type { PanelShellUser } from "./shell";

const breadcrumbLabels: Record<string, string> = {
  panel: "Panel",
  klienci: "Klienci",
  wyceny: "Wyceny",
  demo: "Demo",
  templates: "Szablony",
  sekcje: "Biblioteka sekcji",
  builder: "Builder",
  projekty: "Projekty",
  ai: "AI",
  narzedzia: "Narzędzia AI",
  wyniki: "Wyniki",
  szablony: "Szablony branżowe",
  prototypy: "Prototypy HTML",
  chat: "AI Chat",
  wordpress: "WordPress",
  woocommerce: "WooCommerce",
  ustawienia: "Ustawienia",
};

function PanelBreadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  if (segments.length === 1) {
    return (
      <nav className="panel-breadcrumbs" aria-label="Breadcrumb">
        <span className="panel-breadcrumbs-current">Dashboard</span>
      </nav>
    );
  }

  return (
    <nav className="panel-breadcrumbs" aria-label="Breadcrumb">
      <Link href="/panel">Panel</Link>
      {segments.slice(1).map((seg, i) => {
        const isLast = i === segments.slice(1).length - 1;
        const label = breadcrumbLabels[seg] ?? seg;
        const href = "/" + segments.slice(0, i + 2).join("/");
        return (
          <span key={seg} style={{ display: "contents" }}>
            <span className="panel-breadcrumbs-sep" aria-hidden="true">/</span>
            {isLast ? (
              <span className="panel-breadcrumbs-current">{label}</span>
            ) : (
              <Link href={href}>{label}</Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}

function UserMenu({ user }: { user: PanelShellUser }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="panel-user-menu-wrapper">
      <button
        type="button"
        className={`panel-user-menu-btn${open ? " is-open" : ""}`}
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="true"
        aria-expanded={open}
        aria-label="Menu użytkownika"
      >
        <span className="panel-user-avatar" style={{ width: "1.6rem", height: "1.6rem", fontSize: ".52rem" }}>
          {user.initials}
        </span>
        <ChevronDown size={11} />
      </button>

      {open && (
        <div className="panel-user-menu-dropdown" role="menu">
          <div className="panel-user-menu-header">
            <p>{user.fullName}</p>
            <p>{user.email || user.role}</p>
          </div>
          <div className="panel-user-menu-divider" />
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="panel-user-menu-item"
            role="menuitem"
            onClick={() => setOpen(false)}
          >
            <ExternalLink size={13} aria-hidden="true" />
            Strona publiczna
          </Link>
          <div className="panel-user-menu-divider" />
          <LogoutButton />
        </div>
      )}
    </div>
  );
}

type PanelTopbarProps = {
  user: PanelShellUser;
  onMenuToggle: () => void;
};

export function PanelTopbar({ user, onMenuToggle }: PanelTopbarProps) {
  return (
    <header className="panel-topbar">
      <button
        type="button"
        className="panel-menu-btn"
        onClick={onMenuToggle}
        aria-label="Otwórz menu boczne"
      >
        <Menu size={15} />
      </button>

      <PanelBreadcrumbs />

      <div className="panel-topbar-actions">
        <button
          type="button"
          className="panel-search-btn"
          aria-label="Szukaj"
        >
          <Search size={13} />
          Szukaj
          <span className="panel-search-shortcut">⌘K</span>
        </button>

        <div className="panel-notif-wrapper">
          <button
            type="button"
            className="panel-icon-btn"
            aria-label="Powiadomienia"
          >
            <Bell size={14} />
          </button>
          <span className="panel-notif-dot" aria-hidden="true" />
        </div>

        <UserMenu user={user} />
      </div>
    </header>
  );
}
