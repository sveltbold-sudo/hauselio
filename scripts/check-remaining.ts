const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const slugs = ['bosch-serie-4-kgn36vled', 'haier-monokuhlschrank-hb14g1aaag', 'miele-ta-2650-wp'];
  for (const slug of slugs) {
    const p = await prisma.product.findUnique({ where: { slug }, select: { name: true, originalPrice: true, price: true } });
    console.log(slug + ':', p ? 'UVP=' + p.originalPrice + '€ Prix=' + p.price + '€' : 'NOT FOUND');
  }
}
main().catch(e => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
