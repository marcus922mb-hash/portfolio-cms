"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Copy, Download, Trash2, RefreshCw, User } from "lucide-react";
import {
  deleteToolOutputAction,
  updateToolOutputAction,
  assignToolOutputToClientAction,
  type AIToolOutput,
} from "@/features/ai-hub/actions/admin-tool-actions";
import { TOOL_CATEGORIES } from "@/features/ai-hub/tools";

type ClientOption = { id: string; label: string };

const STATUS_LABELS: Record<AIToolOutput["status"], string> = {
  new: "Nowy",
  saved: "Zapisany",
  archived: "Archiwalny",
};

const STATUS_BADGE: Record<AIToolOutput["status"], string> = {
  new: "ai-badge--pending",
  saved: "ai-badge--completed",
  archived: "crm-badge--archived",
};

type Props = {
  outputs: AIToolOutput[];
  clients: ClientOption[];
};

export function AdminResultsTable({ outputs, clients }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  async function handleDelete(id: string) {
    if (!confirm("Usunąć ten wynik?")) return;
    startTransition(async () => {
      await deleteToolOutputAction(id);
      router.refresh();
    });
  }

  async function handleStatusChange(id: string, status: AIToolOutput["status"]) {
    startTransition(async () => {
      await updateToolOutputAction(id, { status });
      router.refresh();
    });
  }

  async function handleClientAssign(id: string, clientId: string) {
    startTransition(async () => {
      await assignToolOutputToClientAction(id, clientId || null);
      router.refresh();
    });
  }

  async function handleCopy(text: string, id: string) {
    await navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 1800);
  }

  function handleDownload(output: AIToolOutput) {
    const blob = new Blob([output.output_text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${output.tool_id}-${output.id.slice(0, 8)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  if (!outputs.length) {
    return (
      <div className="crm-empty-state">
        <RefreshCw size={32} strokeWidth={1.2} />
        <p>Brak wygenerowanych wyników. Przejdź do narzędzi i wygeneruj pierwszy wynik.</p>
        <Link href="/panel/ai/narzedzia" className="crm-btn crm-btn--sm crm-btn--primary">
          Otwórz narzędzia →
        </Link>
      </div>
    );
  }

  return (
    <div className="crm-table-wrap">
      <table className="crm-table">
        <thead>
          <tr>
            <th>Narzędzie</th>
            <th>Kategoria</th>
            <th>Provider / Model</th>
            <th>Data</th>
            <th>Status</th>
            <th>Klient</th>
            <th style={{ textAlign: "right" }}>Akcje</th>
          </tr>
        </thead>
        <tbody>
          {outputs.map((o) => (
            <>
              <tr
                key={o.id}
                className="crm-table-row"
                style={{ cursor: "pointer" }}
                onClick={() => setExpandedId(expandedId === o.id ? null : o.id)}
              >
                <td>
                  <span style={{ fontWeight: 600, fontSize: ".8rem" }}>
                    {o.label || o.tool_name}
                  </span>
                  {o.label && (
                    <div className="crm-td-muted" style={{ fontSize: ".65rem" }}>{o.tool_name}</div>
                  )}
                </td>
                <td className="crm-td-muted" style={{ fontSize: ".72rem" }}>
                  {TOOL_CATEGORIES[o.tool_category] ?? o.tool_category}
                </td>
                <td>
                  <span style={{ fontSize: ".72rem", fontWeight: 560 }}>{o.provider}</span>
                  <div className="crm-td-muted" style={{ fontSize: ".62rem" }}>{o.model}</div>
                </td>
                <td className="crm-td-muted" style={{ whiteSpace: "nowrap", fontSize: ".72rem" }}>
                  {new Date(o.created_at).toLocaleString("pl-PL", {
                    day: "2-digit", month: "2-digit", year: "2-digit",
                    hour: "2-digit", minute: "2-digit",
                  })}
                </td>
                <td onClick={(e) => e.stopPropagation()}>
                  <select
                    value={o.status}
                    onChange={(e) => handleStatusChange(o.id, e.target.value as AIToolOutput["status"])}
                    className="pa-status-select"
                    disabled={isPending}
                  >
                    {Object.entries(STATUS_LABELS).map(([v, l]) => (
                      <option key={v} value={v}>{l}</option>
                    ))}
                  </select>
                </td>
                <td onClick={(e) => e.stopPropagation()}>
                  <select
                    value={o.client_id ?? ""}
                    onChange={(e) => handleClientAssign(o.id, e.target.value)}
                    className="pa-status-select"
                    disabled={isPending}
                  >
                    <option value="">— Brak klienta —</option>
                    {clients.map((c) => (
                      <option key={c.id} value={c.id}>{c.label}</option>
                    ))}
                  </select>
                </td>
                <td
                  style={{ textAlign: "right", whiteSpace: "nowrap" }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    type="button"
                    title="Kopiuj"
                    className="crm-icon-btn"
                    onClick={() => handleCopy(o.output_text, o.id)}
                  >
                    <Copy size={13} />
                    {copied === o.id ? "✓" : ""}
                  </button>
                  <button
                    type="button"
                    title="Pobierz"
                    className="crm-icon-btn"
                    onClick={() => handleDownload(o)}
                  >
                    <Download size={13} />
                  </button>
                  <Link
                    href={`/panel/ai/narzedzia/${o.tool_id}`}
                    title="Regeneruj"
                    className="crm-icon-btn"
                  >
                    <RefreshCw size={13} />
                  </Link>
                  <button
                    type="button"
                    title="Usuń"
                    className="crm-icon-btn crm-icon-btn--danger"
                    onClick={() => handleDelete(o.id)}
                    disabled={isPending}
                  >
                    <Trash2 size={13} />
                  </button>
                </td>
              </tr>

              {/* Expanded row */}
              {expandedId === o.id && (
                <tr key={`${o.id}-expanded`} className="pa-expanded-row">
                  <td colSpan={7}>
                    <div className="pa-expanded-content">
                      <div className="pa-expanded-text">
                        <pre>{o.output_text}</pre>
                      </div>
                      {Object.keys(o.input_values).length > 0 && (
                        <details className="pa-expanded-inputs">
                          <summary>Dane wejściowe</summary>
                          <div className="pa-inputs-grid">
                            {Object.entries(o.input_values)
                              .filter(([key]) => !key.toLowerCase().includes("encrypted"))
                              .map(([k, v]) => (
                              v ? (
                                <div key={k} className="pa-input-row">
                                  <span className="crm-td-muted">{k}</span>
                                  <span>{String(v)}</span>
                                </div>
                              ) : null
                            ))}
                          </div>
                        </details>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </>
          ))}
        </tbody>
      </table>
    </div>
  );
}
