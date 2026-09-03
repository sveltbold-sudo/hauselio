"use client";

import Link from "next/link";
import { BarChart3, ShoppingBag, X, ArrowLeft } from "lucide-react";
import Button from "@/components/ui/Button";
import ProductImage from "@/components/product/ProductImage";
import StarRating from "@/components/ui/StarRating";
import { formatPrice, calcDiscount } from "@/lib/utils";
import { useCartStore } from "@/lib/store";
import { useToast } from "@/components/ui/Toast";
import { useComparisonStore } from "@/lib/comparison";
import Breadcrumb from "@/components/ui/Breadcrumb";

export default function VergleichPage() {
  const items = useComparisonStore((s) => s.items);
  const removeItem = useComparisonStore((s) => s.removeItem);
  const addItem = useCartStore((state) => state.addItem);
  const toast = useToast();

  if (items.length === 0) {
    return (
      <main id="main-content" className="container-hausaura py-24 text-center max-w-2xl mx-auto">
        <BarChart3 className="w-20 h-20 text-[var(--color-border)] mx-auto mb-6" />
        <h1 className="heading-2 mb-4">Keine Produkte zum Vergleichen</h1>
        <p className="body-large mb-10">
          Fügen Sie Produkte hinzu, um sie miteinander zu vergleichen.
        </p>
        <Link href="/shop">
          <Button size="lg">
            <ShoppingBag className="w-5 h-5 mr-2" />
            Produkte entdecken
          </Button>
        </Link>
      </main>
    );
  }

  if (items.length < 2) {
    return (
      <main id="main-content" className="container-hausaura py-24 text-center max-w-2xl mx-auto">
        <BarChart3 className="w-20 h-20 text-[var(--color-border)] mx-auto mb-6" />
        <h1 className="heading-2 mb-4">Mindestens 2 Produkte benötigt</h1>
        <p className="body-large mb-10">
          Fügen Sie mindestens 2 Produkte hinzu, um sie miteinander zu vergleichen.
        </p>
        <Link href="/shop">
          <Button size="lg">
            <ShoppingBag className="w-5 h-5 mr-2" />
            Produkte entdecken
          </Button>
        </Link>
      </main>
    );
  }

  // Collect all unique spec keys
  const allSpecKeys = Array.from(
    new Set(items.flatMap((item) => item.specs?.map((s) => s.key) ?? []))
  );

  return (
    <main id="main-content" className="container-hausaura py-6 sm:py-8 pb-20 lg:pb-8">
      <Breadcrumb items={[{ label: "Shop", href: "/shop" }, { label: "Vergleich" }]} />

      <div className="mb-6 sm:mb-10">
        <p className="caption text-[var(--color-primary)] mb-3">Vergleich</p>
        <h1 className="heading-1 mb-4">Produktvergleich</h1>
        <p className="text-sm text-[var(--color-text-muted)] mt-1">
          {items.length} Produkte vergleichen
        </p>
      </div>

      {/* Comparison table */}
      <div className="overflow-x-auto -mx-5 px-5 pb-4">
        <table className="w-full min-w-[600px] border-collapse">
          <caption className="sr-only">Produktvergleich</caption>
          {/* Product headers */}
          <thead>
            <tr>
              <th className="w-[180px] p-3 text-left align-top"></th>
              {items.map((item) => {
                const discount = calcDiscount(item.price, item.originalPrice ?? null);
                return (
                  <th key={item.id} className="p-3 text-center align-top">
                    <div className="relative bg-white rounded-2xl border border-[var(--color-border-light)] p-4">
                      <button
                        onClick={() => removeItem(item.id)}
                        aria-label={`${item.name} vom Vergleich entfernen`}
                        className="absolute top-2 right-2 min-w-[44px] min-h-[44px] p-2 flex items-center justify-center text-[var(--color-text-muted)] hover:text-[var(--color-danger)] hover:bg-[var(--color-danger-light)] rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      <Link href={`/produkt/${item.slug}`} className="block">
                        <div className="w-24 h-24 mx-auto bg-[var(--color-bg-secondary)] rounded-xl overflow-hidden mb-3">
                          <ProductImage src={item.image} alt={item.name} size="md" />
                        </div>
                        {item.brand && (
                          <p className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)] mb-1" translate="no">
                            {item.brand}
                          </p>
                        )}
                        <p className="text-sm font-semibold text-[var(--color-text-primary)] line-clamp-2 mb-2">
                          {item.name}
                        </p>
                      </Link>
                      <div className="flex items-center justify-center gap-1 mb-2">
                        <StarRating rating={item.rating} size="sm" showCount count={item.reviewCount} />
                      </div>
                      <div className="flex items-baseline justify-center gap-2">
                        <span className="text-lg font-extrabold text-[var(--color-text-primary)]">{formatPrice(item.price)}</span>
                        {item.originalPrice && item.originalPrice > item.price && (
                          <span className="text-xs text-[var(--color-text-muted)] line-through">{formatPrice(item.originalPrice)}</span>
                        )}
                      </div>
                      {discount > 0 && (
                        <span className="inline-block mt-1 px-2 py-0.5 bg-[var(--color-danger)] text-white text-xs font-bold rounded-md">
                          -{discount}%
                        </span>
                      )}
                      <Button
                        onClick={() => {
                          addItem({
                            id: item.id,
                            name: item.name,
                            slug: item.slug,
                            price: item.price,
                            originalPrice: item.originalPrice ?? undefined,
                            image: item.image,
                            brand: item.brand,
                            categorySlug: "vergleich",
                          });
                          window.dispatchEvent(new CustomEvent("cart:item-added"));
                          toast.success("Zum Warenkorb hinzugefügt!");
                        }}
                        className="w-full mt-3"
                        size="sm"
                      >
                        <ShoppingBag className="w-4 h-4 mr-1.5" />
                        In den Warenkorb
                      </Button>
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>

          {/* Spec rows */}
          {allSpecKeys.length > 0 && (
            <tbody>
              {allSpecKeys.map((key, i) => (
                <tr key={key} className={i % 2 === 0 ? "bg-[var(--color-bg-secondary)]" : ""}>
                  <th scope="row" className="p-3 text-sm font-semibold text-[var(--color-text-primary)] text-left">{key}</th>
                  {items.map((item) => {
                    const spec = item.specs?.find((s) => s.key === key);
                    return (
                      <td key={item.id} className="p-3 text-sm text-center text-[var(--color-text-secondary)]">
                        {spec?.value || "—"}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          )}
        </table>
      </div>

      <Link
        href="/shop"
        className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] transition-colors mt-8"
      >
        <ArrowLeft className="w-4 h-4" />
        Weiter einkaufen
      </Link>
    </main>
  );
}
