"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { ShoppingBag, Share2, Truck, Check, Minus, Plus, CircleCheck, CircleX } from "lucide-react";
import Button from "@/components/ui/Button";
import ProductImageGallery from "@/components/product/ProductImageGallery";
import ProductTrustBadges from "@/components/product/ProductTrustBadges";
import ProductPaymentInfo from "@/components/product/ProductPaymentInfo";
import WishlistButton from "@/components/product/WishlistButton";
import CompareButton from "@/components/product/CompareButton";
import { trackRecentlyViewed } from "@/components/product/RecentlyViewedSection";
import Breadcrumb from "@/components/ui/Breadcrumb";
import StarRating from "@/components/ui/StarRating";
import { formatPrice, calcDiscount } from "@/lib/utils";
import { getEstimatedDeliveryDate } from "@/lib/delivery";
import { useCartStore } from "@/lib/store";
import { useToast } from "@/components/ui/Toast";

const ProductTabs = dynamic(() => import("@/components/product/ProductTabs"), { ssr: true });
const FrequentlyBoughtTogether = dynamic(() => import("@/components/product/FrequentlyBoughtTogether"), { ssr: false });
const RecentlyViewedSection = dynamic(() => import("@/components/product/RecentlyViewedSection"), { ssr: false });
const SimilarProductsSection = dynamic(() => import("@/components/product/SimilarProductsSection"), { ssr: false });
const ImageLightbox = dynamic(() => import("@/components/ui/ImageLightbox"), { ssr: false });

interface ProductSpec {
  key: string;
  value: string;
}

interface RelatedProduct {
  id: string;
  name: string;
  slug: string;
  price: number;
  image: string;
  brand: string | null;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  originalPrice: number | null;
  rating: number;
  reviewCount: number;
  isNew: boolean;
  inStock: boolean;
  brand: string | null;
  categoryName: string;
  categorySlug: string;
  specs: ProductSpec[];
  images: string[];
}

export default function ProductPageClient({ product, relatedProducts = [] }: { product: Product; relatedProducts?: RelatedProduct[] }) {
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [added, setAdded] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const addItem = useCartStore((state) => state.addItem);
  const toast = useToast();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  useEffect(() => {
    trackRecentlyViewed({
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.images[0] || "/images/placeholder-product.svg",
      rating: product.rating,
      reviewCount: product.reviewCount,
      isNew: product.isNew,
      isPromo: product.originalPrice !== null,
      brand: product.brand,
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product.id]);

  const discount = calcDiscount(product.price, product.originalPrice);

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      image: product.images[0] || "/images/placeholder-product.svg",
    }, quantity);
    toast.success(`${quantity > 1 ? quantity + " Artikel" : "Artikel"} zum Warenkorb hinzugefügt!`);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setAdded(true);
    window.dispatchEvent(new CustomEvent("cart:item-added"));
    timeoutRef.current = setTimeout(() => setAdded(false), 2000);
  };

  const handleShare = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    if (navigator.share) {
      try {
        await navigator.share({ title: product.name, url });
      } catch {
        // User cancelled
      }
    } else if (navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(url);
        toast.success("Link kopiert!");
      } catch {
        // Clipboard unavailable
      }
    }
  };

  const [delivery, setDelivery] = useState<{ from: string; to: string } | null>(null);

  useEffect(() => {
    setDelivery(getEstimatedDeliveryDate());
  }, []);
  const wishlistItem = {
    id: product.id,
    name: product.name,
    slug: product.slug,
    price: product.price,
    originalPrice: product.originalPrice ?? undefined,
    image: product.images[0] || "/images/placeholder-product.svg",
    brand: product.brand ?? "",
    rating: product.rating,
    reviewCount: product.reviewCount,
  };

  return (
    <div className="container-hauselio py-6 lg:py-10 pb-20 lg:pb-10">
      <Breadcrumb
        items={[
          { label: "Shop", href: "/shop" },
          { label: product.categoryName, href: `/kategorie/${product.categorySlug}` },
          { label: product.name },
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14">
        {/* Images */}
        <ProductImageGallery
          images={product.images}
          name={product.name}
          brand={product.brand}
          isNew={product.isNew}
          discount={discount}
          price={product.price}
          originalPrice={product.originalPrice}
          rating={product.rating}
          reviewCount={product.reviewCount}
          id={product.id}
          slug={product.slug}
          activeImageIndex={activeImageIndex}
          onImageSelect={setActiveImageIndex}
          onImageClick={() => setLightboxOpen(true)}
        />

        {/* Product info */}
        <div className="animate-fade-in-up delay-100 lg:sticky lg:top-24 lg:self-start">
          {product.brand && (
            <Link
              href={`/shop?brand=${encodeURIComponent(product.brand.toLowerCase())}`}
              className="inline-block text-xs font-bold text-[var(--color-primary)] uppercase tracking-widest mb-2 hover:underline"
              translate="no"
            >
              {product.brand}
            </Link>
          )}

          <h1 className="text-2xl lg:text-3xl font-bold text-[var(--color-text-primary)] mb-3 leading-tight">
            {product.name}
          </h1>

          <div className="flex items-center gap-2 mb-5">
            <StarRating rating={product.rating} size="md" />
            <span className="text-sm text-[var(--color-text-secondary)]">{product.rating}</span>
            <span className="text-[var(--color-border)]">·</span>
            <span className="text-sm text-[var(--color-text-muted)]">{product.reviewCount} Bewertungen</span>
          </div>

          <div className="flex items-center gap-2 mb-4">
            <span className={`inline-flex items-center gap-1.5 text-sm font-medium px-2.5 py-1 rounded-full ${
              product.inStock
                ? "bg-[var(--color-success)]/10 text-[var(--color-success)]"
                : "bg-[var(--color-danger)]/10 text-[var(--color-danger)]"
            }`}>
              {product.inStock
                ? <CircleCheck className="w-4 h-4" aria-hidden="true" />
                : <CircleX className="w-4 h-4" aria-hidden="true" />
              }
              {product.inStock ? "Auf Lager" : "Nicht verfügbar"}
            </span>
          </div>

          <div className="flex flex-wrap items-baseline gap-3 mb-5 pb-5 border-b border-[var(--color-border-light)]">
            <span className="text-3xl lg:text-4xl font-extrabold text-[var(--color-text-primary)]">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && (
              <>
                <span className="text-lg text-[var(--color-text-muted)] line-through">
                  {formatPrice(product.originalPrice)}
                </span>
                <span className="text-sm font-bold text-[var(--color-danger)] bg-[var(--color-danger-light)] px-2 py-0.5 rounded-md">
                  -{discount}%
                </span>
              </>
            )}
          </div>

          <div className="flex items-center gap-3 p-3 bg-[var(--color-bg-secondary)] rounded-xl mb-4">
            <Truck className="w-5 h-5 text-[var(--color-success)] shrink-0" />
            <div>
              <p className="text-sm font-semibold text-[var(--color-text-primary)]">
                {delivery ? `Lieferung: ${delivery.from} – ${delivery.to}` : "Lieferzeit wird berechnet…"}
              </p>
              <p className="text-xs text-[var(--color-success)]">Kostenloser Versand ab 50€</p>
            </div>
          </div>

          {/* Quantity & Add to cart */}
          <div className="flex items-center gap-3 mb-5">
            <div className="flex items-center border border-[var(--color-border-light)] rounded-xl bg-[var(--color-bg-secondary)]" role="group" aria-label="Artikelmenge">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                aria-label="Menge verringern"
                className="min-w-[44px] min-h-[44px] flex items-center justify-center text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors rounded-l-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="px-4 py-3 font-bold tabular-nums min-w-[48px] text-center text-sm" aria-live="polite">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(Math.min(99, quantity + 1))}
                aria-label="Menge erhöhen"
                className="min-w-[44px] min-h-[44px] flex items-center justify-center text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors rounded-r-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <Button
              onClick={handleAddToCart}
              disabled={!product.inStock}
              className={`flex-1 transition-colors duration-300 font-bold ${added ? "bg-[var(--color-success)] hover:bg-[var(--color-success)]" : ""}`}
              size="lg"
            >
              {added ? (
                <>
                  <Check className="w-5 h-5 mr-2" />
                  Hinzugefügt!
                </>
              ) : product.inStock ? (
                <>
                  <ShoppingBag className="w-5 h-5 mr-2" />
                  In den Warenkorb
                </>
              ) : (
                "Nicht verfügbar"
              )}
            </Button>
          </div>

          <ProductTrustBadges />

          <div className="flex items-center gap-4 mb-6">
            <button
                onClick={handleShare}
                aria-label="Produkt-Link kopieren"
                className="flex items-center gap-2 min-h-[44px] text-sm text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors"
              >
              <Share2 className="w-4 h-4" />
              Teilen
            </button>
            <WishlistButton item={wishlistItem} size="sm" className="opacity-100" />
          </div>

          <ProductPaymentInfo />

          <div className="mt-3">
            <CompareButton
              product={{
                ...wishlistItem,
                specs: product.specs,
              }}
            />
          </div>
        </div>
      </div>

      <ProductTabs description={product.description} specs={product.specs} />

      <FrequentlyBoughtTogether
        currentProduct={{ id: product.id, name: product.name, slug: product.slug, price: product.price, image: product.images[0] || "/images/placeholder-product.svg" }}
        products={relatedProducts}
      />

      <RecentlyViewedSection currentProductId={product.id} />
      <SimilarProductsSection currentProductId={product.id} categorySlug={product.categorySlug} />

      {/* Sticky mobile add-to-cart bar */}
      <div className="sticky-bottom-bar lg:hidden" role="complementary" aria-label="Schnellzugriff">
        <div className="flex items-center gap-3 max-w-lg mx-auto px-4 py-3">
          <div className="flex-1 min-w-0">
            <p className="text-sm text-[var(--color-text-muted)] truncate">{product.name}</p>
            <p className="font-bold text-sm text-[var(--color-text-primary)]">{formatPrice(product.price)}</p>
          </div>
          <Button
            onClick={handleAddToCart}
            disabled={!product.inStock}
            aria-label={added ? "Zum Warenkorb hinzugefügt" : product.inStock ? "In den Warenkorb" : "Nicht verfügbar"}
            className={`transition-colors duration-300 ${added ? "bg-[var(--color-success)] hover:bg-[var(--color-success)]" : ""}`}
            size="md"
          >
            {added ? <Check className="w-4 h-4" /> : product.inStock ? <><ShoppingBag className="w-4 h-4" /> <span className="hidden sm:inline">In den Warenkorb</span></> : "Nicht verfügbar"}
          </Button>
        </div>
      </div>

      <ImageLightbox
        images={product.images}
        initialIndex={activeImageIndex}
        productName={product.name}
        brand={product.brand ?? undefined}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
      />
    </div>
  );
}
