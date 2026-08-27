import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import * as https from 'https';
import * as http from 'http';

const prisma = new PrismaClient();

function download(url: string, dest: string): Promise<boolean> {
  return new Promise((resolve) => {
    const mod = url.startsWith('https') ? https : http;
    const file = fs.createWriteStream(dest);
    mod.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' } }, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        download(response.headers.location!, dest).then(resolve);
        return;
      }
      if (response.statusCode !== 200) { resolve(false); return; }
      response.pipe(file);
      file.on('finish', () => { file.close(); resolve(true); });
    }).on('error', () => { resolve(false); });
  });
}

(async () => {
  const noImages = await prisma.product.findMany({
    where: { images: { none: {} } },
    select: { slug: true, name: true, barcode: true, sku: true }
  });

  console.log(`Products without images: ${noImages.length}`);
  const base = 'public/images/products';

  for (const p of noImages) {
    const dir = path.join(base, p.slug);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    const existing = fs.readdirSync(dir).filter(f => f.endsWith('.jpg') || f.endsWith('.webp'));
    if (existing.length > 0) { console.log(`SKIP ${p.slug} (has files)`); continue; }

    // Try multiple source patterns
    const sources: string[] = [];

    // Try barcode-based Prisjakt CDN
    if (p.barcode) {
      sources.push(`https://cdn.pji.nu/product/standard/800/${p.barcode}.jpg`);
    }

    // Try SKU-based Prisjakt CDN
    if (p.sku) {
      sources.push(`https://cdn.pji.nu/product/standard/800/${p.sku}.jpg`);
    }

    // Try Galaxus image patterns
    if (p.barcode) {
      sources.push(`https://static01.galaxus.ch/product/1/${p.barcode}_S1.jpg`);
    }

    let downloaded = false;
    for (const url of sources) {
      const dest = path.join(dir, '1.jpg');
      try {
        const ok = await download(url, dest);
        if (ok) {
          const size = fs.statSync(dest).size / 1024;
          if (size > 5) {
            console.log(`OK ${p.slug}: ${url} (${size.toFixed(1)} KB)`);
            downloaded = true;
            break;
          } else {
            fs.unlinkSync(dest);
          }
        }
      } catch {}
    }

    if (!downloaded) {
      console.log(`FAIL ${p.slug} (barcode: ${p.barcode}, SKU: ${p.sku})`);
    }
  }

  await prisma.$disconnect();
})();
