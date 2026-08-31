import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  // ═══════════════════════════════════════════
  // 1. REMOVE ORPHAN BRANDS
  // ═══════════════════════════════════════════
  console.log("=== 1. Suppression marques orphelines ===");
  await prisma.$executeRawUnsafe(`
    DELETE FROM "Brand" b WHERE NOT EXISTS (SELECT 1 FROM "Product" p WHERE p."brandId" = b.id)
  `);
  const remainingOrphans: any[] = await prisma.$queryRawUnsafe(
    `SELECT COUNT(*) as cnt FROM "Brand" b WHERE NOT EXISTS (SELECT 1 FROM "Product" p WHERE p."brandId" = b.id)`
  );
  console.log(`  Marques orphelines restantes: ${remainingOrphans[0].cnt}`);

  // ═══════════════════════════════════════════
  // 2. BULK TAGS
  // ═══════════════════════════════════════════
  console.log("\n=== 2. Tags bulk ===");

  // Base tag for all empty-tag products
  await prisma.$executeRawUnsafe(`
    UPDATE "Product" SET tags = ARRAY['sortiment'] WHERE tags = '{}'::text[]
  `);

  // isFeatured -> bestseller
  await prisma.$executeRawUnsafe(`
    UPDATE "Product" SET tags = array_append(tags, 'bestseller') WHERE "isFeatured" = true AND NOT ('bestseller' = ANY(tags))
  `);

  // isNew -> neu
  await prisma.$executeRawUnsafe(`
    UPDATE "Product" SET tags = array_append(tags, 'neu') WHERE "isNew" = true AND NOT ('neu' = ANY(tags))
  `);

  // isPromo -> sale
  await prisma.$executeRawUnsafe(`
    UPDATE "Product" SET tags = array_append(tags, 'sale') WHERE "isPromo" = true AND NOT ('sale' = ANY(tags))
  `);

  // Top rated
  await prisma.$executeRawUnsafe(`
    UPDATE "Product" SET tags = array_append(tags, 'top-bewertet') WHERE rating >= 4.5 AND "reviewCount" >= 10 AND NOT ('top-bewertet' = ANY(tags))
  `);

  // Popular
  await prisma.$executeRawUnsafe(`
    UPDATE "Product" SET tags = array_append(tags, 'beliebt') WHERE "reviewCount" >= 50 AND NOT ('beliebt' = ANY(tags))
  `);

  // Subcategory-based tags
  const subTagMap: [string, string][] = [
    ["Kaffeevollautomaten", "premium"],
    ["Espressomaschinen", "premium"],
    ["Saugroboter", "smart-home-kompatibel"],
    ["Smart-Beleuchtung", "smart-home-kompatibel"],
    ["Smart-Heizung", "smart-home-kompatibel"],
    ["Smart-Hubs", "smart-home-kompatibel"],
    ["Smart-Überwachung", "smart-home-kompatibel"],
    ["Waschmaschinen", "waschen"],
    ["Trockner", "waschen"],
    ["Waschtrockner", "waschen"],
    ["Luftreiniger", "klima"],
    ["Luftbefeuchter", "klima"],
    ["Luftkühler", "klima"],
    ["Backöfen", "kochen"],
    ["Kochfelder", "kochen"],
    ["Herd", "kochen"],
    ["Airfryer", "kochen"],
    ["Heißluft", "kochen"],
  ];

  for (const [sub, tag] of subTagMap) {
    await prisma.$executeRawUnsafe(
      `UPDATE "Product" SET tags = array_append(tags, $1) WHERE "subCategory" LIKE $2 AND NOT ($1 = ANY(tags))`,
      tag,
      `%${sub}%`
    );
  }

  const withTags: any[] = await prisma.$queryRawUnsafe(
    `SELECT COUNT(*) as cnt FROM "Product" WHERE tags != '{}'::text[]`
  );
  console.log(`  Produits avec tags: ${withTags[0].cnt}/279`);

  // ═══════════════════════════════════════════
  // 3. BULK WEIGHTS
  // ═══════════════════════════════════════════
  console.log("\n=== 3. Poids bulk ===");

  const weightCases: [string, number][] = [
    ["Kaffeevollautomaten", 9.5],
    ["Espressomaschinen", 8.0],
    ["Kapselmaschinen", 4.0],
    ["Filterkaffee", 3.5],
    ["Waschmaschinen", 75.0],
    ["Trockner", 55.0],
    ["Waschtrockner", 85.0],
    ["Geschirrspüler", 45.0],
    ["Kühlschränke", 70.0],
    ["Gefrierschränke", 65.0],
    ["Kochfelder", 15.0],
    ["Backöfen", 35.0],
    ["Herd", 50.0],
    ["Saugroboter", 3.5],
    ["Staubsauger", 5.0],
    ["Handmixer", 1.5],
    ["Küchenmaschinen", 8.0],
    ["Airfryer", 5.0],
    ["Heißluft", 5.0],
    ["Grill", 4.0],
    ["Kontaktgrill", 4.0],
    ["Luftreiniger", 6.0],
    ["Luftbefeuchter", 4.0],
    ["Luftkühler", 8.0],
    ["Dampfreiniger", 5.0],
    ["Smart-Beleuchtung", 0.5],
    ["Smart-Heizung", 0.8],
    ["Smart-Hubs", 0.3],
    ["Smart-Überwachung", 0.4],
    ["Multi-Cooker", 5.0],
    ["Thermomix", 8.0],
  ];

  for (const [sub, weight] of weightCases) {
    await prisma.$executeRawUnsafe(
      `UPDATE "Product" SET weight = $1 WHERE "subCategory" LIKE $2 AND (weight IS NULL OR weight = 0)`,
      weight,
      `%${sub}%`
    );
  }

  // Default for remaining
  await prisma.$executeRawUnsafe(`
    UPDATE "Product" SET weight = 5.0 WHERE (weight IS NULL OR weight = 0)
  `);

  const noWeight: any[] = await prisma.$queryRawUnsafe(
    `SELECT COUNT(*) as cnt FROM "Product" WHERE weight IS NULL OR weight = 0`
  );
  console.log(`  Produits sans poids: ${noWeight[0].cnt}`);

  console.log("\n=== Terminé ===");
}

main().catch(console.error).finally(() => prisma.$disconnect());
