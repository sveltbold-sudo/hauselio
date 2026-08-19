import Link from "next/link";
import { Home, Search, SearchX, ShoppingBag, Star, Truck, ArrowRight, Shield } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import ProductImage from "@/components/product/ProductImage";

async function getPopularProducts() {
  try {
    const products = await prisma.product.findMany({
      include: {
        brand: { select: { name: true } },
        images: { take: 1, orderBy: { position: "asc" } },
      },
      orderBy: { reviewCount: "desc" },
      take: 4,
    });
    return products.map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      price: Number(p.price),
      originalPrice: p.originalPrice ? Number(p.originalPrice) : null,
      image: p.images[0]?.url || "/images/placeholder-product.svg",
      brand: p.brand?.name || "",
      rating: Number(p.rating),
      reviewCount: p.reviewCount,
    }));
  } catch {
    return [];
  }
}

export default async function NotFound() {
  const popularProducts = await getPopularProducts();

  return (
    <div className="container-hauselio py-12 lg:py-20">
      {/* Hero section */}
      <div className="text-center max-w-2xl mx-auto mb-16">
        <div className="relative mb-8">
          <p className="text-[10rem] font-black leading-none text-gray-100 select-none">
            404
          </p>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 rounded-full bg-[var(--color-accent)]/10 flex items-center justify-center animate-bounce-in">
              <SearchX className="w-10 h-10 text-[var(--color-accent)]" />
            </div>
          </div>
        </div>

        <h1 className="heading-1 mb-4">Ups! Hier gibt&apos;s nichts zu finden</h1>
        <p className="text-lg text-[var(--color-text-secondary)] mb-8">
          Aber keine Sorge — wir haben <strong>Tausende hochwertige Haushaltsgeräte</strong> für Sie parat.
        </p>

        {/* Search box */}
        <form action="/shop" method="GET" className="mb-8">
          <div className="flex gap-2 max-w-lg mx-auto">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-text-muted)]" />
              <input
                type="text"
                name="q"
                placeholder="Was suchen Sie? (z.B. Kaffeemaschine, Staubsauger...)"
                className="w-full pl-12 pr-4 py-4 border border-[var(--color-border-light)] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] shadow-sm"
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

        {/* Quick category links */}
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
              className="px-4 py-2 bg-white border border-[var(--color-border-light)] rounded-full text-sm font-medium text-[var(--color-text-secondary)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] hover:bg-[var(--color-primary)]/5 transition-all"
            >
              {cat.name}
            </Link>
          ))}
        </div>
      </div>

      {/* Popular products — drives conversion */}
      {popularProducts.length > 0 && (
        <div className="max-w-5xl mx-auto mb-16">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-[var(--color-text-primary)]">
                Beliebte Produkte
              </h2>
              <p className="text-sm text-[var(--color-text-muted)]">
                Unsere meistverkauften Geräte
              </p>
            </div>
            <Link
              href="/shop"
              className="flex items-center gap-1 text-sm font-semibold text-[var(--color-primary)] hover:underline"
            >
              Alle ansehen
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {popularProducts.map((product) => (
              <Link
                key={product.id}
                href={`/produkt/${product.slug}`}
                className="group bg-white rounded-xl border border-[var(--color-border-light)] p-3 hover:shadow-lg hover:border-[var(--color-primary)]/20 transition-all duration-300"
              >
                <div className="aspect-square bg-[var(--color-bg-secondary)] rounded-lg overflow-hidden mb-3">
                  <ProductImage src={product.image} alt={product.name} brand={product.brand} size="sm" />
                </div>
                <div className="flex items-center gap-1 mb-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3 h-3 ${
                        i < Math.floor(product.rating) ? "text-amber-400 fill-amber-400" : "text-gray-200 fill-gray-200"
                      }`}
                    />
                  ))}
                  <span className="text-[10px] text-[var(--color-text-muted)]">({product.reviewCount})</span>
                </div>
                <h3 className="text-sm font-semibold text-[var(--color-text-primary)] line-clamp-2 group-hover:text-[var(--color-primary)] transition-colors mb-1">
                  {product.name}
                </h3>
                <p className="text-xs text-[var(--color-text-muted)] mb-2">{product.brand}</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-sm font-bold text-[var(--color-text-primary)]">{formatPrice(product.price)}</span>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <span className="text-xs text-[var(--color-text-muted)] line-through">{formatPrice(product.originalPrice)}</span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Trust signals */}
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

      {/* CTA buttons */}
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
          className="inline-flex items-center justify-center px-6 py-3 border-2 border-[var(--color-primary)] text-[var(--color-primary)] rounded-xl font-semibold hover:bg-[var(--color-primary)] hover:text-white transition-all"
        >
          <ShoppingBag className="w-5 h-5 mr-2" />
          Kompletten Shop durchstöbern
        </Link>
      </div>
    </div>
  );
}
