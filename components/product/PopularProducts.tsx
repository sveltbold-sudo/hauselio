"use client";

import { useState, useEffect } from "react";
import ProductCard from "@/components/product/ProductCard";

interface ApiProduct {
  id: string;
  name: string;
  slug: string;
  price: number;
  originalPrice: number | null;
  image: string | null;
  rating: number;
  reviewCount: number;
  isNew: boolean;
  isPromo: boolean;
  brand: string | null;
}

export default function PopularProducts() {
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/products?limit=4&sort=newest")
      .then((res) => res.json())
      .then((data) => setProducts(data.products ?? []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="mt-12">
        <p className="caption text-[var(--color-primary)] mb-4 text-center">
          Beliebte Produkte
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
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
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
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
