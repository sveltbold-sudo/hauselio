"use client";

import { useRouter, useSearchParams } from "next/navigation";

interface ShopSortSelectProps {
  sort: string;
}

export default function ShopSortSelect({ sort }: ShopSortSelectProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", value);
    params.delete("page");
    router.push(`/shop?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-3">
      <label htmlFor="shop-sort" className="sr-only">Sortierung</label>
      <select
        id="shop-sort"
        value={sort}
        onChange={(e) => handleChange(e.target.value)}
        className="text-sm border border-[var(--color-border-light)] rounded-xl px-3 py-3 text-[var(--color-text-secondary)] bg-[var(--color-bg-secondary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/20 cursor-pointer"
        aria-label="Sortierung"
      >
        <option value="newest">Neueste</option>
        <option value="price_asc">Preis aufsteigend</option>
        <option value="price_desc">Preis absteigend</option>
        <option value="rating">Beste Bewertung</option>
      </select>
    </div>
  );
}
