import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { notFound } from "next/navigation";
import {
  getWooCommerceConnectionActivity,
  getWooCommerceConnectionById,
  getWooCommerceConnectionRawById,
} from "@/features/woocommerce/queries/woocommerce-queries";
import { WooCommerceConnectionDetails } from "@/features/woocommerce/components/woocommerce-connection-details";
import { decryptWooCommerceSecret, testWooCommerceConnection } from "@/lib/woocommerce/client";
import type { WooCommerceConnectionPreview } from "@/features/woocommerce/types";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const { data } = await getWooCommerceConnectionById(id);
  if (!data) return { title: "Połączenie WooCommerce nie znalezione" };
  return { title: data.name };
}

export default async function WooCommerceConnectionDetailsPage({ params }: Props) {
  const { id } = await params;

  const [{ data: connection, error }, { data: activity }, { data: rawConnection }] = await Promise.all([
    getWooCommerceConnectionById(id),
    getWooCommerceConnectionActivity(id),
    getWooCommerceConnectionRawById(id),
  ]);

  if (error || !connection || !rawConnection) {
    notFound();
  }

  let preview: WooCommerceConnectionPreview | null = null;
  let previewError: string | null = null;
  const hasConsumerKey = Boolean(rawConnection.consumer_key_encrypted);
  const hasConsumerSecret = Boolean(rawConnection.consumer_secret_encrypted);

  if (hasConsumerKey && hasConsumerSecret) {
    try {
      preview = await testWooCommerceConnection({
        storeUrl: rawConnection.store_url,
        consumerKey: decryptWooCommerceSecret(rawConnection.consumer_key_encrypted),
        consumerSecret: decryptWooCommerceSecret(rawConnection.consumer_secret_encrypted),
      });
    } catch (error) {
      previewError = error instanceof Error ? error.message : "Nie udało się pobrać podglądu sklepu.";
    }
  } else {
    previewError = "Brakuje pełnych danych API WooCommerce do pobrania podglądu sklepu.";
  }

  return (
    <>
      <div className="crm-page-header">
        <div>
          <Link href="/panel/woocommerce/polaczenia" className="crm-back-link">
            <ChevronLeft size={13} />
            WooCommerce
          </Link>
          <h1 className="crm-page-title">{connection.name}</h1>
          <p className="crm-page-desc">{connection.store_url}</p>
        </div>
      </div>

      <WooCommerceConnectionDetails
        connection={{
          ...connection,
          consumer_key_encrypted: null,
          consumer_secret_encrypted: null,
        }}
        activity={activity}
        preview={preview}
        previewError={previewError}
        hasConsumerKey={hasConsumerKey}
        hasConsumerSecret={hasConsumerSecret}
      />
    </>
  );
}
