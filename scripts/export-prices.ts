import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const products = await prisma.product.findMany({
    select: {
      id: true,
      name: true,
      slug: true,
      brand: { select: { name: true } },
      price: true,
      originalPrice: true,
      category: { select: { name: true, slug: true } },
    },
    orderBy: { name: "asc" },
  });

  // Group by category
  const byCategory: Record<string, typeof products> = {};
  for (const p of products) {
    const cat = p.category?.name || "Unknown";
    if (!byCategory[cat]) byCategory[cat] = [];
    byCategory[cat].push(p);
  }

  for (const [cat, items] of Object.entries(byCategory)) {
    console.log(`\n=== ${cat} (${items.length} products) ===`);
    for (const p of items) {
      const brand = p.brand?.name || "N/A";
      const uvp = p.originalPrice || 0;
      const discount = uvp > 0 ? Math.round((1 - p.price / uvp) * 100) : 0;
      console.log(`${brand} | ${p.name} | UVP: ${uvp} | Preis: ${p.price} | -${discount}% | ${p.slug}`);
    }
  }

  console.log("\n\nTotal:", products.length);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
