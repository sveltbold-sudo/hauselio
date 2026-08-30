import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const updates = [
  {
    slug: 'bosch-serie2-waschmaschine-wgg244z01',
    description: `Die Bosch Serie 2 Waschmaschine WGG244Z01 ist eine kompakte Waschmaschine mit i-DOS-Technologie. Die i-DOS-Technologie dosiert Waschmittel automatisch präzise. Die 9 kg Kapazität eignet sich für mittlere Haushalte. Die 1400 U/min Schleuderung sorgt für optimale Ergebnisse. Das A+++ Energiesiegel sorgt für Energieeffizienz. Die varioSpeed-Funktion verkürzt die Waschzeit. Die Home-Connect-App ermöglicht die Fernbedienung. Perfekt für automatisches Waschen.`,
    shortDesc: 'Bosch-Kompakt-Waschmaschine mit i-DOS und 9 kg Kapazität',
    features: ['i-DOS-Automatikdosierung', '9 kg Kapazität', '1400 U/min', 'A+++ Energiesiegel', 'Home Connect App'],
    specs: [
      { key: 'Kapazität', value: '9 kg' },
      { key: 'Schleuderdrehzahl', value: '1400 U/min' },
      { key: 'Energieklasse', value: 'A+++' },
      { key: 'Dosierung', value: 'i-DOS' },
      { key: 'Programme', value: '14' },
      { key: 'Abmessungen', value: '60 x 85 x 60 cm' },
    ],
  },
  {
    slug: 'dyson-big-quiet-formaldehyde-n475',
    description: `Der Dyson Big Quiet Formaldehyde N475 ist ein leistungsstarker kabelloser Akkusauger mit Formaldehyd-Sensor. Die开学-Funktion zerstört Formaldehyd kontinuierlich. Die 261 AW Saugleistung entfernt Staub und Schmutz gründlich. Die HEPA-Filterung fängt 99,99% der Allergene ab. Die 60 Minuten Laufzeit reicht für große Reinigungen. Das LCD-Display zeigt Echtzeitdaten über die Reinigung. Das absolute Flaggschiff für saubere Luft und makellose Sauberkeit.`,
    shortDesc: 'Dyson-Flaggschiff mit Formaldehyd-Sensor und 261 AW Saugleistung',
    features: ['Formaldehyd-Sensor', '261 AW Saugleistung', 'HEPA-Filter', '60 Min. Laufzeit', 'LCD-Display'],
    specs: [
      { key: 'Leistung', value: '261 AW' },
      { key: 'Filter', value: 'HEPA (99,99%)' },
      { key: 'Laufzeit', value: 'Bis zu 60 Minuten' },
      { key: 'Besonderheit', value: 'Formaldehyd-Sensor' },
      { key: 'Gewicht', value: '3,5 kg' },
      { key: 'Farbe', value: 'Nickel/Gelb' },
    ],
  },
  {
    slug: 'klarstein-fresh-breeze-xl',
    description: `Der Klarstein Fresh Breeze XL ist ein tragbarer Luftkühler für große Räume. Die 14000 BTU Kühlleistung kühlt Räume bis zu 30 m². Die 3 Kühlstufen bieten individuelle Einstellungen. Die Luftentfeuchtungsfunktion reduziert die Luftfeuchtigkeit. Die Fernbedienung ermöglicht bequeme Steuerung. Das kompakte Design mit Rollen ermöglicht einfache Bewegung. Die_Timer-Funktion ermöglicht automatisches Ein- und Ausschalten. Perfekt für große Räume und Büros.`,
    shortDesc: 'Tragbarer Luftkühler mit 14000 BTU für große Räume',
    features: ['14000 BTU Kühlleistung', '3 Kühlstufen', 'Luftentfeuchtung', 'Fernbedienung', 'Tragbar mit Rollen'],
    specs: [
      { key: 'Kühlleistung', value: '14000 BTU' },
      { key: 'Raumgröße', value: 'Bis zu 30 m²' },
      { key: 'Funktionen', value: 'Kühlen, Entfeuchten, Lüften' },
      { key: 'Lautstärke', value: '56 dB(A)' },
      { key: 'Farbe', value: 'Weiß' },
    ],
  },
  {
    slug: 'klarstein-skyscraper-ice',
    description: `Der Klarstein Skyscraper Ice ist ein eleganter Raumkühler mit ionisierter Luft. Die 9000 BTU Kühlleistung kühlt Räume bis zu 20 m². Die 3 Kühlstufen bieten individuelle Einstellungen. Die Ionisierungsfunktion reinigt die Luft. Die Fernbedienung ermöglicht bequeme Steuerung. Das schlanke Turm-Design passt in jede Raumgestaltung. Die_Timer-Funktion ermöglicht automatisches Ein- und Ausschalten. Perfekt für moderne Wohnungen.`,
    shortDesc: 'Eleganter Turm-Raumkühler mit 9000 BTU und Ionisierung',
    features: ['9000 BTU Kühlleistung', 'Ionisierungsfunktion', '3 Kühlstufen', 'Turm-Design', 'Fernbedienung'],
    specs: [
      { key: 'Kühlleistung', value: '9000 BTU' },
      { key: 'Raumgröße', value: 'Bis zu 20 m²' },
      { key: 'Funktionen', value: 'Kühlen, Entfeuchten, Ionisieren' },
      { key: 'Lautstärke', value: '54 dB(A)' },
      { key: 'Farbe', value: 'Weiß/Schwarz' },
    ],
  },
  {
    slug: 'moulinex-easy-fry-max-fx9029',
    description: `Die Moulinex Easy Fry Max FX9029 ist ein kompakter Heißluft-Fritteuse für kleine Portionen. Die 4,1 Liter Kapazität eignet sich für kleine bis mittlere Haushalte. Die 8 Funktionen bieten Vielseitigkeit für jeden Tag. Die schnelle Erhitzung spart Zeit und Energie. Die abnehmbaren Teile sind spülmaschinenfest. Die integrierte Timer-Funktion ermöglicht automatisches Garen. Das elegante Design passt in jede Küche. Perfekt für gesundes Garen ohne viel Fett.`,
    shortDesc: 'Kompakte Moulinex-Heißluft-Fritteuse mit 4,1L und 8 Funktionen',
    features: ['4,1 Liter Kapazität', '8 Funktionen', 'Schnelle Erhitzung', 'Timer-Funktion', 'Spülmaschinenfeste Teile'],
    specs: [
      { key: 'Kapazität', value: '4,1 Liter' },
      { key: 'Funktionen', value: '8' },
      { key: 'Leistung', value: '1500 Watt' },
      { key: 'Temperaturbereich', value: '80-200°C' },
      { key: 'Farbe', value: 'Schwarz' },
    ],
  },
  {
    slug: 'samsung-family-hub-bespoke-rb38b7735s9',
    description: `Der Samsung Family Hub Bespoke RB38B7735S9 ist ein Premium-Kühlschrank mit Family-Hub-Technologie. Die Family-Hub-Technologie macht den Kühlschrank zum digitalen Herzstück. Die Twin Cooling Plus-Technologie hält Lebensmittel besonders frisch. Die 385 Liter Volumen bietet ausreichend Platz. Die interne Kamera zeigt den Inhalt des Kühlschranks auf dem Smartphone. Das Bespoke-Design in verschiedenen Farben passt zu jeder Kücheneinrichtung. Perfekt für vernetzte Küchen.`,
    shortDesc: 'Samsung-Premium-Kühlschrank mit Family Hub und Bespoke-Design',
    features: ['Family Hub', 'Twin Cooling Plus', '385 Liter Volumen', 'Interne Kamera', 'Bespoke-Design'],
    specs: [
      { key: 'Volumen', value: '385 Liter' },
      { key: 'Kühltechnologie', value: 'Twin Cooling Plus' },
      { key: 'Design', value: 'Bespoke' },
      { key: 'Steuerung', value: 'Family Hub Display' },
      { key: 'Abmessungen', value: '60 x 185 x 65 cm' },
    ],
  },
];

async function main() {
  console.log(`\nMise à jour de ${updates.length} produits restants...\n`);

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
