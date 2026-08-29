import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import dynamicImport from "next/dynamic";
import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { SITE_URL, TRUST_BAR_REVIEW_COUNT, KIYOH_REVIEW_COUNT } from "@/lib/constants";
import { logger } from "@/lib/logger";
import ProductCard from "@/components/product/ProductCard";
const HeroCarousel = dynamicImport(() => import("@/components/product/HeroCarousel"));
import ValuePropsSection from "@/components/product/ValuePropsSection";
const DailyDealBanner = dynamicImport(() => import("@/components/product/DailyDealBanner"));
const BestsellerSection = dynamicImport(() => import("@/components/product/BestsellerSection"));
const RecommendedSection = dynamicImport(() => import("@/components/product/RecommendedSection"));

const RecentlyViewedSection = dynamicImport(() => import("@/components/product/RecentlyViewedSection"));
import TestimonialsSection from "@/components/product/TestimonialsSection";
const NewsletterSection = dynamicImport(() => import("@/components/home/NewsletterSection"));

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Moderne Haushaltsgeräte aus Deutschland",
  description:
    "Entdecken Sie hochwertige Haushaltsgeräte von Miele, Bosch, Siemens und mehr. Kostenloser Versand ab 50€. SEPA-Überweisung.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Moderne Haushaltsgeräte aus Deutschland",
    description:
      "Hochwertige Haushaltsgeräte von Top-Marken. Kostenloser Versand ab 50€.",
    url: SITE_URL,
    siteName: "HAUSELIO",
    locale: "de_DE",
    type: "website",
    images: [{ url: `${SITE_URL}/logos/logoprincipale.png`, width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Moderne Haushaltsgeräte aus Deutschland",
    description:
      "Hochwertige Haushaltsgeräte von Top-Marken. Kostenloser Versand ab 50€.",
    images: [`${SITE_URL}/logos/logoprincipale.png`],
  },
};

async function getCategories() {
  const cats = await prisma.category.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { products: true } } },
  });
  return cats.map((cat) => ({
    name: cat.name,
    href: `/kategorie/${cat.slug}`,
    image: `/images/categories/${cat.slug}.jpg`,
    count: `${cat._count.products}+`,
  }));
}

async function getFeaturedProducts() {
  const products = await prisma.product.findMany({
    where: { isFeatured: true },
    include: {
      brand: true,
      category: true,
      images: { take: 1, orderBy: { position: "asc" } },
    },
    orderBy: { createdAt: "desc" },
    take: 4,
  });

  return products.map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    price: Number(p.price),
    originalPrice: p.originalPrice ? Number(p.originalPrice) : null,
    image: p.images[0]?.url || "/images/placeholder-product.svg",
    rating: Number(p.rating),
    reviewCount: p.reviewCount,
    isNew: p.isNew,
    isPromo: p.originalPrice !== null,
    brand: p.brand?.name || "HAUSELIO",
  }));
}

async function getHeroSlides() {
  try {
    const products = await prisma.product.findMany({
      where: { isFeatured: true },
      include: {
        brand: true,
        images: { take: 1, orderBy: { position: "asc" } },
      },
      orderBy: { reviewCount: "desc" },
      take: 3,
    });

    return products.map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      brand: p.brand?.name || "",
      price: Number(p.price),
      originalPrice: p.originalPrice ? Number(p.originalPrice) : null,
      tagline: p.isNew ? "Neuheit" : p.isPromo ? "Angebot" : "Premium Qualität",
      subtitle: p.description?.slice(0, 120) || `${p.name} bei HAUSELIO entdecken.`,
      image: p.images[0]?.url || "/images/placeholder-product.svg",
      cta: "Jetzt ansehen",
    }));
  } catch (error) {
    logger.error("Failed to fetch hero slides", error);
    return [];
  }
}

async function getBestsellers() {
  const products = await prisma.product.findMany({
    where: { reviewCount: { gt: 0 } },
    include: {
      brand: true,
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
    rating: Number(p.rating),
    reviewCount: p.reviewCount,
    isNew: p.isNew,
    inStock: p.inStock,
    isPromo: p.originalPrice !== null,
    brand: p.brand?.name || null,
  }));
}

async function getDailyDeal() {
  const product = await prisma.product.findFirst({
    where: { isPromo: true, originalPrice: { not: null } },
    include: {
      brand: true,
      images: { take: 1, orderBy: { position: "asc" } },
    },
    orderBy: { reviewCount: "desc" },
  });

  if (!product) return null;

  return {
    name: product.name,
    slug: product.slug,
    brand: product.brand?.name || "HAUSELIO",
    price: Number(product.price),
    originalPrice: Number(product.originalPrice),
    image: product.images[0]?.url || "/images/placeholder-product.svg",
    tagline: product.description?.slice(0, 120) || "Exklusives Angebot — nur heute",
  };
}

async function getRecommended() {
  const products = await prisma.product.findMany({
    where: { rating: { gte: 4.5 } },
    include: {
      brand: true,
      images: { take: 1, orderBy: { position: "asc" } },
    },
    orderBy: { rating: "desc" },
    take: 4,
  });

  return products.map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    price: Number(p.price),
    originalPrice: p.originalPrice ? Number(p.originalPrice) : null,
    image: p.images[0]?.url || "/images/placeholder-product.svg",
    rating: Number(p.rating),
    reviewCount: p.reviewCount,
    isNew: p.isNew,
    inStock: p.inStock,
    isPromo: p.originalPrice !== null,
    brand: p.brand?.name || null,
  }));
}

const fallbackCategories = [
  { name: "Küche & Kochen", href: "/kategorie/kueche", image: "/images/categories/kueche.jpg", count: "45+" },
  { name: "Kaffee", href: "/kategorie/kaffee", image: "/images/categories/kaffee.jpg", count: "30+" },
  { name: "Reinigung", href: "/kategorie/reinigung", image: "/images/categories/reinigung.jpg", count: "25+" },
  { name: "Klima", href: "/kategorie/klima", image: "/images/categories/klima.jpg", count: "15+" },
  { name: "Smart Home", href: "/kategorie/smart-home", image: "/images/categories/smart-home.jpg", count: "20+" },
  { name: "Haushaltsgeräte", href: "/kategorie/haushaltsgeraete", image: "/images/categories/haushaltsgeraete.jpg", count: "50+" },
];

const fallbackProducts = [
  { id: "1", name: "Thermomix TM7", slug: "thermomix-tm7", price: 1499, originalPrice: 1599, image: "/images/placeholder-product.svg", rating: 4.9, reviewCount: 127, isNew: true, brand: "Vorwerk" },
  { id: "2", name: "Dyson V15 Detect Absolute", slug: "dyson-v15-detect-absolute", price: 749, originalPrice: null, image: "/images/placeholder-product.svg", rating: 4.7, reviewCount: 89, isNew: true, brand: "Dyson" },
  { id: "3", name: "Jura E8 Platinum", slug: "jura-e8-platinum", price: 1199, originalPrice: 1299, image: "/images/placeholder-product.svg", rating: 4.8, reviewCount: 156, isPromo: true, brand: "Jura" },
  { id: "4", name: "Miele W1 Waschmaschine WCI870 WCS", slug: "miele-w1-waschmaschine-wci870", price: 1899, originalPrice: null, image: "/images/placeholder-product.svg", rating: 4.9, reviewCount: 203, isNew: false, brand: "Miele" },
];

function CategoriesSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4" aria-hidden="true">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="rounded-2xl aspect-[4/3] bg-[var(--color-bg-secondary)] animate-pulse" />
      ))}
    </div>
  );
}

function ProductsSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" aria-hidden="true">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="bg-white rounded-xl border border-[var(--color-border-light)] overflow-hidden animate-pulse">
          <div className="aspect-square bg-[var(--color-bg-secondary)]" />
          <div className="p-4 space-y-2.5">
            <div className="h-2.5 w-16 bg-[var(--color-bg-secondary)] rounded" />
            <div className="h-3.5 w-full bg-[var(--color-bg-secondary)] rounded" />
            <div className="h-3.5 w-3/4 bg-[var(--color-bg-secondary)] rounded" />
            <div className="h-5 w-24 bg-[var(--color-bg-secondary)] rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}

async function CategoriesSection() {
  let categories;
  try {
    categories = await getCategories();
    if (categories.length === 0) categories = fallbackCategories;
  } catch (error) {
    logger.error("Failed to fetch categories", error);
    categories = fallbackCategories;
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {categories.map((cat, i) => (
        <Link
          key={cat.href}
          href={cat.href}
          className="group relative overflow-hidden rounded-2xl aspect-[4/3] animate-fade-in-up"
          style={{ animationDelay: `${i * 60}ms` }}
        >
          {/* Background Image */}
          <div className="absolute inset-0 bg-[var(--color-bg-secondary)]">
            <Image
              src={cat.image}
              alt={cat.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 16vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          </div>

          {/* Content */}
          <div className="absolute inset-0 flex flex-col justify-end p-4">
            <h3 className="font-bold text-sm text-white mb-0.5 leading-tight">
              {cat.name}
            </h3>
            <p className="text-xs text-white/70 font-medium">
              {cat.count} Produkte
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}

async function FeaturedProductsSection() {
  let featuredProducts;
  try {
    featuredProducts = await getFeaturedProducts();
    if (featuredProducts.length === 0) {
      featuredProducts = fallbackProducts;
    }
  } catch (error) {
    logger.error("Failed to fetch featured products", error);
    featuredProducts = fallbackProducts;
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-7">
        {featuredProducts.map((product, i) => (
          <div
            key={product.id}
            className="animate-fade-in-up"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>
      <div className="mt-8 text-center md:hidden">
        <Link href="/shop" className="inline-flex items-center gap-2 px-6 py-3 border-2 border-[var(--color-border)] text-[var(--color-text-secondary)] font-semibold rounded-xl hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors">
          Alle ansehen
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </>
  );
}

export default async function HomePage() {
  const [dailyDeal, bestsellers, recommended, heroSlides] = await Promise.allSettled([
    getDailyDeal(),
    getBestsellers(),
    getRecommended(),
    getHeroSlides(),
  ]);

  const dealValue = dailyDeal.status === "fulfilled" ? dailyDeal.value : null;
  let bestsellersValue = bestsellers.status === "fulfilled" ? bestsellers.value : [];
  let recommendedValue = recommended.status === "fulfilled" ? recommended.value : [];
  const heroSlidesValue = heroSlides.status === "fulfilled" ? heroSlides.value : [];

  if (dailyDeal.status === "rejected") logger.error("Failed to fetch daily deal", dailyDeal.reason);
  if (bestsellers.status === "rejected") logger.error("Failed to fetch bestsellers", bestsellers.reason);
  if (recommended.status === "rejected") logger.error("Failed to fetch recommended", recommended.reason);
  if (heroSlides.status === "rejected") logger.error("Failed to fetch hero slides", heroSlides.reason);

  if (dealValue) {
    const dealSlug = dealValue.slug;
    bestsellersValue = bestsellersValue.filter((b) => b.slug !== dealSlug);
    recommendedValue = recommendedValue.filter((r) => r.slug !== dealSlug);
  }

  return (
    <main id="main-content">
      <h1 className="sr-only">HAUSELIO — Moderne Haushaltsgeräte aus Deutschland</h1>
      <HeroCarousel slides={heroSlidesValue.length > 0 ? heroSlidesValue : undefined} />

      {/* Trust scores — like Coolblue */}
      <section className="py-6 border-b border-[var(--color-border-light)]">
        <div className="container-hauselio">
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-4 h-4 text-[var(--color-success)]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                ))}
              </div>
              <span className="text-sm font-bold text-[var(--color-text-primary)]">4,8/5</span>
              <span className="text-xs text-[var(--color-text-muted)]">— {TRUST_BAR_REVIEW_COUNT} Bewertungen</span>
            </div>
            <div className="w-px h-6 bg-[var(--color-border-light)] hidden sm:block" />
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-[var(--color-text-primary)]">9,2/10</span>
              <span className="text-xs text-[var(--color-text-muted)]">— {KIYOH_REVIEW_COUNT} Bewertungen</span>
            </div>
            <div className="w-px h-6 bg-[var(--color-border-light)] hidden sm:block" />
            <div className="flex items-center gap-2 text-sm text-[var(--color-text-muted)]">
              <svg className="w-5 h-5 text-[var(--color-success)]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
              </svg>
              <span>Geprüfter Online-Shop</span>
            </div>
          </div>
        </div>
      </section>

      <ValuePropsSection />

      {/* Deal of the Day — like MediaMarkt/Saturn */}
      {dealValue && <DailyDealBanner product={dealValue} />}

      <section className="section-py">
        <div className="container-hauselio">
          <div className="text-center mb-6 md:mb-10">
            <p className="caption text-[var(--color-accent)] mb-3">Sortiment</p>
            <h2 className="heading-2 mb-3">Entdecken Sie unsere Kategorien</h2>
            <p className="body-large max-w-2xl mx-auto">
              Finden Sie die perfekten Geräte für Ihr Zuhause
            </p>
          </div>
          <Suspense fallback={<CategoriesSkeleton />}>
            <CategoriesSection />
          </Suspense>
          <div className="mt-8 text-center">
            <Link href="/shop" className="inline-flex items-center gap-2 px-6 py-3 border-2 border-[var(--color-border)] text-[var(--color-text-secondary)] font-semibold rounded-xl hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors text-sm">
              Alle Kategorien ansehen
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Bestseller — like all competitors */}
      {bestsellersValue.length > 0 && <BestsellerSection products={bestsellersValue} />}

      {/* Für Sie empfohlen — top-rated */}
      {recommendedValue.length > 0 && <RecommendedSection products={recommendedValue} />}

      <TestimonialsSection />
      <RecentlyViewedSection />
      <NewsletterSection />
    </main>
  );
}
