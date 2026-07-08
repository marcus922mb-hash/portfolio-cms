"use client";

import { useActionState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { MessageSquare, Loader2, Plus } from "lucide-react";
import type { ClientNote } from "@/features/clients/types";
import {
  addNoteAction,
  type NoteActionState,
} from "@/features/clients/actions/client-actions";

type Props = {
  clientId: string;
  notes: ClientNote[];
};

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("pl-PL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function ClientNotes({ clientId, notes }: Props) {
  const boundAction = addNoteAction.bind(null, clientId);
  const [state, formAction, isPending] = useActionState<NoteActionState, FormData>(
    boundAction,
    null
  );
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (state?.success) {
      formRef.current?.reset();
      router.refresh();
    }
  }, [state, router]);

  return (
    <div className="panel-card">
      <div className="panel-card-header">
        <span className="panel-card-title">
          <MessageSquare size={12} style={{ display: "inline", marginRight: ".35rem" }} />
          Notatki
        </span>
        <span className="crm-note-count">{notes.length}</span>
      </div>
      <div className="panel-card-body">
        {/* Add note form */}
        <form ref={formRef} action={formAction} className="crm-note-form">
          <textarea
            name="content"
            rows={3}
            className="crm-textarea"
            placeholder="Dodaj notatkę o tym kliencie…"
            disabled={isPending}
            required
          />
          {state?.error && (
            <p className="crm-field-error" role="alert">
              {state.error}
            </p>
          )}
          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: ".5rem" }}>
            <button
              type="submit"
              disabled={isPending}
              className="crm-btn crm-btn--primary crm-btn--sm"
            >
              {isPending ? (
                <Loader2 size={13} className="crm-spinner" />
              ) : (
                <Plus size={13} />
              )}
              {isPending ? "Zapisywanie…" : "Dodaj notatkę"}
            </button>
          </div>
        </form>

        {/* Notes list */}
        {notes.length === 0 ? (
          <div className="crm-notes-empty">
            <p>Brak notatek — dodaj pierwszą powyżej.</p>
          </div>
        ) : (
          <div className="crm-notes-list">
            {notes.map((note) => (
              <div key={note.id} className="crm-note-item">
                <p className="crm-note-content">{note.content}</p>
                <span className="crm-note-time">{formatDateTime(note.created_at)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
