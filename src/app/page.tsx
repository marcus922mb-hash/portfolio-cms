import Link from 'next/link'
import { ArrowRight, Code2, Sparkles, MonitorSmartphone, Palette, Layers, ChevronRight } from 'lucide-react'

// Oznaczenie komponentu jako Server Component, domyślnie Next.js to robi, ale piszemy bez 'use client'
export const dynamic = 'force-dynamic' // upewniamy się, że strona pobiera najnowsze dane jeśli dodamy SSR

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30">
      {/* Nawigacja */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-white/5">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold">
              MA
            </div>
            <span className="font-semibold tracking-tight">Atelier</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            <Link href="#uslugi" className="hover:text-foreground transition-colors">Usługi</Link>
            <Link href="#proces" className="hover:text-foreground transition-colors">Proces</Link>
            <Link href="/projects" className="hover:text-foreground transition-colors">Portfolio</Link>
            <Link href="/blog" className="hover:text-foreground transition-colors">Wiedza</Link>
          </div>
          <Link href="#kontakt" className="px-4 py-2 text-sm font-medium bg-foreground text-background rounded-full hover:scale-105 transition-transform">
            Porozmawiajmy
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-20 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-muted/50 text-xs font-medium text-muted-foreground animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Web Design for creatives
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-balance leading-tight animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
            Śmiałe marki zasługują na <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-violet-500">konkretne strony</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground text-balance max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
            Projektuję strony, sklepy i linki w bio z myślą o małych firmach i markach handmade. Bez nadmiaru, bez sprintu przez chaos.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
            <Link href="#kontakt" className="h-12 px-8 flex items-center justify-center rounded-full bg-foreground text-background font-medium hover:scale-105 transition-transform w-full sm:w-auto">
              Rozpocznij projekt <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
            <Link href="/projects" className="h-12 px-8 flex items-center justify-center rounded-full border border-border bg-background hover:bg-muted font-medium w-full sm:w-auto">
              Zobacz portfolio
            </Link>
          </div>
        </div>
      </section>

      {/* Feature / Value prop */}
      <section className="py-24 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">Dobieramy zakres, nie nadmiar.</h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Sprzedajesz rękodzieło? Prowadzisz małą usługę? Masz stronę, ale coś nie działa?
              Możesz zacząć od małej cyfrowej wizytówki lub od razu postawić na zautomatyzowany sklep online.
              Dopasowuję rozwiązanie do etapu, na którym jest Twój biznes.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-6 rounded-3xl bg-background border border-border shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                <MonitorSmartphone className="w-5 h-5" />
              </div>
              <h3 className="font-semibold">Cyfrowa wizytówka</h3>
              <p className="text-sm text-muted-foreground">Idealne dla startujących usług.</p>
            </div>
            <div className="p-6 rounded-3xl bg-background border border-border shadow-sm space-y-3 translate-y-8">
              <div className="w-10 h-10 rounded-full bg-violet-500/10 flex items-center justify-center text-violet-600">
                <Palette className="w-5 h-5" />
              </div>
              <h3 className="font-semibold">Sklep handmade</h3>
              <p className="text-sm text-muted-foreground">Sprzedawaj rękodzieło online.</p>
            </div>
            <div className="p-6 rounded-3xl bg-background border border-border shadow-sm space-y-3 -translate-y-8">
              <div className="w-10 h-10 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-600">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="font-semibold">Link w bio</h3>
              <p className="text-sm text-muted-foreground">Uporządkuj swoje sociale.</p>
            </div>
            <div className="p-6 rounded-3xl bg-background border border-border shadow-sm space-y-3 flex items-center justify-center">
              <Link href="/projects" className="group flex items-center text-sm font-semibold hover:text-primary transition-colors">
                Zobacz opcje <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer minimal */}
      <footer className="py-12 px-4 border-t border-border">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} MA Atelier. Zbudowane z Portfolio CMS.</p>
          <div className="flex gap-4">
            <Link href="/admin">Panel CMS</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
