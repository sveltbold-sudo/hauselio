import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const products = await prisma.product.findMany({
    where: { category: { slug: 'kueche' } },
    orderBy: { name: 'asc' },
    include: { specs: true },
  });

  console.log(`\n📦 Produkte in "Küche & Kochen": ${products.length}\n`);

  for (const p of products) {
    const hasGenericDesc = p.description?.includes('hochwertiges Haushaltsgerät') ||
      p.description?.includes('qualitativ hochwertiges Haushaltsgerät') ||
      (p.description?.length ?? 0) < 100;
    const hasSpecs = p.specs.length > 0;
    const hasFeatures = p.features.length > 0;
    const status = hasGenericDesc ? 'generic-desc' : 'ok';
    const specsStatus = hasSpecs ? `${p.specs.length} specs` : 'no-specs';
    const featuresStatus = hasFeatures ? `${p.features.length} feats` : 'no-feats';
    console.log(`${status === 'generic-desc' ? '⚠️' : '✅'} ${p.slug} — ${status} | ${specsStatus} | ${featuresStatus}`);
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
