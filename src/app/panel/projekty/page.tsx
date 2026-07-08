import type { Metadata } from "next";
import Link from "next/link";
import { FolderPlus } from "lucide-react";
import { getProjects } from "@/features/projects/queries/project-queries";
import { ProjectsTable } from "@/features/projects/components/projects-table";
import { PROJECT_STATUSES, PROJECT_STATUS_LABELS } from "@/features/projects/types";

export const metadata: Metadata = { title: "Projekty" };

type Props = {
  searchParams: Promise<{ q?: string; status?: string }>;
};

export default async function PanelProjektyPage({ searchParams }: Props) {
  const { q, status } = await searchParams;
  const { data: projects, error } = await getProjects({ q, status });

  return (
    <>
      <div className="crm-page-header">
        <div>
          <h1 className="crm-page-title">Projekty</h1>
          <p className="crm-page-desc">Aktywne realizacje i harmonogramy</p>
        </div>
        <Link href="/panel/projekty/nowy" className="crm-btn crm-btn--primary crm-btn--sm">
          <FolderPlus size={13} />
          Nowy projekt
        </Link>
      </div>

      {/* Filtry */}
      <form method="get" className="crm-filters-bar">
        <input
          className="crm-input crm-filters-search"
          name="q"
          defaultValue={q ?? ""}
          placeholder="Szukaj projektu…"
        />
        <select className="crm-select crm-filters-select" name="status" defaultValue={status ?? ""}>
          <option value="">Wszystkie statusy</option>
          {PROJECT_STATUSES.map((s) => (
            <option key={s} value={s}>{PROJECT_STATUS_LABELS[s]}</option>
          ))}
        </select>
        <button type="submit" className="crm-btn crm-btn--sm">Szukaj</button>
        {(q || status) && (
          <Link href="/panel/projekty" className="crm-btn crm-btn--sm crm-btn--ghost">Wyczyść</Link>
        )}
      </form>

      {error ? (
        <div className="panel-error"><p>Nie udało się załadować projektów.</p></div>
      ) : (
        <div className="panel-card">
          <div className="panel-card-body" style={{ padding: 0 }}>
            <ProjectsTable projects={projects} />
          </div>
        </div>
      )}
    </>
  );
}
