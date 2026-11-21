import { prisma } from "@/lib/prisma";
import { SITE_URL, SITE_NAME } from "@/lib/constants";

export const revalidate = 3600;

const euro = (value: number) =>
  `${value.toFixed(2).replace(".", ",").replace(/\B(?=(\d{3})+(?!\d))/g, ".")} €`;

/**
 * llms-full.txt — complete, machine-readable catalog for AI assistants.
 * One line per product keeps the file easy to retrieve and quote.
 */
export async function GET() {
  let categories: {
    name: string;
    slug: string;
    products: { name: string; slug: string; price: unknown; description: string | null; brandName: string | null }[];
  }[] = [];
  let articles: { title: string; slug: string; excerpt: string | null }[] = [];

  try {
    const [cats, arts] = await Promise.all([
      prisma.category.findMany({
        orderBy: { name: "asc" },
        select: {
          name: true,
          slug: true,
          products: {
            orderBy: [{ isPromo: "desc" }, { name: "asc" }],
            select: {
              name: true,
              slug: true,
              price: true,
              description: true,
              brand: { select: { name: true } },
            },
          },
        },
      }),
      prisma.ratgeberArticle.findMany({
        where: { isPublished: true },
        orderBy: { publishedAt: "desc" },
        select: { title: true, slug: true, excerpt: true },
      }),
    ]);

    categories = cats.map((c) => ({
      name: c.name,
      slug: c.slug,
      products: c.products.map((p) => ({
        name: p.name,
        slug: p.slug,
        price: p.price,
        description: p.description,
        brandName: p.brand?.name ?? null,
      })),
    }));
    articles = arts;
  } catch {
    // Serve a valid (if empty) file if the database is unreachable.
  }

  const totalProducts = categories.reduce((sum, c) => sum + c.products.length, 0);

  const lines: string[] = [
    `# ${SITE_NAME} — Vollständiger Katalog`,
    "",
    `> Alle ${totalProducts} Produkte aus dem ${SITE_NAME}-Shop mit Preis (EUR, inkl. MwSt.), Marke und Produktlink. Stand: ${new Date().toISOString().slice(0, 10)}.`,
    "",
    `Website: ${SITE_URL}`,
    "Versand: Deutschland, Österreich, Schweiz. Zahlung: Vorkasse per Überweisung.",
    "Widerruf: 14 Tage gesetzlich, zusätzlich 30 Tage freiwilliges Rückgaberecht auf unbenutzte Ware.",
    "",
  ];

  for (const cat of categories) {
    if (cat.products.length === 0) continue;
    lines.push(`## ${cat.name}`, "", `Kategorieseite: ${SITE_URL}/kategorie/${cat.slug}`, "");
    for (const p of cat.products) {
      const details = [
        p.brandName,
        euro(Number(p.price)),
        p.description ? p.description.replace(/\s+/g, " ").trim().slice(0, 180) : null,
      ]
        .filter(Boolean)
        .join(" · ");
      lines.push(`- [${p.name}](${SITE_URL}/produkt/${p.slug}) — ${details}`);
    }
    lines.push("");
  }

  if (articles.length > 0) {
    lines.push("## Ratgeber", "");
    for (const a of articles) {
      lines.push(
        `- [${a.title}](${SITE_URL}/ratgeber/${a.slug})${a.excerpt ? ` — ${a.excerpt.replace(/\s+/g, " ").trim()}` : ""}`,
      );
    }
    lines.push("");
  }

  lines.push(
    "## Rechtliches und Service",
    "",
    `- Impressum: ${SITE_URL}/impressum`,
    `- AGB: ${SITE_URL}/agb`,
    `- Widerrufsrecht: ${SITE_URL}/widerruf`,
    `- Datenschutz: ${SITE_URL}/datenschutz`,
    `- Versand: ${SITE_URL}/versand`,
    `- Hilfe & FAQ: ${SITE_URL}/hilfe`,
    `- Kontakt: ${SITE_URL}/kontakt`,
    "",
  );

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
