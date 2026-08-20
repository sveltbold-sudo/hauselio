"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, Share2, Truck, Shield, Check, Minus, Plus, RotateCcw, Zap } from "lucide-react";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import ProductImage from "@/components/product/ProductImage";
import WishlistButton from "@/components/product/WishlistButton";
import SimilarProductsSection from "@/components/product/SimilarProductsSection";
import CompareButton from "@/components/product/CompareButton";
import { formatPrice, calcDiscount } from "@/lib/utils";
import { getEstimatedDeliveryDate } from "@/lib/delivery";
import { useCartStore } from "@/lib/store";
import { useToast } from "@/components/ui/Toast";

import FrequentlyBoughtTogether from "@/components/product/FrequentlyBoughtTogether";
import RecentlyViewedSection, { trackRecentlyViewed } from "@/components/product/RecentlyViewedSection";
import ImageLightbox from "@/components/ui/ImageLightbox";
import Breadcrumb from "@/components/ui/Breadcrumb";
import StarRating from "@/components/ui/StarRating";

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
  const [activeTab, setActiveTab] = useState<"description" | "specs" | "shipping">("description");
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

  // Track this product as recently viewed
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

  return (
    <div className="container-hauselio py-6 lg:py-10">
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          { label: "Shop", href: "/shop" },
          { label: product.categoryName, href: `/kategorie/${product.categorySlug}` },
          { label: product.name },
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14">
        {/* Images */}
        <div className="animate-fade-in-up">
          {/* Main image */}
          <button
            type="button"
            onClick={() => setLightboxOpen(true)}
            className="aspect-square bg-[var(--color-bg-secondary)] rounded-2xl overflow-hidden mb-4 border border-[var(--color-border-light)] relative group cursor-zoom-in w-full text-left"
          >
            <div className="w-full h-full">
              <ProductImage
                src={product.images[activeImageIndex] || product.images[0]}
                alt={product.name}
                brand={product.brand}
                size="lg"
                priority
              />
            </div>
            {/* Floating badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {product.isNew && <Badge variant="primary">Neu</Badge>}
              {discount > 0 && <Badge variant="promo">-{discount}%</Badge>}
            </div>
            {/* Wishlist button */}
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <WishlistButton
                item={{
                  id: product.id,
                  name: product.name,
                  slug: product.slug,
                  price: product.price,
                  originalPrice: product.originalPrice ?? undefined,
                  image: product.images[0] || "/images/placeholder-product.svg",
                  brand: product.brand ?? "",
                  rating: product.rating,
                  reviewCount: product.reviewCount,
                }}
                size="md"
              />
            </div>
          </button>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="grid grid-cols-5 gap-2">
              {product.images.slice(0, 5).map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImageIndex(i)}
                  aria-label={`${product.name} Bild ${i + 1} anzeigen`}
                  className={`aspect-square bg-[var(--color-bg-secondary)] rounded-xl flex items-center border-2 overflow-hidden transition-all duration-200 ${
                    activeImageIndex === i
                      ? "border-[var(--color-primary)] shadow-sm"
                      : "border-transparent hover:border-[var(--color-border)]"
                  }`}
                >
                  <Image
                    src={img}
                    alt={`${product.name} ${i + 1}`}
                    width={80}
                    height={80}
                    className="w-full h-full object-contain p-1.5"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product info */}
        <div className="animate-fade-in-up delay-100 lg:sticky lg:top-24 lg:self-start">
          {/* Brand */}
          {product.brand && (
            <Link
              href={`/shop?brand=${encodeURIComponent(product.brand.toLowerCase())}`}
              className="inline-block text-xs font-bold text-[var(--color-primary)] uppercase tracking-widest mb-2 hover:underline"
            >
              {product.brand}
            </Link>
          )}

          {/* Name */}
          <h1 className="text-2xl lg:text-3xl font-bold text-[var(--color-text-primary)] mb-3 leading-tight">
            {product.name}
          </h1>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-5">
            <StarRating rating={product.rating} size="md" />
            <span className="text-sm text-[var(--color-text-secondary)]">
              {product.rating}
            </span>
            <span className="text-[var(--color-border)]">·</span>
            <span className="text-sm text-[var(--color-text-muted)]">
              {product.reviewCount} Bewertungen
            </span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3 mb-5 pb-5 border-b border-[var(--color-border-light)]">
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

          {/* Delivery estimate — like AO */}
          {(() => {
            const delivery = getEstimatedDeliveryDate();
            return (
              <div className="flex items-center gap-3 p-3 bg-[var(--color-bg-secondary)] rounded-xl mb-4">
                <Truck className="w-5 h-5 text-[var(--color-success)] shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-[var(--color-text-primary)]">
                    Lieferung: {delivery.from} – {delivery.to}
                  </p>
                  <p className="text-xs text-[var(--color-success)]">
                    Kostenloser Versand ab 50€
                  </p>
                </div>
              </div>
            );
          })()}

          {/* Quantity & Add to cart */}
            <div className="flex items-center gap-3 mb-5">
              <div className="flex items-center border border-[var(--color-border-light)] rounded-xl bg-[var(--color-bg-secondary)]">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  aria-label="Menge verringern"
                  className="p-3 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors rounded-l-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-4 py-3 font-bold tabular-nums min-w-[48px] text-center text-sm" aria-live="polite">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(99, quantity + 1))}
                  aria-label="Menge erhöhen"
                  className="p-3 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors rounded-r-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <Button
                onClick={handleAddToCart}
                className={`flex-1 transition-all duration-300 font-bold ${added ? "bg-[var(--color-success)] hover:bg-[var(--color-success)]" : ""}`}
                size="lg"
              >
                {added ? (
                  <>
                    <Check className="w-5 h-5 mr-2" />
                    Hinzugefügt!
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-5 h-5 mr-2" />
                    In den Warenkorb
                  </>
                )}
              </Button>
            </div>

          {/* Trust badges — like AO */}
          <div className="grid grid-cols-3 gap-3 p-4 bg-[var(--color-bg-secondary)] rounded-xl mb-5">
            <div className="flex flex-col items-center gap-1.5 text-center">
              <Truck className="w-5 h-5 text-[var(--color-success)]" />
              <span className="text-xs font-semibold text-[var(--color-text-primary)]">Kostenloser Versand</span>
            </div>
            <div className="flex flex-col items-center gap-1.5 text-center">
              <RotateCcw className="w-5 h-5 text-[var(--color-success)]" />
              <span className="text-xs font-semibold text-[var(--color-text-primary)]">30 Tage Rückgabe</span>
            </div>
            <div className="flex flex-col items-center gap-1.5 text-center">
              <Shield className="w-5 h-5 text-[var(--color-success)]" />
              <span className="text-xs font-semibold text-[var(--color-text-primary)]">Garantie bis 5 J.</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={handleShare}
              className="flex items-center gap-2 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors"
            >
              <Share2 className="w-4 h-4" />
              Teilen
            </button>
            <WishlistButton
              item={{
                id: product.id,
                name: product.name,
                slug: product.slug,
                price: product.price,
                originalPrice: product.originalPrice ?? undefined,
                image: product.images[0] || "/images/placeholder-product.svg",
                brand: product.brand ?? "",
                rating: product.rating,
                reviewCount: product.reviewCount,
              }}
              size="sm"
              className="opacity-100"
            />
          </div>

          {/* Payment info */}
          <div className="bg-[var(--color-bg-secondary)] rounded-xl p-4 text-xs text-[var(--color-text-muted)] space-y-1.5">
            <div className="flex items-center gap-2">
              <Zap className="w-3.5 h-3.5 text-[var(--color-accent)]" />
              <span>Sichere Bezahlung per Überweisung (SEPA)</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-3.5 h-3.5 text-[var(--color-success)]" />
              <span>Artikel geprüft und versandfertig</span>
            </div>
          </div>

          {/* Compare button */}
          <div className="mt-3">
            <CompareButton
              product={{
                id: product.id,
                name: product.name,
                slug: product.slug,
                price: product.price,
                originalPrice: product.originalPrice ?? undefined,
                image: product.images[0] || "/images/placeholder-product.svg",
                brand: product.brand ?? "",
                rating: product.rating,
                reviewCount: product.reviewCount,
                specs: product.specs,
              }}
            />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-12 lg:mt-16">
        <div
          role="tablist"
          className="flex overflow-x-auto border-b border-[var(--color-border-light)] scrollbar-hide"
          onKeyDown={(e) => {
            const tabs = ["description", "specs", "shipping"] as const;
            const currentIndex = tabs.indexOf(activeTab);
            if (e.key === "ArrowRight") {
              e.preventDefault();
              setActiveTab(tabs[(currentIndex + 1) % tabs.length]);
            } else if (e.key === "ArrowLeft") {
              e.preventDefault();
              setActiveTab(tabs[(currentIndex - 1 + tabs.length) % tabs.length]);
            }
          }}
        >
          {[
            { key: "description" as const, label: "Beschreibung" },
            { key: "specs" as const, label: "Technische Daten" },
            { key: "shipping" as const, label: "Versand & Zahlung" },
          ].map((tab) => (
            <button
              key={tab.key}
              role="tab"
              aria-selected={activeTab === tab.key}
              aria-controls={`tabpanel-${tab.key}`}
              id={`tab-${tab.key}`}
              onClick={() => setActiveTab(tab.key)}
              className={`px-5 py-3.5 text-sm font-semibold border-b-2 transition-[border-color,color] duration-200 whitespace-nowrap ${
                activeTab === tab.key
                  ? "border-[var(--color-primary)] text-[var(--color-primary)]"
                  : "border-transparent text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div
          role="tabpanel"
          id={`tabpanel-${activeTab}`}
          aria-labelledby={`tab-${activeTab}`}
          className="py-8"
        >
          {activeTab === "description" && (
            <div className="max-w-3xl">
              <p className="text-[var(--color-text-secondary)] leading-relaxed whitespace-pre-line">
                {product.description}
              </p>
            </div>
          )}

          {activeTab === "specs" && (
            <div className="max-w-3xl">
              {product.specs.length > 0 ? (
                <div className="bg-white rounded-2xl border border-[var(--color-border-light)] overflow-hidden">
                  {product.specs.map((spec, i) => (
                    <div
                      key={spec.key}
                      className={`flex items-center px-5 py-3.5 ${
                        i % 2 === 0 ? "spec-row-even" : "spec-row-odd"
                      } ${i < product.specs.length - 1 ? "border-b border-[var(--color-border-light)]" : ""}`}
                    >
                      <span className="w-2/5 text-sm font-semibold text-[var(--color-text-primary)]">
                        {spec.key}
                      </span>
                      <span className="w-3/5 text-sm text-[var(--color-text-secondary)]">
                        {spec.value}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[var(--color-text-muted)]">
                  Keine technischen Daten verfügbar.
                </p>
              )}
            </div>
          )}

          {activeTab === "shipping" && (
            <div className="max-w-3xl space-y-6">
              <div className="bg-white rounded-2xl border border-[var(--color-border-light)] p-6">
                <h3 className="font-bold text-[var(--color-text-primary)] mb-2 flex items-center gap-2">
                  <Truck className="w-4 h-4 text-[var(--color-primary)]" />
                  Versand
                </h3>
                <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                  Kostenloser Versand innerhalb Deutschlands ab einem
                  Bestellwert von 50€. Unterhalb dieses Bestellwerts betragen
                  die Versandkosten 4,99€.
                </p>
              </div>
              <div className="bg-white rounded-2xl border border-[var(--color-border-light)] p-6">
                <h3 className="font-bold text-[var(--color-text-primary)] mb-2 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-[var(--color-primary)]" />
                  Zahlung
                </h3>
                <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                  Die Zahlung erfolgt ausschließlich per Überweisung (SEPA). Nach
                  Ihrer Bestellung erhalten Sie eine E-Mail mit den
                  Bankverbindungen.
                </p>
              </div>
              <div className="bg-white rounded-2xl border border-[var(--color-border-light)] p-6">
                <h3 className="font-bold text-[var(--color-text-primary)] mb-2 flex items-center gap-2">
                  <RotateCcw className="w-4 h-4 text-[var(--color-primary)]" />
                  Lieferzeit
                </h3>
                <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                  Die Lieferzeit beträgt in der Regel 2-5 Werktage nach Eingang
                  der Zahlung.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Frequently Bought Together */}
      <FrequentlyBoughtTogether
        currentProduct={{ id: product.id, name: product.name, slug: product.slug, price: product.price, image: product.images[0] || "/images/placeholder-product.svg" }}
        products={relatedProducts}
      />

      {/* Recently Viewed */}
      <RecentlyViewedSection currentProductId={product.id} />

      {/* Similar Products */}
      <SimilarProductsSection currentProductId={product.id} categorySlug={product.categorySlug} />

      {/* Sticky mobile add-to-cart bar */}
      <div className="sticky-bottom-bar lg:hidden">
        <div className="flex items-center gap-3 max-w-lg mx-auto px-4 py-3">
          <div className="flex-1 min-w-0">
            <p className="text-[10px] text-[var(--color-text-muted)] truncate">{product.name}</p>
            <p className="font-bold text-sm text-[var(--color-text-primary)]">{formatPrice(product.price)}</p>
          </div>
          <Button
            onClick={handleAddToCart}
            className={`transition-all duration-300 ${added ? "bg-[var(--color-success)] hover:bg-[var(--color-success)]" : ""}`}
            size="sm"
          >
            {added ? (
              <Check className="w-4 h-4" />
            ) : (
              <ShoppingBag className="w-4 h-4" />
            )}
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
