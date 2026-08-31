import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  console.log("=== AUDIT COMPLET DES PRODUITS ===\n");

  const total = await prisma.product.count();
  const featured = await prisma.product.count({ where: { isFeatured: true } });
  const promo = await prisma.product.count({ where: { isPromo: true } });
  const newP = await prisma.product.count({ where: { isNew: true } });
  console.log(`Total: ${total} | Featured: ${featured} | Promo: ${promo} | New: ${newP}\n`);

  // 1. Products without images
  const noImages: any[] = await prisma.$queryRawUnsafe(
    `SELECT p.slug FROM "Product" p LEFT JOIN "ProductImage" pi ON p.id = pi."productId" WHERE pi.id IS NULL`
  );
  console.log(`[${noImages.length}] Produits SANS images:`);
  noImages.forEach((p: any) => console.log(`  - ${p.slug}`));

  // 2. Products without category
  const noCategory: any[] = await prisma.$queryRawUnsafe(
    `SELECT p.slug FROM "Product" p WHERE p."categoryId" IS NULL`
  );
  console.log(`\n[${noCategory.length}] Produits SANS categoryId:`);
  noCategory.forEach((p: any) => console.log(`  - ${p.slug}`));

  // 3. Products with categoryId that doesn't exist in Category
  const orphanCats: any[] = await prisma.$queryRawUnsafe(
    `SELECT p.slug, p."categoryId" as cid FROM "Product" p LEFT JOIN "Category" c ON p."categoryId" = c.id WHERE c.id IS NULL`
  );
  console.log(`\n[${orphanCats.length}] Produits avec categoryId INEXISTANT:`);
  orphanCats.forEach((p: any) => console.log(`  - ${p.slug} -> categoryId: "${p.cid}"`));

  // 4. Products without brand
  const noBrand: any[] = await prisma.$queryRawUnsafe(
    `SELECT p.slug FROM "Product" p WHERE p."brandId" IS NULL`
  );
  console.log(`\n[${noBrand.length}] Produits SANS brandId:`);
  noBrand.forEach((p: any) => console.log(`  - ${p.slug}`));

  // 5. Products with brandId that doesn't exist in Brand
  const orphanBrands: any[] = await prisma.$queryRawUnsafe(
    `SELECT p.slug, b.name as brandName FROM "Product" p LEFT JOIN "Brand" b ON p."brandId" = b.id WHERE p."brandId" IS NOT NULL AND b.id IS NULL`
  );
  console.log(`\n[${orphanBrands.length}] Produits avec brandId INEXISTANT dans Brand:`);
  orphanBrands.forEach((p: any) => console.log(`  - ${p.slug} -> brandId orphelin`));

  // 6. Products without subcategory
  const noSub: any[] = await prisma.$queryRawUnsafe(
    `SELECT p.slug, c.name as cat FROM "Product" p LEFT JOIN "Category" c ON p."categoryId" = c.id WHERE p."subCategory" IS NULL OR p."subCategory" = ''`
  );
  console.log(`\n[${noSub.length}] Produits SANS sous-catégorie:`);
  noSub.slice(0, 15).forEach((p: any) => console.log(`  - ${p.slug} (${p.cat})`));
  if (noSub.length > 15) console.log(`  ... et ${noSub.length - 15} autres`);

  // 7. Products without description or too short
  const noDesc: any[] = await prisma.$queryRawUnsafe(
    `SELECT slug, LENGTH(description) as len FROM "Product" WHERE description IS NULL OR LENGTH(description) < 50 ORDER BY len ASC`
  );
  console.log(`\n[${noDesc.length}] Produits SANS description (ou <50 chars):`);
  noDesc.forEach((p: any) => console.log(`  - ${p.slug} (${p.len} chars)`));

  // 8. Products without specs
  const noSpecs: any[] = await prisma.$queryRawUnsafe(
    `SELECT p.slug FROM "Product" p LEFT JOIN "ProductSpec" ps ON p.id = ps."productId" WHERE ps.id IS NULL`
  );
  console.log(`\n[${noSpecs.length}] Produits SANS specs:`);
  noSpecs.forEach((p: any) => console.log(`  - ${p.slug}`));

  // 9. Promo without originalPrice
  const promoNoPrice: any[] = await prisma.$queryRawUnsafe(
    `SELECT slug, price::numeric as price FROM "Product" WHERE "isPromo" = true AND "originalPrice" IS NULL`
  );
  console.log(`\n[${promoNoPrice.length}] Promo SANS originalPrice:`);
  promoNoPrice.forEach((p: any) => console.log(`  - ${p.slug} (${p.price}€)`));

  // 10. Promo where originalPrice <= price
  const promoInvalid: any[] = await prisma.$queryRawUnsafe(
    `SELECT slug, price::numeric as p, "originalPrice"::numeric as o FROM "Product" WHERE "isPromo" = true AND "originalPrice" IS NOT NULL AND "originalPrice" <= price`
  );
  console.log(`\n[${promoInvalid.length}] Promo avec originalPrice <= price (pas de réduction):`);
  promoInvalid.forEach((p: any) => console.log(`  - ${p.slug}: ${p.p}€ -> ${p.o}€`));

  // 11. Products with price <= 0
  const badPrice: any[] = await prisma.$queryRawUnsafe(
    `SELECT slug, price::numeric as price FROM "Product" WHERE price <= 0`
  );
  console.log(`\n[${badPrice.length}] Produits avec prix <= 0:`);
  badPrice.forEach((p: any) => console.log(`  - ${p.slug}: ${p.price}€`));

  // 12. Products without rating
  const noRating: any[] = await prisma.$queryRawUnsafe(
    `SELECT slug FROM "Product" WHERE rating IS NULL OR rating = 0`
  );
  console.log(`\n[${noRating.length}] Produits SANS note:`);
  noRating.forEach((p: any) => console.log(`  - ${p.slug}`));

  // 13. Products without SKU
  const noSku: any[] = await prisma.$queryRawUnsafe(
    `SELECT slug FROM "Product" WHERE sku IS NULL OR sku = ''`
  );
  console.log(`\n[${noSku.length}] Produits SANS SKU:`);
  noSku.forEach((p: any) => console.log(`  - ${p.slug}`));

  // 14. Duplicate slugs
  const dupSlugs: any[] = await prisma.$queryRawUnsafe(
    `SELECT slug, COUNT(*) as cnt FROM "Product" GROUP BY slug HAVING COUNT(*) > 1`
  );
  console.log(`\n[${dupSlugs.length}] Slugs DOUBLONS:`);
  dupSlugs.forEach((p: any) => console.log(`  - ${p.slug} (${p.cnt}x)`));

  // 15. Duplicate SKUs
  const dupSkus: any[] = await prisma.$queryRawUnsafe(
    `SELECT sku, COUNT(*) as cnt FROM "Product" WHERE sku IS NOT NULL GROUP BY sku HAVING COUNT(*) > 1`
  );
  console.log(`\n[${dupSkus.length}] SKUs DOUBLONS:`);
  dupSkus.forEach((p: any) => console.log(`  - ${p.sku} (${p.cnt}x)`));

  // 16. Categories without products
  const emptyCats: any[] = await prisma.$queryRawUnsafe(
    `SELECT c.slug, c.name FROM "Category" c LEFT JOIN "Product" p ON c.id = p."categoryId" WHERE p.id IS NULL`
  );
  console.log(`\n[${emptyCats.length}] Catégories SANS produits:`);
  emptyCats.forEach((c: any) => console.log(`  - ${c.slug} (${c.name})`));

  // 17. Brands without products
  const emptyBrands: any[] = await prisma.$queryRawUnsafe(
    `SELECT b.slug, b.name FROM "Brand" b LEFT JOIN "Product" p ON b.id = p."brandId" WHERE p.id IS NULL`
  );
  console.log(`\n[${emptyBrands.length}] Marques SANS produits:`);
  emptyBrands.forEach((b: any) => console.log(`  - ${b.slug} (${b.name})`));

  // 18. shortDesc issues
  const dupShortDesc: any[] = await prisma.$queryRawUnsafe(
    `SELECT slug, name, "shortDesc" as sd FROM "Product" WHERE "shortDesc" = name OR "shortDesc" IS NULL OR "shortDesc" = ''`
  );
  console.log(`\n[${dupShortDesc.length}] Produits où shortDesc = name ou vide:`);
  dupShortDesc.slice(0, 10).forEach((p: any) => console.log(`  - ${p.slug}: "${p.sd}"`));
  if (dupShortDesc.length > 10) console.log(`  ... et ${dupShortDesc.length - 10} autres`);

  // 19. Products without tags
  const noTags: any[] = await prisma.$queryRawUnsafe(
    `SELECT slug FROM "Product" WHERE tags IS NULL OR tags = '{}'::text[]`
  );
  console.log(`\n[${noTags.length}] Produits SANS tags:`);
  noTags.slice(0, 10).forEach((p: any) => console.log(`  - ${p.slug}`));

  // 20. Products without weight
  const noWeight: any[] = await prisma.$queryRawUnsafe(
    `SELECT slug FROM "Product" WHERE weight IS NULL OR weight = 0`
  );
  console.log(`\n[${noWeight.length}] Produits SANS poids:`);
  noWeight.slice(0, 10).forEach((p: any) => console.log(`  - ${p.slug}`));

  // 21. Price stats
  const priceStats: any[] = await prisma.$queryRawUnsafe(
    `SELECT MIN(price::numeric) as pmin, MAX(price::numeric) as pmax, ROUND(AVG(price::numeric))::numeric as pavg FROM "Product"`
  );
  console.log(`\nPrix: min=${priceStats[0].pmin}€ | max=${priceStats[0].pmax}€ | avg=${priceStats[0].pavg}€`);

  // 22. Products per category
  const perCat: any[] = await prisma.$queryRawUnsafe(
    `SELECT c.name as cat, c.slug as slug, COUNT(p.id) as cnt FROM "Category" c LEFT JOIN "Product" p ON c.id = p."categoryId" GROUP BY c.name, c.slug ORDER BY cnt DESC`
  );
  console.log(`\nProduits par catégorie:`);
  for (const c of perCat) console.log(`  ${c.cat} (${c.slug}): ${c.cnt}`);

  // 23. Top/bottom reviews
  const reviews: any[] = await prisma.$queryRawUnsafe(
    `SELECT slug, rating::numeric as r, "reviewCount" as cnt FROM "Product" WHERE rating > 0 ORDER BY r DESC LIMIT 5`
  );
  console.log(`\nTop 5 meilleures notes:`);
  for (const r of reviews) console.log(`  ${r.slug}: ${r.r}★ (${r.cnt} avis)`);

  const lowReviews: any[] = await prisma.$queryRawUnsafe(
    `SELECT slug, rating::numeric as r, "reviewCount" as cnt FROM "Product" WHERE rating > 0 ORDER BY r ASC LIMIT 5`
  );
  console.log(`\nBottom 5 notes les plus basses:`);
  for (const r of lowReviews) console.log(`  ${r.slug}: ${r.r}★ (${r.cnt} avis)`);

  // 24. Image count
  const imageCount = await prisma.productImage.count();
  console.log(`\nTotal ProductImage rows: ${imageCount}`);

  // 25. Products with features array
  const noFeatures: any[] = await prisma.$queryRawUnsafe(
    `SELECT slug FROM "Product" WHERE features IS NULL OR features = '{}'::text[]`
  );
  console.log(`\n[${noFeatures.length}] Produits SANS features:`);
  noFeatures.slice(0, 10).forEach((p: any) => console.log(`  - ${p.slug}`));

  // 26. ProductStock (separate table?)
  const stockCount = await prisma.productImage.count();
  console.log(`\nProductImage count: ${stockCount}`);

  // 27. Slug format check (should be lowercase, no spaces, no special chars)
  const badSlugs: any[] = await prisma.$queryRawUnsafe(
    `SELECT slug FROM "Product" WHERE slug != LOWER(slug) OR slug LIKE '% %' OR slug LIKE '%.%'`
  );
  console.log(`\n[${badSlugs.length}] Produits avec slug MALFORMÉ (majuscules, espaces, points):`);
  badSlugs.forEach((p: any) => console.log(`  - ${p.slug}`));

  // 28. Description too long (>5000 chars)
  const longDesc: any[] = await prisma.$queryRawUnsafe(
    `SELECT slug, LENGTH(description) as len FROM "Product" WHERE LENGTH(description) > 5000 ORDER BY len DESC LIMIT 5`
  );
  console.log(`\n[${longDesc.length > 0 ? 'yes' : '0'}] Produits avec description >5000 chars:`);
  longDesc.forEach((p: any) => console.log(`  - ${p.slug} (${p.len} chars)`));

  // 29. Products in wrong category (e.g., Kaffee machine in Staubsauger)
  const catMismatch: any[] = await prisma.$queryRawUnsafe(
    `SELECT p.slug, c.name as cat FROM "Product" p
     JOIN "Category" c ON p."categoryId" = c.id
     WHERE p."subCategory" IS NOT NULL AND p."subCategory" != ''
     AND p."subCategory" NOT LIKE c.slug || '%'
     AND c.slug != 'sonstiges'`
  );
  console.log(`\n[${catMismatch.length}] Produits où subCategory ne correspond PAS à la catégorie parente:`);
  catMismatch.slice(0, 15).forEach((p: any) => console.log(`  - ${p.slug}: cat=${p.cat}`));

  // 30. Rating with reviewCount = 0
  const ratingNoReview: any[] = await prisma.$queryRawUnsafe(
    `SELECT slug, rating::numeric as r, "reviewCount" as cnt FROM "Product" WHERE rating > 0 AND "reviewCount" = 0`
  );
  console.log(`\n[${ratingNoReview.length}] Produits avec note mais 0 avis:`);
  ratingNoReview.forEach((p: any) => console.log(`  - ${p.slug}: ${p.r}★ (${p.cnt} avis)`));

  // 31. inStock = false
  const outOfStock: any[] = await prisma.$queryRawUnsafe(
    `SELECT slug FROM "Product" WHERE "inStock" = false`
  );
  console.log(`\n[${outOfStock.length}] Produits en rupture de stock (inStock=false):`);
  outOfStock.forEach((p: any) => console.log(`  - ${p.slug}`));

  console.log("\n=== FIN DE L'AUDIT ===");
}

main().catch(console.error).finally(() => prisma.$disconnect());
