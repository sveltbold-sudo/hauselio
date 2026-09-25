"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Cookie, X } from "lucide-react";
import Button from "@/components/ui/Button";
import { useScrollLock } from "@/hooks/useScrollLock";

const CONSENT_KEY = "HAUSAURA_cookie_consent";

export interface CookiePreferences {
  essential: boolean;
  functional: boolean;
  analytics: boolean;
}

const DEFAULT_PREFERENCES: CookiePreferences = {
  essential: true,
  functional: false,
  analytics: false,
};

export function getCookiePreferences(): CookiePreferences | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(CONSENT_KEY);
  if (raw === null) return null;
  if (raw === "true") return { ...DEFAULT_PREFERENCES, functional: true, analytics: true };
  if (raw === "false") return { ...DEFAULT_PREFERENCES };
  try {
    const parsed = JSON.parse(raw);
    return { essential: true, functional: !!parsed.functional, analytics: !!parsed.analytics };
  } catch {
    return { ...DEFAULT_PREFERENCES };
  }
}

export function setCookiePreferences(prefs: CookiePreferences) {
  localStorage.setItem(CONSENT_KEY, JSON.stringify(prefs));
}

export function getCookieConsent(): boolean | null {
  if (typeof window === "undefined") return null;
  const value = localStorage.getItem(CONSENT_KEY);
  if (value === null) return null;
  if (value === "true") return true;
  if (value === "false") return false;
  try {
    const parsed = JSON.parse(value);
    return parsed.functional || parsed.analytics;
  } catch {
    return false;
  }
}

export function setCookieConsent(accepted: boolean) {
  setCookiePreferences({ ...DEFAULT_PREFERENCES, functional: accepted, analytics: accepted });
}

function needsConsentBanner(): boolean {
  if (typeof window === "undefined") return false;
  return getCookiePreferences() === null;
}

function Toggle({
  checked,
  onChange,
  disabled,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-8 w-11 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] ${
        checked ? "bg-[var(--color-primary)]" : "bg-[var(--color-border)]"
      } ${disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          checked ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );
}

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [prefs, setPrefs] = useState<CookiePreferences>({ ...DEFAULT_PREFERENCES });
  const dialogRef = useRef<HTMLDivElement>(null);
  const firstButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setVisible(needsConsentBanner());

    const handleOpenSettings = () => {
      localStorage.removeItem(CONSENT_KEY);
      setPrefs({ ...DEFAULT_PREFERENCES });
      setShowDetails(true);
      setVisible(true);
    };

    window.addEventListener("HAUSAURA:open-cookie-settings", handleOpenSettings);
    return () => window.removeEventListener("HAUSAURA:open-cookie-settings", handleOpenSettings);
  }, []);

  useScrollLock(showDetails);

  useEffect(() => {
    if (visible && firstButtonRef.current) {
      firstButtonRef.current.focus();
    }
  }, [visible]);

  const handleAcceptAll = () => {
    setCookiePreferences({ essential: true, functional: true, analytics: true });
    setVisible(false);
    window.dispatchEvent(new CustomEvent("HAUSAURA:cookie-saved", { detail: { consent: true } }));
  };

  const handleRejectAll = useCallback(() => {
    setCookiePreferences({ ...DEFAULT_PREFERENCES });
    setVisible(false);
    window.dispatchEvent(new CustomEvent("HAUSAURA:cookie-saved", { detail: { consent: false } }));
  }, []);

  const handleSaveSelection = () => {
    setCookiePreferences(prefs);
    setVisible(false);
    const hasOptional = prefs.functional || prefs.analytics;
    window.dispatchEvent(new CustomEvent("HAUSAURA:cookie-saved", { detail: { consent: hasOptional } }));
  };

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape") {
        setVisible(false);
        return;
      }
      if (e.key === "Tab" && dialogRef.current) {
        const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
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
    },
    []
  );

  if (!visible) return null;

  return (
    <>
      <div className="fixed inset-0 z-[95] bg-black/40" aria-hidden="true" />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label="Cookie-Einstellungen"
        aria-describedby="cookie-desc"
        onKeyDown={handleKeyDown}
        className="fixed bottom-0 left-0 right-0 z-[96] p-4 sm:p-6 pb-[env(safe-area-inset-bottom,0px)]"
      >
        <div className="max-w-2xl mx-auto bg-white rounded-2xl border border-[var(--color-border-light)] shadow-[var(--shadow-2xl)] p-3 sm:p-6 max-h-[92vh] overflow-y-auto">
          <div className="flex items-start gap-3 sm:gap-4">
            <div className="flex-shrink-0 w-10 h-10 bg-[var(--color-accent)]/10 rounded-xl hidden sm:flex items-center justify-center">
              <Cookie className="w-5 h-5 text-[var(--color-accent)]" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2 mb-1 sm:mb-2">
                <h3 className="text-sm sm:text-lg font-bold text-[var(--color-text-primary)]">
                  Cookie-Einstellungen
                </h3>
                {!showDetails && (
                  <button
                    type="button"
                    onClick={() => {
                      setShowDetails(true);
                      setPrefs({ essential: true, functional: false, analytics: false });
                    }}
                    className="shrink-0 min-h-[32px] px-2 py-1 text-[11px] sm:text-xs font-semibold text-[var(--color-text-primary)] underline underline-offset-2 hover:text-[var(--color-primary)] rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
                  >
                    Einstellungen
                  </button>
                )}
              </div>
              <p id="cookie-desc" className="text-xs sm:text-sm leading-snug sm:leading-relaxed text-[var(--color-text-secondary)] mb-2 sm:mb-4">
                Wir verwenden Cookies für ein besseres Nutzererlebnis. Sie entscheiden, welche wir nutzen dürfen — Details in der{" "}
                <a href="/datenschutz" className="underline hover:text-[var(--color-primary)]">Datenschutzerklärung</a>.
              </p>

              {showDetails && (
                <div className="space-y-4 mb-4 border border-[var(--color-border-light)] rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-semibold text-[var(--color-text-primary)]">Essenziell</div>
                      <div className="text-xs text-[var(--color-text-muted)]">Technisch notwendig</div>
                    </div>
                    <Toggle checked={true} disabled label="Essenziell" onChange={() => {}} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-semibold text-[var(--color-text-primary)]">Funktional</div>
                      <div className="text-xs text-[var(--color-text-muted)]">Wunschliste, Vergleich</div>
                    </div>
                    <Toggle
                      checked={prefs.functional}
                      onChange={(v) => setPrefs((p) => ({ ...p, functional: v }))}
                      label="Funktional"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-semibold text-[var(--color-text-primary)]">Analyse</div>
                      <div className="text-xs text-[var(--color-text-muted)]">Vercel Analytics</div>
                    </div>
                    <Toggle
                      checked={prefs.analytics}
                      onChange={(v) => setPrefs((p) => ({ ...p, analytics: v }))}
                      label="Analyse"
                    />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                {showDetails ? (
                  <Button
                    ref={firstButtonRef}
                    onClick={handleSaveSelection}
                    variant="primary"
                    className="w-full bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] min-h-[48px]"
                  >
                    Auswahl speichern
                  </Button>
                ) : (
                  <Button
                    ref={firstButtonRef}
                    onClick={handleAcceptAll}
                    variant="primary"
                    className="w-full bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] min-h-[48px]"
                  >
                    Akzeptieren
                  </Button>
                )}
                <Button
                  onClick={handleRejectAll}
                  variant="outline"
                  className="w-full border-[var(--color-border)] text-[var(--color-text-primary)] hover:bg-[var(--color-border-light)] min-h-[48px]"
                >
                  Ablehnen
                </Button>
              </div>
            </div>
            <button
              onClick={handleRejectAll}
              className="flex-shrink-0 w-8 h-8 sm:w-11 sm:h-11 -mt-1 -mr-1 flex items-center justify-center text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] rounded-lg hover:bg-[var(--color-bg-secondary)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
              aria-label="Schließen"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
