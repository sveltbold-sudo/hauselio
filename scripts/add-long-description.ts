import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("=== Migration: Add longDescription columns ===\n");

  // 1) Vérifier les tables existantes
  const tables = await prisma.$queryRaw<{ tablename: string }[]>`
    SELECT tablename FROM pg_tables WHERE schemaname = 'public'
  `;
  console.log("Tables trouvées:", tables.map((t) => t.tablename).join(", "));

  // 2) Chercher la table Category (casse variable)
  const categoryTable = tables.find(
    (t) => t.tablename.toLowerCase() === "category"
  );
  const productTable = tables.find(
    (t) => t.tablename.toLowerCase() === "product"
  );

  if (!categoryTable) {
    console.error("❌ Table Category introuvable !");
    return;
  }
  if (!productTable) {
    console.error("❌ Table Product introuvable !");
    return;
  }

  console.log(`\n✅ Table Category trouvée: "${categoryTable.tablename}"`);
  console.log(`✅ Table Product trouvée: "${productTable.tablename}"`);

  // 3) Vérifier les colonnes existantes
  const catColumns = await prisma.$queryRaw<{ column_name: string }[]>`
    SELECT column_name FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = ${categoryTable.tablename}
  `;
  const prodColumns = await prisma.$queryRaw<{ column_name: string }[]>`
    SELECT column_name FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = ${productTable.tablename}
  `;

  const catHasLong = catColumns.some((c) => c.column_name === "longDescription");
  const prodHasLong = prodColumns.some((c) => c.column_name === "longDescription");

  // 4) Ajouter les colonnes manquantes
  if (!catHasLong) {
    await prisma.$executeRawUnsafe(
      `ALTER TABLE "${categoryTable.tablename}" ADD COLUMN IF NOT EXISTS "longDescription" TEXT`
    );
    console.log(`✅ Colonne longDescription ajoutée à ${categoryTable.tablename}`);
  } else {
    console.log(`ℹ️  Colonne longDescription existe déjà dans ${categoryTable.tablename}`);
  }

  if (!prodHasLong) {
    await prisma.$executeRawUnsafe(
      `ALTER TABLE "${productTable.tablename}" ADD COLUMN IF NOT EXISTS "longDescription" TEXT`
    );
    console.log(`✅ Colonne longDescription ajoutée à ${productTable.tablename}`);
  } else {
    console.log(`ℹ️  Colonne longDescription existe déjà dans ${productTable.tablename}`);
  }

  console.log("\n=== Migration terminée avec succès ===");
}

main()
  .catch((e) => {
    console.error("❌ Erreur:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
