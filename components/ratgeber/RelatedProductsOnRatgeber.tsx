import Link from "next/link";
import Image from "next/image";
import { ShoppingBag } from "lucide-react";
import { formatPrice } from "@/lib/utils";

interface Product {
  slug: string;
  name: string;
  price: number;
  images: string[];
  brand: string | null;
}

interface RelatedProductsOnRatgeberProps {
  products: Product[];
}

export default function RelatedProductsOnRatgeber({ products }: RelatedProductsOnRatgeberProps) {
  if (products.length === 0) return null;

  return (
    <section aria-labelledby="related-products-heading" className="bg-[var(--color-bg-secondary)] rounded-2xl p-6">
      <h2 id="related-products-heading" className="text-xl font-bold text-[var(--color-text-primary)] mb-4">
        Passende Produkte
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((product) => (
          <Link
            key={product.slug}
            href={`/produkt/${product.slug}`}
            className="group bg-white rounded-xl border border-[var(--color-border-light)] overflow-hidden hover:border-[var(--color-primary)]/30 hover:shadow-md transition-all"
          >
            <div className="relative aspect-square bg-white p-4">
              <Image
                src={product.images[0] || "/images/placeholder-product.svg"}
                alt={product.name}
                fill
                className="object-contain group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />
            </div>
            <div className="p-3">
              {product.brand && (
                <span className="text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wide" translate="no">
                  {product.brand}
                </span>
              )}
              <h3 className="text-sm font-semibold text-[var(--color-text-primary)] line-clamp-2 group-hover:text-[var(--color-primary)] transition-colors">
                {product.name}
              </h3>
              <p className="text-sm font-bold text-[var(--color-primary)] mt-1">
                {formatPrice(product.price)}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
