import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { PanelShell } from "@/components/panel/shell";
import { getSession } from "@/lib/auth";

export const metadata: Metadata = {
  title: {
    default: "Panel | MA Atelier Studio",
    template: "%s | Panel",
  },
  robots: { index: false, follow: false },
};

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  // Use portfolio-cms native auth (cms_session cookie + Prisma)
  const user = await getSession();

  if (!user) {
    redirect("/login");
  }

  const fullName = user.name ?? user.email?.split("@")[0] ?? "Administrator";
  const initials = fullName
    .split(/\s+/)
    .slice(0, 2)
    .map((part: string) => part[0])
    .join("")
    .toUpperCase();

  return (
    <PanelShell
      user={{
        fullName,
        email: user.email ?? "",
        initials: initials || "AD",
        role: user.role ?? "Administrator",
        reducedMotion: false,
      }}
    >
      {children}
    </PanelShell>
  );
}
