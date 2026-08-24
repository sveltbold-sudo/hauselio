import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import ProductCard from "@/components/product/ProductCard";
import MobileHorizontalScroll from "@/components/ui/MobileHorizontalScroll";

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
    <section className="section-py bg-white" aria-label="Für Sie empfohlen">
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

        {/* Mobile: soft pastel horizontal scroll */}
        <div className="sm:hidden -mx-5 px-5 bg-gradient-to-br from-[var(--color-primary-50)] via-white to-[var(--color-accent)]/5 py-6 -mt-6">
          <MobileHorizontalScroll className="px-0" autoScrollInterval={7000}>
            {products.map((product) => (
              <div key={product.id} className="snap-start shrink-0 w-[260px]">
                <div className="bg-white rounded-2xl shadow-sm border border-[var(--color-border-light)] overflow-hidden hover:shadow-md transition-shadow">
                  <ProductCard product={product} />
                </div>
              </div>
            ))}
          </MobileHorizontalScroll>
        </div>
        {/* Desktop: grid */}
        <div className="hidden sm:grid grid-cols-2 lg:grid-cols-4 gap-5">
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
          <Link href="/shop" className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] transition-colors">
            Mehr entdecken
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
