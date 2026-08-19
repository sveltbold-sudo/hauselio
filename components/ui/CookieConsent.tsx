"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Cookie, X } from "lucide-react";

const CONSENT_KEY = "hauselio_cookie_consent";

export function getCookieConsent(): boolean | null {
  if (typeof window === "undefined") return null;
  const value = localStorage.getItem(CONSENT_KEY);
  if (value === null) return null;
  return value === "true";
}

export function setCookieConsent(accepted: boolean) {
  localStorage.setItem(CONSENT_KEY, String(accepted));
}

function needsConsentBanner(): boolean {
  if (typeof window === "undefined") return false;
  return getCookieConsent() === null;
}

export default function CookieConsent() {
  const [visible, setVisible] = useState(needsConsentBanner);
  const dialogRef = useRef<HTMLDivElement>(null);
  const firstButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (visible) {
      document.body.style.overflow = "hidden";
      if (firstButtonRef.current) {
        firstButtonRef.current.focus();
      }
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [visible]);

  const handleAccept = () => {
    setCookieConsent(true);
    setVisible(false);
  };

  const handleReject = () => {
    setCookieConsent(false);
    setVisible(false);
  };

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      handleReject();
      return;
    }
    if (e.key === "Tab" && dialogRef.current) {
      const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }, [handleReject]);

  if (!visible) return null;

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label="Cookie-Einstellungen"
      onKeyDown={handleKeyDown}
      className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6"
    >
      <div className="max-w-2xl mx-auto bg-white rounded-2xl border border-[var(--color-border-light)] shadow-[var(--shadow-2xl)] p-6">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-10 h-10 bg-[var(--color-orange)]/10 rounded-xl flex items-center justify-center">
            <Cookie className="w-5 h-5 text-[var(--color-orange)]" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-[var(--color-text-primary)] mb-2">
              Cookie-Einstellungen
            </h3>
            <p className="text-sm text-[var(--color-text-muted)] leading-relaxed mb-4">
              Wir verwenden Cookies und Analyse-Tools (Vercel Analytics), um das
              Nutzererlebnis zu verbessern. Diese Daten helfen uns, die
              Performance unserer Website zu optimieren. Sie können jederzeit
              ablehnen.
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                ref={firstButtonRef}
                onClick={handleAccept}
                className="px-5 py-2.5 bg-[var(--color-orange)] text-white text-sm font-semibold rounded-xl hover:bg-[var(--color-orange-hover)] transition-colors"
              >
                Akzeptieren
              </button>
              <button
                onClick={handleReject}
                className="px-5 py-2.5 bg-[var(--color-bg)] text-[var(--color-text-primary)] text-sm font-semibold rounded-xl border border-[var(--color-border)] hover:bg-[var(--color-border-light)] transition-colors"
              >
                Ablehnen
              </button>
            </div>
          </div>
          <button
            onClick={handleReject}
            className="flex-shrink-0 w-10 h-10 flex items-center justify-center text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] rounded-lg hover:bg-gray-100 transition-all focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            aria-label="Schließen"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
