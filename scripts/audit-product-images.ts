import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();
const PUBLIC_DIR = path.join(process.cwd(), "public");

interface ProductAudit {
  slug: string;
  name: string;
  brand: string | null;
  category: string | null;
  imageCount: number;
  images: {
    url: string;
    exists: boolean;
    sizeKB: number;
    hasWebPThumb: boolean;
    hasWebPMedium: boolean;
    hasWebPLarge: boolean;
    fullUrl: string;
  }[];
  issues: string[];
}

async function main() {
  const products = await prisma.product.findMany({
    select: {
      slug: true,
      name: true,
      brand: { select: { name: true } },
      category: { select: { name: true } },
      images: { select: { url: true, position: true }, orderBy: { position: "asc" } },
    },
    orderBy: { slug: "asc" },
  });

  const results: ProductAudit[] = [];
  const suspiciousProducts: ProductAudit[] = [];

  for (const product of products) {
    const audit: ProductAudit = {
      slug: product.slug,
      name: product.name,
      brand: product.brand?.name || null,
      category: product.category?.name || null,
      imageCount: product.images.length,
      images: [],
      issues: [],
    };

    for (const img of product.images) {
      const filePath = path.join(PUBLIC_DIR, img.url);
      const exists = fs.existsSync(filePath);
      let sizeKB = 0;
      if (exists) {
        const stats = fs.statSync(filePath);
        sizeKB = Math.round(stats.size / 1024);
      }

      // Check WebP variants
      const dir = path.dirname(img.url);
      const base = path.basename(img.url, path.extname(img.url));
      const hasWebPThumb = fs.existsSync(path.join(PUBLIC_DIR, dir, `${base}-thumb.webp`));
      const hasWebPMedium = fs.existsSync(path.join(PUBLIC_DIR, dir, `${base}-medium.webp`));
      const hasWebPLarge = fs.existsSync(path.join(PUBLIC_DIR, dir, `${base}-large.webp`));

      const fullUrl = `https://www.hausaura.de${img.url}`;

      audit.images.push({
        url: img.url,
        exists,
        sizeKB,
        hasWebPThumb,
        hasWebPMedium,
        hasWebPLarge,
        fullUrl,
      });

      // Flag suspicious sizes
      if (exists && sizeKB < 5) {
        audit.issues.push(`Image trop petite (${sizeKB}KB): ${img.url}`);
      }
      if (!hasWebPThumb || !hasWebPMedium || !hasWebPLarge) {
        audit.issues.push(`Variante WebP manquante: ${img.url}`);
      }
    }

    results.push(audit);
    if (audit.issues.length > 0) {
      suspiciousProducts.push(audit);
    }
  }

  // Summary
  console.log("=== RÉSUMÉ AUDIT IMAGES ===\n");
  console.log(`Total produits: ${results.length}`);
  console.log(`Produits avec problèmes: ${suspiciousProducts.length}\n`);

  if (suspiciousProducts.length > 0) {
    console.log("=== PRODUITS SUSPECTS ===\n");
    for (const p of suspiciousProducts) {
      console.log(`📦 ${p.slug} — ${p.name} (${p.brand || "sans marque"}, ${p.category || "sans catégorie"})`);
      console.log(`   Images: ${p.imageCount}`);
      for (const issue of p.issues) {
        console.log(`   ⚠️  ${issue}`);
      }
      for (const img of p.images) {
        console.log(`   → ${img.fullUrl} (${img.sizeKB}KB)`);
      }
      console.log("");
    }
  }

  // Generate verification URLs grouped by category
  console.log("=== URLs DE VÉRIFICATION PAR CATÉGORIE ===\n");
  const byCategory = new Map<string, ProductAudit[]>();
  for (const r of results) {
    const cat = r.category || "Sans catégorie";
    const list = byCategory.get(cat) || [];
    list.push(r);
    byCategory.set(cat, list);
  }

  for (const [cat, prods] of byCategory) {
    console.log(`\n📂 ${cat} (${prods.length} produits)`);
    for (const p of prods) {
      const brand = p.brand ? `${p.brand} ` : "";
      console.log(`  ${brand}${p.name} → ${p.images[0]?.fullUrl || "PAS D'IMAGE"}`);
    }
  }

  // Save report
  const report = {
    summary: {
      totalProducts: results.length,
      productsWithIssues: suspiciousProducts.length,
    },
    suspiciousProducts,
    allProducts: results,
  };

  fs.writeFileSync(
    path.join(process.cwd(), "scripts", "image-audit-report.json"),
    JSON.stringify(report, null, 2)
  );
  console.log("\n\nRapport complet sauvegardé: scripts/image-audit-report.json");

  await prisma.$disconnect();
}

main().catch(console.error);
