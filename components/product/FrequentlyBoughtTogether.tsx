"use client";

import { useState, useRef, useEffect } from "react";
import { Check, ShoppingBag } from "lucide-react";
import ProductImage from "@/components/product/ProductImage";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/lib/store";
import { useToast } from "@/components/ui/Toast";

interface BundleProduct {
  id: string;
  name: string;
  slug: string;
  price: number;
  image: string;
  brand: string | null;
}

interface FrequentlyBoughtTogetherProps {
  currentProduct: { id: string; name: string; slug: string; price: number; image: string; categorySlug: string };
  products: BundleProduct[];
}

export default function FrequentlyBoughtTogether({ currentProduct, products }: FrequentlyBoughtTogetherProps) {
  const [selected, setSelected] = useState<Set<string>>(new Set(products.map((p) => p.id)));
  const [addedBundle, setAddedBundle] = useState(false);
  const addItem = useCartStore((state) => state.addItem);
  const toast = useToast();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const selectedProducts = products.filter((p) => selected.has(p.id));
  const bundleTotal = [currentProduct, ...selectedProducts].reduce((sum, p) => sum + p.price, 0);

  const handleAddBundle = () => {
    selectedProducts.forEach((item) => {
      addItem({
        id: item.id,
        name: item.name,
        slug: item.slug,
        price: item.price,
        image: item.image,
        brand: item.brand ?? "",
        categorySlug: currentProduct.categorySlug,
      }, 1);
    });
    window.dispatchEvent(new CustomEvent("cart:item-added"));
    toast.success(`${selectedProducts.length} Artikel zum Warenkorb hinzugefügt!`);
    setAddedBundle(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setAddedBundle(false), 2000);
  };

  if (products.length === 0) return null;

  return (
    <div className="mt-10 lg:mt-14">
      <h2 className="heading-3 mb-5">
        Oft zusammen gekauft
      </h2>

      <div className="bg-[var(--color-bg-secondary)] rounded-2xl p-5 border border-[var(--color-border-light)]">
        <div className="flex flex-col lg:flex-row gap-5">
          {/* Product list */}
          <div className="flex-1 space-y-3">
            {/* Current product — always checked */}
            <div className="flex items-center gap-3 bg-white rounded-xl p-3 border border-[var(--color-border-light)]">
              <div className="w-16 h-16 bg-[var(--color-bg-secondary)] rounded-lg overflow-hidden flex-shrink-0">
                <ProductImage src={currentProduct.image} alt={currentProduct.name} size="sm" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-[var(--color-text-primary)] truncate" aria-label={currentProduct.name}>{currentProduct.name}</p>
                <p className="text-sm font-bold text-[var(--color-text-primary)] mt-0.5">{formatPrice(currentProduct.price)}</p>
              </div>
              <Check className="w-4 h-4 text-[var(--color-success)] shrink-0" aria-hidden="true" />
            </div>

            {/* Bundle products — toggleable */}
            {products.map((product) => {
              const isSelected = selected.has(product.id);
              return (
                <button
                  key={product.id}
                  onClick={() => toggle(product.id)}
                  aria-pressed={isSelected}
                  aria-label={`${product.name} ${isSelected ? "entfernen" : "hinzufügen"}`}
                  className={`w-full flex items-center gap-3 rounded-xl p-3 min-h-[44px] border transition-colors transition-opacity duration-200 text-left ${
                    isSelected
                      ? "bg-white border-[var(--color-primary)]/20 shadow-sm"
                      : "bg-white/50 border-transparent opacity-60 hover:opacity-80"
                  }`}
                >
                  <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                    isSelected ? "bg-[var(--color-primary)] border-[var(--color-primary)]" : "border-[var(--color-border)] bg-white"
                  }`}>
                    {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                  </div>
                  <div className="w-14 h-14 bg-[var(--color-bg-secondary)] rounded-lg overflow-hidden flex-shrink-0">
                    <ProductImage src={product.image} alt={product.name} size="sm" />
                  </div>
                  <div className="flex-1 min-w-0">
                    {product.brand && (
                      <p className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)]" translate="no">{product.brand}</p>
                    )}
                    <p className="text-xs font-semibold text-[var(--color-text-primary)] truncate">{product.name}</p>
                    <p className="text-sm font-bold text-[var(--color-text-primary)] mt-0.5">{formatPrice(product.price)}</p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Summary sidebar */}
          <div className="lg:w-56 flex flex-col justify-between">
            <div>
              <div className="flex items-baseline justify-between mb-2">
                <span className="text-sm text-[var(--color-text-secondary)]">Gesamtpreis</span>
                <span className="text-xl font-extrabold text-[var(--color-text-primary)]">{formatPrice(bundleTotal)}</span>
              </div>
            </div>

            <button
              onClick={handleAddBundle}
              className={`w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-bold transition-colors transition-shadow duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 ${
                addedBundle
                  ? "bg-[var(--color-success)] text-white"
                  : "bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)] shadow-lg shadow-[var(--color-primary)]/15"
              }`}
            >
              {addedBundle ? (
                <>
                  <Check className="w-4 h-4" />
                  Hinzugefügt!
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" />
                  Alles in den Warenkorb
                </>
              )}
            </button>

            <p className="text-xs text-[var(--color-text-muted)] text-center mt-2">
              {selectedProducts.length + 1} Artikel · Kostenlos ab 50€
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
