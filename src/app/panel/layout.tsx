import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { PanelShell } from "@/components/panel/shell";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: {
    default: "Panel | MA Atelier Studio",
    template: "%s | Panel",
  },
  robots: { index: false, follow: false },
};

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  // Secondary guard — proxy.ts handles the first check, but this ensures
  // the session is valid even if the request bypassed middleware.
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const metadata = user.user_metadata ?? {};
  const fullName =
    typeof metadata.full_name === "string" && metadata.full_name.trim()
      ? metadata.full_name.trim()
      : user.email?.split("@")[0] ?? "Administrator";
  const initials = fullName
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return (
    <PanelShell
      user={{
        fullName,
        email: user.email ?? "",
        initials: initials || "AD",
        role: "Administrator",
        reducedMotion: metadata.reduced_motion === true,
      }}
    >
      {children}
    </PanelShell>
  );
}
