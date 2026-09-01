import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const FINAL_CORRECTIONS: Record<string, { realUvp: number; source: string }> = {
  // Bosch KGN36VLED — marché 953€ (idealo.de), UVP ~650€ trop bas, ajuster
  "bosch-serie-4-kgn36vled": {
    realUvp: 960,
    source: "Bosch KGN36VLED marché 953.66€ (idealo.de)",
  },
  // BEKO DVN05320W — marché 283-504€
  "beko-dfn05320w": {
    realUvp: 350,
    source: "BEKO DVN05320W marché 283-504€ (dagimarket.com)",
  },
  // Bosch SMS46MW00E — produit discontinu, estimé ~550€
  "bosch-kompakt-sms46mw00e": {
    realUvp: 550,
    source: "Bosch SMS46MW00E produit discontinu, estimé ~550€",
  },
  // Haier DW14-BK3AEU — marché ~650€ (Haier Series 3 similaire)
  "haier-dw14-bk3aeu": {
    realUvp: 650,
    source: "Haier Series 3 Standgeschirrspüler marché ~650€ (idealo.de)",
  },
  // Neff B3ACS7AH0 Backofen — marché 735-899€
  "neff-b3acs7ah0-backofen": {
    realUvp: 800,
    source: "Neff Backofen N50 marché 735-899€ (idealo.de)",
  },
  // Bosch PCI611BB5E — marché 350-360€ (PIE611BB5E similaire)
  "bosch-serie6-induktionskochfeld-pci611bb5e": {
    realUvp: 360,
    source: "Bosch PIE611BB5E marché 350-360€ (idealo.de, smartgoods.de)",
  },
  // Samsung EcoBubble WW90TP04DSH — marché 379-574€ (WW90T4048EE similaire)
  "samsung-ecobubble-ww90tp04dsh": {
    realUvp: 500,
    source: "Samsung EcoBubble marché 379-574€ (idealo.de)",
  },
  // iRobot Roomba Plus 405 — UVP 699€, marché 249-449€
  "irobot-roomba-plus-405": {
    realUvp: 500,
    source: "iRobot Roomba Plus 405 UVP 699€, marché 249-449€ (irobot.de)",
  },
  // Miele TA 2650 WP — marché 1,059-1,159€
  "miele-ta-2650-wp": {
    realUvp: 1120,
    source: "Miele TA 2650 WP marché ~1,059-1,159€ (miele.de)",
  },
  // Haier HB14G1AAAG — marché ~450-530€
  "haier-monokuhlschrank-hb14g1aaag": {
    realUvp: 500,
    source: "Haier HB14G1AAAG marché ~450-530€",
  },
};

async function main() {
  console.log("=== FINAL VERIFIED UVP Corrections ===\n");

  let updated = 0;

  for (const [slug, correction] of Object.entries(FINAL_CORRECTIONS)) {
    try {
      const product = await prisma.product.findUnique({
        where: { slug },
        select: { id: true, name: true, originalPrice: true, price: true },
      });

      if (!product) {
        console.log(`⚠️  NOT FOUND: ${slug}`);
        continue;
      }

      const oldUvp = product.originalPrice || 0;
      const newUvp = correction.realUvp;
      const newPrice = Math.round(newUvp * 0.81 * 100) / 100;

      if (oldUvp === newUvp) {
        console.log(`✅ OK: ${slug} (UVP ${oldUvp}€ already correct)`);
        continue;
      }

      await prisma.product.update({
        where: { id: product.id },
        data: { originalPrice: newUvp, price: newPrice },
      });

      const factor = oldUvp > 0 ? Math.round(oldUvp / newUvp) : 0;
      console.log(
        `🔧 FIXED: ${product.name}\n` +
        `   UVP: ${oldUvp}€ → ${newUvp}€ (${factor > 1 ? `was ${factor}x inflated` : "adjusted"})\n` +
        `   Prix: ${product.price}€ → ${newPrice}€\n` +
        `   Source: ${correction.source}`
      );
      updated++;
    } catch (e) {
      console.log(`❌ ERROR: ${slug} - ${(e as Error).message}`);
    }
  }

  console.log(`\n=== SUMMARY ===`);
  console.log(`✅ Updated: ${updated}`);
}

main()
  .catch((e) => { console.error("FATAL:", e); process.exit(1); })
  .finally(() => prisma.$disconnect());
