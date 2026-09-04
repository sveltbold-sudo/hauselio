import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/product/ProductCard";

const THERMOMIX_SLUGS = ["thermomix-tm7", "thermomix-tm6", "vorwerk-thermomix-tm5", "thermomix-friend-complete", "thermomix-sensor", "thermomix-tm31"];

async function getThermomixProducts() {
  try {
    const products = await prisma.product.findMany({
      where: { slug: { in: THERMOMIX_SLUGS } },
      select: {
        id: true, name: true, slug: true, price: true, originalPrice: true,
        rating: true, reviewCount: true, isNew: true, isPromo: true,
        brand: { select: { name: true } },
        images: { select: { url: true }, take: 1, orderBy: { position: "asc" as const } },
      },
    });

    const ordered = THERMOMIX_SLUGS.map((slug) => products.find((p) => p.slug === slug)).filter((p): p is NonNullable<typeof p> => p != null);

    return ordered.map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      price: Number(p.price),
      originalPrice: p.originalPrice ? Number(p.originalPrice) : null,
      image: p.images[0]?.url || "/images/placeholder-product.svg",
      rating: Number(p.rating),
      reviewCount: p.reviewCount,
      isNew: p.isNew,
      isPromo: p.isPromo,
      brand: p.brand?.name || null,
    }));
  } catch {
    return [];
  }
}

export default async function ThermomixSection() {
  const products = await getThermomixProducts();

  if (products.length === 0) return null;

  return (
    <section className="section-py" aria-label="Thermomix Kollektion">
      <div className="container-hausaura">
        <div className="flex items-end justify-between mb-6 md:mb-10">
          <div>
            <p className="caption text-[var(--color-accent)] mb-2">Beliebteste Küchenhilfe</p>
            <h2 className="heading-2">Unsere Thermomix Kollektion</h2>
          </div>
          <Link
            href="/kategorie/kueche?sub=Thermomix"
            className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] transition-colors"
          >
            Alle ansehen
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {products.map((product) => (
            <div key={product.id}>
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        <div className="mt-6 text-center sm:hidden">
          <Link
            href="/kategorie/kueche?sub=Thermomix"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--color-primary)]"
          >
            Alle Thermomix ansehen
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
