import { Suspense } from "react";
import Link from "next/link";
import { PackageOpen, ShoppingBag, ChevronLeft, ChevronRight } from "lucide-react";
import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/product/ProductCard";
import CategorySortSelect from "@/components/product/CategorySortSelect";
import CategoryBrandFilter from "@/components/product/CategoryBrandFilter";
import MobileShopBar from "@/components/product/MobileShopBar";
import Breadcrumb from "@/components/ui/Breadcrumb";

const PAGE_SIZE = 20;

interface CategoryPageProps {
  slug: string;
  title: string;
  description: string;
  page?: number;
  sort?: string;
  brand?: string;
}

export default async function CategoryPage({
  slug,
  title,
  description,
  page = 1,
  sort = "newest",
  brand,
}: CategoryPageProps) {
  const currentPage = Math.max(1, page);
  const skip = (currentPage - 1) * PAGE_SIZE;

  let orderBy: Record<string, string> = { createdAt: "desc" };
  if (sort === "price_asc") orderBy = { price: "asc" };
  else if (sort === "price_desc") orderBy = { price: "desc" };
  else if (sort === "rating") orderBy = { rating: "desc" };
  else if (sort === "popular") orderBy = { reviewCount: "desc" };

  const where: Record<string, unknown> = { category: { slug } };
  if (brand) {
    where.brand = { slug: brand };
  }

  let products: {
    id: string;
    name: string;
    slug: string;
    price: number;
    originalPrice: number | null;
    rating: number;
    reviewCount: number;
    isNew: boolean;
    isPromo: boolean;
    brand: { name: string; slug: string } | null;
    images: { url: string }[];
  }[] = [];
  let total = 0;
  let brands: { name: string; slug: string; count: number }[] = [];

  try {
    const [raw, count, brandData] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          brand: { select: { name: true, slug: true } },
          images: { take: 1, orderBy: { position: "asc" } },
        },
        orderBy,
        skip,
        take: PAGE_SIZE,
      }),
      prisma.product.count({ where }),
      prisma.brand.findMany({
        select: {
          name: true,
          slug: true,
          _count: { select: { products: { where: { category: { slug } } } } },
        },
        where: { products: { some: { category: { slug } } } },
        orderBy: { name: "asc" },
      }),
    ]);
    total = count;
    products = raw.map((p) => ({
      ...p,
      price: Number(p.price),
      originalPrice: p.originalPrice ? Number(p.originalPrice) : null,
      rating: Number(p.rating),
    }));
    brands = brandData.map((b) => ({
      name: b.name,
      slug: b.slug,
      count: b._count.products,
    }));
  } catch {
    products = [];
    total = 0;
    brands = [];
  }

  const totalPages = Math.ceil(total / PAGE_SIZE);

  const formattedProducts = products.map((product) => ({
    id: product.id,
    name: product.name,
    slug: product.slug,
    price: product.price,
    originalPrice: product.originalPrice,
    image: product.images[0]?.url || "/images/placeholder-product.svg",
    rating: product.rating,
    reviewCount: product.reviewCount,
    isNew: product.isNew,
    isPromo: product.isPromo,
    brand: product.brand?.name || null,
  }));

  function pageUrl(p: number) {
    const params = new URLSearchParams();
    params.set("page", String(p));
    if (sort !== "newest") params.set("sort", sort);
    if (brand) params.set("brand", brand);
    return `/kategorie/${slug}?${params.toString()}`;
  }

  return (
    <div className="container-hauselio py-8">
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          { label: "Kategorien", href: "/kategorie" },
          { label: title },
        ]}
      />

      {/* Header */}
      <div className="mb-8">
        <h1 className="heading-1">{title}</h1>
        <p className="body-large mt-2">{description}</p>
        <p className="text-sm text-[var(--color-text-muted)] mt-2">
          {total} {total === 1 ? "Produkt" : "Produkte"} in dieser Kategorie
        </p>
      </div>

      {/* Toolbar with sort + brand filter */}
      <Suspense fallback={<div className="h-12 bg-[var(--color-bg-secondary)] rounded-xl animate-pulse" />}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 bg-white rounded-xl border border-[var(--color-border-light)] px-5 py-3">
          <CategoryBrandFilter brands={brands} selectedBrand={brand} slug={slug} />
          <CategorySortSelect sort={sort} slug={slug} />
        </div>
      </Suspense>

      {formattedProducts.length === 0 ? (
        <div className="text-center py-20">
            <div className="w-20 h-20 rounded-full bg-[var(--color-bg-secondary)] flex items-center justify-center mx-auto mb-6">
            <PackageOpen className="w-10 h-10 text-[var(--color-border)]" />
          </div>
          <h2 className="text-lg font-bold text-[var(--color-text-primary)] mb-2">
            Keine Produkte in dieser Kategorie
          </h2>
          <p className="text-[var(--color-text-muted)] mb-6">
            {brand ? `Keine Produkte von "${brand}" in dieser Kategorie.` : "Schauen Sie später wieder vorbei."}
          </p>
          <Link
            href={brand ? `/kategorie/${slug}` : "/shop"}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[var(--color-primary)] text-white text-sm font-semibold rounded-xl hover:bg-[var(--color-primary-hover)] transition-colors"
          >
            <ShoppingBag className="w-4 h-4" />
            {brand ? "Alle Marken anzeigen" : "Zum Shop"}
          </Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {formattedProducts.map((product, i) => (
              <div
                key={product.id}
                className="animate-fade-in-up"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-10 flex justify-center">
              <nav className="flex items-center gap-1.5 flex-wrap justify-center" aria-label="Seitennavigation">
                {currentPage > 1 && (
                  <Link
                    href={pageUrl(currentPage - 1)}
                    className="px-4 py-2.5 text-sm rounded-xl font-medium text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)] hover:text-[var(--color-text-primary)] transition-colors duration-200 flex items-center gap-1"
                    aria-label="Vorherige Seite"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Zurück
                  </Link>
                )}
                {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                  let pageNum: number;
                  if (totalPages <= 7) {
                    pageNum = i + 1;
                  } else if (currentPage <= 4) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 3) {
                    pageNum = totalPages - 6 + i;
                  } else {
                    pageNum = currentPage - 3 + i;
                  }
                  return pageNum;
                }).map((p) => (
                  <Link
                    key={p}
                    href={pageUrl(p)}
                    aria-current={p === currentPage ? "page" : undefined}
                    className={`min-w-[40px] h-10 flex items-center justify-center text-sm rounded-xl font-medium transition-colors duration-200 ${
                      p === currentPage
                        ? "bg-[var(--color-primary)] text-white shadow-md shadow-[var(--color-primary)]/15"
                        : "text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)] hover:text-[var(--color-text-primary)]"
                    }`}
                  >
                    {p}
                  </Link>
                ))}
                {currentPage < totalPages && (
                  <Link
                    href={pageUrl(currentPage + 1)}
                    className="px-4 py-2.5 text-sm rounded-xl font-medium text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)] hover:text-[var(--color-text-primary)] transition-colors duration-200 flex items-center gap-1"
                    aria-label="Nächste Seite"
                  >
                    Weiter
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                )}
              </nav>
            </div>
          )}
        </>
      )}
      <MobileShopBar totalProducts={total} />
    </div>
  );
}
