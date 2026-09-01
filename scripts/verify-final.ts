import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const products = await prisma.product.findMany({
    select: {
      name: true,
      slug: true,
      brand: { select: { name: true } },
      price: true,
      originalPrice: true,
    },
    orderBy: { name: "asc" },
  });

  console.log(`Total: ${products.length} products\n`);

  // Check for any remaining inflated UVPs (UVP > 3x typical market price for category)
  let suspicious = 0;
  for (const p of products) {
    const brand = p.brand?.name || "";
    const uvp = p.originalPrice || 0;
    const price = p.price || 0;

    // Flag if UVP seems unreasonably high
    if (uvp > 3000 && !["Thermomix", "Gaggenau", "V-ZUG", "Liebherr", "Siemens RS5", "Miele Mastercool"].some(k => p.name.includes(k))) {
      console.log(`⚠️  ${brand} ${p.name}: UVP ${uvp}€ (may be inflated)`);
      suspicious++;
    }
  }

  if (suspicious === 0) {
    console.log("✅ No suspicious UVPs remaining");
  } else {
    console.log(`\n${suspicious} products flagged for review`);
  }
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
