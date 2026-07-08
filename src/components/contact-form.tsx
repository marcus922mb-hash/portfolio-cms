"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { Arrow } from "./icons";

export function ContactForm() {
  const [status, setStatus] = useState("");
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") || "").trim();
    const email = String(form.get("email") || "").trim();
    const service = String(form.get("service") || "").trim();
    const budget = String(form.get("budget") || "").trim();
    const message = String(form.get("message") || "").trim();
    const consent = form.get("privacy") === "on";
    if (!name || !email || !service || !message || !consent) { setStatus("Uzupełnij wymagane pola i zaakceptuj politykę prywatności."); return; }
    const text = `Dzień dobry, mam zapytanie ze strony Braided Digital.\n\nImię: ${name}\nE-mail: ${email}\nUsługa: ${service}\nBudżet: ${budget || "nie podano"}\n\nWiadomość:\n${message}`;
    setStatus("Otwieram WhatsApp z gotową wiadomością...");
    window.open(`https://wa.me/48730195530?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
  }
  const input = "mt-2 w-full border border-black/15 bg-transparent px-4 py-3.5 text-sm outline-none transition focus:border-gold";
  return <form onSubmit={submit} className="grid gap-5" noValidate><div className="grid gap-5 sm:grid-cols-2"><label className="text-[.62rem] font-bold uppercase tracking-widest">Imię / firma *<input className={input} name="name" autoComplete="name" required placeholder="Jak mam się zwracać?"/></label><label className="text-[.62rem] font-bold uppercase tracking-widest">E-mail *<input className={input} name="email" type="email" autoComplete="email" required placeholder="twoj@email.pl"/></label></div><div className="grid gap-5 sm:grid-cols-2"><label className="text-[.62rem] font-bold uppercase tracking-widest">Interesuje mnie *<select className={input} name="service" required defaultValue=""><option value="" disabled>Wybierz usługę</option><option>Strona internetowa</option><option>Sklep online</option><option>Link w bio</option><option>WordPress / WooCommerce</option><option>Nie wiem - potrzebuję konsultacji</option></select></label><label className="text-[.62rem] font-bold uppercase tracking-widest">Orientacyjny budżet<select className={input} name="budget" defaultValue=""><option value="">Wybierz przedział</option><option>do 1 500 zł</option><option>1 500 - 3 500 zł</option><option>3 500 - 6 000 zł</option><option>powyżej 6 000 zł</option></select></label></div><label className="text-[.62rem] font-bold uppercase tracking-widest">Opowiedz o projekcie *<textarea className={`${input} min-h-36 resize-y`} name="message" required placeholder="Czym zajmuje się Twoja marka i czego potrzebujesz?"/></label><label className="flex items-start gap-3 text-xs leading-5 text-muted"><input type="checkbox" name="privacy" required className="mt-1 size-4 accent-gold"/><span>Zapoznałem(-am) się z <Link href="/polityka-prywatnosci" className="text-gold underline underline-offset-2">polityką prywatności</Link> i wiem, że wiadomość zostanie wysłana przez WhatsApp. *</span></label><div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center"><button className="btn-primary" type="submit">Wyślij przez WhatsApp <Arrow/></button><p className="text-xs text-muted" role="status" aria-live="polite">{status || "Po kliknięciu otworzy się WhatsApp z gotową wiadomością."}</p></div></form>;
}
