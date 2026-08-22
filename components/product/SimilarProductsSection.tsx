"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Users } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import ProductImage from "@/components/product/ProductImage";

interface SimilarProduct {
  id: string;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number | null;
  image: string;
  brand: string;
  rating: number;
  reviewCount: number;
}

interface SimilarProductsSectionProps {
  currentProductId: string;
  categorySlug: string;
}

export default function SimilarProductsSection({ currentProductId, categorySlug }: SimilarProductsSectionProps) {
  const [products, setProducts] = useState<SimilarProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    fetch(`/api/products?category=${categorySlug}&limit=5`, { signal: controller.signal })
      .then((res) => res.json())
      .then((data) => {
        if (data.products) {
          setProducts(
            data.products
              .filter((p: { id: string }) => p.id !== currentProductId)
              .slice(0, 4)
              .map((p: { id: string; name: string; slug: string; price: number; originalPrice?: number | null; image?: string | null; brand?: string | null; rating: number; reviewCount: number }) => ({
                id: p.id,
                name: p.name,
                slug: p.slug,
                price: p.price,
                originalPrice: p.originalPrice,
                image: p.image || "/images/placeholder-product.svg",
                brand: p.brand || "",
                rating: p.rating,
                reviewCount: p.reviewCount,
              }))
          );
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, [currentProductId, categorySlug]);

  if (loading) {
    return (
      <div className="mt-12">
        <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-6 flex items-center gap-2">
          <Users className="w-5 h-5 text-[var(--color-primary)]" />
          Andere kauften auch
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-[var(--color-border-light)] p-3 animate-pulse">
              <div className="aspect-square bg-[var(--color-bg-secondary)] rounded-lg mb-3" />
              <div className="h-3 bg-[var(--color-bg-secondary)] rounded w-3/4 mb-2" />
              <div className="h-3 bg-[var(--color-bg-secondary)] rounded w-1/2" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (products.length === 0) return null;

  return (
    <div className="mt-12">
      <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-6 flex items-center gap-2">
        <Users className="w-5 h-5 text-[var(--color-primary)]" />
        Andere kauften auch
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {products.map((product) => (
          <Link
            key={product.id}
            href={`/produkt/${product.slug}`}
            className="group bg-white rounded-xl border border-[var(--color-border-light)] p-3 hover:shadow-md hover:border-[var(--color-primary)]/20 transition-colors transition-shadow"
          >
            <div className="aspect-square bg-[var(--color-bg-secondary)] rounded-lg overflow-hidden mb-3">
              <ProductImage src={product.image} alt={product.name} brand={product.brand} size="sm" />
            </div>
            <h3 className="text-sm font-semibold text-[var(--color-text-primary)] line-clamp-2 group-hover:text-[var(--color-primary)] transition-colors mb-1">
              {product.name}
            </h3>
            <p className="text-xs text-[var(--color-text-muted)] mb-2" translate="no">{product.brand}</p>
            <div className="flex items-baseline gap-2">
              <span className="text-sm font-bold text-[var(--color-text-primary)] tabular-nums">{formatPrice(product.price)}</span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-xs text-[var(--color-text-muted)] line-through">{formatPrice(product.originalPrice)}</span>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
