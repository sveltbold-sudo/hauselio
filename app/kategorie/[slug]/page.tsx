import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import CategoryPage from "@/components/product/CategoryPage";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";
import { SITE_URL } from "@/lib/constants";

export const revalidate = 300;

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
  searchParams: Promise<{ page?: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  let category;
  try {
    category = await prisma.category.findUnique({
      where: { slug },
      select: { name: true, description: true },
    });
  } catch (error) {
    console.error("[HAUSELIO] DB error in kategorie/[slug]/generateMetadata:", error);
    return { title: "Kategorie nicht gefunden" };
  }

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
    },
  };
}

export default async function CategorySlugPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const sp = await searchParams;
  const page = Math.max(1, parseInt(sp.page || "1", 10) || 1);

  let category;
  try {
    category = await prisma.category.findUnique({
      where: { slug },
      select: { name: true, description: true },
    });
  } catch (error) {
    console.error("[HAUSELIO] DB error in kategorie/[slug]/page.tsx:", error);
    notFound();
  }

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
      <CategoryPage
        slug={slug}
        title={category.name}
        description={category.description || ""}
        page={page}
      />
    </>
  );
}
