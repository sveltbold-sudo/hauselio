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
    name: "Jura E4 Platinum",
    slug: "jura-e4-platinum",
    description: "Die Jura E4 - Einstiegsmodell in die Premium-Vollautomaten-Welt.",
    shortDesc: "Einstiegs-Vollautomat mit P.E.P.",
    price: 899.0, sku: "JURA-E4-PL",
    rating: 4.7, reviewCount: 234, categorySlug: "kaffee", brandSlug: "jura", weight: 9.2,
    features: ["P.E.P. Technologie", "Fine Foam Frother", "Aroma-3-Mahlwerk"],
    specs: [
      { key: "Bohnschale", value: "280g" }, { key: "Wassertank", value: "1,9 Liter" },
    ],
  },
  {
    name: "Jura S8 Chrome",
    slug: "jura-s8-chrome",
    description: "Die Jura S8 - kompakter Vollautomat mit Touchdisplay.",
    shortDesc: "Kompakter Vollautomat mit Touchdisplay",
    price: 1499.0, sku: "JURA-S8-CH", isNew: true,
    rating: 4.8, reviewCount: 123, categorySlug: "kaffee", brandSlug: "jura", weight: 9.8,
    features: ["TFT-Touchdisplay", "P.E.P.", "Fine Foam Frother"],
    specs: [
      { key: "Spezialitäten", value: "21" }, { key: "Display", value: "3,5 Zoll TFT" },
    ],
  },
  {
    name: "Jura D6 Dark Inox",
    slug: "jura-d6-dark-inox",
    description: "Die Jura D6 - kompakter Vollautomat für kleine Küchen.",
    shortDesc: "Kompakter Vollautomat mit WLAN",
    price: 999.0, sku: "JURA-D6-DI",
    rating: 4.6, reviewCount: 345, categorySlug: "kaffee", brandSlug: "jura", weight: 8.5,
    features: ["WLAN", "J.O.E. App", "P.E.P."],
    specs: [
      { key: "Bohnschale", value: "280g" }, { key: "Wassertank", value: "1,9 Liter" },
    ],
  },
  {
    name: "De'Longhi Magnifica Evo ECAM292.33",
    slug: "delonghi-magnifica-evo-ecam29233",
    description: "Die De'Longhi Magnifica Evo - neuer Vollautomat mit LatteCrema System.",
    shortDesc: "Vollautomat mit LatteCrema System",
    price: 599.0, sku: "DEL-ECAM29233", isNew: true,
    rating: 4.7, reviewCount: 189, categorySlug: "kaffee", brandSlug: "delonghi", weight: 9.5,
    features: ["LatteCrema System", "13 Mahlstufen", "Double Shot"],
    specs: [
      { key: "Bohnschale", value: "300g" }, { key: "Wassertank", value: "2 Liter" },
    ],
  },
  {
    name: "De'Longhi Dinamica ECAM350.55",
    slug: "delonghi-dinamica-ecam35055",
    description: "Die De'Longhi Dinamica - Vollautomat mit kaltem Brew und LatteCrema.",
    shortDesc: "Vollautomat mit Cold Brew & LatteCrema",
    price: 899.0, originalPrice: 999.0, sku: "DEL-ECAM35055", isPromo: true,
    rating: 4.7, reviewCount: 234, categorySlug: "kaffee", brandSlug: "delonghi", weight: 10.0,
    features: ["Cold Brew", "LatteCrema", "13 Mahlstufen"],
    specs: [
      { key: "Spezialitäten", value: "13" }, { key: "Mahlwerk", value: "Stahlmahlwerk" },
    ],
  },
  {
    name: "De'Longhi PrimaDonna Soul ECAM610.75",
    slug: "delonghi-primadonna-soul-ecam61075",
    description: "Die De'Longhi PrimaDonna Soul - Premium-Vollautomat mit Bean Adapt Technologie.",
    shortDesc: "Premium-Vollautomat mit Bean Adapt",
    price: 1299.0, sku: "DEL-ECAM61075", isFeatured: true,
    rating: 4.8, reviewCount: 156, categorySlug: "kaffee", brandSlug: "delonghi", weight: 11.0,
    features: ["Bean Adapt", "LatteCrema", "WiFi"],
    tags: ["premium"],
    specs: [
      { key: "Spezialitäten", value: "13" }, { key: "Display", value: "3,5 Zoll TFT" },
    ],
  },
  {
    name: "Siemens EQ.9 plus s700",
    slug: "siemens-eq9-plus-s700",
    description: "Die Siemens EQ.9 plus s700 - Premium-Vollautomat mit oneTouch Doppelportion.",
    shortDesc: "Premium-Vollautomat mit oneTouch",
    price: 1399.0, sku: "SI-EQ9S700", isNew: true,
    rating: 4.8, reviewCount: 89, categorySlug: "kaffee", brandSlug: "siemens-eq", weight: 10.5,
    features: ["oneTouch Doppelportion", "sensoFlow", "home Connect"],
    tags: ["premium"],
    specs: [
      { key: "Spezialitäten", value: "22" }, { key: "Mahlwerk", value: "ceramDrive" },
    ],
  },
  {
    name: "Siemens EQ.500 plus s500",
    slug: "siemens-eq500-plus-s500",
    description: "Die Siemens EQ.500 plus s500 - kompakter Vollautomat mit Home Connect.",
    shortDesc: "Kompakter Vollautomat mit Home Connect",
    price: 699.0, sku: "SI-EQ500S500",
    rating: 4.6, reviewCount: 234, categorySlug: "kaffee", brandSlug: "siemens-eq", weight: 9.0,
    features: ["Home Connect", "oneTouch", "sensoFlow"],
    specs: [
      { key: "Spezialitäten", value: "12" }, { key: "Wassertank", value: "1,7 Liter" },
    ],
  },
  {
    name: "Siemens EQ.300 s300",
    slug: "siemens-eq300-s300",
    description: "Die Siemens EQ.300 s300 - Einstiegs-Vollautomat mit guter Qualität.",
    shortDesc: "Einstiegs-Vollautomat von Siemens",
    price: 449.0, sku: "SI-EQ300S300",
    rating: 4.5, reviewCount: 345, categorySlug: "kaffee", brandSlug: "siemens-eq", weight: 8.0,
    features: ["oneTouch", "sensoFlow", "Kompaktes Design"],
    specs: [
      { key: "Spezialitäten", value: "6" }, { key: "Wassertank", value: "1,4 Liter" },
    ],
  },
  {
    name: "Saeco Xelsis SM8780/00",
    slug: "saeco-xelsis-sm8780",
    description: "Die Saeco Xelsis - Premium-Vollautomat mit HygieneSafe System.",
    shortDesc: "Premium-Vollautomat mit HygieneSafe",
    price: 1099.0, sku: "SAECO-SM8780",
    rating: 4.7, reviewCount: 189, categorySlug: "kaffee", brandSlug: "saeco", weight: 10.0,
    features: ["HygieneSafe System", "LatteDuo", "6 profiles"],
    specs: [
      { key: "Spezialitäten", value: "16" }, { key: "Mahlwerk", value: "keramisch" },
    ],
  },
  {
    name: "Saeco GranArista SM5580/00",
    slug: "saeco-granarista-sm5580",
    description: "Die Saeco GranArista - kompakter Vollautomat mit.autoCappuccino.",
    shortDesc: "Kompakter Vollautomat mit autoCappuccino",
    price: 549.0, sku: "SAECO-SM5580",
    rating: 4.5, reviewCount: 234, categorySlug: "kaffee", brandSlug: "saeco", weight: 8.5,
    features: ["autoCappuccino", "12 Mahlstufen", "HygieneSafe"],
    specs: [
      { key: "Spezialitäten", value: "8" }, { key: "Wassertank", value: "1,8 Liter" },
    ],
  },
  {
    name: "Krups Virtuoso XP442C10",
    slug: "krups-virtuoso-xp442c10",
    description: "Die Krups Virtuoso - kompakter Vollautomat mit Quarzheizung.",
    shortDesc: "Kompakter Vollautomat mit Quarzheizung",
    price: 399.0, sku: "KRUPS-XP442C10",
    rating: 4.4, reviewCount: 456, categorySlug: "kaffee", brandSlug: "krups", weight: 8.0,
    features: ["Quarzheizung", "15 Mahlstufen", "autoCappuccino"],
    specs: [
      { key: "Spezialitäten", value: "6" }, { key: "Wassertank", value: "1,7 Liter" },
    ],
  },
  {
    name: "Krups Evidence Plus EA894C",
    slug: "krups-evidence-plus-ea894c",
    description: "Die Krups Evidence Plus - Premium-Vollautomat mit Quatteo Technologie.",
    shortDesc: "Premium-Vollautomat mit Quatteo",
    price: 799.0, sku: "KRUPS-EA894C", isNew: true,
    rating: 4.6, reviewCount: 156, categorySlug: "kaffee", brandSlug: "krups", weight: 10.5,
    features: ["Quatteo Technologie", "WiFi", "Touchdisplay"],
    specs: [
      { key: "Spezialitäten", value: "15" }, { key: "Mahlwerk", value: "Metall" },
    ],
  },
  {
    name: "Tchibo Barista Bean-to-Cup",
    slug: "tchibo-barista-bean-to-cup",
    description: "Der Tchibo Barista - Vollautomat mit frischer Bohnen und WiFi.",
    shortDesc: "Vollautomat mit WiFi & P.E.P.",
    price: 549.0, sku: "TCHIBO-BARISTA",
    rating: 4.5, reviewCount: 678, categorySlug: "kaffee", brandSlug: "tchibo", weight: 9.0,
    features: ["WiFi", "P.E.P.", "One-Touch"],
    specs: [
      { key: "Spezialitäten", value: "8" }, { key: "Wassertank", value: "1,8 Liter" },
    ],
  },
  {
    name: "Tchibo Privilegio Bean-to-Cup",
    slug: "tchibo-privilegio-bean-to-cup",
    description: "Der Tchibo Privilegio - Premium-Vollautomat mit dualer Heizung.",
    shortDesc: "Premium-Vollautomat mit dualer Heizung",
    price: 799.0, sku: "TCHIBO-PRIV",
    rating: 4.7, reviewCount: 345, categorySlug: "kaffee", brandSlug: "tchibo", weight: 10.0,
    features: ["Duale Heizung", "WiFi", "MilkRhythm+"],
    tags: ["premium"],
    specs: [
      { key: "Spezialitäten", value: "12" }, { key: "Mahlwerk", value: "Ceramill" },
    ],
  },
  {
    name: "Melitta Purista Aromatica Pure Black",
    slug: "melitta-purista-pure-black-neu",
    description: "Die Melitta Purista - minimalistischer Filterkaffeebereiter.",
    shortDesc: "Minimalistischer Filterkaffee-Automat",
    price: 249.0, sku: "MEL-PURISTA-NEU",
    rating: 4.6, reviewCount: 445, categorySlug: "kaffee", brandSlug: "melitta",
    features: ["Aromaperforation", "3 Tassen", "Schmorröster-Technik"],
    specs: [
      { key: "Kaffeeart", value: "Filterkaffee" }, { key: "Behältervolumen", value: "1075ml" },
    ],
  },
  {
    name: "Melitta Look V Style Perfekt",
    slug: "melitta-look-v-style-perfekt",
    description: "Die Melitta Look V Style - eleganter Filterkaffeebereiter mit Thermokanne.",
    shortDesc: "Eleganter Filterkaffee mit Thermokanne",
    price: 129.0, sku: "MEL-LOOKV",
    rating: 4.5, reviewCount: 567, categorySlug: "kaffee", brandSlug: "melitta",
    features: ["Thermokanne", "Aromabooster", "315ml/hr"],
    specs: [
      { key: "Kaffeeart", value: "Filterkaffee" }, { key: "Behältervolumen", value: "1,25 Liter" },
    ],
  },
  {
    name: "Melitta Enjoy 5 purge",
    slug: "melitta-enjoy-5-purge",
    description: "Die Melitta Enjoy 5 - kompakter Filterkaffeebereiter.",
    shortDesc: "Kompakter Filterkaffeebereiter",
    price: 49.0, sku: "MEL-ENJOY5",
    rating: 4.3, reviewCount: 892, categorySlug: "kaffee", brandSlug: "melitta",
    features: ["5 Tassen", "Aromabooster", "Kompakt"],
    specs: [
      { key: "Kaffeeart", value: "Filterkaffee" }, { key: "Tassenzahl", value: "5" },
    ],
  },
  {
    name: "Breville Barista Express",
    slug: "breville-barista-express",
    description: "Die Breville Barista Express - Semi-Automatische Espressomaschine mit Mahlwerk.",
    shortDesc: "Semi-Automat mit integriertem Mahlwerk",
    price: 599.0, sku: "BREV-BE",
    rating: 4.7, reviewCount: 234, categorySlug: "kaffee", brandSlug: "breville", weight: 12.0,
    features: ["Integriertes Mahlwerk", "Thermoblock", "Milchschaumzeug"],
    specs: [
      { key: "Brühtyp", value: "Espresso" }, { key: "Wassertank", value: "2 Liter" },
    ],
  },
  {
    name: "Breville Barista Touch",
    slug: "breville-barista-touch",
    description: "Die Breville Barista Touch - Touchscreen Espressomaschine.",
    shortDesc: "Espressomaschine mit Touchdisplay",
    price: 899.0, sku: "BREV-BT", isNew: true,
    rating: 4.8, reviewCount: 123, categorySlug: "kaffee", brandSlug: "breville", weight: 12.5,
    features: ["Touchdisplay", "Schnellaufheizung", "Automatischer Milchschaum"],
    tags: ["premium"],
    specs: [
      { key: "Display", value: "Touch" }, { key: "Aufheizzeit", value: "3 Sekunden" },
    ],
  },
  {
    name: "Sage Barista Express Impress",
    slug: "sage-barista-express-impress",
    description: "Die Sage Barista Express Impress - Premium Semi-Automatik.",
    shortDesc: "Premium Semi-Automatik mit Impression",
    price: 799.0, sku: "SAGE-BEI",
    rating: 4.8, reviewCount: 89, categorySlug: "kaffee", brandSlug: "sage", weight: 12.0,
    features: ["Impression Dosing", "ThermoJet", "Integriertes Mahlwerk"],
    specs: [
      { key: "Aufheizzeit", value: "3 Sekunden" }, { key: "Brühtyp", value: "Espresso" },
    ],
  },
  {
    name: "Sage The Oracle Touch",
    slug: "sage-the-oracle-touch",
    description: "Die Sage The Oracle Touch - vollautomatische Semi-Automatik.",
    shortDesc: "Vollautomatische Semi-Automatik mit Touch",
    price: 1999.0, sku: "SAGE-OT", isFeatured: true,
    rating: 4.9, reviewCount: 67, categorySlug: "kaffee", brandSlug: "sage", weight: 15.0,
    features: ["Automatische Mahlung", "Automatische Brühung", "Touchdisplay"],
    tags: ["premium"],
    specs: [
      { key: "Display", value: "Farb-Touch" }, { key: "Funktionen", value: "Espresso, Filter, Milch" },
    ],
  },
  {
    name: "Sage The Dual Boiler",
    slug: "sage-the-dual-boiler",
    description: "Die Sage The Dual Boiler - professionelle Espressomaschine mit zwei Kesseln.",
    shortDesc: "Professionelle Espressomaschine mit Dual Boiler",
    price: 1299.0, sku: "SAGE-DB",
    rating: 4.8, reviewCount: 123, categorySlug: "kaffee", brandSlug: "sage", weight: 14.0,
    features: ["Dual Boiler", "PID-Steuerung", "Professionelle Brühgruppe"],
    tags: ["premium"],
    specs: [
      { key: "Kessel", value: "2x Edelstahl" }, { key: "Leistung", value: "2400 Watt" },
    ],
  },
  {
    name: "Gastroback Design Espressomaschine 42603",
    slug: "gastroback-design-espresso-42603",
    description: "Die Gastroback Design Espressomaschine - kompakte Semi-Automatik.",
    shortDesc: "Kompakte Semi-Automatik mit 15 Bar",
    price: 149.0, sku: "GB-42603",
    rating: 4.4, reviewCount: 345, categorySlug: "kaffee", brandSlug: "gastroback",
    features: ["15 Bar", "Milchschaumdüse", "Kompakt"],
    specs: [
      { key: "Druck", value: "15 Bar" }, { key: "Wassertank", value: "1 Liter" },
    ],
  },
  {
    name: "Gastroback Advanced Espresso 42602",
    slug: "gastroback-advanced-espresso-42602",
    description: "Die Gastroback Advanced Espresso - Semi-Automatik mit Thermoblock.",
    shortDesc: "Semi-Automatik mit Thermoblock",
    price: 99.0, sku: "GB-42602",
    rating: 4.3, reviewCount: 567, categorySlug: "kaffee", brandSlug: "gastroback",
    features: ["Thermoblock", "15 Bar", "Milchschaumzeug"],
    specs: [
      { key: "Druck", value: "15 Bar" }, { key: "Wassertank", value: "0,9 Liter" },
    ],
  },
  {
    name: "Nespresso Lattissima Touch EN560",
    slug: "nespresso-lattissima-touch-en560",
    description: "Die Nespresso Lattissima Touch - Kapselmaschine mit Milchschaumsystem.",
    shortDesc: "Kapselmaschine mit automatischem Milchschaum",
    price: 249.0, sku: "NES-EN560",
    rating: 4.6, reviewCount: 892, categorySlug: "kaffee", brandSlug: "nespresso", weight: 4.5,
    features: ["De'Longhi Milchschaumsystem", "19 Bar", "6 Tassengrößen"],
    specs: [
      { key: "Kapseltyp", value: "Original" }, { key: "Milchsystem", value: "De'Longhi" },
    ],
  },
  {
    name: "Nespresso Essenza Mini D50",
    slug: "nespresso-essenza-mini-d50",
    description: "Die Nespresso Essenza Mini - kompakteste Nespresso-Maschine.",
    shortDesc: "Kompakteste Nespresso-Maschine",
    price: 99.0, sku: "NES-D50",
    rating: 4.4, reviewCount: 1234, categorySlug: "kaffee", brandSlug: "nespresso", weight: 2.3,
    features: ["19 Bar", "2 Tassengrößen", "Kompakt"],
    specs: [
      { key: "Kapseltyp", value: "Original" }, { key: "Gewicht", value: "2,3 kg" },
    ],
  },
  {
    name: "Nespresso Vertuo Next",
    slug: "nespresso-vertuo-next",
    description: "Die Nespresso Vertuo Next - Kapselmaschine mit Centrifusion.",
    shortDesc: "Kapselmaschine mit Centrifusion-Technologie",
    price: 149.0, sku: "NES-VNEXT",
    rating: 4.5, reviewCount: 892, categorySlug: "kaffee", brandSlug: "nespresso", weight: 4.0,
    features: ["Centrifusion", "5 Tassengrößen", "Bluetooth"],
    specs: [
      { key: "Kapseltyp", value: "Vertuo" }, { key: "Tassengrößen", value: "5" },
    ],
  },
  {
    name: "Nespresso Vertuo Pop",
    slug: "nespresso-vertuo-pop",
    description: "Die Nespresso Vertuo Pop - kompakte Vertuo-Maschine.",
    shortDesc: "Kompakte Vertuo-Maschine",
    price: 79.0, sku: "NES-VPOP",
    rating: 4.3, reviewCount: 678, categorySlug: "kaffee", brandSlug: "nespresso", weight: 3.5,
    features: ["Centrifusion", "5 Tassengrößen", "Kompakt"],
    specs: [
      { key: "Kapseltyp", value: "Vertuo" }, { key: "Gewicht", value: "3,5 kg" },
    ],
  },
  {
    name: "Nespresso Citiz EN895",
    slug: "nespresso-citiz-en895",
    description: "Die Nespresso Citiz - elegante Kapselmaschine mit Milchschaumer.",
    shortDesc: "Elegante Kapselmaschine mit Milchschaumer",
    price: 199.0, sku: "NES-EN895",
    rating: 4.6, reviewCount: 567, categorySlug: "kaffee", brandSlug: "nespresso", weight: 4.0,
    features: ["19 Bar", "Aeroccino Milchschaumer", "Kompakt"],
    specs: [
      { key: "Kapseltyp", value: "Original" }, { key: "Milchschaumer", value: "Aeroccino" },
    ],
  },
  {
    name: "Lavazza A Modo Mio JL01",
    slug: "lavazza-a-modo-mio-jl01",
    description: "Die Lavazza A Modo Mio - Kapselmaschine für italienischen Espresso.",
    shortDesc: "Kapselmaschine für italienischen Espresso",
    price: 129.0, sku: "LAV-JL01",
    rating: 4.4, reviewCount: 345, categorySlug: "kaffee", brandSlug: "lavazza", weight: 4.5,
    features: ["10 Bar", "Espresso-Kapseln", "Kompakt"],
    specs: [
      { key: "Kapseltyp", value: "Lavazza" }, { key: "Druck", value: "10 Bar" },
    ],
  },
  {
    name: "Lavazza Idola CLT2020",
    slug: "lavazza-idola-clt2020",
    description: "Die Lavazza Idola - elegante Kapselmaschine mit Milo Funktion.",
    shortDesc: "Elegante Kapselmaschine mit Milo",
    price: 179.0, sku: "LAV-CLT2020", isNew: true,
    rating: 4.5, reviewCount: 189, categorySlug: "kaffee", brandSlug: "lavazza", weight: 4.8,
    features: ["19 Bar", "Milo-Kapseln", "Touchbedienung"],
    specs: [
      { key: "Kapseltyp", value: "Lavazza Blue" }, { key: "Druck", value: "19 Bar" },
    ],
  },
];

async function main() {
  console.log("☕ Adding Café products...");

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

  console.log(`\n🎉 Done! Added ${added} new products to Café`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
