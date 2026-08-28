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
          <div className="text-center max-w-md mx-auto p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Etwas ist schiefgelaufen
            </h1>
            <p className="text-gray-600 mb-6">
              {error.digest ? "Fehler " + error.digest : "Ein unerwarteter Fehler ist aufgetreten. Bitte versuchen Sie es erneut."}
            </p>
            <button
              onClick={reset}
              className="px-6 py-3 bg-[#0A2540] text-white rounded-xl font-semibold hover:bg-[#123B5E] transition-colors"
            >
              Erneut versuchen
            </button>
          </div>
        </main>
      </body>
    </html>
  );
}
