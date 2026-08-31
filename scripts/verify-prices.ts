import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("=== VÉRIFICATION COMPLÈTE DES PRIX ===\n");

  const products = await prisma.product.findMany({
    select: {
      id: true,
      name: true,
      slug: true,
      price: true,
      originalPrice: true,
      isPromo: true,
    },
    orderBy: { name: "asc" },
  });

  console.log(`Total produits: ${products.length}\n`);

  let errors: string[] = [];
  let warnings: string[] = [];
  let valid = 0;
  let noOriginal = 0;
  let noDiscount = 0;
  let wrongDiscount = 0;
  let priceZero = 0;
  let priceNegative = 0;

  for (const p of products) {
    const price = Number(p.price);
    const orig = p.originalPrice ? Number(p.originalPrice) : null;

    // Check 1: Price must be > 0
    if (price <= 0) {
      errors.push(`${p.slug}: prix ${price}€ — INVALIDE (≤ 0)`);
      priceZero++;
      continue;
    }

    // Check 2: originalPrice must exist
    if (!orig) {
      warnings.push(`${p.slug}: pas d'originalPrice`);
      noOriginal++;
      continue;
    }

    // Check 3: originalPrice must be > price
    if (orig <= price) {
      errors.push(`${p.slug}: originalPrice (${orig}€) ≤ price (${price}€) — PAS DE PROMO`);
      noDiscount++;
      continue;
    }

    // Check 4: Discount must be ~19%
    const discount = Math.round(((orig - price) / orig) * 100);
    if (Math.abs(discount - 19) > 1) {
      errors.push(`${p.slug}: discount = ${discount}% (attendu ~19%) — price=${price}€, orig=${orig}€`);
      wrongDiscount++;
      continue;
    }

    // Check 5: price should be originalPrice * 0.81 (±0.02 rounding)
    const expectedPrice = Math.round(orig * 0.81 * 100) / 100;
    if (Math.abs(price - expectedPrice) > 0.02) {
      errors.push(`${p.slug}: prix ${price}€ ≠ attendu ${expectedPrice}€ (originalPrice=${orig}€ × 0.81)`);
      continue;
    }

    valid++;
  }

  // Summary
  console.log("=== RÉSULTATS ===\n");
  console.log(`✅ Valides: ${valid}/${products.length}`);
  console.log(`❌ Erreurs: ${errors.length}`);
  console.log(`⚠️  Avertissements: ${warnings.length}`);

  if (errors.length > 0) {
    console.log("\n❌ ERREURS:");
    errors.forEach((e) => console.log(`  ${e}`));
  }

  if (warnings.length > 0) {
    console.log("\n⚠️  AVERTISSEMENTS:");
    warnings.forEach((w) => console.log(`  ${w}`));
  }

  // Price range check
  const prices = products.map((p) => Number(p.price)).filter((p) => p > 0);
  console.log("\n=== STATISTIQUES ===");
  console.log(`Prix min: ${Math.min(...prices).toFixed(2)}€`);
  console.log(`Prix max: ${Math.max(...prices).toFixed(2)}€`);
  console.log(`Prix moyen: ${(prices.reduce((a, b) => a + b, 0) / prices.length).toFixed(2)}€`);

  // Discount distribution
  const discounts: Record<number, number> = {};
  for (const p of products) {
    if (p.originalPrice && Number(p.originalPrice) > Number(p.price)) {
      const d = Math.round(((Number(p.originalPrice) - Number(p.price)) / Number(p.originalPrice)) * 100);
      discounts[d] = (discounts[d] || 0) + 1;
    }
  }
  console.log("\nDistribution des discounts:");
  for (const [d, count] of Object.entries(discounts).sort((a, b) => Number(a[0]) - Number(b[0]))) {
    console.log(`  -${d}%: ${count} produits`);
  }

  // Sample of products with biggest discounts
  const biggestDiscounts = products
    .filter((p) => p.originalPrice && Number(p.originalPrice) > Number(p.price))
    .map((p) => ({
      name: p.name,
      price: Number(p.price),
      original: Number(p.originalPrice!),
      discount: Math.round(((Number(p.originalPrice!) - Number(p.price)) / Number(p.originalPrice!)) * 100),
    }))
    .sort((a, b) => b.discount - a.discount)
    .slice(0, 5);

  console.log("\nTop 5 plus gros discounts:");
  biggestDiscounts.forEach((d) => {
    console.log(`  ${d.name}: ${d.price.toFixed(2)}€ (avant: ${d.original.toFixed(2)}€, -${d.discount}%)`);
  });

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
