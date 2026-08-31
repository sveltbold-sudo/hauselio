"use client";

const COOKIE_EVENT = "hauselio:open-cookie-settings";

export function openCookieSettings() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(COOKIE_EVENT));
  }
}

export default function CookieSettingsButton() {
  return (
    <button
      type="button"
      onClick={openCookieSettings}
      className="block px-2.5 py-2 min-h-[44px] flex items-center text-sm text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-colors duration-250"
    >
      Cookie-Einstellungen
    </button>
  );
}
