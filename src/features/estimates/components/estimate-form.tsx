"use client";

import { useState, useMemo, useActionState } from "react";
import Link from "next/link";
import { Loader2, AlertCircle, UserPlus, Check } from "lucide-react";
import { WEBSITE_TYPES, WEBSITE_TYPE_LABELS, BASE_PRICES, getPriceBreakdown, calculateBasePrice } from "@/config/pricing";
import { ESTIMATE_STATUSES, ESTIMATE_STATUS_LABELS } from "@/features/estimates/types";
import { EstimateCalculator } from "./estimate-calculator";
import type { Estimate, EstimateType, ClientSelectOption } from "@/features/estimates/types";
import type { EstimateActionState } from "@/features/estimates/actions/estimate-actions";

type AddonKey =
  | "needs_wordpress"
  | "needs_woocommerce"
  | "needs_nextjs"
  | "needs_seo"
  | "needs_ai"
  | "needs_copywriting"
  | "needs_branding"
  | "needs_maintenance";

type AddonState = Record<AddonKey, boolean>;

const ADDONS: { key: AddonKey; label: string; price: string }[] = [
  { key: "needs_wordpress",   label: "WordPress",          price: "+500 zł" },
  { key: "needs_woocommerce", label: "WooCommerce",         price: "+1 000 zł" },
  { key: "needs_nextjs",      label: "Next.js",             price: "+700 zł" },
  { key: "needs_seo",         label: "SEO",                 price: "+400 zł" },
  { key: "needs_ai",          label: "AI / chatbot",        price: "+800 zł" },
  { key: "needs_copywriting", label: "Copywriting",         price: "+500 zł" },
  { key: "needs_branding",    label: "Branding",            price: "+700 zł" },
  { key: "needs_maintenance", label: "Opieka techniczna",   price: "+300 zł" },
];

type Props = {
  action: (prevState: EstimateActionState, formData: FormData) => Promise<EstimateActionState>;
  clients: ClientSelectOption[];
  defaultValues?: Estimate;
  submitLabel?: string;
};

function FieldError({ errors }: { errors?: string[] }) {
  if (!errors?.length) return null;
  return <span className="crm-field-error">{errors[0]}</span>;
}

export function EstimateForm({ action, clients, defaultValues, submitLabel = "Zapisz" }: Props) {
  const [state, formAction, isPending] = useActionState<EstimateActionState, FormData>(action, null);

  const [websiteType, setWebsiteType] = useState<EstimateType>(
    defaultValues?.website_type ?? "landing_page"
  );
  const [pagesCount, setPagesCount] = useState<number>(
    defaultValues?.pages_count ?? 1
  );
  const [addons, setAddons] = useState<AddonState>({
    needs_wordpress:   defaultValues?.needs_wordpress   ?? false,
    needs_woocommerce: defaultValues?.needs_woocommerce ?? false,
    needs_nextjs:      defaultValues?.needs_nextjs       ?? false,
    needs_seo:         defaultValues?.needs_seo          ?? false,
    needs_ai:          defaultValues?.needs_ai           ?? false,
    needs_copywriting: defaultValues?.needs_copywriting  ?? false,
    needs_branding:    defaultValues?.needs_branding     ?? false,
    needs_maintenance: defaultValues?.needs_maintenance  ?? false,
  });

  const calcParams = useMemo(
    () => ({ website_type: websiteType, pages_count: pagesCount, ...addons }),
    [websiteType, pagesCount, addons]
  );
  const basePrice = useMemo(() => calculateBasePrice(calcParams), [calcParams]);
  const breakdown = useMemo(() => getPriceBreakdown(calcParams), [calcParams]);

  const [finalPrice, setFinalPrice] = useState<number>(
    defaultValues?.final_price ?? basePrice
  );
  const [finalPriceEdited, setFinalPriceEdited] = useState(
    defaultValues != null && defaultValues.final_price !== defaultValues.base_price
  );

  const displayedFinalPrice = finalPriceEdited ? finalPrice : basePrice;

  const toggleAddon = (key: AddonKey) => {
    setAddons((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const noClients = clients.length === 0;

  const fe = state?.fieldErrors ?? {};

  return (
    <form action={formAction} className="crm-form-wrap">
      <div className="crm-form">

        {state?.error && !state.fieldErrors && (
          <div className="crm-form-alert">
            <AlertCircle size={14} />
            {state.error}
          </div>
        )}

        {/* ── Sekcja 1: Klient ── */}
        <div className="crm-section">
          <h2 className="crm-section-title">1. Klient</h2>
          <div className="crm-field">
            <label className="crm-field-label" htmlFor="client_id">
              Klient <span className="crm-field-required">*</span>
            </label>
            {noClients ? (
              <div className="est-no-clients">
                <p>Najpierw dodaj klienta w CRM, aby utworzyć wycenę.</p>
                <Link href="/panel/klienci/nowy" className="crm-btn crm-btn--sm crm-btn--primary" style={{ display: "inline-flex", marginTop: ".75rem" }}>
                  <UserPlus size={12} />
                  Dodaj klienta
                </Link>
              </div>
            ) : (
              <select
                id="client_id"
                name="client_id"
                className="crm-select"
                defaultValue={defaultValues?.client_id ?? ""}
                disabled={noClients}
              >
                <option value="">— Wybierz klienta —</option>
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>
            )}
            <FieldError errors={fe.client_id} />
          </div>
        </div>

        {/* ── Sekcja 2: Typ strony ── */}
        <div className="crm-section">
          <h2 className="crm-section-title">2. Typ strony</h2>
          <input type="hidden" name="website_type" value={websiteType} />
          <div className="est-type-grid">
            {WEBSITE_TYPES.map((type) => {
              const active = websiteType === type;
              return (
                <button
                  key={type}
                  type="button"
                  className={`est-type-card${active ? " est-type-card--active" : ""}`}
                  onClick={() => setWebsiteType(type)}
                >
                  <span className="est-type-card-price">{BASE_PRICES[type].toLocaleString("pl-PL")} zł</span>
                  <span className="est-type-card-label">{WEBSITE_TYPE_LABELS[type]}</span>
                  {active && <Check size={12} className="est-type-card-check" />}
                </button>
              );
            })}
          </div>
          <FieldError errors={fe.website_type} />
        </div>

        {/* ── Sekcja 3: Zakres projektu ── */}
        <div className="crm-section">
          <h2 className="crm-section-title">3. Zakres projektu</h2>
          <div className="crm-field" style={{ maxWidth: "12rem" }}>
            <label className="crm-field-label" htmlFor="pages_count">
              Liczba podstron
            </label>
            <input
              id="pages_count"
              name="pages_count"
              type="number"
              min={1}
              max={999}
              value={pagesCount}
              onChange={(e) => setPagesCount(Math.max(1, parseInt(e.target.value) || 1))}
              className="crm-field-input"
            />
            <FieldError errors={fe.pages_count} />
          </div>
          <p className="est-field-hint">
            Pierwsza podstrona jest wliczona w cenę bazową. Za każdą kolejną: +{(250).toLocaleString("pl-PL")} zł.
          </p>
        </div>

        {/* ── Sekcja 4: Dodatki ── */}
        <div className="crm-section">
          <h2 className="crm-section-title">4. Dodatki</h2>
          {/* Hidden inputs carry boolean values to FormData */}
          {ADDONS.map(({ key }) => (
            <input key={key} type="hidden" name={key} value={addons[key] ? "on" : "off"} />
          ))}
          <div className="est-addon-grid">
            {ADDONS.map(({ key, label, price }) => {
              const active = addons[key];
              return (
                <button
                  key={key}
                  type="button"
                  className={`est-addon-toggle${active ? " est-addon-toggle--active" : ""}`}
                  onClick={() => toggleAddon(key)}
                >
                  <span className="est-addon-label">{label}</span>
                  <span className="est-addon-price">{price}</span>
                  {active && <Check size={11} className="est-addon-check" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Sekcja 5: Cena ── */}
        <div className="crm-section">
          <h2 className="crm-section-title">5. Cena</h2>
          <input type="hidden" name="base_price" value={basePrice} />

          <EstimateCalculator
            breakdown={breakdown}
            basePrice={basePrice}
            finalPrice={displayedFinalPrice}
          />

          <div className="crm-field est-final-price-field">
            <label className="crm-field-label" htmlFor="final_price">
              Cena finalna (zł) — możesz ją zmienić
            </label>
            <input
              id="final_price"
              name="final_price"
              type="number"
              min={0}
              step={1}
              value={displayedFinalPrice}
              onChange={(e) => {
                const v = Math.max(0, parseInt(e.target.value) || 0);
                setFinalPrice(v);
                setFinalPriceEdited(true);
              }}
              className="crm-field-input"
              style={{ maxWidth: "14rem" }}
            />
            {finalPriceEdited && finalPrice !== basePrice && (
              <button
                type="button"
                className="est-reset-price-btn"
                onClick={() => {
                  setFinalPrice(basePrice);
                  setFinalPriceEdited(false);
                }}
              >
                Przywróć cenę bazową
              </button>
            )}
            <FieldError errors={fe.final_price} />
          </div>
        </div>

        {/* ── Sekcja 6: Notatki ── */}
        <div className="crm-section">
          <h2 className="crm-section-title">6. Notatki</h2>
          <div className="crm-field">
            <label className="crm-field-label" htmlFor="notes">
              Wewnętrzne notatki do wyceny
            </label>
            <textarea
              id="notes"
              name="notes"
              className="crm-field-input crm-field-textarea"
              rows={4}
              defaultValue={defaultValues?.notes ?? ""}
              placeholder="Dodatkowe informacje, uzgodnienia z klientem…"
            />
          </div>
        </div>

        {/* ── Sekcja 7: Status ── */}
        <div className="crm-section">
          <h2 className="crm-section-title">7. Status</h2>
          <div className="crm-field" style={{ maxWidth: "18rem" }}>
            <label className="crm-field-label" htmlFor="status">
              Status wyceny
            </label>
            <select
              id="status"
              name="status"
              className="crm-select"
              defaultValue={defaultValues?.status ?? "draft"}
            >
              {ESTIMATE_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {ESTIMATE_STATUS_LABELS[s]}
                </option>
              ))}
            </select>
            <FieldError errors={fe.status} />
          </div>
        </div>

      </div>

      <div className="crm-form-footer">
        <Link href="/panel/wyceny" className="crm-btn">
          Anuluj
        </Link>
        <button
          type="submit"
          disabled={isPending || noClients}
          className="crm-btn crm-btn--primary"
        >
          {isPending ? (
            <>
              <Loader2 size={13} className="est-spin" />
              Zapisywanie…
            </>
          ) : (
            submitLabel
          )}
        </button>
      </div>
    </form>
  );
}
