"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";

export default function LoginError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("login-error", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg)]">
      <div className="text-center max-w-md px-6">
        <AlertTriangle className="w-12 h-12 text-[var(--color-danger)] mx-auto mb-4" />
        <h2 className="text-lg font-bold text-[var(--color-text-primary)] mb-2">
          Fehler beim Laden
        </h2>
        <p className="text-sm text-[var(--color-text-muted)] mb-6">
          Die Anmeldeseite konnte nicht geladen werden.
        </p>
        <button
          onClick={reset}
          className="px-6 py-3 bg-[var(--color-primary)] text-white rounded-xl text-sm font-medium hover:bg-[var(--color-primary-hover)] transition-colors"
        >
          Erneut versuchen
        </button>
      </div>
    </div>
  );
}
