"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { X, BarChart3, Plus, ArrowRight } from "lucide-react";
import ProductImage from "@/components/product/ProductImage";

interface ComparisonProduct {
  id: string;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number | null;
  image: string;
  brand: string;
  rating: number;
  reviewCount: number;
  specs: { key: string; value: string }[];
}

export default function ComparisonBar() {
  const [products, setProducts] = useState<ComparisonProduct[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
     
    setMounted(true);
    const stored = localStorage.getItem("hauselio-comparison");
    if (stored) {
      try {
        const parsed: unknown = JSON.parse(stored);
        if (Array.isArray(parsed)) setProducts(parsed as ComparisonProduct[]);
      } catch {}
    }

    const handleUpdate = () => {
      const updated = localStorage.getItem("hauselio-comparison");
      if (updated) {
        try {
          const parsed: unknown = JSON.parse(updated);
          if (Array.isArray(parsed)) setProducts(parsed as ComparisonProduct[]);
        } catch {}
      } else {
        setProducts([]);
      }
    };

    window.addEventListener("storage", handleUpdate);
    window.addEventListener("comparison-updated", handleUpdate);
    return () => {
      window.removeEventListener("storage", handleUpdate);
      window.removeEventListener("comparison-updated", handleUpdate);
    };
  }, []);

  const removeProduct = (id: string) => {
    const updated = products.filter((p) => p.id !== id);
    setProducts(updated);
    localStorage.setItem("hauselio-comparison", JSON.stringify(updated));
  };

  const clearAll = () => {
    setProducts([]);
    localStorage.removeItem("hauselio-comparison");
  };

  if (!mounted || products.length === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[60] bg-white border-t border-[var(--color-border-light)] shadow-xl animate-slide-up" role="complementary" aria-label="Produktvergleich">
      <div className="container-hauselio py-3">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-[var(--color-text-primary)]">
            <BarChart3 className="w-4 h-4 text-[var(--color-primary)]" />
            <span>Vergleichen ({products.length})</span>
          </div>

          <div className="flex-1 flex items-center gap-3 overflow-x-auto scrollbar-hide">
            {products.map((product) => (
              <div key={product.id} className="flex items-center gap-2 bg-[var(--color-bg-secondary)] rounded-lg px-3 py-1.5 shrink-0">
                <div className="w-8 h-8 rounded overflow-hidden bg-white">
                  <ProductImage src={product.image} alt={product.name} size="sm" />
                </div>
                <span className="text-xs font-medium text-[var(--color-text-primary)] max-w-[120px] truncate">{product.name}</span>
                <button
                  onClick={() => removeProduct(product.id)}
                  className="min-w-[44px] min-h-[44px] flex items-center justify-center text-[var(--color-text-muted)] hover:text-[var(--color-danger)] transition-colors"
                  aria-label={`${product.name} entfernen`}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
            {products.length < 4 && (
              <Link
                href="/shop"
                className="flex items-center gap-1 text-xs text-[var(--color-primary)] hover:underline whitespace-nowrap"
              >
                <Plus className="w-3 h-3" />
                Hinzufügen
              </Link>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={clearAll}
              className="text-xs text-[var(--color-text-muted)] hover:text-[var(--color-danger)] transition-colors"
            >
              Leeren
            </button>
            {products.length >= 2 && (
              <Link
                href={`/vergleich?ids=${products.map((p) => p.id).join(",")}`}
                className="flex items-center gap-1 px-4 py-2 bg-[var(--color-primary)] text-white text-xs font-semibold rounded-xl hover:bg-[var(--color-primary-hover)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2"
              >
                Vergleichen
                <ArrowRight className="w-3 h-3" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
