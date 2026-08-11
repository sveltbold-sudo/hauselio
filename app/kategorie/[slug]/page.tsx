import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import CategoryPage from "@/components/product/CategoryPage";

export const revalidate = 300;

export async function generateStaticParams() {
  const categories = await prisma.category.findMany({
    select: { slug: true },
  });
  return categories.map((c) => ({ slug: c.slug }));
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await prisma.category.findUnique({
    where: { slug },
    select: { name: true, description: true },
  });

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

export default async function CategorySlugPage({ params }: PageProps) {
  const { slug } = await params;

  const category = await prisma.category.findUnique({
    where: { slug },
    select: { name: true, description: true },
  });

  if (!category) {
    notFound();
  }

  return (
    <CategoryPage
      slug={slug}
      title={category.name}
      description={category.description || ""}
    />
  );
}
