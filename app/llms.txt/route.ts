import { prisma } from "@/lib/prisma";
import {
  SITE_URL,
  SITE_NAME,
  FREE_SHIPPING_THRESHOLD,
  SHIPPING_COST,
} from "@/lib/constants";

export const revalidate = 3600;

/**
 * llms.txt — short, curated map of the shop for AI assistants and answer
 * engines. See https://llmstxt.org/. The full catalog lives in llms-full.txt.
 */
export async function GET() {
  let categories: { name: string; slug: string; count: number }[] = [];
  let brands: { name: string; slug: string; count: number }[] = [];
  let productCount = 0;

  try {
    const [cats, brs, count] = await Promise.all([
      prisma.category.findMany({
        select: { name: true, slug: true, _count: { select: { products: true } } },
        orderBy: { name: "asc" },
      }),
      prisma.brand.findMany({
        where: { products: { some: {} } },
        select: { name: true, slug: true, _count: { select: { products: true } } },
        orderBy: { name: "asc" },
      }),
      prisma.product.count(),
    ]);
    categories = cats.map((c) => ({ name: c.name, slug: c.slug, count: c._count.products }));
    brands = brs
      .map((b) => ({ name: b.name, slug: b.slug, count: b._count.products }))
      .filter((b) => b.count >= 2);
    productCount = count;
  } catch {
    // Keep the file available even if the database is temporarily unreachable.
  }

  const lines: string[] = [
    `# ${SITE_NAME}`,
    "",
    `> ${SITE_NAME} ist ein deutscher Online-Shop für Haushaltsgeräte mit Sitz in Berlin. Sortiment: Kaffeevollautomaten, Küchengeräte, Haushaltsgeräte (Waschen, Kühlen, Geschirrspülen), Smart Home, Reinigung und Klima. Versand nach Deutschland, Österreich und in die Schweiz.`,
    "",
    "## Fakten",
    "",
    `- Website: ${SITE_URL}`,
    "- Sprache: Deutsch (EUR, inkl. MwSt.)",
    "- Sitz: Berlin, Deutschland; gegründet 2024",
    `- Sortiment: ${productCount} Produkte in ${categories.length} Kategorien`,
    `- Versand: DE/AT/CH; in Deutschland versandkostenfrei ab ${FREE_SHIPPING_THRESHOLD} €, sonst ${SHIPPING_COST.toFixed(2).replace(".", ",")} €`,
    "- Zahlung: Vorkasse per Überweisung (Kreditkarte derzeit nicht verfügbar)",
    "- Widerruf: 14 Tage gesetzliches Widerrufsrecht; zusätzlich 30 Tage freiwilliges Rückgaberecht auf unbenutzte Ware",
    "- Kontakt: info@hausaura.de, +49 1525 9140453",
    "",
    "## Kategorien",
    "",
    ...categories.map((c) => `- [${c.name}](${SITE_URL}/kategorie/${c.slug}): ${c.count} Produkte`),
    "",
    "## Marken",
    "",
    ...brands.map((b) => `- [${b.name}](${SITE_URL}/marken/${b.slug}): ${b.count} Produkte`),
    "",
    "## Wichtige Seiten",
    "",
    `- [Shop](${SITE_URL}/shop)`,
    `- [Angebote](${SITE_URL}/angebote)`,
    `- [Ratgeber](${SITE_URL}/ratgeber)`,
    `- [Hilfe & FAQ](${SITE_URL}/hilfe)`,
    `- [Versand](${SITE_URL}/versand)`,
    `- [Garantie](${SITE_URL}/garantie)`,
    `- [Über uns](${SITE_URL}/ueber-uns)`,
    `- [Kontakt](${SITE_URL}/kontakt)`,
    "",
    "## Rechtliches",
    "",
    `- [Impressum](${SITE_URL}/impressum)`,
    `- [AGB](${SITE_URL}/agb)`,
    `- [Widerrufsrecht](${SITE_URL}/widerruf)`,
    `- [Datenschutz](${SITE_URL}/datenschutz)`,
    "",
    "## Vollständiger Katalog",
    "",
    `- [llms-full.txt](${SITE_URL}/llms-full.txt): alle Produkte mit Preis, Marke und Link`,
    "",
  ];

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
