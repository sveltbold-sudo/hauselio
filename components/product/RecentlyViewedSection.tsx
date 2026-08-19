"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Clock } from "lucide-react";
import ProductCard from "@/components/product/ProductCard";

interface ViewedProduct {
  id: string;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number | null;
  image: string;
  rating: number;
  reviewCount: number;
  isNew?: boolean;
  inStock?: boolean;
  isPromo?: boolean;
  brand?: string | null;
}

const STORAGE_KEY = "hauselio-recently-viewed";
const MAX_ITEMS = 8;

export function trackRecentlyViewed(product: ViewedProduct) {
  if (typeof window === "undefined") return;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    const items: ViewedProduct[] = stored ? JSON.parse(stored) : [];
    const filtered = items.filter((i) => i.id !== product.id);
    filtered.unshift(product);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered.slice(0, MAX_ITEMS)));
  } catch {
    // localStorage unavailable
  }
}

export default function RecentlyViewedSection({ currentProductId }: { currentProductId?: string }) {
  const [items, setItems] = useState<ViewedProduct[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed: ViewedProduct[] = JSON.parse(stored);
        const filtered = currentProductId
          ? parsed.filter((i) => i.id !== currentProductId)
          : parsed;
        setItems(filtered.slice(0, 4));
      }
    } catch {
      // localStorage unavailable
    }
  }, [currentProductId]);

  if (items.length === 0) return null;

  return (
    <section className="section-py bg-[var(--color-bg-secondary)]">
      <div className="container-hauselio">
        <div className="flex items-center gap-2 mb-6">
          <Clock className="w-5 h-5 text-[var(--color-text-muted)]" />
          <h2 className="text-lg font-bold text-[var(--color-text-primary)]">
            Zuletzt angesehen
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {items.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
