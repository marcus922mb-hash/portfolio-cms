import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { getClients } from "@/features/clients/queries/client-queries";
import { createEstimateAction } from "@/features/estimates/actions/estimate-actions";
import { EstimateForm } from "@/features/estimates/components/estimate-form";
import { getClientDisplayName } from "@/features/clients/types";
import type { ClientSelectOption } from "@/features/estimates/types";

export const metadata: Metadata = { title: "Nowa wycena" };

export default async function NowaWycenaPage() {
  const { data: clients } = await getClients();

  const clientOptions: ClientSelectOption[] = (clients ?? []).map((c) => ({
    id: c.id,
    label: getClientDisplayName(c),
  }));

  return (
    <>
      <div className="crm-page-header">
        <div>
          <Link href="/panel/wyceny" className="crm-back-link">
            <ChevronLeft size={14} />
            Wyceny
          </Link>
          <h1 className="crm-page-title" style={{ marginTop: ".4rem" }}>Nowa wycena</h1>
          <p className="crm-page-desc">Wypełnij formularz i wylicz orientacyjną cenę</p>
        </div>
      </div>

      <EstimateForm
        action={createEstimateAction}
        clients={clientOptions}
        submitLabel="Utwórz wycenę"
      />
    </>
  );
}
