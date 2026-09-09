import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/product/ProductCard";
import Breadcrumb from "@/components/ui/Breadcrumb";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";
import { SITE_URL, SITE_NAME } from "@/lib/constants";
import type { ProductListItem } from "@/lib/product-types";
import { Tag, Truck, Shield, Clock, Star, Percent, CheckCircle } from "lucide-react";

export const revalidate = 300;

function mapProduct(p: { id: string; name: string; slug: string; price: number | import("@prisma/client").Prisma.Decimal; originalPrice: number | import("@prisma/client").Prisma.Decimal | null; rating: number | import("@prisma/client").Prisma.Decimal; reviewCount: number; isNew: boolean; isPromo: boolean; stockQuantity: number | null; images: { url: string }[]; brand: { name: string } | null; category: { name: string } | null }): ProductListItem {
  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    price: Number(p.price),
    originalPrice: p.originalPrice ? Number(p.originalPrice) : null,
    image: p.images[0]?.url || "/images/placeholder-product.svg",
    rating: Number(p.rating),
    reviewCount: p.reviewCount,
    isNew: p.isNew,
    isPromo: p.isPromo,
    brand: p.brand?.name || null,
    categorySlug: null,
  };
}

export const metadata: Metadata = {
  title: "Angebote & Sale — Bis zu 40% sparen | HAUSAURA",
  description:
    "Entdecken Sie unsere besten Angebote auf Premium-Haushaltsgeräte. Thermomix, Bosch, Siemens, Miele und mehr mit bis zu 40% Rabatt. Kostenloser Versand ab 50€.",
  alternates: { canonical: `${SITE_URL}/angebote` },
  openGraph: {
    title: "Angebote & Sale — HAUSAURA",
    description: "Premium-Haushaltsgeräte mit Rabatt. Sparen Sie bis zu 40%.",
    url: `${SITE_URL}/angebote`,
    images: [{ url: `${SITE_URL}/logos/logoprincipale.png`, width: 1200, height: 630 }],
  },
};

export default async function AngebotePage() {
  const [promoProducts, bestsellers, newProducts] = await Promise.all([
    prisma.product.findMany({
      where: { isPromo: true },
      select: {
        id: true, name: true, slug: true, price: true, originalPrice: true,
        rating: true, reviewCount: true, isNew: true, isPromo: true,
        stockQuantity: true,
        images: { select: { url: true }, take: 1, orderBy: { position: "asc" } },
        brand: { select: { name: true } },
        category: { select: { name: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 20,
    }),
    prisma.product.findMany({
      where: { reviewCount: { gte: 5 } },
      select: {
        id: true, name: true, slug: true, price: true, originalPrice: true,
        rating: true, reviewCount: true, isNew: true, isPromo: true,
        stockQuantity: true,
        images: { select: { url: true }, take: 1, orderBy: { position: "asc" } },
        brand: { select: { name: true } },
        category: { select: { name: true } },
      },
      orderBy: { reviewCount: "desc" },
      take: 8,
    }),
    prisma.product.findMany({
      where: { isNew: true },
      select: {
        id: true, name: true, slug: true, price: true, originalPrice: true,
        rating: true, reviewCount: true, isNew: true, isPromo: true,
        stockQuantity: true,
        images: { select: { url: true }, take: 1, orderBy: { position: "asc" } },
        brand: { select: { name: true } },
        category: { select: { name: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 8,
    }),
  ]);

  const maxDiscount = promoProducts.reduce((max, p) => {
    if (p.originalPrice) {
      const discount = Math.round((1 - Number(p.price) / Number(p.originalPrice)) * 100);
      return Math.max(max, discount);
    }
    return max;
  }, 0);

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Startseite", url: SITE_URL },
          { name: "Angebote", url: `${SITE_URL}/angebote` },
        ]}
      />
      <main id="main-content" className="min-h-screen">
        <section className="bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-dark)] text-white py-16 md:py-20">
          <div className="container-hausaura text-center">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 text-sm font-medium mb-6">
              <Percent className="w-4 h-4" />
              <span>Bis zu {maxDiscount}% Rabatt</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 tracking-tight">
              Angebote & Sale
            </h1>
            <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-8">
              Premium-Haushaltsgeräte zu unschlagbaren Preisen. Sparen Sie auf Top-Marken wie Bosch, Siemens, Miele und mehr.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <div className="flex items-center gap-2 bg-white/10 rounded-full px-4 py-2">
                <Truck className="w-4 h-4" />
                <span>Kostenloser Versand ab 50€</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 rounded-full px-4 py-2">
                <Shield className="w-4 h-4" />
                <span>2 Jahre Garantie</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 rounded-full px-4 py-2">
                <Clock className="w-4 h-4" />
                <span>Schneller Versand</span>
              </div>
            </div>
          </div>
        </section>

        <section className="container-hausaura py-12 md:py-16">
          <Breadcrumb items={[{ label: "Angebote" }]} />
          
          {promoProducts.length > 0 && (
            <div className="mb-16">
              <div className="flex items-center gap-3 mb-8">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-red-100 text-red-600">
                  <Tag className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold">Top-Angebote</h2>
                  <p className="text-[var(--color-text-muted)]">Die besten Deals — solange der Vorrat reicht</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {promoProducts.map((product) => (
                  <ProductCard key={product.id} product={mapProduct(product)} />
                ))}
              </div>
              <div className="text-center mt-8">
                <Link
                  href="/shop?promo=true"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[var(--color-primary)] text-white font-semibold hover:bg-[var(--color-primary-dark)] transition-colors"
                >
                  Alle Angebote ansehen
                  <span className="text-sm opacity-80">({promoProducts.length}+ Produkte)</span>
                </Link>
              </div>
            </div>
          )}

          {bestsellers.length > 0 && (
            <div className="mb-16">
              <div className="flex items-center gap-3 mb-8">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-amber-100 text-amber-600">
                  <Star className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold">Bestseller</h2>
                  <p className="text-[var(--color-text-muted)]">Beliebte Produkte mit Top-Bewertungen</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {bestsellers.map((product) => (
                  <ProductCard key={product.id} product={mapProduct(product)} />
                ))}
              </div>
            </div>
          )}

          {newProducts.length > 0 && (
            <div className="mb-16">
              <div className="flex items-center gap-3 mb-8">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-green-100 text-green-600">
                  <CheckCircle className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold">Neuheiten</h2>
                  <p className="text-[var(--color-text-muted)]">Entdecken Sie unsere neuesten Produkte</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {newProducts.map((product) => (
                  <ProductCard key={product.id} product={mapProduct(product)} />
                ))}
              </div>
              <div className="text-center mt-8">
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-[var(--color-primary)] text-[var(--color-primary)] font-semibold hover:bg-[var(--color-primary)] hover:text-white transition-colors"
                >
                  Alle Produkte entdecken
                </Link>
              </div>
            </div>
          )}

          <section className="bg-[var(--color-bg-secondary)] rounded-2xl p-8 md:p-12 mt-12">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">Warum HAUSAURA?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-14 h-14 rounded-2xl bg-[var(--color-primary)]/10 flex items-center justify-center mx-auto mb-4">
                  <Truck className="w-7 h-7 text-[var(--color-primary)]" />
                </div>
                <h3 className="font-bold text-lg mb-2">Kostenloser Versand</h3>
                <p className="text-[var(--color-text-muted)] text-sm">Ab 50€ Bestellwert — schnell und zuverlässig an Ihre Tür</p>
              </div>
              <div className="text-center">
                <div className="w-14 h-14 rounded-2xl bg-[var(--color-primary)]/10 flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-7 h-7 text-[var(--color-primary)]" />
                </div>
                <h3 className="font-bold text-lg mb-2">2 Jahre Garantie</h3>
                <p className="text-[var(--color-text-muted)] text-sm">Auf alle Produkte — Ihr Einkauf ist sicher</p>
              </div>
              <div className="text-center">
                <div className="w-14 h-14 rounded-2xl bg-[var(--color-primary)]/10 flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-7 h-7 text-[var(--color-primary)]" />
                </div>
                <h3 className="font-bold text-lg mb-2">Schnelle Bearbeitung</h3>
                <p className="text-[var(--color-text-muted)] text-sm">Bestellung heute — Versand innerhalb von 1-2 Werktagen</p>
              </div>
            </div>
          </section>
        </section>
      </main>
    </>
  );
}
