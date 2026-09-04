"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowUp, ArrowUpDown } from "lucide-react";

interface MobileShopBarProps {
  onScrollToTop?: () => void;
  totalResults?: number;
  sort?: string;
}

const sortOptions = [
  { value: "newest", label: "Neueste" },
  { value: "popular", label: "Beliebteste" },
  { value: "price_asc", label: "Preis ↑" },
  { value: "price_desc", label: "Preis ↓" },
  { value: "rating", label: "Beste Bewertung" },
  { value: "name", label: "Name A–Z" },
];

export default function MobileShopBar({ onScrollToTop, totalResults, sort }: MobileShopBarProps) {
  const [visible, setVisible] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSortChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", value);
    params.delete("page");
    router.push(`/shop?${params.toString()}`);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 lg:hidden bg-white border-t border-[var(--color-border-light)] shadow-lg animate-slide-up safe-area-bottom" role="complementary" aria-label="Shop-Kontrollen" style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}>
      <div className="flex items-center justify-between px-4 py-3 gap-3">
        {typeof totalResults === "number" && (
          <span className="text-xs text-[var(--color-text-muted)] whitespace-nowrap">
            {totalResults} {totalResults === 1 ? "Ergebnis" : "Ergebnisse"}
          </span>
        )}

        <div className="flex items-center gap-2 ml-auto">
          {sort && (
            <div className="relative">
              <label htmlFor="mobile-shop-sort" className="sr-only">Sortierung</label>
              <div className="flex items-center gap-1.5">
                <ArrowUpDown className="w-3.5 h-3.5 text-[var(--color-text-muted)]" aria-hidden="true" />
                <select
                  id="mobile-shop-sort"
                  value={sort}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="text-xs border border-[var(--color-border-light)] rounded-lg px-2 py-2 min-h-[44px] text-[var(--color-text-secondary)] bg-[var(--color-bg-secondary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] cursor-pointer"
                >
                  {sortOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          <button
            onClick={onScrollToTop || (() => {
              const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
              window.scrollTo({ top: 0, behavior: prefersReduced ? 'auto' : 'smooth' });
            })}
            className="flex items-center gap-2 px-3 py-2.5 min-h-[44px] bg-[var(--color-bg-secondary)] rounded-xl text-xs font-medium text-[var(--color-text-secondary)] hover:bg-[var(--color-primary)]/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2"
          >
            <ArrowUp className="w-4 h-4" />
            Oben
          </button>
        </div>
      </div>
    </div>
  );
}
