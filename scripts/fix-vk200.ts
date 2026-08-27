import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const cats = await prisma.category.findMany({ where: { slug: { in: ['kueche-food', 'aspirateurs'] } }, select: { id: true, name: true, slug: true } });
  console.log('Categories:', JSON.stringify(cats, null, 2));
  
  const vk200 = await prisma.product.findFirst({ where: { slug: 'vorwerk-kobold-vk200' }, select: { id: true, name: true, slug: true, categoryId: true } });
  console.log('VK200:', JSON.stringify(vk200, null, 2));
  
  if (vk200 && cats.length === 2) {
    const aspCat = cats.find(c => c.slug === 'aspirateurs');
    const result = await prisma.product.update({ where: { id: vk200.id }, data: { categoryId: aspCat.id } });
    console.log('Updated:', JSON.stringify(result, null, 2));
  }
  await prisma.$disconnect();
}
main().catch(e => { console.error(e); process.exit(1); });
