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
    name: "Dyson Purifier Hot+Cool HP07",
    slug: "dyson-purifier-hotcool-hp07",
    description: "Der Dyson Purifier Hot+Cool HP07 - Luftreiniger und Heizstrahler/Ventilator.",
    shortDesc: "Luftreiniger, Heizstrahler & Ventilator",
    price: 599.0, originalPrice: 649.0, sku: "DY-HP07", inStock: true, isPromo: true,
    rating: 4.7, reviewCount: 345, categorySlug: "klima-luft", brandSlug: "dyson",
    features: ["HEPA H13", "Formaldehyd-Katalysator", "Air Multiplier", "Wi-Fi"],
    specs: [
      { key: "Filter", value: "HEPA H13 + Aktivkohle" }, { key: "Raumgröße", value: "bis 40 m²" },
    ],
  },
  {
    name: "Dyson Purifier Humidify+Cool PH01",
    slug: "dyson-purifier-humidifycool-ph01",
    description: "Der Dyson Purifier Humidify+Cool PH01 - Luftreiniger und Luftbefeuchter.",
    shortDesc: "Luftreiniger & Luftbefeuchter",
    price: 799.0, sku: "DY-PH01", inStock: true,
    rating: 4.7, reviewCount: 189, categorySlug: "klima-luft", brandSlug: "dyson",
    features: ["HEPA H13", "Luftbefeuchtung", "Air Multiplier", "UV-C"],
    specs: [
      { key: "Filter", value: "HEPA H13" }, { key: "Raumgröße", value: "bis 50 m²" },
    ],
  },
  {
    name: "Dyson Pure Cool TP07",
    slug: "dyson-pure-cool-tp07",
    description: "Der Dyson Pure Cool TP07 - Luftreiniger und Ventilator.",
    shortDesc: "Luftreiniger & Ventilator",
    price: 399.0, sku: "DY-TP07", inStock: true,
    rating: 4.6, reviewCount: 456, categorySlug: "klima-luft", brandSlug: "dyson",
    features: ["HEPA H13", "Air Multiplier", "350° Oscillation", "Wi-Fi"],
    specs: [
      { key: "Filter", value: "HEPA H13" }, { key: "Raumgröße", value: "bis 35 m²" },
    ],
  },
  {
    name: "Stadler Form Oskar",
    slug: "stadler-form-oskar",
    description: "Der Stadler Form Oskar - eleganter Luftbefeuchter.",
    shortDesc: "Eleganter Luftbefeuchter",
    price: 149.0, sku: "SF-OSKAR", inStock: true,
    rating: 4.4, reviewCount: 345, categorySlug: "klima-luft", brandSlug: "stadler-form",
    features: ["2 Befeuchtungsstufen", "Hygiene-Funktion", "Automatische Regelung"],
    specs: [
      { key: "Raumgröße", value: "bis 50 m²" }, { key: "Wasserkapazität", value: "3,5 Liter" },
    ],
  },
  {
    name: "Stadler Form Oskar Little",
    slug: "stadler-form-oskar-little",
    description: "Der Stadler Form Oskar Little - kompakter Luftbefeuchter.",
    shortDesc: "Kompakter Luftbefeuchter",
    price: 99.0, sku: "SF-OSKAR-LITTLE", inStock: true,
    rating: 4.3, reviewCount: 567, categorySlug: "klima-luft", brandSlug: "stadler-form",
    features: ["Kompakt", "1 Befeuchtungsstufe", "Hygiene-Funktion"],
    specs: [
      { key: "Raumgröße", value: "bis 30 m²" }, { key: "Wasserkapazität", value: "2 Liter" },
    ],
  },
  {
    name: "Stadler Form Viktor",
    slug: "stadler-form-viktor",
    description: "Der Stadler Form Viktor - Luftreiniger mit HEPA H13.",
    shortDesc: "Luftreiniger mit HEPA H13",
    price: 249.0, sku: "SF-VIKTOR", inStock: true,
    rating: 4.5, reviewCount: 234, categorySlug: "klima-luft", brandSlug: "stadler-form",
    features: ["HEPA H13", "3 Stufen", "Leise"],
    specs: [
      { key: "Filter", value: "HEPA H13" }, { key: "Raumgröße", value: "bis 40 m²" },
    ],
  },
  {
    name: "Blueair Blue 3410",
    slug: "blueair-blue-3410",
    description: "Der Blueair Blue 3410 - Luftreiniger mit HEPASilent.",
    shortDesc: "Luftreiniger mit HEPASilent",
    price: 249.0, sku: "BLUE-3410", inStock: true,
    rating: 4.5, reviewCount: 234, categorySlug: "klima-luft", brandSlug: "blueair",
    features: ["HEPASilent", "One-Touch", "3 Geschwindigkeiten"],
    specs: [
      { key: "Raumgröße", value: "bis 30 m²" }, { key: "Filter", value: "HEPASilent" },
    ],
  },
  {
    name: "Blueair Classic 480i",
    slug: "blueair-classic-480i",
    description: "Der Blueair Classic 480i - großer Luftreiniger mit WLAN.",
    shortDesc: "Großer Luftreiniger mit WLAN",
    price: 549.0, sku: "BLUE-480I", inStock: true,
    rating: 4.6, reviewCount: 189, categorySlug: "klima-luft", brandSlug: "blueair",
    features: ["HEPASilent", "WLAN", "App-Steuerung", "Luftqualitäts-Sensor"],
    specs: [
      { key: "Raumgröße", value: "bis 60 m²" }, { key: "Filter", value: "HEPASilent" },
    ],
  },
  {
    name: "Blueair Health Protect 7440i",
    slug: "blueair-health-protect-7440i",
    description: "Der Blueair Health Protect 7440i - Premium-Luftreiniger mit GermShield.",
    shortDesc: "Premium-Luftreiniger mit GermShield",
    price: 799.0, sku: "BLUE-7440I", inStock: true, isNew: true, isFeatured: true,
    rating: 4.8, reviewCount: 89, categorySlug: "klima-luft", brandSlug: "blueair",
    features: ["GermShield", "HEPASilent Ultra", "Air Quality Sensor", "Wi-Fi"],
    tags: ["premium"],
    specs: [
      { key: "Raumgröße", value: "bis 70 m²" }, { key: "Filter", value: "HEPASilent Ultra" },
    ],
  },
  {
    name: "Levoit Core 300",
    slug: "levoit-core-300",
    description: "Der Levoit Core 300 - kompakter Luftreiniger mit HEPA.",
    shortDesc: "Kompakter Luftreiniger mit HEPA",
    price: 99.0, sku: "LEVOIT-C300", inStock: true,
    rating: 4.6, reviewCount: 1234, categorySlug: "klima-luft", brandSlug: "levoit",
    features: ["3-Stufen HEPA", "Leise (24dB)", "Timer", "1-4-8h"],
    specs: [
      { key: "Raumgröße", value: "bis 21 m²" }, { key: "Geräuschpegel", value: "24 dB(A)" },
    ],
  },
  {
    name: "Levoit Core 400S",
    slug: "levoit-core-400s",
    description: "Der Levoit Core 400S - smarter Luftreiniger mit App-Steuerung.",
    shortDesc: "Smarter Luftreiniger mit App",
    price: 199.0, sku: "LEVOIT-C400S", inStock: true,
    rating: 4.7, reviewCount: 567, categorySlug: "klima-luft", brandSlug: "levoit",
    features: ["HEPA H13", "App-Steuerung", "Alexa", "Luftqualitäts-Sensor"],
    specs: [
      { key: "Raumgröße", value: "bis 40 m²" }, { key: "Filter", value: "HEPA H13" },
    ],
  },
  {
    name: "Levoit LV600S Hybrid",
    slug: "levoit-lv600s-hybrid",
    description: "Der Levoit LV600S Hybrid - Luftreiniger und Luftbefeuchter.",
    shortDesc: "Luftreiniger & Luftbefeuchter",
    price: 299.0, sku: "LEVOIT-LV600S", inStock: true,
    rating: 4.7, reviewCount: 234, categorySlug: "klima-luft", brandSlug: "levoit",
    features: ["HEPA H13", "Luftbefeuchtung", "App-Steuerung", "Dual-Modus"],
    specs: [
      { key: "Raumgröße", value: "bis 60 m²" }, { key: "Wasserkapazität", value: "6 Liter" },
    ],
  },
  {
    name: "Trotec PAC 3200 E",
    slug: "trotec-pac-3200-e",
    description: "Das Trotec PAC 3200 E - mobile Klimaanlage.",
    shortDesc: "Mobile Klimaanlage",
    price: 449.0, sku: "TROTEC-PAC3200E", inStock: true,
    rating: 4.5, reviewCount: 456, categorySlug: "klima-luft", brandSlug: "trotec",
    features: ["3-in-1", "12.000 BTU", "Entfeuchtung", "Timer"],
    specs: [
      { key: "Kühlleistung", value: "12.000 BTU" }, { key: "Raumgröße", value: "bis 40 m²" },
    ],
  },
  {
    name: "Trotec PAC 3900 E",
    slug: "trotec-pac-3900-e",
    description: "Das Trotec PAC 3900 E - leistungsstarke mobile Klimaanlage.",
    shortDesc: "Leistungsstarke mobile Klimaanlage",
    price: 599.0, sku: "TROTEC-PAC3900E", inStock: true,
    rating: 4.6, reviewCount: 234, categorySlug: "klima-luft", brandSlug: "trotec",
    features: ["3-in-1", "14.000 BTU", "Luftentfeuchtung", "App-Steuerung"],
    specs: [
      { key: "Kühlleistung", value: "14.000 BTU" }, { key: "Raumgröße", value: "bis 50 m²" },
    ],
  },
  {
    name: "Comfee MPPH-07CRN7",
    slug: "comfee-mpph-07crn7",
    description: "Das Comfee MPPH-07CRN7 - mobile Klimaanlage für kleine Räume.",
    shortDesc: "Mobile Klimaanlage für kleine Räume",
    price: 299.0, sku: "COMFEE-MPPH07", inStock: true,
    rating: 4.4, reviewCount: 567, categorySlug: "klima-luft", brandSlug: "comfee",
    features: ["2-in-1", "7.000 BTU", "Timer", "Leise"],
    specs: [
      { key: "Kühlleistung", value: "7.000 BTU" }, { key: "Raumgröße", value: "bis 25 m²" },
    ],
  },
  {
    name: "Comfee MPPH-12CRN7",
    slug: "comfee-mpph-12crn7",
    description: "Das Comfee MPPH-12CRN7 - mobile Klimaanlage für mittlere Räume.",
    shortDesc: "Mobile Klimaanlage für mittlere Räume",
    price: 399.0, sku: "COMFEE-MPPH12", inStock: true,
    rating: 4.5, reviewCount: 345, categorySlug: "klima-luft", brandSlug: "comfee",
    features: ["3-in-1", "12.000 BTU", "Entfeuchtung", "Timer"],
    specs: [
      { key: "Kühlleistung", value: "12.000 BTU" }, { key: "Raumgröße", value: "bis 40 m²" },
    ],
  },
  {
    name: "Sichler PAC-WK-10",
    slug: "sichler-pac-wk-10",
    description: "Das Sichler PAC-WK-10 - mobile Klimaanlage mit 10.000 BTU.",
    shortDesc: "Mobile Klimaanlage mit 10.000 BTU",
    price: 349.0, sku: "SICHLER-PACWK10", inStock: true,
    rating: 4.3, reviewCount: 456, categorySlug: "klima-luft", brandSlug: "sichler",
    features: ["3-in-1", "10.000 BTU", "Timer", "Leise"],
    specs: [
      { key: "Kühlleistung", value: "10.000 BTU" }, { key: "Raumgröße", value: "bis 35 m²" },
    ],
  },
  {
    name: "Klarstein Fresh Breeze XL",
    slug: "klarstein-fresh-breeze-xl",
    description: "Das Klarstein Fresh Breeze XL - mobile Klimaanlage mit Luftreiniger.",
    shortDesc: "Mobile Klimaanlage mit Luftreiniger",
    price: 449.0, sku: "KLAR-FBX", inStock: true,
    rating: 4.5, reviewCount: 234, categorySlug: "klima-luft", brandSlug: "klarstein",
    features: ["3-in-1", "12.000 BTU", "HEPA-Filter", "Timer"],
    specs: [
      { key: "Kühlleistung", value: "12.000 BTU" }, { key: "Raumgröße", value: "bis 40 m²" },
    ],
  },
  {
    name: "Stadler Form sweating KNE-01",
    slug: "stadler-form-airgoing-kne01",
    description: "Der Stadler Form AirGoing KNE 01 - mobiler Luftreiniger.",
    shortDesc: "Mobiler Luftreiniger",
    price: 149.0, sku: "SF-AIRGOING", inStock: true, isNew: true,
    rating: 4.4, reviewCount: 123, categorySlug: "klima-luft", brandSlug: "stadler-form",
    features: ["HEPA", "Leise", "Kompakt", "USB"],
    specs: [
      { key: "Raumgröße", value: "bis 15 m²" }, { key: "Geräuschpegel", value: "25 dB(A)" },
    ],
  },
  {
    name: "Levoit LV-H134 Classic 200S",
    slug: "levoit-classic-200s",
    description: "Der Levoit Classic 200S - großer Luftreiniger mit HEPA.",
    shortDesc: "Großer Luftreiniger mit HEPA",
    price: 149.0, sku: "LEVOIT-200S", inStock: true,
    rating: 4.5, reviewCount: 892, categorySlug: "klima-luft", brandSlug: "levoit",
    features: ["HEPA H13", "Timer", "3 Geschwindigkeiten", "Leise"],
    specs: [
      { key: "Raumgröße", value: "bis 35 m²" }, { key: "Geräuschpegel", value: "27 dB(A)" },
    ],
  },
  {
    name: "Blueair Blue 2210",
    slug: "blueair-blue-2210",
    description: "Der Blueair Blue 2210 - kleiner Luftreiniger für kleine Räume.",
    shortDesc: "Kleiner Luftreiniger für kleine Räume",
    price: 149.0, sku: "BLUE-2210", inStock: true,
    rating: 4.4, reviewCount: 345, categorySlug: "klima-luft", brandSlug: "blueair",
    features: ["HEPASilent", "One-Touch", "2 Geschwindigkeiten"],
    specs: [
      { key: "Raumgröße", value: "bis 20 m²" }, { key: "Filter", value: "HEPASilent" },
    ],
  },
  {
    name: "Klarstein Skyscraper Ice",
    slug: "klarstein-skyscraper-ice",
    description: "Das Klarstein Skyscraper Ice - mobile Klimaanlage mit 14.000 BTU.",
    shortDesc: "Mobile Klimaanlage mit 14.000 BTU",
    price: 599.0, sku: "KLAR-SKYICE", inStock: true,
    rating: 4.6, reviewCount: 189, categorySlug: "klima-luft", brandSlug: "klarstein",
    features: ["3-in-1", "14.000 BTU", "WLAN", "App-Steuerung"],
    specs: [
      { key: "Kühlleistung", value: "14.000 BTU" }, { key: "Raumgröße", value: "bis 50 m²" },
    ],
  },
  {
    name: "Midea Air COOL MAW08V1QWT",
    slug: "midea-air-cool-maw08v1qwt",
    description: "Das Midea Air COOL MAW08V1QWT - mobile Klimaanlage.",
    shortDesc: "Mobile Klimaanlage",
    price: 399.0, sku: "MIDEA-MAW08", inStock: true,
    rating: 4.5, reviewCount: 345, categorySlug: "klima-luft", brandSlug: "midea",
    features: ["3-in-1", "8.000 BTU", "Washable Filter", "Timer"],
    specs: [
      { key: "Kühlleistung", value: "8.000 BTU" }, { key: "Raumgröße", value: "bis 30 m²" },
    ],
  },
  {
    name: "Dyson Big Quiet Formaldehyde N475",
    slug: "dyson-big-quiet-formaldehyde-n475",
    description: "Der Dyson Big Quiet Formaldehyde N475 - leiser Luftreiniger.",
    shortDesc: "Leiser Luftreiniger mit Formaldehyd-Sensor",
    price: 699.0, sku: "DY-N475", inStock: true, isNew: true,
    rating: 4.7, reviewCount: 89, categorySlug: "klima-luft", brandSlug: "dyson",
    features: ["Formaldehyd-Sensor", "HEPA H13", "Sehr leise"],
    specs: [
      { key: "Filter", value: "HEPA H13 + Katalysator" }, { key: "Geräuschpegel", value: "56 dB(A)" },
    ],
  },
  {
    name: "Trotec PAC 2100 E",
    slug: "trotec-pac-2100-e",
    description: "Das Trotec PAC 2100 E - mobile Klimaanlage für kleine Räume.",
    shortDesc: "Mobile Klimaanlage für kleine Räume",
    price: 299.0, sku: "TROTEC-PAC2100E", inStock: true,
    rating: 4.4, reviewCount: 567, categorySlug: "klima-luft", brandSlug: "trotec",
    features: ["2-in-1", "9.000 BTU", "Timer", "Kompakt"],
    specs: [
      { key: "Kühlleistung", value: "9.000 BTU" }, { key: "Raumgröße", value: "bis 30 m²" },
    ],
  },
];

async function main() {
  console.log("🌬️ Adding Traitement d'air products...");

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

  console.log(`\n🎉 Done! Added ${added} new products to Traitement d'air`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
