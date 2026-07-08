import type { Metadata } from "next";
import Link from "next/link";
import { Globe, PlusCircle } from "lucide-react";
import { Suspense } from "react";
import { EmptyState } from "@/components/panel/empty-state";
import { DemoFiltersBar } from "@/features/demos/components/demo-filters-bar";
import { DemoTable } from "@/features/demos/components/demo-table";
import { getDemos } from "@/features/demos/queries/demo-queries";

export const metadata: Metadata = { title: "Demo" };

type Props = {
  searchParams: Promise<{ q?: string; status?: string; industry?: string }>;
};

async function DemoList({ q, status, industry }: { q?: string; status?: string; industry?: string }) {
  const { data: demos, error } = await getDemos({ q, status, industry });

  if (error) {
    return (
      <div className="panel-error">
        <p>Nie udało się załadować demo. Spróbuj ponownie.</p>
      </div>
    );
  }

  if (demos.length === 0) {
    return (
      <EmptyState
        icon={<Globe size={40} strokeWidth={1.2} />}
        title={q || status || industry ? "Brak wyników" : "Nie masz jeszcze żadnych demo."}
        description={
          q || status || industry
            ? "Zmień kryteria wyszukiwania lub wyczyść filtry."
            : "Utwórz pierwsze demo dla klienta i wyślij mu profesjonalny podgląd strony."
        }
        action={
          !q && !status && !industry ? (
            <Link href="/panel/demo/nowe" className="crm-btn crm-btn--primary crm-btn--sm">
              <PlusCircle size={13} />
              Nowe demo
            </Link>
          ) : undefined
        }
      />
    );
  }

  return <DemoTable demos={demos} />;
}

export default async function PanelDemoPage({ searchParams }: Props) {
  const { q, status, industry } = await searchParams;

  return (
    <>
      <div className="crm-page-header">
        <div>
          <h1 className="crm-page-title">Demo</h1>
          <p className="crm-page-desc">Generator profesjonalnych podglądów stron dla klientów</p>
        </div>
        <Link href="/panel/demo/nowe" className="crm-btn crm-btn--primary">
          <PlusCircle size={14} />
          Nowe demo
        </Link>
      </div>

      <Suspense fallback={null}>
        <DemoFiltersBar q={q} status={status} industry={industry} />
      </Suspense>

      <Suspense
        fallback={
          <div className="crm-skeleton-table">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="panel-skeleton crm-skeleton-row" />
            ))}
          </div>
        }
      >
        <DemoList q={q} status={status} industry={industry} />
      </Suspense>
    </>
  );
}
