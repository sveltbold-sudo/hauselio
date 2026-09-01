"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { BarChart3, X, Trash2 } from "lucide-react";
import ProductImage from "@/components/product/ProductImage";
import { formatPrice } from "@/lib/utils";

interface CompareItem {
  id: string;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number | null;
  image: string;
  brand: string;
  rating: number;
  reviewCount: number;
  specs?: { key: string; value: string }[];
}

export default function ComparisonBar() {
  const [items, setItems] = useState<CompareItem[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const loadItems = () => {
      const stored = localStorage.getItem("HAUSAURA-comparison");
      if (stored) {
        try {
          const parsed: unknown = JSON.parse(stored);
          if (Array.isArray(parsed)) setItems(parsed);
        } catch {}
      } else {
        setItems([]);
      }
    };

    loadItems();
    window.addEventListener("storage", loadItems);
    window.addEventListener("comparison-updated", loadItems);
    return () => {
      window.removeEventListener("storage", loadItems);
      window.removeEventListener("comparison-updated", loadItems);
    };
  }, []);

  const removeItem = (id: string) => {
    const updated = items.filter((item) => item.id !== id);
    localStorage.setItem("HAUSAURA-comparison", JSON.stringify(updated));
    setItems(updated);
    window.dispatchEvent(new Event("storage"));
    window.dispatchEvent(new CustomEvent("comparison-updated"));
  };

  const clearAll = () => {
    localStorage.removeItem("HAUSAURA-comparison");
    setItems([]);
    window.dispatchEvent(new Event("storage"));
    window.dispatchEvent(new CustomEvent("comparison-updated"));
  };

  if (!mounted || items.length === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[70] bg-white border-t border-[var(--color-border)] shadow-[0_-4px_20px_rgba(0,0,0,0.1)] transform transition-transform duration-300">
      <div className="container-hausaura py-3">
        <div className="flex items-center gap-4">
          {/* Label */}
          <div className="hidden sm:flex items-center gap-2 shrink-0">
            <BarChart3 className="w-5 h-5 text-[var(--color-primary)]" />
            <span className="text-sm font-semibold text-[var(--color-text-primary)]">
              Vergleich ({items.length}/4)
            </span>
          </div>

          {/* Items */}
          <div className="flex-1 flex items-center gap-3 overflow-x-auto pb-1 scrollbar-thin">
            {items.map((item) => (
              <div
                key={item.id}
                className="relative flex items-center gap-2 bg-[var(--color-bg-secondary)] rounded-xl px-3 py-2 shrink-0"
              >
                <div className="w-10 h-10 bg-white rounded-lg overflow-hidden flex-shrink-0">
                  <ProductImage src={item.image} alt={item.name} size="sm" />
                </div>
                <div className="min-w-0 max-w-[120px]">
                  <p className="text-xs font-semibold text-[var(--color-text-primary)] truncate">{item.name}</p>
                  <p className="text-xs font-bold text-[var(--color-primary)]">{formatPrice(item.price)}</p>
                </div>
                <button
                  onClick={() => removeItem(item.id)}
                  aria-label={`${item.name} vom Vergleich entfernen`}
                  className="p-1 text-[var(--color-text-muted)] hover:text-[var(--color-danger)] transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}

            {/* Empty slots */}
            {Array.from({ length: Math.max(0, 4 - items.length) }).map((_, i) => (
              <div
                key={`empty-${i}`}
                className="w-[180px] h-14 border-2 border-dashed border-[var(--color-border)] rounded-xl flex items-center justify-center shrink-0"
              >
                <span className="text-xs text-[var(--color-text-muted)]">Produkt hinzufügen</span>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={clearAll}
              className="p-2.5 text-[var(--color-text-muted)] hover:text-[var(--color-danger)] hover:bg-[var(--color-danger-light)] rounded-xl transition-colors"
              aria-label="Vergleich leeren"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            {items.length >= 2 && (
              <Link
                href={`/vergleich?ids=${items.map((i) => i.id).join(",")}`}
                className="px-4 py-2.5 bg-[var(--color-primary)] text-white text-sm font-semibold rounded-xl hover:bg-[var(--color-primary-hover)] transition-colors whitespace-nowrap"
              >
                Vergleichen
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
