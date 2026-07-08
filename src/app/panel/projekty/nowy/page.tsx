import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { createProjectAction } from "@/features/projects/actions/project-actions";
import { ProjectForm } from "@/features/projects/components/project-form";
import { getClients } from "@/features/clients/queries/client-queries";
import { getEstimates } from "@/features/estimates/queries/estimate-queries";
import { getClientDisplayName } from "@/features/clients/types";
import { getEstimateClientLabel, WEBSITE_TYPE_LABELS } from "@/features/estimates/types";

export const metadata: Metadata = { title: "Nowy projekt" };

export default async function NowyProjektPage() {
  const [{ data: clients }, { data: estimates }] = await Promise.all([
    getClients(),
    getEstimates(),
  ]);

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
          <Link href="/panel/projekty" className="crm-back-link">
            <ChevronLeft size={13} />
            Projekty
          </Link>
          <h1 className="crm-page-title">Nowy projekt</h1>
          <p className="crm-page-desc">Utwórz realizację i śledź jej postęp</p>
        </div>
      </div>

      <div className="crm-form-wrap">
        <ProjectForm
          action={createProjectAction}
          submitLabel="Utwórz projekt"
          clients={clientOptions}
          estimates={estimateOptions}
        />
      </div>
    </>
  );
}
