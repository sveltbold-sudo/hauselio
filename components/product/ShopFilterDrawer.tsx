"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { SlidersHorizontal, X } from "lucide-react";
import ShopFilters from "@/components/product/ShopFilters";

interface ShopFilterDrawerProps {
  categories: { name: string; slug: string }[];
  brands: string[];
  selectedCategory?: string;
  selectedBrand?: string;
  selectedSort: string;
}

export default function ShopFilterDrawer({
  categories,
  brands,
  selectedCategory,
  selectedBrand,
  selectedSort,
}: ShopFilterDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Auto-close drawer on route change (filter select triggers router.push)
  useEffect(() => {
    setIsOpen(false);
  }, [pathname, searchParams]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
        return;
      }
      if (e.key !== "Tab" || !drawerRef.current) return;
      const focusable = drawerRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
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
    const firstFocusable = drawerRef.current?.querySelector<HTMLElement>(
      'a[href], button:not([disabled])'
    );
    firstFocusable?.focus();
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const activeCount = (selectedCategory ? 1 : 0) + (selectedBrand ? 1 : 0);

  return (
    <>
      {/* Mobile filter toggle button */}
      <button
        onClick={() => setIsOpen(true)}
        className="lg:hidden flex items-center gap-2 px-4 py-3 min-h-[44px] rounded-xl text-sm font-semibold bg-white border border-[var(--color-border-light)] text-[var(--color-text-secondary)] hover:border-[var(--color-border)] hover:text-[var(--color-text-primary)] transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2"
        aria-label="Filter öffnen"
        aria-controls="shop-filter-drawer"
      >
        <SlidersHorizontal className="w-4 h-4" />
        Filter
        {activeCount > 0 && (
          <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1 bg-[var(--color-primary)] text-white text-xs font-bold rounded-full">
            {activeCount}
          </span>
        )}
      </button>

      {/* Desktop inline filters */}
      <aside className="hidden lg:block w-64 flex-shrink-0" aria-label="Produktfilter">
        <ShopFilters
          categories={categories}
          brands={brands}
          selectedCategory={selectedCategory}
          selectedBrand={selectedBrand}
          selectedSort={selectedSort}
        />
      </aside>

      {/* Mobile drawer overlay */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-[90]" role="dialog" aria-modal="true" aria-label="Filter">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fade-in"
            onClick={() => setIsOpen(false)}
          />
          <div ref={drawerRef} id="shop-filter-drawer" className="absolute left-0 top-0 h-full w-[320px] max-w-[85vw] bg-white shadow-[var(--shadow-2xl)] animate-slide-in-left overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-[var(--color-border-light)]">
              <h2 className="font-bold text-[var(--color-text-primary)] flex items-center gap-2 text-sm">
                <SlidersHorizontal className="w-4 h-4" />
                Filter
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                aria-label="Filter schließen"
                className="min-w-[44px] min-h-[44px] flex items-center justify-center p-2 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-secondary)] rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5">
              <ShopFilters
                categories={categories}
                brands={brands}
                selectedCategory={selectedCategory}
                selectedBrand={selectedBrand}
                selectedSort={selectedSort}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
