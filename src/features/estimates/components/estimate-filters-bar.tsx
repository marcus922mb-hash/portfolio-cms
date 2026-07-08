"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { Search } from "lucide-react";
import { ESTIMATE_STATUSES, ESTIMATE_STATUS_LABELS, WEBSITE_TYPES, WEBSITE_TYPE_LABELS } from "@/features/estimates/types";

type Props = {
  q?: string;
  status?: string;
  type?: string;
};

export function EstimateFiltersBar({ q, status, type }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  function update(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`);
    });
  }

  function clear() {
    startTransition(() => {
      router.replace(pathname);
    });
  }

  const hasFilters = !!(q || status || type);

  return (
    <div className={`crm-filters${isPending ? " crm-filters--loading" : ""}`}>
      <div className="crm-search-wrap">
        <Search size={13} className="crm-search-icon" />
        <input
          type="search"
          className="crm-search"
          placeholder="Szukaj klienta…"
          defaultValue={q ?? ""}
          onChange={(e) => update("q", e.target.value)}
        />
      </div>

      <select
        className="crm-filter-select"
        value={status ?? ""}
        onChange={(e) => update("status", e.target.value)}
        aria-label="Filtruj po statusie"
      >
        <option value="">Wszystkie statusy</option>
        {ESTIMATE_STATUSES.map((s) => (
          <option key={s} value={s}>
            {ESTIMATE_STATUS_LABELS[s]}
          </option>
        ))}
      </select>

      <select
        className="crm-filter-select"
        value={type ?? ""}
        onChange={(e) => update("type", e.target.value)}
        aria-label="Filtruj po typie strony"
      >
        <option value="">Wszystkie typy</option>
        {WEBSITE_TYPES.map((t) => (
          <option key={t} value={t}>
            {WEBSITE_TYPE_LABELS[t]}
          </option>
        ))}
      </select>

      {hasFilters && (
        <button type="button" className="crm-clear-btn" onClick={clear}>
          Wyczyść
        </button>
      )}
    </div>
  );
}
