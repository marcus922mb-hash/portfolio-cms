"use client";

import {
  AlertTriangle,
  CheckCircle2,
  Circle,
  Loader2,
  Wifi,
  WifiOff,
} from "lucide-react";
import { useEffect, useState } from "react";
import type { AIProgressEvent, AIProgressStage, AIProgressStatus } from "@/lib/ai/progress";
import { createClient } from "@/lib/supabase/client";
import type { Database, Json } from "@/types/database";

type ActivityRow = Database["public"]["Tables"]["activity_logs"]["Row"];
type ConnectionStatus = "connecting" | "live" | "polling";

const STAGES = new Set<AIProgressStage>([
  "request_received",
  "loading_context",
  "context_loaded",
  "prompt_prepared",
  "model_attempt_started",
  "model_attempt_failed",
  "content_received",
  "content_validated",
  "image_search_started",
  "image_provider_started",
  "image_provider_completed",
  "image_provider_failed",
  "images_selected",
  "placeholders_selected",
  "generation_completed",
  "generation_failed",
]);

const STATUSES = new Set<AIProgressStatus>([
  "running",
  "completed",
  "warning",
  "error",
]);

function isRecord(value: Json | undefined): value is Record<string, Json | undefined> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function parseProgressRow(row: ActivityRow, runId: string): AIProgressEvent | null {
  if (!isRecord(row.metadata) || row.metadata.run_id !== runId) return null;
  const stage = row.metadata.stage;
  const status = row.metadata.status;
  const sequence = row.metadata.sequence;
  const progress = row.metadata.progress;
  if (
    typeof stage !== "string" ||
    !STAGES.has(stage as AIProgressStage) ||
    typeof status !== "string" ||
    !STATUSES.has(status as AIProgressStatus) ||
    typeof sequence !== "number" ||
    typeof progress !== "number"
  ) {
    return null;
  }
  const rawDetails = row.metadata.details;
  const details = isRecord(rawDetails)
    ? Object.fromEntries(
        Object.entries(rawDetails).flatMap(([key, value]) =>
          typeof value === "string" ||
          typeof value === "number" ||
          typeof value === "boolean" ||
          value === null
            ? [[key, value]]
            : []
        )
      )
    : undefined;

  return {
    id: row.id,
    runId,
    sequence,
    stage: stage as AIProgressStage,
    status: status as AIProgressStatus,
    progress,
    message: row.description || stage,
    details,
    createdAt: row.created_at,
  };
}

function mergeEvents(current: AIProgressEvent[], incoming: AIProgressEvent[]) {
  const byId = new Map(current.map((event) => [event.id, event]));
  for (const event of incoming) byId.set(event.id, event);
  return [...byId.values()].sort(
    (left, right) =>
      left.sequence - right.sequence ||
      left.createdAt.localeCompare(right.createdAt)
  );
}

function detailLabel(key: string) {
  const labels: Record<string, string> = {
    provider: "Provider",
    model: "Model",
    attempt: "Próba",
    durationMs: "Czas",
    responseCharacters: "Znaki odpowiedzi",
    resultCount: "Wyniki",
    selectedCount: "Wybrane miejsca",
    providers: "Źródła",
    company: "Firma",
    industry: "Branża",
    city: "Miasto",
    websiteType: "Typ strony",
    sections: "Sekcje",
    realImages: "Realne zdjęcia",
    placeholders: "Placeholdery",
    error: "Błąd",
  };
  return labels[key] ?? key.replace(/([A-Z])/g, " $1");
}

function detailValue(key: string, value: string | number | boolean | null) {
  if (key === "durationMs" && typeof value === "number") {
    return `${(value / 1000).toFixed(1)} s`;
  }
  if (typeof value === "boolean") return value ? "tak" : "nie";
  return value === null ? "—" : String(value);
}

function StatusIcon({ status }: { status: AIProgressStatus }) {
  if (status === "completed") return <CheckCircle2 size={14} />;
  if (status === "warning" || status === "error") {
    return <AlertTriangle size={14} />;
  }
  return <Loader2 size={14} className="bldr-spin" />;
}

export function AIGenerationProgress({
  demoId,
  runId,
  startedAt,
  isGenerating,
}: {
  demoId: string;
  runId: string;
  startedAt: string;
  isGenerating: boolean;
}) {
  const [supabase] = useState(createClient);
  const [events, setEvents] = useState<AIProgressEvent[]>([]);
  const [connection, setConnection] = useState<ConnectionStatus>("connecting");
  const [elapsed, setElapsed] = useState(() =>
    Math.max(0, Math.floor((Date.now() - new Date(startedAt).getTime()) / 1000))
  );

  useEffect(() => {
    let active = true;

    async function fetchEvents() {
      const { data, error } = await supabase
        .from("activity_logs")
        .select("id, created_at, entity_type, entity_id, action, description, metadata")
        .eq("entity_type", "demo")
        .eq("entity_id", demoId)
        .eq("action", "ai_generation_progress")
        .gte("created_at", startedAt)
        .order("created_at", { ascending: true });

      if (!active) return;
      if (error) {
        console.error("[ai-progress] Pobieranie zdarzeń nie powiodło się", error);
        setConnection("polling");
        return;
      }
      const parsed = (data ?? [])
        .map((row) => parseProgressRow(row, runId))
        .filter((event): event is AIProgressEvent => event !== null);
      setEvents((current) => mergeEvents(current, parsed));
    }

    void fetchEvents();
    const channel = supabase
      .channel(`ai-generation:${runId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "activity_logs",
          filter: `entity_id=eq.${demoId}`,
        },
        (payload) => {
          const event = parseProgressRow(payload.new as ActivityRow, runId);
          if (event) setEvents((current) => mergeEvents(current, [event]));
        }
      )
      .subscribe((status, error) => {
        if (!active) return;
        if (status === "SUBSCRIBED") setConnection("live");
        if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") {
          console.error("[ai-progress] Realtime niedostępny", { status, error });
          setConnection("polling");
        }
      });

    const poll = isGenerating
      ? window.setInterval(() => void fetchEvents(), 1_000)
      : undefined;

    return () => {
      active = false;
      if (poll !== undefined) window.clearInterval(poll);
      void supabase.removeChannel(channel);
    };
  }, [demoId, isGenerating, runId, startedAt, supabase]);

  useEffect(() => {
    if (!isGenerating) return;
    const timer = window.setInterval(() => {
      setElapsed(
        Math.max(0, Math.floor((Date.now() - new Date(startedAt).getTime()) / 1000))
      );
    }, 1_000);
    return () => window.clearInterval(timer);
  }, [isGenerating, startedAt]);

  const latest = events.at(-1);
  const progress = latest?.progress ?? 0;
  const time = `${Math.floor(elapsed / 60)}:${String(elapsed % 60).padStart(2, "0")}`;
  return (
    <section className="ai-live-progress" aria-live="polite">
      <div className="ai-live-progress-head">
        <div>
          <span className="ai-live-progress-kicker">Rzeczywisty przebieg backendu</span>
          <strong>{latest?.message ?? "Oczekiwanie na pierwsze zdarzenie serwera…"}</strong>
        </div>
        <div className="ai-live-progress-meta">
          <span title={connection === "live" ? "Supabase Realtime aktywny" : "Polling aktywny"}>
            {connection === "live" ? <Wifi size={12} /> : <WifiOff size={12} />}
            {connection === "live" ? "live" : connection}
          </span>
          <time>{time}</time>
        </div>
      </div>

      <div className="ai-live-progress-track" aria-label={`Postęp ${progress}%`}>
        <span style={{ width: `${progress}%` }} />
      </div>

      <ol className="ai-live-progress-events">
        {events.length ? (
          events.map((event) => (
            <li
              key={event.id}
              className={`ai-live-progress-event ai-live-progress-event--${event.status}`}
            >
              <div className="ai-live-progress-icon">
                <StatusIcon status={event.status} />
              </div>
              <div className="ai-live-progress-copy">
                <div>
                  <strong>{event.message}</strong>
                  <time>
                    {new Date(event.createdAt).toLocaleTimeString("pl-PL", {
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    })}
                  </time>
                </div>
                {event.details && Object.keys(event.details).length ? (
                  <dl>
                    {Object.entries(event.details).map(([key, value]) => (
                      <div key={key}>
                        <dt>{detailLabel(key)}</dt>
                        <dd>{detailValue(key, value)}</dd>
                      </div>
                    ))}
                  </dl>
                ) : null}
              </div>
            </li>
          ))
        ) : (
          <li className="ai-live-progress-empty">
            <Circle size={12} />
            Żadne zdarzenie nie zostało jeszcze zapisane.
          </li>
        )}
      </ol>
    </section>
  );
}
