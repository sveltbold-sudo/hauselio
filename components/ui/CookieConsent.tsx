"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Cookie, X, Settings } from "lucide-react";
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
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] ${
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

  useScrollLock(visible);

  useEffect(() => {
    if (visible && firstButtonRef.current) {
      firstButtonRef.current.focus();
    }
  }, [visible]);

  const handleAcceptAll = () => {
    setCookiePreferences({ essential: true, functional: true, analytics: true });
    setVisible(false);
  };

  const handleRejectAll = useCallback(() => {
    setCookiePreferences({ ...DEFAULT_PREFERENCES });
    setVisible(false);
  }, []);

  const handleSaveSelection = () => {
    setCookiePreferences(prefs);
    setVisible(false);
  };

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape") {
        handleRejectAll();
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
    [handleRejectAll]
  );

  if (!visible) return null;

  return (
    <>
      <div className="fixed inset-0 z-[60] bg-black/40" aria-hidden="true" />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label="Cookie-Einstellungen"
        aria-describedby="cookie-desc"
        onKeyDown={handleKeyDown}
        className="fixed bottom-0 left-0 right-0 z-[60] p-4 sm:p-6 pb-[env(safe-area-inset-bottom,0px)]"
      >
        <div className="max-w-2xl mx-auto bg-white rounded-2xl border border-[var(--color-border-light)] shadow-[var(--shadow-2xl)] p-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-10 h-10 bg-[var(--color-accent)]/10 rounded-xl flex items-center justify-center">
              <Cookie className="w-5 h-5 text-[var(--color-accent)]" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-bold text-[var(--color-text-primary)] mb-2">
                Cookie-Einstellungen
              </h3>
              <p id="cookie-desc" className="text-sm text-[var(--color-text-secondary)] leading-relaxed mb-4">
                Wir verwenden Cookies, um das Nutzererlebnis zu verbessern.
                Sie können wählen, welche Cookies Sie zulassen möchten.
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

              <div className="flex flex-wrap gap-3">
                {showDetails ? (
                  <Button
                    ref={firstButtonRef}
                    onClick={handleSaveSelection}
                    variant="primary"
                    className="bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)]"
                  >
                    Auswahl speichern
                  </Button>
                ) : (
                  <Button
                    ref={firstButtonRef}
                    onClick={handleAcceptAll}
                    variant="primary"
                    className="bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)]"
                  >
                    Akzeptieren
                  </Button>
                )}
                <Button
                  onClick={handleRejectAll}
                  variant="outline"
                  className="border-[var(--color-border)] text-[var(--color-text-primary)] hover:bg-[var(--color-border-light)]"
                >
                  Ablehnen
                </Button>
                {!showDetails && (
                  <Button
                    onClick={() => {
                      setShowDetails(true);
                      setPrefs({ essential: true, functional: false, analytics: false });
                    }}
                    variant="ghost"
                    className="text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
                  >
                    <Settings className="w-4 h-4 mr-1" />
                    Einstellungen
                  </Button>
                )}
              </div>
            </div>
            <button
              onClick={handleRejectAll}
              className="flex-shrink-0 w-11 h-11 flex items-center justify-center text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] rounded-lg hover:bg-[var(--color-bg-secondary)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
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
