import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { updateDemoAction } from "@/features/demos/actions/demo-actions";
import { DemoForm } from "@/features/demos/components/demo-form";
import { getDemoById } from "@/features/demos/queries/demo-queries";
import { getClients } from "@/features/clients/queries/client-queries";
import { getEstimates } from "@/features/estimates/queries/estimate-queries";
import { getClientDisplayName } from "@/features/clients/types";
import { getEstimateClientLabel, WEBSITE_TYPE_LABELS } from "@/features/estimates/types";
import type { ClientOption, EstimateOption } from "@/features/demos/types";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const { data } = await getDemoById(id);
  return { title: data ? `Edytuj — ${data.title}` : "Demo nie znalezione" };
}

export default async function EdytujDemoPage({ params }: Props) {
  const { id } = await params;
  const [{ data: demo }, { data: clients }, { data: estimates }] = await Promise.all([
    getDemoById(id),
    getClients(),
    getEstimates(),
  ]);

  if (!demo) notFound();

  const clientOptions: ClientOption[] = (clients ?? []).map((item) => ({
    id: item.id,
    label: getClientDisplayName(item),
    companyName: item.company_name ?? "",
  }));
  const estimateOptions: EstimateOption[] = (estimates ?? []).map((item) => ({
    id: item.id,
    client_id: item.client_id,
    label: `${WEBSITE_TYPE_LABELS[item.website_type] ?? item.website_type} · ${getEstimateClientLabel(item)}`,
  }));
  const boundAction = updateDemoAction.bind(null, demo.id);

  return (
    <>
      <div className="crm-page-header">
        <div>
          <Link href={`/panel/demo/${demo.id}`} className="crm-back-link">
            <ChevronLeft size={13} />
            Szczegóły demo
          </Link>
          <h1 className="crm-page-title">Edytuj demo</h1>
          <p className="crm-page-desc">Zmień treści, status i ustawienia publikacji</p>
        </div>
      </div>

      <DemoForm
        action={boundAction}
        clients={clientOptions}
        estimates={estimateOptions}
        defaultValues={demo}
        submitLabel="Zapisz zmiany"
      />
    </>
  );
}
