import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

async function main() {
  const csvPath = path.join(__dirname, 'product-images.csv');
  const csvContent = fs.readFileSync(csvPath, 'utf-8');
  const lines = csvContent.split('\n').filter(line => line.trim());

  let updated = 0;
  let skipped = 0;

  for (const line of lines) {
    const [slug, imagesStr] = line.split('|');
    if (!slug || !imagesStr) continue;

    const images = imagesStr.split(',').filter(img => img.trim());

    try {
      const product = await prisma.product.findFirst({
        where: { slug: slug.trim() }
      });

      if (!product) {
        console.log(`⚠️  Product not found: ${slug}`);
        skipped++;
        continue;
      }

      // Check if product already has images
      const existingImages = await prisma.productImage.findMany({
        where: { productId: product.id }
      });

      if (existingImages.length > 0) {
        console.log(`⏭️  ${slug} already has ${existingImages.length} images`);
        skipped++;
        continue;
      }

      // Add images
      for (let i = 0; i < images.length; i++) {
        const imageUrl = images[i].trim();
        await prisma.productImage.create({
          data: {
            productId: product.id,
            url: imageUrl,
            alt: product.name,
            position: i
          }
        });
      }

      console.log(`✅ ${slug}: ${images.length} images added`);
      updated++;
    } catch (error) {
      console.error(`❌ Error updating ${slug}:`, error);
    }
  }

  console.log(`\n📊 Summary:`);
  console.log(`   Updated: ${updated}`);
  console.log(`   Skipped: ${skipped}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());