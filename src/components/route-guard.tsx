"use client";
import { usePathname } from "next/navigation";

export function HideOnMaWeb({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname.startsWith("/ma-web")) return null;
  return <>{children}</>;
}
