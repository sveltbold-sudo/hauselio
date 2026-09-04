import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import { prisma } from "@/lib/prisma";
import CategoryPage from "@/components/product/CategoryPage";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";
import { logger } from "@/lib/logger";
import { SITE_URL } from "@/lib/constants";

export const dynamic = "force-dynamic";

const getCategory = cache(async (slug: string) => {
  try {
    return await prisma.category.findUnique({
      where: { slug },
      select: { name: true, description: true },
    });
  } catch (error) {
    logger.error("kategorie-slug", error);
    return null;
  }
});

export async function generateStaticParams() {
  try {
    const categories = await prisma.category.findMany({
      select: { slug: true },
    });
    return categories.map((c) => ({ slug: c.slug }));
  } catch {
    return [];
  }
}

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string; sort?: string; brand?: string; sub?: string }>;
}

export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const sp = await searchParams;
  const sub = sp.sub || undefined;
  const category = await getCategory(slug);

  if (!category) {
    return { title: "Kategorie nicht gefunden" };
  }

  const pageTitle = sub
    ? `${sub} | ${category.name} | HAUSAURA`
    : `${category.name} online kaufen | HAUSAURA`;
  const pageDescription = sub
    ? `Entdecken Sie unsere ${sub} Auswahl in der Kategorie ${category.name}. Kostenloser Versand ab 50€, 30 Tage Rückgaberecht.`
    : category.description || `Hochwertige ${category.name} bei HAUSAURA entdecken. Kostenloser Versand ab 50€, 30 Tage Rückgaberecht.`;
  const canonical = sub
    ? `/kategorie/${slug}?sub=${encodeURIComponent(sub)}`
    : `/kategorie/${slug}`;

  return {
    title: pageTitle,
    description: pageDescription,
    alternates: {
      canonical,
    },
    openGraph: {
      title: pageTitle,
      description: pageDescription,
      url: canonical,
      siteName: "HAUSAURA",
      locale: "de_DE",
      type: "website",
      images: [{ url: `${SITE_URL}/logos/logoprincipale.png`, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description: pageDescription,
      images: [`${SITE_URL}/logos/logoprincipale.png`],
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

  const category = await getCategory(slug);

  if (!category) {
    notFound();
  }

  const PAGE_SIZE = 20;
  const skip = (page - 1) * PAGE_SIZE;

  let orderBy: Record<string, string> = { createdAt: "desc" };
  if (sort === "price_asc") orderBy = { price: "asc" };
  else if (sort === "price_desc") orderBy = { price: "desc" };
  else if (sort === "rating") orderBy = { rating: "desc" };
  else if (sort === "popular") orderBy = { reviewCount: "desc" };

  const where: Record<string, unknown> = { category: { slug } };
  if (brand) where.brand = { slug: brand };
  if (sub) where.subCategory = sub;

  let products: {
    id: string; name: string; slug: string; price: number;
    originalPrice: number | null; rating: number; reviewCount: number;
    isNew: boolean; isPromo: boolean;
    brand: { name: string } | null; images: { url: string }[];
  }[] = [];
  let total = 0;
  let brands: { name: string; slug: string; _count: { products: number } }[] = [];
  let subCategories: { subCategory: string | null; _count: number }[] = [];

  try {
    const [raw, count, brandData, subData] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          brand: { select: { name: true } },
          images: { take: 1, orderBy: { position: "asc" } },
        },
        orderBy,
        skip,
        take: PAGE_SIZE,
      }),
      prisma.product.count({ where }),
      prisma.brand.findMany({
        select: {
          name: true,
          slug: true,
          _count: { select: { products: { where: { category: { slug } } } } },
        },
        where: { products: { some: { category: { slug } } } },
        orderBy: { name: "asc" },
      }),
      prisma.product.groupBy({
        by: ["subCategory"],
        where: { category: { slug }, subCategory: { not: null } },
        _count: true,
        orderBy: { _count: { subCategory: "desc" } },
      }),
    ]);
    total = count;
    products = raw;
    brands = brandData;
    subCategories = subData;
  } catch (error) {
    logger.error("kategorie-slug-products", error);
  }

  const formattedProducts = products.map((p) => ({
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

  const formattedBrands = brands.map((b) => ({
    name: b.name,
    slug: b.slug,
    count: b._count.products,
  }));

  const formattedSubs = subCategories
    .filter((s) => s.subCategory)
    .map((s) => ({ name: s.subCategory!, count: s._count }));

  const breadcrumbItems = [
    { name: "Startseite", url: "/" },
    { name: "Kategorien", url: "/kategorie" },
    { name: category.name, url: `/kategorie/${slug}` },
  ];
  if (sub) {
    breadcrumbItems.push({ name: sub, url: `/kategorie/${slug}?sub=${encodeURIComponent(sub)}` });
  }

  const collectionName = sub ? `${sub} | ${category.name}` : category.name;
  const collectionDescription = sub
    ? `Entdecken Sie unsere ${sub} Auswahl in der Kategorie ${category.name}`
    : category.description || `Entdecken Sie unsere ${category.name} Kollektion`;
  const collectionUrl = sub
    ? `${SITE_URL}/kategorie/${slug}?sub=${encodeURIComponent(sub)}`
    : `${SITE_URL}/kategorie/${slug}`;

  return (
    <>
      <BreadcrumbJsonLd items={breadcrumbItems} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: collectionName,
            description: collectionDescription,
            url: collectionUrl,
          }),
        }}
      />
      <main id="main-content">
        <CategoryPage
          slug={slug}
          title={category.name}
          sub={sub}
          description={category.description || ""}
          page={page}
          sort={sort}
          brand={brand}
          products={formattedProducts}
          total={total}
          brands={formattedBrands}
          subCategories={formattedSubs}
        />
      </main>
    </>
  );
}
