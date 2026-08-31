import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const DISCOUNT_FACTOR = 0.81;

async function main() {
  console.log(`=== APPLICATION -19% SUR TOUS LES PRODUITS ===\n`);

  const all = await prisma.product.findMany({
    select: { id: true, name: true, price: true, originalPrice: true },
    orderBy: { name: "asc" },
  });
  console.log(`Total: ${all.length}\n`);

  const BATCH = 50;
  let updated = 0;

  for (let i = 0; i < all.length; i += BATCH) {
    const batch = all.slice(i, i + BATCH);
    const ids = batch.map((p) => p.id);

    // For each product:
    // - If originalPrice is valid (exists and > price), keep it as the true original
    // - Otherwise, set originalPrice = current price
    // Then set price = originalPrice * 0.81

    const ops = batch.map((p) => {
      const trueOriginal = p.originalPrice && Number(p.originalPrice) > Number(p.price)
        ? Number(p.originalPrice)
        : Number(p.price);
      const newPrice = Math.round(trueOriginal * DISCOUNT_FACTOR * 100) / 100;

      return prisma.product.update({
        where: { id: p.id },
        data: {
          price: newPrice,
          originalPrice: trueOriginal,
          isPromo: true,
        },
      });
    });

    await prisma.$transaction(ops);
    updated += batch.length;
    process.stdout.write(`  ${updated}/${all.length}\r`);
  }

  console.log(`\n\n✅ ${updated} produits mis à jour\n`);

  // Verify
  const samples = await prisma.product.findMany({
    take: 10,
    orderBy: { name: "asc" },
    select: { name: true, price: true, originalPrice: true },
  });
  console.log("Vérification échantillon:");
  for (const s of samples) {
    const price = Number(s.price);
    const orig = Number(s.originalPrice!);
    const disc = Math.round(((orig - price) / orig) * 100);
    console.log(`  ${s.name}: ${price.toFixed(2)}€ (avant: ${orig.toFixed(2)}€, -${disc}%)`);
  }

  // Stats
  const stats = await prisma.product.aggregate({
    _min: { price: true },
    _max: { price: true },
    _avg: { price: true },
    _count: true,
  });
  console.log(`\nStatistiques:`);
  console.log(`  Min: ${Number(stats._min.price).toFixed(2)}€`);
  console.log(`  Max: ${Number(stats._max.price).toFixed(2)}€`);
  console.log(`  Moyen: ${Number(stats._avg.price).toFixed(2)}€`);
  console.log(`  Total: ${stats._count}`);

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
