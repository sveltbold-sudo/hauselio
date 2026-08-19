import Link from "next/link";
import { SearchX } from "lucide-react";

export default function ProduktNotFound() {
  return (
    <div className="container-hauselio py-24 text-center max-w-2xl mx-auto">
      <div className="relative mb-8">
        <p className="text-[10rem] font-black leading-none text-gray-100 select-none">
          404
        </p>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-20 h-20 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center">
            <SearchX className="w-10 h-10 text-[var(--color-primary)]" />
          </div>
        </div>
      </div>

      <h1 className="heading-2 mb-4">Produkt nicht gefunden</h1>

      <p className="body-large mb-10">
        Das gesuchte Produkt existiert leider nicht oder wurde aus unserem Sortiment entfernt.
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <Link
          href="/shop"
          className="px-6 py-3 bg-[var(--color-primary)] text-white font-semibold rounded-xl hover:bg-[var(--color-primary-hover)] transition-colors"
        >
          Zurück zur Boutique
        </Link>
        <Link
          href="/"
          className="px-6 py-3 border border-[var(--color-border)] text-[var(--color-text-secondary)] font-semibold rounded-xl hover:bg-gray-50 transition-colors"
        >
          Startseite
        </Link>
      </div>
    </div>
  );
}
