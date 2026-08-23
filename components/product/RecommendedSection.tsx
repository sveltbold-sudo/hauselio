import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import ProductCard from "@/components/product/ProductCard";

interface RecommendedProduct {
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

interface RecommendedSectionProps {
  products: RecommendedProduct[];
}

export default function RecommendedSection({ products }: RecommendedSectionProps) {
  if (products.length === 0) return null;

  return (
    <section className="section-py bg-white">
      <div className="container-hauselio">
        <div className="flex items-end justify-between mb-6 md:mb-10">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-5 h-5 text-[var(--color-accent)]" />
              <p className="caption text-[var(--color-accent)]">Für Sie empfohlen</p>
            </div>
            <h2 className="heading-2">Passend zu Ihrem Geschmack</h2>
            <p className="body-large mt-2">
              Produkte, die unseren Kunden besonders gut gefallen haben
            </p>
          </div>
          <Link
            href="/shop"
            className="hidden md:flex items-center gap-2 text-sm font-semibold text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] transition-colors"
          >
            Mehr entdecken
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
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

        <div className="mt-8 text-center md:hidden">
          <Link href="/shop" className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-primary)] hover:text-[var(--color-primary-dark)] transition-colors">
            Mehr entdecken
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
