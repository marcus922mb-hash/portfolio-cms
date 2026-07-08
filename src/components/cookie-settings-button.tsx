"use client";

export function CookieSettingsButton() {
  return <button type="button" className="cursor-pointer uppercase transition hover:text-white" onClick={() => window.dispatchEvent(new Event("open-cookie-settings"))}>Ustawienia cookies</button>;
}
