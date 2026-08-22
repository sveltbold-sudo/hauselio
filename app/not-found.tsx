import Link from "next/link";
import Image from "next/image";
import { Home, Search, ShoppingBag, Star, Truck, Shield } from "lucide-react";

export default async function NotFound() {
  return (
    <div className="container-hauselio py-12 lg:py-20">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <Image
          src="/images/illustrations/404.svg"
          alt="Seite nicht gefunden"
          width={300}
          height={225}
          className="mx-auto mb-8"
        />
        <h1 className="heading-1 mb-4">Seite nicht gefunden</h1>
        <p className="body-large mb-4">
          Die gesuchte Seite existiert nicht oder wurde verschoben.
        </p>
        <p className="text-lg text-[var(--color-text-secondary)] mb-8">
          Aber keine Sorge — wir haben <strong>Tausende hochwertige Haushaltsgeräte</strong> für Sie parat.
        </p>

        <form action="/shop" method="GET" className="mb-8">
          <div className="flex gap-2 max-w-lg mx-auto">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-text-muted)]" />
              <input
                type="text"
                name="q"
                placeholder="Was suchen Sie? (z.B. Kaffeemaschine, Staubsauger...)"
                className="w-full pl-12 pr-4 py-4 border border-[var(--color-border-light)] rounded-xl text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] shadow-sm"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-4 bg-[var(--color-primary)] text-white rounded-xl font-semibold hover:bg-[var(--color-primary-hover)] transition-colors shadow-lg shadow-blue-500/20"
            >
              Suchen
            </button>
          </div>
        </form>

        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {[
            { name: "Küche & Kochen", href: "/kategorie/kueche" },
            { name: "Kaffee", href: "/kategorie/kaffee" },
            { name: "Reinigung", href: "/kategorie/reinigung" },
            { name: "Smart Home", href: "/kategorie/smart-home" },
            { name: "Alle Produkte", href: "/shop" },
          ].map((cat) => (
            <Link
              key={cat.href}
              href={cat.href}
              className="px-4 py-2 bg-white border border-[var(--color-border-light)] rounded-full text-sm font-medium text-[var(--color-text-secondary)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] hover:bg-[var(--color-primary)]/5 transition-colors"
            >
              {cat.name}
            </Link>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-6 mb-12 text-sm text-[var(--color-text-muted)]">
        <span className="flex items-center gap-2">
          <Truck className="w-4 h-4 text-[var(--color-success)]" />
          Kostenloser Versand ab 50€
        </span>
        <span className="flex items-center gap-2">
          <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
          4.8 Bewertung
        </span>
        <span className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-[var(--color-success)]" /> Bis zu 5 Jahre Garantie
        </span>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <Link
          href="/"
          className="inline-flex items-center justify-center px-6 py-3 bg-[var(--color-primary)] text-white rounded-xl font-semibold hover:bg-[var(--color-primary-hover)] transition-colors shadow-lg shadow-blue-500/20"
        >
          <Home className="w-5 h-5 mr-2" />
          Zurück zur Startseite
        </Link>
        <Link
          href="/shop"
          className="inline-flex items-center justify-center px-6 py-3 border-2 border-[var(--color-primary)] text-[var(--color-primary)] rounded-xl font-semibold hover:bg-[var(--color-primary)] hover:text-white transition-colors"
        >
          <ShoppingBag className="w-5 h-5 mr-2" />
          Kompletten Shop durchstöbern
        </Link>
      </div>
    </div>
  );
}
