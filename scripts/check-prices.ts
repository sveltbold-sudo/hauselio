import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const products = await prisma.product.findMany({
    where: { originalPrice: { not: null } },
    select: {
      name: true,
      brand: { select: { name: true } },
      price: true,
      originalPrice: true,
      slug: true,
    },
    orderBy: { price: "desc" },
    take: 50,
  });

  for (const pr of products) {
    const discount = pr.originalPrice ? Math.round((1 - pr.price / pr.originalPrice) * 100) : 0;
    const brandName = pr.brand?.name || "N/A";
    console.log(`${brandName} | ${pr.name} | UVP: ${pr.originalPrice} | Preis: ${pr.price} | -${discount}%`);
  }

  console.log("\nTotal with UVP:", await prisma.product.count({ where: { originalPrice: { not: null } } }));
  console.log("Total products:", await prisma.product.count());
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
