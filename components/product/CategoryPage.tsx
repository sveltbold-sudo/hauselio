import { notFound } from "next/navigation";
import Link from "next/link";
import { PackageOpen, ShoppingBag } from "lucide-react";
import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/product/ProductCard";

interface CategoryPageProps {
  slug: string;
  title: string;
  description: string;
}

export default async function CategoryPage({
  slug,
  title,
  description,
}: CategoryPageProps) {
  let category;
  try {
    category = await prisma.category.findUnique({
      where: { slug },
    });
  } catch {
    notFound();
  }

  if (!category) {
    notFound();
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
    brand: { name: string } | null;
    images: { url: string }[];
  }[] = [];
  try {
    const raw = await prisma.product.findMany({
      where: { categoryId: category.id },
      include: {
        brand: true,
        images: { take: 1, orderBy: { position: "asc" } },
      },
      orderBy: { createdAt: "desc" },
    });
    // Map Decimal fields to numbers
    products = raw.map((p) => ({
      ...p,
      price: Number(p.price),
      originalPrice: p.originalPrice ? Number(p.originalPrice) : null,
      rating: Number(p.rating),
    }));
  } catch {
    products = [];
  }

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
      )}
    </div>
  );
}
