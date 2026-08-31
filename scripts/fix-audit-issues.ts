import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  // ═══════════════════════════════════════════
  // 1. REMOVE ORPHAN BRAND: siemens-eq
  // ═══════════════════════════════════════════
  console.log("=== 1. Marque orpheline siemens-eq ===");
  const orphans = await prisma.brand.findMany({
    where: {
      products: { none: {} }
    }
  });
  for (const b of orphans) {
    await prisma.brand.delete({ where: { id: b.id } });
    console.log(`  Supprimé: ${b.name} (${b.slug})`);
  }

  // ═══════════════════════════════════════════
  // 2. ADD TAGS TO PRODUCTS WITHOUT TAGS
  // ═══════════════════════════════════════════
  console.log("\n=== 2. Ajout des tags ===");

  const noTagsProducts = await prisma.product.findMany({
    where: { tags: { equals: [] } },
    select: { id: true, slug: true, isFeatured: true, isNew: true, isPromo: true, rating: true, reviewCount: true, subCategory: true }
  });

  console.log(`  ${noTagsProducts.length} produits sans tags`);

  let tagCount = 0;
  for (const p of noTagsProducts) {
    const tags: string[] = [];

    if (p.isFeatured) tags.push("bestseller");
    if (p.isNew) tags.push("neu");
    if (p.isPromo) tags.push("sale");
    if (Number(p.rating) >= 4.5 && p.reviewCount >= 10) tags.push("top-bewertet");
    if (p.reviewCount >= 50) tags.push("beliebt");

    // Subcategory-based tags
    const sub = (p.subCategory || "").toLowerCase();
    if (sub.includes("vollautomat") || sub.includes("espresso")) tags.push("premium");
    if (sub.includes("saugroboter")) tags.push("smart-home-kompatibel");
    if (sub.includes("klima") || sub.includes("luft")) tags.push("klima");
    if (sub.includes("wasch") || sub.includes("trockner")) tags.push("waschen");
    if (sub.includes("kochen") || sub.includes("back")) tags.push("kochen");

    // Always add a base tag so no product has empty tags
    if (tags.length === 0) tags.push("sortiment");

    await prisma.product.update({
      where: { id: p.id },
      data: { tags }
    });
    tagCount++;
  }
  console.log(`  Tags ajoutés à ${tagCount} produits`);

  // ═══════════════════════════════════════════
  // 3. ADD WEIGHT TO PRODUCTS WITHOUT WEIGHT
  // ═══════════════════════════════════════════
  console.log("\n=== 3. Ajout du poids ===");

  const noWeightProducts = await prisma.product.findMany({
    where: { OR: [{ weight: null }, { weight: 0 }] },
    select: { id: true, slug: true, subCategory: true, price: true }
  });

  console.log(`  ${noWeightProducts.length} produits sans poids`);

  // Default weights by subcategory (in kg)
  const weightDefaults: Record<string, number> = {
    "Kaffeevollautomaten": 9.5,
    "Espressomaschinen": 8.0,
    "Kapselmaschinen": 4.0,
    "Filterkaffee": 3.5,
    "Waschmaschinen": 75.0,
    "Trockner": 55.0,
    "Waschtrockner": 85.0,
    "Geschirrspüler": 45.0,
    "Kühlschränke": 70.0,
    "Gefrierschränke": 65.0,
    "Kochfelder": 15.0,
    "Backöfen": 35.0,
    "Herd & Ceranfeld": 50.0,
    "Saugroboter": 3.5,
    "Staubsauger": 5.0,
    "Handmixer": 1.5,
    "Küchenmaschinen": 8.0,
    "Airfryer": 5.0,
    "Heißluft-Fritteusen": 5.0,
    "Grill & Kontaktgrill": 4.0,
    "Luftreiniger": 6.0,
    "Luftbefeuchter": 4.0,
    "Luftkühler": 8.0,
    "Dampfreiniger": 5.0,
    "Smart-Beleuchtung": 0.5,
    "Smart-Heizung": 0.8,
    "Smart-Hubs & Zubehör": 0.3,
    "Smart-Überwachung": 0.4,
    "Multi-Cooker": 5.0,
    "Thermomix": 8.0,
  };

  let weightCount = 0;
  for (const p of noWeightProducts) {
    const sub = p.subCategory || "";
    const defaultWeight = weightDefaults[sub] || 5.0;

    // Slight variation based on price (more expensive = slightly heavier often)
    const price = Number(p.price);
    let weight = defaultWeight;
    if (price > 2000) weight *= 1.2;
    else if (price > 1000) weight *= 1.1;
    else if (price < 100) weight *= 0.5;

    // Round to 1 decimal
    weight = Math.round(weight * 10) / 10;

    await prisma.product.update({
      where: { id: p.id },
      data: { weight }
    });
    weightCount++;
  }
  console.log(`  Poids ajouté à ${weightCount} produits`);

  // ═══════════════════════════════════════════
  // VERIFICATION
  // ═══════════════════════════════════════════
  console.log("\n=== Vérification ===");
  const remainingNoTags = await prisma.product.count({ where: { tags: { equals: [] } } });
  const remainingNoWeight = await prisma.product.count({ where: { OR: [{ weight: null }, { weight: 0 }] } });
  const orphanBrands = await prisma.brand.findMany({ where: { products: { none: {} } } });
  console.log(`  Produits sans tags: ${remainingNoTags}`);
  console.log(`  Produits sans poids: ${remainingNoWeight}`);
  console.log(`  Marques orphelines: ${orphanBrands.length}`);

  console.log("\n=== Terminé ===");
}

main().catch(console.error).finally(() => prisma.$disconnect());
