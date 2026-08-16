import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/product/ProductCard";
import HeroCarousel from "@/components/product/HeroCarousel";
import ValuePropsSection from "@/components/product/ValuePropsSection";

const GuaranteeServiceSection = dynamic(() => import("@/components/product/GuaranteeServiceSection"));
const BuyingAdviceSection = dynamic(() => import("@/components/product/BuyingAdviceSection"));
const PressReviewsSection = dynamic(() => import("@/components/product/PressReviewsSection"));
const EditorialContentSection = dynamic(() => import("@/components/product/EditorialContentSection"));
const BrandsShowcaseSection = dynamic(() => import("@/components/product/BrandsShowcaseSection"));
import CustomerReviewsSection from "@/components/product/CustomerReviewsSection";
const NewsletterSection = dynamic(() => import("@/components/home/NewsletterSection"));

export const revalidate = 300;

export const metadata: Metadata = {
  title: "HAUSELIO — Moderne Haushaltsgeräte aus Deutschland",
  description:
    "Entdecken Sie hochwertige Haushaltsgeräte von Miele, Bosch, Siemens und mehr. Kostenloser Versand ab 50€. SEPA-Überweisung.",
  openGraph: {
    title: "HAUSELIO — Moderne Haushaltsgeräte aus Deutschland",
    description:
      "Hochwertige Haushaltsgeräte von Top-Marken. Kostenloser Versand ab 50€.",
    url: "/",
    siteName: "HAUSELIO",
    locale: "de_DE",
    type: "website",
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
    image: p.images[0]?.url || "/images/products/placeholder.jpg",
    rating: Number(p.rating),
    reviewCount: p.reviewCount,
    isNew: p.isNew,
    isPromo: p.originalPrice !== null,
    brand: p.brand?.name || "HAUSELIO",
  }));
}

const fallbackCategories = [
  { name: "Küche & Kochen", href: "/kategorie/kueche", image: "/images/categories/kueche.svg", count: "45+" },
  { name: "Kaffee", href: "/kategorie/kaffee", image: "/images/categories/kaffee.svg", count: "30+" },
  { name: "Reinigung", href: "/kategorie/reinigung", image: "/images/categories/reinigung.svg", count: "25+" },
  { name: "Klima", href: "/kategorie/klima", image: "/images/categories/klima.svg", count: "15+" },
  { name: "Smart Home", href: "/kategorie/smart-home", image: "/images/categories/smart-home.svg", count: "20+" },
  { name: "Haushaltsgeräte", href: "/kategorie/haushaltsgeraete", image: "/images/categories/haushaltsgeraete.svg", count: "50+" },
];

const fallbackProducts = [
  { id: "1", name: "Thermomix TM7", slug: "thermomix-tm7", price: 1499, originalPrice: 1599, image: "/images/products/thermomix-tm7.jpg", rating: 4.9, reviewCount: 127, isNew: true, brand: "KitchenAid" },
  { id: "2", name: "Dyson V15 Detect Absolute", slug: "dyson-v15-detect-absolute", price: 749, originalPrice: null, image: "/images/products/dyson-v15.jpg", rating: 4.7, reviewCount: 89, isNew: true, brand: "Dyson" },
  { id: "3", name: "Jura E8 Platinum", slug: "jura-e8-platinum", price: 1199, originalPrice: 1299, image: "/images/products/jura-e8.jpg", rating: 4.8, reviewCount: 156, isPromo: true, brand: "Jura" },
  { id: "4", name: "Miele W1 Waschmaschine", slug: "miele-w1-waschmaschine", price: 1899, originalPrice: null, image: "/images/products/miele-w1.jpg", rating: 4.9, reviewCount: 203, isNew: false, brand: "Miele" },
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
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-5">
      {categories.map((cat, i) => (
        <Link
          key={cat.href}
          href={cat.href}
          className="group bg-white border border-[var(--color-border-light)] rounded-2xl p-6 text-center hover:border-[var(--color-primary)]/20 hover:shadow-[var(--shadow-card-hover)] transition-all duration-500 animate-fade-in-up"
          style={{ animationDelay: `${i * 60}ms` }}
        >
          <div className="w-16 h-16 mx-auto mb-4 bg-[var(--color-primary-50)] rounded-2xl flex items-center justify-center group-hover:bg-[var(--color-primary)]/10 transition-colors duration-500 overflow-hidden">
            <Image
              src={cat.image}
              alt={cat.name}
              width={40}
              height={40}
              className="w-10 h-10 object-contain group-hover:scale-110 transition-transform duration-500"
            />
          </div>
          <h3 className="font-semibold text-[var(--color-text-primary)] group-hover:text-[var(--color-primary)] transition-colors duration-300 text-sm">
            {cat.name}
          </h3>
          <p className="text-xs text-[var(--color-text-muted)] mt-1">
            {cat.count} Produkte
          </p>
        </Link>
      ))}
    </div>
  );
}

async function FeaturedProductsSection() {
  let featuredProducts;
  try {
    featuredProducts = await getFeaturedProducts();
    if (featuredProducts.length === 0) featuredProducts = fallbackProducts;
  } catch {
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
          <div className="text-center mb-14">
            <p className="caption text-[var(--color-primary)] mb-3">Sortiment</p>
            <h2 className="heading-1 mb-4">Entdecken Sie unsere Kategorien</h2>
            <p className="body-large max-w-2xl mx-auto">
              Finden Sie die perfekten Geräte für Ihr Zuhause
            </p>
          </div>
          <Suspense fallback={<CategoriesSkeleton />}>
            <CategoriesSection />
          </Suspense>
        </div>
      </section>

      <section className="section-py bg-white">
        <div className="container-hauselio">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="caption text-[var(--color-primary)] mb-3">Highlights</p>
              <h2 className="heading-1">Beliebte Produkte</h2>
              <p className="body-large mt-2">
                Unsere meistverkauften Haushaltsgeräte
              </p>
            </div>
            <Link
              href="/shop"
              className="hidden md:flex items-center gap-2 text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] font-semibold transition-colors duration-300 text-sm"
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
      <CustomerReviewsSection />
      <NewsletterSection />
    </div>
  );
}
