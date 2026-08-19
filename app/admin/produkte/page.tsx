import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
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
    include: { category: true; brand: true; images: { take: 1; orderBy: { position: "asc" } } };
  }>;
  let products: ProductWithRelations[] = [];
  let categories: Awaited<ReturnType<typeof prisma.category.findMany>> = [];
  let brands: Awaited<ReturnType<typeof prisma.brand.findMany>> = [];
  let total = 0;

  try {
    [products, categories, brands, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: true,
          brand: true,
          images: { take: 1, orderBy: { position: "asc" } },
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
    console.error("[HAUSELIO] DB error in admin/produkte:", error);
  }

  const totalPages = Math.ceil(total / limit);
  const dbError = products.length === 0 && total === 0;

  return (
    <div>
      {dbError && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 text-sm text-red-700">
          Daten konnten nicht geladen werden. Bitte versuchen Sie es später erneut.
        </div>
      )}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">
          Produkte
        </h1>
        <Link
          href="/admin/produkte/neu"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[var(--color-orange)] text-white font-semibold rounded-xl hover:bg-[var(--color-orange-hover)] transition-colors"
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
            placeholder="Suche..."
            aria-label="Produkte suchen"
            className="px-4 py-2 border border-[var(--color-border)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/20 focus:border-[var(--color-accent)]"
          />
          <select
            name="category"
            defaultValue={category}
            aria-label="Kategorie filtern"
            className="px-4 py-2 border border-[var(--color-border)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/20 focus:border-[var(--color-accent)]"
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
            className="px-4 py-2 border border-[var(--color-border)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/20 focus:border-[var(--color-accent)]"
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
            className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg text-sm font-medium hover:bg-[var(--color-primary-hover)] transition-colors"
          >
            Filtern
          </button>
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
