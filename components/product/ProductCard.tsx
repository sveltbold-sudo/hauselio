import { memo } from "react";
import Link from "next/link";
import { Star, Truck } from "lucide-react";
import Badge from "@/components/ui/Badge";
import ProductImage from "@/components/product/ProductImage";
import AddToCartButton from "@/components/product/AddToCartButton";
import WishlistButton from "@/components/product/WishlistButton";
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
  const fullStars = Math.floor(product.rating);

  return (
    <Link
      href={`/produkt/${product.slug}`}
      className="group relative bg-white rounded-xl border border-[var(--color-border-light)] overflow-hidden transition-colors transition-shadow transition-transform duration-300 hover:border-[var(--color-border)] hover:shadow-[0_8px_30px_-8px_rgba(0,0,0,0.08)] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2 block"
      aria-label={`${product.name} - ${formatPrice(product.price)}`}
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
          {product.isPromo && discount > 0 && (
            <span className="inline-flex items-center px-2 py-0.5 bg-[var(--color-danger)] text-white text-[10px] font-bold rounded">
              -{discount}%
            </span>
          )}
        </div>

        {/* Wishlist button — top right, shows on hover */}
        <div className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
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
          className="absolute bottom-3 left-3 right-3 z-10 transition-opacity transition-transform duration-300 md:opacity-0 md:translate-y-2 md:group-hover:opacity-100 md:group-hover:translate-y-0 md:pointer-events-none md:group-hover:pointer-events-auto"
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
      <div className="p-4">
        {/* Brand */}
        {product.brand && (
          <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-muted)] mb-1">
            {product.brand}
          </p>
        )}

        {/* Name */}
        <h3 className="font-semibold text-[13px] text-[var(--color-text-primary)] mb-2 line-clamp-2 group-hover:text-[var(--color-primary)] transition-colors leading-snug">
          {product.name}
        </h3>

        {/* Rating — compact like Coolblue */}
        <div className="flex items-center gap-1.5 mb-2.5">
          <div className="flex items-center" role="img" aria-label={`${product.rating} von 5 Sternen`}>
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-3.5 h-3.5 ${
                  i < fullStars
                    ? "text-amber-400 fill-amber-400"
                    : "text-gray-200 fill-gray-200"
                }`}
              />
            ))}
          </div>
          <span className="text-[11px] text-[var(--color-text-muted)]">
            ({product.reviewCount})
          </span>
        </div>

        {/* Price — prominent like all competitors */}
        <div className="flex items-baseline gap-2">
          <span className="text-base font-extrabold text-[var(--color-text-primary)] tabular-nums">
            {formatPrice(product.price)}
          </span>
          {product.originalPrice && (
            <span className="text-xs text-[var(--color-text-muted)] line-through">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>

        {/* Delivery estimate */}
        <div className="flex items-center gap-1.5 mt-2">
          <Truck className="w-3 h-3 text-[var(--color-text-muted)]" />
          <DeliveryEstimate />
        </div>
      </div>
    </Link>
  );
});
