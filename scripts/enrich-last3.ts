import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const updates = [
  {
    slug: 'cosori-lite-airfryer-28l',
    description: `Die Cosori Lite Airfryer 28L ist ein großer Heißluft-Fritteuse mit XL-Kapazität. Die 28 Liter Kapazität eignet sich für große Familien und Mahlzeiten. Die 11 Funktionen bieten maximale Vielseitigkeit für jeden Tag. Die schnelle Erhitzung spart Zeit und Energie. Die abnehmbaren Teile sind spülmaschinenfest. Die integrierte Timer-Funktion ermöglicht automatisches Garen. Das elegante Design passt in jede Küche. Perfekt für gesundes Garen mit minimalem Fett.`,
    shortDesc: 'Großer Heißluft-Fritteuse mit 28L und 11 Funktionen',
    features: ['28 Liter Kapazität', '11 Funktionen', 'Schnelle Erhitzung', 'Timer-Funktion', 'Spülmaschinenfeste Teile'],
    specs: [
      { key: 'Kapazität', value: '28 Liter' },
      { key: 'Funktionen', value: '11' },
      { key: 'Leistung', value: '1800 Watt' },
      { key: 'Temperaturbereich', value: '40-230°C' },
      { key: 'Farbe', value: 'Schwarz' },
    ],
  },
  {
    slug: 'aeg-bpe842720m-backofen',
    description: `Der AEG BPE842720M Backofen ist ein Premium-Einbau-Backofen mit SteamBoost-Technologie. Die SteamBoost-Funktion sorgt für saftiges Backen mit optimaler Feuchtigkeit. Die 8 Backfunktionen bieten Vielseitigkeit für jedes Backgerät. Die pyrolytische Selbstreinigung reinigt den Ofen automatisch. Das TFT-Touchdisplay ermöglicht intuitive Bedienung. Die Soft-Close-Tür sorgt für sanftes Schließen. Die LED-Beleuchtung sorgt für optimale Sicht. Das Premium-Modell für anspruchsvolle Bäcker.`,
    shortDesc: 'AEG-Premium-Backofen mit SteamBoost und Pyrolyse',
    features: ['SteamBoost-Technologie', '8 Backfunktionen', 'Pyrolyse-Selbstreinigung', 'TFT-Touchdisplay', 'Soft-Close-Tür'],
    specs: [
      { key: 'Funktionen', value: '8 Backfunktionen' },
      { key: 'Technologie', value: 'SteamBoost' },
      { key: 'Backofenvolumen', value: '77 Liter' },
      { key: 'Reinigung', value: 'Pyrolyse' },
      { key: 'Steuerung', value: 'TFT-Touchdisplay' },
      { key: 'Breite', value: '60 cm' },
      { key: 'Energieklasse', value: 'A' },
    ],
  },
  {
    slug: 'cosori-pro2-airfryer-l501',
    description: `Die Cosori Pro2 Airfryer L501 ist ein leistungsstarker Heißluft-Fritteuse mit XL-Kapazität. Die 5,5 Liter Kapazität eignet sich für mittlere bis große Portionen. Die 13 Funktionen bieten maximale Vielseitigkeit für jeden Tag. Die schnelle Erhitzung spart Zeit und Energie. Die abnehmbaren Teile sind spülmaschinenfest. Die integrierte Timer-Funktion ermöglicht automatisches Garen. Das elegante Design passt in jede Küche. Perfekt für gesundes Garen mit minimalem Fett.`,
    shortDesc: 'Leistungsstarker Heißluft-Fritteuse mit 5,5L und 13 Funktionen',
    features: ['5,5 Liter Kapazität', '13 Funktionen', 'Schnelle Erhitzung', 'Timer-Funktion', 'Spülmaschinenfeste Teile'],
    specs: [
      { key: 'Kapazität', value: '5,5 Liter' },
      { key: 'Funktionen', value: '13' },
      { key: 'Leistung', value: '1700 Watt' },
      { key: 'Temperaturbereich', value: '75-230°C' },
      { key: 'Farbe', value: 'Schwarz' },
    ],
  },
];

async function main() {
  console.log(`\nMise à jour de ${updates.length} produits restants...\n`);

  for (const data of updates) {
    try {
      const product = await prisma.product.findFirst({
        where: { slug: data.slug }
      });

      if (!product) {
        console.log(`❌ Produit non trouvé: ${data.slug}`);
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
    } catch (error: any) {
      console.log(`❌ ${data.slug} — Erreur: ${error.message}`);
    }
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
