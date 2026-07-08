"use client";

import { useActionState, useMemo, useState } from "react";
import Link from "next/link";
import { AlertCircle, Loader2, PlusCircle, Server } from "lucide-react";
import type { ClientOption } from "@/features/demos/types";
import type { WooCommerceActionState } from "@/features/woocommerce/actions/woocommerce-actions";
import {
  WOOCOMMERCE_CONNECTION_STATUSES,
  WOOCOMMERCE_CONNECTION_STATUS_LABELS,
  type WordPressConnectionOption,
} from "@/features/woocommerce/types";

type Props = {
  action: (prevState: WooCommerceActionState, formData: FormData) => Promise<WooCommerceActionState>;
  clients: ClientOption[];
  wordpressConnections: WordPressConnectionOption[];
  initialClientId?: string;
};

function FieldError({ errors }: { errors?: string[] }) {
  if (!errors?.length) return null;
  return <span className="crm-field-error">{errors[0]}</span>;
}

export function WooCommerceConnectionForm({ action, clients, wordpressConnections, initialClientId = "" }: Props) {
  const [state, formAction, isPending] = useActionState<WooCommerceActionState, FormData>(action, null);
  const [clientId, setClientId] = useState(initialClientId);
  const fieldErrors = state?.fieldErrors ?? {};
  const noClients = clients.length === 0;

  const filteredWordPressConnections = useMemo(
    () => wordpressConnections.filter((item) => !clientId || item.client_id === clientId),
    [wordpressConnections, clientId]
  );

  return (
    <form action={formAction} className="crm-form-wrap">
      <div className="crm-form">
        {state?.error && !state.fieldErrors && (
          <div className="crm-form-alert" role="alert">
            <AlertCircle size={14} />
            {state.error}
          </div>
        )}

        <section className="crm-section">
          <h2 className="crm-section-title">1. Klient i powiązania</h2>
          {noClients ? (
            <div className="est-no-clients">
              <p>Najpierw dodaj klienta w CRM, aby utworzyć połączenie WooCommerce.</p>
              <Link href="/panel/klienci/nowy" className="crm-btn crm-btn--sm crm-btn--primary" style={{ marginTop: ".75rem" }}>
                <PlusCircle size={12} />
                Dodaj klienta
              </Link>
            </div>
          ) : (
            <div className="crm-grid crm-grid--2">
              <div className="crm-field">
                <label className="crm-label" htmlFor="client_id">Klient</label>
                <select id="client_id" name="client_id" className="crm-select" value={clientId} onChange={(event) => setClientId(event.target.value)}>
                  <option value="">— Wybierz klienta —</option>
                  {clients.map((client) => (
                    <option key={client.id} value={client.id}>{client.label}</option>
                  ))}
                </select>
                <FieldError errors={fieldErrors.client_id} />
              </div>

              <div className="crm-field">
                <label className="crm-label" htmlFor="wordpress_connection_id">Połączenie WordPress</label>
                <select id="wordpress_connection_id" name="wordpress_connection_id" className="crm-select" defaultValue="">
                  <option value="">— Bez powiązanego WordPress —</option>
                  {filteredWordPressConnections.map((connection) => (
                    <option key={connection.id} value={connection.id}>
                      {(connection.name || connection.site_url)} · {connection.status}
                    </option>
                  ))}
                </select>
                <p className="est-field-hint">Pole opcjonalne. Jeśli klient ma połączenie WordPress, możesz je przypisać do sklepu.</p>
              </div>
            </div>
          )}
        </section>

        <section className="crm-section">
          <h2 className="crm-section-title">2. Dane sklepu</h2>
          <div className="crm-grid crm-grid--2">
            <div className="crm-field">
              <label className="crm-label" htmlFor="name">Nazwa sklepu</label>
              <input id="name" name="name" className="crm-input" placeholder="np. Sklep MA Atelier" />
              <FieldError errors={fieldErrors.name} />
            </div>
            <div className="crm-field">
              <label className="crm-label" htmlFor="store_url">Store URL</label>
              <input id="store_url" name="store_url" className="crm-input" placeholder="https://sklep.example.com" />
              <FieldError errors={fieldErrors.store_url} />
            </div>
          </div>
        </section>

        <section className="crm-section">
          <h2 className="crm-section-title">3. Klucze WooCommerce</h2>
          <div className="crm-grid crm-grid--2">
            <div className="crm-field">
              <label className="crm-label" htmlFor="consumer_key">Consumer Key</label>
              <input id="consumer_key" name="consumer_key" className="crm-input" autoComplete="off" />
              <FieldError errors={fieldErrors.consumer_key} />
            </div>
            <div className="crm-field">
              <label className="crm-label" htmlFor="consumer_secret">Consumer Secret</label>
              <input id="consumer_secret" name="consumer_secret" type="password" className="crm-input" autoComplete="new-password" />
              <FieldError errors={fieldErrors.consumer_secret} />
            </div>
          </div>
          <p className="est-field-hint">Klucze są szyfrowane po stronie serwera. Sekrety nie będą widoczne w panelu.</p>
        </section>

        <section className="crm-section">
          <h2 className="crm-section-title">4. Status i notatki</h2>
          <div className="crm-grid crm-grid--2">
            <div className="crm-field">
              <label className="crm-label" htmlFor="status">Status</label>
              <select id="status" name="status" className="crm-select" defaultValue="draft">
                {WOOCOMMERCE_CONNECTION_STATUSES.map((status) => (
                  <option key={status} value={status}>{WOOCOMMERCE_CONNECTION_STATUS_LABELS[status]}</option>
                ))}
              </select>
              <FieldError errors={fieldErrors.status} />
            </div>
            <div className="crm-field">
              <label className="crm-label" htmlFor="notes">Notatki</label>
              <textarea id="notes" name="notes" rows={4} className="crm-textarea" placeholder="Dodatkowe informacje o sklepie, zakresie integracji, dostępie do API…" />
            </div>
          </div>
        </section>
      </div>

      <div className="crm-form-footer">
        <Link href="/panel/woocommerce/polaczenia" className="crm-btn">Anuluj</Link>
        <button type="submit" disabled={isPending || noClients} className="crm-btn crm-btn--primary">
          {isPending ? (
            <>
              <Loader2 size={13} className="est-spin" />
              Zapisywanie…
            </>
          ) : (
            <>
              <Server size={13} />
              Zapisz połączenie
            </>
          )}
        </button>
      </div>
    </form>
  );
}
