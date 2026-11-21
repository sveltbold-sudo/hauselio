import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cache } from "react";
import { ArrowRight } from "lucide-react";
import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/product/ProductCard";
import Breadcrumb from "@/components/ui/Breadcrumb";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";
import { SITE_URL, SITE_NAME } from "@/lib/constants";
import { OG_IMAGE, metaDescription } from "@/lib/seo";
import { BRAND_INTROS } from "@/lib/brand-content";
import { formatPrice } from "@/lib/utils";
import { logger } from "@/lib/logger";

export const revalidate = 3600;

interface PageProps {
  params: Promise<{ slug: string }>;
}

const getBrand = cache(async function getBrand(slug: string) {
  try {
    return await prisma.brand.findUnique({
      where: { slug },
      select: {
        name: true,
        slug: true,
        products: {
          orderBy: [{ isPromo: "desc" as const }, { name: "asc" as const }],
          select: {
            id: true,
            name: true,
            slug: true,
            price: true,
            originalPrice: true,
            rating: true,
            reviewCount: true,
            isNew: true,
            isPromo: true,
            images: {
              take: 1,
              orderBy: { position: "asc" as const },
              select: { url: true },
            },
            category: { select: { name: true, slug: true } },
          },
        },
      },
    });
  } catch (error) {
    logger.error("marke-slug", error);
    throw error;
  }
});

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const brand = await getBrand(slug);

  if (!brand || brand.products.length < 2) {
    return {
      title: "Marke nicht gefunden",
      robots: { index: false, follow: false },
    };
  }

  const prices = brand.products.map((product) => Number(product.price));
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const categoryNames = [...new Set(brand.products.map((product) => product.category?.name).filter(Boolean))];

  const description = metaDescription(
    `${brand.name} bei ${SITE_NAME}: ${brand.products.length} Produkte${
      categoryNames.length > 0 ? ` aus ${categoryNames.slice(0, 3).join(", ")}` : ""
    }. Preise von ${formatPrice(minPrice)} bis ${formatPrice(maxPrice)}. Jetzt online kaufen.`,
  );

  return {
    title: `${brand.name} Produkte online kaufen`,
    description,
    alternates: { canonical: `${SITE_URL}/marken/${brand.slug}` },
    openGraph: {
      title: `${brand.name} bei ${SITE_NAME}`,
      description,
      url: `${SITE_URL}/marken/${brand.slug}`,
      siteName: SITE_NAME,
      locale: "de_DE",
      type: "website",
      images: [OG_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title: `${brand.name} bei ${SITE_NAME}`,
      description,
      images: [OG_IMAGE.url],
    },
  };
}

export default async function MarkePage({ params }: PageProps) {
  const { slug } = await params;
  const brand = await getBrand(slug);

  if (!brand || brand.products.length < 2) notFound();

  const prices = brand.products.map((product) => Number(product.price));
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);

  const categoryMap = new Map<string, { name: string; slug: string; count: number }>();
  for (const product of brand.products) {
    if (!product.category) continue;
    const existing = categoryMap.get(product.category.slug);
    if (existing) existing.count += 1;
    else categoryMap.set(product.category.slug, { ...product.category, count: 1 });
  }
  const categories = [...categoryMap.values()].sort((a, b) => b.count - a.count);

  const intro =
    BRAND_INTROS[brand.slug] ||
    `${brand.name} ist mit ${brand.products.length} Produkten bei ${SITE_NAME} vertreten. Die Auswahl umfasst ${
      categories.map((category) => category.name).join(", ") || "verschiedene Kategorien"
    }.`;

  const products = brand.products.map((product) => ({
    id: product.id,
    name: product.name,
    slug: product.slug,
    price: Number(product.price),
    originalPrice: product.originalPrice ? Number(product.originalPrice) : null,
    image: product.images[0]?.url || "/images/placeholder-product.svg",
    rating: Number(product.rating),
    reviewCount: product.reviewCount,
    isNew: product.isNew,
    isPromo: product.isPromo,
    brand: brand.name,
    categorySlug: product.category?.slug ?? null,
  }));

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Startseite", url: SITE_URL },
          { name: "Marken", url: `${SITE_URL}/marken` },
          { name: brand.name, url: `${SITE_URL}/marken/${brand.slug}` },
        ]}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: `${brand.name} bei ${SITE_NAME}`,
            url: `${SITE_URL}/marken/${brand.slug}`,
            description: intro,
            about: { "@type": "Brand", name: brand.name },
            mainEntity: {
              "@type": "ItemList",
              numberOfItems: products.length,
              itemListElement: products.slice(0, 30).map((product, index) => ({
                "@type": "ListItem",
                position: index + 1,
                item: {
                  "@type": "Product",
                  name: product.name,
                  url: `${SITE_URL}/produkt/${product.slug}`,
                  image: product.image.startsWith("http")
                    ? product.image
                    : `${SITE_URL}${product.image}`,
                  brand: { "@type": "Brand", name: brand.name },
                  offers: {
                    "@type": "Offer",
                    price: product.price.toFixed(2),
                    priceCurrency: "EUR",
                    availability: "https://schema.org/InStock",
                  },
                },
              })),
            },
          }).replace(/</g, "\\u003C"),
        }}
      />

      <main id="main-content" className="container-hausaura py-6 sm:py-8 lg:py-10">
        <Breadcrumb items={[{ label: "Marken", href: "/marken" }, { label: brand.name }]} />

        <header className="max-w-3xl">
          <h1 className="heading-1">{brand.name} online kaufen</h1>
          <p className="body-large mt-3 text-[var(--color-text-secondary)]">{intro}</p>
          <p className="mt-3 text-sm text-[var(--color-text-muted)]">
            {products.length} Produkte · {formatPrice(minPrice)} bis {formatPrice(maxPrice)}
          </p>
        </header>

        {categories.length > 0 && (
          <nav aria-label={`Kategorien von ${brand.name}`} className="mt-6 flex flex-wrap gap-2">
            {categories.map((category) => (
              <Link
                key={category.slug}
                href={`/kategorie/${category.slug}?brand=${brand.slug}`}
                className="inline-flex min-h-[36px] items-center rounded-full border border-[var(--color-border-light)] bg-white px-3 text-sm hover:border-[var(--color-border)] hover:bg-[var(--color-bg-secondary)]"
              >
                {category.name}
                <span className="ml-1.5 text-xs text-[var(--color-text-muted)]">{category.count}</span>
              </Link>
            ))}
          </nav>
        )}

        <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <section className="mt-12 border-t border-[var(--color-border-light)] pt-8">
          <h2 className="heading-2 mb-3">Weitere Marken entdecken</h2>
          <p className="max-w-3xl text-[var(--color-text-secondary)]">
            Sie möchten {brand.name} mit anderen Herstellern vergleichen? Im Markenüberblick finden
            Sie alle Marken mit Produktzahl und gelangen direkt zu den jeweiligen Modellen.
          </p>
          <Link
            href="/marken"
            className="mt-4 inline-flex min-h-[44px] items-center gap-2 rounded-lg border border-[var(--color-border)] px-4 text-sm font-semibold hover:bg-[var(--color-bg-secondary)]"
          >
            Alle Marken
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </section>
      </main>
    </>
  );
}
