import { PrismaClient } from "@prisma/client";
import { readFileSync, writeFileSync } from "fs";
import { join } from "path";

const prisma = new PrismaClient();

async function main() {
  console.log("Syncing specs from database to seed.ts...");

  const products = await prisma.$queryRawUnsafe<{ slug: string; specsjson: string }[]>(
    `SELECT p.slug, COALESCE(
      (SELECT json_agg(json_build_object('name', ps.key, 'value', ps.value))
       FROM "ProductSpec" ps WHERE ps."productId" = p.id),
      '[]'::json
    )::text as specsjson
    FROM "Product" p ORDER BY p.slug`
  );

  console.log(`Read ${products.length} products with specs.`);

  const seedPath = join(process.cwd(), "prisma", "seed.ts");
  let content = readFileSync(seedPath, "utf-8");

  let updated = 0;

  for (const product of products) {
    if (product.specsjson === "[]") continue;

    const specs = JSON.parse(product.specsjson) as { name: string; value: string }[];
    const specsArray = specs.map((s) => `      { name: "${s.name.replace(/"/g, '\\"')}", value: "${s.value.replace(/"/g, '\\"')}" }`).join(",\n");
    const specsStr = `specs: [\n${specsArray},\n    ]`;

    // Find the product block and replace specs array
    const slugEscaped = product.slug.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    
    // Match: specs: [ ... ]  — this is tricky because specs can span multiple lines
    // Use a more robust approach: find the line with slug, then find specs after it
    
    // First, find the product line index
    const slugLineRegex = new RegExp(`slug: "${slugEscaped}"`);
    const slugMatch = content.match(slugLineRegex);
    if (!slugMatch || slugMatch.index === undefined) continue;
    
    const slugIdx = slugMatch.index;
    
    // Find the next product block or end of file
    const nextProductIdx = content.indexOf("    },", slugIdx + 1);
    const endIdx = nextProductIdx !== -1 ? nextProductIdx : content.length;
    
    // Extract the product block
    const block = content.substring(slugIdx, endIdx);
    
    // Check if it has non-empty specs already
    const specsMatch = block.match(/specs: \[[\s\S]*?\]/);
    if (!specsMatch || specsMatch.index === undefined) continue;
    
    // If specs array is not empty, skip
    const specsContent = specsMatch[0].replace("specs: [", "").replace("]", "").trim();
    if (specsContent.length > 0) continue;
    
    // Replace empty specs with real specs
    const blockStart = slugIdx + specsMatch.index;
    const blockEnd = blockStart + specsMatch[0].length;
    const globalStart = slugIdx;
    
    content = content.substring(0, globalStart + specsMatch.index) + specsStr + content.substring(globalStart + specsMatch.index + specsMatch[0].length);
    
    updated++;
  }

  writeFileSync(seedPath, content, "utf-8");

  // Verify
  const final = readFileSync(seedPath, "utf-8");
  const emptySpecs = (final.match(/specs: \[\]/g) || []).length;
  console.log(`Updated ${updated} product specs. Remaining empty specs: ${emptySpecs}`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
