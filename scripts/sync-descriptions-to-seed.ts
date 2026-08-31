import { PrismaClient } from "@prisma/client";
import { readFileSync, writeFileSync } from "fs";
import { join } from "path";

const prisma = new PrismaClient();

async function main() {
  console.log("Step 1: Reading enriched descriptions from database...");

  const products = await prisma.$queryRawUnsafe<{ slug: string; description: string; shortdesc: string | null }[]>(
    `SELECT slug, description, "shortDesc" as shortdesc FROM "Product" ORDER BY slug`
  );

  console.log(`Found ${products.length} products in database.`);

  console.log("Step 2: Reading seed.ts...");
  const seedPath = join(process.cwd(), "prisma", "seed.ts");
  let content = readFileSync(seedPath, "utf-8");

  let updated = 0;
  let skipped = 0;

  for (const product of products) {
    // Skip if description is still generic
    if (product.description.includes("hochwertiges Haushaltsgerät")) {
      skipped++;
      continue;
    }

    // Find and replace the description in seed.ts
    // Pattern: description: "...hochwertiges Haushaltsgerät."
    const slugPattern = product.slug.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    // Match the product block by slug
    const slugRegex = new RegExp(
      `(slug: "${slugPattern}"[\\s\\S]*?description: ")[^"]*(")`,
      "g"
    );

    const newDesc = product.description.replace(/"/g, '\\"');
    const newContent = content.replace(slugRegex, `$1${newDesc}$2`);

    if (newContent !== content) {
      content = newContent;
      updated++;
    }

    // Also update shortDesc if it exists and is generic
    if (product.shortdesc && !product.shortdesc.includes("hochwertiges")) {
      const shortDescRegex = new RegExp(
        `(slug: "${slugPattern}"[\\s\\S]*?shortDesc: ")[^"]*(")`,
        "g"
      );
      const newShortDesc = product.shortdesc.replace(/"/g, '\\"');
      content = content.replace(shortDescRegex, `$1${newShortDesc}$2`);
    }
  }

  console.log(`Updated ${updated} descriptions. Skipped ${skipped} (still generic).`);

  console.log("Step 3: Writing updated seed.ts...");
  writeFileSync(seedPath, content, "utf-8");

  // Verify
  const finalContent = readFileSync(seedPath, "utf-8");
  const remainingGeneric = (finalContent.match(/hochwertiges Haushaltsgerät/g) || []).length;
  console.log(`Remaining generic descriptions: ${remainingGeneric}`);
  console.log("Done!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
