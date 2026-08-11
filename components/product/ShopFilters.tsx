"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { SlidersHorizontal } from "lucide-react";

interface ShopFiltersProps {
  categories: { name: string; slug: string }[];
  brands: string[];
  selectedCategory?: string;
  selectedBrand?: string;
  selectedSort: string;
}

export default function ShopFilters({
  categories,
  brands,
  selectedCategory,
  selectedBrand,
  selectedSort,
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

  const updateSort = (sort: string) => {
    updateFilter("sort", sort);
  };

  const hasActiveFilters = selectedCategory || selectedBrand;

  return (
    <div className="bg-white rounded-2xl border border-[var(--color-border-light)] p-6">
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
              params.delete("page");
              router.push(`/shop?${params.toString()}`);
            }}
            className="text-xs text-[var(--color-primary)] hover:underline font-medium"
          >
            Zurücksetzen
          </button>
        )}
      </div>

      {/* Category filter */}
      <div className="mb-6">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)] mb-3">
          Kategorie
        </h3>
        <div className="space-y-2">
          <label className="flex items-center gap-2.5 text-sm text-[var(--color-text-secondary)] cursor-pointer group">
            <input
              type="checkbox"
              checked={!selectedCategory}
              onChange={() => updateFilter("category", null)}
              className="rounded border-gray-300 text-[var(--color-primary)] focus:ring-[var(--color-primary)]"
            />
            <span className="group-hover:text-[var(--color-text-primary)] transition-colors">
              Alle Kategorien
            </span>
          </label>
          {categories.map((cat) => (
            <label
              key={cat.slug}
              className="flex items-center gap-2.5 text-sm text-[var(--color-text-secondary)] cursor-pointer group"
            >
              <input
                type="checkbox"
                checked={selectedCategory === cat.slug}
                onChange={() =>
                  updateFilter(
                    "category",
                    selectedCategory === cat.slug ? null : cat.slug
                  )
                }
                className="rounded border-gray-300 text-[var(--color-primary)] focus:ring-[var(--color-primary)]"
              />
              <span className="group-hover:text-[var(--color-text-primary)] transition-colors">
                {cat.name}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Brand filter */}
      <div className="mb-6">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)] mb-3">
          Marke
        </h3>
        <div className="space-y-2">
          {brands.map((brand) => (
            <label
              key={brand}
              className="flex items-center gap-2.5 text-sm text-[var(--color-text-secondary)] cursor-pointer group"
            >
              <input
                type="checkbox"
                checked={selectedBrand === brand}
                onChange={() =>
                  updateFilter(
                    "brand",
                    selectedBrand === brand ? null : brand
                  )
                }
                className="rounded border-gray-300 text-[var(--color-primary)] focus:ring-[var(--color-primary)]"
              />
              <span className="group-hover:text-[var(--color-text-primary)] transition-colors">
                {brand}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Sort */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)] mb-3">
          Sortierung
        </h3>
        <select
          value={selectedSort}
          onChange={(e) => updateSort(e.target.value)}
          aria-label="Sortierung"
          className="w-full text-sm border border-[var(--color-border)] rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] transition-all"
        >
          <option value="newest">Neueste</option>
          <option value="price_asc">Preis aufsteigend</option>
          <option value="price_desc">Preis absteigend</option>
          <option value="rating">Bewertung</option>
        </select>
      </div>
    </div>
  );
}
