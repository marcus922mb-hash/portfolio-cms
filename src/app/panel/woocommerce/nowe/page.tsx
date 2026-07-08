import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { getClients } from "@/features/clients/queries/client-queries";
import { getClientDisplayName } from "@/features/clients/types";
import { createWooCommerceConnectionAction } from "@/features/woocommerce/actions/woocommerce-actions";
import { WooCommerceConnectionForm } from "@/features/woocommerce/components/woocommerce-connection-form";
import { getWordPressConnectionOptions } from "@/features/woocommerce/queries/woocommerce-queries";
import type { ClientOption } from "@/features/demos/types";

export const metadata: Metadata = { title: "Nowe połączenie WooCommerce" };

type Props = {
  searchParams: Promise<{ client?: string }>;
};

export default async function NowePolaczenieWooCommercePage({ searchParams }: Props) {
  const { client: initialClientId } = await searchParams;
  const [{ data: allClients }, { data: wordpressConnections }] = await Promise.all([
    getClients(),
    getWordPressConnectionOptions(),
  ]);

  const clientOptions: ClientOption[] = (allClients ?? []).map((client) => ({
    id: client.id,
    label: getClientDisplayName(client),
    companyName: client.company_name ?? "",
  }));

  return (
    <>
      <div className="crm-page-header">
        <div>
          <Link href="/panel/woocommerce/polaczenia" className="crm-back-link">
            <ChevronLeft size={13} />
            WooCommerce
          </Link>
          <h1 className="crm-page-title">Nowe połączenie WooCommerce</h1>
          <p className="crm-page-desc">Dodaj połączenie sklepu i przygotuj fundament pod frontend headless</p>
        </div>
      </div>

      <WooCommerceConnectionForm
        action={createWooCommerceConnectionAction}
        clients={clientOptions}
        wordpressConnections={wordpressConnections}
        initialClientId={initialClientId}
      />
    </>
  );
}
