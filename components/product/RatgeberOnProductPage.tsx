import Link from "next/link";
import Image from "next/image";
import { BookOpen } from "lucide-react";
import type { RatgeberArticleListItem } from "@/lib/ratgeber";
import { formatDate, getReadingTimeText } from "@/lib/ratgeber";

const CATEGORY_LABELS: Record<string, string> = {
  kueche: "Küche",
  kaffee: "Kaffee",
  reinigung: "Reinigung",
  klima: "Klima",
  "smart-home": "Smart Home",
  haushaltsgeraete: "Haushaltsgeräte",
  tipps: "Tipps & Tricks",
};

interface RatgeberOnProductPageProps {
  articles: RatgeberArticleListItem[];
  categorySlug: string;
}

export default function RatgeberOnProductPage({ articles, categorySlug }: RatgeberOnProductPageProps) {
  if (articles.length === 0) return null;

  return (
    <section aria-labelledby="ratgeber-on-product-heading">
      <div className="flex items-center justify-between mb-6">
        <h2 id="ratgeber-on-product-heading" className="text-xl sm:text-2xl font-bold text-[var(--color-text-primary)]">
          Passende Tipps & Ratgeber
        </h2>
        <Link
          href={`/ratgeber?category=${categorySlug}`}
          className="text-sm font-medium text-[var(--color-primary)] hover:underline"
        >
          Mehr Artikel
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {articles.map((article) => (
          <Link
            key={article.id}
            href={`/ratgeber/${article.slug}`}
            className="group flex gap-4 p-4 bg-white rounded-xl border border-[var(--color-border-light)] hover:border-[var(--color-primary)]/30 hover:shadow-md transition-all"
          >
            <div className="relative w-20 h-20 shrink-0 rounded-lg overflow-hidden bg-[var(--color-bg-secondary)]">
              {article.coverImage ? (
                <Image
                  src={article.coverImage}
                  alt={article.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="80px"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-[var(--color-text-muted)]" />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <span className="inline-block text-xs font-medium text-[var(--color-primary)] mb-1">
                {CATEGORY_LABELS[article.category] || article.category}
              </span>
              <h3 className="text-sm font-semibold text-[var(--color-text-primary)] line-clamp-2 group-hover:text-[var(--color-primary)] transition-colors">
                {article.title}
              </h3>
              <p className="text-xs text-[var(--color-text-muted)] mt-1">
                {getReadingTimeText(article.readingTime)}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
