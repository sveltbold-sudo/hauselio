"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Star, ArrowRight } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import ProductImage from "@/components/product/ProductImage";

interface SearchResult {
  objectID: string;
  name: string;
  slug: string;
  price: number;
  originalPrice: number | null;
  brand: string | null;
  categoryName: string;
  image: string;
  rating: number;
  reviewCount: number;
}

interface SearchDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  query: string;
  activeIndex: number;
  resultCount: number;
  onResultCountChange: (count: number) => void;
  onSelect: (slug: string) => void;
  onClear: () => void;
  inline?: boolean;
}

export default function SearchDropdown({
  isOpen,
  onClose,
  query,
  activeIndex,
  onResultCountChange,
  onSelect,
  onClear,
  inline = false,
}: SearchDropdownProps) {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [nbHits, setNbHits] = useState(0);
  const [animKey, setAnimKey] = useState(0);
  const router = useRouter();

  useEffect(() => {
    if (isOpen) setAnimKey((k) => k + 1);
  }, [isOpen]);

  useEffect(() => {
    if (!query.trim() || query.trim().length < 2) {
      setResults([]);
      setNbHits(0);
      onResultCountChange(0);
      return;
    }

    let cancelled = false;
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/search?q=${encodeURIComponent(query.trim())}&limit=6`,
          { signal: controller.signal }
        );
        const data = await res.json();
        if (!cancelled) {
          setResults(data.hits || []);
          setNbHits(data.nbHits || 0);
          onResultCountChange(Math.min(6, data.nbHits || 0));
        }
      } catch {
        if (!cancelled) {
          setResults([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }, 300);

    return () => {
      cancelled = true;
      controller.abort();
      clearTimeout(timer);
    };
  }, [query, onResultCountChange]);

  const handleViewAll = useCallback(() => {
    router.push(`/shop?q=${encodeURIComponent(query.trim())}`);
    onClose();
    onClear();
  }, [query, router, onClose, onClear]);

  const hasQuery = query.trim().length >= 2;

  return (
    <div
      className={`${
        inline
          ? "relative"
          : "absolute top-full left-0 right-0 mt-2 z-[60]"
      } bg-white transition-[opacity,visibility] duration-200 ${
        isOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
      }`}
    >
      <div className="w-full">
          {hasQuery && (
            <div
              key={animKey}
              id="search-results-list"
              role="listbox"
              className="bg-white rounded-2xl shadow-[var(--shadow-2xl)] border border-[var(--color-border-light)] overflow-hidden animate-scale-in origin-top max-h-[60vh] overflow-y-auto"
            >
              {loading ? (
                <div className="p-8 text-center">
                  <div className="w-6 h-6 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin mx-auto" role="status" aria-label="Suche läuft" />
                  <p className="text-sm text-[var(--color-text-muted)] mt-3">
                    Suche läuft…
                  </p>
                </div>
              ) : results.length > 0 ? (
                <>
                  <div className="p-4">
                    {results.map((hit, index) => (
                      <button
                        key={hit.objectID}
                        id={`search-result-${index}`}
                        role="option"
                        aria-selected={index === activeIndex}
                        onClick={() => onSelect(hit.slug)}
                        className={`w-full flex items-center gap-4 p-3 rounded-xl transition-colors duration-200 text-left ${
                          index === activeIndex ? "bg-[var(--color-bg-secondary)]" : "hover:bg-[var(--color-bg-secondary)]"
                        }`}
                      >
                        <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 bg-[var(--color-bg-secondary)] border border-[var(--color-border-light)]">
                          <ProductImage
                            src={hit.image}
                            alt={hit.name}
                            brand={hit.brand}
                            size="sm"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          {hit.brand && (
                            <p className="text-xs font-bold text-[var(--color-primary)] uppercase tracking-wider truncate">
                              {hit.brand}
                            </p>
                          )}
                          <p className="text-sm font-medium text-[var(--color-text-primary)] truncate">
                            {hit.name}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <div className="flex items-center" aria-label={`${hit.rating} von 5 Sternen`}>
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  aria-hidden="true"
                                  className={`w-3 h-3 ${
                                    i < Math.floor(hit.rating)
                                      ? "text-[var(--color-star-filled)] fill-[var(--color-star-filled)]"
                                      : "text-[var(--color-star-empty)]"
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-xs text-[var(--color-text-muted)]">
                              ({hit.reviewCount})
                            </span>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-sm font-bold text-[var(--color-text-primary)] tabular-nums">
                            {formatPrice(hit.price)}
                          </p>
                          {hit.originalPrice && (
                            <p className="text-xs text-[var(--color-text-muted)] line-through tabular-nums">
                              {formatPrice(hit.originalPrice)}
                            </p>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>

                  {nbHits > results.length && (
                    <button
                      onClick={handleViewAll}
                      className="w-full flex items-center justify-center gap-2 py-3.5 bg-[var(--color-bg-secondary)] border-t border-[var(--color-border-light)] text-sm font-semibold text-[var(--color-primary)] hover:bg-[var(--color-primary-50)] transition-colors"
                    >
                      Alle {nbHits} Ergebnisse ansehen
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </>
              ) : (
                <div className="p-8 text-center">
                  <p className="text-[var(--color-text-muted)]">
                    Keine Ergebnisse für &ldquo;{query}&rdquo;
                  </p>
                  <p className="text-sm text-[var(--color-text-muted)] mt-1">
                    Versuchen Sie einen anderen Suchbegriff
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
  );
}
