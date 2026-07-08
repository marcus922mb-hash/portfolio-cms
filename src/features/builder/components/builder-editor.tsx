"use client";

import "@/app/builder.css";
import { useEffect, useCallback, useRef } from "react";
import {
  DndContext,
  DragOverlay,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
  type DragOverEvent,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { useState } from "react";
import { useBuilderStore } from "@/features/builder/store/builder-store";
import { BuilderToolbar } from "./builder-toolbar";
import { BuilderSidebar } from "./builder-sidebar";
import { BuilderCanvas } from "./builder-canvas";
import { BuilderProperties } from "./builder-properties";
import { getComponentDefinition } from "@/lib/builder/component-definitions";
import type { BuilderComponent, BuilderPage } from "@/features/builder/types";
import { GripVertical } from "lucide-react";

// ── Drag overlay pill ─────────────────────────────────────────
function DragPill({ label }: { label: string }) {
  return (
    <div className="bldr-drag-pill">
      <GripVertical size={13} />
      <span>{label}</span>
    </div>
  );
}

// ── Main editor ───────────────────────────────────────────────
type BuilderEditorProps = {
  page: BuilderPage;
  initialDevice?: "desktop" | "tablet" | "mobile";
};

export function BuilderEditor({ page, initialDevice = "desktop" }: BuilderEditorProps) {
  const { init, components, addComponent, moveComponent, markSaved, isDirty } = useBuilderStore();
  const [activeDragId, setActiveDragId] = useState<string | null>(null);
  const [activeDragLabel, setActiveDragLabel] = useState<string>("");
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    init({
      pageId: page.id,
      pageName: page.name,
      demoId: page.demo_id,
      components: page.components,
      settings: page.settings,
      device: initialDevice,
    });
  }, [page.id, initialDevice]);

  // Auto-save debounce (4s)
  useEffect(() => {
    if (!isDirty) return;
    const { demoId: id, components: comps, settings: sets, pageName: name, markSaved: saved, setSaving } = useBuilderStore.getState();
    if (!id) return;
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(async () => {
      setSaving(true);
      const { saveBuilderPage } = await import("@/features/builder/actions/builder-actions");
      const res = await saveBuilderPage({ demoId: id, name, components: comps, settings: sets });
      setSaving(false);
      if (res.success) saved();
    }, 4000);
    return () => { if (saveTimerRef.current) clearTimeout(saveTimerRef.current); };
  }, [isDirty, components]);

  // Keyboard shortcuts
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "z" && !e.shiftKey) {
        e.preventDefault();
        useBuilderStore.getState().undo();
      }
      if ((e.ctrlKey || e.metaKey) && (e.key === "y" || (e.key === "z" && e.shiftKey))) {
        e.preventDefault();
        useBuilderStore.getState().redo();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        const { demoId, components: comps, settings, pageName } = useBuilderStore.getState();
        if (!demoId) return;
        import("@/features/builder/actions/builder-actions").then(({ saveBuilderPage }) => {
          saveBuilderPage({ demoId, name: pageName, components: comps, settings }).then((res) => {
            if (res.success) useBuilderStore.getState().markSaved();
          });
        });
      }
    },
    []
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  function handleDragStart(event: DragStartEvent) {
    const data = event.active.data.current as { type: string; component?: BuilderComponent; def?: { label: string }; componentType?: string } | undefined;
    setActiveDragId(String(event.active.id));
    if (data?.type === "canvas" && data.component) {
      setActiveDragLabel(data.component.label);
    } else if (data?.type === "library" && data.def) {
      setActiveDragLabel(data.def.label);
    }
  }

  function handleDragOver(_event: DragOverEvent) {
    // handled in DragEnd
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveDragId(null);
    setActiveDragLabel("");
    const { active, over } = event;
    if (!over) return;

    const activeData = active.data.current as { type: string; componentType?: string; def?: unknown } | undefined;
    const overId = String(over.id);

    if (activeData?.type === "library") {
      // Drop from library → add component
      const def = getComponentDefinition(activeData.componentType ?? "");
      if (!def) return;
      const overComp = components.find((c) => c.id === overId);
      addComponent(def, overComp ? overComp.id : null);
      return;
    }

    if (activeData?.type === "canvas") {
      // Reorder canvas components
      const fromIndex = components.findIndex((c) => c.id === String(active.id));
      const toIndex = components.findIndex((c) => c.id === overId);
      if (fromIndex !== -1 && toIndex !== -1 && fromIndex !== toIndex) {
        moveComponent(fromIndex, toIndex);
      }
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="bldr-shell">
        <BuilderToolbar />
        <div className="bldr-body">
          <BuilderSidebar />
          <BuilderCanvas />
          <BuilderProperties />
        </div>
      </div>

      <DragOverlay dropAnimation={null}>
        {activeDragId ? <DragPill label={activeDragLabel} /> : null}
      </DragOverlay>
    </DndContext>
  );
}
