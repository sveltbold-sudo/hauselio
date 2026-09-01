import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Check what brand cmte97uje0009uqxgn2zq050z is
  const brand = await prisma.brand.findUnique({ 
    where: { id: "cmte97uje0009uqxgn2zq050z" },
    select: { id: true, name: true, slug: true }
  });
  console.log("TM7/TM6 brand:", brand);
  
  // Get all brands
  const allBrands = await prisma.brand.findMany({ select: { id: true, name: true, slug: true } });
  console.log("All brands:", JSON.stringify(allBrands, null, 2));
  
  // Get existing Thermomix product details
  const tm7 = await prisma.product.findUnique({ 
    where: { slug: "thermomix-tm7" },
    select: { slug: true, name: true, price: true, originalPrice: true, categoryId: true }
  });
  const tm6 = await prisma.product.findUnique({ 
    where: { slug: "thermomix-tm6" },
    select: { slug: true, name: true, price: true, originalPrice: true, categoryId: true }
  });
  console.log("TM7:", tm7);
  console.log("TM6:", tm6);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
