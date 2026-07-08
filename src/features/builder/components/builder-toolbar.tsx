"use client";

import { useState, useTransition, useEffect, useRef } from "react";
import Link from "next/link";
import {
  ArrowLeft, Monitor, Tablet, Smartphone,
  Undo2, Redo2, Save, Eye, Sparkles, Loader2, X, Check, Upload, Download,
} from "lucide-react";
import { useBuilderStore } from "@/features/builder/store/builder-store";
import { saveBuilderPage } from "@/features/builder/actions/builder-actions";
import { publishBuilderToDemo, importDemoToBuilder } from "@/features/builder/actions/publish-to-demo";
import { templates } from "@/features/templates/catalog";
import type { ResolvedTemplate } from "@/features/templates/types";

// ── Template picker modal ─────────────────────────────────────

const TEMPLATE_INDUSTRY_COLORS: Record<string, string> = {
  handmade: "#c97bba",
  beauty: "#c97bba",
  restaurant: "#c9a46e",
  services: "#7b8fc9",
  medical: "#4c9fc9",
  creative: "#4caf7a",
  ecommerce: "#c9a46e",
};

function TemplatePicker({
  onSelect,
  onClose,
}: {
  onSelect: (t: ResolvedTemplate) => void;
  onClose: () => void;
}) {
  const [q, setQ] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === "Escape") onClose(); }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const filtered = q.trim()
    ? templates.filter(
        (t) =>
          t.name.toLowerCase().includes(q.toLowerCase()) ||
          t.industry.toLowerCase().includes(q.toLowerCase()) ||
          t.tags.some((tag) => tag.toLowerCase().includes(q.toLowerCase()))
      )
    : templates;

  return (
    <div className="bldr-tpl-overlay" onClick={onClose}>
      <div className="bldr-tpl-modal" onClick={(e) => e.stopPropagation()}>
        <div className="bldr-tpl-modal-header">
          <span className="bldr-tpl-modal-title">
            <Sparkles size={14} />
            Załaduj szablon
          </span>
          <button type="button" className="bldr-tpl-modal-close" onClick={onClose}>
            <X size={16} />
          </button>
        </div>
        <div className="bldr-tpl-modal-search">
          <input
            ref={inputRef}
            className="crm-input"
            placeholder="Szukaj szablonu…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
        <div className="bldr-tpl-modal-body">
          {filtered.length === 0 && (
            <p style={{ textAlign: "center", fontSize: ".75rem", color: "rgba(232,232,232,.3)", padding: "2rem 0" }}>
              Brak wyników dla &ldquo;{q}&rdquo;
            </p>
          )}
          {filtered.map((t) => (
            <button
              key={t.id}
              type="button"
              className="bldr-tpl-item"
              onClick={() => onSelect(t)}
            >
              <span
                className="bldr-tpl-item-dot"
                style={{ background: t.colors.primary }}
              />
              <span className="bldr-tpl-item-info">
                <strong>{t.name}</strong>
                <small>{t.industry} · {t.sections.length} sekcji</small>
              </span>
              <span
                className="bldr-tpl-item-group"
                style={{ color: TEMPLATE_INDUSTRY_COLORS[t.group] ?? "#7b8fc9" }}
              >
                {t.style}
              </span>
            </button>
          ))}
        </div>
        <div className="bldr-tpl-modal-footer">
          <span style={{ fontSize: ".65rem", color: "rgba(232,232,232,.3)" }}>
            {templates.length} szablonów · ESC aby zamknąć
          </span>
        </div>
      </div>
    </div>
  );
}

// ── Toolbar ───────────────────────────────────────────────────

export function BuilderToolbar() {
  const {
    demoId, pageName, device, isDirty, isSaving,
    history, historyIndex,
    setDevice, undo, redo, markSaved, setSaving, components, settings, init, pageId,
  } = useBuilderStore();

  const [saving, startTransition] = useTransition();
  const [showTemplatePicker, setShowTemplatePicker] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [publishOk, setPublishOk] = useState(false);
  const [importing, setImporting] = useState(false);

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  function handleSave() {
    if (!demoId) return;
    setSaving(true);
    startTransition(async () => {
      const res = await saveBuilderPage({
        demoId,
        name: pageName,
        components,
        settings,
      });
      setSaving(false);
      if (res.success) markSaved();
    });
  }

  async function handlePublish() {
    if (!demoId) return;
    if (!confirm("Opublikować zmiany? Zaktualizuje to treść na żywym demo.")) return;
    setPublishing(true);
    const res = await publishBuilderToDemo(demoId, components);
    setPublishing(false);
    if (res.success) {
      setPublishOk(true);
      setTimeout(() => setPublishOk(false), 2500);
    } else {
      alert(`Błąd publikowania: ${res.error}`);
    }
  }

  async function handleImportFromDemo() {
    if (!demoId) return;
    if (
      components.length > 0 &&
      !confirm("Importowanie z demo zastąpi obecne bloki w builderze. Kontynuować?")
    ) return;
    setImporting(true);
    const res = await importDemoToBuilder(demoId);
    setImporting(false);
    if (res.success) {
      window.location.reload();
    } else {
      alert(`Błąd importu: ${res.error}`);
    }
  }

  function handleTemplateSelect(t: ResolvedTemplate) {
    if (
      components.length > 0 &&
      !confirm(`Załadowanie szablonu "${t.name}" zastąpi wszystkie obecne bloki. Kontynuować?`)
    ) return;

    init({
      pageId,
      pageName,
      demoId,
      components: t.components,
      settings: t.settings,
      device,
    });
    setShowTemplatePicker(false);
  }

  return (
    <>
      <header className="bldr-toolbar">
        {/* Left */}
        <div className="bldr-toolbar-left">
          <Link href="/panel/templates" className="bldr-toolbar-back" title="Powrót do szablonów">
            <ArrowLeft size={16} />
          </Link>
          <div className="bldr-toolbar-divider" />
          <span className="bldr-toolbar-name">{pageName}</span>
          {isDirty && <span className="bldr-toolbar-dirty" title="Niezapisane zmiany">●</span>}
        </div>

        {/* Center — device switcher */}
        <div className="bldr-toolbar-center">
          <div className="bldr-device-switcher">
            <button
              className={`bldr-device-btn${device === "desktop" ? " bldr-device-btn--active" : ""}`}
              title="Desktop"
              onClick={() => setDevice("desktop")}
            >
              <Monitor size={15} />
            </button>
            <button
              className={`bldr-device-btn${device === "tablet" ? " bldr-device-btn--active" : ""}`}
              title="Tablet (768px)"
              onClick={() => setDevice("tablet")}
            >
              <Tablet size={15} />
            </button>
            <button
              className={`bldr-device-btn${device === "mobile" ? " bldr-device-btn--active" : ""}`}
              title="Mobile (375px)"
              onClick={() => setDevice("mobile")}
            >
              <Smartphone size={15} />
            </button>
          </div>
        </div>

        {/* Right */}
        <div className="bldr-toolbar-right">
          <button
            className="bldr-toolbar-btn"
            disabled={!canUndo}
            onClick={undo}
            title="Cofnij (Ctrl+Z)"
          >
            <Undo2 size={15} />
          </button>
          <button
            className="bldr-toolbar-btn"
            disabled={!canRedo}
            onClick={redo}
            title="Ponów (Ctrl+Y)"
          >
            <Redo2 size={15} />
          </button>

          <div className="bldr-toolbar-divider" />

          <button
            className="bldr-toolbar-btn bldr-toolbar-btn--ai"
            title="Załaduj szablon do canvas"
            onClick={() => setShowTemplatePicker(true)}
          >
            <Sparkles size={15} />
            <span>Szablon</span>
          </button>

          {demoId && (
            <button
              className="bldr-toolbar-btn"
              title="Importuj sekcje z wygenerowanego AI demo"
              onClick={handleImportFromDemo}
              disabled={importing}
            >
              {importing ? <Loader2 size={15} className="bldr-spin" /> : <Download size={15} />}
              <span>Importuj</span>
            </button>
          )}

          <div className="bldr-toolbar-divider" />

          {demoId && (
            <Link
              href={`/demo/${demoId}`}
              target="_blank"
              className="bldr-toolbar-btn"
              title="Podgląd strony"
            >
              <Eye size={15} />
            </Link>
          )}

          <button
            className={`bldr-toolbar-btn bldr-toolbar-btn--save${isDirty ? " bldr-toolbar-btn--dirty" : ""}`}
            onClick={handleSave}
            disabled={isSaving || saving || !isDirty}
            title="Zapisz (Ctrl+S)"
          >
            {(isSaving || saving) ? <Loader2 size={15} className="bldr-spin" /> : <Save size={15} />}
            <span>{isSaving || saving ? "Zapisuję..." : "Zapisz"}</span>
          </button>

          {demoId && (
            <button
              className={`bldr-toolbar-btn bldr-toolbar-btn--publish${publishOk ? " bldr-toolbar-btn--ok" : ""}`}
              onClick={handlePublish}
              disabled={publishing}
              title="Opublikuj zmiany na demo"
            >
              {publishing
                ? <Loader2 size={15} className="bldr-spin" />
                : publishOk
                ? <Check size={15} />
                : <Upload size={15} />}
              <span>{publishing ? "Publikuję…" : publishOk ? "Opublikowano!" : "Publikuj"}</span>
            </button>
          )}
        </div>
      </header>

      {showTemplatePicker && (
        <TemplatePicker
          onSelect={handleTemplateSelect}
          onClose={() => setShowTemplatePicker(false)}
        />
      )}
    </>
  );
}
