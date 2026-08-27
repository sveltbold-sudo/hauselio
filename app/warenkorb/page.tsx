"use client";
import { useState, useEffect } from "react";

import Link from "next/link";
import Image from "next/image";
import { Trash2, ShoppingBag, ArrowLeft, Truck, Shield, CreditCard } from "lucide-react";
import Button from "@/components/ui/Button";
import ProductImage from "@/components/product/ProductImage";
import CartCrossSell from "@/components/product/CartCrossSell";
import { formatPrice } from "@/lib/utils";
import { useCartStore, selectItemCount, selectTotal } from "@/lib/store";
import { getShippingCost, FREE_SHIPPING_THRESHOLD } from "@/lib/constants";
import DeliveryEstimate from "@/components/product/DeliveryEstimate";

export default function WarenkorbPage() {
  const { items, removeItem, updateQuantity } = useCartStore();
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const total = useCartStore(selectTotal);
  const itemCount = useCartStore(selectItemCount);

  useEffect(() => {
    setMounted(true);
  }, []);
  const totalSavings = items.reduce((sum, item) => {
    if (item.originalPrice && item.originalPrice > item.price) {
      return sum + (item.originalPrice - item.price) * item.quantity;
    }
    return sum;
  }, 0);
  const shippingCost = getShippingCost(total);
  const finalTotal = total + shippingCost;

  if (!mounted) {
    return (
      <main className="container-hauselio py-24 text-center max-w-2xl mx-auto">
        <h1 className="heading-2 mb-4 sr-only">Warenkorb</h1>
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 bg-[var(--color-bg-secondary)] rounded-xl mx-auto" />
          <div className="h-40 bg-[var(--color-bg-secondary)] rounded-xl" />
        </div>
      </main>
    );
  }

  if (items.length === 0) {
    return (
      <main className="container-hauselio py-24 text-center max-w-2xl mx-auto">
        <Image
          src="/images/illustrations/empty-cart.svg"
          alt="Leerer Warenkorb"
          width={300}
          height={225}
          className="mx-auto mb-8"
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
      </main>
    );
  }

  return (
    <main id="main-content" className="container-hauselio py-6 sm:py-8 pb-20 lg:pb-8">
      {/* Header */}
      <div className="mb-6 sm:mb-10">
        <p className="caption text-[var(--color-primary)] mb-3">Einkauf</p>
        <h1 className="heading-1">Warenkorb</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        {/* Cart items */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="sr-only">Artikel im Warenkorb</h2>
          <ul className="space-y-4">
          {items.map((item, i) => (
            <li
              key={item.id}
              className="bg-white rounded-2xl border border-[var(--color-border-light)] p-4 sm:p-5 flex gap-4 sm:gap-5 animate-fade-in-up list-none"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              {/* Image */}
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-[var(--color-bg-secondary)] rounded-xl overflow-hidden flex-shrink-0">
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
                    <span className="w-10 text-center font-semibold text-sm border-x border-[var(--color-border)] tabular-nums" aria-live="polite" aria-label={`${item.quantity} Stück`}>
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      aria-label="Menge erhöhen"
                      className="w-11 h-11 flex items-center justify-center text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
                    >
                      +
                    </button>
                  </div>

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
                        className="px-3 py-2 min-h-[44px] text-xs font-semibold text-white bg-[var(--color-danger)] rounded-lg hover:bg-red-700 transition-colors"
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
          <div className="bg-white rounded-2xl border border-[var(--color-border-light)] p-5 sm:p-6 sticky top-24">
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
                      className="h-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] rounded-full transition-all duration-500"
                      style={{ width: `${Math.min((total / FREE_SHIPPING_THRESHOLD) * 100, 100)}%` }}
                      role="meter"
                      aria-valuenow={Math.min((total / FREE_SHIPPING_THRESHOLD) * 100, 100)}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-label="Fortschritt zum kostenlosen Versand"
                    />
                  </div>
                </div>
              )}
              <div className="border-t border-[var(--color-border-light)] pt-3">
                <div className="flex justify-between">
                  <span className="font-semibold text-[var(--color-text-primary)]">Gesamt</span>
                  <span className="font-bold text-2xl text-[var(--color-text-primary)] tabular-nums">
                    {formatPrice(finalTotal)}
                  </span>
                </div>
                <p className="text-xs text-[var(--color-text-muted)] mt-1">inkl. 19% MwSt.</p>
              </div>
            </div>

            {/* Gutschein input */}
            <div className="mb-4">
              <label htmlFor="gutschein" className="sr-only">Gutscheincode</label>
              <div className="flex gap-2">
                <input
                  id="gutschein"
                  type="text"
                  placeholder="Gutscheincode eingeben"
                  className="flex-1 px-4 py-3 bg-[var(--color-bg-secondary)] border border-[var(--color-border-light)] rounded-xl text-sm placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                />
                <button
                  type="button"
                  className="px-4 py-3 bg-[var(--color-bg-secondary)] border border-[var(--color-border-light)] rounded-xl text-sm font-medium text-[var(--color-text-secondary)] hover:bg-[var(--color-border-light)] transition-colors"
                >
                  Anwenden
                </button>
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
                {["Vorkasse", "PayPal", "Klarna", "Visa", "Mastercard"].map((method) => (
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
