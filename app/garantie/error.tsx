"use client";

export default function GarantieError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="container-hauselio py-12 lg:py-20">
      <div className="text-center max-w-md mx-auto">
        <h1 className="heading-2 mb-4">Fehler beim Laden</h1>
        <p className="text-[var(--color-text-secondary)] mb-6">
          Die Garantieinformationen konnten nicht geladen werden.
          {error.digest && <span className="block text-xs mt-2 text-[var(--color-text-muted)]">Fehler {error.digest}</span>}
        </p>
        <button
          onClick={reset}
          className="px-6 py-3 bg-[var(--color-primary)] text-white rounded-xl font-semibold hover:bg-[var(--color-primary-hover)] transition-colors"
        >
          Erneut versuchen
        </button>
      </div>
    </div>
  );
}
