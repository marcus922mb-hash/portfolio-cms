import Link from "next/link";
import { Arrow } from "./icons";
import type { DemoConfig } from "@/lib/demo-configs";
import { borderColor, mutedColor, textColor } from "@/lib/demo-configs";

// ─── Small thumbnail previews (used on pricing page) ──────────────────────────

export function PackagePreview({ slug }: { slug: string }) {
  const common = "demo-preview relative mb-7 aspect-[16/10] overflow-hidden border border-black/10";
  if (slug === "cyfrowa-wizytowka")
    return <div className={`${common} bg-[#17352f] p-4 text-[#f4ead8]`}><div className="flex justify-between text-[5px] uppercase tracking-[.2em]"><b>Olive Studio</b><span>Kontakt</span></div><div className="mt-7 max-w-[75%]"><p className="font-serif text-2xl leading-[.8]">Piękne wnętrza.<br/><i className="text-[#d7b77a]">Spokojne życie.</i></p><p className="mt-3 max-w-[80%] text-[5px] leading-3 text-white/50">Projektuję miejsca, które wyglądają dobrze i jeszcze lepiej się w nich żyje.</p><span className="mt-3 inline-block bg-[#d7b77a] px-3 py-1.5 text-[5px] font-bold text-[#17352f]">UMÓW ROZMOWĘ</span></div><div className="absolute -bottom-8 -right-4 size-28 rounded-full border-[12px] border-[#d7b77a]/20"/></div>;
  if (slug === "link-w-bio")
    return <div className={`${common} grid place-items-center bg-[linear-gradient(145deg,#f3c8c1,#f8e9df)] p-3`}><div className="h-[92%] w-[37%] rounded-[16px] border-[3px] border-[#3d2827] bg-[#fffaf7] p-2 text-center shadow-xl"><div className="mx-auto size-8 rounded-full bg-[linear-gradient(145deg,#b16d62,#f0c9b5)]"/><p className="mt-1 font-serif text-[9px]">Luna Ceramics</p><p className="text-[4px] text-black/45">ceramika tworzona powoli</p>{["NOWA KOLEKCJA", "SKLEP ONLINE", "WARSZTATY"].map(x=><span key={x} className="mt-1.5 block border border-[#b16d62]/30 px-1 py-1 text-[4px]">{x}</span>)}</div></div>;
  if (slug === "one-page")
    return <div className={`${common} bg-[#f4eee5] text-[#5d3328]`}><div className="flex items-center justify-between px-4 py-2 text-[5px] uppercase tracking-widest"><b>SOMA</b><span>O mnie · Oferta · Kontakt</span></div><div className="grid h-[80%] grid-cols-[1.1fr_.9fr]"><div className="flex flex-col justify-center p-4"><span className="text-[4px] uppercase tracking-[.2em]">Holistyczna pielęgnacja</span><p className="mt-2 font-serif text-xl leading-[.85]">Wracaj do siebie.<br/><i className="text-[#a85e48]">Łagodnie.</i></p><span className="mt-3 w-fit bg-[#5d3328] px-3 py-1 text-[4px] text-white">POZNAJ OFERTĘ</span></div><div className="bg-[radial-gradient(circle_at_50%_30%,#e8c9b8,transparent_20%),linear-gradient(145deg,#80574a,#d9aa91)]"/></div></div>;
  if (slug === "strona-firmowa")
    return <div className={`${common} bg-[#e9edf0] text-[#142a3b]`}><div className="flex justify-between bg-white px-4 py-2 text-[5px] uppercase tracking-widest"><b>NOVA ARCHITEKCI</b><span>Projekty · Studio · Proces · Kontakt</span></div><div className="grid h-[78%] grid-cols-[.8fr_1.2fr]"><div className="p-4"><span className="text-[4px] text-[#a27142]">ARCHITEKTURA / WNĘTRZA</span><p className="mt-4 font-serif text-xl leading-none">Przestrzeń<br/>z charakterem.</p><div className="mt-5 h-px w-10 bg-[#a27142]"/></div><div className="m-2 bg-[linear-gradient(135deg,#6f7b80,#c1b8aa)]"/></div></div>;
  if (slug === "mini-sklep-handmade")
    return <div className={`${common} bg-[#f7f2ea] p-3 text-[#3b3028]`}><div className="flex justify-between border-b border-black/10 pb-2 text-[5px] uppercase tracking-widest"><b>MILA HANDMADE</b><span>Sklep · O marce · Koszyk</span></div><p className="py-3 text-center font-serif text-base">Małe rzeczy. Wielka czułość.</p><div className="grid grid-cols-3 gap-2">{["#c7a98c","#a78d78","#d8c7b5"].map((cl,i)=><div key={cl}><div className="aspect-square" style={{background:`linear-gradient(145deg,${cl},#eee2d3)`}}/><p className="mt-1 text-[4px]">Lniana ozdoba {i+1}</p><b className="block text-[4px]">{49+i*10},00 zł</b></div>)}</div></div>;
  return <div className={`${common} bg-white text-black`}><div className="flex justify-between border-b px-4 py-2 text-[5px] uppercase tracking-[.18em]"><b>FORM / STORE</b><span>New · Woman · Objects · Bag (0)</span></div><div className="grid h-[82%] grid-cols-2"><div className="bg-[linear-gradient(155deg,#252525,#a5a5a5)]"/><div className="flex flex-col justify-center p-4"><span className="text-[4px] uppercase tracking-widest">New collection / 26</span><p className="mt-2 text-xl font-light leading-none">Essential<br/>forms.</p><span className="mt-3 w-fit border-b border-black pb-1 text-[4px]">SHOP THE EDIT</span></div></div></div>;
}

// ─── Full-size demo views ──────────────────────────────────────────────────────

export function PackageDemo({ slug, config: c }: { slug: string; config: DemoConfig }) {
  const tc = textColor(c.bgColor);
  const mc = mutedColor(c.bgColor);
  const bc = borderColor(c.bgColor);
  const trans = "background-color 0.35s ease, color 0.35s ease";

  // ── Cyfrowa wizytówka ──
  if (slug === "cyfrowa-wizytowka") return (
    <div style={{ backgroundColor: c.bgColor, color: tc, transition: trans }} className="min-h-[78vh]">
      <nav style={{ color: tc }} className="mx-auto flex max-w-6xl items-center justify-between px-6 py-7 text-xs uppercase tracking-[.18em]">
        <b>{c.brandName}</b>
        <span style={{ color: mc }} className="hidden md:inline">Projektowanie wnętrz · Kontakt</span>
      </nav>
      <div className="mx-auto grid min-h-[62vh] max-w-6xl items-center gap-10 px-6 py-14 md:grid-cols-[1.1fr_.9fr]">
        <div>
          <p style={{ color: c.accentColor }} className="text-xs uppercase tracking-[.22em]">{c.tagline}</p>
          <h1 className="mt-7 font-serif text-5xl leading-[.9] md:text-8xl">
            {c.headline}<br/>
            <i style={{ color: c.accentColor }}>{c.headlineItalic}</i>
          </h1>
          <p style={{ color: mc }} className="mt-7 max-w-md text-sm leading-7">{c.body}</p>
          <a style={{ backgroundColor: c.accentColor, color: c.bgColor }} className="mt-8 inline-block cursor-pointer px-6 py-4 text-xs font-bold">{c.cta}</a>
        </div>
        <div className="aspect-[4/5] bg-[linear-gradient(140deg,#6f6a59,#c9b892)] p-5">
          <div style={{ borderColor: `${tc}40` }} className="h-full border" />
        </div>
      </div>
    </div>
  );

  // ── Link w bio ──
  if (slug === "link-w-bio") return (
    <div style={{ background: `radial-gradient(circle at top, ${c.bgColor}, color-mix(in srgb, ${c.accentColor} 25%, ${c.bgColor}))`, color: tc }} className="grid min-h-[78vh] place-items-center px-5 py-16">
      <div className="w-full max-w-md text-center">
        <div className="mx-auto size-28 rounded-full border-4 border-white shadow-xl" style={{ background: `linear-gradient(145deg, ${c.accentColor}, color-mix(in srgb, ${c.accentColor} 50%, #f0e8d8))` }} />
        <h1 className="mt-6 font-serif text-4xl">{c.brandName}</h1>
        <p className="mt-2 text-xs uppercase tracking-[.18em]" style={{ color: mc }}>{c.tagline}</p>
        <div className="mt-8 space-y-3">
          {c.links.map((link, i) => (
            <a key={link} style={i === 0
              ? { backgroundColor: c.accentColor, color: lum(c.accentColor) > 0.5 ? "#1a1413" : "#fff" }
              : { backgroundColor: "rgba(255,255,255,0.25)", borderColor: `${c.accentColor}50`, color: tc }
            } className="flex cursor-pointer items-center justify-between border px-5 py-4 text-xs font-semibold transition hover:-translate-y-1 hover:bg-white/60">
              <span>{link}</span><span>↗</span>
            </a>
          ))}
        </div>
        <p style={{ color: mc }} className="mt-8 text-[.6rem] uppercase tracking-widest">Handmade in Poland</p>
      </div>
    </div>
  );

  // ── One page ──
  if (slug === "one-page") return (
    <div style={{ backgroundColor: c.bgColor, color: tc, transition: trans }}>
      <nav style={{ color: tc }} className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6 text-xs uppercase tracking-widest">
        <b className="font-serif text-2xl">{c.brandName}</b>
        <span style={{ color: mc }} className="hidden md:inline">O mnie · Zabiegi · Kontakt</span>
      </nav>
      <section className="mx-auto grid min-h-[65vh] max-w-6xl items-center md:grid-cols-2">
        <div className="px-6 py-16">
          <p style={{ color: c.accentColor }} className="text-xs uppercase tracking-[.2em]">{c.tagline}</p>
          <h1 className="mt-6 font-serif text-5xl leading-[.9] md:text-7xl">
            {c.headline}<br/>
            <i style={{ color: c.accentColor }}>{c.headlineItalic}</i>
          </h1>
          <p style={{ color: mc }} className="mt-7 max-w-md text-sm leading-7">{c.body}</p>
          <a style={{ backgroundColor: tc, color: c.bgColor }} className="mt-8 inline-block cursor-pointer px-6 py-4 text-xs uppercase tracking-widest">{c.cta}</a>
        </div>
        <div className="h-full min-h-[520px]" style={{ background: `radial-gradient(circle at 50% 25%, color-mix(in srgb, ${c.accentColor} 35%, #f0d8c8) 18%, transparent), linear-gradient(145deg, color-mix(in srgb, ${c.accentColor} 60%, #2a1a16), color-mix(in srgb, ${c.accentColor} 30%, #ddb090))` }} />
      </section>
      <section style={{ borderColor: `${tc}18` }} className="grid border-t md:grid-cols-3">
        {c.services.map((svc, i) => (
          <div key={svc} style={{ borderColor: `${tc}18` }} className="border-b border-r p-9">
            <span style={{ color: c.accentColor }} className="text-xs">0{i + 1}</span>
            <h2 className="mt-8 font-serif text-3xl">{svc}</h2>
            <p style={{ color: mc }} className="mt-3 text-xs">60–90 minut uważności tylko dla Ciebie.</p>
          </div>
        ))}
      </section>
    </div>
  );

  // ── Strona firmowa ──
  if (slug === "strona-firmowa") return (
    <div style={{ backgroundColor: c.bgColor, color: tc, transition: trans }} className="min-h-[78vh]">
      <nav style={{ color: tc }} className="flex items-center justify-between bg-white px-6 py-6 text-xs uppercase tracking-[.18em] md:px-12">
        <b>{c.brandName}</b>
        <span style={{ color: mc }} className="hidden md:inline">Projekty · Studio · Proces · Kontakt</span>
      </nav>
      <section className="grid min-h-[65vh] md:grid-cols-[.8fr_1.2fr]">
        <div className="flex flex-col justify-center px-8 py-16 md:px-16">
          <p style={{ color: c.accentColor }} className="text-xs uppercase tracking-[.2em]">{c.tagline}</p>
          <h1 className="mt-8 font-serif text-5xl leading-none md:text-8xl">
            {c.headline}<br/>
            <i style={{ color: c.accentColor }}>{c.headlineItalic}</i>
          </h1>
          <p style={{ color: mc }} className="mt-7 max-w-sm text-sm leading-7">{c.body}</p>
          <a style={{ borderColor: tc, color: tc }} className="mt-8 w-fit cursor-pointer border-b pb-2 text-xs uppercase tracking-widest">{c.cta}</a>
        </div>
        <div className="m-4 min-h-[500px]" style={{ background: `linear-gradient(135deg, color-mix(in srgb, ${c.accentColor} 40%, #59686d), color-mix(in srgb, ${c.accentColor} 20%, #c9c0b1))` }} />
      </section>
      <div style={{ backgroundColor: tc, color: c.bgColor }} className="grid md:grid-cols-3">
        {c.services.map((svc, i) => (
          <div key={svc} style={{ borderColor: `${c.bgColor}18` }} className="border-r p-8">
            <span style={{ color: c.accentColor }} className="text-xs">0{i + 1}</span>
            <p className="mt-5 font-serif text-3xl">{svc}</p>
          </div>
        ))}
      </div>
    </div>
  );

  // ── Mini sklep handmade ──
  if (slug === "mini-sklep-handmade") return (
    <div style={{ backgroundColor: c.bgColor, color: tc, transition: trans }} className="min-h-[78vh]">
      <div style={{ backgroundColor: tc, color: c.bgColor }} className="py-2 text-center text-[.6rem] uppercase tracking-[.2em]">
        Darmowa dostawa od 150 zł
      </div>
      <nav style={{ borderColor: bc }} className="mx-auto flex max-w-6xl items-center justify-between border-b px-6 py-6 text-xs uppercase tracking-widest">
        <b className="font-serif text-xl">{c.brandName}</b>
        <span style={{ color: mc }} className="hidden md:inline">Sklep · O marce · Koszyk (0)</span>
      </nav>
      <header className="mx-auto max-w-4xl px-6 py-16 text-center">
        <p style={{ color: c.accentColor }} className="text-xs uppercase tracking-[.2em]">{c.tagline}</p>
        <h1 className="mt-5 font-serif text-4xl md:text-5xl">
          {c.headline}<br/>
          {c.headlineItalic && <i>{c.headlineItalic}</i>}
        </h1>
        <p style={{ color: mc }} className="mx-auto mt-5 max-w-lg text-sm">{c.body}</p>
      </header>
      <section className="mx-auto grid max-w-6xl gap-5 px-6 pb-20 sm:grid-cols-2 md:grid-cols-3">
        {c.products.map((p, i) => (
          <article key={p.name}>
            <div className="aspect-square" style={{ background: `linear-gradient(145deg, color-mix(in srgb, ${c.accentColor} ${70 - i * 10}%, #eee), color-mix(in srgb, ${c.accentColor} 20%, #f5ece0))` }} />
            <div style={{ color: tc }} className="flex justify-between py-4 text-sm">
              <span>{p.name}</span>
              <b>{p.price} zł</b>
            </div>
            <button style={{ borderColor: bc, color: tc }} className="w-full border py-3 text-xs uppercase tracking-widest">{c.cta}</button>
          </article>
        ))}
      </section>
    </div>
  );

  // ── Sklep online ──
  return (
    <div style={{ backgroundColor: c.bgColor, color: tc, transition: trans }} className="min-h-[78vh]">
      <div style={{ backgroundColor: tc, color: c.bgColor }} className="py-2 text-center text-[.6rem] uppercase tracking-[.2em]">
        New collection available now
      </div>
      <nav style={{ borderColor: bc }} className="flex items-center justify-between border-b px-6 py-6 text-xs uppercase tracking-[.18em] md:px-12">
        <b>{c.brandName}</b>
        <span style={{ color: mc }} className="hidden md:inline">New · Woman · Objects · Bag (0)</span>
      </nav>
      <section className="grid min-h-[70vh] md:grid-cols-2">
        <div className="min-h-[520px]" style={{ background: `linear-gradient(155deg, color-mix(in srgb, ${c.accentColor} 80%, #202020), color-mix(in srgb, ${c.accentColor} 30%, #acacac))` }} />
        <div className="flex flex-col justify-center px-8 py-16 md:px-20">
          <p style={{ color: mc }} className="text-xs uppercase tracking-[.2em]">{c.tagline}</p>
          <h1 className="mt-7 text-5xl font-light leading-[.9] md:text-7xl">
            {c.headline}<br/>
            {c.headlineItalic}
          </h1>
          <p style={{ color: mc }} className="mt-7 max-w-sm text-sm leading-7">{c.body}</p>
          <a style={{ backgroundColor: tc, color: c.bgColor }} className="mt-8 w-fit cursor-pointer px-7 py-4 text-xs uppercase tracking-widest">{c.cta}</a>
        </div>
      </section>
      <section className="grid grid-cols-2 md:grid-cols-4">
        {c.products.map((p, i) => (
          <article key={p.name} style={{ borderColor: bc }} className="border-r border-t">
            <div className="aspect-[3/4]" style={{ background: i % 2 ? `color-mix(in srgb, ${c.accentColor} 15%, #c8c4be)` : `color-mix(in srgb, ${c.accentColor} 50%, #444)` }} />
            <div style={{ color: tc }} className="flex justify-between p-4 text-xs">
              <span>{p.name}</span>
              <b>{p.price} zł</b>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}

// ─── Continuation sections ─────────────────────────────────────────────────────

export function DemoContinuation({ slug, config: c }: { slug: string; config: DemoConfig }) {
  const tc = textColor(c.bgColor);
  const mc = mutedColor(c.bgColor);

  // ── Cyfrowa wizytówka ──
  if (slug === "cyfrowa-wizytowka") return (
    <>
      <section style={{ backgroundColor: lum(c.bgColor) > 0.5 ? c.bgColor : "#f4ead8" }}>
        <div className="mx-auto grid max-w-6xl gap-8 px-6 py-16 md:grid-cols-3">
          {c.services.map((svc, i) => (
            <article key={svc} className="border-t pt-5" style={{ borderColor: `${tc}25` }}>
              <span style={{ color: c.accentColor }} className="text-xs">0{i + 1}</span>
              <h2 className="mt-5 font-serif text-2xl md:text-3xl">{svc}</h2>
              <p className="mt-3 text-sm text-black/50">Indywidualny projekt dopasowany do potrzeb i charakteru wnętrza.</p>
            </article>
          ))}
        </div>
      </section>
      <section className="bg-white">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-20 md:grid-cols-2">
          <div className="aspect-[4/3]" style={{ background: `linear-gradient(145deg, color-mix(in srgb, ${c.accentColor} 30%, #c9b892), color-mix(in srgb, ${c.accentColor} 10%, #e8dcc8))` }} />
          <div>
            <span style={{ color: c.accentColor }} className="text-xs uppercase tracking-[.2em]">O studio</span>
            <h2 className="mt-5 font-serif text-4xl md:text-5xl" style={{ color: "#1a1413" }}>Projekt to<br/>rozmowa.</h2>
            <p className="mt-5 text-sm leading-7 text-black/50">Projektuję razem z Tobą – słuchając, pokazując i dopasowując kierunek do Twojego gustu, stylu życia i budżetu.</p>
            <div className="mt-10 grid grid-cols-3 gap-4 border-y border-black/10 py-6 text-center">
              {[["7","lat praktyki"],["120+","projektów"],["4,9/5","opinie"]].map(([val, lbl]) => (
                <div key={lbl}><b className="font-serif text-3xl">{val}</b><span className="block text-[.6rem] uppercase text-black/40">{lbl}</span></div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <section className="bg-[#eee4d4] px-6 py-20 text-[#1a1413]">
        <div className="mx-auto max-w-6xl">
          <p style={{ color:c.accentColor }} className="text-xs uppercase tracking-[.2em]">Współpraca</p>
          <div className="mt-8 grid gap-px md:grid-cols-4" style={{backgroundColor:`${c.accentColor}35`}}>
            {[
              ["01","Rozmowa","Poznaję wnętrze, potrzeby i budżet."],
              ["02","Koncepcja","Układ, materiały i kierunek wizualny."],
              ["03","Projekt","Dokumentacja i konkretne rozwiązania."],
              ["04","Realizacja","Wsparcie na etapie zmian i zakupów."],
            ].map(([n,title,text])=><article key={n} className="bg-[#eee4d4] p-6"><span style={{color:c.accentColor}} className="text-xs">{n}</span><h3 className="mt-7 font-serif text-2xl">{title}</h3><p className="mt-3 text-xs leading-6 text-black/50">{text}</p></article>)}
          </div>
        </div>
      </section>
      <section className="bg-white px-6 py-20 text-[#1a1413]">
        <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-[.7fr_1.3fr]">
          <div><p style={{color:c.accentColor}} className="text-xs uppercase tracking-[.2em]">FAQ</p><h2 className="mt-5 font-serif text-4xl">Zanim zaczniemy projekt.</h2></div>
          <div className="divide-y divide-black/10">
            {[
              ["Czy konsultacja może odbyć się online?","Tak. Cały projekt może być prowadzony zdalnie na podstawie rozmów, planów i zdjęć."],
              ["Czy pomagasz dobrać wykonawców?","Mogę przygotować listę potrzebnych specjalistów i wesprzeć rozmowy wykonawcze."],
              ["Czy projekt uwzględnia konkretny budżet?","Tak. Budżet jest jednym z głównych punktów wyjścia do wyboru materiałów i zakresu."],
            ].map(([q,a])=><details key={q} className="py-5"><summary className="flex justify-between gap-5 font-serif text-xl"><span>{q}</span><span style={{color:c.accentColor}}>+</span></summary><p className="max-w-xl pt-3 text-xs leading-6 text-black/50">{a}</p></details>)}
          </div>
        </div>
      </section>
      <section style={{ backgroundColor: c.accentColor, color: lum(c.accentColor) > 0.5 ? "#1a1413" : "#fff" }} className="px-6 py-16 text-center">
        <p className="text-xs uppercase tracking-widest opacity-60">Nowy projekt</p>
        <h2 className="mt-4 font-serif text-4xl md:text-5xl">Porozmawiajmy o Twoim wnętrzu.</h2>
        <a style={{ borderColor: lum(c.accentColor) > 0.5 ? "#1a1413" : "#fff", color: lum(c.accentColor) > 0.5 ? "#1a1413" : "#fff" }} className="mt-7 inline-block cursor-pointer border px-7 py-4 text-xs uppercase tracking-widest">
          Umów rozmowę
        </a>
      </section>
      <footer style={{ backgroundColor: c.bgColor, color: tc }} className="px-6 py-10">
        <div className="mx-auto flex max-w-6xl flex-col justify-between gap-5 text-sm md:flex-row">
          <b className="font-serif text-2xl">{c.brandName}</b>
          <div>
            <p>hello@{c.brandName.toLowerCase().replace(/\s+/g, "")}.demo</p>
            <p style={{ color: mc }}>+48 000 000 000 · Poznań</p>
          </div>
          <span style={{ color: mc }}>Przykładowa wizytówka</span>
        </div>
      </footer>
    </>
  );

  // ── Link w bio ──
  if (slug === "link-w-bio") return (
    <>
      <section style={{ backgroundColor: c.bgColor, color: tc }} className="px-5 py-20">
        <div className="mx-auto max-w-4xl">
          <div className="text-center">
            <p style={{ color: c.accentColor }} className="text-xs uppercase tracking-[.2em]">Najnowsza kolekcja</p>
            <h2 className="mt-4 font-serif text-4xl md:text-5xl">Przedmioty na małe rytuały.</h2>
            <p style={{ color: mc }} className="mx-auto mt-4 max-w-lg text-sm leading-7">Każda forma powstaje ręcznie w krótkiej serii. Różnice w szkliwie i kształcie są częścią jej charakteru.</p>
          </div>
          <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-3">
            {[
              ["Kubek Poranek", "89 zł", "70%"],
              ["Misa Luna", "119 zł", "48%"],
              ["Wazon Soft", "149 zł", "30%"],
            ].map(([name, price, mix], index) => (
              <article key={name} className={index === 2 ? "col-span-2 md:col-span-1" : ""}>
                <div className="aspect-square rounded-t-[45%]" style={{ background: `linear-gradient(145deg, color-mix(in srgb, ${c.accentColor} ${mix}, #8d655c), color-mix(in srgb, ${c.accentColor} 12%, #f4dfd2))` }} />
                <div className="flex items-center justify-between border-b px-1 py-4 text-xs" style={{ borderColor: `${c.accentColor}30` }}>
                  <span>{name}</span><b>{price}</b>
                </div>
              </article>
            ))}
          </div>
          <button style={{ backgroundColor: c.accentColor, color: "#fff" }} className="mx-auto mt-9 block px-7 py-4 text-xs font-bold uppercase tracking-widest">Przejdź do sklepu</button>
        </div>
      </section>

      <section style={{ background: `color-mix(in srgb, ${c.accentColor} 16%, ${c.bgColor})`, color: tc }} className="px-5 py-20">
        <div className="mx-auto grid max-w-4xl items-center gap-10 md:grid-cols-[.85fr_1.15fr]">
          <div className="aspect-[4/5] rounded-t-full" style={{ background: `radial-gradient(circle at 50% 30%, color-mix(in srgb, ${c.accentColor} 35%, #efc7b7) 0 18%, transparent 18.5%), linear-gradient(145deg, color-mix(in srgb, ${c.accentColor} 75%, #5f3c36), #e7c6b6)` }} />
          <div>
            <p style={{ color: c.accentColor }} className="text-xs uppercase tracking-[.2em]">Za kulisami</p>
            <h2 className="mt-5 font-serif text-4xl md:text-5xl">Cześć, jestem Lena.</h2>
            <p style={{ color: mc }} className="mt-5 text-sm leading-7">Lepię, szkliwię i wypalam każdą rzecz w małej pracowni. Lubię spokojne kolory, niedoskonałe linie i przedmioty, po które chce się sięgać codziennie.</p>
            <div className="mt-7 grid grid-cols-2 gap-3 text-xs">
              <span className="border px-4 py-3" style={{ borderColor: `${c.accentColor}35` }}>krótkie serie</span>
              <span className="border px-4 py-3" style={{ borderColor: `${c.accentColor}35` }}>ręczna praca</span>
              <span className="border px-4 py-3" style={{ borderColor: `${c.accentColor}35` }}>wysyłka w 2–4 dni</span>
              <span className="border px-4 py-3" style={{ borderColor: `${c.accentColor}35` }}>pracownia w Polsce</span>
            </div>
          </div>
        </div>
      </section>

      <section style={{ backgroundColor: c.bgColor, color: tc }} className="px-5 py-20">
        <div className="mx-auto max-w-3xl text-center">
          <p style={{ color: c.accentColor }} className="text-xs uppercase tracking-[.2em]">Warsztaty</p>
          <h2 className="mt-4 font-serif text-4xl md:text-5xl">Dwie godziny z gliną.</h2>
          <p style={{ color: mc }} className="mx-auto mt-5 max-w-lg text-sm leading-7">Kameralne spotkania dla początkujących. Poznasz podstawy lepienia i stworzysz własny kubek lub misę.</p>
          <div className="mt-9 grid gap-px text-left md:grid-cols-3" style={{ backgroundColor: `${c.accentColor}25` }}>
            {[["01","Wybierz termin","Soboty, godz. 11:00"],["02","Przyjdź bez przygotowania","Materiały są na miejscu"],["03","Odbierz gotową pracę","Po wypale i szkliwieniu"]].map(([n,title,text]) => (
              <div key={n} style={{ backgroundColor: c.bgColor }} className="p-5"><span style={{ color: c.accentColor }} className="text-xs">{n}</span><h3 className="mt-5 font-serif text-xl">{title}</h3><p style={{ color: mc }} className="mt-2 text-xs leading-5">{text}</p></div>
            ))}
          </div>
          <button style={{ borderColor: c.accentColor, color: c.accentColor }} className="mt-8 border px-7 py-4 text-xs font-bold uppercase tracking-widest">Zobacz wolne terminy</button>
        </div>
      </section>

      <section style={{ backgroundColor: c.accentColor, color: "#fff" }} className="px-5 py-16">
        <div className="mx-auto grid max-w-3xl gap-8 md:grid-cols-2 md:items-center">
          <div><p className="text-xs uppercase tracking-widest opacity-60">Listy z pracowni</p><h2 className="mt-3 font-serif text-3xl">Nowe kolekcje jako pierwsza.</h2></div>
          <div><div className="flex border-b border-white/40"><span className="flex-1 py-3 text-xs text-white/65">Twój adres e-mail</span><button className="text-xs font-bold uppercase tracking-widest">Zapisz mnie</button></div><p className="mt-3 text-[.6rem] text-white/55">Maksymalnie dwa listy w miesiącu.</p></div>
        </div>
      </section>

      <section style={{ backgroundColor: c.bgColor, color: tc }} className="px-5 py-16">
        <div className="mx-auto max-w-3xl">
          <p style={{ color: c.accentColor }} className="text-center text-xs uppercase tracking-[.2em]">Najczęstsze pytania</p>
          <div className="mt-7 divide-y" style={{ borderColor: `${c.accentColor}30` }}>
            {[
              ["Czy każdy produkt wygląda identycznie?","Nie. To przedmioty wykonane ręcznie, dlatego szkliwo i kształt mogą delikatnie się różnić."],
              ["Jak zabezpieczasz ceramikę do wysyłki?","Każdy przedmiot pakuję warstwowo w materiały chroniące go podczas transportu."],
              ["Czy realizujesz zamówienia indywidualne?","Tak, w wybranych miesiącach. Napisz przez formularz i opowiedz, czego potrzebujesz."],
            ].map(([q,a]) => <details key={q} className="py-4"><summary className="flex justify-between gap-4 font-serif text-xl"><span>{q}</span><span style={{ color: c.accentColor }}>+</span></summary><p style={{ color: mc }} className="max-w-xl pt-3 text-xs leading-6">{a}</p></details>)}
          </div>
        </div>
      </section>

      <footer style={{ backgroundColor: c.accentColor, color: "#fff" }} className="px-5 py-10">
        <div className="mx-auto grid max-w-4xl gap-7 text-xs md:grid-cols-3">
          <div><p className="font-serif text-2xl">{c.brandName}</p><p className="mt-2 opacity-60">Ceramika tworzona powoli.</p></div>
          <div className="leading-6 opacity-70">Sklep<br/>Warsztaty<br/>O pracowni<br/>Kontakt</div>
          <div className="leading-6 opacity-70">Instagram<br/>Dostawa i zwroty<br/>Polityka prywatności<br/>© Demo 2026</div>
        </div>
      </footer>
    </>
  );

  // ── One page ──
  if (slug === "one-page") return (
    <>
      <section style={{ backgroundColor: tc, color: c.bgColor }}>
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-24 md:grid-cols-2">
          <div className="aspect-[4/5]" style={{ background: `linear-gradient(145deg, color-mix(in srgb, ${c.accentColor} 60%, #6f443a), color-mix(in srgb, ${c.accentColor} 30%, #dbab92))` }} />
          <div>
            <p style={{ color: c.accentColor }} className="text-xs uppercase tracking-[.2em]">O mnie</p>
            <h2 className="mt-6 font-serif text-4xl md:text-6xl">Ciało pamięta<br/>czułość.</h2>
            <p className="mt-6 max-w-md text-sm leading-7 opacity-55">Stworzyłam to miejsce jako spokojną przestrzeń bez pośpiechu, oceniania i gotowych schematów. Każda wizyta to rytuał szyty na miarę.</p>
            <div style={{ borderColor: `${c.bgColor}18` }} className="mt-9 grid grid-cols-2 gap-5 border-y py-6 text-xs">
              <span>8 lat doświadczenia</span><span>Naturalne kosmetyki</span>
            </div>
          </div>
        </div>
      </section>
      <section style={{ backgroundColor: c.bgColor, color: tc }} className="px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <p style={{ color: c.accentColor }} className="text-xs uppercase tracking-[.2em]">Jak wygląda wizyta</p>
          <h2 className="mt-5 font-serif text-4xl md:text-5xl">Twój rytuał krok po kroku</h2>
          <div className="mt-12 grid md:grid-cols-3">
            {["Krótka rozmowa i diagnoza potrzeb","Indywidualnie dobrany rytuał","Zalecenia do domowej pielęgnacji"].map((step, i) => (
              <article key={step} style={{ borderColor: `${tc}18` }} className="border-t py-7 md:border-l md:px-7">
                <span style={{ color: c.accentColor }} className="text-xs">0{i + 1}</span>
                <h3 className="mt-7 font-serif text-2xl">{step}</h3>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section style={{ backgroundColor: `color-mix(in srgb, ${c.accentColor} 12%, ${c.bgColor})`, color: tc }} className="px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div><p style={{ color: c.accentColor }} className="text-xs uppercase tracking-[.2em]">Oferta i ceny</p><h2 className="mt-5 font-serif text-4xl md:text-5xl">Wybierz swój rytuał.</h2></div>
            <p style={{ color: mc }} className="max-w-sm text-sm leading-7">Każdą pierwszą wizytę poprzedza krótka rozmowa o potrzebach skóry i Twoim samopoczuciu.</p>
          </div>
          <div className="mt-12 grid gap-px md:grid-cols-3" style={{ backgroundColor: `${tc}18` }}>
            {[
              ["Rytuał twarzy","90 min","260 zł","oczyszczenie · masaż · maska"],
              ["Masaż kobido","75 min","220 zł","lifting · rozluźnienie · relaks"],
              ["Czuły reset","120 min","340 zł","twarz · kark · dłonie"],
            ].map(([name,time,price,desc],i)=><article key={name} style={{ backgroundColor: `color-mix(in srgb, ${c.accentColor} 12%, ${c.bgColor})` }} className="p-7"><span style={{ color:c.accentColor }} className="text-xs">0{i+1}</span><h3 className="mt-8 font-serif text-3xl">{name}</h3><p style={{ color:mc }} className="mt-3 text-xs">{desc}</p><div className="mt-8 flex items-end justify-between border-t pt-4" style={{borderColor:`${tc}18`}}><span className="text-xs">{time}</span><b className="font-serif text-2xl">{price}</b></div></article>)}
          </div>
        </div>
      </section>
      <section style={{ backgroundColor: tc, color: c.bgColor }} className="px-6 py-24">
        <div className="mx-auto max-w-5xl">
          <p style={{ color: c.accentColor }} className="text-center text-xs uppercase tracking-[.2em]">Treści demonstracyjne</p>
          <h2 className="mt-5 text-center font-serif text-4xl md:text-5xl">Jak możesz się tu poczuć.</h2>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {[
              ["„Pierwszy raz ktoś tak spokojnie wyjaśnił mi potrzeby mojej skóry.”","Marta / rytuał twarzy"],
              ["„Wyszłam z lżejszą twarzą i głową. Bez pośpiechu, dokładnie tak jak potrzebowałam.”","Ola / kobido"],
              ["„Piękne miejsce i bardzo uważna opieka od początku do końca.”","Karolina / czuły reset"],
            ].map(([quote,author])=><blockquote key={author} className="border p-6" style={{borderColor:`${c.bgColor}20`}}><p className="font-serif text-2xl leading-snug">{quote}</p><footer className="mt-7 text-[.6rem] uppercase tracking-widest opacity-50">{author}</footer></blockquote>)}
          </div>
        </div>
      </section>
      <section style={{ backgroundColor: c.bgColor, color: tc }} className="px-6 py-20">
        <div className="mx-auto grid max-w-5xl gap-12 md:grid-cols-[.7fr_1.3fr]">
          <div><p style={{ color:c.accentColor }} className="text-xs uppercase tracking-[.2em]">FAQ</p><h2 className="mt-5 font-serif text-4xl">Przed pierwszą wizytą.</h2></div>
          <div className="divide-y" style={{borderColor:`${tc}18`}}>
            {[
              ["Czy muszę wiedzieć, jaki zabieg wybrać?","Nie. Możesz wybrać konsultację, a rytuał dobierzemy po rozmowie na miejscu."],
              ["Jak przygotować się do wizyty?","Przyjdź bez makijażu, jeśli możesz. Resztą zajmę się w gabinecie."],
              ["Czy zabiegi są odpowiednie dla skóry wrażliwej?","Tak, ale zawsze omawiamy aktualny stan skóry, alergie i przeciwwskazania."],
              ["Jak odwołać termin?","Napisz najpóźniej 24 godziny wcześniej, aby termin mógł trafić do innej osoby."],
            ].map(([q,a])=><details key={q} className="py-5"><summary className="flex justify-between gap-5 font-serif text-xl"><span>{q}</span><span style={{color:c.accentColor}}>+</span></summary><p style={{color:mc}} className="max-w-xl pt-3 text-xs leading-6">{a}</p></details>)}
          </div>
        </div>
      </section>
      <section style={{ backgroundColor: `color-mix(in srgb, ${c.accentColor} 20%, ${c.bgColor})`, color: tc }} className="px-6 py-20 text-center">
        <p className="text-xs uppercase tracking-widest opacity-60">Rezerwacja</p>
        <h2 className="mt-4 font-serif text-4xl md:text-5xl">Znajdź czas dla siebie.</h2>
        <p style={{ color: mc }} className="mt-4 text-sm">Gabinet pokazowy · ul. Spokojna 1 · Miasto</p>
        <button style={{ backgroundColor: tc, color: c.bgColor }} className="mt-7 cursor-pointer px-7 py-4 text-xs uppercase tracking-widest">{c.cta}</button>
      </section>
      <footer style={{ backgroundColor: tc, color: c.bgColor }} className="flex flex-col justify-between gap-4 px-8 py-10 text-xs md:flex-row">
        <b className="font-serif text-2xl">{c.brandName}</b>
        <span className="opacity-55">Oferta · O mnie · Kontakt · Prywatność</span>
        <span className="opacity-55">© Przykładowa marka</span>
      </footer>
    </>
  );

  // ── Strona firmowa ──
  if (slug === "strona-firmowa") return (
    <>
      <section className="bg-white px-6 py-24" style={{ color: "#142a3b" }}>
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p style={{ color: c.accentColor }} className="text-xs uppercase tracking-[.2em]">Wybrane realizacje</p>
              <h2 className="mt-5 font-serif text-4xl md:text-6xl">Architektura blisko życia.</h2>
            </div>
            <p className="max-w-sm text-sm leading-7 text-black/45">Każdy projekt zaczynamy od rozmowy o potrzebach, rytmie dnia i miejscu.</p>
          </div>
          <div className="mt-14 grid gap-5 md:grid-cols-2">
            <div>
              <div className="aspect-[4/3]" style={{ background: `linear-gradient(130deg, color-mix(in srgb, ${c.accentColor} 30%, #9c8d7d), #d7d0c6)` }} />
              <h3 className="mt-4 font-serif text-2xl">Dom pod lasem</h3>
              <p className="text-xs text-black/40">Architektura · 2026</p>
            </div>
            <div className="md:mt-24">
              <div className="aspect-[4/3]" style={{ background: `linear-gradient(130deg, color-mix(in srgb, ${c.accentColor} 20%, #45535a), #b4b8b4)` }} />
              <h3 className="mt-4 font-serif text-2xl">Apartament 62</h3>
              <p className="text-xs text-black/40">Wnętrza · 2025</p>
            </div>
          </div>
        </div>
      </section>
      <section style={{ backgroundColor: c.bgColor, color: tc }} className="px-6 py-24">
        <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-2">
          <div>
            <p style={{ color: c.accentColor }} className="text-xs uppercase tracking-widest">Studio</p>
            <h2 className="mt-5 font-serif text-4xl md:text-6xl">Projektujemy<br/>od środka.</h2>
          </div>
          <div>
            <p style={{ color: mc }} className="text-sm leading-7">Łączymy uważną analizę, prostą formę i materiały, które dobrze się starzeją. Każdy projekt to dialog między potrzebą a formą.</p>
            <div style={{ borderColor: `${tc}18` }} className="mt-10 grid grid-cols-3 border-y py-6 text-center">
              {[["12","lat praktyki"],["48","realizacji"],["4","osoby"]].map(([val, lbl]) => (
                <div key={lbl}><b className="font-serif text-3xl">{val}</b><span style={{ color: mc }} className="block text-[.6rem] uppercase">{lbl}</span></div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <section className="bg-white px-6 py-24" style={{color:"#142a3b"}}>
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-10 md:grid-cols-2"><div><p style={{color:c.accentColor}} className="text-xs uppercase tracking-[.2em]">Proces</p><h2 className="mt-5 font-serif text-4xl md:text-5xl">Od pierwszego szkicu do kluczy.</h2></div><p className="max-w-md text-sm leading-7 text-black/50">Każdy etap kończy się konkretnym materiałem i decyzją. Dzięki temu inwestor wie, co dzieje się z projektem i kiedy potrzebna jest jego akceptacja.</p></div>
          <div className="mt-12 grid gap-px md:grid-cols-4" style={{backgroundColor:`${c.accentColor}35`}}>
            {[
              ["01","Analiza","Działka, potrzeby, możliwości"],
              ["02","Koncepcja","Bryła, układ i materiały"],
              ["03","Dokumentacja","Rysunki i uzgodnienia"],
              ["04","Nadzór","Wsparcie podczas realizacji"],
            ].map(([n,title,text])=><article key={n} className="bg-white p-6"><span style={{color:c.accentColor}} className="text-xs">{n}</span><h3 className="mt-8 font-serif text-2xl">{title}</h3><p className="mt-3 text-xs text-black/45">{text}</p></article>)}
          </div>
        </div>
      </section>
      <section style={{backgroundColor:"#0c1b25",color:"#e9edf0"}} className="px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <p style={{color:c.accentColor}} className="text-center text-xs uppercase tracking-[.2em]">Treści demonstracyjne</p>
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {[
              ["„Studio potrafiło przełożyć nasz chaotyczny zbiór potrzeb na spokojny i funkcjonalny dom.”","Inwestorzy / Dom pod lasem"],
              ["„Każda decyzja była wyjaśniona. Wiedzieliśmy, za co płacimy i co zmieni się na budowie.”","Inwestorzy / Apartament 62"],
            ].map(([quote,author])=><blockquote key={author} className="border border-white/10 p-7"><p className="font-serif text-2xl leading-snug">{quote}</p><footer className="mt-7 text-[.6rem] uppercase tracking-widest text-white/40">{author}</footer></blockquote>)}
          </div>
          <div className="mx-auto mt-16 max-w-3xl divide-y divide-white/10">
            {[
              ["Jaki jest pierwszy krok?","Krótka rozmowa i przesłanie podstawowych informacji o działce lub wnętrzu."],
              ["Czy można zamówić samą koncepcję?","Tak. Zakres może kończyć się na koncepcji albo obejmować pełną dokumentację i nadzór."],
              ["Jak długo trwa projekt?","Termin zależy od skali i uzgodnień. Po rozmowie otrzymujesz harmonogram etapów."],
            ].map(([q,a])=><details key={q} className="py-5"><summary className="flex justify-between gap-5 font-serif text-xl"><span>{q}</span><span style={{color:c.accentColor}}>+</span></summary><p className="max-w-xl pt-3 text-xs leading-6 text-white/45">{a}</p></details>)}
          </div>
        </div>
      </section>
      <section style={{ backgroundColor: tc, color: c.bgColor }} className="px-6 py-20">
        <div className="mx-auto flex max-w-6xl flex-col justify-between gap-7 md:flex-row md:items-end">
          <div>
            <p style={{ color: c.accentColor }} className="text-xs uppercase tracking-widest">Nowy projekt</p>
            <h2 className="mt-4 font-serif text-4xl md:text-5xl">Porozmawiajmy o Twojej przestrzeni.</h2>
          </div>
          <button style={{ borderColor: `${c.bgColor}50`, color: c.bgColor }} className="cursor-pointer border px-7 py-4 text-xs uppercase tracking-widest">Umów spotkanie</button>
        </div>
      </section>
      <footer style={{ backgroundColor: c.bgColor === "#e9edf0" ? "#0c1b25" : tc, color: c.bgColor }} className="flex flex-col gap-4 px-8 py-10 text-xs md:flex-row md:justify-between">
        <b style={{ color: c.bgColor }}>{c.brandName}</b>
        <span className="opacity-45">Projekty · Studio · Proces · Kontakt</span>
        <span className="opacity-45">© Demo 2026</span>
      </footer>
    </>
  );

  // ── Mini sklep handmade ──
  if (slug === "mini-sklep-handmade") return (
    <>
      <section style={{ backgroundColor: `color-mix(in srgb, ${c.accentColor} 15%, ${c.bgColor})`, color: tc }} className="px-6 py-24">
        <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2">
          <div>
            <p style={{ color: c.accentColor }} className="text-xs uppercase tracking-[.2em]">O pracowni</p>
            <h2 className="mt-5 font-serif text-4xl md:text-6xl">Powstaje powoli.<br/>Zostaje na lata.</h2>
            <p style={{ color: mc }} className="mt-6 max-w-md text-sm leading-7">{c.body}</p>
            <button style={{ borderColor: tc, color: tc }} className="mt-7 cursor-pointer border-b pb-2 text-xs uppercase tracking-widest">Poznaj moją historię</button>
          </div>
          <div className="aspect-square" style={{ background: `linear-gradient(145deg, color-mix(in srgb, ${c.accentColor} 50%, #8d7562), color-mix(in srgb, ${c.accentColor} 20%, #d1baa1))` }} />
        </div>
      </section>
      <section style={{ backgroundColor: c.bgColor, color: tc }} className="px-6 py-20 text-center">
        <p style={{ color: c.accentColor }} className="text-xs uppercase tracking-[.2em]">Treść demonstracyjna</p>
        <p className="mx-auto mt-5 max-w-3xl font-serif text-3xl italic md:text-5xl">&ldquo;Każda paczka to jak mały prezent. Wracam tu zawsze.&rdquo;</p>
        <p style={{ color: mc }} className="mt-5 text-xs uppercase tracking-widest">— przykładowa opinia klientki</p>
      </section>
      <section style={{ backgroundColor: c.bgColor, color: tc }} className="px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="text-center"><p style={{color:c.accentColor}} className="text-xs uppercase tracking-[.2em]">Dlaczego Mila</p><h2 className="mt-5 font-serif text-4xl md:text-5xl">Mała rzecz. Dobrze przemyślana.</h2></div>
          <div className="mt-12 grid gap-px md:grid-cols-4" style={{backgroundColor:`${tc}18`}}>
            {[
              ["01","Ręczna praca","Każda ozdoba powstaje pojedynczo."],
              ["02","Naturalne materiały","Len, drewno i papier z odpowiedzialnych źródeł."],
              ["03","Bezpieczna paczka","Pakowanie gotowe także na prezent."],
              ["04","Kontakt z twórczynią","Bez infolinii i anonimowej obsługi."],
            ].map(([n,title,text])=><article key={n} style={{backgroundColor:c.bgColor}} className="p-6"><span style={{color:c.accentColor}} className="text-xs">{n}</span><h3 className="mt-8 font-serif text-2xl">{title}</h3><p style={{color:mc}} className="mt-3 text-xs leading-6">{text}</p></article>)}
          </div>
        </div>
      </section>
      <section style={{ backgroundColor: `color-mix(in srgb, ${c.accentColor} 18%, ${c.bgColor})`, color: tc }} className="px-6 py-24">
        <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-2">
          <div><p style={{color:c.accentColor}} className="text-xs uppercase tracking-[.2em]">Od zamówienia do domu</p><h2 className="mt-5 font-serif text-4xl md:text-5xl">Co dzieje się po kliknięciu „kupuję”?</h2></div>
          <div className="space-y-1">
            {[
              ["01","Potwierdzam i przygotowuję zamówienie","Otrzymujesz wiadomość z podsumowaniem i planowanym terminem wysyłki."],
              ["02","Pakuję ręcznie","Produkt zabezpieczam i dokładam kartkę z informacją o pielęgnacji."],
              ["03","Paczka rusza w drogę","Dostajesz numer śledzenia. Wysyłka trwa zwykle 1–2 dni robocze."],
            ].map(([n,title,text])=><div key={n} className="grid grid-cols-[2.5rem_1fr] border-b py-5" style={{borderColor:`${tc}18`}}><span style={{color:c.accentColor}} className="text-xs">{n}</span><div><h3 className="font-serif text-2xl">{title}</h3><p style={{color:mc}} className="mt-2 text-xs leading-6">{text}</p></div></div>)}
          </div>
        </div>
      </section>
      <section style={{ backgroundColor: c.bgColor, color: tc }} className="px-6 py-20">
        <div className="mx-auto max-w-4xl">
          <p style={{color:c.accentColor}} className="text-center text-xs uppercase tracking-[.2em]">Pytania przed zakupem</p>
          <div className="mt-8 divide-y" style={{borderColor:`${tc}18`}}>
            {[
              ["Czy mogę zamówić inny kolor?","Przy części produktów tak. Dostępne warianty znajdziesz na karcie produktu."],
              ["Ile trwa realizacja?","Produkty dostępne od ręki wysyłam w 2–4 dni robocze. Zamówienia personalizowane mają osobny termin."],
              ["Czy przyjmujesz zwroty?","Tak, zgodnie z regulaminem sklepu. Produkty personalizowane mogą podlegać wyjątkom."],
              ["Czy pakujesz na prezent?","Tak. Możesz dodać krótką wiadomość podczas składania zamówienia."],
            ].map(([q,a])=><details key={q} className="py-5"><summary className="flex justify-between gap-5 font-serif text-xl"><span>{q}</span><span style={{color:c.accentColor}}>+</span></summary><p style={{color:mc}} className="max-w-2xl pt-3 text-xs leading-6">{a}</p></details>)}
          </div>
        </div>
      </section>
      <section style={{ backgroundColor: `color-mix(in srgb, ${c.accentColor} 10%, ${c.bgColor})`, color: tc }} className="px-6 py-20 text-center">
        <p style={{ color: c.accentColor }} className="text-xs uppercase tracking-widest">Newsletter</p>
        <h2 className="mt-4 font-serif text-4xl md:text-5xl">Listy z pracowni</h2>
        <p style={{ color: mc }} className="mx-auto mt-4 max-w-md text-sm">Nowe kolekcje, kulisy pracy i małe inspiracje. Bez pośpiechu i spamu.</p>
        <div style={{ borderColor: `${tc}30` }} className="mx-auto mt-7 flex max-w-md border-b">
          <span style={{ color: mc }} className="flex-1 py-3 text-left text-xs">Twój adres e-mail</span>
          <button style={{ color: tc }} className="cursor-pointer text-xs uppercase tracking-widest">Zapisz się</button>
        </div>
      </section>
      <footer style={{ backgroundColor: tc, color: c.bgColor }} className="px-6 py-12">
        <div className="mx-auto grid max-w-6xl gap-8 text-xs md:grid-cols-3">
          <div>
            <b className="font-serif text-2xl">{c.brandName}</b>
            <p className="mt-3 opacity-40">Rzeczy stworzone ręcznie.</p>
          </div>
          <div className="opacity-55">Sklep<br/>O marce<br/>Dostawa i zwroty</div>
          <div className="opacity-55">Instagram<br/>Kontakt<br/>Regulamin i prywatność</div>
        </div>
      </footer>
    </>
  );

  // ── Sklep online ──
  return (
    <>
      <section style={{ backgroundColor: `color-mix(in srgb, ${c.accentColor} 5%, #efefed)`, color: tc }} className="px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <p style={{ color: mc }} className="text-xs uppercase tracking-[.2em]">Shop by category</p>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {c.services.map((cat, i) => (
              <article key={cat}>
                <div className="aspect-[4/5]" style={{ background: [
                  `color-mix(in srgb, ${c.accentColor} 55%, #767676)`,
                  `color-mix(in srgb, ${c.accentColor} 25%, #b9b5ae)`,
                  `color-mix(in srgb, ${c.accentColor} 80%, #383838)`,
                ][i] }} />
                <div style={{ borderColor: `${tc}20`, color: tc }} className="flex justify-between border-b py-4 text-xs uppercase tracking-widest">
                  <span>{cat}</span><span>Explore ↗</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section style={{ backgroundColor: tc, color: c.bgColor }} className="grid md:grid-cols-2">
        <div className="min-h-[400px] md:min-h-[600px]" style={{ background: `linear-gradient(145deg, color-mix(in srgb, ${c.accentColor} 60%, #9a9a9a), color-mix(in srgb, ${c.accentColor} 30%, #282828))` }} />
        <div className="flex flex-col justify-center px-8 py-20 md:px-20">
          <p style={{ color: `${c.bgColor}55` }} className="text-xs uppercase tracking-[.2em]">Journal / 01</p>
          <h2 className="mt-7 text-4xl font-light leading-none md:text-6xl">Less, but<br/>better.</h2>
          <p style={{ color: `${c.bgColor}55` }} className="mt-7 max-w-sm text-sm leading-7">O projektowaniu przedmiotów, które opierają się sezonowym trendom i zostają na dłużej.</p>
          <button style={{ borderColor: `${c.bgColor}80`, color: c.bgColor }} className="mt-8 w-fit cursor-pointer border-b pb-2 text-xs uppercase tracking-widest">Read the story</button>
        </div>
      </section>
      <section style={{ backgroundColor: c.bgColor, color: tc }} className="px-6 py-24 text-center">
        <p style={{ color: mc }} className="text-xs uppercase tracking-widest">Join our list</p>
        <h2 className="mt-4 text-4xl font-light md:text-5xl">Notes on form.</h2>
        <p style={{ color: mc }} className="mt-4 text-sm">Nowości, historie i wcześniejszy dostęp do kolekcji.</p>
        <div style={{ borderColor: `${tc}30` }} className="mx-auto mt-8 flex max-w-lg border-b">
          <span style={{ color: mc }} className="flex-1 py-3 text-left text-xs">Email address</span>
          <button style={{ color: tc }} className="cursor-pointer text-xs uppercase tracking-widest">Subscribe</button>
        </div>
      </section>
      <section style={{backgroundColor:`color-mix(in srgb, ${c.accentColor} 4%, #efefed)`,color:tc}} className="px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 md:grid-cols-2"><div><p style={{color:mc}} className="text-xs uppercase tracking-[.2em]">Our standard</p><h2 className="mt-5 text-4xl font-light md:text-5xl">Designed to stay.</h2></div><p style={{color:mc}} className="max-w-md text-sm leading-7">Materiały, konstrukcja i forma są wybierane z myślą o długim użytkowaniu, prostym serwisie i odpowiedzialnej produkcji.</p></div>
          <div className="mt-12 grid gap-px md:grid-cols-4" style={{backgroundColor:`${tc}18`}}>
            {[["01","Small series","Kontrolowana produkcja"],["02","Better materials","Naturalne i trwałe włókna"],["03","Repair first","Wsparcie zamiast wymiany"],["04","Honest delivery","Jasne terminy i zwroty"]].map(([n,title,text])=><article key={n} style={{backgroundColor:`color-mix(in srgb, ${c.accentColor} 4%, #efefed)`}} className="p-6"><span style={{color:mc}} className="text-xs">{n}</span><h3 className="mt-8 text-xl font-light">{title}</h3><p style={{color:mc}} className="mt-3 text-xs">{text}</p></article>)}
          </div>
        </div>
      </section>
      <section style={{backgroundColor:c.bgColor,color:tc}} className="px-6 py-20">
        <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-[.65fr_1.35fr]">
          <div><p style={{color:mc}} className="text-xs uppercase tracking-[.2em]">Help</p><h2 className="mt-5 text-4xl font-light">Questions before ordering.</h2></div>
          <div style={{borderColor:`${tc}18`}} className="divide-y">
            {[
              ["How do I choose a size?","Każda karta produktu zawiera wymiary produktu i tabelę rozmiarów."],
              ["When will my order ship?","Produkty dostępne od ręki wysyłamy zwykle w ciągu 2–3 dni roboczych."],
              ["Can I return an item?","Tak. Instrukcja zwrotu i termin znajdują się w paczce oraz w regulaminie."],
              ["Do you ship internationally?","Wersja demonstracyjna pokazuje możliwość konfiguracji wielu stref dostawy."],
            ].map(([q,a])=><details key={q} className="py-5"><summary className="flex justify-between gap-5 text-lg font-light"><span>{q}</span><span>+</span></summary><p style={{color:mc}} className="max-w-xl pt-3 text-xs leading-6">{a}</p></details>)}
          </div>
        </div>
      </section>
      <footer style={{ backgroundColor: tc, color: c.bgColor }} className="grid gap-8 px-8 py-14 text-xs md:grid-cols-4">
        <b>{c.brandName}</b>
        <span className="opacity-45">Shop<br/>New arrivals<br/>Gift cards</span>
        <span className="opacity-45">About<br/>Journal<br/>Contact</span>
        <span className="opacity-45">Delivery & returns<br/>Terms<br/>Privacy</span>
      </footer>
    </>
  );
}

// ─── Topbar ───────────────────────────────────────────────────────────────────

export function DemoTopbar({ title }: { title: string }) {
  return (
    <div className="sticky top-[76px] z-40 flex flex-col items-center justify-between gap-3 border-b border-black/10 bg-paper/95 px-4 py-3 backdrop-blur md:flex-row md:px-8">
      <div className="flex items-center gap-3">
        <span className="rounded-sm bg-gold px-2 py-0.5 text-[.58rem] font-bold uppercase tracking-[.12em] text-white">Podgląd demonstracyjny</span>
        <span className="text-xs text-muted">{title}</span>
      </div>
      <div className="flex gap-2">
        <Link href="/cennik" className="btn-secondary min-h-9! px-4!">Cennik</Link>
        <Link href={`/kontakt?pakiet=${encodeURIComponent(title)}`} className="btn-primary min-h-9! px-4!">Podoba Ci się? Skontaktuj się <Arrow /></Link>
      </div>
    </div>
  );
}

// ─── Internal helper ──────────────────────────────────────────────────────────
function lum(hex: string): number {
  if (hex.length < 7) return 0.5;
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  return 0.299 * r + 0.587 * g + 0.114 * b;
}
