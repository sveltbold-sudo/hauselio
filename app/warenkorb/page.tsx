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
      <div className="container-hauselio py-24 text-center max-w-2xl mx-auto">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 bg-[var(--color-bg-secondary)] rounded mx-auto" />
          <div className="h-40 bg-[var(--color-bg-secondary)] rounded" />
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container-hauselio py-24 text-center max-w-2xl mx-auto">
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
      </div>
    );
  }

  return (
    <div className="container-hauselio py-6 sm:py-8">
      {/* Header */}
      <div className="mb-6 sm:mb-10">
        <p className="caption text-[var(--color-primary)] mb-3">Einkauf</p>
        <h1 className="heading-1">Warenkorb</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        {/* Cart items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item, i) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-[var(--color-border-light)] p-4 sm:p-5 flex gap-4 sm:gap-5 animate-fade-in-up"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              {/* Image */}
              <div className="w-24 h-24 bg-[var(--color-bg-secondary)] rounded-xl overflow-hidden flex-shrink-0">
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
                  <p className="text-xl font-bold text-[var(--color-text-primary)] tabular-nums">
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
                      className="w-11 h-11 flex items-center justify-center text-[var(--color-text-secondary)] hover:bg-gray-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      -
                    </button>
                    <span className="w-10 text-center font-semibold text-sm border-x border-[var(--color-border)] tabular-nums" aria-live="polite">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      aria-label="Menge erhöhen"
                      className="w-11 h-11 flex items-center justify-center text-[var(--color-text-secondary)] hover:bg-gray-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
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
                        className="px-3 py-2 min-h-[40px] text-xs font-semibold text-white bg-[var(--color-danger)] rounded-lg hover:bg-red-700 transition-colors"
                      >
                        Entfernen
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmDelete(null)}
                        aria-label="Abbrechen"
                        className="px-3 py-2 min-h-[40px] text-xs font-semibold text-[var(--color-text-muted)] bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        Abbruch
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setConfirmDelete(item.id)}
                      aria-label={`${item.name} entfernen`}
                      className="p-3 text-[var(--color-text-muted)] hover:text-[var(--color-danger)] hover:bg-red-50 rounded-xl transition-colors duration-300"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Continue shopping */}
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-primary)] hover:text-[var(--color-primary-dark)] transition-colors mt-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Weiter einkaufen
          </Link>
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-[var(--color-border-light)] p-5 sm:p-6 sticky top-24">
            <h2 className="text-lg font-bold text-[var(--color-text-primary)] mb-6">
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
                  <p className="text-xs text-[var(--color-primary)] font-medium">
                    Noch {formatPrice(FREE_SHIPPING_THRESHOLD - total)} bis zum kostenlosen Versand
                  </p>
                  <div className="mt-2 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[var(--color-primary)] rounded-full transition-transform duration-500"
                      style={{ width: `${Math.min((total / FREE_SHIPPING_THRESHOLD) * 100, 100)}%` }}
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

            <Link href="/bestellung" className="block">
              <Button className="w-full px-7 py-3.5 text-base shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 hover:shadow-xl">
                <CreditCard className="w-5 h-5" />
                Zur Kasse
              </Button>
            </Link>

            {/* Trust badges */}
            <div className="mt-6 space-y-3">
              <div className="flex items-center gap-3 text-xs text-[var(--color-text-muted)]">
                <Truck className="w-4 h-4 text-[var(--color-success)]" />
                <DeliveryEstimate />
              </div>
              <div className="flex items-center gap-3 text-xs text-[var(--color-text-muted)]">
                <Truck className="w-4 h-4 text-[var(--color-success)]" />
                <span>Kostenloser Versand ab 50€</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-[var(--color-text-muted)]">
                <Shield className="w-4 h-4 text-[var(--color-success)]" />
                <span>Sichere Zahlung</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <CartCrossSell />
    </div>
  );
}
