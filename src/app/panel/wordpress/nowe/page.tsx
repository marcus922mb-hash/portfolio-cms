import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { createWordPressConnectionAction } from "@/features/wordpress/actions/wordpress-actions";
import { WordPressConnectionForm } from "@/features/wordpress/components/wordpress-connection-form";
import { getClients } from "@/features/clients/queries/client-queries";
import { isEncryptionAvailable } from "@/lib/wordpress/encryption";
import { getClientDisplayName } from "@/features/clients/types";

export const metadata: Metadata = { title: "Nowe połączenie WordPress" };

type Props = {
  searchParams: Promise<{ client?: string }>;
};

export default async function NowePołączenieWPPage({ searchParams }: Props) {
  const { client: preselectedClientId } = await searchParams;
  const { data: allClients } = await getClients();
  const encryptionAvailable = isEncryptionAvailable();

  const clientOptions = allClients.map((c) => ({
    id: c.id,
    label: getClientDisplayName(c),
  }));

  return (
    <>
      <div className="crm-page-header">
        <div>
          <Link href="/panel/wordpress" className="crm-back-link">
            <ChevronLeft size={13} />
            WordPress
          </Link>
          <h1 className="crm-page-title">Nowe połączenie WordPress</h1>
          <p className="crm-page-desc">Dodaj połączenie z witryną WordPress</p>
        </div>
      </div>

      <WordPressConnectionForm
        action={createWordPressConnectionAction}
        clients={clientOptions}
        encryptionAvailable={encryptionAvailable}
        submitLabel="Utwórz połączenie"
        preselectedClientId={preselectedClientId}
      />
    </>
  );
}
