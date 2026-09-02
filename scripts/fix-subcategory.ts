import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Also fix the Vorwerk Thermomix TM5
  const result = await prisma.product.updateMany({
    where: { slug: "vorwerk-thermomix-tm5" },
    data: { subCategory: "Thermomix" },
  });
  console.log(`Updated vorwerk-thermomix-tm5: ${result.count} product(s)`);
  
  // Verify all Thermomix products
  const products = await prisma.product.findMany({
    where: { subCategory: "Thermomix" },
    select: { slug: true, name: true, brandId: true },
  });
  console.log(`\nAll products with subCategory="Thermomix": ${products.length}`);
  for (const p of products) {
    console.log(`  ${p.slug} — ${p.name}`);
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
