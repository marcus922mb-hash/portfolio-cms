import type { Metadata } from "next";
import { AiMultiChat } from "@/features/ai-hub/components/ai-multi-chat";

export const metadata: Metadata = { title: "AI Chat — Porównaj modele" };

export default function PanelAiChatPage() {
  return (
    <>
      <div className="crm-page-header">
        <div>
          <h1 className="crm-page-title">AI Chat</h1>
          <p className="crm-page-desc">Rozmawiaj z kilkoma modelami AI jednocześnie i porównuj odpowiedzi</p>
        </div>
      </div>
      <AiMultiChat />
    </>
  );
}
