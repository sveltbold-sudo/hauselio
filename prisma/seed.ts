import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const adminEmail = "admin@hauselio.de";

  const categories = [
    { name: "Küche & Kochen", slug: "kueche", description: "Hochwertige Küchengeräte für anspruchsvolle Köche", image: "/images/categories/kueche.jpg" },
    { name: "Kaffee", slug: "kaffee", description: "Premium Kaffeemaschinen für den perfekten Genuss", image: "/images/categories/kaffee.jpg" },
    { name: "Reinigung", slug: "reinigung", description: "Effiziente Reinigungsgeräte für Ihr Zuhause", image: "/images/categories/reinigung.jpg" },
    { name: "Klima & Luft", slug: "klima", description: "Klimaanlagen und Luftreiniger für jedes Raumklima", image: "/images/categories/klima.jpg" },
    { name: "Smart Home", slug: "smart-home", description: "Intelligente Geräte für ein vernetztes Zuhause", image: "/images/categories/smart-home.jpg" },
    { name: "Haushaltsgeräte", slug: "haushaltsgeraete", description: "Waschmaschinen, Trockner, Kühlschränke & mehr", image: "/images/categories/haushaltsgeraete.jpg" },
  ];

const brands = [
  { name: "Miele", slug: "miele", logo: "/images/brands/miele.svg" },
  { name: "Bosch", slug: "bosch", logo: "/images/brands/bosch.svg" },
  { name: "Siemens", slug: "siemens", logo: "/images/brands/siemens.svg" },
  { name: "Dyson", slug: "dyson", logo: "/images/brands/dyson.svg" },
  { name: "Samsung", slug: "samsung", logo: "/images/brands/samsung.svg" },
  { name: "LG", slug: "lg", logo: "/images/brands/lg.svg" },
  { name: "Philips", slug: "philips", logo: "/images/brands/philips.svg" },
  { name: "De'Longhi", slug: "delonghi", logo: "/images/brands/delonghi.svg" },
  { name: "Jura", slug: "jura", logo: "/images/brands/jura.svg" },
  { name: "KitchenAid", slug: "kitchenaid", logo: "/images/brands/kitchenaid.svg" },
  { name: "Nespresso", slug: "nespresso", logo: "/images/brands/nespresso.svg" },
  { name: "iRobot", slug: "irobot", logo: "/images/brands/irobot.svg" },
  { name: "tado°", slug: "tado", logo: "/images/brands/tado.svg" },
  { name: "V-ZUG", slug: "vzug", logo: "/images/brands/vzug.svg" },
  { name: "Thermador", slug: "thermador", logo: "/images/brands/thermador.svg" },
  { name: "Electrolux", slug: "electrolux", logo: "/images/brands/electrolux.svg" },
  { name: "AEG", slug: "aeg", logo: "/images/brands/aeg.svg" },
  { name: "Gaggenau", slug: "gaggenau", logo: "/images/brands/gaggenau.svg" },
  { name: "Neff", slug: "neff", logo: "/images/brands/neff.svg" },
  { name: "Haier", slug: "haier", logo: "/images/brands/haier.svg" },
  { name: "Liebherr", slug: "liebherr", logo: "/images/brands/liebherr.svg" },
  { name: "Tchibo", slug: "tchibo", logo: "/images/brands/tchibo.svg" },
  { name: "Vorwerk", slug: "vorwerk", logo: "/images/brands/vorwerk.svg" },
  { name: "Melitta", slug: "melitta", logo: "/images/brands/melitta.svg" },
  { name: "Breville", slug: "breville", logo: "/images/brands/breville.svg" },
  { name: "Kärcher", slug: "kaercher", logo: "/images/brands/kaercher.svg" },
  { name: "Stadler Form", slug: "stadler-form", logo: "/images/brands/stadler-form.svg" },
  { name: "Blueair", slug: "blueair", logo: "/images/brands/blueair.svg" },
  { name: "Nanoleaf", slug: "nanoleaf", logo: "/images/brands/nanoleaf.svg" },
  { name: "Ring", slug: "ring", logo: "/images/brands/ring.svg" },
];

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
    name: "Thermomix TM7",
    slug: "thermomix-tm7",
    description: "Der neue Thermomix TM7 - noch leistungsstärker, vielseitiger und benutzerfreundlicher. Über 80 Kochfunktionen in einem Gerät.",
    shortDesc: "Das ultimative Küchengerät mit 80+ Funktionen",
    price: 1499.0, originalPrice: 1599.0, sku: "TM7-2026", inStock: true, isFeatured: true, isNew: true,
    rating: 4.9, reviewCount: 127, categorySlug: "kueche", brandSlug: "vorwerk", weight: 7.95,
    features: ["80+ Kochfunktionen", "6,8 Zoll TFT-Display", "WLAN & App-Steuerung", "Selbstreinigung"],
    tags: ["bestseller", "premium", "smart-home"],
    seoTitle: "Thermomix TM7 kaufen – HAUSELIO", seoDesc: "Der neue Thermomix TM7 mit 80+ Funktionen. Kostenloser Versand ab 50€.",
    specs: [
      { key: "Leistung", value: "1500 Watt" }, { key: "Gewicht", value: "7,95 kg" },
      { key: "Fassungsvermögen", value: "2,2 Liter" }, { key: "Kochfunktionen", value: "80+" },
    ],
  },
  {
    name: "Thermomix TM6",
    slug: "thermomix-tm6",
    description: "Der bewährte Thermomix TM6 - zuverlässig, leistungsstark und vielseitig.",
    shortDesc: "Bewährte Qualität mit 40+ Funktionen",
    price: 1399.0, sku: "TM6-2025", inStock: true, isFeatured: true,
    rating: 4.8, reviewCount: 342, categorySlug: "kueche", brandSlug: "vorwerk",
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
    rating: 4.8, reviewCount: 289, categorySlug: "kueche", brandSlug: "kitchenaid", weight: 10.5,
    features: ["4,8L Edelstahlschüssel", "10 Geschwindigkeiten", "Planetarische Bewegung"],
    tags: ["bestseller", "design-klassiker"],
    specs: [
      { key: "Leistung", value: "300 Watt" }, { key: "Schüsselvolumen", value: "4,8 Liter" },
      { key: "Gewicht", value: "10,5 kg" }, { key: "Geschwindigkeiten", value: "10" },
    ],
  },
  {
    name: "Bosch Serie 6 Freistehender Herd HKH634ES5",
    slug: "bosch-serie-6-herd-hkh634es5",
    description: "Der Bosch Serie 6 Herd mit 4 Induktionsherdfeldern und 66L Backofen.",
    shortDesc: "Induktionsherd mit PerfectBake Technologie",
    price: 1899.0, sku: "BSH-HKH634ES5", inStock: true,
    rating: 4.7, reviewCount: 78, categorySlug: "kueche", brandSlug: "bosch", weight: 62,
    features: ["4 Induktionsherdfelder", "66L Backofen", "PerfectBake", "PerfectRoast"],
    specs: [
      { key: "Herdtyp", value: "Induktion" }, { key: "Backofenvolumen", value: "66 Liter" },
    ],
  },
  {
    name: "Siemens iQ700 Backofen HB778GES0",
    slug: "siemens-iq700-backofen-hb778ges0",
    description: "Der Siemens iQ700 Einbau-Backofen mit pyrolytischer Selbstreinigung.",
    shortDesc: "Einbau-Backofen mit Pyrolyse",
    price: 1299.0, sku: "SI-HB778GES0", inStock: true, isNew: true,
    rating: 4.8, reviewCount: 45, categorySlug: "kueche", brandSlug: "siemens", weight: 38,
    features: ["Pyrolytische Selbstreinigung", "cookControl Pro", "TFT-Touchdisplay"],
    specs: [
      { key: "Backraumvolumen", value: "71 Liter" }, { key: "Heizarten", value: "13" },
    ],
  },
  {
    name: "Gaggenau Vario 200 induktion Kochfeld",
    slug: "gaggenau-vario-200-induktion",
    description: "Das Gaggenau Vario 200 Kochfeld - flexibles Induktionssystem.",
    shortDesc: "Premium-Induktion mit flexibler Kochfläche",
    price: 2499.0, sku: "GAG-V200-IND", inStock: true,
    rating: 4.9, reviewCount: 34, categorySlug: "kueche", brandSlug: "gaggenau",
    features: ["2200 cm² Kochfläche", "Boost-Funktion", "Bratensensor"],
    specs: [
      { key: "Kochfeldtyp", value: "Induktion" }, { key: "Fläche", value: "2200 cm²" },
    ],
  },
  {
    name: "Jura E8 Platinum",
    slug: "jura-e8-platinum",
    description: "Die Jura E8 - Vollautomatischer Kaffeevollautomat der Extraklasse.",
    shortDesc: "Premium Kaffeevollautomat mit P.E.P. Technologie",
    price: 1199.0, originalPrice: 1299.0, sku: "JURA-E8-PL", inStock: true, isFeatured: true, isPromo: true,
    rating: 4.8, reviewCount: 156, categorySlug: "kaffee", brandSlug: "jura", weight: 9.6,
    features: ["P.E.P. Technologie", "Fine Foam Frother", "Aroma-3-Mahlwerk", "J.O.E. App"],
    tags: ["bestseller", "premium"],
    specs: [
      { key: "Bohnschale", value: "Integriert, 280g" }, { key: "Wassertank", value: "1,9 Liter" },
    ],
  },
  {
    name: "Jura Z10 Platinum",
    slug: "jura-z10-platinum",
    description: "Die Jura Z10 - Das Flaggschiff unter den Vollautomaten.",
    shortDesc: "Top-Vollautomat mit Cold Brew & 32 Spezialitäten",
    price: 2199.0, sku: "JURA-Z10-PL", inStock: true, isFeatured: true, isNew: true,
    rating: 4.9, reviewCount: 67, categorySlug: "kaffee", brandSlug: "jura", weight: 12.3,
    features: ["Cold Brew Extraction", "32 Spezialitäten", "P.E.P."],
    specs: [
      { key: "Spezialitäten", value: "32" }, { key: "Cold Brew", value: "Ja" },
    ],
  },
  {
    name: "De'Longhi Magnifica S ECAM 22.110.B",
    slug: "delonghi-magnifica-s-ecam22110b",
    description: "Die De'Longhi Magnifica S - kompakter Vollautomat mit integriertem Mahlwerk.",
    shortDesc: "Kompakter Vollautomat für den Einstieg",
    price: 349.0, sku: "DEL-ECAM22110B", inStock: true,
    rating: 4.5, reviewCount: 892, categorySlug: "kaffee", brandSlug: "delonghi", weight: 9.0,
    features: ["Integriertes Mahlwerk", "Cappuccino-System", "13 Mahlstufen"],
    tags: ["bestseller", "einstieg"],
    specs: [
      { key: "Bohnschale", value: "250g" }, { key: "Wassertank", value: "1,8 Liter" },
    ],
  },
  {
    name: "Nespresso Vertuo Pop+",
    slug: "nespresso-vertuo-pop-plus",
    description: "Die Nespresso Vertuo Pop+ - kompakter Kapselmaschine mit Centrifusion-Technologie.",
    shortDesc: "Kompakte Kapselmaschine mit 5 Tassengrößen",
    price: 99.0, sku: "NES-VPOP-PLUS", inStock: true, isNew: true,
    rating: 4.3, reviewCount: 234, categorySlug: "kaffee", brandSlug: "nespresso", weight: 3.5,
    features: ["Centrifusion-Technologie", "5 Tassengrößen", "Bluetooth"],
    specs: [
      { key: "Kapseltyp", value: "Vertuo" }, { key: "Tassengrößen", value: "5" },
    ],
  },
  {
    name: "Melitta Purista Aromatica Pure Black",
    slug: "melitta-purista-pure-black",
    description: "Die Melitta Purista - minimalistischer Filterkaffeebereiter.",
    shortDesc: "Minimalistischer Filterkaffee-Automat",
    price: 249.0, sku: "MEL-PURISTA", inStock: true,
    rating: 4.6, reviewCount: 445, categorySlug: "kaffee", brandSlug: "melitta",
    features: ["Aromaperforation", "3 Tassen", "Schmorröster-Technik"],
    specs: [
      { key: "Kaffeeart", value: "Filterkaffee" }, { key: "Behältervolumen", value: "1075ml" },
    ],
  },
  {
    name: "Breville Barista Express Impress",
    slug: "breville-barista-express-impress",
    description: "Die Breville Barista Express Impress - Halbautomatischer Espressomaschine.",
    shortDesc: "Halbautomat mit Mahlwerk & Impression Dosing",
    price: 699.0, sku: "BREV-BEI", inStock: true,
    rating: 4.7, reviewCount: 156, categorySlug: "kaffee", brandSlug: "breville", weight: 11.5,
    features: ["Integriertes Mahlwerk", "Impression Dosing", "ThermoJet"],
    specs: [
      { key: "Brühtyp", value: "Espresso" }, { key: "Aufheizzeit", value: "3 Sekunden" },
    ],
  },
  {
    name: "Dyson V15 Detect Absolute",
    slug: "dyson-v15-detect-absolute",
    description: "Der Dyson V15 Detect Absolute - der leistungsstärkste kabellose Staubsauger.",
    shortDesc: "Kabelloser Staubsauger mit Laser-Technologie",
    price: 749.0, sku: "DY-V15-ABS", inStock: true, isFeatured: true, isNew: true,
    rating: 4.7, reviewCount: 89, categorySlug: "reinigung", brandSlug: "dyson", weight: 3.1,
    features: ["Grüne Laserdiode", "LCD-Display", "60 Min. Laufzeit", "Piezo-Sensor"],
    tags: ["bestseller", "premium"],
    specs: [
      { key: "Laufzeit", value: "bis zu 60 Minuten" }, { key: "Saugleistung", value: "230 AW" },
    ],
  },
  {
    name: "Dyson Gen5detect Absolute",
    slug: "dyson-gen5detect-absolute",
    description: "Der Dyson Gen5detect Absolute - die nächste Generation der Saugroboter.",
    shortDesc: "Top Saugleistung mit 280 AW",
    price: 949.0, sku: "DY-GEN5-ABS", inStock: true,
    rating: 4.8, reviewCount: 45, categorySlug: "reinigung", brandSlug: "dyson", weight: 3.5,
    features: ["280 AW Saugleistung", "70 Min. Laufzeit", "DLS Technologie", "HEPA-Filter"],
    specs: [
      { key: "Laufzeit", value: "bis zu 70 Minuten" }, { key: "Saugleistung", value: "280 AW" },
    ],
  },
  {
    name: "iRobot Roomba j7+",
    slug: "irobot-roomba-j7-plus",
    description: "Der iRobot Roomba j7+ - intelligenter Saugroboter mit PrecisionVision Navigation.",
    shortDesc: "Intelligenter Saugroboter mit Hinderniserkennung",
    price: 599.0, originalPrice: 799.0, sku: "IR-J7PLUS", inStock: true, isFeatured: true, isPromo: true,
    rating: 4.6, reviewCount: 312, categorySlug: "reinigung", brandSlug: "irobot", weight: 3.4,
    features: ["PrecisionVision", "Auto-Entsorgung", "3-Stufen-Reinigung"],
    tags: ["bestseller"],
    specs: [
      { key: "Laufzeit", value: "bis zu 75 Minuten" }, { key: "Navigation", value: "PrecisionVision" },
    ],
  },
  {
    name: "Dyson Big Ball Animal Pro",
    slug: "dyson-big-ball-animal-pro",
    description: "Der Dyson Big Ball Animal Pro - leistungsstarker Staubsauger für Tierhalter.",
    shortDesc: "Kabellöser Staubsauger für Tierhalter",
    price: 549.0, sku: "DY-BBAP", inStock: true,
    rating: 4.5, reviewCount: 187, categorySlug: "reinigung", brandSlug: "dyson", weight: 7.2,
    features: ["Radial Root Cyclone", "Automatische Höhenanpassung"],
    specs: [
      { key: "Saugleistung", value: "250 AW" }, { key: "Filter", value: "HEPA" },
    ],
  },
  {
    name: "Kärcher SC 4 EasyFix Premium",
    slug: "kaercher-sc4-easyfix-premium",
    description: "Der Kärcher SC 4 EasyFix Premium - dampfreiniger mit Geschirrspültank.",
    shortDesc: "Dampfreiniger mit Geschirrspültank",
    price: 229.0, sku: "KA-SC4-EFP", inStock: true,
    rating: 4.7, reviewCount: 567, categorySlug: "reinigung", brandSlug: "kaercher", weight: 6.0,
    features: ["EasyFix Bodenpark", "Geschirrspültank", "Dauerdampf"],
    specs: [
      { key: "Dampfdruck", value: "3,5 bar" }, { key: "Heizzeit", value: "4 Minuten" },
    ],
  },
  {
    name: "Dyson Purifier Big Quiet Formaldehyde",
    slug: "dyson-purifier-big-quiet",
    description: "Der Dyson Purifier Big Quiet - Luftreiniger und Heizstrahler in einem.",
    shortDesc: "Luftreiniger mit formaldehydzerstörendem Katalysator",
    price: 899.0, sku: "DY-PUR-BQF", inStock: true, isFeatured: true,
    rating: 4.7, reviewCount: 67, categorySlug: "klima", brandSlug: "dyson", weight: 8.5,
    features: ["Formaldehyd-Katalysator", "HEPA H13", "Bidirektional"],
    tags: ["premium", "gesundheit"],
    specs: [
      { key: "Filter", value: "HEPA H13" }, { key: "Raumgröße", value: "bis 60 m²" },
    ],
  },
  {
    name: "Dyson Pure Cool TP09",
    slug: "dyson-pure-cool-tp09",
    description: "Der Dyson Pure Cool TP09 - Luftreiniger und Ventilator.",
    shortDesc: "Luftreiniger & Ventilator mit Air-Quality-Display",
    price: 499.0, originalPrice: 549.0, sku: "DY-TP09", inStock: true, isPromo: true,
    rating: 4.6, reviewCount: 123, categorySlug: "klima", brandSlug: "dyson",
    features: ["Formaldehyd-Katalysator", "Air-Quality-Display", "350° Oscillation"],
    specs: [
      { key: "Filter", value: "HEPA H13 + Aktivkohle" }, { key: "Raumgröße", value: "bis 40 m²" },
    ],
  },
  {
    name: "Stadler Form Oskar Big",
    slug: "stadler-form-oskar-big",
    description: "Der Stadler Form Oskar Big - eleganter Luftbefeuchter für Räume bis 80 m².",
    shortDesc: "Eleganter Luftbefeuchter für bis 80 m²",
    price: 189.0, sku: "SF-OSKAR-BIG", inStock: true,
    rating: 4.4, reviewCount: 234, categorySlug: "klima", brandSlug: "stadler-form",
    features: ["3 Befeuchtungsstufen", "Hygiene-Funktion", "Nachtschaltfunktion"],
    specs: [
      { key: "Raumgröße", value: "bis 80 m²" }, { key: "Wasserkapazität", value: "6 Liter" },
    ],
  },
  {
    name: "Blueair Blue 3210",
    slug: "blueair-blue-3210",
    description: "Der Blueair Blue 3210 - kompakter Luftreiniger mit HEPASilent-Technologie.",
    shortDesc: "Kompakter Luftreiniger mit HEPASilent",
    price: 199.0, sku: "BLUE-3210", inStock: true,
    rating: 4.5, reviewCount: 189, categorySlug: "klima", brandSlug: "blueair",
    features: ["HEPASilent-Technologie", "One-Touch-Bedienung", "3 Geschwindigkeiten"],
    specs: [
      { key: "Raumgröße", value: "bis 25 m²" }, { key: "Filter", value: "HEPASilent" },
    ],
  },
  {
    name: "tado° Smart Thermostat Starter Kit V3+",
    slug: "tado-smart-thermostat-v3plus",
    description: "Das tado° Smart Thermostat V3+ Starter Kit - intelligente Heizungssteuerung.",
    shortDesc: "Intelligente Heizungssteuerung mit bis zu 30% Ersparnis",
    price: 149.0, originalPrice: 199.0, sku: "TADO-V3PLUS-SK", inStock: true, isFeatured: true, isPromo: true,
    rating: 4.6, reviewCount: 1234, categorySlug: "smart-home", brandSlug: "tado",
    features: ["Geofencing", "Energiebericht", "Sprachsteuerung", "Multi-Zone"],
    tags: ["bestseller", "smart-home", "energieeffizient"],
    specs: [
      { key: "Kompatibilität", value: "Alexa, Google, HomeKit" }, { key: "Einsparnis", value: "bis 30%" },
    ],
  },
  {
    name: "tado° Smart AC Control V3+",
    slug: "tado-smart-ac-control-v3plus",
    description: "Das tado° Smart AC Control V3+ - intelligente Steuerung für Klimaanlagen.",
    shortDesc: "Smart AC Controller für Klimaanlagen",
    price: 99.0, sku: "TADO-ACV3", inStock: true,
    rating: 4.5, reviewCount: 567, categorySlug: "smart-home", brandSlug: "tado",
    features: ["IR-Fernbedienung", "Sprachsteuerung", "Off-Away"],
    specs: [
      { key: "Steuerung", value: "IR-Signal" }, { key: "Kommunikation", value: "WLAN" },
    ],
  },
  {
    name: "Philips Hue Starter Kit E27",
    slug: "philips-hue-starter-kit-e27",
    description: "Das Philips Hue Starter Kit mit Bridge und 3 E27 White & Color Ambiance.",
    shortDesc: "Starter Kit mit Bridge & 3 Farb-LEDs",
    price: 149.0, originalPrice: 179.0, sku: "PH-HUE-SK-E27", inStock: true,
    rating: 4.7, reviewCount: 2345, categorySlug: "smart-home", brandSlug: "philips",
    features: ["16 Millionen Farben", "Bridge inklusive", "Sprachsteuerung"],
    tags: ["bestseller"],
    specs: [
      { key: "Farbtemperatur", value: "2000-6500K" }, { key: "Lebensdauer", value: "25.000 Stunden" },
    ],
  },
  {
    name: "Nanoleaf Shapes Hexagons Starter Kit",
    slug: "nanoleaf-shapes-hexagons",
    description: "Die Nanoleaf Shapes Hexagons - modulare LED-Panele für kreative Wandgestaltung.",
    shortDesc: "Modulare LED-Panele mit Touch & Musik-Sync",
    price: 199.0, sku: "NANO-SH-HEX", inStock: true,
    rating: 4.4, reviewCount: 345, categorySlug: "smart-home", brandSlug: "nanoleaf",
    features: ["Touch-Reaktiv", "Musik-Sync", "16M Farben", "HomeKit & Matter"],
    specs: [
      { key: "Panel-Anzahl", value: "9 Starter Kit" }, { key: "Leuchtdauer", value: "25.000 Stunden" },
    ],
  },
  {
    name: "Ring Video Doorbell 4",
    slug: "ring-video-doorbell-4",
    description: "Die Ring Video Doorbell 4 - smartes Türklingelsystem mit Video.",
    shortDesc: "Smartes Türklingelsystem mit Video",
    price: 199.0, sku: "RING-VDB4", inStock: true,
    rating: 4.5, reviewCount: 1234, categorySlug: "smart-home", brandSlug: "ring",
    features: ["1080p HD Video", "Farbvideo bei Nacht", "Bewegungserkennung"],
    specs: [
      { key: "Videoauflösung", value: "1080p HD" }, { key: "Sichtfeld", value: "160° horizontal" },
    ],
  },
  {
    name: "Miele W1 Waschmaschine WCI870 WCS",
    slug: "miele-w1-waschmaschine-wci870",
    description: "Die Miele W1 Frontlader-Waschmaschine - revolutionäre Pflege mit TwinDos.",
    shortDesc: "Premium Waschmaschine mit TwinDos Technologie",
    price: 1899.0, sku: "MIELE-WCI870", inStock: true, isFeatured: true,
    rating: 4.9, reviewCount: 203, categorySlug: "haushaltsgeraete", brandSlug: "miele", weight: 87,
    features: ["TwinDos", "CapDosing", "PowerWash 2.0", "8 kg Füllmenge"],
    tags: ["premium", "energieeffizient"],
    specs: [
      { key: "Füllmenge", value: "8 kg" }, { key: "Energieeffizienz", value: "A+++" },
    ],
  },
  {
    name: "Miele T1 Trommeltrockner TRK845 WP",
    slug: "miele-t1-trockner-trk845",
    description: "Der Miele T1 Trommeltrockner mit Wärmepumpentechnologie.",
    shortDesc: "Premium Trommeltrockner mit Wärmepumpe",
    price: 1699.0, sku: "MIELE-TRK845", inStock: true,
    rating: 4.8, reviewCount: 156, categorySlug: "haushaltsgeraete", brandSlug: "miele", weight: 62,
    features: ["Wärmepumpe", "AutoSensoren", "PerfectDry", "8 kg"],
    specs: [
      { key: "Fassungsvermögen", value: "8 kg" }, { key: "Trocknungsart", value: "Wärmepumpe" },
    ],
  },
  {
    name: "Bosch Serie 6 Waschmaschine WGG244Z00",
    slug: "bosch-serie-6-wgg244z00",
    description: "Die Bosch Serie 6 Waschmaschine mit Home Connect, i-DOS und ActiveWater Plus.",
    shortDesc: "Waschmaschine mit i-DOS & Home Connect",
    price: 899.0, sku: "BSH-WGG244Z00", inStock: true,
    rating: 4.7, reviewCount: 312, categorySlug: "haushaltsgeraete", brandSlug: "bosch", weight: 74,
    features: ["i-DOS", "Home Connect", "ActiveWater Plus", "9 kg"],
    tags: ["bestseller"],
    specs: [
      { key: "Füllmenge", value: "9 kg" }, { key: "Energieeffizienz", value: "A+++" },
    ],
  },
  {
    name: "Samsung EcoBubble WW90TP04DSH",
    slug: "samsung-ecobubble-ww90tp04dsh",
    description: "Die Samsung EcoBubble Waschmaschine mit AirWash-Technologie.",
    shortDesc: "EcoBubble mit AirWash-Technologie",
    price: 699.0, originalPrice: 799.0, sku: "SAM-WW90TP", inStock: true, isPromo: true,
    rating: 4.6, reviewCount: 567, categorySlug: "haushaltsgeraete", brandSlug: "samsung", weight: 65,
    features: ["EcoBubble", "AirWash", "Digital Inverter", "Smart Things"],
    specs: [
      { key: "Füllmenge", value: "9 kg" }, { key: "Schleuderdrehzahl", value: "1400 U/min" },
    ],
  },
  {
    name: "AEG LR7A80600 Frontlader",
    slug: "aeg-lr7a80600",
    description: "Die AEG LR7A80600 Waschmaschine mit ProSense Technology.",
    shortDesc: "ProSense Waschmaschine mit Öko-Inverter",
    price: 799.0, sku: "AEG-LR7A80600", inStock: true,
    rating: 4.7, reviewCount: 234, categorySlug: "haushaltsgeraete", brandSlug: "aeg", weight: 70,
    features: ["ProSense Technology", "Öko-Inverter", "Antivibrations-Design"],
    specs: [
      { key: "Füllmenge", value: "8 kg" }, { key: "Energieeffizienz", value: "A+++" },
    ],
  },
  {
    name: "Miele G7966 SCVi AutoDos",
    slug: "miele-g7966-scvi-autodos",
    description: "Der Miele G7966 SCVi - Einbaugeschirrspüler mit AutoDos und PowerDisk.",
    shortDesc: "Premium-Geschirrspüler mit AutoDos & PowerDisk",
    price: 1699.0, sku: "MIELE-G7966", inStock: true, isFeatured: true,
    rating: 4.9, reviewCount: 89, categorySlug: "haushaltsgeraete", brandSlug: "miele", weight: 38,
    features: ["AutoDos", "PowerDisk", "3D-Tac Sensor", "WiFiConn@ct"],
    tags: ["premium", "energieeffizient"],
    specs: [
      { key: "Fassungsvermögen", value: "16 Gedecke" }, { key: "Energieeffizienz", value: "A+++" },
    ],
  },
  {
    name: "Bosch Serie 6 SMV88TX36E",
    slug: "bosch-serie-6-smv88tx36e",
    description: "Der Bosch Serie 6 Einbau-Geschirrspüler mit Zeolith-Trocknung.",
    shortDesc: "Geschirrspüler mit Zeolith & CrystalDry",
    price: 1199.0, sku: "BSH-SMV88TX36E", inStock: true,
    rating: 4.8, reviewCount: 234, categorySlug: "haushaltsgeraete", brandSlug: "bosch", weight: 36,
    features: ["Zeolith-Trocknung", "CrystalDry", "Home Connect"],
    specs: [
      { key: "Fassungsvermögen", value: "14 Gedecke" }, { key: "Geräuschpegel", value: "44 dB(A)" },
    ],
  },
  {
    name: "Siemens iQ700 SN878X04CE",
    slug: "siemens-iq700-sn878x04ce",
    description: "Der Siemens iQ700 Geschirrspüler mit varioDrawer Plus und Zeolith.",
    shortDesc: "Siemens iQ700 mit varioDrawer & Zeolith",
    price: 1099.0, sku: "SI-SN878X04CE", inStock: true,
    rating: 4.7, reviewCount: 178, categorySlug: "haushaltsgeraete", brandSlug: "siemens", weight: 35,
    features: ["varioDrawer Plus", "Zeolith Trocknung", "Home Connect"],
    specs: [
      { key: "Fassungsvermögen", value: "14 Gedecke" }, { key: "Trocknung", value: "Zeolith" },
    ],
  },
  {
    name: "Bosch Serie 2 SKS62E32EU",
    slug: "bosch-serie-2-sks62e32eu",
    description: "Der Bosch Serie 2 Kompakt-Geschirrspüler für die Aufstellschublade.",
    shortDesc: "Kompakt-Geschirrspüler für die Aufstellschublade",
    price: 449.0, sku: "BSH-SKS62E32EU", inStock: true,
    rating: 4.5, reviewCount: 456, categorySlug: "haushaltsgeraete", brandSlug: "bosch", weight: 25,
    features: ["Aufbau-Geschirrspüler", "10 Gedecke", "6 Programme", "AquaStop"],
    specs: [
      { key: "Fassungsvermögen", value: "10 Gedecke" }, { key: "Programme", value: "6 + 3 Spezial" },
    ],
  },
  {
    name: "Liebherr Premium Comfort Kgn 36vi3",
    slug: "liebherr-premium-comfort-kgn36vi3",
    description: "Der Liebherr Premium Comfort Kühlschrank - BioFresh, NoFrost und MagicEye.",
    shortDesc: "Premium Kühlschrank mit BioFresh & NoFrost",
    price: 1499.0, sku: "LB-KGN36VI3", inStock: true,
    rating: 4.8, reviewCount: 134, categorySlug: "haushaltsgeraete", brandSlug: "liebherr", weight: 93,
    features: ["BioFresh", "NoFrost", "MagicEye", "SuperCool"],
    tags: ["premium", "energieeffizient"],
    specs: [
      { key: "Nutzvolumen", value: "362 Liter" }, { key: "Energieeffizienz", value: "A+++" },
    ],
  },
  {
    name: "Liebherr Mono SGNe 5226 Gefrierschrank",
    slug: "liebherr-mono-sgne5226",
    description: "Der Liebherr Mono Gefrierschrank mit NoFrost, SmartFrost und VarioSpace.",
    shortDesc: "Gefrierschrank mit NoFrost & VarioSpace",
    price: 1299.0, sku: "LB-SGNE5226", inStock: true,
    rating: 4.7, reviewCount: 89, categorySlug: "haushaltsgeraete", brandSlug: "liebherr", weight: 85,
    features: ["NoFrost", "SmartFrost", "VarioSpace"],
    specs: [
      { key: "Nutzvolumen", value: "382 Liter" }, { key: "Energieeffizienz", value: "A+++" },
    ],
  },
  {
    name: "Samsung Family Hub Bespoke RB38B7735S9",
    slug: "samsung-family-hub-bespoke-rb38b7735s9",
    description: "Der Samsung Family Hub Kühlschrank mit 21,5 Zoll Touchscreen und AI-Kamera.",
    shortDesc: "Family Hub mit Touchscreen & AI-Kamera",
    price: 2499.0, sku: "SAM-FH-RB38B", inStock: true, isNew: true,
    rating: 4.6, reviewCount: 67, categorySlug: "haushaltsgeraete", brandSlug: "samsung", weight: 115,
    features: ["21,5\" Touchscreen", "AI-Innenraumkamera", "SmartThings"],
    tags: ["premium", "smart-home"],
    specs: [
      { key: "Nutzvolumen", value: "389 Liter" }, { key: "Display", value: "21,5 Zoll TFT" },
    ],
  },
  {
    name: "Bosch Serie 6 KGN39VL3A",
    slug: "bosch-serie-6-kgn39vl3a",
    description: "Der Bosch Serie 6 Kühlschrank mit NoFrost und VitaFresh Pro.",
    shortDesc: "NoFrost Kühlschrank mit VitaFresh Pro",
    price: 1099.0, sku: "BSH-KGN39VL3A", inStock: true,
    rating: 4.7, reviewCount: 234, categorySlug: "haushaltsgeraete", brandSlug: "bosch", weight: 82,
    features: ["NoFrost", "VitaFresh Pro", "Home Connect", "MultiAirflow"],
    specs: [
      { key: "Nutzvolumen", value: "366 Liter" }, { key: "Energieeffizienz", value: "A+++" },
    ],
  },
];

const sampleReviews = [
  { authorName: "Thomas M.", rating: 5, title: "Absolut top!", content: "Super Service und schnell geliefert. Das Gerät funktioniert einwandfrei." },
  { authorName: "Sandra K.", rating: 4, title: "Gutes Preis-Leistungs-Verhältnis", content: "Bin sehr zufrieden mit dem Kauf. Nur die Lieferung hat etwas länger gedauert." },
  { authorName: "Michael B.", rating: 5, title: "Kann ich nur empfehlen!", content: "Top Qualität und tolle Beratung. Gerne wieder." },
  { authorName: "Anna L.", rating: 4, title: "Sehr gut", content: "Das Gerät hält was es verspricht. Ein Stern Abzug wegen der Anleitung." },
  { authorName: "Peter H.", rating: 5, title: "Perfekt", content: "Genau das was ich gesucht habe. Funktioniert hervorragend." },
  { authorName: "Julia W.", rating: 3, title: "Okay, aber nicht perfekt", content: "Funktioniert grundsätzlich gut, aber es gibt ein paar Kleinigkeiten die stören." },
  { authorName: "Marcus S.", rating: 5, title: "Bestes Gerät in seiner Klasse", content: "Habe lange verglichen und mich für dieses Gerät entschieden. Keine bereute Entscheidung." },
  { authorName: "Laura F.", rating: 4, title: "Solide Qualität", content: "Verarbeitung ist erstklassig. Die Bedienung ist intuitiv." },
];

async function main() {
  console.log("🌱 Seeding database...");

  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.review.deleteMany();
  await prisma.newsletter.deleteMany();
  await prisma.productSpec.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.brand.deleteMany();
  await prisma.adminUser.deleteMany();
  await prisma.siteSettings.deleteMany();

  console.log("🗑️  Cleared existing data");

  const bcrypt = await import("bcryptjs");
  const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
  const hashedPassword = await bcrypt.hash(adminPassword, 12);
  await prisma.adminUser.create({
    data: {
      email: adminEmail,
      password: hashedPassword,
      name: "Admin",
      role: "ADMIN",
    },
  });
  console.log(`✅ Admin user created (${adminEmail})`);

  await prisma.siteSettings.create({
    data: {
      bankIban: "DE89 3704 0044 0532 0130 00",
      bankBic: "COBADEFFXXX",
      bankAccountName: "HAUSELIO GmbH",
      bankName: "Commerzbank Berlin",
      shippingInfo: "Kostenloser Versand ab 50€ Bestellwert. Standard-Versand: 4,99€.",
      contactEmail: "info@hauselio.de",
      contactPhone: "+49 (0)30 555 789 01",
      contactAddress: "Kastanienallee 42, 10435 Berlin",
    },
  });
  console.log("✅ Site settings created");

  await prisma.category.createMany({ data: categories });
  const categoryRecords = await prisma.category.findMany({ select: { id: true, slug: true } });
  const categoryMap = Object.fromEntries(categoryRecords.map((c) => [c.slug, c.id]));
  console.log(`✅ ${categories.length} categories created`);

  await prisma.brand.createMany({ data: brands });
  const brandRecords = await prisma.brand.findMany({ select: { id: true, slug: true } });
  const brandMap = Object.fromEntries(brandRecords.map((b) => [b.slug, b.id]));
  console.log(`✅ ${brands.length} brands created`);

  const productRecords: { id: string; slug: string }[] = [];

  for (const product of products) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { categorySlug, brandSlug, specs, features, tags, ...productData } = product;
    const created = await prisma.product.create({
      data: {
        ...productData,
        categoryId: categoryMap[categorySlug],
        brandId: brandMap[brandSlug],
        features: features || [],
        tags: tags || [],
      },
      select: { id: true, slug: true },
    });
    productRecords.push(created);
  }

  const imageData = productRecords.flatMap((p) => [
    { url: `/images/products/${p.slug}.jpg`, alt: p.slug, position: 0, productId: p.id },
  ]);
  await prisma.productImage.createMany({ data: imageData });

  const specData: { key: string; value: string; position: number; productId: string }[] = [];
  for (const product of products) {
    const rec = productRecords.find((r) => r.slug === product.slug);
    if (rec) {
      product.specs.forEach((s, i) => {
        specData.push({ ...s, position: i, productId: rec.id });
      });
    }
  }
  await prisma.productSpec.createMany({ data: specData });

  const reviewData: { rating: number; title: string; content: string; authorName: string; authorEmail: string; isApproved: boolean; productId: string }[] = [];
  for (const rec of productRecords) {
    const reviewCount = Math.floor(Math.random() * 3) + 1;
    for (let i = 0; i < reviewCount; i++) {
      const review = sampleReviews[Math.floor(Math.random() * sampleReviews.length)];
      reviewData.push({
        rating: review.rating,
        title: review.title,
        content: review.content,
        authorName: review.authorName,
        authorEmail: `${review.authorName.toLowerCase().replace(/[^a-z]/g, "")}@example.de`,
        isApproved: true,
        productId: rec.id,
      });
    }
  }
  await prisma.review.createMany({ data: reviewData });

  console.log(`✅ ${products.length} products created with reviews`);

  console.log("🎉 Seeding complete!");
  console.log(`   Categories: ${categories.length}`);
  console.log(`   Brands: ${brands.length}`);
  console.log(`   Products: ${products.length}`);
  console.log(`   Admin: admin@hauselio.de / admin123`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
