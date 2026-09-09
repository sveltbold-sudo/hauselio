import { Suspense } from "react";
import type { Metadata } from "next";
import { BookOpen } from "lucide-react";
import Link from "next/link";
import Breadcrumb from "@/components/ui/Breadcrumb";
import RatgeberArticleCard from "@/components/ratgeber/RatgeberArticleCard";
import RatgeberSidebar from "@/components/ratgeber/RatgeberSidebar";
import RatgeberCategoryNav from "@/components/ratgeber/RatgeberCategoryNav";
import {
  getPublishedArticles,
  getFeaturedArticles,
  getCategoryArticleCounts,
  RATGEBER_PAGE_SIZE,
} from "@/lib/ratgeber";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Ratgeber & Haushalts-Tipps",
  description:
    "Nützliche Tipps, Kaufberatungen und Ratgeber für Haushaltsgeräte. Erfahren Sie, wie Sie die richtigen Küchengeräte, Staubsauger und Smart-Home-Produkte wählen.",
  alternates: { canonical: `${SITE_URL}/ratgeber` },
  openGraph: {
    title: "Ratgeber & Haushalts-Tipps | HAUSAURA",
    description:
      "Nützliche Tipps, Kaufberatungen und Ratgeber für Haushaltsgeräte.",
    url: `${SITE_URL}/ratgeber`,
    siteName: "HAUSAURA",
    locale: "de_DE",
    type: "website",
    images: [{ url: `${SITE_URL}/logos/logoprincipale.png`, width: 1200, height: 630 }],
  },
};

interface RatgeberPageProps {
  searchParams: Promise<{ category?: string; page?: string }>;
}

export default async function RatgeberPage({ searchParams }: RatgeberPageProps) {
  const sp = await searchParams;
  const category = sp.category || "alle";
  const page = Math.max(1, parseInt(sp.page || "1", 10) || 1);

  const [{ articles, total }, featuredArticles, categoryCounts] = await Promise.all([
    getPublishedArticles(category === "alle" ? undefined : category, page),
    getFeaturedArticles(3),
    getCategoryArticleCounts(),
  ]);

  const totalPages = Math.ceil(total / RATGEBER_PAGE_SIZE);

  function pageUrl(p: number) {
    const params = new URLSearchParams();
    if (category !== "alle") params.set("category", category);
    if (p > 1) params.set("page", String(p));
    return `/ratgeber${params.toString() ? `?${params.toString()}` : ""}`;
  }

  return (
    <div className="container-hausaura py-6 sm:py-8 lg:py-10">
      <Breadcrumb items={[{ label: "Ratgeber", href: "/ratgeber" }]} />

      {articles.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ItemList",
              name: "Ratgeber & Tipps",
              url: `${SITE_URL}/ratgeber`,
              itemListElement: articles.map((article, i) => ({
                "@type": "ListItem",
                position: (page - 1) * 9 + i + 1,
                item: {
                  "@type": "Article",
                  headline: article.title,
                  url: `${SITE_URL}/ratgeber/${article.slug}`,
                  image: article.coverImage
                    ? article.coverImage.startsWith("http")
                      ? article.coverImage
                      : `${SITE_URL}${article.coverImage}`
                    : undefined,
                  datePublished: article.publishedAt?.toISOString() || article.createdAt.toISOString(),
                  author: { "@type": "Organization", name: article.authorName },
                },
              })),
            }).replace(/</g, "\\u003C"),
          }}
        />
      )}

      {/* Hero */}
      <div className="text-center mb-8 sm:mb-12">
        <p className="caption text-[var(--color-accent)] mb-3">Ratgeber</p>
        <h1 className="heading-1 mb-3">Tipps & Kaufberatung</h1>
        <p className="body-large max-w-2xl mx-auto text-[var(--color-text-secondary)]">
          Nützliche Ratgeber, Vergleiche und Tipps für die richtige Auswahl Ihrer Haushaltsgeräte.
          Erfahren Sie, was bei Kauf und Nutzung wichtig ist.
        </p>
      </div>

      {/* Category Nav */}
      <div className="mb-8">
        <Suspense fallback={null}>
          <RatgeberCategoryNav currentCategory={category} categoryCounts={categoryCounts} />
        </Suspense>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
        {/* Articles Grid */}
        <div className="flex-1">
          {articles.length === 0 ? (
            <div className="text-center py-16">
              <BookOpen className="w-12 h-12 text-[var(--color-text-muted)] mx-auto mb-4" />
              <p className="text-[var(--color-text-muted)]">
                Keine Artikel in dieser Kategorie gefunden.
              </p>
              <Link
                href="/ratgeber"
                className="inline-block mt-4 text-[var(--color-primary)] hover:underline"
              >
                Alle Artikel ansehen
              </Link>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {articles.map((article) => (
                  <RatgeberArticleCard key={article.id} article={article} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <nav className="flex justify-center items-center gap-2 mt-10" aria-label="Seitennavigation">
                  {page > 1 && (
                    <Link
                      href={pageUrl(page - 1)}
                      className="px-4 py-2.5 text-sm rounded-xl font-medium text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
                    >
                      Zurück
                    </Link>
                  )}
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <Link
                      key={p}
                      href={pageUrl(p)}
                      aria-current={p === page ? "page" : undefined}
                      className={`min-w-[40px] h-10 flex items-center justify-center text-sm rounded-xl font-medium transition-colors ${
                        p === page
                          ? "bg-[var(--color-primary)] text-white shadow-md shadow-[var(--color-primary)]/15"
                          : "text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)]"
                      }`}
                    >
                      {p}
                    </Link>
                  ))}
                  {page < totalPages && (
                    <Link
                      href={pageUrl(page + 1)}
                      className="px-4 py-2.5 text-sm rounded-xl font-medium text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
                    >
                      Weiter
                    </Link>
                  )}
                </nav>
              )}
            </>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:w-72 shrink-0">
          <RatgeberSidebar
            categories={Object.entries(categoryCounts).map(([slug, count]) => ({
              slug,
              name: slug,
              count,
            }))}
            featuredArticles={featuredArticles}
            currentCategory={category}
          />
        </div>
      </div>
    </div>
  );
}
