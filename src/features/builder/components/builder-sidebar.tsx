"use client";

import { useState, useTransition } from "react";
import { useDraggable } from "@dnd-kit/core";
import { Search, Layers, ChevronDown, ChevronRight, GripVertical, LayoutTemplate, Sparkles, Loader2 } from "lucide-react";
import { nanoid } from "nanoid";
import {
  COMPONENT_DEFINITIONS,
  COMPONENT_CATEGORIES,
} from "@/lib/builder/component-definitions";
import { useBuilderStore } from "@/features/builder/store/builder-store";
import { generateInBuilderAction, PRESETS } from "@/features/builder/actions/generate-in-builder";
import type { BuilderComponent, ComponentDefinition } from "@/features/builder/types";
import type { PresetId } from "@/features/builder/actions/generate-in-builder";

// ── Draggable library item ───────────────────────────────────
function LibraryItem({ def }: { def: ComponentDefinition }) {
  const { addComponent, selectedId } = useBuilderStore();
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `library:${def.type}`,
    data: { type: "library", componentType: def.type, def },
  });

  return (
    <div
      ref={setNodeRef}
      className={`bldr-lib-item${isDragging ? " bldr-lib-item--dragging" : ""}`}
      title={def.description}
    >
      <div className="bldr-lib-item-drag" {...listeners} {...attributes}>
        <GripVertical size={12} />
      </div>
      <div
        className="bldr-lib-item-content"
        onClick={() => addComponent(def, selectedId ?? undefined)}
      >
        <span className="bldr-lib-item-label">{def.label}</span>
        <span className="bldr-lib-item-desc">{def.description}</span>
      </div>
    </div>
  );
}

// ── Category group ───────────────────────────────────────────
function CategoryGroup({
  categoryLabel,
  defs,
}: {
  categoryKey?: string;
  categoryLabel: string;
  defs: ComponentDefinition[];
}) {
  const [open, setOpen] = useState(true);
  if (defs.length === 0) return null;

  return (
    <div className="bldr-lib-category">
      <button
        className="bldr-lib-category-header"
        onClick={() => setOpen((p) => !p)}
      >
        {open ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
        <span>{categoryLabel}</span>
        <span className="bldr-lib-category-count">{defs.length}</span>
      </button>
      {open && (
        <div className="bldr-lib-category-items">
          {defs.map((d) => <LibraryItem key={d.type} def={d} />)}
        </div>
      )}
    </div>
  );
}

// ── Layers panel ─────────────────────────────────────────────
function LayersPanel() {
  const { components, selectedId, selectComponent, removeComponent } = useBuilderStore();

  if (components.length === 0) {
    return (
      <div className="bldr-layers-empty">
        <Layers size={24} style={{ opacity: .2, display: "block", margin: "0 auto .5rem" }} />
        <p>Brak komponentów</p>
      </div>
    );
  }

  return (
    <div className="bldr-layers-list">
      {components.map((comp, i) => (
        <div
          key={comp.id}
          className={`bldr-layer-item${selectedId === comp.id ? " bldr-layer-item--selected" : ""}`}
          onClick={() => selectComponent(comp.id)}
        >
          <span className="bldr-layer-index">{i + 1}</span>
          <span className="bldr-layer-label">{comp.label}</span>
          <button
            className="bldr-layer-delete"
            onClick={(e) => {
              e.stopPropagation();
              if (confirm(`Usunąć "${comp.label}"?`)) removeComponent(comp.id);
            }}
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}

// ── Templates panel ──────────────────────────────────────────
const BUILDER_PRESETS = [
  {
    id: "agencja",
    name: "Agencja / Studio",
    description: "Pełna strona agencji: hero, usługi, portfolio, opinie, kontakt",
    icon: "🎨",
    components: ["navbar", "hero-split", "statistics", "services", "process", "portfolio", "testimonials", "cta", "contact", "footer"],
  },
  {
    id: "restauracja",
    name: "Restauracja / Gastronomia",
    description: "Menu, rezerwacje, galeria, opinie",
    icon: "🍽️",
    components: ["navbar-centered", "hero-video", "about", "menu-section", "gallery", "reviews-grid", "reservation", "contact", "footer-minimal"],
  },
  {
    id: "salon",
    name: "Salon / Beauty / SPA",
    description: "Usługi, cennik, galeria, rezerwacja online",
    icon: "💆",
    components: ["navbar", "hero", "services", "pricing", "gallery", "testimonials", "reservation", "contact", "footer-minimal"],
  },
  {
    id: "lekarz",
    name: "Lekarz / Klinika",
    description: "Specjalności, zespół, cennik, rezerwacja",
    icon: "🏥",
    components: ["navbar", "hero-split", "about", "services", "team", "pricing", "faq", "reservation", "contact", "footer"],
  },
  {
    id: "portfolio",
    name: "Portfolio / Freelancer",
    description: "O mnie, realizacje, umiejętności, kontakt",
    icon: "👤",
    components: ["navbar-minimal", "hero-fullscreen", "about", "features", "portfolio", "testimonials", "contact", "footer-minimal"],
  },
  {
    id: "landing",
    name: "Landing Page / Produkt",
    description: "Oferta, cechy, społeczny dowód słuszności, CTA",
    icon: "🚀",
    components: ["navbar-minimal", "hero", "features", "statistics", "testimonials", "pricing", "faq", "cta", "footer-minimal"],
  },
  {
    id: "sklep",
    name: "Sklep online",
    description: "Produkty, kategorie, opinie, koszyk",
    icon: "🛒",
    components: ["navbar", "hero", "woo-products", "features", "testimonials", "newsletter", "footer"],
  },
  {
    id: "nieruchomosci",
    name: "Nieruchomości / Deweloper",
    description: "Inwestycje, lokalizacja, kontakt, mapa",
    icon: "🏠",
    components: ["navbar", "hero-split", "about", "services", "gallery", "statistics", "faq", "contact", "map", "footer"],
  },
  {
    id: "edukacja",
    name: "Szkoła / Edukacja / Kursy",
    description: "Kursy, harmonogram, opinie, zapisy",
    icon: "📚",
    components: ["navbar", "hero", "about", "features", "event", "pricing-toggle", "testimonials", "faq", "contact", "footer"],
  },
  {
    id: "linkinbio",
    name: "Link in Bio",
    description: "Profil z linkami do social media i strony",
    icon: "📱",
    components: ["linkinbio"],
  },
];

function makeBuilderComponent(type: string): BuilderComponent | null {
  const def = COMPONENT_DEFINITIONS.find((d) => d.type === type);
  if (!def) return null;
  return {
    id: nanoid(),
    type: def.type,
    label: def.label,
    props: { ...def.defaultProps },
    styles: { ...def.defaultStyles },
    animations: { type: "none", duration: 400, delay: 0, easing: "ease-out" },
    visibility: { desktop: true, tablet: true, mobile: true },
    children: [],
  };
}

function TemplatesPanel() {
  const { loadTemplate } = useBuilderStore();

  function handleLoad(preset: typeof BUILDER_PRESETS[number]) {
    if (!confirm(`Załadować szablon "${preset.name}"? Aktualna zawartość zostanie zastąpiona.`)) return;
    const comps = preset.components
      .map((type) => makeBuilderComponent(type))
      .filter((c): c is BuilderComponent => c !== null);
    loadTemplate(comps);
  }

  return (
    <div className="bldr-lib-list">
      <div className="bldr-lib-empty" style={{ padding: ".5rem .75rem", fontSize: ".7rem", color: "#f59e0b", background: "rgba(245,158,11,.08)", borderRadius: "4px", margin: ".5rem", lineHeight: 1.4 }}>
        Załadowanie szablonu zastąpi aktualną zawartość strony.
      </div>
      {BUILDER_PRESETS.map((preset) => (
        <div
          key={preset.id}
          className="bldr-lib-item"
          style={{ cursor: "pointer" }}
          onClick={() => handleLoad(preset)}
        >
          <div className="bldr-lib-item-drag" style={{ fontSize: "1rem", minWidth: "1.5rem", textAlign: "center" }}>
            {preset.icon}
          </div>
          <div className="bldr-lib-item-content">
            <span className="bldr-lib-item-label">{preset.name}</span>
            <span className="bldr-lib-item-desc">{preset.description}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Generator panel ──────────────────────────────────────────
const PRESET_ICONS: Record<string, string> = {
  agencja: "🎨", restauracja: "🍽️", salon: "💆", lekarz: "🏥",
  portfolio: "👤", landing: "🚀", sklep: "🛒", nieruchomosci: "🏠",
  edukacja: "📚", linkinbio: "📱",
};

function GeneratorPanel() {
  const { loadTemplate } = useBuilderStore();
  const [selectedPreset, setSelectedPreset] = useState<PresetId>("agencja");
  const [companyName, setCompanyName] = useState("");
  const [description, setDescription] = useState("");
  const [services, setServices] = useState("");
  const [city, setCity] = useState("");
  const [tone, setTone] = useState("profesjonalny, ciepły");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  function handleGenerate() {
    setError(null);
    setDone(false);
    startTransition(async () => {
      const result = await generateInBuilderAction({
        presetId: selectedPreset,
        companyName: companyName.trim(),
        description: description.trim(),
        services: services.trim(),
        city: city.trim(),
        tone: tone.trim(),
      });
      if (!result.success) {
        setError(result.error);
        return;
      }
      loadTemplate(result.components);
      setDone(true);
    });
  }

  return (
    <div className="bldr-gen-panel">
      <p className="bldr-gen-hint">
        Wybierz branżę, uzupełnij dane firmy — AI wygeneruje treści i załaduje kompletną stronę do buildera.
      </p>

      {/* Preset grid */}
      <div className="bldr-gen-section-label">Układ strony</div>
      <div className="bldr-gen-presets">
        {PRESETS.map((p) => (
          <button
            key={p.id}
            type="button"
            className={`bldr-gen-preset${selectedPreset === p.id ? " bldr-gen-preset--active" : ""}`}
            onClick={() => setSelectedPreset(p.id as PresetId)}
            title={p.label}
          >
            <span className="bldr-gen-preset-icon">{PRESET_ICONS[p.id] ?? "📄"}</span>
            <span className="bldr-gen-preset-label">{p.label}</span>
          </button>
        ))}
      </div>

      {/* Form */}
      <div className="bldr-gen-section-label">Dane firmy</div>
      <div className="bldr-gen-fields">
        <label className="bldr-gen-field">
          <span>Nazwa firmy</span>
          <input
            className="bldr-gen-input"
            placeholder="np. Luna Atelier"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            disabled={isPending}
          />
        </label>
        <label className="bldr-gen-field">
          <span>Opis firmy</span>
          <textarea
            className="bldr-gen-input bldr-gen-textarea"
            placeholder="Czym się zajmujecie? Co wyróżnia firmę?"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            disabled={isPending}
          />
        </label>
        <label className="bldr-gen-field">
          <span>Usługi / oferta <span className="bldr-gen-hint-inline">(oddziel przecinkami)</span></span>
          <input
            className="bldr-gen-input"
            placeholder="np. strony www, sklepy, SEO"
            value={services}
            onChange={(e) => setServices(e.target.value)}
            disabled={isPending}
          />
        </label>
        <label className="bldr-gen-field">
          <span>Miasto <span className="bldr-gen-hint-inline">(opcjonalnie)</span></span>
          <input
            className="bldr-gen-input"
            placeholder="np. Warszawa"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            disabled={isPending}
          />
        </label>
        <label className="bldr-gen-field">
          <span>Ton komunikacji</span>
          <input
            className="bldr-gen-input"
            placeholder="profesjonalny, ciepły, bezpośredni..."
            value={tone}
            onChange={(e) => setTone(e.target.value)}
            disabled={isPending}
          />
        </label>
      </div>

      {error && <p className="bldr-gen-error">{error}</p>}
      {done && <p className="bldr-gen-success">Strona załadowana! Edytuj sekcje po lewej.</p>}

      <button
        type="button"
        className="bldr-gen-btn"
        onClick={handleGenerate}
        disabled={isPending}
      >
        {isPending
          ? <><Loader2 size={13} className="bldr-spin" /> Generuję z AI…</>
          : <><Sparkles size={13} /> Generuj z AI</>}
      </button>

      <p className="bldr-gen-footer">
        Jeśli AI nie odpowie — ładuje układ z domyślnymi tekstami.
      </p>
    </div>
  );
}

// ── Main sidebar ─────────────────────────────────────────────
export function BuilderSidebar() {
  const { sidebarTab, setSidebarTab } = useBuilderStore();
  const [query, setQuery] = useState("");

  const filtered = query.trim()
    ? COMPONENT_DEFINITIONS.filter(
        (d) =>
          d.label.toLowerCase().includes(query.toLowerCase()) ||
          d.description.toLowerCase().includes(query.toLowerCase())
      )
    : null;

  return (
    <aside className="bldr-sidebar">
      {/* Tabs */}
      <div className="bldr-sidebar-tabs">
        <button
          className={`bldr-sidebar-tab${sidebarTab === "components" ? " bldr-sidebar-tab--active" : ""}`}
          onClick={() => setSidebarTab("components")}
        >
          Komponenty
        </button>
        <button
          className={`bldr-sidebar-tab${sidebarTab === "layers" ? " bldr-sidebar-tab--active" : ""}`}
          onClick={() => setSidebarTab("layers")}
        >
          Warstwy
        </button>
        <button
          className={`bldr-sidebar-tab${sidebarTab === "templates" ? " bldr-sidebar-tab--active" : ""}`}
          onClick={() => setSidebarTab("templates")}
          title="Szablony stron"
        >
          <LayoutTemplate size={12} style={{ marginRight: "3px" }} />
          Szablony
        </button>
        <button
          className={`bldr-sidebar-tab${sidebarTab === "generator" ? " bldr-sidebar-tab--active" : ""}`}
          onClick={() => setSidebarTab("generator")}
          title="Generator AI — generuj stronę z AI"
        >
          <Sparkles size={12} style={{ marginRight: "3px" }} />
          Generator
        </button>
      </div>

      {sidebarTab === "components" ? (
        <>
          {/* Search */}
          <div className="bldr-lib-search">
            <Search size={13} />
            <input
              className="bldr-lib-search-input"
              placeholder="Szukaj komponentu..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          {/* Component list */}
          <div className="bldr-lib-list">
            {filtered ? (
              filtered.length === 0 ? (
                <div className="bldr-lib-empty">Brak wyników</div>
              ) : (
                filtered.map((d) => <LibraryItem key={d.type} def={d} />)
              )
            ) : (
              COMPONENT_CATEGORIES.map(({ key, label }) => {
                const defs = COMPONENT_DEFINITIONS.filter((d) => d.category === key);
                return (
                  <CategoryGroup
                    key={key}
                    categoryKey={key}
                    categoryLabel={label}
                    defs={defs}
                  />
                );
              })
            )}
          </div>
        </>
      ) : sidebarTab === "layers" ? (
        <LayersPanel />
      ) : sidebarTab === "generator" ? (
        <GeneratorPanel />
      ) : (
        <TemplatesPanel />
      )}
    </aside>
  );
}
