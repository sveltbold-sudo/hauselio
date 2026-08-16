import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { SearchX, ShoppingBag, ChevronLeft, ChevronRight } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import ProductCard from "@/components/product/ProductCard";

const ShopFilterDrawer = dynamic(() => import("@/components/product/ShopFilterDrawer"));

export const revalidate = 300;

export async function generateMetadata({ searchParams }: ShopPageProps): Promise<Metadata> {
  const params = await searchParams;
  const category = params.category;
  const brand = params.brand;
  const q = params.q;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://hauselio.de";

  let title = "Boutique";
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
  }>;
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const params = await searchParams;
  const category = params.category;
  const brand = params.brand;
  const q = params.q;
  const sort = params.sort || "newest";
  const page = Math.max(1, parseInt(params.page || "1") || 1);
  const limit = 20;
  const skip = (page - 1) * limit;

  const where: Prisma.ProductWhereInput = {};
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

  let orderBy: Prisma.ProductOrderByWithRelationInput = { createdAt: "desc" };
  if (sort === "price_asc") orderBy = { price: "asc" };
  if (sort === "price_desc") orderBy = { price: "desc" };
  if (sort === "rating") orderBy = { rating: "desc" };

  const [products, categories, brands, total] = await Promise.all([
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
    isPromo: product.isPromo,
    brand: product.brand?.name || null,
  }));

  return (
    <div className="container-hauselio py-8">
      {/* Header */}
      <div className="mb-10">
        <p className="caption text-[var(--color-primary)] mb-3">Sortiment</p>
        <h1 className="heading-1">
          {q ? `Suchergebnisse für "${q}"` : "Boutique"}
        </h1>
        <p className="body-large mt-2">
          {q
            ? `${total} Ergebnisse für Ihre Suche`
            : "Entdecken Sie unser gesamtes Sortiment an Haushaltsgeräten"}
        </p>
      </div>

      {/* Category tabs */}
      <div className="flex flex-wrap gap-2 mb-8">
        <Link
          href={q ? `/shop?q=${encodeURIComponent(q)}` : "/shop"}
          aria-current={!category ? "page" : undefined}
          className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
            !category
              ? "bg-[var(--color-primary)] text-white shadow-lg shadow-blue-500/20"
              : "bg-white border border-[var(--color-border-light)] text-[var(--color-text-secondary)] hover:border-[var(--color-border)] hover:text-[var(--color-text-primary)]"
          }`}
        >
          Alle
        </Link>
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/shop?category=${cat.slug}${q ? `&q=${encodeURIComponent(q)}` : ""}`}
            aria-current={category === cat.slug ? "page" : undefined}
            className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
              category === cat.slug
                ? "bg-[var(--color-primary)] text-white shadow-lg shadow-blue-500/20"
                : "bg-white border border-[var(--color-border-light)] text-[var(--color-text-secondary)] hover:border-[var(--color-border)] hover:text-[var(--color-text-primary)]"
            }`}
          >
            {cat.name}
          </Link>
        ))}
      </div>

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
          selectedSort={sort}
        />

        {/* Product grid */}
        <div className="flex-1">
          {/* Toolbar */}
          <div className="flex items-center justify-between mb-6 bg-white rounded-xl border border-[var(--color-border-light)] px-5 py-3.5">
            <p className="text-sm text-[var(--color-text-secondary)]">
              <span className="font-bold text-[var(--color-text-primary)]">{total}</span> Produkte
            </p>
          </div>

          {/* Products grid */}
          <Suspense fallback={<ProductGridSkeleton />}>
            {formattedProducts.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-6">
                  <SearchX className="w-10 h-10 text-gray-300" />
                </div>
                <h2 className="text-lg font-bold text-[var(--color-text-primary)] mb-2">
                  Keine Produkte gefunden
                </h2>
                <p className="text-[var(--color-text-muted)] mb-6">
                  Versuchen Sie, Ihre Filter anzupassen oder durchsuchen Sie unser gesamtes Sortiment.
                </p>
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-[var(--color-primary)] text-white text-sm font-semibold rounded-xl hover:bg-[var(--color-primary-hover)] transition-colors"
                >
                  <ShoppingBag className="w-4 h-4" />
                  Alle Produkte ansehen
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {formattedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </Suspense>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-10 flex justify-center">
              <nav aria-label="Seitennavigation" className="flex items-center gap-1 flex-wrap justify-center">
                {page > 1 && (
                  <Link
                    href={`/shop?page=${page - 1}${category ? `&category=${category}` : ""}${brand ? `&brand=${brand}` : ""}${q ? `&q=${encodeURIComponent(q)}` : ""}${sort !== "newest" ? `&sort=${sort}` : ""}`}
                    className="px-3 py-2.5 text-sm rounded-xl font-medium text-[var(--color-text-secondary)] hover:bg-gray-100 transition-all duration-300 flex items-center gap-1"
                    aria-label="Vorherige Seite"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Link>
                )}
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (p) => (
                    <Link
                      key={p}
                      href={`/shop?page=${p}${category ? `&category=${category}` : ""}${brand ? `&brand=${brand}` : ""}${q ? `&q=${encodeURIComponent(q)}` : ""}${sort !== "newest" ? `&sort=${sort}` : ""}`}
                      aria-current={p === page ? "page" : undefined}
                      className={`px-3.5 py-2.5 text-sm rounded-xl font-medium transition-all duration-300 ${
                        p === page
                          ? "bg-[var(--color-primary)] text-white shadow-lg shadow-blue-500/20"
                          : "text-[var(--color-text-secondary)] hover:bg-gray-100"
                      }`}
                    >
                      {p}
                    </Link>
                  )
                )}
                {page < totalPages && (
                  <Link
                    href={`/shop?page=${page + 1}${category ? `&category=${category}` : ""}${brand ? `&brand=${brand}` : ""}${q ? `&q=${encodeURIComponent(q)}` : ""}${sort !== "newest" ? `&sort=${sort}` : ""}`}
                    className="px-3 py-2.5 text-sm rounded-xl font-medium text-[var(--color-text-secondary)] hover:bg-gray-100 transition-all duration-300 flex items-center gap-1"
                    aria-label="Nächste Seite"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                )}
              </nav>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="bg-white rounded-2xl border border-[var(--color-border-light)] overflow-hidden animate-pulse">
          <div className="aspect-square bg-gray-100" />
          <div className="p-5 space-y-3">
            <div className="h-3 bg-gray-100 rounded w-1/3" />
            <div className="h-4 bg-gray-100 rounded w-3/4" />
            <div className="h-3 bg-gray-100 rounded w-1/2" />
            <div className="h-5 bg-gray-100 rounded w-1/4" />
          </div>
        </div>
      ))}
    </div>
  );
}
