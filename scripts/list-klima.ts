import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

(async () => {
  const cat = await prisma.category.findUnique({ where: { slug: 'klima-luft' } });
  if (!cat) { console.log('Category not found'); return; }
  const products = await prisma.product.findMany({
    where: { categoryId: cat.id },
    select: { slug: true, name: true },
    orderBy: { name: 'asc' }
  });
  let ok = 0, no = 0;
  for (const p of products) {
    const dir = path.join('public/images/products', p.slug);
    const imgs = fs.existsSync(dir) ? fs.readdirSync(dir).filter(f => f.endsWith('.webp')).length : 0;
    const status = imgs > 0 ? '✅' : '❌';
    if (imgs > 0) ok++; else no++;
    console.log(`${status} ${p.slug} | ${p.name} | ${imgs} images`);
  }
  console.log(`Total: ${ok + no} | ${ok} OK | ${no} sans images`);
  await prisma.$disconnect();
})();
