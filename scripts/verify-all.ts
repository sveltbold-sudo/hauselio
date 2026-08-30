import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const products = await prisma.product.findMany({ select: { slug: true, description: true } });
  const generic = products.filter(p => 
    p.description?.includes('hochwertiges Haushaltsgerät') || 
    p.description?.includes('qualitativ hochwertiges Haushaltsgerät') ||
    (p.description?.length ?? 0) < 100
  );
  console.log('Total products:', products.length);
  console.log('With generic descriptions:', generic.length);
  if (generic.length > 0) {
    generic.forEach(p => console.log(' -', p.slug));
  }
}
main().catch(console.error).finally(() => prisma.$disconnect());
