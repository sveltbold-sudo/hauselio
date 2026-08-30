import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const updates = [
  {
    slug: 'aeg-cx7-2-i360',
    description: `Der AEG CX7-2 I360 ist ein kabelloser Akkusauger mit 2-in-1-Funktionalität. Die 21,6V-Lithium-Ionen-Batterie bietet bis zu 40 Minuten Laufzeit. Der rotierende Bürstenwalze sorgt für gründliches Saugen auf allen Böden. Die LED-Beleuchtung am Saugkopf macht Staub in dunklen Ecken sichtbar. Das 2-in-1-Design ermöglicht das Saugen von Böden und Polstern. Die einfache Entleerung des Staubbehälters erfordert keinen Kontakt mit Staub. Die Wandhalterung sorgt für platzsparende Aufbewahrung. Perfekt für schnelle und gründliche Reinigung im Alltag.`,
    shortDesc: 'Kabelloser 2-in-1-Akkusauger mit 40 Min. Laufzeit und LED-Beleuchtung',
    features: ['21,6V Li-Ionen-Batterie', '40 Min. Laufzeit', '2-in-1 Design', 'LED-Beleuchtung', 'Wandhalterung'],
    specs: [
      { key: 'Akku', value: '21,6V Li-Ionen' },
      { key: 'Laufzeit', value: 'Bis zu 40 Minuten' },
      { key: 'Aufladung', value: '4 Stunden' },
      { key: 'Volumen', value: '0,3 Liter' },
      { key: 'Gewicht', value: '2,4 kg' },
      { key: 'Farbe', value: 'Grau/Rot' },
    ],
  },
  {
    slug: 'dyson-big-ball-animal-pro',
    description: `Der Dyson Big Ball Animal Pro ist ein zyklonloser Staubsauger für Tierhaarbesitzer. Die Dyson-Zyklontechnologie erzeugt 79.000 G zur Trennung von Staub und Luft. Die Self-Righting-Technologie richtet den Sauger automatisch auf, wenn er umfällt. Die Animal Pro Bürste entfernt Tierhaare gründlich von allen Böden. Die hygienische Entleerung erfordert keinen Kontakt mit Staub. Die 2 Tierklassen-Filter fangen 99,97% der Allergene ab. Das kugelförmige Design ermöglicht müheloses Manövrieren. Perfekt für Haushalte mit Haustieren.`,
    shortDesc: 'Kabelloser Staubsauger mit Self-Righting und Tierhaar-Bürste',
    features: ['Dyson-Zyklontechnologie', 'Self-Righting-Technologie', 'Animal Pro Bürste', '99,97% Allergen-Filter', 'Hygienische Entleerung'],
    specs: [
      { key: 'Technologie', value: 'Dyson-Zyklon' },
      { key: 'Leistung', value: '79.000 G' },
      { key: 'Filter', value: '2 Tierklassen-Filter' },
      { key: 'Gewicht', value: '3,2 kg' },
      { key: 'Volumen', value: '0,76 Liter' },
      { key: 'Farbe', value: 'Nickel/Rot' },
    ],
  },
  {
    slug: 'dyson-gen5detect-absolute',
    description: `Der Dyson Gen5 Detect Absolute ist der leistungsstärkste kabellose Akkusauger von Dyson. Die 125.000 min-1 Dyson Hyperdymium-Motor erzeugt 230 AW Saugleistung. Die Laser-Erkennung macht unsichtbaren Staub auf harten Böden sichtbar. Die Piezo-Sensorik erkennt die Staubmenge und passt die Leistung automatisch an. Die 60 Minuten Laufzeit reicht für große Reinigungen. Die HEPA-Filterung fängt 99,99% der Allergene ab. Das LCD-Display zeigt Echtzeitdaten über die Reinigung. Das absolute Flaggschiff für makellose Sauberkeit.`,
    shortDesc: 'Leistungsstärkster Dyson-Akkusauger mit Laser-Erkennung und 230 AW',
    features: ['230 AW Saugleistung', 'Laser-Erkennung', 'Piezo-Sensorik', '60 Min. Laufzeit', 'HEPA-Filter'],
    specs: [
      { key: 'Leistung', value: '230 AW' },
      { key: 'Motor', value: 'Dyson Hyperdymium 125.000 min-1' },
      { key: 'Laufzeit', value: 'Bis zu 60 Minuten' },
      { key: 'Filter', value: 'HEPA (99,99%)' },
      { key: 'Gewicht', value: '3,5 kg' },
      { key: 'Farbe', value: 'Gelb/Nickel' },
    ],
  },
  {
    slug: 'dyson-v12-detect-slim',
    description: `Der Dyson V12 Detect Slim ist ein leichter kabelloser Akkusauger mit Laser-Erkennung. Die Laser-Technologie macht unsichtbaren Staub auf harten Böden sichtbar. Die Piezo-Sensorik erkennt die Staubmenge und passt die Leistung automatisch an. Die 60 Minuten Laufzeit reicht für gründliche Reinigungen. Die hygienische Entleerung erfordert keinen Kontakt mit Staub. Die multiple Ausstattung bietet Werkzeuge für jeden Einsatzzweck. Das LCD-Display zeigt Echtzeitdaten über die Reinigung. Perfekt für alle, die Leistung und Handlichkeit kombinieren möchten.`,
    shortDesc: 'Leichter Dyson-Akkusauger mit Laser-Erkennung und 60 Min. Laufzeit',
    features: ['Laser-Erkennung', 'Piezo-Sensorik', '60 Min. Laufzeit', 'Hygienische Entleerung', 'LCD-Display'],
    specs: [
      { key: 'Leistung', value: '150 AW' },
      { key: 'Motor', value: 'Dyson Hyperdymium' },
      { key: 'Laufzeit', value: 'Bis zu 60 Minuten' },
      { key: 'Filter', value: '5-stufig' },
      { key: 'Gewicht', value: '2,2 kg' },
      { key: 'Farbe', value: 'Gelb/Nickel' },
    ],
  },
  {
    slug: 'dyson-v15-detect-absolute',
    description: `Der Dyson V15 Detect Absolute ist ein leistungsstarker kabelloser Akkusauger mit Laser-Erkennung. Die Laser-Technologie macht unsichtbaren Staub auf harten Böden sichtbar. Die Piezo-Sensorik erkennt die Staubmenge und passt die Leistung automatisch an. Die 60 Minuten Laufzeit reicht für gründliche Reinigungen. Die hygienische Entleerung erfordert keinen Kontakt mit Staub. Die multiple Ausstattung bietet Werkzeuge für jeden Einsatzzweck. Das LCD-Display zeigt Echtzeitdaten über die Reinigung. Perfekt für alle, die hohe Leistung und Komfort suchen.`,
    shortDesc: 'Leistungsstarker Dyson-Akkusauger mit Laser und Piezo-Sensorik',
    features: ['Laser-Erkennung', 'Piezo-Sensorik', '60 Min. Laufzeit', 'LCD-Display', 'Multiple Werkzeuge'],
    specs: [
      { key: 'Leistung', value: '230 AW' },
      { key: 'Motor', value: 'Dyson Hyperdymium' },
      { key: 'Laufzeit', value: 'Bis zu 60 Minuten' },
      { key: 'Filter', value: 'HEPA (99,99%)' },
      { key: 'Gewicht', value: '3,1 kg' },
      { key: 'Farbe', value: 'Gold/Nickel' },
    ],
  },
  {
    slug: 'dyson-v8-absolute',
    description: `Der Dyson V8 Absolute ist ein bewährter kabelloser Akkusauger mit bewährter Dyson-Technologie. Die 2-Tier-Radial-Zyklone erzeugt bis zu 15 cyklonartige Rotationsbewegungen für gründliches Saugen. Die 40 Minuten Laufzeit reicht für die tägliche Reinigung. Die hygienische Entleerung erfordert keinen Kontakt mit Staub. Die multiple Ausstattung bietet Werkzeuge für Böden, Polster und enge Ecken. Die Wandhalterung sorgt für platzsparende Aufbewahrung. Das bewährte Dyson-Design bietet Zuverlässigkeit und Langlebigkeit. Perfekt für den täglichen Gebrauch.`,
    shortDesc: 'Bewährter Dyson-Akkusauger mit 40 Min. Laufzeit und 2-Tier-Zyklonen',
    features: ['2-Tier-Radial-Zyklone', '40 Min. Laufzeit', 'Hygienische Entleerung', 'Multiple Werkzeuge', 'Wandhalterung'],
    specs: [
      { key: 'Leistung', value: '151 AW' },
      { key: 'Motor', value: 'Dyson V8' },
      { key: 'Laufzeit', value: 'Bis zu 40 Minuten' },
      { key: 'Filter', value: 'Whole-machine' },
      { key: 'Gewicht', value: '2,6 kg' },
      { key: 'Farbe', value: 'Nickel/Blau' },
    ],
  },
  {
    slug: 'irobot-roomba-combo-j5-plus',
    description: `Der iRobot Roomba Combo j5+ ist ein intelligenter Saugroboter mit Wischfunktion. Die 3-Stufen-Reinigungssystem saugt und wischt automatisch. Die PrecisionVision-Navigation erkennt Hindernisse und vermeidet Kollisionen. Die Smart-Mapping-Technologie lernt die Grundrisse Ihres Zuhauses. Die App-Steuerung ermöglicht die Fernbedienung von überall. Die Kompatibilität mit Alexa und Google Home bietet Sprachsteuerung. Die automatische Staubertertiung bei满gedocktem Base-Station. Perfekt für die automatische Reinigung von harten Böden und Teppichen.`,
    shortDesc: 'Intelligenter Saug-Wisch-Roboter mit PrecisionVision und Smart Mapping',
    features: ['Saugen & Wischen', 'PrecisionVision', 'Smart Mapping', 'App & Sprachsteuerung', 'Automatische Staubertertiung'],
    specs: [
      { key: 'Reinigung', value: 'Saugen & Wischen' },
      { key: 'Navigation', value: 'PrecisionVision' },
      { key: 'Laufzeit', value: 'Bis zu 75 Minuten' },
      { key: 'Basisstation', value: 'Ja (automatische Entleerung)' },
      { key: 'Gewicht', value: '3,1 kg' },
      { key: 'Farbe', value: 'Grau' },
    ],
  },
  {
    slug: 'irobot-roomba-j9-plus',
    description: `Der iRobot Roomba j9+ ist der Premium-Saugroboter von iRobot mit fortschrittlicher Navigation. Die 3-Stufen-Reinigungssystem saugt gründlich auf allen Böden. Die PrecisionVision-Navigation erkennt Hindernisse und vermeidet Kollisionen. Die Smart-Mapping-Technologie lernt die Grundrisse Ihres Zuhauses. Die App-Steuerung ermöglicht die Fernbedienung von überall. Die automatische Staubertertiung bei满gedocktem Base-Station. Die intelligente Erkennung von verschmutzten Bereichen für gründliche Reinigung. Das Premium-Modell für maximale Reinigungsleistung.`,
    shortDesc: 'Premium-Saugroboter mit PrecisionVision und automatischer Staubertertiung',
    features: ['3-Stufen-Reinigung', 'PrecisionVision', 'Smart Mapping', 'Automatische Staubertertiung', 'Intelligente Verschmutzungserkennung'],
    specs: [
      { key: 'Reinigung', value: '3-Stufen Saugsystem' },
      { key: 'Navigation', value: 'PrecisionVision' },
      { key: 'Laufzeit', value: 'Bis zu 75 Minuten' },
      { key: 'Basisstation', value: 'Ja (automatische Entleerung)' },
      { key: 'Gewicht', value: '3,4 kg' },
      { key: 'Farbe', value: 'Grau/Schwarz' },
    ],
  },
  {
    slug: 'kaercher-sc4-easyfix-premium',
    description: `Der Kärcher SC4 EasyFix Premium ist ein dampfreiniger für gründliche Reinigung ohne Chemikalien. Die EasyFix-Wischvorrichtung ermöglicht das Reinigen großer Flächen. Die 2000 Watt Heizung erzeugt permanenten Dampf für不间断 Reinigung. Die verschiedenen Düsen bieten Werkzeuge für jeden Einsatzzweck. Die abnehmbare 0,5-Liter-Wassertanks erlauben kurze Pausen zum Nachfüllen. Die Kindersicherung verhindert unbeabsichtigtes Einschalten. Die kompakte Bauform lässt sich platzsparend aufbewahren. Perfekt für chemiefreie Reinigung von Böden, Fliesen und Gläsern.`,
    shortDesc: 'Dampfreiniger mit EasyFix und 2000W für chemiefreie Reinigung',
    features: ['EasyFix-Wischvorrichtung', '2000 Watt Dauer dampf', 'Verschiedene Düsen', 'Kinderliedersicherung', 'Chemiefreie Reinigung'],
    specs: [
      { key: 'Leistung', value: '2000 Watt' },
      { key: 'Dampfdruck', value: '3,5 bar' },
      { key: 'Wassertank', value: '0,5 Liter (entnehmbar)' },
      { key: 'Aufheizzeit', value: '4 Minuten' },
      { key: 'Gewicht', value: '4,3 kg' },
      { key: 'Farbe', value: 'Gelb/Schwarz' },
    ],
  },
  {
    slug: 'kaercher-vc3-cordless',
    description: `Der Kärcher VC3 Cordless ist ein kabelloser Akkusauger für komfortables Saugen ohne Kabel. Die 18V-Lithium-Ionen-Batterie bietet bis zu 30 Minuten Laufzeit. Der rotierende Bürstenwalze sorgt für gründliches Saugen auf allen Böden. Die multiple Ausstattung bietet Werkzeuge für jeden Einsatzzweck. Die hygienische Entleerung erfordert keinen Kontakt mit Staub. Die Wandhalterung sorgt für platzsparende Aufbewahrung. Das leichtgewichtige Design ermöglicht müheloses Tragen. Perfekt für schnelle und komfortable Reinigung im Alltag.`,
    shortDesc: 'Kabelloser Akkusauger mit 30 Min. Laufzeit und rotierender Bürste',
    features: ['18V Li-Ionen-Batterie', '30 Min. Laufzeit', 'Rotierende Bürste', 'Multiple Werkzeuge', 'Wandhalterung'],
    specs: [
      { key: 'Akku', value: '18V Li-Ionen' },
      { key: 'Laufzeit', value: 'Bis zu 30 Minuten' },
      { key: 'Aufladung', value: '3 Stunden' },
      { key: 'Volumen', value: '0,2 Liter' },
      { key: 'Gewicht', value: '2,2 kg' },
      { key: 'Farbe', value: 'Schwarz/Orange' },
    ],
  },
  {
    slug: 'kaercher-vc5-cordless',
    description: `Der Kärcher VC5 Cordless ist ein kompakter kabelloser Akkusauger für kleine Wohnungen. Die 18V-Lithium-Ionen-Batterie bietet bis zu 30 Minuten Laufzeit. Der rotierende Bürstenwalze sorgt für gründliches Saugen auf allen Böden. Die multiple Ausstattung bietet Werkzeuge für jeden Einsatzzweck. Die hygienische Entleerung erfordert keinen Kontakt mit Staub. Die kompakte Bauform lässt sich platzsparend aufbewahren. Das leichtgewichtige Design ermöglicht müheloses Tragen. Perfekt für kleine Wohnungen und schnelle Reinigungen.`,
    shortDesc: 'Kompakter kabelloser Akkusauger mit 30 Min. Laufzeit',
    features: ['18V Li-Ionen-Batterie', '30 Min. Laufzeit', 'Kompaktes Design', 'Rotierende Bürste', 'Leichtgewicht'],
    specs: [
      { key: 'Akku', value: '18V Li-Ionen' },
      { key: 'Laufzeit', value: 'Bis zu 30 Minuten' },
      { key: 'Aufladung', value: '3 Stunden' },
      { key: 'Volumen', value: '0,2 Liter' },
      { key: 'Gewicht', value: '1,5 kg' },
      { key: 'Farbe', value: 'Schwarz/Orange' },
    ],
  },
  {
    slug: 'roborock-q8-max-plus',
    description: `Der Roborock Q8 Max+ ist ein intelligenter Saugroboter mit Wischfunktion und automatischer Staubertertiung. Die 5500 Pa Saugkraft entfernt Staub und Schmutz gründlich. Die LiDAR-Navigation erkennt den Grundriss und plant optimale Reinigungswege. Die 300 ml Wasserbehälter Wischt feucht den Boden. Die automatische Staubertertiung bei满gedocktem Base-Station bis zu 7 Wochen. Die App-Steuerung ermöglicht die Fernbedienung von überall. Die Kompatibilität mit Alexa und Google Home bietet Sprachsteuerung. Perfekt für die automatische Reinigung von großen Wohnungen.`,
    shortDesc: 'Intelligenter Saug-Wisch-Roboter mit LiDAR und automatischer Entleerung',
    features: ['5500 Pa Saugkraft', 'LiDAR-Navigation', 'Wischfunktion', 'Automatische Entleerung (7 Wochen)', 'App & Sprachsteuerung'],
    specs: [
      { key: 'Saugkraft', value: '5500 Pa' },
      { key: 'Navigation', value: 'LiDAR' },
      { key: 'Laufzeit', value: 'Bis zu 180 Minuten' },
      { key: 'Wasserbehälter', value: '300 ml' },
      { key: 'Basisstation', value: 'Ja (automatische Entleerung)' },
      { key: 'Farbe', value: 'Schwarz/Weiß' },
    ],
  },
  {
    slug: 'roborock-s8-maxv-ultra',
    description: `Der Roborock S8 MaxV Ultra ist der Premium-Saugroboter mit intelligenter KI-Navigation. Die 8200 Pa Saugkraft entfernt Staub und Schmutz gründlich. Die ReactiveAI 2.0-Technologie erkennt Hindernisse und vermeidet Kollisionen. Die VibraRise 2.0-Wischtechnologie schrubbt den Boden mit 3000 Vibrationen pro Minute. Die automatische Staubertertiung bei满gedocktem Base-Station bis zu 7 Wochen. Die App-Steuerung ermöglicht die Fernbedienung von überall. Die Kompatibilität mit Alexa und Google Home bietet Sprachsteuerung. Das absolute Flaggschiff für makellose Sauberkeit.`,
    shortDesc: 'Premium-Saugroboter mit 8200 Pa, ReactiveAI und VibraRise Wischtechnologie',
    features: ['8200 Pa Saugkraft', 'ReactiveAI 2.0', 'VibraRise 2.0 Wischtechnologie', 'Automatische Entleerung', 'KI-Navigation'],
    specs: [
      { key: 'Saugkraft', value: '8200 Pa' },
      { key: 'Navigation', value: 'ReactiveAI 2.0' },
      { key: 'Wischtechnologie', value: 'VibraRise 2.0' },
      { key: 'Laufzeit', value: 'Bis zu 180 Minuten' },
      { key: 'Basisstation', value: 'Ja (automatische Entleerung)' },
      { key: 'Farbe', value: 'Schwarz' },
    ],
  },
  {
    slug: 'xiaomi-roborock-pro',
    description: `Der Xiaomi Roborock Pro ist ein intelligenter Saugroboter mit LiDAR-Navigation. Die 4000 Pa Saugkraft entfernt Staub und Schmutz gründlich. Die LiDAR-Navigation erkennt den Grundriss und plant optimale Reinigungswege. Die Wischfunktion reinigt den Boden feucht. Die App-Steuerung ermöglicht die Fernbedienung von überall. Die Kompatibilität mit Alexa und Google Home bietet Sprachsteuerung. Die automatische Erhöhung der Saugleistung auf Teppichen. Das Preis-Leistungs-Wunder für automatische Reinigung.`,
    shortDesc: 'Intelligenter Saugroboter mit LiDAR und 4000 Pa Saugkraft',
    features: ['4000 Pa Saugkraft', 'LiDAR-Navigation', 'Wischfunktion', 'App & Sprachsteuerung', 'Teppich-Erkennung'],
    specs: [
      { key: 'Saugkraft', value: '4000 Pa' },
      { key: 'Navigation', value: 'LiDAR' },
      { key: 'Laufzeit', value: 'Bis zu 180 Minuten' },
      { key: 'Wasserbehälter', value: '200 ml' },
      { key: 'Gewicht', value: '3,6 kg' },
      { key: 'Farbe', value: 'Weiß' },
    ],
  },
];

async function main() {
  console.log(`\nMise à jour de ${updates.length} produits Reinigung...\n`);

  let updated = 0;
  let errors = 0;

  for (const data of updates) {
    try {
      const product = await prisma.product.findFirst({
        where: { slug: data.slug }
      });

      if (!product) {
        console.log(`❌ Produit non trouvé: ${data.slug}`);
        errors++;
        continue;
      }

      await prisma.productSpec.deleteMany({
        where: { productId: product.id }
      });

      await prisma.product.update({
        where: { id: product.id },
        data: {
          description: data.description,
          shortDesc: data.shortDesc,
          features: data.features,
        }
      });

      for (let i = 0; i < data.specs.length; i++) {
        const spec = data.specs[i];
        await prisma.productSpec.create({
          data: {
            productId: product.id,
            key: spec.key,
            value: spec.value,
            position: i,
          }
        });
      }

      console.log(`✅ ${data.slug} — description + ${data.specs.length} specs`);
      updated++;
    } catch (error: any) {
      console.log(`❌ ${data.slug} — Erreur: ${error.message}`);
      errors++;
    }
  }

  console.log(`\n📊 Résumé: ${updated} mis à jour, ${errors} erreurs`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
