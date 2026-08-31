import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface Issue {
  slug: string;
  name: string;
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  category: string;
  message: string;
}

async function main() {
  console.log("=== AUDIT COMPLET PRODUIT PAR PRODUIT ===\n");

  const products = await prisma.product.findMany({
    include: {
      category: true,
      brand: true,
      specs: true,
      images: true,
    },
    orderBy: { name: "asc" },
  });

  console.log(`Total produits à auditer: ${products.length}\n`);

  const issues: Issue[] = [];

  for (const p of products) {
    const price = Number(p.price);
    const orig = p.originalPrice ? Number(p.originalPrice) : null;

    // === PRIX ===
    if (price <= 0) {
      issues.push({ slug: p.slug, name: p.name, severity: "CRITICAL", category: "Prix", message: `Prix invalide: ${price}€` });
    }
    if (price > 50000) {
      issues.push({ slug: p.slug, name: p.name, severity: "HIGH", category: "Prix", message: `Prix suspect: ${price}€ — vérifier` });
    }
    if (orig !== null) {
      if (orig <= price) {
        issues.push({ slug: p.slug, name: p.name, severity: "HIGH", category: "Prix", message: `originalPrice (${orig}€) ≤ price (${price}€) — pas de promotion visible` });
      }
      const discount = Math.round(((orig - price) / orig) * 100);
      if (discount < 1 || discount > 80) {
        issues.push({ slug: p.slug, name: p.name, severity: "HIGH", category: "Prix", message: `Discount ${discount}% — hors range attendu (1-80%)` });
      }
      if (Math.abs(discount - 19) > 2) {
        issues.push({ slug: p.slug, name: p.name, severity: "MEDIUM", category: "Prix", message: `Discount ${discount}% ≠ -19% attendu` });
      }
    }
    if (orig === null && p.isPromo) {
      issues.push({ slug: p.slug, name: p.name, severity: "MEDIUM", category: "Prix", message: `isPromo=true mais pas d'originalPrice` });
    }
    if (orig !== null && !p.isPromo) {
      issues.push({ slug: p.slug, name: p.name, severity: "MEDIUM", category: "Prix", message: `originalPrice défini mais isPromo=false` });
    }

    // === CHAMPS REQUIS ===
    if (!p.name || p.name.trim().length === 0) {
      issues.push({ slug: p.slug, name: p.name, severity: "CRITICAL", category: "Données", message: "Nom vide" });
    }
    if (p.name && p.name.length > 200) {
      issues.push({ slug: p.slug, name: p.name, severity: "MEDIUM", category: "Données", message: `Nom trop long: ${p.name.length} caractères` });
    }
    if (!p.slug || p.slug.trim().length === 0) {
      issues.push({ slug: p.slug, name: p.name, severity: "CRITICAL", category: "Données", message: "Slug vide" });
    }
    if (p.slug && /\s/.test(p.slug)) {
      issues.push({ slug: p.slug, name: p.name, severity: "HIGH", category: "Données", message: `Slug contient des espaces: "${p.slug}"` });
    }
    if (p.slug && /[A-Z]/.test(p.slug)) {
      issues.push({ slug: p.slug, name: p.name, severity: "MEDIUM", category: "Données", message: `Slug contient des majuscules: "${p.slug}"` });
    }
    if (!p.description || p.description.trim().length < 20) {
      issues.push({ slug: p.slug, name: p.name, severity: "HIGH", category: "Données", message: `Description trop courte: ${p.description?.length || 0} caractères` });
    }
    if (p.description && p.description.length > 10000) {
      issues.push({ slug: p.slug, name: p.name, severity: "MEDIUM", category: "Données", message: `Description trop longue: ${p.description.length} caractères` });
    }
    if (!p.shortDesc || p.shortDesc.trim().length < 10) {
      issues.push({ slug: p.slug, name: p.name, severity: "MEDIUM", category: "Données", message: `shortDesc trop court: ${p.shortDesc?.length || 0} caractères` });
    }

    // === CATÉGORIE & MARQUE ===
    if (!p.categoryId) {
      issues.push({ slug: p.slug, name: p.name, severity: "CRITICAL", category: "Catégorie", message: "Pas de catégorie assignée" });
    }
    if (!p.category) {
      issues.push({ slug: p.slug, name: p.name, severity: "CRITICAL", category: "Catégorie", message: `categoryId ${p.categoryId} n'existe pas` });
    }
    if (!p.brandId) {
      issues.push({ slug: p.slug, name: p.name, severity: "CRITICAL", category: "Marque", message: "Pas de marque assignée" });
    }
    if (!p.brand) {
      issues.push({ slug: p.slug, name: p.name, severity: "CRITICAL", category: "Marque", message: `brandId ${p.brandId} n'existe pas` });
    }

    // === IMAGES ===
    if (!p.images || p.images.length === 0) {
      issues.push({ slug: p.slug, name: p.name, severity: "CRITICAL", category: "Images", message: "Aucune image" });
    } else {
      const sorted = p.images.sort((a, b) => a.position - b.position);
      if (sorted[0].position !== 0) {
        issues.push({ slug: p.slug, name: p.name, severity: "MEDIUM", category: "Images", message: `Pas d'image principale (position 0)` });
      }
      if (p.images.length === 1) {
        issues.push({ slug: p.slug, name: p.name, severity: "LOW", category: "Images", message: "Une seule image — envisager d'ajouter des angles multiples" });
      }
      for (const img of p.images) {
        if (!img.url || img.url.trim().length === 0) {
          issues.push({ slug: p.slug, name: p.name, severity: "CRITICAL", category: "Images", message: `Image position ${img.position} n'a pas d'URL` });
        }
      }
    }

    // === SPECS ===
    if (!p.specs || p.specs.length === 0) {
      issues.push({ slug: p.slug, name: p.name, severity: "HIGH", category: "Specs", message: "Aucune spécification technique" });
    } else {
      for (const spec of p.specs) {
        if (!spec.key || spec.key.trim().length === 0) {
          issues.push({ slug: p.slug, name: p.name, severity: "HIGH", category: "Specs", message: "Spec avec key vide" });
        }
        if (!spec.value || spec.value.trim().length === 0) {
          issues.push({ slug: p.slug, name: p.name, severity: "MEDIUM", category: "Specs", message: `Spec "${spec.key}" a une value vide` });
        }
      }
      const keys = p.specs.map((s) => s.key);
      const dupes = keys.filter((k, i) => keys.indexOf(k) !== i);
      if (dupes.length > 0) {
        issues.push({ slug: p.slug, name: p.name, severity: "MEDIUM", category: "Specs", message: `Specs en double: ${[...new Set(dupes)].join(", ")}` });
      }
    }

    // === FEATURES ===
    if (!p.features || p.features.length === 0) {
      issues.push({ slug: p.slug, name: p.name, severity: "MEDIUM", category: "Features", message: "Pas de features listées" });
    }
    if (p.features && p.features.length > 0) {
      const emptyFeatures = p.features.filter((f) => !f || f.trim().length === 0);
      if (emptyFeatures.length > 0) {
        issues.push({ slug: p.slug, name: p.name, severity: "MEDIUM", category: "Features", message: `${emptyFeatures.length} feature(s) vide(s)` });
      }
    }

    // === SKU ===
    if (!p.sku || p.sku.trim().length === 0) {
      issues.push({ slug: p.slug, name: p.name, severity: "MEDIUM", category: "SKU", message: "Pas de SKU" });
    }

    // === STOCK ===
    if (p.stockQuantity !== null && p.stockQuantity !== undefined && p.stockQuantity < 0) {
      issues.push({ slug: p.slug, name: p.name, severity: "HIGH", category: "Stock", message: `stockQuantity négatif: ${p.stockQuantity}` });
    }
    if (p.inStock === false && p.stockQuantity !== null && p.stockQuantity !== undefined && p.stockQuantity > 0) {
      issues.push({ slug: p.slug, name: p.name, severity: "MEDIUM", category: "Stock", message: `inStock=false mais stockQuantity=${p.stockQuantity}` });
    }

    // === POIDS ===
    if (!p.weight) {
      issues.push({ slug: p.slug, name: p.name, severity: "LOW", category: "Poids", message: "Pas de poids défini" });
    }
    if (p.weight && Number(p.weight) <= 0) {
      issues.push({ slug: p.slug, name: p.name, severity: "MEDIUM", category: "Poids", message: `Poids invalide: ${p.weight}kg` });
    }
    if (p.weight && Number(p.weight) > 500) {
      issues.push({ slug: p.slug, name: p.name, severity: "MEDIUM", category: "Poids", message: `Poids suspect: ${p.weight}kg` });
    }

    // === SEO ===
    if (!p.seoTitle || p.seoTitle.trim().length === 0) {
      issues.push({ slug: p.slug, name: p.name, severity: "LOW", category: "SEO", message: "Pas de seoTitle" });
    }
    if (p.seoTitle && p.seoTitle.length > 70) {
      issues.push({ slug: p.slug, name: p.name, severity: "LOW", category: "SEO", message: `seoTitle trop long: ${p.seoTitle.length} caractères (max 70)` });
    }
    if (!p.seoDesc || p.seoDesc.trim().length === 0) {
      issues.push({ slug: p.slug, name: p.name, severity: "LOW", category: "SEO", message: "Pas de seoDesc" });
    }
    if (p.seoDesc && p.seoDesc.length > 160) {
      issues.push({ slug: p.slug, name: p.name, severity: "LOW", category: "SEO", message: `seoDesc trop long: ${p.seoDesc.length} caractères (max 160)` });
    }

    // === TAGS ===
    if (!p.tags || p.tags.length === 0) {
      issues.push({ slug: p.slug, name: p.name, severity: "LOW", category: "Tags", message: "Pas de tags" });
    }

    // === SUBCATEGORY ===
    if (!p.subCategory || p.subCategory.trim().length === 0) {
      issues.push({ slug: p.slug, name: p.name, severity: "LOW", category: "SubCat", message: "Pas de subCategory" });
    }

    // === RATING ===
    if (Number(p.rating) > 5) {
      issues.push({ slug: p.slug, name: p.name, severity: "HIGH", category: "Rating", message: `Rating > 5: ${p.rating}` });
    }
    if (Number(p.rating) < 0) {
      issues.push({ slug: p.slug, name: p.name, severity: "HIGH", category: "Rating", message: `Rating négatif: ${p.rating}` });
    }

    // === HOMEPAGE DISPLAY ===
    if (p.isFeatured && !p.inStock) {
      issues.push({ slug: p.slug, name: p.name, severity: "MEDIUM", category: "Homepage", message: "Featured mais pas en stock" });
    }
    if (p.isNew && p.isPromo) {
      // This is fine, just noting
    }

    // === URL / SLUG CONSISTENCY ===
    if (p.slug && !p.slug.match(/^[a-z0-9]+(-[a-z0-9]+)*$/)) {
      issues.push({ slug: p.slug, name: p.name, severity: "MEDIUM", category: "Slug", message: `Slug format inhabituel: "${p.slug}"` });
    }
  }

  // === GLOBAL CHECKS ===
  console.log("=== VÉRIFICATIONS GLOBALES ===\n");

  // Duplicate slugs
  const slugs = products.map((p) => p.slug);
  const dupeSlugs = slugs.filter((s, i) => slugs.indexOf(s) !== i);
  if (dupeSlugs.length > 0) {
    issues.push({ slug: "N/A", name: "GLOBAL", severity: "CRITICAL", category: "Doublons", message: `Slugs en double: ${[...new Set(dupeSlugs)].join(", ")}` });
  }

  // Duplicate SKUs
  const skus = products.map((p) => p.sku).filter(Boolean);
  const dupeSkus = skus.filter((s, i) => skus.indexOf(s) !== i);
  if (dupeSkus.length > 0) {
    issues.push({ slug: "N/A", name: "GLOBAL", severity: "HIGH", category: "Doublons", message: `SKUs en double: ${[...new Set(dupeSkus)].join(", ")}` });
  }

  // Products per category
  const catCounts: Record<string, number> = {};
  for (const p of products) {
    const cat = p.category?.name || "Inconnue";
    catCounts[cat] = (catCounts[cat] || 0) + 1;
  }
  console.log("Produits par catégorie:");
  for (const [cat, count] of Object.entries(catCounts).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${cat}: ${count}`);
  }

  // Products per brand
  const brandCounts: Record<string, number> = {};
  for (const p of products) {
    const brand = p.brand?.name || "Inconnue";
    brandCounts[brand] = (brandCounts[brand] || 0) + 1;
  }
  console.log("\nProduits par marque (top 15):");
  const sortedBrands = Object.entries(brandCounts).sort((a, b) => b[1] - a[1]).slice(0, 15);
  for (const [brand, count] of sortedBrands) {
    console.log(`  ${brand}: ${count}`);
  }

  // Orphan brands (brands with 0 products - not possible in this audit but check)
  const allBrands = await prisma.brand.findMany({ include: { _count: { select: { products: true } } } });
  const orphanBrands = allBrands.filter((b) => b._count.products === 0);
  if (orphanBrands.length > 0) {
    console.log(`\nMarques orphelines (0 produits): ${orphanBrands.map((b) => b.name).join(", ")}`);
  }

  // Categories with 0 products
  const allCats = await prisma.category.findMany({ include: { _count: { select: { products: true } } } });
  const emptyCats = allCats.filter((c) => c._count.products === 0);
  if (emptyCats.length > 0) {
    console.log(`Catégories vides: ${emptyCats.map((c) => c.name).join(", ")}`);
  }

  // === SUMMARY ===
  console.log("\n\n=== RÉSUMÉ ===\n");

  const bySeverity = {
    CRITICAL: issues.filter((i) => i.severity === "CRITICAL"),
    HIGH: issues.filter((i) => i.severity === "HIGH"),
    MEDIUM: issues.filter((i) => i.severity === "MEDIUM"),
    LOW: issues.filter((i) => i.severity === "LOW"),
  };

  console.log(`🔴 CRITIQUE: ${bySeverity.CRITICAL.length}`);
  console.log(`🟠 HAUT: ${bySeverity.HIGH.length}`);
  console.log(`🟡 MOYEN: ${bySeverity.MEDIUM.length}`);
  console.log(`🔵 BAS: ${bySeverity.LOW.length}`);
  console.log(`\nTotal: ${issues.length} problème(s) trouvé(s)\n`);

  if (bySeverity.CRITICAL.length > 0) {
    console.log("🔴 PROBLÈMES CRITIQUES:");
    bySeverity.CRITICAL.forEach((i) => console.log(`  [${i.category}] ${i.name}: ${i.message}`));
    console.log();
  }

  if (bySeverity.HIGH.length > 0) {
    console.log("🟠 PROBLÈMES HAUTS:");
    bySeverity.HIGH.forEach((i) => console.log(`  [${i.category}] ${i.name}: ${i.message}`));
    console.log();
  }

  if (bySeverity.MEDIUM.length > 0) {
    console.log("🟡 PROBLÈMES MOYENS:");
    bySeverity.MEDIUM.forEach((i) => console.log(`  [${i.category}] ${i.name}: ${i.message}`));
    console.log();
  }

  if (bySeverity.LOW.length > 0) {
    console.log("🔵 PROBLÈMES BAS:");
    bySeverity.LOW.forEach((i) => console.log(`  [${i.category}] ${i.name}: ${i.message}`));
    console.log();
  }

  // Products with zero issues
  const productsWithIssues = new Set(issues.filter((i) => i.slug !== "N/A").map((i) => i.slug));
  const cleanProducts = products.length - productsWithIssues.size;
  console.log(`\n✅ Produits sans problème: ${cleanProducts}/${products.length}`);

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
