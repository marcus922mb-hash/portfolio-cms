"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CloseIcon } from "./icons";

const STORAGE_KEY = "bd_cookie_preferences";

export function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [details, setDetails] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setVisible(!window.localStorage.getItem(STORAGE_KEY)), 700);
    const open = () => { setDetails(true); setVisible(true); };
    window.addEventListener("open-cookie-settings", open);
    return () => { window.clearTimeout(timer); window.removeEventListener("open-cookie-settings", open); };
  }, []);

  function save() {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ necessary: true, savedAt: new Date().toISOString() }));
    setVisible(false);
  }

  if (!visible) return null;
  return <aside className="cookie-panel" aria-label="Ustawienia prywatności" aria-live="polite">
    <button type="button" onClick={save} className="absolute right-4 top-4 text-white/50 transition hover:text-white" aria-label="Zamknij komunikat"><CloseIcon className="size-5"/></button>
    <p className="text-[.58rem] font-bold uppercase tracking-[.2em] text-gold-light">Twoja prywatność</p>
    <h2 className="mt-2 font-serif text-2xl">Ta strona działa bez śledzenia.</h2>
    <p className="mt-3 text-xs leading-6 text-white/55">Używamy wyłącznie pamięci przeglądarki potrzebnej do zapamiętania tego komunikatu. Nie uruchamiamy cookies analitycznych ani reklamowych.</p>
    {details && <div className="mt-4 border-y border-white/10 py-3 text-xs"><div className="flex items-center justify-between"><span>Niezbędne ustawienia</span><span className="text-gold-light">Zawsze aktywne</span></div><p className="mt-2 text-[.65rem] leading-5 text-white/40">Zapamiętują wyłącznie zamknięcie tego panelu. Zewnętrzny podgląd portfolio ładuje się dopiero po kliknięciu.</p></div>}
    <div className="mt-5 flex flex-wrap gap-2"><button type="button" onClick={save} className="btn-primary min-h-10!">Rozumiem</button><button type="button" onClick={() => setDetails(!details)} className="btn-light min-h-10!">{details ? "Ukryj szczegóły" : "Ustawienia"}</button><Link href="/polityka-cookies" className="self-center px-2 text-[.62rem] uppercase tracking-widest text-white/50 underline underline-offset-4">Polityka cookies</Link></div>
  </aside>;
}
