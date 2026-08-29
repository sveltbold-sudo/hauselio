import { memo } from "react";
import Link from "next/link";
import { Truck } from "lucide-react";
import Badge from "@/components/ui/Badge";
import ProductImage from "@/components/product/ProductImage";
import AddToCartButton from "@/components/product/AddToCartButton";
import WishlistButton from "@/components/product/WishlistButton";
import StarRating from "@/components/ui/StarRating";
import { formatPrice, calcDiscount } from "@/lib/utils";
import DeliveryEstimate from "@/components/product/DeliveryEstimate";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    originalPrice?: number | null;
    image: string;
    rating: number;
    reviewCount: number;
    isNew?: boolean;
    isPromo?: boolean;
    brand?: string | null;
    inStock?: boolean;
  };
}

export default memo(function ProductCard({ product }: ProductCardProps) {
  const discount = calcDiscount(product.price, product.originalPrice ?? null);

  return (
    <Link
      href={`/produkt/${product.slug}`}
      className="group relative bg-white rounded-2xl border border-[var(--color-border-light)] overflow-hidden transition-colors transition-shadow transition-transform duration-300 hover:border-[var(--color-border)] hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 block h-full flex flex-col"
      aria-label={`${product.brand ? product.brand + " " : ""}${product.name} - ${formatPrice(product.price)}`}
    >
      {/* Image Container — clean like Coolblue */}
      <div className="relative aspect-square bg-[var(--color-bg-secondary)] overflow-hidden p-4">
        <ProductImage
          src={product.image}
          alt={product.name}
          brand={product.brand}
          size="md"
        />

        {/* Badges — top left like Coolblue */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.isNew && <Badge variant="primary">Neu</Badge>}
          {product.isPromo && (
            <span className="inline-flex items-center px-2 py-0.5 bg-[var(--color-danger)] text-white text-xs font-bold rounded-lg">
              Angebot
            </span>
          )}
          {product.isPromo && discount > 0 && (
            <span className="inline-flex items-center px-2 py-0.5 bg-[var(--color-secondary)] text-white text-xs font-bold rounded-lg">
              -{discount}%
            </span>
          )}
          {product.reviewCount > 50 && (
            <span className="inline-flex items-center px-2 py-0.5 bg-[var(--color-accent)] text-white text-xs font-bold rounded-lg">
              Meistverkauft
            </span>
          )}
        </div>

        {/* Wishlist button — top right, shows on hover */}
        <div className="absolute top-3 right-3 z-10 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200">
          <WishlistButton
            item={{
              id: product.id,
              name: product.name,
              slug: product.slug,
              price: product.price,
              originalPrice: product.originalPrice ?? undefined,
              image: product.image,
              brand: product.brand ?? "",
              rating: product.rating,
              reviewCount: product.reviewCount,
            }}
          />
        </div>

        {/* Add-to-cart — bottom overlay like AO/Coolblue */}
        <div
          className="absolute bottom-3 left-3 right-3 z-10 opacity-0 group-hover:opacity-100 md:translate-y-0 transition-opacity transition-transform duration-300"
        >
          <AddToCartButton
            product={{
              id: product.id,
              name: product.name,
              slug: product.slug,
              price: product.price,
              image: product.image,
            }}
          />
        </div>
      </div>

      {/* Content — clean like Coolblue */}
      <div className="p-4 flex-1 flex flex-col">
        {/* Brand */}
        {product.brand && (
          <p className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)] mb-1" translate="no">
            {product.brand}
          </p>
        )}

        {/* Name */}
        <h3 className="font-semibold text-sm text-[var(--color-text-primary)] mb-2 line-clamp-2 group-hover:text-[var(--color-primary)] transition-colors leading-snug">
          {product.name}
        </h3>

        {/* Rating — compact like Coolblue */}
        <div className="flex items-center gap-1.5 mb-2.5">
          <StarRating rating={product.rating} size="sm" showCount count={product.reviewCount} />
        </div>

        {/* Spacer — pushes price to bottom */}
        <div className="flex-1" />

        {/* Price — prominent like all competitors */}
        <div className="flex items-baseline gap-2">
          <span className="text-lg sm:text-xl font-extrabold text-[var(--color-text-primary)] tabular-nums">
            {formatPrice(product.price)}
          </span>
          {product.originalPrice && (
            <span className="text-xs text-[var(--color-text-muted)] line-through">
              UVP {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>

        {/* Availability */}
        {product.inStock === false && (
          <span className="text-xs font-semibold text-[var(--color-danger)] mt-1">Nicht verfügbar</span>
        )}

        {/* Delivery estimate */}
        <div className="flex items-center gap-1.5 mt-2">
          <Truck className="w-3 h-3 text-[var(--color-text-muted)]" />
          <DeliveryEstimate />
        </div>
      </div>
    </Link>
  );
});
