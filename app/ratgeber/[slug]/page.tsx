import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { Calendar, Clock, User, Eye, ArrowLeft } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import RatgeberArticleContent from "@/components/ratgeber/RatgeberArticleContent";
import RatgeberArticleCard from "@/components/ratgeber/RatgeberArticleCard";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";
import { getArticleBySlug, getRelatedArticles, formatDate, getReadingTimeText } from "@/lib/ratgeber";
import { SITE_URL, SITE_NAME } from "@/lib/constants";

const CATEGORY_LABELS: Record<string, string> = {
  kueche: "Küche",
  kaffee: "Kaffee",
  reinigung: "Reinigung",
  klima: "Klima",
  "smart-home": "Smart Home",
  haushaltsgeraete: "Haushaltsgeräte",
  tipps: "Tipps & Tricks",
};

interface RatgeberArticlePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: RatgeberArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    return { title: "Artikel nicht gefunden", robots: { index: false } };
  }

  const title = article.seoTitle || `${article.title} | ${SITE_NAME}`;
  const desc = article.seoDesc || article.excerpt || article.title;

  return {
    title,
    description: desc.slice(0, 155),
    alternates: { canonical: `${SITE_URL}/ratgeber/${slug}` },
    openGraph: {
      title,
      description: desc,
      url: `${SITE_URL}/ratgeber/${slug}`,
      siteName: SITE_NAME,
      locale: "de_DE",
      type: "article",
      publishedTime: article.publishedAt?.toISOString(),
      authors: [article.authorName],
      images: article.coverImage
        ? [{ url: article.coverImage.startsWith("http") ? article.coverImage : `${SITE_URL}${article.coverImage}`, width: 1200, height: 630 }]
        : [{ url: `${SITE_URL}/logos/logoprincipale.png`, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: desc.slice(0, 155),
      images: [article.coverImage || `${SITE_URL}/logos/logoprincipale.png`],
    },
  };
}

export default async function RatgeberArticlePage({ params }: RatgeberArticlePageProps) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) notFound();

  const relatedArticles = await getRelatedArticles(article.category, slug, 3);
  const categoryLabel = CATEGORY_LABELS[article.category] || article.category;

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Startseite", url: SITE_URL },
          { name: "Ratgeber", url: `${SITE_URL}/ratgeber` },
          { name: article.title, url: `${SITE_URL}/ratgeber/${slug}` },
        ]}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: article.title,
            description: article.excerpt || article.title,
            image: article.coverImage
              ? article.coverImage.startsWith("http")
                ? article.coverImage
                : `${SITE_URL}${article.coverImage}`
              : `${SITE_URL}/logos/logoprincipale.png`,
            author: { "@type": "Organization", name: article.authorName },
            publisher: {
              "@type": "Organization",
              name: SITE_NAME,
              logo: { "@type": "ImageObject", url: `${SITE_URL}/logos/logoprincipale.png` },
            },
            datePublished: article.publishedAt?.toISOString(),
            dateModified: article.updatedAt.toISOString(),
            mainEntityOfPage: `${SITE_URL}/ratgeber/${slug}`,
          }),
        }}
      />

      <div className="container-hausaura py-6 sm:py-8 lg:py-10">
        <Breadcrumb
          items={[
            { label: "Ratgeber", href: "/ratgeber" },
            { label: article.title, href: `/ratgeber/${slug}` },
          ]}
        />

        <article className="max-w-4xl mx-auto">
          {/* Header */}
          <header className="mb-8 sm:mb-12">
            {/* Category badge */}
            <div className="flex items-center gap-3 mb-4">
              <Link
                href={`/ratgeber?category=${article.category}`}
                className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] hover:bg-[var(--color-primary)]/20 transition-colors"
              >
                {categoryLabel}
              </Link>
            </div>

            {/* Title */}
            <h1 className="heading-1 mb-4">{article.title}</h1>

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-[var(--color-text-muted)]">
              <span className="flex items-center gap-1.5">
                <User className="w-4 h-4" />
                {article.authorName}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                {formatDate(article.publishedAt)}
              </span>
              {article.readingTime && (
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  {getReadingTimeText(article.readingTime)}
                </span>
              )}
              <span className="flex items-center gap-1.5">
                <Eye className="w-4 h-4" />
                {article.viewCount} Aufrufe
              </span>
            </div>

            {/* Excerpt */}
            {article.excerpt && (
              <p className="body-large mt-6 text-[var(--color-text-secondary)] italic">
                {article.excerpt}
              </p>
            )}
          </header>

          {/* Cover Image */}
          {article.coverImage && (
            <div className="aspect-[16/9] rounded-2xl overflow-hidden mb-8 sm:mb-12 bg-[var(--color-bg-secondary)]">
              <img
                src={article.coverImage}
                alt={article.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Content */}
          <RatgeberArticleContent content={article.content} />

          {/* Tags */}
          {article.tags.length > 0 && (
            <div className="mt-8 pt-6 border-t border-[var(--color-border-light)]">
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 text-xs rounded-full bg-[var(--color-bg-secondary)] text-[var(--color-text-muted)]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </article>

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <section className="mt-12 sm:mt-16">
            <h2 className="heading-2 mb-6">Verwandte Artikel</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedArticles.map((a) => (
                <RatgeberArticleCard key={a.id} article={a} />
              ))}
            </div>
          </section>
        )}

        {/* Back link */}
        <div className="mt-10 text-center">
          <Link
            href="/ratgeber"
            className="inline-flex items-center gap-2 text-[var(--color-primary)] hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            Zurück zur Übersicht
          </Link>
        </div>
      </div>
    </>
  );
}
