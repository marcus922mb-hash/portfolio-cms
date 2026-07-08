import type { Metadata } from "next";
import { SectionLibraryWorkspace } from "@/features/section-library/components/section-library-workspace";
import { getSectionLibrarySnapshot } from "@/features/section-library/service";

export const metadata: Metadata = {
  title: "Biblioteka Sekcji",
};

export const dynamic = "force-dynamic";

export default async function PanelSectionLibraryPage() {
  const snapshot = await getSectionLibrarySnapshot();
  return <SectionLibraryWorkspace snapshot={snapshot} />;
}

