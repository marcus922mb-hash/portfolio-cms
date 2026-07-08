import type { Metadata } from "next";
import Link from "next/link";
import { PlusCircle, ShoppingBag } from "lucide-react";
import { EmptyState } from "@/components/panel/empty-state";
import { WooCommerceConnectionsTable } from "@/features/woocommerce/components/woocommerce-connections-table";
import { getWooCommerceConnections } from "@/features/woocommerce/queries/woocommerce-queries";

export const metadata: Metadata = { title: "WooCommerce" };

export default async function PanelWooCommerceConnectionsPage() {
  const { data: connections, error } = await getWooCommerceConnections();

  return (
    <>
      <div className="crm-page-header">
        <div>
          <h1 className="crm-page-title">WooCommerce</h1>
          <p className="crm-page-desc">Połączenia sklepów WooCommerce dla architektury headless</p>
        </div>
        <Link href="/panel/woocommerce/nowe" className="crm-btn crm-btn--primary">
          <PlusCircle size={14} />
          Nowe połączenie
        </Link>
      </div>

      {error ? (
        <div className="panel-error">
          <p>Nie udało się załadować połączeń WooCommerce. Spróbuj ponownie.</p>
        </div>
      ) : connections.length === 0 ? (
        <EmptyState
          icon={<ShoppingBag size={40} strokeWidth={1.2} />}
          title="Nie masz jeszcze połączeń WooCommerce."
          description="Dodaj pierwsze połączenie sklepu, aby testować API produktów i przygotować fundament pod frontend headless."
          action={
            <Link href="/panel/woocommerce/nowe" className="crm-btn crm-btn--primary crm-btn--sm">
              <PlusCircle size={13} />
              Dodaj WooCommerce
            </Link>
          }
        />
      ) : (
        <WooCommerceConnectionsTable connections={connections} />
      )}
    </>
  );
}
