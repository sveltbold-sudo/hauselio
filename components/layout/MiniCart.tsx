"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { ShoppingBag, X, Plus, Minus, ArrowRight } from "lucide-react";
import { useCartStore } from "@/lib/store";
import { formatPrice } from "@/lib/utils";
import ProductImage from "@/components/product/ProductImage";
import Button from "@/components/ui/Button";
import { getShippingCost } from "@/lib/constants";

export default function MiniCart() {
  const [isOpen, setIsOpen] = useState(false);
  const items = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const itemCount = useCartStore((state) => state.getItemCount());
  const total = useCartStore((state) => state.getTotal());
  const ref = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => setIsOpen(false), []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

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
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
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

  useEffect(() => {
    const handleItemAdded = () => setIsOpen(true);
    window.addEventListener("cart:item-added", handleItemAdded);
    return () => window.removeEventListener("cart:item-added", handleItemAdded);
  }, []);

  return (
    <div className="relative" ref={ref}>
      {/* Cart button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-11 h-11 flex items-center justify-center text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] hover:bg-[var(--color-primary-50)] rounded-xl transition-colors duration-200"
        aria-label="Warenkorb"
        aria-expanded={isOpen}
      >
        <ShoppingBag className="w-5 h-5" />
        {itemCount > 0 && (
          <span
            aria-live="polite"
            aria-label={`${itemCount} Artikel im Warenkorb`}
            key={itemCount}
            className="absolute -top-0.5 -right-0.5 min-w-[20px] h-5 bg-[var(--color-primary)] text-white text-xs font-bold rounded-full flex items-center justify-center px-1 animate-bounce-in"
          >
            {itemCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div ref={dropdownRef} className="absolute right-0 top-full mt-2 w-[380px] max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-[var(--shadow-2xl)] border border-[var(--color-border-light)] z-50 animate-scale-in origin-top-right" style={{ transformOrigin: "top right" }} role="dialog" aria-modal="true" aria-label="Warenkorb">
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-[var(--color-border-light)]">
            <h3 className="font-bold text-[var(--color-text-primary)]">
              Warenkorb ({itemCount})
            </h3>
            <button
              onClick={() => setIsOpen(false)}
              aria-label="Warenkorb schließen"
              className="w-11 h-11 flex items-center justify-center text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] rounded-lg hover:bg-gray-100 transition-all focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Items */}
          {items.length === 0 ? (
            <div className="p-10 text-center">
              <ShoppingBag className="w-12 h-12 text-gray-200 mx-auto mb-3" />
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
              <div className="max-h-80 overflow-y-auto p-5 space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-gray-50 border border-[var(--color-border-light)]">
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
                    <div className="flex items-center border border-[var(--color-border)] rounded-lg">
                      <button
                        onClick={() =>
                          updateQuantity(item.id, Math.max(1, item.quantity - 1))
                        }
                        aria-label="Menge verringern"
                        className="w-11 h-11 flex items-center justify-center text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-gray-50 rounded-l-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-10 text-center text-sm font-medium tabular-nums" aria-live="polite">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.id, Math.min(99, item.quantity + 1))
                        }
                        aria-label="Menge erhöhen"
                        className="w-11 h-11 flex items-center justify-center text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-gray-50 rounded-r-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      aria-label="Artikel entfernen"
                      className="p-2 text-[var(--color-text-muted)] hover:text-[var(--color-danger)] rounded-lg hover:bg-[var(--color-danger-light)] transition-all focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="p-5 border-t border-[var(--color-border-light)]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-[var(--color-text-muted)]">Zwischensumme</span>
                  <span className="font-bold text-[var(--color-text-primary)]">
                    {formatPrice(total)}
                  </span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-[var(--color-text-muted)]">Versand</span>
                  <span className="text-sm font-medium text-[var(--color-success)]">
                    {getShippingCost(total) === 0 ? "Kostenlos" : "4,99 €"}
                  </span>
                </div>
                <div className="flex items-center justify-between mb-5 pt-3 border-t border-[var(--color-border-light)]">
                  <span className="font-bold text-[var(--color-text-primary)]">Gesamt</span>
                  <span className="font-bold text-lg text-[var(--color-text-primary)]">
                    {formatPrice(total + getShippingCost(total))}
                  </span>
                </div>
                <Link
                  href="/bestellung"
                  onClick={() => setIsOpen(false)}
                  className="block w-full"
                >
                  <Button variant="secondary" size="lg" className="w-full">
                    Zur Kasse
                  </Button>
                </Link>
                <Link
                  href="/shop"
                  onClick={() => setIsOpen(false)}
                  className="block text-center mt-3 text-sm text-[var(--color-primary)] font-medium hover:underline"
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
