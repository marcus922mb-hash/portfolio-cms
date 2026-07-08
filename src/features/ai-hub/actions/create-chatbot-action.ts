"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import {
  encryptClientApiKey,
  generateWithClientModel,
  type ClientModelProvider,
} from "@/lib/ai/client-model";

const GOALS = new Set(["info", "leady", "rezerwacje", "wszystko"]);
const PROVIDERS = new Set<ClientModelProvider>([
  "openai",
  "openrouter",
  "groq",
  "custom",
]);
const HEX_COLOR = /^#[0-9a-f]{6}$/i;

export type CreateChatbotInput = {
  companyName: string;
  businessDescription: string;
  knowledge: string;
  goal: string;
  welcomeMessage: string;
  color: string;
  provider: ClientModelProvider;
  model: string;
  apiKey: string;
  endpoint: string;
};

export type CreateChatbotState =
  | {
      success: true;
      chatbotId: string;
      embedCode: string;
      companyName: string;
      welcomeMessage: string;
    }
  | { success: false; error: string };

function clean(value: string, maxLength: number) {
  return value.trim().slice(0, maxLength);
}

export async function createDeployableChatbotAction(
  input: CreateChatbotInput
): Promise<CreateChatbotState> {
  const companyName = clean(input.companyName, 120);
  const businessDescription = clean(input.businessDescription, 800);
  const knowledge = clean(input.knowledge, 4_000);
  const welcomeMessage =
    clean(input.welcomeMessage, 240) ||
    `Dzień dobry! Jestem asystentem firmy ${companyName}. Jak mogę pomóc?`;
  const goal = GOALS.has(input.goal) ? input.goal : "info";
  const color = HEX_COLOR.test(input.color.trim()) ? input.color.trim() : "#151515";
  const provider = PROVIDERS.has(input.provider) ? input.provider : "openai";
  const model = clean(input.model, 180);
  const apiKey = clean(input.apiKey, 500);
  const endpoint = clean(input.endpoint, 500);

  if (!companyName || !businessDescription || !model || !apiKey) {
    return {
      success: false,
      error: "Uzupełnij dane firmy, model i klucz API klienta.",
    };
  }

  if (provider === "custom" && !endpoint) {
    return { success: false, error: "Podaj endpoint własnego modelu." };
  }

  const chatbotId = crypto.randomUUID();
  const siteUrl = (
    process.env.NEXT_PUBLIC_SITE_URL || "https://web.ma-atelier.pl"
  ).replace(/\/+$/, "");
  const embedCode = `<script async src="${siteUrl}/api/ai-chat/widget" data-chatbot-id="${chatbotId}"></script>`;

  try {
    await generateWithClientModel(
      { provider, model, apiKey, endpoint },
      [
        {
          role: "system",
          content: "Sprawdzasz połączenie. Odpowiedz krótko po polsku.",
        },
        { role: "user", content: "Napisz: Połączenie działa." },
      ],
      20
    );
  } catch (error) {
    const message =
      error &&
      typeof error === "object" &&
      "message" in error &&
      typeof error.message === "string"
        ? error.message
        : "Nieznany błąd połączenia.";
    return {
      success: false,
      error: `Nie udało się połączyć z modelem klienta: ${message}`,
    };
  }

  try {
    const apiKeyEncrypted = encryptClientApiKey(apiKey);
    const supabase = createAdminClient();
    const { error } = await supabase.from("ai_tool_outputs").insert({
      id: chatbotId,
      tool_id: "generator-czatu-ai",
      tool_name: `Czat AI — ${companyName}`,
      tool_category: "business",
      input_values: {
        type: "chatbot_config",
        companyName,
        businessDescription,
        knowledge,
        goal,
        welcomeMessage,
        color,
        provider,
        model,
        endpoint: provider === "custom" ? endpoint : "",
        apiKeyEncrypted,
      },
      output_text: embedCode,
      provider,
      model,
      label: `${companyName} — chatbot`,
      notes: "Gotowy widget czatu utworzony na web.ma-atelier.pl",
      status: "saved",
    });

    if (error) throw error;
  } catch (error) {
    const message =
      error &&
      typeof error === "object" &&
      "message" in error &&
      typeof error.message === "string"
        ? error.message
        : String(error);
    console.error("[ai-chat] Nie udało się utworzyć chatbota", { error: message });
    return {
      success: false,
      error: "Nie udało się utworzyć chatbota. Spróbuj ponownie.",
    };
  }

  return {
    success: true,
    chatbotId,
    embedCode,
    companyName,
    welcomeMessage,
  };
}
