import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SectionLibraryWorkspace } from "@/features/section-library/components/section-library-workspace";
import { getSectionLibrarySnapshot } from "@/features/section-library/service";

export const metadata: Metadata = {
  title: "Biblioteka Sekcji",
};

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export default async function PanelSectionLibraryDetailPage({ params }: Props) {
  const { id } = await params;
  const snapshot = await getSectionLibrarySnapshot();
  const exists = snapshot.sections.some((section) => section.id === id);
  if (!exists) {
    notFound();
  }
  return <SectionLibraryWorkspace snapshot={snapshot} initialSelectedId={id} />;
}

