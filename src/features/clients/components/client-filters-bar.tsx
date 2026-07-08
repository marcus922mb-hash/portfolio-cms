"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback, useTransition } from "react";
import { Search, X } from "lucide-react";
import { CLIENT_STATUSES, CLIENT_STATUS_LABELS } from "@/features/clients/types";

type Props = {
  q?: string;
  status?: string;
};

export function ClientFiltersBar({ q = "", status = "" }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const updateParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      params.delete("page");
      startTransition(() => {
        router.push(`${pathname}?${params.toString()}`);
      });
    },
    [router, pathname, searchParams]
  );

  const hasFilters = q || status;

  return (
    <div className={`crm-filters${isPending ? " crm-filters--loading" : ""}`}>
      <div className="crm-search-wrap">
        <Search size={13} className="crm-search-icon" />
        <input
          type="search"
          className="crm-search"
          placeholder="Szukaj po imieniu, firmie, e-mailu…"
          defaultValue={q}
          onChange={(e) => updateParam("q", e.target.value)}
        />
      </div>

      <select
        className="crm-filter-select"
        defaultValue={status}
        onChange={(e) => updateParam("status", e.target.value)}
        aria-label="Filtruj po statusie"
      >
        <option value="">Wszystkie statusy</option>
        {CLIENT_STATUSES.map((s) => (
          <option key={s} value={s}>
            {CLIENT_STATUS_LABELS[s]}
          </option>
        ))}
      </select>

      {hasFilters && (
        <button
          type="button"
          className="crm-clear-btn"
          onClick={() => {
            startTransition(() => {
              router.push(pathname);
            });
          }}
        >
          <X size={12} />
          Wyczyść
        </button>
      )}
    </div>
  );
}
