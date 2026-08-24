"use client";

import { useRouter, useSearchParams } from "next/navigation";

interface CategorySortSelectProps {
  sort: string;
  slug: string;
}

export default function CategorySortSelect({ sort, slug }: CategorySortSelectProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", value);
    params.delete("page");
    router.push(`/kategorie/${slug}?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-2">
      <label htmlFor="category-sort" className="sr-only">Sortieren:</label>
      <select
        id="category-sort"
        value={sort}
        onChange={(e) => handleChange(e.target.value)}
        className="text-sm border border-[var(--color-border-light)] rounded-xl px-3 py-1.5 text-[var(--color-text-secondary)] bg-[var(--color-bg-secondary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/20 cursor-pointer"
      >
        <option value="newest">Neueste zuerst</option>
        <option value="price_asc">Preis aufsteigend</option>
        <option value="price_desc">Preis absteigend</option>
        <option value="rating">Beste Bewertung</option>
        <option value="popular">Beliebteste</option>
      </select>
    </div>
  );
}
