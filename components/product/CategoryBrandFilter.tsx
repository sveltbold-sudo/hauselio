"use client";

import { useRouter, useSearchParams } from "next/navigation";

interface CategoryBrandFilterProps {
  brands: { name: string; slug: string; count: number }[];
  selectedBrand?: string;
  slug: string;
}

export default function CategoryBrandFilter({ brands, selectedBrand, slug }: CategoryBrandFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

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
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-xs text-[var(--color-text-muted)] whitespace-nowrap">Marke:</span>
      <button
        onClick={() => handleBrandChange(null)}
          className={`min-h-[44px] px-3 py-1 rounded-full text-xs font-medium transition-colors ${
          !selectedBrand
            ? "bg-[var(--color-primary)] text-white"
            : "bg-[var(--color-bg-secondary)] text-[var(--color-text-secondary)] hover:bg-[var(--color-primary)]/10"
        }`}
      >
        Alle
      </button>
      {brands.map((brand) => (
        <button
          key={brand.slug}
          onClick={() => handleBrandChange(brand.slug)}
        className={`min-h-[44px] px-3 py-1 rounded-full text-xs font-medium transition-colors ${
            selectedBrand === brand.slug
              ? "bg-[var(--color-primary)] text-white"
              : "bg-[var(--color-bg-secondary)] text-[var(--color-text-secondary)] hover:bg-[var(--color-primary)]/10"
          }`}
        >
          {brand.name} ({brand.count})
        </button>
      ))}
    </div>
  );
}
