"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, ShoppingBag } from "lucide-react";
import { logger } from "@/lib/logger";

export default function ShopError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    logger.error("Shop page error", { error: error.message, digest: error.digest });
  }, [error]);

  return (
    <div className="container-hauselio py-24 text-center max-w-2xl mx-auto">
      <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-8">
        <AlertTriangle className="w-10 h-10 text-red-500" />
      </div>
      <h1 className="heading-2 mb-4">Fehler beim Laden der Produkte</h1>
      <p className="body-large mb-8 text-[var(--color-text-muted)]">
        Beim Laden des Shops ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.
      </p>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <button
          onClick={reset}
          className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--color-primary)] text-white font-semibold rounded-xl hover:bg-[var(--color-primary-hover)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2"
        >
          <RefreshCw className="w-4 h-4" />
          Erneut versuchen
        </button>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 border-2 border-[var(--color-border)] text-[var(--color-text-secondary)] font-semibold rounded-xl hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors"
        >
          <ShoppingBag className="w-4 h-4" />
          Zurück zur Startseite
        </Link>
      </div>
    </div>
  );
}
