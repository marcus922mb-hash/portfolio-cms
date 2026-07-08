import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { getWordPressConnections } from "@/features/wordpress/queries/wordpress-queries";
import { WordPressConnectionsTable } from "@/features/wordpress/components/wordpress-connections-table";
import { EmptyState } from "@/components/panel/empty-state";
import { WrapText } from "lucide-react";

export const metadata: Metadata = { title: "Połączenia WordPress" };

export default async function PanelWordPressPolaczeniaPage() {
  const { data: connections, error } = await getWordPressConnections();

  return (
    <>
      <div className="crm-page-header">
        <div>
          <h1 className="crm-page-title">Połączenia WordPress</h1>
          <p className="crm-page-desc">Wszystkie zarządzane witryny WordPress</p>
        </div>
        <div className="crm-page-header-actions">
          <Link href="/panel/wordpress/nowe" className="crm-btn crm-btn--primary crm-btn--sm">
            <Plus size={13} />
            Nowe połączenie
          </Link>
        </div>
      </div>

      {error ? (
        <div className="panel-error">
          <p>Nie udało się załadować połączeń. Spróbuj ponownie.</p>
        </div>
      ) : connections.length === 0 ? (
        <EmptyState
          icon={<WrapText size={40} strokeWidth={1.2} />}
          title="Brak połączeń WordPress"
          description="Dodaj pierwsze połączenie z witryną WordPress."
          action={
            <Link href="/panel/wordpress/nowe" className="crm-btn crm-btn--primary crm-btn--sm">
              <Plus size={13} />
              Dodaj połączenie
            </Link>
          }
        />
      ) : (
        <WordPressConnectionsTable connections={connections} />
      )}
    </>
  );
}
