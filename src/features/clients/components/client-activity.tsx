import { Activity } from "lucide-react";
import type { ClientActivity } from "@/features/clients/types";

type Props = {
  activity: ClientActivity[];
};

const ACTION_LABELS: Record<string, string> = {
  created: "Dodano klienta",
  updated: "Zaktualizowano dane",
  status_changed: "Zmieniono status",
  note_added: "Dodano notatkę",
};

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("pl-PL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function ClientActivityLog({ activity }: Props) {
  return (
    <div className="panel-card">
      <div className="panel-card-header">
        <span className="panel-card-title">
          <Activity size={12} style={{ display: "inline", marginRight: ".35rem" }} />
          Historia aktywności
        </span>
        <span className="crm-note-count">{activity.length}</span>
      </div>
      <div className="panel-card-body">
        {activity.length === 0 ? (
          <p className="crm-placeholder-text">Brak wpisów w historii.</p>
        ) : (
          <div className="crm-activity-list">
            {activity.map((entry) => (
              <div key={entry.id} className="crm-activity-item">
                <div className="crm-activity-dot" />
                <div className="crm-activity-body">
                  <p className="crm-activity-label">
                    {ACTION_LABELS[entry.action] ?? entry.action}
                    {entry.description && (
                      <span className="crm-activity-desc"> — {entry.description}</span>
                    )}
                  </p>
                  <span className="crm-activity-time">
                    {formatDateTime(entry.created_at)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
