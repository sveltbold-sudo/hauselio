"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import { logger } from "@/lib/logger";

export default function NewsletterAbmeldenError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    logger.error("newsletter-abmelden-error", error);
  }, [error]);

  return (
    <div className="min-h-[50vh] flex items-center justify-center">
      <div className="text-center max-w-md px-6">
        <AlertTriangle className="w-12 h-12 text-[var(--color-danger)] mx-auto mb-4" />
        <h1 className="text-lg font-bold text-[var(--color-text-primary)] mb-2">
          Fehler beim Laden
        </h1>
        <p className="text-sm text-[var(--color-text-muted)] mb-6">
          Die Seite konnte nicht geladen werden.
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
