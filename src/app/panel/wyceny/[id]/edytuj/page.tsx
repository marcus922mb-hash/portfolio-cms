import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { getEstimateById } from "@/features/estimates/queries/estimate-queries";
import { getClients } from "@/features/clients/queries/client-queries";
import { updateEstimateAction } from "@/features/estimates/actions/estimate-actions";
import { EstimateForm } from "@/features/estimates/components/estimate-form";
import { getClientDisplayName } from "@/features/clients/types";
import type { ClientSelectOption } from "@/features/estimates/types";

export const metadata: Metadata = { title: "Edytuj wycenę" };

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EdytujWycenePage({ params }: Props) {
  const { id } = await params;

  const [{ data: estimate }, { data: clients }] = await Promise.all([
    getEstimateById(id),
    getClients(),
  ]);

  if (!estimate) notFound();

  const clientOptions: ClientSelectOption[] = (clients ?? []).map((c) => ({
    id: c.id,
    label: getClientDisplayName(c),
  }));

  const boundAction = updateEstimateAction.bind(null, estimate.id);

  return (
    <>
      <div className="crm-page-header">
        <div>
          <Link href={`/panel/wyceny/${estimate.id}`} className="crm-back-link">
            <ChevronLeft size={14} />
            Szczegóły wyceny
          </Link>
          <h1 className="crm-page-title" style={{ marginTop: ".4rem" }}>Edytuj wycenę</h1>
          <p className="crm-page-desc">Zmiany zostaną zapisane w historii aktywności</p>
        </div>
      </div>

      <EstimateForm
        action={boundAction}
        clients={clientOptions}
        defaultValues={estimate}
        submitLabel="Zapisz zmiany"
      />
    </>
  );
}
