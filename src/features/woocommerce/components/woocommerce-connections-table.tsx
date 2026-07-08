import Link from "next/link";
import { ExternalLink, Eye } from "lucide-react";
import { getWooCommerceClientLabel, type WooCommerceConnection } from "@/features/woocommerce/types";
import { WooCommerceStatusBadge } from "@/features/woocommerce/components/woocommerce-status-badge";

function formatDate(value: string | null) {
  return value ? new Date(value).toLocaleString("pl-PL") : "—";
}

export function WooCommerceConnectionsTable({ connections }: { connections: WooCommerceConnection[] }) {
  return (
    <div className="crm-table-wrap">
      <table className="crm-table">
        <thead>
          <tr>
            <th>Nazwa sklepu</th>
            <th>Klient</th>
            <th className="crm-th-hide-md">Store URL</th>
            <th>Status</th>
            <th className="crm-th-hide-sm">Ostatni test</th>
            <th className="crm-th-hide-lg">Produkty</th>
            <th className="crm-th-actions">Akcje</th>
          </tr>
        </thead>
        <tbody>
          {connections.map((connection) => (
            <tr key={connection.id} className="crm-table-row">
              <td>
                <Link href={`/panel/woocommerce/${connection.id}`} className="crm-td-name">
                  {connection.name}
                </Link>
              </td>
              <td className="crm-td-muted">{getWooCommerceClientLabel(connection.clients)}</td>
              <td className="crm-th-hide-md crm-td-muted">{connection.store_url}</td>
              <td><WooCommerceStatusBadge status={connection.status} /></td>
              <td className="crm-th-hide-sm crm-td-muted">{formatDate(connection.last_sync_at)}</td>
              <td className="crm-th-hide-lg crm-td-muted">{connection.last_product_count ?? "—"}</td>
              <td>
                <div className="crm-row-actions">
                  <Link href={`/panel/woocommerce/${connection.id}`} className="crm-action-btn" title="Szczegóły połączenia">
                    <Eye size={13} />
                  </Link>
                  <a href={connection.store_url} target="_blank" rel="noreferrer" className="crm-action-btn" title="Otwórz sklep">
                    <ExternalLink size={13} />
                  </a>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
