import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import dynamicImport from "next/dynamic";
import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { SITE_URL } from "@/lib/constants";
import ProductCard from "@/components/product/ProductCard";
const HeroCarousel = dynamicImport(() => import("@/components/product/HeroCarousel"));
import ValuePropsSection from "@/components/product/ValuePropsSection";

const GuaranteeServiceSection = dynamicImport(() => import("@/components/product/GuaranteeServiceSection"));
const BuyingAdviceSection = dynamicImport(() => import("@/components/product/BuyingAdviceSection"));
const PressReviewsSection = dynamicImport(() => import("@/components/product/PressReviewsSection"));
const EditorialContentSection = dynamicImport(() => import("@/components/product/EditorialContentSection"));
const BrandsShowcaseSection = dynamicImport(() => import("@/components/product/BrandsShowcaseSection"));
import CustomerReviewsSection from "@/components/product/CustomerReviewsSection";
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
};

async function getCategories() {
  const cats = await prisma.category.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { products: true } } },
  });
  return cats.map((cat) => ({
    name: cat.name,
    href: `/kategorie/${cat.slug}`,
    image: `/images/categories/${cat.slug}.svg`,
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
    inStock: p.inStock,
    isPromo: p.originalPrice !== null,
    brand: p.brand?.name || "HAUSELIO",
  }));
}

const fallbackCategories = [
  { name: "Küche & Kochen", href: "/kategorie/kueche", image: "/images/products/thermomix-tm7.jpg", count: "45+" },
  { name: "Kaffee", href: "/kategorie/kaffee", image: "/images/products/jura-e8-platinum.jpg", count: "30+" },
  { name: "Reinigung", href: "/kategorie/reinigung", image: "/images/categories/reinigung.svg", count: "25+" },
  { name: "Klima", href: "/kategorie/klima", image: "/images/categories/klima.svg", count: "15+" },
  { name: "Smart Home", href: "/kategorie/smart-home", image: "/images/categories/smart-home.svg", count: "20+" },
  { name: "Haushaltsgeräte", href: "/kategorie/haushaltsgeraete", image: "/images/products/kitchenaid-artisan-5ksm175pse.jpg", count: "50+" },
];

const fallbackProducts = [
  { id: "1", name: "Thermomix TM7", slug: "thermomix-tm7", price: 1499, originalPrice: 1599, image: "/images/placeholder-product.svg", rating: 4.9, reviewCount: 127, isNew: true, brand: "KitchenAid" },
  { id: "2", name: "Dyson V15 Detect Absolute", slug: "dyson-v15-detect-absolute", price: 749, originalPrice: null, image: "/images/placeholder-product.svg", rating: 4.7, reviewCount: 89, isNew: true, brand: "Dyson" },
  { id: "3", name: "Jura E8 Platinum", slug: "jura-e8-platinum", price: 1199, originalPrice: 1299, image: "/images/placeholder-product.svg", rating: 4.8, reviewCount: 156, isPromo: true, brand: "Jura" },
  { id: "4", name: "Miele W1 Waschmaschine", slug: "miele-w1-waschmaschine", price: 1899, originalPrice: null, image: "/images/placeholder-product.svg", rating: 4.9, reviewCount: 203, isNew: false, brand: "Miele" },
];

function CategoriesSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-5">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="bg-white border border-[var(--color-border-light)] rounded-2xl p-6 text-center animate-pulse">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 rounded-2xl" />
          <div className="h-4 w-24 bg-gray-200 rounded mx-auto mb-2" />
          <div className="h-3 w-16 bg-gray-200 rounded mx-auto" />
        </div>
      ))}
    </div>
  );
}

function ProductsSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-7">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="bg-white rounded-2xl border border-[var(--color-border-light)] overflow-hidden animate-pulse">
          <div className="aspect-square bg-gray-200" />
          <div className="p-5 space-y-3">
            <div className="h-3 w-16 bg-gray-200 rounded" />
            <div className="h-4 w-full bg-gray-200 rounded" />
            <div className="h-4 w-3/4 bg-gray-200 rounded" />
            <div className="h-6 w-24 bg-gray-200 rounded" />
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
  } catch {
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
            <p className="text-[10px] text-white/70 font-medium">
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
  let isFallback = false;
  try {
    featuredProducts = await getFeaturedProducts();
    if (featuredProducts.length === 0) {
      featuredProducts = fallbackProducts;
      isFallback = true;
    }
  } catch {
    featuredProducts = fallbackProducts;
    isFallback = true;
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
      <div className="mt-10 text-center md:hidden">
        <Link href="/shop" className="inline-flex items-center gap-2 px-6 py-3 border-2 border-[var(--color-border)] text-[var(--color-text-secondary)] font-semibold rounded-xl hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors">
          Alle ansehen
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </>
  );
}

export default async function HomePage() {
  return (
    <div>
      <HeroCarousel />
      <ValuePropsSection />

      <section className="section-py">
        <div className="container-hauselio">
          <div className="text-center mb-10">
            <p className="caption text-[var(--color-accent)] mb-3">Sortiment</p>
            <h2 className="heading-2 mb-3">Entdecken Sie unsere Kategorien</h2>
            <p className="body-large max-w-2xl mx-auto">
              Finden Sie die perfekten Geräte für Ihr Zuhause
            </p>
          </div>
          <Suspense fallback={<CategoriesSkeleton />}>
            <CategoriesSection />
          </Suspense>
        </div>
      </section>

      <section className="section-py bg-[var(--color-bg-secondary)]">
        <div className="container-hauselio">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="caption text-[var(--color-accent)] mb-3">Highlights</p>
              <h2 className="heading-2">Beliebte Produkte</h2>
              <p className="body-large mt-2">
                Unsere meistverkauften Haushaltsgeräte
              </p>
            </div>
            <Link
              href="/shop"
              className="hidden md:flex items-center gap-2 text-sm font-semibold text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] transition-colors"
            >
              Alle ansehen
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <Suspense fallback={<ProductsSkeleton />}>
            <FeaturedProductsSection />
          </Suspense>
        </div>
      </section>

      <GuaranteeServiceSection />
      <BuyingAdviceSection />
      <PressReviewsSection />
      <EditorialContentSection />
      <BrandsShowcaseSection />
      <Suspense fallback={<div className="section-py"><div className="container-hauselio"><div className="animate-pulse h-64 bg-gray-100 rounded-2xl" /></div></div>}>
        <CustomerReviewsSection />
      </Suspense>
      <NewsletterSection />
    </div>
  );
}
