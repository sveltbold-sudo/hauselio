"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { RATGEBER_CATEGORIES } from "@/lib/ratgeber";

interface RatgeberCategoryNavProps {
  currentCategory?: string;
  categoryCounts?: Record<string, number>;
}

export default function RatgeberCategoryNav({
  currentCategory = "alle",
  categoryCounts = {},
}: RatgeberCategoryNavProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function handleCategoryClick(slug: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (slug === "alle") {
      params.delete("category");
    } else {
      params.set("category", slug);
    }
    params.delete("page");
    router.push(`/ratgeber${params.toString() ? `?${params.toString()}` : ""}`);
  }

  return (
    <div className="flex flex-wrap gap-2">
      {RATGEBER_CATEGORIES.map((cat) => {
        const isActive = currentCategory === cat.slug;
        const count = cat.slug === "alle"
          ? Object.values(categoryCounts).reduce((a, b) => a + b, 0)
          : categoryCounts[cat.slug] || 0;

        return (
          <button
            key={cat.slug}
            onClick={() => handleCategoryClick(cat.slug)}
            className={`px-4 py-2 min-h-[40px] rounded-full text-sm font-medium transition-colors ${
              isActive
                ? "bg-[var(--color-primary)] text-white shadow-md shadow-[var(--color-primary)]/15"
                : "bg-[var(--color-bg-secondary)] text-[var(--color-text-secondary)] hover:bg-[var(--color-border-light)] hover:text-[var(--color-text-primary)]"
            }`}
          >
            {cat.name}
            {count > 0 && (
              <span className={`ml-1.5 text-xs ${isActive ? "text-white/70" : "text-[var(--color-text-muted)]"}`}>
                ({count})
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
