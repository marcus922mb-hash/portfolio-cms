"use client";

import { useBuilderStore } from "@/features/builder/store/builder-store";
import { MonitorPlay, Save, ArrowLeft, Maximize2, LayoutGrid, Zap } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function VisualBuilderPage() {
  const [device, setDevice] = useState<"desktop" | "tablet" | "mobile">("desktop");

  return (
    <div className="h-full flex flex-col -m-6 border-b border-border bg-background">
      {/* Top Navbar */}
      <div className="h-14 border-b flex items-center justify-between px-4 bg-card">
        <div className="flex items-center gap-4">
          <Link href="/panel/studio" className="text-muted-foreground hover:text-foreground">
            <ArrowLeft size={18} />
          </Link>
          <div className="font-semibold flex items-center gap-2">
            <MonitorPlay size={18} className="text-blue-500" />
            Visual Builder <span className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-500 font-mono text-[10px]">PRO</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Device Controls */}
          <div className="flex items-center bg-muted rounded-md p-1 mr-4">
            <button
              onClick={() => setDevice("desktop")}
              className={`p-1.5 rounded-sm transition-colors ${device === "desktop" ? "bg-background shadow-sm" : "text-muted-foreground"}`}
            >
              <Maximize2 size={14} />
            </button>
            <button
              onClick={() => setDevice("tablet")}
              className={`p-1.5 rounded-sm transition-colors ${device === "tablet" ? "bg-background shadow-sm" : "text-muted-foreground"}`}
            >
              <LayoutGrid size={14} />
            </button>
            <button
              onClick={() => setDevice("mobile")}
              className={`p-1.5 rounded-sm transition-colors ${device === "mobile" ? "bg-background shadow-sm" : "text-muted-foreground"}`}
            >
              <Zap size={14} />
            </button>
          </div>

          <button className="flex items-center gap-2 px-4 py-1.5 bg-primary text-primary-foreground rounded-md text-sm font-medium">
            <Save size={14} /> Zapisz projekt
          </button>
        </div>
      </div>

      {/* Editor Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Elements/Library */}
        <div className="w-64 border-r bg-card flex flex-col">
          <div className="p-4 border-b font-medium text-sm text-muted-foreground uppercase tracking-wider">
            Dodaj element
          </div>
          <div className="flex-1 overflow-auto p-4 space-y-4">
            <div>
              <h4 className="text-xs font-semibold mb-2">Layout</h4>
              <div className="grid grid-cols-2 gap-2">
                <div className="border rounded bg-muted/50 p-2 text-center text-xs cursor-pointer hover:bg-muted">Section</div>
                <div className="border rounded bg-muted/50 p-2 text-center text-xs cursor-pointer hover:bg-muted">Div</div>
                <div className="border rounded bg-muted/50 p-2 text-center text-xs cursor-pointer hover:bg-muted">Grid</div>
                <div className="border rounded bg-muted/50 p-2 text-center text-xs cursor-pointer hover:bg-muted">Columns</div>
              </div>
            </div>
            <div>
              <h4 className="text-xs font-semibold mb-2">Typography</h4>
              <div className="grid grid-cols-2 gap-2">
                <div className="border rounded bg-muted/50 p-2 text-center text-xs cursor-pointer hover:bg-muted">Heading</div>
                <div className="border rounded bg-muted/50 p-2 text-center text-xs cursor-pointer hover:bg-muted">Text</div>
                <div className="border rounded bg-muted/50 p-2 text-center text-xs cursor-pointer hover:bg-muted">Link</div>
              </div>
            </div>
            <div>
              <h4 className="text-xs font-semibold mb-2">Media</h4>
              <div className="grid grid-cols-2 gap-2">
                <div className="border rounded bg-muted/50 p-2 text-center text-xs cursor-pointer hover:bg-muted">Image</div>
                <div className="border rounded bg-muted/50 p-2 text-center text-xs cursor-pointer hover:bg-muted">Video</div>
                <div className="border rounded bg-muted/50 p-2 text-center text-xs cursor-pointer hover:bg-muted">Icon</div>
              </div>
            </div>
          </div>
        </div>

        {/* Canvas Area */}
        <div className="flex-1 bg-muted/20 p-8 flex justify-center overflow-auto relative">
          <div
            className="bg-background shadow-lg border rounded flex items-center justify-center transition-all duration-300"
            style={{
              width: device === "desktop" ? "100%" : device === "tablet" ? "768px" : "375px",
              minHeight: "100%"
            }}
          >
            <div className="text-center text-muted-foreground p-12">
              <div className="inline-flex w-16 h-16 rounded-xl bg-muted items-center justify-center mb-4">
                <LayoutGrid size={24} className="opacity-50" />
              </div>
              <p className="text-xl font-medium text-foreground mb-2">Canvas jest pusty</p>
              <p className="text-sm">Przeciągnij elementy z lewego panelu, aby rozpocząć budowę strony.</p>
            </div>
          </div>
        </div>

        {/* Right Sidebar - Properties */}
        <div className="w-80 border-l bg-card flex flex-col">
          <div className="p-4 border-b font-medium text-sm flex gap-4">
            <span className="text-foreground border-b-2 border-primary pb-4 -mb-4">Styling</span>
            <span className="text-muted-foreground cursor-pointer">Ustawienia</span>
            <span className="text-muted-foreground cursor-pointer">Animacje</span>
          </div>
          <div className="flex-1 overflow-auto p-4 flex flex-col items-center justify-center text-center">
            <p className="text-sm text-muted-foreground">Wybierz element na płótnie, aby edytować jego właściwości CSS, układ Flexbox/Grid i kolory.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
