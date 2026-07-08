"use client";

import { useRef, useState, useTransition } from "react";
import {
  createDeployableChatbotAction,
  type CreateChatbotInput,
} from "@/features/ai-hub/actions/create-chatbot-action";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

const INITIAL_FORM: CreateChatbotInput = {
  companyName: "",
  businessDescription: "",
  knowledge: "",
  goal: "info",
  welcomeMessage: "",
  color: "#151515",
  provider: "openai",
  model: "",
  apiKey: "",
  endpoint: "",
};

export function DeployableChatWorkspace() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [deployment, setDeployment] = useState<{
    chatbotId: string;
    embedCode: string;
    companyName: string;
    welcomeMessage: string;
  } | null>(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [isPending, startTransition] = useTransition();

  function updateField(key: keyof CreateChatbotInput, value: string) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function handleCreate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    startTransition(async () => {
      const result = await createDeployableChatbotAction(form);
      if (!result.success) {
        setError(result.error);
        return;
      }
      setDeployment(result);
    });
  }

  async function copyEmbedCode() {
    if (!deployment) return;
    await navigator.clipboard.writeText(deployment.embedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 1_800);
  }

  if (deployment) {
    return (
      <div className="deploy-chat-shell">
        <div className="deploy-chat-success">
          <span className="deploy-chat-status">● Aktywny</span>
          <h2>Czat jest gotowy do wdrożenia.</h2>
          <p>
            Wklej poniższy kod przed zamknięciem znacznika{" "}
            <code>&lt;/body&gt;</code> na stronie klienta.
          </p>
          <div className="deploy-chat-code">
            <code>{deployment.embedCode}</code>
            <button type="button" onClick={copyEmbedCode} className="btn-primary">
              {copied ? "Skopiowano!" : "Kopiuj kod"}
            </button>
          </div>
          <ol className="deploy-chat-steps">
            <li>Skopiuj jedną linię kodu.</li>
            <li>Wklej ją do strony klienta przed &lt;/body&gt;.</li>
            <li>Opublikuj stronę — przycisk czatu pojawi się automatycznie.</li>
          </ol>
        </div>

        <div>
          <p className="deploy-chat-preview-label">Podgląd działającego czatu</p>
          <ChatPreview
            chatbotId={deployment.chatbotId}
            companyName={deployment.companyName}
            welcomeMessage={deployment.welcomeMessage}
          />
        </div>

        <div className="deploy-chat-actions">
          <button
            type="button"
            className="btn-ghost"
            onClick={() => {
              setDeployment(null);
              setError("");
            }}
          >
            ← Utwórz kolejny czat
          </button>
          <a href="/kontakt" className="btn-primary">
            Zamów pełne wdrożenie →
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="aihub-workspace">
      <form onSubmit={handleCreate} className="aihub-form deploy-chat-form">
        <div className="deploy-chat-intro">
          <span className="deploy-chat-status">Widget produkcyjny</span>
          <h2>Skonfiguruj asystenta klienta.</h2>
          <p>
            Po zapisaniu otrzymasz działający kod do osadzenia na dowolnej stronie.
            Czat korzysta z modelu i limitów klienta, a klucz API pozostaje
            zaszyfrowany na serwerze Braided Digital.
          </p>
        </div>

        <div className="deploy-chat-model-box">
          <div className="deploy-chat-form-grid">
            <div className="aihub-field">
              <label htmlFor="chat-provider">
                Provider klienta <span className="required">*</span>
              </label>
              <select
                id="chat-provider"
                value={form.provider}
                onChange={(event) =>
                  updateField(
                    "provider",
                    event.target.value as CreateChatbotInput["provider"]
                  )
                }
              >
                <option value="openai">OpenAI</option>
                <option value="openrouter">OpenRouter</option>
                <option value="groq">Groq</option>
                <option value="custom">Własny endpoint OpenAI-compatible</option>
              </select>
            </div>
            <div className="aihub-field">
              <label htmlFor="chat-model">
                Model <span className="required">*</span>
              </label>
              <input
                id="chat-model"
                value={form.model}
                onChange={(event) => updateField("model", event.target.value)}
                placeholder="np. gpt-4.1-mini"
                maxLength={180}
                required
              />
            </div>
          </div>

          {form.provider === "custom" ? (
            <div className="aihub-field">
              <label htmlFor="chat-endpoint">
                Endpoint Chat Completions <span className="required">*</span>
              </label>
              <input
                id="chat-endpoint"
                type="url"
                value={form.endpoint}
                onChange={(event) => updateField("endpoint", event.target.value)}
                placeholder="https://ai.firma.pl/v1/chat/completions"
                maxLength={500}
                required
              />
            </div>
          ) : null}

          <div className="aihub-field">
            <label htmlFor="chat-api-key">
              Klucz API klienta <span className="required">*</span>
            </label>
            <input
              id="chat-api-key"
              type="password"
              value={form.apiKey}
              onChange={(event) => updateField("apiKey", event.target.value)}
              placeholder="Klucz jest testowany, szyfrowany i nigdy nie trafia do widgetu"
              maxLength={500}
              autoComplete="off"
              required
            />
            <small className="deploy-chat-secret-note">
              Przed utworzeniem widgetu wykonamy bezpieczny test połączenia.
            </small>
          </div>
        </div>

        <div className="aihub-field">
          <label htmlFor="chat-company">
            Nazwa firmy <span className="required">*</span>
          </label>
          <input
            id="chat-company"
            value={form.companyName}
            onChange={(event) => updateField("companyName", event.target.value)}
            placeholder="np. Biuro Nieruchomości Bezpieczny Dom"
            maxLength={120}
            required
          />
        </div>

        <div className="aihub-field">
          <label htmlFor="chat-business">
            Branża, oferta i obszar działania <span className="required">*</span>
          </label>
          <textarea
            id="chat-business"
            value={form.businessDescription}
            onChange={(event) =>
              updateField("businessDescription", event.target.value)
            }
            placeholder="Opisz usługi, lokalizację, sposób kontaktu i najważniejsze informacje dla klientów."
            rows={4}
            maxLength={800}
            required
          />
        </div>

        <div className="aihub-field">
          <label htmlFor="chat-knowledge">Dodatkowa wiedza i odpowiedzi</label>
          <textarea
            id="chat-knowledge"
            value={form.knowledge}
            onChange={(event) => updateField("knowledge", event.target.value)}
            placeholder="Cennik, godziny pracy, terminy, zasady rezerwacji, odpowiedzi na częste pytania…"
            rows={6}
            maxLength={4_000}
          />
        </div>

        <div className="deploy-chat-form-grid">
          <div className="aihub-field">
            <label htmlFor="chat-goal">Główny cel czatu</label>
            <select
              id="chat-goal"
              value={form.goal}
              onChange={(event) => updateField("goal", event.target.value)}
            >
              <option value="info">Informowanie o ofercie</option>
              <option value="leady">Pozyskiwanie kontaktów</option>
              <option value="rezerwacje">Umawianie spotkań</option>
              <option value="wszystko">Informacje, leady i spotkania</option>
            </select>
          </div>
          <div className="aihub-field">
            <label htmlFor="chat-color">Kolor widgetu</label>
            <div className="deploy-chat-color">
              <input
                id="chat-color"
                type="color"
                value={form.color}
                onChange={(event) => updateField("color", event.target.value)}
              />
              <code>{form.color}</code>
            </div>
          </div>
        </div>

        <div className="aihub-field">
          <label htmlFor="chat-welcome">Wiadomość powitalna</label>
          <input
            id="chat-welcome"
            value={form.welcomeMessage}
            onChange={(event) => updateField("welcomeMessage", event.target.value)}
            placeholder="Dzień dobry! Jak mogę Ci dzisiaj pomóc?"
            maxLength={240}
          />
        </div>

        {error ? <p className="aihub-error">{error}</p> : null}

        <button
          type="submit"
          className="btn-primary aihub-submit"
          disabled={isPending}
        >
          {isPending ? "Tworzę widget…" : "Utwórz gotowy czat →"}
        </button>
      </form>
    </div>
  );
}

function ChatPreview({
  chatbotId,
  companyName,
  welcomeMessage,
}: {
  chatbotId: string;
  companyName: string;
  welcomeMessage: string;
}) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "assistant", content: welcomeMessage },
  ]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const sessionId = useRef<string | null>(null);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const content = message.trim();
    if (!content || isPending) return;

    const history = messages.slice(-10);
    const activeSessionId =
      sessionId.current ?? (sessionId.current = crypto.randomUUID());
    setMessage("");
    setError("");
    setMessages((current) => [...current, { role: "user", content }]);

    startTransition(async () => {
      try {
        const response = await fetch(`/api/ai-chat/${chatbotId}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: content,
            history,
            sessionId: activeSessionId,
          }),
        });
        const payload = (await response.json()) as {
          reply?: string;
          error?: string;
        };
        if (!response.ok || !payload.reply) {
          throw new Error(payload.error || "Nie udało się uzyskać odpowiedzi.");
        }
        setMessages((current) => [
          ...current,
          { role: "assistant", content: payload.reply! },
        ]);
      } catch (caught) {
        setError(
          caught instanceof Error
            ? caught.message
            : "Nie udało się uzyskać odpowiedzi."
        );
      }
    });
  }

  return (
    <div className="deploy-chat-preview">
      <header>
        <span className="deploy-chat-avatar">AI</span>
        <span>
          <strong>{companyName}</strong>
          <small>Asystent online</small>
        </span>
      </header>
      <div className="deploy-chat-messages" aria-live="polite">
        {messages.map((item, index) => (
          <p key={`${item.role}-${index}`} data-role={item.role}>
            {item.content}
          </p>
        ))}
        {isPending ? <p data-role="assistant">Piszę odpowiedź…</p> : null}
      </div>
      {error ? <p className="deploy-chat-error">{error}</p> : null}
      <form onSubmit={handleSubmit}>
        <label className="sr-only" htmlFor={`chat-message-${chatbotId}`}>
          Wiadomość
        </label>
        <input
          id={`chat-message-${chatbotId}`}
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          placeholder="Napisz wiadomość…"
          maxLength={1_000}
          disabled={isPending}
        />
        <button type="submit" disabled={isPending || !message.trim()}>
          Wyślij
        </button>
      </form>
    </div>
  );
}
