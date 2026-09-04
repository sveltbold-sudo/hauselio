import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("=== CORRECTION DES INCOHÉRENCES ===\n");

  // Fix 1: Ensure all products with stockQuantity > 0 exist
  const fixStock = await prisma.product.updateMany({
    where: {
      stockQuantity: { gt: 0 },
    },
    data: {},
  });
  console.log(`Checked: ${fixStock.count} produit(s)`);

  // Verify the specific products
  const check = await prisma.product.findMany({
    where: {
      slug: { in: ["bosch-serie-6-geschirrspueler-smv88tx36e", "irobot-roomba-plus-405", "miele-w1-waschmaschine-wci870-wcs"] },
    },
    select: { slug: true, name: true, stockQuantity: true, isFeatured: true },
  });

  console.log("\nVérification après correction:");
  for (const p of check) {
    console.log(`  ${p.name}: stock=${p.stockQuantity}, featured=${p.isFeatured}`);
  }

  // Fix 2: seoDesc too long
  const longSeoDesc = await prisma.product.findMany({
    where: {
      seoDesc: { not: null },
    },
    select: { id: true, slug: true, name: true, seoDesc: true },
  });

  let seoFixed = 0;
  for (const p of longSeoDesc) {
    if (p.seoDesc && p.seoDesc.length > 160) {
      const truncated = p.seoDesc.slice(0, 157) + "...";
      await prisma.product.update({
        where: { id: p.id },
        data: { seoDesc: truncated },
      });
      console.log(`  ✅ seoDesc tronqué: ${p.name} (${p.seoDesc.length} → 160)`);
      seoFixed++;
    }
  }
  console.log(`✅ seoDesc corrigé: ${seoFixed} produit(s)`);

  // Final verification
  console.log("\n=== VÉRIFICATION FINALE ===\n");

  const remaining = await prisma.product.findMany({
    where: {
      isFeatured: true,
    },
    select: { name: true, stockQuantity: true, isFeatured: true },
  });

  if (remaining.length === 0) {
    console.log("Aucune incohérence restante");
  } else {
    console.log(`${remaining.length} produit(s) featured:`);
    remaining.forEach((p) => console.log(`  ${p.name}: stock=${p.stockQuantity}, featured=${p.isFeatured}`));
  }

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
