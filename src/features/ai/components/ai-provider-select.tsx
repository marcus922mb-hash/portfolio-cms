"use client";

import type { AIProvider } from "@/lib/ai/types";

const PROVIDERS: { value: AIProvider; label: string }[] = [
  { value: "openrouter", label: "OpenRouter" },
  { value: "gemini", label: "Gemini" },
  { value: "groq", label: "Groq" },
  { value: "cloudflare", label: "Cloudflare Workers AI" },
  { value: "local", label: "Model lokalny" },
];

type Props = {
  value: AIProvider;
  onChange: (value: AIProvider) => void;
  disabled?: boolean;
};

export function AIProviderSelect({ value, onChange, disabled }: Props) {
  return (
    <div className="crm-field">
      <label className="crm-label" htmlFor="ai_provider">Provider AI</label>
      <select
        id="ai_provider"
        className="crm-select"
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value as AIProvider)}
      >
        {PROVIDERS.map((provider) => (
          <option key={provider.value} value={provider.value}>
            {provider.label}
          </option>
        ))}
      </select>
    </div>
  );
}
