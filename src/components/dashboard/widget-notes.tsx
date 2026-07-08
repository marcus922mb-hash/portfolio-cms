"use client";

import { useState, useRef } from "react";
import { FileText } from "lucide-react";

const STORAGE_KEY = "panel_notes";

export function WidgetNotes() {
  const [value, setValue] = useState(() => {
    try { return localStorage.getItem(STORAGE_KEY) ?? ""; } catch { return ""; }
  });
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const next = e.target.value;
    setValue(next);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      try { localStorage.setItem(STORAGE_KEY, next); } catch {}
    }, 600);
  }

  return (
    <div className="panel-widget">
      <div className="panel-widget-header">
        <FileText size={13} style={{ color: "rgba(201,169,110,.5)" }} aria-hidden="true" />
        <span className="panel-widget-title">Notatki</span>
      </div>
      <div className="panel-widget-body">
        <textarea
          className="panel-notes-textarea"
          placeholder="Wpisz notatki..."
          value={value}
          onChange={handleChange}
          aria-label="Notatki"
        />
      </div>
    </div>
  );
}
