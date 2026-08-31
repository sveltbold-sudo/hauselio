import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  // Check descriptions
  const total = await prisma.product.count();
  
  const generic = await prisma.$queryRawUnsafe<{ count: bigint }[]>(
    `SELECT COUNT(*) as count FROM "Product" WHERE description LIKE '%hochwertiges Haushaltsgerät%'`
  );
  
  const short = await prisma.$queryRawUnsafe<{ count: bigint }[]>(
    `SELECT COUNT(*) as count FROM "Product" WHERE LENGTH(description) < 100`
  );
  
  // Check specs
  const withSpecs = await prisma.$queryRawUnsafe<{ count: bigint }[]>(
    `SELECT COUNT(DISTINCT p.id) as count FROM "Product" p INNER JOIN "ProductSpec" ps ON p.id = ps."productId"`
  );
  
  console.log(`Total products: ${total}`);
  console.log(`Generic descriptions: ${generic[0].count}`);
  console.log(`Short descriptions (<100 chars): ${short[0].count}`);
  console.log(`Products with specs: ${withSpecs[0].count}`);
  console.log(`Products without specs: ${total - Number(withSpecs[0].count)}`);
  
  // Show a few examples of generic descriptions
  const examples = await prisma.$queryRawUnsafe<{ slug: string; desc: string }[]>(
    `SELECT slug, LEFT(description, 80) as desc FROM "Product" WHERE description LIKE '%hochwertiges Haushaltsgerät%' LIMIT 5`
  );
  console.log("\nExamples of generic descriptions:");
  for (const e of examples) {
    console.log(`  ${e.slug}: ${e.desc}...`);
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
