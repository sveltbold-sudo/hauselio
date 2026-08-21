"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";

export default function KlimaError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="container-hauselio py-24 text-center max-w-2xl mx-auto">
      <div className="w-20 h-20 rounded-full bg-[var(--color-danger-light)] flex items-center justify-center mx-auto mb-8">
        <AlertTriangle className="w-10 h-10 text-[var(--color-danger)]" />
      </div>
      <h1 className="heading-2 mb-4">Fehler aufgetreten</h1>
      <p className="body-large mb-10">
        Es tut uns leid, ein unerwarteter Fehler ist aufgetreten. Bitte versuchen Sie es erneut.
      </p>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <button onClick={() => reset()} className="inline-flex items-center px-8 py-4 bg-[var(--color-primary)] text-white font-semibold rounded-xl hover:bg-[var(--color-primary-dark)] transition-colors transition-shadow duration-300">
          Erneut versuchen
        </button>
        <Link href="/" className="inline-flex items-center px-8 py-4 border-2 border-[var(--color-border)] text-[var(--color-text-secondary)] font-semibold rounded-xl hover:border-[var(--color-text-primary)] hover:text-[var(--color-text-primary)] transition-colors duration-300">
          Zurück zur Startseite
        </Link>
      </div>
    </div>
  );
}
