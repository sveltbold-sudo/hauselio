import Link from "next/link";
import { Star, ShoppingCart, Heart } from "lucide-react";
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
  const fullStars = Math.floor(product.rating);

  return (
    <Link
      href={`/produkt/${product.slug}`}
      className="group relative bg-white rounded-2xl border border-[var(--color-border-light)] overflow-hidden transition-all duration-300 hover:border-[var(--color-border)] hover:shadow-[var(--shadow-card-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2 block"
      aria-label={`${product.name} - ${formatPrice(product.price)}`}
    >
      {/* Image Container */}
      <div className="relative aspect-square bg-[var(--color-bg-secondary)] overflow-hidden">
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
            <span className="inline-flex items-center px-2 py-0.5 bg-[var(--color-danger)] text-white text-[10px] font-bold rounded-md">
              -{discount}%
            </span>
          )}
        </div>

        {/* Wishlist button */}
        <button
          className="absolute top-3 right-3 z-10 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-[var(--color-text-muted)] hover:text-[var(--color-danger)] hover:bg-white transition-all duration-200 shadow-sm opacity-0 group-hover:opacity-100"
          aria-label="Zur Wunschliste hinzufügen"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          <Heart className="w-4 h-4" />
        </button>

        {/* Add-to-cart button — always visible on mobile, hover on desktop */}
        <div
          className="absolute bottom-3 left-3 right-3 z-10 transition-all duration-300 md:opacity-0 md:translate-y-2 md:group-hover:opacity-100 md:group-hover:translate-y-0 md:pointer-events-none md:group-hover:pointer-events-auto"
          aria-hidden="true"
          tabIndex={-1}
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
      <div className="p-4">
        {/* Brand */}
        {product.brand && (
          <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-muted)] mb-1">
            {product.brand}
          </p>
        )}

        {/* Name */}
        <h3 className="font-semibold text-sm text-[var(--color-text-primary)] mb-2 line-clamp-2 group-hover:text-[var(--color-primary)] transition-colors leading-snug">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1.5 mb-3">
          <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-3 h-3 ${
                  i < fullStars
                    ? "text-amber-400 fill-amber-400"
                    : "text-gray-200 fill-gray-200"
                }`}
              />
            ))}
          </div>
          <span className="text-xs font-semibold text-[var(--color-text-secondary)]">
            {product.rating.toFixed(1)}
          </span>
          <span className="text-xs text-[var(--color-text-muted)]">
            ({product.reviewCount})
          </span>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-2">
          <span className="text-lg font-extrabold text-[var(--color-text-primary)]">
            {formatPrice(product.price)}
          </span>
          {product.originalPrice && (
            <span className="text-sm text-[var(--color-text-muted)] line-through">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>

        {/* Stock */}
        <div className="flex items-center gap-1.5 mt-2">
          <span className={`w-1.5 h-1.5 rounded-full ${product.inStock !== false ? "bg-[var(--color-success)]" : "bg-[var(--color-danger)]"}`} />
          <span className={`text-[10px] font-semibold ${product.inStock !== false ? "text-[var(--color-success)]" : "text-[var(--color-danger)]"}`}>
            {product.inStock !== false ? "Lieferbar" : "Nicht verfügbar"}
          </span>
        </div>
      </div>
    </Link>
  );
}
