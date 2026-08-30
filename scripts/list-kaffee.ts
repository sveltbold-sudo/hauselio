import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const kaffeeCategory = await prisma.category.findFirst({
    where: { slug: 'kaffee' }
  });

  if (!kaffeeCategory) {
    console.log('Category not found');
    return;
  }

  const products = await prisma.product.findMany({
    where: { categoryId: kaffeeCategory.id },
    include: {
      brand: { select: { name: true } },
      specs: { select: { key: true, value: true } },
      _count: { select: { images: true, reviews: true } }
    },
    orderBy: { name: 'asc' }
  });

  console.log(`\n=== KAFFEE PRODUCTS (${products.length}) ===\n`);

  for (const p of products) {
    console.log(`--- ${p.name} (${p.brand?.name}) ---`);
    console.log(`  Slug: ${p.slug}`);
    console.log(`  Price: ${p.price} EUR`);
    console.log(`  Description: ${p.description?.substring(0, 80)}...`);
    console.log(`  ShortDesc: ${p.shortDesc || 'EMPTY'}`);
    console.log(`  Features: [${(p.features || []).join(', ')}]`);
    console.log(`  Specs: ${p.specs.length > 0 ? p.specs.map(s => `${s.key}=${s.value}`).join(', ') : 'EMPTY'}`);
    console.log(`  Images: ${p._count.images}, Reviews: ${p._count.reviews}`);
    console.log('');
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
