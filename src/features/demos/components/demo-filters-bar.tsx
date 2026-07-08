"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { Search, X } from "lucide-react";
import {
  DEMO_INDUSTRIES,
  DEMO_INDUSTRY_LABELS,
  DEMO_STATUSES,
  DEMO_STATUS_LABELS,
} from "@/features/demos/types";

type Props = {
  q?: string;
  status?: string;
  industry?: string;
};

export function DemoFiltersBar({ q = "", status = "", industry = "" }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  function update(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    startTransition(() => router.replace(`${pathname}?${params.toString()}`));
  }

  const hasFilters = !!(q || status || industry);

  return (
    <div className={`crm-filters${isPending ? " crm-filters--loading" : ""}`}>
      <div className="crm-search-wrap">
        <Search size={13} className="crm-search-icon" />
        <input
          type="search"
          className="crm-search"
          placeholder="Szukaj po tytule lub slugu…"
          defaultValue={q}
          onChange={(event) => update("q", event.target.value)}
        />
      </div>
      <select className="crm-filter-select" value={status} onChange={(event) => update("status", event.target.value)}>
        <option value="">Wszystkie statusy</option>
        {DEMO_STATUSES.map((item) => (
          <option key={item} value={item}>{DEMO_STATUS_LABELS[item]}</option>
        ))}
      </select>
      <select className="crm-filter-select" value={industry} onChange={(event) => update("industry", event.target.value)}>
        <option value="">Wszystkie branże</option>
        {DEMO_INDUSTRIES.map((item) => (
          <option key={item} value={item}>{DEMO_INDUSTRY_LABELS[item]}</option>
        ))}
      </select>
      {hasFilters && (
        <button type="button" className="crm-clear-btn" onClick={() => startTransition(() => router.replace(pathname))}>
          <X size={12} />
          Wyczyść
        </button>
      )}
    </div>
  );
}
