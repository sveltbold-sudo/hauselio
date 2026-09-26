"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

interface CategoryBrandFilterProps {
  brands: { name: string; slug: string; count: number }[];
  selectedBrand?: string;
  slug: string;
}

export default function CategoryBrandFilter({ brands, selectedBrand, slug }: CategoryBrandFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  // Collapsed on mobile so the chip cloud doesn't push products off-screen
  const [expanded, setExpanded] = useState(false);

  const handleBrandChange = (brandSlug: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (brandSlug) {
      params.set("brand", brandSlug);
    } else {
      params.delete("brand");
    }
    params.delete("page");
    router.push(`/kategorie/${slug}?${params.toString()}`);
  };

  if (brands.length === 0) return null;

  return (
    <div className="flex items-center gap-2 flex-nowrap overflow-x-auto pb-1 min-w-0 flex-1">
      <span className="hidden sm:inline text-xs text-[var(--color-text-muted)] whitespace-nowrap shrink-0">Marke:</span>
      <button
        onClick={() => handleBrandChange(null)}
        aria-pressed={!selectedBrand}
          className={`shrink-0 min-h-[44px] px-2.5 sm:px-3 py-1 rounded-full text-xs font-medium transition-colors ${
          !selectedBrand
            ? "bg-[var(--color-primary)] text-white"
            : "bg-[var(--color-bg-secondary)] text-[var(--color-text-secondary)] hover:bg-[var(--color-primary)]/10"
        }`}
      >
        Alle
      </button>
      {/* Collapse button at TOP when expanded — no need to scroll down */}
      {expanded && (
        <button
          type="button"
          onClick={() => setExpanded(false)}
          aria-expanded={true}
          className="sm:hidden min-h-[44px] px-3 py-1 rounded-full text-xs font-semibold bg-[var(--color-primary)] text-white"
        >
          Weniger ▲
        </button>
      )}
      {brands.map((brand) => {
        const isSelected = selectedBrand === brand.slug;
        return (
          <button
            key={brand.slug}
            onClick={() => handleBrandChange(brand.slug)}
            aria-pressed={isSelected}
            aria-expanded={expanded}
            className={`shrink-0 min-h-[44px] px-2.5 sm:px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              // On mobile only "Alle" + selected brand stay visible unless expanded
              !isSelected && !expanded ? "hidden sm:inline-flex sm:items-center" : "inline-flex items-center"
            } ${
              isSelected
                ? "bg-[var(--color-primary)] text-white"
                : "bg-[var(--color-bg-secondary)] text-[var(--color-text-secondary)] hover:bg-[var(--color-primary)]/10"
            }`}
          >
            {brand.name} ({brand.count})
          </button>
        );
      })}
      {/* Mobile expand button — hidden on desktop where all chips show */}
      {!expanded && brands.length > 1 && (
        <button
          type="button"
          onClick={() => setExpanded(true)}
          aria-expanded={false}
          className="shrink-0 sm:hidden min-h-[44px] px-2.5 sm:px-3 py-1 rounded-full text-xs font-semibold bg-[var(--color-bg-secondary)] text-[var(--color-primary)]"
        >
          {`Marken (${brands.length}) ▼`}
        </button>
      )}
    </div>
  );
}
