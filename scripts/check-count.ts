import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
(async () => {
  const count = await prisma.product.count();
  console.log('Total products:', count);
  const cats = await prisma.category.findMany({ select: { name: true, slug: true, _count: { select: { products: true } } } });
  for (const c of cats) { console.log(`${c.name} (${c.slug}): ${c._count.products}`); }
  await prisma.$disconnect();
})();
