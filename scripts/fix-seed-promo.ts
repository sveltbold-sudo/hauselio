import { readFileSync, writeFileSync } from "fs";
import { join } from "path";

const seedPath = join(process.cwd(), "prisma", "seed.ts");
let content = readFileSync(seedPath, "utf-8");

// Find promo products without originalPrice and add one (15% higher)
// Pattern: price: XXX, sku: "..." where isPromo is true but no originalPrice before sku
const lines = content.split("\n");
let inPromoProduct = false;
let lastPriceLine = -1;
let lastPrice = 0;
let fixed = 0;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];

  // Track if we're in a promo product
  if (line.includes("isPromo: true")) {
    inPromoProduct = true;
  }

  // Track price line
  if (inPromoProduct && line.match(/price: \d+/)) {
    const priceMatch = line.match(/price: (\d+)/);
    if (priceMatch) {
      lastPrice = parseInt(priceMatch[1], 10);
      lastPriceLine = i;
    }
  }

  // If we hit sku and no originalPrice was set, add it
  if (inPromoProduct && lastPriceLine >= 0 && line.includes('sku:')) {
    // Check if originalPrice already exists in previous lines
    let hasOriginalPrice = false;
    for (let j = lastPriceLine; j <= i; j++) {
      if (lines[j].includes("originalPrice:")) {
        hasOriginalPrice = true;
        break;
      }
    }

    if (!hasOriginalPrice && lastPrice > 0) {
      const originalPrice = Math.round(lastPrice * 1.15);
      // Insert originalPrice after price line
      const priceLine = lines[lastPriceLine];
      const newPriceLine = priceLine.replace(
        /price: (\d+)/,
        `price: $1, originalPrice: ${originalPrice}`
      );
      lines[lastPriceLine] = newPriceLine;
      fixed++;
    }

    inPromoProduct = false;
    lastPriceLine = -1;
    lastPrice = 0;
  }
}

writeFileSync(seedPath, lines.join("\n"), "utf-8");
console.log(`Fixed ${fixed} promo products in seed.ts`);
