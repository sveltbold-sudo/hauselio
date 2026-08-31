import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const withoutImages = await prisma.$queryRawUnsafe<{ slug: string }[]>(
    `SELECT p.slug FROM "Product" p
     LEFT JOIN "ProductImage" pi ON p.id = pi."productId"
     WHERE pi.id IS NULL
     ORDER BY p.slug`
  );
  
  console.log(`Products without images (${withoutImages.length}):`);
  for (const p of withoutImages) {
    console.log(`  - ${p.slug}`);
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
