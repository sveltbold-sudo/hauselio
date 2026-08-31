import { PrismaClient } from "@prisma/client";
import { readdirSync } from "fs";
import { join } from "path";

const prisma = new PrismaClient();
const IMAGES_DIR = join(process.cwd(), "public", "images", "products");

function cuid(): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let id = "";
  for (let i = 0; i < 25; i++) {
    id += chars[Math.floor(Math.random() * chars.length)];
  }
  return id;
}

async function main() {
  console.log("Step 1: Clearing all existing product images...");
  await prisma.$executeRawUnsafe('DELETE FROM "ProductImage"');
  console.log("Cleared.");

  console.log("Step 2: Scanning image directories...");
  const products = await prisma.$queryRawUnsafe<{ id: string; slug: string }[]>(
    'SELECT id, slug FROM "Product"'
  );

  const imageData: { id: string; url: string; alt: string; position: number; productId: string }[] = [];

  for (const product of products) {
    const productDir = join(IMAGES_DIR, product.slug);
    try {
      const files = readdirSync(productDir);
      // Accept PNG, JPG, and medium-sized WebP as originals
      const imageFiles = files
        .filter((f) => {
          if (f.endsWith(".png") || f.endsWith(".jpg")) return true;
          if (f.endsWith("-medium.webp")) return true;
          return false;
        })
        .sort((a, b) => {
          const numA = parseInt(a.replace(/\.(png|jpg)$/, "").replace(/-medium\.webp$/, ""), 10);
          const numB = parseInt(b.replace(/\.(png|jpg)$/, "").replace(/-medium\.webp$/, ""), 10);
          return numA - numB;
        });

      // Deduplicate: prefer PNG > JPG > medium.webp for same number
      const seen = new Set<number>();
      const deduped: string[] = [];
      for (const f of imageFiles) {
        const num = parseInt(f.replace(/\.(png|jpg)$/, "").replace(/-medium\.webp$/, ""), 10);
        if (!seen.has(num)) {
          seen.add(num);
          deduped.push(f);
        }
      }

      for (let i = 0; i < deduped.length; i++) {
        imageData.push({
          id: cuid(),
          url: `/images/products/${product.slug}/${deduped[i]}`,
          alt: product.slug,
          position: i,
          productId: product.id,
        });
      }
    } catch {
      // skip
    }
  }

  console.log(`Found ${imageData.length} images for ${products.length} products.`);

  // Insert in batches of 500
  const BATCH = 500;
  for (let i = 0; i < imageData.length; i += BATCH) {
    const batch = imageData.slice(i, i + BATCH);
    const values = batch
      .map((d) => `('${d.id}', '${d.url}', '${d.alt}', ${d.position}, '${d.productId}')`)
      .join(",");
    await prisma.$executeRawUnsafe(
      `INSERT INTO "ProductImage" (id, url, alt, position, "productId") VALUES ${values}`
    );
    console.log(`Inserted batch ${Math.floor(i / BATCH) + 1}/${Math.ceil(imageData.length / BATCH)}`);
  }

  // Verify
  const count = await prisma.$queryRawUnsafe<{ count: bigint }[]>(
    'SELECT COUNT(*) as count FROM "ProductImage"'
  );
  console.log(`Verification: ${count[0].count} images in database.`);
  console.log("Done!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
