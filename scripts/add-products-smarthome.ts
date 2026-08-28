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
    name: "tado° Smart Thermostat Starter Kit V3+",
    slug: "tado-smart-thermostat-v3plus-neu",
    description: "Das tado° Smart Thermostat V3+ Starter Kit - intelligente Heizungssteuerung.",
    shortDesc: "Intelligente Heizungssteuerung mit bis zu 30% Ersparnis",
    price: 149.0, originalPrice: 199.0, sku: "TADO-V3PLUS-SK-NEU", inStock: true, isFeatured: true, isPromo: true,
    rating: 4.6, reviewCount: 1234, categorySlug: "smart-home", brandSlug: "tado",
    features: ["Geofencing", "Energiebericht", "Sprachsteuerung", "Multi-Zone"],
    tags: ["bestseller", "smart-home", "energieeffizient"],
    specs: [
      { key: "Kompatibilität", value: "Alexa, Google, HomeKit" }, { key: "Einsparnis", value: "bis 30%" },
    ],
  },
  {
    name: "tado° Smart Thermostat V3+ Erweiterung",
    slug: "tado-smart-thermostat-v3plus-extension",
    description: "Das tado° Smart Thermostat V3+ Erweiterung - für weitere Heizungen.",
    shortDesc: "Erweiterung für weitere Heizungen",
    price: 69.0, sku: "TADO-V3PLUS-EXT", inStock: true,
    rating: 4.5, reviewCount: 567, categorySlug: "smart-home", brandSlug: "tado",
    features: ["Geofencing", "Energiebericht", "Sprachsteuerung"],
    specs: [
      { key: "Kompatibilität", value: "Alexa, Google, HomeKit" }, { key: "Installation", value: "Universal" },
    ],
  },
  {
    name: "tado° Smart AC Control V3+",
    slug: "tado-smart-ac-control-v3plus-neu",
    description: "Das tado° Smart AC Control V3+ - intelligente Steuerung für Klimaanlagen.",
    shortDesc: "Smart AC Controller für Klimaanlagen",
    price: 99.0, sku: "TADO-ACV3-NEU", inStock: true,
    rating: 4.5, reviewCount: 567, categorySlug: "smart-home", brandSlug: "tado",
    features: ["IR-Fernbedienung", "Sprachsteuerung", "Off-Away"],
    specs: [
      { key: "Steuerung", value: "IR-Signal" }, { key: "Kommunikation", value: "WLAN" },
    ],
  },
  {
    name: "Philips Hue Starter Kit E27",
    slug: "philips-hue-starter-kit-e27-neu",
    description: "Das Philips Hue Starter Kit mit Bridge und 3 E27 White & Color Ambiance.",
    shortDesc: "Starter Kit mit Bridge & 3 Farb-LEDs",
    price: 149.0, originalPrice: 179.0, sku: "PH-HUE-SK-E27-NEU", inStock: true,
    rating: 4.7, reviewCount: 2345, categorySlug: "smart-home", brandSlug: "philips",
    features: ["16 Millionen Farben", "Bridge inklusive", "Sprachsteuerung"],
    tags: ["bestseller"],
    specs: [
      { key: "Farbtemperatur", value: "2000-6500K" }, { key: "Lebensdauer", value: "25.000 Stunden" },
    ],
  },
  {
    name: "Philips Hue Starter Kit E14",
    slug: "philips-hue-starter-kit-e14",
    description: "Das Philips Hue Starter Kit mit Bridge und 3 E14 White & Color Ambiance.",
    shortDesc: "Starter Kit mit Bridge & 3 E14 Farb-LEDs",
    price: 149.0, sku: "PH-HUE-SK-E14", inStock: true,
    rating: 4.6, reviewCount: 892, categorySlug: "smart-home", brandSlug: "philips",
    features: ["16 Millionen Farben", "Bridge inklusive", "E14 Fassung"],
    specs: [
      { key: "Farbtemperatur", value: "2000-6500K" }, { key: "Fassung", value: "E14" },
    ],
  },
  {
    name: "Philips Hue Lightstrip Plus 2m",
    slug: "philips-hue-lightstrip-plus-2m",
    description: "Das Philips Hue Lightstrip Plus - 2m LED-Streifen mit 16 Millionen Farben.",
    shortDesc: "LED-Streifen mit 16M Farben",
    price: 79.0, sku: "PH-HUE-LSP", inStock: true,
    rating: 4.6, reviewCount: 567, categorySlug: "smart-home", brandSlug: "philips",
    features: ["16 Millionen Farben", "2m Länge", "Schneidbar"],
    specs: [
      { key: "Farbtemperatur", value: "2000-6500K" }, { key: "Länge", value: "2 Meter" },
    ],
  },
  {
    name: "Philips Hue White Ambiance E27",
    slug: "philips-hue-white-ambiance-e27",
    description: "Das Philips Hue White Ambiance E27 - weißes Licht mit variabler Farbtemperatur.",
    shortDesc: "Weißes Licht mit variabler Farbtemperatur",
    price: 59.0, sku: "PH-HUE-WAE27", inStock: true,
    rating: 4.5, reviewCount: 1234, categorySlug: "smart-home", brandSlug: "philips",
    features: ["2200-6500K", "Dimmbar", "Sprachsteuerung"],
    specs: [
      { key: "Farbtemperatur", value: "2200-6500K" }, { key: "Lebensdauer", value: "25.000 Stunden" },
    ],
  },
  {
    name: "Nanoleaf Shapes Triangles Starter Kit",
    slug: "nanoleaf-shapes-triangles",
    description: "Die Nanoleaf Shapes Triangles - modulare LED-Panele im Dreiecksdesign.",
    shortDesc: "Modulare LED-Panele im Dreiecksdesign",
    price: 199.0, sku: "NANO-SH-TRI", inStock: true,
    rating: 4.5, reviewCount: 234, categorySlug: "smart-home", brandSlug: "nanoleaf",
    features: ["Touch-Reaktiv", "Musik-Sync", "16M Farben", "HomeKit & Matter"],
    specs: [
      { key: "Panel-Anzahl", value: "9 Starter Kit" }, { key: "Leuchtdauer", value: "25.000 Stunden" },
    ],
  },
  {
    name: "Nanoleaf Elements Hexagons",
    slug: "nanoleaf-elements-hexagons",
    description: "Die Nanoleaf Elements - Holzoptik LED-Panele für natürliche Beleuchtung.",
    shortDesc: "Holzoptik LED-Panele",
    price: 249.0, sku: "NANO-ELEM-HEX", inStock: true, isNew: true,
    rating: 4.6, reviewCount: 123, categorySlug: "smart-home", brandSlug: "nanoleaf",
    features: ["Holzoptik", "Dimmbar", "Music Sync", "HomeKit"],
    tags: ["premium"],
    specs: [
      { key: "Panel-Anzahl", value: "7 Starter Kit" }, { key: "Leuchtdauer", value: "25.000 Stunden" },
    ],
  },
  {
    name: "Ring Video Doorbell 4",
    slug: "ring-video-doorbell-4-neu",
    description: "Die Ring Video Doorbell 4 - smartes Türklingelsystem mit Video.",
    shortDesc: "Smartes Türklingelsystem mit Video",
    price: 199.0, sku: "RING-VDB4-NEU", inStock: true,
    rating: 4.5, reviewCount: 1234, categorySlug: "smart-home", brandSlug: "ring",
    features: ["1080p HD Video", "Farbvideo bei Nacht", "Bewegungserkennung"],
    specs: [
      { key: "Videoauflösung", value: "1080p HD" }, { key: "Sichtfeld", value: "160° horizontal" },
    ],
  },
  {
    name: "Ring Spotlight Cam Pro",
    slug: "ring-spotlight-cam-pro",
    description: "Die Ring Spotlight Cam Pro - Überwachungskamera mit Spotlight und Sirene.",
    shortDesc: "Überwachungskamera mit Spotlight",
    price: 249.0, sku: "RING-SCPRO", inStock: true,
    rating: 4.6, reviewCount: 567, categorySlug: "smart-home", brandSlug: "ring",
    features: ["1080p HDR", "3D-Bewegungserkennung", "Spotlight & Sirene"],
    specs: [
      { key: "Videoauflösung", value: "1080p HDR" }, { key: "Sichtfeld", value: "140° horizontal" },
    ],
  },
  {
    name: "Ring Indoor Cam Gen 2",
    slug: "ring-indoor-cam-gen2",
    description: "Die Ring Indoor Cam Gen 2 - Innenkamera mit 1080p HD.",
    shortDesc: "Innenkamera mit 1080p HD",
    price: 79.0, sku: "RING-ICAM2", inStock: true,
    rating: 4.4, reviewCount: 892, categorySlug: "smart-home", brandSlug: "ring",
    features: ["1080p HD", "2-Way Audio", "Bewegungserkennung"],
    specs: [
      { key: "Videoauflösung", value: "1080p HD" }, { key: "Sichtfeld", value: "140° diagonal" },
    ],
  },
  {
    name: "Netatmo Wetterstation",
    slug: "netatmo-wetterstation",
    description: "Die Netatmo Wetterstation - smarte Wetterstation für Innen und Außen.",
    shortDesc: "Smarte Wetterstation für Innen/Außen",
    price: 149.0, sku: "NATMO-WS", inStock: true,
    rating: 4.5, reviewCount: 345, categorySlug: "smart-home", brandSlug: "netatmo",
    features: ["Innen & Außen", "Luftqualität", "App-Steuerung"],
    specs: [
      { key: "Messwerte", value: "Temperatur, Feuchtigkeit, CO2, Lärm" }, { key: "Kommunikation", value: "WLAN" },
    ],
  },
  {
    name: "Netatmo Smart Thermostat",
    slug: "netatmo-smart-thermostat",
    description: "Das Netatmo Smart Thermostat - intelligente Heizungssteuerung.",
    shortDesc: "Intelligente Heizungssteuerung",
    price: 179.0, sku: "NATMO-THR", inStock: true,
    rating: 4.5, reviewCount: 456, categorySlug: "smart-home", brandSlug: "netatmo",
    features: ["Modulation", "Energiemonitor", "HomeKit & Alexa"],
    specs: [
      { key: "Kompatibilität", value: "HomeKit, Alexa, Google" }, { key: "Einsparnis", value: "bis 25%" },
    ],
  },
  {
    name: "IKEA TRÅDFRI Starter Kit E27",
    slug: "ikea-tradfri-starter-kit-e27",
    description: "Das IKEA TRÅDFRI Starter Kit mit Bridge und 2 E27 LED-Leuchtmitteln.",
    shortDesc: "Starter Kit mit Bridge & 2 E27 LEDs",
    price: 49.0, sku: "IKEA-TRADFRI-E27", inStock: true,
    rating: 4.4, reviewCount: 1234, categorySlug: "smart-home", brandSlug: "ikea",
    features: ["Dimmbar", "Farbtemperatur wählbar", "Bridge inklusive"],
    specs: [
      { key: "Farbtemperatur", value: "2200-4000K" }, { key: "Lebensdauer", value: "25.000 Stunden" },
    ],
  },
  {
    name: "IKEA DIRIGERA Hub",
    slug: "ikea-dirigera-hub",
    description: "Die IKEA DIRIGERA Hub - smarte Zentrale für IKEA Smart Home.",
    shortDesc: "Smarte Zentrale für IKEA Smart Home",
    price: 59.0, sku: "IKEA-DIRIGERA", inStock: true,
    rating: 4.5, reviewCount: 345, categorySlug: "smart-home", brandSlug: "ikea",
    features: ["Matter", "Thread", "Zigbee", "WLAN"],
    specs: [
      { key: "Protokolle", value: "Matter, Thread, Zigbee" }, { key: "Verbindung", value: "WLAN, Ethernet" },
    ],
  },
  {
    name: "IKEA PRAKTLYSING Smart Blind",
    slug: "ikea-praktlysing-smart-blind",
    description: "Das IKEA PRAKTLYSING Smart Blind - elektrischer Jalousie-Antrieb.",
    shortDesc: "Elektrischer Jalousie-Antrieb",
    price: 99.0, sku: "IKEA-PRAKT", inStock: true,
    rating: 4.4, reviewCount: 234, categorySlug: "smart-home", brandSlug: "ikea",
    features: ["Fernbedienung", "WLAN", "Timer"],
    specs: [
      { key: "Steuerung", value: "Fernbedienung & App" }, { key: "Energieversorgung", value: "Batterie" },
    ],
  },
  {
    name: "Ring Alarm Security Kit 5-teilig",
    slug: "ring-alarm-security-kit-5",
    description: "Das Ring Alarm Security Kit - 5-teiliges Sicherheitssystem.",
    shortDesc: "5-teiliges Sicherheitssystem",
    price: 249.0, sku: "RING-ALARM5", inStock: true, isFeatured: true,
    rating: 4.6, reviewCount: 567, categorySlug: "smart-home", brandSlug: "ring",
    features: ["Base Station", "Keypad", "1x Contact Sensor", "1x Motion Detector"],
    tags: ["bestseller"],
    specs: [
      { key: "Komponenten", value: "5" }, { key: "Kommunikation", value: "WLAN + LTE" },
    ],
  },
  {
    name: "Netatmo Smart Video Doorbell",
    slug: "netatmo-smart-video-doorbell",
    description: "Die Netatmo Smart Video Doorbell - smartes Türklingelsystem mit Video.",
    shortDesc: "Smartes Türklingelsystem mit Video",
    price: 199.0, sku: "NATMO-VDB", inStock: true,
    rating: 4.5, reviewCount: 345, categorySlug: "smart-home", brandSlug: "netatmo",
    features: ["1080p HD", "HomeKit", "Lokaler Speicher"],
    specs: [
      { key: "Videoauflösung", value: "1080p HD" }, { key: "Speicher", value: "8GB MicroSD" },
    ],
  },
  {
    name: "Nanoleaf Shapes Squares Starter Kit",
    slug: "nanoleaf-shapes-squares",
    description: "Die Nanoleaf Shapes Squares - modulare LED-Panele im Quadratdesign.",
    shortDesc: "Modulare LED-Panele im Quadratdesign",
    price: 199.0, sku: "NANO-SH-SQ", inStock: true,
    rating: 4.5, reviewCount: 189, categorySlug: "smart-home", brandSlug: "nanoleaf",
    features: ["Touch-Reaktiv", "Musik-Sync", "16M Farben", "HomeKit & Matter"],
    specs: [
      { key: "Panel-Anzahl", value: "9 Starter Kit" }, { key: "Leuchtdauer", value: "25.000 Stunden" },
    ],
  },
  {
    name: "Philips Hue Gradient Lightstrip 2m",
    slug: "philips-hue-gradient-lightstrip-2m",
    description: "Das Philips Hue Gradient Lightstrip - 2m mit mehreren Farben gleichzeitig.",
    shortDesc: "Gradient LED-Streifen mit mehreren Farben",
    price: 169.0, sku: "PH-HUE-GLS2M", inStock: true, isNew: true,
    rating: 4.7, reviewCount: 234, categorySlug: "smart-home", brandSlug: "philips",
    features: ["Gradient-Technologie", "Mehrere Farben gleichzeitig", "2m"],
    tags: ["premium"],
    specs: [
      { key: "Farben", value: "16 Millionen" }, { key: "Länge", value: "2 Meter" },
    ],
  },
  {
    name: "IKEA SYMFONISK Table Speaker",
    slug: "ikea-symfonisk-table-speaker",
    description: "Der IKEA SYMFONISK Table Speaker - WLAN-Lautsprecher von IKEA & Sonos.",
    shortDesc: "WLAN-Lautsprecher von IKEA & Sonos",
    price: 129.0, sku: "IKEA-SYMFON", inStock: true,
    rating: 4.4, reviewCount: 456, categorySlug: "smart-home", brandSlug: "ikea",
    features: ["Sonos", "WLAN", "AirPlay 2", "Regalbrett-Integration"],
    specs: [
      { key: "Lautsprecher", value: "1x Woofer, 1x Tweeter" }, { key: "Konnektivität", value: "WLAN, AirPlay 2" },
    ],
  },
  {
    name: "Philips Hue Play Gradient Lightstrip 55\"",
    slug: "philips-hue-play-gradient-lightstrip-55",
    description: "Das Philips Hue Play Gradient Lightstrip für 55\" TVs.",
    shortDesc: "Gradient Lightstrip für 55\" TVs",
    price: 229.0, sku: "PH-HUE-PG55", inStock: true,
    rating: 4.7, reviewCount: 123, categorySlug: "smart-home", brandSlug: "philips",
    features: ["Gradient-Technologie", "Für 55\" TVs", "Hue Sync"],
    tags: ["premium"],
    specs: [
      { key: "Farben", value: "16 Millionen" }, { key: "TV-Größe", value: "55 Zoll" },
    ],
  },
  {
    name: "tado° Smart Radiator Thermostat Starter Kit",
    slug: "tado-smart-radiator-starter-kit",
    description: "Das tado° Smart Radiator Thermostat Starter Kit - für Heizkörper.",
    shortDesc: "Smartes Heizkörper-Thermostat Starter Kit",
    price: 179.0, sku: "TADO-SRT-SK", inStock: true,
    rating: 4.5, reviewCount: 345, categorySlug: "smart-home", brandSlug: "tado",
    features: ["Multi-Zone", "Geofencing", "Sprachsteuerung"],
    specs: [
      { key: "Kompatibilität", value: "Alexa, Google, HomeKit" }, { key: "Installation", value: "Universal" },
    ],
  },
  {
    name: "Ring Floodlight Cam Wired Pro",
    slug: "ring-floodlight-cam-wired-pro",
    description: "Die Ring Floodlight Cam Wired Pro - Außenkamera mit LED-Flutlicht.",
    shortDesc: "Außenkamera mit LED-Flutlicht",
    price: 299.0, sku: "RING-FCWP", inStock: true,
    rating: 4.6, reviewCount: 234, categorySlug: "smart-home", brandSlug: "ring",
    features: ["1080p HDR", "3D-Bewegungserkennung", "LED-Flutlicht", "Sirene"],
    specs: [
      { key: "Videoauflösung", value: "1080p HDR" }, { key: "Lichtstärke", value: "2000 Lumen" },
    ],
  },
  {
    name: "IKEA PARASOLL Door/Window Sensor",
    slug: "ikea-parasoll-door-window-sensor",
    description: "Das IKEA PARASOLL Door/Window Sensor - Tür-/Fenster-Sensor.",
    shortDesc: "Tür-/Fenster-Sensor",
    price: 12.0, sku: "IKEA-PARASOLL", inStock: true,
    rating: 4.3, reviewCount: 892, categorySlug: "smart-home", brandSlug: "ikea",
    features: ["Zigbee", "DIRIGERA kompatibel", "Batteriebetrieben"],
    specs: [
      { key: "Protokoll", value: "Zigbee" }, { key: "Energieversorgung", value: "CR2032" },
    ],
  },
  {
    name: "IKEA VALLHORN Wireless Motion Sensor",
    slug: "ikea-vallhorn-motion-sensor",
    description: "Das IKEA VALLHORN Wireless Motion Sensor - Bewegungsmelder.",
    shortDesc: "Bewegungsmelder",
    price: 14.0, sku: "IKEA-VALLHORN", inStock: true,
    rating: 4.2, reviewCount: 678, categorySlug: "smart-home", brandSlug: "ikea",
    features: ["Zigbee", "DIRIGERA kompatibel", "Batteriebetrieben"],
    specs: [
      { key: "Protokoll", value: "Zigbee" }, { key: "Energieversorgung", value: "2x AAA" },
    ],
  },
  {
    name: "Philips Hue Secure Camera",
    slug: "philips-hue-secure-camera",
    description: "Die Philips Hue Secure Camera - smarte Überwachungskamera.",
    shortDesc: "Smarte Überwachungskamera",
    price: 199.0, sku: "PH-HUE-SECAM", inStock: true, isNew: true,
    rating: 4.6, reviewCount: 123, categorySlug: "smart-home", brandSlug: "philips",
    features: ["1080p HD", "Personenerkennung", "Night Vision"],
    tags: ["premium"],
    specs: [
      { key: "Videoauflösung", value: "1080p HD" }, { key: "Sichtfeld", value: "160° diagonal" },
    ],
  },
  {
    name: "IKEA STARKVIND Air Purifier",
    slug: "ikea-starkvind-air-purifier",
    description: "Das IKEA STARKVIND Air Purifier - smarter Luftreiniger.",
    shortDesc: "Smarter Luftreiniger von IKEA",
    price: 59.0, sku: "IKEA-STARKVIND", inStock: true,
    rating: 4.3, reviewCount: 345, categorySlug: "smart-home", brandSlug: "ikea",
    features: ["HEPA-Filter", "Zigbee", "DIRIGERA kompatibel"],
    specs: [
      { key: "Raumgröße", value: "bis 20 m²" }, { key: "Filter", value: "HEPA" },
    ],
  },
  {
    name: "Nanoleaf Essential A19 Bulb",
    slug: "nanoleaf-essential-a19-bulb",
    description: "Die Nanoleaf Essential A19 Bulb - smarte LED-Lampe mit Matter.",
    shortDesc: "Smarte LED-Lampe mit Matter",
    price: 29.0, sku: "NANO-ES-A19", inStock: true,
    rating: 4.4, reviewCount: 456, categorySlug: "smart-home", brandSlug: "nanoleaf",
    features: ["Matter", "Thread", "16M Farben", "Dimmbar"],
    specs: [
      { key: "Farbtemperatur", value: "2700-6500K" }, { key: "Lebensdauer", value: "25.000 Stunden" },
    ],
  },
  {
    name: "Ring Alarm Flood & Freeze Sensor",
    slug: "ring-alarm-flood-freeze-sensor",
    description: "Der Ring Alarm Flood & Freeze Sensor - Wasser- und Frostsensor.",
    shortDesc: "Wasser- und Frostsensor",
    price: 39.0, sku: "RING-AFFS", inStock: true,
    rating: 4.5, reviewCount: 234, categorySlug: "smart-home", brandSlug: "ring",
    features: ["Wassererkennung", "Frostschutz", "Alarm-Integration"],
    specs: [
      { key: "Erkennung", value: "Wasser & Frost" }, { key: "Konnektivität", value: "Zigbee" },
    ],
  },
  {
    name: "tado° Smart Thermostat V3+ Einzelgerät",
    slug: "tado-smart-thermostat-v3plus-single",
    description: "Das tado° Smart Thermostat V3+ Einzelgerät.",
    shortDesc: "Smartes Thermostat Einzelgerät",
    price: 79.0, sku: "TADO-V3PLUS-SGL", inStock: true,
    rating: 4.5, reviewCount: 456, categorySlug: "smart-home", brandSlug: "tado",
    features: ["Geofencing", "Sprachsteuerung", "Multi-Zone"],
    specs: [
      { key: "Kompatibilität", value: "Alexa, Google, HomeKit" }, { key: "Installation", value: "Universal" },
    ],
  },
  {
    name: "Philips Hue Secure Doorbell Camera",
    slug: "philips-hue-secure-doorbell-camera",
    description: "Die Philips Hue Secure Doorbell Camera - smartes Türklingelsystem.",
    shortDesc: "Smartes Türklingelsystem mit Kamera",
    price: 229.0, sku: "PH-HUE-DBC", inStock: true, isNew: true,
    rating: 4.7, reviewCount: 89, categorySlug: "smart-home", brandSlug: "philips",
    features: ["1080p HD", "Personenerkennung", "Two-Way Audio"],
    tags: ["premium"],
    specs: [
      { key: "Videoauflösung", value: "1080p HD" }, { key: "Sichtfeld", value: "180° horizontal" },
    ],
  },
];

async function main() {
  console.log("🏠 Adding Smart Home products...");

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

  console.log(`\n🎉 Done! Added ${added} new products to Smart Home`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
