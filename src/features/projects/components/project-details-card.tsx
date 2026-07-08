"use client";

import { useActionState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Calendar, Code2, Pencil, Trash2, User } from "lucide-react";
import { ProjectStatusBadge } from "./project-status-badge";
import {
  PROJECT_STATUSES,
  PROJECT_STATUS_LABELS,
} from "@/features/projects/types";
import type { Project } from "@/features/projects/types";
import {
  updateProjectStatusAction,
  deleteProjectAction,
  type StatusActionState,
} from "@/features/projects/actions/project-actions";

function fmt(date: string | null) {
  if (!date) return "—";
  return new Intl.DateTimeFormat("pl-PL", { dateStyle: "medium" }).format(new Date(date));
}

function deadlineDays(deadline: string | null) {
  if (!deadline) return null;
  const diff = Math.ceil((new Date(deadline).getTime() - Date.now()) / 86400000);
  return diff;
}

function StatusSelector({ project }: { project: Project }) {
  const boundAction = updateProjectStatusAction.bind(null, project.id);
  const [state, formAction, isPending] = useActionState<StatusActionState, FormData>(
    boundAction,
    null
  );
  const router = useRouter();

  useEffect(() => {
    if (state?.success) router.refresh();
  }, [state, router]);

  return (
    <form action={formAction} className="crm-status-form">
      <select
        name="status"
        className="crm-select crm-select--inline"
        defaultValue={project.status}
        onChange={(e) => {
          const fd = new FormData();
          fd.set("status", e.target.value);
          formAction(fd);
        }}
        disabled={isPending}
      >
        {PROJECT_STATUSES.map((s) => (
          <option key={s} value={s}>{PROJECT_STATUS_LABELS[s]}</option>
        ))}
      </select>
    </form>
  );
}

export function ProjectDetailsCard({ project }: { project: Project }) {
  const days = deadlineDays(project.deadline);
  const deadlineColor =
    days === null ? undefined :
    days < 0 ? "#e05555" :
    days <= 7 ? "#c9a46e" : "#4caf7a";

  async function handleDelete() {
    if (!confirm("Czy na pewno chcesz usunąć ten projekt? Tej operacji nie można cofnąć.")) return;
    await deleteProjectAction(project.id);
  }

  return (
    <div className="crm-detail-layout">
      <div className="crm-detail-main">
        <div className="panel-card">
          <div className="panel-card-header">
            <span className="panel-card-title">Szczegóły projektu</span>
            <div style={{ display: "flex", gap: ".5rem" }}>
              <Link href={`/panel/projekty/${project.id}/edytuj`} className="crm-btn crm-btn--sm crm-btn--ghost">
                <Pencil size={12} />
                Edytuj
              </Link>
              <button
                type="button"
                onClick={handleDelete}
                className="crm-btn crm-btn--sm crm-btn--danger"
              >
                <Trash2 size={12} />
                Usuń
              </button>
            </div>
          </div>
          <div className="panel-card-body">
            <div className="crm-meta-list">
              <div className="crm-meta-item">
                <span className="crm-meta-label">Status</span>
                <span className="crm-meta-value">
                  <StatusSelector project={project} />
                </span>
              </div>
              {project.technology && (
                <div className="crm-meta-item">
                  <span className="crm-meta-label"><Code2 size={11} /> Technologia</span>
                  <span className="crm-meta-value">{project.technology}</span>
                </div>
              )}
              <div className="crm-meta-item">
                <span className="crm-meta-label"><Calendar size={11} /> Data rozpoczęcia</span>
                <span className="crm-meta-value">{fmt(project.start_date)}</span>
              </div>
              <div className="crm-meta-item">
                <span className="crm-meta-label"><Calendar size={11} /> Termin oddania</span>
                <span className="crm-meta-value" style={{ color: deadlineColor }}>
                  {fmt(project.deadline)}
                  {days !== null && (
                    <span style={{ fontSize: ".65rem", marginLeft: ".4rem", opacity: .7 }}>
                      ({days < 0 ? `${Math.abs(days)} dni po terminie` : days === 0 ? "dziś" : `${days} dni`})
                    </span>
                  )}
                </span>
              </div>
              <div className="crm-meta-item">
                <span className="crm-meta-label">Ostatnia aktualizacja</span>
                <span className="crm-meta-value crm-td-muted">
                  {new Date(project.updated_at).toLocaleString("pl-PL")}
                </span>
              </div>
            </div>

            {project.notes && (
              <div style={{ marginTop: "1.25rem", paddingTop: "1.25rem", borderTop: "1px solid rgba(255,255,255,.06)" }}>
                <p className="crm-meta-label" style={{ marginBottom: ".5rem" }}>Notatki</p>
                <p style={{ fontSize: ".78rem", color: "rgba(232,232,232,.7)", whiteSpace: "pre-wrap", lineHeight: 1.6 }}>
                  {project.notes}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="crm-detail-sidebar">
        <div className="panel-card">
          <div className="panel-card-header">
            <span className="panel-card-title">Powiązania</span>
          </div>
          <div className="panel-card-body crm-quick-actions">
            {project.client_id ? (
              <Link href={`/panel/klienci/${project.client_id}`} className="crm-action-link">
                <User size={13} />
                Otwórz klienta
              </Link>
            ) : (
              <span className="crm-meta-label">Brak powiązanego klienta</span>
            )}
            {project.estimate_id && (
              <Link href={`/panel/wyceny/${project.estimate_id}`} className="crm-action-link">
                Otwórz wycenę
              </Link>
            )}
            {project.demo_id && (
              <Link href={`/panel/demo/${project.demo_id}`} className="crm-action-link">
                Otwórz demo
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
