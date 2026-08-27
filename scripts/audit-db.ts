import { execSync } from 'child_process';

const url = process.env.DATABASE_URL;

async function query(sql: string) {
  const result = execSync(
    `npx prisma db execute --url "${url}" --file "E:\\\\web_app\\\\Dev\\\\HAUSELIO\\\\hauselio\\\\scripts\\\\audit.sql"`,
    { encoding: 'utf-8' }
  );
  return result;
}

// Since prisma db execute doesn't show results, let's use a direct approach
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    const products = await prisma.product.findMany({
      select: { id: true }
    });
    console.log(`Products: ${products.length}`);

    const images = await prisma.productImage.findMany({
      select: { id: true }
    });
    console.log(`Product Images: ${images.length}`);

    const categories = await prisma.category.findMany({
      include: { _count: { select: { products: true } } }
    });
    console.log(`Categories: ${categories.length}`);
    for (const c of categories) {
      console.log(`  ${c.name}: ${c._count.products} products`);
    }

    const brands = await prisma.brand.findMany({
      include: { _count: { select: { products: true } } }
    });
    console.log(`\nBrands: ${brands.length}`);
    for (const b of brands) {
      console.log(`  ${b.name}: ${b._count.products} products`);
    }

    const reviews = await prisma.review.findMany({ select: { id: true } });
    console.log(`\nReviews: ${reviews.length}`);

    const testimonials = await prisma.testimonial.findMany({ select: { id: true } });
    console.log(`Testimonials: ${testimonials.length}`);

    const productsWithoutImages = await prisma.product.findMany({
      where: { images: { none: {} } },
      select: { slug: true, name: true }
    });
    console.log(`\nProducts without images: ${productsWithoutImages.length}`);
    for (const p of productsWithoutImages) {
      console.log(`  ${p.slug} - ${p.name}`);
    }

    const adminUsers = await prisma.adminUser.findMany({
      select: { id: true, email: true }
    });
    console.log(`\nAdmin users: ${adminUsers.length}`);
    for (const u of adminUsers) {
      console.log(`  ${u.email}`);
    }
  } catch (error: any) {
    console.error('Error:', error.message);
  }
}

main()
  .finally(() => prisma.$disconnect());
