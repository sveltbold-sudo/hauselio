import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface ProductData {
  name: string;
  slug: string;
  description: string;
  shortDesc: string;
  price: number;
  originalPrice?: number;
  sku: string;
  inStock: boolean;
  isFeatured?: boolean;
  isNew?: boolean;
  isPromo?: boolean;
  rating: number;
  reviewCount: number;
  categorySlug: string;
  brandSlug: string;
  weight?: number;
  features?: string[];
  tags?: string[];
  seoTitle?: string;
  seoDesc?: string;
  specs: { key: string; value: string }[];
}

const products: ProductData[] = [
  {
    name: "Liebherr Premium Comfort Kgn 36Vi3",
    slug: "liebherr-premium-comfort-kgn36vi3",
    description: "Der Liebherr Premium Comfort Kühlschrank mit BioFresh und NoFrost.",
    shortDesc: "Premium Kühlschrank mit BioFresh & NoFrost",
    price: 1499.0, sku: "LB-KGN36VI3", inStock: true, isFeatured: true,
    rating: 4.8, reviewCount: 134, categorySlug: "froid", brandSlug: "liebherr", weight: 93,
    features: ["BioFresh", "NoFrost", "MagicEye", "SuperCool"],
    tags: ["premium", "energieeffizient"],
    specs: [
      { key: "Nutzvolumen", value: "362 Liter" }, { key: "Energieeffizienz", value: "A+++" },
    ],
  },
  {
    name: "Liebherr Mono SGNe 5226 Gefrierschrank",
    slug: "liebherr-mono-sgne5226",
    description: "Der Liebherr Mono Gefrierschrank mit NoFrost und SmartFrost.",
    shortDesc: "Gefrierschrank mit NoFrost & SmartFrost",
    price: 1299.0, sku: "LB-SGNE5226", inStock: true,
    rating: 4.7, reviewCount: 89, categorySlug: "froid", brandSlug: "liebherr", weight: 85,
    features: ["NoFrost", "SmartFrost", "VarioSpace"],
    specs: [
      { key: "Nutzvolumen", value: "382 Liter" }, { key: "Energieeffizienz", value: "A+++" },
    ],
  },
  {
    name: "Liebherr Monokühlschrank KBes 3660",
    slug: "liebherr-monokuhlschrank-kbes3660",
    description: "Der Liebherr Monokühlschrank KBes 3660 - kompakter Einbaukühlschrank.",
    shortDesc: "Kompakter Einbaukühlschrank",
    price: 899.0, sku: "LB-KBES3660", inStock: true,
    rating: 4.6, reviewCount: 123, categorySlug: "froid", brandSlug: "liebherr", weight: 62,
    features: ["BioFresh", "NoFrost", "SlimLine"],
    specs: [
      { key: "Nutzvolumen", value: "342 Liter" }, { key: "Energieeffizienz", value: "A++" },
    ],
  },
  {
    name: "Liebherr Komfort Kcbnesf 3666",
    slug: "liebherr-komfort-kcbnesf3666",
    description: "Der Liebherr Komfort Kühlschrank mit BioFresh und NoFrost.",
    shortDesc: "Kühlschrank mit BioFresh & NoFrost",
    price: 1199.0, sku: "LB-KCBNESF3666", inStock: true,
    rating: 4.7, reviewCount: 156, categorySlug: "froid", brandSlug: "liebherr", weight: 88,
    features: ["BioFresh", "NoFrost", "SuperCool"],
    specs: [
      { key: "Nutzvolumen", value: "346 Liter" }, { key: "Energieeffizienz", value: "A+++" },
    ],
  },
  {
    name: "Samsung Family Hub RB38B7929S9",
    slug: "samsung-family-hub-rb38b7929s9",
    description: "Der Samsung Family Hub Kühlschrank mit 21,5 Zoll Touchscreen.",
    shortDesc: "Family Hub mit Touchscreen",
    price: 2199.0, sku: "SAM-RB38B", inStock: true,
    rating: 4.7, reviewCount: 89, categorySlug: "froid", brandSlug: "samsung", weight: 110,
    features: ["21,5\" Touchscreen", "SmartThings", "AI-Kamera"],
    tags: ["premium", "smart-home"],
    specs: [
      { key: "Nutzvolumen", value: "385 Liter" }, { key: "Display", value: "21,5 Zoll TFT" },
    ],
  },
  {
    name: "Samsung Bespoke LRFX28B3230S",
    slug: "samsung-bespoke-lrfx28b3230s",
    description: "Der Samsung Bespoke Kühlschrank mit wischer-Free-Design.",
    shortDesc: "Bespoke Kühlschrank mit wischer-Free-Design",
    price: 1299.0, sku: "SAM-LRFX28B", inStock: true, isNew: true,
    rating: 4.6, reviewCount: 123, categorySlug: "froid", brandSlug: "samsung", weight: 95,
    features: ["Bespoke Design", "Twin Cooling Plus", "Wi-Fi"],
    specs: [
      { key: "Nutzvolumen", value: "417 Liter" }, { key: "Energieeffizienz", value: "A+" },
    ],
  },
  {
    name: "Samsung Side-by-Side RS758711DQP",
    slug: "samsung-side-by-side-rs758711dqp",
    description: "Der Samsung Side-by-Side Kühlschrank mit Food Showcase.",
    shortDesc: "Side-by-Side mit Food Showcase",
    price: 1699.0, sku: "SAM-RS758", inStock: true,
    rating: 4.7, reviewCount: 156, categorySlug: "froid", brandSlug: "samsung", weight: 120,
    features: ["Food Showcase", "Twin Cooling Plus", "Ice & Water"],
    specs: [
      { key: "Nutzvolumen", value: "612 Liter" }, { key: "Energieeffizienz", value: "A+" },
    ],
  },
  {
    name: "Samsung Gefrierschrank RZ32R743601",
    slug: "samsung-gefrierschrank-rz32r743601",
    description: "Der Samsung Gefrierschrank mit No Frost und Digital Inverter.",
    shortDesc: "Gefrierschrank mit No Frost",
    price: 899.0, sku: "SAM-RZ32R", inStock: true,
    rating: 4.5, reviewCount: 123, categorySlug: "froid", brandSlug: "samsung", weight: 75,
    features: ["No Frost", "Digital Inverter", "Power Freeze"],
    specs: [
      { key: "Nutzvolumen", value: "314 Liter" }, { key: "Energieeffizienz", value: "A+" },
    ],
  },
  {
    name: "Bosch Serie 6 Kühlschrank KGN36AW3A",
    slug: "bosch-serie6-kuhlschrank-kgn36aw3a",
    description: "Der Bosch Serie 6 Kühlschrank mit VitaFresh Pro und NoFrost.",
    shortDesc: "Kühlschrank mit VitaFresh Pro & NoFrost",
    price: 999.0, sku: "BSH-KGN36AW3A", inStock: true,
    rating: 4.7, reviewCount: 234, categorySlug: "froid", brandSlug: "bosch", weight: 80,
    features: ["VitaFresh Pro", "NoFrost", "Home Connect", "LED-Beleuchtung"],
    specs: [
      { key: "Nutzvolumen", value: "345 Liter" }, { key: "Energieeffizienz", value: "A+++" },
    ],
  },
  {
    name: "Bosch Serie 4 Einbau-Kühlschrank KIV83VSE0",
    slug: "bosch-serie4-einbau-kuhlschrank-kiv83vse0",
    description: "Der Bosch Serie 4 Einbau-Kühlschrank mit BioFresh.",
    shortDesc: "Einbau-Kühlschrank mit BioFresh",
    price: 799.0, sku: "BSH-KIV83VSE0", inStock: true,
    rating: 4.6, reviewCount: 189, categorySlug: "froid", brandSlug: "bosch", weight: 58,
    features: ["BioFresh", "LED-Beleuchtung", "SoftClose"],
    specs: [
      { key: "Nutzvolumen", value: "319 Liter" }, { key: "Energieeffizienz", value: "A++" },
    ],
  },
  {
    name: "Siemens iQ700 Kühlschrank KG39NXB60",
    slug: "siemens-iq700-kuhlschrank-kg39nxb60",
    description: "Der Siemens iQ700 Kühlschrank mit bigBox und home Connect.",
    shortDesc: "Premium-Kühlschrank mit bigBox",
    price: 1399.0, sku: "SI-KG39NXB60", inStock: true,
    rating: 4.8, reviewCount: 123, categorySlug: "froid", brandSlug: "siemens", weight: 90,
    features: ["bigBox", "home Connect", "Multi Airflow", "NoFrost"],
    tags: ["premium"],
    specs: [
      { key: "Nutzvolumen", value: "366 Liter" }, { key: "Energieeffizienz", value: "A+++" },
    ],
  },
  {
    name: "Siemens iQ500 Einbau-Kühlschrank KG39EADLA0",
    slug: "siemens-iq500-einbau-kuhlschrank-kg39eadla0",
    description: "Der Siemens iQ500 Einbau-Kühlschrank mit BioFresh.",
    shortDesc: "Einbau-Kühlschrank mit BioFresh",
    price: 899.0, sku: "SI-KG39EADLA0", inStock: true,
    rating: 4.6, reviewCount: 156, categorySlug: "froid", brandSlug: "siemens", weight: 60,
    features: ["BioFresh", "LED-Beleuchtung", "SoftClose"],
    specs: [
      { key: "Nutzvolumen", value: "346 Liter" }, { key: "Energieeffizienz", value: "A++" },
    ],
  },
  {
    name: "Miele Kühlschrank K 2801 SF Vi",
    slug: "miele-kuhlschrank-k2801sfvi",
    description: "Der Miele Kühlschrank K 2801 SF Vi - Einbaukühlschrank mit DynaCool.",
    shortDesc: "Einbaukühlschrank mit DynaCool",
    price: 1699.0, sku: "MIELE-K2801SF", inStock: true,
    rating: 4.8, reviewCount: 89, categorySlug: "froid", brandSlug: "miele", weight: 65,
    features: ["DynaCool", "PerfectFresh", "Miele@home"],
    tags: ["premium"],
    specs: [
      { key: "Nutzvolumen", value: "325 Liter" }, { key: "Energieeffizienz", value: "A+++" },
    ],
  },
  {
    name: "Miele MasterCool MCS 1301 W",
    slug: "miele-mastercool-mcs1301w",
    description: "Der Miele MasterCool Monokühlschrank mit DynaCool.",
    shortDesc: "Premium-Monokühlschrank mit DynaCool",
    price: 2499.0, sku: "MIELE-MCS1301W", inStock: true, isNew: true,
    rating: 4.9, reviewCount: 45, categorySlug: "froid", brandSlug: "miele", weight: 75,
    features: ["MasterCool", "DynaCool", "Miele@home", "PerfectFresh Pro"],
    tags: ["premium"],
    specs: [
      { key: "Nutzvolumen", value: "388 Liter" }, { key: "Energieeffizienz", value: "A+++" },
    ],
  },
  {
    name: "AEG RCB53426TX Kühlschrank",
    slug: "aeg-rcb53426tx-kuhlschrank",
    description: "Der AEG RCB53426TX Kühlschrank mit DynamicAir Technologie.",
    shortDesc: "Kühlschrank mit DynamicAir",
    price: 899.0, sku: "AEG-RCB53426TX", inStock: true,
    rating: 4.6, reviewCount: 189, categorySlug: "froid", brandSlug: "aeg", weight: 72,
    features: ["DynamicAir", "customflex", "LED-Beleuchtung"],
    specs: [
      { key: "Nutzvolumen", value: "344 Liter" }, { key: "Energieeffizienz", value: "A++" },
    ],
  },
  {
    name: "Electrolux LRB3643SW Kühlschrank",
    slug: "electrolux-lrb3643sw-kuhlschrank",
    description: "Der Electrolux LRB3643SW Kühlschrank mit TwinTech® und customflex.",
    shortDesc: "Kühlschrank mit TwinTech® & customflex",
    price: 799.0, sku: "ELEC-LRB3643SW", inStock: true,
    rating: 4.5, reviewCount: 234, categorySlug: "froid", brandSlug: "electrolux", weight: 68,
    features: ["TwinTech®", "customflex", "LED-Beleuchtung"],
    specs: [
      { key: "Nutzvolumen", value: "338 Liter" }, { key: "Energieeffizienz", value: "A+" },
    ],
  },
  {
    name: "Haier Monokühlschrank HB14G1AAAG",
    slug: "haier-monokuhlschrank-hb14g1aaag",
    description: "Das Haier Monokühlschrank mit Total No Frost.",
    shortDesc: "Monokühlschrank mit Total No Frost",
    price: 699.0, sku: "HAIER-HB14G", inStock: true,
    rating: 4.5, reviewCount: 345, categorySlug: "froid", brandSlug: "haier", weight: 70,
    features: ["Total No Frost", "Multi-Zone", "Fresher Booster"],
    specs: [
      { key: "Nutzvolumen", value: "383 Liter" }, { key: "Energieeffizienz", value: "A+" },
    ],
  },
  {
    name: "Haier Side-by-Side RS670N4AW1",
    slug: "haier-side-by-side-rs670n4aw1",
    description: "Das Haier Side-by-Side Kühlschrank mit Total No Frost.",
    shortDesc: "Side-by-Side mit Total No Frost",
    price: 1099.0, sku: "HAIER-RS670N", inStock: true,
    rating: 4.6, reviewCount: 189, categorySlug: "froid", brandSlug: "haier", weight: 105,
    features: ["Total No Frost", "Multi-Zone", "Fresher Booster"],
    specs: [
      { key: "Nutzvolumen", value: "606 Liter" }, { key: "Energieeffizienz", value: "A+" },
    ],
  },
  {
    name: "BEKO GNE 134620 X Kühlschrank",
    slug: "beko-gne-134620-x-kuhlschrank",
    description: "Das BEKO GNE 134620 X Side-by-Side mit No Frost.",
    shortDesc: "Side-by-Side mit No Frost",
    price: 699.0, sku: "BEKO-GNE134620", inStock: true,
    rating: 4.4, reviewCount: 345, categorySlug: "froid", brandSlug: "beko", weight: 95,
    features: ["No Frost", "NeoFrost", "ProSmart Inverter"],
    specs: [
      { key: "Nutzvolumen", value: "541 Liter" }, { key: "Energieeffizienz", value: "A+" },
    ],
  },
  {
    name: "BEKO RBST 140 K25 W Kühlschrank",
    slug: "beko-rbst140k25w-kuhlschrank",
    description: "Das BEKO RBST 140 K25 W kompakter Einbaukühlschrank.",
    shortDesc: "Kompakter Einbaukühlschrank",
    price: 399.0, sku: "BEKO-RBST140", inStock: true,
    rating: 4.3, reviewCount: 567, categorySlug: "froid", brandSlug: "beko", weight: 35,
    features: ["Active Fresh Blue Light", "LED-Beleuchtung"],
    specs: [
      { key: "Nutzvolumen", value: "138 Liter" }, { key: "Energieeffizienz", value: "A+" },
    ],
  },
  {
    name: "V-ZUG人参 Kühlschrank RQ 4601",
    slug: "vzug-rq4601-kuhlschrank",
    description: "Das V-ZUG Kühlschrank RQ 4601 - Schweizer Qualität.",
    shortDesc: "Schweizer Premium-Kühlschrank",
    price: 2999.0, sku: "VZUG-RQ4601", inStock: true, isNew: true,
    rating: 4.9, reviewCount: 34, categorySlug: "froid", brandSlug: "vzug", weight: 80,
    features: ["BioFresh", "NoFrost", "LED-Beleuchtung", "SoftClose"],
    tags: ["premium"],
    specs: [
      { key: "Nutzvolumen", value: "423 Liter" }, { key: "Energieeffizienz", value: "A+++" },
    ],
  },
  {
    name: "Liebherr Mono Kef 3566 Gefrierschrank",
    slug: "liebherr-mono-kef3566-gefrierschrank",
    description: "Der Liebherr Mono Kef 3566 Gefrierschrank mit NoFrost.",
    shortDesc: "Gefrierschrank mit NoFrost",
    price: 1099.0, sku: "LB-KEF3566", inStock: true,
    rating: 4.6, reviewCount: 89, categorySlug: "froid", brandSlug: "liebherr", weight: 72,
    features: ["NoFrost", "VarioSpace", "FrostSafe"],
    specs: [
      { key: "Nutzvolumen", value: "352 Liter" }, { key: "Energieeffizienz", value: "A++" },
    ],
  },
  {
    name: "Liebherr Komfort KBes 3660",
    slug: "liebherr-komfort-kbes3660",
    description: "Der Liebherr Komfort KBes 3660 - Einbaukühlschrank.",
    shortDesc: "Einbaukühlschrank mit BioFresh",
    price: 999.0, sku: "LB-KBES3660", inStock: true,
    rating: 4.7, reviewCount: 156, categorySlug: "froid", brandSlug: "liebherr", weight: 65,
    features: ["BioFresh", "NoFrost", "SoftSystem"],
    specs: [
      { key: "Nutzvolumen", value: "366 Liter" }, { key: "Energieeffizienz", value: "A+++" },
    ],
  },
  {
    name: "Samsung Bespoke French Door RF29A9675SR",
    slug: "samsung-bespoke-french-door-rf29a9675sr",
    description: "Der Samsung Bespoke French Door mit FlexZone™.",
    shortDesc: "Bespoke French Door mit FlexZone™",
    price: 2999.0, sku: "SAM-RF29A", inStock: true, isFeatured: true,
    rating: 4.8, reviewCount: 67, categorySlug: "froid", brandSlug: "samsung", weight: 130,
    features: ["Bespoke Design", "FlexZone™", "Twin Cooling Plus", "AI Energy Mode"],
    tags: ["premium"],
    specs: [
      { key: "Nutzvolumen", value: "662 Liter" }, { key: "Energieeffizienz", value: "A+" },
    ],
  },
  {
    name: "Samsung Kouj Tiefkühlschrank RT5000",
    slug: "samsung-tiefkuhlschrank-rt5000",
    description: "Der Samsung Tiefkühlschrank RT5000 mit Power Freeze.",
    shortDesc: "Tiefkühlschrank mit Power Freeze",
    price: 799.0, sku: "SAM-RT5000", inStock: true,
    rating: 4.5, reviewCount: 189, categorySlug: "froid", brandSlug: "samsung", weight: 80,
    features: ["Power Freeze", "No Frost", "Digital Inverter"],
    specs: [
      { key: "Nutzvolumen", value: "369 Liter" }, { key: "Energieeffizienz", value: "A+" },
    ],
  },
  {
    name: "Bosch Serie 4 Gefrierschrank GIN31AFE0P",
    slug: "bosch-serie4-gefrierschrank-gin31afe0p",
    description: "Der Bosch Serie 4 Einbau-Gefrierschrank mit NoFrost.",
    shortDesc: "Einbau-Gefrierschrank mit NoFrost",
    price: 899.0, sku: "BSH-GIN31AFE0P", inStock: true,
    rating: 4.6, reviewCount: 123, categorySlug: "froid", brandSlug: "bosch", weight: 55,
    features: ["NoFrost", "VarioDrawer", "LED-Beleuchtung"],
    specs: [
      { key: "Nutzvolumen", value: "258 Liter" }, { key: "Energieeffizienz", value: "A++" },
    ],
  },
  {
    name: "Siemens iQ500 Einbau-Tiefkühlschrank GI51NAE20",
    slug: "siemens-iq500-einbau-tiefkuhlschrank-gi51nae20",
    description: "Der Siemens iQ500 Einbau-Tiefkühlschrank mit NoFrost.",
    shortDesc: "Einbau-Tiefkühlschrank mit NoFrost",
    price: 999.0, sku: "SI-GI51NAE20", inStock: true,
    rating: 4.6, reviewCount: 89, categorySlug: "froid", brandSlug: "siemens", weight: 58,
    features: ["NoFrost", "VarioDrawer", "LED-Beleuchtung"],
    specs: [
      { key: "Nutzvolumen", value: "274 Liter" }, { key: "Energieeffizienz", value: "A++" },
    ],
  },
  {
    name: "AEG RBS 36426TX Kühlschrank",
    slug: "aeg-rbs-36426tx-kuhlschrank",
    description: "Der AEG RBS 36426TX Kühlschrank mit Multi Flow.",
    shortDesc: "Kühlschrank mit Multi Flow",
    price: 799.0, sku: "AEG-RBS36426TX", inStock: true,
    rating: 4.5, reviewCount: 189, categorySlug: "froid", brandSlug: "aeg", weight: 70,
    features: ["Multi Flow", "customflex", "LED-Beleuchtung"],
    specs: [
      { key: "Nutzvolumen", value: "344 Liter" }, { key: "Energieeffizienz", value: "A++" },
    ],
  },
];

async function main() {
  console.log("❄️ Adding Froid products...");

  const categoryMap: Record<string, string> = {};
  const categories = await prisma.category.findMany({ select: { id: true, slug: true } });
  categories.forEach(c => { categoryMap[c.slug] = c.id; });

  const brandMap: Record<string, string> = {};
  const brands = await prisma.brand.findMany({ select: { id: true, slug: true } });
  brands.forEach(b => { brandMap[b.slug] = b.id; });

  let added = 0;
  for (const product of products) {
    const existing = await prisma.product.findUnique({ where: { slug: product.slug } });
    if (existing) {
      console.log(`⏭️  Skipping ${product.name} (already exists)`);
      continue;
    }

    const { categorySlug, brandSlug, specs, features, tags, ...productData } = product;
    try {
      await prisma.product.create({
        data: {
          ...productData,
          categoryId: categoryMap[categorySlug]!,
          brandId: brandMap[brandSlug]!,
          features: features || [],
          tags: tags || [],
        },
      });
      added++;
      console.log(`✅ Added: ${product.name}`);
    } catch (e: any) {
      if (e?.code === "P2002") {
        console.log(`⏭️  Skipping ${product.name} (duplicate SKU: ${product.sku})`);
      } else {
        throw e;
      }
    }
  }

  console.log(`\n🎉 Done! Added ${added} new products to Froid`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
