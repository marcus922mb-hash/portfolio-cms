import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { createDemoAction } from "@/features/demos/actions/demo-actions";
import { DemoForm } from "@/features/demos/components/demo-form";
import { getClients } from "@/features/clients/queries/client-queries";
import { getEstimates } from "@/features/estimates/queries/estimate-queries";
import { getClientDisplayName } from "@/features/clients/types";
import { getEstimateClientLabel, WEBSITE_TYPE_LABELS } from "@/features/estimates/types";
import type { ClientOption, EstimateOption } from "@/features/demos/types";

export const metadata: Metadata = { title: "Nowe demo" };

type Props = {
  searchParams: Promise<{ client?: string; estimate?: string }>;
};

export default async function NoweDemoPage({ searchParams }: Props) {
  const { client, estimate } = await searchParams;
  const [{ data: clients }, { data: estimates }] = await Promise.all([
    getClients(),
    getEstimates(),
  ]);

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

  const initialEstimate = estimates?.find((item) => item.id === estimate);

  return (
    <>
      <div className="crm-page-header">
        <div>
          <Link href="/panel/demo" className="crm-back-link">
            <ChevronLeft size={13} />
            Demo
          </Link>
          <h1 className="crm-page-title">Nowe demo</h1>
          <p className="crm-page-desc">Utwórz ręcznie wypełniony podgląd strony dla klienta</p>
        </div>
      </div>

      <DemoForm
        action={createDemoAction}
        clients={clientOptions}
        estimates={estimateOptions}
        initialClientId={client ?? initialEstimate?.client_id ?? undefined}
        initialEstimateId={estimate}
        submitLabel="Utwórz demo"
      />
    </>
  );
}
