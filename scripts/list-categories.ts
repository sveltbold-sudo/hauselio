import { PrismaClient } from '@prisma/client'
async function main() {
  const p = new PrismaClient()
  const cats = await p.category.findMany({ select: { name: true, slug: true } })
  cats.forEach(x => console.log(x.slug + '|' + x.name))
  await p.$disconnect()
}
main()
