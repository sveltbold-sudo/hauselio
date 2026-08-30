import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const updates = [
  {
    slug: 'aeg-ffb62607pm',
    description: `Der AEG FFB62607PM ist ein kabelloser Akkusauger mit Power for ALL-Allianz. Die 18V-Li-Ionen-Batterie bietet bis zu 50 Minuten Laufzeit. Der EasyRest-Halterung ermöglicht das Abstellen des Saugers an Arbeitsflächen. Die LED-Beleuchtung am Saugkopf macht Staub in dunklen Ecken sichtbar. Die Bürste mit Auto-Adjust-Technologie passt sich automatisch an不同的 Böden an. Die hygienische Entleerung erfordert keinen Kontakt mit Staub. Perfekt für vielseitiges Saugen.`,
    shortDesc: 'Kabelloser Akkusauger mit 50 Min. Laufzeit und Auto-Adjust-Bürste',
    features: ['18V Li-Ionen-Batterie', '50 Min. Laufzeit', 'Auto-Adjust-Bürste', 'LED-Beleuchtung', 'EasyRest-Halterung'],
    specs: [
      { key: 'Akku', value: '18V Li-Ionen' },
      { key: 'Laufzeit', value: 'Bis zu 50 Minuten' },
      { key: 'Aufladung', value: '4 Stunden' },
      { key: 'Gewicht', value: '2,3 kg' },
      { key: 'Farbe', value: 'Grau/Rot' },
    ],
  },
  {
    slug: 'aeg-fsk62600p-kompakt',
    description: `Die AEG FSK62600P Kompakt ist ein kompakter Geschirrspüler mit 6 Gedecken. Die 5 Programme bieten individuelle Wascheinstellungen. Die A+++ Energiesiegel sorgt für Energieeffizienz. Die kompakte Bauform von 45 cm Breite passt in jede Küche. Die Kindersicherung verhindert unbeabsichtigtes Öffnen. Die einfache Installation erfordert keine professionelle Montage. Perfekt für kleine Küchen und single Haushalte.`,
    shortDesc: 'Kompakter AEG-Geschirrspüler mit 6 Gedecken und 5 Programmen',
    features: ['6 Gedecke Kapazität', '5 Programme', 'A+++ Energiesiegel', '45 cm Breite', 'Kinderliedersicherung'],
    specs: [
      { key: 'Kapazität', value: '6 Gedecke' },
      { key: 'Energieklasse', value: 'A+++' },
      { key: 'Programme', value: '5' },
      { key: 'Breite', value: '45 cm' },
      { key: 'Abmessungen', value: '45 x 82 x 55 cm' },
    ],
  },
  {
    slug: 'aeg-rbs-36426tx-kuhlschrank',
    description: `Der AEG RBS 36426TX ist ein Side-by-Side-Kühlschrank mit Multi-Temp-Technologie. Die Multi-Temp-Technologie ermöglicht separate Temperatureinstellungen. Die NoFrost-Technologie verhindert automatisch Eisbildung. Die 362 Liter Volumen bietet ausreichend Platz. Die LED-Beleuchtung sorgt für optimale Sicht. Der integrierte Wasserspender bietet kaltes Wasser. Das Side-by-Side-Design passt in moderne Küchen. Perfekt für große Familien.`,
    shortDesc: 'Side-by-Side mit Multi-Temp, NoFrost und 362L Volumen',
    features: ['Multi-Temp-Technologie', 'NoFrost', '362 Liter Volumen', 'Wasserspender', 'LED-Beleuchtung'],
    specs: [
      { key: 'Volumen', value: '362 Liter' },
      { key: 'Kühltechnologie', value: 'NoFrost' },
      { key: 'Temperaturen', value: 'Multi-Temp' },
      { key: 'Dispenser', value: 'Wasserspender' },
      { key: 'Abmessungen', value: '91 x 180 x 71 cm' },
    ],
  },
  {
    slug: 'aeg-rcb53426tx-kuhlschrank',
    description: `Der AEG RCB53426TX ist ein Side-by-Side-Kühlschrank mit NoFrost-Technologie. Die NoFrost-Technologie verhindert automatisch Eisbildung. Die 526 Liter Volumen bietet ausreichend Platz für große Familien. Die LED-Beleuchtung sorgt für optimale Sicht. Der integrierte Wasserspender bietet kaltes Wasser. Das elegante Design in Edelstahl passt in moderne Küchen. Perfekt für große Familien.`,
    shortDesc: 'Side-by-Side mit NoFrost und 526L Volumen',
    features: ['NoFrost', '526 Liter Volumen', 'LED-Beleuchtung', 'Wasserspender', 'Edelstahl-Design'],
    specs: [
      { key: 'Volumen', value: '526 Liter' },
      { key: 'Kühltechnologie', value: 'NoFrost' },
      { key: 'Dispenser', value: 'Wasserspender' },
      { key: 'Energieklasse', value: 'A++' },
      { key: 'Abmessungen', value: '91 x 178 x 71 cm' },
    ],
  },
  {
    slug: 'aeg-well-q7-animal',
    description: `Der AEG Well Q7 Animal ist ein kabelloser Akkusauger für Tierhaarbesitzer. Die Battery-Health-Anzeige zeigt den Ladezustand an. Die Motorized-Brushroll entfernt Tierhaare gründlich. Die 2-in-1-Funktionalität ermöglicht das Saugen von Böden und Polstern. Die Easy-Release-Entleerung erfordert keinen Kontakt mit Staub. Die Wandhalterung sorgt für platzsparende Aufbewahrung. Das elegante Design in various Farben passt zu jeder Haushaltsführung. Perfekt für Tierbesitzer.`,
    shortDesc: 'Kabelloser Akkusauger mit Tierhaar-Bürste und Battery-Health',
    features: ['Battery-Health-Anzeige', 'Motorized-Brushroll', '2-in-1 Design', 'Wandhalterung', 'Tierhaar-optimiert'],
    specs: [
      { key: 'Akku', value: '18V Li-Ionen' },
      { key: 'Laufzeit', value: 'Bis zu 50 Minuten' },
      { key: 'Gewicht', value: '2,7 kg' },
      { key: 'Besonderheit', value: 'Tierhaar-optimiert' },
      { key: 'Farbe', value: 'Titan/Dunkelgrau' },
    ],
  },
  {
    slug: 'beko-dfn05320w',
    description: `Die Beko DFN05320W ist ein Einbau-Gefrierschrank mit NoFrost-Technologie. Die NoFrost-Technologie verhindert automatisch Eisbildung. Die 138 Liter Volumen bietet ausreichend Platz. Die LED-Beleuchtung sorgt für optimale Sicht. Die Fast-Freeze-Funktion friert Lebensmittel schnell ein. Das Einbau-Design passt in jede Küchenzeile. Perfekt für plaque sparende Gefrierung.`,
    shortDesc: 'Einbau-Gefrierschrank mit NoFrost und 138L Volumen',
    features: ['NoFrost', '138 Liter Volumen', 'LED-Beleuchtung', 'Fast-Freeze', 'Einbau-Design'],
    specs: [
      { key: 'Volumen', value: '138 Liter' },
      { key: 'Gefriertechnologie', value: 'NoFrost' },
      { key: 'Energieklasse', value: 'A++' },
      { key: 'Abmessungen', value: '56 x 177 x 55 cm' },
    ],
  },
  {
    slug: 'beko-dp-8534-gxa1-trockner',
    description: `Der Beko DP 8534 GXA1 Trockner ist ein Wärmepumpentrockner mit EcoGentle-Technologie. Die EcoGentle-Technologie trocknet schonend bei niedriger Temperatur. Die 8 kg Kapazität eignet sich für mittlere Haushalte. Das A++ Energiesiegel sorgt für Energieeffizienz. Die Sensor-Feuchtigkeitssteuerung erkennt den Trocknungsgrad. Die 15 Programme bieten individuelle Einstellungen. Das kompakte Design passt in jede Küche. Perfekt für energieeffizientes Trocknen.`,
    shortDesc: 'Wärmepumpentrockner mit EcoGentle und 8 kg Kapazität',
    features: ['EcoGentle-Technologie', '8 kg Kapazität', 'A++ Energiesiegel', 'Sensor-Feuchtigkeitssteuerung', '15 Programme'],
    specs: [
      { key: 'Kapazität', value: '8 kg' },
      { key: 'Trocknungsart', value: 'Wärmepumpe' },
      { key: 'Energieklasse', value: 'A++' },
      { key: 'Programme', value: '15' },
      { key: 'Abmessungen', value: '60 x 85 x 60 cm' },
    ],
  },
  {
    slug: 'beko-gne-134620-x-kuhlschrank',
    description: `Der Beko GNE 134620 X Kühlschrank ist einSide-by-Side-Kühlschrank mit NeoFrost-Technologie. Die NeoFrost-Technologie sorgt für optimale Kühlung. Die 462 Liter Volumen bietet ausreichend Platz für große Familien. Die LED-Beleuchtung sorgt für optimale Sicht. Der integrierte Wasserspender bietet kaltes Wasser. Das elegante Design in Edelstahl passt in moderne Küchen. Perfekt für große Familien.`,
    shortDesc: 'Side-by-Side mit NeoFrost und 462L Volumen',
    features: ['NeoFrost-Technologie', '462 Liter Volumen', 'LED-Beleuchtung', 'Wasserspender', 'Edelstahl-Design'],
    specs: [
      { key: 'Volumen', value: '462 Liter' },
      { key: 'Kühltechnologie', value: 'NeoFrost' },
      { key: 'Dispenser', value: 'Wasserspender' },
      { key: 'Energieklasse', value: 'A++' },
      { key: 'Abmessungen', value: '91 x 175 x 71 cm' },
    ],
  },
  {
    slug: 'beko-rbst140k25w-kuhlschrank',
    description: `Der Beko RBST140K25W Kühlschrank ist ein kompakter Einbau-Kühlschrank. Die 139 Liter Volumen bietet ausreichend Platz für kleine Haushalte. Die LED-Beleuchtung sorgt für optimale Sicht. Die individuellen Kühlschrank-Einstellungen ermöglichen Anpassungen. Das Einbau-Design passt in jede Küchenzeile. Perfekt für kleine Haushalte und single Wohnungen.`,
    shortDesc: 'Kompakter Einbau-Kühlschrank mit 139L Volumen',
    features: ['139 Liter Volumen', 'LED-Beleuchtung', 'Individuelle Einstellungen', 'Einbau-Design', 'Kompakt'],
    specs: [
      { key: 'Volumen', value: '139 Liter' },
      { key: 'Kühltechnologie', value: 'Statisch' },
      { key: 'Energieklasse', value: 'A++' },
      { key: 'Abmessungen', value: '56 x 82 x 55 cm' },
    ],
  },
  {
    slug: 'beko-trockner-dpy8534gxa1',
    description: `Der Beko Trockner DPY8534GXA1 ist ein Wärmepumpentrockner mit EcoGentle-Technologie. Die EcoGentle-Technologie trocknet schonend bei niedriger Temperatur. Die 8 kg Kapazität eignet sich für mittlere Haushalte. Das A++ Energiesiegel sorgt für Energieeffizienz. Die Sensor-Feuchtigkeitssteuerung erkennt den Trocknungsgrad. Die 15 Programme bieten individuelle Einstellungen. Das kompakte Design passt in jede Küche. Perfekt für energieeffizientes Trocknen.`,
    shortDesc: 'Wärmepumpentrockner mit EcoGentle und 8 kg Kapazität',
    features: ['EcoGentle-Technologie', '8 kg Kapazität', 'A++ Energiesiegel', 'Sensor-Feuchtigkeitssteuerung', '15 Programme'],
    specs: [
      { key: 'Kapazität', value: '8 kg' },
      { key: 'Trocknungsart', value: 'Wärmepumpe' },
      { key: 'Energieklasse', value: 'A++' },
      { key: 'Programme', value: '15' },
      { key: 'Abmessungen', value: '60 x 85 x 60 cm' },
    ],
  },
  {
    slug: 'bosch-kompakt-sms46mw00e',
    description: `Die Bosch Kompakt SMS46MW00E ist ein freistehender Geschirrspüler mit ActiveWater-Technologie. Die ActiveWater-Technologie nutzt Wasser effizient für optimale Reinigungsergebnisse. Die 13 Gedecke Kapazität eignet sich für mittlere bis große Haushalte. Die 6 Programme und 3 Zusatzfunktionen bieten individuelle Einstellungen. Die A+++ Energiesiegel sorgt für Energieeffizienz. Die VarioKorbe bieten flexible Belademöglichkeiten. Die AquaStop-Sicherheit verhindert Wasserschäden. Perfekt für sparsames Spülen.`,
    shortDesc: 'Freistehender Geschirrspüler mit ActiveWater und 13 Gedecken',
    features: ['ActiveWater-Technologie', '13 Gedecke', '6 Programme', 'A+++ Energiesiegel', 'VarioKorbe'],
    specs: [
      { key: 'Kapazität', value: '13 Gedecke' },
      { key: 'Energieklasse', value: 'A+++' },
      { key: 'Wasserverbrauch', value: '9,5 Liter' },
      { key: 'Programme', value: '6 + 3 Zusatzfunktionen' },
      { key: 'Abmessungen', value: '60 x 85 x 60 cm' },
    ],
  },
  {
    slug: 'bosch-serie-4-kgn36vled',
    description: `Der Bosch Serie 4 KGN36VLED ist ein freistehender Kühlschrank-Gefrierkombination mit MultiBox-System. Die NoFrost-Technologie verhindert automatisch Eisbildung. Die 324 Liter Volumen bietet ausreichend Platz. Die LED-Beleuchtung sorgt für optimale Sicht. Die CrisperBox hält Obst und Gemüse besonders frisch. Die VitaFresh-Zone bietet optimale Lagerungsbedingungen. Das elegante Design passt in jede Küche. Perfekt für Kombination aus Kühlung und Gefrierung.`,
    shortDesc: 'Kühlschrank-Gefrierkombination mit NoFrost und 324L Volumen',
    features: ['NoFrost', '324 Liter Volumen', 'CrisperBox', 'VitaFresh-Zone', 'LED-Beleuchtung'],
    specs: [
      { key: 'Volumen', value: '324 Liter' },
      { key: 'Kühltechnologie', value: 'NoFrost' },
      { key: 'Kühlschrank', value: '238 Liter' },
      { key: 'Gefrierfach', value: '86 Liter' },
      { key: 'Abmessungen', value: '60 x 186 x 65 cm' },
    ],
  },
  {
    slug: 'bosch-serie6-smv88tx36e',
    description: `Die Bosch Serie 6 SMV88TX36E ist ein Premium-Geschirrspüler mit Zeolith-Trocknung und PerfectDry. Die Zeolith-Trocknung sorgt für brillante Trocknungsergebnisse. Die PerfectDry-Technologie passt die Trocknung an不同的 Geschirrtype an. Die VarioSpeed Plus-Funktion verkürzt die Spüldauer um bis zu 66%. Die 14 Gedecke Kapazität eignet sich für große Haushalte. Die A+++ Energiesiegel sorgt für Energieeffizienz. Die Home-Connect-App ermöglicht die Fernbedienung. Das Premium-Modell für brillante Ergebnisse.`,
    shortDesc: 'Premium-Geschirrspüler mit Zeolith, PerfectDry und Home Connect',
    features: ['Zeolith-Trocknung', 'PerfectDry', 'VarioSpeed Plus', 'Home Connect App', 'A+++ Energiesiegel'],
    specs: [
      { key: 'Kapazität', value: '14 Gedecke' },
      { key: 'Energieklasse', value: 'A+++' },
      { key: 'Trocknung', value: 'Zeolith + PerfectDry' },
      { key: 'Programme', value: '8 + 4 Zusatzfunktionen' },
      { key: 'Abmessungen', value: '60 x 82 x 55 cm' },
    ],
  },
  {
    slug: 'bosch-serie6-bbh3d122',
    description: `Der Bosch Serie 6 BBH3D122 ist ein kabelloser Akkusauger mit AllFloor-HighPower-Bürste. Die AllFloor-HighPower-Bürste sorgt für gründliches Saugen auf allen Böden. Die 18V-Li-Ionen-Batterie bietet bis zu 40 Minuten Laufzeit. Die LED-Beleuchtung am Saugkopf macht Staub in dunklen Ecken sichtbar. Die Easy-Klick-Aufnahme ermöglicht schnellen Wechsel der Aufsätze. Die Wandhalterung sorgt für platzsparende Aufbewahrung. Das kompakte Design passt in jede Küche. Perfekt für schnelle und gründliche Reinigung.`,
    shortDesc: 'Kabelloser Bosch-Akkusauger mit AllFloor-HighPower-Bürste',
    features: ['AllFloor-HighPower-Bürste', '40 Min. Laufzeit', 'LED-Beleuchtung', 'Easy-Klick-Aufnahme', 'Wandhalterung'],
    specs: [
      { key: 'Akku', value: '18V Li-Ionen' },
      { key: 'Laufzeit', value: 'Bis zu 40 Minuten' },
      { key: 'Gewicht', value: '3,0 kg' },
      { key: 'Farbe', value: 'Weiß/Anthrazit' },
    ],
  },
  {
    slug: 'bosch-serie6-kuhlschrank-kgn36aw3a',
    description: `Der Bosch Serie 6 Kühlschrank KGN36AW3A ist ein freistehender Kühlschrank-Gefrierkombination mit FreshSense-Technologie. Die FreshSense-Technologie sorgt für konstante Temperaturen. Die NoFrost-Technologie verhindert automatisch Eisbildung. Die 324 Liter Volumen bietet ausreichend Platz. Die LED-Beleuchtung sorgt für optimale Sicht. Die VitaFresh-Zone bietet optimale Lagerungsbedingungen. Das elegante Design passt in jede Küche. Perfekt für frische Lebensmittel.`,
    shortDesc: 'Kühlschrank-Gefrierkombination mit FreshSense und NoFrost',
    features: ['FreshSense-Technologie', 'NoFrost', '324 Liter Volumen', 'VitaFresh-Zone', 'LED-Beleuchtung'],
    specs: [
      { key: 'Volumen', value: '324 Liter' },
      { key: 'Kühltechnologie', value: 'FreshSense + NoFrost' },
      { key: 'Kühlschrank', value: '238 Liter' },
      { key: 'Gefrierfach', value: '86 Liter' },
      { key: 'Abmessungen', value: '60 x 186 x 65 cm' },
    ],
  },
  {
    slug: 'bosch-serie6-trockner-wtu876680',
    description: `Der Bosch Serie 6 Trockner WTU876680 ist ein Wärmepumpentrockner mit AutoDry-Technologie. Die AutoDry-Technologie erkennt den Trocknungsgrad und stoppt automatisch. Die 9 kg Kapazität eignet sich für mittlere bis große Haushalte. Das A++ Energiesiegel sorgt für Energieeffizienz. Die 15 Programme bieten individuelle Einstellungen. Die SelfCleaning-Condenser reinigt den Kondensator automatisch. Das elegante Design passt in jede Küche. Perfekt für effizientes Trocknen.`,
    shortDesc: 'Bosch-Wärmepumpentrockner mit AutoDry und 9 kg Kapazität',
    features: ['AutoDry-Technologie', '9 kg Kapazität', 'A++ Energiesiegel', 'SelfCleaning-Condenser', '15 Programme'],
    specs: [
      { key: 'Kapazität', value: '9 kg' },
      { key: 'Trocknungsart', value: 'Wärmepumpe' },
      { key: 'Energieklasse', value: 'A++' },
      { key: 'Programme', value: '15' },
      { key: 'Abmessungen', value: '60 x 85 x 65 cm' },
    ],
  },
  {
    slug: 'bosch-serie6-waschmaschine-wau28568',
    description: `Die Bosch Serie 6 Waschmaschine WAU28568 ist eine Premium-Waschmaschine mit i-DOS-Technologie. Die i-DOS-Technologie dosiert Waschmittel automatisch präzise. Die 9 kg Kapazität eignet sich für mittlere Haushalte. Die 1400 U/min Schleuderung sorgt für optimale Ergebnisse. Das A+++ Energiesiegel sorgt für Energieeffizienz. Die ActiveOxygen-Technologie entfernt Gerüche effektiv. Die Home-Connect-App ermöglicht die Fernbedienung. Das Premium-Modell für gründliches Waschen.`,
    shortDesc: 'Bosch-Premium-Waschmaschine mit i-DOS und ActiveOxygen',
    features: ['i-DOS-Automatikdosierung', 'ActiveOxygen', '9 kg Kapazität', '1400 U/min', 'Home Connect App'],
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
    slug: 'bosch-serie8-waschmaschine-wau285680',
    description: `Die Bosch Serie 8 Waschmaschine WAU285680 ist die neueste Premium-Waschmaschine mit i-DOS und ActiveOxygen. Die i-DOS-Technologie dosiert Waschmittel automatisch präzise. Die ActiveOxygen-Technologie entfernt Gerüche effektiv. Die 9 kg Kapazität eignet sich für mittlere Haushalte. Die 1400 U/min Schleuderung sorgt für optimale Ergebnisse. Das A+++ Energiesiegel sorgt für Energieeffizienz. Die Home-Connect-App ermöglicht die Fernbedienung. Die neueste Generation für maximale Ansprüche.`,
    shortDesc: 'Neueste Bosch-Premium-Waschmaschine mit i-DOS und ActiveOxygen',
    features: ['i-DOS + ActiveOxygen', '9 kg Kapazität', '1400 U/min', 'A+++ Energiesiegel', 'Home Connect App'],
    specs: [
      { key: 'Kapazität', value: '9 kg' },
      { key: 'Schleuderdrehzahl', value: '1400 U/min' },
      { key: 'Energieklasse', value: 'A+++' },
      { key: 'Dosierung', value: 'i-DOS' },
      { key: 'Technologie', value: 'ActiveOxygen' },
      { key: 'Abmessungen', value: '60 x 85 x 60 cm' },
    ],
  },
  {
    slug: 'bosch-unlimited-serie8-bss81pob',
    description: `Der Bosch Unlimited Serie 8 BSS81POB ist ein Premium-kabelloser Akkusauger mit Exchangeable-Battery-System. Die austauschbare Batterie ermöglicht unbegrenzte Laufzeit. Die AllFloor-HighPower-Bürste sorgt für gründliches Saugen. Die LED-Beleuchtung am Saugkopf macht Staub sichtbar. Die multiple Ausstattung bietet Werkzeuge für jeden Einsatzzweck. Die Wandhalterung sorgt für platzsparende Aufbewahrung. Das Premium-Design in various Farben passt zu jeder Haushaltsführung. Das absolute Flaggschiff für kabelloses Saugen.`,
    shortDesc: 'Premium-kabelloser Akkusauger mit austauschbarer Batterie',
    features: ['Exchangeable-Battery-System', 'AllFloor-HighPower', 'LED-Beleuchtung', 'Multiple Werkzeuge', 'Premium-Design'],
    specs: [
      { key: 'Akku', value: '18V Li-Ionen (austauschbar)' },
      { key: 'Laufzeit', value: 'Bis zu 40 Minuten (pro Batterie)' },
      { key: 'Gewicht', value: '3,0 kg' },
      { key: 'Farbe', value: 'Anthrazit/Gold' },
    ],
  },
  {
    slug: 'comfee-mpph-07crn7',
    description: `Die Comfee MPPH-07CRN7 ist ein tragbarer Luftkühler für kleine Räume. Die 7000 BTU Kühlleistung kühlt Räume bis zu 15 m². Die 3 Kühlstufen bieten individuelle Einstellungen. Die Luftentfeuchtungsfunktion reduziert die Luftfeuchtigkeit. Die Fernbedienung ermöglicht bequeme Steuerung. Das kompakte Design mit Rollen ermöglicht einfache Bewegung. Die_Timer-Funktion ermöglicht automatisches Ein- und Ausschalten. Perfekt für kleine Räume und single Wohnungen.`,
    shortDesc: 'Tragbarer Luftkühler mit 7000 BTU und Fernbedienung',
    features: ['7000 BTU Kühlleistung', '3 Kühlstufen', 'Luftentfeuchtung', 'Fernbedienung', 'Tragbar mit Rollen'],
    specs: [
      { key: 'Kühlleistung', value: '7000 BTU' },
      { key: 'Raumgröße', value: 'Bis zu 15 m²' },
      { key: 'Funktionen', value: 'Kühlen, Entfeuchten, Lüften' },
      { key: 'Lautstärke', value: '55 dB(A)' },
      { key: 'Farbe', value: 'Weiß' },
    ],
  },
  {
    slug: 'comfee-mpph-12crn7',
    description: `Die Comfee MPPH-12CRN7 ist ein tragbarer Luftkühler für mittlere Räume. Die 12000 BTU Kühlleistung kühlt Räume bis zu 25 m². Die 3 Kühlstufen bieten individuelle Einstellungen. Die Luftentfeuchtungsfunktion reduziert die Luftfeuchtigkeit. Die Fernbedienung ermöglicht bequeme Steuerung. Das kompakte Design mit Rollen ermöglicht einfache Bewegung. Die_Timer-Funktion ermöglicht automatisches Ein- und Ausschalten. Perfekt für mittlere Räume.`,
    shortDesc: 'Tragbarer Luftkühler mit 12000 BTU für mittlere Räume',
    features: ['12000 BTU Kühlleistung', '3 Kühlstufen', 'Luftentfeuchtung', 'Fernbedienung', 'Tragbar mit Rollen'],
    specs: [
      { key: 'Kühlleistung', value: '12000 BTU' },
      { key: 'Raumgröße', value: 'Bis zu 25 m²' },
      { key: 'Funktionen', value: 'Kühlen, Entfeuchten, Lüften' },
      { key: 'Lautstärke', value: '56 dB(A)' },
      { key: 'Farbe', value: 'Weiß' },
    ],
  },
  {
    slug: 'electrolux-800-animalcare',
    description: `Der Electrolux 800 AnimalCare ist ein kabelloser Akkusauger für Tierhaarbesitzer. Die PowerPro-Bürste entfernt Tierhaare gründlich. Die 18V-Li-Ionen-Batterie bietet bis zu 50 Minuten Laufzeit. Die LED-Beleuchtung am Saugkopf macht Staub in dunklen Ecken sichtbar. Die Easy-Empty-Entleerung erfordert keinen Kontakt mit Staub. Die Wandhalterung sorgt für platzsparende Aufbewahrung. Das elegante Design passt zu jeder Haushaltsführung. Perfekt für Tierbesitzer.`,
    shortDesc: 'Kabelloser Akkusauger mit PowerPro-Bürste für Tierhaar',
    features: ['PowerPro-Bürste', '50 Min. Laufzeit', 'LED-Beleuchtung', 'Easy-Empty-Entleerung', 'Wandhalterung'],
    specs: [
      { key: 'Akku', value: '18V Li-Ionen' },
      { key: 'Laufzeit', value: 'Bis zu 50 Minuten' },
      { key: 'Gewicht', value: '2,9 kg' },
      { key: 'Besonderheit', value: 'Tierhaar-optimiert' },
      { key: 'Farbe', value: 'Titan/Dunkelgrau' },
    ],
  },
  {
    slug: 'electrolux-eeq53200l',
    description: `Die Electrolux EEQ53200L ist ein kompakter Geschirrspüler mit 6 Gedecken. Die 5 Programme bieten individuelle Wascheinstellungen. Die A+++ Energiesiegel sorgt für Energieeffizienz. Die kompakte Bauform von 45 cm Breite passt in jede Küche. Die ChildLock-Sicherheit verhindert unbeabsichtigtes Öffnen. Die einfache Installation erfordert keine professionelle Montage. Perfekt für kleine Küchen und single Haushalte.`,
    shortDesc: 'Kompakter Electrolux-Geschirrspüler mit 6 Gedecken',
    features: ['6 Gedecke Kapazität', '5 Programme', 'A+++ Energiesiegel', '45 cm Breite', 'ChildLock'],
    specs: [
      { key: 'Kapazität', value: '6 Gedecke' },
      { key: 'Energieklasse', value: 'A+++' },
      { key: 'Programme', value: '5' },
      { key: 'Breite', value: '45 cm' },
      { key: 'Abmessungen', value: '45 x 82 x 55 cm' },
    ],
  },
  {
    slug: 'haier-hw100-b1439f5-waschmaschine',
    description: `Die Haier HW100-B1439F5 ist eine Premium-Waschmaschine mit Direct-Motion-Motor. Die Direct-Motion-Technologie arbeitet besonders leise und langlebig. Die 10 kg Kapazität eignet sich für große Haushalte. Die 1400 U/min Schleuderung sorgt für optimale Ergebnisse. Das A+++ Energiesiegel sorgt für Energieeffizienz. Die Anti-Allergie-Option entfernt Allergene effektiv. Die Steam-Option erfrischt Wäsche mit Dampf. Perfekt für leises und gründliches Waschen.`,
    shortDesc: 'Haier-Premium-Waschmaschine mit Direct-Motion und 10 kg',
    features: ['Direct-Motion-Motor', '10 kg Kapazität', '1400 U/min', 'A+++ Energiesiegel', 'Steam-Option'],
    specs: [
      { key: 'Kapazität', value: '10 kg' },
      { key: 'Schleuderdrehzahl', value: '1400 U/min' },
      { key: 'Energieklasse', value: 'A+++' },
      { key: 'Motor', value: 'Direct-Motion' },
      { key: 'Programme', value: '16' },
      { key: 'Abmessungen', value: '60 x 85 x 60 cm' },
    ],
  },
  {
    slug: 'lg-df455hms-kompakt',
    description: `Der LG DF455HMS Kompakt ist ein kompakter Einbau-Kühlschrank mit NoFrost-Technologie. Die NoFrost-Technologie verhindert automatisch Eisbildung. Die Multi-Airflow-Technologie sorgt für gleichmäßige Kühlung. Die 226 Liter Volumen bietet ausreichend Platz. Die LED-Beleuchtung sorgt für optimale Sicht. Das Einbau-Design passt in jede Küchenzeile. Perfekt für plaque sparende Kühlung.`,
    shortDesc: 'Kompakter LG-Einbau-Kühlschrank mit NoFrost und 226L',
    features: ['NoFrost', 'Multi-Airflow', '226 Liter Volumen', 'LED-Beleuchtung', 'Einbau-Design'],
    specs: [
      { key: 'Volumen', value: '226 Liter' },
      { key: 'Kühltechnologie', value: 'NoFrost' },
      { key: 'Luftzirkulation', value: 'Multi-Airflow' },
      { key: 'Energieklasse', value: 'A++' },
      { key: 'Abmessungen', value: '56 x 177 x 55 cm' },
    ],
  },
  {
    slug: 'lg-full-size-df455hms',
    description: `Der LG Full-Size DF455HMS ist ein freistehender Kühlschrank-Gefrierkombination mit NoFrost-Technologie. Die NoFrost-Technologie verhindert automatisch Eisbildung. Die Multi-Airflow-Technologie sorgt für gleichmäßige Kühlung. Die 384 Liter Volumen bietet ausreichend Platz. Die LED-Beleuchtung sorgt für optimale Sicht. Das elegante Design passt in jede Küche. Perfekt für Kombination aus Kühlung und Gefrierung.`,
    shortDesc: 'LG-Kühlschrank-Gefrierkombination mit NoFrost und 384L',
    features: ['NoFrost', 'Multi-Airflow', '384 Liter Volumen', 'LED-Beleuchtung', 'Elegantes Design'],
    specs: [
      { key: 'Volumen', value: '384 Liter' },
      { key: 'Kühltechnologie', value: 'NoFrost' },
      { key: 'Kühlschrank', value: '296 Liter' },
      { key: 'Gefrierfach', value: '88 Liter' },
      { key: 'Abmessungen', value: '60 x 185 x 65 cm' },
    ],
  },
  {
    slug: 'lg-instaview-range-lsel6337f',
    description: `Der LG InstaView Range LSEL6337F ist ein Premium-Elektroherd mit Ceranfeld und Backofen. Das Ceranfeld bietet 5 Kochfelder für flexibles Kochen. Der Backofen bietet 6 Funktionen inkl. Heißluft. Die InstaView-Technologie zeigt den Ofeninhalt durch die Tür. Die ProBake-Convection sorgt für gleichmäßiges Backen. Die Smart-Things-App ermöglicht die Fernbedienung. Das elegante Design passt in moderne Küchen. Perfekt für anspruchsvolles Kochen und Backen.`,
    shortDesc: 'Premium-Elektroherd mit InstaView und ProBake-Convection',
    features: ['InstaView-Technologie', 'ProBake-Convection', '5 Kochfelder', '6 Backofenfunktionen', 'SmartThings App'],
    specs: [
      { key: 'Kochfeld', value: 'Ceran 5 Felder' },
      { key: 'Backofen', value: '6 Funktionen inkl. Heißluft' },
      { key: 'Technologie', value: 'InstaView, ProBake' },
      { key: 'Steuerung', value: 'SmartThings App' },
      { key: 'Breite', value: '60 cm' },
    ],
  },
  {
    slug: 'lg-turbowash-wv9-1412w',
    description: `Die LG TurboWash WV9-1412W ist eine Premium-Waschmaschine mit TurboWash-Funktion. Die TurboWash-Funktion verkürzt die Waschzeit um bis zu 59 Minuten. Die 14 kg Kapazität eignet sich für große Familien. Die 1400 U/min Schleuderung sorgt für optimale Ergebnisse. Das A+++ Energiesiegel sorgt für Energieeffizienz. Die Steam-Funktion erfrischt Wäsche mit Dampf. Die Smart-ThinQ-App ermöglicht die Fernbedienung. Das Premium-Modell für schnelles Waschen.`,
    shortDesc: 'LG-Premium-Waschmaschine mit TurboWash und 14 kg Kapazität',
    features: ['TurboWash (59 Min.)', '14 kg Kapazität', '1400 U/min', 'A+++ Energiesiegel', 'SmartThinQ App'],
    specs: [
      { key: 'Kapazität', value: '14 kg' },
      { key: 'Schleuderdrehzahl', value: '1400 U/min' },
      { key: 'Energieklasse', value: 'A+++' },
      { key: 'Technologie', value: 'TurboWash' },
      { key: 'Programme', value: '16' },
      { key: 'Abmessungen', value: '60 x 85 x 60 cm' },
    ],
  },
  {
    slug: 'lg-waschmaschine-f4wr711s2ha',
    description: `Die LG Waschmaschine F4WR711S2HA ist eine Premium-Waschmaschine mit TurboWash-Funktion. Die TurboWash-Funktion verkürzt die Waschzeit um bis zu 59 Minuten. Die 11 kg Kapazität eignet sich für mittlere bis große Familien. Die 1400 U/min Schleuderung sorgt für optimale Ergebnisse. Das A+++ Energiesiegel sorgt für Energieeffizienz. Die Steam-Funktion erfrischt Wäsche mit Dampf. Die Smart-ThinQ-App ermöglicht die Fernbedienung. Perfekt für schnelles Waschen.`,
    shortDesc: 'LG-Waschmaschine mit TurboWash und 11 kg Kapazität',
    features: ['TurboWash (59 Min.)', '11 kg Kapazität', '1400 U/min', 'A+++ Energiesiegel', 'SmartThinQ App'],
    specs: [
      { key: 'Kapazität', value: '11 kg' },
      { key: 'Schleuderdrehzahl', value: '1400 U/min' },
      { key: 'Energieklasse', value: 'A+++' },
      { key: 'Technologie', value: 'TurboWash' },
      { key: 'Programme', value: '14' },
      { key: 'Abmessungen', value: '60 x 85 x 60 cm' },
    ],
  },
  {
    slug: 'lg-washtower-p9wba',
    description: `Der LG WashTower P9WBA ist ein kombinierter Waschtürme mit Waschmaschine und Wärmepumpentrockner. Die Kombination spart Platz durch vertikales Design. Die Waschmaschine bietet 13 kg Kapazität. Der Trockner bietet 10 kg Kapazität mit Wärmepumpe. Die Smart-ThinQ-App ermöglicht die Fernbedienung beider Geräte. Das elegante Design passt in jede Küche. Perfekt für platzsparende Wasch- und Trocknungslösung.`,
    shortDesc: 'Kombinierter Waschturm mit 13kg Waschen und 10kg Trocknen',
    features: ['Waschturm-Kombination', '13 kg Waschen', '10 kg Trocknen', 'Wärmepumpe', 'SmartThinQ App'],
    specs: [
      { key: 'Waschkapazität', value: '13 kg' },
      { key: 'Trocknungskapazität', value: '10 kg' },
      { key: 'Trocknungsart', value: 'Wärmepumpe' },
      { key: 'Steuerung', value: 'SmartThinQ App' },
      { key: 'Abmessungen', value: '60 x 166 x 65 cm' },
    ],
  },
  {
    slug: 'liebherr-komfort-kcbnesf3666',
    description: `Der Liebherr Komfort KCBNesf3666 ist ein freistehender Kühlschrank-Gefrierkombination mit BioFresh-Technologie. Die BioFresh-Technologie hält Lebensmittel besonders frisch. Die NoFrost-Technologie verhindert automatisch Eisbildung. Die 359 Liter Volumen bietet ausreichend Platz. Die LED-Beleuchtung sorgt für optimale Sicht. Die FrostSafe-Technologie schützt vor Temperaturschwankungen. Das elegante Design passt in jede Küche. Perfekt für frische Lebensmittel.`,
    shortDesc: 'Liebherr-Kühlschrank mit BioFresh, NoFrost und 359L',
    features: ['BioFresh-Technologie', 'NoFrost', '359 Liter Volumen', 'FrostSafe', 'LED-Beleuchtung'],
    specs: [
      { key: 'Volumen', value: '359 Liter' },
      { key: 'Kühltechnologie', value: 'BioFresh + NoFrost' },
      { key: 'Kühlschrank', value: '264 Liter' },
      { key: 'Gefrierfach', value: '95 Liter' },
      { key: 'Abmessungen', value: '60 x 185 x 65 cm' },
    ],
  },
  {
    slug: 'liebherr-mono-kef3566-gefrierschrank',
    description: `Der Liebherr Mono KEF3566 Gefrierschrank ist ein freistehender Gefrierschrank mit NoFrost-Technologie. Die NoFrost-Technologie verhindert automatisch Eisbildung. Die FrostSafe-Technologie schützt vor Temperaturschwankungen. Die 354 Liter Volumen bietet ausreichend Platz. Die LED-Beleuchtung sorgt für optimale Sicht. Die SoftMotion-Dämpfer ermöglichen sanftes Öffnen und Schließen. Das elegante Design passt in jede Küche. Perfekt für plaque sparende Gefrierung.`,
    shortDesc: 'Freistehender Gefrierschrank mit NoFrost und 354L',
    features: ['NoFrost', 'FrostSafe', '354 Liter Volumen', 'SoftMotion-Dämpfer', 'LED-Beleuchtung'],
    specs: [
      { key: 'Volumen', value: '354 Liter' },
      { key: 'Gefriertechnologie', value: 'NoFrost' },
      { key: 'Energieklasse', value: 'A++' },
      { key: 'Abmessungen', value: '60 x 185 x 65 cm' },
    ],
  },
  {
    slug: 'liebherr-mono-sgne5226',
    description: `Der Liebherr Mono SGNe5226 ist ein freistehender Kühlschrank-Gefrierkombination mit SmartDevice-Technologie. Die SmartDevice-Technologie ermöglicht die Fernbedienung per Smartphone. Die BioFresh-Technologie hält Lebensmittel besonders frisch. Die 388 Liter Volumen bietet ausreichend Platz. Die LED-Beleuchtung sorgt für optimale Sicht. Die NoFrost-Technologie verhindert automatisch Eisbildung. Das elegante Design passt in jede Küche. Perfekt für vernetzte Kühlung.`,
    shortDesc: 'Liebherr-Kombination mit SmartDevice, BioFresh und 388L',
    features: ['SmartDevice-Technologie', 'BioFresh', 'NoFrost', '388 Liter Volumen', 'LED-Beleuchtung'],
    specs: [
      { key: 'Volumen', value: '388 Liter' },
      { key: 'Kühltechnologie', value: 'BioFresh + NoFrost' },
      { key: 'Steuerung', value: 'SmartDevice App' },
      { key: 'Energieklasse', value: 'A++' },
      { key: 'Abmessungen', value: '60 x 185 x 65 cm' },
    ],
  },
  {
    slug: 'liebherr-monokuhlschrank-kbes3660',
    description: `Der Liebherr Monokühlschrank KBes3660 ist ein freistehender Kühlschrank mit BioFresh-Technologie. Die BioFresh-Technologie hält Lebensmittel besonders frisch. Die 354 Liter Volumen bietet ausreichend Platz. Die LED-Beleuchtung sorgt für optimale Sicht. Die FrostSafe-Technologie schützt vor Temperaturschwankungen. Das elegante Design passt in jede Küche. Perfekt für frische Lebensmittel.`,
    shortDesc: 'Liebherr-Monokühlschrank mit BioFresh und 354L',
    features: ['BioFresh-Technologie', '354 Liter Volumen', 'FrostSafe', 'LED-Beleuchtung', 'Elegantes Design'],
    specs: [
      { key: 'Volumen', value: '354 Liter' },
      { key: 'Kühltechnologie', value: 'BioFresh' },
      { key: 'Energieklasse', value: 'A++' },
      { key: 'Abmessungen', value: '60 x 185 x 65 cm' },
    ],
  },
  {
    slug: 'liebherr-premium-comfort-kgn36vi3',
    description: `Der Liebherr Premium Comfort KGN36Vi3 ist ein Premium-Kühlschrank-Gefrierkombination mit BioFresh- und NoFrost-Technologie. Die BioFresh-Technologie hält Lebensmittel besonders frisch. Die NoFrost-Technologie verhindert automatisch Eisbildung. Die 348 Liter Volumen bietet ausreichend Platz. Die LED-Beleuchtung sorgt für optimale Sicht. Die SoftMotion-Dämpfer ermöglichen sanftes Öffnen. Das Premium-Design passt in jede moderne Küche. Das absolute Flaggschiff für Kühlung.`,
    shortDesc: 'Premium-Liebherr-Kombination mit BioFresh, NoFrost und 348L',
    features: ['BioFresh + NoFrost', '348 Liter Volumen', 'SoftMotion-Dämpfer', 'Premium-Design', 'LED-Beleuchtung'],
    specs: [
      { key: 'Volumen', value: '348 Liter' },
      { key: 'Kühltechnologie', value: 'BioFresh + NoFrost' },
      { key: 'Kühlschrank', value: '253 Liter' },
      { key: 'Gefrierfach', value: '95 Liter' },
      { key: 'Abmessungen', value: '60 x 185 x 65 cm' },
    ],
  },
  {
    slug: 'midea-air-cool-maw08v1qwt',
    description: `Die Midea Air Cool MAW08V1QWT ist ein tragbarer Luftkühler für kleine Räume. Die 8000 BTU Kühlleistung kühlt Räume bis zu 18 m². Die 3 Kühlstufen bieten individuelle Einstellungen. Die Luftentfeuchtungsfunktion reduziert die Luftfeuchtigkeit. Die Fernbedienung ermöglicht bequeme Steuerung. Das kompakte Design mit Rollen ermöglicht einfache Bewegung. Die_Timer-Funktion ermöglicht automatisches Ein- und Ausschalten. Perfekt für kleine Räume.`,
    shortDesc: 'Tragbarer Luftkühler mit 8000 BTU für kleine Räume',
    features: ['8000 BTU Kühlleistung', '3 Kühlstufen', 'Luftentfeuchtung', 'Fernbedienung', 'Tragbar mit Rollen'],
    specs: [
      { key: 'Kühlleistung', value: '8000 BTU' },
      { key: 'Raumgröße', value: 'Bis zu 18 m²' },
      { key: 'Funktionen', value: 'Kühlen, Entfeuchten, Lüften' },
      { key: 'Lautstärke', value: '54 dB(A)' },
      { key: 'Farbe', value: 'Weiß' },
    ],
  },
  {
    slug: 'miele-scout-rx3-home-vision',
    description: `Der Miele Scout RX3 Home Vision ist ein intelligenter Saugroboter mit 3D-Navigation. Die 3D-Navigation erkennt Hindernisse und plant optimale Reinigungswege. Die 3000 Pa Saugkraft entfernt Staub und Schmutz gründlich. Die Wischfunktion reinigt den Boden feucht. Die App-Steuerung ermöglicht die Fernbedienung von überall. Die Home Vision-Kamera zeigt den Live-Feed des Roboters. Die automatische Rückkehrladung ist standard. Das Premium-Modell für automatische Reinigung.`,
    shortDesc: 'Miele-Saugroboter mit 3D-Navigation und Home Vision',
    features: ['3D-Navigation', '3000 Pa Saugkraft', 'Wischfunktion', 'Home Vision-Kamera', 'App-Steuerung'],
    specs: [
      { key: 'Saugkraft', value: '3000 Pa' },
      { key: 'Navigation', value: '3D' },
      { key: 'Laufzeit', value: 'Bis zu 120 Minuten' },
      { key: 'Wasserbehälter', value: '200 ml' },
      { key: 'Farbe', value: 'Weiß' },
    ],
  },
  {
    slug: 'miele-ta-2650-wp',
    description: `Die Miele TA 2650 WP ist ein hochwertiger Wäschetrockner mit Wärmepumpe. Die Wärmepumpe nutzt Restwärme für energieeffizientes Trocknen. Die 6 kg Kapazität eignet sich für kleine bis mittlere Haushalte. Das A++ Energiesiegel sorgt für Energieeffizienz. Die Sensorentrocknung erkennt den Trocknungsgrad. Die 12 Programme bieten individuelle Einstellungen. Das kompakte Design passt in jede Küche. Perfekt für effizientes Trocknen.`,
    shortDesc: 'Miele-Wärmepumpentrockner mit 6 kg Kapazität und A++',
    features: ['Wärmepumpe', '6 kg Kapazität', 'A++ Energiesiegel', 'Sensorentrocknung', '12 Programme'],
    specs: [
      { key: 'Kapazität', value: '6 kg' },
      { key: 'Trocknungsart', value: 'Wärmepumpe' },
      { key: 'Energieklasse', value: 'A++' },
      { key: 'Programme', value: '12' },
      { key: 'Abmessungen', value: '60 x 85 x 65 cm' },
    ],
  },
  {
    slug: 'ninja-detect-duo-cordless',
    description: `Der Ninja Detect Duo Cordless ist ein kabelloser Akkusauger mit Detect-Technologie. Die Detect-Technologie erkennt不同e Böden und passt die Saugleistung an. Die 2 Batterien bieten bis zu 80 Minuten Laufzeit. Die Power-Funktion erhöht die Saugleistung für schwere Verschmutzungen. Die multiple Ausstattung bietet Werkzeuge für jeden Einsatzzweck. Die Wandhalterung sorgt für platzsparende Aufbewahrung. Das elegante Design passt zu jeder Haushaltsführung. Perfekt für vielseitiges Saugen.`,
    shortDesc: 'Kabelloser Ninja-Akkusauger mit Detect-Technologie und 80 Min.',
    features: ['Detect-Technologie', '2 Batterien (80 Min.)', 'Power-Funktion', 'Multiple Werkzeuge', 'Wandhalterung'],
    specs: [
      { key: 'Laufzeit', value: 'Bis zu 80 Minuten' },
      { key: 'Technologie', value: 'Detect' },
      { key: 'Gewicht', value: '3,5 kg' },
      { key: 'Farbe', value: 'Anthrazit' },
    ],
  },
  {
    slug: 'ninja-speedi-sp101eu',
    description: `Der Ninja Speedi SP101EU ist ein multifunktionaler Heißluft-Fritteuse mit Speedi-Technologie. Die Speedi-Technologie kocht bis zu 30% schneller als herkömmliche Methoden. Die 10 Funktionen bieten maximale Vielseitigkeit. Die schnelle Erhitzung spart Zeit und Energie. Die abnehmbaren Teile sind spülmaschinenfest. Die integrierte Timer-Funktion ermöglicht automatisches Garen. Das kompakte Design passt in jede Küche. Perfekt für schnelles und gesundes Garen.`,
    shortDesc: 'Ninja-Heißluft-Fritteuse mit Speedi und 10 Funktionen',
    features: ['Speedi-Technologie (30% schneller)', '10 Funktionen', 'Schnelle Erhitzung', 'Timer-Funktion', 'Spülmaschinenfeste Teile'],
    specs: [
      { key: 'Kapazität', value: '3,8 Liter' },
      { key: 'Funktionen', value: '10' },
      { key: 'Leistung', value: '1750 Watt' },
      { key: 'Temperaturbereich', value: '40-240°C' },
      { key: 'Farbe', value: 'Schwarz' },
    ],
  },
  {
    slug: 'philips-8000-series-led',
    description: `Die Philips 8000 Series LED ist ein Premium-Traubsauger mit LED-Technologie. Die LED-Beleuchtung am Saugkopf macht Staub in dunklen Ecken sichtbar. Die 18V-Li-Ionen-Batterie bietet bis zu 60 Minuten Laufzeit. Die PowerBlade-Technologie sorgt für maximale Saugleistung. Die TriActive-Türbürste entfernt Staub gründlich. Die EasyClean-Technologie ermöglicht einfache Reinigung der Bürste. Die Wandhalterung sorgt für platzsparende Aufbewahrung. Das Premium-Modell für makellose Sauberkeit.`,
    shortDesc: 'Philips-Premium-Traubsauger mit LED und 60 Min. Laufzeit',
    features: ['LED-Beleuchtung', '60 Min. Laufzeit', 'PowerBlade-Technologie', 'TriActive-Bürste', 'EasyClean'],
    specs: [
      { key: 'Akku', value: '18V Li-Ionen' },
      { key: 'Laufzeit', value: 'Bis zu 60 Minuten' },
      { key: 'Technologie', value: 'PowerBlade' },
      { key: 'Gewicht', value: '3,4 kg' },
      { key: 'Farbe', value: 'Anthrazit' },
    ],
  },
  {
    slug: 'philips-powerproactive',
    description: `Die Philips PowerProActive ist ein kabelloser Akkusauger mit PowerCyclone-Technologie. Die PowerCyclone-Technologie erzeugt starke Saugkraft. Die 18V-Li-Ionen-Batterie bietet bis zu 50 Minuten Laufzeit. Die LED-Beleuchtung am Saugkopf macht Staub sichtbar. Die TriActive-Bürste entfernt Staub gründlich. Die Easy-Entleerung erfordert keinen Kontakt mit Staub. Die Wandhalterung sorgt für platzsparende Aufbewahrung. Perfekt für alltägliches Saugen.`,
    shortDesc: 'Kabelloser Philips-Akkusauger mit PowerCyclone und 50 Min.',
    features: ['PowerCyclone-Technologie', '50 Min. Laufzeit', 'LED-Beleuchtung', 'TriActive-Bürste', 'Wandhalterung'],
    specs: [
      { key: 'Akku', value: '18V Li-Ionen' },
      { key: 'Laufzeit', value: 'Bis zu 50 Minuten' },
      { key: 'Technologie', value: 'PowerCyclone' },
      { key: 'Gewicht', value: '3,0 kg' },
      { key: 'Farbe', value: 'Lila' },
    ],
  },
  {
    slug: 'sage-barista-express-impress',
    description: `Die Sage Barista Express Impress ist eine Premium-Espressomaschine mit integriertem Mahlwerk. Das Impression-Dosing-System misst die Bohnenmenge automatisch präzise. Das Kegelmahlwerk aus Edelstahl mahlt die Bohnen besonders schonend. Der Crona-Milchaufschäumer erzeugt cremigen Mikroschaum. Die 58mm-Brühgruppe sorgt für gleichmäßige Extraktion. Die PID-Temperaturregulation hält die Brühtemperatur konstant. Das elegante Design in Edelstahl passt in jede Küche. Das absolute Flaggschiff für Home-Baristas.`,
    shortDesc: 'Sage-Premium-Espressomaschine mit Impression-Dosing und 58mm-Gruppe',
    features: ['Impression-Dosing', '58mm Edelstahl-Brühgruppe', 'PID-Temperaturregulation', 'Crona-Milchaufschäumer', 'Edelstahl-Design'],
    specs: [
      { key: 'Brühgruppe', value: '58mm Edelstahl' },
      { key: 'Mahlwerk', value: 'Kegelmahlwerk' },
      { key: 'Temperaturregelung', value: 'PID' },
      { key: 'Wasserkapazität', value: '2,0 Liter' },
      { key: 'Leistung', value: '1600 Watt' },
      { key: 'Farbe', value: 'Edelstahl' },
    ],
  },
  {
    slug: 'sage-the-dual-boiler',
    description: `Die Sage The Dual Boiler ist eine Premium-Espressomaschine mit 2 Heizsystemen. Die 2 separaten Heizsysteme ermöglichen gleichzeitiges Brühen und Aufschäumen. Die 58mm-Brühgruppe aus Edelstahl sorgt für gleichmäßige Extraktion. Die PID-Temperaturregulation hält die Brühtemperatur konstant. Der Crona-Milchaufschäumer erzeugt cremigen Mikroschaum. Die Präzisions-Dosierung ermöglicht individuelle Einstellungen. Das elegante Design in Edelstahl passt in jede Küche. Das Premium-Modell für anspruchsvolle Baristas.`,
    shortDesc: 'Sage-Premium-Espressomaschine mit Dual Boiler und PID',
    features: ['Dual Boiler (2 Heizsysteme)', '58mm Brühgruppe', 'PID-Temperaturregelung', 'Crona-Milchaufschäumer', 'Präzisions-Dosierung'],
    specs: [
      { key: 'Brühgruppe', value: '58mm Edelstahl' },
      { key: 'Heizsystem', value: '2 separaten Thermojet' },
      { key: 'Temperaturregelung', value: 'PID' },
      { key: 'Wasserkapazität', value: '2,5 Liter' },
      { key: 'Leistung', value: '2400 Watt' },
      { key: 'Farbe', value: 'Edelstahl' },
    ],
  },
  {
    slug: 'sage-the-oracle-touch',
    description: `Die Sage The Oracle Touch ist die ultimative Premium-Espressomaschine mit Touchdisplay. Das 4-Zoll-Farbtouchdisplay zeigt alle Brühoptionen übersichtlich an. Die automatische Milchaufschäumung erzeugt in Sekunden perfekten Cappuccino-Schaum. Die 58mm-Brühgruppe aus Edelstahl sorgt für gleichmäßige Extraktion. Die PID-Temperaturregulation hält die Brühtemperatur konstant. Die 6 voreingestellten Spezialitäten bieten Vielseitigkeit. Das elegante Design in Edelstahl passt in jede Küche. Das absolute Flaggschiff für Home-Baristas.`,
    shortDesc: 'Sage-Flaggschiff mit Touchdisplay und automatischer Milchaufschäumung',
    features: ['4-Zoll-Touchdisplay', 'Automatische Milchaufschäumung', '58mm Brühgruppe', 'PID-Temperaturregelung', '6 Spezialitäten'],
    specs: [
      { key: 'Display', value: '4-Zoll Farbtouch' },
      { key: 'Brühgruppe', value: '58mm Edelstahl' },
      { key: 'Temperaturregelung', value: 'PID' },
      { key: 'Spezialitäten', value: '6 Sorten' },
      { key: 'Wasserkapazität', value: '2,5 Liter' },
      { key: 'Leistung', value: '2400 Watt' },
    ],
  },
  {
    slug: 'samsung-bespoke-jet-complete',
    description: `Der Samsung Bespoke Jet Complete ist ein kabelloser Akkusauger im Premium-Design. Die 210W Motorleistung sorgt für starke Saugkraft. Die 60 Minuten Laufzeit reicht für große Reinigungen. Die Multiple-Floor-Brush entfernt Staub von jedem Boden. Die LED-Beleuchtung am Saugkopf macht Staub sichtbar. Die easy-reach-Düse erreicht schwer zugängliche Stellen. Die automatische Rückkehrladung ist standard. Das elegante Bespoke-Design passt zu jeder Haushaltsführung.`,
    shortDesc: 'Samsung-Premium-Akkusauger mit 210W und Bespoke-Design',
    features: ['210W Motorleistung', '60 Min. Laufzeit', 'Multiple-Floor-Brush', 'LED-Beleuchtung', 'Bespoke-Design'],
    specs: [
      { key: 'Leistung', value: '210W' },
      { key: 'Laufzeit', value: 'Bis zu 60 Minuten' },
      { key: 'Gewicht', value: '2,7 kg' },
      { key: 'Farbe', value: 'Bespoke (verschiedene)' },
    ],
  },
  {
    slug: 'samsung-gefrierschrank-rz32r743601',
    description: `Der Samsung Gefrierschrank RZ32R743601 ist ein freistehender Gefrierschrank mit NoFrost-Technologie. Die NoFrost-Technologie verhindert automatisch Eisbildung. Die 324 Liter Volumen bietet ausreichend Platz. Die LED-Beleuchtung sorgt für optimale Sicht. Die SpaceMax-Technologie maximiert den Innenraum. Das elegante Design passt in jede Küche. Perfekt für plaque sparende Gefrierung.`,
    shortDesc: 'Samsung-Gefrierschrank mit NoFrost und 324L Volumen',
    features: ['NoFrost', '324 Liter Volumen', 'SpaceMax-Technologie', 'LED-Beleuchtung', 'Elegantes Design'],
    specs: [
      { key: 'Volumen', value: '324 Liter' },
      { key: 'Gefriertechnologie', value: 'NoFrost' },
      { key: 'Energieklasse', value: 'A++' },
      { key: 'Abmessungen', value: '60 x 185 x 65 cm' },
    ],
  },
  {
    slug: 'samsung-jet-bot-ai-plus-vr50t9990',
    description: `Der Samsung Jet Bot AI+ VR50T9990 ist ein intelligenter Saugroboter mit KI-Navigation. Die KI-Navigation erkennt Hindernisse und vermeidet Kollisionen. Die 5100 Pa Saugkraft entfernt Staub und Schmutz gründlich. Die 3D-Sensorik scannt den Raum in Echtzeit. Die automatische Staubertertiung bei满gedocktem Base-Station. Die App-Steuerung ermöglicht die Fernbedienung von überall. Die Live-View-Kamera zeigt den Live-Feed des Roboters. Das absolute Flaggschiff für automatische Reinigung.`,
    shortDesc: 'Samsung-Flaggschiff-Saugroboter mit KI und 5100 Pa Saugkraft',
    features: ['KI-Navigation', '5100 Pa Saugkraft', '3D-Sensorik', 'Live-View-Kamera', 'Automatische Entleerung'],
    specs: [
      { key: 'Saugkraft', value: '5100 Pa' },
      { key: 'Navigation', value: 'KI + 3D-Sensorik' },
      { key: 'Laufzeit', value: 'Bis zu 180 Minuten' },
      { key: 'Basisstation', value: 'Ja (automatische Entleerung)' },
      { key: 'Farbe', value: 'Weiß' },
    ],
  },
  {
    slug: 'samsung-side-by-side-rs758711dqp',
    description: `Der Samsung Side-by-Side RS758711DQP ist ein Premium-Kühlschrank mit Family-Hub-Technologie. Die Family-Hub-Technologie macht den Kühlschrank zum digitalen Herzstück. Die Twin Cooling Plus-Technologie hält Lebensmittel besonders frisch. Die 617 Liter Volumen bietet ausreichend Platz für große Familien. Die interne Kamera zeigt den Inhalt des Kühlschranks auf dem Smartphone. Das Side-by-Side-Design passt in moderne Küchen. Perfekt für große Familien.`,
    shortDesc: 'Samsung-Side-by-Side mit Family Hub und 617L',
    features: ['Family Hub', 'Twin Cooling Plus', '617 Liter Volumen', 'Interne Kamera', 'Side-by-Side-Design'],
    specs: [
      { key: 'Volumen', value: '617 Liter' },
      { key: 'Kühltechnologie', value: 'Twin Cooling Plus' },
      { key: 'Design', value: 'Side-by-Side' },
      { key: 'Steuerung', value: 'Family Hub Display' },
      { key: 'Abmessungen', value: '91 x 180 x 72 cm' },
    ],
  },
  {
    slug: 'samsung-tiefkuhlschrank-rt5000',
    description: `Der Samsung Tiefkühlschrank RT5000 ist ein freistehender Gefrierschrank mit NoFrost-Technologie. Die NoFrost-Technologie verhindert automatisch Eisbildung. Die 500 Liter Volumen bietet ausreichend Platz für große Familien. Die SpaceMax-Technologie maximiert den Innenraum. Die LED-Beleuchtung sorgt für optimale Sicht. Das elegante Design passt in jede Küche. Perfekt für plaque sparende Gefrierung.`,
    shortDesc: 'Samsung-Großtiefkühlschrank mit NoFrost und 500L',
    features: ['NoFrost', '500 Liter Volumen', 'SpaceMax-Technologie', 'LED-Beleuchtung', 'Elegantes Design'],
    specs: [
      { key: 'Volumen', value: '500 Liter' },
      { key: 'Gefriertechnologie', value: 'NoFrost' },
      { key: 'Energieklasse', value: 'A++' },
      { key: 'Abmessungen', value: '91 x 185 x 72 cm' },
    ],
  },
  {
    slug: 'sichler-pac-wk-10',
    description: `Die Sichler PAC WK 10 ist ein tragbarer Luftkühler für kleine Räume. Die 10000 BTU Kühlleistung kühlt Räume bis zu 20 m². Die 3 Kühlstufen bieten individuelle Einstellungen. Die Luftentfeuchtungsfunktion reduziert die Luftfeuchtigkeit. Die Fernbedienung ermöglicht bequeme Steuerung. Das kompakte Design mit Rollen ermöglicht einfache Bewegung. Die_Timer-Funktion ermöglicht automatisches Ein- und Ausschalten. Perfekt für kleine Räume.`,
    shortDesc: 'Tragbarer Luftkühler mit 10000 BTU und Fernbedienung',
    features: ['10000 BTU Kühlleistung', '3 Kühlstufen', 'Luftentfeuchtung', 'Fernbedienung', 'Tragbar mit Rollen'],
    specs: [
      { key: 'Kühlleistung', value: '10000 BTU' },
      { key: 'Raumgröße', value: 'Bis zu 20 m²' },
      { key: 'Funktionen', value: 'Kühlen, Entfeuchten, Lüften' },
      { key: 'Lautstärke', value: '55 dB(A)' },
      { key: 'Farbe', value: 'Weiß' },
    ],
  },
  {
    slug: 'siemens-iq300-sk26e820eu',
    description: `Die Siemens iQ300 SK26E820EU ist ein freistehender Kühlschrank-Gefrierkombination mit Multi-Airflow-System. Die Multi-Airflow-Technologie sorgt für gleichmäßige Kühlung. Die NoFrost-Technologie verhindert automatisch Eisbildung. Die 287 Liter Volumen bietet ausreichend Platz. Die LED-Beleuchtung sorgt für optimale Sicht. Die VarioDrawer-Schubladen bieten flexible Aufbewahrung. Das elegante Design passt in jede Küche. Perfekt für Kombination aus Kühlung und Gefrierung.`,
    shortDesc: 'Siemens-Kombination mit Multi-Airflow und NoFrost',
    features: ['Multi-Airflow', 'NoFrost', '287 Liter Volumen', 'VarioDrawer', 'LED-Beleuchtung'],
    specs: [
      { key: 'Volumen', value: '287 Liter' },
      { key: 'Kühltechnologie', value: 'Multi-Airflow + NoFrost' },
      { key: 'Kühlschrank', value: '205 Liter' },
      { key: 'Gefrierfach', value: '82 Liter' },
      { key: 'Abmessungen', value: '60 x 186 x 65 cm' },
    ],
  },
  {
    slug: 'siemens-kompakt-sk25ew800',
    description: `Die Siemens Kompakt SK25EW800 ist ein kompakter Einbau-Kühlschrank. Die 128 Liter Volumen bietet ausreichend Platz für kleine Haushalte. Die LED-Beleuchtung sorgt für optimale Sicht. Die individuellen Kühlschrank-Einstellungen ermöglichen Anpassungen. Das Einbau-Design passt in jede Küchenzeile. Perfekt für kleine Haushalte und single Wohnungen.`,
    shortDesc: 'Kompakter Siemens-Einbau-Kühlschrank mit 128L',
    features: ['128 Liter Volumen', 'LED-Beleuchtung', 'Individuelle Einstellungen', 'Einbau-Design', 'Kompakt'],
    specs: [
      { key: 'Volumen', value: '128 Liter' },
      { key: 'Kühltechnologie', value: 'Statisch' },
      { key: 'Energieklasse', value: 'A++' },
      { key: 'Abmessungen', value: '56 x 82 x 55 cm' },
    ],
  },
  {
    slug: 'vorwerk-kobold-vk200',
    description: `Der Vorwerk Kobold VK200 ist ein Premium-Staubsauger mit revolutionärer Reinigungstechnologie. Die Power-Brush VB1000 entfernt Staub und Schmutz gründlich. Die eigene Kinematik sorgt für optimale Bodenkontaktaufnahme. Die 2-in-1-Funktionalität ermöglicht das Saugen von Teppichen und Böden. Die kompakte Bauform lässt sich platzsparend aufbewahren. Die hohe Saugleistung entfernt selbst feinsten Staub. Das Premium-Design in various Farben passt zu jeder Haushaltsführung. Das Flaggschiff für makellose Sauberkeit.`,
    shortDesc: 'Vorwerk-Premium-Staubsauger mit Power-Brush und revolutionärer Technologie',
    features: ['Power-Brush VB1000', 'Eigene Kinematik', '2-in-1 Funktion', 'Hohe Saugleistung', 'Premium-Design'],
    specs: [
      { key: 'Technologie', value: 'Power-Brush VB1000' },
      { key: 'Saugleistung', value: 'Premium' },
      { key: 'Gewicht', value: '7,3 kg' },
      { key: 'Farbe', value: 'Verschiedene' },
    ],
  },
  {
    slug: 'vorwerk-kobold-vk200-plus',
    description: `Der Vorwerk Kobold VK200 Plus ist die Premium-Version des Kobold VK200 mit erweitertem Zubehör. Die Power-Brush VB1000 entfernt Staub und Schmutz gründlich. Die eigene Kinematik sorgt für optimale Bodenkontaktaufnahme. Die 2-in-1-Funktionalität ermöglicht das Saugen von Teppichen und Böden. Die kompakte Bauform lässt sich platzsparend aufbewahren. Die hohe Saugleistung entfernt selbst feinsten Staub. Das Premium-Design mit erweitertem Zubehör. Das ultimative Flaggschiff für makellose Sauberkeit.`,
    shortDesc: 'Vorwerk-Flaggschiff mit VB1000 und erweitertem Premium-Zubehör',
    features: ['Power-Brush VB1000', 'Erweitertes Premium-Zubehör', 'Eigene Kinematik', '2-in-1 Funktion', 'Ultimative Saugleistung'],
    specs: [
      { key: 'Technologie', value: 'Power-Brush VB1000' },
      { key: 'Saugleistung', value: 'Ultimativ' },
      { key: 'Zubehör', value: 'Erweitertes Premium-Paket' },
      { key: 'Gewicht', value: '7,5 kg' },
      { key: 'Farbe', value: 'Verschiedene' },
    ],
  },
];

async function main() {
  console.log(`\nMise à jour de ${updates.length} produits Haushaltsgeräte (Teil 2)...\n`);

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
