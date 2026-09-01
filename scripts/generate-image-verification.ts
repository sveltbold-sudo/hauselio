import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

async function main() {
  const products = await prisma.product.findMany({
    select: {
      slug: true,
      name: true,
      brand: { select: { name: true } },
      category: { select: { name: true } },
      images: { select: { url: true }, orderBy: { position: "asc" } },
    },
    orderBy: { name: "asc" },
  });

  const byCategory = new Map<string, typeof products>();
  for (const p of products) {
    const cat = p.category?.name || "Sans catégorie";
    const list = byCategory.get(cat) || [];
    list.push(p);
    byCategory.set(cat, list);
  }

  let html = `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<title>Vérification Images — HAUSAURA (${products.length} produits)</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: -apple-system, system-ui, sans-serif; background: #f5f5f5; padding: 20px; }
  h1 { text-align: center; margin-bottom: 10px; }
  .stats { text-align: center; color: #666; margin-bottom: 30px; }
  .category { margin-bottom: 40px; }
  .category h2 { background: #333; color: #fff; padding: 10px 16px; border-radius: 6px; margin-bottom: 12px; font-size: 16px; }
  .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 12px; }
  .card { background: #fff; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
  .card img { width: 100%; height: 180px; object-fit: contain; background: #fafafa; border-bottom: 1px solid #eee; }
  .card .info { padding: 8px 10px; }
  .card .brand { font-size: 11px; color: #888; text-transform: uppercase; }
  .card .name { font-size: 13px; font-weight: 600; color: #333; line-height: 1.3; }
  .card .slug { font-size: 10px; color: #aaa; margin-top: 2px; word-break: break-all; }
  .check { display: inline-block; margin-top: 4px; padding: 2px 8px; font-size: 11px; border-radius: 4px; cursor: pointer; border: none; }
  .check.ok { background: #d4edda; color: #155724; }
  .check.bad { background: #f8d7da; color: #721c24; }
  .check.maybe { background: #fff3cd; color: #856404; }
  .search { display: block; width: 100%; max-width: 400px; margin: 0 auto 20px; padding: 10px; font-size: 14px; border: 1px solid #ddd; border-radius: 6px; }
  .toc { display: flex; flex-wrap: wrap; gap: 8px; justify-content: center; margin-bottom: 30px; }
  .toc a { background: #fff; padding: 6px 14px; border-radius: 20px; text-decoration: none; color: #333; font-size: 13px; border: 1px solid #ddd; }
  .toc a:hover { background: #333; color: #fff; }
</style>
</head>
<body>
<h1>🔍 Vérification Images Produits</h1>
<p class="stats">${products.length} produits • ${byCategory.size} catégories</p>
<input class="search" type="text" placeholder="Rechercher un produit..." oninput="filterCards(this.value)">
<div class="toc">
${Array.from(byCategory.entries()).map(([cat, prods]) => `<a href="#cat-${cat.replace(/[^a-zA-Z0-9]/g, "")}">${cat} (${prods.length})</a>`).join("\n")}
</div>
`;

  for (const [cat, prods] of byCategory) {
    const safeId = cat.replace(/[^a-zA-Z0-9]/g, "");
    html += `<div class="category" id="cat-${safeId}"><h2>${cat} (${prods.length})</h2><div class="grid">`;
    for (const p of prods) {
      const brand = p.brand?.name || "";
      const img = p.images[0]?.url || "/images/placeholder-product.svg";
      const fullUrl = `https://www.hausaura.de${img}`;
      html += `
<div class="card" data-name="${(brand + " " + p.name + " " + p.slug).toLowerCase()}">
  <a href="https://www.hausaura.de/produkt/${p.slug}" target="_blank">
    <img src="${fullUrl}" alt="${p.name}" loading="lazy">
  </a>
  <div class="info">
    <div class="brand">${brand}</div>
    <div class="name">${p.name}</div>
    <div class="slug">${p.slug}</div>
    <button class="check ok" onclick="this.className='check bad'">✓ OK</button>
    <button class="check maybe" onclick="this.className='check ok'">?</button>
    <button class="check" onclick="this.className='check bad'">✗ Mauvais</button>
  </div>
</div>`;
    }
    html += `</div></div>`;
  }

  html += `
<script>
function filterCards(q) {
  q = q.toLowerCase();
  document.querySelectorAll('.card').forEach(c => {
    c.style.display = c.dataset.name.includes(q) ? '' : 'none';
  });
}
</script>
</body></html>`;

  const outPath = path.join(process.cwd(), "scripts", "verify-images.html");
  fs.writeFileSync(outPath, html);
  console.log(`Page générée: ${outPath}`);
  console.log(`Ouvre ce fichier dans ton navigateur pour vérifier visuellement.`);
  await prisma.$disconnect();
}

main().catch(console.error);
