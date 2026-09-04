import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import dynamicImport from "next/dynamic";
import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { SITE_URL } from "@/lib/constants";
import { logger } from "@/lib/logger";
function HeroSkeleton() {
  return <div className="container-hausaura py-8"><div className="h-[400px] bg-[var(--color-bg-secondary)] rounded-2xl animate-pulse" /></div>;
}
function DealSkeleton() {
  return <div className="container-hausaura py-6"><div className="h-24 bg-[var(--color-bg-secondary)] rounded-xl animate-pulse" /></div>;
}
function ThermomixSkeleton() {
  return (
    <div className="container-hausaura py-8">
      <div className="h-6 w-64 bg-[var(--color-bg-secondary)] rounded mb-2 animate-pulse" />
      <div className="h-8 w-80 bg-[var(--color-bg-secondary)] rounded mb-8 animate-pulse" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white rounded-2xl border border-[var(--color-border-light)] overflow-hidden animate-pulse">
            <div className="aspect-square bg-[var(--color-bg-secondary)]" />
            <div className="p-4 space-y-2"><div className="h-3 w-16 bg-[var(--color-bg-secondary)] rounded" /><div className="h-4 w-full bg-[var(--color-bg-secondary)] rounded" /><div className="h-3 w-24 bg-[var(--color-bg-secondary)] rounded" /></div>
          </div>
        ))}
      </div>
    </div>
  );
}
function ProductRowSkeleton() {
  return (
    <div className="container-hausaura py-8">
      <div className="h-6 w-48 bg-[var(--color-bg-secondary)] rounded mb-6 animate-pulse" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl border border-[var(--color-border-light)] overflow-hidden animate-pulse">
            <div className="aspect-square bg-[var(--color-bg-secondary)]" />
            <div className="p-3 space-y-2"><div className="h-3 w-20 bg-[var(--color-bg-secondary)] rounded" /><div className="h-4 w-full bg-[var(--color-bg-secondary)] rounded" /></div>
          </div>
        ))}
      </div>
    </div>
  );
}
function NewsletterSkeleton() {
  return <div className="container-hausaura py-12"><div className="h-48 bg-[var(--color-bg-secondary)] rounded-2xl animate-pulse" /></div>;
}

const HeroCarousel = dynamicImport(() => import("@/components/product/HeroCarousel"), { loading: () => <HeroSkeleton /> });
import ValuePropsSection from "@/components/product/ValuePropsSection";
const DailyDealBanner = dynamicImport(() => import("@/components/product/DailyDealBanner"), { loading: () => <DealSkeleton /> });
const BestsellerSection = dynamicImport(() => import("@/components/product/BestsellerSection"), { loading: () => <ProductRowSkeleton /> });
const RecommendedSection = dynamicImport(() => import("@/components/product/RecommendedSection"), { loading: () => <ProductRowSkeleton /> });

const RecentlyViewedSection = dynamicImport(() => import("@/components/product/RecentlyViewedSection"), { loading: () => <ProductRowSkeleton /> });
const ThermomixSection = dynamicImport(() => import("@/components/product/ThermomixSection"), { loading: () => <ThermomixSkeleton /> });
import TestimonialsSection from "@/components/product/TestimonialsSection";
import PressReviewsSection from "@/components/product/PressReviewsSection";
const NewsletterSection = dynamicImport(() => import("@/components/home/NewsletterSection"), { loading: () => <NewsletterSkeleton /> });

export const revalidate = 300;

export const metadata: Metadata = {
  title: "HAUSAURA — Moderne Haushaltsgeräte aus Deutschland",
  description:
    "Entdecken Sie hochwertige Haushaltsgeräte von Miele, Bosch, Siemens und mehr. Kostenloser Versand ab 50€. Überweisung (Vorkasse).",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "HAUSAURA — Moderne Haushaltsgeräte aus Deutschland",
    description:
      "Hochwertige Haushaltsgeräte von Top-Marken. Kostenloser Versand ab 50€.",
    url: SITE_URL,
    siteName: "HAUSAURA",
    locale: "de_DE",
    type: "website",
    images: [{ url: `${SITE_URL}/logos/logoprincipale.png`, width: 1200, height: 630, alt: "HAUSAURA — Moderne Haushaltsgeräte" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "HAUSAURA — Moderne Haushaltsgeräte aus Deutschland",
    description:
      "Hochwertige Haushaltsgeräte von Top-Marken. Kostenloser Versand ab 50€.",
    images: [`${SITE_URL}/logos/logoprincipale.png`],
  },
};

async function getCategories() {
  const cats = await prisma.category.findMany({
    orderBy: { name: "asc" },
    take: 6,
    include: { _count: { select: { products: true } } },
  });
  return cats.map((cat) => ({
    name: cat.name,
    href: `/kategorie/${cat.slug}`,
    image: `/images/categories/${cat.slug}.jpg`,
    count: `${cat._count.products}+`,
  }));
}

async function getHeroSlides() {
  try {
    const thermomixBrand = await prisma.brand.findFirst({
      where: { name: { contains: "Thermomix", mode: "insensitive" } },
    });

    if (!thermomixBrand) return [];

    const products = await prisma.product.findMany({
      where: { brandId: thermomixBrand.id },
      include: {
        brand: true,
        images: { take: 1, orderBy: { position: "asc" } },
      },
      orderBy: [
        { isFeatured: "desc" },
        { reviewCount: "desc" },
      ],
      take: 5,
    });

    return products.map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      brand: p.brand?.name || "",
      price: Number(p.price),
      originalPrice: p.originalPrice ? Number(p.originalPrice) : null,
      isPromo: p.isPromo,
      tagline: p.isNew ? "Neuheit" : p.isPromo ? "Angebot" : "Premium Qualität",
      subtitle: p.description?.slice(0, 120) || `${p.name} bei HAUSAURA entdecken.`,
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
    isPromo: p.isPromo,
    brand: p.brand?.name || null,
  }));
}

async function getDailyDeal() {
  const product = await prisma.product.findFirst({
    where: { isDailyDeal: true },
    include: {
      brand: true,
      images: { take: 1, orderBy: { position: "asc" } },
      reviews: { where: { isApproved: true }, take: 3, orderBy: { createdAt: "desc" } },
    },
  });

  if (!product) return null;

  return {
    name: product.name,
    slug: product.slug,
    brand: product.brand?.name || "HAUSAURA",
    price: Number(product.price),
    originalPrice: Number(product.originalPrice || product.price),
    image: product.images[0]?.url || "/images/placeholder-product.svg",
    tagline: product.shortDesc || product.description?.slice(0, 120) || "Exklusives Angebot — nur heute",
    rating: Number(product.rating),
    reviewCount: product.reviewCount,
    reviews: product.reviews.map((r) => ({
      name: r.authorName,
      rating: r.rating,
      content: (r.content || "").slice(0, 150),
    })),
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
    isPromo: p.isPromo,
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

function CategoriesSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4" aria-hidden="true">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="rounded-2xl aspect-[4/3] bg-[var(--color-bg-secondary)] animate-pulse" />
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
          </div>
        </Link>
      ))}
    </div>
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

  // Deduplicate: remove bestseller products from recommended
  const bestsellerSlugs = new Set(bestsellersValue.map((b) => b.slug));
  recommendedValue = recommendedValue.filter((r) => !bestsellerSlugs.has(r.slug));

  return (
    <main id="main-content">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "HAUSAURA", item: SITE_URL },
            ],
          }),
        }}
      />
      <h1 className="heading-1 container-hausaura pt-8 pb-2 text-[var(--color-text-primary)]">
        HAUSAURA — Moderne Haushaltsgeräte
      </h1>
      <p className="container-hausaura text-[var(--color-text-secondary)] text-sm sm:text-base mb-4 -mt-1">
        Bis zu 40% sparen auf Markengeräte · Kostenloser Versand ab 50€
      </p>
      <HeroCarousel slides={heroSlidesValue.length > 0 ? heroSlidesValue : undefined} />

      <ThermomixSection />

      {/* Trust scores — like Coolblue */}
      <section className="py-6 lg:py-8 border-b border-[var(--color-border-light)]">
        <div className="container-hausaura">
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-4 h-4 text-[var(--color-success)]" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                ))}
              </div>
              <span className="text-sm font-bold text-[var(--color-text-primary)]">4,8/5</span>
              <span className="text-xs text-[var(--color-text-muted)]">· 2.500+ Bewertungen</span>
            </div>
            <div className="w-px h-6 bg-[var(--color-border-light)] hidden sm:block" />
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-[var(--color-text-primary)]">9,2/10</span>
              <span className="text-xs text-[var(--color-text-muted)]">· KiyoBewertungen</span>
            </div>
            <div className="w-px h-6 bg-[var(--color-border-light)] hidden sm:block" />
            <div className="flex items-center gap-2 text-sm text-[var(--color-text-muted)]">
              <svg className="w-5 h-5 text-[var(--color-success)]" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
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
        <div className="container-hausaura">
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

      <PressReviewsSection />
      <TestimonialsSection />
      <RecentlyViewedSection />
      <NewsletterSection />
    </main>
  );
}
