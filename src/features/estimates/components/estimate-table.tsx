"use client";

import Link from "next/link";
import { Eye, Pencil } from "lucide-react";
import type { Estimate } from "@/features/estimates/types";
import { getEstimateClientLabel } from "@/features/estimates/types";
import { EstimateStatusBadge } from "./estimate-status-badge";
import { EstimateTypeBadge } from "./estimate-type-badge";

type Props = {
  estimates: Estimate[];
};

export function EstimateTable({ estimates }: Props) {
  return (
    <div className="crm-table-wrap">
      <table className="crm-table">
        <thead>
          <tr>
            <th>Klient</th>
            <th className="crm-th-hide-sm">Typ strony</th>
            <th className="crm-th-hide-md">Podstron</th>
            <th>Cena finalna</th>
            <th className="crm-th-hide-sm">Status</th>
            <th className="crm-th-hide-lg">Dodano</th>
            <th className="crm-th-actions">Akcje</th>
          </tr>
        </thead>
        <tbody>
          {estimates.map((estimate) => (
            <tr key={estimate.id} className="crm-table-row">
              <td>
                <Link href={`/panel/wyceny/${estimate.id}`} className="crm-td-name">
                  {getEstimateClientLabel(estimate)}
                </Link>
              </td>
              <td className="crm-th-hide-sm">
                <EstimateTypeBadge type={estimate.website_type} />
              </td>
              <td className="crm-th-hide-md crm-td-muted">
                {estimate.pages_count ?? "—"}
              </td>
              <td>
                <strong className="est-price-cell">
                  {estimate.final_price != null
                    ? `${Number(estimate.final_price).toLocaleString("pl-PL")} zł`
                    : "—"}
                </strong>
              </td>
              <td className="crm-th-hide-sm">
                <EstimateStatusBadge status={estimate.status} />
              </td>
              <td className="crm-th-hide-lg crm-td-muted">
                {new Date(estimate.created_at).toLocaleDateString("pl-PL")}
              </td>
              <td>
                <div className="crm-row-actions">
                  <Link
                    href={`/panel/wyceny/${estimate.id}`}
                    className="crm-action-btn"
                    title="Szczegóły"
                  >
                    <Eye size={14} />
                  </Link>
                  <Link
                    href={`/panel/wyceny/${estimate.id}/edytuj`}
                    className="crm-action-btn"
                    title="Edytuj"
                  >
                    <Pencil size={14} />
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
