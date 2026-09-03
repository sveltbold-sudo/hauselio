"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useCartStore } from "@/lib/store";
import { formatPrice } from "@/lib/utils";
import { useToast } from "@/components/ui/Toast";
import ProductImage from "@/components/product/ProductImage";

interface CrossSellItem {
  id: string;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number | null;
  image: string;
  brand?: string;
  categorySlug?: string;
}

export default function CartCrossSell() {
  const [suggestions, setSuggestions] = useState<CrossSellItem[]>([]);
  const [loading, setLoading] = useState(true);
  const items = useCartStore((state) => state.items);
  const addItem = useCartStore((state) => state.addItem);
  const toast = useToast();

  useEffect(() => {
    if (items.length === 0) {
      setLoading(false);
      setSuggestions([]);
      return;
    }

    let cancelled = false;
    const timer = setTimeout(() => {
      const controller = new AbortController();

    const fetchRelated = async () => {
      try {
        if (cancelled) return;
        const cartIds = new Set(items.map((i) => i.id));
        const knownCategorySlugs = items
          .map((i) => i.categorySlug)
          .filter((s): s is string => Boolean(s));

        let targetCategory: string | null = null;

        if (knownCategorySlugs.length > 0) {
          const counts: Record<string, number> = {};
          for (const slug of knownCategorySlugs) {
            counts[slug] = (counts[slug] || 0) + 1;
          }
          targetCategory = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;
        } else {
          const res = await fetch(
            `/api/products?limit=100&sort=newest`,
            { signal: controller.signal }
          );
          if (!res.ok) return;
          const data = await res.json();
          if (!Array.isArray(data.products)) return;

          const available = data.products.filter(
            (p: { id: string }) => !cartIds.has(p.id)
          );

          if (available.length === 0) return;

          const catCounts: Record<string, number> = {};
          for (const p of available) {
            const cat = (p as { categorySlug?: string }).categorySlug;
            if (cat) catCounts[cat] = (catCounts[cat] || 0) + 1;
          }

          const sorted = Object.entries(catCounts).sort((a, b) => b[1] - a[1]);
          if (sorted.length > 0) {
            targetCategory = sorted[0]![0];
          }
        }

        if (!targetCategory) {
          const res = await fetch(
            `/api/products?limit=3&sort=newest`,
            { signal: controller.signal }
          );
          if (!res.ok) return;
          const data = await res.json();
          if (Array.isArray(data.products)) {
            setSuggestions(
              data.products
                .filter((p: { id: string }) => !cartIds.has(p.id))
                .slice(0, 3)
                .map((p: { id: string; name: string; slug: string; price: number; originalPrice?: number | null; images?: string[]; brand?: string; categorySlug?: string }) => ({
                  id: p.id,
                  name: p.name,
                  slug: p.slug,
                  price: p.price,
                  originalPrice: p.originalPrice,
                  image: p.images?.[0] || "/images/placeholder-product.svg",
                  brand: p.brand,
                  categorySlug: p.categorySlug,
                }))
            );
          }
          return;
        }

        const res = await fetch(
          `/api/products?category=${encodeURIComponent(targetCategory)}&limit=10`,
          { signal: controller.signal }
        );
        if (!res.ok) return;
        const data = await res.json();
        if (!Array.isArray(data.products)) return;

        const related = data.products
          .filter((p: { id: string }) => !cartIds.has(p.id))
          .slice(0, 3)
          .map((p: { id: string; name: string; slug: string; price: number; originalPrice?: number | null; images?: string[]; brand?: string; categorySlug?: string }) => ({
            id: p.id,
            name: p.name,
            slug: p.slug,
            price: p.price,
            originalPrice: p.originalPrice,
            image: p.images?.[0] || "/images/placeholder-product.svg",
            brand: p.brand,
            categorySlug: p.categorySlug,
          }));

        setSuggestions(related);
      } catch {
        /* graceful degradation - cross-sell is non-critical */
      } finally {
        setLoading(false);
      }
    };

    fetchRelated();
    }, 500);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [items]);

  if (loading) {
    return (
      <div className="bg-[var(--color-bg-secondary)] rounded-2xl p-5 lg:p-6" role="status"><span className="sr-only">Wird geladen...</span>
        <h3 className="text-sm font-bold text-[var(--color-text-primary)] mb-4">
          Passend dazu
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
        Passend dazu
      </h3>
      <div className="space-y-3">
        {suggestions.map((item) => (
          <div key={item.id} className="flex items-center gap-3 bg-white rounded-xl p-2.5 sm:p-3 border border-[var(--color-border-light)]">
            <Link href={`/produkt/${item.slug}`} aria-label={item.name} className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden bg-[var(--color-bg-secondary)] shrink-0">
              <ProductImage src={item.image} alt={item.name} size="sm" />
            </Link>
            <div className="flex-1 min-w-0">
              <Link href={`/produkt/${item.slug}`} aria-label={item.name} className="text-sm font-semibold text-[var(--color-text-primary)] hover:text-[var(--color-primary)] transition-colors line-clamp-1 block">
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
                  originalPrice: item.originalPrice ?? undefined,
                  image: item.image,
                  brand: item.brand,
                  categorySlug: item.categorySlug,
                }, 1);
                toast.success(`${item.name} zum Warenkorb hinzugefügt.`);
              }}
              className="min-w-[44px] min-h-[44px] p-2 flex items-center justify-center rounded-lg hover:bg-[var(--color-primary)]/10 text-[var(--color-primary)] transition-colors"
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
