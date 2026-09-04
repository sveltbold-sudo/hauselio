import { PrismaClient } from "@prisma/client";
import { readdirSync } from "fs";
import { join } from "path";

const prisma = new PrismaClient();
const IMAGES_DIR = join(process.cwd(), "public", "images", "products");

const adminEmail = process.env.ADMIN_EMAIL;
if (!adminEmail) {
  throw new Error("ADMIN_EMAIL environment variable is required for seeding");
}

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
  { name: "Kenwood", slug: "kenwood", logo: "/images/brands/kenwood.svg" },
  { name: "Russell Hobbs", slug: "russell-hobbs", logo: "/images/brands/russell-hobbs.svg" },
  { name: "Braun", slug: "braun", logo: "/images/brands/braun.svg" },
  { name: "Smeg", slug: "smeg", logo: "/images/brands/smeg.svg" },
  { name: "Moulinex", slug: "moulinex", logo: "/images/brands/moulinex.svg" },
  { name: "Black+Decker", slug: "black-decker", logo: "/images/brands/black-decker.svg" },
  { name: "Lavazza", slug: "lavazza", logo: "/images/brands/lavazza.svg" },
  { name: "Trotec", slug: "trotec", logo: "/images/brands/trotec.svg" },
  { name: "Comfee", slug: "comfee", logo: "/images/brands/comfee.svg" },
  { name: "Sichler", slug: "sichler", logo: "/images/brands/sichler.svg" },
  { name: "Klarstein", slug: "klarstein", logo: "/images/brands/klarstein.svg" },
  { name: "Midea", slug: "midea", logo: "/images/brands/midea.svg" },
];

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
    name: "Thermomix TM7", slug: "thermomix-tm7",
    description: "Der neue Thermomix TM7 - noch leistungsstärker, vielseitiger und benutzerfreundlicher. Über 80 Kochfunktionen in einem Gerät.", shortDesc: "Das ultimative Küchengerät mit 80+ Funktionen",
    price: 1295.19, originalPrice: 1599, sku: "TM7-2026", isFeatured: true, isNew: true,
    rating: 4.9, reviewCount: 127, categorySlug: "kueche", brandSlug: "thermomix", weight: 7.95, tags: ["bestseller"],
    specs: [
      { key: "Leistung", value: "1800 W" },
      { key: "Gewicht", value: "9.5 kg" },
      { key: "Abmessungen", value: "40x45x45 cm" },
      { key: "Material", value: "Glas" },
      { key: "Farbe", value: "Silber" },
      { key: "Garantie", value: "3 Jahre" },
      { key: "Energieeffizienzklasse", value: "A++" },
    ]
  },
  {
    name: "Thermomix TM6", slug: "thermomix-tm6",
    description: "Der Thermomix TM6 ist ein multifunktionaler Küchenhelfer mit über 20 Funktionen. Die intuitive Touch-Steuerung ermöglicht einfache Bedienung. Die integrierte Waage erlaubt präzise Zutatenabmessung. Die Heizfunktion bis 160°C ermögliches Kochen und Braten. Die Messerklinge aus Edelstahl mahlt, mixt und püriert. Die guided-Cooking-Funktion führt Schritt für Schritt durch Rezepte. Die Varoma-Dämpfer erweitert die Möglichkeiten. Die premium-Veredelung unterstreicht den Qualitätsanspruch. Ein unverzichtbarer Helfer für moderne Küchen.", shortDesc: "Multifunktionaler Küchenhelfer mit 20+ Funktionen und guided Cooking",
    price: 1133.19, originalPrice: 1399, sku: "TM6-2025", isFeatured: true,
    rating: 4.8, reviewCount: 342, categorySlug: "kueche", brandSlug: "thermomix", tags: ["bestseller"],
    specs: [
      { key: "Funktionen", value: "20+ Funktionen" },
      { key: "Leistung", value: "1500 Watt" },
      { key: "Temperaturbereich", value: "37-160°C" },
      { key: "Geschwindigkeit", value: "40-10.700 U/min" },
      { key: "Kapazität", value: "2,2 Liter" },
      { key: "Gewicht", value: "7,95 kg" },
      { key: "Farbe", value: "Weiß" },
    ]
  },
  {
    name: "KitchenAid Artisan Küchenmaschine 5KSM175PSE", slug: "kitchenaid-artisan-5ksm175pse",
    description: "Die KitchenAid Artisan 5KSM175PSE ist eine Premium-Küchenmaschine im ikonischen Design. Das planetarische Mischsystem sorgt für gleichmäßige Ergebnisse. Die 10 Geschwindigkeitsstufen und der Pulsbetrieb ermöglichen individuelle Einstellungen. Die mitgelieferten Aufätze – Knethaken, Schneebesen, Kneter – bieten maximale Vielseitigkeit. Der abnehmbare 4,8-Liter-Rüssel aus Edelstahl ist spülmaschinenfeste. Das elegante Design in verschiedenen Farben passt zu jeder Kücheneinrichtung. Die integrierte Schnittgeschwindigkeit sorgt für optimale Ergebnisse. Eine ikonische Küchenmaschine für anspruchsvolle Hobby-Köche.", shortDesc: "Ikonische KitchenAid-Küchenmaschine mit planetarischem Mischsystem",
    price: 549, originalPrice: 599, sku: "KA-ART-5KSM", isFeatured: true, isPromo: true,
    rating: 4.8, reviewCount: 289, categorySlug: "kueche", brandSlug: "kitchenaid", weight: 10.5, tags: ["bestseller"],
    specs: [
      { key: "Leistung", value: "300 Watt" },
      { key: "Rüsselvolumen", value: "4,8 Liter" },
      { key: "Geschwindigkeiten", value: "10 + Puls" },
      { key: "Mischsystem", value: "Planetarisch" },
      { key: "Aufätze", value: "Knethaken, Schneebesen, Kneter" },
      { key: "Farbe", value: "Verschiedene Farben" },
    ]
  },
  {
    name: "Bosch Serie 6 Freistehender Herd HKH634ES5", slug: "bosch-serie-6-herd-hkh634es5",
    description: "Der Bosch Serie 6 herd HKH634ES5 ist ein freistehender Ceran-Herd mit Induktionskochfeld und Backofen. Das Induktionskochfeld mit 4 Kochfeldern bietet schnelles und energieeffizientes Kochen. Die Induktion-Technologie erhitzt das Kochgeschirr direkt für präzise Temperaturregelung. Der multifunktionale Backofen bietet 8 Funktionen inkl. Heißluft und Ober-/Unterhitze. Die elektrische Zündung und das integré Tempschner ermöglichen komfortables Kochen. Die ceranische Kochfläche ist leicht zu reinigen. Das 60-cm-Format passt in jede Küchenzeile. Ein zuverlässiges Küchengerät für den täglichen Gebrauch.", shortDesc: "Freistehender Induktionsherd mit 4 Kochfeldern und multifunktionalem Backofen",
    price: 1899, sku: "BSH-HKH634ES5",
    rating: 4.7, reviewCount: 78, categorySlug: "kueche", brandSlug: "bosch", weight: 62,
    specs: [
      { key: "Kochfeld", value: "Induktion, 4 Felder" },
      { key: "Backofen", value: "Multifunktional, 8 Funktionen" },
      { key: "Backofenvolumen", value: "66 Liter" },
      { key: "Energieklasse", value: "A" },
      { key: "Breite", value: "60 cm" },
      { key: "Farbe", value: "Edelstahl/Schwarz" },
    ]
  },
  {
    name: "Siemens iQ700 Backofen HB778GES0", slug: "siemens-iq700-backofen-hb778ges0",
    description: "Der Siemens iQ700 Backofen HB778GES0 ist ein Premium-Einbau-Backofen mit 14 Funktionen. Die 3D-Heißluft-Verteilung sorgt für gleichmäßiges Backen auf allen Ebenen. Das TFT-Touchdisplay mit Farbanzeige ermöglicht intuitive Bedienung. Die Home-Connect-App ermöglicht die Fernbedienung per Smartphone. Die Pyrolyse-Selbstreinigung reinigt den Ofen automatisch. Die SoftClose-Tür sorgt für sanftes Schließen. Die LED-Beleuchtung sorgt für optimale Sicht. Ein Premium-Backofen für anspruchsvolle Bäcker.", shortDesc: "Premium-Einbau-Backofen mit 14 Funktionen, Home Connect und TFT-Display",
    price: 1299, sku: "SI-HB778GES0", isNew: true,
    rating: 4.8, reviewCount: 45, categorySlug: "kueche", brandSlug: "siemens", weight: 38,
    specs: [
      { key: "Funktionen", value: "14 Backfunktionen" },
      { key: "Backofenvolumen", value: "71 Liter" },
      { key: "Technologie", value: "3D-Heißluft" },
      { key: "Reinigung", value: "Pyrolyse" },
      { key: "Steuerung", value: "TFT-Touchdisplay" },
      { key: "Breite", value: "60 cm" },
      { key: "Energieklasse", value: "A" },
    ]
  },
  {
    name: "Gaggenau Vario 200 induktion Kochfeld", slug: "gaggenau-vario-200-induktion",
    description: "Das Gaggenau Vario 200 Induktionskochfeld bietet 2 Kochfelder für flexibles Kochen. Die induktive Technologie sorgt für schnelles und energieeffizientes Arbeiten. Die PowerBoost-Funktion ermöglicht schnelles Aufkochen. Dieintuitive Bedienung über Berührungselemente ist einfach und komfortabel. Die scheibenkeramische Oberfläche ist leicht zu reinigen. Das elegante Design in Schwarz passt zu jeder modernen Kücheneinrichtung. Die perfekte Ergänzung für Gaggenau-Küchen. Ein Premium-Kochfeld für anspruchsvolle Köche.", shortDesc: "2-Feld-Induktionskochfeld von Gaggenau mit PowerBoost",
    price: 2499, sku: "GAG-V200-IND",
    rating: 4.9, reviewCount: 34, categorySlug: "kueche", brandSlug: "gaggenau",
    specs: [
      { key: "Kochfelder", value: "2 Induktionskochfelder" },
      { key: "Technologie", value: "Induktion" },
      { key: "Funktionen", value: "PowerBoost" },
      { key: "Steuerung", value: "Berührungselemente" },
      { key: "Breite", value: "30 cm" },
      { key: "Farbe", value: "Schwarz" },
    ]
  },
  {
    name: "Jura E8 Platinum", slug: "jura-e8-platinum",
    description: "Die Jura E8 Platinum ist der meistverkaufte Vollautomat der Welt. Das professionelle Aromamahlwerk aus Edelstahl mahlt die Bohnen besonders schonend und leise. Die P.E.P.-Technologie (Pulse Extraction Process) pulsiert das Wasser durch das Kaffeemehl für optimalen Geschmack. Der automatische Milchschaumer erzeugt in Sekunden cremigen Milchschaum für Cappuccino und Latte Macchiato. Die EASY-Schaltmatrix bietet 7 Kaffeespezialitäten auf einen Blick. Das Aroma-Schutz-System bewahrt die Bohnen vor Feuchtigkeit. Die abnehmbare Milchleitung ist spülmaschinengeeignet. Mit 1600 Watt Leistung und 15 bar Brühdruck bietet die E8 Professional-Qualität für zuhause.", shortDesc: "Weltweit meistverkaufter Vollautomat mit P.E.P. und 7 Spezialitäten",
    price: 1199, originalPrice: 1299, sku: "JURA-E8-PL", isFeatured: true, isPromo: true,
    rating: 4.8, reviewCount: 156, categorySlug: "kaffee", brandSlug: "jura", weight: 9.6, tags: ["bestseller"],
    specs: [
      { key: "Mahlwerk", value: "Aromamahlwerk Edelstahl" },
      { key: "Brühtechnologie", value: "P.E.P." },
      { key: "Kaffeespezialitäten", value: "7 Sorten" },
      { key: "Wasserkapazität", value: "1,9 Liter" },
      { key: "Bohnenbehälter", value: "280 g" },
      { key: "Leistung", value: "1600 Watt" },
      { key: "Brühdruck", value: "15 bar" },
      { key: "Garantie", value: "2 Jahre" },
    ]
  },
  {
    name: "Jura Z10 Platinum", slug: "jura-z10-platinum",
    description: "Die Jura Z10 Platinum ist das Flaggschiff der Jura-Vollautomaten und bietet 32 Kaffeespezialitäten. Die einzigartige Cold-Brew-Technologie bereitet kalte Kaffeespezialitäten mit einer einzigen Maschine. Das professionelle Aromamahlwerk aus Edelstahl mahlt die Bohnen besonders schonend und leise. Die P.E.P.-Technologie optimiert die Extraktion für jede Spezialität. Der automatische Milchschaumer erzeugt in Sekunden cremigen Milchschaum. Das 4,3-Zoll-Touchdisplay bietet intuitive Bedienung und individuelle Anpassungen. Die JURA Smart Connect App ermöglicht die Fernbedienung per Smartphone. Die Premium-Veredelung aus Metall und Edelstahl unterstreicht den luxuriösen Anspruch. Das Absolute Premium-Modell für anspruchsvollste Kaffeekenner.", shortDesc: "Flaggschiff-Vollautomat mit Cold Brew und 32 Spezialitäten",
    price: 2199, sku: "JURA-Z10-PL", isFeatured: true, isNew: true,
    rating: 4.9, reviewCount: 67, categorySlug: "kaffee", brandSlug: "jura", weight: 12.3, tags: ["bestseller"],
    specs: [
      { key: "Mahlwerk", value: "Professionelles Aromamahlwerk" },
      { key: "Brühtechnologie", value: "P.E.P." },
      { key: "Kaffeespezialitäten", value: "32 Sorten inkl. Cold Brew" },
      { key: "Wasserkapazität", value: "2,4 Liter" },
      { key: "Bohnenbehälter", value: "280 g" },
      { key: "Leistung", value: "1450 Watt" },
      { key: "App-Steuerung", value: "JURA Smart Connect" },
      { key: "Garantie", value: "2 Jahre" },
    ]
  },
  {
    name: "De'Longhi Magnifica S ECAM 22.110.B", slug: "delonghi-magnifica-s-ecam22110b",
    description: "Die De'Longhi Magnifica S ECAM 22.110.B ist der kompakte Einstiegs-Vollautomat für alle Kaffeeliebhaber. Das 13-stufige Mahlwerk aus gehärtetem Stahl mahlt Bohnen frisch und leise für jedes Getränk. Die LatteCrema-Technologie erzeugt automatisch samtigen Milchschaum. Mit nur einem Knopfdruck bereiten Sie Cappuccino, Espresso, Kaffee oder Milchkaffee zu. Die abnehmbare Brühgruppe und der Milchaufschäumer sind einfach zu reinigen und spülmaschinenfest. Das integrierte Display zeigt alle Funktionen übersichtlich an. Die Kompaktheit von nur 20 cm Breite macht sie ideal für kleine Küchen. Ein echtes Preis-Leistungs-Wunder für den täglichen Kaffeegenuss.", shortDesc: "Kompakter Einstiegs-Vollautomat mit Milchsystem und 13 Mahlgraden",
    price: 349, sku: "DEL-ECAM22110B",
    rating: 4.5, reviewCount: 892, categorySlug: "kaffee", brandSlug: "delonghi", weight: 9,
    specs: [
      { key: "Mahlwerk", value: "13-stufig, gehärteter Stahl" },
      { key: "Milchsystem", value: "LatteCrema automatisch" },
      { key: "Kaffeespezialitäten", value: "Cappuccino, Espresso, Kaffee" },
      { key: "Wasserkapazität", value: "1,8 Liter" },
      { key: "Bohnenbehälter", value: "270 g" },
      { key: "Leistung", value: "1500 Watt" },
      { key: "Brühdruck", value: "15 bar" },
      { key: "Garantie", value: "2 Jahre" },
    ]
  },
  {
    name: "Nespresso Vertuo Pop+", slug: "nespresso-vertuo-pop-plus",
    description: "Die Nespresso Vertuo Pop+ ist die erweiterte Variante der Vertuo Pop mit größerm Wassertank. Die Centrifusion-Technologie zentrifugiert die Kapsel mit bis zu 7.000 Umdrehungen pro Minute für optimalen Geschmack. Die Barcode-Technologie erkennt jede Kapsel automatisch und passt die Brühparameter an. Die 5 Tassengrößen bieten Vielseitigkeit für jeden Moment. Der größere 1,5-Liter-Wassertank ermöglicht mehr Tassen ohne Nachfüllen. Das kompakte Design passt in jede Küche. Die verschiedenen Farboptionen machen jede Kaffeeecke zum Highlight. Die 100% recycelbaren Aluminium-Kapseln sind umweltfreundlich. Die perfekte Kapselmaschine für Vieltrinker.", shortDesc: "Vertuo Pop mit großem 1,5L-Wassertank und 5 Tassengrößen",
    price: 99, sku: "NES-VPOP-PLUS", isNew: true,
    rating: 4.3, reviewCount: 234, categorySlug: "kaffee", brandSlug: "nespresso", weight: 3.5,
    specs: [
      { key: "Kaffeesystem", value: "Nespresso Vertuo" },
      { key: "Technologie", value: "Centrifusion" },
      { key: "Tassengrößen", value: "5 Größen" },
      { key: "Wasserkapazität", value: "1,5 Liter" },
      { key: "Leistung", value: "1600 Watt" },
      { key: "Kapseln", value: "Nespresso Vertuo" },
      { key: "Abmessungen", value: "14 x 32 x 30 cm" },
      { key: "Garantie", value: "2 Jahre" },
    ]
  },
  {
    name: "Melitta Purista Aromatica Pure Black", slug: "melitta-purista-pure-black",
    description: "Die Melitta Purista Aromatica Pure Black ist ein minimalistischer Filterkaffeevollautomat. Das 3-stufige Mahlwerk bietet individuelle Einstellungen für milden, mittleren oder starken Kaffee. Die Aroma-Funktion past die Brühmenge an die gewünschte Intensität an. Die Large-Carafe-Kanne fasst bis zu 10 Tassen Filterkaffee. Der separate Heißwasserausgang eignet sich für Tee. Die Purista ist besonders kompakt und passt selbst in die kleinste Küche. Die abnehmbare Kaffeebehälter-Auslauf ist leicht zu reinigen. Die Energy-Saving-Funktion reduziert den Stromverbrauch. Perfekt für alle, die reinen Filterkaffee ohne Schnick-Schnack schätzen.", shortDesc: "Minimalistischer Filterkaffeevollautomat mit 3 Intensitätsstufen",
    price: 249, sku: "MEL-PURISTA",
    rating: 4.6, reviewCount: 445, categorySlug: "kaffee", brandSlug: "melitta",
    specs: [
      { key: "Mahlwerk", value: "3-stufig" },
      { key: "Kaffeeart", value: "Filterkaffee" },
      { key: "Kannenkapazität", value: "10 Tassen / 1,25 Liter" },
      { key: "Wasserkapazität", value: "1,0 Liter" },
      { key: "Bohnenbehälter", value: "200 g" },
      { key: "Leistung", value: "1450 Watt" },
      { key: "Heißwasserausgang", value: "Ja" },
      { key: "Garantie", value: "2 Jahre" },
    ]
  },
  {
    name: "Breville Barista Express Impress", slug: "breville-barista-express-impress",
    description: "Die Breville Barista Express Impress ist die weiterentwickelte Version der beliebten Barista Express. Das innovative Impression Dosing System misst die Bohnenmenge automatisch und füllt die Brühgruppe präzise. Der integrierte Kegelmahlwerk aus Edelstahl bietet 25 Mahlgradeinstellungen für individuelle Brühresultate. Der intelligente Tamper-Erkennungsmechanismus sorgt für gleichmäßigen Stamper-Druck. Der Crona-Milchaufschäumer erzeugt perfekten Mikroschaum für Latte Art. Die LED-Anzeige zeigt Brühzeit, Temperatur und Mahlgrad an. Die Maschine ist kompakt genug für jede Küchenzeile und bietet dennoch professionelle Features. Perfekt für Einsteiger, die eine baristataugliche Maschine suchen.", shortDesc: "Halbautomat mit Impression Dosing und automatischer Bohnenportionierung",
    price: 699, sku: "BREV-BEI",
    rating: 4.7, reviewCount: 156, categorySlug: "kaffee", brandSlug: "breville", weight: 11.5,
    specs: [
      { key: "Brühgruppe", value: "58mm Edelstahl" },
      { key: "Mahlwerk", value: "Kegelmahlwerk Edelstahl" },
      { key: "Mahlgrade", value: "25 Stufen" },
      { key: "Wasserkapazität", value: "2,5 Liter" },
      { key: "Bohnenbehälter", value: "120 g" },
      { key: "Leistung", value: "1400 Watt" },
      { key: "Abmessungen", value: "30 x 30 x 35 cm" },
      { key: "Garantie", value: "3 Jahre" },
    ]
  },
  {
    name: "Dyson V15 Detect Absolute", slug: "dyson-v15-detect-absolute",
    description: "Der Dyson V15 Detect Absolute ist ein leistungsstarker kabelloser Akkusauger mit Laser-Erkennung. Die Laser-Technologie macht unsichtbaren Staub auf harten Böden sichtbar. Die Piezo-Sensorik erkennt die Staubmenge und passt die Leistung automatisch an. Die 60 Minuten Laufzeit reicht für gründliche Reinigungen. Die hygienische Entleerung erfordert keinen Kontakt mit Staub. Die multiple Ausstattung bietet Werkzeuge für jeden Einsatzzweck. Das LCD-Display zeigt Echtzeitdaten über die Reinigung. Perfekt für alle, die hohe Leistung und Komfort suchen.", shortDesc: "Leistungsstarker Dyson-Akkusauger mit Laser und Piezo-Sensorik",
    price: 749, sku: "DY-V15-ABS", isFeatured: true, isNew: true,
    rating: 4.7, reviewCount: 89, categorySlug: "reinigung", brandSlug: "dyson", weight: 3.1, tags: ["bestseller"],
    specs: [
      { key: "Leistung", value: "230 AW" },
      { key: "Motor", value: "Dyson Hyperdymium" },
      { key: "Laufzeit", value: "Bis zu 60 Minuten" },
      { key: "Filter", value: "HEPA (99,99%)" },
      { key: "Gewicht", value: "3,1 kg" },
      { key: "Farbe", value: "Gold/Nickel" },
    ]
  },
  {
    name: "Dyson Gen5detect Absolute", slug: "dyson-gen5detect-absolute",
    description: "Der Dyson Gen5 Detect Absolute ist der leistungsstärkste kabellose Akkusauger von Dyson. Die 125.000 min-1 Dyson Hyperdymium-Motor erzeugt 230 AW Saugleistung. Die Laser-Erkennung macht unsichtbaren Staub auf harten Böden sichtbar. Die Piezo-Sensorik erkennt die Staubmenge und passt die Leistung automatisch an. Die 60 Minuten Laufzeit reicht für große Reinigungen. Die HEPA-Filterung fängt 99,99% der Allergene ab. Das LCD-Display zeigt Echtzeitdaten über die Reinigung. Das absolute Flaggschiff für makellose Sauberkeit.", shortDesc: "Leistungsstärkster Dyson-Akkusauger mit Laser-Erkennung und 230 AW",
    price: 949, sku: "DY-GEN5-ABS",
    rating: 4.8, reviewCount: 45, categorySlug: "reinigung", brandSlug: "dyson", weight: 3.5,
    specs: [
      { key: "Leistung", value: "230 AW" },
      { key: "Motor", value: "Dyson Hyperdymium 125.000 min-1" },
      { key: "Laufzeit", value: "Bis zu 60 Minuten" },
      { key: "Filter", value: "HEPA (99,99%)" },
      { key: "Gewicht", value: "3,5 kg" },
      { key: "Farbe", value: "Gelb/Nickel" },
    ]
  },
  {
    name: "Dyson Big Ball Animal Pro", slug: "dyson-big-ball-animal-pro",
    description: "Der Dyson Big Ball Animal Pro ist ein zyklonloser Staubsauger für Tierhaarbesitzer. Die Dyson-Zyklontechnologie erzeugt 79.000 G zur Trennung von Staub und Luft. Die Self-Righting-Technologie richtet den Sauger automatisch auf, wenn er umfällt. Die Animal Pro Bürste entfernt Tierhaare gründlich von allen Böden. Die hygienische Entleerung erfordert keinen Kontakt mit Staub. Die 2 Tierklassen-Filter fangen 99,97% der Allergene ab. Das kugelförmige Design ermöglicht müheloses Manövrieren. Perfekt für Haushalte mit Haustieren.", shortDesc: "Kabelloser Staubsauger mit Self-Righting und Tierhaar-Bürste",
    price: 549, sku: "DY-BBAP",
    rating: 4.5, reviewCount: 187, categorySlug: "reinigung", brandSlug: "dyson", weight: 7.2,
    specs: [
      { key: "Technologie", value: "Dyson-Zyklon" },
      { key: "Leistung", value: "79.000 G" },
      { key: "Filter", value: "2 Tierklassen-Filter" },
      { key: "Gewicht", value: "3,2 kg" },
      { key: "Volumen", value: "0,76 Liter" },
      { key: "Farbe", value: "Nickel/Rot" },
    ]
  },
  {
    name: "Kärcher SC 4 EasyFix Premium", slug: "kaercher-sc4-easyfix-premium",
    description: "Der Kärcher SC4 EasyFix Premium ist ein dampfreiniger für gründliche Reinigung ohne Chemikalien. Die EasyFix-Wischvorrichtung ermöglicht das Reinigen großer Flächen. Die 2000 Watt Heizung erzeugt permanenten Dampf für kontinuierliche Reinigung. Die verschiedenen Düsen bieten Werkzeuge für jeden Einsatzzweck. Die abnehmbare 0,5-Liter-Wassertanks erlauben kurze Pausen zum Nachfüllen. Die Kindersicherung verhindert unbeabsichtigtes Einschalten. Die kompakte Bauform lässt sich platzsparend aufbewahren. Perfekt für chemiefreie Reinigung von Böden, Fliesen und Gläsern.", shortDesc: "Dampfreiniger mit EasyFix und 2000W für chemiefreie Reinigung",
    price: 229, sku: "KA-SC4-EFP",
    rating: 4.7, reviewCount: 567, categorySlug: "reinigung", brandSlug: "kaercher", weight: 6,
    specs: [
      { key: "Leistung", value: "2000 Watt" },
      { key: "Dampfdruck", value: "3,5 bar" },
      { key: "Wassertank", value: "0,5 Liter (entnehmbar)" },
      { key: "Aufheizzeit", value: "4 Minuten" },
      { key: "Gewicht", value: "4,3 kg" },
      { key: "Farbe", value: "Gelb/Schwarz" },
    ]
  },
  {
    name: "Dyson Purifier Big Quiet Formaldehyde", slug: "dyson-purifier-big-quiet",
    description: "Der Dyson Purifier Big Quiet ist ein leiser Luftreiniger für große Räume. Die HEPA-Filterung entfernt 99,97% der Partikel ab 0,3 Mikrometer. Die Air Multiplier-Technologie verteilt die gereinigte Luft gleichmäßig im Raum. Die App-Steuerung ermöglicht die Fernbedienung. Die automatische Luftqualitätsmessung passt die Einstellungen an. Die 350°-Oszillation sorgt für gleichmäßige Luftverteilung. Die Big Quiet-Technologie arbeitet besonders leise. Perfekt für große Räume mit minimalem Geräuschpegel.", shortDesc: "Leiser Dyson-Purifier für große Räume mit minimaler Lautstärke",
    price: 899, sku: "DY-PUR-BQF", isFeatured: true,
    rating: 4.7, reviewCount: 67, categorySlug: "klima", brandSlug: "dyson", weight: 8.5, tags: ["bestseller"],
    specs: [
      { key: "Filter", value: "HEPA (99,97%)" },
      { key: "Funktionen", value: "Luftreinigung + Ventilator" },
      { key: "Oszillation", value: "350°" },
      { key: "Raumgröße", value: "Bis zu 30 m²" },
      { key: "Lautstärke", value: "25-55 dB(A)" },
      { key: "Farbe", value: "Nickel/Gold" },
    ]
  },
  {
    name: "Dyson Pure Cool TP09", slug: "dyson-pure-cool-tp09",
    description: "Der Dyson Pure Cool TP09 ist ein purifier mit Luftreinigung und ventilator in einem. Die HEPA-Filterung entfernt 99,97% der Partikel ab 0,3 Mikrometer. Die Air Multiplier-Technologie verteilt die gereinigte Luft gleichmäßig im Raum. Die App-Steuerung ermöglicht die Fernbedienung. Die automatische Luftqualitätsmessung passt die Einstellungen an. Die 350°-Oszillation sorgt für gleichmäßige Luftverteilung. Die Halo-Filter-Form bietet erweiterte Abdeckung. Perfekt für saubere und kühlende Luft.", shortDesc: "Dyson-Purifier mit Halo-Filter und Luftreinigung",
    price: 499, originalPrice: 549, sku: "DY-TP09", isPromo: true,
    rating: 4.6, reviewCount: 123, categorySlug: "klima", brandSlug: "dyson",
    specs: [
      { key: "Filter", value: "HEPA (99,97%)" },
      { key: "Funktionen", value: "Luftreinigung + Ventilator" },
      { key: "Oszillation", value: "350°" },
      { key: "Raumgröße", value: "Bis zu 20 m²" },
      { key: "Lautstärke", value: "28-59 dB(A)" },
      { key: "Farbe", value: "Weiß/Bronze" },
    ]
  },
  {
    name: "Stadler Form Oskar Big", slug: "stadler-form-oskar-big",
    description: "Der Stadler Form Oskar Big ist ein großer Luftbefeuchter für große Räume. Die Verdunstungstechnologie sorgt für natürliche Luftbefeuchtung. Die 2 Befeuchtungsstufen bieten individuelle Einstellungen. Die Tankkapazität von 6 Litern ermöglicht langen Betrieb ohne Nachfüllen. Die Auto-Shutoff-Funktion schaltet das Gerät bei leerem Tank ab. Die LED-Beleuchtung zeigt den Betriebsstatus. Das elegante Design passt in jede Raumgestaltung. Perfekt für große Wohnungen und Büros.", shortDesc: "Großer Luftbefeuchter mit 6L Tank für große Räume",
    price: 189, sku: "SF-OSKAR-BIG",
    rating: 4.4, reviewCount: 234, categorySlug: "klima", brandSlug: "stadler-form",
    specs: [
      { key: "Befeuchtungsprinzip", value: "Verdunstung" },
      { key: "Tankkapazität", value: "6 Liter" },
      { key: "Raumgröße", value: "Bis zu 40 m²" },
      { key: "Lautstärke", value: "28-36 dB(A)" },
      { key: "Leistung", value: "12-20 Watt" },
      { key: "Farbe", value: "Weiß" },
    ]
  },
  {
    name: "tado° Smart Thermostat Starter Kit V3+", slug: "tado-smart-thermostat-v3plus",
    description: "Der Tado Smart Thermostat V3+ ist ein intelligentes Thermostat für die Heizungssteuerung. Die App-Steuerung ermöglicht die Fernbedienung von überall. Die Geofencing-Technologie passt die Temperatur an Ihren Standort an. Die Kompatibilität mit Alexa, Google Home und HomeKit bietet maximale Konnektivität. Die einfache Installation an vorhandenen Heizungen erfordert keine Fachkenntnisse. Die intelligente Steuerung mit Timern ermöglicht automatische Anpassungen. Die Luftqualitätsmessung informiert über die Raumluft. Sparen Sie bis zu 28% Heizkosten mit intelligenter Steuerung.", shortDesc: "Intelligentes Thermostat mit Geofencing und App-Steuerung",
    price: 149, originalPrice: 199, sku: "TADO-V3PLUS-SK", isFeatured: true, isPromo: true,
    rating: 4.6, reviewCount: 1234, categorySlug: "smart-home", brandSlug: "tado", tags: ["bestseller"],
    specs: [
      { key: "Steuerung", value: "App, Sprache (Alexa, Google, HomeKit)" },
      { key: "Funktionen", value: "Geofencing, Timer, Luftqualität" },
      { key: "Kompatibilität", value: "Alle Heizungstypen" },
      { key: "Energieeinsparung", value: "Bis zu 28%" },
      { key: "Abmessungen", value: "10 x 10 x 2,4 cm" },
      { key: "Farbe", value: "Weiß" },
    ]
  },
  {
    name: "Miele G7966 SCVi AutoDos", slug: "miele-g7966-scvi-autodos",
    description: "Die Miele G7966 SCVi AutoDos ist das absolute Flaggschiff unter den Miele-Geschirrspülern. Die AutoDos-Funktion dosiert Spülmittel automatisch präzise. Die Dosierhilfe mischt Spülmittel mit Wasser. Die 16 Gedecke Kapazität eignet sich für sehr große Haushalte. Die 12 Programme und 6 Zusatzfunktionen bieten maximale Flexibilität. Die A+++ Energiesiegel sorgt für Energieeffizienz. Die AutoOpen-Trocknung öffnet die Tür automatisch am Ende. Das absolute Premium-Modell für maximale Ansprüche.", shortDesc: "Miele-Flaggschiff mit AutoDos, 16 Gedecken und 12 Programmen",
    price: 1699, sku: "MIELE-G7966", isFeatured: true,
    rating: 4.9, reviewCount: 89, categorySlug: "haushaltsgeraete", brandSlug: "miele", weight: 38, tags: ["bestseller"],
    specs: [
      { key: "Kapazität", value: "16 Gedecke" },
      { key: "Energieklasse", value: "A+++" },
      { key: "Programme", value: "12 + 6 Zusatzfunktionen" },
      { key: "Dosierung", value: "AutoDos + Dosierhilfe" },
      { key: "Abmessungen", value: "60 x 82 x 55 cm" },
    ]
  },
  {
    name: "tado° Smart AC Control V3+", slug: "tado-smart-ac-control-v3plus",
    description: "Die Tado Smart AC Control V3+ ist ein smarter WLAN-Controller für Klimaanlagen. Die App-Steuerung ermöglicht die Fernbedienung von überall. Die Geofencing-Technologie passt die Temperatur an Ihren Standort an. Die Kompatibilität mit Alexa, Google Home und HomeKit bietet maximale Konnektivität. Die einfache Installation erfordert keine Fachkenntnisse. Die Energieberichtsfunktion zeigt den Stromverbrauch an. Die Luftqualitätsmessung informiert über die Raumluft. Die intelligente Steuerung mit Timern ermöglicht automatische Anpassungen. Perfekt für die intelligente Steuerung Ihrer Klimaanlage.", shortDesc: "Smarter WLAN-Controller für Klimaanlagen mit Geofencing",
    price: 99, sku: "TADO-ACV3",
    rating: 4.5, reviewCount: 567, categorySlug: "smart-home", brandSlug: "tado",
    specs: [
      { key: "Steuerung", value: "App, Sprache (Alexa, Google, HomeKit)" },
      { key: "Konnektivität", value: "WLAN, Infrarot" },
      { key: "Funktionen", value: "Geofencing, Timer, Energiebericht" },
      { key: "Kompatibilität", value: "Die meisten Klimaanlagen" },
      { key: "Abmessungen", value: "10 x 10 x 2,4 cm" },
      { key: "Farbe", value: "Weiß" },
    ]
  },
  {
    name: "Philips Hue Starter Kit E27", slug: "philips-hue-starter-kit-e27",
    description: "Das Philips Hue Starter Kit E27 ist der perfekte Einstieg in die smarte Beleuchtung. Die Hue Bridge und 2 E27-LED-Lampen bieten alles für den Anfang. Die dimmbare Lichtstärke (100-2200 Lumen) passt jede Stimmung. Die Farbtemperatur (2200-6500K) reicht von warmweiß bis tageslichtweiß. Die Fernbedienung über App oder Sprachsteuerung (Alexa, Google, HomeKit) bietet Komfort. Die einfache Installation in vorhandene Leuchtmittel-Fassungen erfordert keine Fachkenntnisse. Die Hue Bridge steuert bis zu 50 Geräte. Der ideale Einstieg in die smarte Beleuchtung.", shortDesc: "Hue-Starter-Kit mit Bridge und 2 E27-LED-Lampen",
    price: 149, originalPrice: 179, sku: "PH-HUE-SK-E27",
    rating: 4.7, reviewCount: 2345, categorySlug: "smart-home", brandSlug: "philips",
    specs: [
      { key: "Protokoll", value: "Zigbee (via Hue Bridge)" },
      { key: "Lichtstrom", value: "100-2200 Lumen" },
      { key: "Farbtemperatur", value: "2200-6500K" },
      { key: "Leistung", value: "8,06 Watt pro Lampe" },
      { key: "Lebensdauer", value: "25.000 Stunden" },
      { key: "Fassung", value: "E27" },
    ]
  },
  {
    name: "Nanoleaf Shapes Hexagons Starter Kit", slug: "nanoleaf-shapes-hexagons",
    description: "Die Nanoleaf Shapes Hexagons sind modulare LED-Wandpaneale mit abgerundeten Kanten. Die 16 Millionen Farben und diverse White-Shades bieten endlose Möglichkeiten. Die Touch-Integration ermöglicht interaktive Lichtszenen. Die Music-Sync-Funktion reagiert auf Musik und erstellt dynamische Lichtshows. Die einfache Installation mit 3M-Klebepads erfordert keine professionelle Montage. Die Kompatibilität mit HomeKit, Google Home und Alexa bietet maximale Konnektivität. Die erweiterten Panels bieten mehr Gestaltungsspielraum. Perfekt für kreative Wandgestaltung und stimmungsvolles Licht.", shortDesc: "Modulare Hexagon-LED-Paneale mit Touch- und Music-Sync",
    price: 199, sku: "NANO-SH-HEX",
    rating: 4.4, reviewCount: 345, categorySlug: "smart-home", brandSlug: "nanoleaf",
    specs: [
      { key: "Farben", value: "16 Millionen + White-Shades" },
      { key: "Panels", value: "7 pro Starter Kit" },
      { key: "Lichtstrom", value: "140 Lumen pro Panel" },
      { key: "Leistung", value: "9 Watt pro Panel" },
      { key: "Lebensdauer", value: "25.000 Stunden" },
      { key: "Konnektivität", value: "Wi-Fi, Bluetooth" },
    ]
  },
  {
    name: "Ring Video Doorbell 4", slug: "ring-video-doorbell-4",
    description: "Die Ring Video Doorbell 4 ist eine smarte Videoklingel mit 1080p-HD-Kamera. Die Nachtsichtfunktion sorgt auch bei Dunkelheit für gute Bilder. Die Zweistufige-Sprachfunktion ermöglicht die Kommunikation mit Besuchern. Die Pre-Roll-Videos zeigen die Sekunden vor dem Bewegungsereignis. Die automatische Benachrichtigung bei Bewegungserkennung informiert Sie sofort. Die einfache Installation an vorhandenen Klingeldrähten oder kabellos erfordert keine Fachkenntnisse. Die Ring-App ermöglicht die Fernbedienung von überall. Perfekt für die Überwachung Ihres Eingangsbereichs.", shortDesc: "Smarte Videoklingel mit 1080p HD und Pre-Roll-Videos",
    price: 199, sku: "RING-VDB4",
    rating: 4.5, reviewCount: 1234, categorySlug: "smart-home", brandSlug: "ring",
    specs: [
      { key: "Kamera", value: "1080p HD" },
      { key: "Nachtsicht", value: "Ja, Infrarot" },
      { key: "Sprachfunktion", value: "Zweistiguous" },
      { key: "Speicherung", value: "Ring Protect (Abonnement)" },
      { key: "Installation", value: "Kabellos oder verkabelt" },
    ]
  },
  {
    name: "Liebherr Premium Comfort Kgn 36vi3", slug: "liebherr-premium-comfort-kgn36vi3",
    description: "Der Liebherr Premium Comfort KGN36Vi3 ist ein Premium-Kühlschrank-Gefrierkombination mit BioFresh- und NoFrost-Technologie. Die BioFresh-Technologie hält Lebensmittel besonders frisch. Die NoFrost-Technologie verhindert automatisch Eisbildung. Die 348 Liter Volumen bietet ausreichend Platz. Die LED-Beleuchtung sorgt für optimale Sicht. Die SoftMotion-Dämpfer ermöglichen sanftes Öffnen. Das Premium-Design passt in jede moderne Küche. Das absolute Flaggschiff für Kühlung.", shortDesc: "Premium-Liebherr-Kombination mit BioFresh, NoFrost und 348L",
    price: 1499, sku: "LB-KGN36VI3",
    rating: 4.8, reviewCount: 134, categorySlug: "haushaltsgeraete", brandSlug: "liebherr", weight: 93,
    specs: [
      { key: "Volumen", value: "348 Liter" },
      { key: "Kühltechnologie", value: "BioFresh + NoFrost" },
      { key: "Kühlschrank", value: "253 Liter" },
      { key: "Gefrierfach", value: "95 Liter" },
      { key: "Abmessungen", value: "60 x 185 x 65 cm" },
    ]
  },
  {
    name: "Miele W1 Waschmaschine WCI870 WCS", slug: "miele-w1-waschmaschine-wci870",
    description: "Die Miele W1 Waschmaschine WCI870 ist eine Premium-Waschmaschine mit TwinDos-Technologie. Die TwinDos-Technologie dosiert Waschmittel automatisch präzise. Die 8 kg Kapazität eignet sich für mittlere Haushalte. Die 1600 U/min Schleuderung sorgt für optimale Ergebnisse. Das A+++ Energiesiegel sorgt für Energieeffizienz. Die PowerWash-Funktion erhöht die Waschkraft. Die 20 Programme bieten individuelle Einstellungen. Das Premium-Modell für anspruchsvolles Waschen.", shortDesc: "Miele-Premium-Waschmaschine mit TwinDos und 8 kg Kapazität",
    price: 1899, sku: "MIELE-WCI870", isFeatured: true,
    rating: 4.9, reviewCount: 203, categorySlug: "haushaltsgeraete", brandSlug: "miele", weight: 87, tags: ["bestseller"],
    specs: [
      { key: "Kapazität", value: "8 kg" },
      { key: "Schleuderdrehzahl", value: "1600 U/min" },
      { key: "Energieklasse", value: "A+++" },
      { key: "Dosierung", value: "TwinDos" },
      { key: "Programme", value: "20" },
      { key: "Abmessungen", value: "60 x 85 x 60 cm" },
    ]
  },
  {
    name: "Liebherr Mono Sgne5226", slug: "liebherr-mono-sgne5226",
    description: "Der Liebherr Mono SGNe5226 ist ein freistehender Kühlschrank-Gefrierkombination mit SmartDevice-Technologie. Die SmartDevice-Technologie ermöglicht die Fernbedienung per Smartphone. Die BioFresh-Technologie hält Lebensmittel besonders frisch. Die 388 Liter Volumen bietet ausreichend Platz. Die LED-Beleuchtung sorgt für optimale Sicht. Die NoFrost-Technologie verhindert automatisch Eisbildung. Das elegante Design passt in jede Küche. Perfekt für vernetzte Kühlung.", shortDesc: "Liebherr-Kombination mit SmartDevice, BioFresh und 388L",
    price: 2840, sku: "LIEBHERRMONOSGN", isFeatured: true,
    rating: 4.4, reviewCount: 62, categorySlug: "haushaltsgeraete", brandSlug: "liebherr",
    specs: [
      { key: "Volumen", value: "388 Liter" },
      { key: "Kühltechnologie", value: "BioFresh + NoFrost" },
      { key: "Steuerung", value: "SmartDevice App" },
      { key: "Energieklasse", value: "A++" },
      { key: "Abmessungen", value: "60 x 185 x 65 cm" },
    ]
  },
  {
    name: "Miele T1 Trommeltrockner TRK845 WP", slug: "miele-t1-trockner-trk845",
    description: "Der Miele T1 Trockner TRK845 ist ein Kondensations-Trockner mit Sensor-Steuerung. Die Sensor-Steuerung erkennt den Trocknungsgrad und stoppt automatisch. Die 9 kg Kapazität eignet sich für mittlere bis große Haushalte. Das B Energiesiegel sorgt für moderaten Stromverbrauch. Die 12 Programme bieten individuelle Einstellungen. Das elegante Design passt in jede Küche. Perfekt für alle, die einen Kondensations-Trockner bevorzugen.", shortDesc: "Miele-Kondensations-Trockner mit Sensor-Steuerung und 9 kg",
    price: 1699, sku: "MIELE-TRK845",
    rating: 4.8, reviewCount: 156, categorySlug: "haushaltsgeraete", brandSlug: "miele", weight: 62,
    specs: [
      { key: "Kapazität", value: "9 kg" },
      { key: "Trocknungsart", value: "Kondensation" },
      { key: "Energieklasse", value: "B" },
      { key: "Programme", value: "12" },
      { key: "Abmessungen", value: "60 x 85 x 65 cm" },
    ]
  },
  {
    name: "Samsung Family Hub Bespoke RB38B7735S9", slug: "samsung-family-hub-bespoke-rb38b7735s9",
    description: "Der Samsung Family Hub Bespoke RB38B7735S9 ist ein Premium-Kühlschrank mit Family-Hub-Technologie. Die Family-Hub-Technologie macht den Kühlschrank zum digitalen Herzstück. Die Twin Cooling Plus-Technologie hält Lebensmittel besonders frisch. Die 385 Liter Volumen bietet ausreichend Platz. Die interne Kamera zeigt den Inhalt des Kühlschranks auf dem Smartphone. Das Bespoke-Design in verschiedenen Farben passt zu jeder Kücheneinrichtung. Perfekt für vernetzte Küchen.", shortDesc: "Samsung-Premium-Kühlschrank mit Family Hub und Bespoke-Design",
    price: 2499, sku: "SAM-FH-RB38B", isNew: true,
    rating: 4.6, reviewCount: 67, categorySlug: "haushaltsgeraete", brandSlug: "samsung", weight: 115,
    specs: [
      { key: "Volumen", value: "385 Liter" },
      { key: "Kühltechnologie", value: "Twin Cooling Plus" },
      { key: "Design", value: "Bespoke" },
      { key: "Steuerung", value: "Family Hub Display" },
      { key: "Abmessungen", value: "60 x 185 x 65 cm" },
    ]
  },
  {
    name: "Bosch Serie 6 Waschmaschine WGG244Z00", slug: "bosch-serie-6-wgg244z00",
    description: "Die Bosch Serie 6 WGG244Z00 ist eine freistehende Waschmaschine mit i-DOS-Technologie. Die i-DOS-Technologie dosiert Waschmittel automatisch präzise. Die 9 kg Kapazität eignet sich für mittlere bis große Haushalte. Die 1400 U/min Schleuderung sorgt für optimale Ergebnisse. Die A+++ Energiesiegel sorgt für Energieeffizienz. Die IronAssist-Funktion glättet Wäsche automatisch. Die Home-Connect-App ermöglicht die Fernbedienung. Perfekt für automatisches Waschen.", shortDesc: "Waschmaschine mit i-DOS-Automatikdosierung und 9 kg Kapazität",
    price: 899, sku: "BSH-WGG244Z00",
    rating: 4.7, reviewCount: 312, categorySlug: "haushaltsgeraete", brandSlug: "bosch", weight: 74,
    specs: [
      { key: "Kapazität", value: "9 kg" },
      { key: "Schleuderdrehzahl", value: "1400 U/min" },
      { key: "Energieklasse", value: "A+++" },
      { key: "Dosierung", value: "i-DOS automatisch" },
      { key: "Programme", value: "14" },
      { key: "Abmessungen", value: "60 x 85 x 60 cm" },
    ]
  },
  {
    name: "Samsung EcoBubble WW90TP04DSH", slug: "samsung-ecobubble-ww90tp04dsh",
    description: "Die Samsung EcoBubble WW90TP04DSH ist die neueste EcoBubble-Waschmaschine von Samsung. Die EcoBubble-Technologie verwandelt Waschmittel in Blasen für gründliches Waschen. Die 9 kg Kapazität eignet sich für mittlere bis große Haushalte. Die 1400 U/min Schleuderung sorgt für optimale Ergebnisse. Das A+++ Energiesiegel sorgt für Energieeffizienz. Die AI-Wash-Funktion passt Waschparameter automatisch an. Die Smart-Things-App ermöglicht die Fernbedienung. Die neueste Generation für sanftes Waschen.", shortDesc: "Neueste Samsung-EcoBubble-Waschmaschine mit AI-Wash",
    price: 699, originalPrice: 799, sku: "SAM-WW90TP", isPromo: true,
    rating: 4.6, reviewCount: 567, categorySlug: "haushaltsgeraete", brandSlug: "samsung", weight: 65,
    specs: [
      { key: "Kapazität", value: "9 kg" },
      { key: "Schleuderdrehzahl", value: "1400 U/min" },
      { key: "Energieklasse", value: "A+++" },
      { key: "Technologie", value: "EcoBubble + AI" },
      { key: "Programme", value: "15" },
      { key: "Abmessungen", value: "60 x 85 x 60 cm" },
    ]
  },
  {
    name: "KitchenAid Artisan Mini 5ksm33", slug: "kitchenaid-artisan-mini-5ksm33",
    description: "Die KitchenAid Artisan Mini 5KSM33 ist die kompakte Variante der ikonischen KitchenAid-Küchenmaschine. Das planetarische Mischsystem sorgt für gleichmäßige Ergebnisse. Die 10 Geschwindigkeitsstufen und der Pulsbetrieb ermöglichen individuelle Einstellungen. Die mitgelieferten Aufätze – Knethaken, Schneebesen – bieten maximale Vielseitigkeit. Der abnehmbare 3,3-Liter-Rüssel ist spülmaschinenfeste. Das kompakte Design passt in jede Küche. Das elegante Design in verschiedenen Farben passt zu jeder Kücheneinrichtung. Perfekt für kleine Küchen.", shortDesc: "Kompakte KitchenAid-Küchenmaschine mit 3,3L-Rüssel",
    price: 770, sku: "KITCHENAIDAR2",
    rating: 4.3, reviewCount: 260, categorySlug: "kueche", brandSlug: "kitchenaid",
    specs: [
      { key: "Leistung", value: "250 Watt" },
      { key: "Rüsselvolumen", value: "3,3 Liter" },
      { key: "Geschwindigkeiten", value: "10 + Puls" },
      { key: "Mischsystem", value: "Planetarisch" },
      { key: "Aufätze", value: "Knethaken, Schneebesen" },
      { key: "Farbe", value: "Verschiedene Farben" },
    ]
  },
  {
    name: "Vorwerk Thermomix Tm5", slug: "vorwerk-thermomix-tm5",
    description: "Der Vorwerk Thermomix TM5 ist ein multifunktionaler Küchenhelfer mit über 12 Funktionen. Die intuitive Touch-Steuerung ermöglicht einfache Bedienung. Die integrierte Waage erlaubt präzise Zutatenabmessung. Die Heizfunktion bis 120°C ermögliches Kochen und Braten. Die Messerklinge aus Edelstahl mahlt, mixt und püriert. Die guided-Cooking-Funktion führt Schritt für Schritt durch Rezepte. Die Varoma-Dämpfer erweitert die Möglichkeiten. Die premium-Veredelung unterstreicht den Qualitätsanspruch. Ein bewährter Helfer für moderne Küchen.", shortDesc: "Bewährter Multifunktionaler Küchenhelfer mit 12+ Funktionen",
    price: 728.19, originalPrice: 899, sku: "VORWERKTHERMOMI",
    rating: 4, reviewCount: 237, categorySlug: "kueche", brandSlug: "vorwerk",
    specs: [
      { key: "Funktionen", value: "12+ Funktionen" },
      { key: "Leistung", value: "1500 Watt" },
      { key: "Temperaturbereich", value: "37-120°C" },
      { key: "Geschwindigkeit", value: "40-10.700 U/min" },
      { key: "Kapazität", value: "2,2 Liter" },
      { key: "Gewicht", value: "7,95 kg" },
      { key: "Farbe", value: "Weiß" },
    ]
  },
  {
    name: "Sage The Bakery Boss", slug: "sage-the-bakery-boss",
    description: "Die Sage The Bakery Boss ist ein Premium-Handmixer für anspruchsvolle Bäcker. Die 600 Watt Leistung und 8 Geschwindigkeitsstufen ermöglichen individuelle Einstellungen. Die integrierte Waage erlaubt präzise Zutatenabmessung. Die mitgelieferten Edelstahl-Aufätze – 2 Knethaken und 2 Schneebesen – sind spülmaschinenfest. Die Soft-Start-Funktion verhindert Spritzer beim Einschalten. Das elegante Design in Bürstmetall passt zu jeder Kücheneinrichtung. Ein Premium-Handmixer für anspruchsvolle Bäcker.", shortDesc: "Premium-Handmixer mit integrierter Waage und 600W",
    price: 1730, sku: "SAGETHEBAKERYBO",
    rating: 4.4, reviewCount: 65, categorySlug: "kueche", brandSlug: "sage",
    specs: [
      { key: "Leistung", value: "600 Watt" },
      { key: "Geschwindigkeiten", value: "8 Stufen" },
      { key: "Funktion", value: "Integrierte Waage" },
      { key: "Aufsätze", value: "2 Knethaken, 2 Schneebesen" },
      { key: "Farbe", value: "Bürstmetall" },
    ]
  },
  {
    name: "Ninja Foodi Multi Cooker Nc300", slug: "ninja-foodi-multi-cooker-nc300",
    description: "Die Ninja Foodi Multi-Cooker NC300 ist ein multifunktionaler Kochtopf mit 8 Funktionen. Die 8 Funktionen – Kochen, Dünsten, Braten, Sous-Vide, Slow-Cook, Dämpfen, Braten, Aufwärmen – bieten maximale Versatilität. Die 6-Liter-Kapazität fügt große Portionen. Die schnelle Erhitzung spart Zeit und Energie. Die abnehmbaren Teile sind spülmaschinenfest. Die integrierte Timer-Funktion ermöglicht automatisches Kochen. Das elegante Design in Schwarz passt zu jeder Kücheneinrichtung. Perfekt für alle, die vielseitig und gesund kochen wollen.", shortDesc: "Multifunktionaler Kochtopf mit 8 Funktionen und 6L-Kapazität",
    price: 1580, originalPrice: 1817, sku: "NINJAFOODIMULTI", isPromo: true,
    rating: 4.3, reviewCount: 226, categorySlug: "kueche", brandSlug: "ninja",
    specs: [
      { key: "Kapazität", value: "6 Liter" },
      { key: "Funktionen", value: "8 Funktionen inkl. Sous-Vide" },
      { key: "Leistung", value: "1400 Watt" },
      { key: "Temperaturbereich", value: "40-175°C" },
      { key: "Gewicht", value: "5,8 kg" },
      { key: "Farbe", value: "Schwarz" },
    ]
  },
  {
    name: "WMF Kitchenminis Handmixer", slug: "wmf-kitchenminis-handmixer",
    description: "Der WMF KitchenMinis Handmixer ist ein kompakter Handmixer für kleine Portionen. Die 400 Watt Leistung und 5 Geschwindigkeitsstufen ermöglichen individuelle Einstellungen. Die mitgelieferten Edelstahl-Aufätze – 2 Knethaken und 2 Schneebesen – bieten maximale Vielseitigkeit. Der Turbo-Boost sorgt für maximale Leistung. Das kompakte Design von nur 15 cm Breite passt in jede Küche. Das elegante Cromargan®-Design passt zu jeder Kücheneinrichtung. Perfekt für Singles oder kleine Haushalte.", shortDesc: "Kompakter Handmixer mit 400W und Cromargan®-Design",
    price: 1080, sku: "WMFKITCHENMI2",
    rating: 4.7, reviewCount: 276, categorySlug: "kueche", brandSlug: "wmf",
    specs: [
      { key: "Leistung", value: "400 Watt" },
      { key: "Geschwindigkeiten", value: "5 Stufen" },
      { key: "Aufsätze", value: "2 Knethaken, 2 Schneebesen" },
      { key: "Material", value: "Cromargan® Edelstahl" },
      { key: "Farbe", value: "Edelstahl" },
    ]
  },
  {
    name: "Tefal Jamie Oliver Cook Smart", slug: "tefal-jamie-oliver-cook-smart",
    description: "Der Tefal Jamie Oliver Cook Smart ist eine Kochtopf-Serie für anspruchsvolles Kochen. Die 3-teilige Serie umfasst einen Kasserole, einen Bräter und eine Pfanne. Die harte Anodise-Gehäuse sorgt für gleichmäßige Wärmeverteilung. Die induktionsgeeignete Basis funktioniert auf allen Herdtypen. Die ergonomischen Griffe sorgen für sicheren Halt. Die spülmaschinenfeste Pflege erleichtert die Reinigung. Das elegante Design passt zu jeder Kücheneinrichtung. Perfekt für anspruchsvolle Köche.", shortDesc: "Jamie Oliver Kochtopf-Serie mit 3 Teilen und Hartanodise-Gehäuse",
    price: 540, sku: "TEFALJAMIEOLIVE",
    rating: 4.2, reviewCount: 166, categorySlug: "kueche", brandSlug: "tefal",
    specs: [
      { key: "Material", value: "Hartanodise Aluminium" },
      { key: "Set-Inhalt", value: "Kasserole, Bräter, Pfanne" },
      { key: "Herdtyp", value: "Alle inkl. Induktion" },
      { key: "Reinigung", value: "Spülmaschinenfest" },
      { key: "Farbe", value: "Anthrazit" },
    ]
  },
  {
    name: "Gastroback Advanced Dual Plus 40882", slug: "gastroback-advanced-dual-plus-40882",
    description: "Der Gastroback Advanced Dual Plus 40882 ist ein leistungsstarker Handmixer mit 2 Motoren. Die 2 unabhängigen Motoren bieten maximale Flexibilität beim Mischen. Die 6 Geschwindigkeitsstufen und 2 Turbo-Stufen ermöglichen individuelle Einstellungen. Die mitgelieferten Aufätze aus Edelstahl sind spülmaschinenfest. Der ergonomische Griff sorgt für sicheren Halt. Das kompakte Design lässt sich platzsparend aufbewahren. Perfekt für anspruchsvolle Küchenarbeiten.", shortDesc: "Dual-Motor-Handmixer mit 6 Geschwindigkeiten und 2 Turbo-Stufen",
    price: 380, originalPrice: 437, sku: "GASTROBACKAD2", isPromo: true,
    rating: 4.7, reviewCount: 273, categorySlug: "kueche", brandSlug: "gastroback",
    specs: [
      { key: "Leistung", value: "2 x 300 Watt" },
      { key: "Geschwindigkeiten", value: "6 + 2 Turbo" },
      { key: "Aufsätze", value: "2 Knethaken, 2 Schneebesen" },
      { key: "Material", value: "Edelstahl-Aufsätze" },
      { key: "Farbe", value: "Edelstahl" },
    ]
  },
  {
    name: "Vorwerk Kobold VK200", slug: "vorwerk-kobold-vk200",
    description: "Der Vorwerk Kobold VK200 ist ein Premium-Staubsauger mit revolutionärer Reinigungstechnologie. Die Power-Brush VB1000 entfernt Staub und Schmutz gründlich. Die eigene Kinematik sorgt für optimale Bodenkontaktaufnahme. Die 2-in-1-Funktionalität ermöglicht das Saugen von Teppichen und Böden. Die kompakte Bauform lässt sich platzsparend aufbewahren. Die hohe Saugleistung entfernt selbst feinsten Staub. Das Premium-Design in various Farben passt zu jeder Haushaltsführung. Das Flaggschiff für makellose Sauberkeit.", shortDesc: "Vorwerk-Premium-Staubsauger mit Power-Brush und revolutionärer Technologie",
    price: 840, sku: "VORWERKKOBOL2",
    rating: 4.5, reviewCount: 236, categorySlug: "reinigung", brandSlug: "vorwerk",
    specs: [
      { key: "Technologie", value: "Power-Brush VB1000" },
      { key: "Saugleistung", value: "Premium" },
      { key: "Gewicht", value: "7,3 kg" },
      { key: "Farbe", value: "Verschiedene" },
    ]
  },
  {
    name: "Kenwood Chef Xl Elite Kvl6325s", slug: "kenwood-chef-xl-elite-kvl6325s",
    description: "Die Kenwood Chef XL Elite KVL6325S ist eine Premium-Küchenmaschine mit 1700 Watt Leistung. Das planetarische Mischsystem sorgt für gleichmäßige Ergebnisse. Die 8 Geschwindigkeitsstufen und der Pulsbetrieb ermöglichen individuelle Einstellungen. Die mitgelieferten Aufätze – Knethaken, Schneebesen, Kartoffelstab – bieten maximale Vielseitigkeit. Der abnehmbare 6,7-Liter-Rüssel ist spülmaschinenfeste. Die LED-Anzeige zeigt Geschwindigkeit und Timer an. Das elegante Design in Rot passt zu jeder Kücheneinrichtung. Ein Premium-Küchenhelfer für anspruchsvolle Hobby-Köche.", shortDesc: "Premium-Küchenmaschine mit 1700W und 6,7L-Rüssel",
    price: 1880, sku: "KENWOODCHEFXLEL", isFeatured: true,
    rating: 4.1, reviewCount: 303, categorySlug: "kueche", brandSlug: "kenwood",
    specs: [
      { key: "Leistung", value: "1700 Watt" },
      { key: "Rüsselvolumen", value: "6,7 Liter" },
      { key: "Geschwindigkeiten", value: "8 + Puls" },
      { key: "Mischsystem", value: "Planetarisch" },
      { key: "Aufätze", value: "Knethaken, Schneebesen, Kartoffelstab" },
      { key: "Farbe", value: "Rot" },
    ]
  },
  {
    name: "Russell Hobbs Hobbs Go Create Handmixer", slug: "russell-hobbs-go-create-handmixer",
    description: "Der Russell Hobbs Go Create Handmixer ist ein kompakter Helfer mit 300 Watt Leistung. Die 5 Geschwindigkeitsstufen ermöglichen individuelle Einstellungen. Die mitgelieferten Aufätze – 2 Knethaken und 2 Schneebesen – bieten maximale Vielseitigkeit. Der Turbo-Boost sorgt für zusätzliche Leistung. Das ergonomische Design sorgt für sicheren Halt. Das kompakte Design lässt sich platzsparend aufbewahren. Ein zuverlässiger Einstiegs-Handmixer für den täglichen Gebrauch.", shortDesc: "Kompakter Einstiegs-Handmixer mit 300W und 5 Geschwindigkeiten",
    price: 1970, originalPrice: 2266, sku: "RUSSELLHOBBSGOC", isNew: true, isPromo: true,
    rating: 4.7, reviewCount: 219, categorySlug: "kueche", brandSlug: "russell-hobbs",
    specs: [
      { key: "Leistung", value: "300 Watt" },
      { key: "Geschwindigkeiten", value: "5 Stufen" },
      { key: "Aufsätze", value: "2 Knethaken, 2 Schneebesen" },
      { key: "Farbe", value: "Rot/Weiß" },
    ]
  },
  {
    name: "Bosch Mfq3540 Handmixer", slug: "bosch-mfq3540-handmixer",
    description: "Der Bosch MFQ 3540 Handmixer überzeugt mit 450 Watt Leistung und 5 Geschwindigkeitsstufen. Das ergonomische Leichtgewicht von nur 1,1 kg macht auch längere Küchenarbeiten zur Freude. Die rotierenden Knethaken aus Edelstahl sorgen für gleichmäßiges Vermischen. Der praktische Schnellwechselaufsatz ermöglicht einen schnellen Wechsel zwischen den Aufsätzen. Die mitgelieferten Aufätze – 2 Knethaken und 2 Schneebesen – sind spülmaschinenfest. Die Einhand-Auswurftaste erleichtert die Reinigung. Die simplen Drucktasten ermöglichen eine intuitive Bedienung. Ein zuverlässiger Helfer für jeden Tag.", shortDesc: "Ergonomischer Handmixer mit 450W und Schnellwechselaufsatz",
    price: 170, originalPrice: 195, sku: "BOSCHMFQ3540HAN", isPromo: true,
    rating: 4.8, reviewCount: 232, categorySlug: "kueche", brandSlug: "bosch",
    specs: [
      { key: "Leistung", value: "450 Watt" },
      { key: "Geschwindigkeiten", value: "5 Stufen" },
      { key: "Aufsätze", value: "2 Knethaken, 2 Schneebesen" },
      { key: "Material", value: "Edelstahl-Aufsätze" },
      { key: "Farbe", value: "Weiß" },
    ]
  },
  {
    name: "Electrolux Assist 9 Handmixer", slug: "electrolux-assist-9-handmixer",
    description: "Der Electrolux Assist 9 Handmixer bietet 900 Watt Leistung für professionelle Ergebnisse. Die variable Geschwindigkeitsregelung mit Turbo-Boost ermöglicht individuelle Einstellungen. Die ergonomische Form und das geringe Gewicht sorgen für komfortables Arbeiten. Die mitgelieferten Edelstahl-Aufätze – 2 Knethaken und 2 Schneebesen – sind spülmaschinenfest. Die Easy-Click-Aufnahme ermöglicht schnellen Wechsel der Aufsätze. Das elegante Design in Schwarz passt zu jeder Kücheneinrichtung. Ein leistungsstarker Helfer für anspruchsvolle Küchenarbeiten.", shortDesc: "Leistungsstarker 900W-Handmixer mit variabler Geschwindigkeitsregelung",
    price: 1700, sku: "ELECTROLUXASSIS",
    rating: 4.4, reviewCount: 298, categorySlug: "kueche", brandSlug: "electrolux",
    specs: [
      { key: "Leistung", value: "900 Watt" },
      { key: "Geschwindigkeiten", value: "Variabel + Turbo" },
      { key: "Aufsätze", value: "2 Knethaken, 2 Schneebesen" },
      { key: "Material", value: "Edelstahl-Aufsätze" },
      { key: "Farbe", value: "Schwarz" },
    ]
  },
  {
    name: "AEG Hm 400 Handmixer", slug: "aeg-hm-400-handmixer",
    description: "Der AEG HM 400 Handmixer überzeugt mit 5 Geschwindigkeitsstufen und einem Turbo-Boost für maximale Leistung. Das leistungsstarke 400-Watt-Motor sorgt für gleichmäßiges Vermischen von Teigen und Cremes. Der ergonomische Griff liegt dank Softgrip-Beschichtung besonders gut in der Hand. Die mitgelieferten Knethaken und Schneebesen aus Edelstahl sind spülmaschinenfest. Das Leichtgewicht von nur 0,9 kg macht auch längere Küchenarbeiten zur Freude. Die simplen Drucktasten ermöglichen eine intuitive Bedienung. Perfekt für den täglichen Gebrauch in der Küche.", shortDesc: "Leichter Handmixer mit 5 Geschwindigkeiten und Turbo-Boost",
    price: 830, originalPrice: 954, sku: "AEGHM400HANDMIX", isPromo: true,
    rating: 4.4, reviewCount: 110, categorySlug: "kueche", brandSlug: "aeg",
    specs: [
      { key: "Leistung", value: "400 Watt" },
      { key: "Geschwindigkeiten", value: "5 + Turbo" },
      { key: "Gewicht", value: "0,9 kg" },
      { key: "Aufsätze", value: "2 Knethaken, 2 Schneebesen" },
      { key: "Material", value: "Edelstahl-Aufsätze, Kunststoff-Gehäuse" },
      { key: "Farbe", value: "Weiß" },
    ]
  },
  {
    name: "Braun Mq7 Multiquick Handmixer", slug: "braun-mq7-multiquick-handmixer",
    description: "Der Braun MultiQuick 7 Handmixer bietet 600 Watt Leistung und das innovative PowerBell-System für optimale Ergebnisse. Die 5 Geschwindigkeitsstufen und der Turbo-Boost ermöglichen individuelle Einstellungen. Das einzigartige PowerBell sorgt für gleichmäßiges Mischen ohne Spritzer. Die EasyClick-Aufsätze lassen sich mit einem Klick wechseln. Die mitgelieferten Aufätze aus Edelstahl sind spülmaschinenfest. Der ergonomische Softgrip-Griff sorgt für sicheren Halt. Das kompakte Design lässt sich platzsparend aufbewahren. Ein Premium-Handmixer für anspruchsvolle Hobby-Köche.", shortDesc: "Premium-Handmixer mit PowerBell-System und 600W",
    price: 2270, originalPrice: 2611, sku: "BRAUNMQ7MULTIQU", isPromo: true,
    rating: 4.4, reviewCount: 31, categorySlug: "kueche", brandSlug: "braun",
    specs: [
      { key: "Leistung", value: "600 Watt" },
      { key: "Geschwindigkeiten", value: "5 + Turbo" },
      { key: "Aufsätze", value: "PowerBell Schneebesen, Knethaken" },
      { key: "Material", value: "Edelstahl-Aufsätze" },
      { key: "Farbe", value: "Weiß" },
    ]
  },
  {
    name: "Philips Hr3655 Handmixer", slug: "philips-hr3655-handmixer",
    description: "Der Philips HR 3655 Handmixer bietet 450 Watt Leistung und 5 Geschwindigkeitsstufen. Das ergonomische Design und das geringe Gewicht sorgen für komfortables Arbeiten. Die mitgelieferten Edelstahl-Aufsätze – 2 Knethaken und 2 Schneebesen – sind spülmaschinenfest. Der Turbo-Boost sorgt für maximale Leistung. Die Einzelhand-Auswurftaste erleichtert die Reinigung. Das elegante Design in Weiß passt zu jeder Kücheneinrichtung. Ein zuverlässiger Helfer für den täglichen Gebrauch.", shortDesc: "Leichter Handmixer mit 450W und 5 Geschwindigkeiten",
    price: 610, sku: "PHILIPSHR3655HA", isNew: true,
    rating: 4.2, reviewCount: 26, categorySlug: "kueche", brandSlug: "philips",
    specs: [
      { key: "Leistung", value: "450 Watt" },
      { key: "Geschwindigkeiten", value: "5 Stufen" },
      { key: "Aufsätze", value: "2 Knethaken, 2 Schneebesen" },
      { key: "Material", value: "Edelstahl-Aufsätze" },
      { key: "Farbe", value: "Weiß" },
    ]
  },
  {
    name: "Smeg Hmf01 Handmixer", slug: "smeg-hmf01-handmixer",
    description: "Der SMEG HMF01 Handmixer ist ein stilvoller Handmixer im modernen SMEG-Design. Die 400 Watt Leistung und 9 Geschwindigkeitsstufen ermöglichen individuelle Einstellungen. Die mitgelieferten Edelstahl-Aufätze – 2 Knethaken und 2 Schneebesen – bieten maximale Vielseitigkeit. Der Turbo-Boost sorgt für maximale Leistung. Der ergonomische Softgrip-Griff sorgt für sicheren Halt. Das elegante Design in various Farben passt zu jeder Kücheneinrichtung. Ein stylischer Helfer für designbewusste Küchenfreunde.", shortDesc: "Moderner SMEG-Handmixer mit 400W und 9 Geschwindigkeiten",
    price: 2210, sku: "SMEGHMF01HANDMI", isNew: true,
    rating: 4.6, reviewCount: 118, categorySlug: "kueche", brandSlug: "smeg",
    specs: [
      { key: "Leistung", value: "400 Watt" },
      { key: "Geschwindigkeiten", value: "9 Stufen" },
      { key: "Aufsätze", value: "2 Knethaken, 2 Schneebesen" },
      { key: "Material", value: "Edelstahl-Aufätze" },
      { key: "Farbe", value: "Verschiedene Farben" },
    ]
  },
  {
    name: "Smeg 50er Jahre Hmf02 Handmixer", slug: "smeg-50er-jahre-hmf02-handmixer",
    description: "Der SMEG 50er Jahre HMF02 Handmixer ist ein stilvoller Handmixer im Retro-Design der 50er Jahre. Die 400 Watt Leistung und 9 Geschwindigkeitsstufen ermöglichen individuelle Einstellungen. Die mitgelieferten Edelstahl-Aufätze – 2 Knethaken und 2 Schneebesen – bieten maximale Vielseitigkeit. Der Turbo-Boost sorgt für maximale Leistung. Der ergonomische Softgrip-Griff sorgt für sicheren Halt. Das elegante Retro-Design in various Farben passt zu jeder Kücheneinrichtung. Ein stylischer Helfer für designbewusste Küchenfreunde.", shortDesc: "Retro-Handmixer im 50er-Jahre-Design mit 400W und 9 Geschwindigkeiten",
    price: 580, sku: "SMEG50ERJAHREHM",
    rating: 4.7, reviewCount: 302, categorySlug: "kueche", brandSlug: "smeg",
    specs: [
      { key: "Leistung", value: "400 Watt" },
      { key: "Geschwindigkeiten", value: "9 Stufen" },
      { key: "Aufsätze", value: "2 Knethaken, 2 Schneebesen" },
      { key: "Design", value: "50er-Jahre-Retro" },
      { key: "Farbe", value: "Verschiedene Farben" },
    ]
  },
  {
    name: "Russell Hobbs Hobbs Eagle 23211 Handmixer", slug: "russell-hobbs-eagle-23211-handmixer",
    description: "Der Russell Hobbs Eagle 23211 Handmixer bietet 400 Watt Leistung und 5 Geschwindigkeitsstufen. Das elegante Design in Chrom sorgt für einen modernen Look. Die mitgelieferten Edelstahl-Aufätze – 2 Knethaken und 2 Schneebesen – bieten maximale Vielseitigkeit. Der Turbo-Boost sorgt für maximale Leistung. Der ergonomische Griff sorgt für sicheren Halt. Das kompakte Design lässt sich platzsparend aufbewahren. Ein stylischer Helfer für den täglichen Gebrauch.", shortDesc: "Chrom-Handmixer mit 400W und 5 Geschwindigkeiten",
    price: 2020, originalPrice: 2323, sku: "RUSSELLHOBBSEAG", isPromo: true,
    rating: 4, reviewCount: 264, categorySlug: "kueche", brandSlug: "russell-hobbs",
    specs: [
      { key: "Leistung", value: "400 Watt" },
      { key: "Geschwindigkeiten", value: "5 Stufen" },
      { key: "Aufsätze", value: "2 Knethaken, 2 Schneebesen" },
      { key: "Material", value: "Edelstahl-Aufsätze, Chrom-Gehäuse" },
      { key: "Farbe", value: "Chrom" },
    ]
  },
  {
    name: "Moulinex Optichef Ht4101 Handmixer", slug: "moulinex-optichef-ht4101-handmixer",
    description: "Der Moulinex OptiChef HT4101 Handmixer bietet 450 Watt Leistung und 5 Geschwindigkeitsstufen. Das ergonomische Design und das geringe Gewicht sorgen für komfortables Arbeiten. Die mitgelieferten Edelstahl-Aufsätze – 2 Knethaken und 2 Schneebesen – sind spülmaschinenfest. Der Turbo-Boost sorgt für maximale Leistung. Die Einzelhand-Auswurftaste erleichtert die Reinigung. Das elegante Design in Weiß passt zu jeder Kücheneinrichtung. Ein zuverlässiger Helfer für den täglichen Gebrauch.", shortDesc: "Leichter Handmixer mit 450W und 5 Geschwindigkeiten",
    price: 1120, originalPrice: 1288, sku: "MOULINEXOPTICHE", isNew: true, isPromo: true,
    rating: 4.2, reviewCount: 247, categorySlug: "kueche", brandSlug: "moulinex",
    specs: [
      { key: "Leistung", value: "450 Watt" },
      { key: "Geschwindigkeiten", value: "5 Stufen" },
      { key: "Aufsätze", value: "2 Knethaken, 2 Schneebesen" },
      { key: "Material", value: "Edelstahl-Aufsätze" },
      { key: "Farbe", value: "Weiß" },
    ]
  },
  {
    name: "Tefal Optichef Ht4508 Handmixer", slug: "tefal-optichef-ht4508-handmixer",
    description: "Der Tefal OptiChef HT4508 Handmixer bietet 450 Watt Leistung und 5 Geschwindigkeitsstufen. Das ergonomische Design und das geringe Gewicht sorgen für komfortables Arbeiten. Die mitgelieferten Edelstahl-Aufätze – 2 Knethaken und 2 Schneebesen – sind spülmaschinenfest. Der Turbo-Boost sorgt für maximale Leistung. Die Einzelhand-Auswurftaste erleichtert die Reinigung. Das elegante Design in Weiß passt zu jeder Kücheneinrichtung. Ein zuverlässiger Helfer für den täglichen Gebrauch.", shortDesc: "Leichter Handmixer mit 450W und 5 Geschwindigkeiten",
    price: 1240, originalPrice: 1426, sku: "TEFALOPTICHEFHT", isPromo: true,
    rating: 4.2, reviewCount: 122, categorySlug: "kueche", brandSlug: "tefal",
    specs: [
      { key: "Leistung", value: "450 Watt" },
      { key: "Geschwindigkeiten", value: "5 Stufen" },
      { key: "Aufsätze", value: "2 Knethaken, 2 Schneebesen" },
      { key: "Material", value: "Edelstahl-Aufsätze" },
      { key: "Farbe", value: "Weiß" },
    ]
  },
  {
    name: "Black+Decker Decker 600w Handmixer", slug: "black-decker-600w-handmixer",
    description: "Der Black+Decker 600W Handmixer ist ein leistungsstarker Helfer für alle Küchenarbeiten. Mit 6 Geschwindigkeitsstufen und einem leistungsstarken 600-Watt-Motor bewältigt er selbst schwere Teige mühelos. Die 5 Aufsätze aus Edelstahl – 2 Knethaken, 2 Schneebesen und 1 Kartoffelstab – bieten maximale Vielseitigkeit. Der ergonomische Griff sorgt für sicheren Halt. Die simplen Drucktasten ermöglichen eine intuitive Bedienung. Die Einzelhand- und Aufbewahrungsfunktion macht die Arbeit besonders komfortabel. Perfekt für alle, die Wert auf Leistung und Vielseitigkeit legen.", shortDesc: "Leistungsstarker Handmixer mit 600W und 5 Edelstahl-Aufsätzen",
    price: 570, sku: "BLACKDECKER600W",
    rating: 4.3, reviewCount: 226, categorySlug: "kueche", brandSlug: "black-decker",
    specs: [
      { key: "Leistung", value: "600 Watt" },
      { key: "Geschwindigkeiten", value: "6 Stufen" },
      { key: "Aufsätze", value: "2 Knethaken, 2 Schneebesen, 1 Kartoffelstab" },
      { key: "Material", value: "Edelstahl-Aufsätze" },
      { key: "Farbe", value: "Weiß/Orange" },
    ]
  },
  {
    name: "KitchenAid Artisan 5khb25ay Handmixer", slug: "kitchenaid-artisan-5khb25ay-handmixer",
    description: "Der KitchenAid Artisan 5KHB25AY Handmixer ist ein Premium-Handmixer im ikonischen KitchenAid-Design. Die 9 Geschwindigkeitsstufen und der Boost-Modus ermöglichen individuelle Einstellungen. Die Soft-Start-Funktion verhindert Spritzer beim Einschalten. Die ergonomische Form und das geringe Gewicht sorgen für komfortables Arbeiten. Die mitgelieferten Edelstahl-Aufsätze sind spülmaschinenfest. Das elegante Design in verschiedenen Farben passt zu jeder Kücheneinrichtung. Ein Premium-Handmixer für anspruchsvolle Küchenarbeiten.", shortDesc: "Ikonischer KitchenAid-Handmixer mit 9 Geschwindigkeiten und Soft-Start",
    price: 1390, sku: "KITCHENAIDARTIS",
    rating: 4.2, reviewCount: 292, categorySlug: "kueche", brandSlug: "kitchenaid",
    specs: [
      { key: "Leistung", value: "85 Watt" },
      { key: "Geschwindigkeiten", value: "9 + Boost" },
      { key: "Aufsätze", value: "2 Knethaken, 2 Schneebesen" },
      { key: "Material", value: "Edelstahl-Aufsätze" },
      { key: "Farbe", value: "Verschiedene Farben" },
    ]
  },
  {
    name: "Bosch Mums2ew48 Kuechenmaschine", slug: "bosch-mums2ew48-kuechenmaschine",
    description: "Die Bosch MUMS2EW48 Küchenmaschine ist ein vielseitiges Multitalent mit 1200 Watt Leistung. Das planetarische Mischsystem sorgt für gleichmäßige Ergebnisse bei Teig, Creme und Sahne. Die 4 Geschwindigkeitsstufen und der Puls-Modus ermöglichen individuelle Einstellungen. Die mitgelieferten Aufätze – Knethaken, Schneebesen, Kneter – bieten maximale Vielseitigkeit. Der abnehmbare 3,9-Liter-Rüssel ist spülmaschinenfeste. Das elegante Design in Weiß passt zu jeder Kücheneinrichtung. Die integrierte Übersetzungsmechanik sorgt für leisen Betrieb. Perfekt für alle, die eine zuverlässige Küchenmaschine suchen.", shortDesc: "1200W-Küchenmaschine mit planetarischem Mischsystem und 3,9L-Rüssel",
    price: 2160, originalPrice: 2484, sku: "BOSCHMUMS2EW48K", isPromo: true,
    rating: 4.5, reviewCount: 266, categorySlug: "kueche", brandSlug: "bosch",
    specs: [
      { key: "Leistung", value: "1200 Watt" },
      { key: "Rüsselvolumen", value: "3,9 Liter" },
      { key: "Geschwindigkeiten", value: "4 + Puls" },
      { key: "Mischsystem", value: "Planetarisch" },
      { key: "Aufsätze", value: "Knethaken, Schneebesen, Kneter" },
      { key: "Farbe", value: "Weiß" },
    ]
  },
  {
    name: "Moulinex Quickmix 654 Handmixer", slug: "moulinex-quickmix-654-handmixer",
    description: "Der Moulinex QuickMix 654 Handmixer ist ein kompakter Helfer mit 300 Watt Leistung. Die 4 Geschwindigkeitsstufen ermöglichen individuelle Einstellungen. Die mitgelieferten Aufätze – 2 Knethaken und 2 Schneebesen – bieten maximale Vielseitigkeit. Der Turbo-Boost sorgt für zusätzliche Leistung. Das ergonomische Design sorgt für sicheren Halt. Das kompakte Design lässt sich platzsparend aufbewahren. Ein zuverlässiger Einstiegs-Handmixer für den täglichen Gebrauch.", shortDesc: "Kompakter Einstiegs-Handmixer mit 300W und 4 Geschwindigkeiten",
    price: 2170, sku: "MOULINEXQUICKMI", isNew: true,
    rating: 4.8, reviewCount: 227, categorySlug: "kueche", brandSlug: "moulinex",
    specs: [
      { key: "Leistung", value: "300 Watt" },
      { key: "Geschwindigkeiten", value: "4 Stufen" },
      { key: "Aufsätze", value: "2 Knethaken, 2 Schneebesen" },
      { key: "Farbe", value: "Weiß" },
    ]
  },
  {
    name: "Kenwood Hm430 Handmixer", slug: "kenwood-hm430-handmixer",
    description: "Der Kenwood HM 430 Handmixer bietet 450 Watt Leistung und 5 Geschwindigkeitsstufen. Das ergonomische Design und das geringe Gewicht sorgen für komfortables Arbeiten. Die mitgelieferten Edelstahl-Aufsätze – 2 Knethaken und 2 Schneebesen – sind spülmaschinenfest. Der Turbo-Boost sorgt für maximale Leistung. Die Einzelhand-Auswurftaste erleichtert die Reinigung. Das elegante Design in Weiß passt zu jeder Kücheneinrichtung. Ein zuverlässiger Helfer für den täglichen Gebrauch.", shortDesc: "Komfortabler Handmixer mit 450W und 5 Geschwindigkeiten",
    price: 1170, originalPrice: 1346, sku: "KENWOODHM430HAN", isPromo: true,
    rating: 4.6, reviewCount: 163, categorySlug: "kueche", brandSlug: "kenwood",
    specs: [
      { key: "Leistung", value: "450 Watt" },
      { key: "Geschwindigkeiten", value: "5 Stufen" },
      { key: "Aufsätze", value: "2 Knethaken, 2 Schneebesen" },
      { key: "Material", value: "Edelstahl-Aufsätze" },
      { key: "Farbe", value: "Weiß" },
    ]
  },
  {
    name: "Jura E4 Platinum", slug: "jura-e4-platinum",
    description: "Die Jura E4 Platinum ist der Einstieg in die Premium-Vollautomaten-Welt von Jura. Das professionelle Aromamahlwerk aus Edelstahl mahlt die Bohnen besonders schonend. Die P.E.P.-Technologie optimiert die Extraktionszeit für intensiven Espressogenuss. Der reduzierte Funktionsumfang auf die wichtigsten Kaffeespezialitäten sorgt für intuitive Bedienung. Das Aroma-Schutz-System bewahrt die Bohnen in einem luftdicht versiegelten Behälter. Die abnehmbare Milchleitung ist einfach zu reinigen. Die Elegance-Serie bietet ein zeitloses Design in Dunkelchrom. Perfekt für alle, die reine Kaffeequalität ohne Schnick-Schnack schätzen.", shortDesc: "Premium-Einstiegsvollautomat mit P.E.P. und Edelstahl-Mahlwerk",
    price: 940, originalPrice: 1081, sku: "JURAE4PLATINUM", isPromo: true,
    rating: 4.1, reviewCount: 83, categorySlug: "kaffee", brandSlug: "jura",
    specs: [
      { key: "Mahlwerk", value: "Aromamahlwerk Edelstahl" },
      { key: "Brühtechnologie", value: "P.E.P." },
      { key: "Kaffeespezialitäten", value: "Espresso, Kaffee, Milchgetränke" },
      { key: "Wasserkapazität", value: "1,9 Liter" },
      { key: "Bohnenbehälter", value: "250 g" },
      { key: "Leistung", value: "1450 Watt" },
      { key: "Brühdruck", value: "15 bar" },
      { key: "Garantie", value: "2 Jahre" },
    ]
  },
  {
    name: "Jura S8 Chrome", slug: "jura-s8-chrome",
    description: "Die Jura S8 Chrome ist der Premium-Vollautomat mit Touchdisplay und exklusivem Design. Das 4,3-Zoll-Touchdisplay bietet intuitive Bedienung und individuelle Rezeptanpassung. Das professionelle Aromamahlwerk aus Edelstahl mahlt die Bohnen besonders schonend. Die P.E.P.-Technologie optimiert die Extraktion für intensiven Geschmack. Der automatische Milchschaumer erzeugt in Sekunden perfekten Cappuccino-Schaum. Die S.O.E.-Technologie (Smart Operated Espresso) sorgt für konsistente Qualität. Das elegante Chrome-Gehäuse unterstreicht den Premium-Anspruch. Mit 12 Kaffeespezialitäten und individuellen Anpassungsmöglichkeiten für jeden Geschmack.", shortDesc: "Premium-Touchvollautomat mit 4,3-Zoll-Display und 12 Spezialitäten",
    price: 2060, sku: "JURAS8CHROME",
    rating: 4.7, reviewCount: 268, categorySlug: "kaffee", brandSlug: "jura",
    specs: [
      { key: "Display", value: "4,3 Zoll Touch" },
      { key: "Mahlwerk", value: "Aromamahlwerk Edelstahl" },
      { key: "Brühtechnologie", value: "P.E.P." },
      { key: "Wasserkapazität", value: "2,0 Liter" },
      { key: "Bohnenbehälter", value: "280 g" },
      { key: "Leistung", value: "1450 Watt" },
      { key: "Brühdruck", value: "15 bar" },
      { key: "Garantie", value: "2 Jahre" },
    ]
  },
  {
    name: "Jura D6 Dark Inox", slug: "jura-d6-dark-inox",
    description: "Die Jura D6 Dark Inox ist ein eleganter Vollautomat im edlen Dunkelchrom-Design. Das feinste Jura-Mahlwerk aus Edelstahl mahlt die Bohnen besonders schonend für optimalen Geschmack. Der automatische Milchschaumer erzeugt in Sekunden perfekten Milchschaum für Cappuccino und Latte. Die P.E.P.-Technologie (Pulse Extraction Process) optimiert die Extraktionszeit für Short und Long Espressos. Die EASY-Schaltmatrix bietet alle Funktionen auf einen Blick. Das Aroma-Schutz-System bewahrt die Bohnen vor Feuchtigkeit und Licht. Die abnehmbare Milchleitung ist einfach zu reinigen und spülmaschinengeeignet. Die kompakte Bauform von nur 23,8 cm Breite passt in jede Küchenzeile.", shortDesc: "Eleganter Vollautomat mit P.E.P.-Technologie und Inox-Design",
    price: 1240, sku: "JURAD6DARKINOX",
    rating: 4.9, reviewCount: 14, categorySlug: "kaffee", brandSlug: "jura",
    specs: [
      { key: "Milchsystem", value: "Automatisch" },
      { key: "Wasserkapazität", value: "1,9 Liter" },
      { key: "Bohnenbehälter", value: "250 g" },
      { key: "Leistung", value: "1450 Watt" },
      { key: "Brühdruck", value: "15 bar" },
      { key: "Garantie", value: "2 Jahre" },
      { key: "Mahlwerk", value: "Feines Edelstahl-Mahlwerk" },
      { key: "Brühtechnologie", value: "P.E.P." },
    ]
  },
  {
    name: "De'Longhi Magnifica Evo Ecam29233", slug: "delonghi-magnifica-evo-ecam29233",
    description: "Die De'Longhi Magnifica Evo Ecam29233 ist ein kompakter Vollautomat für den täglichen Kaffeegenuss. Das 13-stufige Mahlwerk aus gehärtetem Stahl bietet individuelle Einstellungen für jeden Geschmack. Die LatteCrema-Technologie erzeugt automatisch cremigen Milchschaum für Cappuccino und Latte Macchiato. Mit der One-Touch-Funktion bereiten Sie bis zu 8 Kaffeespezialitäten mit einem Knopfdruck zu. Die Aroma-Sperre schützt die Bohnen vor Luftfeuchtigkeit und bewahrt das frische Aroma. Die abnehmbare Brühgruppe lässt sich leicht auswaschen und ist spülmaschinengeeignet. Das kompakte Gehäuse passt in jede Küchenzeile. Die LED-Steuerung mit Symbolen macht die Bedienung kinderleicht.", shortDesc: "Kompakter Vollautomat mit LatteCrema und 8 Spezialitäten",
    price: 1090, sku: "DELONGHIMAGNIFI",
    rating: 4.1, reviewCount: 35, categorySlug: "kaffee", brandSlug: "delonghi",
    specs: [
      { key: "Mahlwerk", value: "13-stufig, gehärteter Stahl" },
      { key: "Milchsystem", value: "LatteCrema automatisch" },
      { key: "Kaffeespezialitäten", value: "8 Sorten" },
      { key: "Wasserkapazität", value: "1,8 Liter" },
      { key: "Bohnenbehälter", value: "270 g" },
      { key: "Leistung", value: "1500 Watt" },
      { key: "Brühdruck", value: "15 bar" },
      { key: "Garantie", value: "2 Jahre" },
    ]
  },
  {
    name: "De'Longhi Dinamica Ecam35055", slug: "delonghi-dinamica-ecam35055",
    description: "Die De'Longhi Dinamica Ecam35055 ist ein vollautomatischer Kaffeevollautomat mit integriertem MILK-SYSTEM für Cappuccino und Latte Macchiato. Das 13-stufige Mahlwerk aus gehärtetem Stahl zerkleinert Bohnen schonend und leise. Der automatische Latte Crema-Schaumer erzeugt cremigen Milchschaum direkt in die Tasse. Die One-Touch-Funktion bereitet mit einem Knopfdruck bis zu 12 verschiedene Kaffeespezialitäten zu. Die Aromaseal-Technologie schließt den Bohnenbehälter luftdicht und bewahrt das Aroma. Die abnehmbare Brühgruppe und der Milchschaumer sind spülmaschinenfest. Das integrierte Entkalkungssystem warnt rechtzeitig vor Wartungsintervallen. Perfekt für alle, die Vielseitigkeit und Kompaktheit in einem Gerät suchen.", shortDesc: "Kompakter Vollautomat mit Milk System und 13 Mahlgraden",
    price: 1200, sku: "DELONGHIDINAMIC", isNew: true,
    rating: 4.5, reviewCount: 78, categorySlug: "kaffee", brandSlug: "delonghi",
    specs: [
      { key: "Mahlwerk", value: "13-stufig, gehärteter Stahl" },
      { key: "Milchsystem", value: "Automatisch Latte Crema" },
      { key: "Kaffeespezialitäten", value: "12 Sorten" },
      { key: "Wasserkapazität", value: "1,8 Liter" },
      { key: "Bohnenbehälter", value: "250 g" },
      { key: "Leistung", value: "1200 Watt" },
      { key: "Brühdruck", value: "15 bar" },
      { key: "Garantie", value: "2 Jahre" },
    ]
  },
  {
    name: "De'Longhi Primadonna Soul Ecam61075", slug: "delonghi-primadonna-soul-ecam61075",
    description: "Die De'Longhi Primadonna Soul Ecam61075 ist der Premium-Vollautomat mit deutscher Technologie. Das feinste Mahlwerk aus gehärtetem Stahl bietet 13 Mahlgradeinstellungen für perfekten Geschmack. Die LatteCrema-System-Technologie erzeugt automatisch crémeigen Milchschaum für jeden Kaffee. Das Large-Cappuccino-System bereitet bis zu 3 Tassen gleichzeitig zu. Die Connession-App ermöglicht die Fernbedienung per Smartphone. Die Aroma-Funktion lässt Sie zwischen mild, mittel und stark wählen. Die Premium-Veredelung aus Metall und Edelstahl unterstreicht den luxuriösen Anspruch. Perfekt für anspruchsvolle Genießer, die das Beste vom Besten wollen.", shortDesc: "Premium-Vollautomat mit App-Steuerung und Large-Cappuccino-System",
    price: 1980, originalPrice: 2277, sku: "DELONGHIPRIMADO", isPromo: true,
    rating: 4.3, reviewCount: 308, categorySlug: "kaffee", brandSlug: "delonghi",
    specs: [
      { key: "Mahlwerk", value: "13-stufig, gehärteter Stahl" },
      { key: "Milchsystem", value: "LatteCrema Premium" },
      { key: "Kaffeespezialitäten", value: "12 Sorten" },
      { key: "Wasserkapazität", value: "2,0 Liter" },
      { key: "Bohnenbehälter", value: "300 g" },
      { key: "Leistung", value: "1450 Watt" },
      { key: "App-Steuerung", value: "Ja (Connession)" },
      { key: "Garantie", value: "2 Jahre" },
    ]
  },
  {
    name: "Siemens Eq9 Plus S700", slug: "siemens-eq9-plus-s700",
    description: "Die Siemens EQ9 Plus S700 ist der Premium-Vollautomat mit vielseitigsten Funktionen. Das 5-stufige Mahlwerk bietet individuelle Einstellungen für jeden Geschmack. Die autoMilk-Technologie erzeugt automatisch cremigen Milchschaum und reinigt sich selbst. Die oneTouch DoubleCup-Funktion bereitet 2 Tassen gleichzeitig zu. Die AromaBalance-Funktion passt die Brühparameter an Ihre Vorlieben an. Die Home Connect App ermöglicht die Fernbedienung per Smartphone. Die abnehmbare Brühgruppe ist spülmaschinenfeste. Die Premium-Veredelung aus Metall und Edelstahl unterstreicht den luxuriösen Anspruch. Perfekt für anspruchsvolle Kaffeegenießer, die das Beste vom Besten wollen.", shortDesc: "Premium-Vollautomat mit autoMilk, DoubleCup und Home Connect",
    price: 950, sku: "SIEMENSEQ9PLUSS",
    rating: 4.9, reviewCount: 100, categorySlug: "kaffee", brandSlug: "siemens",
    specs: [
      { key: "Mahlwerk", value: "5-stufig" },
      { key: "Milchsystem", value: "autoMilk automatisch" },
      { key: "Kaffeespezialitäten", value: "10 Sorten" },
      { key: "Wasserkapazität", value: "2,0 Liter" },
      { key: "Bohnenbehälter", value: "300 g" },
      { key: "Leistung", value: "1600 Watt" },
      { key: "App-Steuerung", value: "Home Connect" },
      { key: "Garantie", value: "2 Jahre" },
    ]
  },
  {
    name: "Siemens Eq500 Plus S500", slug: "siemens-eq500-plus-s500",
    description: "Die Siemens EQ500 Plus S500 ist der Mittelklasse-Vollautomat mit erweiterten Funktionen. Das 5-stufige Mahlwerk bietet individuelle Einstellungen für jeden Geschmack. Die autoMilk-Technologie erzeugt automatisch cremigen Milchschaum und reinigt die Milchleitung nach jedem Getränk. Die oneTouch DoubleCup-Funktion bereitet 2 Tassen gleichzeitig zu. Die AromaBalance-Funktion passt die Brühparameter an Ihre Vorlieben an. Die abnehmbare Brühgruppe ist spülmaschinenfeste. Die Siemens-Home-Connect-App ermöglicht die Fernbedienung per Smartphone. Die Premium-Veredelung unterstreicht den Qualitätsanspruch. Ein vielseitiger Vollautomat für anspruchsvolle Kaffeegenießer.", shortDesc: "Mittelklasse-Vollautomat mit autoMilk und Home Connect App",
    price: 2030, sku: "SIEMENSEQ500PLU",
    rating: 4.2, reviewCount: 130, categorySlug: "kaffee", brandSlug: "siemens",
    specs: [
      { key: "Mahlwerk", value: "5-stufig" },
      { key: "Milchsystem", value: "autoMilk automatisch" },
      { key: "Kaffeespezialitäten", value: "8 Sorten" },
      { key: "Wasserkapazität", value: "1,7 Liter" },
      { key: "Bohnenbehälter", value: "250 g" },
      { key: "Leistung", value: "1500 Watt" },
      { key: "App-Steuerung", value: "Home Connect" },
      { key: "Garantie", value: "2 Jahre" },
    ]
  },
  {
    name: "Siemens Eq300 S300", slug: "siemens-eq300-s300",
    description: "Die Siemens EQ300 S300 ist der Einstiegsvollautomat der EQ-Serie für den täglichen Kaffeegenuss. Das 3-stufige Mahlwerk bietet grundlegende Einstellungen für milden, mittleren oder starken Kaffee. Der automatische Milchschaumer erzeugt cremigen Milchschaum für Cappuccino und Latte Macchiato. Die One-Touch-Funktion bereitet alle gängigen Spezialitäten zu. Die automatische Spülung reinigt die Leitungen nach jedem Milchgetränk. Die abnehmbare Brühgruppe ist spülmaschinenfeste. Die kompakte Bauform passt in jede Küchenzeile. Die Siemens-Qualität bietet Zuverlässigkeit und Langlebigkeit. Der perfekte Einstieg in die Siemens-Vollautomaten-Welt.", shortDesc: "Einstiegsvollautomat mit 3 Mahlgraden und automatischem Milchschaumer",
    price: 1710, sku: "SIEMENSEQ300S30",
    rating: 4.2, reviewCount: 304, categorySlug: "kaffee", brandSlug: "siemens",
    specs: [
      { key: "Mahlwerk", value: "3-stufig" },
      { key: "Milchsystem", value: "Automatisch" },
      { key: "Kaffeespezialitäten", value: "Espresso, Kaffee, Cappuccino, Latte Macchiato" },
      { key: "Wasserkapazität", value: "1,4 Liter" },
      { key: "Bohnenbehälter", value: "250 g" },
      { key: "Leistung", value: "1200 Watt" },
      { key: "Brühdruck", value: "15 bar" },
      { key: "Garantie", value: "2 Jahre" },
    ]
  },
  {
    name: "Saeco Xelsis Sm8780", slug: "saeco-xelsis-sm8780",
    description: "Die Saeco Xelsis SM8780 ist der Premium-Vollautomat mit HygieSteaM-Technologie. Das feinste Mahlwerk aus gehärtetem Stahl bietet 12 Mahlgradeinstellungen. Die HygieSteaM-Technologie nutztheißen Dampf zur automatischen Reinigung der Milchleitung. Die LatteDuo-Funktion bereitet bis zu 2 Tassen gleichzeitig zu. Die 6 Kaffeespezialitäten sind über die intuitive Touch-Steuerung wählbar. Die abnehmbare Brühgruppe ist spülmaschinenfeste. Die Premium-Veredelung aus Metall und Edelstahl unterstreicht den Qualitätsanspruch. Die inteligente Aroma-Erkennung passt die Brühparameter automatisch an. Perfekt für anspruchsvolle Kaffeegenießer.", shortDesc: "Premium-Vollautomat mit HygieSteaM-Technologie und Touch-Steuerung",
    price: 2380, sku: "SAECOXELSISSM87",
    rating: 4.1, reviewCount: 62, categorySlug: "kaffee", brandSlug: "saeco",
    specs: [
      { key: "Mahlwerk", value: "12-stufig, gehärteter Stahl" },
      { key: "Milchsystem", value: "HygieSteaM automatisch" },
      { key: "Kaffeespezialitäten", value: "6 Sorten" },
      { key: "Wasserkapazität", value: "2,5 Liter" },
      { key: "Bohnenbehälter", value: "300 g" },
      { key: "Leistung", value: "1450 Watt" },
      { key: "Brühdruck", value: "15 bar" },
      { key: "Garantie", value: "2 Jahre" },
    ]
  },
  {
    name: "Saeco Granarista Sm5580", slug: "saeco-granarista-sm5580",
    description: "Die Saeco Granarista SM5580 ist ein kompakter Vollautomat für den täglichen Kaffeegenuss. Das 5-stufige Mahlwerk bietet individuelle Einstellungen für jeden Geschmack. Der integrierte Milchschaumer erzeugt automatisch cremigen Milchschaum. Die One-Touch-Funktion bereitet Espresso, Kaffee, Cappuccino und Latte Macchiato zu. Die automatische Reinigungsfunktion spült die Leitungen nach jedem Milchgetränk. Die abnehmbare Brühgruppe ist spülmaschinenfeste. Die kompakte Bauform von nur 20 cm Breite passt in jede Küche. Die Energiesparfunktion reduziert den Stromverbrauch im Standby-Modus. Ein zuverlässiger Alltags-Vollautomat für den täglichen Kaffeegenuss.", shortDesc: "Kompakter Vollautomat mit Milchsystem und 5 Mahlgraden",
    price: 750, originalPrice: 862, sku: "SAECOGRANARISTA", isPromo: true,
    rating: 4.3, reviewCount: 119, categorySlug: "kaffee", brandSlug: "saeco",
    specs: [
      { key: "Mahlwerk", value: "5-stufig" },
      { key: "Milchsystem", value: "Automatisch" },
      { key: "Kaffeespezialitäten", value: "Espresso, Kaffee, Cappuccino, Latte Macchiato" },
      { key: "Wasserkapazität", value: "1,5 Liter" },
      { key: "Bohnenbehälter", value: "250 g" },
      { key: "Leistung", value: "1200 Watt" },
      { key: "Brühdruck", value: "15 bar" },
      { key: "Garantie", value: "2 Jahre" },
    ]
  },
  {
    name: "Krups Virtuoso Xp442c10", slug: "krups-virtuoso-xp442c10",
    description: "Die Krups Virtuoso XP442C10 ist der Premium-Vollautomat mit 15 Kaffeespezialitäten. Das feinste Mahlwerk aus Edelstahl bietet 3 Mahlgradeinstellungen für individuelle Brühresultate. Der integrierte Milchschaumer erzeugt automatisch cremigen Milchschaum für Cappuccino und Latte. Die One-Touch-Funktion bereitet mit einem Knopfdruck alle Spezialitäten zu. Die LED-Anzeige zeigt alle Funktionen übersichtlich an. Das Aroma-System bewahrt die Bohnen vor Feuchtigkeit. Die Premium-Veredelung aus Metall und Edelstahl unterstreicht den Qualitätsanspruch. Perfekt für alle, die Vielseitigkeit und Premium-Qualität in einem Gerät suchen.", shortDesc: "Premium-Vollautomat mit 15 Spezialitäten und integriertem Milchschaumer",
    price: 2360, originalPrice: 2714, sku: "KRUPSVIRTUOSOXP", isPromo: true,
    rating: 4.7, reviewCount: 79, categorySlug: "kaffee", brandSlug: "krups",
    specs: [
      { key: "Mahlwerk", value: "Edelstahl, 3 Stufen" },
      { key: "Kaffeespezialitäten", value: "15 Sorten" },
      { key: "Milchsystem", value: "Automatisch" },
      { key: "Wasserkapazität", value: "2,5 Liter" },
      { key: "Bohnenbehälter", value: "270 g" },
      { key: "Leistung", value: "1400 Watt" },
      { key: "Brühdruck", value: "15 bar" },
      { key: "Garantie", value: "2 Jahre" },
    ]
  },
  {
    name: "Krups Evidence Plus Ea894c", slug: "krups-evidence-plus-ea894c",
    description: "Die Krups Evidence Plus Ecommand ist ein Kaffeevollautomat mit innovativer Quattro-Technologie. Das 4-stufige Mahlwerk bietet individuelle Einstellungen für jeden Geschmack. Die Quattro-Kopf-Technologie verteilt das Wasser gleichmäßig über das Kaffeemehl für optimale Extraktion. Der thermoblock-Heizungsschnelle bringt die Maschine in 40 Sekunden auf Betriebstemperatur. Die Latte-Shot-Funktion bereitet automatisch cremigen Milchschaum. Die intuitive Touch-Steuerung bietet 8 Kaffeespezialitäten auf einen Blick. Die abnehmbare Brühgruppe ist spülmaschinenfeste. Die kompakte Bauform passt in jede Küchenzeile. Ein leistungsstarker Vollautomat für anspruchsvolle Kaffeegenießer.", shortDesc: "Quattro-Technologie Vollautomat mit 8 Spezialitäten und 40s Aufheizzeit",
    price: 1170, originalPrice: 1346, sku: "KRUPSEVIDENCEPL", isPromo: true,
    rating: 4.2, reviewCount: 274, categorySlug: "kaffee", brandSlug: "krups",
    specs: [
      { key: "Mahlwerk", value: "4-stufig" },
      { key: "Heizung", value: "Thermoblock" },
      { key: "Kaffeespezialitäten", value: "8 Sorten" },
      { key: "Wasserkapazität", value: "2,2 Liter" },
      { key: "Bohnenbehälter", value: "270 g" },
      { key: "Leistung", value: "1400 Watt" },
      { key: "Brühdruck", value: "15 bar" },
      { key: "Garantie", value: "2 Jahre" },
    ]
  },
  {
    name: "Tchibo Barista Bean To Cup", slug: "tchibo-barista-bean-to-cup",
    description: "Die Tchibo Barista Bean to Cup ist ein Kaffeevollautomat mit integriertem Mahlwerk. Das feinste Mahlwerk aus Edelstahl mahlt die Bohnen frisch für jede Tasse. Die 3 Intensitätsstufen bieten individuelle Einstellungen für milden, mittleren oder starken Kaffee. Der integrierte Milchschaumer erzeugt automatisch cremigen Milchschaum. Die One-Touch-Funktion bereitet Espresso, Kaffee, Cappuccino und Latte Macchiato zu. Die abnehmbare Brühgruppe ist spülmaschinenfeste. Das kompakte Design passt in jede Küchenzeile. Die Tchibo-Qualität bietet Zuverlässigkeit und Langlebigkeit. Perfekt für alle, die frischen Kaffee-Genuss ohne Aufwand suchen.", shortDesc: "Vollautomat mit Edelstahl-Mahlwerk und 3 Intensitätsstufen",
    price: 1600, originalPrice: 1840, sku: "TCHIBOBARISTABE", isPromo: true,
    rating: 4.5, reviewCount: 286, categorySlug: "kaffee", brandSlug: "tchibo",
    specs: [
      { key: "Mahlwerk", value: "Edelstahl" },
      { key: "Intensitätsstufen", value: "3 Stufen" },
      { key: "Milchsystem", value: "Automatisch" },
      { key: "Kaffeespezialitäten", value: "Espresso, Kaffee, Cappuccino, Latte Macchiato" },
      { key: "Wasserkapazität", value: "1,5 Liter" },
      { key: "Bohnenbehälter", value: "250 g" },
      { key: "Leistung", value: "1600 Watt" },
      { key: "Garantie", value: "2 Jahre" },
    ]
  },
  {
    name: "Tchibo Privilegio Bean To Cup", slug: "tchibo-privilegio-bean-to-cup",
    description: "Die Tchibo Privilegio Bean to Cup ist ein Premium-Kaffeevollautomat mit edlem Metall-Design. Das feinste Mahlwerk aus Edelstahl mahlt die Bohnen besonders schonend. Die One-Touch-Funktion bereitet Espresso, Kaffee, Cappuccino und Latte Macchiato zu. Der integrierte Milchschaumer erzeugt cremigen Milchschaum. Die 3 Intensitätsstufen bieten individuelle Einstellungen. Die abnehmbare Brühgruppe ist spülmaschinenfeste. Das Premium-Design in various Farben passt zu jeder Kücheneinrichtung. Perfekt für anspruchsvolle Kaffeegenießer.", shortDesc: "Premium-Vollautomat mit Metall-Design und 3 Intensitätsstufen",
    price: 2790, originalPrice: 3208, sku: "TCHIBOPRIVILEGI", isPromo: true,
    rating: 4.6, reviewCount: 257, categorySlug: "kaffee", brandSlug: "tchibo",
    specs: [
      { key: "Mahlwerk", value: "Edelstahl" },
      { key: "Milchsystem", value: "Automatisch" },
      { key: "Kaffeespezialitäten", value: "Espresso, Kaffee, Cappuccino, Latte Macchiato" },
      { key: "Wasserkapazität", value: "1,5 Liter" },
      { key: "Bohnenbehälter", value: "250 g" },
      { key: "Leistung", value: "1600 Watt" },
      { key: "Farbe", value: "Metall/Schwarz" },
    ]
  },
  {
    name: "Melitta Purista Pure Black Neu", slug: "melitta-purista-pure-black-neu",
    description: "Die Melitta Purista Pure Black Neu ist die neue Version des beliebten Filterkaffeevollautomaten. Das 5-stufige Mahlwerk bietet erweiterte Einstellungsmöglichkeiten für individuelle Geschmäcker. Die Aromafavorites-Funktion speichert Ihre persönlichen Lieblingseinstellungen. Der integrierte Milchschaumer erzeugt automatisch cremigen Milchschaum. Die One-Touch-Funktion bereitet Espresso, Kaffee und Milchgetränke zu. Die abnehmbare Brühgruppe ist spülmaschinenfeste. Das elegante Pure-Black-Design passt zu jeder Kücheneinrichtung. Die Energy-Saving-Funktion reduziert den Stromverbrauch. Ein vielseitiger Vollautomat für alle, die Filterkaffee und Espresso in einem Gerät suchen.", shortDesc: "Neuer Vollautomat mit 5 Mahlgraden, Milchsystem und Aromafavorites",
    price: 1310, originalPrice: 1506, sku: "MELITTAPURISTAP", isPromo: true,
    rating: 4.2, reviewCount: 217, categorySlug: "kaffee", brandSlug: "melitta",
    specs: [
      { key: "Mahlwerk", value: "5-stufig" },
      { key: "Milchsystem", value: "Automatisch" },
      { key: "Kaffeespezialitäten", value: "Espresso, Kaffee, Cappuccino, Latte Macchiato" },
      { key: "Wasserkapazität", value: "1,5 Liter" },
      { key: "Bohnenbehälter", value: "250 g" },
      { key: "Leistung", value: "1500 Watt" },
      { key: "Brühdruck", value: "15 bar" },
      { key: "Garantie", value: "2 Jahre" },
    ]
  },
  {
    name: "Melitta Look V Style Perfekt", slug: "melitta-look-v-style-perfekt",
    description: "Die Melitta Look V Style Perfekt ist ein eleganter Vollautomat im modernen V-Design. Das 5-stufige Mahlwerk bietet individuelle Einstellungen für jeden Geschmack. Die Aromafavorites-Funktion speichert Ihre persönlichen Lieblingseinstellungen. Der integrierte Milchschaumer erzeugt automatisch cremigen Milchschaum. Die One-Touch-Funktion bereitet alle gängigen Kaffeespezialitäten zu. Die abnehmbare Brühgruppe ist spülmaschinenfeste. Das elegante V-Design passt perfekt zu modernen Küchen. Die Energy-Saving-Funktion reduziert den Stromverbrauch im Standby-Modus. Ein stylischer Vollautomat für designbewusste Kaffeegenießer.", shortDesc: "Eleganter Vollautomat im V-Design mit Aromafavorites",
    price: 650, sku: "MELITTALOOKVSTY",
    rating: 4.1, reviewCount: 170, categorySlug: "kaffee", brandSlug: "melitta",
    specs: [
      { key: "Mahlwerk", value: "5-stufig" },
      { key: "Milchsystem", value: "Automatisch" },
      { key: "Kaffeespezialitäten", value: "Espresso, Kaffee, Cappuccino, Latte Macchiato" },
      { key: "Wasserkapazität", value: "1,5 Liter" },
      { key: "Bohnenbehälter", value: "250 g" },
      { key: "Leistung", value: "1200 Watt" },
      { key: "Brühdruck", value: "15 bar" },
      { key: "Garantie", value: "2 Jahre" },
    ]
  },
  {
    name: "Melitta Enjoy 5 Purge", slug: "melitta-enjoy-5-purge",
    description: "Die Melitta Enjoy 5 Purge ist ein Kaffeevollautomat mit Aromafavorites-Funktion. Das 5-stufige Mahlwerk bietet individuelle Einstellungen für jeden Geschmack. Die Aromafavorites-Funktion speichert Ihre persönlichen Lieblingseinstellungen. Der integrierte Milchschaumer erzeugt automatisch cremigen Milchschaum. Die One-Touch-Funktion bereitet Espresso, Kaffee, Cappuccino und Latte Macchiato zu. Die abnehmbare Brühgruppe ist einfach zu reinigen. Die Purge-Funktion spült die Leitungen automatisch nach jedem Milchgetränk. Die kompakte Bauform passt in jede Küchenzeile. Ein zuverlässiger Alltags-Vollautomat für den täglichen Kaffeegenuss.", shortDesc: "Alltags-Vollautomat mit Aromafavorites und automatischer Purge-Funktion",
    price: 960, originalPrice: 1104, sku: "MELITTAENJOY5PU", isPromo: true,
    rating: 4.4, reviewCount: 67, categorySlug: "kaffee", brandSlug: "melitta",
    specs: [
      { key: "Mahlwerk", value: "5-stufig" },
      { key: "Milchsystem", value: "Automatisch" },
      { key: "Kaffeespezialitäten", value: "Espresso, Kaffee, Cappuccino, Latte Macchiato" },
      { key: "Wasserkapazität", value: "1,5 Liter" },
      { key: "Bohnenbehälter", value: "250 g" },
      { key: "Leistung", value: "1200 Watt" },
      { key: "Brühdruck", value: "15 bar" },
      { key: "Garantie", value: "2 Jahre" },
    ]
  },
  {
    name: "Breville Barista Express", slug: "breville-barista-express",
    description: "Die Breville Barista Express ist eine halbautomatische Espressomaschine für ambitionierte Home-Baristas. Das integrierte Kegelmahlwerk aus Edelstahl mahlt frische Bohnen direkt vor dem Brühen für maximalen Geschmack. Der digitale PID-Temperaturregulator hält die Brühtemperatur konstant zwischen 90°C und 96°C. Der Crona-Milchaufschäumer erzeugt samtigen Mikroschaum für Cappuccino und Latte Art. Das 58mm-Brühsystem im Profi-Format sorgt für gleichmäßige Extraktion. Der abnehmbare 2-Liter-Wassertank mit integriertem Active-Water-Management erleichtert die Reinigung. Die integrierte Beleuchtung zeigt den Fortschritt der Kaffeezubereitung an. Die Maschine bietet 30 Einstellungen für die Mahlgradfeinheit und eine manuelle Brühdruckregulierung.", shortDesc: "Halbautomatische Espressomaschine mit integriertem Mahlwerk und Profi-Brühgruppe",
    price: 1720, sku: "BREVILLEBARI2",
    rating: 4.9, reviewCount: 281, categorySlug: "kaffee", brandSlug: "breville",
    specs: [
      { key: "Brühgruppe", value: "58mm Edelstahl" },
      { key: "Mahlwerk", value: "Kegelmahlwerk Edelstahl" },
      { key: "Temperaturregulator", value: "PID" },
      { key: "Wasserkapazität", value: "2,0 Liter" },
      { key: "Bohnenbehälter", value: "270 g" },
      { key: "Leistung", value: "1600 Watt" },
      { key: "Mahlgrade", value: "30 Stufen" },
      { key: "Garantie", value: "2 Jahre" },
    ]
  },
  {
    name: "Breville Barista Touch", slug: "breville-barista-touch",
    description: "Die Breville Barista Touch kombiniert professionelle Espresso-Technologie mit einem intuitiven Touchdisplay. Das 4-Zoll-Farbtouchscreen zeigt alle Brühoptionen übersichtlich an und ermöglicht die Speicherung individueller Rezepte. Der integrierte Kegelmahlwerk aus Edelstahl mahlt die Bohnen frisch für jede Tasse. Der automatische Milchaufschäumer erzeugt in Sekunden perfekten Cappuccino-Schaum. Die Maschine bietet 6 voreingestellte Kaffeespezialitäten und individuelle Anpassungsmöglichkeiten. Der PID-Temperaturregulator sorgt für konstante Brühtemperaturen. Das kompakte Design passt in jede Küche und bietet dennoch Profi-Qualität. Ideal für alle, die einfachen Zugang zu Premium-Espresso suchen.", shortDesc: "Touchscreen-Espressomaschine mit automatischem Milchaufschäumer",
    price: 1230, sku: "BREVILLEBARISTA",
    rating: 4.8, reviewCount: 107, categorySlug: "kaffee", brandSlug: "breville",
    specs: [
      { key: "Display", value: "4-Zoll Farbtouch" },
      { key: "Brühgruppe", value: "58mm Edelstahl" },
      { key: "Mahlwerk", value: "Kegelmahlwerk" },
      { key: "Wasserkapazität", value: "2,8 Liter" },
      { key: "Bohnenbehälter", value: "120 g" },
      { key: "Leistung", value: "1600 Watt" },
      { key: "Rezept-Speicher", value: "6 Plätze" },
      { key: "Garantie", value: "2 Jahre" },
    ]
  },
  {
    name: "Sage Barista Express Impress", slug: "sage-barista-express-impress",
    description: "Die Sage Barista Express Impress ist eine Premium-Espressomaschine mit integriertem Mahlwerk. Das Impression-Dosing-System misst die Bohnenmenge automatisch präzise. Das Kegelmahlwerk aus Edelstahl mahlt die Bohnen besonders schonend. Der Crona-Milchaufschäumer erzeugt cremigen Mikroschaum. Die 58mm-Brühgruppe sorgt für gleichmäßige Extraktion. Die PID-Temperaturregulation hält die Brühtemperatur konstant. Das elegante Design in Edelstahl passt in jede Küche. Das absolute Flaggschiff für Home-Baristas.", shortDesc: "Sage-Premium-Espressomaschine mit Impression-Dosing und 58mm-Gruppe",
    price: 1360, originalPrice: 1564, sku: "SAGEBARISTAEXPR", isPromo: true,
    rating: 4.7, reviewCount: 241, categorySlug: "kaffee", brandSlug: "sage",
    specs: [
      { key: "Brühgruppe", value: "58mm Edelstahl" },
      { key: "Mahlwerk", value: "Kegelmahlwerk" },
      { key: "Temperaturregelung", value: "PID" },
      { key: "Wasserkapazität", value: "2,0 Liter" },
      { key: "Leistung", value: "1600 Watt" },
      { key: "Farbe", value: "Edelstahl" },
    ]
  },
  {
    name: "Sage The Oracle Touch", slug: "sage-the-oracle-touch",
    description: "Die Sage The Oracle Touch ist die ultimative Premium-Espressomaschine mit Touchdisplay. Das 4-Zoll-Farbtouchdisplay zeigt alle Brühoptionen übersichtlich an. Die automatische Milchaufschäumung erzeugt in Sekunden perfekten Cappuccino-Schaum. Die 58mm-Brühgruppe aus Edelstahl sorgt für gleichmäßige Extraktion. Die PID-Temperaturregulation hält die Brühtemperatur konstant. Die 6 voreingestellten Spezialitäten bieten Vielseitigkeit. Das elegante Design in Edelstahl passt in jede Küche. Das absolute Flaggschiff für Home-Baristas.", shortDesc: "Sage-Flaggschiff mit Touchdisplay und automatischer Milchaufschäumung",
    price: 2420, sku: "SAGETHEORACLETO",
    rating: 4.2, reviewCount: 179, categorySlug: "kaffee", brandSlug: "sage",
    specs: [
      { key: "Display", value: "4-Zoll Farbtouch" },
      { key: "Brühgruppe", value: "58mm Edelstahl" },
      { key: "Temperaturregelung", value: "PID" },
      { key: "Spezialitäten", value: "6 Sorten" },
      { key: "Wasserkapazität", value: "2,5 Liter" },
      { key: "Leistung", value: "2400 Watt" },
    ]
  },
  {
    name: "Sage The Dual Boiler", slug: "sage-the-dual-boiler",
    description: "Die Sage The Dual Boiler ist eine Premium-Espressomaschine mit 2 Heizsystemen. Die 2 separaten Heizsysteme ermöglichen gleichzeitiges Brühen und Aufschäumen. Die 58mm-Brühgruppe aus Edelstahl sorgt für gleichmäßige Extraktion. Die PID-Temperaturregulation hält die Brühtemperatur konstant. Der Crona-Milchaufschäumer erzeugt cremigen Mikroschaum. Die Präzisions-Dosierung ermöglicht individuelle Einstellungen. Das elegante Design in Edelstahl passt in jede Küche. Das Premium-Modell für anspruchsvolle Baristas.", shortDesc: "Sage-Premium-Espressomaschine mit Dual Boiler und PID",
    price: 1760, sku: "SAGETHEDUALBOIL",
    rating: 4.3, reviewCount: 176, categorySlug: "kaffee", brandSlug: "sage",
    specs: [
      { key: "Brühgruppe", value: "58mm Edelstahl" },
      { key: "Heizsystem", value: "2 separaten Thermojet" },
      { key: "Temperaturregelung", value: "PID" },
      { key: "Wasserkapazität", value: "2,5 Liter" },
      { key: "Leistung", value: "2400 Watt" },
      { key: "Farbe", value: "Edelstahl" },
    ]
  },
  {
    name: "Gastroback Design Espresso 42603", slug: "gastroback-design-espresso-42603",
    description: "Der Gastroback Design Espresso 42603 ist eine elegante Espressomaschine mit 15 bar Bruck. Die Edelstahl-Brühgruppe sorgt für gleichmäßige Extraktion. Der integrierte Milchaufschäumer erzeugt cremigen Milchschaum. Die einfache Ein-Tassen- und Zwei-Tassen-Brühung ermöglicht individuelle Zubereitung. Die Edelstahl-Tasse wärmt die Tasse vor. Das elegante Design in Schwarz und Edelstahl passt zu jeder Kücheneinrichtung. Perfekt für alle, die Espresso-Genuss im stilvollen Design suchen.", shortDesc: "Elegante Espressomaschine mit 15 bar und integriertem Milchaufschäumer",
    price: 1760, sku: "GASTROBACKDE2",
    rating: 4.5, reviewCount: 132, categorySlug: "kaffee", brandSlug: "gastroback",
    specs: [
      { key: "Brühdruck", value: "15 bar" },
      { key: "Milchaufschäumer", value: "Integriert" },
      { key: "Wasserkapazität", value: "1,5 Liter" },
      { key: "Leistung", value: "1350 Watt" },
      { key: "Farbe", value: "Schwarz/Edelstahl" },
    ]
  },
  {
    name: "Gastroback Advanced Espresso 42602", slug: "gastroback-advanced-espresso-42602",
    description: "Der Gastroback Advanced Espresso 42602 ist eine semi-automatische Espressomaschine mit 20 bar Druck. Die Edelstahl-Brühgruppe sorgt für gleichmäßige Extraktion. Der integrierte Milchaufschäumer erzeugt cremigen Milchschaum. Die 2 separaten Heizsysteme ermöglichen gleichzeitiges Brühen und Aufschäumen. Die Edelstahl-Tasse wärmt die Tasse vor. Das kompakte Design passt in jede Küche. Perfekt für Einsteiger, die Espresso-Genuss im Profi-Format suchen.", shortDesc: "Semi-automatische Espressomaschine mit 20 bar und 2 Heizsystemen",
    price: 330, originalPrice: 379, sku: "GASTROBACKADVAN", isPromo: true,
    rating: 4.3, reviewCount: 96, categorySlug: "kaffee", brandSlug: "gastroback",
    specs: [
      { key: "Brühdruck", value: "20 bar" },
      { key: "Heizsystem", value: "2 separates Thermoblock" },
      { key: "Milchaufschäumer", value: "Integriert" },
      { key: "Wasserkapazität", value: "1,8 Liter" },
      { key: "Leistung", value: "1450 Watt" },
      { key: "Farbe", value: "Edelstahl" },
    ]
  },
  {
    name: "Nespresso Lattissima Touch En560", slug: "nespresso-lattissima-touch-en560",
    description: "Die Nespresso Lattissima Touch EN560 ist die Premium-Kapselmaschine mit automatischem Milchschaumer. Das patented Fresh-Foam-System erzeugt in Sekunden cremigen Milchschaum für Cappuccino und Latte Macchiato. Die 6 Tasten bieten alle Kaffeespezialitäten auf einen Blick. Die automatische Tassenhöhenanpassung passt für große und kleine Tassen. Der abnehmbare Milchtank ist spülmaschinenfeste. Die 19 bar Brühdruck-Technologie extrahiert das volle Aroma. Die Energiesparfunktion schaltet die Maschine nach 9 Minuten Inaktivität aus. Das elegante Touch-Design in verschiedenen Farben unterstreicht den Premium-Anspruch. Perfekt für alle, die Milchgetränke ohne Aufwand genießen wollen.", shortDesc: "Premium-Kapselmaschine mit Fresh-Foam-Milchschaumer und 6 Touch-Tasten",
    price: 2440, sku: "NESPRESSOLATTIS", isFeatured: true, isNew: true,
    rating: 4.9, reviewCount: 117, categorySlug: "kaffee", brandSlug: "nespresso",
    specs: [
      { key: "Kaffeesystem", value: "Nespresso Original" },
      { key: "Brühdruck", value: "19 bar" },
      { key: "Milchsystem", value: "Fresh-Foam automatisch" },
      { key: "Tassenfunktionen", value: "6 Sorten" },
      { key: "Wasserkapazität", value: "1,0 Liter" },
      { key: "Leistung", value: "1400 Watt" },
      { key: "Aufheizzeit", value: "25 Sekunden" },
      { key: "Garantie", value: "2 Jahre" },
    ]
  },
  {
    name: "Nespresso Essenza Mini D50", slug: "nespresso-essenza-mini-d50",
    description: "Die Nespresso Essenza Mini D50 ist die kompakteste Nespresso-Maschine überhaupt. Mit nur 11 cm Breite und 20 cm Tiefe ist sie perfekt für kleine Küchen. Die 19 bar Hochdruck-Technologie extrahiert das volle Aroma aus jeder Nespresso-Kapsel. Die zwei Tassenfunktionen Espresso und Lungo bieten Vielseitigkeit. Die Energiesparfunktion schaltet die Maschine nach 9 Minuten Inaktivität aus. Das minimalistische Design in verschiedenen Farben passt zu jeder Kücheneinrichtung. Die automatische Abschaltfunktion spart Energie. Die Nespresso-Recycling-Box ermöglicht umweltgerechte Entsorgung. Der perfekte Einstieg in die Nespresso-Welt.", shortDesc: "Kompakteste Nespresso-Maschine mit 19 bar und 2 Tassenfunktionen",
    price: 1960, sku: "NESPRESSOESSENZ",
    rating: 4.4, reviewCount: 260, categorySlug: "kaffee", brandSlug: "nespresso",
    specs: [
      { key: "Kaffeesystem", value: "Nespresso Original" },
      { key: "Brühdruck", value: "19 bar" },
      { key: "Tassenfunktionen", value: "Espresso, Lungo" },
      { key: "Wasserkapazität", value: "0,6 Liter" },
      { key: "Leistung", value: "1400 Watt" },
      { key: "Aufheizzeit", value: "30 Sekunden" },
      { key: "Breite", value: "11 cm" },
      { key: "Garantie", value: "2 Jahre" },
    ]
  },
  {
    name: "Nespresso Vertuo Next", slug: "nespresso-vertuo-next",
    description: "Die Nespresso Vertuo Next ist die Vielseitigste Nespresso-Maschine mit 5 Tassengrößen. Die innovative Centrifusion-Technologie zentrifugiert die Kapsel mit bis zu 7.000 Umdrehungen pro Minute für optimalen Geschmack. Die Barcode-Technologie erkennt jede Kapsel automatisch und passt Brühzeit, Temperatur und Drehzahl an. Die 5 Tassengrößen Espresso, Double Espresso, Gran Lungo, Mug und Alto bieten Vielseitigkeit für jeden Moment. Die large-Cara-Kanne fasst bis zu 535 ml für große Tassen. Das elegante Design in verschiedenen Farben passt zu jeder Kücheneinrichtung. Die 100% recycelbaren Aluminium-Kapseln sind umweltfreundlich. Perfekt für alle, die Kaffeevielseitigkeit im modernen Design suchen.", shortDesc: "Vielseitigste Nespresso-Maschine mit Centrifusion und 5 Tassengrößen",
    price: 1440, sku: "NESPRESSOVER2", isFeatured: true,
    rating: 4.4, reviewCount: 86, categorySlug: "kaffee", brandSlug: "nespresso",
    specs: [
      { key: "Kaffeesystem", value: "Nespresso Vertuo" },
      { key: "Technologie", value: "Centrifusion" },
      { key: "Tassengrößen", value: "Espresso bis Alto (535 ml)" },
      { key: "Wasserkapazität", value: "1,7 Liter" },
      { key: "Leistung", value: "1600 Watt" },
      { key: "Aufheizzeit", value: "30 Sekunden" },
      { key: "Kapseln", value: "Nespresso Vertuo" },
      { key: "Garantie", value: "2 Jahre" },
    ]
  },
  {
    name: "Nespresso Vertuo Pop", slug: "nespresso-vertuo-pop",
    description: "Die Nespresso Vertuo Pop ist die kompakte Variante der Vertuo-Serie mit 5 Tassengrößen. Die Centrifusion-Technologie zentrifugiert die Kapsel mit bis zu 7.000 Umdrehungen pro Minute für optimalen Geschmack. Die Barcode-Technologie erkennt jede Kapsel automatisch und passt die Brühparameter an. Die 5 Tassengrößen bieten Vielseitigkeit für jeden Moment. Das kompakte Design von nur 14 cm Breite passt selbst in die kleinste Küche. Die verschiedenen Farboptionen machen jede Kaffeeecke zum Highlight. Die 100% recycelbaren Aluminium-Kapseln sind umweltfreundlich. Die Vertuo Pop ist der perfekte Einstieg in die Vertuo-Welt.", shortDesc: "Kompakte Vertuo-Maschine mit 5 Tassengrößen und Centrifusion",
    price: 690, originalPrice: 793, sku: "NESPRESSOVERTUO", isPromo: true,
    rating: 4.9, reviewCount: 42, categorySlug: "kaffee", brandSlug: "nespresso",
    specs: [
      { key: "Kaffeesystem", value: "Nespresso Vertuo" },
      { key: "Technologie", value: "Centrifusion" },
      { key: "Tassengrößen", value: "5 Größen" },
      { key: "Wasserkapazität", value: "0,8 Liter" },
      { key: "Leistung", value: "1400 Watt" },
      { key: "Breite", value: "14 cm" },
      { key: "Kapseln", value: "Nespresso Vertuo" },
      { key: "Garantie", value: "2 Jahre" },
    ]
  },
  {
    name: "Nespresso Citiz En895", slug: "nespresso-citiz-en895",
    description: "Die Nespresso Citiz EN895 ist eine elegante Kapselmaschine mit integriertem Milchschaumer. Das Whisper-Quiet-System macht die Maschine besonders leise beim Brühen. Die automatische Tassenhöhenanpassung passt für große und kleine Tassen. Die 19 bar Brühdruck-Technologie extrahiert das Aroma optimal aus jeder Nespresso-Kapsel. Der abnehmbare Milchtank erzeugt automatisch cremigen Milchschaum. Die Energiesparfunktion schaltet die Maschine nach 9 Minuten Inaktivität aus. Das kompakte Design von nur 23 cm Breite passt in jede Küche. Die Nespresso-Recycling-Box ermöglicht umweltgerechte Entsorgung der Kapseln. Perfekt für alle, die Kaffee-Genuss und Design schätzen.", shortDesc: "Elegante Kapselmaschine mit leisem Betrieb und integriertem Milchschaumer",
    price: 1410, originalPrice: 1621, sku: "NESPRESSOCITIZE", isPromo: true,
    rating: 4.7, reviewCount: 297, categorySlug: "kaffee", brandSlug: "nespresso",
    specs: [
      { key: "Kaffeesystem", value: "Nespresso Original" },
      { key: "Brühdruck", value: "19 bar" },
      { key: "Milchsystem", value: "Abnehmbarer Milchtank" },
      { key: "Wasserkapazität", value: "1,0 Liter" },
      { key: "Leistung", value: "1200 Watt" },
      { key: "Aufheizzeit", value: "25 Sekunden" },
      { key: "Breite", value: "23 cm" },
      { key: "Garantie", value: "2 Jahre" },
    ]
  },
  {
    name: "Lavazza A Modo Mio Jl01", slug: "lavazza-a-modo-mio-jl01",
    description: "Die Lavazza A Modo Mio JL01 ist ein kompakter Kapselkaffeemacher im typischen Lavazza-Design. Das patentierte A Modo Mio-System extrahiert Kaffee mit optimalem Druck für authentischen italienischen Espresso. Die Kapseln sind speziell für die ideale Extraktionszeit entwickelt. Die Maschine bringt sich in 25 Sekunden auf Betriebstemperatur. Die abnehmbare Auffangschale passt für große und kleine Tassen. Das kompakte Design von nur 20 cm Breite passt in jede Küche. Die Lavazza-Blend-Kapseln bieten authentischen italienischen Kaffee-Geschmack. Perfekt für alle, die italienischen Espresso ohne Aufwand genießen wollen.", shortDesc: "Kompakter Lavazza-Kapselkaffeemacher für authentischen italienischen Espresso",
    price: 1430, originalPrice: 1644, sku: "LAVAZZAAMODOMIO", isPromo: true,
    rating: 4.4, reviewCount: 82, categorySlug: "kaffee", brandSlug: "lavazza",
    specs: [
      { key: "Kaffeesystem", value: "Lavazza A Modo Mio" },
      { key: "Brühdruck", value: "10 bar" },
      { key: "Wasserkapazität", value: "1,0 Liter" },
      { key: "Leistung", value: "1500 Watt" },
      { key: "Aufheizzeit", value: "25 Sekunden" },
      { key: "Kapselkompatibilität", value: "Lavazza A Modo Mio" },
      { key: "Abmessungen", value: "20 x 30 x 35 cm" },
      { key: "Garantie", value: "2 Jahre" },
    ]
  },
  {
    name: "Lavazza Idola Clt2020", slug: "lavazza-idola-clt2020",
    description: "Die Lavazza Idola CLT2020 ist ein modisches Kapselsystem mit 3 Tassengrößen. Das intelligente Kapselsystem erkennt automatisch die Kapselgröße und passt die Brühmenge an. Die 3 Tassengrößen Ristretto, Espresso und Lungo bieten Vielseitigkeit für jeden Moment. Die kompakte Bauform von nur 15 cm Breite passt selbst in die kleinste Küche. Die Energiesparfunktion schaltet die Maschine nach 9 Minuten Inaktivität aus. Das moderne Design in verschiedenen Farben passt zu jeder Kücheneinrichtung. Die Lavazza-Kapseln bieten authentischen italienischen Kaffee-Geschmack. Perfekt für alle, die italienischen Kaffee-Genuss im kompakten Format suchen.", shortDesc: "Kompaktes Kapselsystem mit 3 Tassengrößen und automatischer Erkennung",
    price: 470, sku: "LAVAZZAIDOLACLT", isNew: true,
    rating: 4.2, reviewCount: 267, categorySlug: "kaffee", brandSlug: "lavazza",
    specs: [
      { key: "Kaffeesystem", value: "Lavazza Idola" },
      { key: "Tassengrößen", value: "Ristretto, Espresso, Lungo" },
      { key: "Brühdruck", value: "10 bar" },
      { key: "Wasserkapazität", value: "0,8 Liter" },
      { key: "Leistung", value: "1400 Watt" },
      { key: "Breite", value: "15 cm" },
      { key: "Energiesparmodus", value: "Ja" },
      { key: "Garantie", value: "2 Jahre" },
    ]
  },
  {
    name: "Dyson V12 Detect Slim", slug: "dyson-v12-detect-slim",
    description: "Der Dyson V12 Detect Slim ist ein leichter kabelloser Akkusauger mit Laser-Erkennung. Die Laser-Technologie macht unsichtbaren Staub auf harten Böden sichtbar. Die Piezo-Sensorik erkennt die Staubmenge und passt die Leistung automatisch an. Die 60 Minuten Laufzeit reicht für gründliche Reinigungen. Die hygienische Entleerung erfordert keinen Kontakt mit Staub. Die multiple Ausstattung bietet Werkzeuge für jeden Einsatzzweck. Das LCD-Display zeigt Echtzeitdaten über die Reinigung. Perfekt für alle, die Leistung und Handlichkeit kombinieren möchten.", shortDesc: "Leichter Dyson-Akkusauger mit Laser-Erkennung und 60 Min. Laufzeit",
    price: 490, originalPrice: 564, sku: "DYSONV12DETECTS", isPromo: true,
    rating: 4.8, reviewCount: 292, categorySlug: "reinigung", brandSlug: "dyson",
    specs: [
      { key: "Leistung", value: "150 AW" },
      { key: "Motor", value: "Dyson Hyperdymium" },
      { key: "Laufzeit", value: "Bis zu 60 Minuten" },
      { key: "Filter", value: "5-stufig" },
      { key: "Gewicht", value: "2,2 kg" },
      { key: "Farbe", value: "Gelb/Nickel" },
    ]
  },
  {
    name: "Dyson V8 Absolute", slug: "dyson-v8-absolute",
    description: "Der Dyson V8 Absolute ist ein bewährter kabelloser Akkusauger mit bewährter Dyson-Technologie. Die 2-Tier-Radial-Zyklone erzeugt bis zu 15 cyklonartige Rotationsbewegungen für gründliches Saugen. Die 40 Minuten Laufzeit reicht für die tägliche Reinigung. Die hygienische Entleerung erfordert keinen Kontakt mit Staub. Die multiple Ausstattung bietet Werkzeuge für Böden, Polster und enge Ecken. Die Wandhalterung sorgt für platzsparende Aufbewahrung. Das bewährte Dyson-Design bietet Zuverlässigkeit und Langlebigkeit. Perfekt für den täglichen Gebrauch.", shortDesc: "Bewährter Dyson-Akkusauger mit 40 Min. Laufzeit und 2-Tier-Zyklonen",
    price: 490, sku: "DYSONV8ABSOLUTE",
    rating: 4.4, reviewCount: 301, categorySlug: "reinigung", brandSlug: "dyson",
    specs: [
      { key: "Leistung", value: "151 AW" },
      { key: "Motor", value: "Dyson V8" },
      { key: "Laufzeit", value: "Bis zu 40 Minuten" },
      { key: "Filter", value: "Whole-machine" },
      { key: "Gewicht", value: "2,6 kg" },
      { key: "Farbe", value: "Nickel/Blau" },
    ]
  },
  {
    name: "Roborock S8 Maxv Ultra", slug: "roborock-s8-maxv-ultra",
    description: "Der Roborock S8 MaxV Ultra ist der Premium-Saugroboter mit intelligenter KI-Navigation. Die 8200 Pa Saugkraft entfernt Staub und Schmutz gründlich. Die ReactiveAI 2.0-Technologie erkennt Hindernisse und vermeidet Kollisionen. Die VibraRise 2.0-Wischtechnologie schrubbt den Boden mit 3000 Vibrationen pro Minute. Die automatische Staubertertiung bei voll gedocktem Base-Station bis zu 7 Wochen. Die App-Steuerung ermöglicht die Fernbedienung von überall. Die Kompatibilität mit Alexa und Google Home bietet Sprachsteuerung. Das absolute Flaggschiff für makellose Sauberkeit.", shortDesc: "Premium-Saugroboter mit 8200 Pa, ReactiveAI und VibraRise Wischtechnologie",
    price: 550, sku: "ROBOROCKS8MAXVU",
    rating: 4.2, reviewCount: 156, categorySlug: "reinigung", brandSlug: "roborock",
    specs: [
      { key: "Saugkraft", value: "8200 Pa" },
      { key: "Navigation", value: "ReactiveAI 2.0" },
      { key: "Wischtechnologie", value: "VibraRise 2.0" },
      { key: "Laufzeit", value: "Bis zu 180 Minuten" },
      { key: "Basisstation", value: "Ja (automatische Entleerung)" },
      { key: "Farbe", value: "Schwarz" },
    ]
  },
  {
    name: "Roborock Q8 Max Plus", slug: "roborock-q8-max-plus",
    description: "Der Roborock Q8 Max+ ist ein intelligenter Saugroboter mit Wischfunktion und automatischer Staubertertiung. Die 5500 Pa Saugkraft entfernt Staub und Schmutz gründlich. Die LiDAR-Navigation erkennt den Grundriss und plant optimale Reinigungswege. Die 300 ml Wasserbehälter Wischt feucht den Boden. Die automatische Staubertertiung bei voll gedocktem Base-Station bis zu 7 Wochen. Die App-Steuerung ermöglicht die Fernbedienung von überall. Die Kompatibilität mit Alexa und Google Home bietet Sprachsteuerung. Perfekt für die automatische Reinigung von großen Wohnungen.", shortDesc: "Intelligenter Saug-Wisch-Roboter mit LiDAR und automatischer Entleerung",
    price: 630, sku: "ROBOROCKQ8MAXPL",
    rating: 4.7, reviewCount: 63, categorySlug: "reinigung", brandSlug: "roborock",
    specs: [
      { key: "Saugkraft", value: "5500 Pa" },
      { key: "Navigation", value: "LiDAR" },
      { key: "Laufzeit", value: "Bis zu 180 Minuten" },
      { key: "Wasserbehälter", value: "300 ml" },
      { key: "Basisstation", value: "Ja (automatische Entleerung)" },
      { key: "Farbe", value: "Schwarz/Weiß" },
    ]
  },
  {
    name: "iRobot Roomba J9 Plus", slug: "irobot-roomba-j9-plus",
    description: "Der iRobot Roomba j9+ ist der Premium-Saugroboter von iRobot mit fortschrittlicher Navigation. Die 3-Stufen-Reinigungssystem saugt gründlich auf allen Böden. Die PrecisionVision-Navigation erkennt Hindernisse und vermeidet Kollisionen. Die Smart-Mapping-Technologie lernt die Grundrisse Ihres Zuhauses. Die App-Steuerung ermöglicht die Fernbedienung von überall. Die automatische Staubertertiung bei voll gedocktem Base-Station. Die intelligente Erkennung von verschmutzten Bereichen für gründliche Reinigung. Das Premium-Modell für maximale Reinigungsleistung.", shortDesc: "Premium-Saugroboter mit PrecisionVision und automatischer Staubertertiung",
    price: 290, sku: "IROBOTROOMBAJ9P", isNew: true,
    rating: 4.5, reviewCount: 38, categorySlug: "reinigung", brandSlug: "irobot",
    specs: [
      { key: "Reinigung", value: "3-Stufen Saugsystem" },
      { key: "Navigation", value: "PrecisionVision" },
      { key: "Laufzeit", value: "Bis zu 75 Minuten" },
      { key: "Basisstation", value: "Ja (automatische Entleerung)" },
      { key: "Gewicht", value: "3,4 kg" },
      { key: "Farbe", value: "Grau/Schwarz" },
    ]
  },
  {
    name: "iRobot Roomba Combo J5 Plus", slug: "irobot-roomba-combo-j5-plus",
    description: "Der iRobot Roomba Combo j5+ ist ein intelligenter Saugroboter mit Wischfunktion. Die 3-Stufen-Reinigungssystem saugt und wischt automatisch. Die PrecisionVision-Navigation erkennt Hindernisse und vermeidet Kollisionen. Die Smart-Mapping-Technologie lernt die Grundrisse Ihres Zuhauses. Die App-Steuerung ermöglicht die Fernbedienung von überall. Die Kompatibilität mit Alexa und Google Home bietet Sprachsteuerung. Die automatische Staubertertiung bei voll gedocktem Base-Station. Perfekt für die automatische Reinigung von harten Böden und Teppichen.", shortDesc: "Intelligenter Saug-Wisch-Roboter mit PrecisionVision und Smart Mapping",
    price: 680, sku: "IROBOTROOMBACOM",
    rating: 4, reviewCount: 29, categorySlug: "reinigung", brandSlug: "irobot",
    specs: [
      { key: "Reinigung", value: "Saugen & Wischen" },
      { key: "Navigation", value: "PrecisionVision" },
      { key: "Laufzeit", value: "Bis zu 75 Minuten" },
      { key: "Basisstation", value: "Ja (automatische Entleerung)" },
      { key: "Gewicht", value: "3,1 kg" },
      { key: "Farbe", value: "Grau" },
    ]
  },
  {
    name: "Xiaomi Robot Vacuum X10 Plus", slug: "xiaomi-robot-vacuum-x10-plus",
    description: "Der Xiaomi Robot Vacuum X10+ ist ein intelligenter Saugroboter mit LDS-Navigation. Die LDS-Navigation erkennt den Grundriss und plant optimale Reinigungswege. Die 4000 Pa Saugkraft entfernt Staub und Schmutz gründlich. Die Wischfunktion reinigt den Boden feucht. Die automatische Staubertertiung bei voll gedocktem Base-Station. Die App-Steuerung ermöglicht die Fernbedienung von überall. Die Kompatibilität mit Alexa und Google Home bietet Sprachsteuerung. Das Preis-Leistungs-Wunder für automatische Reinigung.", shortDesc: "Xiaomi-Saugroboter mit LDS-Navigation und automatischer Entleerung",
    price: 2080, sku: "XIAOMIROBOTVACU", isFeatured: true,
    rating: 4.2, reviewCount: 117, categorySlug: "reinigung", brandSlug: "xiaomi",
    specs: [
      { key: "Saugkraft", value: "4000 Pa" },
      { key: "Navigation", value: "LDS Laser" },
      { key: "Laufzeit", value: "Bis zu 180 Minuten" },
      { key: "Wasserbehälter", value: "200 ml" },
      { key: "Basisstation", value: "Ja (automatische Entleerung)" },
      { key: "Farbe", value: "Weiß" },
    ]
  },
  {
    name: "Xiaomi Roborock Pro", slug: "xiaomi-roborock-pro",
    description: "Der Xiaomi Roborock Pro ist ein intelligenter Saugroboter mit LiDAR-Navigation. Die 4000 Pa Saugkraft entfernt Staub und Schmutz gründlich. Die LiDAR-Navigation erkennt den Grundriss und plant optimale Reinigungswege. Die Wischfunktion reinigt den Boden feucht. Die App-Steuerung ermöglicht die Fernbedienung von überall. Die Kompatibilität mit Alexa und Google Home bietet Sprachsteuerung. Die automatische Erhöhung der Saugleistung auf Teppichen. Das Preis-Leistungs-Wunder für automatische Reinigung.", shortDesc: "Intelligenter Saugroboter mit LiDAR und 4000 Pa Saugkraft",
    price: 390, sku: "XIAOMIROBOROCKP", isNew: true,
    rating: 4.8, reviewCount: 87, categorySlug: "reinigung", brandSlug: "xiaomi",
    specs: [
      { key: "Saugkraft", value: "4000 Pa" },
      { key: "Navigation", value: "LiDAR" },
      { key: "Laufzeit", value: "Bis zu 180 Minuten" },
      { key: "Wasserbehälter", value: "200 ml" },
      { key: "Gewicht", value: "3,6 kg" },
      { key: "Farbe", value: "Weiß" },
    ]
  },
  {
    name: "Samsung Jet Bot Ai Plus Vr50t9990", slug: "samsung-jet-bot-ai-plus-vr50t9990",
    description: "Der Samsung Jet Bot AI+ VR50T9990 ist ein intelligenter Saugroboter mit KI-Navigation. Die KI-Navigation erkennt Hindernisse und vermeidet Kollisionen. Die 5100 Pa Saugkraft entfernt Staub und Schmutz gründlich. Die 3D-Sensorik scannt den Raum in Echtzeit. Die automatische Staubertertiung bei voll gedocktem Base-Station. Die App-Steuerung ermöglicht die Fernbedienung von überall. Die Live-View-Kamera zeigt den Live-Feed des Roboters. Das absolute Flaggschiff für automatische Reinigung.", shortDesc: "Samsung-Flaggschiff-Saugroboter mit KI und 5100 Pa Saugkraft",
    price: 1710, sku: "SAMSUNGJETBOTAI",
    rating: 4.6, reviewCount: 151, categorySlug: "reinigung", brandSlug: "samsung",
    specs: [
      { key: "Saugkraft", value: "5100 Pa" },
      { key: "Navigation", value: "KI + 3D-Sensorik" },
      { key: "Laufzeit", value: "Bis zu 180 Minuten" },
      { key: "Basisstation", value: "Ja (automatische Entleerung)" },
      { key: "Farbe", value: "Weiß" },
    ]
  },
  {
    name: "LG Cordzero A9 Kompressor", slug: "lg-cordzero-a9-kompressor",
    description: "Der LG CordZero A9 Kompressor ist ein kabelloser Akkusauger mit Kompressor-Technologie. Die Kompressor-Technologie sorgt für konstante Saugleistung. Die 2 Batterien bieten bis zu 80 Minuten Laufzeit. Die Power-Funktion erhöht die Saugleistung für schwere Verschmutzungen. Die Smart-Inverter-Motor arbeitet besonders leise und langlebig. Die multiple Ausstattung bietet Werkzeuge für jeden Einsatzzweck. Die Wandhalterung sorgt für platzsparende Aufbewahrung. Perfekt für gründliches Saugen.", shortDesc: "Kabelloser Akkusauger mit Kompressor und 80 Min. Laufzeit",
    price: 1350, originalPrice: 1552, sku: "LGCORDZEROA9KOM", isFeatured: true, isPromo: true,
    rating: 4.3, reviewCount: 70, categorySlug: "reinigung", brandSlug: "lg",
    specs: [
      { key: "Laufzeit", value: "Bis zu 80 Minuten" },
      { key: "Technologie", value: "Kompressor" },
      { key: "Motor", value: "Smart Inverter" },
      { key: "Gewicht", value: "2,7 kg" },
      { key: "Farbe", value: "Schwarz" },
    ]
  },
  {
    name: "LG Cordzero Thinq R9", slug: "lg-cordzero-thinq-r9",
    description: "Der LG CordZero ThinQ R9 ist ein intelligenter Saugroboter mit AI-Navigation. Die AI-Navigation erkennt Hindernisse und plant optimale Reinigungswege. Die 5100 Pa Saugkraft entfernt Staub und Schmutz gründlich. Die Wischfunktion reinigt den Boden feucht. Die automatische Staubertertiung bei voll gedocktem Base-Station. Die App-Steuerung ermöglicht die Fernbedienung von überall. Die Kompatibilität mit Alexa und Google Home bietet Sprachsteuerung. Das absolute Flaggschiff für automatische Reinigung.", shortDesc: "Intelligenter Saugroboter mit AI-Navigation und 5100 Pa Saugkraft",
    price: 900, originalPrice: 1035, sku: "LGCORDZEROTHINQ", isPromo: true,
    rating: 4.1, reviewCount: 303, categorySlug: "reinigung", brandSlug: "lg",
    specs: [
      { key: "Saugkraft", value: "5100 Pa" },
      { key: "Navigation", value: "AI (LiDAR + Kamera)" },
      { key: "Laufzeit", value: "Bis zu 180 Minuten" },
      { key: "Wasserbehälter", value: "200 ml" },
      { key: "Farbe", value: "Schwarz" },
    ]
  },
  {
    name: "Kärcher Vc5 Cordless", slug: "kaercher-vc5-cordless",
    description: "Der Kärcher VC5 Cordless ist ein kompakter kabelloser Akkusauger für kleine Wohnungen. Die 18V-Lithium-Ionen-Batterie bietet bis zu 30 Minuten Laufzeit. Der rotierende Bürstenwalze sorgt für gründliches Saugen auf allen Böden. Die multiple Ausstattung bietet Werkzeuge für jeden Einsatzzweck. Die hygienische Entleerung erfordert keinen Kontakt mit Staub. Die kompakte Bauform lässt sich platzsparend aufbewahren. Das leichtgewichtige Design ermöglicht müheloses Tragen. Perfekt für kleine Wohnungen und schnelle Reinigungen.", shortDesc: "Kompakter kabelloser Akkusauger mit 30 Min. Laufzeit",
    price: 720, sku: "KAERCHERVC5CORD",
    rating: 4.8, reviewCount: 153, categorySlug: "reinigung", brandSlug: "kaercher",
    specs: [
      { key: "Akku", value: "18V Li-Ionen" },
      { key: "Laufzeit", value: "Bis zu 30 Minuten" },
      { key: "Aufladung", value: "3 Stunden" },
      { key: "Volumen", value: "0,2 Liter" },
      { key: "Gewicht", value: "1,5 kg" },
      { key: "Farbe", value: "Schwarz/Orange" },
    ]
  },
  {
    name: "Kärcher Vc3 Cordless", slug: "kaercher-vc3-cordless",
    description: "Der Kärcher VC3 Cordless ist ein kabelloser Akkusauger für komfortables Saugen ohne Kabel. Die 18V-Lithium-Ionen-Batterie bietet bis zu 30 Minuten Laufzeit. Der rotierende Bürstenwalze sorgt für gründliches Saugen auf allen Böden. Die multiple Ausstattung bietet Werkzeuge für jeden Einsatzzweck. Die hygienische Entleerung erfordert keinen Kontakt mit Staub. Die Wandhalterung sorgt für platzsparende Aufbewahrung. Das leichtgewichtige Design ermöglicht müheloses Tragen. Perfekt für schnelle und komfortable Reinigung im Alltag.", shortDesc: "Kabelloser Akkusauger mit 30 Min. Laufzeit und rotierender Bürste",
    price: 280, originalPrice: 322, sku: "KAERCHERVC3CORD", isPromo: true,
    rating: 4.3, reviewCount: 268, categorySlug: "reinigung", brandSlug: "kaercher",
    specs: [
      { key: "Akku", value: "18V Li-Ionen" },
      { key: "Laufzeit", value: "Bis zu 30 Minuten" },
      { key: "Aufladung", value: "3 Stunden" },
      { key: "Volumen", value: "0,2 Liter" },
      { key: "Gewicht", value: "2,2 kg" },
      { key: "Farbe", value: "Schwarz/Orange" },
    ]
  },
  {
    name: "Miele Triflex Hx2 Pro", slug: "miele-triflex-hx2-pro",
    description: "Die Miele Triflex HX2 Pro ist ein kabelloser Akkusauger im 3-in-1-Design. Die 3-in-1-Funktionalität ermöglicht Saugen als Hand-, Stiel- oder Stecksauger. Die 3D-Drallbürste sorgt für gründliches Saugen auf allen Böden. Die Varta-Li-Ionen-Batterie bietet bis zu 60 Minuten Laufzeit. Die elektrostatische Aufladung verhindert Haarverfilzung. Die ComfortFunktion sorgt für ergonomisches Saugen. Das elegante Design passt zu jeder Haushaltsführung. Perfekt für vielseitiges Saugen.", shortDesc: "Kabelloser 3-in-1-Akkusauger mit 60 Min. Laufzeit und 3D-Drallbürste",
    price: 330, originalPrice: 379, sku: "MIELETRIFLEXHX2", isPromo: true,
    rating: 4.5, reviewCount: 42, categorySlug: "reinigung", brandSlug: "miele",
    specs: [
      { key: "Laufzeit", value: "Bis zu 60 Minuten" },
      { key: "Design", value: "3-in-1" },
      { key: "Bürste", value: "3D-Drallbürste" },
      { key: "Gewicht", value: "2,6 kg" },
      { key: "Farbe", value: "Weiß" },
    ]
  },
  {
    name: "Miele Scout Rx3 Home Vision", slug: "miele-scout-rx3-home-vision",
    description: "Der Miele Scout RX3 Home Vision ist ein intelligenter Saugroboter mit 3D-Navigation. Die 3D-Navigation erkennt Hindernisse und plant optimale Reinigungswege. Die 3000 Pa Saugkraft entfernt Staub und Schmutz gründlich. Die Wischfunktion reinigt den Boden feucht. Die App-Steuerung ermöglicht die Fernbedienung von überall. Die Home Vision-Kamera zeigt den Live-Feed des Roboters. Die automatische Rückkehrladung ist standard. Das Premium-Modell für automatische Reinigung.", shortDesc: "Miele-Saugroboter mit 3D-Navigation und Home Vision",
    price: 1130, sku: "MIELESCOUTRX3HO",
    rating: 4, reviewCount: 268, categorySlug: "reinigung", brandSlug: "miele",
    specs: [
      { key: "Saugkraft", value: "3000 Pa" },
      { key: "Navigation", value: "3D" },
      { key: "Laufzeit", value: "Bis zu 120 Minuten" },
      { key: "Wasserbehälter", value: "200 ml" },
      { key: "Farbe", value: "Weiß" },
    ]
  },
  {
    name: "Philips 8000 Series Led", slug: "philips-8000-series-led",
    description: "Die Philips 8000 Series LED ist ein Premium-Traubsauger mit LED-Technologie. Die LED-Beleuchtung am Saugkopf macht Staub in dunklen Ecken sichtbar. Die 18V-Li-Ionen-Batterie bietet bis zu 60 Minuten Laufzeit. Die PowerBlade-Technologie sorgt für maximale Saugleistung. Die TriActive-Türbürste entfernt Staub gründlich. Die EasyClean-Technologie ermöglicht einfache Reinigung der Bürste. Die Wandhalterung sorgt für platzsparende Aufbewahrung. Das Premium-Modell für makellose Sauberkeit.", shortDesc: "Philips-Premium-Traubsauger mit LED und 60 Min. Laufzeit",
    price: 1480, sku: "PHILIPS8000SERI", isFeatured: true,
    rating: 4.4, reviewCount: 198, categorySlug: "reinigung", brandSlug: "philips",
    specs: [
      { key: "Akku", value: "18V Li-Ionen" },
      { key: "Laufzeit", value: "Bis zu 60 Minuten" },
      { key: "Technologie", value: "PowerBlade" },
      { key: "Gewicht", value: "3,4 kg" },
      { key: "Farbe", value: "Anthrazit" },
    ]
  },
  {
    name: "Philips Powerproactive", slug: "philips-powerproactive",
    description: "Die Philips PowerProActive ist ein kabelloser Akkusauger mit PowerCyclone-Technologie. Die PowerCyclone-Technologie erzeugt starke Saugkraft. Die 18V-Li-Ionen-Batterie bietet bis zu 50 Minuten Laufzeit. Die LED-Beleuchtung am Saugkopf macht Staub sichtbar. Die TriActive-Bürste entfernt Staub gründlich. Die Easy-Entleerung erfordert keinen Kontakt mit Staub. Die Wandhalterung sorgt für platzsparende Aufbewahrung. Perfekt für alltägliches Saugen.", shortDesc: "Kabelloser Philips-Akkusauger mit PowerCyclone und 50 Min.",
    price: 600, sku: "PHILIPSPOWERPRO",
    rating: 4, reviewCount: 138, categorySlug: "reinigung", brandSlug: "philips",
    specs: [
      { key: "Akku", value: "18V Li-Ionen" },
      { key: "Laufzeit", value: "Bis zu 50 Minuten" },
      { key: "Technologie", value: "PowerCyclone" },
      { key: "Gewicht", value: "3,0 kg" },
      { key: "Farbe", value: "Lila" },
    ]
  },
  {
    name: "Electrolux 800 Animalcare", slug: "electrolux-800-animalcare",
    description: "Der Electrolux 800 AnimalCare ist ein kabelloser Akkusauger für Tierhaarbesitzer. Die PowerPro-Bürste entfernt Tierhaare gründlich. Die 18V-Li-Ionen-Batterie bietet bis zu 50 Minuten Laufzeit. Die LED-Beleuchtung am Saugkopf macht Staub in dunklen Ecken sichtbar. Die Easy-Empty-Entleerung erfordert keinen Kontakt mit Staub. Die Wandhalterung sorgt für platzsparende Aufbewahrung. Das elegante Design passt zu jeder Haushaltsführung. Perfekt für Tierbesitzer.", shortDesc: "Kabelloser Akkusauger mit PowerPro-Bürste für Tierhaar",
    price: 2990, sku: "ELECTROLUX800AN",
    rating: 4.5, reviewCount: 80, categorySlug: "reinigung", brandSlug: "electrolux",
    specs: [
      { key: "Akku", value: "18V Li-Ionen" },
      { key: "Laufzeit", value: "Bis zu 50 Minuten" },
      { key: "Gewicht", value: "2,9 kg" },
      { key: "Besonderheit", value: "Tierhaar-optimiert" },
      { key: "Farbe", value: "Titan/Dunkelgrau" },
    ]
  },
  {
    name: "AEG Well Q7 Animal", slug: "aeg-well-q7-animal",
    description: "Der AEG Well Q7 Animal ist ein kabelloser Akkusauger für Tierhaarbesitzer. Die Battery-Health-Anzeige zeigt den Ladezustand an. Die Motorized-Brushroll entfernt Tierhaare gründlich. Die 2-in-1-Funktionalität ermöglicht das Saugen von Böden und Polstern. Die Easy-Release-Entleerung erfordert keinen Kontakt mit Staub. Die Wandhalterung sorgt für platzsparende Aufbewahrung. Das elegante Design in various Farben passt zu jeder Haushaltsführung. Perfekt für Tierbesitzer.", shortDesc: "Kabelloser Akkusauger mit Tierhaar-Bürste und Battery-Health",
    price: 2030, sku: "AEGWELLQ7ANIMAL",
    rating: 4.6, reviewCount: 129, categorySlug: "reinigung", brandSlug: "aeg",
    specs: [
      { key: "Akku", value: "18V Li-Ionen" },
      { key: "Laufzeit", value: "Bis zu 50 Minuten" },
      { key: "Gewicht", value: "2,7 kg" },
      { key: "Besonderheit", value: "Tierhaar-optimiert" },
      { key: "Farbe", value: "Titan/Dunkelgrau" },
    ]
  },
  {
    name: "Bosch Unlimited Serie8 Bss81pob", slug: "bosch-unlimited-serie8-bss81pob",
    description: "Der Bosch Unlimited Serie 8 BSS81POB ist ein Premium-kabelloser Akkusauger mit Exchangeable-Battery-System. Die austauschbare Batterie ermöglicht unbegrenzte Laufzeit. Die AllFloor-HighPower-Bürste sorgt für gründliches Saugen. Die LED-Beleuchtung am Saugkopf macht Staub sichtbar. Die multiple Ausstattung bietet Werkzeuge für jeden Einsatzzweck. Die Wandhalterung sorgt für platzsparende Aufbewahrung. Das Premium-Design in various Farben passt zu jeder Haushaltsführung. Das absolute Flaggschiff für kabelloses Saugen.", shortDesc: "Premium-kabelloser Akkusauger mit austauschbarer Batterie",
    price: 1580, sku: "BOSCHUNLIMITEDS",
    rating: 4.4, reviewCount: 63, categorySlug: "reinigung", brandSlug: "bosch",
    specs: [
      { key: "Akku", value: "18V Li-Ionen (austauschbar)" },
      { key: "Laufzeit", value: "Bis zu 40 Minuten (pro Batterie)" },
      { key: "Gewicht", value: "3,0 kg" },
      { key: "Farbe", value: "Anthrazit/Gold" },
    ]
  },
  {
    name: "Bosch Serie6 Bbh3d122", slug: "bosch-serie6-bbh3d122",
    description: "Der Bosch Serie 6 BBH3D122 ist ein kabelloser Akkusauger mit AllFloor-HighPower-Bürste. Die AllFloor-HighPower-Bürste sorgt für gründliches Saugen auf allen Böden. Die 18V-Li-Ionen-Batterie bietet bis zu 40 Minuten Laufzeit. Die LED-Beleuchtung am Saugkopf macht Staub in dunklen Ecken sichtbar. Die Easy-Klick-Aufnahme ermöglicht schnellen Wechsel der Aufsätze. Die Wandhalterung sorgt für platzsparende Aufbewahrung. Das kompakte Design passt in jede Küche. Perfekt für schnelle und gründliche Reinigung.", shortDesc: "Kabelloser Bosch-Akkusauger mit AllFloor-HighPower-Bürste",
    price: 590, originalPrice: 679, sku: "BOSCHSERIE6BBH3", isPromo: true,
    rating: 4.5, reviewCount: 303, categorySlug: "reinigung", brandSlug: "bosch",
    specs: [
      { key: "Akku", value: "18V Li-Ionen" },
      { key: "Laufzeit", value: "Bis zu 40 Minuten" },
      { key: "Gewicht", value: "3,0 kg" },
      { key: "Farbe", value: "Weiß/Anthrazit" },
    ]
  },
  {
    name: "Siemens Rs5 Pro", slug: "siemens-rs5-pro",
    description: "Der Siemens RS5 Pro ist ein intelligenter Saugroboter mit iSensoric-Technologie. Die iSensoric-Technologie erkennt Hindernisse und vermeidet Kollisionen. Die 4000 Pa Saugkraft entfernt Staub und Schmutz gründlich. Die Wischfunktion reinigt den Boden feucht. Die App-Steuerung ermöglicht die Fernbedienung von überall. Die Kompatibilität mit Alexa und Google Home bietet Sprachsteuerung. Das kompakte Design erreicht alle Ecken. Perfekt für automatische Reinigung.", shortDesc: "Intelligenter Saugroboter mit iSensoric und 4000 Pa Saugkraft",
    price: 2960, sku: "SIEMENSRS5PRO",
    rating: 4.6, reviewCount: 46, categorySlug: "reinigung", brandSlug: "siemens",
    specs: [
      { key: "Saugkraft", value: "4000 Pa" },
      { key: "Navigation", value: "iSensoric" },
      { key: "Laufzeit", value: "Bis zu 120 Minuten" },
      { key: "Wasserbehälter", value: "200 ml" },
      { key: "Farbe", value: "Schwarz/Weiß" },
    ]
  },
  {
    name: "Samsung Bespoke Jet Complete", slug: "samsung-bespoke-jet-complete",
    description: "Der Samsung Bespoke Jet Complete ist ein kabelloser Akkusauger im Premium-Design. Die 210W Motorleistung sorgt für starke Saugkraft. Die 60 Minuten Laufzeit reicht für große Reinigungen. Die Multiple-Floor-Brush entfernt Staub von jedem Boden. Die LED-Beleuchtung am Saugkopf macht Staub sichtbar. Die easy-reach-Düse erreicht schwer zugängliche Stellen. Die automatische Rückkehrladung ist standard. Das elegante Bespoke-Design passt zu jeder Haushaltsführung.", shortDesc: "Samsung-Premium-Akkusauger mit 210W und Bespoke-Design",
    price: 2790, sku: "SAMSUNGBESPOKEJ",
    rating: 4.1, reviewCount: 230, categorySlug: "reinigung", brandSlug: "samsung",
    specs: [
      { key: "Leistung", value: "210W" },
      { key: "Laufzeit", value: "Bis zu 60 Minuten" },
      { key: "Gewicht", value: "2,7 kg" },
      { key: "Farbe", value: "Bespoke (verschiedene)" },
    ]
  },
  {
    name: "Vorwerk Kobold Vk200 Plus", slug: "vorwerk-kobold-vk200-plus",
    description: "Der Vorwerk Kobold VK200 Plus ist die Premium-Version des Kobold VK200 mit erweitertem Zubehör. Die Power-Brush VB1000 entfernt Staub und Schmutz gründlich. Die eigene Kinematik sorgt für optimale Bodenkontaktaufnahme. Die 2-in-1-Funktionalität ermöglicht das Saugen von Teppichen und Böden. Die kompakte Bauform lässt sich platzsparend aufbewahren. Die hohe Saugleistung entfernt selbst feinsten Staub. Das Premium-Design mit erweitertem Zubehör. Das ultimative Flaggschiff für makellose Sauberkeit.", shortDesc: "Vorwerk-Flaggschiff mit VB1000 und erweitertem Premium-Zubehör",
    price: 1180, originalPrice: 1357, sku: "VORWERKKOBOLDVK", isPromo: true,
    rating: 4.4, reviewCount: 116, categorySlug: "reinigung", brandSlug: "vorwerk",
    specs: [
      { key: "Technologie", value: "Power-Brush VB1000" },
      { key: "Saugleistung", value: "Ultimativ" },
      { key: "Zubehör", value: "Erweitertes Premium-Paket" },
      { key: "Gewicht", value: "7,5 kg" },
      { key: "Farbe", value: "Verschiedene" },
    ]
  },
  {
    name: "Ninja Detect Duo Cordless", slug: "ninja-detect-duo-cordless",
    description: "Der Ninja Detect Duo Cordless ist ein kabelloser Akkusauger mit Detect-Technologie. Die Detect-Technologie erkennt unterschiedliche Böden und passt die Saugleistung an. Die 2 Batterien bieten bis zu 80 Minuten Laufzeit. Die Power-Funktion erhöht die Saugleistung für schwere Verschmutzungen. Die multiple Ausstattung bietet Werkzeuge für jeden Einsatzzweck. Die Wandhalterung sorgt für platzsparende Aufbewahrung. Das elegante Design passt zu jeder Haushaltsführung. Perfekt für vielseitiges Saugen.", shortDesc: "Kabelloser Ninja-Akkusauger mit Detect-Technologie und 80 Min.",
    price: 1750, sku: "NINJADETECTDUOC",
    rating: 4.7, reviewCount: 265, categorySlug: "reinigung", brandSlug: "ninja",
    specs: [
      { key: "Laufzeit", value: "Bis zu 80 Minuten" },
      { key: "Technologie", value: "Detect" },
      { key: "Gewicht", value: "3,5 kg" },
      { key: "Farbe", value: "Anthrazit" },
    ]
  },
  {
    name: "Ninja Foodi Dual Zone Af300eu", slug: "ninja-foodi-dual-zone-af300eu",
    description: "Die Ninja Foodi Dual Zone AF300EU ist ein Airfryer mit 2 unabhängigen Kochbereichen. Die Dual-Zone-Technologie ermöglicht das Gleichzeitiges Zubereiten von 2 Gerichten mit verschiedenen Einstellungen. Die 6 Funktionen – Airfry, Backen, Braten, Grillen, Trocknen, Rehydratieren – bieten maximale Vielseitigkeit. Die XXL-Kapazität von 7,6 Liter fügt große Portionen. Die schnelle Erhitzung spart Zeit und Energie. Die abnehmbaren Teile sind spülmaschinenfest. Perfekt für Familien, die gesund und vielseitig kochen wollen.", shortDesc: "Dual-Zone-Airfryer mit 2 Kochbereichen und 6 Funktionen",
    price: 540, sku: "NINJAFOODIDUALZ",
    rating: 4.8, reviewCount: 115, categorySlug: "kueche", brandSlug: "ninja",
    specs: [
      { key: "Kapazität", value: "7,6 Liter (2 Zonen)" },
      { key: "Funktionen", value: "Airfry, Backen, Braten, Grillen, Trocknen, Rehydratieren" },
      { key: "Leistung", value: "2400 Watt" },
      { key: "Temperaturbereich", value: "40-240°C" },
      { key: "Gewicht", value: "8,2 kg" },
      { key: "Farbe", value: "Schwarz" },
    ]
  },
  {
    name: "Ninja Foodi Max Af400eu", slug: "ninja-foodi-max-af400eu",
    description: "Die Ninja Foodi Max AF400EU ist ein großer Airfryer mit XL-Kapazität. Die 7 Funktionen – Airfry, Backen, Braten, Grillen, Trocknen, Rehydratieren, Dehydrieren – bieten maximale Vielseitigkeit. Die schnelle Erhitzung spart Zeit und Energie. Die abnehmbaren Teile sind spülmaschinenfest. Die integrierte Timer-Funktion ermöglicht automatisches Kochen. Das elegante Design in Schwarz passt zu jeder Kücheneinrichtung. Perfekt für Familien, die gesund und vielseitig kochen wollen.", shortDesc: "XL-Airfryer mit 7 Funktionen und großer Kapazität",
    price: 1040, sku: "NINJAFOODIMAXAF",
    rating: 4.7, reviewCount: 118, categorySlug: "kueche", brandSlug: "ninja",
    specs: [
      { key: "Kapazität", value: "7,6 Liter" },
      { key: "Funktionen", value: "7 Funktionen inkl. Dehydrieren" },
      { key: "Leistung", value: "2400 Watt" },
      { key: "Temperaturbereich", value: "40-240°C" },
      { key: "Gewicht", value: "8,5 kg" },
      { key: "Farbe", value: "Schwarz" },
    ]
  },
  {
    name: "Ninja Speedi Sp101eu", slug: "ninja-speedi-sp101eu",
    description: "Der Ninja Speedi SP101EU ist ein multifunktionaler Heißluft-Fritteuse mit Speedi-Technologie. Die Speedi-Technologie kocht bis zu 30% schneller als herkömmliche Methoden. Die 10 Funktionen bieten maximale Vielseitigkeit. Die schnelle Erhitzung spart Zeit und Energie. Die abnehmbaren Teile sind spülmaschinenfest. Die integrierte Timer-Funktion ermöglicht automatisches Garen. Das kompakte Design passt in jede Küche. Perfekt für schnelles und gesundes Garen.", shortDesc: "Ninja-Heißluft-Fritteuse mit Speedi und 10 Funktionen",
    price: 1500, originalPrice: 1725, sku: "NINJASPEEDISP10", isFeatured: true, isPromo: true,
    rating: 4.4, reviewCount: 260, categorySlug: "kueche", brandSlug: "ninja",
    specs: [
      { key: "Kapazität", value: "3,8 Liter" },
      { key: "Funktionen", value: "10" },
      { key: "Leistung", value: "1750 Watt" },
      { key: "Temperaturbereich", value: "40-240°C" },
      { key: "Farbe", value: "Schwarz" },
    ]
  },
  {
    name: "Cosori Pro2 Airfryer L501", slug: "cosori-pro2-airfryer-l501",
    description: "Die Cosori Pro2 Airfryer L501 ist ein leistungsstarker Heißluft-Fritteuse mit XL-Kapazität. Die 5,5 Liter Kapazität eignet sich für mittlere bis große Portionen. Die 13 Funktionen bieten maximale Vielseitigkeit für jeden Tag. Die schnelle Erhitzung spart Zeit und Energie. Die abnehmbaren Teile sind spülmaschinenfest. Die integrierte Timer-Funktion ermöglicht automatisches Garen. Das elegante Design passt in jede Küche. Perfekt für gesundes Garen mit minimalem Fett.", shortDesc: "Leistungsstarker Heißluft-Fritteuse mit 5,5L und 13 Funktionen",
    price: 2120, sku: "COSORIPRO2AIRFR", isNew: true,
    rating: 4.6, reviewCount: 12, categorySlug: "kueche", brandSlug: "cosori",
    specs: [
      { key: "Kapazität", value: "5,5 Liter" },
      { key: "Funktionen", value: "13" },
      { key: "Leistung", value: "1700 Watt" },
      { key: "Temperaturbereich", value: "75-230°C" },
      { key: "Farbe", value: "Schwarz" },
    ]
  },
  {
    name: "Cosori Lite Airfryer 28l", slug: "cosori-lite-airfryer-28l",
    description: "Die Cosori Lite Airfryer 28L ist ein großer Heißluft-Fritteuse mit XL-Kapazität. Die 28 Liter Kapazität eignet sich für große Familien und Mahlzeiten. Die 11 Funktionen bieten maximale Vielseitigkeit für jeden Tag. Die schnelle Erhitzung spart Zeit und Energie. Die abnehmbaren Teile sind spülmaschinenfest. Die integrierte Timer-Funktion ermöglicht automatisches Garen. Das elegante Design passt in jede Küche. Perfekt für gesundes Garen mit minimalem Fett.", shortDesc: "Großer Heißluft-Fritteuse mit 28L und 11 Funktionen",
    price: 280, originalPrice: 322, sku: "COSORILITEAIRFR", isNew: true, isPromo: true,
    rating: 4.7, reviewCount: 123, categorySlug: "kueche", brandSlug: "cosori",
    specs: [
      { key: "Kapazität", value: "28 Liter" },
      { key: "Funktionen", value: "11" },
      { key: "Leistung", value: "1800 Watt" },
      { key: "Temperaturbereich", value: "40-230°C" },
      { key: "Farbe", value: "Schwarz" },
    ]
  },
  {
    name: "Tefal Easy Fry Max Ey4018", slug: "tefal-easy-fry-max-ey4018",
    description: "Die Tefal Easy Fry Max EY4018 ist ein kompakter Heißluft-Fritteuse für kleine Portionen. Die 4,2 Liter Kapazität eignet sich für kleine bis mittlere Haushalte. Die 8 Funktionen bieten Vielseitigkeit für jeden Tag. Die schnelle Erhitzung spart Zeit und Energie. Die abnehmbaren Teile sind spülmaschinenfest. Die integrierte Timer-Funktion ermöglicht automatisches Garen. Das elegante Design passt in jede Küche. Perfekt für gesundes Garen ohne viel Fett.", shortDesc: "Kompakte Heißluft-Fritteuse mit 4,2L und 8 Funktionen",
    price: 2750, sku: "TEFALEASYFRYMAX",
    rating: 4.8, reviewCount: 282, categorySlug: "kueche", brandSlug: "tefal",
    specs: [
      { key: "Kapazität", value: "4,2 Liter" },
      { key: "Funktionen", value: "8" },
      { key: "Leistung", value: "1700 Watt" },
      { key: "Temperaturbereich", value: "80-200°C" },
      { key: "Farbe", value: "Schwarz" },
    ]
  },
  {
    name: "Tefal Optigrill Plus Gc7148", slug: "tefal-optigrill-plus-gc7148",
    description: "Der Tefal OptiGrill Plus GC7148 ist ein intelligentes Grillgerät mit automatischer Sensorik. Die 6 Grillprogramme erkennen das Essen automatisch und passen Temperatur und Zeit an. Die XL-Grillfläche eignet sich für große Portionen. Die abnehmbaren Grillplatten sind spülmaschinenfeste. Die integrierte Fettablauerschale fängt überschüssiges Fett auf. Das elegante Design in Schwarz passt zu jeder Kücheneinrichtung. Perfekt für alle, die gesund und einfach grillen wollen.", shortDesc: "Intelligenter Grill mit 6 automatischen Programmen und Sensorik",
    price: 310, sku: "TEFALOPTIGRILLP",
    rating: 4.3, reviewCount: 199, categorySlug: "kueche", brandSlug: "tefal",
    specs: [
      { key: "Leistung", value: "2000 Watt" },
      { key: "Grillprogramme", value: "6 Stück" },
      { key: "Grillfläche", value: "XL" },
      { key: "Reinigung", value: "Spülmaschinenfest" },
      { key: "Farbe", value: "Schwarz" },
    ]
  },
  {
    name: "Tefal Easy Grill Precision Dg2558", slug: "tefal-easy-grill-precision-dg2558",
    description: "Der Tefal Easy Grill Precision DG2558 ist ein Kontaktgrill mit präziser Temperaturregelung. Die 2 Temperaturen ermöglichen individuelle Einstellungen. Die Grillflächen mit Antihaft-Beschichtung sorgen für einfaches Reinigen. Die integrierte Fettablauerschale fängt überschüssiges Fett auf. Die zentrale Schließmulde sorgt für gleichmäßiges Grillen. Das kompakte Design lässt sich platzsparend aufbewahren. Perfekt für schnelle Grillgerichte zu Hause.", shortDesc: "Kontaktgrill mit präziser Temperaturregelung und Antihaft",
    price: 1760, sku: "TEFALEASYGRILLP",
    rating: 4.1, reviewCount: 123, categorySlug: "kueche", brandSlug: "tefal",
    specs: [
      { key: "Leistung", value: "2500 Watt" },
      { key: "Temperaturstufen", value: "2 Stufen" },
      { key: "Grillfläche", value: "Auto-Adapt-System" },
      { key: "Reinigung", value: "Antihaft, spülmaschinenfest" },
      { key: "Farbe", value: "Schwarz" },
    ]
  },
  {
    name: "WMF Kitchenminis Contact Grill", slug: "wmf-kitchenminis-contact-grill",
    description: "Der WMF KitchenMinis Kontaktgrill ist ein kompakter Kontaktgrill für kleine Portionen. Die 1800 Watt Leistung sorgt für schnelles Grillen. Die Antihaft-Beschichtung sorgt für einfaches Reinigen. Die integrierte Fettablauerschale fängt überschüssiges Fett auf. Das kompakte Design von nur 30 cm Breite passt in jede Küche. Das elegante Cromargan®-Design passt zu jeder Kücheneinrichtung. Perfekt für Singles oder kleine Haushalte.", shortDesc: "Kompakter Kontaktgrill mit 1800W und Antihaft-Beschichtung",
    price: 680, sku: "WMFKITCHENMINIS",
    rating: 4.1, reviewCount: 283, categorySlug: "kueche", brandSlug: "wmf",
    specs: [
      { key: "Leistung", value: "1800 Watt" },
      { key: "Grillfläche", value: "Antihaft" },
      { key: "Material", value: "Cromargan® Edelstahl" },
      { key: "Breite", value: "30 cm" },
      { key: "Farbe", value: "Edelstahl" },
    ]
  },
  {
    name: "Bosch Serie6 Induktionskochfeld Pci611bb5e", slug: "bosch-serie6-induktionskochfeld-pci611bb5e",
    description: "Das Bosch Serie 6 Induktionskochfeld PCI611BB5E bietet 4 Induktionskochfelder mit flexiblem Kochbereich. Die FlexInduction-Technologie ermöglicht die Kombination von Kochfeldern für große Kochgeschirre. Die PowerBoost-Funktion sorgt für schnelles Aufkochen. Das PerfectFry-Sensorkochfeld regelt die Temperatur automatisch. Die intuitive LED-Steuerung mit Schieberegler ermöglicht präzise Einstellungen. Die Scheibenkeramik-Oberfläche ist leicht zu reinigen. Das 60-cm-Design passt in jede moderne Küchenzeile. Ein Premium-Kochfeld für anspruchsvolle Köche.", shortDesc: "Induktionskochfeld mit FlexInduction und PerfectFry-Sensor",
    price: 660, sku: "BOSCHSERIE6INDU", isFeatured: true,
    rating: 4.5, reviewCount: 146, categorySlug: "kueche", brandSlug: "bosch",
    specs: [
      { key: "Kochfelder", value: "4 Induktionskochfelder" },
      { key: "Technologie", value: "FlexInduction" },
      { key: "Funktionen", value: "PowerBoost, PerfectFry" },
      { key: "Steuerung", value: "LED-Schieberegler" },
      { key: "Breite", value: "60 cm" },
      { key: "Farbe", value: "Schwarz" },
    ]
  },
  {
    name: "Siemens Iq700 Induktionskochfeld Ex877ly44e", slug: "siemens-iq700-induktionskochfeld-ex877ly44e",
    description: "Das Siemens iQ700 Induktionskochfeld EX877LY44E bietet 4 Induktionskochfelder mit flexiblen Kochbereich. Die FlexInduction-Technologie ermöglicht die Kombination von Kochfeldern für große Kochgeschirre. Die PowerBoost-Funktion sorgt für schnelles Aufkochen. Das perfectFry-Sensorkochfeld regelt die Temperatur automatisch. Die intuitive Bedienung über Schieberegler ist einfach und komfortabel. Die Scheibenkeramik-Oberfläche ist leicht zu reinigen. Das 60-cm-Design passt in jede moderne Küchenzeile. Ein Premium-Kochfeld für anspruchsvolle Köche.", shortDesc: "Premium-Induktionskochfeld mit FlexInduction und perfectFry-Sensor",
    price: 2070, originalPrice: 2381, sku: "SIEMENSIQ700IND", isPromo: true,
    rating: 4.4, reviewCount: 61, categorySlug: "kueche", brandSlug: "siemens",
    specs: [
      { key: "Kochfelder", value: "4 Induktionskochfelder" },
      { key: "Technologie", value: "FlexInduction" },
      { key: "Funktionen", value: "PowerBoost, perfectFry" },
      { key: "Steuerung", value: "Schieberegler" },
      { key: "Breite", value: "60 cm" },
      { key: "Farbe", value: "Schwarz" },
    ]
  },
  {
    name: "Gaggenau Vario400 Kochfeld Vig414", slug: "gaggenau-vario400-kochfeld-vig414",
    description: "Das Gaggenau Vario 400 Kochfeld VIG414 ist ein Premium-Induktionskochfeld mit 4 Kochfeldern. Die induktive Technologie sorgt für schnelles und energieeffizientes Arbeiten. Die PowerBoost-Funktion ermöglicht schnelles Aufkochen. Die intuitive Bedienung über Berührungselemente ist einfach und komfortabel. Die scheibenkeramische Oberfläche ist leicht zu reinigen. Das elegante Design in Schwarz passt zu jeder modernen Kücheneinrichtung. Die perfekte Ergänzung für Gaggenau-Küchen. Ein Premium-Kochfeld für anspruchsvolle Köche.", shortDesc: "Premium-4-Feld-Induktionskochfeld von Gaggenau mit PowerBoost",
    price: 880, sku: "GAGGENAUVARIO40", isFeatured: true,
    rating: 4.1, reviewCount: 139, categorySlug: "kueche", brandSlug: "gaggenau",
    specs: [
      { key: "Kochfelder", value: "4 Induktionskochfelder" },
      { key: "Technologie", value: "Induktion" },
      { key: "Funktionen", value: "PowerBoost" },
      { key: "Steuerung", value: "Berührungselemente" },
      { key: "Breite", value: "60 cm" },
      { key: "Farbe", value: "Schwarz" },
    ]
  },
  {
    name: "Neff B3acs7ah0 Backofen", slug: "neff-b3acs7ah0-backofen",
    description: "Der Neff B3ACS7AH0 Backofen ist ein einbau-würdiger Backofen mit 8 Funktionen. Die 3D-Heißluft-Verteilung sorgt für gleichmäßiges Backen auf allen Ebenen. Die SoftOpen- und SoftClose-Tür sorgt für sanftes Öffnen und Schließen. Die LED-Beleuchtung sorgt für optimale Sicht. Die Easy-Clean-Beschichtung ermöglicht einfache Reinigung. Das 60-cm-Design passt in jede Küchenzeile. Ein zuverlässiger Backofen für jeden Tag.", shortDesc: "Einbau-Backofen mit 8 Funktionen und SoftClose-Tür",
    price: 440, sku: "NEFFB3ACS7AH0BA", isNew: true,
    rating: 4.3, reviewCount: 16, categorySlug: "kueche", brandSlug: "neff",
    specs: [
      { key: "Funktionen", value: "8 Backfunktionen" },
      { key: "Backofenvolumen", value: "71 Liter" },
      { key: "Technologie", value: "3D-Heißluft" },
      { key: "Reinigung", value: "Easy-Clean" },
      { key: "Breite", value: "60 cm" },
      { key: "Farbe", value: "Weiß" },
    ]
  },
  {
    name: "Bosch Serie8 Backofen Hbg8780b1", slug: "bosch-serie8-backofen-hbg8780b1",
    description: "Der Bosch Serie 8 Backofen HBG8780B1 ist ein einbau-würdiger Backofen mit 14 Funktionen. Die 3D-Heißluft-Verteilung sorgt für gleichmäßiges Backen auf allen Ebenen. Das Large-Account-Display mit TFT-Touchdisplay ermöglicht intuitive Bedienung. Die Home-Connect-App ermöglicht die Fernbedienung per Smartphone. Die SelfCleaning-Funktion reinigt den Ofen automatisch pyrolytisch. Die SoftOpen- und SoftClose-Tür sorgt für sanftes Öffnen und Schließen. Die Beleuchtung mit LED-Technik sorgt für optimale Sicht. Ein Premium-Backofen für anspruchsvolle Bäcker.", shortDesc: "Premium-Einbau-Backofen mit 14 Funktionen, Home Connect und Pyrolyse",
    price: 1510, sku: "BOSCHSERIE8BACK",
    rating: 4.2, reviewCount: 175, categorySlug: "kueche", brandSlug: "bosch",
    specs: [
      { key: "Funktionen", value: "14 Backfunktionen" },
      { key: "Backofenvolumen", value: "71 Liter" },
      { key: "Technologie", value: "3D-Heißluft" },
      { key: "Reinigung", value: "Pyrolyse SelfCleaning" },
      { key: "Steuerung", value: "TFT-Touchdisplay" },
      { key: "Breite", value: "60 cm" },
      { key: "Energieklasse", value: "A" },
    ]
  },
  {
    name: "Miele H7464bp Backofen", slug: "miele-h7464bp-backofen",
    description: "Der Miele H 7464 BP Backofen ist ein Premium-Einbau-Backofen mit 12 Funktionen. Die Miele-Technologie sorgt für gleichmäßiges Backen auf allen Ebenen. Das Large-Account-Display mit Touchbedienung ermöglicht intuitive Steuerung. Die SelfCleaning-Funktion reinigt den Ofen automatisch pyrolytisch. Die Soft-Close-Tür sorgt für sanftes Schließen. Die LED-Beleuchtung sorgt für optimale Sicht. Die Miele-Qualität bietet Zuverlässigkeit und Langlebigkeit. Ein Premium-Backofen für anspruchsvolle Bäcker.", shortDesc: "Premium-Einbau-Backofen mit 12 Funktionen und SelfCleaning",
    price: 1880, sku: "MIELEH7464BPBAC",
    rating: 4.1, reviewCount: 34, categorySlug: "kueche", brandSlug: "miele",
    specs: [
      { key: "Funktionen", value: "12 Backfunktionen" },
      { key: "Backofenvolumen", value: "76 Liter" },
      { key: "Reinigung", value: "Pyrolyse SelfCleaning" },
      { key: "Steuerung", value: "Touchdisplay" },
      { key: "Breite", value: "60 cm" },
      { key: "Energieklasse", value: "A+1" },
    ]
  },
  {
    name: "AEG Bpe842720m Backofen", slug: "aeg-bpe842720m-backofen",
    description: "Der AEG BPE842720M Backofen ist ein Premium-Einbau-Backofen mit SteamBoost-Technologie. Die SteamBoost-Funktion sorgt für saftiges Backen mit optimaler Feuchtigkeit. Die 8 Backfunktionen bieten Vielseitigkeit für jedes Backgerät. Die pyrolytische Selbstreinigung reinigt den Ofen automatisch. Das TFT-Touchdisplay ermöglicht intuitive Bedienung. Die Soft-Close-Tür sorgt für sanftes Schließen. Die LED-Beleuchtung sorgt für optimale Sicht. Das Premium-Modell für anspruchsvolle Bäcker.", shortDesc: "AEG-Premium-Backofen mit SteamBoost und Pyrolyse",
    price: 510, sku: "AEGBPE842720MBA",
    rating: 4.6, reviewCount: 103, categorySlug: "kueche", brandSlug: "aeg",
    specs: [
      { key: "Funktionen", value: "8 Backfunktionen" },
      { key: "Technologie", value: "SteamBoost" },
      { key: "Backofenvolumen", value: "77 Liter" },
      { key: "Reinigung", value: "Pyrolyse" },
      { key: "Steuerung", value: "TFT-Touchdisplay" },
      { key: "Breite", value: "60 cm" },
      { key: "Energieklasse", value: "A" },
    ]
  },
  {
    name: "Electrolux Oeo7gknw Backofen", slug: "electrolux-oeo7gknw-backofen",
    description: "Der Electrolux OEO7GKNW Backofen ist ein einbau-würdiger Backofen mit SteamBoost-Technologie. Die SteamBoost-Funktion sorgt für saftiges Backen mit optimaler Feuchtigkeit. Die 5 Backfunktionen inklusive Heißluft bieten Vielseitigkeit. Die Soft-Close-Tür sorgt für sanftes Schließen. Die LED-Beleuchtung sorgt für optimale Sicht auf die Backwaren. Die Easy-Clean-Beschichtung ermöglicht einfache Reinigung. Das 60-cm-Design passt in jede Küchenzeile. Ein zuverlässiger Backofen für jeden Tag.", shortDesc: "Einbau-Backofen mit SteamBoost und 5 Backfunktionen",
    price: 2240, sku: "ELECTROLUXOEO7G",
    rating: 4.2, reviewCount: 212, categorySlug: "kueche", brandSlug: "electrolux",
    specs: [
      { key: "Funktionen", value: "5 Backfunktionen" },
      { key: "Technologie", value: "SteamBoost" },
      { key: "Backofenvolumen", value: "72 Liter" },
      { key: "Reinigung", value: "Easy-Clean" },
      { key: "Breite", value: "60 cm" },
      { key: "Farbe", value: "Weiß" },
    ]
  },
  {
    name: "Samsung Bespoke Slide In Range Nx60bb871112", slug: "samsung-bespoke-slide-in-range-nx60bb871112",
    description: "Der Samsung Bespoke Slide-In Range NX60BB871112 ist ein Premium-Herd mit Backofen und Ceranfeld. Das Ceranfeld bietet 5 Kochfelder für flexibles Kochen. Der Backofen bietet 6 Funktionen inkl. Heißluft. Die Smart-Things-App ermöglicht die Fernbedienung. Die Air-Fry-Funktion ermöglicht gesundes Frittieren. Die steam-assist-Funktion sorgt für saftiges Backen. Das Bespoke-Design passt zu jeder Kücheneinrichtung. Perfekt für anspruchsvolles Kochen und Backen.", shortDesc: "Premium-Slide-In-Range mit Ceranfeld und Air-Fry-Backofen",
    price: 2740, originalPrice: 3151, sku: "SAMSUNGBESPOKES", isPromo: true,
    rating: 4.2, reviewCount: 269, categorySlug: "haushaltsgeraete", brandSlug: "samsung",
    specs: [
      { key: "Kochfeld", value: "Ceran 5 Felder" },
      { key: "Backofen", value: "6 Funktionen inkl. Heißluft" },
      { key: "Funktionen", value: "Air-Fry, Steam-Assist" },
      { key: "Steuerung", value: "SmartThings App" },
      { key: "Breite", value: "76 cm" },
    ]
  },
  {
    name: "LG Instaview Range Lsel6337f", slug: "lg-instaview-range-lsel6337f",
    description: "Der LG InstaView Range LSEL6337F ist ein Premium-Elektroherd mit Ceranfeld und Backofen. Das Ceranfeld bietet 5 Kochfelder für flexibles Kochen. Der Backofen bietet 6 Funktionen inkl. Heißluft. Die InstaView-Technologie zeigt den Ofeninhalt durch die Tür. Die ProBake-Convection sorgt für gleichmäßiges Backen. Die Smart-Things-App ermöglicht die Fernbedienung. Das elegante Design passt in moderne Küchen. Perfekt für anspruchsvolles Kochen und Backen.", shortDesc: "Premium-Elektroherd mit InstaView und ProBake-Convection",
    price: 1240, sku: "LGINSTAVIEWRANG", isFeatured: true,
    rating: 4.4, reviewCount: 186, categorySlug: "haushaltsgeraete", brandSlug: "lg",
    specs: [
      { key: "Kochfeld", value: "Ceran 5 Felder" },
      { key: "Backofen", value: "6 Funktionen inkl. Heißluft" },
      { key: "Technologie", value: "InstaView, ProBake" },
      { key: "Steuerung", value: "SmartThings App" },
      { key: "Breite", value: "60 cm" },
    ]
  },
  {
    name: "Gastroback Design Pro 42621", slug: "gastroback-design-pro-42621",
    description: "Der Gastroback Design Pro 42621 ist eine professionelle Espressomaschine mit 20 bar Druck. Die Edelstahl-Brühgruppe im 58mm-Format sorgt für gleichmäßige Extraktion. Der Crona-Milchaufschäumer erzeugt cremigen Mikroschaum. Die 2 separaten Heizsysteme ermöglichen gleichzeitiges Brühen und Aufschäumen. Die digitale Anzeige zeigt Temperatur und Brühzeit an. Das elegante Design in Edelstahl unterstreicht den Premium-Anspruch. Perfekt für anspruchsvolle Espresso-Liebhaber.", shortDesc: "Professionelle Espressomaschine mit 58mm-Brühgruppe und 2 Heizsystemen",
    price: 640, originalPrice: 736, sku: "GASTROBACKDESIG", isNew: true, isPromo: true,
    rating: 4.3, reviewCount: 220, categorySlug: "kaffee", brandSlug: "gastroback",
    specs: [
      { key: "Brühdruck", value: "20 bar" },
      { key: "Brühgruppe", value: "58mm Edelstahl" },
      { key: "Heizsystem", value: "2 separates Thermoblock" },
      { key: "Milchaufschäumer", value: "Crona" },
      { key: "Wasserkapazität", value: "2,0 Liter" },
      { key: "Leistung", value: "1600 Watt" },
      { key: "Farbe", value: "Edelstahl" },
    ]
  },
  {
    name: "Russell Hobbs Hobbs Retro Air Fryer 24530", slug: "russell-hobbs-retro-air-fryer-24530",
    description: "Der Russell Hobbs Retro Air Fryer 24530 ist ein stilvoller Airfryer im Retro-Design. Die 3 Funktionen – Airfry, Backen, Grillen – bieten Vielseitigkeit für jeden Tag. Die schnelle Erhitzung spart Zeit und Energie. Die abnehmbaren Teile sind spülmaschinenfest. Die integrierte Timer-Funktion ermöglicht automatisches Kochen. Das elegante Retro-Design in various Farben passt zu jeder Kücheneinrichtung. Perfekt für alle, die gesund und stilvoll kochen wollen.", shortDesc: "Retro-Airfryer mit 3 Funktionen und stilvollem Design",
    price: 1530, originalPrice: 1759, sku: "RUSSELLHOBBSRET", isFeatured: true, isNew: true, isPromo: true,
    rating: 4.2, reviewCount: 12, categorySlug: "kueche", brandSlug: "russell-hobbs",
    specs: [
      { key: "Funktionen", value: "Airfry, Backen, Grillen" },
      { key: "Leistung", value: "1500 Watt" },
      { key: "Temperaturbereich", value: "80-200°C" },
      { key: "Farbe", value: "Retro-Verschiedene" },
      { key: "Kapazität", value: "3,8 Liter" },
    ]
  },
  {
    name: "De'Longhi Multifry Fh1394", slug: "delonghi-multifry-fh1394",
    description: "Die De'Longhi Multifry FH1394 ist ein multifunktionaler Heißluft-Fritteuse mit 2 Kochbereichen. Die 2 Kochbereiche ermöglichen das Gleichzeitiges Zubereiten von 2 Gerichten. Die Heat-Distribution-Technologie sorgt für gleichmäßiges Garen. Die 2,5 Liter Kapazität eignet sich für kleine bis mittlere Portionen. Die abnehmbaren Teile sind spülmaschinenfest. Die einfache Bedienung mit Drehregler ist intuitiv. Das kompakte Design passt in jede Küche. Perfekt für gesundes Garen ohne viel Fett.", shortDesc: "Heißluft-Fritteuse mit 2 Kochbereichen und Heat-Distribution",
    price: 1760, sku: "DELONGHIMULTIFR", isNew: true,
    rating: 4.6, reviewCount: 284, categorySlug: "kueche", brandSlug: "delonghi",
    specs: [
      { key: "Kapazität", value: "2,5 Liter" },
      { key: "Funktionen", value: "Heißluft, Frittieren, Garen" },
      { key: "Leistung", value: "1400 Watt" },
      { key: "Temperaturbereich", value: "80-200°C" },
      { key: "Kochbereiche", value: "2" },
      { key: "Farbe", value: "Schwarz" },
    ]
  },
  {
    name: "Moulinex Easy Fry Max Fx9029", slug: "moulinex-easy-fry-max-fx9029",
    description: "Die Moulinex Easy Fry Max FX9029 ist ein kompakter Heißluft-Fritteuse für kleine Portionen. Die 4,1 Liter Kapazität eignet sich für kleine bis mittlere Haushalte. Die 8 Funktionen bieten Vielseitigkeit für jeden Tag. Die schnelle Erhitzung spart Zeit und Energie. Die abnehmbaren Teile sind spülmaschinenfest. Die integrierte Timer-Funktion ermöglicht automatisches Garen. Das elegante Design passt in jede Küche. Perfekt für gesundes Garen ohne viel Fett.", shortDesc: "Kompakte Moulinex-Heißluft-Fritteuse mit 4,1L und 8 Funktionen",
    price: 1540, originalPrice: 1771, sku: "MOULINEXEASYFRY", isPromo: true,
    rating: 4.4, reviewCount: 215, categorySlug: "kueche", brandSlug: "moulinex",
    specs: [
      { key: "Kapazität", value: "4,1 Liter" },
      { key: "Funktionen", value: "8" },
      { key: "Leistung", value: "1500 Watt" },
      { key: "Temperaturbereich", value: "80-200°C" },
      { key: "Farbe", value: "Schwarz" },
    ]
  },
  {
    name: "Kenwood Multipro Express Fdm79190ba", slug: "kenwood-multipro-express-fdm79190ba",
    description: "Die Kenwood Multipro Express FDM79190BA ist eine Premium-Küchenmaschine mit 1500 Watt Leistung. Das planetarische Mischsystem sorgt für gleichmäßige Ergebnisse. Die 10 Geschwindigkeitsstufen und der Pulsbetrieb ermöglichen individuelle Einstellungen. Die mitgelieferten Aufätze – Knethaken, Schneebesen, Saftpresse – bieten maximale Vielseitigkeit. Der abnehmbare 6,7-Liter-Rüssel ist spülmaschinenfeste. Die LED-Anzeige zeigt Geschwindigkeit und Timer an. Das elegante Design in Rot passt zu jeder Kücheneinrichtung. Ein Premium-Küchenhelfer.", shortDesc: "Premium-Küchenmaschine mit 1500W, Saftpresse und 6,7L-Rüssel",
    price: 1510, sku: "KENWOODMULTIPRO",
    rating: 4.8, reviewCount: 184, categorySlug: "kueche", brandSlug: "kenwood",
    specs: [
      { key: "Leistung", value: "1500 Watt" },
      { key: "Rüsselvolumen", value: "6,7 Liter" },
      { key: "Geschwindigkeiten", value: "10 + Puls" },
      { key: "Aufätze", value: "Knethaken, Schneebesen, Saftpresse" },
      { key: "Farbe", value: "Rot" },
    ]
  },
  {
    name: "Sage The Air Fryer Pro Bpa180", slug: "sage-the-air-fryer-pro-bpa180",
    description: "Die Sage The Air Fryer Pro BPA180 ist ein Premium-Airfryer mit multifunktionalen Möglichkeiten. Die 7 Funktionen – Airfry, Bake, Roast, Grill, Dehydrate, Reheat, Keep Warm – bieten maximale Vielseitigkeit. Die schnelle Erhitzung spart Zeit und Energie. Die abnehmbaren Teile sind spülmaschinenfest. Die integrierte Timer-Funktion ermöglicht automatisches Kochen. Das elegante Design in Bürstmetall passt zu jeder Kücheneinrichtung. Perfekt für alle, die gesund und vielseitig kochen wollen.", shortDesc: "Premium-Airfryer mit 7 Funktionen und Bürstmetall-Design",
    price: 340, sku: "SAGETHEAIRFRYER",
    rating: 4.3, reviewCount: 228, categorySlug: "kueche", brandSlug: "sage",
    specs: [
      { key: "Kapazität", value: "4,0 Liter" },
      { key: "Funktionen", value: "7 Funktionen" },
      { key: "Leistung", value: "1800 Watt" },
      { key: "Temperaturbereich", value: "80-230°C" },
      { key: "Farbe", value: "Bürstmetall" },
    ]
  },
  {
    name: "Miele W1 Waschmaschine Wsd163", slug: "miele-w1-waschmaschine-wsd163",
    description: "Die Miele W1 Waschmaschine WSD163 ist eine Premium-Waschmaschine mit Miele@home-Steuerung. Die Miele@home-Steuerung ermöglicht die Fernbedienung per Smartphone. Die 8 kg Kapazität eignet sich für mittlere Haushalte. Die 1600 U/min Schleuderung sorgt für optimale Ergebnisse. Das A+++ Energiesiegel sorgt für Energieeffizienz. Die 20 Programme bieten individuelle Einstellungen. Das elegante Design passt in jede Küche. Perfekt für smartes Waschen.", shortDesc: "Miele-Waschmaschine mit Miele@home und 8 kg Kapazität",
    price: 1150, originalPrice: 1323, sku: "MIELEW1WASCH3", isPromo: true,
    rating: 4.4, reviewCount: 18, categorySlug: "haushaltsgeraete", brandSlug: "miele",
    specs: [
      { key: "Kapazität", value: "8 kg" },
      { key: "Schleuderdrehzahl", value: "1600 U/min" },
      { key: "Energieklasse", value: "A+++" },
      { key: "Steuerung", value: "Miele@home App" },
      { key: "Programme", value: "20" },
      { key: "Abmessungen", value: "60 x 85 x 60 cm" },
    ]
  },
  {
    name: "Miele W1 Waschmaschine Wsd263", slug: "miele-w1-waschmaschine-wsd263",
    description: "Die Miele W1 Waschmaschine WSD263 ist eine Premium-Waschmaschine mit CapDosing- und TwinDos-Technologie. Die TwinDos-Technologie dosiert Waschmittel automatisch präzise. Die CapDosing-Technologie offeriert spezielle Zusätze. Die 8 kg Kapazität eignet sich für mittlere Haushalte. Die 1600 U/min Schleuderung sorgt für optimale Ergebnisse. Das A+++ Energiesiegel sorgt für Energieeffizienz. Die 20 Programme bieten individuelle Einstellungen. Das Premium-Modell mit erweiterten Features.", shortDesc: "Miele-Premium-Waschmaschine mit TwinDos und CapDosing",
    price: 2890, sku: "MIELEW1WASCH2",
    rating: 4, reviewCount: 263, categorySlug: "haushaltsgeraete", brandSlug: "miele",
    specs: [
      { key: "Kapazität", value: "8 kg" },
      { key: "Schleuderdrehzahl", value: "1600 U/min" },
      { key: "Energieklasse", value: "A+++" },
      { key: "Dosierung", value: "TwinDos + CapDosing" },
      { key: "Programme", value: "20" },
      { key: "Abmessungen", value: "60 x 85 x 60 cm" },
    ]
  },
  {
    name: "Miele T1 Trockner Tmh843", slug: "miele-t1-trockner-tmh843",
    description: "Der Miele T1 Trockner TMH843 ist ein Wärmepumpentrockner mit HeatPump-Technologie. Die HeatPump-Technologie nutzt Restwärme für energieeffizientes Trocknen. Die 9 kg Kapazität eignet sich für mittlere bis große Haushalte. Das A++ Energiesiegel sorgt für Energieeffizienz. Die Sensorentrocknung erkennt den Trocknungsgrad. Die 12 Programme bieten individuelle Einstellungen. Das elegante Design passt in jede Küche. Perfekt für effizientes Trocknen.", shortDesc: "Miele-Wärmepumpentrockner mit HeatPump und 9 kg Kapazität",
    price: 1440, sku: "MIELET1TROCK2", isNew: true,
    rating: 4.9, reviewCount: 268, categorySlug: "haushaltsgeraete", brandSlug: "miele",
    specs: [
      { key: "Kapazität", value: "9 kg" },
      { key: "Trocknungsart", value: "Wärmepumpe" },
      { key: "Energieklasse", value: "A++" },
      { key: "Programme", value: "12" },
      { key: "Abmessungen", value: "60 x 85 x 65 cm" },
    ]
  },
  {
    name: "Miele Waschtrockner Wt1", slug: "miele-waschtrockner-wt1",
    description: "Der Miele Waschtrockner WT1 ist ein kombinierter Waschtrockner mit Wärmepumpe. Die Wärmepumpe nutzt Restwärme für energieeffizientes Trocknen. Die 6 kg Waschkapazität und 5 kg Trocknungskapazität eignen sich für mittlere Haushalte. Das A++ Energiesiegel sorgt für Energieeffizienz. Die Sensorentrocknung erkennt den Trocknungsgrad. Die 20 Programme bieten individuelle Einstellungen. Das kompakte Design spart Platz. Perfekt für alle, die Platz sparen möchten.", shortDesc: "Kombinierter Waschtrockner mit Wärmepumpe und 6/5 kg Kapazität",
    price: 1630, originalPrice: 1874, sku: "MIELEWASCHTROCK", isFeatured: true, isPromo: true,
    rating: 4.3, reviewCount: 291, categorySlug: "haushaltsgeraete", brandSlug: "miele",
    specs: [
      { key: "Waschkapazität", value: "6 kg" },
      { key: "Trocknungskapazität", value: "5 kg" },
      { key: "Trocknungsart", value: "Wärmepumpe" },
      { key: "Energieklasse", value: "A++" },
      { key: "Programme", value: "20" },
      { key: "Abmessungen", value: "60 x 85 x 60 cm" },
    ]
  },
  {
    name: "Bosch Serie8 Waschmaschine Wau285680", slug: "bosch-serie8-waschmaschine-wau285680",
    description: "Die Bosch Serie 8 Waschmaschine WAU285680 ist die neueste Premium-Waschmaschine mit i-DOS und ActiveOxygen. Die i-DOS-Technologie dosiert Waschmittel automatisch präzise. Die ActiveOxygen-Technologie entfernt Gerüche effektiv. Die 9 kg Kapazität eignet sich für mittlere Haushalte. Die 1400 U/min Schleuderung sorgt für optimale Ergebnisse. Das A+++ Energiesiegel sorgt für Energieeffizienz. Die Home-Connect-App ermöglicht die Fernbedienung. Die neueste Generation für maximale Ansprüche.", shortDesc: "Neueste Bosch-Premium-Waschmaschine mit i-DOS und ActiveOxygen",
    price: 2860, sku: "BOSCHSERIE8WASC",
    rating: 4.9, reviewCount: 261, categorySlug: "haushaltsgeraete", brandSlug: "bosch",
    specs: [
      { key: "Kapazität", value: "9 kg" },
      { key: "Schleuderdrehzahl", value: "1400 U/min" },
      { key: "Energieklasse", value: "A+++" },
      { key: "Dosierung", value: "i-DOS" },
      { key: "Technologie", value: "ActiveOxygen" },
      { key: "Abmessungen", value: "60 x 85 x 60 cm" },
    ]
  },
  {
    name: "Bosch Serie6 Trockner Wtu876680", slug: "bosch-serie6-trockner-wtu876680",
    description: "Der Bosch Serie 6 Trockner WTU876680 ist ein Wärmepumpentrockner mit AutoDry-Technologie. Die AutoDry-Technologie erkennt den Trocknungsgrad und stoppt automatisch. Die 9 kg Kapazität eignet sich für mittlere bis große Haushalte. Das A++ Energiesiegel sorgt für Energieeffizienz. Die 15 Programme bieten individuelle Einstellungen. Die SelfCleaning-Condenser reinigt den Kondensator automatisch. Das elegante Design passt in jede Küche. Perfekt für effizientes Trocknen.", shortDesc: "Bosch-Wärmepumpentrockner mit AutoDry und 9 kg Kapazität",
    price: 370, sku: "BOSCHSERIE6TROC", isNew: true,
    rating: 4.1, reviewCount: 59, categorySlug: "haushaltsgeraete", brandSlug: "bosch",
    specs: [
      { key: "Kapazität", value: "9 kg" },
      { key: "Trocknungsart", value: "Wärmepumpe" },
      { key: "Energieklasse", value: "A++" },
      { key: "Programme", value: "15" },
      { key: "Abmessungen", value: "60 x 85 x 65 cm" },
    ]
  },
  {
    name: "Siemens Iq700 Waschmaschine Wg44g2z0", slug: "siemens-iq700-waschmaschine-wg44g2z0",
    description: "Die Siemens iQ700 Waschmaschine WG44G2Z0 ist eine Premium-Waschmaschine mit i-DOS und waterPerfect-Technologie. Die i-DOS-Technologie dosiert Waschmittel automatisch präzise. Die waterPerfect-Technologie sorgt für optimalen Wasserverbrauch. Die 9 kg Kapazität eignet sich für mittlere Haushalte. Die 1400 U/min Schleuderung sorgt für optimale Ergebnisse. Das A+++ Energiesiegel sorgt für Energieeffizienz. Die Home-Connect-App ermöglicht die Fernbedienung. Das Premium-Modell für sanftes Waschen.", shortDesc: "Siemens-Premium-Waschmaschine mit i-DOS und waterPerfect",
    price: 2100, originalPrice: 2415, sku: "SIEMENSIQ700WAS", isFeatured: true, isPromo: true,
    rating: 4.1, reviewCount: 149, categorySlug: "haushaltsgeraete", brandSlug: "siemens",
    specs: [
      { key: "Kapazität", value: "9 kg" },
      { key: "Schleuderdrehzahl", value: "1400 U/min" },
      { key: "Energieklasse", value: "A+++" },
      { key: "Dosierung", value: "i-DOS" },
      { key: "Technologie", value: "waterPerfect" },
      { key: "Abmessungen", value: "60 x 85 x 60 cm" },
    ]
  },
  {
    name: "Siemens Iq700 Trockner Wt47w5600", slug: "siemens-iq700-trockner-wt47w5600",
    description: "Der Siemens iQ700 Trockner WT47W5600 ist ein Premium-Wärmepumpentrockner mit homeConnect-Steuerung. Die HeatPump-Technologie nutzt Restwärme für energieeffizientes Trocknen. Die 9 kg Kapazität eignet sich für mittlere bis große Haushalte. Das A++ Energiesiegel sorgt für Energieeffizienz. Die sensorSteuerung erkennt den Trocknungsgrad. Die 15 Programme bieten individuelle Einstellungen. Die Home-Connect-App ermöglicht die Fernbedienung. Das Premium-Modell für effizientes Trocknen.", shortDesc: "Premium-Wärmepumpentrockner mit Home Connect und 9 kg Kapazität",
    price: 940, originalPrice: 1081, sku: "SIEMENSIQ700TRO", isFeatured: true, isPromo: true,
    rating: 4.2, reviewCount: 290, categorySlug: "haushaltsgeraete", brandSlug: "siemens",
    specs: [
      { key: "Kapazität", value: "9 kg" },
      { key: "Trocknungsart", value: "Wärmepumpe" },
      { key: "Energieklasse", value: "A++" },
      { key: "Programme", value: "15" },
      { key: "Abmessungen", value: "60 x 85 x 65 cm" },
    ]
  },
  {
    name: "Samsung Ecobubble Ww90t554daw", slug: "samsung-ecobubble-ww90t554daw",
    description: "Die Samsung EcoBubble WW90T554DAW ist eine Premium-Waschmaschine mit EcoBubble-Technologie. Die EcoBubble-Technologie verwandelt Waschmittel in Blasen für gründliches Waschen. Die 9 kg Kapazität eignet sich für mittlere bis große Haushalte. Die 1400 U/min Schleuderung sorgt für optimale Ergebnisse. Das A+++ Energiesiegel sorgt für Energieeffizienz. Die HygieneOption tötet 99,9% der Bakterien ab. Die Smart-Things-App ermöglicht die Fernbedienung. Perfekt für sanftes und gründliches Waschen.", shortDesc: "Samsung-Premium-Waschmaschine mit EcoBubble und 9 kg Kapazität",
    price: 2840, originalPrice: 3266, sku: "SAMSUNGECOBUBBL", isPromo: true,
    rating: 4.4, reviewCount: 166, categorySlug: "haushaltsgeraete", brandSlug: "samsung",
    specs: [
      { key: "Kapazität", value: "9 kg" },
      { key: "Schleuderdrehzahl", value: "1400 U/min" },
      { key: "Energieklasse", value: "A+++" },
      { key: "Technologie", value: "EcoBubble" },
      { key: "Programme", value: "15" },
      { key: "Abmessungen", value: "60 x 85 x 60 cm" },
    ]
  },
  {
    name: "Samsung Trockner Dv80ta020ae", slug: "samsung-trockner-dv80ta020ae",
    description: "Der Samsung Trockner DV80TA020AE ist ein Kondensations-Trockner mit Sensor-Dry-Funktion. Die Sensor-Dry-Funktion erkennt den Trocknungsgrad und stoppt automatisch. Die 8 kg Kapazität eignet sich für mittlere Haushalte. Das B Energiesiegel sorgt für moderaten Stromverbrauch. Die 15 Programme bieten individuelle Einstellungen. Die Wrinkle-Prevent-Funktion verhindert Faltenbildung. Das elegante Design passt in jede Küche. Perfekt für effizientes Trocknen.", shortDesc: "Samsung-Kondensations-Trockner mit Sensor-Dry und 8 kg Kapazität",
    price: 1330, sku: "SAMSUNGTROCKNER",
    rating: 4.8, reviewCount: 295, categorySlug: "haushaltsgeraete", brandSlug: "samsung",
    specs: [
      { key: "Kapazität", value: "8 kg" },
      { key: "Trocknungsart", value: "Kondensation" },
      { key: "Energieklasse", value: "B" },
      { key: "Programme", value: "15" },
      { key: "Abmessungen", value: "60 x 85 x 60 cm" },
    ]
  },
  {
    name: "LG Turbowash Wv9 1412w", slug: "lg-turbowash-wv9-1412w",
    description: "Die LG TurboWash WV9-1412W ist eine Premium-Waschmaschine mit TurboWash-Funktion. Die TurboWash-Funktion verkürzt die Waschzeit um bis zu 59 Minuten. Die 14 kg Kapazität eignet sich für große Familien. Die 1400 U/min Schleuderung sorgt für optimale Ergebnisse. Das A+++ Energiesiegel sorgt für Energieeffizienz. Die Steam-Funktion erfrischt Wäsche mit Dampf. Die Smart-ThinQ-App ermöglicht die Fernbedienung. Das Premium-Modell für schnelles Waschen.", shortDesc: "LG-Premium-Waschmaschine mit TurboWash und 14 kg Kapazität",
    price: 1390, sku: "LGTURBOWASHWV91",
    rating: 4.6, reviewCount: 235, categorySlug: "haushaltsgeraete", brandSlug: "lg",
    specs: [
      { key: "Kapazität", value: "14 kg" },
      { key: "Schleuderdrehzahl", value: "1400 U/min" },
      { key: "Energieklasse", value: "A+++" },
      { key: "Technologie", value: "TurboWash" },
      { key: "Programme", value: "16" },
      { key: "Abmessungen", value: "60 x 85 x 60 cm" },
    ]
  },
  {
    name: "LG Washtower P9wba", slug: "lg-washtower-p9wba",
    description: "Der LG WashTower P9WBA ist ein kombinierter Waschtürme mit Waschmaschine und Wärmepumpentrockner. Die Kombination spart Platz durch vertikales Design. Die Waschmaschine bietet 13 kg Kapazität. Der Trockner bietet 10 kg Kapazität mit Wärmepumpe. Die Smart-ThinQ-App ermöglicht die Fernbedienung beider Geräte. Das elegante Design passt in jede Küche. Perfekt für platzsparende Wasch- und Trocknungslösung.", shortDesc: "Kombinierter Waschturm mit 13kg Waschen und 10kg Trocknen",
    price: 2120, originalPrice: 2438, sku: "LGWASHTOWERP9WB", isNew: true, isPromo: true,
    rating: 4, reviewCount: 254, categorySlug: "haushaltsgeraete", brandSlug: "lg",
    specs: [
      { key: "Waschkapazität", value: "13 kg" },
      { key: "Trocknungskapazität", value: "10 kg" },
      { key: "Trocknungsart", value: "Wärmepumpe" },
      { key: "Steuerung", value: "SmartThinQ App" },
      { key: "Abmessungen", value: "60 x 166 x 65 cm" },
    ]
  },
  {
    name: "AEG Lr9a80600 Waschmaschine", slug: "aeg-lr9a80600-waschmaschine",
    description: "Die AEG LR9A80600 ist eine Premium-Waschmaschine mit ÖkoInverter-Motor und ProSense-Technologie. Die ProSense-Technologie passt Wasser- und Energieverbrauch automatisch an die Beladung an. Der ÖkoInverter-Motor arbeitet besonders leise und langlebig. Die HygieneOption tötet 99,9% der Bakterien ab. Die 1600 U/min Schleuderung sorgt für optimale Ergebnisse. Das A+++ Energiesiegel sorgt für Energieeffizienz. Die 8 kg Kapazität eignet sich für mittlere bis große Haushalte. Perfekt für anspruchsvolle Wäsche.", shortDesc: "Premium-Waschmaschine mit ProSense und ÖkoInverter (8 kg)",
    price: 2960, originalPrice: 3404, sku: "AEGLR9A80600WAS", isPromo: true,
    rating: 4.2, reviewCount: 208, categorySlug: "haushaltsgeraete", brandSlug: "aeg",
    specs: [
      { key: "Kapazität", value: "8 kg" },
      { key: "Schleuderdrehzahl", value: "1600 U/min" },
      { key: "Energieklasse", value: "A+++" },
      { key: "Motor", value: "ÖkoInverter" },
      { key: "Wasserverbrauch", value: "10,9 Liter" },
      { key: "Abmessungen", value: "60 x 85 x 60 cm" },
    ]
  },
  {
    name: "AEG Tr9a865r Trockner", slug: "aeg-tr9a865r-trockner",
    description: "Der AEG TR9A865R ist ein Wärmepumpentrockner mit HarvestCycle-Technologie. Die HarvestCycle-Technologie nutzt Restwärme für energieeffizientes Trocknen. Der ÖkoInverter-Motor arbeitet besonders leise und langlebig. Die Sensorentrocknung erkennt den Trocknungsgrad und stoppt automatisch. Die 9 kg Kapazität eignet sich für mittlere bis große Haushalte. Das A++ Energiesiegel sorgt für Energieeffizienz. Die SelfCleaning-Condenser reinigt den Kondensator automatisch. Perfekt für effizientes Trocknen.", shortDesc: "Wärmepumpentrockner mit HarvestCycle und SelfCleaning-Condenser",
    price: 310, sku: "AEGTR9A865RTROC",
    rating: 4.1, reviewCount: 245, categorySlug: "haushaltsgeraete", brandSlug: "aeg",
    specs: [
      { key: "Kapazität", value: "9 kg" },
      { key: "Trocknungsart", value: "Wärmepumpe" },
      { key: "Energieklasse", value: "A++" },
      { key: "Motor", value: "ÖkoInverter" },
      { key: "Restfeuchte", value: "Sensorgesteuert" },
      { key: "Abmessungen", value: "60 x 85 x 65 cm" },
    ]
  },
  {
    name: "Electrolux Ew7f348sg Waschmaschine", slug: "electrolux-ew7f348sg-waschmaschine",
    description: "Die Electrolux EW7F348SG ist eine Premium-Waschmaschine mit HeatPump-Technologie. Die Wärmepumpe nutzt Restwärme für energieeffizientes Waschen. Die 8 kg Kapazität eignet sich für mittlere Haushalte. Die 1400 U/min Schleuderung sorgt für optimale Ergebnisse. Das A+++ Energiesiegel sorgt für Energieeffizienz. Die Sensorentrocknung erkennt den Trocknungsgrad. Die SelfCleaning-Condenser reinigt den Kondensator automatisch. Perfekt für energieeffizientes Waschen.", shortDesc: "Waschmaschine mit HeatPump und 8 kg Kapazität",
    price: 540, sku: "ELECTROLUXEW7F3", isFeatured: true,
    rating: 4.4, reviewCount: 50, categorySlug: "haushaltsgeraete", brandSlug: "electrolux",
    specs: [
      { key: "Kapazität", value: "8 kg" },
      { key: "Schleuderdrehzahl", value: "1400 U/min" },
      { key: "Energieklasse", value: "A+++" },
      { key: "Trocknungsart", value: "Wärmepumpe" },
      { key: "Programme", value: "12" },
      { key: "Abmessungen", value: "60 x 85 x 60 cm" },
    ]
  },
  {
    name: "Electrolux Ew7h348w Trockner", slug: "electrolux-ew7h348w-trockner",
    description: "Der Electrolux EW7H348W ist ein Wärmepumpentrockner mit Sensorentrocknung. Die Sensorentrocknung erkennt den Trocknungsgrad und stoppt automatisch. Die 8 kg Kapazität eignet sich für mittlere Haushalte. Das A++ Energiesiegel sorgt für Energieeffizienz. Die SelfCleaning-Condenser reinigt den Kondensator automatisch. Die Sensoren-Temperaturregelung schont die Wäsche. Das kompakte Design passt in jede Küche. Perfekt für effizientes Trocknen.", shortDesc: "Wärmepumpentrockner mit Sensorentrocknung und 8 kg Kapazität",
    price: 2660, sku: "ELECTROLUXEW7H3",
    rating: 4.8, reviewCount: 280, categorySlug: "haushaltsgeraete", brandSlug: "electrolux",
    specs: [
      { key: "Kapazität", value: "8 kg" },
      { key: "Trocknungsart", value: "Wärmepumpe" },
      { key: "Energieklasse", value: "A++" },
      { key: "Sensoren", value: "Temperatur und Feuchtigkeit" },
      { key: "Abmessungen", value: "60 x 85 x 60 cm" },
    ]
  },
  {
    name: "Haier Hw100 B1439lu1 Waschmaschine", slug: "haier-hw100-b1439lu1-waschmaschine",
    description: "Die Haier HW100-B1439LU1 ist eine Premium-Waschmaschine mit Direct-Motion-Motor. Die Direct-Motion-Technologie arbeitet besonders leise und langlebig. Die 10 kg Kapazität eignet sich für große Haushalte. Die 1400 U/min Schleuderung sorgt für optimale Ergebnisse. Das A+++ Energiesiegel sorgt für Energieeffizienz. Die Anti-Allergie-Option entfernt Allergene effektiv. Die Steam-Option erfrischt Wäsche mit Dampf. Perfekt für leises und gründliches Waschen.", shortDesc: "Premium-Waschmaschine mit Direct-Motion und 10 kg Kapazität",
    price: 480, sku: "HAIERHW100B1439",
    rating: 4.8, reviewCount: 174, categorySlug: "haushaltsgeraete", brandSlug: "haier",
    specs: [
      { key: "Kapazität", value: "10 kg" },
      { key: "Schleuderdrehzahl", value: "1400 U/min" },
      { key: "Energieklasse", value: "A+++" },
      { key: "Motor", value: "Direct-Motion" },
      { key: "Programme", value: "16" },
      { key: "Abmessungen", value: "60 x 85 x 60 cm" },
    ]
  },
  {
    name: "Haier Hd100 A2939 Trockner", slug: "haier-hd100-a2939-trockner",
    description: "Der Haier HD100-A2939 ist ein Wärmepumpentrockner mit Thomson-Technologie. Die Thomson-Technologie sorgt für gleichmäßiges Trocknen. Die 10 kg Kapazität eignet sich für große Haushalte. Das A++ Energiesiegel sorgt für Energieeffizienz. Die Sensor-Feuchtigkeitssteuerung erkennt den Trocknungsgrad. Die 15 Programme bieten individuelle Einstellungen. Das kompakte Design passt in jede Küche. Perfekt für effizientes Trocknen.", shortDesc: "Wärmepumpentrockner mit Thomson-Technologie und 10 kg Kapazität",
    price: 530, sku: "HAIERHD100A2939",
    rating: 4.1, reviewCount: 74, categorySlug: "haushaltsgeraete", brandSlug: "haier",
    specs: [
      { key: "Kapazität", value: "10 kg" },
      { key: "Trocknungsart", value: "Wärmepumpe" },
      { key: "Energieklasse", value: "A++" },
      { key: "Programme", value: "15" },
      { key: "Abmessungen", value: "60 x 85 x 60 cm" },
    ]
  },
  {
    name: "BEKO Wrs 55p12 Sw Waschmaschine", slug: "beko-wrs-55p12-sw-waschmaschine",
    description: "Die Beko WRS 55 P12 SW ist eine kompakte Waschmaschine mit ProSmart-Inverter-Motor. Die ProSmart-Technologie sorgt für leisen und energieeffizienten Betrieb. Die 15 Programme bieten individuelle Wascheinstellungen. Die 5 kg Kapazität eignet sich für kleine Haushalte. Das A+++ Energiesiegel sorgt für Energieeffizienz. Die 1200 U/min Schleuderung sorgt für optimale Ergebnisse. Das kompakte Design von 60 cm Breite passt in jede Küche. Perfekt für kleine Haushalte.", shortDesc: "Kompakte Waschmaschine mit ProSmart-Motor und 5 kg Kapazität",
    price: 1520, sku: "BEKOWRS55P12SWW",
    rating: 4.5, reviewCount: 51, categorySlug: "haushaltsgeraete", brandSlug: "beko",
    specs: [
      { key: "Kapazität", value: "5 kg" },
      { key: "Schleuderdrehzahl", value: "1200 U/min" },
      { key: "Energieklasse", value: "A+++" },
      { key: "Motor", value: "ProSmart-Inverter" },
      { key: "Programme", value: "15" },
      { key: "Abmessungen", value: "60 x 85 x 45 cm" },
    ]
  },
  {
    name: "BEKO Dp 8534 Gxa1 Trockner", slug: "beko-dp-8534-gxa1-trockner",
    description: "Der Beko DP 8534 GXA1 Trockner ist ein Wärmepumpentrockner mit EcoGentle-Technologie. Die EcoGentle-Technologie trocknet schonend bei niedriger Temperatur. Die 8 kg Kapazität eignet sich für mittlere Haushalte. Das A++ Energiesiegel sorgt für Energieeffizienz. Die Sensor-Feuchtigkeitssteuerung erkennt den Trocknungsgrad. Die 15 Programme bieten individuelle Einstellungen. Das kompakte Design passt in jede Küche. Perfekt für energieeffizientes Trocknen.", shortDesc: "Wärmepumpentrockner mit EcoGentle und 8 kg Kapazität",
    price: 1610, sku: "BEKODP8534GXA1T",
    rating: 4.1, reviewCount: 107, categorySlug: "haushaltsgeraete", brandSlug: "beko",
    specs: [
      { key: "Kapazität", value: "8 kg" },
      { key: "Trocknungsart", value: "Wärmepumpe" },
      { key: "Energieklasse", value: "A++" },
      { key: "Programme", value: "15" },
      { key: "Abmessungen", value: "60 x 85 x 60 cm" },
    ]
  },
  {
    name: "Bosch Serie2 Waschmaschine Wgg244z01", slug: "bosch-serie2-waschmaschine-wgg244z01",
    description: "Die Bosch Serie 2 Waschmaschine WGG244Z01 ist eine kompakte Waschmaschine mit i-DOS-Technologie. Die i-DOS-Technologie dosiert Waschmittel automatisch präzise. Die 9 kg Kapazität eignet sich für mittlere Haushalte. Die 1400 U/min Schleuderung sorgt für optimale Ergebnisse. Das A+++ Energiesiegel sorgt für Energieeffizienz. Die varioSpeed-Funktion verkürzt die Waschzeit. Die Home-Connect-App ermöglicht die Fernbedienung. Perfekt für automatisches Waschen.", shortDesc: "Bosch-Kompakt-Waschmaschine mit i-DOS und 9 kg Kapazität",
    price: 1100, sku: "BOSCHSERIE2WASC", isNew: true,
    rating: 4.9, reviewCount: 54, categorySlug: "haushaltsgeraete", brandSlug: "bosch",
    specs: [
      { key: "Kapazität", value: "9 kg" },
      { key: "Schleuderdrehzahl", value: "1400 U/min" },
      { key: "Energieklasse", value: "A+++" },
      { key: "Dosierung", value: "i-DOS" },
      { key: "Programme", value: "14" },
      { key: "Abmessungen", value: "60 x 85 x 60 cm" },
    ]
  },
  {
    name: "Siemens Iq300 Waschmaschine Wg44g200", slug: "siemens-iq300-waschmaschine-wg44g200",
    description: "Die Siemens iQ300 Waschmaschine WG44G200 ist eine kompakte Waschmaschine mit i-DOS-Technologie. Die i-DOS-Technologie dosiert Waschmittel automatisch präzise. Die 9 kg Kapazität eignet sich für mittlere Haushalte. Die 1400 U/min Schleuderung sorgt für optimale Ergebnisse. Das A+++ Energiesiegel sorgt für Energieeffizienz. Die varioSpeed-Funktion verkürzt die Waschzeit. Die Home-Connect-App ermöglicht die Fernbedienung. Perfekt für automatisches Waschen.", shortDesc: "Siemens-Waschmaschine mit i-DOS und 9 kg Kapazität",
    price: 780, originalPrice: 897, sku: "SIEMENSIQ300WAS", isPromo: true,
    rating: 4.6, reviewCount: 291, categorySlug: "haushaltsgeraete", brandSlug: "siemens",
    specs: [
      { key: "Kapazität", value: "9 kg" },
      { key: "Schleuderdrehzahl", value: "1400 U/min" },
      { key: "Energieklasse", value: "A+++" },
      { key: "Dosierung", value: "i-DOS" },
      { key: "Programme", value: "14" },
      { key: "Abmessungen", value: "60 x 85 x 60 cm" },
    ]
  },
  {
    name: "Miele W1 Waschmaschine Wsd363", slug: "miele-w1-waschmaschine-wsd363",
    description: "Die Miele W1 Waschmaschine WSD363 ist die neueste Premium-Waschmaschine von Miele mit TwinDos-Technologie. Die TwinDos-Technologie dosiert Waschmittel automatisch präzise. Die CapDosing-Technologie offeriert spezielle Zusätze. Die 8 kg Kapazität eignet sich für mittlere Haushalte. Die 1600 U/min Schleuderung sorgt für optimale Ergebnisse. Das A+++ Energiesiegel sorgt für Energieeffizienz. Die Miele@home-Steuerung ermöglicht die Fernbedienung. Die neueste Generation für maximale Ansprüche.", shortDesc: "Neueste Miele-Premium-Waschmaschine mit TwinDos und Miele@home",
    price: 740, sku: "MIELEW1WASCHMAS",
    rating: 4.2, reviewCount: 27, categorySlug: "haushaltsgeraete", brandSlug: "miele",
    specs: [
      { key: "Kapazität", value: "8 kg" },
      { key: "Schleuderdrehzahl", value: "1600 U/min" },
      { key: "Energieklasse", value: "A+++" },
      { key: "Dosierung", value: "TwinDos + CapDosing" },
      { key: "Steuerung", value: "Miele@home App" },
      { key: "Abmessungen", value: "60 x 85 x 60 cm" },
    ]
  },
  {
    name: "Miele T1 Trockner Tmv843", slug: "miele-t1-trockner-tmv843",
    description: "Der Miele T1 Trockner TMV843 ist ein Premium-Wärmepumpentrockner mit EcoDry-Technologie. Die EcoDry-Technologie sorgt für dauerhaft energieeffizientes Trocknen. Die 9 kg Kapazität eignet sich für mittlere bis große Haushalte. Das A++ Energiesiegel sorgt für Energieeffizienz. Die Sensorentrocknung erkennt den Trocknungsgrad. Die 12 Programme bieten individuelle Einstellungen. Das elegante Design passt in jede Küche. Das Premium-Modell für energieeffizientes Trocknen.", shortDesc: "Premium-Miele-Wärmepumpentrockner mit EcoDry und 9 kg",
    price: 1340, sku: "MIELET1TROCKNER",
    rating: 4.1, reviewCount: 20, categorySlug: "haushaltsgeraete", brandSlug: "miele",
    specs: [
      { key: "Kapazität", value: "9 kg" },
      { key: "Trocknungsart", value: "Wärmepumpe" },
      { key: "Energieklasse", value: "A++" },
      { key: "Programme", value: "12" },
      { key: "Abmessungen", value: "60 x 85 x 65 cm" },
    ]
  },
  {
    name: "Samsung Waschmaschine Ww90t684dln", slug: "samsung-waschmaschine-ww90t684dln",
    description: "Die Samsung Waschmaschine WW90T684DLN ist eine Premium-Waschmaschine mit SuperSpeed-Funktion. Die SuperSpeed-Funktion verkürzt die Waschzeit um bis zu 35%. Die 9 kg Kapazität eignet sich für mittlere bis große Haushalte. Die 1400 U/min Schleuderung sorgt für optimale Ergebnisse. Das A+++ Energiesiegel sorgt für Energieeffizienz. Die HygieneOption tötet 99,9% der Bakterien ab. Die Smart-Things-App ermöglicht die Fernbedienung. Perfekt für schnelles und gründliches Waschen.", shortDesc: "Samsung-Premium-Waschmaschine mit SuperSpeed und 9 kg Kapazität",
    price: 1540, originalPrice: 1771, sku: "SAMSUNGWASCHMAS", isPromo: true,
    rating: 4.6, reviewCount: 126, categorySlug: "haushaltsgeraete", brandSlug: "samsung",
    specs: [
      { key: "Kapazität", value: "9 kg" },
      { key: "Schleuderdrehzahl", value: "1400 U/min" },
      { key: "Energieklasse", value: "A+++" },
      { key: "Besonderheit", value: "SuperSpeed" },
      { key: "Programme", value: "15" },
      { key: "Abmessungen", value: "60 x 85 x 60 cm" },
    ]
  },
  {
    name: "LG Waschmaschine F4wr711s2ha", slug: "lg-waschmaschine-f4wr711s2ha",
    description: "Die LG Waschmaschine F4WR711S2HA ist eine Premium-Waschmaschine mit TurboWash-Funktion. Die TurboWash-Funktion verkürzt die Waschzeit um bis zu 59 Minuten. Die 11 kg Kapazität eignet sich für mittlere bis große Familien. Die 1400 U/min Schleuderung sorgt für optimale Ergebnisse. Das A+++ Energiesiegel sorgt für Energieeffizienz. Die Steam-Funktion erfrischt Wäsche mit Dampf. Die Smart-ThinQ-App ermöglicht die Fernbedienung. Perfekt für schnelles Waschen.", shortDesc: "LG-Waschmaschine mit TurboWash und 11 kg Kapazität",
    price: 530, sku: "LGWASCHMASCHINE",
    rating: 4, reviewCount: 49, categorySlug: "haushaltsgeraete", brandSlug: "lg",
    specs: [
      { key: "Kapazität", value: "11 kg" },
      { key: "Schleuderdrehzahl", value: "1400 U/min" },
      { key: "Energieklasse", value: "A+++" },
      { key: "Technologie", value: "TurboWash" },
      { key: "Programme", value: "14" },
      { key: "Abmessungen", value: "60 x 85 x 60 cm" },
    ]
  },
  {
    name: "Bosch Serie6 Waschmaschine Wau28568", slug: "bosch-serie6-waschmaschine-wau28568",
    description: "Die Bosch Serie 6 Waschmaschine WAU28568 ist eine Premium-Waschmaschine mit i-DOS-Technologie. Die i-DOS-Technologie dosiert Waschmittel automatisch präzise. Die 9 kg Kapazität eignet sich für mittlere Haushalte. Die 1400 U/min Schleuderung sorgt für optimale Ergebnisse. Das A+++ Energiesiegel sorgt für Energieeffizienz. Die ActiveOxygen-Technologie entfernt Gerüche effektiv. Die Home-Connect-App ermöglicht die Fernbedienung. Das Premium-Modell für gründliches Waschen.", shortDesc: "Bosch-Premium-Waschmaschine mit i-DOS und ActiveOxygen",
    price: 2830, originalPrice: 3254, sku: "BOSCHSERIE6WASC", isPromo: true,
    rating: 4.7, reviewCount: 287, categorySlug: "haushaltsgeraete", brandSlug: "bosch",
    specs: [
      { key: "Kapazität", value: "9 kg" },
      { key: "Schleuderdrehzahl", value: "1400 U/min" },
      { key: "Energieklasse", value: "A+++" },
      { key: "Dosierung", value: "i-DOS" },
      { key: "Programme", value: "14" },
      { key: "Abmessungen", value: "60 x 85 x 60 cm" },
    ]
  },
  {
    name: "Siemens Waschmaschine Wg44g202", slug: "siemens-waschmaschine-wg44g202",
    description: "Die Siemens Waschmaschine WG44G202 ist eine kompakte Waschmaschine mit waterPerfect-Technologie. Die waterPerfect-Technologie sorgt für optimalen Wasserverbrauch. Die 9 kg Kapazität eignet sich für mittlere Haushalte. Die 1400 U/min Schleuderung sorgt für optimale Ergebnisse. Das A+++ Energiesiegel sorgt für Energieeffizienz. Die varioSpeed-Funktion verkürzt die Waschzeit. Die Home-Connect-App ermöglicht die Fernbedienung. Perfekt für effizientes Waschen.", shortDesc: "Siemens-Waschmaschine mit waterPerfect und 9 kg Kapazität",
    price: 2020, sku: "SIEMENSWASCHMAS", isFeatured: true,
    rating: 4.3, reviewCount: 110, categorySlug: "haushaltsgeraete", brandSlug: "siemens",
    specs: [
      { key: "Kapazität", value: "9 kg" },
      { key: "Schleuderdrehzahl", value: "1400 U/min" },
      { key: "Energieklasse", value: "A+++" },
      { key: "Technologie", value: "waterPerfect" },
      { key: "Programme", value: "14" },
      { key: "Abmessungen", value: "60 x 85 x 60 cm" },
    ]
  },
  {
    name: "BEKO Trockner Dpy8534gxa1", slug: "beko-trockner-dpy8534gxa1",
    description: "Der Beko Trockner DPY8534GXA1 ist ein Wärmepumpentrockner mit EcoGentle-Technologie. Die EcoGentle-Technologie trocknet schonend bei niedriger Temperatur. Die 8 kg Kapazität eignet sich für mittlere Haushalte. Das A++ Energiesiegel sorgt für Energieeffizienz. Die Sensor-Feuchtigkeitssteuerung erkennt den Trocknungsgrad. Die 15 Programme bieten individuelle Einstellungen. Das kompakte Design passt in jede Küche. Perfekt für energieeffizientes Trocknen.", shortDesc: "Wärmepumpentrockner mit EcoGentle und 8 kg Kapazität",
    price: 2690, originalPrice: 3093, sku: "BEKOTROCKNERDPY", isPromo: true,
    rating: 4.9, reviewCount: 152, categorySlug: "haushaltsgeraete", brandSlug: "beko",
    specs: [
      { key: "Kapazität", value: "8 kg" },
      { key: "Trocknungsart", value: "Wärmepumpe" },
      { key: "Energieklasse", value: "A++" },
      { key: "Programme", value: "15" },
      { key: "Abmessungen", value: "60 x 85 x 60 cm" },
    ]
  },
  {
    name: "Liebherr Monokuhlschrank Kbes3660", slug: "liebherr-monokuhlschrank-kbes3660",
    description: "Der Liebherr Monokühlschrank KBes3660 ist ein freistehender Kühlschrank mit BioFresh-Technologie. Die BioFresh-Technologie hält Lebensmittel besonders frisch. Die 354 Liter Volumen bietet ausreichend Platz. Die LED-Beleuchtung sorgt für optimale Sicht. Die FrostSafe-Technologie schützt vor Temperaturschwankungen. Das elegante Design passt in jede Küche. Perfekt für frische Lebensmittel.", shortDesc: "Liebherr-Monokühlschrank mit BioFresh und 354L",
    price: 2860, sku: "LIEBHERRMONOKUH",
    rating: 4.3, reviewCount: 219, categorySlug: "haushaltsgeraete", brandSlug: "liebherr",
    specs: [
      { key: "Volumen", value: "354 Liter" },
      { key: "Kühltechnologie", value: "BioFresh" },
      { key: "Energieklasse", value: "A++" },
      { key: "Abmessungen", value: "60 x 185 x 65 cm" },
    ]
  },
  {
    name: "Liebherr Komfort Kcbnesf3666", slug: "liebherr-komfort-kcbnesf3666",
    description: "Der Liebherr Komfort KCBNesf3666 ist ein freistehender Kühlschrank-Gefrierkombination mit BioFresh-Technologie. Die BioFresh-Technologie hält Lebensmittel besonders frisch. Die NoFrost-Technologie verhindert automatisch Eisbildung. Die 359 Liter Volumen bietet ausreichend Platz. Die LED-Beleuchtung sorgt für optimale Sicht. Die FrostSafe-Technologie schützt vor Temperaturschwankungen. Das elegante Design passt in jede Küche. Perfekt für frische Lebensmittel.", shortDesc: "Liebherr-Kühlschrank mit BioFresh, NoFrost und 359L",
    price: 2370, sku: "LIEBHERRKOMFORT",
    rating: 4.6, reviewCount: 147, categorySlug: "haushaltsgeraete", brandSlug: "liebherr",
    specs: [
      { key: "Volumen", value: "359 Liter" },
      { key: "Kühltechnologie", value: "BioFresh + NoFrost" },
      { key: "Kühlschrank", value: "264 Liter" },
      { key: "Gefrierfach", value: "95 Liter" },
      { key: "Abmessungen", value: "60 x 185 x 65 cm" },
    ]
  },
  {
    name: "Samsung Family Hub Rb38b7929s9", slug: "samsung-family-hub-rb38b7929s9",
    description: "Der Samsung Family Hub RB38B7929S9 ist ein Premium-Kühlschrank mit 38 cm Breite und Family-Hub-Technologie. Das 21,5-Zoll-Touchdisplay ermöglicht die Fernbedienung und Information. Die Smart-Home-Integration steuert kompatible Geräte über das Display. Die Interior-Cam zeigt den Inhalt des Kühlschranks auf dem Smartphone. Die Twin-Cooling-Plus-Technologie hält Lebensmittel frisch. Die No-Frost-Technologie verhindert Eisbildung. Die Energieeffizienzklasse A++ sorgt für Energieeinsparung. Das Family Hub macht den Kühlschrank zum digitalen Herzstück der Küche.", shortDesc: "Premium-Kühlschrank mit 21,5\" Touchdisplay und Family Hub",
    price: 290, originalPrice: 334, sku: "SAMSUNGFAMILYHU", isNew: true, isPromo: true,
    rating: 4.3, reviewCount: 104, categorySlug: "smart-home", brandSlug: "samsung",
    specs: [
      { key: "Volumen", value: "385 Liter" },
      { key: "Display", value: "21,5 Zoll Touch" },
      { key: "Kühltechnologie", value: "Twin-Cooling-Plus" },
      { key: "Energieklasse", value: "A++" },
      { key: "Abmessungen", value: "59,5 x 185 x 64,8 cm" },
      { key: "Farbe", value: "Edelstahl" },
    ]
  },
  {
    name: "Samsung Bespoke Lrfx28b3230s", slug: "samsung-bespoke-lrfx28b3230s",
    description: "Der Samsung Bespoke LRFX28B3230S ist ein eleganter Kühlschrank im Bespoke-Design. Die Counter Depth-Bauweise baut bündig mit der Arbeitsplatte. Die Twin Cooling Plus-Technologie hält Lebensmittel besonders frisch. Die 553 Liter Volumen bietet ausreichend Platz. Die LED-Beleuchtung sorgt für optimale Sicht. Das Bespoke-Design in verschiedenen Farben passt zu jeder Kücheneinrichtung. Die Smart-Things-App ermöglicht die Fernbedienung. Perfekt für designbewusste Küchen.", shortDesc: "Bespoke-Kühlschrank mit Counter Depth und Twin Cooling Plus",
    price: 2900, originalPrice: 3335, sku: "SAMSUNGBESPOKEL", isPromo: true,
    rating: 4.8, reviewCount: 94, categorySlug: "haushaltsgeraete", brandSlug: "samsung",
    specs: [
      { key: "Volumen", value: "553 Liter" },
      { key: "Kühltechnologie", value: "Twin Cooling Plus" },
      { key: "Design", value: "Bespoke Counter Depth" },
      { key: "Energieklasse", value: "A++" },
      { key: "Abmessungen", value: "91 x 178 x 68 cm" },
    ]
  },
  {
    name: "Samsung Side By Side Rs758711dqp", slug: "samsung-side-by-side-rs758711dqp",
    description: "Der Samsung Side-by-Side RS758711DQP ist ein Premium-Kühlschrank mit Family-Hub-Technologie. Die Family-Hub-Technologie macht den Kühlschrank zum digitalen Herzstück. Die Twin Cooling Plus-Technologie hält Lebensmittel besonders frisch. Die 617 Liter Volumen bietet ausreichend Platz für große Familien. Die interne Kamera zeigt den Inhalt des Kühlschranks auf dem Smartphone. Das Side-by-Side-Design passt in moderne Küchen. Perfekt für große Familien.", shortDesc: "Samsung-Side-by-Side mit Family Hub und 617L",
    price: 370, sku: "SAMSUNGSIDEBYSI", isFeatured: true, isNew: true,
    rating: 4, reviewCount: 292, categorySlug: "haushaltsgeraete", brandSlug: "samsung",
    specs: [
      { key: "Volumen", value: "617 Liter" },
      { key: "Kühltechnologie", value: "Twin Cooling Plus" },
      { key: "Design", value: "Side-by-Side" },
      { key: "Steuerung", value: "Family Hub Display" },
      { key: "Abmessungen", value: "91 x 180 x 72 cm" },
    ]
  },
  {
    name: "Samsung Gefrierschrank Rz32r743601", slug: "samsung-gefrierschrank-rz32r743601",
    description: "Der Samsung Gefrierschrank RZ32R743601 ist ein freistehender Gefrierschrank mit NoFrost-Technologie. Die NoFrost-Technologie verhindert automatisch Eisbildung. Die 324 Liter Volumen bietet ausreichend Platz. Die LED-Beleuchtung sorgt für optimale Sicht. Die SpaceMax-Technologie maximiert den Innenraum. Das elegante Design passt in jede Küche. Perfekt für plaque sparende Gefrierung.", shortDesc: "Samsung-Gefrierschrank mit NoFrost und 324L Volumen",
    price: 2710, sku: "SAMSUNGGEFRIERS",
    rating: 4, reviewCount: 137, categorySlug: "haushaltsgeraete", brandSlug: "samsung",
    specs: [
      { key: "Volumen", value: "324 Liter" },
      { key: "Gefriertechnologie", value: "NoFrost" },
      { key: "Energieklasse", value: "A++" },
      { key: "Abmessungen", value: "60 x 185 x 65 cm" },
    ]
  },
  {
    name: "Bosch Serie6 Kuhlschrank Kgn36aw3a", slug: "bosch-serie6-kuhlschrank-kgn36aw3a",
    description: "Der Bosch Serie 6 Kühlschrank KGN36AW3A ist ein freistehender Kühlschrank-Gefrierkombination mit FreshSense-Technologie. Die FreshSense-Technologie sorgt für konstante Temperaturen. Die NoFrost-Technologie verhindert automatisch Eisbildung. Die 324 Liter Volumen bietet ausreichend Platz. Die LED-Beleuchtung sorgt für optimale Sicht. Die VitaFresh-Zone bietet optimale Lagerungsbedingungen. Das elegante Design passt in jede Küche. Perfekt für frische Lebensmittel.", shortDesc: "Kühlschrank-Gefrierkombination mit FreshSense und NoFrost",
    price: 2270, originalPrice: 2611, sku: "BOSCHSERIE6KUHL", isPromo: true,
    rating: 4.2, reviewCount: 306, categorySlug: "haushaltsgeraete", brandSlug: "bosch",
    specs: [
      { key: "Volumen", value: "324 Liter" },
      { key: "Kühltechnologie", value: "FreshSense + NoFrost" },
      { key: "Kühlschrank", value: "238 Liter" },
      { key: "Gefrierfach", value: "86 Liter" },
      { key: "Abmessungen", value: "60 x 186 x 65 cm" },
    ]
  },
  {
    name: "Bosch Serie4 Einbau Kuhlschrank Kiv83vse0", slug: "bosch-serie4-einbau-kuhlschrank-kiv83vse0",
    description: "Der Bosch Serie 4 Einbau-Kühlschrank KIV83VSE0 ist ein Einbau-Kühlschrank mit NoFrost-Technologie. Die NoFrost-Technologie verhindert automatisch Eisbildung. Die MultiAirflow-Technologie sorgt für gleichmäßige Kühlung. Die 266 Liter Volumen bietet ausreichend Platz. Die LED-Beleuchtung sorgt für optimale Sicht. Die Energiespareinstellungen reduzieren den Stromverbrauch. Das Einbau-Design passt in jede Küchenzeile. Perfekt für plaque sparende Kühlung.", shortDesc: "Einbau-Kühlschrank mit NoFrost und MultiAirflow",
    price: 2580, sku: "BOSCHSERIE4EINB",
    rating: 4.3, reviewCount: 194, categorySlug: "haushaltsgeraete", brandSlug: "bosch",
    specs: [
      { key: "Volumen", value: "266 Liter" },
      { key: "Kühltechnologie", value: "NoFrost" },
      { key: "Luftzirkulation", value: "MultiAirflow" },
      { key: "Energieklasse", value: "A++" },
      { key: "Abmessungen", value: "56 x 177 x 55 cm" },
    ]
  },
  {
    name: "Siemens Iq700 Kuhlschrank Kg39nxb60", slug: "siemens-iq700-kuhlschrank-kg39nxb60",
    description: "Der Siemens iQ700 Kühlschrank KG39NXB60 ist ein freistehender Kühlschrank mit hyperFresh-Funktion. Die hyperFresh-Funktion hält Lebensmittel besonders frisch. Die 366 Liter Volumen bietet ausreichend Platz. Die LED-Beleuchtung sorgt für optimale Sicht. Die noFrost-Technologie verhindert automatisch Eisbildung. Die voiceControl-Funktion ermöglicht Sprachsteuerung. Das elegante Design passt in jede Küche. Perfekt für frische Lebensmittel.", shortDesc: "Freistehender Kühlschrank mit hyperFresh und 366L Volumen",
    price: 1300, sku: "SIEMENSIQ700KUH",
    rating: 4.7, reviewCount: 214, categorySlug: "haushaltsgeraete", brandSlug: "siemens",
    specs: [
      { key: "Volumen", value: "366 Liter" },
      { key: "Kühltechnologie", value: "hyperFresh + noFrost" },
      { key: "Steuerung", value: "voiceControl" },
      { key: "Energieklasse", value: "A++" },
      { key: "Abmessungen", value: "60 x 185 x 65 cm" },
    ]
  },
  {
    name: "Siemens Iq500 Einbau Kuhlschrank Kg39eadla0", slug: "siemens-iq500-einbau-kuhlschrank-kg39eadla0",
    description: "Der Siemens iQ500 Einbau-Kühlschrank KG39EADLA0 ist ein Einbau-Kühlschrank mit hyperFresh-Funktion. Die hyperFresh-Funktion hält Lebensmittel besonders frisch. Die 308 Liter Volumen bietet ausreichend Platz. Die LED-Beleuchtung sorgt für optimale Sicht. Die noFrost-Technologie verhindert automatisch Eisbildung. Die voiceControl-Funktion ermöglicht Sprachsteuerung. Das Einbau-Design passt in jede Küchenzeile. Perfekt für frische Lebensmittel.", shortDesc: "Einbau-Kühlschrank mit hyperFresh und 308L Volumen",
    price: 2990, originalPrice: 3438, sku: "SIEMENSIQ5002", isPromo: true,
    rating: 4.2, reviewCount: 120, categorySlug: "haushaltsgeraete", brandSlug: "siemens",
    specs: [
      { key: "Volumen", value: "308 Liter" },
      { key: "Kühltechnologie", value: "hyperFresh + noFrost" },
      { key: "Steuerung", value: "voiceControl" },
      { key: "Energieklasse", value: "A++" },
      { key: "Abmessungen", value: "56 x 177 x 55 cm" },
    ]
  },
  {
    name: "Miele Kuhlschrank K2801sfvi", slug: "miele-kuhlschrank-k2801sfvi",
    description: "Der Miele Kühlschrank K2801SFVI ist ein Einbau-Kühlschrank mit PerfectFresh-Technologie. Die PerfectFresh-Technologie hält Lebensmittel besonders frisch. Die 278 Liter Volumen bietet ausreichend Platz. Die LED-Beleuchtung sorgt für optimale Sicht. Die DynaCool-Technologie sorgt für gleichmäßige Luftverteilung. Die FrostSafe-Technologie schützt vor Temperaturschwankungen. Das Einbau-Design passt in jede Küchenzeile. Perfekt für frische Lebensmittel.", shortDesc: "Einbau-Kühlschrank mit PerfectFresh und 278L Volumen",
    price: 1110, originalPrice: 1277, sku: "MIELEKUHLSCHRAN", isPromo: true,
    rating: 4.7, reviewCount: 218, categorySlug: "haushaltsgeraete", brandSlug: "miele",
    specs: [
      { key: "Volumen", value: "278 Liter" },
      { key: "Kühltechnologie", value: "PerfectFresh" },
      { key: "Luftverteilung", value: "DynaCool" },
      { key: "Energieklasse", value: "A++" },
      { key: "Abmessungen", value: "56 x 177 x 55 cm" },
    ]
  },
  {
    name: "Miele Mastercool Mcs1301w", slug: "miele-mastercool-mcs1301w",
    description: "Der Miele MasterCool MCS1301W ist ein Premium-Weinkühlschrank mit 2 Temperaturen. Die 2 Temperaturen ermöglichen das Lagern von verschiedenen Weinsorten. Die 33 Flaschen Kapazität eignet sich für Weinliebhaber. Die Vibrationsschutz-Technologie schont den Wein. Die LED-Beleuchtung sorgt für optimale Sicht. Die Türscharniere sind verstellbar. Das elegante Design passt zu jeder Kücheneinrichtung. Perfekt für Weinkenner.", shortDesc: "Premium-Weinkühlschrank mit 33 Flaschen und 2 Temperaturen",
    price: 2140, sku: "MIELEMASTERCOOL", isNew: true,
    rating: 4.2, reviewCount: 164, categorySlug: "haushaltsgeraete", brandSlug: "miele",
    specs: [
      { key: "Kapazität", value: "33 Flaschen" },
      { key: "Temperaturen", value: "2 Zonen" },
      { key: "Kühltechnologie", value: "Kompressor" },
      { key: "Beleuchtung", value: "LED" },
      { key: "Abmessungen", value: "59,5 x 185 x 60 cm" },
    ]
  },
  {
    name: "AEG Rcb53426tx Kuhlschrank", slug: "aeg-rcb53426tx-kuhlschrank",
    description: "Der AEG RCB53426TX ist ein Side-by-Side-Kühlschrank mit NoFrost-Technologie. Die NoFrost-Technologie verhindert automatisch Eisbildung. Die 526 Liter Volumen bietet ausreichend Platz für große Familien. Die LED-Beleuchtung sorgt für optimale Sicht. Der integrierte Wasserspender bietet kaltes Wasser. Das elegante Design in Edelstahl passt in moderne Küchen. Perfekt für große Familien.", shortDesc: "Side-by-Side mit NoFrost und 526L Volumen",
    price: 680, sku: "AEGRCB53426TXKU",
    rating: 4.3, reviewCount: 201, categorySlug: "haushaltsgeraete", brandSlug: "aeg",
    specs: [
      { key: "Volumen", value: "526 Liter" },
      { key: "Kühltechnologie", value: "NoFrost" },
      { key: "Dispenser", value: "Wasserspender" },
      { key: "Energieklasse", value: "A++" },
      { key: "Abmessungen", value: "91 x 178 x 71 cm" },
    ]
  },
  {
    name: "Electrolux Lrb3643sw Kuhlschrank", slug: "electrolux-lrb3643sw-kuhlschrank",
    description: "Der Electrolux LRB3643SW ist einSide-by-Side-Kühlschrank mit TwinTech-Technologie. Die TwinTech-Technologie trennt Kühlung und Gefrierung für optimale Ergebnisse. Die NoFrost-Technologie verhindert automatisch Eisbildung. Die 360 Liter Volumen bietet ausreichend Platz für große Haushalte. Die MultiBox-Schubladen bieten flexible Aufbewahrungsmöglichkeiten. Die LED-Beleuchtung sorgt für optimale Sicht. Das Side-by-Side-Design passt in moderne Küchen. Perfekt für große Haushalte.", shortDesc: "Side-by-Side-Kühlschrank mit TwinTech und 360L Volumen",
    price: 570, originalPrice: 656, sku: "ELECTROLUXLRB36", isFeatured: true, isPromo: true,
    rating: 4.7, reviewCount: 266, categorySlug: "haushaltsgeraete", brandSlug: "electrolux",
    specs: [
      { key: "Volumen", value: "360 Liter" },
      { key: "Kühltechnologie", value: "TwinTech NoFrost" },
      { key: "Schubladen", value: "MultiBox" },
      { key: "Energieklasse", value: "A++" },
      { key: "Abmessungen", value: "60 x 185 x 65 cm" },
    ]
  },
  {
    name: "Haier Monokuhlschrank Hb14g1aaag", slug: "haier-monokuhlschrank-hb14g1aaag",
    description: "Der Haier Monokühlschrank HB14G1AAAG ist ein Einbau-Kühlschrank mit Total-NoFrost-Technologie. Die Total-NoFrost-Technologie verhindert automatisch Eisbildung. Die Multi-Airflow-Technologie sorgt für gleichmäßige Kühlung. Die 264 Liter Volumen bietet ausreichend Platz. Die LED-Beleuchtung sorgt für optimale Sicht. Die Energiespareinstellungen reduzieren den Stromverbrauch. Das Einbau-Design passt in jede Küchenzeile. Perfekt für plaque sparende Kühlung.", shortDesc: "Einbau-Kühlschrank mit Total-NoFrost und Multi-Airflow",
    price: 530, sku: "HAIERMONOKUHLSC",
    rating: 4.3, reviewCount: 170, categorySlug: "haushaltsgeraete", brandSlug: "haier",
    specs: [
      { key: "Volumen", value: "264 Liter" },
      { key: "Kühltechnologie", value: "Total-NoFrost" },
      { key: "Luftzirkulation", value: "Multi-Airflow" },
      { key: "Energieklasse", value: "A++" },
      { key: "Abmessungen", value: "56 x 177 x 55 cm" },
    ]
  },
  {
    name: "Haier Side By Side Rs670n4aw1", slug: "haier-side-by-side-rs670n4aw1",
    description: "Der Haier Side-by-Side RS670N4AW1 ist ein großer Kühlschrank mit Dispenser und Multi-Zone-Kühlung. Die Multi-Zone-Kühlung ermöglicht separate Temperatureinstellungen. Die Total-NoFrost-Technologie verhindert automatisch Eisbildung. Die 521 Liter Volumen bietet ausreichend Platz für große Familien. Die LED-Beleuchtung sorgt für optimale Sicht. Der integrierte Wasserspender bietet kaltes Wasser. Das Side-by-Side-Design passt in moderne Küchen. Perfekt für große Familien.", shortDesc: "Side-by-Side mit 521L, Dispenser und Multi-Zone-Kühlung",
    price: 2980, sku: "HAIERSIDEBYSIDE",
    rating: 4.3, reviewCount: 28, categorySlug: "haushaltsgeraete", brandSlug: "haier",
    specs: [
      { key: "Volumen", value: "521 Liter" },
      { key: "Kühltechnologie", value: "Total-NoFrost" },
      { key: "Dispenser", value: "Wasserspender" },
      { key: "Energieklasse", value: "A++" },
      { key: "Abmessungen", value: "91 x 175 x 71 cm" },
    ]
  },
  {
    name: "BEKO Gne 134620 X Kuhlschrank", slug: "beko-gne-134620-x-kuhlschrank",
    description: "Der Beko GNE 134620 X Kühlschrank ist einSide-by-Side-Kühlschrank mit NeoFrost-Technologie. Die NeoFrost-Technologie sorgt für optimale Kühlung. Die 462 Liter Volumen bietet ausreichend Platz für große Familien. Die LED-Beleuchtung sorgt für optimale Sicht. Der integrierte Wasserspender bietet kaltes Wasser. Das elegante Design in Edelstahl passt in moderne Küchen. Perfekt für große Familien.", shortDesc: "Side-by-Side mit NeoFrost und 462L Volumen",
    price: 430, sku: "BEKOGNE134620XK",
    rating: 4.8, reviewCount: 147, categorySlug: "haushaltsgeraete", brandSlug: "beko",
    specs: [
      { key: "Volumen", value: "462 Liter" },
      { key: "Kühltechnologie", value: "NeoFrost" },
      { key: "Dispenser", value: "Wasserspender" },
      { key: "Energieklasse", value: "A++" },
      { key: "Abmessungen", value: "91 x 175 x 71 cm" },
    ]
  },
  {
    name: "BEKO Rbst140k25w Kuhlschrank", slug: "beko-rbst140k25w-kuhlschrank",
    description: "Der Beko RBST140K25W Kühlschrank ist ein kompakter Einbau-Kühlschrank. Die 139 Liter Volumen bietet ausreichend Platz für kleine Haushalte. Die LED-Beleuchtung sorgt für optimale Sicht. Die individuellen Kühlschrank-Einstellungen ermöglichen Anpassungen. Das Einbau-Design passt in jede Küchenzeile. Perfekt für kleine Haushalte und single Wohnungen.", shortDesc: "Kompakter Einbau-Kühlschrank mit 139L Volumen",
    price: 2260, originalPrice: 2599, sku: "BEKORBST140K25W", isFeatured: true, isPromo: true,
    rating: 4.7, reviewCount: 58, categorySlug: "haushaltsgeraete", brandSlug: "beko",
    specs: [
      { key: "Volumen", value: "139 Liter" },
      { key: "Kühltechnologie", value: "Statisch" },
      { key: "Energieklasse", value: "A++" },
      { key: "Abmessungen", value: "56 x 82 x 55 cm" },
    ]
  },
  {
    name: "V-ZUG Rq4601 Kuhlschrank", slug: "vzug-rq4601-kuhlschrank",
    description: "Der V-ZUG RQ4601 ist ein Premium-Einbau-Kühlschrank mit CoolEfficiency-Technologie. Die CoolEfficiency-Technologie sorgt für energieeffiziente Kühlung. Die 267 Liter Volumen bietet ausreichend Platz. Die LED-Beleuchtung sorgt für optimale Sicht. Die noFrost-Technologie verhindert automatisch Eisbildung. Das Schweizer Design passt in jede moderne Küche. Die einfache Bedienung ist intuitiv. Perfekt für energieeffiziente Kühlung.", shortDesc: "V-ZUG-Premium-Kühlschrank mit CoolEfficiency und noFrost",
    price: 780, sku: "VZUGRQ4601KUHLS", isFeatured: true,
    rating: 4.1, reviewCount: 31, categorySlug: "haushaltsgeraete", brandSlug: "vzug",
    specs: [
      { key: "Volumen", value: "267 Liter" },
      { key: "Kühltechnologie", value: "CoolEfficiency noFrost" },
      { key: "Energieklasse", value: "A++" },
      { key: "Herkunft", value: "Schweiz" },
      { key: "Abmessungen", value: "56 x 177 x 55 cm" },
    ]
  },
  {
    name: "Liebherr Mono Kef3566 Gefrierschrank", slug: "liebherr-mono-kef3566-gefrierschrank",
    description: "Der Liebherr Mono KEF3566 Gefrierschrank ist ein freistehender Gefrierschrank mit NoFrost-Technologie. Die NoFrost-Technologie verhindert automatisch Eisbildung. Die FrostSafe-Technologie schützt vor Temperaturschwankungen. Die 354 Liter Volumen bietet ausreichend Platz. Die LED-Beleuchtung sorgt für optimale Sicht. Die SoftMotion-Dämpfer ermöglichen sanftes Öffnen und Schließen. Das elegante Design passt in jede Küche. Perfekt für plaque sparende Gefrierung.", shortDesc: "Freistehender Gefrierschrank mit NoFrost und 354L",
    price: 600, sku: "LIEBHERRMONOKEF", isNew: true,
    rating: 4.4, reviewCount: 207, categorySlug: "haushaltsgeraete", brandSlug: "liebherr",
    specs: [
      { key: "Volumen", value: "354 Liter" },
      { key: "Gefriertechnologie", value: "NoFrost" },
      { key: "Energieklasse", value: "A++" },
      { key: "Abmessungen", value: "60 x 185 x 65 cm" },
    ]
  },
  {
    name: "Samsung Bespoke French Door Rf29a9675sr", slug: "samsung-bespoke-french-door-rf29a9675sr",
    description: "Der Samsung Bespoke French Door RF29A9675SR ist ein Premium-Kühlschrank mit French Door-Design. Die FlexZone-Schublade bietet flexible Temperatureinstellungen. Die Twin Cooling Plus-Technologie hält Lebensmittel besonders frisch. Die 668 Liter Volumen bietet ausreichend Platz für große Familien. Die interne Kamera zeigt den Inhalt des Kühlschranks auf dem Smartphone. Die Family Hub-Technologie macht den Kühlschrank zum digitalen Herzstück. Das elegante Design passt in moderne Küchen. Perfekt für große Familien.", shortDesc: "Premium-French-Door-Kühlschrank mit 668L und Family Hub",
    price: 1950, originalPrice: 2243, sku: "SAMSUNGBESPOKEF", isFeatured: true, isPromo: true,
    rating: 4.9, reviewCount: 237, categorySlug: "haushaltsgeraete", brandSlug: "samsung",
    specs: [
      { key: "Volumen", value: "668 Liter" },
      { key: "Kühltechnologie", value: "Twin Cooling Plus" },
      { key: "Design", value: "French Door" },
      { key: "Energieklasse", value: "A++" },
      { key: "Abmessungen", value: "91 x 180 x 72 cm" },
    ]
  },
  {
    name: "Samsung Tiefkuhlschrank Rt5000", slug: "samsung-tiefkuhlschrank-rt5000",
    description: "Der Samsung Tiefkühlschrank RT5000 ist ein freistehender Gefrierschrank mit NoFrost-Technologie. Die NoFrost-Technologie verhindert automatisch Eisbildung. Die 500 Liter Volumen bietet ausreichend Platz für große Familien. Die SpaceMax-Technologie maximiert den Innenraum. Die LED-Beleuchtung sorgt für optimale Sicht. Das elegante Design passt in jede Küche. Perfekt für plaque sparende Gefrierung.", shortDesc: "Samsung-Großtiefkühlschrank mit NoFrost und 500L",
    price: 1420, sku: "SAMSUNGTIEFKUHL",
    rating: 4.6, reviewCount: 162, categorySlug: "haushaltsgeraete", brandSlug: "samsung",
    specs: [
      { key: "Volumen", value: "500 Liter" },
      { key: "Gefriertechnologie", value: "NoFrost" },
      { key: "Energieklasse", value: "A++" },
      { key: "Abmessungen", value: "91 x 185 x 72 cm" },
    ]
  },
  {
    name: "Bosch Serie4 Gefrierschrank Gin31afe0p", slug: "bosch-serie4-gefrierschrank-gin31afe0p",
    description: "Der Bosch Serie 4 Gefrierschrank GIN31AFE0P ist ein Einbau-Gefrierschrank mit NoFrost-Technologie. Die NoFrost-Technologie verhindert automatisch Eisbildung. Die 3 Fachboxen bieten flexible Aufbewahrungsmöglichkeiten. Die 214 Liter Volumen bietet ausreichend Platz. Die LED-Beleuchtung sorgt für optimale Sicht. Die Energiespareinstellungen reduzieren den Stromverbrauch. Das Einbau-Design passt in jede Küchenzeile. Perfekt für plaque sparende Gefrierung.", shortDesc: "Einbau-Gefrierschrank mit NoFrost und 3 Fachboxen",
    price: 1300, sku: "BOSCHSERIE4GEFR", isFeatured: true,
    rating: 4.4, reviewCount: 57, categorySlug: "haushaltsgeraete", brandSlug: "bosch",
    specs: [
      { key: "Volumen", value: "214 Liter" },
      { key: "Gefriertechnologie", value: "NoFrost" },
      { key: "Fächer", value: "3 Fachboxen" },
      { key: "Energieklasse", value: "A++" },
      { key: "Abmessungen", value: "56 x 177 x 55 cm" },
    ]
  },
  {
    name: "Siemens Iq500 Einbau Tiefkuhlschrank Gi51nae20", slug: "siemens-iq500-einbau-tiefkuhlschrank-gi51nae20",
    description: "Der Siemens iQ500 Einbau-Tiefkühlschrank GI51NAE20 ist ein Einbau-Gefrierschrank mit noFrost-Technologie. Die noFrost-Technologie verhindert automatisch Eisbildung. Die 214 Liter Volumen bietet ausreichend Platz. Die LED-Beleuchtung sorgt für optimale Sicht. Die varioDrawer-Schubladen bieten flexible Aufbewahrungsmöglichkeiten. Das Einbau-Design passt in jede Küchenzeile. Perfekt für plaque sparende Gefrierung.", shortDesc: "Einbau-Gefrierschrank mit noFrost und varioDrawer",
    price: 2840, originalPrice: 3266, sku: "SIEMENSIQ500EIN", isPromo: true,
    rating: 4.2, reviewCount: 251, categorySlug: "haushaltsgeraete", brandSlug: "siemens",
    specs: [
      { key: "Volumen", value: "214 Liter" },
      { key: "Gefriertechnologie", value: "noFrost" },
      { key: "Schubladen", value: "varioDrawer" },
      { key: "Energieklasse", value: "A++" },
      { key: "Abmessungen", value: "56 x 177 x 55 cm" },
    ]
  },
  {
    name: "AEG Rbs 36426tx Kuhlschrank", slug: "aeg-rbs-36426tx-kuhlschrank",
    description: "Der AEG RBS 36426TX ist ein Side-by-Side-Kühlschrank mit Multi-Temp-Technologie. Die Multi-Temp-Technologie ermöglicht separate Temperatureinstellungen. Die NoFrost-Technologie verhindert automatisch Eisbildung. Die 362 Liter Volumen bietet ausreichend Platz. Die LED-Beleuchtung sorgt für optimale Sicht. Der integrierte Wasserspender bietet kaltes Wasser. Das Side-by-Side-Design passt in moderne Küchen. Perfekt für große Familien.", shortDesc: "Side-by-Side mit Multi-Temp, NoFrost und 362L Volumen",
    price: 1850, sku: "AEGRBS36426TXKU",
    rating: 4.9, reviewCount: 81, categorySlug: "haushaltsgeraete", brandSlug: "aeg",
    specs: [
      { key: "Volumen", value: "362 Liter" },
      { key: "Kühltechnologie", value: "NoFrost" },
      { key: "Temperaturen", value: "Multi-Temp" },
      { key: "Dispenser", value: "Wasserspender" },
      { key: "Abmessungen", value: "91 x 180 x 71 cm" },
    ]
  },
  {
    name: "Miele G7310 Scu", slug: "miele-g7310-scu",
    description: "Die Miele G7310 SCU ist ein freistehender Geschirrspüler mit AutoDos-Funktion. Die AutoDos-Funktion dosiert Spülmittel automatisch präzise. Die 14 Gedecke Kapazität eignet sich für große Haushalte. Die 9 Programme und 4 Zusatzfunktionen bieten individuelle Einstellungen. Die A+++ Energiesiegel sorgt für Energieeffizienz. Die AutoOpen-Trocknung öffnet die Tür automatisch am Ende. Die 3D-Bestecher bieten flexible Belademöglichkeiten. Perfekt für automatisches Spülen.", shortDesc: "Freistehender Geschirrspüler mit AutoDos und 14 Gedecken",
    price: 1520, sku: "MIELEG7310SCU",
    rating: 4.6, reviewCount: 69, categorySlug: "haushaltsgeraete", brandSlug: "miele",
    specs: [
      { key: "Kapazität", value: "14 Gedecke" },
      { key: "Energieklasse", value: "A+++" },
      { key: "Programme", value: "9 + 4 Zusatzfunktionen" },
      { key: "Dosierung", value: "AutoDos automatisch" },
      { key: "Abmessungen", value: "60 x 85 x 60 cm" },
    ]
  },
  {
    name: "Miele G7360 Scvi Autodos", slug: "miele-g7360-scvi-autodos",
    description: "Die Miele G7360 SCVi AutoDos ist ein Premium-Geschirrspüler mit AutoDos und Dosierhilfe. Die AutoDos-Funktion dosiert Spülmittel automatisch präzise. Die Dosierhilfe mischt Spülmittel mit Wasser. Die 14 Gedecke Kapazität eignet sich für große Haushalte. Die 9 Programme und 4 Zusatzfunktionen bieten individuelle Einstellungen. Die A+++ Energiesiegel sorgt für Energieeffizienz. Die AutoOpen-Trocknung öffnet die Tür automatisch am Ende. Das Premium-Modell für anspruchsvolle Nutzer.", shortDesc: "Premium-Geschirrspüler mit AutoDos und Dosierhilfe",
    price: 1680, sku: "MIELEG7360SCVIA",
    rating: 4.8, reviewCount: 52, categorySlug: "haushaltsgeraete", brandSlug: "miele",
    specs: [
      { key: "Kapazität", value: "14 Gedecke" },
      { key: "Energieklasse", value: "A+++" },
      { key: "Programme", value: "9 + 4 Zusatzfunktionen" },
      { key: "Dosierung", value: "AutoDos + Dosierhilfe" },
      { key: "Abmessungen", value: "60 x 82 x 55 cm" },
    ]
  },
  {
    name: "Miele G5000 Sci", slug: "miele-g5000-sci",
    description: "Die Miele G5000 SCI ist ein Einbau-Geschirrspüler mit ComfortLift-Funktion. Die ComfortLift-Funktion hebt die untere Ladeebene an für ergonomisches Beladen. Die 14 Gedecke Kapazität eignet sich für große Haushalte. Die 9 Programme und 4 Zusatzfunktionen bieten individuelle Einstellungen. Die A+++ Energiesiegel sorgt für Energieeffizienz. Die AutoOpen-Trocknung öffnet die Tür automatisch am Ende. Die 3D-Bestecher bieten flexible Belademöglichkeiten. Perfekt für ergonomisches Spülen.", shortDesc: "Einbau-Geschirrspüler mit ComfortLift und 14 Gedecken",
    price: 1880, sku: "MIELEG5000SCI", isFeatured: true,
    rating: 4.1, reviewCount: 234, categorySlug: "haushaltsgeraete", brandSlug: "miele",
    specs: [
      { key: "Kapazität", value: "14 Gedecke" },
      { key: "Energieklasse", value: "A+++" },
      { key: "Programme", value: "9 + 4 Zusatzfunktionen" },
      { key: "Besonderheit", value: "ComfortLift" },
      { key: "Abmessungen", value: "60 x 82 x 55 cm" },
    ]
  },
  {
    name: "Miele Ta 2650 Wp", slug: "miele-ta-2650-wp",
    description: "Die Miele TA 2650 WP ist ein hochwertiger Wäschetrockner mit Wärmepumpe. Die Wärmepumpe nutzt Restwärme für energieeffizientes Trocknen. Die 6 kg Kapazität eignet sich für kleine bis mittlere Haushalte. Das A++ Energiesiegel sorgt für Energieeffizienz. Die Sensorentrocknung erkennt den Trocknungsgrad. Die 12 Programme bieten individuelle Einstellungen. Das kompakte Design passt in jede Küche. Perfekt für effizientes Trocknen.", shortDesc: "Miele-Wärmepumpentrockner mit 6 kg Kapazität und A++",
    price: 1300, originalPrice: 1495, sku: "MIELETA2650WP", isPromo: true,
    rating: 4.4, reviewCount: 90, categorySlug: "haushaltsgeraete", brandSlug: "miele",
    specs: [
      { key: "Kapazität", value: "6 kg" },
      { key: "Trocknungsart", value: "Wärmepumpe" },
      { key: "Energieklasse", value: "A++" },
      { key: "Programme", value: "12" },
      { key: "Abmessungen", value: "60 x 85 x 65 cm" },
    ]
  },
  {
    name: "Bosch Serie4 Smv46mx01e", slug: "bosch-serie4-smv46mx01e",
    description: "Die Bosch Serie 4 SMV46MX01E ist ein freistehender Geschirrspüler mit ActiveWater-Technologie. Die ActiveWater-Technologie nutzt Wasser effizient für optimale Reinigungsergebnisse. Die 2 Ladeebenen bieten flexible Belademöglichkeiten. Die 6 Programme und 3 Zusatzfunktionen bieten individuelle Einstellungen. Die A+++ Energiesiegel sorgt für Energieeffizienz. Das Zeitsprogramm ermöglicht die Verschiebung des Startzeitpunkts. Die AquaStop-Sicherheit verhindert Wasserschäden. Perfekt für sparsame Reinigung.", shortDesc: "Freistehender Geschirrspüler mit ActiveWater und 2 Ladeebenen",
    price: 800, originalPrice: 920, sku: "BOSCHSERIE4SMV4", isPromo: true,
    rating: 4.5, reviewCount: 222, categorySlug: "haushaltsgeraete", brandSlug: "bosch",
    specs: [
      { key: "Kapazität", value: "12 Gedecke" },
      { key: "Energieklasse", value: "A+++" },
      { key: "Wasserverbrauch", value: "9,5 Liter" },
      { key: "Programme", value: "6 + 3 Zusatzfunktionen" },
      { key: "Ladeebenen", value: "2" },
      { key: "Abmessungen", value: "60 x 85 x 60 cm" },
    ]
  },
  {
    name: "Bosch Kompakt Sms46mw00e", slug: "bosch-kompakt-sms46mw00e",
    description: "Die Bosch Kompakt SMS46MW00E ist ein freistehender Geschirrspüler mit ActiveWater-Technologie. Die ActiveWater-Technologie nutzt Wasser effizient für optimale Reinigungsergebnisse. Die 13 Gedecke Kapazität eignet sich für mittlere bis große Haushalte. Die 6 Programme und 3 Zusatzfunktionen bieten individuelle Einstellungen. Die A+++ Energiesiegel sorgt für Energieeffizienz. Die VarioKorbe bieten flexible Belademöglichkeiten. Die AquaStop-Sicherheit verhindert Wasserschäden. Perfekt für sparsames Spülen.", shortDesc: "Freistehender Geschirrspüler mit ActiveWater und 13 Gedecken",
    price: 1480, sku: "BOSCHKOMPAKTSMS",
    rating: 4.9, reviewCount: 43, categorySlug: "haushaltsgeraete", brandSlug: "bosch",
    specs: [
      { key: "Kapazität", value: "13 Gedecke" },
      { key: "Energieklasse", value: "A+++" },
      { key: "Wasserverbrauch", value: "9,5 Liter" },
      { key: "Programme", value: "6 + 3 Zusatzfunktionen" },
      { key: "Abmessungen", value: "60 x 85 x 60 cm" },
    ]
  },
  {
    name: "Siemens Iq700 Sn878x04ce Neu", slug: "siemens-iq700-sn878x04ce-neu",
    description: "Die Siemens iQ700 SN878X04CE Neu ist die neueste Generation der Siemens-Geschirrspüler. Die varioSpeed Plus-Funktion verkürzt die Spüldauer um bis zu 66%. Die Zeolith-Trocknung sorgt für brillante Trocknungsergebnisse. Die 14 Gedecke Kapazität eignet sich für große Haushalte. Die 8 Programme und 4 Zusatzfunktionen bieten individuelle Einstellungen. Die A+++ Energiesiegel sorgt für Energieeffizienz. Die Home-Connect-App ermöglicht die Fernbedienung. Das neueste Modell für maximale Ansprüche.", shortDesc: "Neuester Siemens-Geschirrspüler mit varioSpeed Plus und Zeolith",
    price: 1030, sku: "SIEMENSIQ700SN8",
    rating: 4.6, reviewCount: 213, categorySlug: "haushaltsgeraete", brandSlug: "siemens",
    specs: [
      { key: "Kapazität", value: "14 Gedecke" },
      { key: "Energieklasse", value: "A+++" },
      { key: "Trocknung", value: "Zeolith" },
      { key: "Programme", value: "8 + 4 Zusatzfunktionen" },
      { key: "Abmessungen", value: "60 x 82 x 55 cm" },
    ]
  },
  {
    name: "Siemens Iq500 Sn436w00ce", slug: "siemens-iq500-sn436w00ce",
    description: "Die Siemens iQ500 SN436W00CE ist ein Einbau-Geschirrspüler mit varioSpeed-Funktion. Die varioSpeed-Funktion verkürzt die Spüldauer um bis zu 50%. Die 13 Gedecke Kapazität eignet sich für mittlere Haushalte. Die 6 Programme und 4 Zusatzfunktionen bieten individuelle Einstellungen. Die A+++ Energiesiegel sorgt für Energieeffizienz. Die acquaStop-Sicherheit verhindert Wasserschäden. Das Einbau-Design passt in jede Küchenzeile. Perfekt für effizientes Spülen.", shortDesc: "Einbau-Geschirrspüler mit varioSpeed und 13 Gedecken",
    price: 1090, sku: "SIEMENSIQ500SN4",
    rating: 4.5, reviewCount: 297, categorySlug: "haushaltsgeraete", brandSlug: "siemens",
    specs: [
      { key: "Kapazität", value: "13 Gedecke" },
      { key: "Energieklasse", value: "A+++" },
      { key: "Programme", value: "6 + 4 Zusatzfunktionen" },
      { key: "Geschwindigkeit", value: "varioSpeed" },
      { key: "Abmessungen", value: "60 x 82 x 55 cm" },
    ]
  },
  {
    name: "Siemens Kompakt Sk25ew800", slug: "siemens-kompakt-sk25ew800",
    description: "Die Siemens Kompakt SK25EW800 ist ein kompakter Einbau-Kühlschrank. Die 128 Liter Volumen bietet ausreichend Platz für kleine Haushalte. Die LED-Beleuchtung sorgt für optimale Sicht. Die individuellen Kühlschrank-Einstellungen ermöglichen Anpassungen. Das Einbau-Design passt in jede Küchenzeile. Perfekt für kleine Haushalte und single Wohnungen.", shortDesc: "Kompakter Siemens-Einbau-Kühlschrank mit 128L",
    price: 2120, sku: "SIEMENSKOMPAKTS",
    rating: 4.9, reviewCount: 17, categorySlug: "haushaltsgeraete", brandSlug: "siemens",
    specs: [
      { key: "Volumen", value: "128 Liter" },
      { key: "Kühltechnologie", value: "Statisch" },
      { key: "Energieklasse", value: "A++" },
      { key: "Abmessungen", value: "56 x 82 x 55 cm" },
    ]
  },
  {
    name: "AEG Ffb62607pm", slug: "aeg-ffb62607pm",
    description: "Der AEG FFB62607PM ist ein kabelloser Akkusauger mit Power for ALL-Allianz. Die 18V-Li-Ionen-Batterie bietet bis zu 50 Minuten Laufzeit. Der EasyRest-Halterung ermöglicht das Abstellen des Saugers an Arbeitsflächen. Die LED-Beleuchtung am Saugkopf macht Staub in dunklen Ecken sichtbar. Die Bürste mit Auto-Adjust-Technologie passt sich automatisch an unterschiedlichen Böden an. Die hygienische Entleerung erfordert keinen Kontakt mit Staub. Perfekt für vielseitiges Saugen.", shortDesc: "Kabelloser Akkusauger mit 50 Min. Laufzeit und Auto-Adjust-Bürste",
    price: 2890, originalPrice: 3323, sku: "AEGFFB62607PM", isPromo: true,
    rating: 4.6, reviewCount: 147, categorySlug: "reinigung", brandSlug: "aeg",
    specs: [
      { key: "Akku", value: "18V Li-Ionen" },
      { key: "Laufzeit", value: "Bis zu 50 Minuten" },
      { key: "Aufladung", value: "4 Stunden" },
      { key: "Gewicht", value: "2,3 kg" },
      { key: "Farbe", value: "Grau/Rot" },
    ]
  },
  {
    name: "AEG Fsk62600p Kompakt", slug: "aeg-fsk62600p-kompakt",
    description: "Die AEG FSK62600P Kompakt ist ein kompakter Geschirrspüler mit 6 Gedecken. Die 5 Programme bieten individuelle Wascheinstellungen. Die A+++ Energiesiegel sorgt für Energieeffizienz. Die kompakte Bauform von 45 cm Breite passt in jede Küche. Die Kindersicherung verhindert unbeabsichtigtes Öffnen. Die einfache Installation erfordert keine professionelle Montage. Perfekt für kleine Küchen und single Haushalte.", shortDesc: "Kompakter AEG-Geschirrspüler mit 6 Gedecken und 5 Programmen",
    price: 1110, sku: "AEGFSK62600PKOM",
    rating: 4.1, reviewCount: 200, categorySlug: "haushaltsgeraete", brandSlug: "aeg",
    specs: [
      { key: "Kapazität", value: "6 Gedecke" },
      { key: "Energieklasse", value: "A+++" },
      { key: "Programme", value: "5" },
      { key: "Breite", value: "45 cm" },
      { key: "Abmessungen", value: "45 x 82 x 55 cm" },
    ]
  },
  {
    name: "Electrolux Eeq53200l", slug: "electrolux-eeq53200l",
    description: "Die Electrolux EEQ53200L ist ein kompakter Geschirrspüler mit 6 Gedecken. Die 5 Programme bieten individuelle Wascheinstellungen. Die A+++ Energiesiegel sorgt für Energieeffizienz. Die kompakte Bauform von 45 cm Breite passt in jede Küche. Die ChildLock-Sicherheit verhindert unbeabsichtigtes Öffnen. Die einfache Installation erfordert keine professionelle Montage. Perfekt für kleine Küchen und single Haushalte.", shortDesc: "Kompakter Electrolux-Geschirrspüler mit 6 Gedecken",
    price: 1800, originalPrice: 2070, sku: "ELECTROLUXEEQ53", isNew: true, isPromo: true,
    rating: 4.5, reviewCount: 73, categorySlug: "haushaltsgeraete", brandSlug: "electrolux",
    specs: [
      { key: "Kapazität", value: "6 Gedecke" },
      { key: "Energieklasse", value: "A+++" },
      { key: "Programme", value: "5" },
      { key: "Breite", value: "45 cm" },
      { key: "Abmessungen", value: "45 x 82 x 55 cm" },
    ]
  },
  {
    name: "Electrolux Kompakt Esf6200lou", slug: "electrolux-kompakt-esf6200lou",
    description: "Die Electrolux Kompakt ESF6200LOU ist ein kompakter Geschirrspüler für kleine Küchen. Die 8 Gedecke Kapazität eignet sich für kleine Haushalte. Die 5 Programme bieten individuelle Wascheinstellungen. Die A+++ Energiesiegel sorgt für Energieeffizienz. Die kompakte Bauform von 45 cm Breite passt in jede Küche. Die ChildLock-Sicherheit verhindert unbeabsichtigtes Öffnen. Die einfache Installation erfordert keine professionelle Montage. Perfekt für kleine Küchen.", shortDesc: "Kompakter Geschirrspüler mit 8 Gedecken und A+++ Energiesiegel",
    price: 2590, sku: "ELECTROLUXKOMPA",
    rating: 4.7, reviewCount: 143, categorySlug: "haushaltsgeraete", brandSlug: "electrolux",
    specs: [
      { key: "Kapazität", value: "8 Gedecke" },
      { key: "Energieklasse", value: "A+++" },
      { key: "Programme", value: "5" },
      { key: "Breite", value: "45 cm" },
      { key: "Abmessungen", value: "45 x 82 x 55 cm" },
    ]
  },
  {
    name: "Samsung Dw60m6050fw", slug: "samsung-dw60m6050fw",
    description: "Die Samsung DW60M6050FW ist ein kompakter Geschirrspüler für kleine Küchen. Die 6 Gedecke Kapazität eignet sich für kleine Haushalte. Die 6 Programme bieten individuelle Einstellungen. Die A+++ Energiesiegel sorgt für Energieeffizienz. Die Half-Load-Funktion spart Wasser bei kleiner Beladung. Die Rack-Master-Schienen bieten flexible Belademöglichkeiten. Das kompakte Design von 45 cm Breite passt in jede Küche. Perfekt für kleine Haushalte.", shortDesc: "Kompakter Samsung-Geschirrspüler mit 6 Gedecken und A+++",
    price: 2130, sku: "SAMSUNGDW60M605", isFeatured: true, isNew: true,
    rating: 4.5, reviewCount: 161, categorySlug: "haushaltsgeraete", brandSlug: "samsung",
    specs: [
      { key: "Kapazität", value: "6 Gedecke" },
      { key: "Energieklasse", value: "A+++" },
      { key: "Programme", value: "6" },
      { key: "Breite", value: "45 cm" },
      { key: "Abmessungen", value: "45 x 82 x 55 cm" },
    ]
  },
  {
    name: "Siemens Iq300 Sk26e820eu", slug: "siemens-iq300-sk26e820eu",
    description: "Die Siemens iQ300 SK26E820EU ist ein freistehender Kühlschrank-Gefrierkombination mit Multi-Airflow-System. Die Multi-Airflow-Technologie sorgt für gleichmäßige Kühlung. Die NoFrost-Technologie verhindert automatisch Eisbildung. Die 287 Liter Volumen bietet ausreichend Platz. Die LED-Beleuchtung sorgt für optimale Sicht. Die VarioDrawer-Schubladen bieten flexible Aufbewahrung. Das elegante Design passt in jede Küche. Perfekt für Kombination aus Kühlung und Gefrierung.", shortDesc: "Siemens-Kombination mit Multi-Airflow und NoFrost",
    price: 730, originalPrice: 839, sku: "SIEMENSIQ300SK2", isNew: true, isPromo: true,
    rating: 4.5, reviewCount: 248, categorySlug: "haushaltsgeraete", brandSlug: "siemens",
    specs: [
      { key: "Volumen", value: "287 Liter" },
      { key: "Kühltechnologie", value: "Multi-Airflow + NoFrost" },
      { key: "Kühlschrank", value: "205 Liter" },
      { key: "Gefrierfach", value: "82 Liter" },
      { key: "Abmessungen", value: "60 x 186 x 65 cm" },
    ]
  },
  {
    name: "BEKO Dfn05320w", slug: "beko-dfn05320w",
    description: "Die Beko DFN05320W ist ein Einbau-Gefrierschrank mit NoFrost-Technologie. Die NoFrost-Technologie verhindert automatisch Eisbildung. Die 138 Liter Volumen bietet ausreichend Platz. Die LED-Beleuchtung sorgt für optimale Sicht. Die Fast-Freeze-Funktion friert Lebensmittel schnell ein. Das Einbau-Design passt in jede Küchenzeile. Perfekt für plaque sparende Gefrierung.", shortDesc: "Einbau-Gefrierschrank mit NoFrost und 138L Volumen",
    price: 640, sku: "BEKODFN05320W",
    rating: 4.2, reviewCount: 240, categorySlug: "haushaltsgeraete", brandSlug: "beko",
    specs: [
      { key: "Volumen", value: "138 Liter" },
      { key: "Gefriertechnologie", value: "NoFrost" },
      { key: "Energieklasse", value: "A++" },
      { key: "Abmessungen", value: "56 x 177 x 55 cm" },
    ]
  },
  {
    name: "Haier Dw14 Bk3aeu", slug: "haier-dw14-bk3aeu",
    description: "Die Haier DW14 BK3AEU ist ein freistehender Geschirrspüler mit OLED-Display. Die 14 Gedecke Kapazität eignet sich für große Haushalte. Die 9 Programme und 5 Zusatzfunktionen bieten individuelle Einstellungen. Die A+++ Energiesiegel sorgt für Energieeffizienz. Die automatische Reinigungssystem automatisiert die Reinigung. Die ChildLock-Sicherheit verhindert unbeabsichtigtes Öffnen. Die einfache Bedienung mit OLED-Display ist intuitiv. Perfekt für große Familien.", shortDesc: "Großer Geschirrspüler mit OLED-Display und 14 Gedecken",
    price: 470, sku: "HAIERDW14BK3AEU",
    rating: 4.7, reviewCount: 52, categorySlug: "haushaltsgeraete", brandSlug: "haier",
    specs: [
      { key: "Kapazität", value: "14 Gedecke" },
      { key: "Energieklasse", value: "A+++" },
      { key: "Programme", value: "9 + 5 Zusatzfunktionen" },
      { key: "Display", value: "OLED" },
      { key: "Abmessungen", value: "60 x 85 x 60 cm" },
    ]
  },
  {
    name: "LG Df455hms Kompakt", slug: "lg-df455hms-kompakt",
    description: "Der LG DF455HMS Kompakt ist ein kompakter Einbau-Kühlschrank mit NoFrost-Technologie. Die NoFrost-Technologie verhindert automatisch Eisbildung. Die Multi-Airflow-Technologie sorgt für gleichmäßige Kühlung. Die 226 Liter Volumen bietet ausreichend Platz. Die LED-Beleuchtung sorgt für optimale Sicht. Das Einbau-Design passt in jede Küchenzeile. Perfekt für plaque sparende Kühlung.", shortDesc: "Kompakter LG-Einbau-Kühlschrank mit NoFrost und 226L",
    price: 1900, sku: "LGDF455HMSKOMPA",
    rating: 4.2, reviewCount: 275, categorySlug: "haushaltsgeraete", brandSlug: "lg",
    specs: [
      { key: "Volumen", value: "226 Liter" },
      { key: "Kühltechnologie", value: "NoFrost" },
      { key: "Luftzirkulation", value: "Multi-Airflow" },
      { key: "Energieklasse", value: "A++" },
      { key: "Abmessungen", value: "56 x 177 x 55 cm" },
    ]
  },
  {
    name: "LG Full Size Df455hms", slug: "lg-full-size-df455hms",
    description: "Der LG Full-Size DF455HMS ist ein freistehender Kühlschrank-Gefrierkombination mit NoFrost-Technologie. Die NoFrost-Technologie verhindert automatisch Eisbildung. Die Multi-Airflow-Technologie sorgt für gleichmäßige Kühlung. Die 384 Liter Volumen bietet ausreichend Platz. Die LED-Beleuchtung sorgt für optimale Sicht. Das elegante Design passt in jede Küche. Perfekt für Kombination aus Kühlung und Gefrierung.", shortDesc: "LG-Kühlschrank-Gefrierkombination mit NoFrost und 384L",
    price: 480, originalPrice: 552, sku: "LGFULLSIZEDF455", isFeatured: true, isPromo: true,
    rating: 4.1, reviewCount: 226, categorySlug: "haushaltsgeraete", brandSlug: "lg",
    specs: [
      { key: "Volumen", value: "384 Liter" },
      { key: "Kühltechnologie", value: "NoFrost" },
      { key: "Kühlschrank", value: "296 Liter" },
      { key: "Gefrierfach", value: "88 Liter" },
      { key: "Abmessungen", value: "60 x 185 x 65 cm" },
    ]
  },
  {
    name: "Dyson Purifier Hotcool Hp07", slug: "dyson-purifier-hotcool-hp07",
    description: "Der Dyson Purifier Hot+Cool HP07 ist ein Luftreiniger mit Heiz- und Kühlfunktion. Die HEPA-Filterung entfernt 99,97% der Partikel ab 0,3 Mikrometer. Die Air Multiplier-Technologie verteilt die Luft gleichmäßig im Raum. Die App-Steuerung ermöglicht die Fernbedienung. Die Heizfunktion sorgt für wohliges Warme im Winter. Die Kühlfunktion sorgt für angenehme Kühle im Sommer. Die 350°-Oszillation sorgt für gleichmßige Luftverteilung. Perfekt für ganzjährige Luftverbesserung.", shortDesc: "Dyson-Purifier mit Heiz-, Kühl- und Luftreinigungsfunktion",
    price: 140, sku: "DYSONPURIFIERHO",
    rating: 4.4, reviewCount: 30, categorySlug: "klima", brandSlug: "dyson",
    specs: [
      { key: "Filter", value: "HEPA (99,97%)" },
      { key: "Funktionen", value: "Luftreinigung + Heizen + Kühlen" },
      { key: "Oszillation", value: "350°" },
      { key: "Raumgröße", value: "Bis zu 20 m²" },
      { key: "Lautstärke", value: "28-59 dB(A)" },
      { key: "Farbe", value: "Weiß/Silber" },
    ]
  },
  {
    name: "Dyson Purifier Humidifycool Ph01", slug: "dyson-purifier-humidifycool-ph01",
    description: "Der Dyson Purifier Humidify+Cool PH01 ist ein Luftreiniger mit Luftbefeuchtung und Kühlfunktion. Die HEPA-Filterung entfernt 99,97% der Partikel ab 0,3 Mikrometer. Die Luftbefeuchtung sorgt für optimale Luftfeuchtigkeit. Die Air Multiplier-Technologie verteilt die Luft gleichmäßig im Raum. Die App-Steuerung ermöglicht die Fernbedienung. Die automatische Luftqualitätsmessung passt die Einstellungen an. Die 350°-Oszillation sorgt für gleichmäßige Luftverteilung. Perfekt für saubere, befeuchtete und kühlende Luft.", shortDesc: "Dyson-Purifier mit Luftbefeuchtung, Kühlung und HEPA",
    price: 620, sku: "DYSONPURIFIERHU",
    rating: 4.5, reviewCount: 183, categorySlug: "klima", brandSlug: "dyson",
    specs: [
      { key: "Filter", value: "HEPA (99,97%)" },
      { key: "Funktionen", value: "Luftreinigung + Befeuchtung + Kühlen" },
      { key: "Oszillation", value: "350°" },
      { key: "Raumgröße", value: "Bis zu 20 m²" },
      { key: "Lautstärke", value: "28-59 dB(A)" },
      { key: "Farbe", value: "Weiß/Blau" },
    ]
  },
  {
    name: "Dyson Pure Cool Tp07", slug: "dyson-pure-cool-tp07",
    description: "Der Dyson Pure Cool TP07 ist ein purifier mit Luftreinigung und ventilator in einem. Die HEPA-Filterung entfernt 99,97% der Partikel ab 0,3 Mikrometer. Die Air Multiplier-Technologie verteilt die gereinigte Luft gleichmäßig im Raum. Die App-Steuerung ermöglicht die Fernbedienung. Die automatische Luftqualitätsmessung passt die Einstellungen an. Die 350°-Oszillation sorgt für gleichmäßige Luftverteilung. Die Night-Mode-Funktion arbeitet besonders leise. Perfekt für saubere und kühlende Luft.", shortDesc: "Dyson-Purifier mit Luftreinigung und Ventilator",
    price: 500, sku: "DYSONPURECOOLTP", isFeatured: true, isNew: true,
    rating: 4.6, reviewCount: 114, categorySlug: "klima", brandSlug: "dyson",
    specs: [
      { key: "Filter", value: "HEPA (99,97%)" },
      { key: "Funktionen", value: "Luftreinigung + Ventilator" },
      { key: "Oszillation", value: "350°" },
      { key: "Raumgröße", value: "Bis zu 20 m²" },
      { key: "Lautstärke", value: "28-59 dB(A)" },
      { key: "Farbe", value: "Weiß/Silber" },
    ]
  },
  {
    name: "Stadler Form Form Oskar", slug: "stadler-form-oskar",
    description: "Der Stadler Form Oskar ist ein kompakter Luftbefeuchter für kleine Räume. Die Verdunstungstechnologie sorgt für natürliche Luftbefeuchtung. Die 2 Befeuchtungsstufen bieten individuelle Einstellungen. Die Tankkapazität von 3,5 Litern ermöglicht langen Betrieb ohne Nachfüllen. Die Auto-Shutoff-Funktion schaltet das Gerät bei leerem Tank ab. Die LED-Beleuchtung zeigt den Betriebsstatus. Das elegante Design passt in jede Raumgestaltung. Perfekt für kleine Räume und single Wohnungen.", shortDesc: "Kompakter Luftbefeuchter mit Verdunstungstechnologie",
    price: 660, sku: "STADLERFORMO2", isNew: true,
    rating: 4.4, reviewCount: 305, categorySlug: "klima", brandSlug: "stadler-form",
    specs: [
      { key: "Befeuchtungsprinzip", value: "Verdunstung" },
      { key: "Tankkapazität", value: "3,5 Liter" },
      { key: "Raumgröße", value: "Bis zu 20 m²" },
      { key: "Lautstärke", value: "26-32 dB(A)" },
      { key: "Leistung", value: "9-14 Watt" },
      { key: "Farbe", value: "Weiß" },
    ]
  },
  {
    name: "Stadler Form Form Oskar Little", slug: "stadler-form-oskar-little",
    description: "Der Stadler Form Oskar Little ist ein kompakter Luftbefeuchter für kleine Räume. Die Verdunstungstechnologie sorgt für natürliche Luftbefeuchtung. Die 1 Befeuchtungsstufe bietet einfache Bedienung. Die Tankkapazität von 2,5 Litern ermöglicht langen Betrieb ohne Nachfüllen. Die Auto-Shutoff-Funktion schaltet das Gerät bei leerem Tank ab. Die LED-Beleuchtung zeigt den Betriebsstatus. Das kompakte Design passt in jede Ecke. Perfekt für kleine Räume und single Wohnungen.", shortDesc: "Kleinster Luftbefeuchter von Stadler Form mit 2,5L Tank",
    price: 540, originalPrice: 621, sku: "STADLERFORMOSKA", isPromo: true,
    rating: 4.2, reviewCount: 305, categorySlug: "klima", brandSlug: "stadler-form",
    specs: [
      { key: "Befeuchtungsprinzip", value: "Verdunstung" },
      { key: "Tankkapazität", value: "2,5 Liter" },
      { key: "Raumgröße", value: "Bis zu 15 m²" },
      { key: "Lautstärke", value: "26-30 dB(A)" },
      { key: "Leistung", value: "9-12 Watt" },
      { key: "Farbe", value: "Weiß" },
    ]
  },
  {
    name: "Stadler Form Form Viktor", slug: "stadler-form-viktor",
    description: "Der Stadler Form Viktor ist ein eleganter Luftbefeuchter mit modernem Design. Die Verdunstungstechnologie sorgt für natürliche Luftbefeuchtung. Die 2 Befeuchtungsstufen bieten individuelle Einstellungen. Die Tankkapazität von 5 Litern ermöglicht langen Betrieb ohne Nachfüllen. Die Auto-Shutoff-Funktion schaltet das Gerät bei leerem Tank ab. Die LED-Beleuchtung zeigt den Betriebsstatus. Das elegante Design in various Farben passt in jede Raumgestaltung. Perfekt für moderne Wohnungen.", shortDesc: "Eleganter Luftbefeuchter mit 5L Tank und modernem Design",
    price: 440, sku: "STADLERFORMVIKT", isNew: true,
    rating: 4.4, reviewCount: 227, categorySlug: "klima", brandSlug: "stadler-form",
    specs: [
      { key: "Raumgröße", value: "Bis zu 30 m²" },
      { key: "Lautstärke", value: "26-34 dB(A)" },
      { key: "Leistung", value: "10-16 Watt" },
      { key: "Farbe", value: "Verschiedene" },
      { key: "Befeuchtungsprinzip", value: "Verdunstung" },
      { key: "Tankkapazität", value: "5 Liter" },
    ]
  },
  {
    name: "Blueair Blue 3410", slug: "blueair-blue-3410",
    description: "Der Blueair Blue 3410 ist ein mittelgroßer Luftreiniger mit Activated Coconut Carbon-Filter. Die HEPASilent-Technologie entfernt 99,97% der Partikel. Der Aktivkohle-Filter reduziert Gerüche und flüchtige organische Verbindungen. Die 3 Geschwindigkeitsstufen bieten individuelle Einstellungen. Die leise Arbeitsweise stört nicht im Alltag. Die kompakte Bauform passt in jede Ecke. Perfekt für Räume mit Geruchsbelastung.", shortDesc: "Luftreiniger mit HEPASilent und Aktivkohle-Filter",
    price: 970, sku: "BLUEAIRBLUE3410", isFeatured: true,
    rating: 4.6, reviewCount: 212, categorySlug: "klima", brandSlug: "blueair",
    specs: [
      { key: "Filter", value: "HEPASilent + Aktivkohle" },
      { key: "Partikelentfernung", value: "99,97% ab 0,1µm" },
      { key: "Raumgröße", value: "Bis zu 30 m²" },
      { key: "Lautstärke", value: "24-46 dB(A)" },
      { key: "Leistung", value: "10-40 Watt" },
      { key: "Farbe", value: "Weiß" },
    ]
  },
  {
    name: "Blueair Classic 480i", slug: "blueair-classic-480i",
    description: "Der Blueair Classic 480i ist ein Premium-Luftreiniger für große Räume. Die HEPASilent-Technologie entfernt 99,97% der Partikel. Die WLAN-Steuerung ermöglicht die Fernbedienung per Smartphone. Die automatische Luftqualitätsmessung passt die Lüftergeschwindigkeit an. Die 3 Geschwindigkeitsstufen bieten individuelle Einstellungen. Die leise Arbeitsweise stört nicht im Alltag. Die Energy-Star-zertifizierte Energieeffizienz reduziert den Stromverbrauch. Perfekt für große Wohnungen und Büros.", shortDesc: "Premium-Luftreiniger mit WLAN-Steuerung für große Räume",
    price: 610, originalPrice: 702, sku: "BLUEAIRCLASSIC4", isPromo: true,
    rating: 4, reviewCount: 11, categorySlug: "klima", brandSlug: "blueair",
    specs: [
      { key: "Filter", value: "HEPASilent" },
      { key: "Partikelentfernung", value: "99,97% ab 0,1µm" },
      { key: "Raumgröße", value: "Bis zu 45 m²" },
      { key: "Lautstärke", value: "32-56 dB(A)" },
      { key: "Leistung", value: "30-80 Watt" },
      { key: "Farbe", value: "Weiß" },
    ]
  },
  {
    name: "Blueair Health Protect 7440i", slug: "blueair-health-protect-7440i",
    description: "Der Blueair Health Protect 7440i ist ein Premium-Luftreiniger mit GermShield-Technologie. Die GermShield-Technologie tötet 99% der Bakterien und Viren ab. Die HEPASilent-Technologie entfernt 99,97% der Partikel. Die WLAN-Steuerung ermöglicht die Fernbedienung per Smartphone. Die automatische Luftqualitätsmessung passt die Lüftergeschwindigkeit an. Die leise Arbeitsweise stört nicht im Alltag. Das Premium-Design passt in jede Raumgestaltung. Das absolute Flaggschiff für saubere Luft.", shortDesc: "Blueair-Flaggschiff mit GermShield und HEPASilent Ultra",
    price: 140, sku: "BLUEAIRHEALTHPR", isNew: true,
    rating: 4.7, reviewCount: 76, categorySlug: "klima", brandSlug: "blueair",
    specs: [
      { key: "Filter", value: "HEPASilent Ultra + GermShield" },
      { key: "Partikelentfernung", value: "99,97% ab 0,1µm" },
      { key: "Raumgröße", value: "Bis zu 50 m²" },
      { key: "Lautstärke", value: "30-56 dB(A)" },
      { key: "Leistung", value: "30-90 Watt" },
      { key: "Farbe", value: "Schwarz" },
    ]
  },
  {
    name: "Levoit Core 300", slug: "levoit-core-300",
    description: "Der Levoit Core 300 ist ein mittelgroßer Luftreiniger für mittlere Räume. Die 3-stufige HEPAS-Filterung entfernt 99,97% der Partikel ab 0,3 Mikrometer. Die automatische Luftqualitätsmessung passt die Lüftergeschwindigkeit an. Die Sleep-Mode-Funktion arbeitet besonders leise. Die Timer-Funktion ermöglicht automatisches Ein- und Ausschalten. Die kompakte Bauform passt in jede Ecke. Die Energy-Star-zertifizierte Energieeffizienz reduziert den Stromverbrauch. Perfekt für mittlere Räume.", shortDesc: "Mittelgroßer Luftreiniger mit HEPAS für mittlere Räume",
    price: 390, sku: "LEVOITCORE300",
    rating: 4.3, reviewCount: 225, categorySlug: "klima", brandSlug: "levoit",
    specs: [
      { key: "Filter", value: "3-stufig HEPAS" },
      { key: "Partikelentfernung", value: "99,97% ab 0,3µm" },
      { key: "Raumgröße", value: "Bis zu 30 m²" },
      { key: "Lautstärke", value: "24-50 dB(A)" },
      { key: "Leistung", value: "15-45 Watt" },
      { key: "Farbe", value: "Weiß" },
    ]
  },
  {
    name: "Levoit Core 400s", slug: "levoit-core-400s",
    description: "Der Levoit Core 400S ist ein mittelgroßer Luftreiniger mit WLAN-Steuerung. Die 3-stufige HEPAS-Filterung entfernt 99,97% der Partikel ab 0,3 Mikrometer. Die App-Steuerung ermöglicht die Fernbedienung. Die automatische Luftqualitätsmessung passt die Lüftergeschwindigkeit an. Die Sleep-Mode-Funktion arbeitet besonders leise. Die Timer-Funktion ermöglicht automatisches Ein- und Ausschalten. Die Energy-Star-zertifizierte Energieeffizienz reduziert den Stromverbrauch. Perfekt für vernetzte Räume.", shortDesc: "Mittelgroßer Luftreiniger mit WLAN und 3-stufiger HEPAS",
    price: 590, sku: "LEVOITCORE400S",
    rating: 4.7, reviewCount: 73, categorySlug: "klima", brandSlug: "levoit",
    specs: [
      { key: "Filter", value: "3-stufig HEPAS" },
      { key: "Partikelentfernung", value: "99,97% ab 0,3µm" },
      { key: "Raumgröße", value: "Bis zu 30 m²" },
      { key: "Lautstärke", value: "24-50 dB(A)" },
      { key: "Leistung", value: "15-45 Watt" },
      { key: "Farbe", value: "Weiß" },
    ]
  },
  {
    name: "Levoit Lv600s Hybrid", slug: "levoit-lv600s-hybrid",
    description: "Der Levoit LV600S Hybrid ist ein großer Luftreiniger mit kombinierter Filtertechnologie. Die 3-stufige HEPAS-Filterung entfernt 99,97% der Partikel ab 0,3 Mikrometer. Die Aktivkohle-Filterung reduziert Gerüche und flüchtige organische Verbindungen. Die WLAN-Steuerung ermöglicht die Fernbedienung. Die automatische Luftqualitätsmessung passt die Lüftergeschwindigkeit an. Die Sleep-Mode-Funktion arbeitet besonders leise. Die Energy-Star-zertifizierte Energieeffizienz reduziert den Stromverbrauch. Perfekt für große Räume.", shortDesc: "Großer Luftreiniger mit HEPAS und Aktivkohle für große Räume",
    price: 990, sku: "LEVOITLV600SHYB",
    rating: 4.1, reviewCount: 163, categorySlug: "klima", brandSlug: "levoit",
    specs: [
      { key: "Filter", value: "3-stufig HEPAS + Aktivkohle" },
      { key: "Partikelentfernung", value: "99,97% ab 0,3µm" },
      { key: "Raumgröße", value: "Bis zu 50 m²" },
      { key: "Lautstärke", value: "26-52 dB(A)" },
      { key: "Leistung", value: "20-65 Watt" },
      { key: "Farbe", value: "Weiß" },
    ]
  },
  {
    name: "Trotec Pac 3200 E", slug: "trotec-pac-3200-e",
    description: "Der Trotec PAC 3200 E ist ein mobiler Luftkühler für mittlere Räume. Die 10000 BTU Kühlleistung kühlt Räume bis zu 25 m². Die 3 Kühlstufen bieten individuelle Einstellungen. Die Luftentfeuchtungsfunktion reduziert die Luftfeuchtigkeit. Die Fernbedienung ermöglicht bequeme Steuerung. Das kompakte Design mit Rollen ermöglicht einfache Bewegung. Die_Timer-Funktion ermöglicht automatisches Ein- und Ausschalten. Perfekt für mittlere Räume.", shortDesc: "Mobiler Luftkühler mit 10000 BTU für mittlere Räume",
    price: 320, originalPrice: 368, sku: "TROTECPAC3200E", isFeatured: true, isPromo: true,
    rating: 4, reviewCount: 38, categorySlug: "klima", brandSlug: "trotec",
    specs: [
      { key: "Kühlleistung", value: "10000 BTU" },
      { key: "Raumgröße", value: "Bis zu 25 m²" },
      { key: "Funktionen", value: "Kühlen, Entfeuchten" },
      { key: "Lautstärke", value: "55 dB(A)" },
      { key: "Leistung", value: "1200 Watt" },
      { key: "Farbe", value: "Weiß" },
    ]
  },
  {
    name: "Trotec Pac 3900 E", slug: "trotec-pac-3900-e",
    description: "Der Trotec PAC 3900 E ist ein mobiler Luftkühler für große Räume. Die 13000 BTU Kühlleistung kühlt Räume bis zu 35 m². Die 3 Kühlstufen bieten individuelle Einstellungen. Die Luftentfeuchtungsfunktion reduziert die Luftfeuchtigkeit. Die Fernbedienung ermöglicht bequeme Steuerung. Das kompakte Design mit Rollen ermöglicht einfache Bewegung. Die_Timer-Funktion ermöglicht automatisches Ein- und Ausschalten. Perfekt für große Räume und Büros.", shortDesc: "Mobiler Luftkühler mit 13000 BTU für große Räume",
    price: 600, sku: "TROTECPAC3900E", isNew: true,
    rating: 4.8, reviewCount: 139, categorySlug: "klima", brandSlug: "trotec",
    specs: [
      { key: "Kühlleistung", value: "13000 BTU" },
      { key: "Raumgröße", value: "Bis zu 35 m²" },
      { key: "Funktionen", value: "Kühlen, Entfeuchten" },
      { key: "Lautstärke", value: "56 dB(A)" },
      { key: "Leistung", value: "1500 Watt" },
      { key: "Farbe", value: "Weiß" },
    ]
  },
  {
    name: "Comfee Mpph 07crn7", slug: "comfee-mpph-07crn7",
    description: "Die Comfee MPPH-07CRN7 ist ein tragbarer Luftkühler für kleine Räume. Die 7000 BTU Kühlleistung kühlt Räume bis zu 15 m². Die 3 Kühlstufen bieten individuelle Einstellungen. Die Luftentfeuchtungsfunktion reduziert die Luftfeuchtigkeit. Die Fernbedienung ermöglicht bequeme Steuerung. Das kompakte Design mit Rollen ermöglicht einfache Bewegung. Die_Timer-Funktion ermöglicht automatisches Ein- und Ausschalten. Perfekt für kleine Räume und single Wohnungen.", shortDesc: "Tragbarer Luftkühler mit 7000 BTU und Fernbedienung",
    price: 800, originalPrice: 920, sku: "COMFEEMPPH07CRN", isPromo: true,
    rating: 4.3, reviewCount: 283, categorySlug: "klima", brandSlug: "comfee",
    specs: [
      { key: "Kühlleistung", value: "7000 BTU" },
      { key: "Raumgröße", value: "Bis zu 15 m²" },
      { key: "Funktionen", value: "Kühlen, Entfeuchten, Lüften" },
      { key: "Lautstärke", value: "55 dB(A)" },
      { key: "Farbe", value: "Weiß" },
    ]
  },
  {
    name: "Comfee Mpph 12crn7", slug: "comfee-mpph-12crn7",
    description: "Die Comfee MPPH-12CRN7 ist ein tragbarer Luftkühler für mittlere Räume. Die 12000 BTU Kühlleistung kühlt Räume bis zu 25 m². Die 3 Kühlstufen bieten individuelle Einstellungen. Die Luftentfeuchtungsfunktion reduziert die Luftfeuchtigkeit. Die Fernbedienung ermöglicht bequeme Steuerung. Das kompakte Design mit Rollen ermöglicht einfache Bewegung. Die_Timer-Funktion ermöglicht automatisches Ein- und Ausschalten. Perfekt für mittlere Räume.", shortDesc: "Tragbarer Luftkühler mit 12000 BTU für mittlere Räume",
    price: 2180, sku: "COMFEEMPPH12CRN",
    rating: 4.3, reviewCount: 298, categorySlug: "klima", brandSlug: "comfee",
    specs: [
      { key: "Kühlleistung", value: "12000 BTU" },
      { key: "Raumgröße", value: "Bis zu 25 m²" },
      { key: "Funktionen", value: "Kühlen, Entfeuchten, Lüften" },
      { key: "Lautstärke", value: "56 dB(A)" },
      { key: "Farbe", value: "Weiß" },
    ]
  },
  {
    name: "Sichler Pac Wk 10", slug: "sichler-pac-wk-10",
    description: "Die Sichler PAC WK 10 ist ein tragbarer Luftkühler für kleine Räume. Die 10000 BTU Kühlleistung kühlt Räume bis zu 20 m². Die 3 Kühlstufen bieten individuelle Einstellungen. Die Luftentfeuchtungsfunktion reduziert die Luftfeuchtigkeit. Die Fernbedienung ermöglicht bequeme Steuerung. Das kompakte Design mit Rollen ermöglicht einfache Bewegung. Die_Timer-Funktion ermöglicht automatisches Ein- und Ausschalten. Perfekt für kleine Räume.", shortDesc: "Tragbarer Luftkühler mit 10000 BTU und Fernbedienung",
    price: 2480, sku: "SICHLERPACWK10", isFeatured: true,
    rating: 4.7, reviewCount: 108, categorySlug: "klima", brandSlug: "sichler",
    specs: [
      { key: "Kühlleistung", value: "10000 BTU" },
      { key: "Raumgröße", value: "Bis zu 20 m²" },
      { key: "Funktionen", value: "Kühlen, Entfeuchten, Lüften" },
      { key: "Lautstärke", value: "55 dB(A)" },
      { key: "Farbe", value: "Weiß" },
    ]
  },
  {
    name: "Klarstein Fresh Breeze Xl", slug: "klarstein-fresh-breeze-xl",
    description: "Der Klarstein Fresh Breeze XL ist ein tragbarer Luftkühler für große Räume. Die 14000 BTU Kühlleistung kühlt Räume bis zu 30 m². Die 3 Kühlstufen bieten individuelle Einstellungen. Die Luftentfeuchtungsfunktion reduziert die Luftfeuchtigkeit. Die Fernbedienung ermöglicht bequeme Steuerung. Das kompakte Design mit Rollen ermöglicht einfache Bewegung. Die_Timer-Funktion ermöglicht automatisches Ein- und Ausschalten. Perfekt für große Räume und Büros.", shortDesc: "Tragbarer Luftkühler mit 14000 BTU für große Räume",
    price: 470, sku: "KLARSTEINFRESHB",
    rating: 4.1, reviewCount: 95, categorySlug: "klima", brandSlug: "klarstein",
    specs: [
      { key: "Kühlleistung", value: "14000 BTU" },
      { key: "Raumgröße", value: "Bis zu 30 m²" },
      { key: "Funktionen", value: "Kühlen, Entfeuchten, Lüften" },
      { key: "Lautstärke", value: "56 dB(A)" },
      { key: "Farbe", value: "Weiß" },
    ]
  },
  {
    name: "Stadler Form Form Airgoing Kne01", slug: "stadler-form-airgoing-kne01",
    description: "Der Stadler Form AirGoing KNE01 ist ein eleganter Raumkühler mit Verdunstungstechnologie. Die Verdunstungskühlung sorgt für natürliche Luftkühlung. Die 2 Kühlstufen bieten individuelle Einstellungen. Die Luftionisierung reinigt die Luft. Die Tankkapazität von 6 Litern ermöglicht langen Betrieb ohne Nachfüllen. Die Fernbedienung ermöglicht bequeme Steuerung. Das elegante Design passt in jede Raumgestaltung. Perfekt für natürliche Kühlung.", shortDesc: "Eleganter Verdunstungs-Luftkühler mit Ionisierung",
    price: 790, sku: "STADLERFORMAIRG", isFeatured: true,
    rating: 4.3, reviewCount: 170, categorySlug: "klima", brandSlug: "stadler-form",
    specs: [
      { key: "Kühlprinzip", value: "Verdunstung" },
      { key: "Tankkapazität", value: "6 Liter" },
      { key: "Raumgröße", value: "Bis zu 20 m²" },
      { key: "Lautstärke", value: "45 dB(A)" },
      { key: "Leistung", value: "65 Watt" },
      { key: "Farbe", value: "Weiß" },
    ]
  },
  {
    name: "Levoit Classic 200s", slug: "levoit-classic-200s",
    description: "Der Levoit Classic 200S ist ein kompakter Luftreiniger mit WLAN-Steuerung. Die 3-stufige HEPAS-Filterung entfernt 99,97% der Partikel ab 0,3 Mikrometer. Die App-Steuerung ermöglicht die Fernbedienung. Die automatische Luftqualitätsmessung passt die Lüftergeschwindigkeit an. Die Sleep-Mode-Funktion arbeitet besonders leise. Die Timer-Funktion ermöglicht automatisches Ein- und Ausschalten. Die kompakte Bauform passt in jede Ecke. Perfekt für kleine Räume.", shortDesc: "Kompakter Luftreiniger mit WLAN und 3-stufiger HEPAS-Filterung",
    price: 430, sku: "LEVOITCLASSIC20", isFeatured: true,
    rating: 4.8, reviewCount: 156, categorySlug: "klima", brandSlug: "levoit",
    specs: [
      { key: "Filter", value: "3-stufig HEPAS" },
      { key: "Partikelentfernung", value: "99,97% ab 0,3µm" },
      { key: "Raumgröße", value: "Bis zu 20 m²" },
      { key: "Lautstärke", value: "24-46 dB(A)" },
      { key: "Leistung", value: "15-30 Watt" },
      { key: "Farbe", value: "Weiß" },
    ]
  },
  {
    name: "Blueair Blue 2210", slug: "blueair-blue-2210",
    description: "Der Blueair Blue 2210 ist ein kompakter Luftreiniger für kleine Räume. Die HEPASilent-Technologie entfernt 99,97% der Partikel ab 0,1 Mikrometer. Die 3 Geschwindigkeitsstufen bieten individuelle Einstellungen. Die leise Arbeitsweise stört nicht im Alltag. Die kompakte Bauform passt in jede Ecke. Die Energy-Star-zertifizierte Energieeffizienz reduziert den Stromverbrauch. Perfekt für Schlafzimmer und kleine Büros.", shortDesc: "Kompakter Luftreiniger mit HEPASilent für kleine Räume",
    price: 460, sku: "BLUEAIRBLUE2210",
    rating: 4.6, reviewCount: 205, categorySlug: "klima", brandSlug: "blueair",
    specs: [
      { key: "Filter", value: "HEPASilent" },
      { key: "Partikelentfernung", value: "99,97% ab 0,1µm" },
      { key: "Raumgröße", value: "Bis zu 20 m²" },
      { key: "Lautstärke", value: "24-46 dB(A)" },
      { key: "Leistung", value: "10-30 Watt" },
      { key: "Farbe", value: "Weiß" },
    ]
  },
  {
    name: "Klarstein Skyscraper Ice", slug: "klarstein-skyscraper-ice",
    description: "Der Klarstein Skyscraper Ice ist ein eleganter Raumkühler mit ionisierter Luft. Die 9000 BTU Kühlleistung kühlt Räume bis zu 20 m². Die 3 Kühlstufen bieten individuelle Einstellungen. Die Ionisierungsfunktion reinigt die Luft. Die Fernbedienung ermöglicht bequeme Steuerung. Das schlanke Turm-Design passt in jede Raumgestaltung. Die_Timer-Funktion ermöglicht automatisches Ein- und Ausschalten. Perfekt für moderne Wohnungen.", shortDesc: "Eleganter Turm-Raumkühler mit 9000 BTU und Ionisierung",
    price: 2400, sku: "KLARSTEINSKYSCR",
    rating: 4.2, reviewCount: 21, categorySlug: "klima", brandSlug: "klarstein",
    specs: [
      { key: "Kühlleistung", value: "9000 BTU" },
      { key: "Raumgröße", value: "Bis zu 20 m²" },
      { key: "Funktionen", value: "Kühlen, Entfeuchten, Ionisieren" },
      { key: "Lautstärke", value: "54 dB(A)" },
      { key: "Farbe", value: "Weiß/Schwarz" },
    ]
  },
  {
    name: "Midea Air Cool Maw08v1qwt", slug: "midea-air-cool-maw08v1qwt",
    description: "Die Midea Air Cool MAW08V1QWT ist ein tragbarer Luftkühler für kleine Räume. Die 8000 BTU Kühlleistung kühlt Räume bis zu 18 m². Die 3 Kühlstufen bieten individuelle Einstellungen. Die Luftentfeuchtungsfunktion reduziert die Luftfeuchtigkeit. Die Fernbedienung ermöglicht bequeme Steuerung. Das kompakte Design mit Rollen ermöglicht einfache Bewegung. Die_Timer-Funktion ermöglicht automatisches Ein- und Ausschalten. Perfekt für kleine Räume.", shortDesc: "Tragbarer Luftkühler mit 8000 BTU für kleine Räume",
    price: 1850, originalPrice: 2128, sku: "MIDEAAIRCOOLMAW", isFeatured: true, isPromo: true,
    rating: 4.5, reviewCount: 37, categorySlug: "klima", brandSlug: "midea",
    specs: [
      { key: "Kühlleistung", value: "8000 BTU" },
      { key: "Raumgröße", value: "Bis zu 18 m²" },
      { key: "Funktionen", value: "Kühlen, Entfeuchten, Lüften" },
      { key: "Lautstärke", value: "54 dB(A)" },
      { key: "Farbe", value: "Weiß" },
    ]
  },
  {
    name: "Dyson Big Quiet Formaldehyde N475", slug: "dyson-big-quiet-formaldehyde-n475",
    description: "Der Dyson Big Quiet Formaldehyde N475 ist ein leistungsstarker kabelloser Akkusauger mit Formaldehyd-Sensor. Die Formaldehydzerstörungs-Funktion zerstört Formaldehyd kontinuierlich. Die 261 AW Saugleistung entfernt Staub und Schmutz gründlich. Die HEPA-Filterung fängt 99,99% der Allergene ab. Die 60 Minuten Laufzeit reicht für große Reinigungen. Das LCD-Display zeigt Echtzeitdaten über die Reinigung. Das absolute Flaggschiff für saubere Luft und makellose Sauberkeit.", shortDesc: "Dyson-Flaggschiff mit Formaldehyd-Sensor und 261 AW Saugleistung",
    price: 1600, originalPrice: 1840, sku: "DYSONBIGQUIETFO", isPromo: true,
    rating: 4.6, reviewCount: 230, categorySlug: "reinigung", brandSlug: "dyson",
    specs: [
      { key: "Leistung", value: "261 AW" },
      { key: "Filter", value: "HEPA (99,99%)" },
      { key: "Laufzeit", value: "Bis zu 60 Minuten" },
      { key: "Besonderheit", value: "Formaldehyd-Sensor" },
      { key: "Gewicht", value: "3,5 kg" },
      { key: "Farbe", value: "Nickel/Gelb" },
    ]
  },
  {
    name: "Trotec Pac 2100 E", slug: "trotec-pac-2100-e",
    description: "Der Trotec PAC 2100 E ist ein mobiler Luftkühler für kleine Räume. Die 7000 BTU Kühlleistung kühlt Räume bis zu 15 m². Die 2 Kühlstufen bieten individuelle Einstellungen. Die Luftentfeuchtungsfunktion reduziert die Luftfeuchtigkeit. Die Fernbedienung ermöglicht bequeme Steuerung. Das kompakte Design mit Rollen ermöglicht einfache Bewegung. Die_Timer-Funktion ermöglicht automatisches Ein- und Ausschalten. Perfekt für kleine Räume.", shortDesc: "Mobiler Luftkühler mit 7000 BTU für kleine Räume",
    price: 990, sku: "TROTECPAC2100E", isNew: true,
    rating: 4.1, reviewCount: 192, categorySlug: "klima", brandSlug: "trotec",
    specs: [
      { key: "Kühlleistung", value: "7000 BTU" },
      { key: "Raumgröße", value: "Bis zu 15 m²" },
      { key: "Funktionen", value: "Kühlen, Entfeuchten" },
      { key: "Lautstärke", value: "54 dB(A)" },
      { key: "Leistung", value: "900 Watt" },
      { key: "Farbe", value: "Weiß" },
    ]
  },
  {
    name: "tado° Smart Thermostat V3plus Neu", slug: "tado-smart-thermostat-v3plus-neu",
    description: "Der Tado Smart Thermostat V3+ Neu ist die neueste Version des intelligenten Thermostats. Die App-Steuerung ermöglicht die Fernbedienung von überall. Die Geofencing-Technologie passt die Temperatur an Ihren Standort an. Die Kompatibilität mit Alexa, Google Home und HomeKit bietet maximale Konnektivität. Die einfache Installation an vorhandenen Heizungen erfordert keine Fachkenntnisse. Die intelligente Steuerung mit Timern ermöglicht automatische Anpassungen. Die Luftqualitätsmessung informiert über die Raumluft. Die neueste Version mit verbesserter Genauigkeit und Zuverlässigkeit. Sparen Sie bis zu 28% Heizkosten mit intelligenter Steuerung.", shortDesc: "Neuestes Tado-Thermostat mit verbesserter Genauigkeit",
    price: 250, sku: "TADOSMARTTHE3",
    rating: 4.3, reviewCount: 135, categorySlug: "smart-home", brandSlug: "tado",
    specs: [
      { key: "Steuerung", value: "App, Sprache (Alexa, Google, HomeKit)" },
      { key: "Funktionen", value: "Geofencing, Timer, Luftqualität" },
      { key: "Kompatibilität", value: "Alle Heizungstypen" },
      { key: "Energieeinsparung", value: "Bis zu 28%" },
      { key: "Abmessungen", value: "10 x 10 x 2,4 cm" },
      { key: "Farbe", value: "Weiß" },
    ]
  },
  {
    name: "tado° Smart Thermostat V3plus Extension", slug: "tado-smart-thermostat-v3plus-extension",
    description: "Der Tado Smart Thermostat V3+ Extension ist ein Erweiterungsmodul für das Tado-Heizungssystem. Das Modul ergänzt bestehende Tado-Thermostate um zusätzliche Funktionalität. Die App-Steuerung ermöglicht die Fernbedienung von überall. Die Kompatibilität mit Alexa, Google Home und HomeKit bietet maximale Konnektivität. Die einfache Installation erfordert keine Fachkenntnisse. Die intelligente Steuerung mit Timern ermöglicht automatische Anpassungen. Die Erweiterung eignet sich für alle, die ihr Tado-System ausbauen möchten.", shortDesc: "Erweiterungsmodul für das Tado-Heizungssystem",
    price: 140, sku: "TADOSMARTTHE2", isNew: true,
    rating: 4.8, reviewCount: 283, categorySlug: "smart-home", brandSlug: "tado",
    specs: [
      { key: "Typ", value: "Erweiterungsmodul" },
      { key: "Kompatibilität", value: "Tado Smart Thermostat V3+" },
      { key: "Steuerung", value: "App, Sprache (Alexa, Google, HomeKit)" },
      { key: "Abmessungen", value: "10 x 10 x 2,4 cm" },
      { key: "Farbe", value: "Weiß" },
    ]
  },
  {
    name: "tado° Smart Ac Control V3plus Neu", slug: "tado-smart-ac-control-v3plus-neu",
    description: "Die Tado Smart AC Control V3+ Neu ist die neueste Version des smarteren WLAN-Controllers für Klimaanlagen. Die App-Steuerung ermöglicht die Fernbedienung von überall. Die Geofencing-Technologie passt die Temperatur an Ihren Standort an. Die Kompatibilität mit Alexa, Google Home und HomeKit bietet maximale Konnektivität. Die einfache Installation erfordert keine Fachkenntnisse. Die Energieberichtsfunktion zeigt den Stromverbrauch an. Die Luftqualitätsmessung informiert über die Raumluft. Die intelligente Steuerung mit Timern ermöglicht automatische Anpassungen. Die neueste Version mit verbesserter Kompatibilität.", shortDesc: "Neueste Tado-AC-Steuerung mit Geofencing und improved Kompatibilität",
    price: 190, sku: "TADOSMARTACCONT", isNew: true,
    rating: 4.1, reviewCount: 133, categorySlug: "smart-home", brandSlug: "tado",
    specs: [
      { key: "Steuerung", value: "App, Sprache (Alexa, Google, HomeKit)" },
      { key: "Konnektivität", value: "WLAN, Infrarot" },
      { key: "Funktionen", value: "Geofencing, Timer, Energiebericht" },
      { key: "Kompatibilität", value: "Die meisten Klimaanlagen" },
      { key: "Abmessungen", value: "10 x 10 x 2,4 cm" },
      { key: "Farbe", value: "Weiß" },
    ]
  },
  {
    name: "Philips Hue Starter Kit E27 Neu", slug: "philips-hue-starter-kit-e27-neu",
    description: "Das Philips Hue Starter Kit E27 Neu ist die neueste Version des beliebten Hue-Starter-Kits. Die Hue Bridge V2 und 2 neue E27-LED-Lampen bieten modernste Technologie. Die dimmbare Lichtstärke (100-2200 Lumen) passt jede Stimmung. Die Farbtemperatur (2200-6500K) reicht von warmweiß bis tageslichtweiß. Die Fernbedienung über App oder Sprachsteuerung (Alexa, Google, HomeKit) bietet Komfort. Die einfache Installation in vorhandene Leuchtmittel-Fassungen erfordert keine Fachkenntnisse. Die neue Hue Bridge bietet mehr Leistung und Zuverlässigkeit. Der ideale Einstieg in die smarte Beleuchtung.", shortDesc: "Neues Hue-Starter-Kit mit Bridge V2 und 2 E27-LED-Lampen",
    price: 260, sku: "PHILIPSHUEST2",
    rating: 4.5, reviewCount: 43, categorySlug: "smart-home", brandSlug: "philips",
    specs: [
      { key: "Protokoll", value: "Zigbee (via Hue Bridge V2)" },
      { key: "Lichtstrom", value: "100-2200 Lumen" },
      { key: "Farbtemperatur", value: "2200-6500K" },
      { key: "Leistung", value: "8,06 Watt pro Lampe" },
      { key: "Lebensdauer", value: "25.000 Stunden" },
      { key: "Fassung", value: "E27" },
    ]
  },
  {
    name: "Philips Hue Starter Kit E14", slug: "philips-hue-starter-kit-e14",
    description: "Das Philips Hue Starter Kit E14 ist der perfekte Einstieg in die smarte Beleuchtung. Die Hue Bridge und 2 E14-LED-Lampen bieten alles für den Anfang. Die dimmbare Lichtstärke (100-2200 Lumen) passt jede Stimmung. Die Farbtemperatur (2200-6500K) reicht von warmweiß bis tageslichtweiß. Die Fernbedienung über App oder Sprachsteuerung (Alexa, Google, HomeKit) bietet Komfort. Die einfache Installation in vorhandene Leuchtmittel-Fassungen erfordert keine Fachkenntnisse. Die Hue Bridge steuert bis zu 50 Geräte. Der ideale Einstieg in die smarte Beleuchtung.", shortDesc: "Hue-Starter-Kit mit Bridge und 2 E14-LED-Lampen",
    price: 350, originalPrice: 402, sku: "PHILIPSHUESTART", isNew: true, isPromo: true,
    rating: 4.5, reviewCount: 153, categorySlug: "smart-home", brandSlug: "philips",
    specs: [
      { key: "Protokoll", value: "Zigbee (via Hue Bridge)" },
      { key: "Lichtstrom", value: "100-2200 Lumen" },
      { key: "Farbtemperatur", value: "2200-6500K" },
      { key: "Leistung", value: "5,7 Watt pro Lampe" },
      { key: "Lebensdauer", value: "25.000 Stunden" },
      { key: "Fassung", value: "E14" },
    ]
  },
  {
    name: "Philips Hue Lightstrip Plus 2m", slug: "philips-hue-lightstrip-plus-2m",
    description: "Die Philips Hue Lightstrip Plus 2m ist eine flexible LED-Lichtleiste für vielseitige Beleuchtung. Die 16 Millionen Farben und diverse White-Shades bieten endlose Möglichkeiten. Die Plus-Version bietet höhere Lichtstärke als die Standard-Version. Die Music-Sync-Funktion reagiert auf Musik und erstellt dynamische Lichtshows. Die einfache Installation mit Klebepads erfordert keine professionelle Montage. Die Kompatibilität mit Hue Bridge und diversen Sprachassistenten bietet maximale Konnektivität. Die 2 Meter Länge eignet sich für Möbel, Regale und andere Oberflächen. Perfekt für stimmungsvolles Ambientelicht und Akzente.", shortDesc: "Flexible Plus-LED-Leiste mit 2m für verstärkte Lichtstärke",
    price: 340, sku: "PHILIPSHUELIGHT", isNew: true,
    rating: 4.7, reviewCount: 269, categorySlug: "smart-home", brandSlug: "philips",
    specs: [
      { key: "Farben", value: "16 Millionen + White-Shades" },
      { key: "Länge", value: "2 Meter" },
      { key: "Lichtstrom", value: "1600 Lumen" },
      { key: "Leistung", value: "20 Watt" },
      { key: "Lebensdauer", value: "25.000 Stunden" },
      { key: "Konnektivität", value: "Zigbee (via Hue Bridge)" },
    ]
  },
  {
    name: "Philips Hue White Ambiance E27", slug: "philips-hue-white-ambiance-e27",
    description: "Die Philips Hue White Ambiance E27 ist eine dimmbare LED-Lampe mit weißem Licht. Die Farbtemperatur (2200-6500K) reicht von warmweiß bis tageslichtweiß. Die dimmbare Lichtstärke (100-2200 Lumen) passt jede Stimmung. Die Fernbedienung über App oder Sprachsteuerung (Alexa, Google, HomeKit) bietet Komfort. Die einfache Installation in vorhandene E27-Fassungen erfordert keine Fachkenntnisse. Die Kompatibilität mit Hue Bridge bietet maximale Funktionalität. Perfekt für alle, die weiße Atmosphäre ohne Farben suchen.", shortDesc: "Dimmbare E27-LED-Lampe mit weißer Atmosphäre (2200-6500K)",
    price: 170, sku: "PHILIPSHUEWHITE",
    rating: 4.1, reviewCount: 29, categorySlug: "smart-home", brandSlug: "philips",
    specs: [
      { key: "Farbtemperatur", value: "2200-6500K" },
      { key: "Lichtstrom", value: "100-2200 Lumen" },
      { key: "Leistung", value: "8,06 Watt" },
      { key: "Lebensdauer", value: "25.000 Stunden" },
      { key: "Fassung", value: "E27" },
    ]
  },
  {
    name: "Nanoleaf Shapes Triangles", slug: "nanoleaf-shapes-triangles",
    description: "Die Nanoleaf Shapes Triangles sind modulare LED-Wandpaneale im dreieckigen Design. Die 16 Millionen Farben und diverse White-Shades bieten endlose Möglichkeiten. Die Touch-Integration ermöglicht interaktive Lichtszenen. Die Music-Sync-Funktion reagiert auf Musik und erstellt dynamische Lichtshows. Die einfache Installation mit 3M-Klebepads erfordert keine professionelle Montage. Die Kompatibilität mit HomeKit, Google Home und Alexa bietet maximale Konnektivität. Die dreieckige Form bietet andere Gestaltungsmöglichkeiten. Perfekt für kreative Wandgestaltung und stimmungsvolles Licht.", shortDesc: "Modulare Triangle-LED-Paneale mit Touch- und Music-Sync",
    price: 190, originalPrice: 218, sku: "NANOLEAFSHAPEST", isPromo: true,
    rating: 4.1, reviewCount: 105, categorySlug: "smart-home", brandSlug: "nanoleaf",
    specs: [
      { key: "Farben", value: "16 Millionen + White-Shades" },
      { key: "Panels", value: "7 pro Starter Kit" },
      { key: "Lichtstrom", value: "140 Lumen pro Panel" },
      { key: "Leistung", value: "9 Watt pro Panel" },
      { key: "Lebensdauer", value: "25.000 Stunden" },
      { key: "Konnektivität", value: "Wi-Fi, Bluetooth" },
    ]
  },
  {
    name: "Nanoleaf Elements Hexagons", slug: "nanoleaf-elements-hexagons",
    description: "Die Nanoleaf Elements Hexagons sind modulare LED-Wandpaneale für kreative Lichtdesigns. Die abgerundeten Kanten sorgen für ein weiches, organisches Licht. Die 16 Millionen Farben und diverse White-Shades bieten endlose Möglichkeiten. Die Touch-Integration ermöglicht interaktive Lichtszenen. Die Music-Sync-Funktion reagiert auf Musik und erstellt dynamische Lichtshows. Die einfache Installation mit 3M-Klebepads erfordert keine professionelle Montage. Die Kompatibilität mit HomeKit, Google Home und Alexa bietet maximale Konnektivität. Perfekt für kreative Wandgestaltung und stimmungsvolles Licht.", shortDesc: "Modulare LED-Wandpaneale mit Touch- und Music-Sync",
    price: 220, sku: "NANOLEAFELEMENT",
    rating: 4.9, reviewCount: 107, categorySlug: "smart-home", brandSlug: "nanoleaf",
    specs: [
      { key: "Farben", value: "16 Millionen + White-Shades" },
      { key: "Panels", value: "7 pro Starter Kit" },
      { key: "Lichtstrom", value: "100 Lumen pro Panel" },
      { key: "Leistung", value: "6 Watt pro Panel" },
      { key: "Lebensdauer", value: "25.000 Stunden" },
      { key: "Konnektivität", value: "Wi-Fi, Bluetooth, Thread" },
    ]
  },
  {
    name: "Ring Video Doorbell 4 Neu", slug: "ring-video-doorbell-4-neu",
    description: "Die Ring Video Doorbell 4 Neu ist die neueste Version der beliebten Ring-Videoklingel. Die 1080p-HD-Kamera liefert klare Bilder. Die Nachtsichtfunktion sorgt auch bei Dunkelheit für gute Bilder. Die Zweistiguouse-Sprachfunktion ermöglicht die Kommunikation mit Besuchern. Die Pre-Roll-Videos zeigen die Sekunden vor dem Bewegungsereignis. Die automatische Benachrichtigung bei Bewegungserkennung informiert Sie sofort. Die einfache Installation erfordert keine professionelle Montage. Die Ring-App ermöglicht die Fernbedienung von überall. Die neueste Version mit verbesserter Bildqualität.", shortDesc: "Neueste Ring-Videoklingel mit 1080p HD und Pre-Roll",
    price: 190, sku: "RINGVIDEODOORBE",
    rating: 4.4, reviewCount: 210, categorySlug: "smart-home", brandSlug: "ring",
    specs: [
      { key: "Kamera", value: "1080p HD (verbessert)" },
      { key: "Nachtsicht", value: "Ja, Infrarot" },
      { key: "Sprachfunktion", value: "Zweistiguous" },
      { key: "Speicherung", value: "Ring Protect (Abonnement)" },
      { key: "Installation", value: "Kabellos oder verkabelt" },
    ]
  },
  {
    name: "Ring Spotlight Cam Pro", slug: "ring-spotlight-cam-pro",
    description: "Die Ring Spotlight Cam Pro ist eine Überwachungskamera mit integriertem Spotlight. Die 1080p-HD-Kamera liefert klare Bilder. Der Spotlight mit 500 Lumen sorgt für Ausleuchtung bei Dunkelheit. Die Nachtsichtfunktion sorgt auch ohne Spotlight für gute Bilder. Die Zweistufige-Sprachfunktion ermöglicht die Kommunikation. Die automatische Benachrichtigung bei Bewegungserkennung informiert Sie sofort. Die 3D-Bewegungserkennung mit Radar reduziert Fehlalarme. Die einfache Installation auf Wänden erfordert keine professionelle Montage. Perfekt für die Überwachung von Außenbereichen.", shortDesc: "Überwachungskamera mit 1080p HD und 500 Lumen Spotlight",
    price: 30, sku: "RINGSPOTLIGHTCA",
    rating: 4.7, reviewCount: 151, categorySlug: "smart-home", brandSlug: "ring",
    specs: [
      { key: "Kamera", value: "1080p HD" },
      { key: "Spotlight", value: "500 Lumen" },
      { key: "Bewegungserkennung", value: "3D-Radar" },
      { key: "Sprachfunktion", value: "Zweistufig" },
      { key: "Installation", value: "Wandmontage" },
    ]
  },
  {
    name: "Ring Indoor Cam Gen2", slug: "ring-indoor-cam-gen2",
    description: "Die Ring Indoor Cam Gen2 ist eine kompakte Überwachungskamera für den Innenbereich. Die 1080p-HD-Kamera liefert klare Bilder. Die Nachtsichtfunktion sorgt auch bei Dunkelheit für gute Bilder. Die Zweistufige-Sprachfunktion ermöglicht die Kommunikation. Die automatische Benachrichtigung bei Bewegungserkennung informiert Sie sofort. Die einfache Installation auf Regalen oder Tischen erfordert keine Montage. Die Ring-App ermöglicht die Fernbedienung von überall. Perfekt für die Überwachung von Wohnzimmern, Kinderzimmern oder Büros.", shortDesc: "Kompakte Innenkamera mit 1080p HD und Nachtsicht",
    price: 190, sku: "RINGINDOORCAMGE",
    rating: 4.3, reviewCount: 300, categorySlug: "smart-home", brandSlug: "ring",
    specs: [
      { key: "Kamera", value: "1080p HD" },
      { key: "Nachtsicht", value: "Ja, Infrarot" },
      { key: "Sprachfunktion", value: "Zweistufig" },
      { key: "Abmessungen", value: "7 x 7 x 10 cm" },
      { key: "Farbe", value: "Weiß/Schwarz" },
    ]
  },
  {
    name: "Netatmo Wetterstation", slug: "netatmo-wetterstation",
    description: "Die Netatmo Wetterstation misst Indoor- und Outdoor-Wetterdaten präzise. Die Innenmodule messen Temperatur, Luftfeuchtigkeit, Luftqualität und Lärmpegel. Das Außenmodul misst Temperatur und Luftfeuchtigkeit. Die App-Visualisierung zeigt alle Daten übersichtlich an. Die Vorhersage-Informationen basieren auf lokalen Wetterdaten. Die Kompatibilität mit Apple HomeKit und Google Home bietet maximale Konnektivität. Die einfache Installation erfordert keine Fachkenntnisse. Die Batterielaufzeit von bis zu 6 Monaten sorgt für langfristigen Einsatz. Perfekt für alle, die das Wetter im Auge behalten wollen.", shortDesc: "Indoor/Outdoor-Wetterstation mit Luftqualitätsmessung",
    price: 80, sku: "NETATMOWETTERST",
    rating: 4.5, reviewCount: 14, categorySlug: "smart-home", brandSlug: "netatmo",
    specs: [
      { key: "Module", value: "Indoor + Outdoor" },
      { key: "Messwerte", value: "Temperatur, Feuchtigkeit, Luftqualität, Lärm" },
      { key: "Genauigkeit", value: "±0,1°C / ±1% Feuchtigkeit" },
      { key: "Protokoll", value: "Wi-Fi" },
      { key: "Batterielaufzeit", value: "Bis zu 6 Monate (Outdoor)" },
    ]
  },
  {
    name: "Netatmo Smart Thermostat", slug: "netatmo-smart-thermostat",
    description: "Das Netatmo Smart Thermostat ist ein intelligentes Heizungssystem für energieeffizientes Heizen. Die automatische Temperaturregelung passt die Heizung an Ihren Rhythmus an. Die App-Steuerung ermöglicht die Fernbedienung von überall. Die KI-gestützte Lernfunktion passt sich an Ihre Gewohnheiten an. Die Kompatibilität mit Apple HomeKit, Google Home und Alexa bietet maximale Konnektivität. Die einfache Installation an vorhandenen Heizkörpern erfordert keine Fachkenntnisse. Die Batterielaufzeit von bis zu 2 Jahren sorgt für langfristigen Einsatz. Sparen Sie bis zu 30% Heizkosten mit intelligenter Steuerung.", shortDesc: "Intelligentes Thermostat mit KI-Lernfunktion und App-Steuerung",
    price: 100, sku: "NETATMOSMARTTHE", isNew: true,
    rating: 4.1, reviewCount: 33, categorySlug: "smart-home", brandSlug: "netatmo",
    specs: [
      { key: "Steuerung", value: "App, Sprache (HomeKit, Google, Alexa)" },
      { key: "Energieeinsparung", value: "Bis zu 30%" },
      { key: "Kompatibilität", value: "Alle Heizungstypen" },
      { key: "Batterielaufzeit", value: "Bis zu 2 Jahre" },
      { key: "Protokoll", value: "Wi-Fi, Bluetooth" },
    ]
  },
  {
    name: "IKEA TRÅDFRI Starter Kit E27", slug: "ikea-tradfri-starter-kit-e27",
    description: "Das IKEA TRADFRI Starter Kit E27 ist der perfekte Einstieg in die smarte Beleuchtung. Der Hub und 2 E27-LED-Lampen bieten alles für den Anfang. Die einfache Installation in vorhandene Leuchtmittel-Fassungen erfordert keine Fachkenntnisse. Die dimmbare Lichtstärke (100-2200 Lumen) passt jede Stimmung. Die Farbtemperatur (2200-6500K) reicht von warmweiß bis tageslichtweiß. Die Fernbedienung über App oder Sprachsteuerung (Alexa, Google) bietet Komfort. Die Kompatibilität mit Zigbee 3.0 sorgt für zuverlässige Kommunikation. Der ideale Einstieg in die smarte Beleuchtung.", shortDesc: "Smart-Home-Starter-Kit mit Hub und 2 E27-LED-Lampen",
    price: 290, sku: "IKEATRADFRISTAR",
    rating: 4.3, reviewCount: 242, categorySlug: "smart-home", brandSlug: "ikea",
    specs: [
      { key: "Protokoll", value: "Zigbee 3.0" },
      { key: "Lichtstrom", value: "100-2200 Lumen" },
      { key: "Farbtemperatur", value: "2200-6500K" },
      { key: "Leistung", value: "8,06 Watt pro Lampe" },
      { key: "Lebensdauer", value: "25.000 Stunden" },
      { key: "Farbe", value: "Weiß" },
    ]
  },
  {
    name: "IKEA DIRIGERA Hub", slug: "ikea-dirigera-hub",
    description: "Die IKEA DIRIGERA Hub ist die zentrale Steuerungseinheit für Ihr smartes Zuhause. Das Hub verbindet alle IKEA TRADFRI- und DIRIGERA-fähigen Geräte über Zigbee 3.0. Die intuitive App-Steuerung ermöglicht die Einrichtung und Steuerung aller Geräte über Smartphone. Die Kompatibilität mit Matter und Thread sorgt für zukunftssichere Konnektivität. Die kompakte Bauform lässt sich dezent in jeder Ecke platzieren. Die einfache Einrichtung in wenigen Minuten macht den Einstieg in die Smart-Home-Welt kinderleicht. Die DIRIGERA-Unterstützung für bis zu 50 Geräte bietet Platz für Erweiterungen. Das Herzstück für ein vernetztes Zuhause.", shortDesc: "Zentrale Smart-Home-Steuerung mit Zigbee 3.0, Matter und Thread",
    price: 160, sku: "IKEADIRIGERAHUB", isNew: true,
    rating: 4.2, reviewCount: 185, categorySlug: "smart-home", brandSlug: "ikea",
    specs: [
      { key: "Protokoll", value: "Zigbee 3.0, Matter, Thread" },
      { key: "Max. Geräte", value: "50" },
      { key: "App-Steuerung", value: "Ja (iOS/Android)" },
      { key: "Abmessungen", value: "Ø 10 cm, H 3,5 cm" },
      { key: "Farbe", value: "Schwarz/Weiß" },
    ]
  },
  {
    name: "IKEA PRAKTLYSING SmartBlind", slug: "ikea-praktlysing-smart-blind",
    description: "Die IKEA PRAKTLYSING Smart Blind ist eine elektrisch verstellbare Jalousie für smarte Fensterbedeckung. Die präzise Motorsteuerung ermöglicht millimetergenaue Einstellungen. Die Fernbedienung über App oder Sprachsteuerung (Alexa, Google) bietet Komfort. Die vorprogrammierten Timer ermöglichen automatisches Öffnen und Schließen. Die leise Motorsteuerung stört nicht im Alltag. Die einfache Installation in vorhandene Fensterrahmen erfordert keine professionelle Montage. Die Batterielaufzeit von bis zu 6 Monaten sorgt für langfristigen Einsatz. Perfekt für Komfort und Energieeinsparung.", shortDesc: "Elektrische Jalousie mit App- und Sprachsteuerung",
    price: 100, sku: "IKEAPRAKTLYSING",
    rating: 4.4, reviewCount: 23, categorySlug: "smart-home", brandSlug: "ikea",
    specs: [
      { key: "Steuerung", value: "App, Sprache (Alexa, Google)" },
      { key: "Motor", value: "Leise Motorsteuerung" },
      { key: "Batterielaufzeit", value: "Bis zu 6 Monate" },
      { key: "Protokoll", value: "Zigbee 3.0" },
      { key: "Farbe", value: "Weiß" },
    ]
  },
  {
    name: "Ring Alarm Security Kit 5", slug: "ring-alarm-security-kit-5",
    description: "Das Ring Alarm Security Kit 5 ist ein umfassendes Alarmsystem für bis zu 5 Zimmer. Das Kit enthält Base Station, 5 Sensoren und eine Tastatur. Die einfache Installation erfordert keine professionelle Montage. Die App-Steuerung ermöglicht die Fernbedienung von überall. Die sirene mit 100 dB(A) warnt vor Einbrüchen. Die Kompatibilität mit Ring-Doorbells und Kameras bietet maximale Integration. Die 24/7-Überwachung sorgt für maximale Sicherheit. Perfekt für Familien, die Wert auf Sicherheit legen.", shortDesc: "Alarmsystem-Kit mit 5 Sensoren, Base Station und Tastatur",
    price: 330, originalPrice: 379, sku: "RINGALARMSECURI", isPromo: true,
    rating: 4.7, reviewCount: 237, categorySlug: "smart-home", brandSlug: "ring",
    specs: [
      { key: "Komponenten", value: "Base Station, 5 Sensoren, Tastatur" },
      { key: "Sirene", value: "100 dB(A)" },
      { key: "Protokoll", value: "Zigbee, Wi-Fi" },
      { key: "Abdeckung", value: "Bis zu 5 Zimmer" },
      { key: "Farbe", value: "Weiß" },
    ]
  },
  {
    name: "Netatmo Smart Video Doorbell", slug: "netatmo-smart-video-doorbell",
    description: "Das Netatmo Smart Video Doorbell ist eine smarte Klingel mit HD-Videosprachfunktion. Die 1080p-HD-Kamera liefert klare Bilder von Besuchern. Die Nachtsichtfunktion sorgt auch bei Dunkelheit für gute Bilder. Die Zweistufige-Sprachfunktion ermöglicht die Kommunikation mit Besuchern. Die automatische Benachrichtigung bei Bewegungserkennung informiert Sie sofort. Die einfache Installation an vorhandenen Klingeldrähten erfordert keine Fachkenntnisse. Die Kompatibilität mit Apple HomeKit bietet maximale Sicherheit. Perfekt für die sichere Überwachung Ihres Eingangsbereichs.", shortDesc: "Smarte Videoklingel mit HD-Kamera und Zweistufiger-Sprachfunktion",
    price: 300, sku: "NETATMOSMARTVID",
    rating: 4.6, reviewCount: 62, categorySlug: "smart-home", brandSlug: "netatmo",
    specs: [
      { key: "Kamera", value: "1080p HD" },
      { key: "Nachtsicht", value: "Ja, Infrarot" },
      { key: "Sprachfunktion", value: "Zweistufig" },
      { key: "Speicherung", value: "Cloud (Abonnement) + microSD" },
      { key: "Installation", value: "Vorhandene Klingeldrähte" },
    ]
  },
  {
    name: "Nanoleaf Shapes Squares", slug: "nanoleaf-shapes-squares",
    description: "Die Nanoleaf Shapes Squares sind modulare LED-Wandpaneale im quadratischen Design. Die 16 Millionen Farben und diverse White-Shades bieten endlose Möglichkeiten. Die Touch-Integration ermöglicht interaktive Lichtszenen. Die Music-Sync-Funktion reagiert auf Musik und erstellt dynamische Lichtshows. Die einfache Installation mit 3M-Klebepads erfordert keine professionelle Montage. Die Kompatibilität mit HomeKit, Google Home und Alexa bietet maximale Konnektivität. Die quadratische Form bietet andere Gestaltungsmöglichkeiten als die Hexagons. Perfekt für kreative Wandgestaltung.", shortDesc: "Modulare Square-LED-Paneale mit Touch- und Music-Sync",
    price: 250, sku: "NANOLEAFSHAPESS",
    rating: 4.1, reviewCount: 257, categorySlug: "smart-home", brandSlug: "nanoleaf",
    specs: [
      { key: "Farben", value: "16 Millionen + White-Shades" },
      { key: "Panels", value: "7 pro Starter Kit" },
      { key: "Lichtstrom", value: "140 Lumen pro Panel" },
      { key: "Leistung", value: "9 Watt pro Panel" },
      { key: "Lebensdauer", value: "25.000 Stunden" },
      { key: "Konnektivität", value: "Wi-Fi, Bluetooth" },
    ]
  },
  {
    name: "Philips Hue Gradient Lightstrip 2m", slug: "philips-hue-gradient-lightstrip-2m",
    description: "Die Philips Hue Gradient Lightstrip 2m ist eine flexible LED-Lichtleiste für farbenfrohe Lichteffekte. Die 16 Millionen Farben und diverse White-Shades bieten endlose Möglichkeiten. Die Gradient-Technologie verteilt die Farben gleichmäßig über die gesamte Länge. Die Music-Sync-Funktion reagiert auf Musik und erstellt dynamische Lichtshows. Die einfache Installation mit Klebepads erfordert keine professionelle Montage. Die Kompatibilität mit Hue Bridge und diversen Sprachassistenten bietet maximale Konnektivität. Die 2 Meter Länge eignet sich für Möbel, Regale und andere Oberflächen. Perfekt für stimmungsvolles Ambientelicht.", shortDesc: "Flexible Gradient-LED-Leiste mit 2m für farbenfrohe Lichteffekte",
    price: 200, sku: "PHILIPSHUEGRADI",
    rating: 4.9, reviewCount: 190, categorySlug: "smart-home", brandSlug: "philips",
    specs: [
      { key: "Farben", value: "16 Millionen + White-Shades" },
      { key: "Länge", value: "2 Meter" },
      { key: "Lichtstrom", value: "950 Lumen" },
      { key: "Leistung", value: "24 Watt" },
      { key: "Lebensdauer", value: "25.000 Stunden" },
      { key: "Konnektivität", value: "Zigbee (via Hue Bridge)" },
    ]
  },
  {
    name: "IKEA SYMFONISK Table Speaker", slug: "ikea-symfonisk-table-speaker",
    description: "Der IKEA SYMFONISK Table Speaker ist ein kompakter WLAN-Lautsprecher mit Sonos-Integration. Der integrierte Subwoofer sorgt für kraftvollen Klang. Die WLAN-Verbindung ermöglicht das Abspielen von Musik aus diversen Streaming-Diensten. Die stereofonische Klangqualität sorgt für ein immersives Hörerlebnis. Die einfache Einrichtung über die Sonos-App ist in wenigen Minuten erledigt. Die kompakte Bauform passt als Tischlautsprecher in jede Ecke. Die Kombination aus IKEA-Design und Sonos-Qualität macht den SYMFONISK zu einem besonderen Lautsprecher.", shortDesc: "Kompakter WLAN-Lautsprecher mit Sonos-Integration",
    price: 400, sku: "IKEASYMFONISKTA",
    rating: 4.3, reviewCount: 26, categorySlug: "smart-home", brandSlug: "ikea",
    specs: [
      { key: "Konnektivität", value: "WLAN (Wi-Fi)" },
      { key: "Lautsprecher", value: "Woofer + Tweeter" },
      { key: "Streaming", value: "Spotify, AirPlay 2, Alexa" },
      { key: "Abmessungen", value: "16 x 16 x 10 cm" },
      { key: "Farbe", value: "Schwarz/Weiß" },
    ]
  },
  {
    name: "Philips Hue Play Gradient Lightstrip 55\\", slug: "philips-hue-play-gradient-lightstrip-55",
    description: "Die Philips Hue Play Gradient Lightstrip 55\" ist eine LED-Lichtleiste für Fernseher und Monitore. Die 16 Millionen Farben und diverse White-Shades bieten endlose Möglichkeiten. Die Gradient-Technologie synchronisiert das Licht mit dem Bildschirminhalt. Die Music-Sync-Funktion reagiert auf Musik und erstellt dynamische Lichtshows. Die einfache Installation am hinteren Teil des Bildschirms erfordert keine professionelle Montage. Die Kompatibilität mit Hue Bridge und diversen Sprachassistenten bietet maximale Konnektivität. Die 55-Zoll-Länge eignet sich für mittlere bis große Bildschirme. Perfekt für ein immersives Unterhaltungserlebnis.", shortDesc: "Gradient-LED-Leiste für 55\" TV mit Bildschirm-Sync",
    price: 50, originalPrice: 57, sku: "PHILIPSHUEPLAYG", isPromo: true,
    rating: 4.6, reviewCount: 259, categorySlug: "smart-home", brandSlug: "philips",
    specs: [
      { key: "Farben", value: "16 Millionen + White-Shades" },
      { key: "Bildschirmgröße", value: "55 Zoll" },
      { key: "Lichtstrom", value: "1600 Lumen" },
      { key: "Leistung", value: "24 Watt" },
      { key: "Lebensdauer", value: "25.000 Stunden" },
      { key: "Konnektivität", value: "Zigbee (via Hue Bridge)" },
    ]
  },
  {
    name: "tado° Smart Radiator Starter Kit", slug: "tado-smart-radiator-starter-kit",
    description: "Das Tado Smart Radiator Starter Kit ist der perfekte Einstieg in die intelligente Heizungssteuerung. Das Kit enthält 2 intelligente Heizkörperregler und den Bridge-Adapter. Die App-Steuerung ermöglicht die Fernbedienung von überall. Die Geofencing-Technologie passt die Temperatur an Ihren Standort an. Die Kompatibilität mit Alexa, Google Home und HomeKit bietet maximale Konnektivität. Die einfache Installation an vorhandenen Heizkörpern erfordert keine Fachkenntnisse. Die intelligente Steuerung mit Timern ermöglicht automatische Anpassungen. Sparen Sie bis zu 28% Heizkosten mit intelligenter Steuerung.", shortDesc: "Starter-Kit mit 2 Heizkörperreglern für intelligente Heizungssteuerung",
    price: 180, sku: "TADOSMARTRADIAT", isNew: true,
    rating: 4.2, reviewCount: 243, categorySlug: "smart-home", brandSlug: "tado",
    specs: [
      { key: "Inhalt", value: "2 Heizkörperregler, Bridge-Adapter" },
      { key: "Steuerung", value: "App, Sprache (Alexa, Google, HomeKit)" },
      { key: "Funktionen", value: "Geofencing, Timer, Energiebericht" },
      { key: "Energieeinsparung", value: "Bis zu 28%" },
      { key: "Farbe", value: "Weiß" },
    ]
  },
  {
    name: "Ring Floodlight Cam Wired Pro", slug: "ring-floodlight-cam-wired-pro",
    description: "Die Ring Floodlight Cam Wired Pro ist eine Überwachungskamera mit integrierten Flutlichtern. Die 1080p-HD-Kamera liefert klare Bilder. Die 2 Flutlichter mit 1500 Lumen sorgen für optimale Ausleuchtung. Die Nachtsichtfunktion sorgt auch bei Dunkelheit für gute Bilder. Die Zweistufige-Sprachfunktion ermöglicht die Kommunikation mit Besuchern. Die automatische Benachrichtigung bei Bewegungserkennung informiert Sie sofort. Die 3D-Bewegungserkennung mit Radar reduziert Fehlalarme. Die einfache Installation erfordert professionelle Montage. Perfekt für die Überwachung von Außenbereichen.", shortDesc: "Überwachungskamera mit 1080p HD und 1500 Lumen Flutlicht",
    price: 130, originalPrice: 150, sku: "RINGFLOODLIGHTC", isPromo: true,
    rating: 4.7, reviewCount: 305, categorySlug: "smart-home", brandSlug: "ring",
    specs: [
      { key: "Kamera", value: "1080p HD" },
      { key: "Flutlichter", value: "2 x 1500 Lumen" },
      { key: "Bewegungserkennung", value: "3D-Radar" },
      { key: "Sprachfunktion", value: "Zweistufig" },
      { key: "Installation", value: "Verkabelt (Elektriker)" },
    ]
  },
  {
    name: "IKEA PARASOLL Tür-/Fensterkontakt", slug: "ikea-parasoll-door-window-sensor",
    description: "Der IKEA PARASOLL Door/Window Sensor erkennt automatisch das Öffnen und Schließen von Türen und Fenstern. Der Magnetkontakt meldet den Zustand an das DIRIGERA- oder TRADFRI-Hub. Die einfache Installation mit Doppelseitigem Klebeband erfordert keine Bohrungen. Die kleine Bauform passt unauffällig an jede Tür oder jedes Fenster. Die Batterielaufzeit von bis zu 2 Jahren sorgt für langfristigen Einsatz. Die Kompatibilität mit Zigbee 3.0 sorgt für zuverlässige Kommunikation. Perfekt für die Überwachung und Steuerung Ihres smarten Zuhauses.", shortDesc: "Magnetischer Tür-/Fenstersensor für Zigbee-Smart-Home-Systeme",
    price: 30, originalPrice: 35, sku: "IKEAPARASOLLDOO", isPromo: true,
    rating: 4.7, reviewCount: 57, categorySlug: "smart-home", brandSlug: "ikea",
    specs: [
      { key: "Protokoll", value: "Zigbee 3.0" },
      { key: "Batterie", value: "CR2032 (2 Jahre)" },
      { key: "Abmessungen", value: "4,5 x 2,2 x 1,0 cm" },
      { key: "Reichweite", value: "Bis zu 10 m (hindernisfrei)" },
      { key: "Farbe", value: "Weiß" },
    ]
  },
  {
    name: "IKEA VALLHORN Bewegungsmelder", slug: "ikea-vallhorn-motion-sensor",
    description: "Der IKEA VALLHORN Motion Sensor erkennt Bewegungen und passt die Beleuchtung automatisch an. Der Infrarotsensor erkennt Bewegungen bis zu 10 Meter Entfernung. Die integrierte Beleuchtungssensibilität passt sich an die Helligkeit an. Die Fernbedienung über App oder Sprachsteuerung (Alexa, Google) bietet Komfort. Die einfache Installation mit Doppelseitigem Klebeband erfordert keine Bohrungen. Die Batterielaufzeit von bis zu 2 Jahren sorgt für langfristigen Einsatz. Die Kompatibilität mit Zigbee 3.0 sorgt für zuverlässige Kommunikation. Perfekt für Bewegungsmelder und smarte Beleuchtung.", shortDesc: "Bewegungsmelder mit integriertem Beleuchtungssensor",
    price: 190, sku: "IKEAVALLHORNMOT",
    rating: 4.6, reviewCount: 155, categorySlug: "smart-home", brandSlug: "ikea",
    specs: [
      { key: "Sensor", value: "Infrarot" },
      { key: "Reichweite", value: "Bis zu 10 m" },
      { key: "Protokoll", value: "Zigbee 3.0" },
      { key: "Batterie", value: "2x AAA (2 Jahre)" },
      { key: "Abmessungen", value: "8 x 8 x 4 cm" },
      { key: "Farbe", value: "Schwarz/Weiß" },
    ]
  },
  {
    name: "Philips Hue Secure Kamera", slug: "philips-hue-secure-camera",
    description: "Die Philips Hue Secure Camera ist eine smarte Überwachungskamera für den Innenbereich. Die 1080p-HD-Kamera liefert klare Bilder. Die Nachtsichtfunktion sorgt auch bei Dunkelheit für gute Bilder. Die Bewegungserkennung mit KI-Technologie erkennt Personen von Tieren. Die automatische Benachrichtigung informiert Sie sofort. Die Integration in das Hue-Ökosystem ermöglicht die Steuerung über die Hue-App. Die einfache Installation erfordert keine Fachkenntnisse. Die-cloud-Speicherung sorgt für sichere Aufbewahrung der Aufnahmen. Perfekt für die Überwachung Ihres Zuhauses im Hue-Ökosystem.", shortDesc: "Smarte Innenkamera mit 1080p HD und KI-Bewegungserkennung",
    price: 320, sku: "PHILIPSHUESE2", isFeatured: true,
    rating: 4.2, reviewCount: 127, categorySlug: "smart-home", brandSlug: "philips",
    specs: [
      { key: "Kamera", value: "1080p HD" },
      { key: "Nachtsicht", value: "Ja, Infrarot" },
      { key: "Bewegungserkennung", value: "KI-gestützt" },
      { key: "Speicherung", value: "Hue Secure Cloud" },
      { key: "Abmessungen", value: "8 x 8 x 12 cm" },
    ]
  },
  {
    name: "IKEA STARKVIND Luftreiniger", slug: "ikea-starkvind-air-purifier",
    description: "Der IKEA STARKVIND Air Purifier ist einLuftreiniger mit smarter Steuerung. Der HEPA-Filter entfernt 99,97% der Partikel ab 0,3 Mikrometer. Die automatische Luftqualitätsmessung passt die Lüftergeschwindigkeit an. Die App-Steuerung ermöglicht die Fernbedienung und Timer-Einstellungen. Die 5 Stufen bieten individuelle Einstellungen. Die leise Arbeitsweise stört nicht im Alltag. Die kompakte Bauform passt in jede Raumgröße. Die einfache Filterwechsel sorgt für langfristige Hygiene. Perfekt für Allergiker und saubere Luft im Zuhause.", shortDesc: "Luftreiniger mit HEPA-Filter und smarter Steuerung",
    price: 360, sku: "IKEASTARKVINDAI",
    rating: 4.6, reviewCount: 86, categorySlug: "smart-home", brandSlug: "ikea",
    specs: [
      { key: "Filter", value: "HEPA (99,97% ab 0,3µm)" },
      { key: "Luftleistung", value: "Bis zu 200 m³/h" },
      { key: "Raumgröße", value: "Bis zu 30 m²" },
      { key: "Lautstärke", value: "Bis zu 52 dB(A)" },
      { key: "Leistung", value: "10-30 Watt" },
      { key: "Farbe", value: "Schwarz/Weiß" },
    ]
  },
  {
    name: "Nanoleaf Essential A19 Birne", slug: "nanoleaf-essential-a19-bulb",
    description: "Die Nanoleaf Essential A19 Bulb ist eine smarte LED-Lampe mit Thread-Unterstützung. Die 16 Millionen Farben und diverse White-Shades bieten endlose Möglichkeiten. Die Thread-Unterstützung sorgt für schnelle und zuverlässige Kommunikation. Die einfache Installation in vorhandene E27-Fassungen erfordert keine Fachkenntnisse. Die dimmbare Lichtstärke passt jede Stimmung. Die Kompatibilität mit HomeKit, Google Home und Alexa bietet maximale Konnektivität. Die Nanoleaf-App ermöglicht die Erstellung individueller Lichtszenen. Perfekt für smarte Beleuchtung im ganzen Zuhause.", shortDesc: "Smarte E27-LED-Lampe mit 16 Millionen Farben und Thread",
    price: 200, originalPrice: 230, sku: "NANOLEAFESSENTI", isPromo: true,
    rating: 4.8, reviewCount: 51, categorySlug: "smart-home", brandSlug: "nanoleaf",
    specs: [
      { key: "Farben", value: "16 Millionen + White-Shades" },
      { key: "Lichtstrom", value: "806 Lumen" },
      { key: "Farbtemperatur", value: "2700-6500K" },
      { key: "Leistung", value: "9 Watt" },
      { key: "Lebensdauer", value: "15.000 Stunden" },
      { key: "Fassung", value: "E27" },
    ]
  },
  {
    name: "Ring Alarm Flood & Freeze Sensor", slug: "ring-alarm-flood-freeze-sensor",
    description: "Der Ring Alarm Flood and Freeze Sensor erkennt Überschwemmungen und Frost. Der Wasser-Sensor meldet Überschwemmungen sofort über die Ring-App. Der Frost-Sensor warnt vor Temperaturen unter 0°C. Die einfache Installation in Kellern, Bädern oder anderen feuchten Bereichen erfordert keine Fachkenntnisse. Die Batterielaufzeit von bis zu 3 Jahren sorgt für langfristigen Einsatz. Die Kompatibilität mit Ring Alarm bietet maximale Integration. Die Benachrichtigung bei Gefahren informiert Sie sofort. Perfekt für die Überwachung von Feuchtigkeit und Frost.", shortDesc: "Überschwemmungs- und Frostsensor für Ring-Alarm-Systeme",
    price: 260, originalPrice: 299, sku: "RINGALARMFLOODF", isPromo: true,
    rating: 4.9, reviewCount: 291, categorySlug: "smart-home", brandSlug: "ring",
    specs: [
      { key: "Sensoren", value: "Wasser, Frost" },
      { key: "Protokoll", value: "Zigbee" },
      { key: "Batterielaufzeit", value: "Bis zu 3 Jahre" },
      { key: "Abmessungen", value: "6 x 6 x 3 cm" },
      { key: "Farbe", value: "Weiß" },
    ]
  },
  {
    name: "tado° Smart Thermostat V3+", slug: "tado-smart-thermostat-v3plus-single",
    description: "Der Tado Smart Thermostat V3+ Single ist ein einzelnes intelligentes Thermostat für die Heizungssteuerung. Die App-Steuerung ermöglicht die Fernbedienung von überall. Die Geofencing-Technologie passt die Temperatur an Ihren Standort an. Die Kompatibilität mit Alexa, Google Home und HomeKit bietet maximale Konnektivität. Die einfache Installation an vorhandenen Heizungen erfordert keine Fachkenntnisse. Die intelligente Steuerung mit Timern ermöglicht automatische Anpassungen. Sparen Sie bis zu 28% Heizkosten mit intelligenter Steuerung. Das einzelne Thermostat für alle, die nur einen Raum steuern möchten.", shortDesc: "Einzelnes intelligentes Thermostat mit Geofencing",
    price: 40, sku: "TADOSMARTTHERMO",
    rating: 4.2, reviewCount: 84, categorySlug: "smart-home", brandSlug: "tado",
    specs: [
      { key: "Steuerung", value: "App, Sprache (Alexa, Google, HomeKit)" },
      { key: "Funktionen", value: "Geofencing, Timer" },
      { key: "Kompatibilität", value: "Alle Heizungstypen" },
      { key: "Energieeinsparung", value: "Bis zu 28%" },
      { key: "Abmessungen", value: "10 x 10 x 2,4 cm" },
      { key: "Farbe", value: "Weiß" },
    ]
  },
  {
    name: "Philips Hue Secure Doorbell Camera", slug: "philips-hue-secure-doorbell-camera",
    description: "Die Philips Hue Secure Doorbell Camera ist eine smarte Videoklingel mit Hue-Integration. Die 1080p-HD-Kamera liefert klare Bilder von Besuchern. Die Nachtsichtfunktion sorgt auch bei Dunkelheit für gute Bilder. Die Zweistufige-Sprachfunktion ermöglicht die Kommunikation mit Besuchern. Die automatische Benachrichtigung bei Bewegungserkennung informiert Sie sofort. Die Integration in das Hue-Ökosystem ermöglicht die Steuerung über die Hue-App. Die einfache Installation an vorhandenen Klingeldrähten erfordert keine Fachkenntnisse. Perfekt für die sichere Überwachung Ihres Eingangsbereichs im Hue-Ökosystem.", shortDesc: "Smarte Videoklingel mit 1080p HD und Hue-Integration",
    price: 350, sku: "PHILIPSHUESECUR",
    rating: 4.5, reviewCount: 176, categorySlug: "smart-home", brandSlug: "philips",
    specs: [
      { key: "Kamera", value: "1080p HD" },
      { key: "Nachtsicht", value: "Ja, Infrarot" },
      { key: "Sprachfunktion", value: "Zweistufig" },
      { key: "Speicherung", value: "Hue Secure Cloud" },
      { key: "Installation", value: "Vorhandene Klingeldrähte" },
    ]
  },
  {
    name: "Blueair Blue 3210", slug: "blueair-blue-3210",
    description: "Der Blueair Blue 3210 ist ein mittelgroßer Luftreiniger für mittlere Räume. Die HEPASilent-Technologie entfernt 99,97% der Partikel ab 0,1 Mikrometer. Die 3 Geschwindigkeitsstufen bieten individuelle Einstellungen. Die leise Arbeitsweise stört nicht im Alltag. Die kompakte Bauform passt in jede Ecke. Die Energy-Star-zertifizierte Energieeffizienz reduziert den Stromverbrauch. Perfekt für Wohnzimmer und mittlere Büros.", shortDesc: "Mittelgroßer Luftreiniger mit HEPASilent für mittlere Räume",
    price: 199, sku: "BLUE-3210",
    rating: 4.5, reviewCount: 189, categorySlug: "klima", brandSlug: "blueair",
    specs: [
      { key: "Filter", value: "HEPASilent" },
      { key: "Partikelentfernung", value: "99,97% ab 0,1µm" },
      { key: "Raumgröße", value: "Bis zu 30 m²" },
      { key: "Lautstärke", value: "24-46 dB(A)" },
      { key: "Leistung", value: "10-40 Watt" },
      { key: "Farbe", value: "Weiß" },
    ]
  },
  {
    name: "AEG CX7-2-I360", slug: "aeg-cx7-2-i360",
    description: "Der AEG CX7-2 I360 ist ein kabelloser Akkusauger mit 2-in-1-Funktionalität. Die 21,6V-Lithium-Ionen-Batterie bietet bis zu 40 Minuten Laufzeit. Der rotierende Bürstenwalze sorgt für gründliches Saugen auf allen Böden. Die LED-Beleuchtung am Saugkopf macht Staub in dunklen Ecken sichtbar. Das 2-in-1-Design ermöglicht das Saugen von Böden und Polstern. Die einfache Entleerung des Staubbehälters erfordert keinen Kontakt mit Staub. Die Wandhalterung sorgt für platzsparende Aufbewahrung. Perfekt für schnelle und gründliche Reinigung im Alltag.", shortDesc: "Kabelloser 2-in-1-Akkusauger mit 40 Min. Laufzeit und LED-Beleuchtung",
    price: 299, sku: "AEG-CX7-2-I360",
    rating: 4.4, reviewCount: 87, categorySlug: "reinigung", brandSlug: "aeg", weight: 2.5,
    specs: [
      { key: "Akku", value: "21,6V Li-Ionen" },
      { key: "Laufzeit", value: "Bis zu 40 Minuten" },
      { key: "Aufladung", value: "4 Stunden" },
      { key: "Volumen", value: "0,3 Liter" },
      { key: "Gewicht", value: "2,4 kg" },
      { key: "Farbe", value: "Grau/Rot" },
    ]
  },
  {
    name: "Bosch Serie 4 SMV6ECX22E", slug: "bosch-serie-4-smv6ecx22e",
    description: "Die Bosch Serie 4 SMV6ECX22E ist ein freistehender Geschirrspüler mit Zeolith-Trocknung. Die Zeolith-Trocknung sorgt für brillante Trocknungsergebnisse. Die VarioSpeed-Plus-Funktion verkürzt die Spüldauer um bis zu 66%. Die 3 Ladeebenen bieten flexible Belademöglichkeiten. Die 8 Programme und 4 Zusatzfunktionen bieten individuelle Einstellungen. Die A+++ Energiesiegel sorgt für Energieeffizienz. Die AquaStop-Sicherheit verhindert Wasserschäden. Perfekt für brillante Trocknung.", shortDesc: "Freistehender Geschirrspüler mit Zeolith-Trocknung und VarioSpeed",
    price: 799, sku: "BSH-SMV6ECX22E",
    rating: 4.7, reviewCount: 189, categorySlug: "haushaltsgeraete", brandSlug: "bosch", weight: 34,
    specs: [
      { key: "Kapazität", value: "13 Gedecke" },
      { key: "Energieklasse", value: "A+++" },
      { key: "Trocknungstechnologie", value: "Zeolith" },
      { key: "Programme", value: "8 + 4 Zusatzfunktionen" },
      { key: "Ladeebenen", value: "3" },
      { key: "Abmessungen", value: "60 x 85 x 60 cm" },
    ]
  },
  {
    name: "Siemens iQ300 SN63EX22CE", slug: "siemens-iq300-sn63ex22ce",
    description: "Die Siemens iQ300 SN63EX22CE ist ein Einbau-Geschirrspüler mit varioSpeed-Funktion. Die varioSpeed-Funktion verkürzt die Spüldauer um bis zu 50%. Die 14 Gedecke Kapazität eignet sich für große Haushalte. Die 6 Programme und 4 Zusatzfunktionen bieten individuelle Einstellungen. Die A+++ Energiesiegel sorgt für Energieeffizienz. Die VarioLoader-Flexibilität bietet flexible Belademöglichkeiten. Die AquaStop-Sicherheit verhindert Wasserschäden. Perfekt für schnelles Spülen.", shortDesc: "Einbau-Geschirrspüler mit varioSpeed und 14 Gedecken",
    price: 999, sku: "SI-SN63EX22CE",
    rating: 4.5, reviewCount: 33, categorySlug: "haushaltsgeraete", brandSlug: "siemens", weight: 35,
    specs: [
      { key: "Kapazität", value: "14 Gedecke" },
      { key: "Energieklasse", value: "A+++" },
      { key: "Programme", value: "6 + 4 Zusatzfunktionen" },
      { key: "Geschwindigkeit", value: "varioSpeed" },
      { key: "Abmessungen", value: "60 x 82 x 55 cm" },
    ]
  },
  {
    name: "Bosch Serie 4 SMS4ECI28F", slug: "bosch-serie-4-sms4eci28f",
    description: "Die Bosch Serie 4 SMS4ECI28F ist eine Einbau-Geschirrspüler mit ActiveWater-Technologie. Die ActiveWater-Technologie nutzt Wasser effizient für optimale Reinigungsergebnisse. Die 3 Ladeebenen bieten flexible Belademöglichkeiten. Die 10 Programme und 4 Zusatzfunktionen bieten individuelle Einstellungen. Die A+++ Energiesiegel sorgt für Energieeffizienz. Das Zeitsprogramm ermöglicht die Verschiebung des Startzeitpunkts. Die AquaStop-Sicherheit verhindert Wasserschäden. Perfekt für sparsame und gründliche Reinigung.", shortDesc: "Einbau-Geschirrspüler mit ActiveWater und 3 Ladeebenen",
    price: 1099, sku: "BSH-SMS4ECI28F",
    rating: 4.7, reviewCount: 24, categorySlug: "haushaltsgeraete", brandSlug: "bosch", weight: 53,
    specs: [
      { key: "Kapazität", value: "13 Gedecke" },
      { key: "Energieklasse", value: "A+++" },
      { key: "Wasserverbrauch", value: "9,5 Liter" },
      { key: "Programme", value: "10 + 4 Zusatzfunktionen" },
      { key: "Ladeebenen", value: "3" },
      { key: "Abmessungen", value: "60 x 82 x 55 cm" },
    ]
  },
  {
    name: "Bosch Serie 4 KGN36VLED", slug: "bosch-serie-4-kgn36vled",
    description: "Der Bosch Serie 4 KGN36VLED ist ein freistehender Kühlschrank-Gefrierkombination mit MultiBox-System. Die NoFrost-Technologie verhindert automatisch Eisbildung. Die 324 Liter Volumen bietet ausreichend Platz. Die LED-Beleuchtung sorgt für optimale Sicht. Die CrisperBox hält Obst und Gemüse besonders frisch. Die VitaFresh-Zone bietet optimale Lagerungsbedingungen. Das elegante Design passt in jede Küche. Perfekt für Kombination aus Kühlung und Gefrierung.", shortDesc: "Kühlschrank-Gefrierkombination mit NoFrost und 324L Volumen",
    price: 633, sku: "BSH-KGN36VLED",
    rating: 4.4, reviewCount: 31, categorySlug: "haushaltsgeraete", brandSlug: "bosch", weight: 72,
    specs: [
      { key: "Volumen", value: "324 Liter" },
      { key: "Kühltechnologie", value: "NoFrost" },
      { key: "Kühlschrank", value: "238 Liter" },
      { key: "Gefrierfach", value: "86 Liter" },
      { key: "Abmessungen", value: "60 x 186 x 65 cm" },
    ]
  },
  {
    name: "iRobot Roomba Plus 405", slug: "irobot-roomba-plus-405",
    description: "Der iRobot Roomba Plus 405 - intelligenter Saugroboter mit 3-Stufen-Reinigungssystem und automatischer Staubbenerdielung.", shortDesc: "Saugroboter mit 3-Stufen-Reinigung & Auto-Empty",
    price: 499, sku: "IR-RP405", isFeatured: true,
    rating: 4.5, reviewCount: 156, categorySlug: "reinigung", brandSlug: "irobot", weight: 3.2, tags: ["bestseller"],
    specs: [
      { key: "Leistung", value: "900 W" },
      { key: "Saugleistung", value: "140 AW" },
      { key: "Akkulaufzeit", value: "30 Min." },
      { key: "Gewicht", value: "3.5 kg" },
      { key: "Volumen", value: "0.4 l" },
      { key: "Geräuschpegel", value: "64 dB" },
      { key: "Garantie", value: "3 Jahre" },
    ]
  },
  {
    name: "Liebherr Comfort Ke230-26", slug: "liebherr-comfort-ke230-26",
    description: "Der Liebherr Comfort KE230.26 ist ein unterbau-fähiger Kühlschrank mit BioFresh-Technologie. Die BioFresh-Technologie hält Lebensmittel besonders frisch. Die 263 Liter Volumen bietet ausreichend Platz. Die LED-Beleuchtung sorgt für optimale Sicht. Die FrostSafe-Technologie schützt vor Temperaturschwankungen. Die Türanschlagstopp-Option ermöglicht beidseitige Türanschlag. Das unterbaufähige Design passt in jede Küchenzeile. Perfekt für frische Lebensmittel.", shortDesc: "Unterbau-Kühlschrank mit BioFresh und 263L Volumen",
    price: 549, sku: "LB-KE230-26",
    rating: 4.3, reviewCount: 56, categorySlug: "haushaltsgeraete", brandSlug: "liebherr", weight: 44,
    specs: [
      { key: "Volumen", value: "263 Liter" },
      { key: "Kühltechnologie", value: "BioFresh" },
      { key: "Energieklasse", value: "A++" },
      { key: "Schubladen", value: "BioFresh-Schubladen" },
      { key: "Abmessungen", value: "56 x 82 x 55 cm" },
    ]
  },
  {
    name: "Bosch Serie 6 Geschirrspüler SMV88TX36E", slug: "bosch-serie6-smv88tx36e",
    description: "Die Bosch Serie 6 SMV88TX36E ist ein Premium-Geschirrspüler mit Zeolith-Trocknung und PerfectDry. Die Zeolith-Trocknung sorgt für brillante Trocknungsergebnisse. Die PerfectDry-Technologie passt die Trocknung an unterschiedlichen Geschirrtype an. Die VarioSpeed Plus-Funktion verkürzt die Spüldauer um bis zu 66%. Die 14 Gedecke Kapazität eignet sich für große Haushalte. Die A+++ Energiesiegel sorgt für Energieeffizienz. Die Home-Connect-App ermöglicht die Fernbedienung. Das Premium-Modell für brillante Ergebnisse.", shortDesc: "Premium-Geschirrspüler mit Zeolith, PerfectDry und Home Connect",
    price: 2200, originalPrice: 2530, sku: "BOSCHSERIE6SMV8", isPromo: true,
    rating: 4.6, reviewCount: 72, categorySlug: "haushaltsgeraete", brandSlug: "bosch",
    specs: [
      { key: "Kapazität", value: "14 Gedecke" },
      { key: "Energieklasse", value: "A+++" },
      { key: "Trocknung", value: "Zeolith + PerfectDry" },
      { key: "Programme", value: "8 + 4 Zusatzfunktionen" },
      { key: "Abmessungen", value: "60 x 82 x 55 cm" },
    ]
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
  await prisma.coupon.deleteMany();
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

  await prisma.coupon.createMany({
    data: [
      {
        code: "HAUSAURA10",
        discountPercent: 10,
        maxUses: 0,
        expiresAt: null,
      },
      {
        code: "WILLKOMMEN15",
        discountPercent: 15,
        maxUses: 100,
        expiresAt: new Date("2026-12-31T23:59:59.000Z"),
      },
    ],
  });
  console.log("✅ 2 test coupons created");

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
