"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { BarChart3, X, Star, Trash2 } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import ProductImage from "@/components/product/ProductImage";
import AddToCartButton from "@/components/product/AddToCartButton";
import { formatPrice } from "@/lib/utils";

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
  specs?: { key: string; value: string }[];
}

export default function VergleichPage() {
  const [products, setProducts] = useState<ComparisonProduct[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
     
    setMounted(true);
    const stored = localStorage.getItem("hauselio-comparison");
    if (stored) {
      try {
        setProducts(JSON.parse(stored));
      } catch {
        console.warn("Failed to parse comparison data from localStorage");
      }
    }
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

  if (!mounted) {
    return (
      <div className="container-hauselio section-py">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-[var(--color-bg-secondary)] rounded w-1/3" />
          <div className="h-64 bg-[var(--color-bg-secondary)] rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="container-hauselio section-py">
      <Breadcrumb items={[{ label: "Produktvergleich" }]} />

      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="caption text-[var(--color-primary)] mb-3">Produktvergleich</p>
          <h1 className="heading-1 flex items-center gap-3">
            <BarChart3 className="w-8 h-8 text-[var(--color-primary)]" />
            Produktvergleich
          </h1>
          <p className="text-[var(--color-text-secondary)] mt-2">
            {products.length > 0
              ? `${products.length} Produkte vergleichen`
              : "Vergleichen Sie Produkte Seite an Seite"}
          </p>
        </div>
        {products.length > 0 && (
          <button
            onClick={() => { if (!window.confirm("Vergleich wirklich leeren?")) return; clearAll(); }}
            className="flex items-center gap-1.5 text-sm min-h-[44px] px-3 text-[var(--color-text-muted)] hover:text-[var(--color-danger)] transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Alle entfernen
          </button>
        )}
      </div>

      {products.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[var(--color-border-light)] p-8 text-center">
          <div className="w-20 h-20 rounded-full bg-[var(--color-bg-secondary)] flex items-center justify-center mx-auto mb-6">
            <BarChart3 className="w-10 h-10 text-[var(--color-text-muted)]" />
          </div>
          <h2 className="heading-3 mb-2">
            Produkte vergleichen
          </h2>
          <p className="text-[var(--color-text-muted)] mb-6 max-w-md mx-auto">
            Fügen Sie Produkte hinzu, um Spezifikationen, Preise und Bewertungen direkt zu vergleichen.
            Klicken Sie auf &quot;Vergleichen&quot; auf einer Produktseite, um Produkte hinzuzufügen.
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--color-primary)] text-white text-sm font-semibold rounded-xl hover:bg-[var(--color-primary-hover)] transition-colors"
          >
            Produkte durchstöbern
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-[var(--color-border-light)] overflow-x-auto">
          <table className="w-full min-w-[600px] border-collapse">
            <thead>
              <tr>
                <th className="p-6 border-b border-[var(--color-border-light)] text-left" scope="col">
                  <span className="sr-only">Produkt</span>
                </th>
                {products.map((product) => (
                  <th key={product.id} className="relative p-6 border-b border-[var(--color-border-light)] text-center" scope="col">
                    <button
                      onClick={() => removeProduct(product.id)}
                      className="absolute top-3 right-3 min-w-[44px] min-h-[44px] p-2 flex items-center justify-center text-[var(--color-text-muted)] hover:text-[var(--color-danger)] transition-colors"
                      aria-label={`${product.name} aus Vergleich entfernen`}
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <div className="aspect-square bg-[var(--color-bg-secondary)] rounded-xl overflow-hidden mb-4">
                      <ProductImage src={product.image} alt={product.name} size="lg" />
                    </div>
                    <Link href={`/produkt/${product.slug}`} className="block">
                      <h3 className="font-semibold text-sm text-[var(--color-text-primary)] hover:text-[var(--color-primary)] transition-colors line-clamp-2">
                        {product.name}
                      </h3>
                    </Link>
                    <p className="text-xs text-[var(--color-text-muted)] mt-1">{product.brand}</p>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* Price */}
              <tr>
                <th scope="row" className="p-6 border-b border-[var(--color-border-light)] text-left text-xs text-[var(--color-text-muted)] font-medium">Preis</th>
                {products.map((product) => (
                  <td key={`price-${product.id}`} className="p-6 border-b border-[var(--color-border-light)] text-center">
                    <p className="text-xl font-bold text-[var(--color-text-primary)] tabular-nums">{formatPrice(product.price)}</p>
                    {product.originalPrice && (
                      <p className="text-xs text-[var(--color-text-muted)] line-through">{formatPrice(product.originalPrice)}</p>
                    )}
                  </td>
                ))}
              </tr>

              {/* Rating */}
              <tr>
                <th scope="row" className="p-6 border-b border-[var(--color-border-light)] text-left text-xs text-[var(--color-text-muted)] font-medium">Bewertung</th>
                {products.map((product) => (
                  <td key={`rating-${product.id}`} className="p-6 border-b border-[var(--color-border-light)] text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                      <span className="font-semibold text-sm">{product.rating}</span>
                      <span className="text-xs text-[var(--color-text-muted)]">({product.reviewCount})</span>
                    </div>
                  </td>
                ))}
              </tr>

              {/* Specs if available */}
              {products.some((p) => p.specs && p.specs.length > 0) && (
                <tr>
                  <th scope="row" className="p-6 border-b border-[var(--color-border-light)] text-left text-xs text-[var(--color-text-muted)] font-medium">Spezifikationen</th>
                  {products.map((product) => (
                    <td key={`specs-${product.id}`} className="p-6 border-b border-[var(--color-border-light)]">
                      {product.specs && product.specs.length > 0 ? (
                        <dl className="space-y-1.5">
                          {product.specs.slice(0, 6).map((spec) => (
                            <div key={spec.key} className="flex justify-between text-xs">
                              <dt className="text-[var(--color-text-muted)]">{spec.key}</dt>
                              <dd className="font-medium text-[var(--color-text-primary)]">{spec.value}</dd>
                            </div>
                          ))}
                        </dl>
                      ) : (
                        <p className="text-xs text-[var(--color-text-muted)] text-center">—</p>
                      )}
                    </td>
                  ))}
                </tr>
              )}

              {/* Add to cart */}
              <tr>
                <th scope="row" className="p-6 text-left text-xs text-[var(--color-text-muted)] font-medium">
                  <span className="sr-only">In den Warenkorb</span>
                </th>
                {products.map((product) => (
                  <td key={`cart-${product.id}`} className="p-6 text-center">
                    <AddToCartButton
                      product={{
                        id: product.id,
                        name: product.name,
                        slug: product.slug,
                        price: product.price,
                        image: product.image,
                      }}
                    />
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
