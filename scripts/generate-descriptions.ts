/**
 * Génère des longues descriptions SEO (300-500 mots) pour chaque produit
 * basé sur les métadonnées existantes (nom, marque, catégorie, specs, features)
 *
 * Usage: npx tsx scripts/generate-descriptions.ts
 * Sortie: prisma/seed-descriptions.json
 */

import { readFileSync, writeFileSync } from "fs";
import { join } from "path";

const SEED_PATH = join(process.cwd(), "prisma", "seed.ts");
const OUTPUT_PATH = join(process.cwd(), "prisma", "seed-descriptions.json");

const CATEGORY_CONTENT: Record<
  string,
  {
    intro: string;
    benefits: string[];
    useCases: string[];
    outro: string;
    seoKeywords: string[];
  }
> = {
  kueche: {
    intro:
      "Dieses hochwertige Küchengerät wurde für anspruchsvolle Hobbyköche und professionelle Küchenchefs entwickelt. Mit erstklassiger Verarbeitung, modernster Technologie und durchdachtem Design vereint es Leistung mit Benutzerfreundlichkeit und macht jeden Kochtag zu einem Erlebnis.",
    benefits: [
      "Energieeffiziente Technologie reduziert Stromkosten und schont die Umwelt",
      "Premium-Veredelung aus hochwertigen Materialien sorgt für langlebigen Gebrauch",
      "Intuitive Bedienung ermöglicht einfache Handhabung auch für Einsteiger",
      "Einfache Reinigung und Wartung sparen Zeit im Alltag",
      "Kompaktes Design passt in jede moderne Kücheneinrichtung",
    ],
    useCases: [
      "Perfekt für die tägliche Mahlzeitenzubereitung in der Familie",
      "Ideal für besondere Anlässe und festliche Menüs",
      "Geeignet für kleine Küchen und offene Wohnkonzepte",
      "Die richtige Wahl für alle, die Wert auf Qualität und Design legen",
    ],
    outro:
      "Bestellen Sie jetzt bei HAUSAURA und profitieren Sie von kostenlosem Versand ab 50€, 2 Jahre Garantie und unserer kompetenten Beratung. Ihr perfektes Küchengerät wartet auf Sie.",
    seoKeywords: [
      "Küchengerät",
      "Kochen",
      "Backen",
      "Küche",
      "Premium",
      "Induktion",
      "Ofen",
      "Herd",
    ],
  },
  kaffee: {
    intro:
      "Erleben Sie professionellen Kaffeegenuss zuhause. Diese Kaffeemaschine vereint deutsche Ingenieurskunst mit erstklassigen Mahlergebnissen für den perfekten Espresso, Cappuccino oder Filterkaffee. Jede Tasse wird mit Präzision und Liebe zum Detail zubereitet.",
    benefits: [
      "Frisch gemahlene Bohnen für optimalen Geschmack und Aroma",
      "Automatische Reinigungsfunktionen sparen Zeit und Aufwand",
      "Kompaktes Design passt in jede Küchenzeile",
      "Vielfältige Spezialitäten für jeden Geschmack und jede Tageszeit",
      "Langlebige Technologie für jahrelchen Kaffeegenuss",
    ],
    useCases: [
      "Perfekt für den täglichen Morgenkaffee vor der Arbeit",
      "Ideal für伽seeliche Kaffee-Einladungen und Besuche",
      "Geeignet für Büros und Arbeitsplätze",
      "Die richtige Wahl für Kaffee-Enthusiasten und Genießer",
    ],
    outro:
      "Gönnen Sie sich täglichen Kaffee-Genuss auf höchstem Niveau. Bei HAUSAURA erhalten Sie 2 Jahre Garantie, kostenlosen Versand ab 50€ und persönliche Beratung durch unser Kundenteam.",
    seoKeywords: [
      "Kaffee",
      "Espresso",
      "Cappuccino",
      "Vollautomat",
      "Kaffeemaschine",
      "Bohnen",
      "Milchschaum",
    ],
  },
  reinigung: {
    intro:
      "Makellose Sauberkeit ohne Kompromisse. Diese Reinigungsgeräte überzeugen durch hohe Saugleistung, effiziente Technologie und einfache Bedienung für ein sauberes und gesundes Zuhause. Investieren Sie in Hygiene und Wohlbefinden.",
    benefits: [
      "HEPA-Filterung sorgt für saubere und allergenfreie Luft",
      "Leiser Betrieb stört nicht im Alltag und beim Fernsehen",
      "Einfache Handhabung und Wartung节省 Sie Zeit",
      "Energieeffiziente Technologie reduziert Stromkosten",
      "Langlebige Verarbeitung für jahrelangen Einsatz",
    ],
    useCases: [
      "Perfekt für die tägliche Reinigung von Böden und Teppichen",
      "Ideal für Haushalte mit Haustieren und Allergikern",
      "Geeignet für Büros und gewerbliche Reinigung",
      "Die richtige Wahl für gründliche Vertikalreinigung",
    ],
    outro:
      "Investieren Sie in Sauberkeit und Hygiene für Ihr Zuhause. Bei HAUSAURA erhalten Sie 2 Jahre Garantie, kostenlosen Versand ab 50€ und eine 30-Tage-Rückgaberecht.",
    seoKeywords: [
      "Reinigung",
      "Saugen",
      "Sauberes Zuhause",
      "Hygiene",
      "Staubsauger",
      "Saugroboter",
    ],
  },
  klima: {
    intro:
      "Schaffen Sie das perfekte Raumklima in Ihrem Zuhause. Diese hochwertigen Klimageräte sorgen für angenehme Temperaturen und saubere Luft — für Ihr Wohlbefinden das ganze Jahr über. Atmen Sie freely und genießen Sie Komfort.",
    benefits: [
      "Angenehme Temperaturen das ganze Jahr unabhängig vom Wetter",
      "Energieeffiziente Kühlung spart Stromkosten langfristig",
      "Leiser Betrieb für ungestörten Schlaf und Arbeit",
      "Einfache Installation ohne Fachkenntnisse oder Handwerker",
      "HEPA-Filterung verbessert die Raumluftqualität nachhaltig",
    ],
    useCases: [
      "Perfekt für Schlafzimmer und Wohnbereiche",
      "Ideal für Büros und Homeoffice",
      "Geeignet für Allergiker und Asthmatiker",
      "Die richtige Wahl für komfortables Wohnen im Sommer und Winter",
    ],
    outro:
      "Atmen Sie freely und genießen Sie angenehme Temperaturen. Bei HAUSAURA erhalten Sie 2 Jahre Garantie, kostenlosen Versand ab 50€ und Expertenberatung für Ihr Raumklima.",
    seoKeywords: [
      "Klimaanlage",
      "Luftreiniger",
      "Raumklima",
      "Temperatur",
      "Kühlen",
      "Heizen",
    ],
  },
  "smart-home": {
    intro:
      "Machen Sie Ihr Zuhause intelligenter. Diese Smart-Home-Produkte bieten Komfort, Sicherheit und Energieeffizienz — steuerbar per App, Sprache oder automatisiert. Erleben Sie die Zukunft des Wohnens hautnah.",
    benefits: [
      "Steuerung per App von überall auf der Welt",
      "Sprachsteuerung mit Alexa, Google Home und HomeKit",
      "Automatisierung spart Energie und Zeit im Alltag",
      "Einfache Installation und Einrichtung ohne Fachkenntnisse",
      "Kompatibilität mit bestehenden Systemen und Geräten",
    ],
    useCases: [
      "Perfekt für intelligentes Heizen und Kühlen",
      "Ideal für Überwachung und Sicherheit",
      "Geeignet für smarte Beleuchtung und Stimmungssteuerung",
      "Die richtige Wahl für vernetztes Wohnen der Zukunft",
    ],
    outro:
      "Erleben Sie die Zukunft des Wohnens. Bei HAUSAURA erhalten Sie 2 Jahre Garantie, kostenlosen Versand ab 50€ und Beratung für Ihre Smart-Home-Lösung.",
    seoKeywords: [
      "Smart Home",
      "Intelligentes Zuhause",
      "App-Steuerung",
      "Automatisierung",
      "Sicherheit",
      "Beleuchtung",
    ],
  },
  haushaltsgeraete: {
    intro:
      "Zuverlässige Haushaltsgeräte für den täglichen Bedarf. Diese hochwertigen Geräte überzeugen durch Energieeffizienz, langlebige Technologie und einfache Bedienung. Machen Sie Ihren Alltag einfacher und komfortabler.",
    benefits: [
      "Energieeffiziente Technologie spart Kosten und schont die Umwelt",
      "Langlebige Verarbeitung für jahrelangen Gebrauch ohne Reparaturen",
      "Einfache Bedienung im Alltag ohne komplizierte Programme",
      "Kompaktes Design für platzsparende Aufstellung in jeder Küche",
      "Moderne Technologie für optimale Ergebnisse bei Waschen, Trocknen und Kühlen",
    ],
    useCases: [
      "Perfekt für Familien mit hohem Wasch- und Kühlbedarf",
      "Ideal für Singles und Paare mit platzsparenden Lösungen",
      "Geeignet für moderne Küchen und Waschräume",
      "Die richtige Wahl für zuverlässige Alltagshilfe im Haushalt",
    ],
    outro:
      "Vertrauen Sie auf Qualität und Langlebigkeit. Bei HAUSAURA erhalten Sie 2 Jahre Garantie, kostenlosen Versand ab 50€ und kompetente Beratung durch unser Kundenteam.",
    seoKeywords: [
      "Haushaltsgerät",
      "Zuhause",
      "Qualität",
      "Langlebigkeit",
      "Waschmaschine",
      "Kühlschrank",
    ],
  },
};

function generateLongDescription(product: {
  name: string;
  description: string;
  categorySlug: string;
  brandSlug: string;
  specs: { key: string; value: string }[];
  features?: string[];
  price: number;
}): string {
  const cat = CATEGORY_CONTENT[product.categorySlug] || CATEGORY_CONTENT.haushaltsgeraete;
  const brandName = product.brandSlug.charAt(0).toUpperCase() + product.brandSlug.slice(1);
  const pName = product.name;

  const paragraphs: string[] = [];

  // P1: Detailed intro with product name and brand
  paragraphs.push(
    `Die ${pName} von ${brandName} ist die perfekte Wahl für anspruchsvolle Nutzer, die Wert auf Qualität, Leistung und Design legen. ${cat.intro}`
  );

  // P2: Product-specific description (from existing)
  if (product.description && product.description.length > 50) {
    paragraphs.push(product.description);
  }

  // P3: Key features in detail
  if (product.features && product.features.length > 0) {
    const featureDetails = product.features
      .slice(0, 6)
      .map((f) => {
        return `${f}`;
      })
      .join(". ");
    paragraphs.push(
      `Die wichtigsten Features auf einen Blick: ${featureDetails}. Diese Funktionen machen die ${pName} zu einer herausragenden Wahl in ihrer Preisklasse und bieten ein hervorragendes Preis-Leistungs-Verhältnis.`
    );
  }

  // P4: Technical specifications in detail
  if (product.specs && product.specs.length > 0) {
    const specLines = product.specs
      .slice(0, 8)
      .map((s) => `${s.key}: ${s.value}`)
      .join(" | ");
    paragraphs.push(
      `Technische Daten: ${specLines}. Diese Spezifikationen machen die ${pName} zu einem leistungsstarken und zuverlässigen Gerät, das höchste Ansprüche erfüllt.`
    );
  }

  // P5: Benefits
  paragraphs.push(
    `Ihre Vorteile mit der ${pName}: ${cat.benefits.join(". ")}. Diese Vorteile machen dieses ${brandName}-Produkt zu einer excellenten Investition für Ihr Zuhause.`
  );

  // P6: Use cases
  paragraphs.push(
    `Einsatzmöglichkeiten: ${cat.useCases.join(". ")}. Egal ob im Alltag oder bei besonderen Anlässen — die ${pName} überzeugt in jeder Situation.`
  );

  // P7: Brand quality paragraph
  paragraphs.push(
    `${brandName} steht für höchste Qualität und Innovation. Die ${pName} wurde nach strengsten Qualitätsstandards entwickelt und bietet eine Premium-Veredelung, die langlebigen Gebrauch gewährleistet. Vertrauen Sie auf die Erfahrung und Kompetenz von ${brandName} — ein Name, der für Exzellenz steht.`
  );

  // P8: SEO keywords paragraph
  paragraphs.push(
    `Suchen Sie nach ${cat.seoKeywords.slice(0, 4).join(", ")}? Die ${pName} bietet die ideale Kombination aus Qualität, Leistung und modernem Design. Überzeugen Sie sich selbst von den Vorteilen dieses ${brandName}-Produkts und entdecken Sie, wie einfach Premium-Qualität sein kann.`
  );

  // P9: Trust signals
  paragraphs.push(
    `Bei HAUSAURA kaufen Sie die ${pName} sicher und unkompliziert online. Wir bieten Ihnen 2 Jahre Garantie, kostenlosen Versand ab 50€ Bestellwert, sichere Bezahlung und eine 30-Tage-Rückgaberecht. Unser Kundenservice steht Ihnen gerne bei Fragen zur Verfügung.`
  );

  // P10: Outro
  paragraphs.push(cat.outro);

  return paragraphs.join("\n\n");
}

// Parse seed file
function parseSeedProducts(): Array<{
  name: string;
  slug: string;
  description: string;
  categorySlug: string;
  brandSlug: string;
  specs: { key: string; value: string }[];
  features: string[];
  price: number;
}> {
  const seedContent = readFileSync(SEED_PATH, "utf-8");
  const lines = seedContent.split("\n");
  const products: Array<{
    name: string;
    slug: string;
    description: string;
    categorySlug: string;
    brandSlug: string;
    specs: { key: string; value: string }[];
    features: string[];
    price: number;
  }> = [];

  let current: Partial<{
    name: string;
    slug: string;
    description: string;
    categorySlug: string;
    brandSlug: string;
    specs: { key: string; value: string }[];
    features: string[];
    price: number;
  }> | null = null;
  let inSpecs = false;
  let inFeatures = false;
  let descBuffer = "";
  let inDesc = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Detect product start: line with name: "..." inside products array
    if (line.match(/^\s+name:\s*"[^"]+",\s*slug:\s*"/)) {
      // Save previous
      if (current?.name && current?.slug) {
        if (descBuffer) current.description = descBuffer.replace(/\\"/g, '"').trim();
        products.push(current as any);
      }
      const nameMatch = line.match(/name:\s*"([^"]+)"/);
      const slugMatch = line.match(/slug:\s*"([^"]+)"/);
      current = {
        name: nameMatch?.[1] || "",
        slug: slugMatch?.[1] || "",
        description: "",
        categorySlug: "",
        brandSlug: "",
        specs: [],
        features: [],
        price: 0,
      };
      descBuffer = "";
      inDesc = false;
      inSpecs = false;
      inFeatures = false;
    }

    if (!current) continue;

    // Description (may span multiple lines via string concat)
    if (!inDesc && line.match(/description:\s*"/)) {
      const m = line.match(/description:\s*"((?:[^"\\]|\\.)*)"/);
      if (m) {
        current.description = m[1];
      } else {
        // multi-line description
        const start = line.indexOf('"') + 1;
        descBuffer = line.slice(start);
        inDesc = true;
      }
    } else if (inDesc) {
      if (line.includes('"')) {
        descBuffer += " " + line.slice(0, line.indexOf('"'));
        current.description = descBuffer.replace(/\\"/g, '"');
        inDesc = false;
      } else {
        descBuffer += " " + line.trim();
      }
    }

    const catMatch = line.match(/categorySlug:\s*"([^"]+)"/);
    if (catMatch) current.categorySlug = catMatch[1];

    const brandMatch = line.match(/brandSlug:\s*"([^"]+)"/);
    if (brandMatch) current.brandSlug = brandMatch[1];

    const priceMatch = line.match(/price:\s*(\d+(?:\.\d+)?)/);
    if (priceMatch && !current.price) current.price = parseFloat(priceMatch[1]);

    // Specs
    if (line.match(/specs:\s*\[/)) inSpecs = true;
    if (inSpecs) {
      const sk = line.match(/key:\s*"([^"]+)"/);
      const sv = line.match(/value:\s*"([^"]+)"/);
      if (sk && sv) current.specs!.push({ key: sk[1], value: sv[1] });
      if (line.includes("]")) inSpecs = false;
    }

    // Features
    if (line.match(/features:\s*\[/) && !inFeatures) inFeatures = true;
    if (inFeatures) {
      const feats = line.match(/"([^"]+)"/g);
      if (feats) feats.forEach((f) => current.features!.push(f.replace(/"/g, "")));
      if (line.includes("]")) inFeatures = false;
    }
  }

  // Last product
  if (current?.name && current?.slug) {
    if (descBuffer) current.description = descBuffer.replace(/\\"/g, '"').trim();
    products.push(current as any);
  }

  return products;
}

function main() {
  console.log("Parsing seed file...");
  const products = parseSeedProducts();
  console.log(`Found ${products.length} products`);

  console.log("Generating long descriptions...");
  const descriptions: Record<string, string> = {};

  for (const p of products) {
    descriptions[p.slug] = generateLongDescription(p);
  }

  writeFileSync(OUTPUT_PATH, JSON.stringify(descriptions, null, 2), "utf-8");
  console.log(`Generated ${Object.keys(descriptions).length} descriptions`);

  const wordCounts = Object.values(descriptions).map((d) => d.split(/\s+/).length);
  const avg = Math.round(wordCounts.reduce((a, b) => a + b, 0) / wordCounts.length);
  console.log(`Word count: min=${Math.min(...wordCounts)}, max=${Math.max(...wordCounts)}, avg=${avg}`);
}

main();
