import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const p = await prisma.product.findUnique({ where: { slug: 'miele-mastercool-mcs1301w' }, select: { name: true, description: true, brand: true } });
  console.log(JSON.stringify(p, null, 2));
  await prisma.$disconnect();
}
main().catch(console.error);
