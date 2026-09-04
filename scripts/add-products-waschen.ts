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
    name: "Miele W1 Waschmaschine WSD163 WCS",
    slug: "miele-w1-waschmaschine-wsd163",
    description: "Die Miele W1 Waschmaschine mit TwinDos und CapDosing.",
    shortDesc: "Premium Waschmaschine mit TwinDos",
    price: 1599.0, sku: "MIELE-WSD163", isNew: true,
    rating: 4.9, reviewCount: 123, categorySlug: "waschen-trocknen", brandSlug: "miele", weight: 85,
    features: ["TwinDos", "CapDosing", "PowerWash 2.0", "9 kg"],
    tags: ["premium"],
    specs: [
      { key: "Füllmenge", value: "9 kg" }, { key: "Energieeffizienz", value: "A+++" },
    ],
  },
  {
    name: "Miele W1 Waschmaschine WSD263 WCS",
    slug: "miele-w1-waschmaschine-wsd263",
    description: "Die Miele W1 Waschmaschine mit AddLoad und TwinDos.",
    shortDesc: "Waschmaschine mit AddLoad & TwinDos",
    price: 1799.0, sku: "MIELE-WSD263",
    rating: 4.8, reviewCount: 89, categorySlug: "waschen-trocknen", brandSlug: "miele", weight: 88,
    features: ["AddLoad", "TwinDos", "CapDosing", "10 kg"],
    specs: [
      { key: "Füllmenge", value: "10 kg" }, { key: "Energieeffizienz", value: "A+++" },
    ],
  },
  {
    name: "Miele T1 Trommeltrockner TMH843 WP",
    slug: "miele-t1-trockner-tmh843",
    description: "Der Miele T1 Trommeltrockner mit PerfectDry und Wärmepumpe.",
    shortDesc: "Trockner mit PerfectDry & Wärmepumpe",
    price: 1499.0, sku: "MIELE-TMH843",
    rating: 4.8, reviewCount: 123, categorySlug: "waschen-trocknen", brandSlug: "miele", weight: 60,
    features: ["PerfectDry", "Wärmepumpe", "FragranceDos", "9 kg"],
    specs: [
      { key: "Fassungsvermögen", value: "9 kg" }, { key: "Trocknungsart", value: "Wärmepumpe" },
    ],
  },
  {
    name: "Miele Waschtrockner WT1",
    slug: "miele-waschtrockner-wt1",
    description: "Das Miele Waschtrockner WT1 - Waschen & Trocknen in einem.",
    shortDesc: "Waschtrockner von Miele",
    price: 2999.0, sku: "MIELE-WT1", isFeatured: true,
    rating: 4.9, reviewCount: 67, categorySlug: "waschen-trocknen", brandSlug: "miele", weight: 120,
    features: ["TwinDos", "Wärmepumpe", "1600 U/min", "8 kg waschen / 5 kg trocknen"],
    tags: ["premium"],
    specs: [
      { key: "Waschkapazität", value: "8 kg" }, { key: "Trocknungkapazität", value: "5 kg" },
    ],
  },
  {
    name: "Bosch Serie 8 Waschmaschine WAU285680",
    slug: "bosch-serie8-waschmaschine-wau285680",
    description: "Die Bosch Serie 8 Waschmaschine mit i-DOS und Home Connect.",
    shortDesc: "Premium-Waschmaschine mit i-DOS",
    price: 1199.0, sku: "BSH-WAU285680",
    rating: 4.8, reviewCount: 156, categorySlug: "waschen-trocknen", brandSlug: "bosch", weight: 80,
    features: ["i-DOS", "Home Connect", "Iron Assist", "9 kg"],
    tags: ["premium"],
    specs: [
      { key: "Füllmenge", value: "9 kg" }, { key: "Energieeffizienz", value: "A+++" },
    ],
  },
  {
    name: "Bosch Serie 6 Trockner WTU876680",
    slug: "bosch-serie6-trockner-wtu876680",
    description: "Der Bosch Serie 6 Trockner mit Wärmepumpe und Home Connect.",
    shortDesc: "Trockner mit Wärmepumpe & Home Connect",
    price: 899.0, sku: "BSH-WTU876680",
    rating: 4.7, reviewCount: 234, categorySlug: "waschen-trocknen", brandSlug: "bosch", weight: 55,
    features: ["Wärmepumpe", "Home Connect", "SelfCleaning Condenser", "9 kg"],
    specs: [
      { key: "Fassungsvermögen", value: "9 kg" }, { key: "Trocknungsart", value: "Wärmepumpe" },
    ],
  },
  {
    name: "Siemens iQ700 Waschmaschine WG44G2Z0",
    slug: "siemens-iq700-waschmaschine-wg44g2z0",
    description: "Die Siemens iQ700 Waschmaschine mit i-DOS und varioSpeed.",
    shortDesc: "Waschmaschine mit i-DOS & varioSpeed",
    price: 999.0, sku: "SI-WG44G2Z0",
    rating: 4.7, reviewCount: 189, categorySlug: "waschen-trocknen", brandSlug: "siemens", weight: 78,
    features: ["i-DOS", "varioSpeed", "Home Connect", "9 kg"],
    specs: [
      { key: "Füllmenge", value: "9 kg" }, { key: "Schleuderdrehzahl", value: "1400 U/min" },
    ],
  },
  {
    name: "Siemens iQ700 Trockner WT47W5600",
    slug: "siemens-iq700-trockner-wt47w5600",
    description: "Der Siemens iQ700 Trockner mit Wärmepumpe und Home Connect.",
    shortDesc: "Premium-Trockner mit Wärmepumpe",
    price: 1099.0, sku: "SI-WT47W5600",
    rating: 4.8, reviewCount: 123, categorySlug: "waschen-trocknen", brandSlug: "siemens", weight: 58,
    features: ["Wärmepumpe", "Home Connect", "SelfCleaning Condenser", "9 kg"],
    tags: ["premium"],
    specs: [
      { key: "Fassungsvermögen", value: "9 kg" }, { key: "Trocknungsart", value: "Wärmepumpe" },
    ],
  },
  {
    name: "Samsung EcoBubble WW90T554DAW",
    slug: "samsung-ecobubble-ww90t554daw",
    description: "Die Samsung EcoBubble Waschmaschine mit AI Control.",
    shortDesc: "EcoBubble mit AI Control",
    price: 599.0, originalPrice: 699.0, sku: "SAM-WW90T554", isPromo: true,
    rating: 4.6, reviewCount: 345, categorySlug: "waschen-trocknen", brandSlug: "samsung", weight: 62,
    features: ["EcoBubble", "AI Control", "Digital Inverter", "9 kg"],
    specs: [
      { key: "Füllmenge", value: "9 kg" }, { key: "Schleuderdrehzahl", value: "1400 U/min" },
    ],
  },
  {
    name: "Samsung Trockner DV80TA020AE",
    slug: "samsung-trockner-dv80ta020ae",
    description: "Der Samsung Trockner mit Wärmepumpe undOptimal Dry.",
    shortDesc: "Trockner mit Wärmepumpe & Optimal Dry",
    price: 599.0, sku: "SAM-DV80TA",
    rating: 4.5, reviewCount: 234, categorySlug: "waschen-trocknen", brandSlug: "samsung", weight: 50,
    features: ["Wärmepumpe", "Optimal Dry", "SmartThings", "9 kg"],
    specs: [
      { key: "Fassungsvermögen", value: "9 kg" }, { key: "Trocknungsart", value: "Wärmepumpe" },
    ],
  },
  {
    name: "LG TurboWash WV9-1412W",
    slug: "lg-turbowash-wv9-1412w",
    description: "Die LG TurboWash Waschmaschine mit TurboWash 360.",
    shortDesc: "TurboWash Waschmaschine mit 360°",
    price: 799.0, sku: "LG-WV9-1412W",
    rating: 4.7, reviewCount: 189, categorySlug: "waschen-trocknen", brandSlug: "lg", weight: 68,
    features: ["TurboWash 360", "AI DD", "SmartThinQ", "12 kg"],
    specs: [
      { key: "Füllmenge", value: "12 kg" }, { key: "Schleuderdrehzahl", value: "1400 U/min" },
    ],
  },
  {
    name: "LG WashTower™ P9WBA",
    slug: "lg-washtower-p9wba",
    description: "Das LG WashTower™ - Waschturm mit Waschmaschine und Trockner.",
    shortDesc: "Waschturm mit 17 kg Waschen / 10 kg Trocknen",
    price: 2499.0, sku: "LG-P9WBA", isNew: true, isFeatured: true,
    rating: 4.8, reviewCount: 89, categorySlug: "waschen-trocknen", brandSlug: "lg", weight: 150,
    features: ["AI DD", "TurboWash", "Center Vent", "17/10 kg"],
    tags: ["premium", "bestseller"],
    specs: [
      { key: "Waschkapazität", value: "17 kg" }, { key: "Trocknungkapazität", value: "10 kg" },
    ],
  },
  {
    name: "AEG LR9A80600 Waschmaschine",
    slug: "aeg-lr9a80600-waschmaschine",
    description: "Die AEG LR9A80600 Waschmaschine mit Öko-Inverter und ProSense.",
    shortDesc: "Waschmaschine mit Öko-Inverter",
    price: 899.0, sku: "AEG-LR9A80600",
    rating: 4.7, reviewCount: 156, categorySlug: "waschen-trocknen", brandSlug: "aeg", weight: 75,
    features: ["Öko-Inverter", "ProSense", "Anti-Allergie", "9 kg"],
    specs: [
      { key: "Füllmenge", value: "9 kg" }, { key: "Energieeffizienz", value: "A+++" },
    ],
  },
  {
    name: "AEG TR9A865R Trockner",
    slug: "aeg-tr9a865r-trockner",
    description: "Der AEG TR9A865R Trockner mit Wärmepumpe und ProSense.",
    shortDesc: "Trockner mit Wärmepumpe & ProSense",
    price: 799.0, sku: "AEG-TR9A865R",
    rating: 4.6, reviewCount: 189, categorySlug: "waschen-trocknen", brandSlug: "aeg", weight: 52,
    features: ["Wärmepumpe", "ProSense", "Öko-Therm", "9 kg"],
    specs: [
      { key: "Fassungsvermögen", value: "9 kg" }, { key: "Trocknungsart", value: "Wärmepumpe" },
    ],
  },
  {
    name: "Electrolux EW7F348SG Waschmaschine",
    slug: "electrolux-ew7f348sg-waschmaschine",
    description: "Die Electrolux EW7F348SG Waschmaschine mit Öko-Inverter.",
    shortDesc: "Waschmaschine mit Öko-Inverter",
    price: 699.0, sku: "ELEC-EW7F348SG",
    rating: 4.5, reviewCount: 234, categorySlug: "waschen-trocknen", brandSlug: "electrolux", weight: 72,
    features: ["Öko-Inverter", "ProSense", "8 kg"],
    specs: [
      { key: "Füllmenge", value: "8 kg" }, { key: "Energieeffizienz", value: "A+++" },
    ],
  },
  {
    name: "Electrolux EW7H348W Trockner",
    slug: "electrolux-ew7h348w-trockner",
    description: "Der Electrolux EW7H348W Trockner mit Wärmepumpe.",
    shortDesc: "Trockner mit Wärmepumpe",
    price: 649.0, sku: "ELEC-EW7H348W",
    rating: 4.5, reviewCount: 189, categorySlug: "waschen-trocknen", brandSlug: "electrolux", weight: 48,
    features: ["Wärmepumpe", "ProSense", "8 kg"],
    specs: [
      { key: "Fassungsvermögen", value: "8 kg" }, { key: "Trocknungsart", value: "Wärmepumpe" },
    ],
  },
  {
    name: "Haier HW100-B1439LU1 Waschmaschine",
    slug: "haier-hw100-b1439lu1-waschmaschine",
    description: "Die Haier HW100-B1439LU1 Waschmaschine mit Direct Motion.",
    shortDesc: "Waschmaschine mit Direct Motion",
    price: 599.0, sku: "HAIER-HW100",
    rating: 4.5, reviewCount: 345, categorySlug: "waschen-trocknen", brandSlug: "haier", weight: 70,
    features: ["Direct Motion", "ABT Anti-Bakterien", "10 kg"],
    specs: [
      { key: "Füllmenge", value: "10 kg" }, { key: "Schleuderdrehzahl", value: "1400 U/min" },
    ],
  },
  {
    name: "Haier HD100-A2939 Trockner",
    slug: "haier-hd100-a2939-trockner",
    description: "Der Haier HD100-A2939 Trockner mit Wärmepumpe.",
    shortDesc: "Trockner mit Wärmepumpe",
    price: 499.0, sku: "HAIER-HD100",
    rating: 4.4, reviewCount: 234, categorySlug: "waschen-trocknen", brandSlug: "haier", weight: 45,
    features: ["Wärmepumpe", "Fuzzy Logic", "10 kg"],
    specs: [
      { key: "Fassungsvermögen", value: "10 kg" }, { key: "Trocknungsart", value: "Wärmepumpe" },
    ],
  },
  {
    name: "BEKO WRS 55P12 SW Waschmaschine",
    slug: "beko-wrs-55p12-sw-waschmaschine",
    description: "Die BEKO WRS 55P12 SW Waschmaschine mit EcoGentle.",
    shortDesc: "Waschmaschine mit EcoGentle",
    price: 399.0, sku: "BEKO-WRS55P12",
    rating: 4.3, reviewCount: 567, categorySlug: "waschen-trocknen", brandSlug: "beko", weight: 65,
    features: ["EcoGentle", "AquaWave", "5 kg"],
    specs: [
      { key: "Füllmenge", value: "5 kg" }, { key: "Schleuderdrehzahl", value: "1200 U/min" },
    ],
  },
  {
    name: "BEKO DP 8534 GXA1 Trockner",
    slug: "beko-dp-8534-gxa1-trockner",
    description: "Der BEKO DP 8534 GXA1 Trockner mit Wärmepumpe.",
    shortDesc: "Trockner mit Wärmepumpe",
    price: 349.0, sku: "BEKO-DP8534",
    rating: 4.3, reviewCount: 456, categorySlug: "waschen-trocknen", brandSlug: "beko", weight: 42,
    features: ["Wärmepumpe", "OptiSense", "8 kg"],
    specs: [
      { key: "Fassungsvermögen", value: "8 kg" }, { key: "Trocknungsart", value: "Wärmepumpe" },
    ],
  },
  {
    name: "Bosch Serie 2 Waschmaschine WGG244Z01",
    slug: "bosch-serie2-waschmaschine-wgg244z01",
    description: "Die Bosch Serie 2 Waschmaschine mit ActiveWater Plus.",
    shortDesc: "Waschmaschine mit ActiveWater Plus",
    price: 549.0, sku: "BSH-WGG244Z01",
    rating: 4.6, reviewCount: 345, categorySlug: "waschen-trocknen", brandSlug: "bosch", weight: 72,
    features: ["ActiveWater Plus", "VarioDrum", "9 kg"],
    specs: [
      { key: "Füllmenge", value: "9 kg" }, { key: "Energieeffizienz", value: "A+++" },
    ],
  },
  {
    name: "Siemens iQ300 Waschmaschine WG44G200",
    slug: "siemens-iq300-waschmaschine-wg44g200",
    description: "Die Siemens iQ300 Waschmaschine mit varioSpeed.",
    shortDesc: "Waschmaschine mit varioSpeed",
    price: 499.0, sku: "SI-WG44G200",
    rating: 4.5, reviewCount: 234, categorySlug: "waschen-trocknen", brandSlug: "siemens", weight: 70,
    features: ["varioSpeed", "VarioDrum", "9 kg"],
    specs: [
      { key: "Füllmenge", value: "9 kg" }, { key: "Schleuderdrehzahl", value: "1400 U/min" },
    ],
  },
  {
    name: "Miele W1 Waschmaschine WSD363 WCS",
    slug: "miele-w1-waschmaschine-wsd363",
    description: "Die Miele W1 Waschmaschine mit TwinDos für große Familien.",
    shortDesc: "Waschmaschine für große Familien",
    price: 1999.0, sku: "MIELE-WSD363", isNew: true,
    rating: 4.9, reviewCount: 56, categorySlug: "waschen-trocknen", brandSlug: "miele", weight: 92,
    features: ["TwinDos", "CapDosing", "10 kg", "1600 U/min"],
    tags: ["premium"],
    specs: [
      { key: "Füllmenge", value: "10 kg" }, { key: "Schleuderdrehzahl", value: "1600 U/min" },
    ],
  },
  {
    name: "Miele T1 Trommeltrockner TMV843 WP",
    slug: "miele-t1-trockner-tmv843",
    description: "Der Miele T1 Trommeltrockner mit SteamCare und Wärmepumpe.",
    shortDesc: "Trockner mit SteamCare & Wärmepumpe",
    price: 1799.0, sku: "MIELE-TMV843",
    rating: 4.8, reviewCount: 89, categorySlug: "waschen-trocknen", brandSlug: "miele", weight: 65,
    features: ["SteamCare", "Wärmepumpe", "PerfectDry", "9 kg"],
    specs: [
      { key: "Fassungsvermögen", value: "9 kg" }, { key: "Trocknungsart", value: "Wärmepumpe" },
    ],
  },
  {
    name: "Samsung Waschmaschine WW90T684DLN",
    slug: "samsung-waschmaschine-ww90t684dln",
    description: "Die Samsung Waschmaschine mit SuperSpeed und EcoBubble.",
    shortDesc: "Waschmaschine mit SuperSpeed & EcoBubble",
    price: 649.0, sku: "SAM-WW90T684",
    rating: 4.6, reviewCount: 234, categorySlug: "waschen-trocknen", brandSlug: "samsung", weight: 64,
    features: ["SuperSpeed", "EcoBubble", "AI Control", "9 kg"],
    specs: [
      { key: "Füllmenge", value: "9 kg" }, { key: "Schleuderdrehzahl", value: "1400 U/min" },
    ],
  },
  {
    name: "LG Waschmaschine F4WR711S2HA",
    slug: "lg-waschmaschine-f4wr711s2ha",
    description: "Die LG Waschmaschine mit TurboWash 360 und AI DD.",
    shortDesc: "Waschmaschine mit TurboWash 360",
    price: 699.0, sku: "LG-F4WR711S2",
    rating: 4.6, reviewCount: 189, categorySlug: "waschen-trocknen", brandSlug: "lg", weight: 68,
    features: ["TurboWash 360", "AI DD", "Steam+", "11 kg"],
    specs: [
      { key: "Füllmenge", value: "11 kg" }, { key: "Schleuderdrehzahl", value: "1400 U/min" },
    ],
  },
  {
    name: "Bosch Serie 6 Waschmaschine WAU28568",
    slug: "bosch-serie6-waschmaschine-wau28568",
    description: "Die Bosch Serie 6 Waschmaschine mit i-DOS.",
    shortDesc: "Waschmaschine mit i-DOS",
    price: 799.0, sku: "BSH-WAU28568",
    rating: 4.7, reviewCount: 234, categorySlug: "waschen-trocknen", brandSlug: "bosch", weight: 76,
    features: ["i-DOS", "Home Connect", "Anti-Wrinkle", "9 kg"],
    specs: [
      { key: "Füllmenge", value: "9 kg" }, { key: "Energieeffizienz", value: "A+++" },
    ],
  },
  {
    name: "Siemens Waschmaschine WG44G202",
    slug: "siemens-waschmaschine-wg44g202",
    description: "Die Siemens Waschmaschine mit varioSpeed und Home Connect.",
    shortDesc: "Waschmaschine mit varioSpeed",
    price: 599.0, sku: "SI-WG44G202",
    rating: 4.6, reviewCount: 189, categorySlug: "waschen-trocknen", brandSlug: "siemens", weight: 73,
    features: ["varioSpeed", "Home Connect", "VarioDrum", "9 kg"],
    specs: [
      { key: "Füllmenge", value: "9 kg" }, { key: "Schleuderdrehzahl", value: "1400 U/min" },
    ],
  },
  {
    name: "Beko Trockner DPY 8534 GXA1",
    slug: "beko-trockner-dpy8534gxa1",
    description: "Der Beko Trockner mit Wärmepumpe und 8 kg Fassungsvermögen.",
    shortDesc: "Trockner mit Wärmepumpe",
    price: 379.0, sku: "BEKO-DPY8534",
    rating: 4.4, reviewCount: 345, categorySlug: "waschen-trocknen", brandSlug: "beko", weight: 44,
    features: ["Wärmepumpe", "OptiSense", "8 kg", "LED-Display"],
    specs: [
      { key: "Fassungsvermögen", value: "8 kg" }, { key: "Trocknungsart", value: "Wärmepumpe" },
    ],
  },
];

async function main() {
  console.log("🧺 Adding Waschen & Trocknen products...");

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

  console.log(`\n🎉 Done! Added ${added} new products to Waschen & Trocknen`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
