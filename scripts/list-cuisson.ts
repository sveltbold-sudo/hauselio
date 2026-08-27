import { PrismaClient } from '@prisma/client'
async function main() {
  const p = new PrismaClient()
  const r = await p.product.findMany({ where: { category: { slug: 'cuisson' } }, select: { name: true, slug: true, images: true } })
  r.forEach(x => console.log(x.slug + '|' + (x.images && x.images.length > 0 ? 'YES(' + x.images.length + ')' : 'NO') + '|' + x.name))
  await p.$disconnect()
}
main()
