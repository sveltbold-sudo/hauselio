"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Heart, ShoppingBag, Trash2, ArrowRight } from "lucide-react";
import { useWishlistStore } from "@/lib/wishlist";
import { useCartStore } from "@/lib/store";
import { formatPrice } from "@/lib/utils";
import ProductImage from "@/components/product/ProductImage";
import Button from "@/components/ui/Button";
import Breadcrumb from "@/components/ui/Breadcrumb";

export default function WishlistPage() {
  const { items, removeItem, clearWishlist } = useWishlistStore();
  const addItem = useCartStore((state) => state.addItem);
  const [mounted, setMounted] = useState(false);

   
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
    <main id="main-content" className="container-hauselio py-12">
      <h1 className="heading-1 mb-4">Wunschliste</h1>
      <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 bg-[var(--color-bg-secondary)] rounded" />
          <div className="h-4 w-32 bg-[var(--color-bg-secondary)] rounded" />
        </div>
      </main>
    );
  }

  return (
    <main id="main-content" className="container-hauselio py-12">
      <Breadcrumb items={[{ label: "Startseite", href: "/" }, { label: "Wunschliste" }]} />

      <p className="caption text-[var(--color-primary)] mb-3">Meine Wünsche</p>

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="heading-1">Wunschliste</h1>
          <p className="text-[var(--color-text-muted)] text-sm mt-1">
            {items.length} {items.length === 1 ? "Produkt" : "Produkte"}
          </p>
        </div>
        {items.length > 0 && (
          <button
            onClick={() => { if (!window.confirm("Wirklich alle Produkte von der Wunschliste entfernen?")) return; clearWishlist(); }}
            className="text-sm min-h-[44px] flex items-center text-[var(--color-text-muted)] hover:text-[var(--color-danger)] transition-colors"
          >
            Alle entfernen
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-20 h-20 rounded-full bg-[var(--color-bg-secondary)] flex items-center justify-center mx-auto mb-6">
            <Heart className="w-10 h-10 text-[var(--color-text-muted)]" />
          </div>
          <h1 className="heading-3 mb-2">
            Ihre Wunschliste ist leer
          </h1>
          <p className="text-[var(--color-text-muted)] mb-6 max-w-sm mx-auto">
            Durchstöbern Sie unseren Shop und speichern Sie Produkte, die Ihnen gefallen.
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-5 py-3.5 bg-[var(--color-primary)] text-white text-sm font-semibold rounded-xl hover:bg-[var(--color-primary-hover)] transition-colors"
          >
            <ShoppingBag className="w-4 h-4" />
            Zum Shop
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex flex-col sm:flex-row gap-4 p-4 bg-white rounded-2xl border border-[var(--color-border-light)] hover:shadow-sm transition-shadow"
            >
              <Link href={`/produkt/${item.slug}`} className="shrink-0">
                <div className="w-24 h-24 bg-[var(--color-bg-secondary)] rounded-xl overflow-hidden">
                  <ProductImage src={item.image} alt={item.name} brand={item.brand} size="sm" />
                </div>
              </Link>
              <div className="flex-1 min-w-0">
                <Link href={`/produkt/${item.slug}`} className="block">
                  <h2 className="font-bold text-[var(--color-text-primary)] text-sm line-clamp-1 hover:text-[var(--color-primary)] transition-colors">
                    {item.name}
                  </h2>
                </Link>
                <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{item.brand}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="font-bold text-[var(--color-text-primary)]">{formatPrice(item.price)}</span>
                  {item.originalPrice && item.originalPrice > item.price && (
                    <span className="text-xs text-[var(--color-text-muted)] line-through">
                      {formatPrice(item.originalPrice)}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <button
                  onClick={() => removeItem(item.id)}
                  className="min-w-[44px] min-h-[44px] p-2.5 flex items-center justify-center text-[var(--color-text-muted)] hover:text-[var(--color-danger)] transition-colors"
                  aria-label={`${item.name} von Wunschliste entfernen`}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <Button
                  size="sm"
                  onClick={() =>
                    addItem({
                      id: item.id,
                      name: item.name,
                      slug: item.slug,
                      price: item.price,
                      image: item.image,
                    })
                  }
                  className="text-xs"
                >
                  In den Warenkorb
                </Button>
              </div>
            </div>
          ))}

          <div className="flex justify-end pt-4">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 text-sm text-[var(--color-primary)] hover:underline font-medium min-h-[44px] py-2"
            >
              Weiter einkaufen
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}
    </main>
  );
}
