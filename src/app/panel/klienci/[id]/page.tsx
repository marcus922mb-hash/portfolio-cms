import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { notFound } from "next/navigation";
import {
  getClientById,
  getClientNotes,
  getClientActivity,
} from "@/features/clients/queries/client-queries";
import { getEstimatesByClientId } from "@/features/estimates/queries/estimate-queries";
import { getDemosByClientId } from "@/features/demos/queries/demo-queries";
import { getWooCommerceConnectionsByClientId } from "@/features/woocommerce/queries/woocommerce-queries";
import { getWordPressConnectionsByClientId } from "@/features/wordpress/queries/wordpress-queries";
import { ClientDetailsCard } from "@/features/clients/components/client-details-card";
import { ClientNotes } from "@/features/clients/components/client-notes";
import { ClientActivityLog } from "@/features/clients/components/client-activity";
import { getClientDisplayName } from "@/features/clients/types";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const { data } = await getClientById(id);
  if (!data) return { title: "Klient nie znaleziony" };
  return { title: getClientDisplayName(data) };
}

export default async function KlientDetailsPage({ params }: Props) {
  const { id } = await params;

  const [
    { data: client, error },
    { data: notes },
    { data: activity },
    { data: estimates },
    { data: demos },
    { data: wooCommerceConnections },
    { data: wordpressConnections },
  ] = await Promise.all([
    getClientById(id),
    getClientNotes(id),
    getClientActivity(id),
    getEstimatesByClientId(id),
    getDemosByClientId(id),
    getWooCommerceConnectionsByClientId(id),
    getWordPressConnectionsByClientId(id),
  ]);

  if (error || !client) {
    notFound();
  }

  return (
    <>
      <div className="crm-page-header">
        <div>
          <Link href="/panel/klienci" className="crm-back-link">
            <ChevronLeft size={13} />
            Klienci
          </Link>
          <h1 className="crm-page-title">{getClientDisplayName(client)}</h1>
          {client.company_name && (
            <p className="crm-page-desc">{client.company_name}</p>
          )}
        </div>
      </div>

      <ClientDetailsCard
        client={client}
        estimates={estimates ?? []}
        demos={demos ?? []}
        wooCommerceConnections={wooCommerceConnections ?? []}
        wordpressConnections={wordpressConnections ?? []}
      />

      <div className="crm-bottom-cards">
        <ClientNotes clientId={client.id} notes={notes} />
        <ClientActivityLog activity={activity} />
      </div>
    </>
  );
}
