import Link from "next/link";
import Image from "next/image";
import { BookOpen, ArrowRight } from "lucide-react";
import type { RatgeberArticleListItem } from "@/lib/ratgeber";
import { getReadingTimeText } from "@/lib/ratgeber";
import { getBlurDataURL } from "@/lib/image-helpers";

const CATEGORY_LABELS: Record<string, string> = {
  kueche: "Küche",
  kaffee: "Kaffee",
  reinigung: "Reinigung",
  klima: "Klima",
  "smart-home": "Smart Home",
  haushaltsgeraete: "Haushaltsgeräte",
  tipps: "Tipps & Tricks",
};

interface RatgeberSectionProps {
  articles: RatgeberArticleListItem[];
}

export default function RatgeberSection({ articles }: RatgeberSectionProps) {
  if (articles.length === 0) return null;

  return (
    <section aria-labelledby="ratgeber-section-heading" className="py-12 sm:py-16">
      <div className="container-hausaura">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 id="ratgeber-section-heading" className="text-2xl sm:text-3xl font-extrabold text-[var(--color-text-primary)] tracking-tight">
              Tipps & Ratgeber
            </h2>
            <p className="text-[var(--color-text-muted)] mt-1">
              Hilfreiche Ratgeber für Ihre Haushaltsgeräte
            </p>
          </div>
          <Link
            href="/ratgeber"
            className="hidden sm:flex items-center gap-1 text-sm font-medium text-[var(--color-primary)] hover:underline"
          >
            Alle Artikel
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <Link
              key={article.id}
              href={`/ratgeber/${article.slug}`}
              className="group block bg-white rounded-2xl border border-[var(--color-border-light)] overflow-hidden hover:border-[var(--color-primary)]/30 hover:shadow-[var(--shadow-card-hover)] transition-all duration-300"
            >
              <div className="aspect-[16/9] overflow-hidden bg-[var(--color-bg-secondary)]">
                {article.coverImage ? (
                  <Image
                    src={article.coverImage}
                    alt={article.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    placeholder="blur"
                    blurDataURL={getBlurDataURL(article.coverImage)}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <BookOpen className="w-10 h-10 text-[var(--color-text-muted)]" />
                  </div>
                )}
              </div>
              <div className="p-5">
                <span className="inline-block text-xs font-semibold text-[var(--color-primary)] mb-2">
                  {CATEGORY_LABELS[article.category] || article.category}
                </span>
                <h3 className="text-lg font-bold text-[var(--color-text-primary)] line-clamp-2 group-hover:text-[var(--color-primary)] transition-colors">
                  {article.title}
                </h3>
                {article.excerpt && (
                  <p className="text-sm text-[var(--color-text-muted)] mt-2 line-clamp-2">
                    {article.excerpt}
                  </p>
                )}
                <p className="text-xs text-[var(--color-text-muted)] mt-3">
                  {getReadingTimeText(article.readingTime)}
                </p>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-6 text-center sm:hidden">
          <Link
            href="/ratgeber"
            className="inline-flex items-center gap-1 text-sm font-medium text-[var(--color-primary)] hover:underline"
          >
            Alle Artikel anzeigen
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
