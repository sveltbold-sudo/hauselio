import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  try {
    await prisma.$executeRawUnsafe(
      'ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "stockQuantity" INTEGER'
    );
  } catch {
    // Column may already exist
  }

  // Use temp table approach for safety
  await prisma.$executeRawUnsafe(`
    UPDATE "Product"
    SET "stockQuantity" = (floor(random() * 5) + 1)::int
    WHERE "isPromo" = true
  `);

  await prisma.$executeRawUnsafe(`
    UPDATE "Product"
    SET "stockQuantity" = (floor(random() * 10) + 3)::int
    WHERE "isFeatured" = true AND "isPromo" = false
  `);

  await prisma.$executeRawUnsafe(`
    UPDATE "Product"
    SET "stockQuantity" = (floor(random() * 20) + 5)::int
    WHERE "isFeatured" = false AND "isPromo" = false
  `);

  const count = await prisma.$queryRawUnsafe<{ count: bigint }[]>(
    'SELECT COUNT(*) as count FROM "Product" WHERE "stockQuantity" IS NOT NULL'
  );
  console.log("Updated " + count[0].count + " products with stock quantities.");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
