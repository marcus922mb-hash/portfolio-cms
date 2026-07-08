"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { PanelSidebar } from "./sidebar";
import { PanelTopbar } from "./topbar";

export type PanelShellUser = {
  fullName: string;
  email: string;
  initials: string;
  role: string;
  reducedMotion: boolean;
};

export function PanelShell({
  children,
  user,
}: {
  children: React.ReactNode;
  user: PanelShellUser;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  // Builder editor is full-screen — bypass panel shell
  const isBuilderEditor =
    pathname.startsWith("/panel/builder/") &&
    pathname.split("/").filter(Boolean).length > 2;

  if (isBuilderEditor) {
    return <>{children}</>;
  }

  return (
    <div
      className={`panel-shell${user.reducedMotion ? " is-reduced-motion" : ""}`}
      data-theme="panel"
    >
      <PanelSidebar
        user={user}
        open={sidebarOpen}
        collapsed={collapsed}
        onClose={() => setSidebarOpen(false)}
        onToggleCollapse={() => setCollapsed((prev) => !prev)}
      />
      <div className="panel-main">
        <PanelTopbar user={user} onMenuToggle={() => setSidebarOpen((prev) => !prev)} />
        <main className="panel-content">{children}</main>
      </div>
    </div>
  );
}
