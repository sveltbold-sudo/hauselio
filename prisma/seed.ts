import { PrismaClient } from "@prisma/client";
import { readdirSync } from "fs";
import { join } from "path";

const prisma = new PrismaClient();
const IMAGES_DIR = join(process.cwd(), "public", "images", "products");

const adminEmail = "admin@hausaura.de";

  const categories = [
    { name: "Küche & Kochen", slug: "kueche", description: "Hochwertige Küchengeräte für anspruchsvolle Köche. Von Induktionsherden bis zu Premium-Backöfen.", image: "/images/categories/kueche.jpg", sortOrder: 0 },
    { name: "Kaffee", slug: "kaffee", description: "Premium Kaffeemaschinen für den perfekten Genuss. Vollautomaten, Espresso-Maschinen und Filterkaffee.", image: "/images/categories/kaffee.jpg", sortOrder: 1 },
    { name: "Reinigung", slug: "reinigung", description: "Effiziente Reinigungsgeräte für Ihr Zuhause. Staubsauger, Saugroboter und Dampfreiniger.", image: "/images/categories/reinigung.jpg", sortOrder: 2 },
    { name: "Klima", slug: "klima", description: "Klimaanlagen und Luftreiniger für jedes Raumklima. Heizen, Kühlen und Luftreinigung.", image: "/images/categories/klima.jpg", sortOrder: 3 },
    { name: "Smart Home", slug: "smart-home", description: "Intelligente Geräte für ein vernetztes Zuhause. Thermostate, Beleuchtung und Sicherheit.", image: "/images/categories/smart-home.jpg", sortOrder: 4 },
    { name: "Haushaltsgeräte", slug: "haushaltsgeraete", description: "Waschmaschinen, Trockner, Kühlschränke, Geschirrspüler und mehr für den täglichen Bedarf.", image: "/images/categories/haushaltsgeraete.jpg", sortOrder: 5 },
  ];

const brands = [
  { name: "Vorwerk", slug: "vorwerk", logo: "/images/brands/vorwerk.svg" },
  { name: "Thermomix", slug: "thermomix", logo: "/images/brands/thermomix.svg" },
  { name: "KitchenAid", slug: "kitchenaid", logo: "/images/brands/kitchenaid.svg" },
  { name: "Bosch", slug: "bosch", logo: "/images/brands/bosch.svg" },
  { name: "Siemens", slug: "siemens", logo: "/images/brands/siemens.svg" },
  { name: "Miele", slug: "miele", logo: "/images/brands/miele.svg" },
  { name: "Gaggenau", slug: "gaggenau", logo: "/images/brands/gaggenau.svg" },
  { name: "Neff", slug: "neff", logo: "/images/brands/neff.svg" },
  { name: "AEG", slug: "aeg", logo: "/images/brands/aeg.svg" },
  { name: "Electrolux", slug: "electrolux", logo: "/images/brands/electrolux.svg" },
  { name: "Jura", slug: "jura", logo: "/images/brands/jura.svg" },
  { name: "De'Longhi", slug: "delonghi", logo: "/images/brands/delonghi.svg" },
  { name: "Nespresso", slug: "nespresso", logo: "/images/brands/nespresso.svg" },
  { name: "Melitta", slug: "melitta", logo: "/images/brands/melitta.svg" },
  { name: "Breville", slug: "breville", logo: "/images/brands/breville.svg" },
  { name: "Philips", slug: "philips", logo: "/images/brands/philips.svg" },
  { name: "Siemens EQ", slug: "siemens-eq", logo: "/images/brands/siemens.svg" },
  { name: "Saeco", slug: "saeco", logo: "/images/brands/saeco.svg" },
  { name: "Krups", slug: "krups", logo: "/images/brands/krups.svg" },
  { name: "Tchibo", slug: "tchibo", logo: "/images/brands/tchibo.svg" },
  { name: "Gastroback", slug: "gastroback", logo: "/images/brands/gastroback.svg" },
  { name: "Sage", slug: "sage", logo: "/images/brands/sage.svg" },
  { name: "Dyson", slug: "dyson", logo: "/images/brands/dyson.svg" },
  { name: "iRobot", slug: "irobot", logo: "/images/brands/irobot.svg" },
  { name: "Roborock", slug: "roborock", logo: "/images/brands/roborock.svg" },
  { name: "Samsung", slug: "samsung", logo: "/images/brands/samsung.svg" },
  { name: "LG", slug: "lg", logo: "/images/brands/lg.svg" },
  { name: "Xiaomi", slug: "xiaomi", logo: "/images/brands/xiaomi.svg" },
  { name: "Kärcher", slug: "kaercher", logo: "/images/brands/kaercher.svg" },
  { name: "Tefal", slug: "tefal", logo: "/images/brands/tefal.svg" },
  { name: "WMF", slug: "wmf", logo: "/images/brands/wmf.svg" },
  { name: "Ninja", slug: "ninja", logo: "/images/brands/ninja.svg" },
  { name: "Cosori", slug: "cosori", logo: "/images/brands/cosori.svg" },
  { name: "Liebherr", slug: "liebherr", logo: "/images/brands/liebherr.svg" },
  { name: "Haier", slug: "haier", logo: "/images/brands/haier.svg" },
  { name: "BEKO", slug: "beko", logo: "/images/brands/beko.svg" },
  { name: "V-ZUG", slug: "vzug", logo: "/images/brands/vzug.svg" },
  { name: "Stadler Form", slug: "stadler-form", logo: "/images/brands/stadler-form.svg" },
  { name: "Blueair", slug: "blueair", logo: "/images/brands/blueair.svg" },
  { name: "Levoit", slug: "levoit", logo: "/images/brands/levoit.svg" },
  { name: "tado°", slug: "tado", logo: "/images/brands/tado.svg" },
  { name: "Nanoleaf", slug: "nanoleaf", logo: "/images/brands/nanoleaf.svg" },
  { name: "Ring", slug: "ring", logo: "/images/brands/ring.svg" },
  { name: "Netatmo", slug: "netatmo", logo: "/images/brands/netatmo.svg" },
  { name: "IKEA", slug: "ikea", logo: "/images/brands/ikea.svg" },
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
    name: "Thermomix TM7", slug: "thermomix-tm7",
    description: "Der neue Thermomix TM7 - noch leistungsstärker, vielseitiger und benutzerfreundlicher. Über 80 Kochfunktionen in einem Gerät.", shortDesc: "Das ultimative Küchengerät mit 80+ Funktionen",
    price: 1499, originalPrice: 1599, sku: "TM7-2026", inStock: true, isFeatured: true, isNew: true,
    rating: 4.9, reviewCount: 127, categorySlug: "kueche", brandSlug: "thermomix", weight: 7.95, tags: ["bestseller"],
    specs: []
  },
  {
    name: "Thermomix TM6", slug: "thermomix-tm6",
    description: "Der bewährte Thermomix TM6 - zuverlässig, leistungsstark und vielseitig.", shortDesc: "Bewährte Qualität mit 40+ Funktionen",
    price: 1399, sku: "TM6-2025", inStock: true, isFeatured: true,
    rating: 4.8, reviewCount: 342, categorySlug: "kueche", brandSlug: "thermomix", tags: ["bestseller"],
    specs: []
  },
  {
    name: "KitchenAid Artisan Küchenmaschine 5KSM175PSE", slug: "kitchenaid-artisan-5ksm175pse",
    description: "Die KitchenAid Artisan Küchenmaschine - ikonisches Design trifft auf professionelle Leistung.", shortDesc: "Ikonische Küchenmaschine mit 4,8L Schüssel",
    price: 549, originalPrice: 599, sku: "KA-ART-5KSM", inStock: true, isFeatured: true, isPromo: true,
    rating: 4.8, reviewCount: 289, categorySlug: "kueche", brandSlug: "kitchenaid", weight: 10.5, tags: ["bestseller"],
    specs: []
  },
  {
    name: "Bosch Serie 6 Freistehender Herd HKH634ES5", slug: "bosch-serie-6-herd-hkh634es5",
    description: "Der Bosch Serie 6 Herd mit 4 Induktionsherdfeldern und 66L Backofen.", shortDesc: "Induktionsherd mit PerfectBake Technologie",
    price: 1899, sku: "BSH-HKH634ES5", inStock: true,
    rating: 4.7, reviewCount: 78, categorySlug: "kueche", brandSlug: "bosch", weight: 62,
    specs: []
  },
  {
    name: "Siemens iQ700 Backofen HB778GES0", slug: "siemens-iq700-backofen-hb778ges0",
    description: "Der Siemens iQ700 Einbau-Backofen mit pyrolytischer Selbstreinigung.", shortDesc: "Einbau-Backofen mit Pyrolyse",
    price: 1299, sku: "SI-HB778GES0", inStock: true, isNew: true,
    rating: 4.8, reviewCount: 45, categorySlug: "kueche", brandSlug: "siemens", weight: 38,
    specs: []
  },
  {
    name: "Gaggenau Vario 200 induktion Kochfeld", slug: "gaggenau-vario-200-induktion",
    description: "Das Gaggenau Vario 200 Kochfeld - flexibles Induktionssystem.", shortDesc: "Premium-Induktion mit flexibler Kochfläche",
    price: 2499, sku: "GAG-V200-IND", inStock: true,
    rating: 4.9, reviewCount: 34, categorySlug: "kueche", brandSlug: "gaggenau",
    specs: []
  },
  {
    name: "Jura E8 Platinum", slug: "jura-e8-platinum",
    description: "Die Jura E8 - Vollautomatischer Kaffeevollautomat der Extraklasse.", shortDesc: "Premium Kaffeevollautomat mit P.E.P. Technologie",
    price: 1199, originalPrice: 1299, sku: "JURA-E8-PL", inStock: true, isFeatured: true, isPromo: true,
    rating: 4.8, reviewCount: 156, categorySlug: "kaffee", brandSlug: "jura", weight: 9.6, tags: ["bestseller"],
    specs: []
  },
  {
    name: "Jura Z10 Platinum", slug: "jura-z10-platinum",
    description: "Die Jura Z10 - Das Flaggschiff unter den Vollautomaten.", shortDesc: "Top-Vollautomat mit Cold Brew & 32 Spezialitäten",
    price: 2199, sku: "JURA-Z10-PL", inStock: true, isFeatured: true, isNew: true,
    rating: 4.9, reviewCount: 67, categorySlug: "kaffee", brandSlug: "jura", weight: 12.3, tags: ["bestseller"],
    specs: []
  },
  {
    name: "De'Longhi Magnifica S ECAM 22.110.B", slug: "delonghi-magnifica-s-ecam22110b",
    description: "Die De'Longhi Magnifica S - kompakter Vollautomat mit integriertem Mahlwerk.", shortDesc: "Kompakter Vollautomat für den Einstieg",
    price: 349, sku: "DEL-ECAM22110B", inStock: true,
    rating: 4.5, reviewCount: 892, categorySlug: "kaffee", brandSlug: "delonghi", weight: 9,
    specs: []
  },
  {
    name: "Nespresso Vertuo Pop+", slug: "nespresso-vertuo-pop-plus",
    description: "Die Nespresso Vertuo Pop+ - kompakter Kapselmaschine mit Centrifusion-Technologie.", shortDesc: "Kompakte Kapselmaschine mit 5 Tassengrößen",
    price: 99, sku: "NES-VPOP-PLUS", inStock: true, isNew: true,
    rating: 4.3, reviewCount: 234, categorySlug: "kaffee", brandSlug: "nespresso", weight: 3.5,
    specs: []
  },
  {
    name: "Melitta Purista Aromatica Pure Black", slug: "melitta-purista-pure-black",
    description: "Die Melitta Purista - minimalistischer Filterkaffeebereiter.", shortDesc: "Minimalistischer Filterkaffee-Automat",
    price: 249, sku: "MEL-PURISTA", inStock: true,
    rating: 4.6, reviewCount: 445, categorySlug: "kaffee", brandSlug: "melitta",
    specs: []
  },
  {
    name: "Breville Barista Express Impress", slug: "breville-barista-express-impress",
    description: "Die Breville Barista Express Impress - Halbautomatischer Espressomaschine.", shortDesc: "Halbautomat mit Mahlwerk & Impression Dosing",
    price: 699, sku: "BREV-BEI", inStock: true,
    rating: 4.7, reviewCount: 156, categorySlug: "kaffee", brandSlug: "breville", weight: 11.5,
    specs: []
  },
  {
    name: "Dyson V15 Detect Absolute", slug: "dyson-v15-detect-absolute",
    description: "Der Dyson V15 Detect Absolute - der leistungsstärkste kabellose Staubsauger.", shortDesc: "Kabelloser Staubsauger mit Laser-Technologie",
    price: 749, sku: "DY-V15-ABS", inStock: true, isFeatured: true, isNew: true,
    rating: 4.7, reviewCount: 89, categorySlug: "reinigung", brandSlug: "dyson", weight: 3.1, tags: ["bestseller"],
    specs: []
  },
  {
    name: "Dyson Gen5detect Absolute", slug: "dyson-gen5detect-absolute",
    description: "Der Dyson Gen5detect Absolute - die nächste Generation der Saugroboter.", shortDesc: "Top Saugleistung mit 280 AW",
    price: 949, sku: "DY-GEN5-ABS", inStock: true,
    rating: 4.8, reviewCount: 45, categorySlug: "reinigung", brandSlug: "dyson", weight: 3.5,
    specs: []
  },
  {
    name: "Dyson Big Ball Animal Pro", slug: "dyson-big-ball-animal-pro",
    description: "Der Dyson Big Ball Animal Pro - leistungsstarker Staubsauger für Tierhalter.", shortDesc: "Kabellöser Staubsauger für Tierhalter",
    price: 549, sku: "DY-BBAP", inStock: true,
    rating: 4.5, reviewCount: 187, categorySlug: "reinigung", brandSlug: "dyson", weight: 7.2,
    specs: []
  },
  {
    name: "Kärcher SC 4 EasyFix Premium", slug: "kaercher-sc4-easyfix-premium",
    description: "Der Kärcher SC 4 EasyFix Premium - dampfreiniger mit Geschirrspültank.", shortDesc: "Dampfreiniger mit Geschirrspültank",
    price: 229, sku: "KA-SC4-EFP", inStock: true,
    rating: 4.7, reviewCount: 567, categorySlug: "reinigung", brandSlug: "kaercher", weight: 6,
    specs: []
  },
  {
    name: "Dyson Purifier Big Quiet Formaldehyde", slug: "dyson-purifier-big-quiet",
    description: "Der Dyson Purifier Big Quiet - Luftreiniger und Heizstrahler in einem.", shortDesc: "Luftreiniger mit formaldehydzerstörendem Katalysator",
    price: 899, sku: "DY-PUR-BQF", inStock: true, isFeatured: true,
    rating: 4.7, reviewCount: 67, categorySlug: "klima", brandSlug: "dyson", weight: 8.5, tags: ["bestseller"],
    specs: []
  },
  {
    name: "Dyson Pure Cool TP09", slug: "dyson-pure-cool-tp09",
    description: "Der Dyson Pure Cool TP09 - Luftreiniger und Ventilator.", shortDesc: "Luftreiniger & Ventilator mit Air-Quality-Display",
    price: 499, originalPrice: 549, sku: "DY-TP09", inStock: true, isPromo: true,
    rating: 4.6, reviewCount: 123, categorySlug: "klima", brandSlug: "dyson",
    specs: []
  },
  {
    name: "Stadler Form Oskar Big", slug: "stadler-form-oskar-big",
    description: "Der Stadler Form Oskar Big - eleganter Luftbefeuchter für Räume bis 80 m².", shortDesc: "Eleganter Luftbefeuchter für bis 80 m²",
    price: 189, sku: "SF-OSKAR-BIG", inStock: true,
    rating: 4.4, reviewCount: 234, categorySlug: "klima", brandSlug: "stadler-form",
    specs: []
  },
  {
    name: "tado° Smart Thermostat Starter Kit V3+", slug: "tado-smart-thermostat-v3plus",
    description: "Das tado° Smart Thermostat V3+ Starter Kit - intelligente Heizungssteuerung.", shortDesc: "Intelligente Heizungssteuerung mit bis zu 30% Ersparnis",
    price: 149, originalPrice: 199, sku: "TADO-V3PLUS-SK", inStock: true, isFeatured: true, isPromo: true,
    rating: 4.6, reviewCount: 1234, categorySlug: "smart-home", brandSlug: "tado", tags: ["bestseller"],
    specs: []
  },
  {
    name: "Miele G7966 SCVi AutoDos", slug: "miele-g7966-scvi-autodos",
    description: "Der Miele G7966 SCVi - Einbaugeschirrspüler mit AutoDos und PowerDisk.", shortDesc: "Premium-Geschirrspüler mit AutoDos & PowerDisk",
    price: 1699, sku: "MIELE-G7966", inStock: true, isFeatured: true,
    rating: 4.9, reviewCount: 89, categorySlug: "haushaltsgeraete", brandSlug: "miele", weight: 38, tags: ["bestseller"],
    specs: []
  },
  {
    name: "tado° Smart AC Control V3+", slug: "tado-smart-ac-control-v3plus",
    description: "Das tado° Smart AC Control V3+ - intelligente Steuerung für Klimaanlagen.", shortDesc: "Smart AC Controller für Klimaanlagen",
    price: 99, sku: "TADO-ACV3", inStock: true,
    rating: 4.5, reviewCount: 567, categorySlug: "smart-home", brandSlug: "tado",
    specs: []
  },
  {
    name: "Philips Hue Starter Kit E27", slug: "philips-hue-starter-kit-e27",
    description: "Das Philips Hue Starter Kit mit Bridge und 3 E27 White & Color Ambiance.", shortDesc: "Starter Kit mit Bridge & 3 Farb-LEDs",
    price: 149, originalPrice: 179, sku: "PH-HUE-SK-E27", inStock: true,
    rating: 4.7, reviewCount: 2345, categorySlug: "smart-home", brandSlug: "philips",
    specs: []
  },
  {
    name: "Nanoleaf Shapes Hexagons Starter Kit", slug: "nanoleaf-shapes-hexagons",
    description: "Die Nanoleaf Shapes Hexagons - modulare LED-Panele für kreative Wandgestaltung.", shortDesc: "Modulare LED-Panele mit Touch & Musik-Sync",
    price: 199, sku: "NANO-SH-HEX", inStock: true,
    rating: 4.4, reviewCount: 345, categorySlug: "smart-home", brandSlug: "nanoleaf",
    specs: []
  },
  {
    name: "Ring Video Doorbell 4", slug: "ring-video-doorbell-4",
    description: "Die Ring Video Doorbell 4 - smartes Türklingelsystem mit Video.", shortDesc: "Smartes Türklingelsystem mit Video",
    price: 199, sku: "RING-VDB4", inStock: true,
    rating: 4.5, reviewCount: 1234, categorySlug: "smart-home", brandSlug: "ring",
    specs: []
  },
  {
    name: "Liebherr Premium Comfort Kgn 36vi3", slug: "liebherr-premium-comfort-kgn36vi3",
    description: "Der Liebherr Premium Comfort Kühlschrank - BioFresh, NoFrost und MagicEye.", shortDesc: "Premium Kühlschrank mit BioFresh & NoFrost",
    price: 1499, sku: "LB-KGN36VI3", inStock: true,
    rating: 4.8, reviewCount: 134, categorySlug: "haushaltsgeraete", brandSlug: "liebherr", weight: 93,
    specs: []
  },
  {
    name: "Miele W1 Waschmaschine WCI870 WCS", slug: "miele-w1-waschmaschine-wci870",
    description: "Die Miele W1 Frontlader-Waschmaschine - revolutionäre Pflege mit TwinDos.", shortDesc: "Premium Waschmaschine mit TwinDos Technologie",
    price: 1899, sku: "MIELE-WCI870", inStock: true, isFeatured: true,
    rating: 4.9, reviewCount: 203, categorySlug: "haushaltsgeraete", brandSlug: "miele", weight: 87, tags: ["bestseller"],
    specs: []
  },
  {
    name: "Liebherr Mono Sgne5226", slug: "liebherr-mono-sgne5226",
    description: "Liebherr Mono Sgne5226 – hochwertiges Haushaltsgerät.", shortDesc: "Liebherr Mono Sgne5226",
    price: 2840, sku: "LIEBHERRMONOSGN", inStock: true, isFeatured: true,
    rating: 4.4, reviewCount: 62, categorySlug: "haushaltsgeraete", brandSlug: "liebherr",
    specs: []
  },
  {
    name: "Miele T1 Trommeltrockner TRK845 WP", slug: "miele-t1-trockner-trk845",
    description: "Der Miele T1 Trommeltrockner mit Wärmepumpentechnologie.", shortDesc: "Premium Trommeltrockner mit Wärmepumpe",
    price: 1699, sku: "MIELE-TRK845", inStock: true,
    rating: 4.8, reviewCount: 156, categorySlug: "haushaltsgeraete", brandSlug: "miele", weight: 62,
    specs: []
  },
  {
    name: "Samsung Family Hub Bespoke RB38B7735S9", slug: "samsung-family-hub-bespoke-rb38b7735s9",
    description: "Der Samsung Family Hub Kühlschrank mit 21,5 Zoll Touchscreen und AI-Kamera.", shortDesc: "Family Hub mit Touchscreen & AI-Kamera",
    price: 2499, sku: "SAM-FH-RB38B", inStock: true, isNew: true,
    rating: 4.6, reviewCount: 67, categorySlug: "haushaltsgeraete", brandSlug: "samsung", weight: 115,
    specs: []
  },
  {
    name: "Bosch Serie 6 Waschmaschine WGG244Z00", slug: "bosch-serie-6-wgg244z00",
    description: "Die Bosch Serie 6 Waschmaschine mit Home Connect, i-DOS und ActiveWater Plus.", shortDesc: "Waschmaschine mit i-DOS & Home Connect",
    price: 899, sku: "BSH-WGG244Z00", inStock: true,
    rating: 4.7, reviewCount: 312, categorySlug: "haushaltsgeraete", brandSlug: "bosch", weight: 74,
    specs: []
  },
  {
    name: "Samsung EcoBubble WW90TP04DSH", slug: "samsung-ecobubble-ww90tp04dsh",
    description: "Die Samsung EcoBubble Waschmaschine mit AirWash-Technologie.", shortDesc: "EcoBubble mit AirWash-Technologie",
    price: 699, originalPrice: 799, sku: "SAM-WW90TP", inStock: true, isPromo: true,
    rating: 4.6, reviewCount: 567, categorySlug: "haushaltsgeraete", brandSlug: "samsung", weight: 65,
    specs: []
  },
  {
    name: "KitchenAid Artisan Mini 5ksm33", slug: "kitchenaid-artisan-mini-5ksm33",
    description: "KitchenAid Artisan Mini 5ksm33 – hochwertiges Haushaltsgerät.", shortDesc: "KitchenAid Artisan Mini 5ksm33",
    price: 770, sku: "KITCHENAIDAR2", inStock: true,
    rating: 4.3, reviewCount: 260, categorySlug: "kueche", brandSlug: "kitchenaid",
    specs: []
  },
  {
    name: "Vorwerk Thermomix Tm5", slug: "vorwerk-thermomix-tm5",
    description: "Vorwerk Thermomix Tm5 – hochwertiges Haushaltsgerät.", shortDesc: "Vorwerk Thermomix Tm5",
    price: 1660, sku: "VORWERKTHERMOMI", inStock: true,
    rating: 4, reviewCount: 237, categorySlug: "kueche", brandSlug: "vorwerk",
    specs: []
  },
  {
    name: "Sage The Bakery Boss", slug: "sage-the-bakery-boss",
    description: "Sage The Bakery Boss – hochwertiges Haushaltsgerät.", shortDesc: "Sage The Bakery Boss",
    price: 1730, sku: "SAGETHEBAKERYBO", inStock: true,
    rating: 4.4, reviewCount: 65, categorySlug: "kueche", brandSlug: "sage",
    specs: []
  },
  {
    name: "Ninja Foodi Multi Cooker Nc300", slug: "ninja-foodi-multi-cooker-nc300",
    description: "Ninja Foodi Multi Cooker Nc300 – hochwertiges Haushaltsgerät.", shortDesc: "Ninja Foodi Multi Cooker Nc300",
    price: 1580, sku: "NINJAFOODIMULTI", inStock: true, isPromo: true,
    rating: 4.3, reviewCount: 226, categorySlug: "kueche", brandSlug: "ninja",
    specs: []
  },
  {
    name: "WMF Kitchenminis Handmixer", slug: "wmf-kitchenminis-handmixer",
    description: "WMF Kitchenminis Handmixer – hochwertiges Haushaltsgerät.", shortDesc: "WMF Kitchenminis Handmixer",
    price: 1080, sku: "WMFKITCHENMI2", inStock: true,
    rating: 4.7, reviewCount: 276, categorySlug: "kueche", brandSlug: "wmf",
    specs: []
  },
  {
    name: "Tefal Jamie Oliver Cook Smart", slug: "tefal-jamie-oliver-cook-smart",
    description: "Tefal Jamie Oliver Cook Smart – hochwertiges Haushaltsgerät.", shortDesc: "Tefal Jamie Oliver Cook Smart",
    price: 540, sku: "TEFALJAMIEOLIVE", inStock: true,
    rating: 4.2, reviewCount: 166, categorySlug: "kueche", brandSlug: "tefal",
    specs: []
  },
  {
    name: "Gastroback Advanced Dual Plus 40882", slug: "gastroback-advanced-dual-plus-40882",
    description: "Gastroback Advanced Dual Plus 40882 – hochwertiges Haushaltsgerät.", shortDesc: "Gastroback Advanced Dual Plus 40882",
    price: 380, sku: "GASTROBACKAD2", inStock: true, isPromo: true,
    rating: 4.7, reviewCount: 273, categorySlug: "kueche", brandSlug: "gastroback",
    specs: []
  },
  {
    name: "Vorwerk Kobold VK200", slug: "vorwerk-kobold-vk200",
    description: "Vorwerk Kobold VK200 – hochwertiges Haushaltsgerät.", shortDesc: "Vorwerk Kobold VK200",
    price: 840, sku: "VORWERKKOBOL2", inStock: true,
    rating: 4.5, reviewCount: 236, categorySlug: "haushaltsgeraete", brandSlug: "vorwerk",
    specs: []
  },
  {
    name: "Kenwood Chef Xl Elite Kvl6325s", slug: "kenwood-chef-xl-elite-kvl6325s",
    description: "Kenwood Chef Xl Elite Kvl6325s – hochwertiges Haushaltsgerät.", shortDesc: "Kenwood Chef Xl Elite Kvl6325s",
    price: 1880, sku: "KENWOODCHEFXLEL", inStock: true, isFeatured: true,
    rating: 4.1, reviewCount: 303, categorySlug: "kueche", brandSlug: "kenwood",
    specs: []
  },
  {
    name: "Russell Hobbs Hobbs Go Create Handmixer", slug: "russell-hobbs-go-create-handmixer",
    description: "Russell Hobbs Hobbs Go Create Handmixer – hochwertiges Haushaltsgerät.", shortDesc: "Russell Hobbs Hobbs Go Create Handmixer",
    price: 1970, sku: "RUSSELLHOBBSGOC", inStock: true, isNew: true, isPromo: true,
    rating: 4.7, reviewCount: 219, categorySlug: "kueche", brandSlug: "russell",
    specs: []
  },
  {
    name: "Bosch Mfq3540 Handmixer", slug: "bosch-mfq3540-handmixer",
    description: "Bosch Mfq3540 Handmixer – hochwertiges Haushaltsgerät.", shortDesc: "Bosch Mfq3540 Handmixer",
    price: 170, sku: "BOSCHMFQ3540HAN", inStock: true, isPromo: true,
    rating: 4.8, reviewCount: 232, categorySlug: "kueche", brandSlug: "bosch",
    specs: []
  },
  {
    name: "Electrolux Assist 9 Handmixer", slug: "electrolux-assist-9-handmixer",
    description: "Electrolux Assist 9 Handmixer – hochwertiges Haushaltsgerät.", shortDesc: "Electrolux Assist 9 Handmixer",
    price: 1700, sku: "ELECTROLUXASSIS", inStock: true,
    rating: 4.4, reviewCount: 298, categorySlug: "kueche", brandSlug: "electrolux",
    specs: []
  },
  {
    name: "AEG Hm 400 Handmixer", slug: "aeg-hm-400-handmixer",
    description: "AEG Hm 400 Handmixer – hochwertiges Haushaltsgerät.", shortDesc: "AEG Hm 400 Handmixer",
    price: 830, sku: "AEGHM400HANDMIX", inStock: true, isPromo: true,
    rating: 4.4, reviewCount: 110, categorySlug: "kueche", brandSlug: "aeg",
    specs: []
  },
  {
    name: "Braun Mq7 Multiquick Handmixer", slug: "braun-mq7-multiquick-handmixer",
    description: "Braun Mq7 Multiquick Handmixer – hochwertiges Haushaltsgerät.", shortDesc: "Braun Mq7 Multiquick Handmixer",
    price: 2270, sku: "BRAUNMQ7MULTIQU", inStock: true, isPromo: true,
    rating: 4.4, reviewCount: 31, categorySlug: "kueche", brandSlug: "braun",
    specs: []
  },
  {
    name: "Philips Hr3655 Handmixer", slug: "philips-hr3655-handmixer",
    description: "Philips Hr3655 Handmixer – hochwertiges Haushaltsgerät.", shortDesc: "Philips Hr3655 Handmixer",
    price: 610, sku: "PHILIPSHR3655HA", inStock: true, isNew: true,
    rating: 4.2, reviewCount: 26, categorySlug: "kueche", brandSlug: "philips",
    specs: []
  },
  {
    name: "Smeg Hmf01 Handmixer", slug: "smeg-hmf01-handmixer",
    description: "Smeg Hmf01 Handmixer – hochwertiges Haushaltsgerät.", shortDesc: "Smeg Hmf01 Handmixer",
    price: 2210, sku: "SMEGHMF01HANDMI", inStock: true, isNew: true,
    rating: 4.6, reviewCount: 118, categorySlug: "kueche", brandSlug: "smeg",
    specs: []
  },
  {
    name: "Smeg 50er Jahre Hmf02 Handmixer", slug: "smeg-50er-jahre-hmf02-handmixer",
    description: "Smeg 50er Jahre Hmf02 Handmixer – hochwertiges Haushaltsgerät.", shortDesc: "Smeg 50er Jahre Hmf02 Handmixer",
    price: 580, sku: "SMEG50ERJAHREHM", inStock: true,
    rating: 4.7, reviewCount: 302, categorySlug: "kueche", brandSlug: "smeg",
    specs: []
  },
  {
    name: "Russell Hobbs Hobbs Eagle 23211 Handmixer", slug: "russell-hobbs-eagle-23211-handmixer",
    description: "Russell Hobbs Hobbs Eagle 23211 Handmixer – hochwertiges Haushaltsgerät.", shortDesc: "Russell Hobbs Hobbs Eagle 23211 Handmixer",
    price: 2020, sku: "RUSSELLHOBBSEAG", inStock: true, isPromo: true,
    rating: 4, reviewCount: 264, categorySlug: "kueche", brandSlug: "russell",
    specs: []
  },
  {
    name: "Moulinex Optichef Ht4101 Handmixer", slug: "moulinex-optichef-ht4101-handmixer",
    description: "Moulinex Optichef Ht4101 Handmixer – hochwertiges Haushaltsgerät.", shortDesc: "Moulinex Optichef Ht4101 Handmixer",
    price: 1120, sku: "MOULINEXOPTICHE", inStock: true, isNew: true, isPromo: true,
    rating: 4.2, reviewCount: 247, categorySlug: "kueche", brandSlug: "moulinex",
    specs: []
  },
  {
    name: "Tefal Optichef Ht4508 Handmixer", slug: "tefal-optichef-ht4508-handmixer",
    description: "Tefal Optichef Ht4508 Handmixer – hochwertiges Haushaltsgerät.", shortDesc: "Tefal Optichef Ht4508 Handmixer",
    price: 1240, sku: "TEFALOPTICHEFHT", inStock: true, isPromo: true,
    rating: 4.2, reviewCount: 122, categorySlug: "kueche", brandSlug: "tefal",
    specs: []
  },
  {
    name: "Black+Decker Decker 600w Handmixer", slug: "black-decker-600w-handmixer",
    description: "Black+Decker Decker 600w Handmixer – hochwertiges Haushaltsgerät.", shortDesc: "Black+Decker Decker 600w Handmixer",
    price: 570, sku: "BLACKDECKER600W", inStock: true,
    rating: 4.3, reviewCount: 226, categorySlug: "kueche", brandSlug: "black",
    specs: []
  },
  {
    name: "KitchenAid Artisan 5khb25ay Handmixer", slug: "kitchenaid-artisan-5khb25ay-handmixer",
    description: "KitchenAid Artisan 5khb25ay Handmixer – hochwertiges Haushaltsgerät.", shortDesc: "KitchenAid Artisan 5khb25ay Handmixer",
    price: 1390, sku: "KITCHENAIDARTIS", inStock: true,
    rating: 4.2, reviewCount: 292, categorySlug: "kueche", brandSlug: "kitchenaid",
    specs: []
  },
  {
    name: "Bosch Mums2ew48 Kuechenmaschine", slug: "bosch-mums2ew48-kuechenmaschine",
    description: "Bosch Mums2ew48 Kuechenmaschine – hochwertiges Haushaltsgerät.", shortDesc: "Bosch Mums2ew48 Kuechenmaschine",
    price: 2160, sku: "BOSCHMUMS2EW48K", inStock: true, isPromo: true,
    rating: 4.5, reviewCount: 266, categorySlug: "kueche", brandSlug: "bosch",
    specs: []
  },
  {
    name: "Moulinex Quickmix 654 Handmixer", slug: "moulinex-quickmix-654-handmixer",
    description: "Moulinex Quickmix 654 Handmixer – hochwertiges Haushaltsgerät.", shortDesc: "Moulinex Quickmix 654 Handmixer",
    price: 2170, sku: "MOULINEXQUICKMI", inStock: true, isNew: true,
    rating: 4.8, reviewCount: 227, categorySlug: "kueche", brandSlug: "moulinex",
    specs: []
  },
  {
    name: "Kenwood Hm430 Handmixer", slug: "kenwood-hm430-handmixer",
    description: "Kenwood Hm430 Handmixer – hochwertiges Haushaltsgerät.", shortDesc: "Kenwood Hm430 Handmixer",
    price: 1170, sku: "KENWOODHM430HAN", inStock: true, isPromo: true,
    rating: 4.6, reviewCount: 163, categorySlug: "kueche", brandSlug: "kenwood",
    specs: []
  },
  {
    name: "Jura E4 Platinum", slug: "jura-e4-platinum",
    description: "Jura E4 Platinum – hochwertiges Haushaltsgerät.", shortDesc: "Jura E4 Platinum",
    price: 940, sku: "JURAE4PLATINUM", inStock: true, isPromo: true,
    rating: 4.1, reviewCount: 83, categorySlug: "kaffee", brandSlug: "jura",
    specs: []
  },
  {
    name: "Jura S8 Chrome", slug: "jura-s8-chrome",
    description: "Jura S8 Chrome – hochwertiges Haushaltsgerät.", shortDesc: "Jura S8 Chrome",
    price: 2060, sku: "JURAS8CHROME", inStock: true,
    rating: 4.7, reviewCount: 268, categorySlug: "kaffee", brandSlug: "jura",
    specs: []
  },
  {
    name: "Jura D6 Dark Inox", slug: "jura-d6-dark-inox",
    description: "Jura D6 Dark Inox – hochwertiges Haushaltsgerät.", shortDesc: "Jura D6 Dark Inox",
    price: 1240, sku: "JURAD6DARKINOX", inStock: true,
    rating: 4.9, reviewCount: 14, categorySlug: "kaffee", brandSlug: "jura",
    specs: []
  },
  {
    name: "De'Longhi Magnifica Evo Ecam29233", slug: "delonghi-magnifica-evo-ecam29233",
    description: "De'Longhi Magnifica Evo Ecam29233 – hochwertiges Haushaltsgerät.", shortDesc: "De'Longhi Magnifica Evo Ecam29233",
    price: 1090, sku: "DELONGHIMAGNIFI", inStock: true,
    rating: 4.1, reviewCount: 35, categorySlug: "kaffee", brandSlug: "delonghi",
    specs: []
  },
  {
    name: "De'Longhi Dinamica Ecam35055", slug: "delonghi-dinamica-ecam35055",
    description: "De'Longhi Dinamica Ecam35055 – hochwertiges Haushaltsgerät.", shortDesc: "De'Longhi Dinamica Ecam35055",
    price: 1200, sku: "DELONGHIDINAMIC", inStock: true, isNew: true,
    rating: 4.5, reviewCount: 78, categorySlug: "kaffee", brandSlug: "delonghi",
    specs: []
  },
  {
    name: "De'Longhi Primadonna Soul Ecam61075", slug: "delonghi-primadonna-soul-ecam61075",
    description: "De'Longhi Primadonna Soul Ecam61075 – hochwertiges Haushaltsgerät.", shortDesc: "De'Longhi Primadonna Soul Ecam61075",
    price: 1980, sku: "DELONGHIPRIMADO", inStock: true, isPromo: true,
    rating: 4.3, reviewCount: 308, categorySlug: "kaffee", brandSlug: "delonghi",
    specs: []
  },
  {
    name: "Siemens Eq9 Plus S700", slug: "siemens-eq9-plus-s700",
    description: "Siemens Eq9 Plus S700 – hochwertiges Haushaltsgerät.", shortDesc: "Siemens Eq9 Plus S700",
    price: 950, sku: "SIEMENSEQ9PLUSS", inStock: true,
    rating: 4.9, reviewCount: 100, categorySlug: "kaffee", brandSlug: "siemens",
    specs: []
  },
  {
    name: "Siemens Eq500 Plus S500", slug: "siemens-eq500-plus-s500",
    description: "Siemens Eq500 Plus S500 – hochwertiges Haushaltsgerät.", shortDesc: "Siemens Eq500 Plus S500",
    price: 2030, sku: "SIEMENSEQ500PLU", inStock: true,
    rating: 4.2, reviewCount: 130, categorySlug: "kaffee", brandSlug: "siemens",
    specs: []
  },
  {
    name: "Siemens Eq300 S300", slug: "siemens-eq300-s300",
    description: "Siemens Eq300 S300 – hochwertiges Haushaltsgerät.", shortDesc: "Siemens Eq300 S300",
    price: 1710, sku: "SIEMENSEQ300S30", inStock: true,
    rating: 4.2, reviewCount: 304, categorySlug: "kaffee", brandSlug: "siemens",
    specs: []
  },
  {
    name: "Saeco Xelsis Sm8780", slug: "saeco-xelsis-sm8780",
    description: "Saeco Xelsis Sm8780 – hochwertiges Haushaltsgerät.", shortDesc: "Saeco Xelsis Sm8780",
    price: 2380, sku: "SAECOXELSISSM87", inStock: true,
    rating: 4.1, reviewCount: 62, categorySlug: "kaffee", brandSlug: "saeco",
    specs: []
  },
  {
    name: "Saeco Granarista Sm5580", slug: "saeco-granarista-sm5580",
    description: "Saeco Granarista Sm5580 – hochwertiges Haushaltsgerät.", shortDesc: "Saeco Granarista Sm5580",
    price: 750, sku: "SAECOGRANARISTA", inStock: true, isPromo: true,
    rating: 4.3, reviewCount: 119, categorySlug: "kaffee", brandSlug: "saeco",
    specs: []
  },
  {
    name: "Krups Virtuoso Xp442c10", slug: "krups-virtuoso-xp442c10",
    description: "Krups Virtuoso Xp442c10 – hochwertiges Haushaltsgerät.", shortDesc: "Krups Virtuoso Xp442c10",
    price: 2360, sku: "KRUPSVIRTUOSOXP", inStock: true, isPromo: true,
    rating: 4.7, reviewCount: 79, categorySlug: "kaffee", brandSlug: "krups",
    specs: []
  },
  {
    name: "Krups Evidence Plus Ea894c", slug: "krups-evidence-plus-ea894c",
    description: "Krups Evidence Plus Ea894c – hochwertiges Haushaltsgerät.", shortDesc: "Krups Evidence Plus Ea894c",
    price: 1170, sku: "KRUPSEVIDENCEPL", inStock: true, isPromo: true,
    rating: 4.2, reviewCount: 274, categorySlug: "kaffee", brandSlug: "krups",
    specs: []
  },
  {
    name: "Tchibo Barista Bean To Cup", slug: "tchibo-barista-bean-to-cup",
    description: "Tchibo Barista Bean To Cup – hochwertiges Haushaltsgerät.", shortDesc: "Tchibo Barista Bean To Cup",
    price: 1600, sku: "TCHIBOBARISTABE", inStock: true, isPromo: true,
    rating: 4.5, reviewCount: 286, categorySlug: "kaffee", brandSlug: "tchibo",
    specs: []
  },
  {
    name: "Tchibo Privilegio Bean To Cup", slug: "tchibo-privilegio-bean-to-cup",
    description: "Tchibo Privilegio Bean To Cup – hochwertiges Haushaltsgerät.", shortDesc: "Tchibo Privilegio Bean To Cup",
    price: 2790, sku: "TCHIBOPRIVILEGI", inStock: true, isPromo: true,
    rating: 4.6, reviewCount: 257, categorySlug: "haushaltsgeraete", brandSlug: "tchibo",
    specs: []
  },
  {
    name: "Melitta Purista Pure Black Neu", slug: "melitta-purista-pure-black-neu",
    description: "Melitta Purista Pure Black Neu – hochwertiges Haushaltsgerät.", shortDesc: "Melitta Purista Pure Black Neu",
    price: 1310, sku: "MELITTAPURISTAP", inStock: true, isPromo: true,
    rating: 4.2, reviewCount: 217, categorySlug: "kaffee", brandSlug: "melitta",
    specs: []
  },
  {
    name: "Melitta Look V Style Perfekt", slug: "melitta-look-v-style-perfekt",
    description: "Melitta Look V Style Perfekt – hochwertiges Haushaltsgerät.", shortDesc: "Melitta Look V Style Perfekt",
    price: 650, sku: "MELITTALOOKVSTY", inStock: true,
    rating: 4.1, reviewCount: 170, categorySlug: "kaffee", brandSlug: "melitta",
    specs: []
  },
  {
    name: "Melitta Enjoy 5 Purge", slug: "melitta-enjoy-5-purge",
    description: "Melitta Enjoy 5 Purge – hochwertiges Haushaltsgerät.", shortDesc: "Melitta Enjoy 5 Purge",
    price: 960, sku: "MELITTAENJOY5PU", inStock: true, isPromo: true,
    rating: 4.4, reviewCount: 67, categorySlug: "kaffee", brandSlug: "melitta",
    specs: []
  },
  {
    name: "Breville Barista Express", slug: "breville-barista-express",
    description: "Breville Barista Express – hochwertiges Haushaltsgerät.", shortDesc: "Breville Barista Express",
    price: 1720, sku: "BREVILLEBARI2", inStock: true,
    rating: 4.9, reviewCount: 281, categorySlug: "kaffee", brandSlug: "breville",
    specs: []
  },
  {
    name: "Breville Barista Touch", slug: "breville-barista-touch",
    description: "Breville Barista Touch – hochwertiges Haushaltsgerät.", shortDesc: "Breville Barista Touch",
    price: 1230, sku: "BREVILLEBARISTA", inStock: true,
    rating: 4.8, reviewCount: 107, categorySlug: "kaffee", brandSlug: "breville",
    specs: []
  },
  {
    name: "Sage Barista Express Impress", slug: "sage-barista-express-impress",
    description: "Sage Barista Express Impress – hochwertiges Haushaltsgerät.", shortDesc: "Sage Barista Express Impress",
    price: 1360, sku: "SAGEBARISTAEXPR", inStock: true, isPromo: true,
    rating: 4.7, reviewCount: 241, categorySlug: "haushaltsgeraete", brandSlug: "sage",
    specs: []
  },
  {
    name: "Sage The Oracle Touch", slug: "sage-the-oracle-touch",
    description: "Sage The Oracle Touch – hochwertiges Haushaltsgerät.", shortDesc: "Sage The Oracle Touch",
    price: 2420, sku: "SAGETHEORACLETO", inStock: true,
    rating: 4.2, reviewCount: 179, categorySlug: "haushaltsgeraete", brandSlug: "sage",
    specs: []
  },
  {
    name: "Sage The Dual Boiler", slug: "sage-the-dual-boiler",
    description: "Sage The Dual Boiler – hochwertiges Haushaltsgerät.", shortDesc: "Sage The Dual Boiler",
    price: 1760, sku: "SAGETHEDUALBOIL", inStock: true,
    rating: 4.3, reviewCount: 176, categorySlug: "haushaltsgeraete", brandSlug: "sage",
    specs: []
  },
  {
    name: "Gastroback Design Espresso 42603", slug: "gastroback-design-espresso-42603",
    description: "Gastroback Design Espresso 42603 – hochwertiges Haushaltsgerät.", shortDesc: "Gastroback Design Espresso 42603",
    price: 1760, sku: "GASTROBACKDE2", inStock: true,
    rating: 4.5, reviewCount: 132, categorySlug: "kueche", brandSlug: "gastroback",
    specs: []
  },
  {
    name: "Gastroback Advanced Espresso 42602", slug: "gastroback-advanced-espresso-42602",
    description: "Gastroback Advanced Espresso 42602 – hochwertiges Haushaltsgerät.", shortDesc: "Gastroback Advanced Espresso 42602",
    price: 330, sku: "GASTROBACKADVAN", inStock: true, isPromo: true,
    rating: 4.3, reviewCount: 96, categorySlug: "kueche", brandSlug: "gastroback",
    specs: []
  },
  {
    name: "Nespresso Lattissima Touch En560", slug: "nespresso-lattissima-touch-en560",
    description: "Nespresso Lattissima Touch En560 – hochwertiges Haushaltsgerät.", shortDesc: "Nespresso Lattissima Touch En560",
    price: 2440, sku: "NESPRESSOLATTIS", inStock: true, isFeatured: true, isNew: true,
    rating: 4.9, reviewCount: 117, categorySlug: "kaffee", brandSlug: "nespresso",
    specs: []
  },
  {
    name: "Nespresso Essenza Mini D50", slug: "nespresso-essenza-mini-d50",
    description: "Nespresso Essenza Mini D50 – hochwertiges Haushaltsgerät.", shortDesc: "Nespresso Essenza Mini D50",
    price: 1960, sku: "NESPRESSOESSENZ", inStock: true,
    rating: 4.4, reviewCount: 260, categorySlug: "kaffee", brandSlug: "nespresso",
    specs: []
  },
  {
    name: "Nespresso Vertuo Next", slug: "nespresso-vertuo-next",
    description: "Nespresso Vertuo Next – hochwertiges Haushaltsgerät.", shortDesc: "Nespresso Vertuo Next",
    price: 1440, sku: "NESPRESSOVER2", inStock: true, isFeatured: true,
    rating: 4.4, reviewCount: 86, categorySlug: "kaffee", brandSlug: "nespresso",
    specs: []
  },
  {
    name: "Nespresso Vertuo Pop", slug: "nespresso-vertuo-pop",
    description: "Nespresso Vertuo Pop – hochwertiges Haushaltsgerät.", shortDesc: "Nespresso Vertuo Pop",
    price: 690, sku: "NESPRESSOVERTUO", inStock: true, isPromo: true,
    rating: 4.9, reviewCount: 42, categorySlug: "kaffee", brandSlug: "nespresso",
    specs: []
  },
  {
    name: "Nespresso Citiz En895", slug: "nespresso-citiz-en895",
    description: "Nespresso Citiz En895 – hochwertiges Haushaltsgerät.", shortDesc: "Nespresso Citiz En895",
    price: 1410, sku: "NESPRESSOCITIZE", inStock: true, isPromo: true,
    rating: 4.7, reviewCount: 297, categorySlug: "kaffee", brandSlug: "nespresso",
    specs: []
  },
  {
    name: "Lavazza A Modo Mio Jl01", slug: "lavazza-a-modo-mio-jl01",
    description: "Lavazza A Modo Mio Jl01 – hochwertiges Haushaltsgerät.", shortDesc: "Lavazza A Modo Mio Jl01",
    price: 1430, sku: "LAVAZZAAMODOMIO", inStock: true, isPromo: true,
    rating: 4.4, reviewCount: 82, categorySlug: "kaffee", brandSlug: "lavazza",
    specs: []
  },
  {
    name: "Lavazza Idola Clt2020", slug: "lavazza-idola-clt2020",
    description: "Lavazza Idola Clt2020 – hochwertiges Haushaltsgerät.", shortDesc: "Lavazza Idola Clt2020",
    price: 470, sku: "LAVAZZAIDOLACLT", inStock: true, isNew: true,
    rating: 4.2, reviewCount: 267, categorySlug: "kaffee", brandSlug: "lavazza",
    specs: []
  },
  {
    name: "Dyson V12 Detect Slim", slug: "dyson-v12-detect-slim",
    description: "Dyson V12 Detect Slim – hochwertiges Haushaltsgerät.", shortDesc: "Dyson V12 Detect Slim",
    price: 490, sku: "DYSONV12DETECTS", inStock: true, isPromo: true,
    rating: 4.8, reviewCount: 292, categorySlug: "reinigung", brandSlug: "dyson",
    specs: []
  },
  {
    name: "Dyson V8 Absolute", slug: "dyson-v8-absolute",
    description: "Dyson V8 Absolute – hochwertiges Haushaltsgerät.", shortDesc: "Dyson V8 Absolute",
    price: 490, sku: "DYSONV8ABSOLUTE", inStock: true,
    rating: 4.4, reviewCount: 301, categorySlug: "reinigung", brandSlug: "dyson",
    specs: []
  },
  {
    name: "Roborock S8 Maxv Ultra", slug: "roborock-s8-maxv-ultra",
    description: "Roborock S8 Maxv Ultra – hochwertiges Haushaltsgerät.", shortDesc: "Roborock S8 Maxv Ultra",
    price: 550, sku: "ROBOROCKS8MAXVU", inStock: true,
    rating: 4.2, reviewCount: 156, categorySlug: "reinigung", brandSlug: "roborock",
    specs: []
  },
  {
    name: "Roborock Q8 Max Plus", slug: "roborock-q8-max-plus",
    description: "Roborock Q8 Max Plus – hochwertiges Haushaltsgerät.", shortDesc: "Roborock Q8 Max Plus",
    price: 630, sku: "ROBOROCKQ8MAXPL", inStock: true,
    rating: 4.7, reviewCount: 63, categorySlug: "reinigung", brandSlug: "roborock",
    specs: []
  },
  {
    name: "iRobot Roomba J9 Plus", slug: "irobot-roomba-j9-plus",
    description: "iRobot Roomba J9 Plus – hochwertiges Haushaltsgerät.", shortDesc: "iRobot Roomba J9 Plus",
    price: 290, sku: "IROBOTROOMBAJ9P", inStock: true, isNew: true,
    rating: 4.5, reviewCount: 38, categorySlug: "reinigung", brandSlug: "irobot",
    specs: []
  },
  {
    name: "iRobot Roomba Combo J5 Plus", slug: "irobot-roomba-combo-j5-plus",
    description: "iRobot Roomba Combo J5 Plus – hochwertiges Haushaltsgerät.", shortDesc: "iRobot Roomba Combo J5 Plus",
    price: 680, sku: "IROBOTROOMBACOM", inStock: true,
    rating: 4, reviewCount: 29, categorySlug: "reinigung", brandSlug: "irobot",
    specs: []
  },
  {
    name: "Xiaomi Robot Vacuum X10 Plus", slug: "xiaomi-robot-vacuum-x10-plus",
    description: "Xiaomi Robot Vacuum X10 Plus – hochwertiges Haushaltsgerät.", shortDesc: "Xiaomi Robot Vacuum X10 Plus",
    price: 2080, sku: "XIAOMIROBOTVACU", inStock: true, isFeatured: true,
    rating: 4.2, reviewCount: 117, categorySlug: "haushaltsgeraete", brandSlug: "xiaomi",
    specs: []
  },
  {
    name: "Xiaomi Roborock Pro", slug: "xiaomi-roborock-pro",
    description: "Xiaomi Roborock Pro – hochwertiges Haushaltsgerät.", shortDesc: "Xiaomi Roborock Pro",
    price: 390, sku: "XIAOMIROBOROCKP", inStock: true, isNew: true,
    rating: 4.8, reviewCount: 87, categorySlug: "reinigung", brandSlug: "xiaomi",
    specs: []
  },
  {
    name: "Samsung Jet Bot Ai Plus Vr50t9990", slug: "samsung-jet-bot-ai-plus-vr50t9990",
    description: "Samsung Jet Bot Ai Plus Vr50t9990 – hochwertiges Haushaltsgerät.", shortDesc: "Samsung Jet Bot Ai Plus Vr50t9990",
    price: 1710, sku: "SAMSUNGJETBOTAI", inStock: true,
    rating: 4.6, reviewCount: 151, categorySlug: "haushaltsgeraete", brandSlug: "samsung",
    specs: []
  },
  {
    name: "LG Cordzero A9 Kompressor", slug: "lg-cordzero-a9-kompressor",
    description: "LG Cordzero A9 Kompressor – hochwertiges Haushaltsgerät.", shortDesc: "LG Cordzero A9 Kompressor",
    price: 1350, sku: "LGCORDZEROA9KOM", inStock: true, isFeatured: true, isPromo: true,
    rating: 4.3, reviewCount: 70, categorySlug: "haushaltsgeraete", brandSlug: "lg",
    specs: []
  },
  {
    name: "LG Cordzero Thinq R9", slug: "lg-cordzero-thinq-r9",
    description: "LG Cordzero Thinq R9 – hochwertiges Haushaltsgerät.", shortDesc: "LG Cordzero Thinq R9",
    price: 900, sku: "LGCORDZEROTHINQ", inStock: true, isPromo: true,
    rating: 4.1, reviewCount: 303, categorySlug: "haushaltsgeraete", brandSlug: "lg",
    specs: []
  },
  {
    name: "Kärcher Vc5 Cordless", slug: "kaercher-vc5-cordless",
    description: "Kärcher Vc5 Cordless – hochwertiges Haushaltsgerät.", shortDesc: "Kärcher Vc5 Cordless",
    price: 720, sku: "KAERCHERVC5CORD", inStock: true,
    rating: 4.8, reviewCount: 153, categorySlug: "reinigung", brandSlug: "kaercher",
    specs: []
  },
  {
    name: "Kärcher Vc3 Cordless", slug: "kaercher-vc3-cordless",
    description: "Kärcher Vc3 Cordless – hochwertiges Haushaltsgerät.", shortDesc: "Kärcher Vc3 Cordless",
    price: 280, sku: "KAERCHERVC3CORD", inStock: true, isPromo: true,
    rating: 4.3, reviewCount: 268, categorySlug: "reinigung", brandSlug: "kaercher",
    specs: []
  },
  {
    name: "Miele Triflex Hx2 Pro", slug: "miele-triflex-hx2-pro",
    description: "Miele Triflex Hx2 Pro – hochwertiges Haushaltsgerät.", shortDesc: "Miele Triflex Hx2 Pro",
    price: 330, sku: "MIELETRIFLEXHX2", inStock: true, isPromo: true,
    rating: 4.5, reviewCount: 42, categorySlug: "haushaltsgeraete", brandSlug: "miele",
    specs: []
  },
  {
    name: "Miele Scout Rx3 Home Vision", slug: "miele-scout-rx3-home-vision",
    description: "Miele Scout Rx3 Home Vision – hochwertiges Haushaltsgerät.", shortDesc: "Miele Scout Rx3 Home Vision",
    price: 1130, sku: "MIELESCOUTRX3HO", inStock: true,
    rating: 4, reviewCount: 268, categorySlug: "haushaltsgeraete", brandSlug: "miele",
    specs: []
  },
  {
    name: "Philips 8000 Series Led", slug: "philips-8000-series-led",
    description: "Philips 8000 Series Led – hochwertiges Haushaltsgerät.", shortDesc: "Philips 8000 Series Led",
    price: 1480, sku: "PHILIPS8000SERI", inStock: true, isFeatured: true,
    rating: 4.4, reviewCount: 198, categorySlug: "haushaltsgeraete", brandSlug: "philips",
    specs: []
  },
  {
    name: "Philips Powerproactive", slug: "philips-powerproactive",
    description: "Philips Powerproactive – hochwertiges Haushaltsgerät.", shortDesc: "Philips Powerproactive",
    price: 600, sku: "PHILIPSPOWERPRO", inStock: true,
    rating: 4, reviewCount: 138, categorySlug: "haushaltsgeraete", brandSlug: "philips",
    specs: []
  },
  {
    name: "Electrolux 800 Animalcare", slug: "electrolux-800-animalcare",
    description: "Electrolux 800 Animalcare – hochwertiges Haushaltsgerät.", shortDesc: "Electrolux 800 Animalcare",
    price: 2990, sku: "ELECTROLUX800AN", inStock: true,
    rating: 4.5, reviewCount: 80, categorySlug: "haushaltsgeraete", brandSlug: "electrolux",
    specs: []
  },
  {
    name: "AEG Well Q7 Animal", slug: "aeg-well-q7-animal",
    description: "AEG Well Q7 Animal – hochwertiges Haushaltsgerät.", shortDesc: "AEG Well Q7 Animal",
    price: 2030, sku: "AEGWELLQ7ANIMAL", inStock: true,
    rating: 4.6, reviewCount: 129, categorySlug: "haushaltsgeraete", brandSlug: "aeg",
    specs: []
  },
  {
    name: "Bosch Unlimited Serie8 Bss81pob", slug: "bosch-unlimited-serie8-bss81pob",
    description: "Bosch Unlimited Serie8 Bss81pob – hochwertiges Haushaltsgerät.", shortDesc: "Bosch Unlimited Serie8 Bss81pob",
    price: 1580, sku: "BOSCHUNLIMITEDS", inStock: true,
    rating: 4.4, reviewCount: 63, categorySlug: "haushaltsgeraete", brandSlug: "bosch",
    specs: []
  },
  {
    name: "Bosch Serie6 Bbh3d122", slug: "bosch-serie6-bbh3d122",
    description: "Bosch Serie6 Bbh3d122 – hochwertiges Haushaltsgerät.", shortDesc: "Bosch Serie6 Bbh3d122",
    price: 590, sku: "BOSCHSERIE6BBH3", inStock: true, isPromo: true,
    rating: 4.5, reviewCount: 303, categorySlug: "haushaltsgeraete", brandSlug: "bosch",
    specs: []
  },
  {
    name: "Siemens Rs5 Pro", slug: "siemens-rs5-pro",
    description: "Siemens Rs5 Pro – hochwertiges Haushaltsgerät.", shortDesc: "Siemens Rs5 Pro",
    price: 2960, sku: "SIEMENSRS5PRO", inStock: true,
    rating: 4.6, reviewCount: 46, categorySlug: "haushaltsgeraete", brandSlug: "siemens",
    specs: []
  },
  {
    name: "Samsung Bespoke Jet Complete", slug: "samsung-bespoke-jet-complete",
    description: "Samsung Bespoke Jet Complete – hochwertiges Haushaltsgerät.", shortDesc: "Samsung Bespoke Jet Complete",
    price: 2790, sku: "SAMSUNGBESPOKEJ", inStock: true,
    rating: 4.1, reviewCount: 230, categorySlug: "haushaltsgeraete", brandSlug: "samsung",
    specs: []
  },
  {
    name: "Vorwerk Kobold Vk200 Plus", slug: "vorwerk-kobold-vk200-plus",
    description: "Vorwerk Kobold Vk200 Plus – hochwertiges Haushaltsgerät.", shortDesc: "Vorwerk Kobold Vk200 Plus",
    price: 1180, sku: "VORWERKKOBOLDVK", inStock: true, isPromo: true,
    rating: 4.4, reviewCount: 116, categorySlug: "haushaltsgeraete", brandSlug: "vorwerk",
    specs: []
  },
  {
    name: "Ninja Detect Duo Cordless", slug: "ninja-detect-duo-cordless",
    description: "Ninja Detect Duo Cordless – hochwertiges Haushaltsgerät.", shortDesc: "Ninja Detect Duo Cordless",
    price: 1750, sku: "NINJADETECTDUOC", inStock: true,
    rating: 4.7, reviewCount: 265, categorySlug: "haushaltsgeraete", brandSlug: "ninja",
    specs: []
  },
  {
    name: "Ninja Foodi Dual Zone Af300eu", slug: "ninja-foodi-dual-zone-af300eu",
    description: "Ninja Foodi Dual Zone Af300eu – hochwertiges Haushaltsgerät.", shortDesc: "Ninja Foodi Dual Zone Af300eu",
    price: 540, sku: "NINJAFOODIDUALZ", inStock: true,
    rating: 4.8, reviewCount: 115, categorySlug: "kueche", brandSlug: "ninja",
    specs: []
  },
  {
    name: "Ninja Foodi Max Af400eu", slug: "ninja-foodi-max-af400eu",
    description: "Ninja Foodi Max Af400eu – hochwertiges Haushaltsgerät.", shortDesc: "Ninja Foodi Max Af400eu",
    price: 1040, sku: "NINJAFOODIMAXAF", inStock: true,
    rating: 4.7, reviewCount: 118, categorySlug: "kueche", brandSlug: "ninja",
    specs: []
  },
  {
    name: "Ninja Speedi Sp101eu", slug: "ninja-speedi-sp101eu",
    description: "Ninja Speedi Sp101eu – hochwertiges Haushaltsgerät.", shortDesc: "Ninja Speedi Sp101eu",
    price: 1500, sku: "NINJASPEEDISP10", inStock: true, isFeatured: true, isPromo: true,
    rating: 4.4, reviewCount: 260, categorySlug: "haushaltsgeraete", brandSlug: "ninja",
    specs: []
  },
  {
    name: "Cosori Pro2 Airfryer L501", slug: "cosori-pro2-airfryer-l501",
    description: "Cosori Pro2 Airfryer L501 – hochwertiges Haushaltsgerät.", shortDesc: "Cosori Pro2 Airfryer L501",
    price: 2120, sku: "COSORIPRO2AIRFR", inStock: true, isNew: true,
    rating: 4.6, reviewCount: 12, categorySlug: "kueche", brandSlug: "cosori",
    specs: []
  },
  {
    name: "Cosori Lite Airfryer 28l", slug: "cosori-lite-airfryer-28l",
    description: "Cosori Lite Airfryer 28l – hochwertiges Haushaltsgerät.", shortDesc: "Cosori Lite Airfryer 28l",
    price: 280, sku: "COSORILITEAIRFR", inStock: true, isNew: true, isPromo: true,
    rating: 4.7, reviewCount: 123, categorySlug: "kueche", brandSlug: "cosori",
    specs: []
  },
  {
    name: "Tefal Easy Fry Max Ey4018", slug: "tefal-easy-fry-max-ey4018",
    description: "Tefal Easy Fry Max Ey4018 – hochwertiges Haushaltsgerät.", shortDesc: "Tefal Easy Fry Max Ey4018",
    price: 2750, sku: "TEFALEASYFRYMAX", inStock: true,
    rating: 4.8, reviewCount: 282, categorySlug: "haushaltsgeraete", brandSlug: "tefal",
    specs: []
  },
  {
    name: "Tefal Optigrill Plus Gc7148", slug: "tefal-optigrill-plus-gc7148",
    description: "Tefal Optigrill Plus Gc7148 – hochwertiges Haushaltsgerät.", shortDesc: "Tefal Optigrill Plus Gc7148",
    price: 310, sku: "TEFALOPTIGRILLP", inStock: true,
    rating: 4.3, reviewCount: 199, categorySlug: "kueche", brandSlug: "tefal",
    specs: []
  },
  {
    name: "Tefal Easy Grill Precision Dg2558", slug: "tefal-easy-grill-precision-dg2558",
    description: "Tefal Easy Grill Precision Dg2558 – hochwertiges Haushaltsgerät.", shortDesc: "Tefal Easy Grill Precision Dg2558",
    price: 1760, sku: "TEFALEASYGRILLP", inStock: true,
    rating: 4.1, reviewCount: 123, categorySlug: "kueche", brandSlug: "tefal",
    specs: []
  },
  {
    name: "WMF Kitchenminis Contact Grill", slug: "wmf-kitchenminis-contact-grill",
    description: "WMF Kitchenminis Contact Grill – hochwertiges Haushaltsgerät.", shortDesc: "WMF Kitchenminis Contact Grill",
    price: 680, sku: "WMFKITCHENMINIS", inStock: true,
    rating: 4.1, reviewCount: 283, categorySlug: "kueche", brandSlug: "wmf",
    specs: []
  },
  {
    name: "Bosch Serie6 Induktionskochfeld Pci611bb5e", slug: "bosch-serie6-induktionskochfeld-pci611bb5e",
    description: "Bosch Serie6 Induktionskochfeld Pci611bb5e – hochwertiges Haushaltsgerät.", shortDesc: "Bosch Serie6 Induktionskochfeld Pci611bb5e",
    price: 660, sku: "BOSCHSERIE6INDU", inStock: true, isFeatured: true,
    rating: 4.5, reviewCount: 146, categorySlug: "kueche", brandSlug: "bosch",
    specs: []
  },
  {
    name: "Siemens Iq700 Induktionskochfeld Ex877ly44e", slug: "siemens-iq700-induktionskochfeld-ex877ly44e",
    description: "Siemens Iq700 Induktionskochfeld Ex877ly44e – hochwertiges Haushaltsgerät.", shortDesc: "Siemens Iq700 Induktionskochfeld Ex877ly44e",
    price: 2070, sku: "SIEMENSIQ700IND", inStock: true, isPromo: true,
    rating: 4.4, reviewCount: 61, categorySlug: "kueche", brandSlug: "siemens",
    specs: []
  },
  {
    name: "Gaggenau Vario400 Kochfeld Vig414", slug: "gaggenau-vario400-kochfeld-vig414",
    description: "Gaggenau Vario400 Kochfeld Vig414 – hochwertiges Haushaltsgerät.", shortDesc: "Gaggenau Vario400 Kochfeld Vig414",
    price: 880, sku: "GAGGENAUVARIO40", inStock: true, isFeatured: true,
    rating: 4.1, reviewCount: 139, categorySlug: "kueche", brandSlug: "gaggenau",
    specs: []
  },
  {
    name: "Neff B3acs7ah0 Backofen", slug: "neff-b3acs7ah0-backofen",
    description: "Neff B3acs7ah0 Backofen – hochwertiges Haushaltsgerät.", shortDesc: "Neff B3acs7ah0 Backofen",
    price: 440, sku: "NEFFB3ACS7AH0BA", inStock: true, isNew: true,
    rating: 4.3, reviewCount: 16, categorySlug: "kueche", brandSlug: "neff",
    specs: []
  },
  {
    name: "Bosch Serie8 Backofen Hbg8780b1", slug: "bosch-serie8-backofen-hbg8780b1",
    description: "Bosch Serie8 Backofen Hbg8780b1 – hochwertiges Haushaltsgerät.", shortDesc: "Bosch Serie8 Backofen Hbg8780b1",
    price: 1510, sku: "BOSCHSERIE8BACK", inStock: true,
    rating: 4.2, reviewCount: 175, categorySlug: "kueche", brandSlug: "bosch",
    specs: []
  },
  {
    name: "Miele H7464bp Backofen", slug: "miele-h7464bp-backofen",
    description: "Miele H7464bp Backofen – hochwertiges Haushaltsgerät.", shortDesc: "Miele H7464bp Backofen",
    price: 1880, sku: "MIELEH7464BPBAC", inStock: true,
    rating: 4.1, reviewCount: 34, categorySlug: "kueche", brandSlug: "miele",
    specs: []
  },
  {
    name: "AEG Bpe842720m Backofen", slug: "aeg-bpe842720m-backofen",
    description: "AEG Bpe842720m Backofen – hochwertiges Haushaltsgerät.", shortDesc: "AEG Bpe842720m Backofen",
    price: 510, sku: "AEGBPE842720MBA", inStock: true,
    rating: 4.6, reviewCount: 103, categorySlug: "kueche", brandSlug: "aeg",
    specs: []
  },
  {
    name: "Electrolux Oeo7gknw Backofen", slug: "electrolux-oeo7gknw-backofen",
    description: "Electrolux Oeo7gknw Backofen – hochwertiges Haushaltsgerät.", shortDesc: "Electrolux Oeo7gknw Backofen",
    price: 2240, sku: "ELECTROLUXOEO7G", inStock: true,
    rating: 4.2, reviewCount: 212, categorySlug: "kueche", brandSlug: "electrolux",
    specs: []
  },
  {
    name: "Samsung Bespoke Slide In Range Nx60bb871112", slug: "samsung-bespoke-slide-in-range-nx60bb871112",
    description: "Samsung Bespoke Slide In Range Nx60bb871112 – hochwertiges Haushaltsgerät.", shortDesc: "Samsung Bespoke Slide In Range Nx60bb871112",
    price: 2740, sku: "SAMSUNGBESPOKES", inStock: true, isPromo: true,
    rating: 4.2, reviewCount: 269, categorySlug: "haushaltsgeraete", brandSlug: "samsung",
    specs: []
  },
  {
    name: "LG Instaview Range Lsel6337f", slug: "lg-instaview-range-lsel6337f",
    description: "LG Instaview Range Lsel6337f – hochwertiges Haushaltsgerät.", shortDesc: "LG Instaview Range Lsel6337f",
    price: 1240, sku: "LGINSTAVIEWRANG", inStock: true, isFeatured: true,
    rating: 4.4, reviewCount: 186, categorySlug: "haushaltsgeraete", brandSlug: "lg",
    specs: []
  },
  {
    name: "Gastroback Design Pro 42621", slug: "gastroback-design-pro-42621",
    description: "Gastroback Design Pro 42621 – hochwertiges Haushaltsgerät.", shortDesc: "Gastroback Design Pro 42621",
    price: 640, sku: "GASTROBACKDESIG", inStock: true, isNew: true, isPromo: true,
    rating: 4.3, reviewCount: 220, categorySlug: "kueche", brandSlug: "gastroback",
    specs: []
  },
  {
    name: "Russell Hobbs Hobbs Retro Air Fryer 24530", slug: "russell-hobbs-retro-air-fryer-24530",
    description: "Russell Hobbs Hobbs Retro Air Fryer 24530 – hochwertiges Haushaltsgerät.", shortDesc: "Russell Hobbs Hobbs Retro Air Fryer 24530",
    price: 1530, sku: "RUSSELLHOBBSRET", inStock: true, isFeatured: true, isNew: true, isPromo: true,
    rating: 4.2, reviewCount: 12, categorySlug: "kueche", brandSlug: "russell",
    specs: []
  },
  {
    name: "De'Longhi Multifry Fh1394", slug: "delonghi-multifry-fh1394",
    description: "De'Longhi Multifry Fh1394 – hochwertiges Haushaltsgerät.", shortDesc: "De'Longhi Multifry Fh1394",
    price: 1760, sku: "DELONGHIMULTIFR", inStock: true, isNew: true,
    rating: 4.6, reviewCount: 284, categorySlug: "kaffee", brandSlug: "delonghi",
    specs: []
  },
  {
    name: "Moulinex Easy Fry Max Fx9029", slug: "moulinex-easy-fry-max-fx9029",
    description: "Moulinex Easy Fry Max Fx9029 – hochwertiges Haushaltsgerät.", shortDesc: "Moulinex Easy Fry Max Fx9029",
    price: 1540, sku: "MOULINEXEASYFRY", inStock: true, isPromo: true,
    rating: 4.4, reviewCount: 215, categorySlug: "haushaltsgeraete", brandSlug: "moulinex",
    specs: []
  },
  {
    name: "Kenwood Multipro Express Fdm79190ba", slug: "kenwood-multipro-express-fdm79190ba",
    description: "Kenwood Multipro Express Fdm79190ba – hochwertiges Haushaltsgerät.", shortDesc: "Kenwood Multipro Express Fdm79190ba",
    price: 1510, sku: "KENWOODMULTIPRO", inStock: true,
    rating: 4.8, reviewCount: 184, categorySlug: "haushaltsgeraete", brandSlug: "kenwood",
    specs: []
  },
  {
    name: "Sage The Air Fryer Pro Bpa180", slug: "sage-the-air-fryer-pro-bpa180",
    description: "Sage The Air Fryer Pro Bpa180 – hochwertiges Haushaltsgerät.", shortDesc: "Sage The Air Fryer Pro Bpa180",
    price: 340, sku: "SAGETHEAIRFRYER", inStock: true,
    rating: 4.3, reviewCount: 228, categorySlug: "kueche", brandSlug: "sage",
    specs: []
  },
  {
    name: "Miele W1 Waschmaschine Wsd163", slug: "miele-w1-waschmaschine-wsd163",
    description: "Miele W1 Waschmaschine Wsd163 – hochwertiges Haushaltsgerät.", shortDesc: "Miele W1 Waschmaschine Wsd163",
    price: 1150, sku: "MIELEW1WASCH3", inStock: true, isPromo: true,
    rating: 4.4, reviewCount: 18, categorySlug: "haushaltsgeraete", brandSlug: "miele",
    specs: []
  },
  {
    name: "Miele W1 Waschmaschine Wsd263", slug: "miele-w1-waschmaschine-wsd263",
    description: "Miele W1 Waschmaschine Wsd263 – hochwertiges Haushaltsgerät.", shortDesc: "Miele W1 Waschmaschine Wsd263",
    price: 2890, sku: "MIELEW1WASCH2", inStock: true,
    rating: 4, reviewCount: 263, categorySlug: "haushaltsgeraete", brandSlug: "miele",
    specs: []
  },
  {
    name: "Miele T1 Trockner Tmh843", slug: "miele-t1-trockner-tmh843",
    description: "Miele T1 Trockner Tmh843 – hochwertiges Haushaltsgerät.", shortDesc: "Miele T1 Trockner Tmh843",
    price: 1440, sku: "MIELET1TROCK2", inStock: true, isNew: true,
    rating: 4.9, reviewCount: 268, categorySlug: "haushaltsgeraete", brandSlug: "miele",
    specs: []
  },
  {
    name: "Miele Waschtrockner Wt1", slug: "miele-waschtrockner-wt1",
    description: "Miele Waschtrockner Wt1 – hochwertiges Haushaltsgerät.", shortDesc: "Miele Waschtrockner Wt1",
    price: 1630, sku: "MIELEWASCHTROCK", inStock: true, isFeatured: true, isPromo: true,
    rating: 4.3, reviewCount: 291, categorySlug: "haushaltsgeraete", brandSlug: "miele",
    specs: []
  },
  {
    name: "Bosch Serie8 Waschmaschine Wau285680", slug: "bosch-serie8-waschmaschine-wau285680",
    description: "Bosch Serie8 Waschmaschine Wau285680 – hochwertiges Haushaltsgerät.", shortDesc: "Bosch Serie8 Waschmaschine Wau285680",
    price: 2860, sku: "BOSCHSERIE8WASC", inStock: true,
    rating: 4.9, reviewCount: 261, categorySlug: "haushaltsgeraete", brandSlug: "bosch",
    specs: []
  },
  {
    name: "Bosch Serie6 Trockner Wtu876680", slug: "bosch-serie6-trockner-wtu876680",
    description: "Bosch Serie6 Trockner Wtu876680 – hochwertiges Haushaltsgerät.", shortDesc: "Bosch Serie6 Trockner Wtu876680",
    price: 370, sku: "BOSCHSERIE6TROC", inStock: true, isNew: true,
    rating: 4.1, reviewCount: 59, categorySlug: "haushaltsgeraete", brandSlug: "bosch",
    specs: []
  },
  {
    name: "Siemens Iq700 Waschmaschine Wg44g2z0", slug: "siemens-iq700-waschmaschine-wg44g2z0",
    description: "Siemens Iq700 Waschmaschine Wg44g2z0 – hochwertiges Haushaltsgerät.", shortDesc: "Siemens Iq700 Waschmaschine Wg44g2z0",
    price: 2100, sku: "SIEMENSIQ700WAS", inStock: true, isFeatured: true, isPromo: true,
    rating: 4.1, reviewCount: 149, categorySlug: "haushaltsgeraete", brandSlug: "siemens",
    specs: []
  },
  {
    name: "Siemens Iq700 Trockner Wt47w5600", slug: "siemens-iq700-trockner-wt47w5600",
    description: "Siemens Iq700 Trockner Wt47w5600 – hochwertiges Haushaltsgerät.", shortDesc: "Siemens Iq700 Trockner Wt47w5600",
    price: 940, sku: "SIEMENSIQ700TRO", inStock: true, isFeatured: true, isPromo: true,
    rating: 4.2, reviewCount: 290, categorySlug: "haushaltsgeraete", brandSlug: "siemens",
    specs: []
  },
  {
    name: "Samsung Ecobubble Ww90t554daw", slug: "samsung-ecobubble-ww90t554daw",
    description: "Samsung Ecobubble Ww90t554daw – hochwertiges Haushaltsgerät.", shortDesc: "Samsung Ecobubble Ww90t554daw",
    price: 2840, sku: "SAMSUNGECOBUBBL", inStock: true, isPromo: true,
    rating: 4.4, reviewCount: 166, categorySlug: "haushaltsgeraete", brandSlug: "samsung",
    specs: []
  },
  {
    name: "Samsung Trockner Dv80ta020ae", slug: "samsung-trockner-dv80ta020ae",
    description: "Samsung Trockner Dv80ta020ae – hochwertiges Haushaltsgerät.", shortDesc: "Samsung Trockner Dv80ta020ae",
    price: 1330, sku: "SAMSUNGTROCKNER", inStock: true,
    rating: 4.8, reviewCount: 295, categorySlug: "haushaltsgeraete", brandSlug: "samsung",
    specs: []
  },
  {
    name: "LG Turbowash Wv9 1412w", slug: "lg-turbowash-wv9-1412w",
    description: "LG Turbowash Wv9 1412w – hochwertiges Haushaltsgerät.", shortDesc: "LG Turbowash Wv9 1412w",
    price: 1390, sku: "LGTURBOWASHWV91", inStock: true,
    rating: 4.6, reviewCount: 235, categorySlug: "haushaltsgeraete", brandSlug: "lg",
    specs: []
  },
  {
    name: "LG Washtower P9wba", slug: "lg-washtower-p9wba",
    description: "LG Washtower P9wba – hochwertiges Haushaltsgerät.", shortDesc: "LG Washtower P9wba",
    price: 2120, sku: "LGWASHTOWERP9WB", inStock: true, isNew: true, isPromo: true,
    rating: 4, reviewCount: 254, categorySlug: "haushaltsgeraete", brandSlug: "lg",
    specs: []
  },
  {
    name: "AEG Lr9a80600 Waschmaschine", slug: "aeg-lr9a80600-waschmaschine",
    description: "AEG Lr9a80600 Waschmaschine – hochwertiges Haushaltsgerät.", shortDesc: "AEG Lr9a80600 Waschmaschine",
    price: 2960, sku: "AEGLR9A80600WAS", inStock: true, isPromo: true,
    rating: 4.2, reviewCount: 208, categorySlug: "haushaltsgeraete", brandSlug: "aeg",
    specs: []
  },
  {
    name: "AEG Tr9a865r Trockner", slug: "aeg-tr9a865r-trockner",
    description: "AEG Tr9a865r Trockner – hochwertiges Haushaltsgerät.", shortDesc: "AEG Tr9a865r Trockner",
    price: 310, sku: "AEGTR9A865RTROC", inStock: true,
    rating: 4.1, reviewCount: 245, categorySlug: "haushaltsgeraete", brandSlug: "aeg",
    specs: []
  },
  {
    name: "Electrolux Ew7f348sg Waschmaschine", slug: "electrolux-ew7f348sg-waschmaschine",
    description: "Electrolux Ew7f348sg Waschmaschine – hochwertiges Haushaltsgerät.", shortDesc: "Electrolux Ew7f348sg Waschmaschine",
    price: 540, sku: "ELECTROLUXEW7F3", inStock: true, isFeatured: true,
    rating: 4.4, reviewCount: 50, categorySlug: "haushaltsgeraete", brandSlug: "electrolux",
    specs: []
  },
  {
    name: "Electrolux Ew7h348w Trockner", slug: "electrolux-ew7h348w-trockner",
    description: "Electrolux Ew7h348w Trockner – hochwertiges Haushaltsgerät.", shortDesc: "Electrolux Ew7h348w Trockner",
    price: 2660, sku: "ELECTROLUXEW7H3", inStock: true,
    rating: 4.8, reviewCount: 280, categorySlug: "haushaltsgeraete", brandSlug: "electrolux",
    specs: []
  },
  {
    name: "Haier Hw100 B1439lu1 Waschmaschine", slug: "haier-hw100-b1439lu1-waschmaschine",
    description: "Haier Hw100 B1439lu1 Waschmaschine – hochwertiges Haushaltsgerät.", shortDesc: "Haier Hw100 B1439lu1 Waschmaschine",
    price: 480, sku: "HAIERHW100B1439", inStock: true,
    rating: 4.8, reviewCount: 174, categorySlug: "haushaltsgeraete", brandSlug: "haier",
    specs: []
  },
  {
    name: "Haier Hd100 A2939 Trockner", slug: "haier-hd100-a2939-trockner",
    description: "Haier Hd100 A2939 Trockner – hochwertiges Haushaltsgerät.", shortDesc: "Haier Hd100 A2939 Trockner",
    price: 530, sku: "HAIERHD100A2939", inStock: true,
    rating: 4.1, reviewCount: 74, categorySlug: "haushaltsgeraete", brandSlug: "haier",
    specs: []
  },
  {
    name: "BEKO Wrs 55p12 Sw Waschmaschine", slug: "beko-wrs-55p12-sw-waschmaschine",
    description: "BEKO Wrs 55p12 Sw Waschmaschine – hochwertiges Haushaltsgerät.", shortDesc: "BEKO Wrs 55p12 Sw Waschmaschine",
    price: 1520, sku: "BEKOWRS55P12SWW", inStock: true,
    rating: 4.5, reviewCount: 51, categorySlug: "haushaltsgeraete", brandSlug: "beko",
    specs: []
  },
  {
    name: "BEKO Dp 8534 Gxa1 Trockner", slug: "beko-dp-8534-gxa1-trockner",
    description: "BEKO Dp 8534 Gxa1 Trockner – hochwertiges Haushaltsgerät.", shortDesc: "BEKO Dp 8534 Gxa1 Trockner",
    price: 1610, sku: "BEKODP8534GXA1T", inStock: true,
    rating: 4.1, reviewCount: 107, categorySlug: "haushaltsgeraete", brandSlug: "beko",
    specs: []
  },
  {
    name: "Bosch Serie2 Waschmaschine Wgg244z01", slug: "bosch-serie2-waschmaschine-wgg244z01",
    description: "Bosch Serie2 Waschmaschine Wgg244z01 – hochwertiges Haushaltsgerät.", shortDesc: "Bosch Serie2 Waschmaschine Wgg244z01",
    price: 1100, sku: "BOSCHSERIE2WASC", inStock: true, isNew: true,
    rating: 4.9, reviewCount: 54, categorySlug: "haushaltsgeraete", brandSlug: "bosch",
    specs: []
  },
  {
    name: "Siemens Iq300 Waschmaschine Wg44g200", slug: "siemens-iq300-waschmaschine-wg44g200",
    description: "Siemens Iq300 Waschmaschine Wg44g200 – hochwertiges Haushaltsgerät.", shortDesc: "Siemens Iq300 Waschmaschine Wg44g200",
    price: 780, sku: "SIEMENSIQ300WAS", inStock: true, isPromo: true,
    rating: 4.6, reviewCount: 291, categorySlug: "haushaltsgeraete", brandSlug: "siemens",
    specs: []
  },
  {
    name: "Miele W1 Waschmaschine Wsd363", slug: "miele-w1-waschmaschine-wsd363",
    description: "Miele W1 Waschmaschine Wsd363 – hochwertiges Haushaltsgerät.", shortDesc: "Miele W1 Waschmaschine Wsd363",
    price: 740, sku: "MIELEW1WASCHMAS", inStock: true,
    rating: 4.2, reviewCount: 27, categorySlug: "haushaltsgeraete", brandSlug: "miele",
    specs: []
  },
  {
    name: "Miele T1 Trockner Tmv843", slug: "miele-t1-trockner-tmv843",
    description: "Miele T1 Trockner Tmv843 – hochwertiges Haushaltsgerät.", shortDesc: "Miele T1 Trockner Tmv843",
    price: 1340, sku: "MIELET1TROCKNER", inStock: true,
    rating: 4.1, reviewCount: 20, categorySlug: "haushaltsgeraete", brandSlug: "miele",
    specs: []
  },
  {
    name: "Samsung Waschmaschine Ww90t684dln", slug: "samsung-waschmaschine-ww90t684dln",
    description: "Samsung Waschmaschine Ww90t684dln – hochwertiges Haushaltsgerät.", shortDesc: "Samsung Waschmaschine Ww90t684dln",
    price: 1540, sku: "SAMSUNGWASCHMAS", inStock: true, isPromo: true,
    rating: 4.6, reviewCount: 126, categorySlug: "haushaltsgeraete", brandSlug: "samsung",
    specs: []
  },
  {
    name: "LG Waschmaschine F4wr711s2ha", slug: "lg-waschmaschine-f4wr711s2ha",
    description: "LG Waschmaschine F4wr711s2ha – hochwertiges Haushaltsgerät.", shortDesc: "LG Waschmaschine F4wr711s2ha",
    price: 530, sku: "LGWASCHMASCHINE", inStock: true,
    rating: 4, reviewCount: 49, categorySlug: "haushaltsgeraete", brandSlug: "lg",
    specs: []
  },
  {
    name: "Bosch Serie6 Waschmaschine Wau28568", slug: "bosch-serie6-waschmaschine-wau28568",
    description: "Bosch Serie6 Waschmaschine Wau28568 – hochwertiges Haushaltsgerät.", shortDesc: "Bosch Serie6 Waschmaschine Wau28568",
    price: 2830, sku: "BOSCHSERIE6WASC", inStock: true, isPromo: true,
    rating: 4.7, reviewCount: 287, categorySlug: "haushaltsgeraete", brandSlug: "bosch",
    specs: []
  },
  {
    name: "Siemens Waschmaschine Wg44g202", slug: "siemens-waschmaschine-wg44g202",
    description: "Siemens Waschmaschine Wg44g202 – hochwertiges Haushaltsgerät.", shortDesc: "Siemens Waschmaschine Wg44g202",
    price: 2020, sku: "SIEMENSWASCHMAS", inStock: true, isFeatured: true,
    rating: 4.3, reviewCount: 110, categorySlug: "haushaltsgeraete", brandSlug: "siemens",
    specs: []
  },
  {
    name: "BEKO Trockner Dpy8534gxa1", slug: "beko-trockner-dpy8534gxa1",
    description: "BEKO Trockner Dpy8534gxa1 – hochwertiges Haushaltsgerät.", shortDesc: "BEKO Trockner Dpy8534gxa1",
    price: 2690, sku: "BEKOTROCKNERDPY", inStock: true, isPromo: true,
    rating: 4.9, reviewCount: 152, categorySlug: "haushaltsgeraete", brandSlug: "beko",
    specs: []
  },
  {
    name: "Liebherr Monokuhlschrank Kbes3660", slug: "liebherr-monokuhlschrank-kbes3660",
    description: "Liebherr Monokuhlschrank Kbes3660 – hochwertiges Haushaltsgerät.", shortDesc: "Liebherr Monokuhlschrank Kbes3660",
    price: 2860, sku: "LIEBHERRMONOKUH", inStock: true,
    rating: 4.3, reviewCount: 219, categorySlug: "haushaltsgeraete", brandSlug: "liebherr",
    specs: []
  },
  {
    name: "Liebherr Komfort Kcbnesf3666", slug: "liebherr-komfort-kcbnesf3666",
    description: "Liebherr Komfort Kcbnesf3666 – hochwertiges Haushaltsgerät.", shortDesc: "Liebherr Komfort Kcbnesf3666",
    price: 2370, sku: "LIEBHERRKOMFORT", inStock: true,
    rating: 4.6, reviewCount: 147, categorySlug: "haushaltsgeraete", brandSlug: "liebherr",
    specs: []
  },
  {
    name: "Samsung Family Hub Rb38b7929s9", slug: "samsung-family-hub-rb38b7929s9",
    description: "Samsung Family Hub Rb38b7929s9 – hochwertiges Haushaltsgerät.", shortDesc: "Samsung Family Hub Rb38b7929s9",
    price: 290, sku: "SAMSUNGFAMILYHU", inStock: true, isNew: true, isPromo: true,
    rating: 4.3, reviewCount: 104, categorySlug: "smart-home", brandSlug: "samsung",
    specs: []
  },
  {
    name: "Samsung Bespoke Lrfx28b3230s", slug: "samsung-bespoke-lrfx28b3230s",
    description: "Samsung Bespoke Lrfx28b3230s – hochwertiges Haushaltsgerät.", shortDesc: "Samsung Bespoke Lrfx28b3230s",
    price: 2900, sku: "SAMSUNGBESPOKEL", inStock: true, isPromo: true,
    rating: 4.8, reviewCount: 94, categorySlug: "haushaltsgeraete", brandSlug: "samsung",
    specs: []
  },
  {
    name: "Samsung Side By Side Rs758711dqp", slug: "samsung-side-by-side-rs758711dqp",
    description: "Samsung Side By Side Rs758711dqp – hochwertiges Haushaltsgerät.", shortDesc: "Samsung Side By Side Rs758711dqp",
    price: 370, sku: "SAMSUNGSIDEBYSI", inStock: true, isFeatured: true, isNew: true,
    rating: 4, reviewCount: 292, categorySlug: "haushaltsgeraete", brandSlug: "samsung",
    specs: []
  },
  {
    name: "Samsung Gefrierschrank Rz32r743601", slug: "samsung-gefrierschrank-rz32r743601",
    description: "Samsung Gefrierschrank Rz32r743601 – hochwertiges Haushaltsgerät.", shortDesc: "Samsung Gefrierschrank Rz32r743601",
    price: 2710, sku: "SAMSUNGGEFRIERS", inStock: true,
    rating: 4, reviewCount: 137, categorySlug: "haushaltsgeraete", brandSlug: "samsung",
    specs: []
  },
  {
    name: "Bosch Serie6 Kuhlschrank Kgn36aw3a", slug: "bosch-serie6-kuhlschrank-kgn36aw3a",
    description: "Bosch Serie6 Kuhlschrank Kgn36aw3a – hochwertiges Haushaltsgerät.", shortDesc: "Bosch Serie6 Kuhlschrank Kgn36aw3a",
    price: 2270, sku: "BOSCHSERIE6KUHL", inStock: true, isPromo: true,
    rating: 4.2, reviewCount: 306, categorySlug: "haushaltsgeraete", brandSlug: "bosch",
    specs: []
  },
  {
    name: "Bosch Serie4 Einbau Kuhlschrank Kiv83vse0", slug: "bosch-serie4-einbau-kuhlschrank-kiv83vse0",
    description: "Bosch Serie4 Einbau Kuhlschrank Kiv83vse0 – hochwertiges Haushaltsgerät.", shortDesc: "Bosch Serie4 Einbau Kuhlschrank Kiv83vse0",
    price: 2580, sku: "BOSCHSERIE4EINB", inStock: true,
    rating: 4.3, reviewCount: 194, categorySlug: "haushaltsgeraete", brandSlug: "bosch",
    specs: []
  },
  {
    name: "Siemens Iq700 Kuhlschrank Kg39nxb60", slug: "siemens-iq700-kuhlschrank-kg39nxb60",
    description: "Siemens Iq700 Kuhlschrank Kg39nxb60 – hochwertiges Haushaltsgerät.", shortDesc: "Siemens Iq700 Kuhlschrank Kg39nxb60",
    price: 1300, sku: "SIEMENSIQ700KUH", inStock: true,
    rating: 4.7, reviewCount: 214, categorySlug: "haushaltsgeraete", brandSlug: "siemens",
    specs: []
  },
  {
    name: "Siemens Iq500 Einbau Kuhlschrank Kg39eadla0", slug: "siemens-iq500-einbau-kuhlschrank-kg39eadla0",
    description: "Siemens Iq500 Einbau Kuhlschrank Kg39eadla0 – hochwertiges Haushaltsgerät.", shortDesc: "Siemens Iq500 Einbau Kuhlschrank Kg39eadla0",
    price: 2990, sku: "SIEMENSIQ5002", inStock: true, isPromo: true,
    rating: 4.2, reviewCount: 120, categorySlug: "haushaltsgeraete", brandSlug: "siemens",
    specs: []
  },
  {
    name: "Miele Kuhlschrank K2801sfvi", slug: "miele-kuhlschrank-k2801sfvi",
    description: "Miele Kuhlschrank K2801sfvi – hochwertiges Haushaltsgerät.", shortDesc: "Miele Kuhlschrank K2801sfvi",
    price: 1110, sku: "MIELEKUHLSCHRAN", inStock: true, isPromo: true,
    rating: 4.7, reviewCount: 218, categorySlug: "haushaltsgeraete", brandSlug: "miele",
    specs: []
  },
  {
    name: "Miele Mastercool Mcs1301w", slug: "miele-mastercool-mcs1301w",
    description: "Miele Mastercool Mcs1301w – hochwertiges Haushaltsgerät.", shortDesc: "Miele Mastercool Mcs1301w",
    price: 2140, sku: "MIELEMASTERCOOL", inStock: true, isNew: true,
    rating: 4.2, reviewCount: 164, categorySlug: "haushaltsgeraete", brandSlug: "miele",
    specs: []
  },
  {
    name: "AEG Rcb53426tx Kuhlschrank", slug: "aeg-rcb53426tx-kuhlschrank",
    description: "AEG Rcb53426tx Kuhlschrank – hochwertiges Haushaltsgerät.", shortDesc: "AEG Rcb53426tx Kuhlschrank",
    price: 680, sku: "AEGRCB53426TXKU", inStock: true,
    rating: 4.3, reviewCount: 201, categorySlug: "haushaltsgeraete", brandSlug: "aeg",
    specs: []
  },
  {
    name: "Electrolux Lrb3643sw Kuhlschrank", slug: "electrolux-lrb3643sw-kuhlschrank",
    description: "Electrolux Lrb3643sw Kuhlschrank – hochwertiges Haushaltsgerät.", shortDesc: "Electrolux Lrb3643sw Kuhlschrank",
    price: 570, sku: "ELECTROLUXLRB36", inStock: true, isFeatured: true, isPromo: true,
    rating: 4.7, reviewCount: 266, categorySlug: "haushaltsgeraete", brandSlug: "electrolux",
    specs: []
  },
  {
    name: "Haier Monokuhlschrank Hb14g1aaag", slug: "haier-monokuhlschrank-hb14g1aaag",
    description: "Haier Monokuhlschrank Hb14g1aaag – hochwertiges Haushaltsgerät.", shortDesc: "Haier Monokuhlschrank Hb14g1aaag",
    price: 530, sku: "HAIERMONOKUHLSC", inStock: true,
    rating: 4.3, reviewCount: 170, categorySlug: "haushaltsgeraete", brandSlug: "haier",
    specs: []
  },
  {
    name: "Haier Side By Side Rs670n4aw1", slug: "haier-side-by-side-rs670n4aw1",
    description: "Haier Side By Side Rs670n4aw1 – hochwertiges Haushaltsgerät.", shortDesc: "Haier Side By Side Rs670n4aw1",
    price: 2980, sku: "HAIERSIDEBYSIDE", inStock: true,
    rating: 4.3, reviewCount: 28, categorySlug: "haushaltsgeraete", brandSlug: "haier",
    specs: []
  },
  {
    name: "BEKO Gne 134620 X Kuhlschrank", slug: "beko-gne-134620-x-kuhlschrank",
    description: "BEKO Gne 134620 X Kuhlschrank – hochwertiges Haushaltsgerät.", shortDesc: "BEKO Gne 134620 X Kuhlschrank",
    price: 430, sku: "BEKOGNE134620XK", inStock: true,
    rating: 4.8, reviewCount: 147, categorySlug: "haushaltsgeraete", brandSlug: "beko",
    specs: []
  },
  {
    name: "BEKO Rbst140k25w Kuhlschrank", slug: "beko-rbst140k25w-kuhlschrank",
    description: "BEKO Rbst140k25w Kuhlschrank – hochwertiges Haushaltsgerät.", shortDesc: "BEKO Rbst140k25w Kuhlschrank",
    price: 2260, sku: "BEKORBST140K25W", inStock: true, isFeatured: true, isPromo: true,
    rating: 4.7, reviewCount: 58, categorySlug: "haushaltsgeraete", brandSlug: "beko",
    specs: []
  },
  {
    name: "V-ZUG Rq4601 Kuhlschrank", slug: "vzug-rq4601-kuhlschrank",
    description: "V-ZUG Rq4601 Kuhlschrank – hochwertiges Haushaltsgerät.", shortDesc: "V-ZUG Rq4601 Kuhlschrank",
    price: 780, sku: "VZUGRQ4601KUHLS", inStock: true, isFeatured: true,
    rating: 4.1, reviewCount: 31, categorySlug: "haushaltsgeraete", brandSlug: "vzug",
    specs: []
  },
  {
    name: "Liebherr Mono Kef3566 Gefrierschrank", slug: "liebherr-mono-kef3566-gefrierschrank",
    description: "Liebherr Mono Kef3566 Gefrierschrank – hochwertiges Haushaltsgerät.", shortDesc: "Liebherr Mono Kef3566 Gefrierschrank",
    price: 600, sku: "LIEBHERRMONOKEF", inStock: true, isNew: true,
    rating: 4.4, reviewCount: 207, categorySlug: "haushaltsgeraete", brandSlug: "liebherr",
    specs: []
  },
  {
    name: "Samsung Bespoke French Door Rf29a9675sr", slug: "samsung-bespoke-french-door-rf29a9675sr",
    description: "Samsung Bespoke French Door Rf29a9675sr – hochwertiges Haushaltsgerät.", shortDesc: "Samsung Bespoke French Door Rf29a9675sr",
    price: 1950, sku: "SAMSUNGBESPOKEF", inStock: true, isFeatured: true, isPromo: true,
    rating: 4.9, reviewCount: 237, categorySlug: "haushaltsgeraete", brandSlug: "samsung",
    specs: []
  },
  {
    name: "Samsung Tiefkuhlschrank Rt5000", slug: "samsung-tiefkuhlschrank-rt5000",
    description: "Samsung Tiefkuhlschrank Rt5000 – hochwertiges Haushaltsgerät.", shortDesc: "Samsung Tiefkuhlschrank Rt5000",
    price: 1420, sku: "SAMSUNGTIEFKUHL", inStock: true,
    rating: 4.6, reviewCount: 162, categorySlug: "haushaltsgeraete", brandSlug: "samsung",
    specs: []
  },
  {
    name: "Bosch Serie4 Gefrierschrank Gin31afe0p", slug: "bosch-serie4-gefrierschrank-gin31afe0p",
    description: "Bosch Serie4 Gefrierschrank Gin31afe0p – hochwertiges Haushaltsgerät.", shortDesc: "Bosch Serie4 Gefrierschrank Gin31afe0p",
    price: 1300, sku: "BOSCHSERIE4GEFR", inStock: true, isFeatured: true,
    rating: 4.4, reviewCount: 57, categorySlug: "haushaltsgeraete", brandSlug: "bosch",
    specs: []
  },
  {
    name: "Siemens Iq500 Einbau Tiefkuhlschrank Gi51nae20", slug: "siemens-iq500-einbau-tiefkuhlschrank-gi51nae20",
    description: "Siemens Iq500 Einbau Tiefkuhlschrank Gi51nae20 – hochwertiges Haushaltsgerät.", shortDesc: "Siemens Iq500 Einbau Tiefkuhlschrank Gi51nae20",
    price: 2840, sku: "SIEMENSIQ500EIN", inStock: true, isPromo: true,
    rating: 4.2, reviewCount: 251, categorySlug: "haushaltsgeraete", brandSlug: "siemens",
    specs: []
  },
  {
    name: "AEG Rbs 36426tx Kuhlschrank", slug: "aeg-rbs-36426tx-kuhlschrank",
    description: "AEG Rbs 36426tx Kuhlschrank – hochwertiges Haushaltsgerät.", shortDesc: "AEG Rbs 36426tx Kuhlschrank",
    price: 1850, sku: "AEGRBS36426TXKU", inStock: true,
    rating: 4.9, reviewCount: 81, categorySlug: "haushaltsgeraete", brandSlug: "aeg",
    specs: []
  },
  {
    name: "Miele G7310 Scu", slug: "miele-g7310-scu",
    description: "Miele G7310 Scu – hochwertiges Haushaltsgerät.", shortDesc: "Miele G7310 Scu",
    price: 1520, sku: "MIELEG7310SCU", inStock: true,
    rating: 4.6, reviewCount: 69, categorySlug: "haushaltsgeraete", brandSlug: "miele",
    specs: []
  },
  {
    name: "Miele G7360 Scvi Autodos", slug: "miele-g7360-scvi-autodos",
    description: "Miele G7360 Scvi Autodos – hochwertiges Haushaltsgerät.", shortDesc: "Miele G7360 Scvi Autodos",
    price: 1680, sku: "MIELEG7360SCVIA", inStock: true,
    rating: 4.8, reviewCount: 52, categorySlug: "haushaltsgeraete", brandSlug: "miele",
    specs: []
  },
  {
    name: "Miele G5000 Sci", slug: "miele-g5000-sci",
    description: "Miele G5000 Sci – hochwertiges Haushaltsgerät.", shortDesc: "Miele G5000 Sci",
    price: 1880, sku: "MIELEG5000SCI", inStock: true, isFeatured: true,
    rating: 4.1, reviewCount: 234, categorySlug: "haushaltsgeraete", brandSlug: "miele",
    specs: []
  },
  {
    name: "Miele Ta 2650 Wp", slug: "miele-ta-2650-wp",
    description: "Miele Ta 2650 Wp – hochwertiges Haushaltsgerät.", shortDesc: "Miele Ta 2650 Wp",
    price: 1300, sku: "MIELETA2650WP", inStock: true, isPromo: true,
    rating: 4.4, reviewCount: 90, categorySlug: "haushaltsgeraete", brandSlug: "miele",
    specs: []
  },
  {
    name: "Bosch Serie4 Smv46mx01e", slug: "bosch-serie4-smv46mx01e",
    description: "Bosch Serie4 Smv46mx01e – hochwertiges Haushaltsgerät.", shortDesc: "Bosch Serie4 Smv46mx01e",
    price: 800, sku: "BOSCHSERIE4SMV4", inStock: true, isPromo: true,
    rating: 4.5, reviewCount: 222, categorySlug: "haushaltsgeraete", brandSlug: "bosch",
    specs: []
  },
  {
    name: "Bosch Kompakt Sms46mw00e", slug: "bosch-kompakt-sms46mw00e",
    description: "Bosch Kompakt Sms46mw00e – hochwertiges Haushaltsgerät.", shortDesc: "Bosch Kompakt Sms46mw00e",
    price: 1480, sku: "BOSCHKOMPAKTSMS", inStock: true,
    rating: 4.9, reviewCount: 43, categorySlug: "haushaltsgeraete", brandSlug: "bosch",
    specs: []
  },
  {
    name: "Siemens Iq700 Sn878x04ce Neu", slug: "siemens-iq700-sn878x04ce-neu",
    description: "Siemens Iq700 Sn878x04ce Neu – hochwertiges Haushaltsgerät.", shortDesc: "Siemens Iq700 Sn878x04ce Neu",
    price: 1030, sku: "SIEMENSIQ700SN8", inStock: true,
    rating: 4.6, reviewCount: 213, categorySlug: "haushaltsgeraete", brandSlug: "siemens",
    specs: []
  },
  {
    name: "Siemens Iq500 Sn436w00ce", slug: "siemens-iq500-sn436w00ce",
    description: "Siemens Iq500 Sn436w00ce – hochwertiges Haushaltsgerät.", shortDesc: "Siemens Iq500 Sn436w00ce",
    price: 1090, sku: "SIEMENSIQ500SN4", inStock: true,
    rating: 4.5, reviewCount: 297, categorySlug: "haushaltsgeraete", brandSlug: "siemens",
    specs: []
  },
  {
    name: "Siemens Kompakt Sk25ew800", slug: "siemens-kompakt-sk25ew800",
    description: "Siemens Kompakt Sk25ew800 – hochwertiges Haushaltsgerät.", shortDesc: "Siemens Kompakt Sk25ew800",
    price: 2120, sku: "SIEMENSKOMPAKTS", inStock: true,
    rating: 4.9, reviewCount: 17, categorySlug: "haushaltsgeraete", brandSlug: "siemens",
    specs: []
  },
  {
    name: "AEG Ffb62607pm", slug: "aeg-ffb62607pm",
    description: "AEG Ffb62607pm – hochwertiges Haushaltsgerät.", shortDesc: "AEG Ffb62607pm",
    price: 2890, sku: "AEGFFB62607PM", inStock: true, isPromo: true,
    rating: 4.6, reviewCount: 147, categorySlug: "haushaltsgeraete", brandSlug: "aeg",
    specs: []
  },
  {
    name: "AEG Fsk62600p Kompakt", slug: "aeg-fsk62600p-kompakt",
    description: "AEG Fsk62600p Kompakt – hochwertiges Haushaltsgerät.", shortDesc: "AEG Fsk62600p Kompakt",
    price: 1110, sku: "AEGFSK62600PKOM", inStock: true,
    rating: 4.1, reviewCount: 200, categorySlug: "haushaltsgeraete", brandSlug: "aeg",
    specs: []
  },
  {
    name: "Electrolux Eeq53200l", slug: "electrolux-eeq53200l",
    description: "Electrolux Eeq53200l – hochwertiges Haushaltsgerät.", shortDesc: "Electrolux Eeq53200l",
    price: 1800, sku: "ELECTROLUXEEQ53", inStock: true, isNew: true, isPromo: true,
    rating: 4.5, reviewCount: 73, categorySlug: "haushaltsgeraete", brandSlug: "electrolux",
    specs: []
  },
  {
    name: "Electrolux Kompakt Esf6200lou", slug: "electrolux-kompakt-esf6200lou",
    description: "Electrolux Kompakt Esf6200lou – hochwertiges Haushaltsgerät.", shortDesc: "Electrolux Kompakt Esf6200lou",
    price: 2590, sku: "ELECTROLUXKOMPA", inStock: true,
    rating: 4.7, reviewCount: 143, categorySlug: "haushaltsgeraete", brandSlug: "electrolux",
    specs: []
  },
  {
    name: "Samsung Dw60m6050fw", slug: "samsung-dw60m6050fw",
    description: "Samsung Dw60m6050fw – hochwertiges Haushaltsgerät.", shortDesc: "Samsung Dw60m6050fw",
    price: 2130, sku: "SAMSUNGDW60M605", inStock: true, isFeatured: true, isNew: true,
    rating: 4.5, reviewCount: 161, categorySlug: "haushaltsgeraete", brandSlug: "samsung",
    specs: []
  },
  {
    name: "Siemens Iq300 Sk26e820eu", slug: "siemens-iq300-sk26e820eu",
    description: "Siemens Iq300 Sk26e820eu – hochwertiges Haushaltsgerät.", shortDesc: "Siemens Iq300 Sk26e820eu",
    price: 730, sku: "SIEMENSIQ300SK2", inStock: true, isNew: true, isPromo: true,
    rating: 4.5, reviewCount: 248, categorySlug: "haushaltsgeraete", brandSlug: "siemens",
    specs: []
  },
  {
    name: "BEKO Dfn05320w", slug: "beko-dfn05320w",
    description: "BEKO Dfn05320w – hochwertiges Haushaltsgerät.", shortDesc: "BEKO Dfn05320w",
    price: 640, sku: "BEKODFN05320W", inStock: true,
    rating: 4.2, reviewCount: 240, categorySlug: "haushaltsgeraete", brandSlug: "beko",
    specs: []
  },
  {
    name: "Haier Dw14 Bk3aeu", slug: "haier-dw14-bk3aeu",
    description: "Haier Dw14 Bk3aeu – hochwertiges Haushaltsgerät.", shortDesc: "Haier Dw14 Bk3aeu",
    price: 470, sku: "HAIERDW14BK3AEU", inStock: true,
    rating: 4.7, reviewCount: 52, categorySlug: "haushaltsgeraete", brandSlug: "haier",
    specs: []
  },
  {
    name: "LG Df455hms Kompakt", slug: "lg-df455hms-kompakt",
    description: "LG Df455hms Kompakt – hochwertiges Haushaltsgerät.", shortDesc: "LG Df455hms Kompakt",
    price: 1900, sku: "LGDF455HMSKOMPA", inStock: true,
    rating: 4.2, reviewCount: 275, categorySlug: "haushaltsgeraete", brandSlug: "lg",
    specs: []
  },
  {
    name: "LG Full Size Df455hms", slug: "lg-full-size-df455hms",
    description: "LG Full Size Df455hms – hochwertiges Haushaltsgerät.", shortDesc: "LG Full Size Df455hms",
    price: 480, sku: "LGFULLSIZEDF455", inStock: true, isFeatured: true, isPromo: true,
    rating: 4.1, reviewCount: 226, categorySlug: "haushaltsgeraete", brandSlug: "lg",
    specs: []
  },
  {
    name: "Dyson Purifier Hotcool Hp07", slug: "dyson-purifier-hotcool-hp07",
    description: "Dyson Purifier Hotcool Hp07 – hochwertiges Haushaltsgerät.", shortDesc: "Dyson Purifier Hotcool Hp07",
    price: 140, sku: "DYSONPURIFIERHO", inStock: true,
    rating: 4.4, reviewCount: 30, categorySlug: "klima", brandSlug: "dyson",
    specs: []
  },
  {
    name: "Dyson Purifier Humidifycool Ph01", slug: "dyson-purifier-humidifycool-ph01",
    description: "Dyson Purifier Humidifycool Ph01 – hochwertiges Haushaltsgerät.", shortDesc: "Dyson Purifier Humidifycool Ph01",
    price: 620, sku: "DYSONPURIFIERHU", inStock: true,
    rating: 4.5, reviewCount: 183, categorySlug: "klima", brandSlug: "dyson",
    specs: []
  },
  {
    name: "Dyson Pure Cool Tp07", slug: "dyson-pure-cool-tp07",
    description: "Dyson Pure Cool Tp07 – hochwertiges Haushaltsgerät.", shortDesc: "Dyson Pure Cool Tp07",
    price: 500, sku: "DYSONPURECOOLTP", inStock: true, isFeatured: true, isNew: true,
    rating: 4.6, reviewCount: 114, categorySlug: "klima", brandSlug: "dyson",
    specs: []
  },
  {
    name: "Stadler Form Form Oskar", slug: "stadler-form-oskar",
    description: "Stadler Form Form Oskar – hochwertiges Haushaltsgerät.", shortDesc: "Stadler Form Form Oskar",
    price: 660, sku: "STADLERFORMO2", inStock: true, isNew: true,
    rating: 4.4, reviewCount: 305, categorySlug: "klima", brandSlug: "stadler",
    specs: []
  },
  {
    name: "Stadler Form Form Oskar Little", slug: "stadler-form-oskar-little",
    description: "Stadler Form Form Oskar Little – hochwertiges Haushaltsgerät.", shortDesc: "Stadler Form Form Oskar Little",
    price: 540, sku: "STADLERFORMOSKA", inStock: true, isPromo: true,
    rating: 4.2, reviewCount: 305, categorySlug: "klima", brandSlug: "stadler",
    specs: []
  },
  {
    name: "Stadler Form Form Viktor", slug: "stadler-form-viktor",
    description: "Stadler Form Form Viktor – hochwertiges Haushaltsgerät.", shortDesc: "Stadler Form Form Viktor",
    price: 440, sku: "STADLERFORMVIKT", inStock: true, isNew: true,
    rating: 4.4, reviewCount: 227, categorySlug: "klima", brandSlug: "stadler",
    specs: []
  },
  {
    name: "Blueair Blue 3410", slug: "blueair-blue-3410",
    description: "Blueair Blue 3410 – hochwertiges Haushaltsgerät.", shortDesc: "Blueair Blue 3410",
    price: 970, sku: "BLUEAIRBLUE3410", inStock: true, isFeatured: true,
    rating: 4.6, reviewCount: 212, categorySlug: "klima", brandSlug: "blueair",
    specs: []
  },
  {
    name: "Blueair Classic 480i", slug: "blueair-classic-480i",
    description: "Blueair Classic 480i – hochwertiges Haushaltsgerät.", shortDesc: "Blueair Classic 480i",
    price: 610, sku: "BLUEAIRCLASSIC4", inStock: true, isPromo: true,
    rating: 4, reviewCount: 11, categorySlug: "klima", brandSlug: "blueair",
    specs: []
  },
  {
    name: "Blueair Health Protect 7440i", slug: "blueair-health-protect-7440i",
    description: "Blueair Health Protect 7440i – hochwertiges Haushaltsgerät.", shortDesc: "Blueair Health Protect 7440i",
    price: 140, sku: "BLUEAIRHEALTHPR", inStock: true, isNew: true,
    rating: 4.7, reviewCount: 76, categorySlug: "klima", brandSlug: "blueair",
    specs: []
  },
  {
    name: "Levoit Core 300", slug: "levoit-core-300",
    description: "Levoit Core 300 – hochwertiges Haushaltsgerät.", shortDesc: "Levoit Core 300",
    price: 390, sku: "LEVOITCORE300", inStock: true,
    rating: 4.3, reviewCount: 225, categorySlug: "klima", brandSlug: "levoit",
    specs: []
  },
  {
    name: "Levoit Core 400s", slug: "levoit-core-400s",
    description: "Levoit Core 400s – hochwertiges Haushaltsgerät.", shortDesc: "Levoit Core 400s",
    price: 590, sku: "LEVOITCORE400S", inStock: true,
    rating: 4.7, reviewCount: 73, categorySlug: "klima", brandSlug: "levoit",
    specs: []
  },
  {
    name: "Levoit Lv600s Hybrid", slug: "levoit-lv600s-hybrid",
    description: "Levoit Lv600s Hybrid – hochwertiges Haushaltsgerät.", shortDesc: "Levoit Lv600s Hybrid",
    price: 990, sku: "LEVOITLV600SHYB", inStock: true,
    rating: 4.1, reviewCount: 163, categorySlug: "klima", brandSlug: "levoit",
    specs: []
  },
  {
    name: "Trotec Pac 3200 E", slug: "trotec-pac-3200-e",
    description: "Trotec Pac 3200 E – hochwertiges Haushaltsgerät.", shortDesc: "Trotec Pac 3200 E",
    price: 320, sku: "TROTECPAC3200E", inStock: true, isFeatured: true, isPromo: true,
    rating: 4, reviewCount: 38, categorySlug: "klima", brandSlug: "trotec",
    specs: []
  },
  {
    name: "Trotec Pac 3900 E", slug: "trotec-pac-3900-e",
    description: "Trotec Pac 3900 E – hochwertiges Haushaltsgerät.", shortDesc: "Trotec Pac 3900 E",
    price: 600, sku: "TROTECPAC3900E", inStock: true, isNew: true,
    rating: 4.8, reviewCount: 139, categorySlug: "klima", brandSlug: "trotec",
    specs: []
  },
  {
    name: "Comfee Mpph 07crn7", slug: "comfee-mpph-07crn7",
    description: "Comfee Mpph 07crn7 – hochwertiges Haushaltsgerät.", shortDesc: "Comfee Mpph 07crn7",
    price: 800, sku: "COMFEEMPPH07CRN", inStock: true, isPromo: true,
    rating: 4.3, reviewCount: 283, categorySlug: "haushaltsgeraete", brandSlug: "comfee",
    specs: []
  },
  {
    name: "Comfee Mpph 12crn7", slug: "comfee-mpph-12crn7",
    description: "Comfee Mpph 12crn7 – hochwertiges Haushaltsgerät.", shortDesc: "Comfee Mpph 12crn7",
    price: 2180, sku: "COMFEEMPPH12CRN", inStock: true,
    rating: 4.3, reviewCount: 298, categorySlug: "haushaltsgeraete", brandSlug: "comfee",
    specs: []
  },
  {
    name: "Sichler Pac Wk 10", slug: "sichler-pac-wk-10",
    description: "Sichler Pac Wk 10 – hochwertiges Haushaltsgerät.", shortDesc: "Sichler Pac Wk 10",
    price: 2480, sku: "SICHLERPACWK10", inStock: true, isFeatured: true,
    rating: 4.7, reviewCount: 108, categorySlug: "haushaltsgeraete", brandSlug: "sichler",
    specs: []
  },
  {
    name: "Klarstein Fresh Breeze Xl", slug: "klarstein-fresh-breeze-xl",
    description: "Klarstein Fresh Breeze Xl – hochwertiges Haushaltsgerät.", shortDesc: "Klarstein Fresh Breeze Xl",
    price: 470, sku: "KLARSTEINFRESHB", inStock: true,
    rating: 4.1, reviewCount: 95, categorySlug: "haushaltsgeraete", brandSlug: "klarstein",
    specs: []
  },
  {
    name: "Stadler Form Form Airgoing Kne01", slug: "stadler-form-airgoing-kne01",
    description: "Stadler Form Form Airgoing Kne01 – hochwertiges Haushaltsgerät.", shortDesc: "Stadler Form Form Airgoing Kne01",
    price: 790, sku: "STADLERFORMAIRG", inStock: true, isFeatured: true,
    rating: 4.3, reviewCount: 170, categorySlug: "klima", brandSlug: "stadler",
    specs: []
  },
  {
    name: "Levoit Classic 200s", slug: "levoit-classic-200s",
    description: "Levoit Classic 200s – hochwertiges Haushaltsgerät.", shortDesc: "Levoit Classic 200s",
    price: 430, sku: "LEVOITCLASSIC20", inStock: true, isFeatured: true,
    rating: 4.8, reviewCount: 156, categorySlug: "klima", brandSlug: "levoit",
    specs: []
  },
  {
    name: "Blueair Blue 2210", slug: "blueair-blue-2210",
    description: "Blueair Blue 2210 – hochwertiges Haushaltsgerät.", shortDesc: "Blueair Blue 2210",
    price: 460, sku: "BLUEAIRBLUE2210", inStock: true,
    rating: 4.6, reviewCount: 205, categorySlug: "klima", brandSlug: "blueair",
    specs: []
  },
  {
    name: "Klarstein Skyscraper Ice", slug: "klarstein-skyscraper-ice",
    description: "Klarstein Skyscraper Ice – hochwertiges Haushaltsgerät.", shortDesc: "Klarstein Skyscraper Ice",
    price: 2400, sku: "KLARSTEINSKYSCR", inStock: true,
    rating: 4.2, reviewCount: 21, categorySlug: "haushaltsgeraete", brandSlug: "klarstein",
    specs: []
  },
  {
    name: "Midea Air Cool Maw08v1qwt", slug: "midea-air-cool-maw08v1qwt",
    description: "Midea Air Cool Maw08v1qwt – hochwertiges Haushaltsgerät.", shortDesc: "Midea Air Cool Maw08v1qwt",
    price: 1850, sku: "MIDEAAIRCOOLMAW", inStock: true, isFeatured: true, isPromo: true,
    rating: 4.5, reviewCount: 37, categorySlug: "haushaltsgeraete", brandSlug: "midea",
    specs: []
  },
  {
    name: "Dyson Big Quiet Formaldehyde N475", slug: "dyson-big-quiet-formaldehyde-n475",
    description: "Dyson Big Quiet Formaldehyde N475 – hochwertiges Haushaltsgerät.", shortDesc: "Dyson Big Quiet Formaldehyde N475",
    price: 1600, sku: "DYSONBIGQUIETFO", inStock: true, isPromo: true,
    rating: 4.6, reviewCount: 230, categorySlug: "haushaltsgeraete", brandSlug: "dyson",
    specs: []
  },
  {
    name: "Trotec Pac 2100 E", slug: "trotec-pac-2100-e",
    description: "Trotec Pac 2100 E – hochwertiges Haushaltsgerät.", shortDesc: "Trotec Pac 2100 E",
    price: 990, sku: "TROTECPAC2100E", inStock: true, isNew: true,
    rating: 4.1, reviewCount: 192, categorySlug: "klima", brandSlug: "trotec",
    specs: []
  },
  {
    name: "tado° Smart Thermostat V3plus Neu", slug: "tado-smart-thermostat-v3plus-neu",
    description: "tado° Smart Thermostat V3plus Neu – hochwertiges Haushaltsgerät.", shortDesc: "tado° Smart Thermostat V3plus Neu",
    price: 250, sku: "TADOSMARTTHE3", inStock: true,
    rating: 4.3, reviewCount: 135, categorySlug: "smart-home", brandSlug: "tado",
    specs: []
  },
  {
    name: "tado° Smart Thermostat V3plus Extension", slug: "tado-smart-thermostat-v3plus-extension",
    description: "tado° Smart Thermostat V3plus Extension – hochwertiges Haushaltsgerät.", shortDesc: "tado° Smart Thermostat V3plus Extension",
    price: 140, sku: "TADOSMARTTHE2", inStock: true, isNew: true,
    rating: 4.8, reviewCount: 283, categorySlug: "smart-home", brandSlug: "tado",
    specs: []
  },
  {
    name: "tado° Smart Ac Control V3plus Neu", slug: "tado-smart-ac-control-v3plus-neu",
    description: "tado° Smart Ac Control V3plus Neu – hochwertiges Haushaltsgerät.", shortDesc: "tado° Smart Ac Control V3plus Neu",
    price: 190, sku: "TADOSMARTACCONT", inStock: true, isNew: true,
    rating: 4.1, reviewCount: 133, categorySlug: "smart-home", brandSlug: "tado",
    specs: []
  },
  {
    name: "Philips Hue Starter Kit E27 Neu", slug: "philips-hue-starter-kit-e27-neu",
    description: "Philips Hue Starter Kit E27 Neu – hochwertiges Haushaltsgerät.", shortDesc: "Philips Hue Starter Kit E27 Neu",
    price: 260, sku: "PHILIPSHUEST2", inStock: true,
    rating: 4.5, reviewCount: 43, categorySlug: "smart-home", brandSlug: "philips",
    specs: []
  },
  {
    name: "Philips Hue Starter Kit E14", slug: "philips-hue-starter-kit-e14",
    description: "Philips Hue Starter Kit E14 – hochwertiges Haushaltsgerät.", shortDesc: "Philips Hue Starter Kit E14",
    price: 350, sku: "PHILIPSHUESTART", inStock: true, isNew: true, isPromo: true,
    rating: 4.5, reviewCount: 153, categorySlug: "smart-home", brandSlug: "philips",
    specs: []
  },
  {
    name: "Philips Hue Lightstrip Plus 2m", slug: "philips-hue-lightstrip-plus-2m",
    description: "Philips Hue Lightstrip Plus 2m – hochwertiges Haushaltsgerät.", shortDesc: "Philips Hue Lightstrip Plus 2m",
    price: 340, sku: "PHILIPSHUELIGHT", inStock: true, isNew: true,
    rating: 4.7, reviewCount: 269, categorySlug: "smart-home", brandSlug: "philips",
    specs: []
  },
  {
    name: "Philips Hue White Ambiance E27", slug: "philips-hue-white-ambiance-e27",
    description: "Philips Hue White Ambiance E27 – hochwertiges Haushaltsgerät.", shortDesc: "Philips Hue White Ambiance E27",
    price: 170, sku: "PHILIPSHUEWHITE", inStock: true,
    rating: 4.1, reviewCount: 29, categorySlug: "smart-home", brandSlug: "philips",
    specs: []
  },
  {
    name: "Nanoleaf Shapes Triangles", slug: "nanoleaf-shapes-triangles",
    description: "Nanoleaf Shapes Triangles – hochwertiges Haushaltsgerät.", shortDesc: "Nanoleaf Shapes Triangles",
    price: 190, sku: "NANOLEAFSHAPEST", inStock: true, isPromo: true,
    rating: 4.1, reviewCount: 105, categorySlug: "smart-home", brandSlug: "nanoleaf",
    specs: []
  },
  {
    name: "Nanoleaf Elements Hexagons", slug: "nanoleaf-elements-hexagons",
    description: "Nanoleaf Elements Hexagons – hochwertiges Haushaltsgerät.", shortDesc: "Nanoleaf Elements Hexagons",
    price: 220, sku: "NANOLEAFELEMENT", inStock: true,
    rating: 4.9, reviewCount: 107, categorySlug: "smart-home", brandSlug: "nanoleaf",
    specs: []
  },
  {
    name: "Ring Video Doorbell 4 Neu", slug: "ring-video-doorbell-4-neu",
    description: "Ring Video Doorbell 4 Neu – hochwertiges Haushaltsgerät.", shortDesc: "Ring Video Doorbell 4 Neu",
    price: 190, sku: "RINGVIDEODOORBE", inStock: true,
    rating: 4.4, reviewCount: 210, categorySlug: "smart-home", brandSlug: "ring",
    specs: []
  },
  {
    name: "Ring Spotlight Cam Pro", slug: "ring-spotlight-cam-pro",
    description: "Ring Spotlight Cam Pro – hochwertiges Haushaltsgerät.", shortDesc: "Ring Spotlight Cam Pro",
    price: 30, sku: "RINGSPOTLIGHTCA", inStock: true,
    rating: 4.7, reviewCount: 151, categorySlug: "smart-home", brandSlug: "ring",
    specs: []
  },
  {
    name: "Ring Indoor Cam Gen2", slug: "ring-indoor-cam-gen2",
    description: "Ring Indoor Cam Gen2 – hochwertiges Haushaltsgerät.", shortDesc: "Ring Indoor Cam Gen2",
    price: 190, sku: "RINGINDOORCAMGE", inStock: true,
    rating: 4.3, reviewCount: 300, categorySlug: "smart-home", brandSlug: "ring",
    specs: []
  },
  {
    name: "Netatmo Wetterstation", slug: "netatmo-wetterstation",
    description: "Netatmo Wetterstation – hochwertiges Haushaltsgerät.", shortDesc: "Netatmo Wetterstation",
    price: 80, sku: "NETATMOWETTERST", inStock: true,
    rating: 4.5, reviewCount: 14, categorySlug: "smart-home", brandSlug: "netatmo",
    specs: []
  },
  {
    name: "Netatmo Smart Thermostat", slug: "netatmo-smart-thermostat",
    description: "Netatmo Smart Thermostat – hochwertiges Haushaltsgerät.", shortDesc: "Netatmo Smart Thermostat",
    price: 100, sku: "NETATMOSMARTTHE", inStock: true, isNew: true,
    rating: 4.1, reviewCount: 33, categorySlug: "smart-home", brandSlug: "netatmo",
    specs: []
  },
  {
    name: "IKEA TRÅDFRI Starter Kit E27", slug: "ikea-tradfri-starter-kit-e27",
    description: "IKEA TRÅDFRI Starter Kit E27 – hochwertiges Haushaltsgerät.", shortDesc: "IKEA TRÅDFRI Starter Kit E27",
    price: 290, sku: "IKEATRADFRISTAR", inStock: true,
    rating: 4.3, reviewCount: 242, categorySlug: "smart-home", brandSlug: "ikea",
    specs: []
  },
  {
    name: "IKEA DIRIGERA Hub", slug: "ikea-dirigera-hub",
    description: "IKEA DIRIGERA Hub – hochwertiges Haushaltsgerät.", shortDesc: "IKEA DIRIGERA Hub",
    price: 160, sku: "IKEADIRIGERAHUB", inStock: true, isNew: true,
    rating: 4.2, reviewCount: 185, categorySlug: "smart-home", brandSlug: "ikea",
    specs: []
  },
  {
    name: "IKEA PRAKTLYSING SmartBlind", slug: "ikea-praktlysing-smart-blind",
    description: "IKEA PRAKTLYSING SmartBlind – hochwertiges Haushaltsgerät.", shortDesc: "IKEA PRAKTLYSING SmartBlind",
    price: 100, sku: "IKEAPRAKTLYSING", inStock: true,
    rating: 4.4, reviewCount: 23, categorySlug: "smart-home", brandSlug: "ikea",
    specs: []
  },
  {
    name: "Ring Alarm Security Kit 5", slug: "ring-alarm-security-kit-5",
    description: "Ring Alarm Security Kit 5 – hochwertiges Haushaltsgerät.", shortDesc: "Ring Alarm Security Kit 5",
    price: 330, sku: "RINGALARMSECURI", inStock: true, isPromo: true,
    rating: 4.7, reviewCount: 237, categorySlug: "smart-home", brandSlug: "ring",
    specs: []
  },
  {
    name: "Netatmo Smart Video Doorbell", slug: "netatmo-smart-video-doorbell",
    description: "Netatmo Smart Video Doorbell – hochwertiges Haushaltsgerät.", shortDesc: "Netatmo Smart Video Doorbell",
    price: 300, sku: "NETATMOSMARTVID", inStock: true,
    rating: 4.6, reviewCount: 62, categorySlug: "smart-home", brandSlug: "netatmo",
    specs: []
  },
  {
    name: "Nanoleaf Shapes Squares", slug: "nanoleaf-shapes-squares",
    description: "Nanoleaf Shapes Squares – hochwertiges Haushaltsgerät.", shortDesc: "Nanoleaf Shapes Squares",
    price: 250, sku: "NANOLEAFSHAPESS", inStock: true,
    rating: 4.1, reviewCount: 257, categorySlug: "smart-home", brandSlug: "nanoleaf",
    specs: []
  },
  {
    name: "Philips Hue Gradient Lightstrip 2m", slug: "philips-hue-gradient-lightstrip-2m",
    description: "Philips Hue Gradient Lightstrip 2m – hochwertiges Haushaltsgerät.", shortDesc: "Philips Hue Gradient Lightstrip 2m",
    price: 200, sku: "PHILIPSHUEGRADI", inStock: true,
    rating: 4.9, reviewCount: 190, categorySlug: "smart-home", brandSlug: "philips",
    specs: []
  },
  {
    name: "IKEA SYMFONISK Table Speaker", slug: "ikea-symfonisk-table-speaker",
    description: "IKEA SYMFONISK Table Speaker – hochwertiges Haushaltsgerät.", shortDesc: "IKEA SYMFONISK Table Speaker",
    price: 400, sku: "IKEASYMFONISKTA", inStock: true,
    rating: 4.3, reviewCount: 26, categorySlug: "smart-home", brandSlug: "ikea",
    specs: []
  },
  {
    name: "Philips Hue Play Gradient Lightstrip 55\\", slug: "philips-hue-play-gradient-lightstrip-55",
    description: "Philips Hue Play Gradient Lightstrip 55\\ – hochwertiges Haushaltsgerät.", shortDesc: "Philips Hue Play Gradient Lightstrip 55\\",
    price: 50, sku: "PHILIPSHUEPLAYG", inStock: true, isPromo: true,
    rating: 4.6, reviewCount: 259, categorySlug: "smart-home", brandSlug: "philips",
    specs: []
  },
  {
    name: "tado° Smart Radiator Starter Kit", slug: "tado-smart-radiator-starter-kit",
    description: "tado° Smart Radiator Starter Kit – hochwertiges Haushaltsgerät.", shortDesc: "tado° Smart Radiator Starter Kit",
    price: 180, sku: "TADOSMARTRADIAT", inStock: true, isNew: true,
    rating: 4.2, reviewCount: 243, categorySlug: "smart-home", brandSlug: "tado",
    specs: []
  },
  {
    name: "Ring Floodlight Cam Wired Pro", slug: "ring-floodlight-cam-wired-pro",
    description: "Ring Floodlight Cam Wired Pro – hochwertiges Haushaltsgerät.", shortDesc: "Ring Floodlight Cam Wired Pro",
    price: 130, sku: "RINGFLOODLIGHTC", inStock: true, isPromo: true,
    rating: 4.7, reviewCount: 305, categorySlug: "smart-home", brandSlug: "ring",
    specs: []
  },
  {
    name: "IKEA PARASOLL Tür-/Fensterkontakt", slug: "ikea-parasoll-door-window-sensor",
    description: "IKEA PARASOLL Tür-/Fensterkontakt – hochwertiges Haushaltsgerät.", shortDesc: "IKEA PARASOLL Tür-/Fensterkontakt",
    price: 30, sku: "IKEAPARASOLLDOO", inStock: true, isPromo: true,
    rating: 4.7, reviewCount: 57, categorySlug: "smart-home", brandSlug: "ikea",
    specs: []
  },
  {
    name: "IKEA VALLHORN Bewegungsmelder", slug: "ikea-vallhorn-motion-sensor",
    description: "IKEA VALLHORN Bewegungsmelder – hochwertiges Haushaltsgerät.", shortDesc: "IKEA VALLHORN Bewegungsmelder",
    price: 190, sku: "IKEAVALLHORNMOT", inStock: true,
    rating: 4.6, reviewCount: 155, categorySlug: "smart-home", brandSlug: "ikea",
    specs: []
  },
  {
    name: "Philips Hue Secure Kamera", slug: "philips-hue-secure-camera",
    description: "Philips Hue Secure Kamera – hochwertiges Haushaltsgerät.", shortDesc: "Philips Hue Secure Kamera",
    price: 320, sku: "PHILIPSHUESE2", inStock: true, isFeatured: true,
    rating: 4.2, reviewCount: 127, categorySlug: "smart-home", brandSlug: "philips",
    specs: []
  },
  {
    name: "IKEA STARKVIND Luftreiniger", slug: "ikea-starkvind-air-purifier",
    description: "IKEA STARKVIND Luftreiniger – hochwertiges Haushaltsgerät.", shortDesc: "IKEA STARKVIND Luftreiniger",
    price: 360, sku: "IKEASTARKVINDAI", inStock: true,
    rating: 4.6, reviewCount: 86, categorySlug: "smart-home", brandSlug: "ikea",
    specs: []
  },
  {
    name: "Nanoleaf Essential A19 Birne", slug: "nanoleaf-essential-a19-bulb",
    description: "Nanoleaf Essential A19 Birne – hochwertiges Haushaltsgerät.", shortDesc: "Nanoleaf Essential A19 Birne",
    price: 200, sku: "NANOLEAFESSENTI", inStock: true, isPromo: true,
    rating: 4.8, reviewCount: 51, categorySlug: "smart-home", brandSlug: "nanoleaf",
    specs: []
  },
  {
    name: "Ring Alarm Flood & Freeze Sensor", slug: "ring-alarm-flood-freeze-sensor",
    description: "Ring Alarm Flood & Freeze Sensor – hochwertiges Haushaltsgerät.", shortDesc: "Ring Alarm Flood & Freeze Sensor",
    price: 260, sku: "RINGALARMFLOODF", inStock: true, isPromo: true,
    rating: 4.9, reviewCount: 291, categorySlug: "smart-home", brandSlug: "ring",
    specs: []
  },
  {
    name: "tado° Smart Thermostat V3+", slug: "tado-smart-thermostat-v3plus-single",
    description: "tado° Smart Thermostat V3+ – hochwertiges Haushaltsgerät.", shortDesc: "tado° Smart Thermostat V3+",
    price: 40, sku: "TADOSMARTTHERMO", inStock: true,
    rating: 4.2, reviewCount: 84, categorySlug: "smart-home", brandSlug: "tado",
    specs: []
  },
  {
    name: "Philips Hue Secure Doorbell Camera", slug: "philips-hue-secure-doorbell-camera",
    description: "Philips Hue Secure Doorbell Camera – hochwertiges Haushaltsgerät.", shortDesc: "Philips Hue Secure Doorbell Camera",
    price: 350, sku: "PHILIPSHUESECUR", inStock: true,
    rating: 4.5, reviewCount: 176, categorySlug: "smart-home", brandSlug: "philips",
    specs: []
  },
  {
    name: "Blueair Blue 3210", slug: "blueair-blue-3210",
    description: "Der Blueair Blue 3210 - kompakter Luftreiniger mit HEPASilent-Technologie.", shortDesc: "Kompakter Luftreiniger mit HEPASilent",
    price: 199, sku: "BLUE-3210", inStock: true,
    rating: 4.5, reviewCount: 189, categorySlug: "klima", brandSlug: "blueair",
    specs: []
  },
  {
    name: "AEG CX7-2-I360", slug: "aeg-cx7-2-i360",
    description: "Der AEG CX7-2-I360 - kabelloser Handstaubsauger mit 2-in-1-Design und zyklonischer Filtration.", shortDesc: "Kabelloser Handstaubsauger mit 2-in-1-Design",
    price: 299, sku: "AEG-CX7-2-I360", inStock: true,
    rating: 4.4, reviewCount: 87, categorySlug: "reinigung", brandSlug: "aeg", weight: 2.5,
    specs: []
  },
  {
    name: "Bosch Serie 4 SMV6ECX22E", slug: "bosch-serie-4-smv6ecx22e",
    description: "Der Bosch Serie 4 Einbau-Geschirrspüler mit PerfectDry und Zeolith-Trocknung.", shortDesc: "Geschirrspüler mit PerfectDry & Zeolith",
    price: 799, sku: "BSH-SMV6ECX22E", inStock: true,
    rating: 4.7, reviewCount: 189, categorySlug: "haushaltsgeraete", brandSlug: "bosch", weight: 34,
    specs: []
  },
  {
    name: "Siemens iQ300 SN63EX22CE", slug: "siemens-iq300-sn63ex22ce",
    description: "Der Siemens iQ300 Geschirrspüler mit Silence Plus und varioSpeed.", shortDesc: "Siemens iQ300 mit Silence Plus & varioSpeed",
    price: 999, sku: "SI-SN63EX22CE", inStock: true,
    rating: 4.5, reviewCount: 33, categorySlug: "haushaltsgeraete", brandSlug: "siemens", weight: 35,
    specs: []
  },
  {
    name: "Bosch Serie 4 SMS4ECI28F", slug: "bosch-serie-4-sms4eci28f",
    description: "Der Bosch Serie 4 Pose libre Geschirrspüler mit Silence Plus und EfficientDry.", shortDesc: "Pose libre mit Silence Plus & EfficientDry",
    price: 1099, sku: "BSH-SMS4ECI28F", inStock: true,
    rating: 4.7, reviewCount: 24, categorySlug: "haushaltsgeraete", brandSlug: "bosch", weight: 53,
    specs: []
  },
  {
    name: "Bosch Serie 4 KGN36VLED", slug: "bosch-serie-4-kgn36vled",
    description: "Der Bosch Serie 4 Kombi-Kühlschrank mit NoFrost, VitaFresh und LED-Display.", shortDesc: "Kombi-Kühlschrank mit NoFrost & VitaFresh",
    price: 633, sku: "BSH-KGN36VLED", inStock: true,
    rating: 4.4, reviewCount: 31, categorySlug: "haushaltsgeraete", brandSlug: "bosch", weight: 72,
    specs: []
  },
  {
    name: "iRobot Roomba Plus 405", slug: "irobot-roomba-plus-405",
    description: "Der iRobot Roomba Plus 405 - intelligenter Saugroboter mit 3-Stufen-Reinigungssystem und automatischer Staubbenerdielung.", shortDesc: "Saugroboter mit 3-Stufen-Reinigung & Auto-Empty",
    price: 499, sku: "IR-RP405", inStock: true, isFeatured: true,
    rating: 4.5, reviewCount: 156, categorySlug: "reinigung", brandSlug: "irobot", weight: 3.2, tags: ["bestseller"],
    specs: []
  },
  {
    name: "Liebherr Comfort Ke230-26", slug: "liebherr-comfort-ke230-26",
    description: "Der Liebherr Comfort Kühlschrank mit 213 L Volumen, LED-Beleuchtung und ClimateClass SN-ST.", shortDesc: "Kompakter Kühlschrank mit 213 L & LED",
    price: 549, sku: "LB-KE230-26", inStock: true,
    rating: 4.3, reviewCount: 56, categorySlug: "haushaltsgeraete", brandSlug: "liebherr", weight: 44,
    specs: []
  },
  {
    name: "Bosch Serie 6 Geschirrspüler SMV88TX36E", slug: "bosch-serie6-smv88tx36e",
    description: "Bosch Serie 6 Geschirrspüler SMV88TX36E – hochwertiges Haushaltsgerät.", shortDesc: "Bosch Serie 6 Geschirrspüler SMV88TX36E",
    price: 2200, sku: "BOSCHSERIE6SMV8", inStock: true, isPromo: true,
    rating: 4.6, reviewCount: 72, categorySlug: "haushaltsgeraete", brandSlug: "bosch",
    specs: []
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
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) {
    throw new Error("ADMIN_PASSWORD env var is required. Never use a default password.");
  }
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
      bankAccountName: "HAUSAURA GmbH",
      bankName: "Commerzbank Berlin",
      shippingInfo: "Kostenloser Versand ab 50€ Bestellwert. Standard-Versand: 4,99€.",
      contactEmail: "info@hausaura.de",
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
        categoryId: categoryMap[categorySlug]!,
        brandId: brandMap[brandSlug]!,
        features: features || [],
        tags: tags || [],
      },
      select: { id: true, slug: true },
    });
    productRecords.push(created);
  }

  const imageData: { url: string; alt: string; position: number; productId: string }[] = [];
  for (const rec of productRecords) {
    const productDir = join(IMAGES_DIR, rec.slug);
    try {
      const files = readdirSync(productDir);
      const imageFiles = files
        .filter((f) => f.endsWith(".png") || f.endsWith(".jpg") || f.endsWith("-medium.webp"))
        .sort((a, b) => {
          const numA = parseInt(a.replace(/\.(png|jpg)$/, "").replace(/-medium\.webp$/, ""), 10);
          const numB = parseInt(b.replace(/\.(png|jpg)$/, "").replace(/-medium\.webp$/, ""), 10);
          return numA - numB;
        });

      // Deduplicate: prefer PNG > JPG > medium.webp for same number
      const seen = new Set<number>();
      const deduped: string[] = [];
      for (const f of imageFiles) {
        const num = parseInt(f.replace(/\.(png|jpg)$/, "").replace(/-medium\.webp$/, ""), 10);
        if (!seen.has(num)) {
          seen.add(num);
          deduped.push(f);
        }
      }

      for (let i = 0; i < deduped.length; i++) {
        imageData.push({ url: `/images/products/${rec.slug}/${deduped[i]}`, alt: rec.slug, position: i, productId: rec.id });
      }
    } catch {
      imageData.push({ url: `/images/placeholder-product.svg`, alt: rec.slug, position: 0, productId: rec.id });
    }
  }
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
  const seenReviews = new Set<string>();
  for (const rec of productRecords) {
    const reviewCount = Math.floor(Math.random() * 3) + 1;
    for (let i = 0; i < reviewCount; i++) {
      const review = sampleReviews[Math.floor(Math.random() * sampleReviews.length)]!;
      const key = `${rec.id}|${review.authorName.toLowerCase().replace(/[^a-z]/g, "")}@example.de`;
      if (seenReviews.has(key)) continue;
      seenReviews.add(key);
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

  const testimonials = [
    {
      name: "Stefan M.",
      location: "Berlin",
      rating: 5,
      content: "Hervorragende Beratung und blitzschnelle Lieferung. Der Jura E8 Kaffeevollautomat funktioniert einwandfrei. Kann HAUSAURA nur empfehlen!",
      product: "Jura E8 Platinum",
      avatar: null,
      isApproved: true,
      isFeatured: true,
    },
    {
      name: "Anna K.",
      location: "München",
      rating: 4,
      content: "Die Miele Waschmaschine wurde problemlos geliefert. Das Gerät läuft super. Einziger Kritikpunkt: Lieferung dauerte 3 statt 2 Tage.",
      product: "Miele W1 Waschmaschine",
      avatar: null,
      isApproved: true,
      isFeatured: true,
    },
    {
      name: "Thomas B.",
      location: "Hamburg",
      rating: 5,
      content: "Sehr kompetenter Kundendienst. Hatte eine Frage zur Installation und wurde sofort freundlich beraten. Top Service!",
      product: null,
      avatar: null,
      isApproved: true,
      isFeatured: false,
    },
    {
      name: "Julia H.",
      location: "Köln",
      rating: 4,
      content: "Die KitchenAid Artisan kommt genau wie beschrieben. Preis war ok, Versand schnell. Gerne wieder!",
      product: "KitchenAid Artisan",
      avatar: null,
      isApproved: true,
      isFeatured: true,
    },
    {
      name: "Michael S.",
      location: "Frankfurt",
      rating: 5,
      content: "Der Dyson V15 Detect ist fantastisch. Das orange Licht zeigt jeden Staub. HAUSAURA hatte den besten Preis!",
      product: "Dyson V15 Detect",
      avatar: null,
      isApproved: true,
      isFeatured: false,
    },
    {
      name: "Laura W.",
      location: "Düsseldorf",
      rating: 4,
      content: "Gute Auswahl an Premium-Marken. Lieferung dauerte 3 Tage statt 2, aber das Gerät ist einwandfrei.",
      product: "Samsung Bespoke Kühlschrank",
      avatar: null,
      isApproved: true,
      isFeatured: false,
    },
    {
      name: "Peter R.",
      location: "Stuttgart",
      rating: 5,
      content: "Der Miele Staubsauger ist leistungsstark und leise. Preis war 150€ günstiger als bei der Konkurrenz. Top!",
      product: "Miele Triflex HX2",
      avatar: null,
      isApproved: true,
      isFeatured: true,
    },
    {
      name: "Sandra L.",
      location: "Leipzig",
      rating: 5,
      content: "Tolle Beratung beim Kauf der Miele Spülmaschine. Alles super gelaufen, gerne wieder!",
      product: "Miele G 7310 SCU",
      avatar: null,
      isApproved: true,
      isFeatured: false,
    },
    {
      name: "Klaus D.",
      location: "Dresden",
      rating: 5,
      content: "Die Siemens Kaffeemaschine ist einfach klasse. Der online-Shop ist übersichtlich und die Bezahlung per SEPA funktioniert super.",
      product: "Siemens EQ.9 plus s500",
      avatar: null,
      isApproved: true,
      isFeatured: false,
    },
    {
      name: "Monika F.",
      location: "Hannover",
      rating: 5,
      content: "Schnelle Lieferung und gutes Preis-Leistungs-Verhältnis. Die Bosch Spülmaschine läuft einwandfrei. Danke!",
      product: "Bosch SMS4HVW00E",
      avatar: null,
      isApproved: true,
      isFeatured: false,
    },
    {
      name: "Alexander P.",
      location: "Bremen",
      rating: 4,
      content: "Guter Service, aber die Lieferung könnte etwas schneller sein. Das LG Waschtrockner-Set ist Top!",
      product: "LG WashTower",
      avatar: null,
      isApproved: true,
      isFeatured: false,
    },
    {
      name: "Christine W.",
      location: "Münster",
      rating: 5,
      content: "Bin sehr zufrieden mit dem Vorwerk Kobold. HAUSAURA bietet wirklich faire Preise. Vielen Dank!",
      product: "Vorwerk Kobold VK200",
      avatar: null,
      isApproved: true,
      isFeatured: false,
    },
  ];

  await prisma.testimonial.createMany({ data: testimonials });

  console.log(`✅ ${products.length} products created with reviews`);
  console.log(`✅ ${testimonials.length} testimonials created`);

  console.log("🎉 Seeding complete!");
  console.log(`   Categories: ${categories.length}`);
  console.log(`   Brands: ${brands.length}`);
  console.log(`   Products: ${products.length}`);
  console.log(`   Testimonials: ${testimonials.length}`);
  console.log(`   Admin: ${adminEmail} (password from env var)`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
