"use client";

import { useState, useTransition, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Copy, Download, RefreshCw, Save, CheckCircle } from "lucide-react";
import {
  runAdminToolAction,
  updateOutputTextAction,
  updateToolOutputAction,
  type AIToolOutput,
} from "@/features/ai-hub/actions/admin-tool-actions";
import type { ToolField } from "@/features/ai-hub/types";

type SerializableTool = {
  id: string;
  fields: ToolField[];
};

type Step = "form" | "loading" | "result";

export function AdminToolWorkspace({ tool }: { tool: SerializableTool }) {
  const router = useRouter();
  const [step, setStep] = useState<Step>("form");
  const [values, setValues] = useState<Record<string, string>>({});
  const [output, setOutput] = useState<AIToolOutput | null>(null);
  const [editedText, setEditedText] = useState("");
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [copied, setCopied] = useState(false);

  function handleChange(key: string, val: string) {
    setValues((prev) => ({ ...prev, [key]: val }));
  }

  function handleGenerate(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setStep("loading");
    startTransition(async () => {
      const res = await runAdminToolAction(tool.id, values);
      if (!res.success) {
        setError(res.error);
        setStep("form");
        return;
      }
      setOutput(res.output);
      setEditedText(res.output.output_text);
      setStep("result");
    });
  }

  const handleSaveEdit = useCallback(async () => {
    if (!output) return;
    const res = await updateOutputTextAction(output.id, editedText);
    if (res.success) {
      setSaved(true);
      setEditing(false);
      setTimeout(() => setSaved(false), 2000);
      router.refresh();
    }
  }, [output, editedText, router]);

  const handleStatusChange = useCallback(async (status: AIToolOutput["status"]) => {
    if (!output) return;
    await updateToolOutputAction(output.id, { status });
    setOutput((prev) => prev ? { ...prev, status } : prev);
    router.refresh();
  }, [output, router]);

  const handleCopy = useCallback(async () => {
    const text = editing ? editedText : (output?.output_text ?? "");
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }, [editing, editedText, output]);

  const handleDownload = useCallback(() => {
    const text = output?.output_text ?? "";
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${tool.id}-${output?.id?.slice(0, 8) ?? "wynik"}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }, [tool.id, output]);

  return (
    <div>
      {/* FORM */}
      {(step === "form" || step === "loading") && (
        <form onSubmit={handleGenerate} className="pa-form">
          {tool.fields.map((field) => (
            <div key={field.key} className="pa-field">
              <label htmlFor={field.key}>
                {field.label}
                {field.required && <span className="pa-required">*</span>}
              </label>
              {field.type === "textarea" ? (
                <textarea
                  id={field.key}
                  placeholder={field.placeholder}
                  rows={field.rows ?? 3}
                  value={values[field.key] ?? ""}
                  onChange={(e) => handleChange(field.key, e.target.value)}
                  required={field.required}
                />
              ) : field.type === "select" ? (
                <select
                  id={field.key}
                  value={values[field.key] ?? ""}
                  onChange={(e) => handleChange(field.key, e.target.value)}
                >
                  <option value="">— Wybierz —</option>
                  {field.options?.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              ) : (
                <input
                  id={field.key}
                  type="text"
                  placeholder={field.placeholder}
                  value={values[field.key] ?? ""}
                  onChange={(e) => handleChange(field.key, e.target.value)}
                  required={field.required}
                />
              )}
            </div>
          ))}

          {error && <p className="pa-error">{error}</p>}

          <button
            type="submit"
            className="crm-btn crm-btn--primary"
            disabled={isPending}
            style={{ width: "100%", justifyContent: "center" }}
          >
            {step === "loading" ? (
              <><RefreshCw size={13} className="pa-spin" /> Generuję…</>
            ) : (
              "Generuj →"
            )}
          </button>
        </form>
      )}

      {/* RESULT */}
      {step === "result" && output && (
        <div className="pa-result-wrap">
          {/* Header toolbar */}
          <div className="pa-result-toolbar">
            <div className="pa-result-meta">
              <span className="crm-badge crm-badge--sm ai-badge--completed">
                {output.provider} · {output.model}
              </span>
              <span className="pa-result-status">
                Status:{" "}
                <select
                  value={output.status}
                  onChange={(e) => handleStatusChange(e.target.value as AIToolOutput["status"])}
                  className="pa-status-select"
                >
                  <option value="new">Nowy</option>
                  <option value="saved">Zapisany</option>
                  <option value="archived">Archiwalny</option>
                </select>
              </span>
            </div>
            <div className="pa-result-actions">
              <button
                type="button"
                onClick={() => { setEditing(!editing); }}
                className={`crm-btn crm-btn--sm ${editing ? "crm-btn--primary" : ""}`}
              >
                {editing ? "Podgląd" : "Edytuj"}
              </button>
              {editing && (
                <button
                  type="button"
                  onClick={handleSaveEdit}
                  className="crm-btn crm-btn--sm crm-btn--primary"
                  disabled={isPending}
                >
                  <Save size={12} />{saved ? "Zapisano!" : "Zapisz"}
                </button>
              )}
              <button type="button" onClick={handleCopy} className="crm-btn crm-btn--sm">
                <Copy size={12} />{copied ? "Skopiowano!" : "Kopiuj"}
              </button>
              <button type="button" onClick={handleDownload} className="crm-btn crm-btn--sm">
                <Download size={12} />Pobierz
              </button>
              <button
                type="button"
                onClick={() => { setStep("form"); setOutput(null); }}
                className="crm-btn crm-btn--sm"
              >
                <RefreshCw size={12} />Nowe
              </button>
            </div>
          </div>

          {/* Body */}
          {editing ? (
            <textarea
              className="pa-editor"
              value={editedText}
              onChange={(e) => setEditedText(e.target.value)}
              rows={30}
            />
          ) : (
            <div className="pa-result-body">
              <AdminResultRenderer text={output.output_text} />
            </div>
          )}

          {/* Footer with link to wyniki */}
          <div className="pa-result-footer">
            {saved && (
              <span className="pa-saved-hint">
                <CheckCircle size={12} /> Zapisano — wynik dostępny w sekcji Wyniki
              </span>
            )}
            <a href="/panel/ai/wyniki" className="crm-action-link" style={{ marginLeft: "auto" }}>
              Wszystkie wyniki →
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

function AdminResultRenderer({ text }: { text: string }) {
  const lines = text.split("\n");
  return (
    <div className="pa-prose">
      {lines.map((line, i) => {
        if (line.startsWith("## ")) return <h2 key={i}>{line.slice(3)}</h2>;
        if (line.startsWith("### ")) return <h3 key={i}>{line.slice(4)}</h3>;
        if (line.trim() === "---") return <hr key={i} />;
        if (line.trim() === "") return <br key={i} />;
        if (line.includes("**")) {
          const parts = line.split(/(\*\*[^*]+\*\*)/g);
          return (
            <p key={i}>
              {parts.map((part, j) =>
                part.startsWith("**") && part.endsWith("**")
                  ? <strong key={j}>{part.slice(2, -2)}</strong>
                  : part
              )}
            </p>
          );
        }
        return <p key={i}>{line}</p>;
      })}
    </div>
  );
}
