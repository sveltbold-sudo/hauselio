"use client";

import { useState, useEffect } from "react";
import ProductCard from "@/components/product/ProductCard";
import type { ProductListItem } from "@/lib/product-types";

export default function PopularProducts() {
  const [products, setProducts] = useState<ProductListItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/products?limit=4&sort=newest", { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error("API error");
        return res.json();
      })
      .then((data) => setProducts(data.products ?? []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, []);

  if (loading) {
    return (
      <div className="mt-12">
        <p className="caption text-[var(--color-primary)] mb-4 text-center">
          Beliebte Produkte
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 auto-rows-[1fr]">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="bg-[var(--color-bg-secondary)] rounded-2xl aspect-[3/4] animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  if (products.length === 0) return null;

  return (
    <div className="mt-12 max-w-4xl mx-auto">
      <p className="caption text-[var(--color-primary)] mb-4 text-center">
        Beliebte Produkte
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 auto-rows-[1fr]">
        {products.map((p) => (
          <ProductCard
            key={p.id}
            product={{
              ...p,
              image: p.image ?? "/images/placeholder-product.svg",
              originalPrice: p.originalPrice ?? undefined,
              brand: p.brand ?? undefined,
            }}
          />
        ))}
      </div>
    </div>
  );
}
