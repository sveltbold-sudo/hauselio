import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import dynamicImport from "next/dynamic";
import { SearchX, ShoppingBag, ChevronLeft, ChevronRight, X } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import ProductCard from "@/components/product/ProductCard";
import ShopSortSelect from "@/components/product/ShopSortSelect";
import MobileShopBar from "@/components/product/MobileShopBar";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { SITE_URL } from "@/lib/constants";
import { logger } from "@/lib/logger";

const ShopFilterDrawer = dynamicImport(() => import("@/components/product/ShopFilterDrawer"));

export const revalidate = 300;

function shopUrl(page: number, category?: string, brand?: string, q?: string, sort?: string, price?: string, promo?: string) {
  const params = new URLSearchParams();
  params.set("page", String(page));
  if (category) params.set("category", category);
  if (brand) params.set("brand", brand);
  if (q) params.set("q", q);
  if (sort && sort !== "newest") params.set("sort", sort);
  if (price) params.set("price", price);
  if (promo) params.set("promo", promo);
  return `/shop?${params.toString()}`;
}

export async function generateMetadata({ searchParams }: ShopPageProps): Promise<Metadata> {
  const params = await searchParams;
  const category = params.category;
  const brand = params.brand;
  const q = params.q;
  const baseUrl = SITE_URL;

  let title = "Alle Produkte";
  let desc = "Entdecken Sie unser gesamtes Sortiment an Haushaltsgeräten";

  if (q) {
    title = `Suche "${q}"`;
    desc = `Suchergebnisse für "${q}" bei HAUSELIO`;
  } else if (category) {
    title = `${category.charAt(0).toUpperCase() + category.slice(1)} kaufen`;
    desc = `Hochwertige ${category} bei HAUSELIO entdecken`;
  } else if (brand) {
    title = `${brand} Produkte`;
    desc = `Alle ${brand} Produkte bei HAUSELIO`;
  }

  const searchParamsObj = new URLSearchParams();
  if (category) searchParamsObj.set("category", category);
  if (brand) searchParamsObj.set("brand", brand);
  if (q) searchParamsObj.set("q", q);
  const queryString = searchParamsObj.toString();
  const canonical = `${baseUrl}/shop${queryString ? `?${queryString}` : ""}`;

  return {
    title,
    description: desc,
    alternates: { canonical },
    openGraph: {
      title,
      description: desc,
      url: canonical,
      siteName: "HAUSELIO",
      locale: "de_DE",
      type: "website",
      images: [{ url: `${SITE_URL}/logos/logoprincipale.png`, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: desc,
      images: [`${SITE_URL}/logos/logoprincipale.png`],
    },
  };
}

interface ShopPageProps {
  searchParams: Promise<{
    category?: string;
    brand?: string;
    sort?: string;
    page?: string;
    q?: string;
    price?: string;
    promo?: string;
  }>;
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const params = await searchParams;
  const category = params.category;
  const brand = params.brand;
  const q = params.q;
  const price = params.price;
  const sort = params.sort || "newest";
  const page = Math.max(1, parseInt(params.page || "1") || 1);
  const limit = 20;
  const skip = (page - 1) * limit;

  const where: Prisma.ProductWhereInput = {};
  const promo = params.promo;
  if (promo === "true") {
    where.isPromo = true;
  }
  if (category) {
    where.category = { slug: category };
  }
  if (brand) {
    where.brand = { name: brand };
  }
  if (q) {
    where.OR = [
      { name: { contains: q, mode: "insensitive" } },
      { description: { contains: q, mode: "insensitive" } },
      { brand: { name: { contains: q, mode: "insensitive" } } },
    ];
  }
  if (price) {
    const parts = price.split("-");
    const minVal = parts[0] ? Number(parts[0]) : undefined;
    const maxVal = parts[1] ? Number(parts[1]) : undefined;
    const priceFilter: { gte?: number; lte?: number } = {};
    if (minVal !== undefined && !isNaN(minVal)) {
      priceFilter.gte = minVal;
    }
    if (maxVal !== undefined && !isNaN(maxVal)) {
      priceFilter.lte = maxVal;
    }
    if (Object.keys(priceFilter).length > 0) {
      where.price = priceFilter;
    }
  }

  let orderBy: Prisma.ProductOrderByWithRelationInput = { createdAt: "desc" };
  if (sort === "price_asc") orderBy = { price: "asc" };
  if (sort === "price_desc") orderBy = { price: "desc" };
  if (sort === "rating") orderBy = { rating: "desc" };

  type ProductWithRelations = Prisma.ProductGetPayload<{
    include: { category: true; brand: true; images: { take: 1; orderBy: { position: "asc" } } };
  }>;
  let products: ProductWithRelations[] = [];
  let categories: Awaited<ReturnType<typeof prisma.category.findMany>> = [];
  let brands: Awaited<ReturnType<typeof prisma.brand.findMany>> = [];
  let total = 0;

  try {
    const [productsResult, categoriesResult, brandsResult, totalResult] = await Promise.allSettled([
      prisma.product.findMany({
        where,
        include: {
          category: true,
          brand: true,
          images: { take: 1, orderBy: { position: "asc" } },
        },
        orderBy,
        skip,
        take: limit,
      }),
      prisma.category.findMany({ orderBy: { name: "asc" } }),
      prisma.brand.findMany({ orderBy: { name: "asc" } }),
      prisma.product.count({ where }),
    ]);

    products = productsResult.status === "fulfilled" ? productsResult.value : [];
    categories = categoriesResult.status === "fulfilled" ? categoriesResult.value : [];
    brands = brandsResult.status === "fulfilled" ? brandsResult.value : [];
    total = totalResult.status === "fulfilled" ? totalResult.value : 0;

    if (productsResult.status === "rejected") logger.error("shop-products", productsResult.reason);
    if (categoriesResult.status === "rejected") logger.error("shop-categories", categoriesResult.reason);
    if (brandsResult.status === "rejected") logger.error("shop-brands", brandsResult.reason);
    if (totalResult.status === "rejected") logger.error("shop-count", totalResult.reason);
  } catch (error) {
    logger.error("shop-page", error);
  }

  const totalPages = Math.ceil(total / limit);

  const formattedProducts = products.map((product) => ({
    id: product.id,
    name: product.name,
    slug: product.slug,
    price: Number(product.price),
    originalPrice: product.originalPrice
      ? Number(product.originalPrice)
      : null,
    image: product.images[0]?.url || "/images/placeholder-product.svg",
    rating: Number(product.rating),
    reviewCount: product.reviewCount,
    isNew: product.isNew,
    inStock: product.inStock,
    isPromo: product.isPromo,
    brand: product.brand?.name || null,
  }));

  return (
    <main id="shop-content" className="container-hauselio py-6 sm:py-8">
      {/* ItemList JSON-LD for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: "HAUSELIO Shop",
            url: `${SITE_URL}/shop`,
            itemListElement: formattedProducts.slice(0, 20).map((p, i) => ({
              "@type": "ListItem",
              position: i + 1,
              item: {
                "@type": "Product",
                name: p.name,
                image: p.image,
                url: `${SITE_URL}/produkt/${p.slug}`,
                offers: {
                  "@type": "Offer",
                  price: p.price.toFixed(2),
                  priceCurrency: "EUR",
                  availability: p.inStock !== false
                    ? "https://schema.org/InStock"
                    : "https://schema.org/OutOfStock",
                },
              },
            })),
          }),
        }}
      />
      {/* Breadcrumb */}
      <Breadcrumb items={[{ label: "Shop" }]} />

      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <p className="caption text-[var(--color-accent)] mb-3">Sortiment</p>
        <h1 className="heading-1">
          {q ? `Suchergebnisse für "${q}"` : "Alle Produkte"}
        </h1>
        <p className="body-large mt-2">
          {q
            ? `${total} Ergebnisse für Ihre Suche`
            : "Entdecken Sie unser gesamtes Sortiment an Haushaltsgeräten"}
        </p>
      </div>

      {/* Free shipping banner */}
      <div className="mb-6 px-4 py-2.5 bg-[var(--color-success)]/10 border border-[var(--color-success)]/20 rounded-xl text-center">
        <p className="text-sm text-[var(--color-text-secondary)]">
          <span className="font-semibold text-[var(--color-success)]">Kostenloser Versand</span> ab 50€ Bestellwert
        </p>
      </div>

      {/* Category tabs — visual cards */}
      <div className="mb-6 sm:mb-8">
        <nav aria-label="Kategorien" className="flex flex-nowrap sm:flex-wrap overflow-x-auto scrollbar-hide gap-2 sm:gap-3">
          <Link
            href={q ? `/shop?q=${encodeURIComponent(q)}` : "/shop"}
            aria-pressed={!category}
              className={`flex items-center gap-2.5 px-5 py-3 rounded-xl text-sm font-semibold transition-colors transition-shadow duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 ${
              !category
                ? "bg-[var(--color-primary)] text-white shadow-lg shadow-[var(--color-primary)]/20"
                : "bg-white border border-[var(--color-border-light)] text-[var(--color-text-secondary)] hover:border-[var(--color-primary)]/30 hover:text-[var(--color-primary)] hover:shadow-sm"
            }`}
          >
            Alle Produkte
          </Link>
          <Link
            href={`/shop?promo=true${category ? `&category=${encodeURIComponent(category)}` : ""}${brand ? `&brand=${encodeURIComponent(brand)}` : ""}${q ? `&q=${encodeURIComponent(q)}` : ""}`}
            aria-pressed={promo === "true"}
            className={`flex items-center gap-2.5 px-5 py-3 rounded-xl text-sm font-semibold transition-colors transition-shadow duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 ${
              promo === "true"
                ? "bg-[var(--color-danger)] text-white shadow-lg shadow-[var(--color-danger)]/20"
                : "bg-white border border-[var(--color-border-light)] text-[var(--color-text-secondary)] hover:border-[var(--color-danger)]/30 hover:text-[var(--color-danger)] hover:shadow-sm"
            }`}
          >
            Angebote
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/shop?category=${cat.slug}${q ? `&q=${encodeURIComponent(q)}` : ""}`}
              aria-pressed={category === cat.slug}
            className={`flex items-center gap-2.5 px-5 py-3 rounded-xl text-sm font-semibold transition-colors transition-shadow duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 ${
                category === cat.slug
                  ? "bg-[var(--color-primary)] text-white shadow-lg shadow-[var(--color-primary)]/20"
                  : "bg-white border border-[var(--color-border-light)] text-[var(--color-text-secondary)] hover:border-[var(--color-primary)]/30 hover:text-[var(--color-primary)] hover:shadow-sm"
              }`}
            >
              {cat.name}
            </Link>
          ))}
        </nav>
      </div>

      {/* Active filter chips */}
      {(category || brand || promo === "true" || q) && (
        <div className="mb-4 sm:mb-6 flex flex-wrap gap-2">
          {category && (
            <Link
              href={q ? `/shop?q=${encodeURIComponent(q)}` : "/shop"}
              className="inline-flex items-center gap-1.5 px-3 py-2.5 min-h-[44px] bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-sm font-medium rounded-lg hover:bg-[var(--color-primary)]/20 transition-colors"
            >
              {categories.find((c) => c.slug === category)?.name || category}
              <X className="w-3.5 h-3.5" aria-hidden="true" />
            </Link>
          )}
          {brand && (
            <Link
              href={category ? `/shop?category=${category}${q ? `&q=${encodeURIComponent(q)}` : ""}` : q ? `/shop?q=${encodeURIComponent(q)}` : "/shop"}
              className="inline-flex items-center gap-1.5 px-3 py-2.5 min-h-[44px] bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-sm font-medium rounded-lg hover:bg-[var(--color-primary)]/20 transition-colors"
            >
              {brand}
              <X className="w-3.5 h-3.5" aria-hidden="true" />
            </Link>
          )}
          {promo === "true" && (
            <Link
              href={q ? `/shop?q=${encodeURIComponent(q)}` : "/shop"}
              className="inline-flex items-center gap-1.5 px-3 py-2.5 min-h-[44px] bg-[var(--color-danger)]/10 text-[var(--color-danger)] text-sm font-medium rounded-lg hover:bg-[var(--color-danger)]/20 transition-colors"
            >
              Angebote
              <X className="w-3.5 h-3.5" aria-hidden="true" />
            </Link>
          )}
          {q && (
            <Link
              href={category ? `/shop?category=${category}` : "/shop"}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[var(--color-text-muted)]/10 text-[var(--color-text-muted)] text-sm font-medium rounded-lg hover:bg-[var(--color-text-muted)]/20 transition-colors"
            >
              Suche: {q}
              <X className="w-3.5 h-3.5" aria-hidden="true" />
            </Link>
          )}
          <Link
            href="/shop"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[var(--color-text-muted)] text-sm font-medium rounded-lg hover:bg-[var(--color-text-muted)]/10 transition-colors"
          >
            Alle entfernen
          </Link>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar filters — desktop inline / mobile drawer */}
        <ShopFilterDrawer
          categories={categories.map((c) => ({
            name: c.name,
            slug: c.slug,
          }))}
          brands={brands.map((b) => b.name)}
          selectedCategory={category}
          selectedBrand={brand}
        />

        {/* Product grid */}
        <div className="flex-1 min-w-0">
          {/* Toolbar */}
          <div className="flex items-center justify-between mb-4 sm:mb-6 bg-white rounded-xl border border-[var(--color-border-light)] px-4 sm:px-5 py-3">
            <p className="text-sm text-[var(--color-text-secondary)]">
              <span className="font-bold text-[var(--color-text-primary)]">{total}</span> {total === 1 ? "Produkt" : "Produkte"}
              {category && (
                <span className="text-[var(--color-text-muted)] ml-1">
                  in {categories.find((c) => c.slug === category)?.name || category}
                </span>
              )}
            </p>
            <div className="flex items-center gap-3">
              <ShopSortSelect sort={sort} />
            </div>
          </div>

          {/* Products grid */}
          <Suspense fallback={<ProductGridSkeleton />}>
            {formattedProducts.length === 0 ? (
              <div className="text-center py-20" role="status" aria-live="polite">
                <div className="w-20 h-20 rounded-full bg-[var(--color-bg-secondary)] flex items-center justify-center mx-auto mb-6">
                  <SearchX className="w-10 h-10 text-[var(--color-text-muted)]" aria-hidden="true" />
                </div>
                <h2 className="heading-3 mb-2">
                  Keine Produkte gefunden
                </h2>
                <p className="text-[var(--color-text-muted)] mb-6 max-w-sm mx-auto">
                  Versuchen Sie, Ihre Filter anzupassen oder durchsuchen Sie unser gesamtes Sortiment.
                </p>
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-[var(--color-primary)] text-white text-sm font-semibold rounded-xl hover:bg-[var(--color-primary-hover)] transition-colors"
                >
                  <ShoppingBag className="w-4 h-4" aria-hidden="true" />
                  Alle Produkte ansehen
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {formattedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </Suspense>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-10">
              <p className="text-center text-sm text-[var(--color-text-muted)] mb-4">
                Ergebnisse {((page - 1) * 20) + 1}–{Math.min(page * 20, total)} von {total}
              </p>
              <div className="flex justify-center">
                <nav aria-label="Seitennavigation" className="flex items-center gap-1.5 flex-nowrap overflow-x-auto scrollbar-hide justify-center">
                  {page > 1 && (
                    <Link
                      href={shopUrl(page - 1, category, brand, q, sort, price, promo)}
                      className="px-4 py-2.5 min-h-[44px] text-sm rounded-xl font-medium text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)] hover:text-[var(--color-text-primary)] transition-colors duration-200 flex items-center gap-1"
                      aria-label="Vorherige Seite"
                    >
                      <ChevronLeft className="w-4 h-4" aria-hidden="true" />
                      Zurück
                    </Link>
                  )}
                  {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                    let p: number;
                    if (totalPages <= 7) {
                      p = i + 1;
                    } else if (page <= 4) {
                      p = i + 1;
                    } else if (page >= totalPages - 3) {
                      p = totalPages - 6 + i;
                    } else {
                      p = page - 3 + i;
                    }
                    return (
                      <Link
                        key={p}
                        href={shopUrl(p, category, brand, q, sort, price, promo)}
                        aria-current={p === page ? "page" : undefined}
                        className={`min-w-[44px] min-h-[44px] flex items-center justify-center text-sm rounded-xl font-medium transition-colors duration-200 ${
                          p === page
                            ? "bg-[var(--color-primary)] text-white shadow-md shadow-[var(--color-primary)]/15"
                            : "text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)] hover:text-[var(--color-text-primary)]"
                        }`}
                      >
                        {p}
                      </Link>
                    );
                  })}
                  {page < totalPages && (
                    <Link
                      href={shopUrl(page + 1, category, brand, q, sort, price, promo)}
                      className="px-4 py-2.5 min-h-[44px] text-sm rounded-xl font-medium text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)] hover:text-[var(--color-text-primary)] transition-colors duration-200 flex items-center gap-1"
                      aria-label="Nächste Seite"
                    >
                      Weiter
                      <ChevronRight className="w-4 h-4" aria-hidden="true" />
                    </Link>
                  )}
                </nav>
              </div>
            </div>
          )}
        </div>
      </div>
      <MobileShopBar totalProducts={total} />
    </main>
  );
}

function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5" aria-hidden="true">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="bg-white rounded-2xl border border-[var(--color-border-light)] overflow-hidden animate-pulse">
          <div className="aspect-square bg-[var(--color-bg-secondary)]" />
          <div className="p-4 space-y-3">
            <div className="h-3 bg-[var(--color-bg-secondary)] rounded w-1/3" />
            <div className="h-4 bg-[var(--color-bg-secondary)] rounded w-3/4" />
            <div className="h-3 bg-[var(--color-bg-secondary)] rounded w-1/2" />
            <div className="h-5 bg-[var(--color-bg-secondary)] rounded w-1/4" />
          </div>
        </div>
      ))}
    </div>
  );
}
