import { syncProductsToAlgolia } from "../lib/algolia-sync";

async function main() {
  console.log("🔄 Syncing products to Algolia...");

  const result = await syncProductsToAlgolia();

  console.log(`\n✅ Done!`);
  console.log(`   Indexed: ${result.indexed} products`);
  if (result.errors > 0) {
    console.log(`   Errors:  ${result.errors}`);
  }

  await import("../lib/prisma").then((m) => m.prisma.$disconnect());
}

main().catch((error) => {
  console.error("❌ Sync failed:", error);
  process.exit(1);
});
