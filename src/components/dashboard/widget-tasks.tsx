"use client";

import { useState, useEffect, useRef } from "react";
import { CheckSquare, Plus, X } from "lucide-react";

type Task = { id: string; label: string; done: boolean };

const STORAGE_KEY = "panel_tasks";

function loadTasks(): Task[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as Task[];
  } catch {}
  return [
    { id: "1", label: "Odpowiedzieć na nową wycenę", done: false },
    { id: "2", label: "Przygotować demo dla klienta", done: false },
    { id: "3", label: "Zaktualizować portfolio", done: true },
  ];
}

export function WidgetTasks() {
  const [tasks, setTasks] = useState<Task[]>(loadTasks);
  const [newLabel, setNewLabel] = useState("");
  const [adding, setAdding] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function save(next: Task[]) {
    setTasks(next);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch {}
  }

  function toggle(id: string) {
    save(tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  }

  function remove(id: string) {
    save(tasks.filter((t) => t.id !== id));
  }

  function addTask() {
    const label = newLabel.trim();
    if (!label) return;
    save([...tasks, { id: Date.now().toString(), label, done: false }]);
    setNewLabel("");
    setAdding(false);
  }

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === "Enter") addTask();
    if (e.key === "Escape") { setAdding(false); setNewLabel(""); }
  }

  useEffect(() => {
    if (adding) inputRef.current?.focus();
  }, [adding]);

  return (
    <div className="panel-widget">
      <div className="panel-widget-header">
        <CheckSquare size={13} style={{ color: "rgba(201,169,110,.5)" }} aria-hidden="true" />
        <span className="panel-widget-title">Zadania</span>
        <button
          type="button"
          onClick={() => setAdding(true)}
          className="panel-widget-action"
          title="Dodaj zadanie"
        >
          <Plus size={12} />
        </button>
      </div>
      <div className="panel-widget-body">
        {tasks.map((task) => (
          <div key={task.id} className="panel-task-item" style={{ justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: ".5rem", minWidth: 0 }}>
              <input
                type="checkbox"
                id={`task-${task.id}`}
                className="panel-task-check"
                checked={task.done}
                onChange={() => toggle(task.id)}
              />
              <label
                htmlFor={`task-${task.id}`}
                className="panel-task-label"
                style={{
                  textDecoration: task.done ? "line-through" : "none",
                  opacity: task.done ? 0.4 : 1,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {task.label}
              </label>
            </div>
            <button
              type="button"
              onClick={() => remove(task.id)}
              style={{
                flexShrink: 0,
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "rgba(232,232,232,.2)",
                padding: ".1rem",
                lineHeight: 1,
              }}
              aria-label="Usuń zadanie"
            >
              <X size={10} />
            </button>
          </div>
        ))}

        {adding && (
          <div className="panel-task-item" style={{ marginTop: ".35rem" }}>
            <input
              ref={inputRef}
              type="text"
              value={newLabel}
              onChange={(e) => setNewLabel(e.target.value)}
              onKeyDown={handleKey}
              onBlur={() => { if (!newLabel.trim()) setAdding(false); }}
              placeholder="Nowe zadanie… (Enter aby dodać)"
              className="crm-input"
              style={{ fontSize: ".68rem", padding: ".25rem .4rem", height: "auto" }}
            />
          </div>
        )}

        {tasks.length === 0 && !adding && (
          <p style={{ fontSize: ".65rem", color: "rgba(232,232,232,.25)", textAlign: "center", padding: ".5rem 0" }}>
            Brak zadań
          </p>
        )}
      </div>
    </div>
  );
}
