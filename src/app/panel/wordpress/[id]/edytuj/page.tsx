import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { getWordPressConnectionById } from "@/features/wordpress/queries/wordpress-queries";
import { getClients } from "@/features/clients/queries/client-queries";
import { WordPressConnectionForm } from "@/features/wordpress/components/wordpress-connection-form";
import { updateWordPressConnectionAction } from "@/features/wordpress/actions/wordpress-actions";
import { isEncryptionAvailable } from "@/lib/wordpress/encryption";
import { getClientDisplayName } from "@/features/clients/types";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const { data } = await getWordPressConnectionById(id);
  if (!data) return { title: "Połączenie nie znalezione" };
  return { title: `Edytuj — ${data.name || data.site_url}` };
}

export default async function EdytujWPConnectionPage({ params }: Props) {
  const { id } = await params;

  const [{ data: connection, error }, { data: allClients }] = await Promise.all([
    getWordPressConnectionById(id),
    getClients(),
  ]);

  if (error || !connection) notFound();

  const boundAction = updateWordPressConnectionAction.bind(null, connection.id);
  const encryptionAvailable = isEncryptionAvailable();

  const clientOptions = allClients.map((c) => ({
    id: c.id,
    label: getClientDisplayName(c),
  }));

  return (
    <>
      <div className="crm-page-header">
        <div>
          <Link href={`/panel/wordpress/${connection.id}`} className="crm-back-link">
            <ChevronLeft size={13} />
            {connection.name || connection.site_url}
          </Link>
          <h1 className="crm-page-title">Edytuj połączenie WordPress</h1>
          <p className="crm-page-desc">{connection.site_url}</p>
        </div>
      </div>

      <WordPressConnectionForm
        action={boundAction}
        clients={clientOptions}
        defaultValues={connection}
        encryptionAvailable={encryptionAvailable}
        submitLabel="Zapisz zmiany"
      />
    </>
  );
}
