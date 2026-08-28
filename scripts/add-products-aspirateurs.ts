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
    name: "Dyson V12 Detect Slim",
    slug: "dyson-v12-detect-slim",
    description: "Der Dyson V12 Detect Slim - leichter kabelloser Staubsauger mit Laser.",
    shortDesc: "Leichter kabelloser Sauger mit Laser",
    price: 549.0, sku: "DY-V12-SLIM", inStock: true,
    rating: 4.7, reviewCount: 234, categorySlug: "aspirateurs", brandSlug: "dyson", weight: 2.2,
    features: ["Grüne Laserdiode", "Piezo-Sensor", "LCD-Display", "40 Min. Laufzeit"],
    specs: [
      { key: "Laufzeit", value: "bis zu 40 Minuten" }, { key: "Saugleistung", value: "150 AW" },
    ],
  },
  {
    name: "Dyson V8 Absolute",
    slug: "dyson-v8-absolute",
    description: "Der Dyson V8 Absolute - kabelloser Staubsauger für alle Böden.",
    shortDesc: "Kabelloser Sauger für alle Böden",
    price: 399.0, originalPrice: 449.0, sku: "DY-V8-ABS", inStock: true, isPromo: true,
    rating: 4.6, reviewCount: 567, categorySlug: "aspirateurs", brandSlug: "dyson", weight: 2.6,
    features: ["40 Min. Laufzeit", "Direktantrieb", "2-in-1"],
    specs: [
      { key: "Laufzeit", value: "bis zu 40 Minuten" }, { key: "Saugleistung", value: "151 AW" },
    ],
  },
  {
    name: "Roborock S8 MaxV Ultra",
    slug: "roborock-s8-maxv-ultra",
    description: "Der Roborock S8 MaxV Ultra - Premium-Saugroboter mitallen Features.",
    shortDesc: "Premium-Saugroboter mitallen Features",
    price: 1299.0, sku: "ROB-S8MAXV", inStock: true, isNew: true, isFeatured: true,
    rating: 4.8, reviewCount: 123, categorySlug: "aspirateurs", brandSlug: "roborock", weight: 4.0,
    features: ["LiDAR-Navigation", "Saugen & Wischen", "Auto-Entleerung", "Heißwasser-Wischen"],
    tags: ["premium", "bestseller"],
    specs: [
      { key: "Saugleistung", value: "10000 Pa" }, { key: "Akku", value: "5200 mAh" },
    ],
  },
  {
    name: "Roborock Q8 Max+",
    slug: "roborock-q8-max-plus",
    description: "Der Roborock Q8 Max+ - Saugroboter mit Auto-Entleerung und Wischfunktion.",
    shortDesc: "Saugroboter mit Auto-Entleerung",
    price: 599.0, sku: "ROB-Q8MAX+", inStock: true,
    rating: 4.7, reviewCount: 345, categorySlug: "aspirateurs", brandSlug: "roborock", weight: 3.5,
    features: ["LiDAR", "Auto-Entleerung", "Saugen & Wischen"],
    specs: [
      { key: "Saugleistung", value: "5500 Pa" }, { key: "Laufzeit", value: "180 Min." },
    ],
  },
  {
    name: "iRobot Roomba j9+",
    slug: "irobot-roomba-j9-plus",
    description: "Der iRobot Roomba j9+ - intelligenter Saugroboter mit Auto-Evac.",
    shortDesc: "Intelligenter Saugroboter mit Auto-Evac",
    price: 899.0, sku: "IR-J9PLUS", inStock: true, isNew: true,
    rating: 4.7, reviewCount: 156, categorySlug: "aspirateurs", brandSlug: "irobot", weight: 3.5,
    features: ["PrecisionVision", "Auto-Entsorgung", "3-Stufen-Reinigung", "Saugen & Wischen"],
    specs: [
      { key: "Laufzeit", value: "bis zu 75 Minuten" }, { key: "Navigation", value: "PrecisionVision" },
    ],
  },
  {
    name: "iRobot Roomba Combo j5+",
    slug: "irobot-roomba-combo-j5-plus",
    description: "Der iRobot Roomba Combo j5+ - Saug- und Wischroboter in einem.",
    shortDesc: "Saug- und Wischroboter in einem",
    price: 699.0, sku: "IR-COMBOJ5+", inStock: true,
    rating: 4.6, reviewCount: 234, categorySlug: "aspirateurs", brandSlug: "irobot", weight: 3.2,
    features: ["Saugen & Wischen", "Auto-Entsorgung", "PrecisionVision"],
    specs: [
      { key: "Laufzeit", value: "bis zu 75 Minuten" }, { key: "Navigation", value: "PrecisionVision" },
    ],
  },
  {
    name: "Xiaomi Robot Vacuum X10+",
    slug: "xiaomi-robot-vacuum-x10-plus",
    description: "Der Xiaomi Robot Vacuum X10+ - Saugroboter mit Auto-Entleerung.",
    shortDesc: "Saugroboter mit Auto-Entleerung",
    price: 499.0, sku: "MI-X10+", inStock: true,
    rating: 4.6, reviewCount: 567, categorySlug: "aspirateurs", brandSlug: "xiaomi", weight: 3.8,
    features: ["LiDAR", "Auto-Entleerung", "Saugen & Wischen", "4000 Pa"],
    specs: [
      { key: "Saugleistung", value: "4000 Pa" }, { key: "Laufzeit", value: "120 Min." },
    ],
  },
  {
    name: "Xiaomi Roborock Pro",
    slug: "xiaomi-roborock-pro",
    description: "Der Xiaomi Roborock Pro - kompakter Saugroboter mit LDS-Navigation.",
    shortDesc: "Kompakter Saugroboter mit LDS",
    price: 299.0, sku: "MI-RBPRO", inStock: true,
    rating: 4.5, reviewCount: 892, categorySlug: "aspirateurs", brandSlug: "xiaomi", weight: 3.0,
    features: ["LDS-Navigation", "Saugen & Wischen", "App-Steuerung"],
    specs: [
      { key: "Saugleistung", value: "2500 Pa" }, { key: "Laufzeit", value: "150 Min." },
    ],
  },
  {
    name: "Samsung Jet Bot AI+ VR50T9990",
    slug: "samsung-jet-bot-ai-plus-vr50t9990",
    description: "Der Samsung Jet Bot AI+ - intelligenter Saugroboter mit KI-Erkennung.",
    shortDesc: "Intelligenter Saugroboter mit KI",
    price: 999.0, sku: "SAM-JETAI+", inStock: true, isNew: true,
    rating: 4.7, reviewCount: 189, categorySlug: "aspirateurs", brandSlug: "samsung", weight: 4.0,
    features: ["KI-3D-Erkennung", "Auto-Entleerung", "SmartThings"],
    specs: [
      { key: "Saugleistung", value: "3000 Pa" }, { key: "Navigation", value: "LiDAR + 3D" },
    ],
  },
  {
    name: "LG CordZero A9 Kompressor",
    slug: "lg-cordzero-a9-kompressor",
    description: "Der LG CordZero A9 Kompressor - kabelloser Staubsauger mit Kompressor-Technologie.",
    shortDesc: "Kabelloser Sauger mit Kompressor",
    price: 699.0, sku: "LG-A9K", inStock: true,
    rating: 4.7, reviewCount: 234, categorySlug: "aspirateurs", brandSlug: "lg", weight: 2.8,
    features: ["Kompressor-Technologie", "50 Min. Laufzeit", "2-in-1"],
    specs: [
      { key: "Laufzeit", value: "bis zu 50 Minuten" }, { key: "Saugleistung", value: "140 AW" },
    ],
  },
  {
    name: "LG CordZero ThinQ R9 ThinQ",
    slug: "lg-cordzero-thinq-r9",
    description: "Der LG CordZero ThinQ R9 - Premium-Saugroboter mit KI-Navigation.",
    shortDesc: "Premium-Saugroboter mit KI",
    price: 1199.0, sku: "LG-R9TQ", inStock: true,
    rating: 4.8, reviewCount: 123, categorySlug: "aspirateurs", brandSlug: "lg", weight: 4.2,
    features: ["KI-Navigation", "Auto-Entleerung", "Wischen"],
    tags: ["premium"],
    specs: [
      { key: "Saugleistung", value: "2500 Pa" }, { key: "Navigation", value: "LiDAR + KI" },
    ],
  },
  {
    name: "Kärcher VC 5 Cordless",
    slug: "kaercher-vc5-cordless",
    description: "Der Kärcher VC 5 Cordless - kabelloser Handstaubsauger.",
    shortDesc: "Kabelloser Handstaubsauger",
    price: 199.0, sku: "KA-VC5C", inStock: true,
    rating: 4.4, reviewCount: 456, categorySlug: "aspirateurs", brandSlug: "kaercher", weight: 1.5,
    features: ["20 Min. Laufzeit", "Kompakt", "Wechselbürste"],
    specs: [
      { key: "Laufzeit", value: "bis zu 20 Minuten" }, { key: "Gewicht", value: "1,5 kg" },
    ],
  },
  {
    name: "Kärcher VC 3 Cordless",
    slug: "kaercher-vc3-cordless",
    description: "Der Kärcher VC 3 Cordless - kabelloser Sauger mit Akku.",
    shortDesc: "Kabelloser Sauger mit Akku",
    price: 149.0, sku: "KA-VC3C", inStock: true,
    rating: 4.3, reviewCount: 678, categorySlug: "aspirateurs", brandSlug: "kaercher", weight: 1.8,
    features: ["30 Min. Laufzeit", "Kompakt", "HEPA-Filter"],
    specs: [
      { key: "Laufzeit", value: "bis zu 30 Minuten" }, { key: "Gewicht", value: "1,8 kg" },
    ],
  },
  {
    name: "Miele Triflex HX2 Pro",
    slug: "miele-triflex-hx2-pro",
    description: "Der Miele Triflex HX2 Pro - Premium-kabelloser Staubsauger.",
    shortDesc: "Premium-kabelloser Sauger mit PowerUnit",
    price: 899.0, sku: "MIELE-HX2PRO", inStock: true, isFeatured: true,
    rating: 4.8, reviewCount: 156, categorySlug: "aspirateurs", brandSlug: "miele", weight: 3.5,
    features: ["PowerUnit", "3-in-1", "60 Min. Laufzeit", "HEPA AirClean"],
    tags: ["premium"],
    specs: [
      { key: "Laufzeit", value: "bis zu 60 Minuten" }, { key: "Saugleistung", value: "170 AW" },
    ],
  },
  {
    name: "Miele Scout RX3 Home Vision",
    slug: "miele-scout-rx3-home-vision",
    description: "Der Miele Scout RX3 Home Vision - Saugroboter mit HD-Kamera.",
    shortDesc: "Saugroboter mit HD-Kamera",
    price: 899.0, sku: "MIELE-RX3", inStock: true,
    rating: 4.6, reviewCount: 123, categorySlug: "aspirateurs", brandSlug: "miele", weight: 3.5,
    features: ["HD-Kamera", "3D-Navigation", "Saugen & Wischen"],
    specs: [
      { key: "Saugleistung", value: "2000 Pa" }, { key: "Laufzeit", value: "120 Min." },
    ],
  },
  {
    name: "Philips 8000 Series LED",
    slug: "philips-8000-series-led",
    description: "Der Philips 8000 Series LED - kabelloser Staubsauger mit PowerBlade.",
    shortDesc: "Kabelloser Sauger mit PowerBlade",
    price: 499.0, sku: "PH-8000LED", inStock: true,
    rating: 4.6, reviewCount: 345, categorySlug: "aspirateurs", brandSlug: "philips", weight: 3.0,
    features: ["PowerBlade", "180° Bürste", "60 Min. Laufzeit"],
    specs: [
      { key: "Laufzeit", value: "bis zu 60 Minuten" }, { key: "Saugleistung", value: "150 AW" },
    ],
  },
  {
    name: "Philips PowerProActive",
    slug: "philips-powerproactive",
    description: "Der Philips PowerProActive - kabelloser Staubsauger mit TriActive+.",
    shortDesc: "Kabelloser Sauger mit TriActive+",
    price: 299.0, sku: "PH-PPA", inStock: true,
    rating: 4.5, reviewCount: 567, categorySlug: "aspirateurs", brandSlug: "philips", weight: 3.2,
    features: ["TriActive+", "180° Saugmulde", "40 Min. Laufzeit"],
    specs: [
      { key: "Laufzeit", value: "bis zu 40 Minuten" }, { key: "Gewicht", value: "3,2 kg" },
    ],
  },
  {
    name: "Electrolux 800 AnimalCare",
    slug: "electrolux-800-animalcare",
    description: "Der Electrolux 800 AnimalCare - kabelloser Staubsauger für Tierhalter.",
    shortDesc: "Kabelloser Sauger für Tierhalter",
    price: 449.0, sku: "ELEC-800AC", inStock: true,
    rating: 4.6, reviewCount: 234, categorySlug: "aspirateurs", brandSlug: "electrolux", weight: 3.1,
    features: ["AnimalCare Bürste", "HEPA 13", "50 Min. Laufzeit"],
    specs: [
      { key: "Laufzeit", value: "bis zu 50 Minuten" }, { key: "Filter", value: "HEPA 13" },
    ],
  },
  {
    name: "AEG WELL Q7 Animal",
    slug: "aeg-well-q7-animal",
    description: "Der AEG WELL Q7 Animal - kabelloser Staubsauger für Tierhalter.",
    shortDesc: "Kabelloser Sauger für Tierhalter",
    price: 399.0, sku: "AEG-Q7A", inStock: true,
    rating: 4.5, reviewCount: 345, categorySlug: "aspirateurs", brandSlug: "aeg", weight: 3.0,
    features: ["AnimalCare", "PowerBrush", "45 Min. Laufzeit"],
    specs: [
      { key: "Laufzeit", value: "bis zu 45 Minuten" }, { key: "Gewicht", value: "3,0 kg" },
    ],
  },
  {
    name: "Bosch Unlimited Serie 8 BSS81POB",
    slug: "bosch-unlimited-serie8-bss81pob",
    description: "Der Bosch Unlimited Serie 8 - Premium-kabelloser Staubsauger.",
    shortDesc: "Premium-kabelloser Sauger mit AllFloor HighPower",
    price: 599.0, sku: "BSH-BSS81POB", inStock: true,
    rating: 4.7, reviewCount: 189, categorySlug: "aspirateurs", brandSlug: "bosch", weight: 3.0,
    features: ["AllFloor HighPower", "40 Min. Laufzeit", "QuickStand"],
    specs: [
      { key: "Laufzeit", value: "bis zu 40 Minuten" }, { key: "Saugleistung", value: "130 AW" },
    ],
  },
  {
    name: "Bosch Serie 6 BBH3D122",
    slug: "bosch-serie6-bbh3d122",
    description: "Der Bosch Serie 6 BBH3D122 - kabelloser Staubsauger mit intelligentem Display.",
    shortDesc: "Kabelloser Sauger mit Display",
    price: 399.0, sku: "BSH-BBH3D122", inStock: true,
    rating: 4.6, reviewCount: 234, categorySlug: "aspirateurs", brandSlug: "bosch", weight: 3.2,
    features: ["Smart Display", "AllFloor HighPower", "3-in-1"],
    specs: [
      { key: "Laufzeit", value: "bis zu 45 Minuten" }, { key: "Gewicht", value: "3,2 kg" },
    ],
  },
  {
    name: "Siemens RS5 Pro Lieferbar",
    slug: "siemens-rs5-pro",
    description: "Der Siemens RS5 Pro - kabelloser Staubsauger mit Power for All.",
    shortDesc: "Kabelloser Sauger mit Power for All",
    price: 449.0, sku: "SI-RS5PRO", inStock: true,
    rating: 4.5, reviewCount: 189, categorySlug: "aspirateurs", brandSlug: "siemens", weight: 3.0,
    features: ["Power for All", "AllFloor", "40 Min. Laufzeit"],
    specs: [
      { key: "Laufzeit", value: "bis zu 40 Minuten" }, { key: "Saugleistung", value: "130 AW" },
    ],
  },
  {
    name: "Samsung Bespoke Jet™ Complete",
    slug: "samsung-bespoke-jet-complete",
    description: "Der Samsung Bespoke Jet™ Complete - kabelloser Sauger mit elegantem Design.",
    shortDesc: "Kabelloser Sauger mit elegantem Design",
    price: 699.0, sku: "SAM-BJET", inStock: true, isNew: true,
    rating: 4.7, reviewCount: 156, categorySlug: "aspirateurs", brandSlug: "samsung", weight: 2.7,
    features: ["210 AW", "60 Min. Laufzeit", "All-in-One Station"],
    tags: ["premium"],
    specs: [
      { key: "Saugleistung", value: "210 AW" }, { key: "Laufzeit", value: "bis zu 60 Minuten" },
    ],
  },
  {
    name: "Vorwerk Kobold VK200 Plus",
    slug: "vorwerk-kobold-vk200-plus",
    description: "Der Vorwerk Kobold VK200 Plus - Premium-Staubsauger mit Smart-Motor.",
    shortDesc: "Premium-Staubsauger mit Smart-Motor",
    price: 1499.0, sku: "VW-VK200P", inStock: true, isNew: true,
    rating: 4.8, reviewCount: 89, categorySlug: "aspirateurs", brandSlug: "vorwerk", weight: 7.8,
    features: ["Smart-Motor", "HEPA", "Trocken- und Nassreinigung"],
    tags: ["premium"],
    specs: [
      { key: "Saugleistung", value: "350 Watt" }, { key: "Gewicht", value: "7,8 kg" },
    ],
  },
  {
    name: "Ninja Detect Duo Cordless",
    slug: "ninja-detect-duo-cordless",
    description: "Der Ninja Detect Duo Cordless - kabelloser Sauger mit Auto-Technologie.",
    shortDesc: "Kabelloser Sauger mit Auto-Technologie",
    price: 349.0, sku: "NINJA-DETDOUO", inStock: true, isNew: true,
    rating: 4.5, reviewCount: 123, categorySlug: "aspirateurs", brandSlug: "ninja", weight: 3.0,
    features: ["Auto-Technologie", "60 Min. Laufzeit", "LED-Bürste"],
    specs: [
      { key: "Laufzeit", value: "bis zu 60 Minuten" }, { key: "Saugleistung", value: "120 AW" },
    ],
  },
];

async function main() {
  console.log("🧹 Adding Aspirateurs products...");

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
  }

  console.log(`\n🎉 Done! Added ${added} new products to Aspirateurs`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
