"use client";

import { useState, useEffect, useRef } from "react";
import { X, Percent, ArrowRight, Clock, Mail } from "lucide-react";
import { useScrollLock } from "@/hooks/useScrollLock";

const EXIT_INTENT_KEY = "HAUSAURA-exit-intent-shown";
const COUPON_CODE = "HAUSAURA10";
const COUNTDOWN_MINUTES = 10;

export default function ExitIntentPopup() {
  const [visible, setVisible] = useState(false);
  const [copied, setCopied] = useState(false);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [remaining, setRemaining] = useState(COUNTDOWN_MINUTES * 60);
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

  useEffect(() => {
    if (!visible || remaining <= 0) return;
    const timer = setInterval(() => setRemaining((r) => r - 1), 1000);
    return () => clearInterval(timer);
  }, [visible, remaining]);

  useScrollLock(visible);

  useEffect(() => {
    if (!visible) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose();
        return;
      }
      if (e.key === "Tab" && dialogRef.current) {
        const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;
        const first = focusable[0]!;
        const last = focusable[focusable.length - 1]!;
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    dialogRef.current?.focus();
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [visible]);

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

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || submitting) return;
    setSubmitting(true);
    try {
      await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setSubmitted(true);
    } catch {
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  const minutes = String(Math.floor(remaining / 60)).padStart(2, "0");
  const seconds = String(remaining % 60).padStart(2, "0");

  if (!visible) return null;

  return (
    <>
      <div className="fixed inset-0 z-[60] bg-black/50" aria-hidden="true" onClick={handleClose} />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label="Exklusives Angebot"
        tabIndex={-1}
        className="fixed inset-0 z-[60] flex items-center justify-center p-4"
      >
        <div className="relative w-full max-w-md bg-white rounded-2xl shadow-[var(--shadow-2xl)] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 min-w-[44px] min-h-[44px] p-2 flex items-center justify-center text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] rounded-lg hover:bg-[var(--color-bg-secondary)] transition-colors z-10"
            aria-label="Schließen"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Countdown banner */}
          <div className="bg-[var(--color-accent)] text-white text-center py-2 px-4 text-sm font-semibold flex items-center justify-center gap-2">
            <Clock className="w-4 h-4" />
            <span>Angebot endet in {minutes}:{seconds}</span>
          </div>

          {/* Content */}
          <div className="p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-[var(--color-accent)]/10 rounded-2xl flex items-center justify-center">
              <Percent className="w-8 h-8 text-[var(--color-accent)]" />
            </div>

            <h3 className="text-2xl font-extrabold text-[var(--color-text-primary)] mb-2">
              Warten Sie!
            </h3>
            <p className="text-sm text-[var(--color-text-secondary)] mb-4">
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

            <p className="text-xs text-[var(--color-text-muted)] mb-4">
              Nur für Erstkunden · Kein Mindestbestellwert
            </p>

            {/* Email capture */}
            {!submitted ? (
              <form onSubmit={handleEmailSubmit} className="mb-6" aria-label="Newsletter-Anmeldung für eksklusive Angebote">
                <p className="text-xs text-[var(--color-text-muted)] mb-2">
                  Newsletter abonnieren für eksklusive Angebote:
                </p>
                {error && (
                  <p role="alert" className="text-xs text-[var(--color-danger)] mb-2">{error}</p>
                )}
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="ihre@email.de"
                      required
                      className="w-full pl-9 pr-3 py-2.5 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-lg text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-4 py-2.5 bg-[var(--color-accent)] text-white text-sm font-semibold rounded-lg hover:bg-[var(--color-accent-hover)] transition-colors disabled:opacity-50"
                  >
                    {submitting ? "..." : "OK"}
                  </button>
                </div>
              </form>
            ) : (
              <div className="mb-6 p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-700 font-medium">
                  ✓ Vielen Dank! Bestätigen Sie Ihre E-Mail-Adresse.
                </p>
              </div>
            )}

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
