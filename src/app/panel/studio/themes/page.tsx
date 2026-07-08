"use client";

import { Palette, Share2, Save, Type, RotateCcw } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function ThemeBuilderPage() {
  const [colors, setColors] = useState({
    primary: "#3b82f6",
    secondary: "#10b981",
    accent: "#f59e0b",
    background: "#ffffff",
    card: "#f8fafc",
    text: "#0f172a",
    muted: "#64748b"
  });

  return (
    <div className="h-full flex flex-col space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight mb-1 flex items-center gap-2">
            <Palette className="text-fuchsia-500" /> Theme Builder
          </h1>
          <p className="text-muted-foreground text-sm">
            Zarządzaj paletami barw, typografią i tokenami globalnymi (System Design).
          </p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-muted text-foreground rounded-md font-medium hover:bg-muted/80 transition-colors">
            <Share2 size={16} /> Eksportuj
          </button>
          <button onClick={() => toast.success("Zapisano konfigurację CSS Variables")} className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition-colors">
            <Save size={16} /> Zapisz motyw
          </button>
        </div>
      </div>

      <div className="flex-1 flex gap-6 overflow-hidden">
        {/* Settings / Controls */}
        <div className="w-1/3 flex flex-col border rounded-xl bg-card overflow-hidden">
          <div className="p-4 border-b bg-muted/20">
            <h3 className="font-semibold mb-1">Motyw globalny</h3>
            <p className="text-xs text-muted-foreground">Konfiguracja zmiennych używanych w całej aplikacji (Tailwind Config)</p>
          </div>

          <div className="flex-1 overflow-auto p-4 space-y-8">
            {/* Kolory */}
            <div>
              <h4 className="text-sm font-semibold mb-4 flex justify-between items-center">
                Kolory
                <button className="text-xs font-normal text-muted-foreground hover:text-foreground flex items-center gap-1"><RotateCcw size={12} /> Reset</button>
              </h4>
              <div className="space-y-3">
                {Object.entries(colors).map(([key, value]) => (
                  <div key={key} className="flex justify-between items-center px-1">
                    <label className="text-sm capitalize text-muted-foreground mr-4 w-24">{key}</label>
                    <div className="flex items-center gap-2 flex-1">
                      <input
                        type="color"
                        value={value}
                        onChange={(e) => setColors(prev => ({ ...prev, [key]: e.target.value }))}
                        className="w-8 h-8 rounded shrink-0 cursor-pointer border-0 p-0"
                      />
                      <input
                        type="text"
                        value={value}
                        onChange={(e) => setColors(prev => ({ ...prev, [key]: e.target.value }))}
                        className="flex-1 bg-muted px-2 py-1 text-sm rounded font-mono text-xs uppercase"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="h-px bg-border w-full"></div>

            {/* Typografia */}
            <div>
              <h4 className="text-sm font-semibold mb-4 flex justify-between items-center">
                <span className="flex items-center gap-2"><Type size={16} /> Typografia</span>
              </h4>
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Heading Font (Nagłówki)</label>
                  <select className="w-full bg-muted border-0 rounded p-2 text-sm">
                    <option>Inter (Domyślnie)</option>
                    <option>Outfit (Nowoczesny)</option>
                    <option>Playfair Display (Elegancki)</option>
                    <option>Space Grotesk (Tech)</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Body Font (Tekst główny)</label>
                  <select className="w-full bg-muted border-0 rounded p-2 text-sm">
                    <option>Inter (Domyślnie)</option>
                    <option>Roboto (Czysty)</option>
                    <option>Lora (Klasyczny)</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Base Size (Rem)</label>
                  <input type="range" className="w-full accent-fuchsia-500" min="14" max="20" defaultValue="16" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Live Preview Area */}
        <div className="w-2/3 border rounded-xl flex flex-col relative overflow-hidden" style={{ backgroundColor: colors.background }}>
          <div className="p-4 border-b flex justify-between items-center" style={{ backgroundColor: colors.card, color: colors.text, borderColor: colors.muted + '40' }}>
            <span className="font-bold flex items-center gap-2">Live Preview <span className="text-xs bg-black/10 px-2 py-0.5 rounded-full text-foreground/50">Twoja marka</span></span>
            <div className="flex gap-4 text-sm font-medium">
              <span style={{ color: colors.muted }}>O nas</span>
              <span style={{ color: colors.muted }}>Usługi</span>
              <span style={{ color: colors.primary }}>Kontakt</span>
            </div>
          </div>

          <div className="flex-1 p-12 overflow-auto relative">
            <div className="max-w-xl mx-auto space-y-8">
              <div className="space-y-4">
                <span
                  className="px-3 py-1 text-xs font-bold rounded-full uppercase tracking-wider"
                  style={{ backgroundColor: colors.primary + '20', color: colors.primary }}
                >
                  AI Website Studio
                </span>
                <h1 className="text-5xl font-black tracking-tight leading-tight" style={{ color: colors.text }}>
                  Generuj wyjątkowe strony internetowe.
                </h1>
                <p className="text-lg leading-relaxed max-w-lg" style={{ color: colors.muted }}>
                  Narzędzie zapewniające najwyższą jakość designu dzięki modyfikowalnym tokenom globalnym i systemowi harmonii kolorów.
                </p>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  className="px-6 py-3 rounded-lg font-bold shadow-lg transition-transform hover:-translate-y-1"
                  style={{ backgroundColor: colors.primary, color: '#fff' }}
                >
                  Rozpocznij teraz
                </button>
                <button
                  className="px-6 py-3 rounded-lg font-bold border-2 transition-colors hover:bg-black/5"
                  style={{ borderColor: colors.secondary, color: colors.secondary }}
                >
                  Zobacz funkcje
                </button>
              </div>

              <div className="pt-8 grid grid-cols-2 gap-4">
                <div className="p-6 rounded-xl border shadow-sm" style={{ backgroundColor: colors.card, borderColor: colors.muted + '20' }}>
                  <div className="w-10 h-10 rounded-full flex items-center justify-center mb-3" style={{ backgroundColor: colors.secondary + '20', color: colors.secondary }}>
                    <Palette size={20} />
                  </div>
                  <h3 className="font-semibold text-lg mb-1" style={{ color: colors.text }}>Palety Kolorów</h3>
                  <p className="text-sm leading-relaxed" style={{ color: colors.muted }}>
                    Twoja aplikacja automatycznie dobierze pozostałe wartości tokenów CSS.
                  </p>
                </div>
                <div className="p-6 rounded-xl border shadow-sm" style={{ backgroundColor: colors.card, borderColor: colors.muted + '20' }}>
                  <div className="w-10 h-10 rounded-full flex items-center justify-center mb-3" style={{ backgroundColor: colors.accent + '20', color: colors.accent }}>
                    <Share2 size={20} />
                  </div>
                  <h3 className="font-semibold text-lg mb-1" style={{ color: colors.text }}>Eksport</h3>
                  <p className="text-sm leading-relaxed" style={{ color: colors.muted }}>
                    Konfiguracja wygeneruje gotowy styl globals.css oraz obiekty Tailwind.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
