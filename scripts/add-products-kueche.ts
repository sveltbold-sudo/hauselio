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
    name: "Thermomix TM6",
    slug: "thermomix-tm6",
    description: "Der bewährte Thermomix TM6 - zuverlässig, leistungsstark und vielseitig.",
    shortDesc: "Bewährte Qualität mit 40+ Funktionen",
    price: 1399.0, sku: "TM6-2025", inStock: true, isFeatured: true,
    rating: 4.8, reviewCount: 342, categorySlug: "kueche-food", brandSlug: "thermomix",
    features: ["40+ Kochfunktionen", "Cookidoo-Zugang", "Selbstreinigung", "5,5 Zoll Display"],
    specs: [
      { key: "Leistung", value: "1500 Watt" }, { key: "Gewicht", value: "7,95 kg" },
      { key: "Fassungsvermögen", value: "2,2 Liter" }, { key: "Kochfunktionen", value: "40+" },
    ],
  },
  {
    name: "KitchenAid Artisan Küchenmaschine 5KSM175PSE",
    slug: "kitchenaid-artisan-5ksm175pse",
    description: "Die KitchenAid Artisan Küchenmaschine - ikonisches Design trifft auf professionelle Leistung.",
    shortDesc: "Ikonische Küchenmaschine mit 4,8L Schüssel",
    price: 549.0, originalPrice: 599.0, sku: "KA-ART-5KSM", inStock: true, isFeatured: true, isPromo: true,
    rating: 4.8, reviewCount: 289, categorySlug: "kueche-food", brandSlug: "kitchenaid", weight: 10.5,
    features: ["4,8L Edelstahlschüssel", "10 Geschwindigkeiten", "Planetarische Bewegung"],
    tags: ["bestseller", "design-klassiker"],
    specs: [
      { key: "Leistung", value: "300 Watt" }, { key: "Schüsselvolumen", value: "4,8 Liter" },
      { key: "Gewicht", value: "10,5 kg" }, { key: "Geschwindigkeiten", value: "10" },
    ],
  },
  {
    name: "KitchenAid Artisan Mini 5KSM33",
    slug: "kitchenaid-artisan-mini-5ksm33",
    description: "Die KitchenAid Artisan Mini - kompakte Küchenmaschine für kleinere Haushalte.",
    shortDesc: "Kompakte Küchenmaschine mit 3,3L Schüssel",
    price: 379.0, sku: "KA-MINI-5KSM33", inStock: true,
    rating: 4.7, reviewCount: 189, categorySlug: "kueche-food", brandSlug: "kitchenaid", weight: 6.5,
    features: ["3,3L Edelstahlschüssel", "10 Geschwindigkeiten", "Kompaktes Design"],
    specs: [
      { key: "Leistung", value: "250 Watt" }, { key: "Schüsselvolumen", value: "3,3 Liter" },
      { key: "Gewicht", value: "6,5 kg" },
    ],
  },
  {
    name: "Vorwerk Thermomix TM5",
    slug: "vorwerk-thermomix-tm5",
    description: "Der Vorwerk Thermomix TM5 - bewährte Qualität mit 12 programmierbaren Seiten.",
    shortDesc: "Klassiker mit 12 Kochmodi",
    price: 1099.0, sku: "VW-TM5", inStock: true,
    rating: 4.6, reviewCount: 567, categorySlug: "kueche-food", brandSlug: "vorwerk", weight: 7.95,
    features: ["12 Kochmodi", "Cookidoo kompatibel", "Balancierskala"],
    specs: [
      { key: "Leistung", value: "1500 Watt" }, { key: "Fassungsvermögen", value: "2,2 Liter" },
    ],
  },
  {
    name: "Sage the Bakery Boss",
    slug: "sage-the-bakery-boss",
    description: "Sage the Bakery Boss - professionelle Küchenmaschine für Brot- und Teigliebhaber.",
    shortDesc: "Professionelle Küchenmaschine für Bäcker",
    price: 599.0, originalPrice: 699.0, sku: "SAGE-BBOSS", inStock: true, isPromo: true,
    rating: 4.7, reviewCount: 156, categorySlug: "kueche-food", brandSlug: "sage", weight: 12.0,
    features: ["4,7L Schüssel", "1200 Watt Motor", "Cyclo-Rollensystem"],
    specs: [
      { key: "Leistung", value: "1200 Watt" }, { key: "Schüsselvolumen", value: "4,7 Liter" },
    ],
  },
  {
    name: "Ninja Foodi Multi-Cooker NC300",
    slug: "ninja-foodi-multi-cooker-nc300",
    description: "Das Ninja Foodi Multi-Cooker - 14 Funktionen in einem Gerät.",
    shortDesc: "14-in-1 Multi-Cooker mit Druckkochfunktion",
    price: 299.0, sku: "NINJA-NC300", inStock: true, isNew: true,
    rating: 4.6, reviewCount: 234, categorySlug: "kueche-food", brandSlug: "ninja", weight: 8.5,
    features: ["14 Kochfunktionen", "Druckkocher", "Schnellkochtopf", "Air Fryer"],
    specs: [
      { key: "Volumen", value: "6 Liter" }, { key: "Leistung", value: "1400 Watt" },
    ],
  },
  {
    name: "WMF KITCHENminis Handmixer",
    slug: "wmf-kitchenminis-handmixer",
    description: "Der WMF KITCHENminis Handmixer - kompakt und leistungsstark.",
    shortDesc: "Kompakter Handmixer mit 400 Watt",
    price: 59.0, sku: "WMF-HM400", inStock: true,
    rating: 4.4, reviewCount: 678, categorySlug: "kueche-food", brandSlug: "wmf", weight: 1.2,
    features: ["400 Watt", "5 Geschwindigkeiten", "Turbo-Funktion"],
    specs: [
      { key: "Leistung", value: "400 Watt" }, { key: "Gewicht", value: "1,2 kg" },
    ],
  },
  {
    name: "Tefal Jamie Oliver Cook Smart Set",
    slug: "tefal-jamie-oliver-cook-smart",
    description: "Das Tefal Jamie Oliver Cook Smart Set - professionelle Kochgeschirr-Serie.",
    shortDesc: "5-teiliges Kochgeschirr-Set von Jamie Oliver",
    price: 149.0, originalPrice: 199.0, sku: "TEFAL-JOS5", inStock: true, isPromo: true,
    rating: 4.5, reviewCount: 892, categorySlug: "kueche-food", brandSlug: "tefal",
    features: ["Thermo-Spot", "Induktionsgeeignet", "5-teilig"],
    specs: [
      { key: "Material", value: "Aluminium" }, { key: "Beschichtung", value: "Titan" },
    ],
  },
  {
    name: "Gastroback Advanced Dual plus 40882",
    slug: "gastroback-advanced-dual-plus-40882",
    description: "Das Gastroback Advanced Dual plus - Doppel-Waffeleisen für große Waffeln.",
    shortDesc: "Doppel-Waffeleisen für 2 Waffeln gleichzeitig",
    price: 79.0, sku: "GB-40882", inStock: true,
    rating: 4.5, reviewCount: 345, categorySlug: "kueche-food", brandSlug: "gastroback",
    features: ["2 Waffeln gleichzeitig", "Titan-Beschichtung", "8 Waffelstärke"],
    specs: [
      { key: "Leistung", value: "1400 Watt" }, { key: "Backzeit", value: "3-5 Minuten" },
    ],
  },
  {
    name: "Vorwerk Kobold VK200",
    slug: "vorwerk-kobold-vk200",
    description: "Der Vorwerk Kobold VK200 - der ultimative Staubsauger für Grund- und Feuchtreinigung.",
    shortDesc: "Premium-Staubsauger mit Trocken- und Nassreinigung",
    price: 1299.0, sku: "VW-VK200", inStock: true, isFeatured: true,
    rating: 4.8, reviewCount: 456, categorySlug: "kueche-food", brandSlug: "vorwerk", weight: 7.5,
    features: ["Trocken- und Nassreinigung", "AirClean Plus", "Elektrobürste"],
    tags: ["premium"],
    specs: [
      { key: "Saugleistung", value: "300 Watt" }, { key: "Gewicht", value: "7,5 kg" },
    ],
  },
  {
    name: "Kenwood Chef XL Elite KVL6325S",
    slug: "kenwood-chef-xl-elite-kvl6325s",
    description: "Die Kenwood Chef XL Elite - leistungsstarke Küchenmaschine mit 6,7L Schüssel.",
    shortDesc: "Professionelle Küchenmaschine mit 1700 Watt",
    price: 499.0, sku: "KEN-KVL6325S", inStock: true,
    rating: 4.7, reviewCount: 189, categorySlug: "kueche-food", brandSlug: "kenwood", weight: 8.5,
    features: ["1700 Watt", "6,7L Schüssel", "Hochleistungsmotor"],
    specs: [
      { key: "Leistung", value: "1700 Watt" }, { key: "Schüsselvolumen", value: "6,7 Liter" },
    ],
  },
  {
    name: "Russell Hobbs Go Create Handmixer",
    slug: "russell-hobbs-go-create-handmixer",
    description: "Der Russell Hobbs Go Create Handmixer - leicht und benutzerfreundlich.",
    shortDesc: "Leichter Handmixer mit 5 Geschwindigkeiten",
    price: 34.0, sku: "RH-GOCREATE", inStock: true,
    rating: 4.3, reviewCount: 567, categorySlug: "kueche-food", brandSlug: "russell-hobbs", weight: 1.0,
    features: ["5 Geschwindigkeiten", "Turbo-Modus", "Leicht"],
    specs: [
      { key: "Leistung", value: "350 Watt" }, { key: "Gewicht", value: "1,0 kg" },
    ],
  },
  {
    name: "Bosch MFQ3540 Handmixer",
    slug: "bosch-mfq3540-handmixer",
    description: "Der Bosch MFQ3540 Handmixer - leistungsstarker Handmixer mit ergonomischem Griff.",
    shortDesc: "Leistungsstarker Handmixer mit 450 Watt",
    price: 49.0, sku: "BSH-MFQ3540", inStock: true,
    rating: 4.5, reviewCount: 892, categorySlug: "kueche-food", brandSlug: "bosch", weight: 1.1,
    features: ["450 Watt", "5 Geschwindigkeiten", "Turbo", "Drahtbesen & Knethaken"],
    specs: [
      { key: "Leistung", value: "450 Watt" }, { key: "Gewicht", value: "1,1 kg" },
    ],
  },
  {
    name: "Electrolux Assist 9系 Handmixer",
    slug: "electrolux-assist-9-handmixer",
    description: "Der Electrolux Assist 9系 - eleganter Handmixer mit leistungsstarkem Motor.",
    shortDesc: "Eleganter Handmixer mit 500 Watt",
    price: 59.0, sku: "ELEC-ASSIST9", inStock: true,
    rating: 4.4, reviewCount: 345, categorySlug: "kueche-food", brandSlug: "electrolux", weight: 1.2,
    features: ["500 Watt", "6 Geschwindigkeiten", "Soft-Touch-Griff"],
    specs: [
      { key: "Leistung", value: "500 Watt" }, { key: "Gewicht", value: "1,2 kg" },
    ],
  },
  {
    name: "AEG HM 400 Handmixer",
    slug: "aeg-hm-400-handmixer",
    description: "Der AEG HM 400 - kompakter Handmixer für den täglichen Gebrauch.",
    shortDesc: "Kompakter Handmixer mit 400 Watt",
    price: 45.0, sku: "AEG-HM400", inStock: true,
    rating: 4.3, reviewCount: 456, categorySlug: "kueche-food", brandSlug: "aeg", weight: 1.0,
    features: ["400 Watt", "5 Geschwindigkeiten", "Leicht"],
    specs: [
      { key: "Leistung", value: "400 Watt" }, { key: "Gewicht", value: "1,0 kg" },
    ],
  },
  {
    name: "Braun MQ7 Multiquick Handmixer",
    slug: "braun-mq7-multiquick-handmixer",
    description: "Der Braun MQ7 Multiquick - innovativer Handmixer mit ActiveBlade Technologie.",
    shortDesc: "Innovativer Handmixer mit ActiveBlade",
    price: 89.0, sku: "BRAUN-MQ7", inStock: true, isNew: true,
    rating: 4.6, reviewCount: 234, categorySlug: "kueche-food", brandSlug: "braun", weight: 1.3,
    features: ["ActiveBlade", "1000 Watt", "Smart Speed"],
    specs: [
      { key: "Leistung", value: "1000 Watt" }, { key: "Gewicht", value: "1,3 kg" },
    ],
  },
  {
    name: "Philips HR3655 Handmixer",
    slug: "philips-hr3655-handmixer",
    description: "Der Philips HR3655 - leistungsstarker Handmixer mit ProMix-Technologie.",
    shortDesc: "Leistungsstarker Handmixer mit ProMix",
    price: 69.0, sku: "PH-HR3655", inStock: true,
    rating: 4.5, reviewCount: 345, categorySlug: "kueche-food", brandSlug: "philips", weight: 1.2,
    features: ["1000 Watt", "ProMix-Technologie", "6 Geschwindigkeiten"],
    specs: [
      { key: "Leistung", value: "1000 Watt" }, { key: "Gewicht", value: "1,2 kg" },
    ],
  },
  {
    name: "SMEG Handmixer HMF01",
    slug: "smeg-hmf01-handmixer",
    description: "Der SMEG HMF01 - retro-design Handmixer mit leistungsstarkem Motor.",
    shortDesc: "Retro-Design Handmixer mit 600 Watt",
    price: 129.0, sku: "SMEG-HMF01", inStock: true,
    rating: 4.6, reviewCount: 156, categorySlug: "kueche-food", brandSlug: "smeg", weight: 1.5,
    features: ["600 Watt", "Retro-Design", "4 Geschwindigkeiten"],
    specs: [
      { key: "Leistung", value: "600 Watt" }, { key: "Gewicht", value: "1,5 kg" },
    ],
  },
  {
    name: "Smeg 50er Jahre Handmixer HMF02",
    slug: "smeg-50er-jahre-hmf02-handmixer",
    description: "Der Smeg 50er Jahre HMF02 - vintage-Design Handmixer mit edler Optik.",
    shortDesc: "Vintage-Handmixer mit edlem Design",
    price: 149.0, sku: "SMEG-HMF02", inStock: true,
    rating: 4.7, reviewCount: 123, categorySlug: "kueche-food", brandSlug: "smeg", weight: 1.5,
    features: ["600 Watt", "50er Jahre Design", "Soft-Touch"],
    specs: [
      { key: "Leistung", value: "600 Watt" }, { key: "Gewicht", value: "1,5 kg" },
    ],
  },
  {
    name: "Russell Hobbs Eagle 23211 Handmixer",
    slug: "russell-hobbs-eagle-23211-handmixer",
    description: "Der Russell Hobbs Eagle - zuverlässiger Handmixer mit starkem Preis-Leistungs-Verhältnis.",
    shortDesc: "Zuverlässiger Handmixer mit 400 Watt",
    price: 29.0, sku: "RH-23211", inStock: true,
    rating: 4.2, reviewCount: 1234, categorySlug: "kueche-food", brandSlug: "russell-hobbs", weight: 1.0,
    features: ["400 Watt", "5 Geschwindigkeiten", "Kompakt"],
    specs: [
      { key: "Leistung", value: "400 Watt" }, { key: "Gewicht", value: "1,0 kg" },
    ],
  },
  {
    name: "Moulinex Optichef HT4101 Handmixer",
    slug: "moulinex-optichef-ht4101-handmixer",
    description: "Der Moulinex Optichef HT4101 - kompakter Handmixer für einfache Küchenaufgaben.",
    shortDesc: "Kompakter Handmixer mit 350 Watt",
    price: 25.0, sku: "MOUL-HT4101", inStock: true,
    rating: 4.1, reviewCount: 2345, categorySlug: "kueche-food", brandSlug: "moulinex", weight: 0.9,
    features: ["350 Watt", "5 Geschwindigkeiten", "Leicht"],
    specs: [
      { key: "Leistung", value: "350 Watt" }, { key: "Gewicht", value: "0,9 kg" },
    ],
  },
  {
    name: "Tefal Optichef HT4508 Handmixer",
    slug: "tefal-optichef-ht4508-handmixer",
    description: "Der Tefal Optichef HT4508 - leistungsstarker Handmixer mit ergonomischem Design.",
    shortDesc: "Leistungsstarker Handmixer mit 450 Watt",
    price: 39.0, sku: "TEF-HT4508", inStock: true,
    rating: 4.4, reviewCount: 678, categorySlug: "kueche-food", brandSlug: "tefal", weight: 1.1,
    features: ["450 Watt", "5 Geschwindigkeiten", "Ergonomisch"],
    specs: [
      { key: "Leistung", value: "450 Watt" }, { key: "Gewicht", value: "1,1 kg" },
    ],
  },
  {
    name: "Black+Decker 600W Handmixer",
    slug: "black-decker-600w-handmixer",
    description: "Der Black+Decker 600W Handmixer - kraftvoller Handmixer für den täglichen Gebrauch.",
    shortDesc: "Kraftvoller Handmixer mit 600 Watt",
    price: 35.0, sku: "BD-600W", inStock: true,
    rating: 4.3, reviewCount: 567, categorySlug: "kueche-food", brandSlug: "black-decker", weight: 1.2,
    features: ["600 Watt", "6 Geschwindigkeiten", "Turbo"],
    specs: [
      { key: "Leistung", value: "600 Watt" }, { key: "Gewicht", value: "1,2 kg" },
    ],
  },
  {
    name: "KitchenAid 5KHB25AY Artisan Handmixer",
    slug: "kitchenaid-artisan-5khb25ay-handmixer",
    description: "Die KitchenAid 5KHB25AY Artisan - Premium-Handmixer mit leistungsstarkem Motor.",
    shortDesc: "Premium-Handmixer mit 250 Watt",
    price: 149.0, sku: "KA-5KHB25AY", inStock: true,
    rating: 4.6, reviewCount: 234, categorySlug: "kueche-food", brandSlug: "kitchenaid", weight: 1.5,
    features: ["250 Watt", "5 Geschwindigkeiten", "Stabmixer-Set"],
    specs: [
      { key: "Leistung", value: "250 Watt" }, { key: "Gewicht", value: "1,5 kg" },
    ],
  },
  {
    name: "Bosch MUMS2EW48 Küchenmaschine",
    slug: "bosch-mums2ew48-kuechenmaschine",
    description: "Die Bosch MUMS2EW48 - vielseitige Küchenmaschine mit 3,8L Schüssel.",
    shortDesc: "Vielseitige Küchenmaschine mit 1200 Watt",
    price: 299.0, sku: "BSH-MUMS2EW48", inStock: true,
    rating: 4.7, reviewCount: 456, categorySlug: "kueche-food", brandSlug: "bosch", weight: 6.8,
    features: ["1200 Watt", "3,8L Schüssel", "6 Geschwindigkeiten"],
    specs: [
      { key: "Leistung", value: "1200 Watt" }, { key: "Schüsselvolumen", value: "3,8 Liter" },
    ],
  },
  {
    name: "Moulinex QuickMix 654 Handmixer",
    slug: "moulinex-quickmix-654-handmixer",
    description: "Der Moulinex QuickMix 654 - praktischer Handmixer mit transparenter Schüssel.",
    shortDesc: "Praktischer Handmixer mit Schüssel",
    price: 32.0, sku: "MOUL-654", inStock: true,
    rating: 4.2, reviewCount: 892, categorySlug: "kueche-food", brandSlug: "moulinex", weight: 1.0,
    features: ["400 Watt", "5 Geschwindigkeiten", "Transparente Schüssel"],
    specs: [
      { key: "Leistung", value: "400 Watt" }, { key: "Gewicht", value: "1,0 kg" },
    ],
  },
  {
    name: "Kenwood HM430 Handmixer",
    slug: "kenwood-hm430-handmixer",
    description: "Der Kenwood HM430 - zuverlässiger Handmixer mit starkem Motor.",
    shortDesc: "Zuverlässiger Handmixer mit 450 Watt",
    price: 49.0, sku: "KEN-HM430", inStock: true,
    rating: 4.4, reviewCount: 567, categorySlug: "kueche-food", brandSlug: "kenwood", weight: 1.1,
    features: ["450 Watt", "5 Geschwindigkeiten", "Turbo"],
    specs: [
      { key: "Leistung", value: "450 Watt" }, { key: "Gewicht", value: "1,1 kg" },
    ],
  },
];

async function main() {
  console.log("🍽️ Adding Küche & Food products...");

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
        categoryId: categoryMap[categorySlug],
        brandId: brandMap[brandSlug],
        features: features || [],
        tags: tags || [],
      },
    });
    added++;
    console.log(`✅ Added: ${product.name}`);
  }

  console.log(`\n🎉 Done! Added ${added} new products to Küche & Food`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
