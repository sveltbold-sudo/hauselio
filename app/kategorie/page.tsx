import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { SITE_URL } from "@/lib/constants";
import { logger } from "@/lib/logger";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";
import Breadcrumb from "@/components/ui/Breadcrumb";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Kategorien",
  description: "Entdecken Sie unser gesamtes Sortiment an Premium-Haushaltsgeräten. Küche, Kaffee, Reinigung, Klima, Smart Home und mehr.",
  alternates: { canonical: `${SITE_URL}/kategorie` },
  openGraph: {
    title: "Kategorien — HAUSAURA",
    description: "Entdecken Sie unser gesamtes Sortiment an Premium-Haushaltsgeräten.",
    siteName: "HAUSAURA",
    locale: "de_DE",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kategorien — HAUSAURA",
    description: "Entdecken Sie unser gesamtes Sortiment an Premium-Haushaltsgeräten.",
  },
};

async function getCategories() {
  try {
    return await prisma.category.findMany({
      include: {
        _count: { select: { products: true } },
        products: {
          take: 1,
          include: { images: { take: 1, orderBy: { position: "asc" } } },
          orderBy: { rating: "desc" },
        },
      },
      orderBy: { name: "asc" },
    });
  } catch (error) {
    logger.error("kategorie-page", error);
    return [];
  }
}

const categoryDescriptions: Record<string, string> = {
  kueche: "Hochwertige Küchengeräte für anspruchsvolle Köche. Von Induktionsherden bis zu Premium-Backöfen.",
  kaffee: "Premium Kaffeemaschinen für den perfekten Genuss. Vollautomaten, Espresso-Maschinen und Filterkaffee.",
  reinigung: "Effiziente Reinigungsgeräte für Ihr Zuhause. Staubsauger, Saugroboter und Dampfreiniger.",
  klima: "Klimaanlagen und Luftreiniger für jedes Raumklima. Heizen, Kühlen und Luftreinigung.",
  "smart-home": "Intelligente Geräte für ein vernetztes Zuhause. Thermostate, Beleuchtung und Sicherheit.",
  haushaltsgeraete: "Waschmaschinen, Trockner, Kühlschränke, Geschirrspüler und mehr für den täglichen Bedarf.",
};

export default async function KategoriePage() {
  const categories = await getCategories();

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Startseite", url: "/" },
          { name: "Kategorien", url: "/kategorie" },
        ]}
      />

      <div className="container-hausaura py-12">
        <div className="mb-10">
          <Breadcrumb items={[{ label: "Startseite", href: "/" }, { label: "Kategorien" }]} />

          <h1 className="heading-1 mb-4">Unsere Kategorien</h1>
          <p className="body-large max-w-2xl">
            Entdecken Sie unser Sortiment an Premium-Haushaltsgeräten. Finden Sie das perfekte Gerät für Ihr Zuhause.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/kategorie/${cat.slug}`}
              className="group bg-white rounded-2xl border border-[var(--color-border-light)] overflow-hidden hover:shadow-lg hover:border-[var(--color-primary)]/20 transition-colors transition-shadow duration-300"
            >
              <div className="aspect-[16/9] relative overflow-hidden bg-[var(--color-bg-secondary)]">
                {cat.products[0]?.images[0] ? (
                  <Image
                    src={cat.products[0].images[0].url}
                    alt={cat.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-4xl font-bold text-[var(--color-text-muted)]/20">
                      {cat.name.charAt(0)}
                    </span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <h2 className="heading-3 text-white mb-1">{cat.name}</h2>
                </div>
              </div>
              <div className="p-5">
                <p className="text-sm text-[var(--color-text-secondary)] line-clamp-2">
                  {categoryDescriptions[cat.slug] || cat.description || `Entdecken Sie unsere Auswahl an ${cat.name}-Produkten.`}
                </p>
                <div className="mt-4 flex items-center text-sm font-semibold text-[var(--color-primary)] group-hover:gap-2 transition-transform">
                  Produkte ansehen
                  <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
