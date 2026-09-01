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
          "Accept-Language": "en-US,en;q=0.9",
          "Referer": "https://www.amazon.de/",
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

// HD product images — Amazon CDN with larger size params
const downloads = [
  // Thermomix Friend — Amazon.ie
  { slug: "thermomix-friend", url: "https://m.media-amazon.com/images/I/41iuaDxl32L._SX1200_.jpg", file: "1.jpg" },
  { slug: "thermomix-friend", url: "https://m.media-amazon.com/images/I/41S5LaUyn3L._SX1200_.jpg", file: "2.jpg" },
  { slug: "thermomix-friend", url: "https://m.media-amazon.com/images/I/511Us4iqO7L._SX1200_.jpg", file: "3.jpg" },
  // Thermomix TM31 — Amazon.it
  { slug: "thermomix-tm31", url: "https://m.media-amazon.com/images/I/61S-ZjJ8qlL._SX1200_.jpg", file: "1.jpg" },
  // Thermomix Sensor — Amazon
  { slug: "thermomix-sensor", url: "https://m.media-amazon.com/images/I/518b2ne+bGL._SX1200_.jpg", file: "1.jpg" },
];

async function main() {
  for (const d of downloads) {
    const dir = path.join(PUBLIC_DIR, d.slug);
    const dest = path.join(dir, d.file);
    // Remove old small version
    if (fs.existsSync(dest)) fs.unlinkSync(dest);

    try {
      console.log(`📥 ${d.slug}/${d.file}...`);
      await download(d.url, dest);
      const size = fs.statSync(dest).size;
      console.log(`  ✅ ${size} bytes`);
      await generateVariants(dir, d.file.replace(/\.[^.]+$/, ""), ".jpg");
    } catch (e) {
      console.log(`  ❌ ${e}`);
    }
  }
}

main().catch(console.error);
