"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useCartStore } from "@/lib/store";
import { formatPrice } from "@/lib/utils";
import ProductImage from "@/components/product/ProductImage";

interface CrossSellItem {
  id: string;
  name: string;
  slug: string;
  price: number;
  image: string;
}

export default function CartCrossSell() {
  const [suggestions, setSuggestions] = useState<CrossSellItem[]>([]);
  const [loading, setLoading] = useState(true);
  const items = useCartStore((state) => state.items);
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    const controller = new AbortController();
    const cartIds = items.map((i) => i.id);
    fetch(`/api/products?limit=3&exclude=${cartIds.join(",")}`, { signal: controller.signal })
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data.products)) {
          setSuggestions(
            data.products.map((p: { id: string; name: string; slug: string; price: number; images?: string[] }) => ({
              id: p.id,
              name: p.name,
              slug: p.slug,
              price: p.price,
              image: p.images?.[0] || "/images/placeholder-product.svg",
            }))
          );
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, [items]);

  if (loading) {
    return (
      <div className="bg-[var(--color-bg-secondary)] rounded-2xl p-5 lg:p-6" role="status"><span className="sr-only">Wird geladen...</span>
        <h3 className="text-sm font-bold text-[var(--color-text-primary)] mb-4">
          Kunden kauften auch
        </h3>
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center gap-3 bg-white rounded-xl p-3 border border-[var(--color-border-light)] animate-pulse">
              <div className="w-16 h-16 rounded-lg bg-[var(--color-bg-secondary)]" />
              <div className="flex-1">
                <div className="h-3 bg-[var(--color-bg-secondary)] rounded w-3/4 mb-2" />
                <div className="h-3 bg-[var(--color-bg-secondary)] rounded w-1/3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (suggestions.length === 0) return null;

  return (
    <div className="bg-[var(--color-bg-secondary)] rounded-2xl p-5 lg:p-6">
      <h3 className="text-sm font-bold text-[var(--color-text-primary)] mb-4">
        Kunden kauften auch
      </h3>
      <div className="space-y-3">
        {suggestions.map((item) => (
          <div key={item.id} className="flex items-center gap-3 bg-white rounded-xl p-3 border border-[var(--color-border-light)]">
            <Link href={`/produkt/${item.slug}`} className="w-16 h-16 rounded-lg overflow-hidden bg-[var(--color-bg-secondary)] shrink-0">
              <ProductImage src={item.image} alt={item.name} size="sm" />
            </Link>
            <div className="flex-1 min-w-0">
              <Link href={`/produkt/${item.slug}`} className="text-sm font-semibold text-[var(--color-text-primary)] hover:text-[var(--color-primary)] transition-colors line-clamp-1 block">
                {item.name}
              </Link>
              <p className="text-sm font-bold text-[var(--color-text-primary)] mt-0.5 tabular-nums">
                {formatPrice(item.price)}
              </p>
            </div>
            <button
              onClick={() => {
                addItem({
                  id: item.id,
                  name: item.name,
                  slug: item.slug,
                  price: item.price,
                  image: item.image,
                }, 1);
              }}
              className="p-2 rounded-lg hover:bg-[var(--color-primary)]/10 text-[var(--color-primary)] transition-colors"
              aria-label={`${item.name} zum Warenkorb hinzufügen`}
            >
              <ShoppingCart className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
