import Link from "next/link";
import Image from "next/image";
import { Clock, ArrowRight } from "lucide-react";
import type { RatgeberArticleListItem } from "@/lib/ratgeber";
import { formatDate, getReadingTimeText } from "@/lib/ratgeber";

interface RatgeberArticleCardProps {
  article: RatgeberArticleListItem;
}

const CATEGORY_COLORS: Record<string, string> = {
  kueche: "bg-orange-100 text-orange-800",
  kaffee: "bg-amber-100 text-amber-800",
  reinigung: "bg-blue-100 text-blue-800",
  klima: "bg-cyan-100 text-cyan-800",
  "smart-home": "bg-purple-100 text-purple-800",
  haushaltsgeraete: "bg-green-100 text-green-800",
  tipps: "bg-pink-100 text-pink-800",
};

const CATEGORY_LABELS: Record<string, string> = {
  kueche: "Küche",
  kaffee: "Kaffee",
  reinigung: "Reinigung",
  klima: "Klima",
  "smart-home": "Smart Home",
  haushaltsgeraete: "Haushaltsgeräte",
  tipps: "Tipps & Tricks",
};

export default function RatgeberArticleCard({ article }: RatgeberArticleCardProps) {
  const colorClass = CATEGORY_COLORS[article.category] || "bg-gray-100 text-gray-800";
  const categoryLabel = CATEGORY_LABELS[article.category] || article.category;

  return (
    <Link
      href={`/ratgeber/${article.slug}`}
      className="group block bg-white rounded-2xl border border-[var(--color-border-light)] overflow-hidden hover:border-[var(--color-primary)]/30 hover:shadow-[var(--shadow-card-hover)] transition-all duration-300"
    >
      {/* Image */}
      <div className="aspect-[16/9] overflow-hidden bg-[var(--color-bg-secondary)]">
        {article.coverImage ? (
          <Image
            src={article.coverImage}
            alt={article.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[var(--color-text-muted)]">
            <span className="text-4xl">📖</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 sm:p-6">
        {/* Category badge */}
        <div className="flex items-center gap-2 mb-3">
          <span className={`inline-block px-2.5 py-0.5 text-xs font-semibold rounded-full ${colorClass}`}>
            {categoryLabel}
          </span>
          {article.readingTime && (
            <span className="flex items-center gap-1 text-xs text-[var(--color-text-muted)]">
              <Clock className="w-3 h-3" />
              {getReadingTimeText(article.readingTime)}
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="font-semibold text-[var(--color-text-primary)] group-hover:text-[var(--color-primary)] transition-colors line-clamp-2 mb-2">
          {article.title}
        </h3>

        {/* Excerpt */}
        {article.excerpt && (
          <p className="text-sm text-[var(--color-text-secondary)] line-clamp-2 mb-4">
            {article.excerpt}
          </p>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between text-xs text-[var(--color-text-muted)]">
          <span>{formatDate(article.publishedAt)}</span>
          <span className="flex items-center gap-1 text-[var(--color-primary)] font-medium group-hover:gap-2 transition-all">
            Weiterlesen <ArrowRight className="w-3 h-3" />
          </span>
        </div>
      </div>
    </Link>
  );
}
