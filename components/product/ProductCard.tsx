"use client";

import Link from "next/link";
import { Truck } from "lucide-react";
import Badge from "@/components/ui/Badge";
import ProductImage from "@/components/product/ProductImage";
import AddToCartButton from "@/components/product/AddToCartButton";
import WishlistButton from "@/components/product/WishlistButton";
import StarRating from "@/components/ui/StarRating";
import { formatPrice, calcDiscount } from "@/lib/utils";
import DeliveryEstimate from "@/components/product/DeliveryEstimate";
import type { ProductListItem } from "@/lib/product-types";

interface ProductCardProps {
  product: ProductListItem;
}

export default function ProductCard({ product }: ProductCardProps) {
  const discount = calcDiscount(product.price, product.originalPrice ?? null);

  return (
    <div className="group relative bg-white rounded-2xl border border-[var(--color-border-light)] overflow-hidden transition-colors transition-shadow duration-300 hover:border-[var(--color-border)] hover:shadow-lg h-full flex flex-col">
      {/* Wishlist button — top right */}
      <div className="absolute top-3 right-3 z-10" role="presentation">
        <WishlistButton
          item={{
            id: product.id,
            name: product.name,
            slug: product.slug,
            price: product.price,
            originalPrice: product.originalPrice ?? undefined,
            isPromo: product.isPromo,
            image: product.image,
            brand: product.brand ?? "",
            rating: product.rating,
            reviewCount: product.reviewCount,
          }}
        />
      </div>

      {/* Image + Title + Content — primary link target */}
      <Link
        href={`/produkt/${product.slug}`}
        className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 flex-1 flex flex-col"
        aria-label={`${product.brand ? product.brand + " " : ""}${product.name} - ${formatPrice(product.price)}`}
      >
        {/* Image Container */}
        <div className="relative aspect-square bg-[var(--color-bg-secondary)] overflow-hidden p-4">
          <ProductImage
            src={product.image}
            alt={product.name}
            brand={product.brand}
            size="md"
          />
          {/* Badges — top left */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10" aria-hidden="true">
            {product.isNew && <Badge variant="primary">Neu</Badge>}
            {product.isPromo && <Badge variant="danger">Angebot</Badge>}
            {product.isPromo && discount > 0 && (
              <Badge variant="promo">-{discount}%</Badge>
            )}
            {product.reviewCount > 50 && (
              <Badge variant="accent">Meistverkauft</Badge>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-3 sm:p-4 flex-1 flex flex-col">
          {product.brand && (
            <p className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)] mb-1" translate="no">
              {product.brand}
            </p>
          )}
          <h3 className="font-semibold text-xs sm:text-sm text-[var(--color-text-primary)] mb-2 line-clamp-2 group-hover:text-[var(--color-primary)] transition-colors leading-snug">
            {product.name}
          </h3>
          <div className="flex items-center gap-1.5 mb-2.5">
            <StarRating rating={product.rating} size="sm" showCount count={product.reviewCount} />
          </div>
          <div className="flex-1" />
          <div className="flex items-baseline gap-2">
            <span className="text-lg sm:text-xl font-extrabold text-[var(--color-text-primary)] tabular-nums">
              {formatPrice(product.price)}
            </span>
            {product.isPromo && product.originalPrice && (
              <span className="text-xs text-[var(--color-text-muted)] line-through">
                UVP {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1.5 mt-2">
            <Truck className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[var(--color-text-muted)]" aria-hidden="true" />
            <DeliveryEstimate />
          </div>
        </div>
      </Link>

      {/* Add to Cart — flows naturally at card bottom */}
      <div
        className="px-3 pb-3 pt-0"
        role="presentation"
        onClick={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <AddToCartButton
          product={{
            id: product.id,
            name: product.name,
            slug: product.slug,
            price: product.price,
            originalPrice: product.originalPrice,
            image: product.image,
            brand: product.brand ?? "",
            categorySlug: product.categorySlug ?? undefined,
            rating: product.rating,
            reviewCount: product.reviewCount,
          }}
        />
      </div>
    </div>
  );
}
