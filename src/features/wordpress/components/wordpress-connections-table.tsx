import Link from "next/link";
import { Eye, Pencil } from "lucide-react";
import type { WordPressConnection } from "@/features/wordpress/types";
import { getWPClientLabel } from "@/features/wordpress/types";
import { WordPressStatusBadge } from "./wordpress-status-badge";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("pl-PL");
}

export function WordPressConnectionsTable({ connections }: { connections: WordPressConnection[] }) {
  return (
    <div className="crm-table-wrap">
      <table className="crm-table">
        <thead>
          <tr>
            <th>Nazwa / URL</th>
            <th>Klient</th>
            <th>Status</th>
            <th className="crm-th-hide-md">Ostatni test</th>
            <th className="crm-th-hide-lg">Dodano</th>
            <th className="crm-th-actions">Akcje</th>
          </tr>
        </thead>
        <tbody>
          {connections.map((conn) => (
            <tr key={conn.id} className="crm-table-row">
              <td>
                <Link href={`/panel/wordpress/${conn.id}`} className="crm-td-name">
                  {conn.name || conn.site_url}
                </Link>
                <div className="crm-td-muted">{conn.site_url}</div>
              </td>
              <td className="crm-td-muted">{getWPClientLabel(conn.clients)}</td>
              <td>
                <WordPressStatusBadge status={conn.status} />
              </td>
              <td className="crm-th-hide-md crm-td-muted">
                {conn.last_sync_at ? formatDate(conn.last_sync_at) : "—"}
              </td>
              <td className="crm-th-hide-lg crm-td-muted">{formatDate(conn.created_at)}</td>
              <td>
                <div className="crm-row-actions">
                  <Link
                    href={`/panel/wordpress/${conn.id}`}
                    className="crm-action-btn"
                    title="Szczegóły"
                  >
                    <Eye size={13} />
                  </Link>
                  <Link
                    href={`/panel/wordpress/${conn.id}/edytuj`}
                    className="crm-action-btn"
                    title="Edytuj"
                  >
                    <Pencil size={13} />
                  </Link>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
