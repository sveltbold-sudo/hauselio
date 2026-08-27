import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

(async () => {
  const products = await prisma.product.findMany({
    select: { slug: true, name: true, category: { select: { name: true } } },
    orderBy: { name: 'asc' }
  });
  const noImages: { slug: string; name: string; category: string }[] = [];
  for (const p of products) {
    const dir = path.join('public/images/products', p.slug);
    const imgs = fs.existsSync(dir) ? fs.readdirSync(dir).filter(f => f.endsWith('.webp')).length : 0;
    if (imgs === 0) {
      noImages.push({ slug: p.slug, name: p.name, category: p.category.name });
    }
  }
  console.log(`Total produits sans images: ${noImages.length}`);
  console.log('---');
  for (const p of noImages) {
    console.log(`${p.category} | ${p.slug} | ${p.name}`);
  }
  await prisma.$disconnect();
})();
