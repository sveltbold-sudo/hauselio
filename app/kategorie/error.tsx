"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { logger } from "@/lib/logger";

export default function KategorieError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    logger.error("page-error", error);
  }, [error]);

  return (
    <div role="alert" className="container-hausaura py-24 text-center max-w-2xl mx-auto">
      <div className="w-20 h-20 rounded-full bg-[var(--color-danger-light)] flex items-center justify-center mx-auto mb-8">
        <AlertTriangle className="w-10 h-10 text-[var(--color-danger)]" />
      </div>
      <h1 className="heading-2 mb-4">Etwas ist schiefgelaufen</h1>
      <p className="body-large mb-8 text-[var(--color-text-muted)]">
        Beim Laden der Kategorie ist ein Fehler aufgetreten.
      </p>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <button
          onClick={reset}
          className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--color-primary)] text-white font-semibold rounded-xl hover:bg-[var(--color-primary-hover)] transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Erneut versuchen
        </button>
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 px-6 py-3 border-2 border-[var(--color-border)] text-[var(--color-text-secondary)] font-semibold rounded-xl hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors"
        >
          Zurück zum Shop
        </Link>
      </div>
    </div>
  );
}
