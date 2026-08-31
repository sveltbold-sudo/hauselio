import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Find products with no brand
  const noBrand = await prisma.$queryRawUnsafe<{ slug: string; brandslug: string }[]>(
    `SELECT p.slug, p."brandId" FROM "Product" p WHERE p."brandId" IS NULL`
  );
  
  console.log(`Products with no brand: ${noBrand.length}`);
  
  // Find products with invalid brand references
  const invalidBrands = await prisma.$queryRawUnsafe<{ slug: string; brandslug: string }[]>(
    `SELECT p.slug, b.slug as brandslug FROM "Product" p
     LEFT JOIN "Brand" b ON p."brandId" = b.id
     WHERE b.id IS NULL AND p."brandId" IS NOT NULL`
  );
  
  console.log(`Products with invalid brand reference: ${invalidBrands.length}`);
  for (const p of invalidBrands) {
    console.log(`  - ${p.slug} (brand: ${p.brandslug})`);
  }
  
  // List all brands
  const brands = await prisma.brand.findMany({ select: { name: true, slug: true } });
  console.log(`\nTotal brands: ${brands.length}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
