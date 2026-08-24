"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, X, Star, ArrowRight } from "lucide-react";
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
}

export default function SearchDropdown({ isOpen, onClose }: SearchDropdownProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [nbHits, setNbHits] = useState(0);
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (!query.trim() || query.trim().length < 2) return;

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
  }, [query]);

  const handleSelect = useCallback(
    (slug: string) => {
      router.push(`/produkt/${slug}`);
      onClose();
      setQuery("");
    },
    [router, onClose]
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (query.trim()) {
        router.push(`/shop?q=${encodeURIComponent(query.trim())}`);
        onClose();
        setQuery("");
      }
    },
    [query, router, onClose]
  );

  const hasResults = query.trim().length >= 2 && results.length > 0;

  return (
    <div
      className={`border-t border-[var(--color-border-light)] bg-white transition-[opacity,visibility] duration-200 ${
        isOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
      }`}
    >
      <div className="container-hauselio py-5">
        <div className="max-w-2xl mx-auto">
          {/* Search input */}
          <form onSubmit={handleSubmit}>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-text-muted)]" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => { setQuery(e.target.value); setActiveIndex(-1); }}
                onKeyDown={(e) => {
                  if (!hasResults) return;
                  if (e.key === "ArrowDown") {
                    e.preventDefault();
                    setActiveIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0));
                  } else if (e.key === "ArrowUp") {
                    e.preventDefault();
                    setActiveIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1));
                  } else if (e.key === "Enter" && activeIndex >= 0) {
                    e.preventDefault();
                    handleSelect(results[activeIndex].slug);
                  } else if (e.key === "Escape") {
                    onClose();
                  }
                }}
                placeholder="Suche nach Produkten, Marken…"
                role="combobox"
                aria-expanded={hasResults}
                aria-controls="search-results-list"
                aria-autocomplete="list"
                aria-activedescendant={activeIndex >= 0 ? `search-result-${activeIndex}` : undefined}
                className="w-full pl-12 pr-12 py-4 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-2xl text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] transition-[border-color,box-shadow] duration-200 placeholder:text-[var(--color-text-muted)]"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => {
                    setQuery("");
                    setResults([]);
                  }}
                  aria-label="Suche löschen"
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] rounded-lg hover:bg-[var(--color-bg-secondary)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </form>

          {/* Results dropdown */}
          {query.trim().length >= 2 && (
            <div
              id="search-results-list"
              role="listbox"
              className="mt-2 bg-white rounded-2xl shadow-[var(--shadow-2xl)] border border-[var(--color-border-light)] overflow-hidden animate-scale-in origin-top"
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
                        onClick={() => handleSelect(hit.slug)}
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
                            <p className="text-[11px] font-bold text-[var(--color-primary)] uppercase tracking-wider">
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
                      onClick={() => {
                        router.push(
                          `/shop?q=${encodeURIComponent(query.trim())}`
                        );
                        onClose();
                        setQuery("");
                      }}
                      className="w-full flex items-center justify-center gap-2 py-3.5 bg-[var(--color-bg-secondary)] border-t border-[var(--color-border-light)] text-sm font-semibold text-[var(--color-primary)] hover:bg-[var(--color-primary-50)] transition-colors"
                    >
                      Alle {nbHits} Ergebnisse ansehen
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={onClose}
                    className="w-full mt-3 py-3 min-h-[44px] flex items-center justify-center text-sm font-semibold text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] border border-[var(--color-border-light)] rounded-xl transition-colors"
                  >
                    Schließen
                  </button>
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
    </div>
  );
}
