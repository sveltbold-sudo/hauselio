import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("=== VÉRIFICATION DES PRIX ===\n");

  // 1. Fetch all products with prices
  const products = await prisma.product.findMany({
    select: {
      id: true,
      name: true,
      slug: true,
      price: true,
      originalPrice: true,
    },
    orderBy: { name: "asc" },
  });

  console.log(`Total produits: ${products.length}\n`);

  // 2. Analyze current state
  let withOriginal = 0;
  let withoutOriginal = 0;
  let alreadyDiscounted = 0;
  let issues: string[] = [];

  for (const p of products) {
    const price = Number(p.price);
    const orig = p.originalPrice ? Number(p.originalPrice) : null;

    if (orig !== null) {
      withOriginal++;
      if (orig > price) {
        alreadyDiscounted++;
      } else if (orig === price) {
        // originalPrice == price = no visible discount
      } else {
        issues.push(`${p.slug}: originalPrice (${orig}) < price (${price}) — INVERSÉ!`);
      }
    } else {
      withoutOriginal++;
    }

    if (price <= 0) {
      issues.push(`${p.slug}: prix ${price}€ — INVALIDE!`);
    }
  }

  console.log(`Produits avec originalPrice: ${withOriginal}`);
  console.log(`Produits sans originalPrice: ${withoutOriginal}`);
  console.log(`Déjà en promotion: ${alreadyDiscounted}`);
  console.log(`Problèmes trouvés: ${issues.length}`);

  if (issues.length > 0) {
    console.log("\n⚠️  PROBLÈMES:");
    issues.forEach((i) => console.log(`  - ${i}`));
  }

  // 3. Price stats
  const prices = products.map((p) => Number(p.price));
  console.log(`\nStatistiques prix:`);
  console.log(`  Min: ${Math.min(...prices).toFixed(2)}€`);
  console.log(`  Max: ${Math.max(...prices).toFixed(2)}€`);
  console.log(`  Moyen: ${(prices.reduce((a, b) => a + b, 0) / prices.length).toFixed(2)}€`);
  console.log(`  Médian: ${prices.sort((a, b) => a - b)[Math.floor(prices.length / 2)].toFixed(2)}€`);

  // 4. Sample of prices
  console.log(`\nExemple de prix (premiers 10):`);
  products.slice(0, 10).forEach((p) => {
    const price = Number(p.price);
    const orig = p.originalPrice ? Number(p.originalPrice) : null;
    const discount = orig && orig > price ? Math.round(((orig - price) / orig) * 100) : 0;
    console.log(`  ${p.name}: ${price.toFixed(2)}€ ${orig ? `(avant: ${orig.toFixed(2)}€, -${discount}%)` : `(pas de promo)`}`);
  });

  // 5. Promo products check
  const promos = await prisma.product.findMany({
    where: { isPromo: true },
    select: { slug: true, price: true, originalPrice: true },
  });
  console.log(`\nProduits en promo (isPromo=true): ${promos.length}`);
  let promoWithoutOrig = 0;
  for (const p of promos) {
    if (!p.originalPrice || Number(p.originalPrice) <= Number(p.price)) {
      promoWithoutOrig++;
    }
  }
  console.log(`Promos sans originalPrice valide: ${promoWithoutOrig}`);

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
