"use client";

import { useState, useEffect, useRef } from "react";
import { X, Percent, ArrowRight } from "lucide-react";
import { useScrollLock } from "@/hooks/useScrollLock";

const EXIT_INTENT_KEY = "hausaura_exit_intent_shown";
const COUPON_CODE = "HAUSAURA10";

export default function ExitIntentPopup() {
  const [visible, setVisible] = useState(false);
  const [copied, setCopied] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (localStorage.getItem(EXIT_INTENT_KEY)) return;

    let timeout: NodeJS.Timeout | null = null;

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !sessionStorage.getItem(EXIT_INTENT_KEY)) {
        timeout = setTimeout(() => {
          setVisible(true);
          sessionStorage.setItem(EXIT_INTENT_KEY, "1");
        }, 500);
      }
    };

    document.addEventListener("mouseleave", handleMouseLeave);
    return () => {
      document.removeEventListener("mouseleave", handleMouseLeave);
      if (timeout) clearTimeout(timeout);
    };
  }, []);

  useScrollLock(visible);

  const handleClose = () => {
    setVisible(false);
    localStorage.setItem(EXIT_INTENT_KEY, "1");
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(COUPON_CODE);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  if (!visible) return null;

  return (
    <>
      <div className="fixed inset-0 z-[60] bg-black/50" aria-hidden="true" />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label="Exklusives Angebot"
        className="fixed inset-0 z-[60] flex items-center justify-center p-4"
      >
        <div className="relative w-full max-w-md bg-white rounded-2xl shadow-[var(--shadow-2xl)] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] rounded-lg hover:bg-[var(--color-bg-secondary)] transition-colors z-10"
            aria-label="Schließen"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Content */}
          <div className="p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-[var(--color-accent)]/10 rounded-2xl flex items-center justify-center">
              <Percent className="w-8 h-8 text-[var(--color-accent)]" />
            </div>

            <h3 className="text-2xl font-extrabold text-[var(--color-text-primary)] mb-2">
              Warten Sie!
            </h3>
            <p className="text-sm text-[var(--color-text-secondary)] mb-6">
              Nutzen Sie unseren exklusiven Newsletter-Rabatt und sparen Sie <strong>10%</strong> auf Ihre erste Bestellung.
            </p>

            {/* Coupon code */}
            <div className="bg-[var(--color-bg-secondary)] border-2 border-dashed border-[var(--color-accent)] rounded-xl p-4 mb-4">
              <p className="text-xs text-[var(--color-text-muted)] mb-1">Ihr Rabattcode:</p>
              <div className="flex items-center justify-center gap-3">
                <span className="text-2xl font-extrabold tracking-wider text-[var(--color-accent)]">
                  {COUPON_CODE}
                </span>
                <button
                  onClick={handleCopy}
                  className="px-3 py-1.5 bg-[var(--color-accent)] text-white text-xs font-semibold rounded-lg hover:bg-[var(--color-accent-hover)] transition-colors"
                >
                  {copied ? "Kopiert!" : "Kopieren"}
                </button>
              </div>
            </div>

            <p className="text-xs text-[var(--color-text-muted)] mb-6">
              Gelten auf alle Produkte · Kein Mindestbestellwert
            </p>

            {/* CTA */}
            <button
              onClick={handleClose}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-[var(--color-primary)] text-white font-semibold rounded-xl hover:bg-[var(--color-primary-hover)] transition-colors"
            >
              Weiter einkaufen
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
