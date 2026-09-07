"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="de">
      <body>
        <main id="main-content" role="alert" className="min-h-screen flex items-center justify-center bg-white">
          <div className="text-center max-w-md mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold text-[var(--color-text-primary)] mb-4">
              Etwas ist schiefgelaufen
            </h1>
            <p className="text-[var(--color-text-secondary)] mb-6">
              {error.digest ? "Fehler " + error.digest : "Ein unerwarteter Fehler ist aufgetreten. Bitte versuchen Sie es erneut."}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={reset}
                className="px-6 py-3 bg-[var(--color-primary)] text-white rounded-xl font-semibold hover:bg-[var(--color-primary-hover)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2"
              >
                Erneut versuchen
              </button>
              {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
              <a
                href="/"
                className="px-6 py-3 border-2 border-[var(--color-border)] text-[var(--color-text-secondary)] rounded-xl font-semibold hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2"
              >
                Zurück zur Startseite
              </a>
            </div>
          </div>
        </main>
      </body>
    </html>
  );
}
