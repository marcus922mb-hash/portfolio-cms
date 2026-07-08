import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { getProjectById } from "@/features/projects/queries/project-queries";
import { updateProjectAction } from "@/features/projects/actions/project-actions";
import { ProjectForm } from "@/features/projects/components/project-form";
import { getClients } from "@/features/clients/queries/client-queries";
import { getEstimates } from "@/features/estimates/queries/estimate-queries";
import { getClientDisplayName } from "@/features/clients/types";
import { getEstimateClientLabel, WEBSITE_TYPE_LABELS } from "@/features/estimates/types";

type Props = { params: Promise<{ id: string }> };

export const metadata: Metadata = { title: "Edytuj projekt" };

export default async function EdytujProjektPage({ params }: Props) {
  const { id } = await params;
  const [{ data: project }, { data: clients }, { data: estimates }] = await Promise.all([
    getProjectById(id),
    getClients(),
    getEstimates(),
  ]);

  if (!project) notFound();

  const boundAction = updateProjectAction.bind(null, id);

  const clientOptions = (clients ?? []).map((c) => ({
    id: c.id,
    label: getClientDisplayName(c),
  }));

  const estimateOptions = (estimates ?? []).map((e) => ({
    id: e.id,
    label: `${WEBSITE_TYPE_LABELS[e.website_type] ?? e.website_type} · ${getEstimateClientLabel(e)}`,
  }));

  return (
    <>
      <div className="crm-page-header">
        <div>
          <Link href={`/panel/projekty/${id}`} className="crm-back-link">
            <ChevronLeft size={13} />
            {project.name}
          </Link>
          <h1 className="crm-page-title">Edytuj projekt</h1>
        </div>
      </div>

      <div className="crm-form-wrap">
        <ProjectForm
          action={boundAction}
          submitLabel="Zapisz zmiany"
          defaultValues={project}
          clients={clientOptions}
          estimates={estimateOptions}
        />
      </div>
    </>
  );
}
