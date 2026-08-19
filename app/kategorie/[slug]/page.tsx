import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import { prisma } from "@/lib/prisma";
import CategoryPage from "@/components/product/CategoryPage";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";
import { logger } from "@/lib/logger";
import { SITE_URL } from "@/lib/constants";

export const revalidate = 300;

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
  searchParams: Promise<{ page?: string; sort?: string; brand?: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategory(slug);

  if (!category) {
    return { title: "Kategorie nicht gefunden" };
  }

  return {
    title: category.name,
    description: category.description || `Entdecken Sie unsere ${category.name} Kollektion`,
    alternates: {
      canonical: `/kategorie/${slug}`,
    },
    openGraph: {
      title: category.name,
      description: category.description || `Entdecken Sie unsere ${category.name} Kollektion`,
      url: `/kategorie/${slug}`,
      siteName: "HAUSELIO",
      locale: "de_DE",
      type: "website",
      images: [{ url: `${SITE_URL}/logos/logoprincipale.png`, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: category.name,
      description: category.description || `Entdecken Sie unsere ${category.name} Kollektion`,
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

  const category = await getCategory(slug);

  if (!category) {
    notFound();
  }

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Startseite", url: "/" },
          { name: "Shop", url: "/shop" },
          { name: category.name, url: `/kategorie/${slug}` },
        ]}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: category.name,
            description: category.description || `Entdecken Sie unsere ${category.name} Kollektion`,
            url: `${SITE_URL}/kategorie/${slug}`,
          }),
        }}
      />
      <CategoryPage
        slug={slug}
        title={category.name}
        description={category.description || ""}
        page={page}
        sort={sort}
        brand={brand}
      />
    </>
  );
}
