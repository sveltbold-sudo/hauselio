import Link from "next/link";
import { Star } from "lucide-react";
import Badge from "@/components/ui/Badge";
import ProductImage from "@/components/product/ProductImage";
import AddToCartButton from "@/components/product/AddToCartButton";
import { formatPrice, calcDiscount } from "@/lib/utils";

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

export default function ProductCard({ product }: ProductCardProps) {
  const discount = calcDiscount(product.price, product.originalPrice ?? null);

  return (
    <Link
      href={`/produkt/${product.slug}`}
      className="group relative bg-white rounded-2xl border border-[var(--color-border-light)] overflow-hidden transition-all duration-500 hover:border-[var(--color-border)] hover:shadow-[var(--shadow-card-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2 block"
      aria-label={`${product.name} - ${formatPrice(product.price)}`}
    >
      {/* Image Container */}
      <div className="relative aspect-square bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
        <ProductImage
          src={product.image}
          alt={product.name}
          brand={product.brand}
          size="md"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.isNew && <Badge variant="primary">Neu</Badge>}
          {product.isPromo && discount > 0 && (
            <Badge variant="promo">-{discount}%</Badge>
          )}
        </div>

        {/* Stock indicator */}
        <div className="absolute top-3 right-3 z-10">
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-white/90 backdrop-blur-sm rounded-full">
            <span className={`w-1.5 h-1.5 rounded-full ${product.inStock !== false ? "bg-[var(--color-success)]" : "bg-[var(--color-danger)]"}`} />
            <span className={`text-[10px] font-semibold ${product.inStock !== false ? "text-[var(--color-success)]" : "text-[var(--color-danger)]"}`}>
              {product.inStock !== false ? "Lieferbar" : "Nicht verfügbar"}
            </span>
          </div>
        </div>

        {/* Add-to-cart button — always visible on mobile, hover on desktop */}
        <div
          className="absolute bottom-3 left-3 right-3 flex gap-2 z-10 transition-all duration-400 md:opacity-0 md:translate-y-2 md:group-hover:opacity-100 md:group-hover:translate-y-0 md:pointer-events-none md:group-hover:pointer-events-auto"
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

      {/* Content */}
      <div className="p-5">
        {/* Brand */}
        {product.brand && (
          <p className="text-[11px] font-bold text-[var(--color-primary)] uppercase tracking-wider mb-1.5">
            {product.brand}
          </p>
        )}

        {/* Name */}
        <h3 className="font-semibold text-[var(--color-text-primary)] line-clamp-2 group-hover:text-[var(--color-primary)] transition-colors duration-300 mb-2 text-sm leading-snug">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1.5 mb-3" aria-label={`${product.rating} von 5 Sternen, ${product.reviewCount} Bewertungen`}>
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                aria-hidden="true"
                className={`w-3.5 h-3.5 ${
                  i < Math.floor(product.rating)
                    ? "text-amber-400 fill-amber-400"
                    : "text-gray-200"
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-[var(--color-text-muted)] font-medium">
            ({product.reviewCount})
          </span>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-2">
          <span className="text-lg font-bold text-[var(--color-text-primary)]">
            {formatPrice(product.price)}
          </span>
          {product.originalPrice && (
            <span className="text-sm text-[var(--color-text-muted)] line-through">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
