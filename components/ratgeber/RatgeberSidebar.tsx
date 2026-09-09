import Link from "next/link";
import { TrendingUp, BookOpen } from "lucide-react";
import type { RatgeberArticleListItem } from "@/lib/ratgeber";
import { formatDate, getReadingTimeText } from "@/lib/ratgeber";

interface RatgeberSidebarProps {
  categories: { slug: string; name: string; count: number }[];
  featuredArticles: RatgeberArticleListItem[];
  currentCategory?: string;
}

const CATEGORY_LABELS: Record<string, string> = {
  kueche: "Küche",
  kaffee: "Kaffee",
  reinigung: "Reinigung",
  klima: "Klima",
  "smart-home": "Smart Home",
  haushaltsgeraete: "Haushaltsgeräte",
  tipps: "Tipps & Tricks",
};

export default function RatgeberSidebar({
  categories,
  featuredArticles,
  currentCategory,
}: RatgeberSidebarProps) {
  return (
    <aside className="space-y-8">
      {/* Categories */}
      <div className="bg-white rounded-2xl border border-[var(--color-border-light)] p-6">
        <h3 className="font-semibold text-[var(--color-text-primary)] mb-4 flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-[var(--color-primary)]" />
          Kategorien
        </h3>
        <nav className="space-y-1">
          <Link
            href="/ratgeber"
            className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
              !currentCategory
                ? "bg-[var(--color-primary)]/10 text-[var(--color-primary)] font-medium"
                : "text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)]"
            }`}
          >
            Alle Artikel
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/ratgeber?category=${cat.slug}`}
              className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                currentCategory === cat.slug
                  ? "bg-[var(--color-primary)]/10 text-[var(--color-primary)] font-medium"
                  : "text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)]"
              }`}
            >
              {CATEGORY_LABELS[cat.slug] || cat.name}
              <span className="ml-1 text-xs text-[var(--color-text-muted)]">({cat.count})</span>
            </Link>
          ))}
        </nav>
      </div>

      {/* Featured Articles */}
      {featuredArticles.length > 0 && (
        <div className="bg-white rounded-2xl border border-[var(--color-border-light)] p-6">
          <h3 className="font-semibold text-[var(--color-text-primary)] mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[var(--color-accent)]" />
            Beliebte Artikel
          </h3>
          <div className="space-y-4">
            {featuredArticles.map((article) => (
              <Link
                key={article.id}
                href={`/ratgeber/${article.slug}`}
                className="block group"
              >
                <h4 className="text-sm font-medium text-[var(--color-text-primary)] group-hover:text-[var(--color-primary)] transition-colors line-clamp-2 mb-1">
                  {article.title}
                </h4>
                <div className="flex items-center gap-2 text-xs text-[var(--color-text-muted)]">
                  <span>{formatDate(article.publishedAt)}</span>
                  {article.readingTime && (
                    <>
                      <span>·</span>
                      <span>{getReadingTimeText(article.readingTime)}</span>
                    </>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </aside>
  );
}
