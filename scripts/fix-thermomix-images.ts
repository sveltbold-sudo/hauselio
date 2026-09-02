import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Update Mixtopf TM6
  const mixtopf = await prisma.product.findUnique({ where: { slug: "thermomix-mixtopf-tm6" } });
  if (mixtopf) {
    await prisma.productImage.deleteMany({ where: { productId: mixtopf.id } });
    await prisma.productImage.create({
      data: { url: "/images/products/thermomix-mixtopf-tm6/1.png", alt: "Thermomix Mixtopf TM6", position: 0, productId: mixtopf.id },
    });
    console.log("✅ mixtopf-tm6 images updated");
  }

  // Final verification
  const products = await prisma.product.findMany({
    where: { brand: { slug: "thermomix" } },
    include: { images: { orderBy: { position: "asc" } } },
  });
  console.log("\n=== FINAL STATUS ===");
  let withImages = 0;
  let withoutImages = 0;
  for (const p of products) {
    const imgs = p.images.length > 0 ? `${p.images.length} image(s)` : "⚠️ NO IMAGES";
    if (p.images.length > 0) withImages++;
    else withoutImages++;
    console.log(`${p.slug}: ${imgs}`);
  }
  console.log(`\n${withImages} with images, ${withoutImages} without images`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
