"use client";

import Link from "next/link";
import { Eye, Pencil } from "lucide-react";
import { ClientStatusBadge } from "./client-status-badge";
import { getClientDisplayName } from "@/features/clients/types";
import type { Client } from "@/features/clients/types";

type Props = {
  clients: Client[];
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("pl-PL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function ClientTable({ clients }: Props) {
  return (
    <div className="crm-table-wrap">
      <table className="crm-table">
        <thead>
          <tr>
            <th>Firma</th>
            <th>Kontakt</th>
            <th className="crm-th-hide-sm">E-mail</th>
            <th className="crm-th-hide-md">Telefon</th>
            <th className="crm-th-hide-md">Branża</th>
            <th className="crm-th-hide-lg">Miasto</th>
            <th>Status</th>
            <th className="crm-th-hide-md">Dodano</th>
            <th className="crm-th-actions">Akcje</th>
          </tr>
        </thead>
        <tbody>
          {clients.map((client) => (
            <tr key={client.id} className="crm-table-row">
              <td>
                <span className="crm-td-company">
                  {client.company_name || "—"}
                </span>
              </td>
              <td>
                <Link href={`/panel/klienci/${client.id}`} className="crm-td-name">
                  {getClientDisplayName(client)}
                </Link>
              </td>
              <td className="crm-th-hide-sm crm-td-muted">{client.email || "—"}</td>
              <td className="crm-th-hide-md crm-td-muted">{client.phone || "—"}</td>
              <td className="crm-th-hide-md crm-td-muted">{client.industry || "—"}</td>
              <td className="crm-th-hide-lg crm-td-muted">{client.city || "—"}</td>
              <td>
                <ClientStatusBadge status={client.status} />
              </td>
              <td className="crm-th-hide-md crm-td-muted">{formatDate(client.created_at)}</td>
              <td>
                <div className="crm-row-actions">
                  <Link
                    href={`/panel/klienci/${client.id}`}
                    className="crm-action-btn"
                    title="Podgląd"
                  >
                    <Eye size={13} />
                  </Link>
                  <Link
                    href={`/panel/klienci/${client.id}/edytuj`}
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
