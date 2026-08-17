import Link from "next/link";
import { PackageOpen, ShoppingBag, ChevronLeft, ChevronRight } from "lucide-react";
import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/product/ProductCard";

const PAGE_SIZE = 20;

interface CategoryPageProps {
  slug: string;
  title: string;
  description: string;
  page?: number;
}

export default async function CategoryPage({
  slug,
  title,
  description,
  page = 1,
}: CategoryPageProps) {

  const currentPage = Math.max(1, page);
  const skip = (currentPage - 1) * PAGE_SIZE;

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
    brand: { name: string } | null;
    images: { url: string }[];
  }[] = [];
  let total = 0;

  try {
    const [raw, count] = await Promise.all([
      prisma.product.findMany({
        where: { category: { slug } },
        include: {
          brand: { select: { name: true } },
          images: { take: 1, orderBy: { position: "asc" } },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: PAGE_SIZE,
      }),
      prisma.product.count({ where: { category: { slug } } }),
    ]);
    total = count;
    products = raw.map((p) => ({
      ...p,
      price: Number(p.price),
      originalPrice: p.originalPrice ? Number(p.originalPrice) : null,
      rating: Number(p.rating),
    }));
  } catch {
    products = [];
    total = 0;
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
    return `/kategorie/${slug}?page=${p}`;
  }

  return (
    <div className="container-hauselio py-8">
      {/* Header */}
      <div className="mb-10">
        <p className="caption text-[var(--color-primary)] mb-3">Sortiment</p>
        <h1 className="heading-1">{title}</h1>
        <p className="body-large mt-2">{description}</p>
      </div>

      {formattedProducts.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-6">
            <PackageOpen className="w-10 h-10 text-gray-300" />
          </div>
          <h2 className="text-lg font-bold text-[var(--color-text-primary)] mb-2">
            Keine Produkte in dieser Kategorie
          </h2>
          <p className="text-[var(--color-text-muted)] mb-6">
            Schauen Sie später wieder vorbei oder entdecken Sie unser gesamtes Sortiment.
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[var(--color-primary)] text-white text-sm font-semibold rounded-xl hover:bg-[var(--color-primary-hover)] transition-colors"
          >
            <ShoppingBag className="w-4 h-4" />
            Zur Boutique
          </Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {formattedProducts.map((product, i) => (
              <div
                key={product.id}
                className="animate-fade-in-up"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <nav className="flex items-center justify-between mt-12 pt-8 border-t border-[var(--color-border-light)]" aria-label="Seitennavigation">
              <p className="text-sm text-[var(--color-text-muted)]">
                {total} Produkte — Seite {currentPage} von {totalPages}
              </p>
              <div className="flex gap-1">
                {currentPage > 1 && (
                  <Link
                    href={pageUrl(currentPage - 1)}
                    className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium text-[var(--color-text-secondary)] hover:bg-gray-100 transition-colors"
                    aria-label="Vorherige Seite"
                  >
                    <ChevronLeft className="w-4 h-4" />
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
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      p === currentPage
                        ? "bg-[var(--color-primary)] text-white"
                        : "text-[var(--color-text-secondary)] hover:bg-gray-100"
                    }`}
                  >
                    {p}
                  </Link>
                ))}
                {currentPage < totalPages && (
                  <Link
                    href={pageUrl(currentPage + 1)}
                    className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium text-[var(--color-text-secondary)] hover:bg-gray-100 transition-colors"
                    aria-label="Nächste Seite"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                )}
              </div>
            </nav>
          )}
        </>
      )}
    </div>
  );
}
