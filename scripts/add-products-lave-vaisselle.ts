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
    name: "Miele G7310 SCU",
    slug: "miele-g7310-scu",
    description: "Der Miele G7310 SCU - Einbau-Geschirrspüler mit AutoDos.",
    shortDesc: "Einbau-Geschirrspüler mit AutoDos",
    price: 1299.0, sku: "MIELE-G7310SCU",
    rating: 4.8, reviewCount: 156, categorySlug: "geschirrspueler", brandSlug: "miele", weight: 35,
    features: ["AutoDos", "PowerDisk", "3D-Tac Sensor", "WiFiConn@ct"],
    specs: [
      { key: "Fassungsvermögen", value: "14 Gedecke" }, { key: "Energieeffizienz", value: "A+++" },
    ],
  },
  {
    name: "Miele G7360 SCVi AutoDos",
    slug: "miele-g7360-scvi-autodos",
    description: "Der Miele G7360 SCVi - Premium-Einbau-Geschirrspüler mit AutoDos.",
    shortDesc: "Premium-Einbau-Geschirrspüler",
    price: 1899.0, sku: "MIELE-G7360SCVI", isNew: true, isFeatured: true,
    rating: 4.9, reviewCount: 89, categorySlug: "geschirrspueler", brandSlug: "miele", weight: 38,
    features: ["AutoDos", "PowerDisk", "MasterQuality", "WiFiConn@ct"],
    tags: ["premium"],
    specs: [
      { key: "Fassungsvermögen", value: "16 Gedecke" }, { key: "Energieeffizienz", value: "A+++" },
    ],
  },
  {
    name: "Miele G5000 SCi",
    slug: "miele-g5000-sci",
    description: "Der Miele G5000 SCi - Einbau-Geschirrspüler für Einstieg in Premium.",
    shortDesc: "Einstieg in Miele Premium",
    price: 799.0, sku: "MIELE-G5000SCi",
    rating: 4.6, reviewCount: 345, categorySlug: "geschirrspueler", brandSlug: "miele", weight: 32,
    features: ["EcoPower", "3D-Tac Sensor", "12 Programme"],
    specs: [
      { key: "Fassungsvermögen", value: "14 Gedecke" }, { key: "Energieeffizienz", value: "A+++" },
    ],
  },
  {
    name: "Miele TA 2650 WP Trockner",
    slug: "miele-ta-2650-wp",
    description: "Der Miele TA 2650 WP - Geschirrtrockner mit Wärmepumpe.",
    shortDesc: "Geschirrtrockner mit Wärmepumpe",
    price: 899.0, sku: "MIELE-TA2650",
    rating: 4.7, reviewCount: 89, categorySlug: "geschirrspueler", brandSlug: "miele", weight: 30,
    features: ["Wärmepumpe", "AutoOpen", "Geschirrspüler-Trockner"],
    specs: [
      { key: "Fassungsvermögen", value: "14 Gedecke" }, { key: "Trocknung", value: "Kondensation" },
    ],
  },
  {
    name: "Bosch Serie 6 SMV88TX36E",
    slug: "bosch-serie6-smv88tx36e",
    description: "Der Bosch Serie 6 Einbau-Geschirrspüler mit Zeolith-Trocknung.",
    shortDesc: "Geschirrspüler mit Zeolith & CrystalDry",
    price: 1199.0, sku: "BSH-SMV88TX36E",
    rating: 4.8, reviewCount: 234, categorySlug: "geschirrspueler", brandSlug: "bosch", weight: 36,
    features: ["Zeolith-Trocknung", "CrystalDry", "Home Connect", "80% nach 1h"],
    specs: [
      { key: "Fassungsvermögen", value: "14 Gedecke" }, { key: "Geräuschpegel", value: "44 dB(A)" },
    ],
  },
  {
    name: "Bosch Serie 4 SMV46MX01E",
    slug: "bosch-serie4-smv46mx01e",
    description: "Der Bosch Serie 4 Einbau-Geschirrspüler mit ActiveWater Plus.",
    shortDesc: "Geschirrspüler mit ActiveWater Plus",
    price: 699.0, sku: "BSH-SMV46MX01E",
    rating: 4.6, reviewCount: 345, categorySlug: "geschirrspueler", brandSlug: "bosch", weight: 32,
    features: ["ActiveWater Plus", "AquaStop", "VarioSpeed Plus"],
    specs: [
      { key: "Fassungsvermögen", value: "14 Gedecke" }, { key: "Programme", value: "6 + 4 Spezial" },
    ],
  },
  {
    name: "Bosch Kompakt SMS46MW00E",
    slug: "bosch-kompakt-sms46mw00e",
    description: "Der Bosch Kompakt-Geschirrspüler für die Aufstellschublade.",
    shortDesc: "Kompakt-Geschirrspüler",
    price: 549.0, sku: "BSH-SMS46MW00E",
    rating: 4.5, reviewCount: 456, categorySlug: "geschirrspueler", brandSlug: "bosch", weight: 28,
    features: ["AquaStop", "VarioSpeed", "10 Gedecke"],
    specs: [
      { key: "Fassungsvermögen", value: "10 Gedecke" }, { key: "Programme", value: "6 + 3 Spezial" },
    ],
  },
  {
    name: "Siemens iQ700 SN878X04CE",
    slug: "siemens-iq700-sn878x04ce-neu",
    description: "Der Siemens iQ700 Geschirrspüler mit varioDrawer Plus und Zeolith.",
    shortDesc: "Siemens iQ700 mit varioDrawer & Zeolith",
    price: 1099.0, sku: "SI-SN878X04CE-NEU",
    rating: 4.7, reviewCount: 178, categorySlug: "geschirrspueler", brandSlug: "siemens", weight: 35,
    features: ["varioDrawer Plus", "Zeolith Trocknung", "Home Connect"],
    specs: [
      { key: "Fassungsvermögen", value: "14 Gedecke" }, { key: "Trocknung", value: "Zeolith" },
    ],
  },
  {
    name: "Siemens iQ500 SN436W00CE",
    slug: "siemens-iq500-sn436w00ce",
    description: "Der Siemens iQ500 Einbau-Geschirrspüler mit varioSpeed.",
    shortDesc: "Einbau-Geschirrspüler mit varioSpeed",
    price: 699.0, sku: "SI-SN436W00CE",
    rating: 4.6, reviewCount: 234, categorySlug: "geschirrspueler", brandSlug: "siemens", weight: 30,
    features: ["varioSpeed", "AquaStop", "Home Connect"],
    specs: [
      { key: "Fassungsvermögen", value: "14 Gedecke" }, { key: "Programme", value: "6 + 4 Spezial" },
    ],
  },
  {
    name: "Siemens Kompakt SK25EW800",
    slug: "siemens-kompakt-sk25ew800",
    description: "Der Siemens Kompakt-Geschirrspüler für die Aufstellschublade.",
    shortDesc: "Kompakt-Geschirrspüler",
    price: 599.0, sku: "SI-SK25EW800",
    rating: 4.5, reviewCount: 189, categorySlug: "geschirrspueler", brandSlug: "siemens", weight: 26,
    features: ["varioSpeed", "AquaStop", "10 Gedecke"],
    specs: [
      { key: "Fassungsvermögen", value: "10 Gedecke" }, { key: "Geräuschpegel", value: "46 dB(A)" },
    ],
  },
  {
    name: "AEG FFB62607PM",
    slug: "aeg-ffb62607pm",
    description: "Der AEG FFB62607PM - Einbau-Geschirrspüler mit ComfortLift.",
    shortDesc: "Geschirrspüler mit ComfortLift",
    price: 999.0, sku: "AEG-FFB62607PM",
    rating: 4.7, reviewCount: 156, categorySlug: "geschirrspueler", brandSlug: "aeg", weight: 34,
    features: ["ComfortLift", "SatelliteClean", "AirDry"],
    specs: [
      { key: "Fassungsvermögen", value: "14 Gedecke" }, { key: "Energieeffizienz", value: "A+++" },
    ],
  },
  {
    name: "AEG FSK62600P Kompakt",
    slug: "aeg-fsk62600p-kompakt",
    description: "Der AEG FSK62600P Kompakt-Geschirrspüler.",
    shortDesc: "Kompakt-Geschirrspüler von AEG",
    price: 499.0, sku: "AEG-FSK62600P",
    rating: 4.4, reviewCount: 345, categorySlug: "geschirrspueler", brandSlug: "aeg", weight: 25,
    features: ["ComfortLift", "8 Gedecke", "6 Programme"],
    specs: [
      { key: "Fassungsvermögen", value: "8 Gedecke" }, { key: "Geräuschpegel", value: "47 dB(A)" },
    ],
  },
  {
    name: "Electrolux EEQ53200L",
    slug: "electrolux-eeq53200l",
    description: "Der Electrolux EEQ53200L - Einbau-Geschirrspüler mit AirDry.",
    shortDesc: "Einbau-Geschirrspüler mit AirDry",
    price: 649.0, sku: "ELEC-EEQ53200L",
    rating: 4.5, reviewCount: 234, categorySlug: "geschirrspueler", brandSlug: "electrolux", weight: 32,
    features: ["AirDry", "MaxiFlex", "TimeLight"],
    specs: [
      { key: "Fassungsvermögen", value: "14 Gedecke" }, { key: "Energieeffizienz", value: "A+++" },
    ],
  },
  {
    name: "Electrolux Kompakt ESF6200LOU",
    slug: "electrolux-kompakt-esf6200lou",
    description: "Der Electrolux Kompakt-Geschirrspüler.",
    shortDesc: "Kompakt-Geschirrspüler von Electrolux",
    price: 399.0, sku: "ELEC-ESF6200LOU",
    rating: 4.3, reviewCount: 456, categorySlug: "geschirrspueler", brandSlug: "electrolux", weight: 22,
    features: ["AirDry", "8 Gedecke", "Kompakt"],
    specs: [
      { key: "Fassungsvermögen", value: "8 Gedecke" }, { key: "Programme", value: "6" },
    ],
  },
  {
    name: "Samsung DW60M6050FW",
    slug: "samsung-dw60m6050fw",
    description: "Der Samsung DW60M6050FW - Geschirrspüler mit CrystalWash.",
    shortDesc: "Geschirrspüler mit CrystalWash",
    price: 599.0, sku: "SAM-DW60M6050",
    rating: 4.5, reviewCount: 345, categorySlug: "geschirrspueler", brandSlug: "samsung", weight: 30,
    features: ["CrystalWash", "FlexWash", "SmartThings"],
    specs: [
      { key: "Fassungsvermögen", value: "14 Gedecke" }, { key: "Programme", value: "7" },
    ],
  },
  {
    name: "Siemens iQ300 SK26E820EU",
    slug: "siemens-iq300-sk26e820eu",
    description: "Der Siemens iQ300 Kompakt-Geschirrspüler.",
    shortDesc: "Kompakt-Geschirrspüler von Siemens",
    price: 449.0, sku: "SI-SK26E820EU",
    rating: 4.4, reviewCount: 234, categorySlug: "geschirrspueler", brandSlug: "siemens", weight: 24,
    features: ["varioSpeed", "AquaStop", "9 Gedecke"],
    specs: [
      { key: "Fassungsvermögen", value: "9 Gedecke" }, { key: "Geräuschpegel", value: "46 dB(A)" },
    ],
  },
  {
    name: "Beko DFN 05320 W",
    slug: "beko-dfn05320w",
    description: "Das Beko DFN 05320 W - Geschirrspüler mitActiveWash.",
    shortDesc: "Geschirrspüler mit ActiveWash",
    price: 399.0, sku: "BEKO-DFN05320W",
    rating: 4.3, reviewCount: 567, categorySlug: "geschirrspueler", brandSlug: "beko", weight: 28,
    features: ["ActiveWash", "Eco Whisper", "13 Gedecke"],
    specs: [
      { key: "Fassungsvermögen", value: "13 Gedecke" }, { key: "Energieeffizienz", value: "A++" },
    ],
  },
  {
    name: "Haier DW14-BK3AEU",
    slug: "haier-dw14-bk3aeu",
    description: "Das Haier DW14-BK3AEU - Geschirrspüler mit 8 Programmen.",
    shortDesc: "Geschirrspüler mit 8 Programmen",
    price: 449.0, sku: "HAIER-DW14-BK3",
    rating: 4.4, reviewCount: 234, categorySlug: "geschirrspueler", brandSlug: "haier", weight: 30,
    features: ["8 Programme", "3 Sprüharme", "LED-Anzeige"],
    specs: [
      { key: "Fassungsvermögen", value: "14 Gedecke" }, { key: "Energieeffizienz", value: "A+++" },
    ],
  },
  {
    name: "LG DF455HMS Kompakt",
    slug: "lg-df455hms-kompakt",
    description: "Das LG DF455HMS Kompakt-Geschirrspüler mit QuadWash.",
    shortDesc: "Kompakter QuadWash-Geschirrspüler",
    price: 499.0, sku: "LG-DF455HMS", isNew: true,
    rating: 4.5, reviewCount: 123, categorySlug: "geschirrspueler", brandSlug: "lg", weight: 26,
    features: ["QuadWash", "TrueSteam", "EasyRack"],
    specs: [
      { key: "Fassungsvermögen", value: "10 Gedecke" }, { key: "Geräuschpegel", value: "44 dB(A)" },
    ],
  },
  {
    name: "LG Full Size DF455HMS",
    slug: "lg-full-size-df455hms",
    description: "Das LG DF455HMS Full-Size-Geschirrspüler mit QuadWash.",
    shortDesc: "Full-Size-Geschirrspüler mit QuadWash",
    price: 799.0, sku: "LG-DF455HMS-FS",
    rating: 4.6, reviewCount: 156, categorySlug: "geschirrspueler", brandSlug: "lg", weight: 35,
    features: ["QuadWash", "TrueSteam", "Inverter DirectDrive", "SmartThinQ"],
    specs: [
      { key: "Fassungsvermögen", value: "14 Gedecke" }, { key: "Energieeffizienz", value: "A+++" },
    ],
  },
];

async function main() {
  console.log("🍽️ Adding Lave-vaisselle products...");

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

  console.log(`\n🎉 Done! Added ${added} new products to Lave-vaisselle`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
