"use client";

import { Search, Plus, Save, AreaChart, Zap, SearchCode } from "lucide-react";

export default function SEOStudioPage() {
  return (
    <div className="h-full flex flex-col space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight mb-1 flex items-center gap-2">
            <Search className="text-yellow-500" /> SEO Studio
          </h1>
          <p className="text-muted-foreground text-sm">
            Zarządzaj metadanymi witryn, Schema Markup oraz wynikami Google PageSpeed dla wygenerowanych projektów.
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition-colors">
          <Save size={16} /> Zapisz dane globalne
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Quick Audits Cards */}
        <div className="border rounded-xl p-6 bg-card flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-green-500/10 flex items-center justify-center text-green-500">
            <AreaChart size={24} />
          </div>
          <div>
            <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider mb-1">Średni Core Web Vitals</p>
            <h3 className="text-3xl font-black">94<span className="text-lg text-muted-foreground font-normal">/100</span></h3>
          </div>
        </div>

        <div className="border rounded-xl p-6 bg-card flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
            <SearchCode size={24} />
          </div>
          <div>
            <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider mb-1">Strony w indeksie</p>
            <h3 className="text-3xl font-black">2<span className="text-lg text-muted-foreground font-normal">.4k</span></h3>
          </div>
        </div>

        <div className="border rounded-xl p-6 bg-card flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-yellow-500/10 flex items-center justify-center text-yellow-500">
            <Zap size={24} />
          </div>
          <div>
            <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider mb-1">Optymalizacje AI Oczekujące</p>
            <h3 className="text-3xl font-black">12</h3>
          </div>
        </div>
      </div>

      <div className="flex-1 flex gap-6 overflow-hidden">
        {/* SEO Tools List */}
        <div className="w-1/3 flex flex-col border rounded-xl bg-card">
          <div className="p-4 border-b font-semibold">
            Kreatory SEO (Automatyczne)
          </div>
          <div className="overflow-auto p-2 space-y-1">
            {[
              { name: "Schema Generator (JSON-LD)", status: "Aktywny" },
              { name: "Meta Tags Manager (Og, Twitter)", status: "Aktywny" },
              { name: "Konfigurator Sitemap.xml", status: "Wymaga uwagi" },
              { name: "Edytor Robots.txt", status: "Aktywny" },
              { name: "AI Keyword Suggester", status: "Nowość" },
            ].map((t, i) => (
              <button key={i} className={`w-full text-left p-3 rounded-md hover:bg-muted font-medium text-sm flex justify-between items-center transition-colors ${i === 0 ? 'bg-primary/5 text-primary' : ''}`}>
                {t.name}
                <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider ${t.status === 'Aktywny' ? 'bg-green-500/10 text-green-500' : t.status === 'Nowość' ? 'bg-blue-500/10 text-blue-500' : 'bg-yellow-500/10 text-yellow-500'}`}>{t.status}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Main Editor UI */}
        <div className="w-2/3 border rounded-xl bg-card flex flex-col">
          <div className="p-4 border-b bg-muted/20">
            <h2 className="font-semibold flex items-center gap-2">Schema Generator <span className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded">Zasilane przez AI</span></h2>
            <p className="text-xs text-muted-foreground mt-1">Strukturalne dane wyświetlane w Google (Rich Snippets).</p>
          </div>
          <div className="flex-1 overflow-auto p-6 space-y-6">

            <div>
              <label className="text-sm font-medium mb-1 block">Wybierz typ działalności</label>
              <select className="w-full bg-muted border border-border rounded-lg p-2.5 text-sm">
                <option>Lokalny Biznes (LocalBusiness)</option>
                <option>Sklep (Store)</option>
                <option>Organizacja (Organization)</option>
                <option>Artykuł / Blog (Article)</option>
                <option>Usługa (Service)</option>
                <option>Produkt (Product)</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Nazwa firmy / usługi</label>
                <input type="text" className="w-full bg-muted border border-border rounded-lg p-2.5 text-sm" placeholder="np. Braided Digital" value="Braided Digital" readOnly />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Branża (Schema Type)</label>
                <input type="text" className="w-full bg-muted border border-border rounded-lg p-2.5 text-sm" placeholder="np. ProfessionalService" value="ProfessionalService" readOnly />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Dynamiczny kod wstrzykiwany (Next.js Head)</label>
              <div className="bg-[#1e1e1e] p-4 rounded-lg relative font-mono text-xs leading-relaxed text-gray-300">
                <span className="text-pink-400">&lt;script</span> <span className="text-blue-300">type</span>=<span className="text-yellow-300">"application/ld+json"</span><span className="text-pink-400">&gt;</span><br />
                {`  {`}<br />
                {`    "@context": "https://schema.org",`}<br />
                {`    "@type": "ProfessionalService",`}<br />
                {`    "name": "Braided Digital",`}<br />
                {`    "image": "https://web.ma-atelier.pl/og-image.jpg",`}<br />
                {`    "@id": "https://web.ma-atelier.pl",`}<br />
                {`    "url": "https://web.ma-atelier.pl",`}<br />
                {`    "priceRange": "$$",`}<br />
                {`    "address": {`}<br />
                {`       "@type": "PostalAddress",`}<br />
                {`       "addressCountry": "PL"`}<br />
                {`    }`}<br />
                {`  }`}<br />
                <span className="text-pink-400">&lt;/script&gt;</span>
              </div>
              <button className="mt-3 w-full border border-dashed rounded-lg p-3 text-sm text-primary font-medium hover:bg-primary/5 flex items-center justify-center gap-2">
                <Plus size={16} /> Dodaj własną właściwość Schema z użyciem AI
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
