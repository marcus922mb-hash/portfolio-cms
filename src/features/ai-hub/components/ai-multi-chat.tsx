"use client";

import { useState, useRef, useTransition, useEffect } from "react";
import { Send, RotateCcw, Settings2, Trash2, Copy, Check } from "lucide-react";
import { multiChatAction } from "@/features/ai-hub/actions/multi-chat-action";
import type { ChatMessage, ModelConfig, ModelResponse } from "@/features/ai-hub/actions/multi-chat-action";

const AVAILABLE_MODELS: ModelConfig[] = [
  { id: "openrouter:llama70b", provider: "openrouter", model: "meta-llama/llama-3.3-70b-instruct:free", label: "Llama 3.3 70B" },
  { id: "gemini:flash", provider: "gemini", model: "gemini-1.5-flash", label: "Gemini 1.5 Flash" },
  { id: "gemini:pro", provider: "gemini", model: "gemini-1.5-pro", label: "Gemini 1.5 Pro" },
  { id: "groq:llama8b", provider: "groq", model: "llama-3.1-8b-instant", label: "Llama 3.1 8B" },
  { id: "groq:llama70b", provider: "groq", model: "llama-3.3-70b-versatile", label: "Llama 3.3 70B (Groq)" },
  { id: "groq:mixtral", provider: "groq", model: "mixtral-8x7b-32768", label: "Mixtral 8x7B" },
  { id: "cloudflare:mistral", provider: "cloudflare", model: "@cf/mistral/mistral-7b-instruct-v0.1", label: "Mistral 7B (CF)" },
];

const PROVIDER_COLORS: Record<string, string> = {
  openrouter: "#6366f1",
  gemini: "#1a73e8",
  groq: "#f97316",
  cloudflare: "#f6821f",
  local: "#10b981",
};

const DEFAULT_SYSTEM = "Jesteś pomocnym asystentem. Odpowiadaj po polsku, chyba że użytkownik pisze w innym języku.";

const QUICK_TASKS = [
  {
    category: "Treści marketingowe",
    items: [
      { label: "Slogan firmy", prompt: "Stwórz 5 chwytliwych sloganów dla firmy: [WPISZ BRANŻĘ I NAZWĘ FIRMY]. Każdy slogan max 8 słów." },
      { label: "Post na Instagram", prompt: "Napisz angażujący post na Instagram dla [BRANŻA]. Dodaj 10 hashtagów. Użyj emoji." },
      { label: "Post na LinkedIn", prompt: "Napisz profesjonalny post na LinkedIn o [TEMAT]. Długość: 3 akapity. Styl: ekspercki, angażujący." },
      { label: "Opis firmy", prompt: "Napisz profesjonalny opis firmy [NAZWA] z branży [BRANŻA] w 3 wersjach: krótki (2 zdania), średni (paragraph), długi (3 paragrafy)." },
    ],
  },
  {
    category: "E-maile",
    items: [
      { label: "E-mail do klienta", prompt: "Napisz profesjonalny e-mail do klienta z podziękowaniem za współpracę i zaproszeniem do kolejnego projektu. Firma: [NAZWA FIRMY]." },
      { label: "Oferta handlowa", prompt: "Napisz e-mail z ofertą handlową dla potencjalnego klienta z branży [BRANŻA]. Usługa: [USŁUGA]. Ton: profesjonalny ale ciepły." },
      { label: "Follow-up", prompt: "Napisz krótki e-mail follow-up po spotkaniu z potencjalnym klientem. Spotkanie dotyczyło: [TEMAT]. Cel: przybliżenie do decyzji." },
      { label: "Reaktywacja klienta", prompt: "Napisz e-mail do klienta, który nie kontaktował się od 6 miesięcy. Cel: wznowienie współpracy. Branża: [BRANŻA]." },
    ],
  },
  {
    category: "Strony www",
    items: [
      { label: "Teksty hero", prompt: "Napisz 3 wersje tekstów na sekcję hero strony www dla firmy z branży [BRANŻA]. Każda wersja: tytuł H1 (max 8 słów) + podtytuł (1-2 zdania) + tekst przycisku CTA." },
      { label: "Opis usług", prompt: "Napisz opisy 5 głównych usług dla firmy [BRANŻA]. Każdy opis: nagłówek + 2-3 zdania. Styl: przekonujący, korzyści-centryczny." },
      { label: "O nas", prompt: "Napisz sekcję 'O nas' dla studia/firmy z branży [BRANŻA]. Długość: 150-200 słów. Podkreśl: doświadczenie, wartości, podejście do klienta." },
      { label: "FAQ", prompt: "Stwórz 8 pytań FAQ dla firmy z branży [BRANŻA] wraz z odpowiedziami. Pytania powinny dotyczyć: procesu, cen, czasu realizacji, gwarancji, wsparcia." },
    ],
  },
  {
    category: "SEO",
    items: [
      { label: "Meta tytuł i opis", prompt: "Napisz 3 wersje meta tytułu (max 60 znaków) i meta opisu (max 155 znaków) dla strony firmy z branży [BRANŻA] z frazą kluczową [FRAZA]." },
      { label: "Artykuł blogowy", prompt: "Napisz plan artykułu blogowego SEO na temat: [TEMAT]. Uwzględnij: tytuł, wstęp, 5 nagłówków H2 z krótkim opisem contentu, zakończenie z CTA." },
      { label: "Frazy kluczowe", prompt: "Zaproponuj 20 fraz kluczowych (long-tail) dla firmy z branży [BRANŻA] w mieście [MIASTO]. Podziel na: główne, lokalne, pytania." },
    ],
  },
];

type SessionMessage = {
  role: "user" | "assistant";
  content: string;
  responses?: ModelResponse[];
};

function ResponseCard({
  response,
  loading,
}: {
  response?: ModelResponse;
  loading?: boolean;
}) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    if (!response?.text) return;
    await navigator.clipboard.writeText(response.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  const color = PROVIDER_COLORS[response?.provider ?? ""] ?? "#888";

  return (
    <div className="aichat-response-card">
      <div className="aichat-response-header" style={{ borderLeftColor: color }}>
        <span className="aichat-response-model" style={{ color }}>
          {response?.label ?? "…"}
        </span>
        {response && !loading && (
          <div className="aichat-response-meta">
            <span className="aichat-response-time">{response.durationMs}ms</span>
            <button className="aichat-copy-btn" onClick={copy} title="Kopiuj">
              {copied ? <Check size={11} /> : <Copy size={11} />}
            </button>
          </div>
        )}
      </div>
      <div className="aichat-response-body">
        {loading ? (
          <div className="aichat-typing">
            <span /><span /><span />
          </div>
        ) : response?.error ? (
          <p className="aichat-response-error">{response.error}</p>
        ) : (
          <p>{response?.text}</p>
        )}
      </div>
    </div>
  );
}

export function AiMultiChat() {
  const [selectedIds, setSelectedIds] = useState<string[]>(["gemini:flash", "groq:llama8b"]);
  const [showTasks, setShowTasks] = useState(false);
  const [systemPrompt, setSystemPrompt] = useState(DEFAULT_SYSTEM);
  const [showSettings, setShowSettings] = useState(false);
  const [input, setInput] = useState("");
  const [session, setSession] = useState<SessionMessage[]>([]);
  const [isPending, startTransition] = useTransition();
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const selectedModels = AVAILABLE_MODELS.filter((m) => selectedIds.includes(m.id));

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [session, isPending]);

  function toggleModel(id: string) {
    setSelectedIds((prev) =>
      prev.includes(id)
        ? prev.length > 1 ? prev.filter((x) => x !== id) : prev
        : prev.length < 4 ? [...prev, id] : prev
    );
  }

  function handleSubmit(e?: React.FormEvent) {
    e?.preventDefault();
    const text = input.trim();
    if (!text || isPending || selectedModels.length === 0) return;

    const userMessage: ChatMessage = { role: "user", content: text };
    const history: ChatMessage[] = [
      ...session.flatMap((m) =>
        m.role === "user"
          ? [{ role: "user" as const, content: m.content }]
          : []
      ),
      userMessage,
    ];

    setSession((prev) => [...prev, { role: "user", content: text }]);
    setInput("");

    startTransition(async () => {
      const responses = await multiChatAction(history, selectedModels, systemPrompt);
      setSession((prev) => [
        ...prev,
        { role: "assistant", content: "", responses },
      ]);
    });
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  }

  function clearSession() {
    if (session.length === 0) return;
    if (confirm("Wyczyścić całą rozmowę?")) setSession([]);
  }

  const cols = selectedModels.length === 1 ? 1 : selectedModels.length <= 2 ? 2 : selectedModels.length === 3 ? 3 : 4;

  return (
    <div className="aichat-shell">
      {/* Toolbar */}
      <div className="aichat-toolbar">
        <div className="aichat-model-selector">
          {AVAILABLE_MODELS.map((m) => {
            const active = selectedIds.includes(m.id);
            return (
              <button
                key={m.id}
                onClick={() => toggleModel(m.id)}
                className={`aichat-model-toggle${active ? " is-active" : ""}`}
                style={active ? { borderColor: PROVIDER_COLORS[m.provider], color: PROVIDER_COLORS[m.provider] } : {}}
                title={active ? "Odznacz" : selectedIds.length >= 4 ? "Maksymalnie 4 modele" : "Dodaj model"}
              >
                {m.label}
              </button>
            );
          })}
        </div>
        <div className="aichat-toolbar-actions">
          <button
            onClick={() => { setShowTasks((s) => !s); setShowSettings(false); }}
            className={`aichat-icon-btn aichat-tasks-btn${showTasks ? " is-active" : ""}`}
            title="Szybkie zadania"
          >
            Szybkie zadania ▾
          </button>
          <button
            onClick={() => { setShowSettings((s) => !s); setShowTasks(false); }}
            className={`aichat-icon-btn${showSettings ? " is-active" : ""}`}
            title="Ustawienia systemu"
          >
            <Settings2 size={14} />
          </button>
          <button onClick={clearSession} className="aichat-icon-btn" title="Wyczyść rozmowę">
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* Quick tasks panel */}
      {showTasks && (
        <div className="aichat-tasks-panel">
          {QUICK_TASKS.map((cat) => (
            <div key={cat.category} className="aichat-tasks-group">
              <p className="aichat-tasks-group-label">{cat.category}</p>
              <div className="aichat-tasks-group-items">
                {cat.items.map((task) => (
                  <button
                    key={task.label}
                    className="aichat-task-btn"
                    onClick={() => {
                      setInput(task.prompt);
                      setShowTasks(false);
                      textareaRef.current?.focus();
                    }}
                  >
                    {task.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* System prompt */}
      {showSettings && (
        <div className="aichat-settings">
          <label className="aichat-settings-label">Instrukcja systemowa (system prompt)</label>
          <textarea
            className="aichat-settings-textarea"
            value={systemPrompt}
            onChange={(e) => setSystemPrompt(e.target.value)}
            rows={3}
          />
          <button className="aichat-settings-reset" onClick={() => setSystemPrompt(DEFAULT_SYSTEM)}>
            Przywróć domyślną
          </button>
        </div>
      )}

      {/* Chat area */}
      <div className="aichat-messages">
        {session.length === 0 && (
          <div className="aichat-empty">
            <p className="aichat-empty-title">Multi-model AI Chat</p>
            <p className="aichat-empty-sub">
              Wybierz do 4 modeli i zadaj pytanie — odpowiedzi pojawią się równolegle.
            </p>
            <div className="aichat-empty-examples">
              {[
                "Napisz mi e-mail do klienta z podziękowaniem za współpracę",
                "Stwórz chwytliwy slogan dla agencji marketingowej",
                "Wytłumacz mi co to jest SEO w 3 zdaniach",
                "Zaproponuj 5 pomysłów na posty na Instagram dla salonu fryzjerskiego",
              ].map((ex) => (
                <button key={ex} className="aichat-example" onClick={() => { setInput(ex); textareaRef.current?.focus(); }}>
                  {ex}
                </button>
              ))}
            </div>
          </div>
        )}

        {session.map((msg, i) => (
          <div key={i} className={`aichat-turn aichat-turn--${msg.role}`}>
            {msg.role === "user" ? (
              <div className="aichat-user-bubble">{msg.content}</div>
            ) : (
              <div
                className="aichat-responses-grid"
                style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
              >
                {isPending && i === session.length - 1
                  ? selectedModels.map((m) => (
                      <ResponseCard key={m.id} response={{ modelId: m.id, label: m.label, provider: m.provider, model: m.model, text: "", durationMs: 0 }} loading />
                    ))
                  : msg.responses?.map((r) => (
                      <ResponseCard key={r.modelId} response={r} />
                    ))}
              </div>
            )}
          </div>
        ))}

        {isPending && session[session.length - 1]?.role !== "assistant" && (
          <div className="aichat-turn aichat-turn--assistant">
            <div
              className="aichat-responses-grid"
              style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
            >
              {selectedModels.map((m) => (
                <ResponseCard key={m.id} response={{ modelId: m.id, label: m.label, provider: m.provider, model: m.model, text: "", durationMs: 0 }} loading />
              ))}
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="aichat-input-row">
        <textarea
          ref={textareaRef}
          className="aichat-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Zadaj pytanie… (Enter — wyślij, Shift+Enter — nowa linia)"
          rows={2}
          disabled={isPending}
        />
        <div className="aichat-input-actions">
          <span className="aichat-models-count">
            {selectedModels.length} {selectedModels.length === 1 ? "model" : "modele"}
          </span>
          <button
            type="submit"
            className="aichat-send-btn"
            disabled={isPending || !input.trim()}
          >
            {isPending ? <RotateCcw size={15} className="aichat-spin" /> : <Send size={15} />}
            {isPending ? "Generuję…" : "Wyślij"}
          </button>
        </div>
      </form>
    </div>
  );
}
