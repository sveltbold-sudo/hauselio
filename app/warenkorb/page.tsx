"use client";
import { useState, useEffect } from "react";

import Link from "next/link";
import Image from "next/image";
import { Trash2, ShoppingBag, ArrowLeft, Truck, Shield, CreditCard, Tag, Heart } from "lucide-react";
import Button from "@/components/ui/Button";
import ProductImage from "@/components/product/ProductImage";
import CartCrossSell from "@/components/product/CartCrossSell";
import PopularProducts from "@/components/product/PopularProducts";
import { formatPrice } from "@/lib/utils";
import { useCartStore, selectItemCount, selectTotal } from "@/lib/store";
import { useWishlistStore } from "@/lib/wishlist";
import { getShippingCost, FREE_SHIPPING_THRESHOLD } from "@/lib/constants";
import DeliveryEstimate from "@/components/product/DeliveryEstimate";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { useToast } from "@/components/ui/Toast";

export default function WarenkorbPage() {
  const { items, removeItem, updateQuantity, coupon, applyCoupon, removeCoupon } = useCartStore();
  const { addItem: addWishlistItem, isInWishlist } = useWishlistStore();
  const toast = useToast();
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [confirmSave, setConfirmSave] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [couponError, setCouponError] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);
  const total = useCartStore(selectTotal);
  const itemCount = useCartStore(selectItemCount);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!coupon || !mounted) return;
    const controller = new AbortController();
    fetch("/api/coupon", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: coupon.code, cartTotal: total }),
      signal: controller.signal,
    })
      .then((r) => r.json())
      .then((data) => {
        if (!data.valid) {
          removeCoupon();
          toast.info("Gutscheincode ist nicht mehr gültig");
        }
      })
      .catch(() => {});
    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted, coupon?.code, total]);
  const totalSavings = items.reduce((sum, item) => {
    if (item.originalPrice && item.originalPrice > item.price) {
      return sum + (item.originalPrice - item.price) * item.quantity;
    }
    return sum;
  }, 0);
  const shippingCost = getShippingCost(total);
  const couponDiscount = coupon ? total * (coupon.discountPercent / 100) : 0;
  const finalTotal = total - couponDiscount + shippingCost;

  if (!mounted) {
    return (
      <main id="main-content" className="container-hausaura py-24 text-center max-w-2xl mx-auto">
        <h1 className="heading-2 mb-4">Warenkorb</h1>
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 bg-[var(--color-bg-secondary)] rounded-xl mx-auto" />
          <div className="h-40 bg-[var(--color-bg-secondary)] rounded-xl" />
        </div>
      </main>
    );
  }

  if (items.length === 0) {
    return (
      <main id="main-content" className="container-hausaura py-24 text-center max-w-2xl mx-auto">
        <Image
          src="/images/illustrations/empty-cart.svg"
          alt="Leerer Warenkorb"
          width={300}
          height={225}
          className="mx-auto mb-8 max-w-full h-auto"
        />
        <h1 className="heading-2 mb-4">Ihr Warenkorb ist leer</h1>
        <p className="body-large mb-10">
          Fügen Sie Produkte hinzu, um mit dem Einkaufen zu beginnen.
        </p>
        <Link href="/shop">
          <Button size="lg">
            <ShoppingBag className="w-5 h-5 mr-2" />
            Jetzt einkaufen
          </Button>
        </Link>

        <PopularProducts />
      </main>
    );
  }

  return (
    <main id="main-content" className="container-hausaura py-6 sm:py-8 md:py-10 lg:py-12">
      <Breadcrumb items={[{ label: "Shop", href: "/shop" }, { label: "Warenkorb" }]} />

      {/* Header */}
      <div className="mb-6 sm:mb-10">
        <p className="caption text-[var(--color-primary)] mb-3">Einkauf</p>
        <h1 className="heading-1 mb-4">Warenkorb</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        {/* Cart items */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="sr-only">Artikel im Warenkorb</h2>
          <ul className="space-y-4">
          {items.map((item, i) => (
            <li
              key={item.id}
              className="bg-white rounded-2xl border border-[var(--color-border-light)] p-4 sm:p-5 lg:p-6 flex gap-4 sm:gap-5 animate-fade-in-up list-none"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              {/* Image */}
              <div className="w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 bg-[var(--color-bg-secondary)] rounded-xl overflow-hidden flex-shrink-0">
                <ProductImage
                  src={item.image}
                  alt={item.name}
                  size="sm"
                />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <Link
                  href={`/produkt/${item.slug}`}
                  className="font-semibold text-[var(--color-text-primary)] hover:text-[var(--color-primary)] transition-colors line-clamp-1"
                >
                  {item.name}
                </Link>
                <div className="flex items-baseline gap-2 mt-1">
                  <p className="text-lg font-bold text-[var(--color-text-primary)] tabular-nums">
                    {formatPrice(item.price)}
                  </p>
                  {item.originalPrice && item.originalPrice > item.price && (
                    <span className="text-xs text-[var(--color-text-muted)] line-through">
                      {formatPrice(item.originalPrice)}
                    </span>
                  )}
                </div>
                {item.quantity > 1 && (
                  <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
                    {item.quantity} × {formatPrice(item.price)} = {formatPrice(item.price * item.quantity)}
                  </p>
                )}

                <div className="flex items-center justify-between mt-4">
                  {/* Quantity */}
                  <div role="group" aria-label="Artikelmenge" className="flex items-center border border-[var(--color-border)] rounded-xl overflow-hidden">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                      aria-label="Menge verringern"
                      className="w-11 h-11 flex items-center justify-center text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      -
                    </button>
                    <span className="w-10 text-center font-semibold text-sm border-x border-[var(--color-border)] tabular-nums" role="status" aria-live="polite" aria-label={`${item.quantity} Stück`}>
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      disabled={item.quantity >= 99}
                      aria-label="Menge erhöhen"
                      className="w-11 h-11 flex items-center justify-center text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      +
                    </button>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1">
                    {/* Save for later */}
                    {confirmSave === item.id ? (
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            const alreadyInWishlist = isInWishlist(item.id);
                            if (!alreadyInWishlist) {
                              addWishlistItem({
                                id: item.id,
                                name: item.name,
                                slug: item.slug,
                                price: item.price,
                                originalPrice: item.originalPrice,
                                image: item.image,
                                brand: item.brand ?? "",
                                rating: 0,
                                reviewCount: 0,
                              });
                            }
                            removeItem(item.id);
                            setConfirmSave(null);
                            toast.success(alreadyInWishlist ? "Bereits auf der Wunschliste" : "Zur Wunschliste verschoben");
                          }}
                          aria-label="Zur Wunschliste verschieben bestätigen"
                          className="px-3 py-2 min-h-[44px] text-xs font-semibold text-white bg-[var(--color-primary)] rounded-lg hover:bg-[var(--color-primary-hover)] transition-colors"
                        >
                          Verschieben
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmSave(null)}
                          aria-label="Abbrechen"
                          className="px-3 py-2 min-h-[44px] text-xs font-semibold text-[var(--color-text-muted)] bg-[var(--color-bg-secondary)] rounded-lg hover:bg-[var(--color-bg-secondary)] transition-colors"
                        >
                          Abbrechen
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setConfirmSave(item.id)}
                        aria-label={isInWishlist(item.id) ? "Bereits auf der Wunschliste" : "Für später speichern"}
                        className={`p-3 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl transition-colors duration-300 ${
                          isInWishlist(item.id)
                            ? "text-[var(--color-danger)] bg-[var(--color-danger-light)]"
                            : "text-[var(--color-text-muted)] hover:text-[var(--color-primary)] hover:bg-[var(--color-primary)]/10"
                        }`}
                      >
                        <Heart className={`w-4 h-4 ${isInWishlist(item.id) ? "fill-current" : ""}`} />
                      </button>
                    )}

                    {/* Remove */}
                    {confirmDelete === item.id ? (
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            removeItem(item.id);
                            setConfirmDelete(null);
                          }}
                          aria-label={`${item.name} entfernen bestätigen`}
                          className="px-3 py-2 min-h-[44px] text-xs font-semibold text-white bg-[var(--color-danger)] rounded-lg hover:bg-[var(--color-danger-hover)] transition-colors"
                        >
                          Entfernen
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmDelete(null)}
                          aria-label="Abbrechen"
                          className="px-3 py-2 min-h-[44px] text-xs font-semibold text-[var(--color-text-muted)] bg-[var(--color-bg-secondary)] rounded-lg hover:bg-[var(--color-bg-secondary)] transition-colors"
                        >
                          Abbruch
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setConfirmDelete(item.id)}
                        aria-label={`${item.name} entfernen`}
                        className="p-3 min-w-[44px] min-h-[44px] flex items-center justify-center text-[var(--color-text-muted)] hover:text-[var(--color-danger)] hover:bg-[var(--color-danger-light)] rounded-xl transition-colors duration-300"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </li>
          ))}
          </ul>

          {/* Continue shopping */}
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] transition-colors mt-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Weiter einkaufen
          </Link>
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-[var(--color-border-light)] p-5 sm:p-6 lg:sticky lg:top-24">
            <h2 className="heading-3 mb-6">
              Zusammenfassung
            </h2>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-[var(--color-text-secondary)]">
                  Zwischensumme ({itemCount} Artikel)
                </span>
                <span className="font-semibold">{formatPrice(total)}</span>
              </div>
              {totalSavings > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--color-success)]">Ersparnis</span>
                  <span className="font-semibold text-[var(--color-success)]">-{formatPrice(totalSavings)}</span>
                </div>
              )}

              {/* Coupon code */}
              <div className="pt-2">
                {coupon ? (
                  <div className="flex items-center justify-between bg-[var(--color-success)]/10 rounded-xl px-3 py-2.5">
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4 text-[var(--color-success)]" />
                      <span className="text-sm font-semibold text-[var(--color-success)]">Gutschein angewendet!</span>
                    </div>
                    <button
                      onClick={() => { removeCoupon(); setCouponCode(""); setCouponError(""); }}
                      className="min-h-[44px] px-3 py-2 text-xs text-[var(--color-text-muted)] hover:text-[var(--color-danger)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
                    >
                      Entfernen
                    </button>
                  </div>
                ) : (
                  <div>
                    <div className="flex gap-2">
                      <div className="flex-1 relative">
                        <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" />
                        <input
                          type="text"
                          value={couponCode}
                          onChange={(e) => { setCouponCode(e.target.value.toUpperCase()); setCouponError(""); }}
                          placeholder="Gutscheincode"
                          aria-label="Gutscheincode"
                          aria-invalid={!!couponError}
                          aria-describedby={couponError ? "coupon-error" : undefined}
                          className="w-full pl-9 pr-3 py-2.5 border border-[var(--color-border)] rounded-xl text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus:border-[var(--color-primary)] transition-colors"
                        />
                      </div>
                      <button
                        onClick={async () => {
                          if (!couponCode.trim()) return;
                          setCouponLoading(true);
                          setCouponError("");
                          try {
                            const res = await fetch("/api/coupon", {
                              method: "POST",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({ code: couponCode.trim(), cartTotal: total }),
                            });
                            const data = await res.json();
                            if (data.valid) {
                              applyCoupon({ code: data.code, discountPercent: data.discountPercent, label: data.label });
                              setCouponError("");
                            } else {
                              setCouponError(data.error || "Ungültiger Gutscheincode");
                            }
                          } catch {
                            setCouponError("Fehler bei der Gutscheinprüfung");
                          } finally {
                            setCouponLoading(false);
                          }
                        }}
                        disabled={!couponCode.trim() || couponLoading}
                        className="px-4 py-2.5 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-xl text-sm font-semibold text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-tertiary)] hover:text-[var(--color-text-primary)] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        {couponLoading ? "Prüfe…" : "Anwenden"}
                      </button>
                    </div>
                    {couponError && (
                      <p id="coupon-error" className="text-xs text-[var(--color-danger)] mt-1.5" role="alert">{couponError}</p>
                    )}
                  </div>
                )}
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-[var(--color-text-secondary)]">Versand</span>
                <span className="font-semibold">
                  {shippingCost === 0 ? (
                    <span className="text-[var(--color-success)]">Kostenlos</span>
                  ) : (
                    formatPrice(shippingCost)
                  )}
                </span>
              </div>
              {shippingCost > 0 && (
                  <div className="bg-[var(--color-primary-50)] rounded-xl p-3">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-xs text-[var(--color-primary)] font-medium">
                      Noch {formatPrice(FREE_SHIPPING_THRESHOLD - total)} bis zum kostenlosen Versand
                    </p>
                    <span className="text-xs font-bold text-[var(--color-primary)]">
                      {Math.round((total / FREE_SHIPPING_THRESHOLD) * 100)}%
                    </span>
                  </div>
                  <div className="h-2 bg-[var(--color-border-light)] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] rounded-full transition-[width] duration-500"
                      style={{ width: `${Math.min((total / FREE_SHIPPING_THRESHOLD) * 100, 100)}%` }}
                      role="meter"
                      aria-valuenow={Math.min((total / FREE_SHIPPING_THRESHOLD) * 100, 100)}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-label="Fortschritt zum kostenlosen Versand"
                      aria-valuetext={`${Math.round((total / FREE_SHIPPING_THRESHOLD) * 100)} Prozent`}
                    />
                  </div>
                </div>
              )}
              <div className="border-t border-[var(--color-border-light)] pt-3">
                {coupon && (
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-[var(--color-success)]">Rabatt ({coupon.label})</span>
                    <span className="font-semibold text-[var(--color-success)]">-{formatPrice(couponDiscount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="font-semibold text-[var(--color-text-primary)]">Gesamt</span>
                  <span className="font-bold text-2xl text-[var(--color-text-primary)] tabular-nums">
                    {formatPrice(finalTotal)}
                  </span>
                </div>
                <p className="text-xs text-[var(--color-text-muted)] mt-1">inkl. 19% MwSt.</p>
              </div>
            </div>

            <Link href="/bestellung" className="block">
              <Button className="w-full px-7 py-3.5 text-base shadow-lg shadow-[var(--color-primary)]/20 hover:shadow-[var(--color-primary)]/30 hover:shadow-xl">
                <CreditCard className="w-5 h-5" />
                Zur Kasse
              </Button>
            </Link>

            {/* Trust badges */}
            <ul className="mt-6 space-y-3 list-none">
              <li className="flex items-center gap-3 text-xs text-[var(--color-text-muted)]">
                <Truck className="w-4 h-4 text-[var(--color-success)]" />
                <DeliveryEstimate />
              </li>
              <li className="flex items-center gap-3 text-xs text-[var(--color-text-muted)]">
                <Truck className="w-4 h-4 text-[var(--color-success)]" />
                <span>Kostenloser Versand ab 50€</span>
              </li>
              <li className="flex items-center gap-3 text-xs text-[var(--color-text-muted)]">
                <Shield className="w-4 h-4 text-[var(--color-success)]" />
                <span>Sichere Zahlung</span>
              </li>
            </ul>

            {/* Payment methods */}
            <div className="mt-4 pt-4 border-t border-[var(--color-border-light)]">
              <p className="text-xs text-[var(--color-text-muted)] mb-2">Sicher bezahlen mit:</p>
              <div className="flex flex-wrap gap-2">
                {["Überweisung (Vorkasse)"].map((method) => (
                  <span
                    key={method}
                    className="px-2 py-1 bg-[var(--color-bg-secondary)] border border-[var(--color-border-light)] rounded text-xs font-medium text-[var(--color-text-muted)]"
                  >
                    {method}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <CartCrossSell />

      {/* Sticky mobile checkout button */}
      <div className="fixed bottom-14 left-0 right-0 z-[80] lg:hidden bg-white border-t border-[var(--color-border-light)] p-4 pb-[env(safe-area-inset-bottom,0px)]">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-[var(--color-text-muted)]">Gesamt:</span>
          <span className="font-bold text-lg text-[var(--color-text-primary)] tabular-nums">
            {formatPrice(finalTotal)}
          </span>
        </div>
        <Link href="/bestellung" className="block">
          <Button className="w-full py-3.5 text-base shadow-lg shadow-[var(--color-primary)]/20">
            <CreditCard className="w-5 h-5" />
            Zur Kasse
          </Button>
        </Link>
      </div>
    </main>
  );
}
