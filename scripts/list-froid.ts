import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const cat = await prisma.category.findUnique({ where: { slug: 'froid' } });
  if (!cat) { console.log('No froid category'); return; }
  const products = await prisma.product.findMany({ where: { categoryId: cat.id }, select: { slug: true, name: true, brand: true }, orderBy: { slug: 'asc' } });
  console.log(`Total: ${products.length}`);
  const fs = await import('fs');
  const path = await import('path');
  for (const p of products) {
    const dir = path.join('public/images/products', p.slug);
    const exists = fs.existsSync(dir);
    let count = 0;
    if (exists) {
      count = fs.readdirSync(dir).filter((f: string) => f.endsWith('.webp')).length;
    }
    console.log(`${exists && count > 0 ? '✅' : '❌'} ${p.slug} | ${p.brand} — ${p.name} | ${count} images`);
  }
  await prisma.$disconnect();
}
main().catch(console.error);
