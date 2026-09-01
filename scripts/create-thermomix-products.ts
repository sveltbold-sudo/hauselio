import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const THERMOMIX_BRAND_ID = "cmte97uje0009uqxgn2zq050z";
const KUECHE_CATEGORY_ID = "cmte97tta0002uqxgsnq56v3j";
const SALE_FACTOR = 0.81; // 19% discount

const newProducts = [
  // ─── 10 NEW THERMOMIX MODELS ───
  {
    name: "Thermomix TM31",
    slug: "thermomix-tm31",
    description: "Der Vorwerk Thermomix TM31 ist ein bewährter Küchenroboter, der Schneiden, Mixen, Kochen, Dünsten und mehr in einem Gerät vereint. Mit 200 automated Funktionen und einer intuitiven Bedienung ist er der perfekte Helfer in der Küche. Inklusive Mixtopf, Varoma-Dampfgarer, Messbecher und Spatel.",
    shortDesc: "Bewährter Küchenroboter mit 200 Funktionen – Mixen, Kochen, Dünsten in einem Gerät.",
    originalPrice: 899,
    sku: "VTM-TM31",
    isFeatured: false,
    isNew: false,
    isPromo: true,
    features: ["200 automatisierte Funktionen", "0-10.000 U/min", "2,2 Liter Mixtopf", "Varoma-Dampfgarer", "Gewichtsfunktion bis 2kg", "Temperatur 37-100°C"],
    tags: ["thermomix", "tm31", "küchenroboter", "vorwerk", "kochen", "mixen"],
    seoTitle: "Thermomix TM31 gebraucht – Küchenroboter mit 200 Funktionen | HAUSAURA",
    seoDesc: "Vorwerk Thermomix TM31 gebraucht kaufen. 200 automatisierte Funktionen, Mixtopf, Varoma und mehr. Geprüft und mit Garantie.",
    subCategory: "Küchenroboter",
    images: [
      { url: "/images/products/thermomix-tm31/1.jpg", alt: "Thermomix TM31 Front", position: 0 },
      { url: "/images/products/thermomix-tm31/1-medium.webp", alt: "Thermomix TM31 Medium", position: 1 },
    ],
    specs: [
      { key: "Leistung", value: "500 Watt" },
      { key: "Drehzahl", value: "0-10.000 U/min" },
      { key: "Mixtopf-Volumen", value: "2,2 Liter" },
      { key: "Temperatur", value: "37-100°C" },
      { key: "Gewicht", value: "7,7 kg" },
      { key: "Abmessungen", value: "33 x 33 x 33 cm" },
    ],
  },
  {
    name: "Thermomix TM21",
    slug: "thermomix-tm21",
    description: "Der Vorwerk Thermomix TM21 ist der Vorgänger des TM31 und bietet ebenfalls eine Vielzahl an Funktionen. Mit seinem bewähreten Mixtopf und der einfachen Bedienung ist er ein zuverlässiger Küchenhelfer für alle, die Wert auf Qualität legen.",
    shortDesc: "Bewährter Küchenroboter mit soliden Funktionen – ideal für Einsteiger.",
    originalPrice: 599,
    sku: "VTM-TM21",
    isFeatured: false,
    isNew: false,
    isPromo: true,
    features: ["150 automatisierte Funktionen", "0-10.200 U/min", "2,0 Liter Mixtopf", "Temperatur 37-100°C", "Gewichtsfunction bis 2kg"],
    tags: ["thermomix", "tm21", "küchenroboter", "vorwerk", "gebraucht"],
    seoTitle: "Thermomix TM21 gebraucht – Küchenroboter | HAUSAURA",
    seoDesc: "Vorwerk Thermomix TM21 gebraucht kaufen. Bewährte Qualität, geprüft und mit Garantie.",
    subCategory: "Küchenroboter",
    images: [
      { url: "/images/products/thermomix-tm21/1.jpg", alt: "Thermomix TM21", position: 0 },
    ],
    specs: [
      { key: "Leistung", value: "500 Watt" },
      { key: "Drehzahl", value: "0-10.200 U/min" },
      { key: "Mixtopf-Volumen", value: "2,0 Liter" },
      { key: "Temperatur", value: "37-100°C" },
      { key: "Gewicht", value: "7,5 kg" },
    ],
  },
  {
    name: "Thermomix TM5",
    slug: "thermomix-tm5-navigator",
    description: "Der Vorwerk Thermomix TM5 Navigator bietet eine innovative Touchscreen-Steuerung und über 80 automatische Funktionen. Mit dem integrierten Cookidoo®-Zugang und der guideten Kochanleitung ist er der perfekte Assistent für ambitionierte Hobbyköche.",
    shortDesc: "Touchscreen-Küchenroboter mit Cookidoo®-Integration und 80+ Funktionen.",
    originalPrice: 1399,
    sku: "VTM-TM5-NAV",
    isFeatured: false,
    isNew: false,
    isPromo: true,
    features: ["80+ automatische Funktionen", "4,3-Zoll-Touchdisplay", "Cookidoo®-Integration", "3D-Messer", "Temperatur 37-160°C", "Varoma-Temperatur"],
    tags: ["thermomix", "tm5", "küchenroboter", "vorwerk", "cookidoo"],
    seoTitle: "Thermomix TM5 Navigator kaufen | HAUSAURA",
    seoDesc: "Vorwerk Thermomix TM5 Navigator mit Touchdisplay und Cookidoo®-Zugang. Geprüft mit Garantie.",
    subCategory: "Küchenroboter",
    images: [],
    specs: [
      { key: "Display", value: "4,3-Zoll Touchdisplay" },
      { key: "Leistung", value: "500 Watt" },
      { key: "Mixtopf-Volumen", value: "2,2 Liter" },
      { key: "Temperatur", value: "37-160°C" },
    ],
  },
  {
    name: "Thermomix TM31 Komplett-Set",
    slug: "thermomix-tm31-komplett-set",
    description: "Das Komplett-Set des Thermomix TM31 mit allen Originalzubehörteilen: Mixtopf, Varoma-Dampfgarer, Messbecher, Spatel, Garhülse und More. Perfekt für alle, die sofort loslegen möchten.",
    shortDesc: "TM31 mit allen Originalzubehörteilen – sofort einsatzbereit.",
    originalPrice: 1099,
    sku: "VTM-TM31-SET",
    isFeatured: false,
    isNew: false,
    isPromo: true,
    features: ["Komplett mit Varoma", "Inklusive Garhülse", "Original Messbecher und Spatel", "200 automatische Funktionen", "Temperatur 37-100°C"],
    tags: ["thermomix", "tm31", "set", "komplett", "vorwerk", "dampfgaren"],
    seoTitle: "Thermomix TM31 Komplett-Set kaufen | HAUSAURA",
    seoDesc: "Vorwerk Thermomix TM31 als Komplett-Set mit Varoma, Garhülse und allem Zubehör.",
    subCategory: "Küchenroboter",
    images: [],
    specs: [
      { key: "Set-Inhalt", value: "Mixtopf, Varoma, Garhülse, Messbecher, Spatel" },
      { key: "Leistung", value: "500 Watt" },
      { key: "Mixtopf-Volumen", value: "2,2 Liter" },
    ],
  },
  // ─── ACCESSORIES / PARTS ───
  {
    name: "Thermomix Friend Complete",
    slug: "thermomix-friend-complete",
    description: "Das Thermomix Friend Complete ist die ideale Ergänzung für Ihren Thermomix TM6 oder TM5. Mit dem integrierten Mixtopf können Sie zwei Gerichte gleichzeitig zubereiten. Bluetooth-Verbindung, guidete Rezepte und bis zu 120°C Temperatur.",
    shortDesc: "Zweiter Kochtopf für parallelles Kochen mit TM6/TM5 – Bluetooth-fähig.",
    originalPrice: 549,
    sku: "VTM-FRIEND",
    isFeatured: true,
    isNew: true,
    isPromo: false,
    features: ["Parallel Kochen mit Thermomix", "Bluetooth-Verbindung (TM6)", "Mixtopf für TM6/TM5", "Temperatur bis 120°C", "Leicht und kompakt"],
    tags: ["thermomix", "friend", "zubehör", "vorwerk", "parallel-kochen"],
    seoTitle: "Thermomix Friend Complete kaufen | HAUSAURA",
    seoDesc: "Thermomix Friend Complete mit Mixtopf für parallelles Kochen. Kompatibel mit TM6 und TM5.",
    subCategory: "Zubehör",
    images: [
      { url: "/images/products/thermomix-friend/1.jpg", alt: "Thermomix Friend", position: 0 },
      { url: "/images/products/thermomix-friend/2.jpg", alt: "Thermomix Friend mit TM6", position: 1 },
      { url: "/images/products/thermomix-friend/3.jpg", alt: "Thermomix Friend Detail", position: 2 },
    ],
    specs: [
      { key: "Kompatibilität", value: "TM6, TM5" },
      { key: "Temperatur", value: "bis 120°C" },
      { key: "Leistung", value: "700 Watt" },
      { key: "Abmessungen", value: "21 x 21 x 10 cm" },
    ],
  },
  {
    name: "Thermomix Sensor",
    slug: "thermomix-sensor",
    description: "Das Thermomix Sensor ist ein Bluetooth-Thermometer für präzises Garen im Ofen, auf dem Herd oder am Grill. Zwei Sensoren messen die Kerntemperatur und Umgebungstemperatur. Perfekt für Brot, Kuchen, Fleisch und Fisch.",
    shortDesc: "Bluetooth-Thermometer für präzises Garen – Kerntemperatur + Umgebung.",
    originalPrice: 159,
    sku: "VTM-SENSOR",
    isFeatured: true,
    isNew: true,
    isPromo: false,
    features: ["Bluetooth 5.0", "2 Sensoren: Kern + Umgebung", "Temperatur bis 212°F (Kern)", "Temperatur bis 482°F (Umgebung)", "Kompatibel mit TM6/TM7"],
    tags: ["thermomix", "sensor", "thermometer", "vorwerk", "backen", "grillen"],
    seoTitle: "Thermomix Sensor Bluetooth-Thermometer kaufen | HAUSAURA",
    seoDesc: "Thermomix Sensor für präzises Garen. Bluetooth-Thermometer mit 2 Sensoren für Ofen, Herd und Grill.",
    subCategory: "Zubehör",
    images: [
      { url: "/images/products/thermomix-sensor/1.jpg", alt: "Thermomix Sensor", position: 0 },
    ],
    specs: [
      { key: "Konnektivität", value: "Bluetooth 5.0 LE" },
      { key: "Kerntemperatur", value: "bis 100°C / 212°F" },
      { key: "Umgebungstemperatur", value: "bis 250°C / 482°F" },
      { key: "Akkulaufzeit", value: "ca. 24 Stunden" },
    ],
  },
  {
    name: "Thermomix Cook-Key",
    slug: "thermomix-cook-key",
    description: "Der Thermomix Cook-Key ermöglicht den drahtlosen Zugriff auf über 80.000 Rezepte auf Cookidoo® direkt vom TM5. Einfach einstecken, verbinden und loslegen – für unbegrenzte Kochideen.",
    shortDesc: "Drahtloser Cookidoo®-Zugang für Thermomix TM5.",
    originalPrice: 179,
    sku: "VTM-COOKKEY",
    isFeatured: false,
    isNew: false,
    isPromo: false,
    features: ["Drahtlose Verbindung mit TM5", "Zugriff auf 80.000+ Rezepte", "Regelmäßige Software-Updates", "Einfache Installation"],
    tags: ["thermomix", "cook-key", "cookidoo", "vorwerk", "tm5", "zubehör"],
    seoTitle: "Thermomix Cook-Key kaufen | HAUSAURA",
    seoDesc: "Thermomix Cook-Key für TM5 – drahtloser Zugang zu 80.000+ Rezepte auf Cookidoo®.",
    subCategory: "Zubehör",
    images: [],
    specs: [
      { key: "Kompatibilität", value: "TM5" },
      { key: "Rezepte", value: "80.000+" },
      { key: "Verbindung", value: "WLAN" },
    ],
  },
  {
    name: "Thermomix Varoma Komplett",
    slug: "thermomix-varoma-komplett",
    description: "Das Thermomix Varoma Dampfgarer-Set für TM6 und TM5. Inklusive Oberteil, Unterteil, Ablaufschale und Rezeptheft. Perfekt für gesundes Dampfgaren von Gemüse, Fisch und Fleisch.",
    shortDesc: "Kompletter Dampfgarer für gesundes Garen – für TM6 und TM5.",
    originalPrice: 149,
    sku: "VTM-VAROMA",
    isFeatured: false,
    isNew: false,
    isPromo: true,
    features: ["2,8 Liter Fassungsvermögen", "Inklusive Ablaufschale", "BPA-frei", "Spülmaschinengeeignet", "Für TM6 und TM5"],
    tags: ["thermomix", "varoma", "dampfgarer", "vorwerk", "zubehör", "dampfgaren"],
    seoTitle: "Thermomix Varoma Dampfgarer kaufen | HAUSAURA",
    seoDesc: "Thermomix Varoma Komplett-Set für gesundes Dampfgaren. Kompatibel mit TM6 und TM5.",
    subCategory: "Zubehör",
    images: [],
    specs: [
      { key: "Fassungsvermögen", value: "2,8 Liter" },
      { key: "Material", value: "Kunststoff (BPA-frei)" },
      { key: "Spülmaschine", value: "Ja" },
    ],
  },
  {
    name: "Thermomix Mixtopf TM6",
    slug: "thermomix-mixtopf-tm6",
    description: "Originaler Thermomix Mixtopf für TM6. Edelstahl, 2,2 Liter Fassungsvermögen. Als Ersatz oder zweiter Mixtopf ideal für paralleles Kochen mit dem Thermomix Friend.",
    shortDesc: "Original Edelstahl-Mixtopf für TM6 – 2,2 Liter.",
    originalPrice: 139,
    sku: "VTM-MIXTOPF-TM6",
    isFeatured: false,
    isNew: false,
    isPromo: false,
    features: ["2,2 Liter Fassungsvermögen", "Edelstahl", "Original Vorwerk", "Spülmaschinenfest"],
    tags: ["thermomix", "mixtopf", "tm6", "vorwerk", "zubehör", "ersatz"],
    seoTitle: "Thermomix Mixtopf TM6 kaufen | HAUSAURA",
    seoDesc: "Original Thermomix Mixtopf für TM6. Edelstahl, 2,2 Liter, spülmaschinenfest.",
    subCategory: "Ersatzteile",
    images: [],
    specs: [
      { key: "Volumen", value: "2,2 Liter" },
      { key: "Material", value: "Edelstahl" },
      { key: "Kompatibilität", value: "TM6" },
    ],
  },
  {
    name: "Thermomix Messbecher TM6",
    slug: "thermomix-messbecher-tm6",
    description: "Originaler Thermomix Messbecher mit Deckel für TM6. Dient als Abdeckung des Mixtopfs und als präzises Messgerät bis 500ml.",
    shortDesc: "Original Messbecher mit Deckel für TM6 – 500ml.",
    originalPrice: 24,
    sku: "VTM-MESSBECHER-TM6",
    isFeatured: false,
    isNew: false,
    isPromo: false,
    features: ["500ml Fassungsvermögen", "Messskala bis 500ml", "Als Deckel verwendbar", "Spülmaschinenfest"],
    tags: ["thermomix", "messbecher", "tm6", "vorwerk", "zubehör", "ersatz"],
    seoTitle: "Thermomix Messbecher TM6 kaufen | HAUSAURA",
    seoDesc: "Original Thermomix Messbecher mit Deckel für TM6. 500ml, spülmaschinenfest.",
    subCategory: "Ersatzteile",
    images: [],
    specs: [
      { key: "Fassungsvermögen", value: "500 ml" },
      { key: "Material", value: "Kunststoff" },
      { key: "Kompatibilität", value: "TM6" },
    ],
  },
  {
    name: "Thermomix Spatel TM6",
    slug: "thermomix-spatel-tm6",
    description: "Originaler Thermomix Spatel für TM6. Langlebiger Kunststoff-Spatel zum Saubermischen und Entleeren des Mixtopfs. Perfekt geformt für die TM6-Größe.",
    shortDesc: "Original Spatel für TM6 – robust und passgenau.",
    originalPrice: 19,
    sku: "VTM-SPATEL-TM6",
    isFeatured: false,
    isNew: false,
    isPromo: false,
    features: ["Hochwertiger Kunststoff", "Passform für TM6", "Leicht zu reinigen", "Hitzebeständig"],
    tags: ["thermomix", "spatel", "tm6", "vorwerk", "zubehör"],
    seoTitle: "Thermomix Spatel TM6 kaufen | HAUSAURA",
    seoDesc: "Original Thermomix Spatel für TM6. Robuster Kunststoff, hitzebeständig.",
    subCategory: "Ersatzteile",
    images: [],
    specs: [
      { key: "Material", value: "Kunststoff" },
      { key: "Kompatibilität", value: "TM6" },
    ],
  },
];

async function main() {
  let created = 0;
  let skipped = 0;

  for (const p of newProducts) {
    const exists = await prisma.product.findUnique({ where: { slug: p.slug } });
    if (exists) {
      console.log(`⏭️  ${p.slug} already exists`);
      skipped++;
      continue;
    }

    const price = Math.round(p.originalPrice * SALE_FACTOR * 100) / 100;

    const product = await prisma.product.create({
      data: {
        name: p.name,
        slug: p.slug,
        description: p.description,
        shortDesc: p.shortDesc,
        price,
        originalPrice: p.originalPrice,
        sku: p.sku,
        brandId: THERMOMIX_BRAND_ID,
        categoryId: KUECHE_CATEGORY_ID,
        subCategory: p.subCategory,
        isFeatured: p.isFeatured,
        isNew: p.isNew,
        isPromo: p.isPromo,
        rating: 0,
        reviewCount: 0,
        features: p.features,
        tags: p.tags,
        seoTitle: p.seoTitle,
        seoDesc: p.seoDesc,
        images: { create: p.images },
        specs: { create: p.specs },
      },
    });

    console.log(`✅ Created: ${product.name} (${product.slug}) — €${price} (UVP: €${p.originalPrice})`);
    created++;
  }

  console.log(`\nDone: ${created} created, ${skipped} skipped`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
