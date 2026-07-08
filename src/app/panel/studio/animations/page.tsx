"use client";

import { Film, Play, Sliders, Save, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function AnimationStudioPage() {
  const [activeTab, setActiveTab] = useState("scroll");

  const animations = {
    scroll: [
      { id: "revealUp", name: "Reveal Up", desc: "Zanikanie z ruchem w górę przy scrollu" },
      { id: "parallaxText", name: "Parallax Text", desc: "Wielowarstwowy efekt na przewijaniu" },
      { id: "scaleOut", name: "Scale Out", desc: "Powiększanie przy wchodzeniu w viewport" },
    ],
    hover: [
      { id: "magnetic", name: "Magnetic Button", desc: "Przycisk przyciąga kursor (Framer Motion)" },
      { id: "3dtilt", name: "3D Tilt Card", desc: "Karta wychyla się zgodnie z myszką" },
      { id: "glowBorder", name: "Glow Border", desc: "Obramowanie świecące po najechaniu" },
    ],
    effects: [
      { id: "aurora", name: "Aurora Background", desc: "Gradienty pływające w tle (CSS + Canvas)" },
      { id: "particles", name: "Particles", desc: "Interaktywne cząsteczki z Three.js" },
    ]
  };

  const currentList = animations[activeTab as keyof typeof animations] || [];

  return (
    <div className="h-full flex flex-col space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight mb-1 flex items-center gap-2">
            <Film className="text-orange-500" /> Animation Studio
          </h1>
          <p className="text-muted-foreground text-sm">
            Kreator animacji (Framer Motion / GSAP). Przypisz efekty by używać ich w Visual Builderze.
          </p>
        </div>
        <button
          onClick={() => toast.success("Zmiany zapisane w globalnym obiekcie Theme")}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition-colors"
        >
          <Save size={16} /> Zapisz w bibliotece
        </button>
      </div>

      <div className="flex-1 flex gap-6 overflow-hidden">
        {/* Settings Area */}
        <div className="w-1/3 flex flex-col border rounded-xl bg-card">
          <div className="flex border-b text-sm font-medium">
            <button
              onClick={() => setActiveTab("scroll")}
              className={`flex-1 p-3 border-b-2 transition-colors ${activeTab === 'scroll' ? 'border-orange-500 text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
            >
              Scroll
            </button>
            <button
              onClick={() => setActiveTab("hover")}
              className={`flex-1 p-3 border-b-2 transition-colors ${activeTab === 'hover' ? 'border-orange-500 text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
            >
              Hover
            </button>
            <button
              onClick={() => setActiveTab("effects")}
              className={`flex-1 p-3 border-b-2 transition-colors ${activeTab === 'effects' ? 'border-orange-500 text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
            >
              Effects
            </button>
          </div>

          <div className="flex-1 overflow-auto p-4 space-y-3">
            {currentList.map(a => (
              <div key={a.id} className="p-3 border rounded-lg bg-background hover:border-orange-500/50 cursor-pointer group transition-colors">
                <div className="flex justify-between items-start mb-1">
                  <span className="font-semibold">{a.name}</span>
                  <button className="text-muted-foreground group-hover:text-foreground" title="Podgląd">
                    <Play size={14} />
                  </button>
                </div>
                <p className="text-xs text-muted-foreground">{a.desc}</p>
              </div>
            ))}
            <button className="w-full p-3 border border-dashed rounded-lg text-center text-sm font-medium text-muted-foreground hover:text-foreground hover:border-orange-500/30 flex items-center justify-center gap-2 transition-colors">
              <Plus size={14} /> Dodaj własną animację
            </button>
          </div>
        </div>

        {/* Live Preview Area */}
        <div className="w-2/3 border rounded-xl bg-card flex flex-col relative overflow-hidden">
          <div className="p-3 border-b bg-muted/20 flex justify-between items-center">
            <span className="text-sm font-medium flex items-center gap-2"><Play size={14} className="text-orange-500" /> Live Preview</span>
            <div className="flex items-center gap-4 text-xs font-medium">
              Zmień tło:
              <div className="w-4 h-4 rounded-full bg-black cursor-pointer border border-white/20"></div>
              <div className="w-4 h-4 rounded-full bg-white cursor-pointer border border-black/20"></div>
              <div className="w-4 h-4 rounded-full bg-orange-500 cursor-pointer border border-orange-500"></div>
            </div>
          </div>

          <div className="flex-1 flex justify-center items-center bg-gray-900 overflow-hidden relative">
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-orange-400 via-transparent to-transparent"></div>

            {/* Component to animate */}
            <div className="relative z-10 w-64 p-6 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-xl flex flex-col items-center hover:scale-105 transition-transform duration-500 hover:shadow-orange-500/20 cursor-pointer group">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-400 to-pink-500 mb-4 group-hover:rotate-12 transition-transform duration-500"></div>
              <div className="h-4 w-32 bg-white/20 rounded mb-2"></div>
              <div className="h-2 w-20 bg-white/10 rounded mb-4"></div>
              <button className="w-full py-2 bg-white/10 hover:bg-orange-500 text-white text-sm font-medium rounded-lg transition-colors duration-300">
                Przykładowy Przycisk
              </button>
            </div>
          </div>

          <div className="h-48 border-t bg-muted/10 p-4">
            <div className="flex items-center gap-2 font-medium text-sm mb-4">
              <Sliders size={16} /> Parametry (Framer Motion / Spring)
            </div>
            <div className="grid grid-cols-3 gap-6">
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Damping (Amortyzacja)</label>
                <input type="range" className="w-full accent-orange-500" min="0" max="100" defaultValue="20" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Stiffness (Sztywność)</label>
                <input type="range" className="w-full accent-orange-500" min="0" max="500" defaultValue="100" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Opóźnienie (s)</label>
                <input type="range" className="w-full accent-orange-500" min="0" max="3" step="0.1" defaultValue="0" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
