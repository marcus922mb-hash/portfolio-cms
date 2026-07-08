"use client";

import { useState, useTransition } from "react";
import { RefreshCw, ChevronDown, ChevronUp } from "lucide-react";
import {
  regenerateSectionAction,
  SECTION_LABELS,
  type SectionKey,
} from "@/features/ai/actions/regenerate-section-action";

const SECTIONS = Object.keys(SECTION_LABELS) as SectionKey[];

export function SectionRegeneratePanel({ demoId }: { demoId: string }) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<SectionKey | null>(null);
  const [done, setDone] = useState<SectionKey | null>(null);
  const [error, setError] = useState<string>("");
  const [isPending, startTransition] = useTransition();

  function handleRegen(section: SectionKey) {
    setActive(section);
    setError("");
    setDone(null);
    startTransition(async () => {
      const res = await regenerateSectionAction(demoId, section);
      setActive(null);
      if (res.success) {
        setDone(res.section);
        setTimeout(() => setDone(null), 2500);
      } else {
        setError(res.error);
      }
    });
  }

  return (
    <div className="pa-section-panel">
      <button
        type="button"
        className="pa-section-panel-toggle"
        onClick={() => setOpen(!open)}
      >
        <RefreshCw size={13} />
        <span>Regeneruj sekcję</span>
        {open ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
      </button>

      {open && (
        <div className="pa-section-grid">
          {SECTIONS.map((sec) => {
            const isActive = active === sec && isPending;
            const isDone = done === sec;
            return (
              <button
                key={sec}
                type="button"
                className={`pa-section-btn ${isActive ? "is-loading" : ""} ${isDone ? "is-done" : ""}`}
                onClick={() => handleRegen(sec)}
                disabled={isPending}
              >
                {isActive ? (
                  <RefreshCw size={11} className="pa-spin" />
                ) : isDone ? (
                  "✓"
                ) : (
                  <RefreshCw size={11} />
                )}
                {SECTION_LABELS[sec]}
              </button>
            );
          })}
        </div>
      )}

      {error && <p className="pa-error" style={{ marginTop: ".5rem" }}>{error}</p>}
    </div>
  );
}
