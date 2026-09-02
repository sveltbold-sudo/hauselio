"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, X, Plus, Minus, ArrowRight, Truck } from "lucide-react";
import { useCartStore, selectItemCount, selectTotal } from "@/lib/store";
import { formatPrice } from "@/lib/utils";
import ProductImage from "@/components/product/ProductImage";
import Button from "@/components/ui/Button";
import { useScrollLock } from "@/hooks/useScrollLock";
import { getShippingCost, SHIPPING_COST, FREE_SHIPPING_THRESHOLD } from "@/lib/constants";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export default function MiniCart() {
  const [isOpen, setIsOpen] = useState(false);
  const prefersReduced = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const [bounceKey, setBounceKey] = useState(0);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const items = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const itemCount = useCartStore(selectItemCount);
  const total = useCartStore(selectTotal);
  const ref = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const prevCount = useRef(itemCount);
  useEffect(() => {
    if (itemCount !== prevCount.current) {
      setBounceKey((k) => k + 1);
      prevCount.current = itemCount;
    }
  }, [itemCount]);

  const close = useCallback(() => setIsOpen(false), []);

  useScrollLock(isOpen);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        close();
      }
    };
    if (isOpen) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [isOpen, close]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        close();
        return;
      }
      if (e.key !== "Tab" || !dropdownRef.current) return;
      const focusable = dropdownRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length === 0) return;
      const first = focusable[0]!;
      const last = focusable[focusable.length - 1]!;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, close]);

  const openTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handleItemAdded = () => {
      if (openTimerRef.current) clearTimeout(openTimerRef.current);
      openTimerRef.current = setTimeout(() => setIsOpen(true), 500);
    };
    window.addEventListener("cart:item-added", handleItemAdded);
    return () => {
      window.removeEventListener("cart:item-added", handleItemAdded);
      if (openTimerRef.current) clearTimeout(openTimerRef.current);
    };
  }, []);

  return (
    <div className="relative" ref={ref}>
      {/* Cart button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex items-center gap-2 w-11 lg:w-auto h-11 lg:px-3 justify-center text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] hover:bg-[var(--color-primary-50)] rounded-xl transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--color-primary)]"
        aria-label="Warenkorb"
        aria-expanded={isOpen}
      >
        <ShoppingBag className="w-5 h-5 shrink-0" />
        <span className="hidden lg:inline text-sm font-medium">Warenkorb</span>
        {mounted && itemCount > 0 && (
          <span
            key={bounceKey}
            aria-live="polite"
            aria-label={`${itemCount} Artikel im Warenkorb`}
            className={`absolute -top-0.5 -right-0.5 min-w-[20px] h-5 bg-[var(--color-primary)] text-white text-xs font-bold rounded-full flex items-center justify-center px-1 ${prefersReduced ? "" : "animate-bounce-in"}`}
          >
            {itemCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div ref={dropdownRef} className={`absolute right-0 top-full mt-2 w-[calc(100dvw-2rem)] sm:w-[380px] bg-white rounded-2xl shadow-[var(--shadow-2xl)] border border-[var(--color-border-light)] z-[55] origin-top-right flex flex-col max-h-[80dvh] ${prefersReduced ? "" : "animate-scale-in"}`} role="dialog" aria-modal="true" aria-label="Warenkorb">
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-[var(--color-border-light)] shrink-0">
            <h3 className="font-bold text-[var(--color-text-primary)]">
              Warenkorb ({itemCount})
            </h3>
            <button
              onClick={() => setIsOpen(false)}
              aria-label="Warenkorb schließen"
              className="w-11 h-11 flex items-center justify-center text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] rounded-lg hover:bg-[var(--color-bg-secondary)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Items */}
          {items.length === 0 ? (
            <div className="flex-1 p-10 text-center flex flex-col items-center justify-center">
              <Image
                src="/images/illustrations/empty-cart.svg"
                alt="Leerer Warenkorb"
                width={120}
                height={90}
                className="mx-auto mb-4 opacity-60"
              />
              <p className="text-[var(--color-text-muted)] font-medium">
                Ihr Warenkorb ist leer
              </p>
              <Link
                href="/shop"
                onClick={() => setIsOpen(false)}
                className="inline-flex items-center gap-2 mt-4 text-[var(--color-primary)] font-semibold text-sm hover:underline"
              >
                Jetzt einkaufen
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <>
              <div className="flex-1 min-h-0 overflow-y-auto p-5 space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-[var(--color-bg-secondary)] border border-[var(--color-border-light)]">
                      <ProductImage src={item.image} alt={item.name} size="sm" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-[var(--color-text-primary)] truncate">
                        {item.name}
                      </p>
                      <p className="text-sm text-[var(--color-text-muted)]">
                        {formatPrice(item.price)}
                      </p>
                    </div>
                    <div className="flex items-center border border-[var(--color-border)] rounded-xl">
                      <button
                        onClick={() =>
                          updateQuantity(item.id, Math.max(1, item.quantity - 1))
                        }
                        disabled={item.quantity <= 1}
                        aria-label="Menge verringern"
                        className="min-w-[44px] min-h-[44px] flex items-center justify-center text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-secondary)] rounded-l-xl transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] disabled:opacity-30 disabled:pointer-events-none"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-8 sm:w-10 text-center text-sm font-medium tabular-nums" role="status" aria-live="polite">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.id, Math.min(99, item.quantity + 1))
                        }
                        aria-label="Menge erhöhen"
                        className="min-w-[44px] min-h-[44px] flex items-center justify-center text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-secondary)] rounded-r-xl transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    {confirmDelete === item.id ? (
                      <div className="flex items-center gap-1.5">
                        <button
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
                          onClick={() => setConfirmDelete(null)}
                          aria-label="Abbrechen"
                          className="px-3 py-2 min-h-[44px] text-xs font-semibold text-[var(--color-text-muted)] bg-[var(--color-bg-secondary)] rounded-lg hover:bg-[var(--color-bg-secondary)] transition-colors"
                        >
                          Abbrechen
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setConfirmDelete(item.id)}
                        aria-label="Artikel entfernen"
                        className="min-w-[44px] min-h-[44px] flex items-center justify-center p-2 text-[var(--color-text-muted)] hover:text-[var(--color-danger)] rounded-xl hover:bg-[var(--color-danger-light)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="p-5 border-t border-[var(--color-border-light)] shrink-0">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-[var(--color-text-muted)]">Zwischensumme</span>
                  <span className="font-bold text-[var(--color-text-primary)] tabular-nums">
                    {formatPrice(total)}
                  </span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-[var(--color-text-muted)]">Versand</span>
                  <span className="text-sm font-medium text-[var(--color-success)]">
                    {getShippingCost(total) === 0 ? "Kostenlos" : formatPrice(SHIPPING_COST)}
                  </span>
                </div>
                <div className="flex items-center justify-between mb-5 pt-3 border-t border-[var(--color-border-light)]">
                  <span className="font-bold text-[var(--color-text-primary)]">Gesamt</span>
                  <span className="font-bold text-lg text-[var(--color-text-primary)] tabular-nums">
                    {formatPrice(total + getShippingCost(total))}
                  </span>
                </div>
                {/* Delivery promise */}
                {getShippingCost(total) === 0 ? (
                  <div className="flex items-center justify-center gap-2 mb-4 py-2.5 px-3 bg-[var(--color-success)]/10 rounded-xl text-sm text-[var(--color-success)]">
                    <Truck className="w-4 h-4" aria-hidden="true" />
                    <span className="font-medium">Kostenlose Lieferung</span>
                  </div>
                ) : (
                  <div className="mb-4 py-2.5 px-3 bg-[var(--color-accent)]/10 rounded-xl text-sm text-[var(--color-accent)]">
                    <div className="flex items-center justify-center gap-2 mb-1.5">
                      <Truck className="w-4 h-4" aria-hidden="true" />
                      <span className="font-medium">Noch {formatPrice(FREE_SHIPPING_THRESHOLD - total)} bis zum kostenlosen Versand</span>
                    </div>
                    <div className="w-full bg-[var(--color-accent)]/20 rounded-full h-1.5" role="meter" aria-valuenow={Math.min(100, Math.round((total / FREE_SHIPPING_THRESHOLD) * 100))} aria-valuemin={0} aria-valuemax={100} aria-label="Fortschritt zum kostenlosen Versand">
                      <div className="bg-[var(--color-accent)] h-1.5 rounded-full transition-all duration-500" style={{ width: `${Math.min(100, (total / FREE_SHIPPING_THRESHOLD) * 100)}%` }} />
                    </div>
                  </div>
                )}
                <Link
                  href="/bestellung"
                  onClick={() => setIsOpen(false)}
                  className="block w-full"
                >
                  <Button variant="primary" size="lg" className="w-full">
                    Zur Kasse
                  </Button>
                </Link>
                <Link
                  href="/shop"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center mt-3 py-2 min-h-[44px] text-sm text-[var(--color-primary)] font-medium hover:underline"
                >
                  Weiter einkaufen
                </Link>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
