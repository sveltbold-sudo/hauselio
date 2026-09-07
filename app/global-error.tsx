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
        <main id="main-content" role="alert" className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#ffffff", color: "#1a1a2e" }}>
          <div className="text-center max-w-md mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-4" style={{ color: "#1a1a2e" }}>
              Etwas ist schiefgelaufen
            </h1>
            <p className="mb-6" style={{ color: "#4a5568" }}>
              {error.digest ? "Fehler " + error.digest : "Ein unerwarteter Fehler ist aufgetreten. Bitte versuchen Sie es erneut."}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={reset}
                className="px-6 py-3 rounded-xl font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                style={{ backgroundColor: "#e11d48", color: "#ffffff" }}
              >
                Erneut versuchen
              </button>
              {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
              <a
                href="/"
                className="px-6 py-3 border-2 rounded-xl font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                style={{ borderColor: "#e2e8f0", color: "#4a5568" }}
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
