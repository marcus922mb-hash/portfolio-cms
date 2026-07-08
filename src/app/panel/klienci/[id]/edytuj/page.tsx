import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { getClientById } from "@/features/clients/queries/client-queries";
import { ClientForm } from "@/features/clients/components/client-form";
import { updateClientAction } from "@/features/clients/actions/client-actions";
import { getClientDisplayName } from "@/features/clients/types";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const { data } = await getClientById(id);
  if (!data) return { title: "Klient nie znaleziony" };
  return { title: `Edytuj — ${getClientDisplayName(data)}` };
}

export default async function EdytujKlientaPage({ params }: Props) {
  const { id } = await params;
  const { data: client, error } = await getClientById(id);

  if (error || !client) {
    notFound();
  }

  const boundAction = updateClientAction.bind(null, client.id);

  return (
    <>
      <div className="crm-page-header">
        <div>
          <Link href={`/panel/klienci/${client.id}`} className="crm-back-link">
            <ChevronLeft size={13} />
            {getClientDisplayName(client)}
          </Link>
          <h1 className="crm-page-title">Edytuj klienta</h1>
          <p className="crm-page-desc">Zaktualizuj dane klienta</p>
        </div>
      </div>

      <div className="crm-form-wrap">
        <ClientForm
          action={boundAction}
          defaultValues={client}
          submitLabel="Zapisz zmiany"
        />
      </div>
    </>
  );
}
