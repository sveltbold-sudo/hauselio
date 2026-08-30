import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const updates = [
  // === WASCHMASCHINEN ===
  {
    slug: 'aeg-lr9a80600-waschmaschine',
    description: `Die AEG LR9A80600 ist eine Premium-Waschmaschine mit ÖkoInverter-Motor und ProSense-Technologie. Die ProSense-Technologie passt Wasser- und Energieverbrauch automatisch an die Beladung an. Der ÖkoInverter-Motor arbeitet besonders leise und langlebig. Die HygieneOption tötet 99,9% der Bakterien ab. Die 1600 U/min Schleuderung sorgt für optimale Ergebnisse. Das A+++ Energiesiegel sorgt für Energieeffizienz. Die 8 kg Kapazität eignet sich für mittlere bis große Haushalte. Perfekt für anspruchsvolle Wäsche.`,
    shortDesc: 'Premium-Waschmaschine mit ProSense und ÖkoInverter (8 kg)',
    features: ['ProSense-Technologie', 'ÖkoInverter-Motor', 'HygieneOption', '1600 U/min', 'A+++ Energiesiegel'],
    specs: [
      { key: 'Kapazität', value: '8 kg' },
      { key: 'Schleuderdrehzahl', value: '1600 U/min' },
      { key: 'Energieklasse', value: 'A+++' },
      { key: 'Motor', value: 'ÖkoInverter' },
      { key: 'Wasserverbrauch', value: '10,9 Liter' },
      { key: 'Abmessungen', value: '60 x 85 x 60 cm' },
    ],
  },
  {
    slug: 'aeg-tr9a865r-trockner',
    description: `Der AEG TR9A865R ist ein Wärmepumpentrockner mit HarvestCycle-Technologie. Die HarvestCycle-Technologie nutzt Restwärme für energieeffizientes Trocknen. Der ÖkoInverter-Motor arbeitet besonders leise und langlebig. Die Sensorentrocknung erkennt den Trocknungsgrad und stoppt automatisch. Die 9 kg Kapazität eignet sich für mittlere bis große Haushalte. Das A++ Energiesiegel sorgt für Energieeffizienz. Die SelfCleaning-Condenser reinigt den Kondensator automatisch. Perfekt für effizientes Trocknen.`,
    shortDesc: 'Wärmepumpentrockner mit HarvestCycle und SelfCleaning-Condenser',
    features: ['HarvestCycle-Technologie', 'ÖkoInverter-Motor', 'Sensorentrocknung', 'SelfCleaning-Condenser', 'A++ Energiesiegel'],
    specs: [
      { key: 'Kapazität', value: '9 kg' },
      { key: 'Trocknungsart', value: 'Wärmepumpe' },
      { key: 'Energieklasse', value: 'A++' },
      { key: 'Motor', value: 'ÖkoInverter' },
      { key: 'Restfeuchte', value: 'Sensorgesteuert' },
      { key: 'Abmessungen', value: '60 x 85 x 65 cm' },
    ],
  },
  {
    slug: 'beko-wrs-55p12-sw-waschmaschine',
    description: `Die Beko WRS 55 P12 SW ist eine kompakte Waschmaschine mit ProSmart-Inverter-Motor. Die ProSmart-Technologie sorgt für leisen und energieeffizienten Betrieb. Die 15 Programme bieten individuelle Wascheinstellungen. Die 5 kg Kapazität eignet sich für kleine Haushalte. Das A+++ Energiesiegel sorgt für Energieeffizienz. Die 1200 U/min Schleuderung sorgt für optimale Ergebnisse. Das kompakte Design von 60 cm Breite passt in jede Küche. Perfekt für kleine Haushalte.`,
    shortDesc: 'Kompakte Waschmaschine mit ProSmart-Motor und 5 kg Kapazität',
    features: ['ProSmart-Inverter-Motor', '15 Programme', '5 kg Kapazität', 'A+++ Energiesiegel', 'Kompaktes Design'],
    specs: [
      { key: 'Kapazität', value: '5 kg' },
      { key: 'Schleuderdrehzahl', value: '1200 U/min' },
      { key: 'Energieklasse', value: 'A+++' },
      { key: 'Motor', value: 'ProSmart-Inverter' },
      { key: 'Programme', value: '15' },
      { key: 'Abmessungen', value: '60 x 85 x 45 cm' },
    ],
  },
  {
    slug: 'bosch-serie-4-sms4eci28f',
    description: `Die Bosch Serie 4 SMS4ECI28F ist eine Einbau-Geschirrspüler mit ActiveWater-Technologie. Die ActiveWater-Technologie nutzt Wasser effizient für optimale Reinigungsergebnisse. Die 3 Ladeebenen bieten flexible Belademöglichkeiten. Die 10 Programme und 4 Zusatzfunktionen bieten individuelle Einstellungen. Die A+++ Energiesiegel sorgt für Energieeffizienz. Das Zeitsprogramm ermöglicht die Verschiebung des Startzeitpunkts. Die AquaStop-Sicherheit verhindert Wasserschäden. Perfekt für sparsame und gründliche Reinigung.`,
    shortDesc: 'Einbau-Geschirrspüler mit ActiveWater und 3 Ladeebenen',
    features: ['ActiveWater-Technologie', '3 Ladeebenen', '10 Programme', 'A+++ Energiesiegel', 'AquaStop'],
    specs: [
      { key: 'Kapazität', value: '13 Gedecke' },
      { key: 'Energieklasse', value: 'A+++' },
      { key: 'Wasserverbrauch', value: '9,5 Liter' },
      { key: 'Programme', value: '10 + 4 Zusatzfunktionen' },
      { key: 'Ladeebenen', value: '3' },
      { key: 'Abmessungen', value: '60 x 82 x 55 cm' },
    ],
  },
  {
    slug: 'bosch-serie-4-smv6ecx22e',
    description: `Die Bosch Serie 4 SMV6ECX22E ist ein freistehender Geschirrspüler mit Zeolith-Trocknung. Die Zeolith-Trocknung sorgt für brillante Trocknungsergebnisse. Die VarioSpeed-Plus-Funktion verkürzt die Spüldauer um bis zu 66%. Die 3 Ladeebenen bieten flexible Belademöglichkeiten. Die 8 Programme und 4 Zusatzfunktionen bieten individuelle Einstellungen. Die A+++ Energiesiegel sorgt für Energieeffizienz. Die AquaStop-Sicherheit verhindert Wasserschäden. Perfekt für brillante Trocknung.`,
    shortDesc: 'Freistehender Geschirrspüler mit Zeolith-Trocknung und VarioSpeed',
    features: ['Zeolith-Trocknung', 'VarioSpeed-Plus', '3 Ladeebenen', 'A+++ Energiesiegel', 'AquaStop'],
    specs: [
      { key: 'Kapazität', value: '13 Gedecke' },
      { key: 'Energieklasse', value: 'A+++' },
      { key: 'Trocknungstechnologie', value: 'Zeolith' },
      { key: 'Programme', value: '8 + 4 Zusatzfunktionen' },
      { key: 'Ladeebenen', value: '3' },
      { key: 'Abmessungen', value: '60 x 85 x 60 cm' },
    ],
  },
  {
    slug: 'bosch-serie-6-wgg244z00',
    description: `Die Bosch Serie 6 WGG244Z00 ist eine freistehende Waschmaschine mit i-DOS-Technologie. Die i-DOS-Technologie dosiert Waschmittel automatisch präzise. Die 9 kg Kapazität eignet sich für mittlere bis große Haushalte. Die 1400 U/min Schleuderung sorgt für optimale Ergebnisse. Die A+++ Energiesiegel sorgt für Energieeffizienz. Die IronAssist-Funktion glättet Wäsche automatisch. Die Home-Connect-App ermöglicht die Fernbedienung. Perfekt für automatisches Waschen.`,
    shortDesc: 'Waschmaschine mit i-DOS-Automatikdosierung und 9 kg Kapazität',
    features: ['i-DOS-Automatikdosierung', 'IronAssist', 'Home Connect App', '1400 U/min', 'A+++ Energiesiegel'],
    specs: [
      { key: 'Kapazität', value: '9 kg' },
      { key: 'Schleuderdrehzahl', value: '1400 U/min' },
      { key: 'Energieklasse', value: 'A+++' },
      { key: 'Dosierung', value: 'i-DOS automatisch' },
      { key: 'Programme', value: '14' },
      { key: 'Abmessungen', value: '60 x 85 x 60 cm' },
    ],
  },
  {
    slug: 'bosch-serie4-einbau-kuhlschrank-kiv83vse0',
    description: `Der Bosch Serie 4 Einbau-Kühlschrank KIV83VSE0 ist ein Einbau-Kühlschrank mit NoFrost-Technologie. Die NoFrost-Technologie verhindert automatisch Eisbildung. Die MultiAirflow-Technologie sorgt für gleichmäßige Kühlung. Die 266 Liter Volumen bietet ausreichend Platz. Die LED-Beleuchtung sorgt für optimale Sicht. Die Energiespareinstellungen reduzieren den Stromverbrauch. Das Einbau-Design passt in jede Küchenzeile. Perfekt für plaque sparende Kühlung.`,
    shortDesc: 'Einbau-Kühlschrank mit NoFrost und MultiAirflow',
    features: ['NoFrost', 'MultiAirflow', '266 Liter Volumen', 'LED-Beleuchtung', 'Energiespareinstellungen'],
    specs: [
      { key: 'Volumen', value: '266 Liter' },
      { key: 'Kühltechnologie', value: 'NoFrost' },
      { key: 'Luftzirkulation', value: 'MultiAirflow' },
      { key: 'Energieklasse', value: 'A++' },
      { key: 'Abmessungen', value: '56 x 177 x 55 cm' },
    ],
  },
  {
    slug: 'bosch-serie4-gefrierschrank-gin31afe0p',
    description: `Der Bosch Serie 4 Gefrierschrank GIN31AFE0P ist ein Einbau-Gefrierschrank mit NoFrost-Technologie. Die NoFrost-Technologie verhindert automatisch Eisbildung. Die 3 Fachboxen bieten flexible Aufbewahrungsmöglichkeiten. Die 214 Liter Volumen bietet ausreichend Platz. Die LED-Beleuchtung sorgt für optimale Sicht. Die Energiespareinstellungen reduzieren den Stromverbrauch. Das Einbau-Design passt in jede Küchenzeile. Perfekt für plaque sparende Gefrierung.`,
    shortDesc: 'Einbau-Gefrierschrank mit NoFrost und 3 Fachboxen',
    features: ['NoFrost', '3 Fachboxen', '214 Liter Volumen', 'LED-Beleuchtung', 'Energiespareinstellungen'],
    specs: [
      { key: 'Volumen', value: '214 Liter' },
      { key: 'Gefriertechnologie', value: 'NoFrost' },
      { key: 'Fächer', value: '3 Fachboxen' },
      { key: 'Energieklasse', value: 'A++' },
      { key: 'Abmessungen', value: '56 x 177 x 55 cm' },
    ],
  },
  {
    slug: 'bosch-serie4-smv46mx01e',
    description: `Die Bosch Serie 4 SMV46MX01E ist ein freistehender Geschirrspüler mit ActiveWater-Technologie. Die ActiveWater-Technologie nutzt Wasser effizient für optimale Reinigungsergebnisse. Die 2 Ladeebenen bieten flexible Belademöglichkeiten. Die 6 Programme und 3 Zusatzfunktionen bieten individuelle Einstellungen. Die A+++ Energiesiegel sorgt für Energieeffizienz. Das Zeitsprogramm ermöglicht die Verschiebung des Startzeitpunkts. Die AquaStop-Sicherheit verhindert Wasserschäden. Perfekt für sparsame Reinigung.`,
    shortDesc: 'Freistehender Geschirrspüler mit ActiveWater und 2 Ladeebenen',
    features: ['ActiveWater-Technologie', '2 Ladeebenen', '6 Programme', 'A+++ Energiesiegel', 'AquaStop'],
    specs: [
      { key: 'Kapazität', value: '12 Gedecke' },
      { key: 'Energieklasse', value: 'A+++' },
      { key: 'Wasserverbrauch', value: '9,5 Liter' },
      { key: 'Programme', value: '6 + 3 Zusatzfunktionen' },
      { key: 'Ladeebenen', value: '2' },
      { key: 'Abmessungen', value: '60 x 85 x 60 cm' },
    ],
  },
  {
    slug: 'delonghi-multifry-fh1394',
    description: `Die De'Longhi Multifry FH1394 ist ein multifunktionaler Heißluft-Fritteuse mit 2 Kochbereichen. Die 2 Kochbereiche ermöglichen das Gleichzeitiges Zubereiten von 2 Gerichten. Die Heat-Distribution-Technologie sorgt für gleichmäßiges Garen. Die 2,5 Liter Kapazität eignet sich für kleine bis mittlere Portionen. Die abnehmbaren Teile sind spülmaschinenfest. Die einfache Bedienung mit Drehregler ist intuitiv. Das kompakte Design passt in jede Küche. Perfekt für gesundes Garen ohne viel Fett.`,
    shortDesc: 'Heißluft-Fritteuse mit 2 Kochbereichen und Heat-Distribution',
    features: ['2 Kochbereiche', 'Heat-Distribution-Technologie', '2,5 Liter Kapazität', 'Spülmaschinenfeste Teile', 'Einfache Bedienung'],
    specs: [
      { key: 'Kapazität', value: '2,5 Liter' },
      { key: 'Funktionen', value: 'Heißluft, Frittieren, Garen' },
      { key: 'Leistung', value: '1400 Watt' },
      { key: 'Temperaturbereich', value: '80-200°C' },
      { key: 'Kochbereiche', value: '2' },
      { key: 'Farbe', value: 'Schwarz' },
    ],
  },
  {
    slug: 'electrolux-ew7f348sg-waschmaschine',
    description: `Die Electrolux EW7F348SG ist eine Premium-Waschmaschine mit HeatPump-Technologie. Die Wärmepumpe nutzt Restwärme für energieeffizientes Waschen. Die 8 kg Kapazität eignet sich für mittlere Haushalte. Die 1400 U/min Schleuderung sorgt für optimale Ergebnisse. Das A+++ Energiesiegel sorgt für Energieeffizienz. Die Sensorentrocknung erkennt den Trocknungsgrad. Die SelfCleaning-Condenser reinigt den Kondensator automatisch. Perfekt für energieeffizientes Waschen.`,
    shortDesc: 'Waschmaschine mit HeatPump und 8 kg Kapazität',
    features: ['HeatPump-Technologie', '8 kg Kapazität', '1400 U/min', 'A+++ Energiesiegel', 'SelfCleaning-Condenser'],
    specs: [
      { key: 'Kapazität', value: '8 kg' },
      { key: 'Schleuderdrehzahl', value: '1400 U/min' },
      { key: 'Energieklasse', value: 'A+++' },
      { key: 'Trocknungsart', value: 'Wärmepumpe' },
      { key: 'Programme', value: '12' },
      { key: 'Abmessungen', value: '60 x 85 x 60 cm' },
    ],
  },
  {
    slug: 'electrolux-ew7h348w-trockner',
    description: `Der Electrolux EW7H348W ist ein Wärmepumpentrockner mit Sensorentrocknung. Die Sensorentrocknung erkennt den Trocknungsgrad und stoppt automatisch. Die 8 kg Kapazität eignet sich für mittlere Haushalte. Das A++ Energiesiegel sorgt für Energieeffizienz. Die SelfCleaning-Condenser reinigt den Kondensator automatisch. Die Sensoren-Temperaturregelung schont die Wäsche. Das kompakte Design passt in jede Küche. Perfekt für effizientes Trocknen.`,
    shortDesc: 'Wärmepumpentrockner mit Sensorentrocknung und 8 kg Kapazität',
    features: ['Sensorentrocknung', '8 kg Kapazität', 'A++ Energiesiegel', 'SelfCleaning-Condenser', 'Kompaktes Design'],
    specs: [
      { key: 'Kapazität', value: '8 kg' },
      { key: 'Trocknungsart', value: 'Wärmepumpe' },
      { key: 'Energieklasse', value: 'A++' },
      { key: 'Sensoren', value: 'Temperatur und Feuchtigkeit' },
      { key: 'Abmessungen', value: '60 x 85 x 60 cm' },
    ],
  },
  {
    slug: 'electrolux-kompakt-esf6200lou',
    description: `Die Electrolux Kompakt ESF6200LOU ist ein kompakter Geschirrspüler für kleine Küchen. Die 8 Gedecke Kapazität eignet sich für kleine Haushalte. Die 5 Programme bieten individuelle Wascheinstellungen. Die A+++ Energiesiegel sorgt für Energieeffizienz. Die kompakte Bauform von 45 cm Breite passt in jede Küche. Die ChildLock-Sicherheit verhindert unbeabsichtigtes Öffnen. Die einfache Installation erfordert keine professionelle Montage. Perfekt für kleine Küchen.`,
    shortDesc: 'Kompakter Geschirrspüler mit 8 Gedecken und A+++ Energiesiegel',
    features: ['8 Gedecke Kapazität', '5 Programme', 'A+++ Energiesiegel', '45 cm Breite', 'ChildLock'],
    specs: [
      { key: 'Kapazität', value: '8 Gedecke' },
      { key: 'Energieklasse', value: 'A+++' },
      { key: 'Programme', value: '5' },
      { key: 'Breite', value: '45 cm' },
      { key: 'Abmessungen', value: '45 x 82 x 55 cm' },
    ],
  },
  {
    slug: 'electrolux-lrb3643sw-kuhlschrank',
    description: `Der Electrolux LRB3643SW ist einSide-by-Side-Kühlschrank mit TwinTech-Technologie. Die TwinTech-Technologie trennt Kühlung und Gefrierung für optimale Ergebnisse. Die NoFrost-Technologie verhindert automatisch Eisbildung. Die 360 Liter Volumen bietet ausreichend Platz für große Haushalte. Die MultiBox-Schubladen bieten flexible Aufbewahrungsmöglichkeiten. Die LED-Beleuchtung sorgt für optimale Sicht. Das Side-by-Side-Design passt in moderne Küchen. Perfekt für große Haushalte.`,
    shortDesc: 'Side-by-Side-Kühlschrank mit TwinTech und 360L Volumen',
    features: ['TwinTech-Technologie', 'NoFrost', '360 Liter Volumen', 'MultiBox-Schubladen', 'LED-Beleuchtung'],
    specs: [
      { key: 'Volumen', value: '360 Liter' },
      { key: 'Kühltechnologie', value: 'TwinTech NoFrost' },
      { key: 'Schubladen', value: 'MultiBox' },
      { key: 'Energieklasse', value: 'A++' },
      { key: 'Abmessungen', value: '60 x 185 x 65 cm' },
    ],
  },
  {
    slug: 'haier-dw14-bk3aeu',
    description: `Die Haier DW14 BK3AEU ist ein freistehender Geschirrspüler mit OLED-Display. Die 14 Gedecke Kapazität eignet sich für große Haushalte. Die 9 Programme und 5 Zusatzfunktionen bieten individuelle Einstellungen. Die A+++ Energiesiegel sorgt für Energieeffizienz. Die自动 reinigungssystem automatisiert die Reinigung. Die ChildLock-Sicherheit verhindert unbeabsichtigtes Öffnen. Die einfache Bedienung mit OLED-Display ist intuitiv. Perfekt für große Familien.`,
    shortDesc: 'Großer Geschirrspüler mit OLED-Display und 14 Gedecken',
    features: ['OLED-Display', '14 Gedecke Kapazität', '9 Programme', 'A+++ Energiesiegel', '自动 Reinigung'],
    specs: [
      { key: 'Kapazität', value: '14 Gedecke' },
      { key: 'Energieklasse', value: 'A+++' },
      { key: 'Programme', value: '9 + 5 Zusatzfunktionen' },
      { key: 'Display', value: 'OLED' },
      { key: 'Abmessungen', value: '60 x 85 x 60 cm' },
    ],
  },
  {
    slug: 'haier-hd100-a2939-trockner',
    description: `Der Haier HD100-A2939 ist ein Wärmepumpentrockner mit Thomson-Technologie. Die Thomson-Technologie sorgt für gleichmäßiges Trocknen. Die 10 kg Kapazität eignet sich für große Haushalte. Das A++ Energiesiegel sorgt für Energieeffizienz. Die Sensor-Feuchtigkeitssteuerung erkennt den Trocknungsgrad. Die 15 Programme bieten individuelle Einstellungen. Das kompakte Design passt in jede Küche. Perfekt für effizientes Trocknen.`,
    shortDesc: 'Wärmepumpentrockner mit Thomson-Technologie und 10 kg Kapazität',
    features: ['Thomson-Technologie', '10 kg Kapazität', 'A++ Energiesiegel', 'Sensor-Feuchtigkeitssteuerung', '15 Programme'],
    specs: [
      { key: 'Kapazität', value: '10 kg' },
      { key: 'Trocknungsart', value: 'Wärmepumpe' },
      { key: 'Energieklasse', value: 'A++' },
      { key: 'Programme', value: '15' },
      { key: 'Abmessungen', value: '60 x 85 x 60 cm' },
    ],
  },
  {
    slug: 'haier-hw100-b1439lu1-waschmaschine',
    description: `Die Haier HW100-B1439LU1 ist eine Premium-Waschmaschine mit Direct-Motion-Motor. Die Direct-Motion-Technologie arbeitet besonders leise und langlebig. Die 10 kg Kapazität eignet sich für große Haushalte. Die 1400 U/min Schleuderung sorgt für optimale Ergebnisse. Das A+++ Energiesiegel sorgt für Energieeffizienz. Die Anti-Allergie-Option entfernt Allergene effektiv. Die Steam-Option erfrischt Wäsche mit Dampf. Perfekt für leises und gründliches Waschen.`,
    shortDesc: 'Premium-Waschmaschine mit Direct-Motion und 10 kg Kapazität',
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
    slug: 'haier-monokuhlschrank-hb14g1aaag',
    description: `Der Haier Monokühlschrank HB14G1AAAG ist ein Einbau-Kühlschrank mit Total-NoFrost-Technologie. Die Total-NoFrost-Technologie verhindert automatisch Eisbildung. Die Multi-Airflow-Technologie sorgt für gleichmäßige Kühlung. Die 264 Liter Volumen bietet ausreichend Platz. Die LED-Beleuchtung sorgt für optimale Sicht. Die Energiespareinstellungen reduzieren den Stromverbrauch. Das Einbau-Design passt in jede Küchenzeile. Perfekt für plaque sparende Kühlung.`,
    shortDesc: 'Einbau-Kühlschrank mit Total-NoFrost und Multi-Airflow',
    features: ['Total-NoFrost', 'Multi-Airflow', '264 Liter Volumen', 'LED-Beleuchtung', 'Energiespareinstellungen'],
    specs: [
      { key: 'Volumen', value: '264 Liter' },
      { key: 'Kühltechnologie', value: 'Total-NoFrost' },
      { key: 'Luftzirkulation', value: 'Multi-Airflow' },
      { key: 'Energieklasse', value: 'A++' },
      { key: 'Abmessungen', value: '56 x 177 x 55 cm' },
    ],
  },
  {
    slug: 'haier-side-by-side-rs670n4aw1',
    description: `Der Haier Side-by-Side RS670N4AW1 ist ein großer Kühlschrank mit Dispenser und Multi-Zone-Kühlung. Die Multi-Zone-Kühlung ermöglicht separate Temperatureinstellungen. Die Total-NoFrost-Technologie verhindert automatisch Eisbildung. Die 521 Liter Volumen bietet ausreichend Platz für große Familien. Die LED-Beleuchtung sorgt für optimale Sicht. Der integrierte Wasserspender bietet kaltes Wasser. Das Side-by-Side-Design passt in moderne Küchen. Perfekt für große Familien.`,
    shortDesc: 'Side-by-Side mit 521L, Dispenser und Multi-Zone-Kühlung',
    features: ['Multi-Zone-Kühlung', 'Total-NoFrost', '521 Liter Volumen', 'Integrierter Wasserspender', 'LED-Beleuchtung'],
    specs: [
      { key: 'Volumen', value: '521 Liter' },
      { key: 'Kühltechnologie', value: 'Total-NoFrost' },
      { key: 'Dispenser', value: 'Wasserspender' },
      { key: 'Energieklasse', value: 'A++' },
      { key: 'Abmessungen', value: '91 x 175 x 71 cm' },
    ],
  },
  {
    slug: 'kenwood-multipro-express-fdm79190ba',
    description: `Die Kenwood Multipro Express FDM79190BA ist eine Premium-Küchenmaschine mit 1500 Watt Leistung. Das planetarische Mischsystem sorgt für gleichmäßige Ergebnisse. Die 10 Geschwindigkeitsstufen und der Pulsbetrieb ermöglichen individuelle Einstellungen. Die mitgelieferten Aufätze – Knethaken, Schneebesen, Saftpresse – bieten maximale Vielseitigkeit. Der abnehmbare 6,7-Liter-Rüssel ist spülmaschinenfeste. Die LED-Anzeige zeigt Geschwindigkeit und Timer an. Das elegante Design in Rot passt zu jeder Kücheneinrichtung. Ein Premium-Küchenhelfer.`,
    shortDesc: 'Premium-Küchenmaschine mit 1500W, Saftpresse und 6,7L-Rüssel',
    features: ['1500 Watt Motor', 'Planetarisches Mischsystem', '10 Geschwindigkeiten', 'Saftpresse inklusive', '6,7 Liter Rüssel'],
    specs: [
      { key: 'Leistung', value: '1500 Watt' },
      { key: 'Rüsselvolumen', value: '6,7 Liter' },
      { key: 'Geschwindigkeiten', value: '10 + Puls' },
      { key: 'Aufätze', value: 'Knethaken, Schneebesen, Saftpresse' },
      { key: 'Farbe', value: 'Rot' },
    ],
  },
  {
    slug: 'lg-cordzero-a9-kompressor',
    description: `Der LG CordZero A9 Kompressor ist ein kabelloser Akkusauger mit Kompressor-Technologie. Die Kompressor-Technologie sorgt für konstante Saugleistung. Die 2 Batterien bieten bis zu 80 Minuten Laufzeit. Die Power-Funktion erhöht die Saugleistung für schwere Verschmutzungen. Die Smart-Inverter-Motor arbeitet besonders leise und langlebig. Die multiple Ausstattung bietet Werkzeuge für jeden Einsatzzweck. Die Wandhalterung sorgt für platzsparende Aufbewahrung. Perfekt für gründliches Saugen.`,
    shortDesc: 'Kabelloser Akkusauger mit Kompressor und 80 Min. Laufzeit',
    features: ['Kompressor-Technologie', '2 Batterien (80 Min.)', 'Power-Funktion', 'Smart-Inverter-Motor', 'Multiple Werkzeuge'],
    specs: [
      { key: 'Laufzeit', value: 'Bis zu 80 Minuten' },
      { key: 'Technologie', value: 'Kompressor' },
      { key: 'Motor', value: 'Smart Inverter' },
      { key: 'Gewicht', value: '2,7 kg' },
      { key: 'Farbe', value: 'Schwarz' },
    ],
  },
  {
    slug: 'lg-cordzero-thinq-r9',
    description: `Der LG CordZero ThinQ R9 ist ein intelligenter Saugroboter mit AI-Navigation. Die AI-Navigation erkennt Hindernisse und plant optimale Reinigungswege. Die 5100 Pa Saugkraft entfernt Staub und Schmutz gründlich. Die Wischfunktion reinigt den Boden feucht. Die automatische Staubertertiung bei满gedocktem Base-Station. Die App-Steuerung ermöglicht die Fernbedienung von überall. Die Kompatibilität mit Alexa und Google Home bietet Sprachsteuerung. Das absolute Flaggschiff für automatische Reinigung.`,
    shortDesc: 'Intelligenter Saugroboter mit AI-Navigation und 5100 Pa Saugkraft',
    features: ['AI-Navigation', '5100 Pa Saugkraft', 'Wischfunktion', 'Automatische Entleerung', 'ThinQ App'],
    specs: [
      { key: 'Saugkraft', value: '5100 Pa' },
      { key: 'Navigation', value: 'AI (LiDAR + Kamera)' },
      { key: 'Laufzeit', value: 'Bis zu 180 Minuten' },
      { key: 'Wasserbehälter', value: '200 ml' },
      { key: 'Farbe', value: 'Schwarz' },
    ],
  },
  {
    slug: 'liebherr-comfort-ke230-26',
    description: `Der Liebherr Comfort KE230.26 ist ein unterbau-fähiger Kühlschrank mit BioFresh-Technologie. Die BioFresh-Technologie hält Lebensmittel besonders frisch. Die 263 Liter Volumen bietet ausreichend Platz. Die LED-Beleuchtung sorgt für optimale Sicht. Die FrostSafe-Technologie schützt vor Temperaturschwankungen. Die Türanschlagstopp-Option ermöglicht beidseitige Türanschlag. Das unterbaufähige Design passt in jede Küchenzeile. Perfekt für frische Lebensmittel.`,
    shortDesc: 'Unterbau-Kühlschrank mit BioFresh und 263L Volumen',
    features: ['BioFresh-Technologie', '263 Liter Volumen', 'FrostSafe', 'LED-Beleuchtung', 'Beidseitiger Türanschlag'],
    specs: [
      { key: 'Volumen', value: '263 Liter' },
      { key: 'Kühltechnologie', value: 'BioFresh' },
      { key: 'Energieklasse', value: 'A++' },
      { key: 'Schubladen', value: 'BioFresh-Schubladen' },
      { key: 'Abmessungen', value: '56 x 82 x 55 cm' },
    ],
  },
  {
    slug: 'miele-g5000-sci',
    description: `Die Miele G5000 SCI ist ein Einbau-Geschirrspüler mit ComfortLift-Funktion. Die ComfortLift-Funktion hebt die untere Ladeebene an für ergonomisches Beladen. Die 14 Gedecke Kapazität eignet sich für große Haushalte. Die 9 Programme und 4 Zusatzfunktionen bieten individuelle Einstellungen. Die A+++ Energiesiegel sorgt für Energieeffizienz. Die AutoOpen-Trocknung öffnet die Tür automatisch am Ende. Die 3D-Bestecher bieten flexible Belademöglichkeiten. Perfekt für ergonomisches Spülen.`,
    shortDesc: 'Einbau-Geschirrspüler mit ComfortLift und 14 Gedecken',
    features: ['ComfortLift', '14 Gedecke', 'AutoOpen-Trocknung', '3D-Bestecher', 'A+++ Energiesiegel'],
    specs: [
      { key: 'Kapazität', value: '14 Gedecke' },
      { key: 'Energieklasse', value: 'A+++' },
      { key: 'Programme', value: '9 + 4 Zusatzfunktionen' },
      { key: 'Besonderheit', value: 'ComfortLift' },
      { key: 'Abmessungen', value: '60 x 82 x 55 cm' },
    ],
  },
  {
    slug: 'miele-g7310-scu',
    description: `Die Miele G7310 SCU ist ein freistehender Geschirrspüler mit AutoDos-Funktion. Die AutoDos-Funktion dosiert Spülmittel automatisch präzise. Die 14 Gedecke Kapazität eignet sich für große Haushalte. Die 9 Programme und 4 Zusatzfunktionen bieten individuelle Einstellungen. Die A+++ Energiesiegel sorgt für Energieeffizienz. Die AutoOpen-Trocknung öffnet die Tür automatisch am Ende. Die 3D-Bestecher bieten flexible Belademöglichkeiten. Perfekt für automatisches Spülen.`,
    shortDesc: 'Freistehender Geschirrspüler mit AutoDos und 14 Gedecken',
    features: ['AutoDos-Automatikdosierung', '14 Gedecke', 'AutoOpen-Trocknung', '3D-Bestecher', 'A+++ Energiesiegel'],
    specs: [
      { key: 'Kapazität', value: '14 Gedecke' },
      { key: 'Energieklasse', value: 'A+++' },
      { key: 'Programme', value: '9 + 4 Zusatzfunktionen' },
      { key: 'Dosierung', value: 'AutoDos automatisch' },
      { key: 'Abmessungen', value: '60 x 85 x 60 cm' },
    ],
  },
  {
    slug: 'miele-g7360-scvi-autodos',
    description: `Die Miele G7360 SCVi AutoDos ist ein Premium-Geschirrspüler mit AutoDos und Dosierhilfe. Die AutoDos-Funktion dosiert Spülmittel automatisch präzise. Die Dosierhilfe mischt Spülmittel mit Wasser. Die 14 Gedecke Kapazität eignet sich für große Haushalte. Die 9 Programme und 4 Zusatzfunktionen bieten individuelle Einstellungen. Die A+++ Energiesiegel sorgt für Energieeffizienz. Die AutoOpen-Trocknung öffnet die Tür automatisch am Ende. Das Premium-Modell für anspruchsvolle Nutzer.`,
    shortDesc: 'Premium-Geschirrspüler mit AutoDos und Dosierhilfe',
    features: ['AutoDos + Dosierhilfe', '14 Gedecke', 'AutoOpen-Trocknung', '3D-Bestecher', 'A+++ Energiesiegel'],
    specs: [
      { key: 'Kapazität', value: '14 Gedecke' },
      { key: 'Energieklasse', value: 'A+++' },
      { key: 'Programme', value: '9 + 4 Zusatzfunktionen' },
      { key: 'Dosierung', value: 'AutoDos + Dosierhilfe' },
      { key: 'Abmessungen', value: '60 x 82 x 55 cm' },
    ],
  },
  {
    slug: 'miele-g7966-scvi-autodos',
    description: `Die Miele G7966 SCVi AutoDos ist das absolute Flaggschiff unter den Miele-Geschirrspülern. Die AutoDos-Funktion dosiert Spülmittel automatisch präzise. Die Dosierhilfe mischt Spülmittel mit Wasser. Die 16 Gedecke Kapazität eignet sich für sehr große Haushalte. Die 12 Programme und 6 Zusatzfunktionen bieten maximale Flexibilität. Die A+++ Energiesiegel sorgt für Energieeffizienz. Die AutoOpen-Trocknung öffnet die Tür automatisch am Ende. Das absolute Premium-Modell für maximale Ansprüche.`,
    shortDesc: 'Miele-Flaggschiff mit AutoDos, 16 Gedecken und 12 Programmen',
    features: ['AutoDos + Dosierhilfe', '16 Gedecke', 'AutoOpen-Trocknung', '12 Programme', 'Maximum Flexibilität'],
    specs: [
      { key: 'Kapazität', value: '16 Gedecke' },
      { key: 'Energieklasse', value: 'A+++' },
      { key: 'Programme', value: '12 + 6 Zusatzfunktionen' },
      { key: 'Dosierung', value: 'AutoDos + Dosierhilfe' },
      { key: 'Abmessungen', value: '60 x 82 x 55 cm' },
    ],
  },
  {
    slug: 'miele-kuhlschrank-k2801sfvi',
    description: `Der Miele Kühlschrank K2801SFVI ist ein Einbau-Kühlschrank mit PerfectFresh-Technologie. Die PerfectFresh-Technologie hält Lebensmittel besonders frisch. Die 278 Liter Volumen bietet ausreichend Platz. Die LED-Beleuchtung sorgt für optimale Sicht. Die DynaCool-Technologie sorgt für gleichmäßige Luftverteilung. Die FrostSafe-Technologie schützt vor Temperaturschwankungen. Das Einbau-Design passt in jede Küchenzeile. Perfekt für frische Lebensmittel.`,
    shortDesc: 'Einbau-Kühlschrank mit PerfectFresh und 278L Volumen',
    features: ['PerfectFresh-Technologie', '278 Liter Volumen', 'DynaCool', 'FrostSafe', 'LED-Beleuchtung'],
    specs: [
      { key: 'Volumen', value: '278 Liter' },
      { key: 'Kühltechnologie', value: 'PerfectFresh' },
      { key: 'Luftverteilung', value: 'DynaCool' },
      { key: 'Energieklasse', value: 'A++' },
      { key: 'Abmessungen', value: '56 x 177 x 55 cm' },
    ],
  },
  {
    slug: 'miele-mastercool-mcs1301w',
    description: `Der Miele MasterCool MCS1301W ist ein Premium-Weinkühlschrank mit 2 Temperaturen. Die 2 Temperaturen ermöglichen das Lagern von verschiedenen Weinsorten. Die 33 Flaschen Kapazität eignet sich für Weinliebhaber. Die Vibrationsschutz-Technologie schont den Wein. Die LED-Beleuchtung sorgt für optimale Sicht. Die Türscharniere sind verstellbar. Das elegante Design passt zu jeder Kücheneinrichtung. Perfekt für Weinkenner.`,
    shortDesc: 'Premium-Weinkühlschrank mit 33 Flaschen und 2 Temperaturen',
    features: ['2 Temperaturen', '33 Flaschen Kapazität', 'Vibrationsschutz', 'LED-Beleuchtung', 'Verstellbare Türscharniere'],
    specs: [
      { key: 'Kapazität', value: '33 Flaschen' },
      { key: 'Temperaturen', value: '2 Zonen' },
      { key: 'Kühltechnologie', value: 'Kompressor' },
      { key: 'Beleuchtung', value: 'LED' },
      { key: 'Abmessungen', value: '59,5 x 185 x 60 cm' },
    ],
  },
  {
    slug: 'miele-t1-trockner-tmh843',
    description: `Der Miele T1 Trockner TMH843 ist ein Wärmepumpentrockner mit HeatPump-Technologie. Die HeatPump-Technologie nutzt Restwärme für energieeffizientes Trocknen. Die 9 kg Kapazität eignet sich für mittlere bis große Haushalte. Das A++ Energiesiegel sorgt für Energieeffizienz. Die Sensorentrocknung erkennt den Trocknungsgrad. Die 12 Programme bieten individuelle Einstellungen. Das elegante Design passt in jede Küche. Perfekt für effizientes Trocknen.`,
    shortDesc: 'Miele-Wärmepumpentrockner mit HeatPump und 9 kg Kapazität',
    features: ['HeatPump-Technologie', '9 kg Kapazität', 'A++ Energiesiegel', 'Sensorentrocknung', '12 Programme'],
    specs: [
      { key: 'Kapazität', value: '9 kg' },
      { key: 'Trocknungsart', value: 'Wärmepumpe' },
      { key: 'Energieklasse', value: 'A++' },
      { key: 'Programme', value: '12' },
      { key: 'Abmessungen', value: '60 x 85 x 65 cm' },
    ],
  },
  {
    slug: 'miele-t1-trockner-tmv843',
    description: `Der Miele T1 Trockner TMV843 ist ein Premium-Wärmepumpentrockner mit EcoDry-Technologie. Die EcoDry-Technologie sorgt für dauerhaft energieeffizientes Trocknen. Die 9 kg Kapazität eignet sich für mittlere bis große Haushalte. Das A++ Energiesiegel sorgt für Energieeffizienz. Die Sensorentrocknung erkennt den Trocknungsgrad. Die 12 Programme bieten individuelle Einstellungen. Das elegante Design passt in jede Küche. Das Premium-Modell für energieeffizientes Trocknen.`,
    shortDesc: 'Premium-Miele-Wärmepumpentrockner mit EcoDry und 9 kg',
    features: ['EcoDry-Technologie', '9 kg Kapazität', 'A++ Energiesiegel', 'Sensorentrocknung', '12 Programme'],
    specs: [
      { key: 'Kapazität', value: '9 kg' },
      { key: 'Trocknungsart', value: 'Wärmepumpe' },
      { key: 'Energieklasse', value: 'A++' },
      { key: 'Programme', value: '12' },
      { key: 'Abmessungen', value: '60 x 85 x 65 cm' },
    ],
  },
  {
    slug: 'miele-t1-trockner-trk845',
    description: `Der Miele T1 Trockner TRK845 ist ein Kondensations-Trockner mit Sensor-Steuerung. Die Sensor-Steuerung erkennt den Trocknungsgrad und stoppt automatisch. Die 9 kg Kapazität eignet sich für mittlere bis große Haushalte. Das B Energiesiegel sorgt für moderaten Stromverbrauch. Die 12 Programme bieten individuelle Einstellungen. Das elegante Design passt in jede Küche. Perfekt für alle, die einen Kondensations-Trockner bevorzugen.`,
    shortDesc: 'Miele-Kondensations-Trockner mit Sensor-Steuerung und 9 kg',
    features: ['Sensor-Steuerung', '9 kg Kapazität', 'B Energiesiegel', '12 Programme', 'Kondensations-Technologie'],
    specs: [
      { key: 'Kapazität', value: '9 kg' },
      { key: 'Trocknungsart', value: 'Kondensation' },
      { key: 'Energieklasse', value: 'B' },
      { key: 'Programme', value: '12' },
      { key: 'Abmessungen', value: '60 x 85 x 65 cm' },
    ],
  },
  {
    slug: 'miele-triflex-hx2-pro',
    description: `Die Miele Triflex HX2 Pro ist ein kabelloser Akkusauger im 3-in-1-Design. Die 3-in-1-Funktionalität ermöglicht Saugen als Hand-, Stiel- oder Stecksauger. Die 3D-Drallbürste sorgt für gründliches Saugen auf allen Böden. Die Varta-Li-Ionen-Batterie bietet bis zu 60 Minuten Laufzeit. Die elektrostatische Aufladung verhindert Haarverfilzung. Die ComfortFunktion sorgt für ergonomisches Saugen. Das elegante Design passt zu jeder Haushaltsführung. Perfekt für vielseitiges Saugen.`,
    shortDesc: 'Kabelloser 3-in-1-Akkusauger mit 60 Min. Laufzeit und 3D-Drallbürste',
    features: ['3-in-1 Design', '60 Min. Laufzeit', '3D-Drallbürste', 'ComfortFunktion', 'Elektrostatische Aufladung'],
    specs: [
      { key: 'Laufzeit', value: 'Bis zu 60 Minuten' },
      { key: 'Design', value: '3-in-1' },
      { key: 'Bürste', value: '3D-Drallbürste' },
      { key: 'Gewicht', value: '2,6 kg' },
      { key: 'Farbe', value: 'Weiß' },
    ],
  },
  {
    slug: 'miele-w1-waschmaschine-wci870',
    description: `Die Miele W1 Waschmaschine WCI870 ist eine Premium-Waschmaschine mit TwinDos-Technologie. Die TwinDos-Technologie dosiert Waschmittel automatisch präzise. Die 8 kg Kapazität eignet sich für mittlere Haushalte. Die 1600 U/min Schleuderung sorgt für optimale Ergebnisse. Das A+++ Energiesiegel sorgt für Energieeffizienz. Die PowerWash-Funktion erhöht die Waschkraft. Die 20 Programme bieten individuelle Einstellungen. Das Premium-Modell für anspruchsvolles Waschen.`,
    shortDesc: 'Miele-Premium-Waschmaschine mit TwinDos und 8 kg Kapazität',
    features: ['TwinDos-Automatikdosierung', '8 kg Kapazität', '1600 U/min', 'A+++ Energiesiegel', 'PowerWash'],
    specs: [
      { key: 'Kapazität', value: '8 kg' },
      { key: 'Schleuderdrehzahl', value: '1600 U/min' },
      { key: 'Energieklasse', value: 'A+++' },
      { key: 'Dosierung', value: 'TwinDos' },
      { key: 'Programme', value: '20' },
      { key: 'Abmessungen', value: '60 x 85 x 60 cm' },
    ],
  },
  {
    slug: 'miele-w1-waschmaschine-wsd163',
    description: `Die Miele W1 Waschmaschine WSD163 ist eine Premium-Waschmaschine mit Miele@home-Steuerung. Die Miele@home-Steuerung ermöglicht die Fernbedienung per Smartphone. Die 8 kg Kapazität eignet sich für mittlere Haushalte. Die 1600 U/min Schleuderung sorgt für optimale Ergebnisse. Das A+++ Energiesiegel sorgt für Energieeffizienz. Die 20 Programme bieten individuelle Einstellungen. Das elegante Design passt in jede Küche. Perfekt für smartes Waschen.`,
    shortDesc: 'Miele-Waschmaschine mit Miele@home und 8 kg Kapazität',
    features: ['Miele@home-Steuerung', '8 kg Kapazität', '1600 U/min', 'A+++ Energiesiegel', '20 Programme'],
    specs: [
      { key: 'Kapazität', value: '8 kg' },
      { key: 'Schleuderdrehzahl', value: '1600 U/min' },
      { key: 'Energieklasse', value: 'A+++' },
      { key: 'Steuerung', value: 'Miele@home App' },
      { key: 'Programme', value: '20' },
      { key: 'Abmessungen', value: '60 x 85 x 60 cm' },
    ],
  },
  {
    slug: 'miele-w1-waschmaschine-wsd263',
    description: `Die Miele W1 Waschmaschine WSD263 ist eine Premium-Waschmaschine mit CapDosing- und TwinDos-Technologie. Die TwinDos-Technologie dosiert Waschmittel automatisch präzise. Die CapDosing-Technologie offeriert spezielle Zusätze. Die 8 kg Kapazität eignet sich für mittlere Haushalte. Die 1600 U/min Schleuderung sorgt für optimale Ergebnisse. Das A+++ Energiesiegel sorgt für Energieeffizienz. Die 20 Programme bieten individuelle Einstellungen. Das Premium-Modell mit erweiterten Features.`,
    shortDesc: 'Miele-Premium-Waschmaschine mit TwinDos und CapDosing',
    features: ['TwinDos + CapDosing', '8 kg Kapazität', '1600 U/min', 'A+++ Energiesiegel', '20 Programme'],
    specs: [
      { key: 'Kapazität', value: '8 kg' },
      { key: 'Schleuderdrehzahl', value: '1600 U/min' },
      { key: 'Energieklasse', value: 'A+++' },
      { key: 'Dosierung', value: 'TwinDos + CapDosing' },
      { key: 'Programme', value: '20' },
      { key: 'Abmessungen', value: '60 x 85 x 60 cm' },
    ],
  },
  {
    slug: 'miele-w1-waschmaschine-wsd363',
    description: `Die Miele W1 Waschmaschine WSD363 ist die neueste Premium-Waschmaschine von Miele mit TwinDos-Technologie. Die TwinDos-Technologie dosiert Waschmittel automatisch präzise. Die CapDosing-Technologie offeriert spezielle Zusätze. Die 8 kg Kapazität eignet sich für mittlere Haushalte. Die 1600 U/min Schleuderung sorgt für optimale Ergebnisse. Das A+++ Energiesiegel sorgt für Energieeffizienz. Die Miele@home-Steuerung ermöglicht die Fernbedienung. Die neueste Generation für maximale Ansprüche.`,
    shortDesc: 'Neueste Miele-Premium-Waschmaschine mit TwinDos und Miele@home',
    features: ['TwinDos + CapDosing', 'Miele@home-Steuerung', '8 kg Kapazität', '1600 U/min', 'Neueste Generation'],
    specs: [
      { key: 'Kapazität', value: '8 kg' },
      { key: 'Schleuderdrehzahl', value: '1600 U/min' },
      { key: 'Energieklasse', value: 'A+++' },
      { key: 'Dosierung', value: 'TwinDos + CapDosing' },
      { key: 'Steuerung', value: 'Miele@home App' },
      { key: 'Abmessungen', value: '60 x 85 x 60 cm' },
    ],
  },
  {
    slug: 'miele-waschtrockner-wt1',
    description: `Der Miele Waschtrockner WT1 ist ein kombinierter Waschtrockner mit Wärmepumpe. Die Wärmepumpe nutzt Restwärme für energieeffizientes Trocknen. Die 6 kg Waschkapazität und 5 kg Trocknungskapazität eignen sich für mittlere Haushalte. Das A++ Energiesiegel sorgt für Energieeffizienz. Die Sensorentrocknung erkennt den Trocknungsgrad. Die 20 Programme bieten individuelle Einstellungen. Das kompakte Design spart Platz. Perfekt für alle, die Platz sparen möchten.`,
    shortDesc: 'Kombinierter Waschtrockner mit Wärmepumpe und 6/5 kg Kapazität',
    features: ['Waschtrockner-Kombination', 'Wärmepumpe', '6 kg Waschen / 5 kg Trocknen', 'A++ Energiesiegel', 'Sensorentrocknung'],
    specs: [
      { key: 'Waschkapazität', value: '6 kg' },
      { key: 'Trocknungskapazität', value: '5 kg' },
      { key: 'Trocknungsart', value: 'Wärmepumpe' },
      { key: 'Energieklasse', value: 'A++' },
      { key: 'Programme', value: '20' },
      { key: 'Abmessungen', value: '60 x 85 x 60 cm' },
    ],
  },
  {
    slug: 'samsung-ecobubble-ww90t554daw',
    description: `Die Samsung EcoBubble WW90T554DAW ist eine Premium-Waschmaschine mit EcoBubble-Technologie. Die EcoBubble-Technologie verwandelt Waschmittel in Blasen für gründliches Waschen. Die 9 kg Kapazität eignet sich für mittlere bis große Haushalte. Die 1400 U/min Schleuderung sorgt für optimale Ergebnisse. Das A+++ Energiesiegel sorgt für Energieeffizienz. Die HygieneOption tötet 99,9% der Bakterien ab. Die Smart-Things-App ermöglicht die Fernbedienung. Perfekt für sanftes und gründliches Waschen.`,
    shortDesc: 'Samsung-Premium-Waschmaschine mit EcoBubble und 9 kg Kapazität',
    features: ['EcoBubble-Technologie', '9 kg Kapazität', '1400 U/min', 'A+++ Energiesiegel', 'SmartThings App'],
    specs: [
      { key: 'Kapazität', value: '9 kg' },
      { key: 'Schleuderdrehzahl', value: '1400 U/min' },
      { key: 'Energieklasse', value: 'A+++' },
      { key: 'Technologie', value: 'EcoBubble' },
      { key: 'Programme', value: '15' },
      { key: 'Abmessungen', value: '60 x 85 x 60 cm' },
    ],
  },
  {
    slug: 'samsung-ecobubble-ww90tp04dsh',
    description: `Die Samsung EcoBubble WW90TP04DSH ist die neueste EcoBubble-Waschmaschine von Samsung. Die EcoBubble-Technologie verwandelt Waschmittel in Blasen für gründliches Waschen. Die 9 kg Kapazität eignet sich für mittlere bis große Haushalte. Die 1400 U/min Schleuderung sorgt für optimale Ergebnisse. Das A+++ Energiesiegel sorgt für Energieeffizienz. Die AI-Wash-Funktion passt Waschparameter automatisch an. Die Smart-Things-App ermöglicht die Fernbedienung. Die neueste Generation für sanftes Waschen.`,
    shortDesc: 'Neueste Samsung-EcoBubble-Waschmaschine mit AI-Wash',
    features: ['EcoBubble-Technologie', 'AI-Wash-Funktion', '9 kg Kapazität', '1400 U/min', 'SmartThings App'],
    specs: [
      { key: 'Kapazität', value: '9 kg' },
      { key: 'Schleuderdrehzahl', value: '1400 U/min' },
      { key: 'Energieklasse', value: 'A+++' },
      { key: 'Technologie', value: 'EcoBubble + AI' },
      { key: 'Programme', value: '15' },
      { key: 'Abmessungen', value: '60 x 85 x 60 cm' },
    ],
  },
  {
    slug: 'samsung-waschmaschine-ww90t684dln',
    description: `Die Samsung Waschmaschine WW90T684DLN ist eine Premium-Waschmaschine mit SuperSpeed-Funktion. Die SuperSpeed-Funktion verkürzt die Waschzeit um bis zu 35%. Die 9 kg Kapazität eignet sich für mittlere bis große Haushalte. Die 1400 U/min Schleuderung sorgt für optimale Ergebnisse. Das A+++ Energiesiegel sorgt für Energieeffizienz. Die HygieneOption tötet 99,9% der Bakterien ab. Die Smart-Things-App ermöglicht die Fernbedienung. Perfekt für schnelles und gründliches Waschen.`,
    shortDesc: 'Samsung-Premium-Waschmaschine mit SuperSpeed und 9 kg Kapazität',
    features: ['SuperSpeed-Funktion', '9 kg Kapazität', '1400 U/min', 'A+++ Energiesiegel', 'SmartThings App'],
    specs: [
      { key: 'Kapazität', value: '9 kg' },
      { key: 'Schleuderdrehzahl', value: '1400 U/min' },
      { key: 'Energieklasse', value: 'A+++' },
      { key: 'Besonderheit', value: 'SuperSpeed' },
      { key: 'Programme', value: '15' },
      { key: 'Abmessungen', value: '60 x 85 x 60 cm' },
    ],
  },
  {
    slug: 'siemens-iq300-sn63ex22ce',
    description: `Die Siemens iQ300 SN63EX22CE ist ein Einbau-Geschirrspüler mit varioSpeed-Funktion. Die varioSpeed-Funktion verkürzt die Spüldauer um bis zu 50%. Die 14 Gedecke Kapazität eignet sich für große Haushalte. Die 6 Programme und 4 Zusatzfunktionen bieten individuelle Einstellungen. Die A+++ Energiesiegel sorgt für Energieeffizienz. Die VarioLoader-Flexibilität bietet flexible Belademöglichkeiten. Die AquaStop-Sicherheit verhindert Wasserschäden. Perfekt für schnelles Spülen.`,
    shortDesc: 'Einbau-Geschirrspüler mit varioSpeed und 14 Gedecken',
    features: ['varioSpeed (50% schneller)', '14 Gedecke', 'VarioLoader', 'A+++ Energiesiegel', 'AquaStop'],
    specs: [
      { key: 'Kapazität', value: '14 Gedecke' },
      { key: 'Energieklasse', value: 'A+++' },
      { key: 'Programme', value: '6 + 4 Zusatzfunktionen' },
      { key: 'Geschwindigkeit', value: 'varioSpeed' },
      { key: 'Abmessungen', value: '60 x 82 x 55 cm' },
    ],
  },
  {
    slug: 'siemens-iq300-waschmaschine-wg44g200',
    description: `Die Siemens iQ300 Waschmaschine WG44G200 ist eine kompakte Waschmaschine mit i-DOS-Technologie. Die i-DOS-Technologie dosiert Waschmittel automatisch präzise. Die 9 kg Kapazität eignet sich für mittlere Haushalte. Die 1400 U/min Schleuderung sorgt für optimale Ergebnisse. Das A+++ Energiesiegel sorgt für Energieeffizienz. Die varioSpeed-Funktion verkürzt die Waschzeit. Die Home-Connect-App ermöglicht die Fernbedienung. Perfekt für automatisches Waschen.`,
    shortDesc: 'Siemens-Waschmaschine mit i-DOS und 9 kg Kapazität',
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
    slug: 'siemens-iq500-einbau-kuhlschrank-kg39eadla0',
    description: `Der Siemens iQ500 Einbau-Kühlschrank KG39EADLA0 ist ein Einbau-Kühlschrank mit hyperFresh-Funktion. Die hyperFresh-Funktion hält Lebensmittel besonders frisch. Die 308 Liter Volumen bietet ausreichend Platz. Die LED-Beleuchtung sorgt für optimale Sicht. Die noFrost-Technologie verhindert automatisch Eisbildung. Die voiceControl-Funktion ermöglicht Sprachsteuerung. Das Einbau-Design passt in jede Küchenzeile. Perfekt für frische Lebensmittel.`,
    shortDesc: 'Einbau-Kühlschrank mit hyperFresh und 308L Volumen',
    features: ['hyperFresh-Funktion', '308 Liter Volumen', 'noFrost', 'LED-Beleuchtung', 'voiceControl'],
    specs: [
      { key: 'Volumen', value: '308 Liter' },
      { key: 'Kühltechnologie', value: 'hyperFresh + noFrost' },
      { key: 'Steuerung', value: 'voiceControl' },
      { key: 'Energieklasse', value: 'A++' },
      { key: 'Abmessungen', value: '56 x 177 x 55 cm' },
    ],
  },
  {
    slug: 'siemens-iq500-einbau-tiefkuhlschrank-gi51nae20',
    description: `Der Siemens iQ500 Einbau-Tiefkühlschrank GI51NAE20 ist ein Einbau-Gefrierschrank mit noFrost-Technologie. Die noFrost-Technologie verhindert automatisch Eisbildung. Die 214 Liter Volumen bietet ausreichend Platz. Die LED-Beleuchtung sorgt für optimale Sicht. Die varioDrawer-Schubladen bieten flexible Aufbewahrungsmöglichkeiten. Das Einbau-Design passt in jede Küchenzeile. Perfekt für plaque sparende Gefrierung.`,
    shortDesc: 'Einbau-Gefrierschrank mit noFrost und varioDrawer',
    features: ['noFrost', '214 Liter Volumen', 'varioDrawer-Schubladen', 'LED-Beleuchtung', 'Einbau-Design'],
    specs: [
      { key: 'Volumen', value: '214 Liter' },
      { key: 'Gefriertechnologie', value: 'noFrost' },
      { key: 'Schubladen', value: 'varioDrawer' },
      { key: 'Energieklasse', value: 'A++' },
      { key: 'Abmessungen', value: '56 x 177 x 55 cm' },
    ],
  },
  {
    slug: 'siemens-iq500-sn436w00ce',
    description: `Die Siemens iQ500 SN436W00CE ist ein Einbau-Geschirrspüler mit varioSpeed-Funktion. Die varioSpeed-Funktion verkürzt die Spüldauer um bis zu 50%. Die 13 Gedecke Kapazität eignet sich für mittlere Haushalte. Die 6 Programme und 4 Zusatzfunktionen bieten individuelle Einstellungen. Die A+++ Energiesiegel sorgt für Energieeffizienz. Die acquaStop-Sicherheit verhindert Wasserschäden. Das Einbau-Design passt in jede Küchenzeile. Perfekt für effizientes Spülen.`,
    shortDesc: 'Einbau-Geschirrspüler mit varioSpeed und 13 Gedecken',
    features: ['varioSpeed (50% schneller)', '13 Gedecke', '6 Programme', 'A+++ Energiesiegel', 'aquaStop'],
    specs: [
      { key: 'Kapazität', value: '13 Gedecke' },
      { key: 'Energieklasse', value: 'A+++' },
      { key: 'Programme', value: '6 + 4 Zusatzfunktionen' },
      { key: 'Geschwindigkeit', value: 'varioSpeed' },
      { key: 'Abmessungen', value: '60 x 82 x 55 cm' },
    ],
  },
  {
    slug: 'siemens-iq700-kuhlschrank-kg39nxb60',
    description: `Der Siemens iQ700 Kühlschrank KG39NXB60 ist ein freistehender Kühlschrank mit hyperFresh-Funktion. Die hyperFresh-Funktion hält Lebensmittel besonders frisch. Die 366 Liter Volumen bietet ausreichend Platz. Die LED-Beleuchtung sorgt für optimale Sicht. Die noFrost-Technologie verhindert automatisch Eisbildung. Die voiceControl-Funktion ermöglicht Sprachsteuerung. Das elegante Design passt in jede Küche. Perfekt für frische Lebensmittel.`,
    shortDesc: 'Freistehender Kühlschrank mit hyperFresh und 366L Volumen',
    features: ['hyperFresh-Funktion', '366 Liter Volumen', 'noFrost', 'LED-Beleuchtung', 'voiceControl'],
    specs: [
      { key: 'Volumen', value: '366 Liter' },
      { key: 'Kühltechnologie', value: 'hyperFresh + noFrost' },
      { key: 'Steuerung', value: 'voiceControl' },
      { key: 'Energieklasse', value: 'A++' },
      { key: 'Abmessungen', value: '60 x 185 x 65 cm' },
    ],
  },
  {
    slug: 'siemens-iq700-sn878x04ce-neu',
    description: `Die Siemens iQ700 SN878X04CE Neu ist die neueste Generation der Siemens-Geschirrspüler. Die varioSpeed Plus-Funktion verkürzt die Spüldauer um bis zu 66%. Die Zeolith-Trocknung sorgt für brillante Trocknungsergebnisse. Die 14 Gedecke Kapazität eignet sich für große Haushalte. Die 8 Programme und 4 Zusatzfunktionen bieten individuelle Einstellungen. Die A+++ Energiesiegel sorgt für Energieeffizienz. Die Home-Connect-App ermöglicht die Fernbedienung. Das neueste Modell für maximale Ansprüche.`,
    shortDesc: 'Neuester Siemens-Geschirrspüler mit varioSpeed Plus und Zeolith',
    features: ['varioSpeed Plus (66% schneller)', 'Zeolith-Trocknung', '14 Gedecke', 'Home Connect App', 'A+++ Energiesiegel'],
    specs: [
      { key: 'Kapazität', value: '14 Gedecke' },
      { key: 'Energieklasse', value: 'A+++' },
      { key: 'Trocknung', value: 'Zeolith' },
      { key: 'Programme', value: '8 + 4 Zusatzfunktionen' },
      { key: 'Abmessungen', value: '60 x 82 x 55 cm' },
    ],
  },
  {
    slug: 'siemens-iq700-trockner-wt47w5600',
    description: `Der Siemens iQ700 Trockner WT47W5600 ist ein Premium-Wärmepumpentrockner mit homeConnect-Steuerung. Die HeatPump-Technologie nutzt Restwärme für energieeffizientes Trocknen. Die 9 kg Kapazität eignet sich für mittlere bis große Haushalte. Das A++ Energiesiegel sorgt für Energieeffizienz. Die sensorSteuerung erkennt den Trocknungsgrad. Die 15 Programme bieten individuelle Einstellungen. Die Home-Connect-App ermöglicht die Fernbedienung. Das Premium-Modell für effizientes Trocknen.`,
    shortDesc: 'Premium-Wärmepumpentrockner mit Home Connect und 9 kg Kapazität',
    features: ['HeatPump-Technologie', 'homeConnect App', '9 kg Kapazität', 'A++ Energiesiegel', 'sensorSteuerung'],
    specs: [
      { key: 'Kapazität', value: '9 kg' },
      { key: 'Trocknungsart', value: 'Wärmepumpe' },
      { key: 'Energieklasse', value: 'A++' },
      { key: 'Programme', value: '15' },
      { key: 'Abmessungen', value: '60 x 85 x 65 cm' },
    ],
  },
  {
    slug: 'siemens-iq700-waschmaschine-wg44g2z0',
    description: `Die Siemens iQ700 Waschmaschine WG44G2Z0 ist eine Premium-Waschmaschine mit i-DOS und waterPerfect-Technologie. Die i-DOS-Technologie dosiert Waschmittel automatisch präzise. Die waterPerfect-Technologie sorgt für optimalen Wasserverbrauch. Die 9 kg Kapazität eignet sich für mittlere Haushalte. Die 1400 U/min Schleuderung sorgt für optimale Ergebnisse. Das A+++ Energiesiegel sorgt für Energieeffizienz. Die Home-Connect-App ermöglicht die Fernbedienung. Das Premium-Modell für sanftes Waschen.`,
    shortDesc: 'Siemens-Premium-Waschmaschine mit i-DOS und waterPerfect',
    features: ['i-DOS + waterPerfect', '9 kg Kapazität', '1400 U/min', 'A+++ Energiesiegel', 'Home Connect App'],
    specs: [
      { key: 'Kapazität', value: '9 kg' },
      { key: 'Schleuderdrehzahl', value: '1400 U/min' },
      { key: 'Energieklasse', value: 'A+++' },
      { key: 'Dosierung', value: 'i-DOS' },
      { key: 'Technologie', value: 'waterPerfect' },
      { key: 'Abmessungen', value: '60 x 85 x 60 cm' },
    ],
  },
  {
    slug: 'siemens-rs5-pro',
    description: `Der Siemens RS5 Pro ist ein intelligenter Saugroboter mit iSensoric-Technologie. Die iSensoric-Technologie erkennt Hindernisse und vermeidet Kollisionen. Die 4000 Pa Saugkraft entfernt Staub und Schmutz gründlich. Die Wischfunktion reinigt den Boden feucht. Die App-Steuerung ermöglicht die Fernbedienung von überall. Die Kompatibilität mit Alexa und Google Home bietet Sprachsteuerung. Das kompakte Design erreicht alle Ecken. Perfekt für automatische Reinigung.`,
    shortDesc: 'Intelligenter Saugroboter mit iSensoric und 4000 Pa Saugkraft',
    features: ['iSensoric-Technologie', '4000 Pa Saugkraft', 'Wischfunktion', 'App & Sprachsteuerung', 'Kompaktes Design'],
    specs: [
      { key: 'Saugkraft', value: '4000 Pa' },
      { key: 'Navigation', value: 'iSensoric' },
      { key: 'Laufzeit', value: 'Bis zu 120 Minuten' },
      { key: 'Wasserbehälter', value: '200 ml' },
      { key: 'Farbe', value: 'Schwarz/Weiß' },
    ],
  },
  {
    slug: 'siemens-waschmaschine-wg44g202',
    description: `Die Siemens Waschmaschine WG44G202 ist eine kompakte Waschmaschine mit waterPerfect-Technologie. Die waterPerfect-Technologie sorgt für optimalen Wasserverbrauch. Die 9 kg Kapazität eignet sich für mittlere Haushalte. Die 1400 U/min Schleuderung sorgt für optimale Ergebnisse. Das A+++ Energiesiegel sorgt für Energieeffizienz. Die varioSpeed-Funktion verkürzt die Waschzeit. Die Home-Connect-App ermöglicht die Fernbedienung. Perfekt für effizientes Waschen.`,
    shortDesc: 'Siemens-Waschmaschine mit waterPerfect und 9 kg Kapazität',
    features: ['waterPerfect-Technologie', '9 kg Kapazität', '1400 U/min', 'A+++ Energiesiegel', 'Home Connect App'],
    specs: [
      { key: 'Kapazität', value: '9 kg' },
      { key: 'Schleuderdrehzahl', value: '1400 U/min' },
      { key: 'Energieklasse', value: 'A+++' },
      { key: 'Technologie', value: 'waterPerfect' },
      { key: 'Programme', value: '14' },
      { key: 'Abmessungen', value: '60 x 85 x 60 cm' },
    ],
  },
  {
    slug: 'samsung-bespoke-french-door-rf29a9675sr',
    description: `Der Samsung Bespoke French Door RF29A9675SR ist ein Premium-Kühlschrank mit French Door-Design. Die FlexZone-Schublade bietet flexible Temperatureinstellungen. Die Twin Cooling Plus-Technologie hält Lebensmittel besonders frisch. Die 668 Liter Volumen bietet ausreichend Platz für große Familien. Die interne Kamera zeigt den Inhalt des Kühlschranks auf dem Smartphone. Die Family Hub-Technologie macht den Kühlschrank zum digitalen Herzstück. Das elegante Design passt in moderne Küchen. Perfekt für große Familien.`,
    shortDesc: 'Premium-French-Door-Kühlschrank mit 668L und Family Hub',
    features: ['French Door-Design', '668 Liter Volumen', 'Twin Cooling Plus', 'Family Hub', 'Interne Kamera'],
    specs: [
      { key: 'Volumen', value: '668 Liter' },
      { key: 'Kühltechnologie', value: 'Twin Cooling Plus' },
      { key: 'Design', value: 'French Door' },
      { key: 'Energieklasse', value: 'A++' },
      { key: 'Abmessungen', value: '91 x 180 x 72 cm' },
    ],
  },
  {
    slug: 'samsung-bespoke-lrfx28b3230s',
    description: `Der Samsung Bespoke LRFX28B3230S ist ein eleganter Kühlschrank im Bespoke-Design. Die Counter Depth-Bauweise baut bündig mit der Arbeitsplatte. Die Twin Cooling Plus-Technologie hält Lebensmittel besonders frisch. Die 553 Liter Volumen bietet ausreichend Platz. Die LED-Beleuchtung sorgt für optimale Sicht. Das Bespoke-Design in verschiedenen Farben passt zu jeder Kücheneinrichtung. Die Smart-Things-App ermöglicht die Fernbedienung. Perfekt für designbewusste Küchen.`,
    shortDesc: 'Bespoke-Kühlschrank mit Counter Depth und Twin Cooling Plus',
    features: ['Bespoke-Design', 'Counter Depth', '553 Liter Volumen', 'Twin Cooling Plus', 'SmartThings App'],
    specs: [
      { key: 'Volumen', value: '553 Liter' },
      { key: 'Kühltechnologie', value: 'Twin Cooling Plus' },
      { key: 'Design', value: 'Bespoke Counter Depth' },
      { key: 'Energieklasse', value: 'A++' },
      { key: 'Abmessungen', value: '91 x 178 x 68 cm' },
    ],
  },
  {
    slug: 'samsung-bespoke-slide-in-range-nx60bb871112',
    description: `Der Samsung Bespoke Slide-In Range NX60BB871112 ist ein Premium-Herd mit Backofen und Ceranfeld. Das Ceranfeld bietet 5 Kochfelder für flexibles Kochen. Der Backofen bietet 6 Funktionen inkl. Heißluft. Die Smart-Things-App ermöglicht die Fernbedienung. Die Air-Fry-Funktion ermöglicht gesundes Frittieren. Die steam-assist-Funktion sorgt für saftiges Backen. Das Bespoke-Design passt zu jeder Kücheneinrichtung. Perfekt für anspruchsvolles Kochen und Backen.`,
    shortDesc: 'Premium-Slide-In-Range mit Ceranfeld und Air-Fry-Backofen',
    features: ['Bespoke-Design', '5 Kochfelder', '6 Backofenfunktionen', 'Air-Fry', 'SmartThings App'],
    specs: [
      { key: 'Kochfeld', value: 'Ceran 5 Felder' },
      { key: 'Backofen', value: '6 Funktionen inkl. Heißluft' },
      { key: 'Funktionen', value: 'Air-Fry, Steam-Assist' },
      { key: 'Steuerung', value: 'SmartThings App' },
      { key: 'Breite', value: '76 cm' },
    ],
  },
  {
    slug: 'samsung-dw60m6050fw',
    description: `Die Samsung DW60M6050FW ist ein kompakter Geschirrspüler für kleine Küchen. Die 6 Gedecke Kapazität eignet sich für kleine Haushalte. Die 6 Programme bieten individuelle Einstellungen. Die A+++ Energiesiegel sorgt für Energieeffizienz. Die Half-Load-Funktion spart Wasser bei kleiner Beladung. Die Rack-Master-Schienen bieten flexible Belademöglichkeiten. Das kompakte Design von 45 cm Breite passt in jede Küche. Perfekt für kleine Haushalte.`,
    shortDesc: 'Kompakter Samsung-Geschirrspüler mit 6 Gedecken und A+++',
    features: ['6 Gedecke Kapazität', '6 Programme', 'A+++ Energiesiegel', 'Half-Load', '45 cm Breite'],
    specs: [
      { key: 'Kapazität', value: '6 Gedecke' },
      { key: 'Energieklasse', value: 'A+++' },
      { key: 'Programme', value: '6' },
      { key: 'Breite', value: '45 cm' },
      { key: 'Abmessungen', value: '45 x 82 x 55 cm' },
    ],
  },
  {
    slug: 'samsung-trockner-dv80ta020ae',
    description: `Der Samsung Trockner DV80TA020AE ist ein Kondensations-Trockner mit Sensor-Dry-Funktion. Die Sensor-Dry-Funktion erkennt den Trocknungsgrad und stoppt automatisch. Die 8 kg Kapazität eignet sich für mittlere Haushalte. Das B Energiesiegel sorgt für moderaten Stromverbrauch. Die 15 Programme bieten individuelle Einstellungen. Die Wrinkle-Prevent-Funktion verhindert Faltenbildung. Das elegante Design passt in jede Küche. Perfekt für effizientes Trocknen.`,
    shortDesc: 'Samsung-Kondensations-Trockner mit Sensor-Dry und 8 kg Kapazität',
    features: ['Sensor-Dry-Funktion', '8 kg Kapazität', 'B Energiesiegel', 'Wrinkle-Prevent', '15 Programme'],
    specs: [
      { key: 'Kapazität', value: '8 kg' },
      { key: 'Trocknungsart', value: 'Kondensation' },
      { key: 'Energieklasse', value: 'B' },
      { key: 'Programme', value: '15' },
      { key: 'Abmessungen', value: '60 x 85 x 60 cm' },
    ],
  },
  {
    slug: 'tchibo-privilegio-bean-to-cup',
    description: `Die Tchibo Privilegio Bean to Cup ist ein Premium-Kaffeevollautomat mit edlem Metall-Design. Das feinste Mahlwerk aus Edelstahl mahlt die Bohnen besonders schonend. Die One-Touch-Funktion bereitet Espresso, Kaffee, Cappuccino und Latte Macchiato zu. Der integrierte Milchschaumer erzeugt cremigen Milchschaum. Die 3 Intensitätsstufen bieten individuelle Einstellungen. Die abnehmbare Brühgruppe ist spülmaschinenfeste. Das Premium-Design in various Farben passt zu jeder Kücheneinrichtung. Perfekt für anspruchsvolle Kaffeegenießer.`,
    shortDesc: 'Premium-Vollautomat mit Metall-Design und 3 Intensitätsstufen',
    features: ['Edelstahl-Mahlwerk', 'Metall-Design', '3 Intensitätsstufen', 'One-Touch Cappuccino', 'Spülmaschinenfeste Teile'],
    specs: [
      { key: 'Mahlwerk', value: 'Edelstahl' },
      { key: 'Milchsystem', value: 'Automatisch' },
      { key: 'Kaffeespezialitäten', value: 'Espresso, Kaffee, Cappuccino, Latte Macchiato' },
      { key: 'Wasserkapazität', value: '1,5 Liter' },
      { key: 'Bohnenbehälter', value: '250 g' },
      { key: 'Leistung', value: '1600 Watt' },
      { key: 'Farbe', value: 'Metall/Schwarz' },
    ],
  },
  {
    slug: 'tefal-easy-fry-max-ey4018',
    description: `Die Tefal Easy Fry Max EY4018 ist ein kompakter Heißluft-Fritteuse für kleine Portionen. Die 4,2 Liter Kapazität eignet sich für kleine bis mittlere Haushalte. Die 8 Funktionen bieten Vielseitigkeit für jeden Tag. Die schnelle Erhitzung spart Zeit und Energie. Die abnehmbaren Teile sind spülmaschinenfest. Die integrierte Timer-Funktion ermöglicht automatisches Garen. Das elegante Design passt in jede Küche. Perfekt für gesundes Garen ohne viel Fett.`,
    shortDesc: 'Kompakte Heißluft-Fritteuse mit 4,2L und 8 Funktionen',
    features: ['4,2 Liter Kapazität', '8 Funktionen', 'Schnelle Erhitzung', 'Timer-Funktion', 'Spülmaschinenfeste Teile'],
    specs: [
      { key: 'Kapazität', value: '4,2 Liter' },
      { key: 'Funktionen', value: '8' },
      { key: 'Leistung', value: '1700 Watt' },
      { key: 'Temperaturbereich', value: '80-200°C' },
      { key: 'Farbe', value: 'Schwarz' },
    ],
  },
  {
    slug: 'vzug-rq4601-kuhlschrank',
    description: `Der V-ZUG RQ4601 ist ein Premium-Einbau-Kühlschrank mit CoolEfficiency-Technologie. Die CoolEfficiency-Technologie sorgt für energieeffiziente Kühlung. Die 267 Liter Volumen bietet ausreichend Platz. Die LED-Beleuchtung sorgt für optimale Sicht. Die noFrost-Technologie verhindert automatisch Eisbildung. Das Schweizer Design passt in jede moderne Küche. Die einfache Bedienung ist intuitiv. Perfekt für energieeffiziente Kühlung.`,
    shortDesc: 'V-ZUG-Premium-Kühlschrank mit CoolEfficiency und noFrost',
    features: ['CoolEfficiency-Technologie', '267 Liter Volumen', 'noFrost', 'LED-Beleuchtung', 'Schweizer Design'],
    specs: [
      { key: 'Volumen', value: '267 Liter' },
      { key: 'Kühltechnologie', value: 'CoolEfficiency noFrost' },
      { key: 'Energieklasse', value: 'A++' },
      { key: 'Herkunft', value: 'Schweiz' },
      { key: 'Abmessungen', value: '56 x 177 x 55 cm' },
    ],
  },
  {
    slug: 'xiaomi-robot-vacuum-x10-plus',
    description: `Der Xiaomi Robot Vacuum X10+ ist ein intelligenter Saugroboter mit LDS-Navigation. Die LDS-Navigation erkennt den Grundriss und plant optimale Reinigungswege. Die 4000 Pa Saugkraft entfernt Staub und Schmutz gründlich. Die Wischfunktion reinigt den Boden feucht. Die automatische Staubertertiung bei满gedocktem Base-Station. Die App-Steuerung ermöglicht die Fernbedienung von überall. Die Kompatibilität mit Alexa und Google Home bietet Sprachsteuerung. Das Preis-Leistungs-Wunder für automatische Reinigung.`,
    shortDesc: 'Xiaomi-Saugroboter mit LDS-Navigation und automatischer Entleerung',
    features: ['LDS-Navigation', '4000 Pa Saugkraft', 'Wischfunktion', 'Automatische Entleerung', 'App & Sprachsteuerung'],
    specs: [
      { key: 'Saugkraft', value: '4000 Pa' },
      { key: 'Navigation', value: 'LDS Laser' },
      { key: 'Laufzeit', value: 'Bis zu 180 Minuten' },
      { key: 'Wasserbehälter', value: '200 ml' },
      { key: 'Basisstation', value: 'Ja (automatische Entleerung)' },
      { key: 'Farbe', value: 'Weiß' },
    ],
  },
];

async function main() {
  console.log(`\nMise à jour de ${updates.length} produits Haushaltsgeräte...\n`);

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
