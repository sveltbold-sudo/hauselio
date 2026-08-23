import Link from "next/link";
import { ArrowRight, TrendingUp } from "lucide-react";
import ProductCard from "@/components/product/ProductCard";
import MobileHorizontalScroll from "@/components/ui/MobileHorizontalScroll";

interface BestsellerProduct {
  id: string;
  name: string;
  slug: string;
  price: number;
  originalPrice: number | null;
  image: string;
  rating: number;
  reviewCount: number;
  isNew: boolean;
  inStock: boolean;
  isPromo: boolean;
  brand: string | null;
}

interface BestsellerSectionProps {
  products: BestsellerProduct[];
}

export default function BestsellerSection({ products }: BestsellerSectionProps) {
  if (products.length === 0) return null;

  return (
    <section className="section-py bg-white">
      <div className="container-hauselio">
        <div className="flex items-end justify-between mb-6 md:mb-10">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-5 h-5 text-[var(--color-accent)]" />
              <p className="caption text-[var(--color-accent)]">Bestseller</p>
            </div>
            <h2 className="heading-2">Am besten verkauft</h2>
            <p className="body-large mt-2 line-clamp-2">
              Unsere meistverkauften Produkte — vertrauen Sie auf die Wahl tausender Kunden
            </p>
          </div>
          <Link
            href="/shop?sort=rating"
            className="hidden md:flex items-center gap-2 text-sm font-semibold text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] transition-colors"
          >
            Alle Bestseller
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Mobile: horizontal scroll */}
        <div className="sm:hidden">
          <MobileHorizontalScroll>
            {products.map((product, i) => (
              <div
                key={product.id}
                className="snap-start shrink-0 w-[280px] relative"
              >
                <div className={`absolute -top-2 -left-1 z-20 w-8 h-8 rounded-full flex items-center justify-center text-xs font-black shadow-lg ${
                  i === 0 ? "bg-gradient-to-br from-amber-400 to-amber-500 text-white" :
                  i === 1 ? "bg-gradient-to-br from-gray-300 to-gray-400 text-white" :
                  i === 2 ? "bg-gradient-to-br from-amber-600 to-amber-700 text-white" :
                  "bg-[var(--color-primary)] text-white"
                }`}>
                  {i + 1}
                </div>
                <ProductCard product={product} />
              </div>
            ))}
          </MobileHorizontalScroll>
        </div>
        {/* Desktop: grid */}
        <div className="hidden sm:grid grid-cols-2 lg:grid-cols-4 gap-5">
          {products.map((product, i) => (
            <div
              key={product.id}
              className="relative"
            >
              <div className={`absolute -top-2 -left-2 z-20 w-8 h-8 rounded-full flex items-center justify-center text-xs font-black shadow-lg ${
                i === 0 ? "bg-gradient-to-br from-amber-400 to-amber-500 text-white" :
                i === 1 ? "bg-gradient-to-br from-gray-300 to-gray-400 text-white" :
                i === 2 ? "bg-gradient-to-br from-amber-600 to-amber-700 text-white" :
                "bg-[var(--color-primary)] text-white"
              }`}>
                {i + 1}
              </div>
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        <div className="mt-8 text-center md:hidden">
          <Link
            href="/shop?sort=rating"
            className="inline-flex items-center gap-2 px-5 py-2.5 border border-[var(--color-border)] text-[var(--color-text-secondary)] font-semibold rounded-xl hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors text-sm"
          >
            Alle Bestseller
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
