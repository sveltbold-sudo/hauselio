"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { SlidersHorizontal, X, Tag, Package, Star } from "lucide-react";

interface ShopFiltersProps {
  categories: { name: string; slug: string }[];
  brands: { name: string; slug: string }[];
  selectedCategory?: string;
  selectedBrand?: string;
  selectedRating?: string;
  ratingCounts?: Record<number, number>;
}

export default function ShopFilters({
  categories,
  brands,
  selectedCategory,
  selectedBrand,
  selectedRating,
  ratingCounts = {},
}: ShopFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateFilter = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete("page");
    router.push(`/shop?${params.toString()}`);
  };

  const hasActiveFilters = selectedCategory || selectedBrand || searchParams.get("price") || selectedRating;

  return (
    <div className="bg-white rounded-2xl border border-[var(--color-border-light)] p-4 sm:p-5">
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-bold text-[var(--color-text-primary)] flex items-center gap-2 text-sm">
          <SlidersHorizontal className="w-4 h-4" />
          Filter
        </h2>
        {hasActiveFilters && (
          <button
            onClick={() => {
              const params = new URLSearchParams(searchParams.toString());
              params.delete("category");
              params.delete("brand");
              params.delete("price");
              params.delete("rating");
              params.delete("page");
              router.push(`/shop?${params.toString()}`);
            }}
            aria-label="Alle Filter zurücksetzen"
            className="text-xs text-[var(--color-primary)] hover:underline font-medium"
          >
            Zurücksetzen
          </button>
        )}
      </div>

      {/* Active filters */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 mb-5">
          {selectedCategory && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[var(--color-primary-50)] text-[var(--color-primary)] rounded-lg text-xs font-semibold">
              {categories.find((c) => c.slug === selectedCategory)?.name || selectedCategory}
              <button
                onClick={() => updateFilter("category", null)}
                className="hover:bg-[var(--color-primary)]/10 rounded p-1.5 transition-colors"
                aria-label="Filter entfernen"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {selectedBrand && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[var(--color-primary-50)] text-[var(--color-primary)] rounded-lg text-xs font-semibold">
              {selectedBrand}
              <button
                onClick={() => updateFilter("brand", null)}
                className="hover:bg-[var(--color-primary)]/10 rounded p-1.5 transition-colors"
                aria-label="Filter entfernen"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {searchParams.get("price") && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[var(--color-primary-50)] text-[var(--color-primary)] rounded-lg text-xs font-semibold">
              {searchParams.get("price") === "0-500" && "Bis 500€"}
              {searchParams.get("price") === "500-1000" && "500–1.000€"}
              {searchParams.get("price") === "1000-2000" && "1.000–2.000€"}
              {searchParams.get("price") === "2000-" && "Über 2.000€"}
              <button
                onClick={() => updateFilter("price", null)}
                className="hover:bg-[var(--color-primary)]/10 rounded p-1.5 transition-colors"
                aria-label="Filter entfernen"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {selectedRating && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[var(--color-primary-50)] text-[var(--color-primary)] rounded-lg text-xs font-semibold">
              Ab {selectedRating}★
              <button
                onClick={() => updateFilter("rating", null)}
                className="hover:bg-[var(--color-primary)]/10 rounded p-1.5 transition-colors"
                aria-label="Filter entfernen"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
        </div>
      )}

      {/* Category filter */}
      <div className="mb-6">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)] mb-3 flex items-center gap-1.5">
          <Package className="w-3 h-3" />
          Kategorie
        </h3>
        <div className="space-y-0.5">
          <button
            onClick={() => updateFilter("category", null)}
            aria-pressed={!selectedCategory}
              className={`w-full flex items-center gap-2.5 text-sm cursor-pointer min-h-[44px] px-3 rounded-lg transition-colors text-left ${
              !selectedCategory
                ? "bg-[var(--color-primary-50)] text-[var(--color-primary)] font-semibold"
                : "text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)]"
            }`}
          >
            Alle Kategorien
          </button>
          {categories.map((cat) => (
            <button
              key={cat.slug}
              onClick={() =>
                updateFilter(
                  "category",
                  selectedCategory === cat.slug ? null : cat.slug
                )
              }
              aria-pressed={selectedCategory === cat.slug}
              className={`w-full flex items-center gap-2.5 text-sm cursor-pointer min-h-[44px] px-3 rounded-lg transition-colors text-left ${
                selectedCategory === cat.slug
                  ? "bg-[var(--color-primary-50)] text-[var(--color-primary)] font-semibold"
                  : "text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)]"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Brand filter */}
      <div className="mb-6">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)] mb-3 flex items-center gap-1.5">
          <Tag className="w-3 h-3" />
          Marke
        </h3>
        <div className="space-y-0.5 max-h-48 overflow-y-auto" role="list">
          {brands.map((brand) => (
            <button
              key={brand.slug}
              role="listitem"
              onClick={() =>
                updateFilter(
                  "brand",
                  selectedBrand === brand.slug ? null : brand.slug
                )
              }
              aria-pressed={selectedBrand === brand.slug}
              className={`w-full flex items-center gap-2.5 text-sm cursor-pointer min-h-[44px] px-3 rounded-lg transition-colors text-left ${
                selectedBrand === brand.slug
                  ? "bg-[var(--color-primary-50)] text-[var(--color-primary)] font-semibold"
                  : "text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)]"
              }`}
            >
              {brand.name}
            </button>
          ))}
        </div>
      </div>

      {/* Price range */}
      <div className="mb-6">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)] mb-3 flex items-center gap-1.5">
          <Tag className="w-3 h-3" />
          Preisbereich
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {[
            { label: "Bis 500€", value: "0-500" },
            { label: "500–1.000€", value: "500-1000" },
            { label: "1.000–2.000€", value: "1000-2000" },
            { label: "Über 2.000€", value: "2000-" },
          ].map((range) => (
            <button
              key={range.value}
              onClick={() =>
                updateFilter(
                  "price",
                  searchParams.get("price") === range.value ? null : range.value
                )
              }
              aria-pressed={searchParams.get("price") === range.value}
               className={`px-3 py-2.5 min-h-[44px] rounded-lg text-[11px] sm:text-xs font-semibold border transition-colors duration-200 ${
                searchParams.get("price") === range.value
                  ? "bg-[var(--color-primary-50)] border-[var(--color-primary)]/20 text-[var(--color-primary)]"
                  : "border-[var(--color-border-light)] text-[var(--color-text-secondary)] hover:border-[var(--color-primary)]/20"
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      {/* Star rating filter */}
      <div className="mb-6">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)] mb-3 flex items-center gap-1.5">
          <Star className="w-3 h-3" />
          Bewertung
        </h3>
        <div className="space-y-0.5">
          {[5, 4, 3, 2, 1].map((rating) => {
            const count = ratingCounts[rating] ?? 0;
            const isActive = selectedRating === String(rating);
            return (
              <button
                key={rating}
                onClick={() =>
                  updateFilter(
                    "rating",
                    isActive ? null : String(rating)
                  )
                }
                aria-pressed={isActive}
                className={`w-full flex items-center gap-2.5 text-sm cursor-pointer min-h-[44px] px-3 rounded-lg transition-colors text-left ${
                  isActive
                    ? "bg-[var(--color-primary-50)] text-[var(--color-primary)] font-semibold"
                    : "text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)]"
                }`}
              >
                <span className="flex items-center gap-0.5" aria-hidden="true">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={`w-3.5 h-3.5 ${
                        s <= rating
                          ? "fill-[var(--color-warning)] text-[var(--color-warning)]"
                          : "fill-none text-[var(--color-text-muted)]/30"
                      }`}
                    />
                  ))}
                </span>
                <span className="flex-1 text-left">{rating}★ &amp; mehr</span>
                <span className="text-xs text-[var(--color-text-muted)] tabular-nums">({count})</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
