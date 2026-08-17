"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, Share2, Star, Truck, Shield, Check, Minus, Plus } from "lucide-react";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import ProductImage from "@/components/product/ProductImage";
import { formatPrice, calcDiscount } from "@/lib/utils";
import { useCartStore } from "@/lib/store";
import { useToast } from "@/components/ui/Toast";

interface ProductSpec {
  key: string;
  value: string;
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

export default function ProductPageClient({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<"description" | "specs" | "shipping">("description");
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [added, setAdded] = useState(false);
  const addItem = useCartStore((state) => state.addItem);
  const toast = useToast();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

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
    timeoutRef.current = setTimeout(() => setAdded(false), 2000);
  };

  const handleShare = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    if (navigator.share) {
      try {
        await navigator.share({ title: product.name, url });
      } catch {
        // User cancelled or error — silently ignore
      }
    } else if (navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(url);
      } catch {
        // Clipboard API unavailable
      }
    }
  };

  return (
    <div className="container-hauselio py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-[var(--color-text-muted)] mb-8">
        <Link href="/" className="hover:text-[var(--color-primary)] transition-colors">
          Startseite
        </Link>
        <span>/</span>
        <Link href="/shop" className="hover:text-[var(--color-primary)] transition-colors">
          Boutique
        </Link>
        <span>/</span>
        <Link
          href={`/kategorie/${product.categorySlug}`}
          className="hover:text-[var(--color-primary)] transition-colors"
        >
          {product.categoryName}
        </Link>
        <span>/</span>
        <span className="text-[var(--color-text-primary)] font-medium">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
        {/* Images */}
        <div className="animate-fade-in-up">
          <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl overflow-hidden mb-4 border border-[var(--color-border-light)]">
            <ProductImage
              src={product.images[activeImageIndex] || product.images[0]}
              alt={product.name}
              brand={product.brand}
              size="lg"
              priority
            />
          </div>
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-3">
              {product.images.slice(0, 4).map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImageIndex(i)}
                  aria-label={`${product.name} Bild ${i + 1} anzeigen`}
                  className={`aspect-square bg-gray-50 rounded-xl flex items-center border-2 overflow-hidden transition-colors ${
                    activeImageIndex === i
                      ? "border-[var(--color-primary)]"
                      : "border-transparent hover:border-[var(--color-border)]"
                  }`}
                >
                  <Image
                    src={img}
                    alt={`${product.name} ${i + 1}`}
                    width={96}
                    height={96}
                    className="w-full h-full object-contain p-2"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product info */}
        <div className="animate-fade-in-up delay-100">
          {/* Badges */}
          <div className="flex items-center gap-2 mb-3">
            {product.isNew && <Badge variant="primary">Neu</Badge>}
            {discount > 0 && <Badge variant="promo">-{discount}%</Badge>}
          </div>

          {/* Brand */}
          {product.brand && (
            <p className="text-sm font-semibold text-[var(--color-primary)] uppercase tracking-wider mb-2">
              {product.brand}
            </p>
          )}

          {/* Name */}
          <h1 className="heading-2 mb-3">{product.name}</h1>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-6">
            <div className="flex items-center" role="img" aria-label={`${product.rating} von 5 Sternen`}>
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  aria-hidden="true"
                  className={`w-5 h-5 ${
                    i < Math.floor(product.rating)
                      ? "text-amber-400 fill-amber-400"
                      : "text-gray-200"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-[var(--color-text-secondary)]">
              {product.rating} ({product.reviewCount} Bewertungen)
            </span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3 mb-6">
            <span className="text-3xl font-bold text-[var(--color-text-primary)]">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-lg text-[var(--color-text-muted)] line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>

          {/* Stock */}
          <div className="flex items-center gap-2 mb-6">
            <span
              className={`w-2 h-2 rounded-full ${
                product.inStock ? "bg-[var(--color-success)]" : "bg-[var(--color-danger)]"
              }`}
            />
            <span
              className={`text-sm font-medium ${
                product.inStock ? "text-[var(--color-success)]" : "text-[var(--color-danger)]"
              }`}
            >
              {product.inStock ? "Auf Lager" : "Nicht verfügbar"}
            </span>
          </div>

          {/* Quantity & Add to cart */}
          {product.inStock && (
            <div className="flex items-center gap-4 mb-8">
              <div className="flex items-center border border-[var(--color-border)] rounded-xl">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  aria-label="Menge verringern"
                  className="p-3 text-[var(--color-text-secondary)] hover:bg-gray-50 transition-colors rounded-l-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-5 py-3 font-semibold tabular-nums min-w-[48px] text-center" aria-live="polite">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(99, quantity + 1))}
                  aria-label="Menge erhöhen"
                  className="p-3 text-[var(--color-text-secondary)] hover:bg-gray-50 transition-colors rounded-r-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <Button
                onClick={handleAddToCart}
                className={`flex-1 transition-all duration-300 ${added ? "bg-[var(--color-success)] hover:bg-[var(--color-success)]" : ""}`}
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
          )}

          {/* Actions */}
          <div className="flex items-center gap-4 mb-8">
            <button
              onClick={handleShare}
              className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors"
            >
              <Share2 className="w-4 h-4" />
              Teilen
            </button>
          </div>

          {/* Trust badges */}
          <div className="bg-[var(--color-primary-50)] rounded-xl p-5 space-y-3">
            <div className="flex items-center gap-3">
              <Truck className="w-5 h-5 text-[var(--color-success)]" />
              <span className="text-sm text-[var(--color-text-secondary)]">
                Schneller Versand innerhalb Deutschlands
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-[var(--color-success)]" />
              <span className="text-sm text-[var(--color-text-secondary)]">
                Sichere Zahlung per Überweisung
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Check className="w-5 h-5 text-[var(--color-success)]" />
              <span className="text-sm text-[var(--color-text-secondary)]">
                14 Tage Widerrufsrecht
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-16">
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
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-all duration-300 whitespace-nowrap ${
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
            <div className="prose prose-gray max-w-none">
              <p className="text-[var(--color-text-secondary)] leading-relaxed">
                {product.description}
              </p>
            </div>
          )}

          {activeTab === "specs" && (
            <div className="space-y-0">
              {product.specs.length > 0 ? (
                product.specs.map((spec, i) => (
                  <div
                    key={spec.key}
                    className={`flex items-center py-3 ${
                      i < product.specs.length - 1 ? "border-b border-[var(--color-border-light)]" : ""
                    }`}
                  >
                    <span className="w-1/3 text-sm font-medium text-[var(--color-text-primary)]">
                      {spec.key}
                    </span>
                    <span className="w-2/3 text-sm text-[var(--color-text-secondary)]">
                      {spec.value}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-[var(--color-text-muted)]">
                  Keine technischen Daten verfügbar.
                </p>
              )}
            </div>
          )}

          {activeTab === "shipping" && (
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-[var(--color-text-primary)] mb-2">Versand</h3>
                <p className="text-sm text-[var(--color-text-secondary)]">
                  Kostenloser Versand innerhalb Deutschlands ab einem
                  Bestellwert von 50€. Unterhalb dieses Bestellwerts betragen
                  die Versandkosten 4,99€.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-[var(--color-text-primary)] mb-2">Zahlung</h3>
                <p className="text-sm text-[var(--color-text-secondary)]">
                  Die Zahlung erfolgt ausschließlich per Überweisung (SEPA). Nach
                  Ihrer Bestellung erhalten Sie eine E-Mail mit den
                  Bankverbindungen.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-[var(--color-text-primary)] mb-2">Lieferzeit</h3>
                <p className="text-sm text-[var(--color-text-secondary)]">
                  Die Lieferzeit beträgt in der Regel 2-5 Werktage nach Eingang
                  der Zahlung.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
