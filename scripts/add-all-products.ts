import { execSync } from "child_process";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const scripts = [
  "add-products-kueche.ts",
  "add-products-kaffee.ts",
  "add-products-aspirateurs.ts",
  "add-products-cuisson.ts",
  "add-products-waschen.ts",
  "add-products-froid.ts",
  "add-products-lave-vaisselle.ts",
  "add-products-klima.ts",
  "add-products-smarthome.ts",
];

console.log("🚀 Starting to add all products...\n");

for (const script of scripts) {
  const scriptPath = join(__dirname, script);
  console.log(`\n📦 Running ${script}...`);
  try {
    execSync(`npx tsx ${scriptPath}`, { stdio: "inherit" });
  } catch (error) {
    console.error(`❌ Error running ${script}:`, error);
  }
}

console.log("\n🎉 All product scripts completed!");
