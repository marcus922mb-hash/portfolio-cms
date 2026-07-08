"use client";

import { AlertTriangle } from "lucide-react";

type ErrorStateProps = {
  title?: string;
  description?: string;
  onRetry?: () => void;
};

export function ErrorState({
  title = "Wystąpił błąd",
  description = "Nie udało się załadować danych. Spróbuj ponownie.",
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="panel-error">
      <div className="panel-error-icon">
        <AlertTriangle size={36} strokeWidth={1.2} />
      </div>
      <h3>{title}</h3>
      <p>{description}</p>
      {onRetry && (
        <button type="button" className="panel-error-btn" onClick={onRetry}>
          Spróbuj ponownie
        </button>
      )}
    </div>
  );
}
