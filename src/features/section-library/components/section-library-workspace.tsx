"use client";

import { useDeferredValue, useEffect, useMemo, useState, useTransition } from "react";
import {
  ArrowRight,
  Check,
  Copy,
  ExternalLink,
  Heart,
  Loader2,
  Plus,
  RefreshCcw,
  Search,
  ShieldAlert,
  Sparkles,
  Trash2,
  WandSparkles,
} from "lucide-react";
import type {
  SectionCategory,
  SectionEditorState,
  SectionLicense,
  SectionPageTemplate,
  SectionRecord,
  SectionSource,
  SectionStatus,
  SectionTechnology,
} from "@/features/section-library/types";
import { SECTION_LIBRARY_CATEGORIES } from "@/features/section-library/types";
import { slugify } from "@/features/section-library/utils";
import { SectionPreviewFrame } from "./section-preview-frame";

type Snapshot = {
  sections: SectionRecord[];
  sources: SectionSource[];
  templates: SectionPageTemplate[];
  licenses: SectionLicense[];
  categories: SectionCategory[];
};

function classNames(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

function toCsv(value: string[]) {
  return value.join(", ");
}

function fromCsv(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function createInitialDraft(section: SectionRecord): SectionRecord {
  return JSON.parse(JSON.stringify(section)) as SectionRecord;
}

function blankSection(categories: SectionCategory[]): SectionRecord {
  const fallbackCategory = categories[0] ?? {
    id: "sekcje-ofertowe" as const,
    name: "Sekcje ofertowe",
    description: "",
    tags: [],
  };

  const now = new Date().toISOString();
  return {
    id: `section-${Date.now()}`,
    slug: `new-section-${Date.now()}`,
    name: "Nowa sekcja",
    categoryId: fallbackCategory.id,
    categoryName: fallbackCategory.name,
    tags: ["custom", "draft"],
    thumbnailUrl:
      "data:image/svg+xml;charset=utf-8," +
      encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800" viewBox="0 0 1200 800"><rect width="1200" height="800" rx="48" fill="#0f172a"/><text x="90" y="180" fill="#fff" font-family="Arial,sans-serif" font-size="54" font-weight="700">Nowa sekcja</text></svg>`),
    description: "Zacznij od pustego szablonu.",
    technology: "React + Tailwind",
    componentCode: `export function NewSection() {
  return <section className="rounded-3xl border border-dashed border-stone-300 p-12">Nowa sekcja</section>;
}`,
    styleCode: "rounded-3xl border border-dashed border-stone-300 p-12",
    dependencies: [],
    difficulty: "easy",
    requiresJavaScript: false,
    responsive: true,
    animated: false,
    sourceType: "own",
    sourceUrl: null,
    author: "MA Atelier Studio",
    licenseId: "proprietary",
    licenseName: "Proprietary",
    licenseStatus: "known",
    isFree: true,
    commercialUse: true,
    attributionRequired: false,
    dateAdded: now,
    status: "draft",
    industryTags: [],
    styleTags: [],
    isFavorite: false,
    isPremium: false,
    previewHtml: `<div style="padding:24px;font-family:Arial,sans-serif"><h2>Nowa sekcja</h2><p>Zacznij od pustego szablonu.</p></div>`,
    previewDarkHtml: `<div style="padding:24px;background:#111;color:#fff;font-family:Arial,sans-serif"><h2>Nowa sekcja</h2><p>Zacznij od pustego szablonu.</p></div>`,
    aiAnalysis: null,
    variants: [],
  };
}

async function postJson<T>(url: string, body: unknown): Promise<T> {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error((payload as { error?: string }).error ?? `HTTP ${response.status}`);
  }
  return payload as T;
}

async function putJson<T>(url: string, body: unknown): Promise<T> {
  const response = await fetch(url, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error((payload as { error?: string }).error ?? `HTTP ${response.status}`);
  }
  return payload as T;
}

async function deleteJson<T>(url: string): Promise<T> {
  const response = await fetch(url, { method: "DELETE" });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error((payload as { error?: string }).error ?? `HTTP ${response.status}`);
  }
  return payload as T;
}

function PreviewBadge({ label }: { label: string }) {
  return <span className="inline-flex items-center rounded-full bg-stone-900/5 px-2 py-1 text-[11px] font-medium text-stone-700">{label}</span>;
}

export function SectionLibraryWorkspace({
  snapshot,
  initialSelectedId = null,
}: {
  snapshot: Snapshot;
  initialSelectedId?: string | null;
}) {
  const [sections, setSections] = useState(snapshot.sections);
  const [sources, setSources] = useState(snapshot.sources);
  const [templates] = useState(snapshot.templates);
  const [categories] = useState(snapshot.categories);
  const [licenses] = useState(snapshot.licenses);
  const [selectedId, setSelectedId] = useState<string | null>(initialSelectedId ?? snapshot.sections[0]?.id ?? null);
  const [draft, setDraft] = useState<SectionRecord | null>(null);
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<SectionEditorState>({
    query: "",
    category: "all",
    technology: "all",
    status: "all",
    sourceType: "all",
    favoritesOnly: false,
    premiumOnly: false,
  });
  const deferredQuery = useDeferredValue(query);
  const [previewMode, setPreviewMode] = useState<"light" | "dark">("light");
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [localFavorites, setLocalFavorites] = useState<string[]>(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("section-library-favorites") ?? "[]") as string[];
      return Array.isArray(stored) ? stored : [];
    } catch {
      return [];
    }
  });
  const [githubUrl, setGithubUrl] = useState("https://github.com/Animmaster/online_shop.git");
  const [sourceName, setSourceName] = useState("");
  const [sourceDescription, setSourceDescription] = useState("");
  const [sourceLicense, setSourceLicense] = useState("");
  const [sourceAuthor, setSourceAuthor] = useState("");
  const [autoSync, setAutoSync] = useState(true);
  const [convertFrom, setConvertFrom] = useState<"html" | "react" | "tailwind" | "css">("html");
  const [convertTo, setConvertTo] = useState<"react" | "builder" | "css" | "tailwind">("react");
  const [convertSource, setConvertSource] = useState("<section><h2>Nowa sekcja</h2></section>");
  const [importReport, setImportReport] = useState<string | null>(null);

  useEffect(() => {
    const stored = sections.find((section) => section.id === selectedId) ?? null;
    startTransition(() => {
      setDraft(stored ? createInitialDraft(stored) : null);
    });
  }, [selectedId, sections]);

  const selectedSection = draft ?? sections.find((section) => section.id === selectedId) ?? null;

  const visibleSections = useMemo(() => {
    const normalizedQuery = deferredQuery.trim().toLocaleLowerCase("pl");
    return sections.filter((section) => {
      const searchable = [
        section.name,
        section.description,
        section.categoryName,
        section.technology,
        ...section.tags,
        ...section.industryTags,
        ...section.styleTags,
      ]
        .join(" ")
        .toLowerCase();

      return (
        (!normalizedQuery || searchable.includes(normalizedQuery)) &&
        (filters.category === "all" || section.categoryId === filters.category) &&
        (filters.technology === "all" || section.technology === filters.technology) &&
        (filters.status === "all" || section.status === filters.status) &&
        (filters.sourceType === "all" || section.sourceType === filters.sourceType) &&
        (!filters.favoritesOnly || localFavorites.includes(section.id)) &&
        (!filters.premiumOnly || section.isPremium)
      );
    });
  }, [deferredQuery, filters, localFavorites, sections]);

  const techList = useMemo(() => {
    const technologies = new Set<SectionTechnology>();
    sections.forEach((section) => technologies.add(section.technology));
    return ["all", ...technologies] as Array<SectionTechnology | "all">;
  }, [sections]);

  const updateDraft = (patch: Partial<SectionRecord>) => {
    setDraft((current) => (current ? { ...current, ...patch } : current));
  };

  const persistLocalDraft = () => {
    if (!draft) return;
    setSections((current) => current.map((section) => (section.id === draft.id ? draft : section)));
  };

  async function saveDraft() {
    if (!draft) return;
    try {
      setError(null);
      setMessage(null);
      const payload = await putJson<{ success: boolean; section?: SectionRecord }>(`/api/sections/${encodeURIComponent(draft.id)}`, draft);
      if (payload.section) {
        setSections((current) => current.map((section) => (section.id === payload.section!.id ? payload.section! : section)));
        setDraft(createInitialDraft(payload.section));
      } else {
        persistLocalDraft();
      }
      setMessage("Sekcja zapisana.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Nie udało się zapisać sekcji.");
      persistLocalDraft();
    }
  }

  async function addSection() {
    const next = blankSection(categories);
    try {
      setError(null);
      const payload = await postJson<{ success: boolean; section?: SectionRecord }>("/api/sections", next);
      const created = payload.section ?? next;
      setSections((current) => [created, ...current]);
      setSelectedId(created.id);
      setDraft(createInitialDraft(created));
      setMessage("Dodano nową sekcję.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Nie udało się dodać sekcji.");
    }
  }

  async function addSource() {
    try {
      setError(null);
      const payload = await postJson<{ success: boolean; source?: SectionSource }>("/api/sections/sources", {
        repositoryUrl: githubUrl,
        sourceName: sourceName || undefined,
        sourceDescription: sourceDescription || undefined,
        license: sourceLicense || undefined,
        author: sourceAuthor || undefined,
        autoSync,
      });

      if (payload.source) {
        setSources((current) => [payload.source!, ...current.filter((item) => item.id !== payload.source!.id)]);
        setMessage(`Dodano źródło: ${payload.source.name}.`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Nie udało się dodać źródła.");
    }
  }

  async function duplicateSelected() {
    if (!selectedSection) return;
    try {
      setError(null);
      const payload = await postJson<{ success: boolean; section?: SectionRecord }>(`/api/sections/${encodeURIComponent(selectedSection.id)}`, {
        action: "duplicate",
      });
      if (payload.section) {
        setSections((current) => [payload.section!, ...current]);
        setSelectedId(payload.section.id);
        setDraft(createInitialDraft(payload.section));
      }
      setMessage("Sekcja zduplikowana.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Nie udało się zduplikować sekcji.");
    }
  }

  async function deleteSelected() {
    if (!selectedSection) return;
    if (!confirm(`Usunąć sekcję "${selectedSection.name}"?`)) return;
    try {
      setError(null);
      await deleteJson<{ success: boolean }>(`/api/sections/${encodeURIComponent(selectedSection.id)}`);
      setSections((current) => current.filter((section) => section.id !== selectedSection.id));
      const next = sections.find((section) => section.id !== selectedSection.id) ?? null;
      setSelectedId(next?.id ?? null);
      setDraft(next ? createInitialDraft(next) : null);
      setMessage("Sekcja usunięta.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Nie udało się usunąć sekcji.");
    }
  }

  async function favoriteSelected() {
    if (!selectedSection) return;
    const next = localFavorites.includes(selectedSection.id)
      ? localFavorites.filter((id) => id !== selectedSection.id)
      : [...localFavorites, selectedSection.id];
    setLocalFavorites(next);
    localStorage.setItem("section-library-favorites", JSON.stringify(next));
  }

  async function improveSelected() {
    if (!selectedSection) return;
    try {
      setError(null);
      const payload = await postJson<{ success: boolean; section?: SectionRecord }>("/api/sections/ai/improve", selectedSection);
      if (payload.section) {
        setDraft(createInitialDraft(payload.section));
        setSections((current) => current.map((section) => (section.id === payload.section!.id ? payload.section! : section)));
      }
      setMessage("Sekcja ulepszona przez AI / lokalny fallback.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Nie udało się ulepszyć sekcji.");
    }
  }

  async function similarSelected() {
    if (!selectedSection) return;
    try {
      setError(null);
      const payload = await postJson<{ success: boolean; section?: SectionRecord }>("/api/sections/ai/generate-similar", selectedSection);
      if (payload.section) {
        setSections((current) => [payload.section!, ...current]);
        setSelectedId(payload.section.id);
        setDraft(createInitialDraft(payload.section));
      }
      setMessage("Wygenerowano podobną sekcję.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Nie udało się wygenerować sekcji.");
    }
  }

  async function importGithub() {
    try {
      setError(null);
      setImportReport("Skanowanie repozytorium...");
      const payload = await postJson<{
        success: boolean;
        source?: SectionSource;
        sections?: SectionRecord[];
        warnings?: string[];
      }>("/api/sections/import/github", {
        repositoryUrl: githubUrl,
        sourceName: sourceName || undefined,
        sourceDescription: sourceDescription || undefined,
        license: sourceLicense || undefined,
        author: sourceAuthor || undefined,
        autoSync,
      });

      if (payload.source) {
        setSources((current) => [payload.source!, ...current.filter((item) => item.id !== payload.source!.id)]);
      }
      if (payload.sections?.length) {
        setSections((current) => [...payload.sections!, ...current]);
        setSelectedId(payload.sections[0].id);
        setDraft(createInitialDraft(payload.sections[0]));
      }
      setImportReport(
        `Zaimportowano ${payload.sections?.length ?? 0} sekcji${payload.warnings?.length ? `, ostrzeżenia: ${payload.warnings.join(" | ")}` : ""}`
      );
      setMessage("Import GitHuba zakończony.");
    } catch (err) {
      setImportReport(null);
      setError(err instanceof Error ? err.message : "Nie udało się zaimportować repozytorium.");
    }
  }

  async function convertNow() {
    try {
      setError(null);
      const payload = await postJson<{
        success: boolean;
        componentCode: string;
        styleCode: string;
        notes: string[];
      }>("/api/sections/ai/convert", {
        source: convertSource,
        from: convertFrom,
        to: convertTo,
      });
      setConvertSource(payload.componentCode);
      setMessage(payload.notes.join(" "));
      if (draft) {
        setDraft({
          ...draft,
          componentCode: payload.componentCode,
          styleCode: payload.styleCode || draft.styleCode,
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Nie udało się przeprowadzić konwersji.");
    }
  }

  async function generatePage(template: SectionPageTemplate) {
    try {
      setError(null);
      await postJson("/api/pages/generate", {
        templateId: template.id,
        sectionIds: template.sectionIds,
        title: template.name,
        slug: template.slug,
        seoTitle: template.seoTitle,
        seoDescription: template.seoDescription,
      });
      setMessage(`Strona wygenerowana z szablonu ${template.name}.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Nie udało się wygenerować strony.");
    }
  }

  return (
    <div className="grid min-h-[calc(100vh-6rem)] grid-cols-12 gap-4">
      <aside className="col-span-12 rounded-3xl border border-stone-200 bg-white p-4 shadow-sm xl:col-span-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-stone-500">Biblioteka Sekcji</p>
            <h1 className="mt-2 text-2xl font-semibold text-stone-950">Moduł sekcji i komponentów</h1>
            <p className="mt-2 text-sm text-stone-600">Filtry, źródła GitHub, AI analiza i eksport stron.</p>
          </div>
          <button onClick={addSection} className="inline-flex items-center gap-2 rounded-full bg-stone-950 px-4 py-2 text-sm font-medium text-white">
            <Plus size={16} />
            Dodaj
          </button>
        </div>

        <div className="mt-4 space-y-3">
          <label className="flex items-center gap-2 rounded-2xl border border-stone-200 bg-stone-50 px-3 py-2">
            <Search size={15} className="text-stone-400" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Szukaj po nazwie i tagach"
              className="w-full bg-transparent text-sm outline-none"
            />
          </label>

          <div className="grid grid-cols-2 gap-2">
            <select value={filters.category} onChange={(event) => setFilters((current) => ({ ...current, category: event.target.value as SectionEditorState["category"] }))} className="rounded-2xl border border-stone-200 bg-white px-3 py-2 text-sm">
              <option value="all">Wszystkie kategorie</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
            <select value={filters.technology} onChange={(event) => setFilters((current) => ({ ...current, technology: event.target.value as SectionEditorState["technology"] }))} className="rounded-2xl border border-stone-200 bg-white px-3 py-2 text-sm">
              <option value="all">Wszystkie technologie</option>
              {techList.filter((item): item is SectionTechnology => item !== "all").map((technology) => (
                <option key={technology} value={technology}>{technology}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <select value={filters.status} onChange={(event) => setFilters((current) => ({ ...current, status: event.target.value as SectionEditorState["status"] }))} className="rounded-2xl border border-stone-200 bg-white px-3 py-2 text-sm">
              <option value="all">Wszystkie statusy</option>
              <option value="active">Aktywne</option>
              <option value="draft">Szkic</option>
              <option value="hidden">Ukryte</option>
            </select>
            <select value={filters.sourceType} onChange={(event) => setFilters((current) => ({ ...current, sourceType: event.target.value as SectionEditorState["sourceType"] }))} className="rounded-2xl border border-stone-200 bg-white px-3 py-2 text-sm">
              <option value="all">Wszystkie źródła</option>
              <option value="github">GitHub</option>
              <option value="own">Własne</option>
              <option value="generated_ai">AI</option>
            </select>
          </div>

          <div className="flex flex-wrap gap-2">
            <button onClick={() => setFilters((current) => ({ ...current, favoritesOnly: !current.favoritesOnly }))} className={classNames("rounded-full px-3 py-1 text-xs font-medium", filters.favoritesOnly ? "bg-stone-950 text-white" : "bg-stone-100 text-stone-700")}>
              Ulubione
            </button>
            <button onClick={() => setFilters((current) => ({ ...current, premiumOnly: !current.premiumOnly }))} className={classNames("rounded-full px-3 py-1 text-xs font-medium", filters.premiumOnly ? "bg-stone-950 text-white" : "bg-stone-100 text-stone-700")}>
              Premium
            </button>
            <button onClick={() => setLocalFavorites([])} className="rounded-full bg-stone-100 px-3 py-1 text-xs font-medium text-stone-700">
              Wyczyść ulubione
            </button>
          </div>
        </div>

        <div className="mt-5">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-stone-400">Sekcje</p>
          <div className="mt-3 max-h-[48vh] space-y-2 overflow-auto pr-1">
            {visibleSections.map((section) => {
              const active = section.id === selectedId;
              const favorite = localFavorites.includes(section.id);
              return (
                <button
                  key={section.id}
                  onClick={() => setSelectedId(section.id)}
                  className={classNames(
                    "flex w-full items-start gap-3 rounded-2xl border p-3 text-left transition",
                    active ? "border-stone-950 bg-stone-950 text-white" : "border-stone-200 bg-white hover:border-stone-400"
                  )}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={section.thumbnailUrl ?? ""} alt="" className="h-16 w-24 rounded-xl object-cover" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="truncate text-sm font-medium">{section.name}</span>
                      {favorite && <Heart size={12} className={active ? "fill-white" : "fill-rose-500 text-rose-500"} />}
                    </div>
                    <p className={classNames("mt-1 text-[11px]", active ? "text-stone-200" : "text-stone-500")}>{section.categoryName}</p>
                    <p className={classNames("mt-2 line-clamp-2 text-xs", active ? "text-stone-300" : "text-stone-600")}>{section.description}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </aside>

      <main className="col-span-12 space-y-4 xl:col-span-6">
        <section className="rounded-3xl border border-stone-200 bg-white p-4 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-stone-500">Podgląd</p>
              <h2 className="mt-1 text-xl font-semibold text-stone-950">{selectedSection?.name ?? "Wybierz sekcję"}</h2>
              <p className="mt-1 text-sm text-stone-600">{selectedSection?.description ?? "Kliknij sekcję, żeby otworzyć edytor."}</p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setPreviewMode("light")} className={classNames("rounded-full px-3 py-2 text-xs font-medium", previewMode === "light" ? "bg-stone-950 text-white" : "bg-stone-100 text-stone-700")}>Jasny</button>
              <button onClick={() => setPreviewMode("dark")} className={classNames("rounded-full px-3 py-2 text-xs font-medium", previewMode === "dark" ? "bg-stone-950 text-white" : "bg-stone-100 text-stone-700")}>Ciemny</button>
              <button onClick={() => favoriteSelected()} className="rounded-full bg-stone-100 px-3 py-2 text-xs font-medium text-stone-700">
                <Heart size={12} className="mr-1 inline" />
                Ulubione
              </button>
            </div>
          </div>

          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            <SectionPreviewFrame html={selectedSection ? (previewMode === "dark" ? selectedSection.previewDarkHtml : selectedSection.previewHtml) : `<div style="padding:24px">Brak sekcji</div>`} title={selectedSection?.name ?? "Preview"} dark={previewMode === "dark"} />
            <div className="space-y-3 rounded-2xl border border-stone-200 bg-stone-50 p-4">
              {selectedSection ? (
                <>
                  <div className="flex flex-wrap gap-2">
                    <PreviewBadge label={selectedSection.technology} />
                    <PreviewBadge label={selectedSection.categoryName} />
                    <PreviewBadge label={selectedSection.status} />
                    {selectedSection.isPremium && <PreviewBadge label="Premium" />}
                    {selectedSection.responsive && <PreviewBadge label="Responsive" />}
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="rounded-2xl bg-white p-3">
                      <p className="text-[11px] uppercase tracking-[0.25em] text-stone-400">Licencja</p>
                      <p className="mt-1 font-medium text-stone-900">{selectedSection.licenseName}</p>
                    </div>
                    <div className="rounded-2xl bg-white p-3">
                      <p className="text-[11px] uppercase tracking-[0.25em] text-stone-400">Źródło</p>
                      <p className="mt-1 font-medium text-stone-900">{selectedSection.sourceType}</p>
                    </div>
                    <div className="rounded-2xl bg-white p-3">
                      <p className="text-[11px] uppercase tracking-[0.25em] text-stone-400">Responsywność</p>
                      <p className="mt-1 font-medium text-stone-900">{selectedSection.responsive ? "Tak" : "Nie"}</p>
                    </div>
                    <div className="rounded-2xl bg-white p-3">
                      <p className="text-[11px] uppercase tracking-[0.25em] text-stone-400">JavaScript</p>
                      <p className="mt-1 font-medium text-stone-900">{selectedSection.requiresJavaScript ? "Wymagany" : "Nie"}</p>
                    </div>
                  </div>
                  <div className="rounded-2xl bg-white p-3 text-sm text-stone-600">
                    <p className="text-[11px] uppercase tracking-[0.25em] text-stone-400">AI analiza</p>
                    <p className="mt-2">{selectedSection.aiAnalysis?.summary ?? "Brak analizy AI. Użyj przycisku AI ulepsz lub importu repozytorium."}</p>
                  </div>
                  <div className="rounded-2xl bg-white p-3 text-sm text-stone-600">
                    <p className="text-[11px] uppercase tracking-[0.25em] text-stone-400">Bezpieczeństwo</p>
                    <p className="mt-2">{selectedSection.aiAnalysis?.security.safe ? "Bezpieczna do buildera" : "Wymaga sandboxa i sprawdzenia"}</p>
                    <ul className="mt-2 list-disc space-y-1 pl-5 text-xs">
                      {selectedSection.aiAnalysis?.security.notes?.slice(0, 3).map((note) => <li key={note}>{note}</li>)}
                    </ul>
                  </div>
                </>
              ) : (
                <p className="text-sm text-stone-500">Wybierz sekcję z listy.</p>
              )}
            </div>
          </div>
        </section>

        <section className="grid gap-4 rounded-3xl border border-stone-200 bg-white p-4 shadow-sm lg:grid-cols-2">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-stone-500">Import GitHub</h3>
              <button onClick={() => startTransition(() => { void importGithub(); })} className="inline-flex items-center gap-2 rounded-full bg-stone-950 px-4 py-2 text-xs font-medium text-white">
                {pending ? <Loader2 className="animate-spin" size={14} /> : <RefreshCcw size={14} />}
                Skanuj repo
              </button>
            </div>
            <div className="mt-3 space-y-2">
              <input value={githubUrl} onChange={(event) => setGithubUrl(event.target.value)} className="w-full rounded-2xl border border-stone-200 px-3 py-2 text-sm" placeholder="https://github.com/owner/repo.git" />
              <input value={sourceName} onChange={(event) => setSourceName(event.target.value)} className="w-full rounded-2xl border border-stone-200 px-3 py-2 text-sm" placeholder="Nazwa źródła" />
              <textarea value={sourceDescription} onChange={(event) => setSourceDescription(event.target.value)} className="min-h-24 w-full rounded-2xl border border-stone-200 px-3 py-2 text-sm" placeholder="Opis źródła" />
              <div className="grid grid-cols-2 gap-2">
                <input value={sourceLicense} onChange={(event) => setSourceLicense(event.target.value)} className="rounded-2xl border border-stone-200 px-3 py-2 text-sm" placeholder="Licencja" />
                <input value={sourceAuthor} onChange={(event) => setSourceAuthor(event.target.value)} className="rounded-2xl border border-stone-200 px-3 py-2 text-sm" placeholder="Autor" />
              </div>
              <label className="flex items-center gap-2 text-xs text-stone-600">
                <input type="checkbox" checked={autoSync} onChange={(event) => setAutoSync(event.target.checked)} />
                Automatyczna synchronizacja
              </label>
              {importReport && <p className="rounded-2xl bg-stone-50 p-3 text-xs text-stone-600">{importReport}</p>}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-stone-500">Konwersja</h3>
              <button onClick={() => { void convertNow(); }} className="inline-flex items-center gap-2 rounded-full bg-amber-500 px-4 py-2 text-xs font-medium text-white">
                <Sparkles size={14} />
                Konwertuj
              </button>
            </div>
            <div className="mt-3 space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <select value={convertFrom} onChange={(event) => setConvertFrom(event.target.value as typeof convertFrom)} className="rounded-2xl border border-stone-200 px-3 py-2 text-sm">
                  <option value="html">HTML</option>
                  <option value="react">React</option>
                  <option value="tailwind">Tailwind</option>
                  <option value="css">CSS</option>
                </select>
                <select value={convertTo} onChange={(event) => setConvertTo(event.target.value as typeof convertTo)} className="rounded-2xl border border-stone-200 px-3 py-2 text-sm">
                  <option value="react">React</option>
                  <option value="builder">Builder</option>
                  <option value="css">CSS</option>
                  <option value="tailwind">Tailwind</option>
                </select>
              </div>
              <textarea value={convertSource} onChange={(event) => setConvertSource(event.target.value)} className="min-h-36 w-full rounded-2xl border border-stone-200 px-3 py-2 text-xs font-mono" />
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-stone-200 bg-white p-4 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-stone-500">Edytor sekcji</h3>
            <div className="flex flex-wrap gap-2">
              <button onClick={() => { void saveDraft(); }} className="inline-flex items-center gap-2 rounded-full bg-stone-950 px-4 py-2 text-xs font-medium text-white">
                <Check size={14} />
                Zapisz
              </button>
              <button onClick={() => { void duplicateSelected(); }} className="inline-flex items-center gap-2 rounded-full bg-stone-100 px-4 py-2 text-xs font-medium text-stone-700">
                <Copy size={14} />
                Duplikuj
              </button>
              <button onClick={() => { void improveSelected(); }} className="inline-flex items-center gap-2 rounded-full bg-amber-500 px-4 py-2 text-xs font-medium text-white">
                <WandSparkles size={14} />
                AI ulepsz
              </button>
              <button onClick={() => { void similarSelected(); }} className="inline-flex items-center gap-2 rounded-full bg-sky-600 px-4 py-2 text-xs font-medium text-white">
                <Sparkles size={14} />
                AI podobna
              </button>
              <button onClick={() => { void deleteSelected(); }} className="inline-flex items-center gap-2 rounded-full bg-rose-500 px-4 py-2 text-xs font-medium text-white">
                <Trash2 size={14} />
                Usuń
              </button>
            </div>
          </div>

          {selectedSection ? (
            <div className="mt-4 grid gap-4 lg:grid-cols-2">
              <div className="space-y-3">
                <input value={draft?.name ?? ""} onChange={(event) => updateDraft({ name: event.target.value, slug: slugify(event.target.value) })} className="w-full rounded-2xl border border-stone-200 px-3 py-2 text-sm" placeholder="Nazwa sekcji" />
                <div className="grid grid-cols-2 gap-2">
                  <select value={draft?.categoryId ?? selectedSection.categoryId} onChange={(event) => updateDraft({ categoryId: event.target.value as SectionRecord["categoryId"] })} className="rounded-2xl border border-stone-200 px-3 py-2 text-sm">
                    {SECTION_LIBRARY_CATEGORIES.map((categoryId) => (
                      <option key={categoryId} value={categoryId}>{categoryId}</option>
                    ))}
                  </select>
                  <select value={draft?.technology ?? selectedSection.technology} onChange={(event) => updateDraft({ technology: event.target.value as SectionTechnology })} className="rounded-2xl border border-stone-200 px-3 py-2 text-sm">
                    <option value="React">React</option>
                    <option value="Next.js">Next.js</option>
                    <option value="HTML">HTML</option>
                    <option value="Tailwind">Tailwind</option>
                    <option value="CSS">CSS</option>
                    <option value="React + Tailwind">React + Tailwind</option>
                    <option value="Next.js + Tailwind">Next.js + Tailwind</option>
                    <option value="HTML + Tailwind">HTML + Tailwind</option>
                    <option value="React + CSS">React + CSS</option>
                  </select>
                </div>
                <textarea value={draft?.description ?? selectedSection.description} onChange={(event) => updateDraft({ description: event.target.value })} className="min-h-24 w-full rounded-2xl border border-stone-200 px-3 py-2 text-sm" placeholder="Opis" />
                <div className="grid grid-cols-2 gap-2">
                  <input value={toCsv(draft?.tags ?? selectedSection.tags)} onChange={(event) => updateDraft({ tags: fromCsv(event.target.value) })} className="rounded-2xl border border-stone-200 px-3 py-2 text-sm" placeholder="Tagi" />
                  <input value={toCsv(draft?.industryTags ?? selectedSection.industryTags)} onChange={(event) => updateDraft({ industryTags: fromCsv(event.target.value) })} className="rounded-2xl border border-stone-200 px-3 py-2 text-sm" placeholder="Branże" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <select value={draft?.difficulty ?? selectedSection.difficulty} onChange={(event) => updateDraft({ difficulty: event.target.value as SectionRecord["difficulty"] })} className="rounded-2xl border border-stone-200 px-3 py-2 text-sm">
                    <option value="easy">Łatwy</option>
                    <option value="medium">Średni</option>
                    <option value="hard">Trudny</option>
                  </select>
                  <select value={draft?.status ?? selectedSection.status} onChange={(event) => updateDraft({ status: event.target.value as SectionStatus })} className="rounded-2xl border border-stone-200 px-3 py-2 text-sm">
                    <option value="active">Aktywna</option>
                    <option value="draft">Szkic</option>
                    <option value="hidden">Ukryta</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <input value={draft?.thumbnailUrl ?? selectedSection.thumbnailUrl} onChange={(event) => updateDraft({ thumbnailUrl: event.target.value })} className="rounded-2xl border border-stone-200 px-3 py-2 text-sm" placeholder="Miniatura URL / data URI" />
                  <input value={draft?.licenseName ?? selectedSection.licenseName} onChange={(event) => updateDraft({ licenseName: event.target.value })} className="rounded-2xl border border-stone-200 px-3 py-2 text-sm" placeholder="Licencja" />
                </div>
                <label className="flex items-center gap-2 text-sm text-stone-600"><input type="checkbox" checked={draft?.isPremium ?? selectedSection.isPremium} onChange={(event) => updateDraft({ isPremium: event.target.checked })} /> Premium</label>
              </div>
              <div className="space-y-3">
                <textarea value={draft?.componentCode ?? selectedSection.componentCode} onChange={(event) => updateDraft({ componentCode: event.target.value })} className="min-h-56 w-full rounded-2xl border border-stone-200 px-3 py-2 font-mono text-xs" placeholder="Kod komponentu" />
                <textarea value={draft?.styleCode ?? selectedSection.styleCode} onChange={(event) => updateDraft({ styleCode: event.target.value })} className="min-h-32 w-full rounded-2xl border border-stone-200 px-3 py-2 font-mono text-xs" placeholder="Kod CSS / Tailwind" />
                <textarea value={draft?.previewHtml ?? selectedSection.previewHtml} onChange={(event) => updateDraft({ previewHtml: event.target.value })} className="min-h-32 w-full rounded-2xl border border-stone-200 px-3 py-2 font-mono text-xs" placeholder="Preview light HTML" />
                <textarea value={draft?.previewDarkHtml ?? selectedSection.previewDarkHtml} onChange={(event) => updateDraft({ previewDarkHtml: event.target.value })} className="min-h-32 w-full rounded-2xl border border-stone-200 px-3 py-2 font-mono text-xs" placeholder="Preview dark HTML" />
              </div>
            </div>
          ) : (
            <p className="mt-4 text-sm text-stone-500">Wybierz sekcję, aby edytować kod, licencję, tagi, miniaturę i podgląd.</p>
          )}
        </section>
      </main>

      <aside className="col-span-12 space-y-4 rounded-3xl border border-stone-200 bg-white p-4 shadow-sm xl:col-span-3">
        <section>
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-stone-500">Źródła komponentów</h3>
            <button onClick={() => startTransition(() => { void addSource(); })} className="text-xs font-medium text-stone-700">
              <Plus size={12} className="mr-1 inline" />
              Dodaj
            </button>
          </div>
          <div className="mt-3 space-y-2">
            {sources.map((source) => (
              <div key={source.id} className="rounded-2xl border border-stone-200 p-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-medium text-stone-900">{source.name}</p>
                    <p className="mt-1 text-xs text-stone-500">{source.description}</p>
                  </div>
                  <span className="rounded-full bg-stone-100 px-2 py-1 text-[11px] text-stone-600">{source.syncStatus}</span>
                </div>
                <div className="mt-2 flex flex-wrap gap-1">
                  {source.tags.slice(0, 3).map((tag) => <PreviewBadge key={tag} label={tag} />)}
                </div>
                <a href={source.githubUrl} target="_blank" rel="noreferrer" className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-stone-700">
                  <ExternalLink size={12} />
                  GitHub
                </a>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-stone-500">Szablony stron</h3>
          <div className="mt-3 space-y-2">
            {templates.map((template) => (
              <button key={template.id} onClick={() => startTransition(() => { void generatePage(template); })} className="flex w-full items-center justify-between rounded-2xl border border-stone-200 p-3 text-left hover:border-stone-400">
                <div>
                  <p className="text-sm font-medium text-stone-900">{template.name}</p>
                  <p className="mt-1 text-xs text-stone-500">{template.industry} · {template.style}</p>
                </div>
                <ArrowRight size={14} className="text-stone-400" />
              </button>
            ))}
          </div>
        </section>

        <section>
          <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-stone-500">Licencje</h3>
          <div className="mt-3 space-y-2 text-sm">
            {licenses.map((license) => (
              <div key={license.id} className="rounded-2xl border border-stone-200 p-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-medium text-stone-900">{license.name}</p>
                  {license.status === "requires_check" ? <ShieldAlert size={14} className="text-amber-500" /> : <Check size={14} className="text-emerald-600" />}
                </div>
                <p className="mt-1 text-xs text-stone-500">
                  {license.isFree ? "Darmowa" : "Płatna"} · {license.commercialUse ? "Komercyjna" : "Bez komercji"} · {license.attributionRequired ? "wymaga autora" : "bez atrybucji"}
                </p>
              </div>
            ))}
          </div>
        </section>

        {selectedSection && (
          <section>
            <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-stone-500">Warianty</h3>
            <div className="mt-3 space-y-2">
              {(selectedSection.variants ?? []).map((variant) => (
                <div key={variant.id} className="rounded-2xl border border-stone-200 p-3">
                  <p className="text-sm font-medium text-stone-900">{variant.name}</p>
                  <p className="mt-1 text-xs text-stone-500">{variant.notes}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {message && <div className="rounded-2xl bg-emerald-50 p-3 text-xs text-emerald-800">{message}</div>}
        {error && <div className="rounded-2xl bg-rose-50 p-3 text-xs text-rose-800">{error}</div>}
        {importReport && <div className="rounded-2xl bg-stone-50 p-3 text-xs text-stone-600">{importReport}</div>}

        <section className="rounded-2xl border border-stone-200 bg-stone-50 p-3 text-xs text-stone-600">
          <p className="font-medium text-stone-900">Porady wdrożenia</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>Import GitHub działa w sandboxie i wymaga akceptacji znalezionych sekcji.</li>
            <li>Wersja ciemna, jasna i warianty są edytowalne osobno.</li>
            <li>Jeśli AI nie jest skonfigurowane, moduł używa lokalnego fallbacku.</li>
          </ul>
        </section>
      </aside>
    </div>
  );
}
