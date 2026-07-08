"use client";

import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { PlusCircle, Layers } from "lucide-react";
import { useBuilderStore } from "@/features/builder/store/builder-store";
import { CanvasBlock } from "./canvas/canvas-block";

export function BuilderCanvas() {
  const { components, selectedId, device, selectComponent } = useBuilderStore();

  const { setNodeRef, isOver } = useDroppable({ id: "canvas-drop-zone" });

  const deviceWidths: Record<string, string> = {
    desktop: "100%",
    tablet: "768px",
    mobile: "375px",
  };

  return (
    <div className="bldr-canvas-wrap" onClick={() => selectComponent(null)}>
      <div
        className={`bldr-canvas${isOver ? " bldr-canvas--over" : ""}`}
        style={{ maxWidth: deviceWidths[device] }}
      >
        {/* Drop zone from library */}
        <div ref={setNodeRef} className="bldr-canvas-inner">
          {components.length === 0 ? (
            <div className="bldr-canvas-empty">
              <Layers size={36} strokeWidth={1.2} style={{ opacity: .25 }} />
              <p className="bldr-canvas-empty-title">Canvas jest pusty</p>
              <p className="bldr-canvas-empty-sub">
                Przeciągnij komponent z biblioteki lub kliknij{" "}
                <strong>+</strong> przy dowolnym elemencie.
              </p>
              <div className={`bldr-canvas-empty-target${isOver ? " bldr-canvas-empty-target--active" : ""}`}>
                <PlusCircle size={20} />
                Upuść tutaj
              </div>
            </div>
          ) : (
            <SortableContext
              items={components.map((c) => c.id)}
              strategy={verticalListSortingStrategy}
            >
              {components.map((comp, i) => (
                <CanvasBlock
                  key={comp.id}
                  component={comp}
                  isSelected={selectedId === comp.id}
                  index={i}
                  totalCount={components.length}
                />
              ))}

              {/* Bottom drop zone when dragging from library */}
              {isOver && (
                <div className="bldr-drop-indicator">
                  <PlusCircle size={14} /> Dodaj tutaj
                </div>
              )}
            </SortableContext>
          )}
        </div>
      </div>
    </div>
  );
}
