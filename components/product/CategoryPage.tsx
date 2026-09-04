import { Suspense } from "react";
import Link from "next/link";
import { PackageOpen, ShoppingBag, ChevronLeft, ChevronRight } from "lucide-react";
import ProductCard from "@/components/product/ProductCard";
import CategorySortSelect from "@/components/product/CategorySortSelect";
import CategoryBrandFilter from "@/components/product/CategoryBrandFilter";
import MobileShopBar from "@/components/product/MobileShopBar";
import Breadcrumb from "@/components/ui/Breadcrumb";

const PAGE_SIZE = 20;

export interface CategoryProduct {
  id: string;
  name: string;
  slug: string;
  price: number;
  originalPrice: number | null;
  rating: number;
  reviewCount: number;
  isNew: boolean;
  isPromo: boolean;
  brand: string | null;
  image: string;
  categorySlug: string;
}

export interface CategoryBrand {
  name: string;
  slug: string;
  count: number;
}

interface CategoryPageProps {
  slug: string;
  title: string;
  description: string;
  page?: number;
  sort?: string;
  brand?: string;
  sub?: string;
  products: CategoryProduct[];
  total: number;
  brands: CategoryBrand[];
  subCategories: { name: string; count: number }[];
}

export default function CategoryPage({
  slug,
  title,
  description,
  page = 1,
  sort = "newest",
  brand,
  sub,
  products,
  total,
  brands,
  subCategories,
}: CategoryPageProps) {

  const totalPages = Math.ceil(total / PAGE_SIZE);

  function pageUrl(p: number) {
    const params = new URLSearchParams();
    params.set("page", String(p));
    if (sort !== "newest") params.set("sort", sort);
    if (brand) params.set("brand", brand);
    if (sub) params.set("sub", sub);
    return `/kategorie/${slug}?${params.toString()}`;
  }

  const breadcrumbItems = [
    { label: "Kategorien", href: "/kategorie" },
    { label: title, href: `/kategorie/${slug}` },
  ];
  if (sub) {
    breadcrumbItems.push({ label: sub, href: `/kategorie/${slug}/${sub}` });
  }

  return (
    <div className="container-hausaura py-6 sm:py-8 lg:py-10">
      {/* Breadcrumb */}
      <Breadcrumb items={breadcrumbItems} />

      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="heading-1">{sub ? `${sub}` : title}</h1>
        <p className="body-large mt-2">{sub ? `${sub} in ${title}` : description}</p>
      </div>

      {/* Subcategory pills */}
      {subCategories.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          <Link
            href={`/kategorie/${slug}${brand ? `?brand=${brand}` : ""}`}
            className={`px-4 py-2.5 min-h-[44px] rounded-full text-sm font-medium transition-colors ${
              !sub
                ? "bg-[var(--color-primary)] text-white"
                : "bg-[var(--color-bg-secondary)] text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-tertiary)] hover:text-[var(--color-text-primary)]"
            }`}
          >
            Alle
          </Link>
          {subCategories.map((sc) => (
            <Link
              key={sc.name}
              href={`/kategorie/${slug}?sub=${encodeURIComponent(sc.name)}${brand ? `&brand=${brand}` : ""}`}
              className={`px-4 py-2.5 min-h-[44px] rounded-full text-sm font-medium transition-colors ${
                sub === sc.name
                  ? "bg-[var(--color-primary)] text-white"
                  : "bg-[var(--color-bg-secondary)] text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-tertiary)] hover:text-[var(--color-text-primary)]"
              }`}
            >
              {sc.name} ({sc.count})
            </Link>
          ))}
        </div>
      )}

      {/* Toolbar with sort + brand filter */}
      <Suspense fallback={<div className="h-12 bg-[var(--color-bg-secondary)] rounded-xl animate-pulse" />}>
        <div className="sticky top-20 z-30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 bg-white/95 backdrop-blur-sm rounded-xl border border-[var(--color-border-light)] px-5 py-3 shadow-sm">
          <CategoryBrandFilter brands={brands} selectedBrand={brand} slug={slug} />
          <CategorySortSelect sort={sort} slug={slug} />
        </div>
      </Suspense>

      {products.length === 0 ? (
        <div className="text-center py-20">
            <div className="w-20 h-20 rounded-full bg-[var(--color-bg-secondary)] flex items-center justify-center mx-auto mb-6">
            <PackageOpen className="w-10 h-10 text-[var(--color-border)]" />
          </div>
          <h2 className="text-lg font-bold text-[var(--color-text-primary)] mb-2">
            Keine Produkte in dieser Kategorie
          </h2>
          <p className="text-[var(--color-text-muted)] mb-6">
            {brand ? `Keine Produkte von "${brand}" in dieser Kategorie.` : sub ? `Keine Produkte in "${sub}".` : "Schauen Sie später wieder vorbei."}
          </p>
          <Link
            href={brand ? `/kategorie/${slug}` : sub ? `/kategorie/${slug}` : "/shop"}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[var(--color-primary)] text-white text-sm font-semibold rounded-xl hover:bg-[var(--color-primary-hover)] transition-colors"
          >
            <ShoppingBag className="w-4 h-4" />
            {brand ? "Alle Marken anzeigen" : sub ? "Alle Produkte anzeigen" : "Zum Shop"}
          </Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {products.map((product, i) => (
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
                {page > 1 && (
                  <Link
                    href={pageUrl(page - 1)}
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
                  } else if (page <= 4) {
                    pageNum = i + 1;
                  } else if (page >= totalPages - 3) {
                    pageNum = totalPages - 6 + i;
                  } else {
                    pageNum = page - 3 + i;
                  }
                  return pageNum;
                }).map((p) => (
                  <Link
                    key={p}
                    href={pageUrl(p)}
                    aria-current={p === page ? "page" : undefined}
                    className={`min-w-[44px] min-h-[44px] flex items-center justify-center text-sm rounded-xl font-medium transition-colors duration-200 ${
                      p === page
                        ? "bg-[var(--color-primary)] text-white shadow-md shadow-[var(--color-primary)]/15"
                        : "text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)] hover:text-[var(--color-text-primary)]"
                    }`}
                  >
                    {p}
                  </Link>
                ))}
                {page < totalPages && (
                  <Link
                    href={pageUrl(page + 1)}
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
      <MobileShopBar />
    </div>
  );
}
