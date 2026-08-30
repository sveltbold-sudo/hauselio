import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const products = await prisma.product.findMany({
    where: { category: { slug: 'haushaltsgeraete' } },
    orderBy: { name: 'asc' },
    select: { slug: true, name: true, description: true, features: true, specs: { select: { id: true } } },
  });

  console.log(`\n📦 Produkte in "Haushaltsgeräte": ${products.length}\n`);

  let genericCount = 0;
  for (const p of products) {
    const hasGenericDesc = (p.description?.includes('hochwertiges Haushaltsgerät') ||
      p.description?.includes('qualitativ hochwertiges Haushaltsgerät') ||
      (p.description?.length ?? 0) < 100);
    if (hasGenericDesc) genericCount++;
    const specsCount = p.specs.length;
    console.log(`${hasGenericDesc ? '⚠️' : '✅'} ${p.slug} — ${hasGenericDesc ? 'generic' : 'ok'} | ${specsCount} specs`);
  }

  console.log(`\n📊 ${genericCount} von ${products.length} Produkten mit generischen Beschreibungen`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
