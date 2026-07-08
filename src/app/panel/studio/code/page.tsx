"use client";

import { useState } from "react";
import Editor from "@monaco-editor/react";
import { Code2, Play, Save, Monitor, Folder } from "lucide-react";
import { toast } from "sonner";

export default function CodeStudioPage() {
  const [language, setLanguage] = useState("typescript");
  const [code, setCode] = useState(
    `// Code Studio - Edytor Komponentów React
import React from 'react';

export default function CustomComponent() {
  return (
    <div className="flex flex-col items-center justify-center p-8 bg-gray-900 border border-gray-800 rounded-xl">
      <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500 mb-4">
        AI Website Studio
      </h1>
      <p className="text-gray-400 max-w-md text-center">
        Rozbuduj swój system z poziomu edytora. Ten kod jest gotowy do zapisania jako sekcja w bibliotece.
      </p>
      <button className="mt-6 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors">
        Sprawdź efekt
      </button>
    </div>
  );
}`
  );

  const handleSave = () => {
    toast.success("Kod zapisany do lokalnej biblioteki komponentów!");
  };

  return (
    <div className="h-full flex flex-col -m-6 border-b border-border bg-background">
      <div className="h-14 border-b flex items-center justify-between px-4 bg-card">
        <div className="flex items-center gap-2 font-semibold">
          <Code2 size={18} className="text-slate-400" />
          Code Studio
        </div>

        <div className="flex items-center gap-4">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="bg-muted text-sm border-0 rounded px-2 py-1"
          >
            <option value="typescript">React (TypeScript)</option>
            <option value="css">Tailwind CSS</option>
            <option value="json">Konfiguracja (JSON)</option>
          </select>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-1.5 bg-primary text-primary-foreground rounded-md text-sm font-medium"
          >
            <Save size={14} /> Zapisz kod
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* File Tree */}
        <div className="w-64 border-r bg-card flex flex-col hidden md:flex">
          <div className="p-4 border-b font-medium text-sm text-muted-foreground uppercase tracking-wider flex items-center gap-2">
            <Folder size={14} /> Katalog roboczy
          </div>
          <div className="overflow-auto p-2">
            <div className="text-sm p-2 hover:bg-muted rounded cursor-pointer text-slate-200">CustomComponent.tsx</div>
            <div className="text-sm p-2 hover:bg-muted rounded cursor-pointer text-muted-foreground">styles.css</div>
            <div className="text-sm p-2 hover:bg-muted rounded cursor-pointer text-muted-foreground">config.json</div>
          </div>
        </div>

        {/* Editor */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1">
            <Editor
              height="100%"
              theme="vs-dark"
              language={language}
              value={code}
              onChange={(value) => setCode(value || "")}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                lineHeight: 24,
                padding: { top: 16 },
                scrollBeyondLastLine: false,
                bracketPairColorization: { enabled: true },
              }}
            />
          </div>

          {/* Live Preview Console/Area */}
          <div className="h-64 border-t bg-[#1e1e1e] flex flex-col">
            <div className="px-4 py-2 border-b border-[#333] flex justify-between items-center text-xs text-gray-400">
              <span className="flex items-center gap-2"><Monitor size={12} /> Live Preview / Console</span>
              <button className="flex items-center gap-1 hover:text-white transition-colors">
                <Play size={12} /> Uruchom
              </button>
            </div>
            <div className="flex-1 p-4 overflow-auto text-gray-300 font-mono text-sm leading-relaxed">
              [Info] System gotowy.<br />
              [Info] TypeScript kompiluje się poprawnie.<br />
              <span className="text-green-400">[Sukces] Podgląd komponentu wygenerowany do RAM.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
