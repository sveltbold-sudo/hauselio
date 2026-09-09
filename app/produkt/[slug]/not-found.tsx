import Link from "next/link";

export default function ProduktNotFound() {
  return (
    <main className="container-hausaura py-16 text-center" id="main-content">
      <div className="max-w-md mx-auto">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[var(--color-bg-alt)] flex items-center justify-center">
          <svg className="w-10 h-10 text-[var(--color-text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)] mb-3">
          Produkt nicht gefunden
        </h1>
        <p className="text-[var(--color-text-secondary)] mb-8">
          Das gesuchte Produkt ist leider nicht verfügbar oder wurde entfernt.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/shop"
            className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-[var(--color-primary)] text-white font-medium hover:bg-[var(--color-primary)]/90 transition-colors"
          >
            Zum Shop
          </Link>
          <Link
            href="/kategorie"
            className="inline-flex items-center justify-center px-6 py-3 rounded-lg border border-[var(--color-border)] text-[var(--color-text-primary)] font-medium hover:bg-[var(--color-bg-alt)] transition-colors"
          >
            Kategorien ansehen
          </Link>
        </div>
      </div>
    </main>
  );
}
