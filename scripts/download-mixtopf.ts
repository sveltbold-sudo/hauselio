import https from "https";
import http from "http";
import fs from "fs";
import path from "path";
import sharp from "sharp";

const PUBLIC_DIR = path.join(process.cwd(), "public", "images", "products");

function download(url: string, dest: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const mod = url.startsWith("https") ? https : http;
    const file = fs.createWriteStream(dest);
    mod
      .get(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          "Accept": "image/webp,image/apng,image/*,*/*;q=0.8",
        },
      }, (res) => {
        if (res.statusCode === 301 || res.statusCode === 302) {
          download(res.headers.location!, dest).then(resolve).catch(reject);
          return;
        }
        res.pipe(file);
        file.on("finish", () => { file.close(); resolve(); });
      })
      .on("error", (err) => { fs.unlink(dest, () => {}); reject(err); });
  });
}

async function generateVariants(dir: string, base: string, ext: string) {
  const src = path.join(dir, `${base}${ext}`);
  if (!fs.existsSync(src)) return;
  for (const { suffix, px } of [
    { suffix: "thumb", px: 300 },
    { suffix: "medium", px: 600 },
    { suffix: "large", px: 1200 },
  ]) {
    const dest = path.join(dir, `${base}-${suffix}.webp`);
    if (!fs.existsSync(dest)) {
      await sharp(src).resize(px, px, { fit: "inside", withoutEnlargement: true }).webp({ quality: 80 }).toFile(dest);
      console.log(`  ✅ ${base}-${suffix}.webp`);
    }
  }
}

// StickPNG images
const downloads = [
  { slug: "thermomix-mixtopf-tm6", url: "https://assets.stickpng.com/images/5b474a61c051e602a568cd41.png", file: "1.png" },
  { slug: "thermomix-spatel-tm6", url: "https://assets.stickpng.com/images/5b474a67c051e602a568cd42.png", file: "1.png" },
];

async function main() {
  for (const d of downloads) {
    const dir = path.join(PUBLIC_DIR, d.slug);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    const dest = path.join(dir, d.file);
    if (fs.existsSync(dest) && fs.statSync(dest).size > 5000) {
      console.log(`⏭️  ${d.slug}/${d.file} exists`);
      continue;
    }
    try {
      console.log(`📥 ${d.slug}/${d.file}...`);
      await download(d.url, dest);
      const size = fs.statSync(dest).size;
      console.log(`  ✅ ${size} bytes`);
      await generateVariants(dir, d.file.replace(/\.[^.]+$/, ""), ".png");
    } catch (e) {
      console.log(`  ❌ ${e}`);
    }
  }
}

main().catch(console.error);
