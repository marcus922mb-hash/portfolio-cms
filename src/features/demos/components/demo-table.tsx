"use client";

import Link from "next/link";
import { ExternalLink, Eye, Pencil } from "lucide-react";
import type { Demo } from "@/features/demos/types";
import { getDemoClientLabel } from "@/features/demos/types";
import { DemoIndustryBadge } from "./demo-industry-badge";
import { DemoPublicLink } from "./demo-public-link";
import { DemoStatusBadge } from "./demo-status-badge";
import { DemoStyleBadge } from "./demo-style-badge";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("pl-PL");
}

export function DemoTable({ demos }: { demos: Demo[] }) {
  return (
    <div className="crm-table-wrap">
      <table className="crm-table">
        <thead>
          <tr>
            <th>Tytuł demo</th>
            <th>Klient</th>
            <th className="crm-th-hide-md">Branża</th>
            <th className="crm-th-hide-lg">Styl</th>
            <th>Status</th>
            <th>Aktywne</th>
            <th className="crm-th-hide-sm">Wejścia</th>
            <th className="crm-th-hide-lg">Dodano</th>
            <th className="crm-th-actions">Akcje</th>
          </tr>
        </thead>
        <tbody>
          {demos.map((demo) => (
            <tr key={demo.id} className="crm-table-row">
              <td>
                <Link href={`/panel/demo/${demo.id}`} className="crm-td-name">
                  {demo.title}
                </Link>
                <div className="crm-td-muted">/{demo.slug}</div>
              </td>
              <td className="crm-td-muted">{getDemoClientLabel(demo.clients)}</td>
              <td className="crm-th-hide-md"><DemoIndustryBadge industry={demo.industry} /></td>
              <td className="crm-th-hide-lg"><DemoStyleBadge style={demo.style} /></td>
              <td><DemoStatusBadge status={demo.status} /></td>
              <td>{demo.is_active ? <span className="demo-active-dot">Tak</span> : <span className="crm-td-muted">Nie</span>}</td>
              <td className="crm-th-hide-sm crm-td-muted">{demo.views_count}</td>
              <td className="crm-th-hide-lg crm-td-muted">{formatDate(demo.created_at)}</td>
              <td>
                <div className="crm-row-actions">
                  <Link href={`/panel/demo/${demo.id}`} className="crm-action-btn" title="Zobacz w panelu">
                    <Eye size={13} />
                  </Link>
                  <Link href={`/panel/demo/${demo.id}/edytuj`} className="crm-action-btn" title="Edytuj">
                    <Pencil size={13} />
                  </Link>
                  <a href={`/demo/${demo.slug}`} target="_blank" rel="noreferrer" className="crm-action-btn" title="Otwórz publiczne demo">
                    <ExternalLink size={13} />
                  </a>
                  <DemoPublicLink slug={demo.slug} compact />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
