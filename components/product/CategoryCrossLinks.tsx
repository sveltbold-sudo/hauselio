import Link from "next/link";
import { navCategories } from "@/lib/navigation";
import { ArrowRight } from "lucide-react";
import CategoryIcon from "@/components/ui/CategoryIcon";

interface CategoryCrossLinksProps {
  currentCategorySlug: string;
}

export default function CategoryCrossLinks({ currentCategorySlug }: CategoryCrossLinksProps) {
  const otherCategories = navCategories.filter((c) => !c.href.includes(currentCategorySlug));

  if (otherCategories.length === 0) return null;

  return (
    <section aria-labelledby="category-cross-links-heading">
      <h2 id="category-cross-links-heading" className="text-xl sm:text-2xl font-bold text-[var(--color-text-primary)] mb-4">
        Weitere Kategorien entdecken
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {otherCategories.map((cat) => (
          <Link
            key={cat.href}
            href={cat.href}
            className="group flex flex-col items-center gap-3 p-5 bg-white rounded-xl border border-[var(--color-border-light)] hover:border-[var(--color-primary)]/30 hover:shadow-md transition-all text-center"
          >
            <CategoryIcon category={cat.icon} className="w-8 h-8 text-[var(--color-primary)] group-hover:scale-110 transition-transform" />
            <div>
              <h3 className="text-sm font-semibold text-[var(--color-text-primary)] group-hover:text-[var(--color-primary)] transition-colors">
                {cat.name}
              </h3>
              <p className="text-xs text-[var(--color-text-muted)] mt-0.5 line-clamp-1">
                {cat.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
