import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Fixing promo products without originalPrice...");

  // Bulk update: set originalPrice = price * 1.15 for promo products without originalPrice
  await prisma.$executeRawUnsafe(`
    UPDATE "Product"
    SET "originalPrice" = ROUND(("price"::numeric * 1.15)::numeric, 2)
    WHERE "isPromo" = true AND "originalPrice" IS NULL
  `);

  // Verify
  const remaining = await prisma.$queryRawUnsafe<{ count: bigint }[]>(
    `SELECT COUNT(*) as count FROM "Product"
     WHERE "isPromo" = true AND "originalPrice" IS NULL`
  );
  console.log(`Remaining promo products without originalPrice: ${remaining[0].count}`);
  
  // Show some examples
  const examples = await prisma.$queryRawUnsafe<{ slug: string; price: number; originalprice: number }[]>(
    `SELECT slug, price::numeric, "originalPrice"::numeric as originalprice
     FROM "Product"
     WHERE "isPromo" = true AND "originalPrice" IS NOT NULL
     LIMIT 5`
  );
  console.log("\nExamples:");
  for (const e of examples) {
    console.log(`  ${e.slug}: ${e.price}€ → ${e.originalprice}€`);
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
