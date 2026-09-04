import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { logger } from "@/lib/logger";
import Link from "next/link";
import { Plus } from "lucide-react";
import ProductTable from "@/components/admin/ProductTable";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  await requireRole("ADMIN");
  const params = await searchParams;
  const category = typeof params.category === "string" ? params.category : undefined;
  const brand = typeof params.brand === "string" ? params.brand : undefined;
  const q = typeof params.q === "string" ? params.q : undefined;
  const page = Math.max(1, parseInt(typeof params.page === "string" ? params.page : "1", 10) || 1);
  const limit = 50;
  const skip = (page - 1) * limit;

  const where: Prisma.ProductWhereInput = {};
  if (category) where.categoryId = category;
  if (brand) where.brandId = brand;
  if (q) {
    where.OR = [
      { name: { contains: q, mode: "insensitive" } },
      { slug: { contains: q, mode: "insensitive" } },
    ];
  }

  type ProductWithRelations = Prisma.ProductGetPayload<{
    select: {
      id: true;
      name: true;
      slug: true;
      price: true;
      originalPrice: true;
      category: { select: { name: true } };
      brand: { select: { name: true } };
      images: { select: { url: true } };
    };
  }>;
  let products: ProductWithRelations[] = [];
  let categories: Awaited<ReturnType<typeof prisma.category.findMany>> = [];
  let brands: Awaited<ReturnType<typeof prisma.brand.findMany>> = [];
  let total = 0;
  let dbError = false;

  try {
    [products, categories, brands, total] = await Promise.all([
      prisma.product.findMany({
        where,
        select: {
          id: true,
          name: true,
          slug: true,
          price: true,
          originalPrice: true,
          category: { select: { name: true } },
          brand: { select: { name: true } },
          images: { select: { url: true }, take: 1, orderBy: { position: "asc" } },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.category.findMany({ orderBy: { name: "asc" } }),
      prisma.brand.findMany({ orderBy: { name: "asc" } }),
      prisma.product.count({ where }),
    ]);
  } catch (error) {
    logger.error("admin/produkte: DB error", error);
    dbError = true;
  }

  const totalPages = Math.ceil(total / limit);

  return (
    <div>
      {dbError && (
        <div role="alert" className="bg-[var(--color-danger-light)] border border-[var(--color-danger)]/20 rounded-xl p-4 mb-6 text-sm text-[var(--color-text-secondary)]">
          Daten konnten nicht geladen werden. Bitte versuchen Sie es später erneut.
        </div>
      )}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">
          Produkte
        </h1>
        <Link
          href="/admin/produkte/neu"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[var(--color-accent)] text-white font-semibold rounded-xl hover:bg-[var(--color-accent-hover)] transition-colors"
        >
          <Plus className="w-4 h-4" />
          Neues Produkt
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-[var(--color-border-light)] p-4 mb-6">
        <form className="flex flex-wrap gap-3">
          <input
            type="text"
            name="q"
            defaultValue={q}
            placeholder="Suche…"
            aria-label="Produkte suchen"
            className="px-4 py-3 border border-[var(--color-border)] rounded-xl text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)]"
          />
          <select
            name="category"
            defaultValue={category}
            aria-label="Kategorie filtern"
            className="px-4 py-3 border border-[var(--color-border)] rounded-xl text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)]"
          >
            <option value="">Alle Kategorien</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          <select
            name="brand"
            defaultValue={brand}
            aria-label="Marke filtern"
            className="px-4 py-3 border border-[var(--color-border)] rounded-xl text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)]"
          >
            <option value="">Alle Marken</option>
            {brands.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="px-4 py-3 bg-[var(--color-primary)] text-white rounded-xl text-sm font-medium hover:bg-[var(--color-primary-hover)] transition-colors"
          >
            Filtern
          </button>
          {(category || brand || q) && (
            <Link
              href="/admin/produkte"
              className="px-4 py-3 border border-[var(--color-border)] rounded-xl text-sm font-medium text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)] transition-colors"
            >
              Filter zurücksetzen
            </Link>
          )}
        </form>
      </div>

      {/* Products Table */}
      <ProductTable
        products={products.map((p) => ({
          ...p,
          price: Number(p.price),
          originalPrice: p.originalPrice ? Number(p.originalPrice) : null,
          brand: p.brand ? { name: p.brand.name } : null,
          images: p.images.map((img: { url: string }) => ({ url: img.url })),
        }))}
        total={total}
        totalPages={totalPages}
        page={page}
        category={category}
        brand={brand}
        q={q}
      />
    </div>
  );
}
