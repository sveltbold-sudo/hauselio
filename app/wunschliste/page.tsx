"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ShoppingBag, Trash2, Heart, ArrowLeft } from "lucide-react";
import Button from "@/components/ui/Button";
import ProductImage from "@/components/product/ProductImage";
import CompareButton from "@/components/product/CompareButton";
import { formatPrice, calcDiscount } from "@/lib/utils";
import { useWishlistStore, type WishlistItem } from "@/lib/wishlist";
import { useCartStore } from "@/lib/store";
import { useToast } from "@/components/ui/Toast";
import Breadcrumb from "@/components/ui/Breadcrumb";

export default function WunschlistePage() {
  const [mounted, setMounted] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const toast = useToast();
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    setMounted(true);
    // Read initial state from store
    setWishlistItems(useWishlistStore.getState().items);

    // Subscribe to store changes
    const unsub = useWishlistStore.subscribe((state) => {
      setWishlistItems(state.items);
    });
    return unsub;
  }, []);

  const removeItem = useCallback((id: string) => {
    useWishlistStore.getState().removeItem(id);
  }, []);

  const clearAll = useCallback(() => {
    useWishlistStore.getState().clearWishlist();
  }, []);

  if (!mounted) {
    return (
      <main id="main-content" className="container-hausaura py-24 text-center max-w-2xl mx-auto">
        <h1 className="heading-2 mb-4">Wunschliste</h1>
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 bg-[var(--color-bg-secondary)] rounded-xl mx-auto" />
          <div className="h-40 bg-[var(--color-bg-secondary)] rounded-xl" />
        </div>
      </main>
    );
  }

  if (wishlistItems.length === 0) {
    return (
      <main id="main-content" className="container-hausaura py-24 text-center max-w-2xl mx-auto">
        <Heart className="w-20 h-20 text-[var(--color-border)] mx-auto mb-6" />
        <h1 className="heading-2 mb-4">Ihre Wunschliste ist leer</h1>
        <p className="body-large mb-10">
          Speichern Sie Produkte, um sie später anzusehen oder zu kaufen.
        </p>
        <Link href="/shop">
          <Button size="lg">
            <ShoppingBag className="w-5 h-5 mr-2" />
            Produkte entdecken
          </Button>
        </Link>
      </main>
    );
  }

  return (
    <main id="main-content" className="container-hausaura py-6 sm:py-8 pb-20 lg:pb-8">
      <Breadcrumb items={[{ label: "Shop", href: "/shop" }, { label: "Wunschliste" }]} />

      {/* Header */}
      <div className="flex items-center justify-between mb-6 sm:mb-10">
        <div>
          <p className="caption text-[var(--color-primary)] mb-3">Merkliste</p>
          <h1 className="heading-1 mb-4">Wunschliste</h1>
          <p className="text-sm text-[var(--color-text-muted)] mt-1">
            {wishlistItems.length} {wishlistItems.length === 1 ? "Produkt" : "Produkte"}
          </p>
        </div>
        {confirmClear ? (
          <div className="flex items-center gap-2">
            <span className="text-sm text-[var(--color-danger)]">Wirklich alle entfernen?</span>
            <button
              onClick={() => { clearAll(); setConfirmClear(false); toast.success("Wunschliste geleert"); }}
              className="px-3 py-2 min-h-[44px] text-xs font-semibold text-white bg-[var(--color-danger)] rounded-lg hover:bg-[var(--color-danger-hover)] transition-colors"
            >
              Ja
            </button>
            <button
              onClick={() => setConfirmClear(false)}
              className="px-3 py-2 min-h-[44px] text-xs font-semibold text-[var(--color-text-muted)] bg-[var(--color-bg-secondary)] rounded-lg hover:bg-[var(--color-bg-secondary)] transition-colors"
            >
              Nein
            </button>
          </div>
        ) : (
          <button
            onClick={() => setConfirmClear(true)}
            className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-danger)] transition-colors p-2 min-h-[44px]"
          >
            Alle entfernen
          </button>
        )}
      </div>

      {/* Items grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {wishlistItems.map((item, i) => {
          const discount = calcDiscount(item.price, item.originalPrice ?? null);
          return (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-[var(--color-border-light)] overflow-hidden animate-fade-in-up"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              {/* Image */}
              <Link href={`/produkt/${item.slug}`} className="block relative aspect-square bg-[var(--color-bg-secondary)] p-4">
                <ProductImage src={item.image} alt={item.name} size="md" />
                {discount > 0 && (
                  <span className="absolute top-3 left-3 inline-flex items-center px-2 py-0.5 bg-[var(--color-danger)] text-white text-xs font-bold rounded-lg">
                    -{discount}%
                  </span>
                )}
              </Link>

              {/* Content */}
              <div className="p-4">
                {item.brand && (
                  <p className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)] mb-1" translate="no">
                    {item.brand}
                  </p>
                )}
                <Link href={`/produkt/${item.slug}`} className="font-semibold text-sm text-[var(--color-text-primary)] hover:text-[var(--color-primary)] transition-colors line-clamp-2 block mb-2">
                  {item.name}
                </Link>

                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-lg font-extrabold text-[var(--color-text-primary)] tabular-nums">
                    {formatPrice(item.price)}
                  </span>
                  {item.originalPrice && item.originalPrice > item.price && (
                    <span className="text-xs text-[var(--color-text-muted)] line-through">
                      {formatPrice(item.originalPrice)}
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button
                    onClick={() => {
                      addItem({
                        id: item.id,
                        name: item.name,
                        slug: item.slug,
                        price: item.price,
                        originalPrice: item.originalPrice,
                        image: item.image,
                        brand: item.brand ?? "",
                        categorySlug: item.categorySlug,
                      });
                      window.dispatchEvent(new CustomEvent("cart:item-added"));
                      toast.success("Zum Warenkorb hinzugefügt!");
                    }}
                    className="flex-1"
                    size="sm"
                  >
                    <ShoppingBag className="w-4 h-4 mr-1.5" />
                    In den Warenkorb
                  </Button>
                  <CompareButton
                    product={{
                      id: item.id,
                      name: item.name,
                      slug: item.slug,
                      price: item.price,
                      originalPrice: item.originalPrice,
                      image: item.image,
                      brand: item.brand ?? "",
                      rating: item.rating,
                      reviewCount: item.reviewCount,
                    }}
                  />
                  <button
                    onClick={() => {
                      removeItem(item.id);
                      toast.success("Von Wunschliste entfernt");
                    }}
                    aria-label={`${item.name} von Wunschliste entfernen`}
                    className="p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center text-[var(--color-text-muted)] hover:text-[var(--color-danger)] hover:bg-[var(--color-danger-light)] rounded-xl transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Continue shopping */}
      <Link
        href="/shop"
        className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] transition-colors mt-8"
      >
        <ArrowLeft className="w-4 h-4" />
        Weiter einkaufen
      </Link>
    </main>
  );
}
