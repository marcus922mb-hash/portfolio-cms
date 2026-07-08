export type PanelNavItem = {
  href: string;
  label: string;
  icon: string;
  description: string;
  section: "main" | "tools" | "system";
};

export const panelNavItems: PanelNavItem[] = [
  // Main
  { href: "/panel", label: "Dashboard", icon: "LayoutDashboard", description: "Przegląd aktywności", section: "main" },
  { href: "/panel/klienci", label: "Klienci", icon: "Users", description: "Baza klientów", section: "main" },
  { href: "/panel/wyceny", label: "Wyceny", icon: "Calculator", description: "Kalkulacje i oferty", section: "main" },
  { href: "/panel/projekty", label: "Projekty", icon: "FolderOpen", description: "Aktywne realizacje", section: "main" },
  // Studio
  { href: "/panel/studio", label: "Studio Hub", icon: "Wand2", description: "Centrum AI", section: "main" },
  { href: "/panel/studio/visual-builder", label: "Visual Builder", icon: "MonitorPlay", description: "Edytor wizualny", section: "main" },
  { href: "/panel/studio/components", label: "Component Builder", icon: "Component", description: "Komponenty", section: "main" },
  { href: "/panel/studio/animations", label: "Animation Studio", icon: "Film", description: "Animacje", section: "main" },
  { href: "/panel/studio/themes", label: "Theme Builder", icon: "Palette", description: "Motywy i kolory", section: "main" },
  { href: "/panel/studio/templates", label: "Template Builder", icon: "LayoutTemplate", description: "Szablony", section: "main" },
  { href: "/panel/studio/media", label: "Media Studio", icon: "Image", description: "Zarządzanie mediami", section: "main" },
  { href: "/panel/studio/seo", label: "SEO Studio", icon: "Search", description: "Narzędzia SEO", section: "main" },
  { href: "/panel/studio/code", label: "Code Studio", icon: "Code2", description: "Edytor kodu", section: "main" },
  // Tools
  { href: "/panel/demo", label: "Demo", icon: "Globe", description: "Strony demonstracyjne", section: "tools" },
  { href: "/panel/ai", label: "AI", icon: "Sparkles", description: "Asystent AI", section: "tools" },
  { href: "/panel/wordpress", label: "WordPress", icon: "Layout", description: "Zarządzanie WordPress", section: "tools" },
  { href: "/panel/woocommerce", label: "WooCommerce", icon: "ShoppingBag", description: "Zarządzanie sklepami", section: "tools" },
  // System
  { href: "/panel/ustawienia", label: "Ustawienia", icon: "Settings", description: "Konfiguracja systemu", section: "system" },
];

export const publicNavItems = [
  { href: "/oferta", label: "Oferta" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/wycena", label: "Wycena" },
  { href: "/kontakt", label: "Kontakt" },
];
