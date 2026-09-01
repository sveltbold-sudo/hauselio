"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";

export default function OrderDetailError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("order-detail-error", error);
  }, [error]);

  return (
    <div className="text-center py-20">
      <AlertTriangle className="w-12 h-12 text-[var(--color-danger)] mx-auto mb-4" />
      <h2 className="text-lg font-bold text-[var(--color-text-primary)] mb-2">
        Fehler beim Laden der Bestellung
      </h2>
      <p className="text-sm text-[var(--color-text-muted)] mb-6">
        Die Bestellung konnte nicht geladen werden.
      </p>
      <div className="flex items-center justify-center gap-3">
        <button
          onClick={reset}
          className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg text-sm font-medium hover:bg-[var(--color-primary-hover)] transition-colors"
        >
          Erneut versuchen
        </button>
        <Link
          href="/admin/bestellungen"
          className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:underline"
        >
          Zurück zur Bestellliste
        </Link>
      </div>
    </div>
  );
}
