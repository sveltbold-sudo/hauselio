import sharp from "sharp";
import fs from "fs";
import path from "path";

const PRODUCTS_DIR = path.join(process.cwd(), "public", "images", "products");
const SIZES = {
  thumb: { width: 400, height: 400 },
  medium: { width: 800, height: 800 },
  large: { width: 1200, height: 1200 },
};

interface OptimizeResult {
  file: string;
  originalSize: number;
  optimizedSize: number;
  format: string;
  size: string;
}

async function optimizeImage(
  inputPath: string,
  outputPath: string,
  width: number,
  height: number
): Promise<OptimizeResult> {
  const originalStat = fs.statSync(inputPath);
  const originalSize = originalStat.size;

  const ext = path.extname(outputPath).toLowerCase();

  let pipeline = sharp(inputPath).resize(width, height, {
    fit: "contain",
    background: { r: 255, g: 255, b: 255, alpha: 1 },
    withoutEnlargement: true,
  });

  if (ext === ".webp") {
    pipeline = pipeline.webp({ quality: 82, effort: 6 });
  } else if (ext === ".jpg" || ext === ".jpeg") {
    pipeline = pipeline.jpeg({ quality: 82, progressive: true, mozjpeg: true });
  } else if (ext === ".png") {
    pipeline = pipeline.png({ quality: 82, compressionLevel: 9, effort: 10 });
  }

  await pipeline.toFile(outputPath);

  const optimizedStat = fs.statSync(outputPath);
  const optimizedSize = optimizedStat.size;

  return {
    file: path.basename(outputPath),
    originalSize,
    optimizedSize,
    format: ext,
    size: `${width}x${height}`,
  };
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}

async function processProduct(productDir: string): Promise<OptimizeResult[]> {
  const results: OptimizeResult[] = [];
  const files = fs.readdirSync(productDir).filter((f) => /\.(png|jpg|jpeg)$/i.test(f));

  for (const file of files) {
    const inputPath = path.join(productDir, file);
    const baseName = path.parse(file).name;

    for (const [sizeName, dims] of Object.entries(SIZES)) {
      const outputFilename = `${baseName}-${sizeName}.webp`;
      const outputPath = path.join(productDir, outputFilename);

      try {
        const result = await optimizeImage(inputPath, outputPath, dims.width, dims.height);
        results.push(result);
      } catch (err) {
        console.error(`  ❌ Erreur sur ${file} (${sizeName}):`, err);
      }
    }
  }

  return results;
}

async function main() {
  const targetProduct = process.argv[2];

  let productDirs: string[];
  if (targetProduct) {
    const dir = path.join(PRODUCTS_DIR, targetProduct);
    if (!fs.existsSync(dir)) {
      console.error(`❌ Dossier introuvable: ${targetProduct}`);
      process.exit(1);
    }
    productDirs = [dir];
  } else {
    productDirs = fs
      .readdirSync(PRODUCTS_DIR)
      .filter((d) => fs.statSync(path.join(PRODUCTS_DIR, d)).isDirectory())
      .map((d) => path.join(PRODUCTS_DIR, d));
  }

  let totalOriginal = 0;
  let totalOptimized = 0;

  for (const productDir of productDirs) {
    const productName = path.basename(productDir);
    console.log(`\n📦 ${productName}`);

    const results = await processProduct(productDir);

    for (const r of results) {
      const saved = r.originalSize - r.optimizedSize;
      const pct = ((saved / r.originalSize) * 100).toFixed(0);
      console.log(
        `   ✅ ${r.file} (${r.size}) — ${formatBytes(r.originalSize)} → ${formatBytes(r.optimizedSize)} (-${pct}%)`
      );
      totalOriginal += r.originalSize;
      totalOptimized += r.optimizedSize;
    }
  }

  const totalSaved = totalOriginal - totalOptimized;
  const totalPct = ((totalSaved / totalOriginal) * 100).toFixed(0);
  console.log(`\n📊 Total: ${formatBytes(totalOriginal)} → ${formatBytes(totalOptimized)} (économie: ${formatBytes(totalSaved)}, -${totalPct}%)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
