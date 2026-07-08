import type { Metadata } from "next";
import Link from "next/link";
import { UserPlus, Users } from "lucide-react";
import { getClients } from "@/features/clients/queries/client-queries";
import { ClientTable } from "@/features/clients/components/client-table";
import { ClientFiltersBar } from "@/features/clients/components/client-filters-bar";
import { EmptyState } from "@/components/panel/empty-state";
import { Suspense } from "react";

export const metadata: Metadata = { title: "Klienci" };

type Props = {
  searchParams: Promise<{ q?: string; status?: string }>;
};

async function ClientsList({ q, status }: { q?: string; status?: string }) {
  const { data: clients, error } = await getClients({ q, status });

  if (error) {
    return (
      <div className="panel-error">
        <p>Nie udało się załadować klientów. Spróbuj ponownie.</p>
      </div>
    );
  }

  if (clients.length === 0) {
    return (
      <EmptyState
        icon={<Users size={40} strokeWidth={1.2} />}
        title={q || status ? "Brak wyników" : "Nie masz jeszcze żadnych klientów"}
        description={
          q || status
            ? "Zmień kryteria wyszukiwania lub wyczyść filtry."
            : "Dodaj pierwszego klienta, aby rozpocząć pracę z CRM."
        }
        action={
          !q && !status ? (
            <Link href="/panel/klienci/nowy" className="crm-btn crm-btn--primary crm-btn--sm">
              <UserPlus size={13} />
              Dodaj klienta
            </Link>
          ) : undefined
        }
      />
    );
  }

  return <ClientTable clients={clients} />;
}

export default async function PanelKlienciPage({ searchParams }: Props) {
  const { q, status } = await searchParams;

  return (
    <>
      <div className="crm-page-header">
        <div>
          <h1 className="crm-page-title">Klienci</h1>
          <p className="crm-page-desc">Baza klientów i leadów</p>
        </div>
        <Link href="/panel/klienci/nowy" className="crm-btn crm-btn--primary">
          <UserPlus size={14} />
          Dodaj klienta
        </Link>
      </div>

      <Suspense fallback={null}>
        <ClientFiltersBar q={q} status={status} />
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
        <ClientsList q={q} status={status} />
      </Suspense>
    </>
  );
}
