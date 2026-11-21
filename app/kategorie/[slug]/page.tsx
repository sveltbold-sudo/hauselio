import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import CategoryPage from "@/components/product/CategoryPage";
import type { CategoryProduct, CategoryBrand } from "@/components/product/CategoryPage";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";
import { getArticlesByCategory } from "@/lib/ratgeber";
import { logger } from "@/lib/logger";
import { SITE_URL, SITE_NAME } from "@/lib/constants";
import { CATEGORY_CONTENT } from "@/lib/category-content";
import { metaDescription } from "@/lib/seo";

export const revalidate = 300;

const PAGE_SIZE = 20;

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string; sort?: string; brand?: string; sub?: string }>;
}

export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const sp = await searchParams;
  const sub = sp.sub || undefined;
  const pageNumber = Math.max(1, parseInt(sp.page || "1", 10) || 1);

  const category = await prisma.category.findUnique({
    where: { slug },
    select: { name: true, description: true, longDescription: true, image: true },
  }).catch(() => null);

  if (!category) {
    return { title: "Kategorie nicht gefunden", robots: { index: false, follow: false } };
  }

  const pageTitle = sub
    ? `${sub} | ${category.name}`
    : `${category.name} online kaufen`;
  const baseDescription = sub
    ? `Entdecken Sie unsere ${sub} Auswahl in der Kategorie ${category.name}.`
    : category.description || `Hochwertige ${category.name} bei ${SITE_NAME} entdecken.`;
  const pageDescription = metaDescription(
    `${baseDescription} Kostenloser Versand ab 50 €, 30 Tage Rückgaberecht.`,
  );

  // Keep pagination self-referencing. Sort and brand filters canonicalise to the
  // clean category URL so they never compete with /marken pages.
  const canonicalParams = new URLSearchParams();
  if (sub) canonicalParams.set("sub", sub);
  if (pageNumber > 1) canonicalParams.set("page", String(pageNumber));
  const canonicalQuery = canonicalParams.toString();
  const canonical = `${SITE_URL}/kategorie/${slug}${canonicalQuery ? `?${canonicalQuery}` : ""}`;

  return {
    title: pageTitle,
    description: pageDescription,
    alternates: { canonical },
    robots: sp.sort || sp.brand ? { index: false, follow: true } : { index: true, follow: true },
    openGraph: {
      title: pageTitle,
      description: pageDescription,
      url: canonical,
      siteName: SITE_NAME,      locale: "de_DE",
      type: "website",
      images: [{ url: category.image ? (category.image.startsWith("http") ? category.image : `${SITE_URL}${category.image}`) : `${SITE_URL}/og/hausaura-og.png`, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description: pageDescription,
      images: [`${SITE_URL}/og/hausaura-og.png`],
    },
  };
}

export default async function CategorySlugPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const sp = await searchParams;
  const page = Math.max(1, parseInt(sp.page || "1", 10) || 1);
  const sort = sp.sort || "newest";
  const brand = sp.brand || undefined;
  const sub = sp.sub || undefined;

  const category = await prisma.category.findUnique({
    where: { slug },
    select: { name: true, description: true, longDescription: true, image: true },
  }).catch(() => null);

  if (!category) {
    notFound();
  }

  const skip = (page - 1) * PAGE_SIZE;

  let orderBy: Prisma.ProductOrderByWithRelationInput = { createdAt: "desc" };
  if (sort === "price_asc") orderBy = { price: "asc" };
  else if (sort === "price_desc") orderBy = { price: "desc" };
  else if (sort === "rating") orderBy = { rating: "desc" };
  else if (sort === "popular") orderBy = { reviewCount: "desc" };
  else if (sort === "name") orderBy = { name: "asc" };

  const where: Prisma.ProductWhereInput = { category: { slug } };
  if (brand) where.brand = { slug: brand };
  if (sub) where.subCategory = sub;

  let products: CategoryProduct[] = [];
  let total = 0;
  let brands: CategoryBrand[] = [];
  let subCategories: { name: string; count: number }[] = [];

  try {
    const raw = await prisma.product.findMany({
      where,
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
        brand: { select: { name: true } },
        images: { take: 1, orderBy: { position: "asc" as const }, select: { url: true } },
      },
      orderBy,
      skip,
      take: PAGE_SIZE,
    });
    products = raw.map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      price: Number(p.price),
      originalPrice: p.originalPrice ? Number(p.originalPrice) : null,
      rating: Number(p.rating),
      reviewCount: p.reviewCount,
      isNew: p.isNew,
      isPromo: p.isPromo,
      brand: p.brand?.name || null,
      image: p.images[0]?.url || "/images/placeholder-product.svg",
      categorySlug: slug,
    }));
  } catch (error) {
    logger.error("kategorie-products", error);
  }

  try {
    total = await prisma.product.count({ where });
  } catch (error) {
    logger.error("kategorie-count", error);
  }

  try {
    const brandData = await prisma.brand.findMany({
      select: {
        name: true,
        slug: true,
        _count: { select: { products: { where: { category: { slug } } } } },
      },
      where: { products: { some: { category: { slug } } } },
      orderBy: { name: "asc" },
    });
    brands = brandData.map((b) => ({
      name: b.name,
      slug: b.slug,
      count: b._count.products,
    }));
  } catch (error) {
    logger.error("kategorie-brands", error);
  }

  try {
    const subData = await prisma.product.groupBy({
      by: ["subCategory"],
      where: { category: { slug }, subCategory: { not: null } },
      _count: true,
      orderBy: { _count: { subCategory: "desc" } },
    });
    subCategories = subData
      .filter((s) => s.subCategory)
      .map((s) => ({ name: s.subCategory!, count: s._count }));
  } catch (error) {
    logger.error("kategorie-subs", error);
  }

  const breadcrumbItems = [
    { name: "Startseite", url: SITE_URL },
    { name: "Kategorien", url: `${SITE_URL}/kategorie` },
    { name: category.name, url: `${SITE_URL}/kategorie/${slug}` },
  ];
  if (sub) {
    breadcrumbItems.push({ name: sub, url: `${SITE_URL}/kategorie/${slug}?sub=${encodeURIComponent(sub)}` });
  }

  const collectionName = sub ? `${sub} | ${category.name}` : category.name;
  const collectionDescription = sub
    ? `Entdecken Sie unsere ${sub} Auswahl in der Kategorie ${category.name}`
    : category.description || `Entdecken Sie unsere ${category.name} Kollektion`;
  const collectionUrl = sub
    ? `${SITE_URL}/kategorie/${slug}?sub=${encodeURIComponent(sub)}`
    : `${SITE_URL}/kategorie/${slug}`;

  let ratgeberArticles: Awaited<ReturnType<typeof getArticlesByCategory>> = [];
  try {
    ratgeberArticles = await getArticlesByCategory(slug, 3);
  } catch (error) {
    logger.error("kategorie-ratgeber", error);
  }

  const editorial = CATEGORY_CONTENT[slug];
  const longDescription = category.longDescription || editorial?.longDescription;
  const faqs = editorial?.faqs ?? [];

  return (
    <>
      <BreadcrumbJsonLd items={breadcrumbItems} />
      {!sub && faqs.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: faqs.map((faq) => ({
                "@type": "Question",
                name: faq.question,
                acceptedAnswer: { "@type": "Answer", text: faq.answer },
              })),
            }).replace(/</g, "\\u003C"),
          }}
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: collectionName,
            description: collectionDescription,
            url: collectionUrl,
          }).replace(/</g, "\\u003C"),
        }}
      />
      {products.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ItemList",
              name: collectionName,
              url: collectionUrl,
              itemListElement: products.slice(0, 20).map((p, i) => ({
                "@type": "ListItem",
                position: i + 1,
                item: {
                  "@type": "Product",
                  name: p.name,
                  url: `${SITE_URL}/produkt/${p.slug}`,
                  image: p.image.startsWith("http") ? p.image : `${SITE_URL}${p.image}`,
                  brand: p.brand ? { "@type": "Brand", name: p.brand } : undefined,
                  offers: {
                    "@type": "Offer",
                    price: p.price.toFixed(2),
                    priceCurrency: "EUR",
                    availability: "https://schema.org/InStock",
                  },
                },
              })),
            }).replace(/</g, "\\u003C"),
          }}
        />
      )}
      <main id="main-content">
        <CategoryPage
          slug={slug}
          title={category.name}
          sub={sub}
          description={category.description || ""}
          longDescription={longDescription}
          page={page}
          sort={sort}
          brand={brand}
          products={products}
          total={total}
          brands={brands}
          subCategories={subCategories}
          ratgeberArticles={ratgeberArticles}
          faqs={faqs}
        />
      </main>
    </>
  );
}
