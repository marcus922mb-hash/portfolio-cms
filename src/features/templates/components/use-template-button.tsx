"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Loader2, Sparkles, X } from "lucide-react";
import { createFromTemplate } from "@/features/templates/actions/create-from-template-action";
import { generateFromTemplateAction } from "@/features/templates/actions/generate-from-template-action";

export function UseTemplateButton({ templateId, templateName }: { templateId: string; templateName?: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [genError, setGenError] = useState("");
  const [form, setForm] = useState({
    companyName: "",
    companyDescription: "",
    services: "",
    city: "",
    tone: "profesjonalny, ciepły",
  });

  function openInBuilder() {
    setError("");
    startTransition(async () => {
      const result = await createFromTemplate(templateId);
      if (!result.success) {
        setError(result.error);
        return;
      }
      router.push(`/panel/builder/${result.demoId}`);
    });
  }

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault();
    setGenError("");
    setGenerating(true);
    try {
      const result = await generateFromTemplateAction(templateId, form);
      if (!result.success) {
        setGenError(result.error);
        return;
      }
      setShowModal(false);
      router.push(`/panel/builder/${result.demoId}`);
    } catch {
      setGenError("Nieoczekiwany błąd. Spróbuj ponownie.");
    } finally {
      setGenerating(false);
    }
  }

  return (
    <>
      <div className="tpl-detail-actions">
        <button type="button" className="tpl-use-button" onClick={openInBuilder} disabled={isPending || generating}>
          {isPending ? <Loader2 size={15} className="bldr-spin" /> : <ArrowRight size={15} />}
          {isPending ? "Tworzę szkic..." : "Otwórz w Builderze"}
        </button>
        <button
          type="button"
          className="tpl-ai-button"
          onClick={() => { setShowModal(true); setGenError(""); }}
          disabled={isPending || generating}
        >
          <Sparkles size={15} />
          Generuj z szablonu
        </button>
        {error && <p className="tpl-action-error">{error}</p>}
      </div>

      {showModal && (
        <div className="tpl-modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) setShowModal(false); }}>
          <div className="tpl-modal">
            <div className="tpl-modal-header">
              <div>
                <span className="tpl-modal-kicker"><Sparkles size={13} /> Generuj z szablonu</span>
                <h2 className="tpl-modal-title">{templateName ?? "Generuj stronę"}</h2>
                <p className="tpl-modal-sub">AI wygeneruje treści dopasowane do Twojej firmy</p>
              </div>
              <button type="button" className="tpl-modal-close" onClick={() => setShowModal(false)} aria-label="Zamknij">
                <X size={18} />
              </button>
            </div>

            <form className="tpl-modal-form" onSubmit={handleGenerate}>
              <div className="tpl-modal-field">
                <label htmlFor="gen-company-name">Nazwa firmy</label>
                <input
                  id="gen-company-name"
                  type="text"
                  placeholder="np. Studio Kwiatowe Ania"
                  value={form.companyName}
                  onChange={(e) => setForm((f) => ({ ...f, companyName: e.target.value }))}
                  disabled={generating}
                />
              </div>

              <div className="tpl-modal-field">
                <label htmlFor="gen-description">Opis firmy (opcjonalnie)</label>
                <textarea
                  id="gen-description"
                  placeholder="Czym się zajmujesz, kim są Twoi klienci, co Cię wyróżnia..."
                  value={form.companyDescription}
                  onChange={(e) => setForm((f) => ({ ...f, companyDescription: e.target.value }))}
                  disabled={generating}
                  rows={3}
                />
              </div>

              <div className="tpl-modal-field">
                <label htmlFor="gen-services">Usługi / Produkty (opcjonalnie)</label>
                <input
                  id="gen-services"
                  type="text"
                  placeholder="np. bukiety ślubne, dekoracje, warsztaty florystyczne"
                  value={form.services}
                  onChange={(e) => setForm((f) => ({ ...f, services: e.target.value }))}
                  disabled={generating}
                />
                <span className="tpl-modal-hint">Oddziel przecinkami</span>
              </div>

              <div className="tpl-modal-field-row">
                <div className="tpl-modal-field">
                  <label htmlFor="gen-city">Miasto (opcjonalnie)</label>
                  <input
                    id="gen-city"
                    type="text"
                    placeholder="np. Kraków"
                    value={form.city}
                    onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
                    disabled={generating}
                  />
                </div>
                <div className="tpl-modal-field">
                  <label htmlFor="gen-tone">Ton komunikacji</label>
                  <select
                    id="gen-tone"
                    value={form.tone}
                    onChange={(e) => setForm((f) => ({ ...f, tone: e.target.value }))}
                    disabled={generating}
                  >
                    <option value="profesjonalny, ciepły">Profesjonalny i ciepły</option>
                    <option value="formalny, rzeczowy">Formalny i rzeczowy</option>
                    <option value="przyjazny, luźny">Przyjazny i luźny</option>
                    <option value="luksusowy, elegancki">Luksusowy i elegancki</option>
                    <option value="energiczny, dynamiczny">Energiczny i dynamiczny</option>
                    <option value="osobisty, autentyczny">Osobisty i autentyczny</option>
                  </select>
                </div>
              </div>

              {genError && <p className="tpl-action-error">{genError}</p>}

              {generating && (
                <div className="tpl-modal-progress">
                  <div className="tpl-modal-progress-bar">
                    <div className="tpl-modal-progress-fill" />
                  </div>
                  <span>AI generuje treści dla Twojej strony...</span>
                </div>
              )}

              <div className="tpl-modal-footer">
                <button type="button" className="tpl-modal-cancel" onClick={() => setShowModal(false)} disabled={generating}>
                  Anuluj
                </button>
                <button type="submit" className="tpl-modal-submit" disabled={generating}>
                  {generating ? (
                    <><Loader2 size={14} className="bldr-spin" /> Generuję...</>
                  ) : (
                    <><Sparkles size={14} /> Generuj stronę</>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
