import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Check all categories
  const cats = await prisma.category.findMany({ 
    select: { id: true, name: true, slug: true, parentId: true },
    orderBy: { sortOrder: "asc" }
  });
  console.log("All categories:");
  for (const c of cats) {
    console.log(`  ${c.slug} — ${c.name} (parent: ${c.parentId || "none"})`);
  }
  
  // Check if Thermomix is a subcategory
  const thermoCat = cats.find(c => c.slug === "thermomix" || c.name.toLowerCase().includes("thermomix"));
  console.log("\nThermomix category:", thermoCat);
  
  // Check products with subCategory = "Thermomix"
  const thermoProducts = await prisma.product.findMany({
    where: { subCategory: "Thermomix" },
    select: { slug: true, name: true, subCategory: true }
  });
  console.log("\nProducts with subCategory='Thermomix':", thermoProducts.length);
  
  // Check all distinct subCategories
  const subCats = await prisma.product.findMany({
    distinct: ["subCategory"],
    select: { subCategory: true },
    where: { subCategory: { not: null } }
  });
  console.log("\nDistinct subCategories:", subCats.map(s => s.subCategory));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
