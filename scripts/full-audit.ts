import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("=== HAUSAURA FULL AUDIT ===\n");

  // 1. Products
  const totalProducts = await prisma.product.count();
  const productsWithImages = await prisma.product.findMany({
    include: { images: true },
  });
  const withImages = productsWithImages.filter(p => p.images.length > 0).length;
  const withoutImages = productsWithImages.filter(p => p.images.length === 0);

  console.log(`📦 PRODUCTS: ${totalProducts} total`);
  console.log(`   With images: ${withImages}`);
  console.log(`   Without images: ${withoutImages.length}`);
  if (withoutImages.length > 0) {
    console.log(`   Missing images:`);
    withoutImages.forEach(p => console.log(`     - ${p.slug} (${p.name})`));
  }

  // 2. Categories
  const categories = await prisma.category.count();
  console.log(`\n📂 CATEGORIES: ${categories}`);

  // 3. Brands
  const brands = await prisma.brand.count();
  console.log(`\n🏷️  BRANDS: ${brands}`);

  // 4. Reviews
  const reviews = await prisma.review.count();
  const avgRating = await prisma.review.aggregate({ _avg: { rating: true } });
  console.log(`\n⭐ REVIEWS: ${reviews} (avg: ${avgRating._avg.rating?.toFixed(1) || "N/A"})`);

  // 5. Orders
  const orders = await prisma.order.count();
  console.log(`\n📋 ORDERS: ${orders}`);

  // 6. Customers
  const customers = await prisma.customer.count();
  console.log(`\n👥 CUSTOMERS: ${customers}`);

  // 7. Coupons
  const coupons = await prisma.coupon.count();
  console.log(`\n🎟️  COUPONS: ${coupons}`);

  // 8. Testimonials
  const testimonials = await prisma.testimonial.count();
  console.log(`\n💬 TESTIMONIALS: ${testimonials}`);

  // 9. Thermomix products
  const thermomix = await prisma.product.findMany({
    where: { brand: { slug: "thermomix" } },
    include: { images: true },
  });
  console.log(`\n🍳 THERMOMIX PRODUCTS: ${thermomix.length}`);
  for (const p of thermomix) {
    console.log(`   ${p.slug}: ${p.images.length} images, €${p.price} (UVP: €${p.originalPrice})`);
  }

  // 10. Products with reviews
  const productsWithReviews = await prisma.product.findMany({
    where: { reviewCount: { gt: 0 } },
    select: { slug: true, name: true, reviewCount: true, rating: true },
    orderBy: { reviewCount: "desc" },
    take: 10,
  });
  console.log(`\n🏆 TOP REVIEWED PRODUCTS:`);
  for (const p of productsWithReviews) {
    console.log(`   ${p.name}: ${p.reviewCount} reviews (${p.rating}★)`);
  }

  // 11. Price range
  const priceStats = await prisma.product.aggregate({
    _min: { price: true },
    _max: { price: true },
    _avg: { price: true },
  });
  console.log(`\n💰 PRICE RANGE:`);
  console.log(`   Min: €${priceStats._min.price}`);
  console.log(`   Max: €${priceStats._max.price}`);
  console.log(`   Avg: €${Number(priceStats._avg.price).toFixed(2)}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
