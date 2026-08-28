import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();
const IMAGES_DIR = path.join(__dirname, '..', 'public', 'images', 'products');

interface AuditResult {
  productsWithoutImages: string[];
  imagesWithoutProduct: string[];
  brokenMappings: string[];
  duplicateSlugs: string[];
  orphanFolders: string[];
  missingFolders: string[];
  corruptedFiles: string[];
  urlMismatches: string[];
  totalProducts: number;
  totalImages: number;
  totalFolders: number;
  totalWebpFiles: number;
}

async function audit(): Promise<AuditResult> {
  const result: AuditResult = {
    productsWithoutImages: [],
    imagesWithoutProduct: [],
    brokenMappings: [],
    duplicateSlugs: [],
    orphanFolders: [],
    missingFolders: [],
    corruptedFiles: [],
    urlMismatches: [],
    totalProducts: 0,
    totalImages: 0,
    totalFolders: 0,
    totalWebpFiles: 0,
  };

  // 1. Get all products from DB
  const products = await prisma.product.findMany({
    select: { id: true, slug: true, name: true },
  });
  result.totalProducts = products.length;

  // 2. Get all product images from DB
  const dbImages = await prisma.productImage.findMany({
    select: { id: true, url: true, productId: true, product: { select: { slug: true } } },
  });
  result.totalImages = dbImages.length;

  // 3. Get all folders on disk
  const folders = fs.readdirSync(IMAGES_DIR, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name);
  result.totalFolders = folders.length;

  // 4. Check products without images
  const productsWithImages = new Set(dbImages.map(i => i.productId));
  for (const p of products) {
    if (!productsWithImages.has(p.id)) {
      result.productsWithoutImages.push(`${p.slug} (${p.name})`);
    }
  }

  // 5. Check folders without matching product in DB
  const productSlugs = new Set(products.map(p => p.slug));
  for (const folder of folders) {
    if (!productSlugs.has(folder)) {
      result.orphanFolders.push(folder);
    }
  }

  // 6. Check products without folders on disk
  for (const p of products) {
    const folderPath = path.join(IMAGES_DIR, p.slug);
    if (!fs.existsSync(folderPath)) {
      result.missingFolders.push(`${p.slug} (${p.name})`);
    }
  }

  // 7. Check broken image URL mappings
  for (const img of dbImages) {
    // URL should start with /images/products/
    if (!img.url.startsWith('/images/products/')) {
      result.brokenMappings.push(`Invalid URL prefix: ${img.url} (product: ${img.product.slug})`);
      continue;
    }

    // Extract slug and filename from URL
    const parts = img.url.replace('/images/products/', '').split('/');
    if (parts.length !== 2) {
      result.brokenMappings.push(`Invalid URL structure: ${img.url}`);
      continue;
    }

    const [urlSlug, filename] = parts as [string, string];

    // Check slug matches
    if (urlSlug !== img.product.slug) {
      result.urlMismatches.push(`URL slug "${urlSlug}" != DB slug "${img.product.slug}" for image ${img.url}`);
    }

    // Check file exists on disk
    const filePath = path.join(IMAGES_DIR, urlSlug, filename);
    if (!fs.existsSync(filePath)) {
      result.brokenMappings.push(`File missing: ${filePath}`);
    }
  }

  // 8. Check all WebP files on disk
  let totalWebpSize = 0;
  for (const folder of folders) {
    const folderPath = path.join(IMAGES_DIR, folder);
    const files = fs.readdirSync(folderPath);
    const webpFiles = files.filter(f => f.endsWith('.webp'));
    result.totalWebpFiles += webpFiles.length;

    for (const file of webpFiles) {
      const filePath = path.join(folderPath, file);
      const stats = fs.statSync(filePath);
      totalWebpSize += stats.size;

      // Check if file is too small (likely corrupted)
      if (stats.size < 100) {
        result.corruptedFiles.push(`${folder}/${file} (${stats.size} bytes)`);
      }
    }

    // Check for .jpg without .webp (not optimized)
    const jpgFiles = files.filter(f => f.endsWith('.jpg'));
    if (jpgFiles.length > 0 && webpFiles.length === 0) {
      result.corruptedFiles.push(`${folder}/ has .jpg but NO .webp (not optimized)`);
    }
  }

  // 9. Check for duplicate slugs (shouldn't happen but just in case)
  const slugCounts = new Map<string, number>();
  for (const p of products) {
    slugCounts.set(p.slug, (slugCounts.get(p.slug) || 0) + 1);
  }
  for (const [slug, count] of slugCounts) {
    if (count > 1) {
      result.duplicateSlugs.push(`${slug} (${count} times)`);
    }
  }

  return result;
}

async function main() {
  console.log('🔍 AUDIT APPROFONDI DES IMAGES\n');
  console.log('='.repeat(60));

  const result = await audit();

  console.log(`\n📊 RÉSUMÉ GÉNÉRAL`);
  console.log(`  Produits en BDD:        ${result.totalProducts}`);
  console.log(`  Images en BDD:          ${result.totalImages}`);
  console.log(`  Dossiers sur disque:    ${result.totalFolders}`);
  console.log(`  Fichiers WebP:          ${result.totalWebpFiles}`);

  console.log(`\n✅ PRODUITS SANS IMAGES: ${result.productsWithoutImages.length}`);
  if (result.productsWithoutImages.length > 0) {
    result.productsWithoutImages.forEach(p => console.log(`  ❌ ${p}`));
  }

  console.log(`\n📁 DOSSIERS ORPHELINS (sans produit BDD): ${result.orphanFolders.length}`);
  if (result.orphanFolders.length > 0) {
    result.orphanFolders.forEach(f => console.log(`  ⚠️  ${f}`));
  }

  console.log(`\n📁 PRODUITS SANS DOSSIER: ${result.missingFolders.length}`);
  if (result.missingFolders.length > 0) {
    result.missingFolders.forEach(p => console.log(`  ❌ ${p}`));
  }

  console.log(`\n🔗 MAPPINGS CASSÉS: ${result.brokenMappings.length}`);
  if (result.brokenMappings.length > 0) {
    result.brokenMappings.forEach(m => console.log(`  ❌ ${m}`));
  }

  console.log(`\n🔗 DÉCALAGES SLUG URL vs BDD: ${result.urlMismatches.length}`);
  if (result.urlMismatches.length > 0) {
    result.urlMismatches.forEach(m => console.log(`  ⚠️  ${m}`));
  }

  console.log(`\n🔴 FICHIERS CORROMPUS: ${result.corruptedFiles.length}`);
  if (result.corruptedFiles.length > 0) {
    result.corruptedFiles.forEach(f => console.log(`  ❌ ${f}`));
  }

  console.log(`\n🔴 SLUGS DUPLIQUÉS: ${result.duplicateSlugs.length}`);
  if (result.duplicateSlugs.length > 0) {
    result.duplicateSlugs.forEach(s => console.log(`  ❌ ${s}`));
  }

  // Overall status
  const issues = result.productsWithoutImages.length +
    result.brokenMappings.length +
    result.corruptedFiles.length +
    result.duplicateSlugs.length;

  console.log('\n' + '='.repeat(60));
  if (issues === 0) {
    console.log('✅ AUDIT RÉUSSI — Aucun problème critique détecté');
  } else {
    console.log(`❌ AUDIT ÉCHOUÉ — ${issues} problème(s) détecté(s)`);
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
