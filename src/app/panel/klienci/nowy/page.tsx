import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { ClientForm } from "@/features/clients/components/client-form";
import { createClientAction } from "@/features/clients/actions/client-actions";

export const metadata: Metadata = { title: "Nowy klient" };

export default function NowyKlientPage() {
  return (
    <>
      <div className="crm-page-header">
        <div>
          <Link href="/panel/klienci" className="crm-back-link">
            <ChevronLeft size={13} />
            Klienci
          </Link>
          <h1 className="crm-page-title">Nowy klient</h1>
          <p className="crm-page-desc">Dodaj klienta lub lead do bazy CRM</p>
        </div>
      </div>

      <div className="crm-form-wrap">
        <ClientForm action={createClientAction} submitLabel="Dodaj klienta" />
      </div>
    </>
  );
}
