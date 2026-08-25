"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { logger } from "@/lib/logger";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    logger.error("admin error boundary", error);
  }, [error]);

  return (
    <main className="p-8 text-center">
      <div className="w-16 h-16 rounded-full bg-[var(--color-danger-light)] flex items-center justify-center mx-auto mb-6">
        <AlertTriangle className="w-8 h-8 text-[var(--color-danger)]" />
      </div>
      <h2 className="text-lg font-bold text-[var(--color-text-primary)] mb-2">Fehler im Admin-Bereich</h2>
      <p className="text-[var(--color-text-muted)] mb-6">Ein unerwarteter Fehler ist aufgetreten.</p>
      <div className="flex gap-3 justify-center">
        <button onClick={() => reset()} className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg text-sm font-medium hover:bg-[var(--color-primary-hover)] transition-colors">
          Erneut versuchen
        </button>
        <Link href="/admin" className="px-4 py-2 border border-[var(--color-border)] text-[var(--color-text-secondary)] rounded-lg text-sm font-medium hover:bg-[var(--color-bg)] transition-colors">
          Dashboard
        </Link>
      </div>
    </main>
  );
}
