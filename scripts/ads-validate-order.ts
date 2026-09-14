/**
 * Dry-run import serveur Google Ads (validateOnly: true — ne compte AUCUNE conversion).
 * Usage: npx tsx scripts/ads-validate-order.ts HL-202609-XXXXXXXX
 * Requiert: DB joignable + GOOGLE_ADS_* dans .env
 */
import { readFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { prisma } from "@/lib/prisma";
import { uploadOrderConversionById, isAdsUploadConfigured } from "@/lib/google-ads.server";

// Charge .env quand on tourne hors Next.js (tsx)
for (const key of ["GOOGLE_ADS_CLIENT_ID", "GOOGLE_ADS_CLIENT_SECRET", "GOOGLE_ADS_REFRESH_TOKEN", "GOOGLE_ADS_DEVELOPER_TOKEN", "GOOGLE_ADS_CUSTOMER_ID", "GOOGLE_ADS_MANAGER_ID", "GOOGLE_ADS_OFFLINE_CONVERSION_ACTION_ID", "DATABASE_URL"]) {
  if (!process.env[key]) {
    try {
      const envPath = join(dirname(fileURLToPath(import.meta.url)), "..", ".env");
      if (existsSync(envPath)) {
        for (const line of readFileSync(envPath, "utf8").split("\n")) {
          const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*"?([^"\n]*)"?\s*$/);
          if (m && m[1] === key) {
            process.env[key] = m[2];
            break;
          }
        }
      }
    } catch { /* ignore */ }
  }
}

async function main() {
  const orderNumber = process.argv[2];
  if (!orderNumber) {
    console.error("Usage: npx tsx scripts/ads-validate-order.ts <ORDER_NUMBER>");
    process.exit(1);
  }
  if (!isAdsUploadConfigured()) {
    console.error("GOOGLE_ADS_* non configures dans .env");
    process.exit(1);
  }
  const order = await prisma.order.findUnique({
    where: { orderNumber },
    select: { id: true, status: true, total: true },
  });
  if (!order) {
    console.error(`Commande ${orderNumber} introuvable`);
    process.exit(1);
  }
  console.log(`Dry-run ${orderNumber} | statut=${order.status} | total=${order.total}€`);
  const outcome = await uploadOrderConversionById(order.id, { validateOnly: true });
  console.log("Resultat:", JSON.stringify(outcome, null, 2));
  await prisma.$disconnect();
  process.exit(outcome.ok || outcome.skipped ? 0 : 1);
}

main().catch(async (e) => {
  console.error("Erreur:", e instanceof Error ? e.message : e);
  await prisma.$disconnect();
  process.exit(1);
});
