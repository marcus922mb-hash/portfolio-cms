import type { Metadata } from "next";
import Link from "next/link";
import { Calculator, PlusCircle } from "lucide-react";
import { Suspense } from "react";
import { getEstimates } from "@/features/estimates/queries/estimate-queries";
import { EstimateTable } from "@/features/estimates/components/estimate-table";
import { EstimateFiltersBar } from "@/features/estimates/components/estimate-filters-bar";
import { EmptyState } from "@/components/panel/empty-state";

export const metadata: Metadata = { title: "Wyceny" };

type Props = {
  searchParams: Promise<{ q?: string; status?: string; type?: string }>;
};

async function EstimatesList({
  q,
  status,
  type,
}: {
  q?: string;
  status?: string;
  type?: string;
}) {
  const { data: estimates, error } = await getEstimates({ q, status, type });

  if (error) {
    return (
      <div className="panel-error">
        <p>Nie udało się załadować wycen. Spróbuj ponownie.</p>
      </div>
    );
  }

  if (estimates.length === 0) {
    return (
      <EmptyState
        icon={<Calculator size={40} strokeWidth={1.2} />}
        title={q || status || type ? "Brak wyników" : "Nie masz jeszcze żadnych wycen"}
        description={
          q || status || type
            ? "Zmień kryteria wyszukiwania lub wyczyść filtry."
            : "Utwórz pierwszą wycenę dla klienta."
        }
        action={
          !q && !status && !type ? (
            <Link href="/panel/wyceny/nowa" className="crm-btn crm-btn--primary crm-btn--sm">
              <PlusCircle size={13} />
              Nowa wycena
            </Link>
          ) : undefined
        }
      />
    );
  }

  return <EstimateTable estimates={estimates} />;
}

export default async function PanelWycenyPage({ searchParams }: Props) {
  const { q, status, type } = await searchParams;

  return (
    <>
      <div className="crm-page-header">
        <div>
          <h1 className="crm-page-title">Wyceny</h1>
          <p className="crm-page-desc">Kalkulacje i oferty dla klientów</p>
        </div>
        <Link href="/panel/wyceny/nowa" className="crm-btn crm-btn--primary">
          <PlusCircle size={14} />
          Nowa wycena
        </Link>
      </div>

      <Suspense fallback={null}>
        <EstimateFiltersBar q={q} status={status} type={type} />
      </Suspense>

      <Suspense
        fallback={
          <div className="crm-skeleton-table">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="panel-skeleton crm-skeleton-row" />
            ))}
          </div>
        }
      >
        <EstimatesList q={q} status={status} type={type} />
      </Suspense>
    </>
  );
}
