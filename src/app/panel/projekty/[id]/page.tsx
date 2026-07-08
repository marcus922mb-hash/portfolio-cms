import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { getProjectById } from "@/features/projects/queries/project-queries";
import { ProjectDetailsCard } from "@/features/projects/components/project-details-card";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const { data } = await getProjectById(id);
  return { title: data ? data.name : "Projekt nie znaleziony" };
}

export default async function ProjektDetailsPage({ params }: Props) {
  const { id } = await params;
  const { data: project } = await getProjectById(id);
  if (!project) notFound();

  return (
    <>
      <div className="crm-page-header">
        <div>
          <Link href="/panel/projekty" className="crm-back-link">
            <ChevronLeft size={13} />
            Projekty
          </Link>
          <h1 className="crm-page-title">{project.name}</h1>
          <p className="crm-page-desc">Szczegóły realizacji</p>
        </div>
      </div>

      <ProjectDetailsCard project={project} />
    </>
  );
}
