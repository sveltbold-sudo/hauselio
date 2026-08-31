import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  // 1. What is siemens-eq brand?
  const brand = await prisma.brand.findUnique({ where: { slug: "siemens-eq" } });
  console.log("Marque orpheline:", brand);

  // 2. What subCategory values exist?
  const subs: any[] = await prisma.$queryRawUnsafe(
    `SELECT DISTINCT "subCategory" as sub FROM "Product" WHERE "subCategory" IS NOT NULL AND "subCategory" != '' ORDER BY sub`
  );
  console.log(`\nSous-catégories existantes (${subs.length}):`);
  for (const s of subs) console.log(`  - "${s.sub}"`);

  // 3. Category slugs
  const cats: any[] = await prisma.$queryRawUnsafe(
    `SELECT slug, name FROM "Category" ORDER BY slug`
  );
  console.log(`\nCatégories:`);
  for (const c of cats) console.log(`  - slug="${c.slug}" name="${c.name}"`);

  // 4. Sample products with their category slug and subCategory
  const samples: any[] = await prisma.$queryRawUnsafe(
    `SELECT p.slug, c.slug as catslug, c.name as catname, p."subCategory" as sub
     FROM "Product" p JOIN "Category" c ON p."categoryId" = c.id
     ORDER BY c.slug, p."subCategory"
     LIMIT 30`
  );
  console.log(`\nExemples produit -> catSlug, subCategory:`);
  for (const s of samples) console.log(`  ${s.slug}: cat="${s.catslug}" sub="${s.sub}"`);

  // 5. Products with tags
  const withTags: any[] = await prisma.$queryRawUnsafe(
    `SELECT slug, tags FROM "Product" WHERE tags != '{}'::text[] LIMIT 10`
  );
  console.log(`\nProduits AVEC tags (${withTags.length}):`);
  for (const t of withTags) console.log(`  ${t.slug}: ${JSON.stringify(t.tags)}`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
