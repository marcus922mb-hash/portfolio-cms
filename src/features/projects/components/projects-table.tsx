import Link from "next/link";
import { Calendar, ChevronRight } from "lucide-react";
import { ProjectStatusBadge } from "./project-status-badge";
import type { Project } from "@/features/projects/types";

function fmt(date: string | null) {
  if (!date) return null;
  return new Intl.DateTimeFormat("pl-PL", { dateStyle: "short" }).format(new Date(date));
}

function deadlineDays(deadline: string | null) {
  if (!deadline) return null;
  return Math.ceil((new Date(deadline).getTime() - Date.now()) / 86400000);
}

export function ProjectsTable({ projects }: { projects: Project[] }) {
  if (projects.length === 0) {
    return (
      <div className="crm-empty-state">
        <p className="crm-placeholder-text">Brak projektów spełniających kryteria.</p>
      </div>
    );
  }

  return (
    <div className="crm-table-wrap">
      <table className="crm-table">
        <thead>
          <tr>
            <th>Projekt</th>
            <th>Status</th>
            <th className="crm-th-hide-md">Technologia</th>
            <th>Termin</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {projects.map((project) => {
            const days = deadlineDays(project.deadline);
            const deadlineColor =
              days === null ? undefined :
              days < 0 ? "#e05555" :
              days <= 7 ? "#c9a46e" : undefined;

            return (
              <tr key={project.id} className="crm-table-row">
                <td>
                  <Link href={`/panel/projekty/${project.id}`} className="crm-table-link">
                    {project.name}
                  </Link>
                  <div className="crm-td-muted" style={{ fontSize: ".62rem" }}>
                    {new Date(project.created_at).toLocaleDateString("pl-PL")}
                  </div>
                </td>
                <td>
                  <ProjectStatusBadge status={project.status} />
                </td>
                <td className="crm-th-hide-md crm-td-muted">
                  {project.technology ?? "—"}
                </td>
                <td>
                  {project.deadline ? (
                    <span style={{ color: deadlineColor, display: "flex", alignItems: "center", gap: ".3rem", fontSize: ".72rem" }}>
                      <Calendar size={11} />
                      {fmt(project.deadline)}
                      {days !== null && days <= 7 && (
                        <span style={{ opacity: .7, fontSize: ".6rem" }}>
                          ({days < 0 ? "po terminie" : days === 0 ? "dziś" : `${days}d`})
                        </span>
                      )}
                    </span>
                  ) : (
                    <span className="crm-td-muted">—</span>
                  )}
                </td>
                <td style={{ textAlign: "right" }}>
                  <Link href={`/panel/projekty/${project.id}`} className="crm-icon-btn" aria-label="Szczegóły">
                    <ChevronRight size={14} />
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
