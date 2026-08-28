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
    name: "Ninja Foodi Dual Zone AF300EU",
    slug: "ninja-foodi-dual-zone-af300eu",
    description: "Das Ninja Foodi Dual Zone - 2 unabhängige Körbe für gleichzeitiges Garen.",
    shortDesc: "2-Korb-Airfryer für gleichzeitiges Garen",
    price: 229.0, sku: "NINJA-AF300EU", inStock: true, isFeatured: true,
    rating: 4.7, reviewCount: 567, categorySlug: "cuisson", brandSlug: "ninja", weight: 8.5,
    features: ["2 unabhängige Körbe", "7 Modi", "Smart Finish", "5,6L Gesamtvolumen"],
    tags: ["bestseller"],
    specs: [
      { key: "Volumen", value: "5,6 Liter" }, { key: "Leistung", value: "2400 Watt" },
    ],
  },
  {
    name: "Ninja Foodi Max AF400EU",
    slug: "ninja-foodi-max-af400eu",
    description: "Das Ninja Foodi Max - großer Airfryer mit 7,6L Volumen.",
    shortDesc: "Großer Airfryer mit 7,6L Volumen",
    price: 279.0, sku: "NINJA-AF400EU", inStock: true, isNew: true,
    rating: 4.8, reviewCount: 234, categorySlug: "cuisson", brandSlug: "ninja", weight: 9.0,
    features: ["7,6L Volumen", "2 unabhängige Körbe", "Max Crisp"],
    specs: [
      { key: "Volumen", value: "7,6 Liter" }, { key: "Leistung", value: "2400 Watt" },
    ],
  },
  {
    name: "Ninja Speedi SP101EU",
    slug: "ninja-speedi-sp101eu",
    description: "Das Ninja Speedi - schneller Airfryer mit Rapid Cooker Funktion.",
    shortDesc: "Schneller Airfryer mit Rapid Cooker",
    price: 199.0, sku: "NINJA-SP101EU", inStock: true,
    rating: 4.6, reviewCount: 189, categorySlug: "cuisson", brandSlug: "ninja", weight: 7.5,
    features: ["Rapid Cooker", "10 Modi", "4,7L Volumen"],
    specs: [
      { key: "Volumen", value: "4,7 Liter" }, { key: "Leistung", value: "1750 Watt" },
    ],
  },
  {
    name: "Cosori Pro II Airfryer L501",
    slug: "cosori-pro2-airfryer-l501",
    description: "Das Cosori Pro II - Airfryer mit 5,5L Volumen und 13 Modi.",
    shortDesc: "Airfryer mit 5,5L Volumen",
    price: 119.0, originalPrice: 149.0, sku: "COSORI-L501", inStock: true, isPromo: true,
    rating: 4.6, reviewCount: 892, categorySlug: "cuisson", brandSlug: "cosori", weight: 5.5,
    features: ["5,5L Volumen", "13 Modi", "Shake & Flip Erinnerung"],
    specs: [
      { key: "Volumen", value: "5,5 Liter" }, { key: "Leistung", value: "1700 Watt" },
    ],
  },
  {
    name: "Cosori Lite Airfryer 2,8L",
    slug: "cosori-lite-airfryer-28l",
    description: "Das Cosori Lite - kompakter Airfryer für kleine Haushalte.",
    shortDesc: "Kompakter Airfryer mit 2,8L",
    price: 59.0, sku: "COSORI-LITE", inStock: true,
    rating: 4.5, reviewCount: 1234, categorySlug: "cuisson", brandSlug: "cosori", weight: 3.5,
    features: ["2,8L Volumen", "7 Modi", "Kompakt"],
    specs: [
      { key: "Volumen", value: "2,8 Liter" }, { key: "Leistung", value: "1500 Watt" },
    ],
  },
  {
    name: "Tefal Easy Fry Max EY4018",
    slug: "tefal-easy-fry-max-ey4018",
    description: "Das Tefal Easy Fry Max - Airfryer mit 6,5L und 9 Modi.",
    shortDesc: "Airfryer mit 6,5L und 9 Modi",
    price: 159.0, sku: "TEF-EY4018", inStock: true,
    rating: 4.5, reviewCount: 345, categorySlug: "cuisson", brandSlug: "tefal", weight: 5.5,
    features: ["6,5L Volumen", "9 Modi", "Gesundes Garen"],
    specs: [
      { key: "Volumen", value: "6,5 Liter" }, { key: "Leistung", value: "1700 Watt" },
    ],
  },
  {
    name: "Tefal OptiGrill+ GC7148",
    slug: "tefal-optigrill-plus-gc7148",
    description: "Das Tefal OptiGrill+ - automatischer Contact-Grill mit Sensor.",
    shortDesc: "Automatischer Contact-Grill mit Sensor",
    price: 149.0, sku: "TEF-GC7148", inStock: true,
    rating: 4.6, reviewCount: 567, categorySlug: "cuisson", brandSlug: "tefal", weight: 4.5,
    features: ["Automatischer Sensor", "6 Modi", "AblegenSurface"],
    specs: [
      { key: "Grillfläche", value: "600 cm²" }, { key: "Leistung", value: "2000 Watt" },
    ],
  },
  {
    name: "Tefal Easy Grill Precision DG2558",
    slug: "tefal-easy-grill-precision-dg2558",
    description: "Das Tefal Easy Grill Precision - kompakter Indoor-Grill.",
    shortDesc: "Kompakter Indoor-Grill",
    price: 69.0, sku: "TEF-DG2558", inStock: true,
    rating: 4.4, reviewCount: 892, categorySlug: "cuisson", brandSlug: "tefal", weight: 3.0,
    features: ["Antihaftbeschichtung", "Temperaturregelung", "Kompakt"],
    specs: [
      { key: "Grillfläche", value: "450 cm²" }, { key: "Leistung", value: "1600 Watt" },
    ],
  },
  {
    name: "WMF KITCHENminis Contact Grill",
    slug: "wmf-kitchenminis-contact-grill",
    description: "Das WMF KITCHENminis Contact Grill - kompakter Grill für kleine Portionen.",
    shortDesc: "Kompakter Contact Grill",
    price: 49.0, sku: "WMF-CONTACT", inStock: true,
    rating: 4.3, reviewCount: 678, categorySlug: "cuisson", brandSlug: "wmf", weight: 2.5,
    features: ["Kompakt", "Antihaft", "Temperaturanzeige"],
    specs: [
      { key: "Grillfläche", value: "300 cm²" }, { key: "Leistung", value: "1200 Watt" },
    ],
  },
  {
    name: "Bosch Serie 6 Induktionskochfeld PCI611BB5E",
    slug: "bosch-serie6-induktionskochfeld-pci611bb5e",
    description: "Das Bosch Serie 6 Induktionskochfeld mit FlexInduktion.",
    shortDesc: "Induktionskochfeld mit FlexInduktion",
    price: 899.0, sku: "BSH-PCI611BB5E", inStock: true,
    rating: 4.7, reviewCount: 189, categorySlug: "cuisson", brandSlug: "bosch", weight: 10.0,
    features: ["FlexInduktion", "Home Connect", "PerfectFry"],
    specs: [
      { key: "Kochfeldtyp", value: "Induktion" }, { key: "Felder", value: "4" },
    ],
  },
  {
    name: "Siemens iQ700 Induktionskochfeld EX877LY44E",
    slug: "siemens-iq700-induktionskochfeld-ex877ly44e",
    description: "Das Siemens iQ700 Induktionskochfeld mit StepFlex Design.",
    shortDesc: "Induktionskochfeld mit StepFlex",
    price: 1299.0, sku: "SI-EX877LY44E", inStock: true, isNew: true,
    rating: 4.8, reviewCount: 123, categorySlug: "cuisson", brandSlug: "siemens", weight: 12.0,
    features: ["StepFlex", "Home Connect", "powerMove Plus"],
    tags: ["premium"],
    specs: [
      { key: "Kochfeldtyp", value: "Induktion" }, { key: "Felder", value: "5" },
    ],
  },
  {
    name: "Gaggenau Vario 400 Kochfeld VIG414",
    slug: "gaggenau-vario400-kochfeld-vig414",
    description: "Das Gaggenau Vario 400 Kochfeld - Premium-Induktion.",
    shortDesc: "Premium-Induktion von Gaggenau",
    price: 3499.0, sku: "GAG-VIG414", inStock: true, isFeatured: true,
    rating: 4.9, reviewCount: 45, categorySlug: "cuisson", brandSlug: "gaggenau", weight: 15.0,
    features: ["Flex-lnduktion", "Surface Boost", "Frying Sensor"],
    tags: ["premium"],
    specs: [
      { key: "Kochfeldtyp", value: "Induktion" }, { key: "Fläche", value: "2400 cm²" },
    ],
  },
  {
    name: "Neff B3ACS7AH0 Backofen B3AC S7 AH 0",
    slug: "neff-b3acs7ah0-backofen",
    description: "Der Neff B3AC S7 AH 0 - Einbau-Backofen mit Slide&Hide.",
    shortDesc: "Einbau-Backofen mit Slide&Hide",
    price: 1599.0, sku: "NEFF-B3AC", inStock: true,
    rating: 4.7, reviewCount: 89, categorySlug: "cuisson", brandSlug: "neff", weight: 40.0,
    features: ["Slide&Hide", "CircoTherm", "Pyrolyse"],
    specs: [
      { key: "Backraumvolumen", value: "71 Liter" }, { key: "Heizarten", value: "12" },
    ],
  },
  {
    name: "Bosch Serie 8 Backofen HBG8780B1",
    slug: "bosch-serie8-backofen-hbg8780b1",
    description: "Der Bosch Serie 8 Backofen mit Pyrolyse und Home Connect.",
    shortDesc: "Premium-Backofen mit Pyrolyse",
    price: 1899.0, sku: "BSH-HBG8780B1", inStock: true,
    rating: 4.8, reviewCount: 123, categorySlug: "cuisson", brandSlug: "bosch", weight: 42.0,
    features: ["Pyrolyse", "Home Connect", "PerfectBake", "PerfectRoast"],
    tags: ["premium"],
    specs: [
      { key: "Backraumvolumen", value: "71 Liter" }, { key: "Heizarten", value: "14" },
    ],
  },
  {
    name: "Miele H7464BP Backofen",
    slug: "miele-h7464bp-backofen",
    description: "Der Miele H7464BP - Premium-Einbau-Backofen mit TempCook.",
    shortDesc: "Premium-Backofen mit TempCook",
    price: 2499.0, sku: "MIELE-H7464BP", inStock: true, isNew: true,
    rating: 4.9, reviewCount: 67, categorySlug: "cuisson", brandSlug: "miele", weight: 45.0,
    features: ["TempCook", "Miele@home", "SelfClean"],
    tags: ["premium"],
    specs: [
      { key: "Backraumvolumen", value: "76 Liter" }, { key: "Heizarten", value: "15" },
    ],
  },
  {
    name: "AEG BPE842720M Backofen",
    slug: "aeg-bpe842720m-backofen",
    description: "Der AEG BPE842720M - Einbau-Backofen mit SteamBoost.",
    shortDesc: "Einbau-Backofen mit SteamBoost",
    price: 1299.0, sku: "AEG-BPE842720M", inStock: true,
    rating: 4.7, reviewCount: 156, categorySlug: "cuisson", brandSlug: "aeg", weight: 38.0,
    features: ["SteamBoost", "Pyrolyse", "Soufflé-Modus"],
    specs: [
      { key: "Backraumvolumen", value: "70 Liter" }, { key: "Heizarten", value: "11" },
    ],
  },
  {
    name: "Electrolux OEO7GKN-W Einbau-Backofen",
    slug: "electrolux-oeo7gknw-backofen",
    description: "Der Electrolux OEO7GKN-W - Einbau-Backofen mit SteamPro.",
    shortDesc: "Einbau-Backofen mit SteamPro",
    price: 999.0, sku: "ELEC-OEO7GKNW", inStock: true,
    rating: 4.6, reviewCount: 189, categorySlug: "cuisson", brandSlug: "electrolux", weight: 36.0,
    features: ["SteamPro", "Pyrolyse", "PerfectPro"],
    specs: [
      { key: "Backraumvolumen", value: "72 Liter" }, { key: "Heizarten", value: "10" },
    ],
  },
  {
    name: "Samsung Bespoke Slide-In Range NX60BB8711",
    slug: "samsung-bespoke-slide-in-range-nx60bb871112",
    description: "Der Samsung Bespoke Slide-In Range - freistehender Herd mit Air Fry.",
    shortDesc: "Freistehender Herd mit Air Fry",
    price: 2199.0, sku: "SAM-NX60BB", inStock: true,
    rating: 4.7, reviewCount: 89, categorySlug: "cuisson", brandSlug: "samsung", weight: 80.0,
    features: ["Air Fry", "SmartThings", "Induktion"],
    specs: [
      { key: "Herdtyp", value: "Induktion" }, { key: "Backraumvolumen", value: "6,3 cu ft" },
    ],
  },
  {
    name: "LG InstaView Range LSEL6337F",
    slug: "lg-instaview-range-lsel6337f",
    description: "Der LG InstaView Range - Herd mittransparentem Türfenster.",
    shortDesc: "Herd mittransparentem Türfenster",
    price: 2499.0, sku: "LG-LSEL6337F", inStock: true, isNew: true,
    rating: 4.8, reviewCount: 67, categorySlug: "cuisson", brandSlug: "lg", weight: 85.0,
    features: ["InstaView", "ProBake Convection", "Air Fry"],
    tags: ["premium"],
    specs: [
      { key: "Herdtyp", value: "Induktion" }, { key: "Backraumvolumen", value: "6,3 cu ft" },
    ],
  },
  {
    name: "Gastroback Design Pro 42621",
    slug: "gastroback-design-pro-42621",
    description: "Das Gastroback Design Pro - frittierfreier Airfryer.",
    shortDesc: "Frittierfreier Airfryer",
    price: 89.0, sku: "GB-42621", inStock: true,
    rating: 4.4, reviewCount: 456, categorySlug: "cuisson", brandSlug: "gastroback",
    features: ["Frittierfrei", "5 Modi", "3,5L Volumen"],
    specs: [
      { key: "Volumen", value: "3,5 Liter" }, { key: "Leistung", value: "1400 Watt" },
    ],
  },
  {
    name: "Russell Hobbs Retro Air Fryer 24530",
    slug: "russell-hobbs-retro-air-fryer-24530",
    description: "Der Russell Hobbs Retro Air Fryer - stylischer Airfryer im Retro-Look.",
    shortDesc: "Stylischer Airfryer im Retro-Look",
    price: 69.0, sku: "RH-24530", inStock: true,
    rating: 4.3, reviewCount: 678, categorySlug: "cuisson", brandSlug: "russell-hobbs", weight: 4.5,
    features: ["Retro-Design", "3,2L Volumen", "60-Min-Timer"],
    specs: [
      { key: "Volumen", value: "3,2 Liter" }, { key: "Leistung", value: "1500 Watt" },
    ],
  },
  {
    name: "De'Longhi Multifry FH1394",
    slug: "delonghi-multifry-fh1394",
    description: "Das De'Longhi Multifry - Airfryer mit Rührfunktion.",
    shortDesc: "Airfryer mit Rührfunktion",
    price: 179.0, sku: "DEL-FH1394", inStock: true,
    rating: 4.5, reviewCount: 345, categorySlug: "cuisson", brandSlug: "delonghi", weight: 5.0,
    features: ["Rührfunktion", "Duales Heizelement", "1,5 kg Volumen"],
    specs: [
      { key: "Volumen", value: "1,5 kg" }, { key: "Leistung", value: "1400 Watt" },
    ],
  },
  {
    name: "Moulinex Easy Fry Max FX9029",
    slug: "moulinex-easy-fry-max-fx9029",
    description: "Das Moulinex Easy Fry Max - Airfryer mit 6,5L Volumen.",
    shortDesc: "Airfryer mit 6,5L Volumen",
    price: 119.0, sku: "MOUL-FX9029", inStock: true,
    rating: 4.4, reviewCount: 567, categorySlug: "cuisson", brandSlug: "moulinex", weight: 5.0,
    features: ["6,5L Volumen", "9 Modi", "Digital Touch"],
    specs: [
      { key: "Volumen", value: "6,5 Liter" }, { key: "Leistung", value: "1700 Watt" },
    ],
  },
  {
    name: "Kenwood MultiPro Express FDM79.190BA",
    slug: "kenwood-multipro-express-fdm79190ba",
    description: "Das Kenwood MultiPro Express - multifunktionaler Küchenhelfer mit Airfryer.",
    shortDesc: "Multifunktionaler Küchenhelfer mit Airfryer",
    price: 349.0, sku: "KEN-FDM79", inStock: true,
    rating: 4.7, reviewCount: 189, categorySlug: "cuisson", brandSlug: "kenwood", weight: 7.5,
    features: ["Airfryer", "Dampfgarer", "Food Processor", "1000W"],
    specs: [
      { key: "Funktionen", value: "5 in 1" }, { key: "Leistung", value: "1000 Watt" },
    ],
  },
  {
    name: "Sage the Air Fryer Pro BPA180",
    slug: "sage-the-air-fryer-pro-bpa180",
    description: "Das Sage the Air Fryer Pro - Premium-Airfryer mitgetElement.",
    shortDesc: "Premium-Airfryer mitgetElement",
    price: 299.0, sku: "SAGE-BPA180", inStock: true,
    rating: 4.8, reviewCount: 123, categorySlug: "cuisson", brandSlug: "sage", weight: 8.0,
    features: ["Element iQ", "7 Modi", "5,5L Volumen"],
    tags: ["premium"],
    specs: [
      { key: "Volumen", value: "5,5 Liter" }, { key: "Leistung", value: "1700 Watt" },
    ],
  },
];

async function main() {
  console.log("🍳 Adding Cuisson products...");

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

  console.log(`\n🎉 Done! Added ${added} new products to Cuisson`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
