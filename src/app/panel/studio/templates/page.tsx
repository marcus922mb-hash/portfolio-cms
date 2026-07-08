"use client";

import { LayoutTemplate, PlusCircle, Target, Sparkles, Wand2 } from "lucide-react";

export default function TemplateBuilderPage() {
  const templates = [
    { name: "Nowoczesny Prawnik", category: "Usługi", useCount: 24, status: "Aktywny" },
    { name: "SaaS App Landing", category: "Startup", useCount: 89, status: "Aktywny" },
    { name: "Klinika Dentystyczna", category: "Zdrowie", useCount: 15, status: "Draft" },
    { name: "Restauracja Fusion", category: "Gastro", useCount: 42, status: "Aktywny" },
    { name: "Minimalistyczne Portfolio", category: "Osobiste", useCount: 112, status: "Wymaga aktualizacji" },
  ];

  return (
    <div className="h-full flex flex-col space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight mb-1 flex items-center gap-2">
            <LayoutTemplate className="text-violet-500" /> Template Builder
          </h1>
          <p className="text-muted-foreground text-sm">
            Zarządzaj gotowymi strukturami witryn, z których AI lub użytkownik mogą korzystać przy startowaniu nowych projektów.
          </p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white rounded-md font-medium hover:opacity-90 transition-opacity">
            <Wand2 size={16} /> Generuj AI
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition-colors">
            <PlusCircle size={16} /> Nowy Szablon
          </button>
        </div>
      </div>

      <div className="flex-1 flex gap-6 overflow-hidden">
        {/* Templates Grid / List */}
        <div className="w-1/2 flex flex-col border rounded-xl bg-card overflow-hidden">
          <div className="p-4 border-b font-medium bg-muted/20 flex justify-between items-center">
            Istniejące Skupiska
            <input type="text" placeholder="Szukaj..." className="bg-background border border-border px-3 py-1 rounded text-sm w-48" />
          </div>
          <div className="flex-1 overflow-auto p-4 flex flex-col gap-3">
            {templates.map((tpl, idx) => (
              <div key={idx} className={`p-4 border rounded-xl cursor-pointer hover:border-violet-500/50 transition-colors flex gap-4 ${idx === 1 ? 'border-violet-500/50 bg-violet-500/5' : 'bg-background'}`}>
                <div className="w-24 h-16 bg-muted rounded flex items-center justify-center shrink-0">
                  <LayoutTemplate className="text-muted-foreground/30" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">{tpl.name}</h3>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                    <span className="flex items-center gap-1"><Target size={12} /> {tpl.category}</span>
                    <span>Użyto: {tpl.useCount}x</span>
                  </div>
                </div>
                <div className="pt-1">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider ${tpl.status === 'Aktywny' ? 'bg-green-500/10 text-green-500' : tpl.status === 'Draft' ? 'bg-muted text-muted-foreground' : 'bg-orange-500/10 text-orange-500'}`}>{tpl.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Selected Template Details / AI Config */}
        <div className="w-1/2 border rounded-xl bg-card flex flex-col overflow-hidden relative">

          <div className="p-6 border-b flex justify-between items-start bg-gradient-to-r from-violet-500/10 to-transparent">
            <div>
              <h2 className="text-2xl font-bold mb-1">SaaS App Landing</h2>
              <p className="text-muted-foreground">Kategoria: Startup • 8 Skonfigurowanych Sekcji</p>
            </div>
            <button className="text-sm font-medium text-violet-500 bg-violet-500/10 px-3 py-1.5 rounded-lg hover:bg-violet-500/20">Otwórz w Visual Builderze</button>
          </div>

          <div className="flex-1 overflow-auto p-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">Struktura szablonu (Drzewo komponentów)</h3>

            <div className="space-y-3 relative before:absolute before:inset-y-0 before:left-3.5 before:w-px before:bg-border">
              {["HeroSection (Variant: Split Video)", "LogoCloud (Variant: Infinite Marquee)", "FeaturesSection (Variant: Bento Grid)", "Testimonials (Variant: Carousel)", "PricingCard (Variant: 3-Tiers)", "Footer (Variant: Simple)"].map((comp, i) => (
                <div key={i} className="flex items-center gap-4 relative z-10">
                  <div className="w-7 h-7 rounded-full bg-background border flex items-center justify-center font-mono text-xs font-bold text-muted-foreground">{i + 1}</div>
                  <div className="flex-1 p-3 border rounded-lg bg-muted/20 font-medium text-sm flex justify-between items-center group">
                    {comp}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                      <button className="text-xs text-muted-foreground hover:text-orange-500">Zmień wariant</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mt-8 mb-4 flex items-center gap-2"><Sparkles size={16} className="text-violet-500" /> Instrukcje Promtowe AI</h3>
            <div className="bg-muted p-4 rounded-xl text-sm leading-relaxed text-muted-foreground">
              "Jesteśmy nowoczesnym narzędziem typu SaaS dla programistów. Główny nacisk postaw na szybkość i prostotę. Kolory fioletowe i ciemne tła bazujące na slate-900. Język kopi musi być bardzo techniczny ale skupiony na oszczędności czasu."
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
