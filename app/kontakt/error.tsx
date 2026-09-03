"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, ArrowLeft } from "lucide-react";
import { logger } from "@/lib/logger";

export default function KontaktError({
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
    <div role="alert" className="container-hausaura py-20 text-center">
      <div className="w-16 h-16 rounded-full bg-[var(--color-danger-light)] flex items-center justify-center mx-auto mb-6">
        <AlertTriangle className="w-8 h-8 text-[var(--color-danger)]" />
      </div>
      <h1 className="text-2xl font-bold text-[var(--color-text-primary)] mb-3">
        Etwas ist schiefgelaufen
      </h1>
      <p className="text-[var(--color-text-muted)] mb-8 max-w-md mx-auto">
        Beim Laden der Kontaktseite ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.
      </p>
      <div className="flex items-center justify-center gap-4">
        <button
          onClick={reset}
          className="px-6 py-3 bg-[var(--color-primary)] text-white font-semibold rounded-xl hover:bg-[var(--color-primary-hover)] transition-colors"
        >
          Erneut versuchen
        </button>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 border border-[var(--color-border)] text-[var(--color-text-secondary)] font-semibold rounded-xl hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Zurück zur Startseite
        </Link>
      </div>
    </div>
  );
}
