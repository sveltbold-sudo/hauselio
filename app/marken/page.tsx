import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { prisma } from "@/lib/prisma";
import Breadcrumb from "@/components/ui/Breadcrumb";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";
import { SITE_URL, SITE_NAME } from "@/lib/constants";
import { OG_IMAGE, metaDescription } from "@/lib/seo";
import { logger } from "@/lib/logger";

export const revalidate = 3600;

const PAGE_DESCRIPTION =
  "Alle Marken bei HAUSAURA im Überblick: Miele, Bosch, Siemens, Samsung, Dyson, Jura, Philips und viele mehr. Produkte, Kategorien und Preise direkt vergleichen.";

export const metadata: Metadata = {
  title: "Marken – Miele, Bosch, Siemens, Dyson & mehr",
  description: metaDescription(PAGE_DESCRIPTION),
  alternates: { canonical: `${SITE_URL}/marken` },
  openGraph: {
    title: `Marken bei ${SITE_NAME}`,
    description: PAGE_DESCRIPTION,
    url: `${SITE_URL}/marken`,
    siteName: SITE_NAME,
    locale: "de_DE",
    type: "website",
    images: [OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: `Marken bei ${SITE_NAME}`,
    description: PAGE_DESCRIPTION,
    images: [OG_IMAGE.url],
  },
};

async function getBrands() {
  try {
    const brands = await prisma.brand.findMany({
      where: { products: { some: {} } },
      select: {
        name: true,
        slug: true,
        _count: { select: { products: true } },
      },
      orderBy: { name: "asc" },
    });
    return brands
      .map((brand) => ({ name: brand.name, slug: brand.slug, count: brand._count.products }))
      .filter((brand) => brand.count >= 2);
  } catch (error) {
    // Never cache an empty index for an hour when the database hiccups.
    logger.error("marken-index", error);
    throw error;
  }
}

export default async function MarkenPage() {
  const brands = await getBrands();
  const totalProducts = brands.reduce((sum, brand) => sum + brand.count, 0);

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Startseite", url: SITE_URL },
          { name: "Marken", url: `${SITE_URL}/marken` },
        ]}
      />
      <main id="main-content" className="container-hausaura py-6 sm:py-8 lg:py-10">
        <Breadcrumb items={[{ label: "Marken" }]} />

        <header className="max-w-3xl">
          <h1 className="heading-1">Marken bei {SITE_NAME}</h1>
          <p className="body-large mt-3 text-[var(--color-text-secondary)]">
            {`${brands.length} Marken, ${totalProducts} Produkte: Von Miele und Bosch über Jura und De'Longhi bis Dyson und Philips. Wählen Sie eine Marke, um alle Modelle, Kategorien und Preise zu sehen.`}
          </p>
        </header>

        <ul className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3" role="list">
          {brands.map((brand) => (
            <li key={brand.slug}>
              <Link
                href={`/marken/${brand.slug}`}
                className="group flex items-center justify-between gap-3 rounded-xl border border-[var(--color-border-light)] bg-white px-4 py-4 transition-colors hover:border-[var(--color-border)] hover:bg-[var(--color-bg-secondary)]"
              >
                <span>
                  <span className="block font-semibold text-[var(--color-text-primary)]">
                    {brand.name}
                  </span>
                  <span className="block text-sm text-[var(--color-text-muted)]">
                    {brand.count} Produkte
                  </span>
                </span>
                <ArrowRight
                  className="h-4 w-4 shrink-0 text-[var(--color-text-muted)] transition-transform group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </Link>
            </li>
          ))}
        </ul>

        <section className="mt-12 border-t border-[var(--color-border-light)] pt-8">
          <h2 className="heading-2 mb-3">Marken gezielt vergleichen</h2>
          <p className="max-w-3xl text-[var(--color-text-secondary)]">
            Jede Markenseite zeigt alle verfügbaren Modelle mit Preis, Kategorie und Link zum
            Produkt. Wenn Sie zwischen zwei Marken schwanken, lohnt ein Blick in unsere Ratgeber:
            Dort erklären wir, worin sich Vollautomaten, Küchenmaschinen, Saugroboter und
            Haushaltsgeräte technisch unterscheiden.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href="/ratgeber"
              className="inline-flex min-h-[44px] items-center rounded-lg border border-[var(--color-border)] px-4 text-sm font-semibold hover:bg-[var(--color-bg-secondary)]"
            >
              Zum Ratgeber
            </Link>
            <Link
              href="/shop"
              className="inline-flex min-h-[44px] items-center rounded-lg bg-[var(--color-primary)] px-4 text-sm font-semibold text-white hover:bg-[var(--color-primary-hover)]"
            >
              Alle Produkte
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
