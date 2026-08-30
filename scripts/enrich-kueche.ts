import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const updates = [
  // === HANDMIXER (16) ===
  {
    slug: 'aeg-hm-400-handmixer',
    description: `Der AEG HM 400 Handmixer überzeugt mit 5 Geschwindigkeitsstufen und einem Turbo-Boost für maximale Leistung. Das leistungsstarke 400-Watt-Motor sorgt für gleichmäßiges Vermischen von Teigen und Cremes. Der ergonomische Griff liegt dank Softgrip-Beschichtung besonders gut in der Hand. Die mitgelieferten Knethaken und Schneebesen aus Edelstahl sind spülmaschinenfest. Das Leichtgewicht von nur 0,9 kg macht auch längere Küchenarbeiten zur Freude. Die simplen Drucktasten ermöglichen eine intuitive Bedienung. Perfekt für den täglichen Gebrauch in der Küche.`,
    shortDesc: 'Leichter Handmixer mit 5 Geschwindigkeiten und Turbo-Boost',
    features: ['5 Geschwindigkeitsstufen + Turbo', '400 Watt Motor', 'Softgrip-Griff', 'Spülmaschinenfeste Aufsätze', 'Nur 0,9 kg leicht'],
    specs: [
      { key: 'Leistung', value: '400 Watt' },
      { key: 'Geschwindigkeiten', value: '5 + Turbo' },
      { key: 'Gewicht', value: '0,9 kg' },
      { key: 'Aufsätze', value: '2 Knethaken, 2 Schneebesen' },
      { key: 'Material', value: 'Edelstahl-Aufsätze, Kunststoff-Gehäuse' },
      { key: 'Farbe', value: 'Weiß' },
    ],
  },
  {
    slug: 'black-decker-600w-handmixer',
    description: `Der Black+Decker 600W Handmixer ist ein leistungsstarker Helfer für alle Küchenarbeiten. Mit 6 Geschwindigkeitsstufen und einem leistungsstarken 600-Watt-Motor bewältigt er selbst schwere Teige mühelos. Die 5 Aufsätze aus Edelstahl – 2 Knethaken, 2 Schneebesen und 1 Kartoffelstab – bieten maximale Vielseitigkeit. Der ergonomische Griff sorgt für sicheren Halt. Die simplen Drucktasten ermöglichen eine intuitive Bedienung. Die Einzelhand- und Aufbewahrungsfunktion macht die Arbeit besonders komfortabel. Perfekt für alle, die Wert auf Leistung und Vielseitigkeit legen.`,
    shortDesc: 'Leistungsstarker Handmixer mit 600W und 5 Edelstahl-Aufsätzen',
    features: ['600 Watt Motor', '6 Geschwindigkeiten', '5 Edelstahl-Aufsätze inkl. Kartoffelstab', 'Ergonomischer Griff', 'Aufbewahrungsfunktion'],
    specs: [
      { key: 'Leistung', value: '600 Watt' },
      { key: 'Geschwindigkeiten', value: '6 Stufen' },
      { key: 'Aufsätze', value: '2 Knethaken, 2 Schneebesen, 1 Kartoffelstab' },
      { key: 'Material', value: 'Edelstahl-Aufsätze' },
      { key: 'Farbe', value: 'Weiß/Orange' },
    ],
  },
  {
    slug: 'bosch-mfq3540-handmixer',
    description: `Der Bosch MFQ 3540 Handmixer überzeugt mit 450 Watt Leistung und 5 Geschwindigkeitsstufen. Das ergonomische Leichtgewicht von nur 1,1 kg macht auch längere Küchenarbeiten zur Freude. Die rotierenden Knethaken aus Edelstahl sorgen für gleichmäßiges Vermischen. Der praktische Schnellwechselaufsatz ermöglicht einen schnellen Wechsel zwischen den Aufsätzen. Die mitgelieferten Aufätze – 2 Knethaken und 2 Schneebesen – sind spülmaschinenfest. Die Einhand-Auswurftaste erleichtert die Reinigung. Die simplen Drucktasten ermöglichen eine intuitive Bedienung. Ein zuverlässiger Helfer für jeden Tag.`,
    shortDesc: 'Ergonomischer Handmixer mit 450W und Schnellwechselaufsatz',
    features: ['450 Watt Motor', '5 Geschwindigkeiten', 'Schnellwechselaufsatz', 'Spülmaschinenfeste Aufsätze', 'Nur 1,1 kg leicht'],
    specs: [
      { key: 'Leistung', value: '450 Watt' },
      { key: 'Geschwindigkeiten', value: '5 Stufen' },
      { key: 'Aufsätze', value: '2 Knethaken, 2 Schneebesen' },
      { key: 'Material', value: 'Edelstahl-Aufsätze' },
      { key: 'Farbe', value: 'Weiß' },
    ],
  },
  {
    slug: 'braun-mq7-multiquick-handmixer',
    description: `Der Braun MultiQuick 7 Handmixer bietet 600 Watt Leistung und das innovative PowerBell-System für optimale Ergebnisse. Die 5 Geschwindigkeitsstufen und der Turbo-Boost ermöglichen individuelle Einstellungen. Das einzigartige PowerBell sorgt für gleichmäßiges Mischen ohne Spritzer. Die EasyClick-Aufsätze lassen sich mit einem Klick wechseln. Die mitgelieferten Aufätze aus Edelstahl sind spülmaschinenfest. Der ergonomische Softgrip-Griff sorgt für sicheren Halt. Das kompakte Design lässt sich platzsparend aufbewahren. Ein Premium-Handmixer für anspruchsvolle Hobby-Köche.`,
    shortDesc: 'Premium-Handmixer mit PowerBell-System und 600W',
    features: ['PowerBell-System', '600 Watt Motor', '5 Geschwindigkeiten + Turbo', 'EasyClick-Aufätze', 'Softgrip-Griff'],
    specs: [
      { key: 'Leistung', value: '600 Watt' },
      { key: 'Geschwindigkeiten', value: '5 + Turbo' },
      { key: 'Aufsätze', value: 'PowerBell Schneebesen, Knethaken' },
      { key: 'Material', value: 'Edelstahl-Aufsätze' },
      { key: 'Farbe', value: 'Weiß' },
    ],
  },
  {
    slug: 'bosch-mums2ew48-kuechenmaschine',
    description: `Die Bosch MUMS2EW48 Küchenmaschine ist ein vielseitiges Multitalent mit 1200 Watt Leistung. Das planetarische Mischsystem sorgt für gleichmäßige Ergebnisse bei Teig, Creme und Sahne. Die 4 Geschwindigkeitsstufen und der Puls-Modus ermöglichen individuelle Einstellungen. Die mitgelieferten Aufätze – Knethaken, Schneebesen, Kneter – bieten maximale Vielseitigkeit. Der abnehmbare 3,9-Liter-Rüssel ist spülmaschinenfeste. Das elegante Design in Weiß passt zu jeder Kücheneinrichtung. Die integrierte Übersetzungsmechanik sorgt für leisen Betrieb. Perfekt für alle, die eine zuverlässige Küchenmaschine suchen.`,
    shortDesc: '1200W-Küchenmaschine mit planetarischem Mischsystem und 3,9L-Rüssel',
    features: ['1200 Watt Motor', 'Planetarisches Mischsystem', '4 Geschwindigkeiten + Puls', '3,9 Liter Rüssel', 'Leise Übersetzungsmechanik'],
    specs: [
      { key: 'Leistung', value: '1200 Watt' },
      { key: 'Rüsselvolumen', value: '3,9 Liter' },
      { key: 'Geschwindigkeiten', value: '4 + Puls' },
      { key: 'Mischsystem', value: 'Planetarisch' },
      { key: 'Aufsätze', value: 'Knethaken, Schneebesen, Kneter' },
      { key: 'Farbe', value: 'Weiß' },
    ],
  },
  {
    slug: 'bosch-serie-6-herd-hkh634es5',
    description: `Der Bosch Serie 6 herd HKH634ES5 ist ein freistehender Ceran-Herd mit Induktionskochfeld und Backofen. Das Induktionskochfeld mit 4 Kochfeldern bietet schnelles und energieeffizientes Kochen. Die Induktion-Technologie erhitzt das Kochgeschirr direkt für präzise Temperaturregelung. Der multifunktionale Backofen bietet 8 Funktionen inkl. Heißluft und Ober-/Unterhitze. Die elektrische Zündung und das integré Tempschner ermöglichen komfortables Kochen. Die ceranische Kochfläche ist leicht zu reinigen. Das 60-cm-Format passt in jede Küchenzeile. Ein zuverlässiges Küchengerät für den täglichen Gebrauch.`,
    shortDesc: 'Freistehender Induktionsherd mit 4 Kochfeldern und multifunktionalem Backofen',
    features: ['Induktionskochfeld', '4 Kochfelder', '8 Backofenfunktionen', 'Elektrische Zündung', 'Ceranische Kochfläche'],
    specs: [
      { key: 'Kochfeld', value: 'Induktion, 4 Felder' },
      { key: 'Backofen', value: 'Multifunktional, 8 Funktionen' },
      { key: 'Backofenvolumen', value: '66 Liter' },
      { key: 'Energieklasse', value: 'A' },
      { key: 'Breite', value: '60 cm' },
      { key: 'Farbe', value: 'Edelstahl/Schwarz' },
    ],
  },
  {
    slug: 'bosch-serie6-induktionskochfeld-pci611bb5e',
    description: `Das Bosch Serie 6 Induktionskochfeld PCI611BB5E bietet 4 Induktionskochfelder mit flexiblem Kochbereich. Die FlexInduction-Technologie ermöglicht die Kombination von Kochfeldern für große Kochgeschirre. Die PowerBoost-Funktion sorgt für schnelles Aufkochen. Das PerfectFry-Sensorkochfeld regelt die Temperatur automatisch. Die intuitive LED-Steuerung mit Schieberegler ermöglicht präzise Einstellungen. Die Scheibenkeramik-Oberfläche ist leicht zu reinigen. Das 60-cm-Design passt in jede moderne Küchenzeile. Ein Premium-Kochfeld für anspruchsvolle Köche.`,
    shortDesc: 'Induktionskochfeld mit FlexInduction und PerfectFry-Sensor',
    features: ['FlexInduction', 'PowerBoost', 'PerfectFry-Sensorkochfeld', 'LED-Schieberegler', '60 cm Einbaubereite'],
    specs: [
      { key: 'Kochfelder', value: '4 Induktionskochfelder' },
      { key: 'Technologie', value: 'FlexInduction' },
      { key: 'Funktionen', value: 'PowerBoost, PerfectFry' },
      { key: 'Steuerung', value: 'LED-Schieberegler' },
      { key: 'Breite', value: '60 cm' },
      { key: 'Farbe', value: 'Schwarz' },
    ],
  },
  {
    slug: 'bosch-serie8-backofen-hbg8780b1',
    description: `Der Bosch Serie 8 Backofen HBG8780B1 ist ein einbau-würdiger Backofen mit 14 Funktionen. Die 3D-Heißluft-Verteilung sorgt für gleichmäßiges Backen auf allen Ebenen. Das Large-Account-Display mit TFT-Touchdisplay ermöglicht intuitive Bedienung. Die Home-Connect-App ermöglicht die Fernbedienung per Smartphone. Die SelfCleaning-Funktion reinigt den Ofen automatisch pyrolytisch. Die SoftOpen- und SoftClose-Tür sorgt für sanftes Öffnen und Schließen. Die Beleuchtung mit LED-Technik sorgt für optimale Sicht. Ein Premium-Backofen für anspruchsvolle Bäcker.`,
    shortDesc: 'Premium-Einbau-Backofen mit 14 Funktionen, Home Connect und Pyrolyse',
    features: ['3D-Heißluft', '14 Backfunktionen', 'Home Connect App', 'SelfCleaning Pyrolyse', 'TFT-Touchdisplay'],
    specs: [
      { key: 'Funktionen', value: '14 Backfunktionen' },
      { key: 'Backofenvolumen', value: '71 Liter' },
      { key: 'Technologie', value: '3D-Heißluft' },
      { key: 'Reinigung', value: 'Pyrolyse SelfCleaning' },
      { key: 'Steuerung', value: 'TFT-Touchdisplay' },
      { key: 'Breite', value: '60 cm' },
      { key: 'Energieklasse', value: 'A' },
    ],
  },
  {
    slug: 'electrolux-assist-9-handmixer',
    description: `Der Electrolux Assist 9 Handmixer bietet 900 Watt Leistung für professionelle Ergebnisse. Die variable Geschwindigkeitsregelung mit Turbo-Boost ermöglicht individuelle Einstellungen. Die ergonomische Form und das geringe Gewicht sorgen für komfortables Arbeiten. Die mitgelieferten Edelstahl-Aufätze – 2 Knethaken und 2 Schneebesen – sind spülmaschinenfest. Die Easy-Click-Aufnahme ermöglicht schnellen Wechsel der Aufsätze. Das elegante Design in Schwarz passt zu jeder Kücheneinrichtung. Ein leistungsstarker Helfer für anspruchsvolle Küchenarbeiten.`,
    shortDesc: 'Leistungsstarker 900W-Handmixer mit variabler Geschwindigkeitsregelung',
    features: ['900 Watt Motor', 'Variable Geschwindigkeitsregelung', 'Turbo-Boost', 'Easy-Click-Aufnahme', 'Edelstahl-Aufsätze'],
    specs: [
      { key: 'Leistung', value: '900 Watt' },
      { key: 'Geschwindigkeiten', value: 'Variabel + Turbo' },
      { key: 'Aufsätze', value: '2 Knethaken, 2 Schneebesen' },
      { key: 'Material', value: 'Edelstahl-Aufsätze' },
      { key: 'Farbe', value: 'Schwarz' },
    ],
  },
  {
    slug: 'electrolux-oeo7gknw-backofen',
    description: `Der Electrolux OEO7GKNW Backofen ist ein einbau-würdiger Backofen mit SteamBoost-Technologie. Die SteamBoost-Funktion sorgt für saftiges Backen mit optimaler Feuchtigkeit. Die 5 Backfunktionen inklusive Heißluft bieten Vielseitigkeit. Die Soft-Close-Tür sorgt für sanftes Schließen. Die LED-Beleuchtung sorgt für optimale Sicht auf die Backwaren. Die Easy-Clean-Beschichtung ermöglicht einfache Reinigung. Das 60-cm-Design passt in jede Küchenzeile. Ein zuverlässiger Backofen für jeden Tag.`,
    shortDesc: 'Einbau-Backofen mit SteamBoost und 5 Backfunktionen',
    features: ['SteamBoost-Technologie', '5 Backfunktionen', 'Soft-Close-Tür', 'LED-Beleuchtung', 'Easy-Clean-Beschichtung'],
    specs: [
      { key: 'Funktionen', value: '5 Backfunktionen' },
      { key: 'Technologie', value: 'SteamBoost' },
      { key: 'Backofenvolumen', value: '72 Liter' },
      { key: 'Reinigung', value: 'Easy-Clean' },
      { key: 'Breite', value: '60 cm' },
      { key: 'Farbe', value: 'Weiß' },
    ],
  },
  {
    slug: 'gaggenau-vario-200-induktion',
    description: `Das Gaggenau Vario 200 Induktionskochfeld bietet 2 Kochfelder für flexibles Kochen. Die induktive Technologie sorgt für schnelles und energieeffizientes Arbeiten. Die PowerBoost-Funktion ermöglicht schnelles Aufkochen. Dieintuitive Bedienung über Berührungselemente ist einfach und komfortabel. Die scheibenkeramische Oberfläche ist leicht zu reinigen. Das elegante Design in Schwarz passt zu jeder modernen Kücheneinrichtung. Die perfekte Ergänzung für Gaggenau-Küchen. Ein Premium-Kochfeld für anspruchsvolle Köche.`,
    shortDesc: '2-Feld-Induktionskochfeld von Gaggenau mit PowerBoost',
    features: ['2 Induktionskochfelder', 'PowerBoost', 'Berührungselemente', 'Scheibenkeramik', 'Premium-Design'],
    specs: [
      { key: 'Kochfelder', value: '2 Induktionskochfelder' },
      { key: 'Technologie', value: 'Induktion' },
      { key: 'Funktionen', value: 'PowerBoost' },
      { key: 'Steuerung', value: 'Berührungselemente' },
      { key: 'Breite', value: '30 cm' },
      { key: 'Farbe', value: 'Schwarz' },
    ],
  },
  {
    slug: 'gaggenau-vario400-kochfeld-vig414',
    description: `Das Gaggenau Vario 400 Kochfeld VIG414 ist ein Premium-Induktionskochfeld mit 4 Kochfeldern. Die induktive Technologie sorgt für schnelles und energieeffizientes Arbeiten. Die PowerBoost-Funktion ermöglicht schnelles Aufkochen. Die intuitive Bedienung über Berührungselemente ist einfach und komfortabel. Die scheibenkeramische Oberfläche ist leicht zu reinigen. Das elegante Design in Schwarz passt zu jeder modernen Kücheneinrichtung. Die perfekte Ergänzung für Gaggenau-Küchen. Ein Premium-Kochfeld für anspruchsvolle Köche.`,
    shortDesc: 'Premium-4-Feld-Induktionskochfeld von Gaggenau mit PowerBoost',
    features: ['4 Induktionskochfelder', 'PowerBoost', 'Berührungselemente', 'Scheibenkeramik', 'Premium-Design'],
    specs: [
      { key: 'Kochfelder', value: '4 Induktionskochfelder' },
      { key: 'Technologie', value: 'Induktion' },
      { key: 'Funktionen', value: 'PowerBoost' },
      { key: 'Steuerung', value: 'Berührungselemente' },
      { key: 'Breite', value: '60 cm' },
      { key: 'Farbe', value: 'Schwarz' },
    ],
  },
  {
    slug: 'gastroback-advanced-dual-plus-40882',
    description: `Der Gastroback Advanced Dual Plus 40882 ist ein leistungsstarker Handmixer mit 2 Motoren. Die 2 unabhängigen Motoren bieten maximale Flexibilität beim Mischen. Die 6 Geschwindigkeitsstufen und 2 Turbo-Stufen ermöglichen individuelle Einstellungen. Die mitgelieferten Aufätze aus Edelstahl sind spülmaschinenfest. Der ergonomische Griff sorgt für sicheren Halt. Das kompakte Design lässt sich platzsparend aufbewahren. Perfekt für anspruchsvolle Küchenarbeiten.`,
    shortDesc: 'Dual-Motor-Handmixer mit 6 Geschwindigkeiten und 2 Turbo-Stufen',
    features: ['2 unabhängige Motoren', '6 Geschwindigkeiten + 2 Turbo', 'Edelstahl-Aufsätze', 'Ergonomischer Griff', 'Spülmaschinenfeste Teile'],
    specs: [
      { key: 'Leistung', value: '2 x 300 Watt' },
      { key: 'Geschwindigkeiten', value: '6 + 2 Turbo' },
      { key: 'Aufsätze', value: '2 Knethaken, 2 Schneebesen' },
      { key: 'Material', value: 'Edelstahl-Aufsätze' },
      { key: 'Farbe', value: 'Edelstahl' },
    ],
  },
  {
    slug: 'gastroback-advanced-espresso-42602',
    description: `Der Gastroback Advanced Espresso 42602 ist eine semi-automatische Espressomaschine mit 20 bar Druck. Die Edelstahl-Brühgruppe sorgt für gleichmäßige Extraktion. Der integrierte Milchaufschäumer erzeugt cremigen Milchschaum. Die 2 separaten Heizsysteme ermöglichen gleichzeitiges Brühen und Aufschäumen. Die Edelstahl-Tasse wärmt die Tasse vor. Das kompakte Design passt in jede Küche. Perfekt für Einsteiger, die Espresso-Genuss im Profi-Format suchen.`,
    shortDesc: 'Semi-automatische Espressomaschine mit 20 bar und 2 Heizsystemen',
    features: ['20 bar Brühdruck', '2 separate Heizsysteme', 'Integrierter Milchaufschäumer', 'Edelstahl-Brühgruppe', 'Tassenwärmer'],
    specs: [
      { key: 'Brühdruck', value: '20 bar' },
      { key: 'Heizsystem', value: '2 separates Thermoblock' },
      { key: 'Milchaufschäumer', value: 'Integriert' },
      { key: 'Wasserkapazität', value: '1,8 Liter' },
      { key: 'Leistung', value: '1450 Watt' },
      { key: 'Farbe', value: 'Edelstahl' },
    ],
  },
  {
    slug: 'gastroback-design-espresso-42603',
    description: `Der Gastroback Design Espresso 42603 ist eine elegante Espressomaschine mit 15 bar Bruck. Die Edelstahl-Brühgruppe sorgt für gleichmäßige Extraktion. Der integrierte Milchaufschäumer erzeugt cremigen Milchschaum. Die einfache Ein-Tassen- und Zwei-Tassen-Brühung ermöglicht individuelle Zubereitung. Die Edelstahl-Tasse wärmt die Tasse vor. Das elegante Design in Schwarz und Edelstahl passt zu jeder Kücheneinrichtung. Perfekt für alle, die Espresso-Genuss im stilvollen Design suchen.`,
    shortDesc: 'Elegante Espressomaschine mit 15 bar und integriertem Milchaufschäumer',
    features: ['15 bar Brühdruck', 'Integrierter Milchaufschäumer', 'Ein- und Zwei-Tassen-Brühung', 'Tassenwärmer', 'Edelstahl-Design'],
    specs: [
      { key: 'Brühdruck', value: '15 bar' },
      { key: 'Milchaufschäumer', value: 'Integriert' },
      { key: 'Wasserkapazität', value: '1,5 Liter' },
      { key: 'Leistung', value: '1350 Watt' },
      { key: 'Farbe', value: 'Schwarz/Edelstahl' },
    ],
  },
  {
    slug: 'gastroback-design-pro-42621',
    description: `Der Gastroback Design Pro 42621 ist eine professionelle Espressomaschine mit 20 bar Druck. Die Edelstahl-Brühgruppe im 58mm-Format sorgt für gleichmäßige Extraktion. Der Crona-Milchaufschäumer erzeugt cremigen Mikroschaum. Die 2 separaten Heizsysteme ermöglichen gleichzeitiges Brühen und Aufschäumen. Die digitale Anzeige zeigt Temperatur und Brühzeit an. Das elegante Design in Edelstahl unterstreicht den Premium-Anspruch. Perfekt für anspruchsvolle Espresso-Liebhaber.`,
    shortDesc: 'Professionelle Espressomaschine mit 58mm-Brühgruppe und 2 Heizsystemen',
    features: ['20 bar Brühdruck', '58mm Edelstahl-Brühgruppe', '2 separate Heizsysteme', 'Crona-Milchaufschäumer', 'Digitale Anzeige'],
    specs: [
      { key: 'Brühdruck', value: '20 bar' },
      { key: 'Brühgruppe', value: '58mm Edelstahl' },
      { key: 'Heizsystem', value: '2 separates Thermoblock' },
      { key: 'Milchaufschäumer', value: 'Crona' },
      { key: 'Wasserkapazität', value: '2,0 Liter' },
      { key: 'Leistung', value: '1600 Watt' },
      { key: 'Farbe', value: 'Edelstahl' },
    ],
  },
  {
    slug: 'kenwood-chef-xl-elite-kvl6325s',
    description: `Die Kenwood Chef XL Elite KVL6325S ist eine Premium-Küchenmaschine mit 1700 Watt Leistung. Das planetarische Mischsystem sorgt für gleichmäßige Ergebnisse. Die 8 Geschwindigkeitsstufen und der Pulsbetrieb ermöglichen individuelle Einstellungen. Die mitgelieferten Aufätze – Knethaken, Schneebesen, Kartoffelstab – bieten maximale Vielseitigkeit. Der abnehmbare 6,7-Liter-Rüssel ist spülmaschinenfeste. Die LED-Anzeige zeigt Geschwindigkeit und Timer an. Das elegante Design in Rot passt zu jeder Kücheneinrichtung. Ein Premium-Küchenhelfer für anspruchsvolle Hobby-Köche.`,
    shortDesc: 'Premium-Küchenmaschine mit 1700W und 6,7L-Rüssel',
    features: ['1700 Watt Motor', 'Planetarisches Mischsystem', '8 Geschwindigkeiten', '6,7 Liter Rüssel', 'LED-Anzeige'],
    specs: [
      { key: 'Leistung', value: '1700 Watt' },
      { key: 'Rüsselvolumen', value: '6,7 Liter' },
      { key: 'Geschwindigkeiten', value: '8 + Puls' },
      { key: 'Mischsystem', value: 'Planetarisch' },
      { key: 'Aufätze', value: 'Knethaken, Schneebesen, Kartoffelstab' },
      { key: 'Farbe', value: 'Rot' },
    ],
  },
  {
    slug: 'kenwood-hm430-handmixer',
    description: `Der Kenwood HM 430 Handmixer bietet 450 Watt Leistung und 5 Geschwindigkeitsstufen. Das ergonomische Design und das geringe Gewicht sorgen für komfortables Arbeiten. Die mitgelieferten Edelstahl-Aufsätze – 2 Knethaken und 2 Schneebesen – sind spülmaschinenfest. Der Turbo-Boost sorgt für maximale Leistung. Die Einzelhand-Auswurftaste erleichtert die Reinigung. Das elegante Design in Weiß passt zu jeder Kücheneinrichtung. Ein zuverlässiger Helfer für den täglichen Gebrauch.`,
    shortDesc: 'Komfortabler Handmixer mit 450W und 5 Geschwindigkeiten',
    features: ['450 Watt Motor', '5 Geschwindigkeiten', 'Turbo-Boost', 'Edelstahl-Aufsätze', 'Spülmaschinenfeste Teile'],
    specs: [
      { key: 'Leistung', value: '450 Watt' },
      { key: 'Geschwindigkeiten', value: '5 Stufen' },
      { key: 'Aufsätze', value: '2 Knethaken, 2 Schneebesen' },
      { key: 'Material', value: 'Edelstahl-Aufsätze' },
      { key: 'Farbe', value: 'Weiß' },
    ],
  },
  {
    slug: 'kitchenaid-artisan-5khb25ay-handmixer',
    description: `Der KitchenAid Artisan 5KHB25AY Handmixer ist ein Premium-Handmixer im ikonischen KitchenAid-Design. Die 9 Geschwindigkeitsstufen und der Boost-Modus ermöglichen individuelle Einstellungen. Die Soft-Start-Funktion verhindert Spritzer beim Einschalten. Die ergonomische Form und das geringe Gewicht sorgen für komfortables Arbeiten. Die mitgelieferten Edelstahl-Aufsätze sind spülmaschinenfest. Das elegante Design in verschiedenen Farben passt zu jeder Kücheneinrichtung. Ein Premium-Handmixer für anspruchsvolle Küchenarbeiten.`,
    shortDesc: 'Ikonischer KitchenAid-Handmixer mit 9 Geschwindigkeiten und Soft-Start',
    features: ['9 Geschwindigkeiten + Boost', 'Soft-Start-Funktion', 'Ergonomisches Design', 'Edelstahl-Aufsätze', 'Verschiedene Farben'],
    specs: [
      { key: 'Leistung', value: '85 Watt' },
      { key: 'Geschwindigkeiten', value: '9 + Boost' },
      { key: 'Aufsätze', value: '2 Knethaken, 2 Schneebesen' },
      { key: 'Material', value: 'Edelstahl-Aufsätze' },
      { key: 'Farbe', value: 'Verschiedene Farben' },
    ],
  },
  {
    slug: 'kitchenaid-artisan-5ksm175pse',
    description: `Die KitchenAid Artisan 5KSM175PSE ist eine Premium-Küchenmaschine im ikonischen Design. Das planetarische Mischsystem sorgt für gleichmäßige Ergebnisse. Die 10 Geschwindigkeitsstufen und der Pulsbetrieb ermöglichen individuelle Einstellungen. Die mitgelieferten Aufätze – Knethaken, Schneebesen, Kneter – bieten maximale Vielseitigkeit. Der abnehmbare 4,8-Liter-Rüssel aus Edelstahl ist spülmaschinenfeste. Das elegante Design in verschiedenen Farben passt zu jeder Kücheneinrichtung. Die integrierte Schnittgeschwindigkeit sorgt für optimale Ergebnisse. Eine ikonische Küchenmaschine für anspruchsvolle Hobby-Köche.`,
    shortDesc: 'Ikonische KitchenAid-Küchenmaschine mit planetarischem Mischsystem',
    features: ['Planetarisches Mischsystem', '10 Geschwindigkeiten', '4,8 Liter Rüssel', '3 Aufsätze inkludiert', 'Ikonisches Design'],
    specs: [
      { key: 'Leistung', value: '300 Watt' },
      { key: 'Rüsselvolumen', value: '4,8 Liter' },
      { key: 'Geschwindigkeiten', value: '10 + Puls' },
      { key: 'Mischsystem', value: 'Planetarisch' },
      { key: 'Aufätze', value: 'Knethaken, Schneebesen, Kneter' },
      { key: 'Farbe', value: 'Verschiedene Farben' },
    ],
  },
  {
    slug: 'kitchenaid-artisan-mini-5ksm33',
    description: `Die KitchenAid Artisan Mini 5KSM33 ist die kompakte Variante der ikonischen KitchenAid-Küchenmaschine. Das planetarische Mischsystem sorgt für gleichmäßige Ergebnisse. Die 10 Geschwindigkeitsstufen und der Pulsbetrieb ermöglichen individuelle Einstellungen. Die mitgelieferten Aufätze – Knethaken, Schneebesen – bieten maximale Vielseitigkeit. Der abnehmbare 3,3-Liter-Rüssel ist spülmaschinenfeste. Das kompakte Design passt in jede Küche. Das elegante Design in verschiedenen Farben passt zu jeder Kücheneinrichtung. Perfekt für kleine Küchen.`,
    shortDesc: 'Kompakte KitchenAid-Küchenmaschine mit 3,3L-Rüssel',
    features: ['Kompaktes Design', 'Planetarisches Mischsystem', '10 Geschwindigkeiten', '3,3 Liter Rüssel', 'Ikonisches Design'],
    specs: [
      { key: 'Leistung', value: '250 Watt' },
      { key: 'Rüsselvolumen', value: '3,3 Liter' },
      { key: 'Geschwindigkeiten', value: '10 + Puls' },
      { key: 'Mischsystem', value: 'Planetarisch' },
      { key: 'Aufätze', value: 'Knethaken, Schneebesen' },
      { key: 'Farbe', value: 'Verschiedene Farben' },
    ],
  },
  {
    slug: 'miele-h7464bp-backofen',
    description: `Der Miele H 7464 BP Backofen ist ein Premium-Einbau-Backofen mit 12 Funktionen. Die Miele-Technologie sorgt für gleichmäßiges Backen auf allen Ebenen. Das Large-Account-Display mit Touchbedienung ermöglicht intuitive Steuerung. Die SelfCleaning-Funktion reinigt den Ofen automatisch pyrolytisch. Die Soft-Close-Tür sorgt für sanftes Schließen. Die LED-Beleuchtung sorgt für optimale Sicht. Die Miele-Qualität bietet Zuverlässigkeit und Langlebigkeit. Ein Premium-Backofen für anspruchsvolle Bäcker.`,
    shortDesc: 'Premium-Einbau-Backofen mit 12 Funktionen und SelfCleaning',
    features: ['12 Backfunktionen', 'SelfCleaning Pyrolyse', 'Touchbedienung', 'LED-Beleuchtung', 'Soft-Close-Tür'],
    specs: [
      { key: 'Funktionen', value: '12 Backfunktionen' },
      { key: 'Backofenvolumen', value: '76 Liter' },
      { key: 'Reinigung', value: 'Pyrolyse SelfCleaning' },
      { key: 'Steuerung', value: 'Touchdisplay' },
      { key: 'Breite', value: '60 cm' },
      { key: 'Energieklasse', value: 'A+1' },
    ],
  },
  {
    slug: 'moulinex-optichef-ht4101-handmixer',
    description: `Der Moulinex OptiChef HT4101 Handmixer bietet 450 Watt Leistung und 5 Geschwindigkeitsstufen. Das ergonomische Design und das geringe Gewicht sorgen für komfortables Arbeiten. Die mitgelieferten Edelstahl-Aufsätze – 2 Knethaken und 2 Schneebesen – sind spülmaschinenfest. Der Turbo-Boost sorgt für maximale Leistung. Die Einzelhand-Auswurftaste erleichtert die Reinigung. Das elegante Design in Weiß passt zu jeder Kücheneinrichtung. Ein zuverlässiger Helfer für den täglichen Gebrauch.`,
    shortDesc: 'Leichter Handmixer mit 450W und 5 Geschwindigkeiten',
    features: ['450 Watt Motor', '5 Geschwindigkeiten', 'Turbo-Boost', 'Edelstahl-Aufätze', 'Nur 0,9 kg leicht'],
    specs: [
      { key: 'Leistung', value: '450 Watt' },
      { key: 'Geschwindigkeiten', value: '5 Stufen' },
      { key: 'Aufsätze', value: '2 Knethaken, 2 Schneebesen' },
      { key: 'Material', value: 'Edelstahl-Aufsätze' },
      { key: 'Farbe', value: 'Weiß' },
    ],
  },
  {
    slug: 'moulinex-quickmix-654-handmixer',
    description: `Der Moulinex QuickMix 654 Handmixer ist ein kompakter Helfer mit 300 Watt Leistung. Die 4 Geschwindigkeitsstufen ermöglichen individuelle Einstellungen. Die mitgelieferten Aufätze – 2 Knethaken und 2 Schneebesen – bieten maximale Vielseitigkeit. Der Turbo-Boost sorgt für zusätzliche Leistung. Das ergonomische Design sorgt für sicheren Halt. Das kompakte Design lässt sich platzsparend aufbewahren. Ein zuverlässiger Einstiegs-Handmixer für den täglichen Gebrauch.`,
    shortDesc: 'Kompakter Einstiegs-Handmixer mit 300W und 4 Geschwindigkeiten',
    features: ['300 Watt Motor', '4 Geschwindigkeiten', 'Turbo-Boost', '2 Knethaken, 2 Schneebesen', 'Kompaktes Design'],
    specs: [
      { key: 'Leistung', value: '300 Watt' },
      { key: 'Geschwindigkeiten', value: '4 Stufen' },
      { key: 'Aufsätze', value: '2 Knethaken, 2 Schneebesen' },
      { key: 'Farbe', value: 'Weiß' },
    ],
  },
  {
    slug: 'neff-b3acs7ah0-backofen',
    description: `Der Neff B3ACS7AH0 Backofen ist ein einbau-würdiger Backofen mit 8 Funktionen. Die 3D-Heißluft-Verteilung sorgt für gleichmäßiges Backen auf allen Ebenen. Die SoftOpen- und SoftClose-Tür sorgt für sanftes Öffnen und Schließen. Die LED-Beleuchtung sorgt für optimale Sicht. Die Easy-Clean-Beschichtung ermöglicht einfache Reinigung. Das 60-cm-Design passt in jede Küchenzeile. Ein zuverlässiger Backofen für jeden Tag.`,
    shortDesc: 'Einbau-Backofen mit 8 Funktionen und SoftClose-Tür',
    features: ['8 Backfunktionen', '3D-Heißluft', 'SoftClose-Tür', 'LED-Beleuchtung', 'Easy-Clean'],
    specs: [
      { key: 'Funktionen', value: '8 Backfunktionen' },
      { key: 'Backofenvolumen', value: '71 Liter' },
      { key: 'Technologie', value: '3D-Heißluft' },
      { key: 'Reinigung', value: 'Easy-Clean' },
      { key: 'Breite', value: '60 cm' },
      { key: 'Farbe', value: 'Weiß' },
    ],
  },
  {
    slug: 'ninja-foodi-dual-zone-af300eu',
    description: `Die Ninja Foodi Dual Zone AF300EU ist ein Airfryer mit 2 unabhängigen Kochbereichen. Die Dual-Zone-Technologie ermöglicht das Gleichzeitiges Zubereiten von 2 Gerichten mit verschiedenen Einstellungen. Die 6 Funktionen – Airfry, Backen, Braten, Grillen, Trocknen, Rehydratieren – bieten maximale Vielseitigkeit. Die XXL-Kapazität von 7,6 Liter fügt große Portionen. Die schnelle Erhitzung spart Zeit und Energie. Die abnehmbaren Teile sind spülmaschinenfest. Perfekt für Familien, die gesund und vielseitig kochen wollen.`,
    shortDesc: 'Dual-Zone-Airfryer mit 2 Kochbereichen und 6 Funktionen',
    features: ['Dual-Zone-Technologie', '6 Funktionen', '7,6 Liter Kapazität', 'Schnelle Erhitzung', 'Spülmaschinenfeste Teile'],
    specs: [
      { key: 'Kapazität', value: '7,6 Liter (2 Zonen)' },
      { key: 'Funktionen', value: 'Airfry, Backen, Braten, Grillen, Trocknen, Rehydratieren' },
      { key: 'Leistung', value: '2400 Watt' },
      { key: 'Temperaturbereich', value: '40-240°C' },
      { key: 'Gewicht', value: '8,2 kg' },
      { key: 'Farbe', value: 'Schwarz' },
    ],
  },
  {
    slug: 'ninja-foodi-max-af400eu',
    description: `Die Ninja Foodi Max AF400EU ist ein großer Airfryer mit XL-Kapazität. Die 7 Funktionen – Airfry, Backen, Braten, Grillen, Trocknen, Rehydratieren, Dehydrieren – bieten maximale Vielseitigkeit. Die schnelle Erhitzung spart Zeit und Energie. Die abnehmbaren Teile sind spülmaschinenfest. Die integrierte Timer-Funktion ermöglicht automatisches Kochen. Das elegante Design in Schwarz passt zu jeder Kücheneinrichtung. Perfekt für Familien, die gesund und vielseitig kochen wollen.`,
    shortDesc: 'XL-Airfryer mit 7 Funktionen und großer Kapazität',
    features: ['7 Funktionen', 'XL-Kapazität', 'Schnelle Erhitzung', 'Timer-Funktion', 'Spülmaschinenfeste Teile'],
    specs: [
      { key: 'Kapazität', value: '7,6 Liter' },
      { key: 'Funktionen', value: '7 Funktionen inkl. Dehydrieren' },
      { key: 'Leistung', value: '2400 Watt' },
      { key: 'Temperaturbereich', value: '40-240°C' },
      { key: 'Gewicht', value: '8,5 kg' },
      { key: 'Farbe', value: 'Schwarz' },
    ],
  },
  {
    slug: 'ninja-foodi-multi-cooker-nc300',
    description: `Die Ninja Foodi Multi-Cooker NC300 ist ein multifunktionaler Kochtopf mit 8 Funktionen. Die 8 Funktionen – Kochen, Dünsten, Braten, Sous-Vide, Slow-Cook, Dämpfen, Braten, Aufwärmen – bieten maximale Versatilität. Die 6-Liter-Kapazität fügt große Portionen. Die schnelle Erhitzung spart Zeit und Energie. Die abnehmbaren Teile sind spülmaschinenfest. Die integrierte Timer-Funktion ermöglicht automatisches Kochen. Das elegante Design in Schwarz passt zu jeder Kücheneinrichtung. Perfekt für alle, die vielseitig und gesund kochen wollen.`,
    shortDesc: 'Multifunktionaler Kochtopf mit 8 Funktionen und 6L-Kapazität',
    features: ['8 Funktionen', '6 Liter Kapazität', 'Schnelle Erhitzung', 'Timer-Funktion', 'Spülmaschinenfeste Teile'],
    specs: [
      { key: 'Kapazität', value: '6 Liter' },
      { key: 'Funktionen', value: '8 Funktionen inkl. Sous-Vide' },
      { key: 'Leistung', value: '1400 Watt' },
      { key: 'Temperaturbereich', value: '40-175°C' },
      { key: 'Gewicht', value: '5,8 kg' },
      { key: 'Farbe', value: 'Schwarz' },
    ],
  },
  {
    slug: 'philips-hr3655-handmixer',
    description: `Der Philips HR 3655 Handmixer bietet 450 Watt Leistung und 5 Geschwindigkeitsstufen. Das ergonomische Design und das geringe Gewicht sorgen für komfortables Arbeiten. Die mitgelieferten Edelstahl-Aufsätze – 2 Knethaken und 2 Schneebesen – sind spülmaschinenfest. Der Turbo-Boost sorgt für maximale Leistung. Die Einzelhand-Auswurftaste erleichtert die Reinigung. Das elegante Design in Weiß passt zu jeder Kücheneinrichtung. Ein zuverlässiger Helfer für den täglichen Gebrauch.`,
    shortDesc: 'Leichter Handmixer mit 450W und 5 Geschwindigkeiten',
    features: ['450 Watt Motor', '5 Geschwindigkeiten', 'Turbo-Boost', 'Edelstahl-Aufätze', 'Spülmaschinenfeste Teile'],
    specs: [
      { key: 'Leistung', value: '450 Watt' },
      { key: 'Geschwindigkeiten', value: '5 Stufen' },
      { key: 'Aufsätze', value: '2 Knethaken, 2 Schneebesen' },
      { key: 'Material', value: 'Edelstahl-Aufsätze' },
      { key: 'Farbe', value: 'Weiß' },
    ],
  },
  {
    slug: 'russell-hobbs-eagle-23211-handmixer',
    description: `Der Russell Hobbs Eagle 23211 Handmixer bietet 400 Watt Leistung und 5 Geschwindigkeitsstufen. Das elegante Design in Chrom sorgt für einen modernen Look. Die mitgelieferten Edelstahl-Aufätze – 2 Knethaken und 2 Schneebesen – bieten maximale Vielseitigkeit. Der Turbo-Boost sorgt für maximale Leistung. Der ergonomische Griff sorgt für sicheren Halt. Das kompakte Design lässt sich platzsparend aufbewahren. Ein stylischer Helfer für den täglichen Gebrauch.`,
    shortDesc: 'Chrom-Handmixer mit 400W und 5 Geschwindigkeiten',
    features: ['400 Watt Motor', '5 Geschwindigkeiten', 'Turbo-Boost', 'Chrom-Design', 'Edelstahl-Aufsätze'],
    specs: [
      { key: 'Leistung', value: '400 Watt' },
      { key: 'Geschwindigkeiten', value: '5 Stufen' },
      { key: 'Aufsätze', value: '2 Knethaken, 2 Schneebesen' },
      { key: 'Material', value: 'Edelstahl-Aufsätze, Chrom-Gehäuse' },
      { key: 'Farbe', value: 'Chrom' },
    ],
  },
  {
    slug: 'russell-hobbs-go-create-handmixer',
    description: `Der Russell Hobbs Go Create Handmixer ist ein kompakter Helfer mit 300 Watt Leistung. Die 5 Geschwindigkeitsstufen ermöglichen individuelle Einstellungen. Die mitgelieferten Aufätze – 2 Knethaken und 2 Schneebesen – bieten maximale Vielseitigkeit. Der Turbo-Boost sorgt für zusätzliche Leistung. Das ergonomische Design sorgt für sicheren Halt. Das kompakte Design lässt sich platzsparend aufbewahren. Ein zuverlässiger Einstiegs-Handmixer für den täglichen Gebrauch.`,
    shortDesc: 'Kompakter Einstiegs-Handmixer mit 300W und 5 Geschwindigkeiten',
    features: ['300 Watt Motor', '5 Geschwindigkeiten', 'Turbo-Boost', '2 Knethaken, 2 Schneebesen', 'Kompaktes Design'],
    specs: [
      { key: 'Leistung', value: '300 Watt' },
      { key: 'Geschwindigkeiten', value: '5 Stufen' },
      { key: 'Aufsätze', value: '2 Knethaken, 2 Schneebesen' },
      { key: 'Farbe', value: 'Rot/Weiß' },
    ],
  },
  {
    slug: 'russell-hobbs-retro-air-fryer-24530',
    description: `Der Russell Hobbs Retro Air Fryer 24530 ist ein stilvoller Airfryer im Retro-Design. Die 3 Funktionen – Airfry, Backen, Grillen – bieten Vielseitigkeit für jeden Tag. Die schnelle Erhitzung spart Zeit und Energie. Die abnehmbaren Teile sind spülmaschinenfest. Die integrierte Timer-Funktion ermöglicht automatisches Kochen. Das elegante Retro-Design in various Farben passt zu jeder Kücheneinrichtung. Perfekt für alle, die gesund und stilvoll kochen wollen.`,
    shortDesc: 'Retro-Airfryer mit 3 Funktionen und stilvollem Design',
    features: ['3 Funktionen', 'Retro-Design', 'Schnelle Erhitzung', 'Timer-Funktion', 'Spülmaschinenfeste Teile'],
    specs: [
      { key: 'Kapazität', value: '3,8 Liter' },
      { key: 'Funktionen', value: 'Airfry, Backen, Grillen' },
      { key: 'Leistung', value: '1500 Watt' },
      { key: 'Temperaturbereich', value: '80-200°C' },
      { key: 'Farbe', value: 'Retro-Verschiedene' },
    ],
  },
  {
    slug: 'sage-the-air-fryer-pro-bpa180',
    description: `Die Sage The Air Fryer Pro BPA180 ist ein Premium-Airfryer mit multifunktionalen Möglichkeiten. Die 7 Funktionen – Airfry, Bake, Roast, Grill, Dehydrate, Reheat, Keep Warm – bieten maximale Vielseitigkeit. Die schnelle Erhitzung spart Zeit und Energie. Die abnehmbaren Teile sind spülmaschinenfest. Die integrierte Timer-Funktion ermöglicht automatisches Kochen. Das elegante Design in Bürstmetall passt zu jeder Kücheneinrichtung. Perfekt für alle, die gesund und vielseitig kochen wollen.`,
    shortDesc: 'Premium-Airfryer mit 7 Funktionen und Bürstmetall-Design',
    features: ['7 Funktionen', 'Bürstmetall-Design', 'Schnelle Erhitzung', 'Timer-Funktion', 'Spülmaschinenfeste Teile'],
    specs: [
      { key: 'Kapazität', value: '4,0 Liter' },
      { key: 'Funktionen', value: '7 Funktionen' },
      { key: 'Leistung', value: '1800 Watt' },
      { key: 'Temperaturbereich', value: '80-230°C' },
      { key: 'Farbe', value: 'Bürstmetall' },
    ],
  },
  {
    slug: 'sage-the-bakery-boss',
    description: `Die Sage The Bakery Boss ist ein Premium-Handmixer für anspruchsvolle Bäcker. Die 600 Watt Leistung und 8 Geschwindigkeitsstufen ermöglichen individuelle Einstellungen. Die integrierte Waage erlaubt präzise Zutatenabmessung. Die mitgelieferten Edelstahl-Aufätze – 2 Knethaken und 2 Schneebesen – sind spülmaschinenfest. Die Soft-Start-Funktion verhindert Spritzer beim Einschalten. Das elegante Design in Bürstmetall passt zu jeder Kücheneinrichtung. Ein Premium-Handmixer für anspruchsvolle Bäcker.`,
    shortDesc: 'Premium-Handmixer mit integrierter Waage und 600W',
    features: ['600 Watt Motor', 'Integrierte Waage', '8 Geschwindigkeiten', 'Soft-Start', 'Bürstmetall-Design'],
    specs: [
      { key: 'Leistung', value: '600 Watt' },
      { key: 'Geschwindigkeiten', value: '8 Stufen' },
      { key: 'Funktion', value: 'Integrierte Waage' },
      { key: 'Aufsätze', value: '2 Knethaken, 2 Schneebesen' },
      { key: 'Farbe', value: 'Bürstmetall' },
    ],
  },
  {
    slug: 'siemens-iq700-backofen-hb778ges0',
    description: `Der Siemens iQ700 Backofen HB778GES0 ist ein Premium-Einbau-Backofen mit 14 Funktionen. Die 3D-Heißluft-Verteilung sorgt für gleichmäßiges Backen auf allen Ebenen. Das TFT-Touchdisplay mit Farbanzeige ermöglicht intuitive Bedienung. Die Home-Connect-App ermöglicht die Fernbedienung per Smartphone. Die Pyrolyse-Selbstreinigung reinigt den Ofen automatisch. Die SoftClose-Tür sorgt für sanftes Schließen. Die LED-Beleuchtung sorgt für optimale Sicht. Ein Premium-Backofen für anspruchsvolle Bäcker.`,
    shortDesc: 'Premium-Einbau-Backofen mit 14 Funktionen, Home Connect und TFT-Display',
    features: ['14 Backfunktionen', 'Home Connect App', 'TFT-Touchdisplay', 'Pyrolyse-Selbstreinigung', '3D-Heißluft'],
    specs: [
      { key: 'Funktionen', value: '14 Backfunktionen' },
      { key: 'Backofenvolumen', value: '71 Liter' },
      { key: 'Technologie', value: '3D-Heißluft' },
      { key: 'Reinigung', value: 'Pyrolyse' },
      { key: 'Steuerung', value: 'TFT-Touchdisplay' },
      { key: 'Breite', value: '60 cm' },
      { key: 'Energieklasse', value: 'A' },
    ],
  },
  {
    slug: 'siemens-iq700-induktionskochfeld-ex877ly44e',
    description: `Das Siemens iQ700 Induktionskochfeld EX877LY44E bietet 4 Induktionskochfelder mit flexiblen Kochbereich. Die FlexInduction-Technologie ermöglicht die Kombination von Kochfeldern für große Kochgeschirre. Die PowerBoost-Funktion sorgt für schnelles Aufkochen. Das perfectFry-Sensorkochfeld regelt die Temperatur automatisch. Die intuitive Bedienung über Schieberegler ist einfach und komfortabel. Die Scheibenkeramik-Oberfläche ist leicht zu reinigen. Das 60-cm-Design passt in jede moderne Küchenzeile. Ein Premium-Kochfeld für anspruchsvolle Köche.`,
    shortDesc: 'Premium-Induktionskochfeld mit FlexInduction und perfectFry-Sensor',
    features: ['FlexInduction', 'PowerBoost', 'perfectFry-Sensor', 'Schieberegler', '60 cm Einbaubreite'],
    specs: [
      { key: 'Kochfelder', value: '4 Induktionskochfelder' },
      { key: 'Technologie', value: 'FlexInduction' },
      { key: 'Funktionen', value: 'PowerBoost, perfectFry' },
      { key: 'Steuerung', value: 'Schieberegler' },
      { key: 'Breite', value: '60 cm' },
      { key: 'Farbe', value: 'Schwarz' },
    ],
  },
  {
    slug: 'smeg-50er-jahre-hmf02-handmixer',
    description: `Der SMEG 50er Jahre HMF02 Handmixer ist ein stilvoller Handmixer im Retro-Design der 50er Jahre. Die 400 Watt Leistung und 9 Geschwindigkeitsstufen ermöglichen individuelle Einstellungen. Die mitgelieferten Edelstahl-Aufätze – 2 Knethaken und 2 Schneebesen – bieten maximale Vielseitigkeit. Der Turbo-Boost sorgt für maximale Leistung. Der ergonomische Softgrip-Griff sorgt für sicheren Halt. Das elegante Retro-Design in various Farben passt zu jeder Kücheneinrichtung. Ein stylischer Helfer für designbewusste Küchenfreunde.`,
    shortDesc: 'Retro-Handmixer im 50er-Jahre-Design mit 400W und 9 Geschwindigkeiten',
    features: ['50er-Jahre-Retro-Design', '400 Watt Motor', '9 Geschwindigkeiten', 'Turbo-Boost', 'Edelstahl-Aufsätze'],
    specs: [
      { key: 'Leistung', value: '400 Watt' },
      { key: 'Geschwindigkeiten', value: '9 Stufen' },
      { key: 'Aufsätze', value: '2 Knethaken, 2 Schneebesen' },
      { key: 'Design', value: '50er-Jahre-Retro' },
      { key: 'Farbe', value: 'Verschiedene Farben' },
    ],
  },
  {
    slug: 'smeg-hmf01-handmixer',
    description: `Der SMEG HMF01 Handmixer ist ein stilvoller Handmixer im modernen SMEG-Design. Die 400 Watt Leistung und 9 Geschwindigkeitsstufen ermöglichen individuelle Einstellungen. Die mitgelieferten Edelstahl-Aufätze – 2 Knethaken und 2 Schneebesen – bieten maximale Vielseitigkeit. Der Turbo-Boost sorgt für maximale Leistung. Der ergonomische Softgrip-Griff sorgt für sicheren Halt. Das elegante Design in various Farben passt zu jeder Kücheneinrichtung. Ein stylischer Helfer für designbewusste Küchenfreunde.`,
    shortDesc: 'Moderner SMEG-Handmixer mit 400W und 9 Geschwindigkeiten',
    features: ['SMEG-Design', '400 Watt Motor', '9 Geschwindigkeiten', 'Turbo-Boost', 'Edelstahl-Aufsätze'],
    specs: [
      { key: 'Leistung', value: '400 Watt' },
      { key: 'Geschwindigkeiten', value: '9 Stufen' },
      { key: 'Aufsätze', value: '2 Knethaken, 2 Schneebesen' },
      { key: 'Material', value: 'Edelstahl-Aufätze' },
      { key: 'Farbe', value: 'Verschiedene Farben' },
    ],
  },
  {
    slug: 'tefal-easy-grill-precision-dg2558',
    description: `Der Tefal Easy Grill Precision DG2558 ist ein Kontaktgrill mit präziser Temperaturregelung. Die 2 Temperaturen ermöglichen individuelle Einstellungen. Die Grillflächen mit Antihaft-Beschichtung sorgen für einfaches Reinigen. Die integrierte Fettablauerschale fängt überschüssiges Fett auf. Die zentrale Schließmulde sorgt für gleichmäßiges Grillen. Das kompakte Design lässt sich platzsparend aufbewahren. Perfekt für schnelle Grillgerichte zu Hause.`,
    shortDesc: 'Kontaktgrill mit präziser Temperaturregelung und Antihaft',
    features: ['2 Temperaturen', 'Antihaft-Beschichtung', 'Fettablauerschale', 'Zentrale Schließmulde', 'Kompaktes Design'],
    specs: [
      { key: 'Leistung', value: '2500 Watt' },
      { key: 'Temperaturstufen', value: '2 Stufen' },
      { key: 'Grillfläche', value: 'Auto-Adapt-System' },
      { key: 'Reinigung', value: 'Antihaft, spülmaschinenfest' },
      { key: 'Farbe', value: 'Schwarz' },
    ],
  },
  {
    slug: 'tefal-jamie-oliver-cook-smart',
    description: `Der Tefal Jamie Oliver Cook Smart ist eine Kochtopf-Serie für anspruchsvolles Kochen. Die 3-teilige Serie umfasst einen Kasserole, einen Bräter und eine Pfanne. Die harte Anodise-Gehäuse sorgt für gleichmäßige Wärmeverteilung. Die induktionsgeeignete Basis funktioniert auf allen Herdtypen. Die ergonomischen Griffe sorgen für sicheren Halt. Die spülmaschinenfeste Pflege erleichtert die Reinigung. Das elegante Design passt zu jeder Kücheneinrichtung. Perfekt für anspruchsvolle Köche.`,
    shortDesc: 'Jamie Oliver Kochtopf-Serie mit 3 Teilen und Hartanodise-Gehäuse',
    features: ['3-teilige Serie', 'Hartanodise-Gehäuse', 'Induktionsgeeignet', 'Ergonomische Griffe', 'Spülmaschinenfest'],
    specs: [
      { key: 'Material', value: 'Hartanodise Aluminium' },
      { key: 'Set-Inhalt', value: 'Kasserole, Bräter, Pfanne' },
      { key: 'Herdtyp', value: 'Alle inkl. Induktion' },
      { key: 'Reinigung', value: 'Spülmaschinenfest' },
      { key: 'Farbe', value: 'Anthrazit' },
    ],
  },
  {
    slug: 'tefal-optichef-ht4508-handmixer',
    description: `Der Tefal OptiChef HT4508 Handmixer bietet 450 Watt Leistung und 5 Geschwindigkeitsstufen. Das ergonomische Design und das geringe Gewicht sorgen für komfortables Arbeiten. Die mitgelieferten Edelstahl-Aufätze – 2 Knethaken und 2 Schneebesen – sind spülmaschinenfest. Der Turbo-Boost sorgt für maximale Leistung. Die Einzelhand-Auswurftaste erleichtert die Reinigung. Das elegante Design in Weiß passt zu jeder Kücheneinrichtung. Ein zuverlässiger Helfer für den täglichen Gebrauch.`,
    shortDesc: 'Leichter Handmixer mit 450W und 5 Geschwindigkeiten',
    features: ['450 Watt Motor', '5 Geschwindigkeiten', 'Turbo-Boost', 'Edelstahl-Aufätze', 'Spülmaschinenfeste Teile'],
    specs: [
      { key: 'Leistung', value: '450 Watt' },
      { key: 'Geschwindigkeiten', value: '5 Stufen' },
      { key: 'Aufsätze', value: '2 Knethaken, 2 Schneebesen' },
      { key: 'Material', value: 'Edelstahl-Aufsätze' },
      { key: 'Farbe', value: 'Weiß' },
    ],
  },
  {
    slug: 'tefal-optigrill-plus-gc7148',
    description: `Der Tefal OptiGrill Plus GC7148 ist ein intelligentes Grillgerät mit automatischer Sensorik. Die 6 Grillprogramme erkennen das Essen automatisch und passen Temperatur und Zeit an. Die XL-Grillfläche eignet sich für große Portionen. Die abnehmbaren Grillplatten sind spülmaschinenfeste. Die integrierte Fettablauerschale fängt überschüssiges Fett auf. Das elegante Design in Schwarz passt zu jeder Kücheneinrichtung. Perfekt für alle, die gesund und einfach grillen wollen.`,
    shortDesc: 'Intelligenter Grill mit 6 automatischen Programmen und Sensorik',
    features: ['6 Grillprogramme', 'Automatische Sensorik', 'XL-Grillfläche', 'Spülmaschinenfeste Platten', 'Fettablauerschale'],
    specs: [
      { key: 'Leistung', value: '2000 Watt' },
      { key: 'Grillprogramme', value: '6 Stück' },
      { key: 'Grillfläche', value: 'XL' },
      { key: 'Reinigung', value: 'Spülmaschinenfest' },
      { key: 'Farbe', value: 'Schwarz' },
    ],
  },
  {
    slug: 'thermomix-tm6',
    description: `Der Thermomix TM6 ist ein multifunktionaler Küchenhelfer mit über 20 Funktionen. Die intuitive Touch-Steuerung ermöglicht einfache Bedienung. Die integrierte Waage erlaubt präzise Zutatenabmessung. Die Heizfunktion bis 160°C ermögliches Kochen und Braten. Die Messerklinge aus Edelstahl mahlt, mixt und püriert. Die guided-Cooking-Funktion führt Schritt für Schritt durch Rezepte. Die Varoma-Dämpfer erweitert die Möglichkeiten. Die premium-Veredelung unterstreicht den Qualitätsanspruch. Ein unverzichtbarer Helfer für moderne Küchen.`,
    shortDesc: 'Multifunktionaler Küchenhelfer mit 20+ Funktionen und guided Cooking',
    features: ['20+ Funktionen', 'Guided Cooking', 'Integrierte Waage', 'Heizung bis 160°C', 'Touch-Steuerung'],
    specs: [
      { key: 'Funktionen', value: '20+ Funktionen' },
      { key: 'Leistung', value: '1500 Watt' },
      { key: 'Temperaturbereich', value: '37-160°C' },
      { key: 'Geschwindigkeit', value: '40-10.700 U/min' },
      { key: 'Kapazität', value: '2,2 Liter' },
      { key: 'Gewicht', value: '7,95 kg' },
      { key: 'Farbe', value: 'Weiß' },
    ],
  },
  {
    slug: 'vorwerk-thermomix-tm5',
    description: `Der Vorwerk Thermomix TM5 ist ein multifunktionaler Küchenhelfer mit über 12 Funktionen. Die intuitive Touch-Steuerung ermöglicht einfache Bedienung. Die integrierte Waage erlaubt präzise Zutatenabmessung. Die Heizfunktion bis 120°C ermögliches Kochen und Braten. Die Messerklinge aus Edelstahl mahlt, mixt und püriert. Die guided-Cooking-Funktion führt Schritt für Schritt durch Rezepte. Die Varoma-Dämpfer erweitert die Möglichkeiten. Die premium-Veredelung unterstreicht den Qualitätsanspruch. Ein bewährter Helfer für moderne Küchen.`,
    shortDesc: 'Bewährter Multifunktionaler Küchenhelfer mit 12+ Funktionen',
    features: ['12+ Funktionen', 'Guided Cooking', 'Integrierte Waage', 'Heizung bis 120°C', 'Touch-Steuerung'],
    specs: [
      { key: 'Funktionen', value: '12+ Funktionen' },
      { key: 'Leistung', value: '1500 Watt' },
      { key: 'Temperaturbereich', value: '37-120°C' },
      { key: 'Geschwindigkeit', value: '40-10.700 U/min' },
      { key: 'Kapazität', value: '2,2 Liter' },
      { key: 'Gewicht', value: '7,95 kg' },
      { key: 'Farbe', value: 'Weiß' },
    ],
  },
  {
    slug: 'wmf-kitchenminis-contact-grill',
    description: `Der WMF KitchenMinis Kontaktgrill ist ein kompakter Kontaktgrill für kleine Portionen. Die 1800 Watt Leistung sorgt für schnelles Grillen. Die Antihaft-Beschichtung sorgt für einfaches Reinigen. Die integrierte Fettablauerschale fängt überschüssiges Fett auf. Das kompakte Design von nur 30 cm Breite passt in jede Küche. Das elegante Cromargan®-Design passt zu jeder Kücheneinrichtung. Perfekt für Singles oder kleine Haushalte.`,
    shortDesc: 'Kompakter Kontaktgrill mit 1800W und Antihaft-Beschichtung',
    features: ['1800 Watt Leistung', 'Antihaft-Beschichtung', 'Fettablauerschale', 'Nur 30 cm breit', 'Cromargan®-Design'],
    specs: [
      { key: 'Leistung', value: '1800 Watt' },
      { key: 'Grillfläche', value: 'Antihaft' },
      { key: 'Material', value: 'Cromargan® Edelstahl' },
      { key: 'Breite', value: '30 cm' },
      { key: 'Farbe', value: 'Edelstahl' },
    ],
  },
  {
    slug: 'wmf-kitchenminis-handmixer',
    description: `Der WMF KitchenMinis Handmixer ist ein kompakter Handmixer für kleine Portionen. Die 400 Watt Leistung und 5 Geschwindigkeitsstufen ermöglichen individuelle Einstellungen. Die mitgelieferten Edelstahl-Aufätze – 2 Knethaken und 2 Schneebesen – bieten maximale Vielseitigkeit. Der Turbo-Boost sorgt für maximale Leistung. Das kompakte Design von nur 15 cm Breite passt in jede Küche. Das elegante Cromargan®-Design passt zu jeder Kücheneinrichtung. Perfekt für Singles oder kleine Haushalte.`,
    shortDesc: 'Kompakter Handmixer mit 400W und Cromargan®-Design',
    features: ['400 Watt Motor', '5 Geschwindigkeiten', 'Turbo-Boost', 'Nur 15 cm breit', 'Cromargan®-Design'],
    specs: [
      { key: 'Leistung', value: '400 Watt' },
      { key: 'Geschwindigkeiten', value: '5 Stufen' },
      { key: 'Aufsätze', value: '2 Knethaken, 2 Schneebesen' },
      { key: 'Material', value: 'Cromargan® Edelstahl' },
      { key: 'Farbe', value: 'Edelstahl' },
    ],
  },
];

async function main() {
  console.log(`\nMise à jour de ${updates.length} produits Küche & Kochen...\n`);

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

      // Delete existing specs
      await prisma.productSpec.deleteMany({
        where: { productId: product.id }
      });

      // Update product
      await prisma.product.update({
        where: { id: product.id },
        data: {
          description: data.description,
          shortDesc: data.shortDesc,
          features: data.features,
        }
      });

      // Create new specs
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
