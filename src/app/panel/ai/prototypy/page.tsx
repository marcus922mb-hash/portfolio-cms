import Link from "next/link";
import { Code, Download, ExternalLink } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import type { AIToolOutput } from "@/features/ai-hub/actions/admin-tool-actions";

async function getHtmlPrototypes(): Promise<AIToolOutput[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("ai_tool_outputs")
    .select("*")
    .eq("tool_id", "generator-html-prototypu")
    .order("created_at", { ascending: false })
    .limit(50);
  return (data ?? []) as AIToolOutput[];
}

function extractTitle(html: string): string {
  const m = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  return m ? m[1] : "Bez tytułu";
}

export default async function PrototypyPage() {
  const prototypes = await getHtmlPrototypes();

  return (
    <div className="crm-page">
      <div className="crm-page-header">
        <div>
          <h1 className="crm-page-title">Prototypy HTML</h1>
          <p className="crm-page-subtitle">Wygenerowane strony gotowe do podglądu i pobrania</p>
        </div>
        <Link href="/panel/ai/narzedzia/generator-html-prototypu" className="crm-btn crm-btn--primary">
          <Code size={14} />
          Nowy prototyp
        </Link>
      </div>

      {prototypes.length === 0 ? (
        <div className="crm-empty-state">
          <Code size={28} />
          <p>Brak prototypów. Wygeneruj pierwszą stronę HTML.</p>
          <Link href="/panel/ai/narzedzia/generator-html-prototypu" className="crm-btn crm-btn--primary" style={{ marginTop: "1rem" }}>
            Generuj prototyp
          </Link>
        </div>
      ) : (
        <div className="pa-proto-grid">
          {prototypes.map((p) => {
            const title = p.label || extractTitle(p.output_text);
            const inputs = p.input_values as Record<string, string>;
            const isHtml = p.output_text.includes("<!DOCTYPE") || p.output_text.includes("<html");
            const dataUrl = isHtml
              ? `data:text/html;charset=utf-8,${encodeURIComponent(p.output_text)}`
              : null;

            return (
              <div key={p.id} className="pa-proto-card">
                {isHtml ? (
                  <div className="pa-proto-preview">
                    <iframe
                      srcDoc={p.output_text}
                      sandbox="allow-scripts"
                      title={title}
                      className="pa-proto-iframe"
                    />
                  </div>
                ) : (
                  <div className="pa-proto-preview pa-proto-preview--empty">
                    <Code size={24} />
                  </div>
                )}

                <div className="pa-proto-body">
                  <p className="pa-proto-title">{title}</p>
                  {inputs.firma && <p className="pa-proto-meta">{inputs.firma} · {inputs.typ ?? ""}</p>}
                  <p className="pa-proto-date">{new Date(p.created_at).toLocaleDateString("pl-PL")}</p>

                  <div className="pa-proto-actions">
                    {dataUrl && (
                      <>
                        <a href={dataUrl} target="_blank" rel="noreferrer" className="crm-icon-btn" title="Otwórz podgląd">
                          <ExternalLink size={13} />
                        </a>
                        <a href={dataUrl} download={`prototyp-${p.id.slice(0, 8)}.html`} className="crm-icon-btn" title="Pobierz HTML">
                          <Download size={13} />
                        </a>
                      </>
                    )}
                    <Link href="/panel/ai/narzedzia/generator-html-prototypu" className="crm-btn crm-btn--sm">
                      Nowy
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
