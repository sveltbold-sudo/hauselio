import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const updates = [
  {
    slug: 'blueair-blue-2210',
    description: `Der Blueair Blue 2210 ist ein kompakter Luftreiniger für kleine Räume. Die HEPASilent-Technologie entfernt 99,97% der Partikel ab 0,1 Mikrometer. Die 3 Geschwindigkeitsstufen bieten individuelle Einstellungen. Die leise Arbeitsweise stört nicht im Alltag. Die kompakte Bauform passt in jede Ecke. Die Energy-Star-zertifizierte Energieeffizienz reduziert den Stromverbrauch. Perfekt für Schlafzimmer und kleine Büros.`,
    shortDesc: 'Kompakter Luftreiniger mit HEPASilent für kleine Räume',
    features: ['HEPASilent-Technologie', '99,97% Partikelentfernung', '3 Geschwindigkeitsstufen', 'Leise Arbeitsweise', 'Energy Star'],
    specs: [
      { key: 'Filter', value: 'HEPASilent' },
      { key: 'Partikelentfernung', value: '99,97% ab 0,1µm' },
      { key: 'Raumgröße', value: 'Bis zu 20 m²' },
      { key: 'Lautstärke', value: '24-46 dB(A)' },
      { key: 'Leistung', value: '10-30 Watt' },
      { key: 'Farbe', value: 'Weiß' },
    ],
  },
  {
    slug: 'blueair-blue-3210',
    description: `Der Blueair Blue 3210 ist ein mittelgroßer Luftreiniger für mittlere Räume. Die HEPASilent-Technologie entfernt 99,97% der Partikel ab 0,1 Mikrometer. Die 3 Geschwindigkeitsstufen bieten individuelle Einstellungen. Die leise Arbeitsweise stört nicht im Alltag. Die kompakte Bauform passt in jede Ecke. Die Energy-Star-zertifizierte Energieeffizienz reduziert den Stromverbrauch. Perfekt für Wohnzimmer und mittlere Büros.`,
    shortDesc: 'Mittelgroßer Luftreiniger mit HEPASilent für mittlere Räume',
    features: ['HEPASilent-Technologie', '99,97% Partikelentfernung', '3 Geschwindigkeitsstufen', 'Leise Arbeitsweise', 'Energy Star'],
    specs: [
      { key: 'Filter', value: 'HEPASilent' },
      { key: 'Partikelentfernung', value: '99,97% ab 0,1µm' },
      { key: 'Raumgröße', value: 'Bis zu 30 m²' },
      { key: 'Lautstärke', value: '24-46 dB(A)' },
      { key: 'Leistung', value: '10-40 Watt' },
      { key: 'Farbe', value: 'Weiß' },
    ],
  },
  {
    slug: 'blueair-blue-3410',
    description: `Der Blueair Blue 3410 ist ein mittelgroßer Luftreiniger mit Activated Coconut Carbon-Filter. Die HEPASilent-Technologie entfernt 99,97% der Partikel. Der Aktivkohle-Filter reduziert Gerüche und flüchtige organische Verbindungen. Die 3 Geschwindigkeitsstufen bieten individuelle Einstellungen. Die leise Arbeitsweise stört nicht im Alltag. Die kompakte Bauform passt in jede Ecke. Perfekt für Räume mit Geruchsbelastung.`,
    shortDesc: 'Luftreiniger mit HEPASilent und Aktivkohle-Filter',
    features: ['HEPASilent-Technologie', 'Aktivkohle-Filter', '99,97% Partikelentfernung', '3 Geschwindigkeitsstufen', 'Geruchsreduzierung'],
    specs: [
      { key: 'Filter', value: 'HEPASilent + Aktivkohle' },
      { key: 'Partikelentfernung', value: '99,97% ab 0,1µm' },
      { key: 'Raumgröße', value: 'Bis zu 30 m²' },
      { key: 'Lautstärke', value: '24-46 dB(A)' },
      { key: 'Leistung', value: '10-40 Watt' },
      { key: 'Farbe', value: 'Weiß' },
    ],
  },
  {
    slug: 'blueair-classic-480i',
    description: `Der Blueair Classic 480i ist ein Premium-Luftreiniger für große Räume. Die HEPASilent-Technologie entfernt 99,97% der Partikel. Die WLAN-Steuerung ermöglicht die Fernbedienung per Smartphone. Die automatische Luftqualitätsmessung passt die Lüftergeschwindigkeit an. Die 3 Geschwindigkeitsstufen bieten individuelle Einstellungen. Die leise Arbeitsweise stört nicht im Alltag. Die Energy-Star-zertifizierte Energieeffizienz reduziert den Stromverbrauch. Perfekt für große Wohnungen und Büros.`,
    shortDesc: 'Premium-Luftreiniger mit WLAN-Steuerung für große Räume',
    features: ['HEPASilent-Technologie', 'WLAN-Steuerung', 'Automatische Luftqualitätsmessung', '99,97% Partikelentfernung', 'Energy Star'],
    specs: [
      { key: 'Filter', value: 'HEPASilent' },
      { key: 'Partikelentfernung', value: '99,97% ab 0,1µm' },
      { key: 'Raumgröße', value: 'Bis zu 45 m²' },
      { key: 'Lautstärke', value: '32-56 dB(A)' },
      { key: 'Leistung', value: '30-80 Watt' },
      { key: 'Farbe', value: 'Weiß' },
    ],
  },
  {
    slug: 'blueair-health-protect-7440i',
    description: `Der Blueair Health Protect 7440i ist ein Premium-Luftreiniger mit GermShield-Technologie. Die GermShield-Technologie tötet 99% der Bakterien und Viren ab. Die HEPASilent-Technologie entfernt 99,97% der Partikel. Die WLAN-Steuerung ermöglicht die Fernbedienung per Smartphone. Die automatische Luftqualitätsmessung passt die Lüftergeschwindigkeit an. Die leise Arbeitsweise stört nicht im Alltag. Das Premium-Design passt in jede Raumgestaltung. Das absolute Flaggschiff für saubere Luft.`,
    shortDesc: 'Blueair-Flaggschiff mit GermShield und HEPASilent Ultra',
    features: ['GermShield-Technologie', 'HEPASilent Ultra', 'WLAN-Steuerung', '99% Keimtötung', 'Premium-Design'],
    specs: [
      { key: 'Filter', value: 'HEPASilent Ultra + GermShield' },
      { key: 'Partikelentfernung', value: '99,97% ab 0,1µm' },
      { key: 'Raumgröße', value: 'Bis zu 50 m²' },
      { key: 'Lautstärke', value: '30-56 dB(A)' },
      { key: 'Leistung', value: '30-90 Watt' },
      { key: 'Farbe', value: 'Schwarz' },
    ],
  },
  {
    slug: 'dyson-pure-cool-tp07',
    description: `Der Dyson Pure Cool TP07 ist ein purifier mit Luftreinigung und ventilator in einem. Die HEPA-Filterung entfernt 99,97% der Partikel ab 0,3 Mikrometer. Die Air Multiplier-Technologie verteilt die gereinigte Luft gleichmäßig im Raum. Die App-Steuerung ermöglicht die Fernbedienung. Die automatische Luftqualitätsmessung passt die Einstellungen an. Die 350°-Oszillation sorgt für gleichmäßige Luftverteilung. Die Night-Mode-Funktion arbeitet besonders leise. Perfekt für saubere und kühlende Luft.`,
    shortDesc: 'Dyson-Purifier mit Luftreinigung und Ventilator',
    features: ['HEPA-Filter', 'Air Multiplier-Technologie', 'App-Steuerung', '350°-Oszillation', 'Automatische Luftqualität'],
    specs: [
      { key: 'Filter', value: 'HEPA (99,97%)' },
      { key: 'Funktionen', value: 'Luftreinigung + Ventilator' },
      { key: 'Oszillation', value: '350°' },
      { key: 'Raumgröße', value: 'Bis zu 20 m²' },
      { key: 'Lautstärke', value: '28-59 dB(A)' },
      { key: 'Farbe', value: 'Weiß/Silber' },
    ],
  },
  {
    slug: 'dyson-pure-cool-tp09',
    description: `Der Dyson Pure Cool TP09 ist ein purifier mit Luftreinigung und ventilator in einem. Die HEPA-Filterung entfernt 99,97% der Partikel ab 0,3 Mikrometer. Die Air Multiplier-Technologie verteilt die gereinigte Luft gleichmäßig im Raum. Die App-Steuerung ermöglicht die Fernbedienung. Die automatische Luftqualitätsmessung passt die Einstellungen an. Die 350°-Oszillation sorgt für gleichmäßige Luftverteilung. Die Halo-Filter-Form bietet erweiterte Abdeckung. Perfekt für saubere und kühlende Luft.`,
    shortDesc: 'Dyson-Purifier mit Halo-Filter und Luftreinigung',
    features: ['HEPA-Filter', 'Halo-Filter-Form', 'Air Multiplier', 'App-Steuerung', '350°-Oszillation'],
    specs: [
      { key: 'Filter', value: 'HEPA (99,97%)' },
      { key: 'Funktionen', value: 'Luftreinigung + Ventilator' },
      { key: 'Oszillation', value: '350°' },
      { key: 'Raumgröße', value: 'Bis zu 20 m²' },
      { key: 'Lautstärke', value: '28-59 dB(A)' },
      { key: 'Farbe', value: 'Weiß/Bronze' },
    ],
  },
  {
    slug: 'dyson-purifier-big-quiet',
    description: `Der Dyson Purifier Big Quiet ist ein leiser Luftreiniger für große Räume. Die HEPA-Filterung entfernt 99,97% der Partikel ab 0,3 Mikrometer. Die Air Multiplier-Technologie verteilt die gereinigte Luft gleichmäßig im Raum. Die App-Steuerung ermöglicht die Fernbedienung. Die automatische Luftqualitätsmessung passt die Einstellungen an. Die 350°-Oszillation sorgt für gleichmäßige Luftverteilung. Die Big Quiet-Technologie arbeitet besonders leise. Perfekt für große Räume mit minimalem Geräuschpegel.`,
    shortDesc: 'Leiser Dyson-Purifier für große Räume mit minimaler Lautstärke',
    features: ['HEPA-Filter', 'Big Quiet-Technologie', 'Air Multiplier', 'App-Steuerung', '350°-Oszillation'],
    specs: [
      { key: 'Filter', value: 'HEPA (99,97%)' },
      { key: 'Funktionen', value: 'Luftreinigung + Ventilator' },
      { key: 'Oszillation', value: '350°' },
      { key: 'Raumgröße', value: 'Bis zu 30 m²' },
      { key: 'Lautstärke', value: '25-55 dB(A)' },
      { key: 'Farbe', value: 'Nickel/Gold' },
    ],
  },
  {
    slug: 'dyson-purifier-hotcool-hp07',
    description: `Der Dyson Purifier Hot+Cool HP07 ist ein Luftreiniger mit Heiz- und Kühlfunktion. Die HEPA-Filterung entfernt 99,97% der Partikel ab 0,3 Mikrometer. Die Air Multiplier-Technologie verteilt die Luft gleichmäßig im Raum. Die App-Steuerung ermöglicht die Fernbedienung. Die Heizfunktion sorgt für wohliges Warme im Winter. Die Kühlfunktion sorgt für angenehme Kühle im Sommer. Die 350°-Oszillation sorgt für gleichmßige Luftverteilung. Perfekt für ganzjährige Luftverbesserung.`,
    shortDesc: 'Dyson-Purifier mit Heiz-, Kühl- und Luftreinigungsfunktion',
    features: ['HEPA-Filter', 'Heiz- und Kühlfunktion', 'Air Multiplier', 'App-Steuerung', '350°-Oszillation'],
    specs: [
      { key: 'Filter', value: 'HEPA (99,97%)' },
      { key: 'Funktionen', value: 'Luftreinigung + Heizen + Kühlen' },
      { key: 'Oszillation', value: '350°' },
      { key: 'Raumgröße', value: 'Bis zu 20 m²' },
      { key: 'Lautstärke', value: '28-59 dB(A)' },
      { key: 'Farbe', value: 'Weiß/Silber' },
    ],
  },
  {
    slug: 'dyson-purifier-humidifycool-ph01',
    description: `Der Dyson Purifier Humidify+Cool PH01 ist ein Luftreiniger mit Luftbefeuchtung und Kühlfunktion. Die HEPA-Filterung entfernt 99,97% der Partikel ab 0,3 Mikrometer. Die Luftbefeuchtung sorgt für optimale Luftfeuchtigkeit. Die Air Multiplier-Technologie verteilt die Luft gleichmäßig im Raum. Die App-Steuerung ermöglicht die Fernbedienung. Die automatische Luftqualitätsmessung passt die Einstellungen an. Die 350°-Oszillation sorgt für gleichmäßige Luftverteilung. Perfekt für saubere, befeuchtete und kühlende Luft.`,
    shortDesc: 'Dyson-Purifier mit Luftbefeuchtung, Kühlung und HEPA',
    features: ['HEPA-Filter', 'Luftbefeuchtung', 'Kühlfunktion', 'Air Multiplier', 'App-Steuerung'],
    specs: [
      { key: 'Filter', value: 'HEPA (99,97%)' },
      { key: 'Funktionen', value: 'Luftreinigung + Befeuchtung + Kühlen' },
      { key: 'Oszillation', value: '350°' },
      { key: 'Raumgröße', value: 'Bis zu 20 m²' },
      { key: 'Lautstärke', value: '28-59 dB(A)' },
      { key: 'Farbe', value: 'Weiß/Blau' },
    ],
  },
  {
    slug: 'levoit-classic-200s',
    description: `Der Levoit Classic 200S ist ein kompakter Luftreiniger mit WLAN-Steuerung. Die 3-stufige HEPAS-Filterung entfernt 99,97% der Partikel ab 0,3 Mikrometer. Die App-Steuerung ermöglicht die Fernbedienung. Die automatische Luftqualitätsmessung passt die Lüftergeschwindigkeit an. Die Sleep-Mode-Funktion arbeitet besonders leise. Die Timer-Funktion ermöglicht automatisches Ein- und Ausschalten. Die kompakte Bauform passt in jede Ecke. Perfekt für kleine Räume.`,
    shortDesc: 'Kompakter Luftreiniger mit WLAN und 3-stufiger HEPAS-Filterung',
    features: ['WLAN-Steuerung', '3-stufige HEPAS', 'Automatische Luftqualität', 'Sleep-Mode', 'Timer-Funktion'],
    specs: [
      { key: 'Filter', value: '3-stufig HEPAS' },
      { key: 'Partikelentfernung', value: '99,97% ab 0,3µm' },
      { key: 'Raumgröße', value: 'Bis zu 20 m²' },
      { key: 'Lautstärke', value: '24-46 dB(A)' },
      { key: 'Leistung', value: '15-30 Watt' },
      { key: 'Farbe', value: 'Weiß' },
    ],
  },
  {
    slug: 'levoit-core-300',
    description: `Der Levoit Core 300 ist ein mittelgroßer Luftreiniger für mittlere Räume. Die 3-stufige HEPAS-Filterung entfernt 99,97% der Partikel ab 0,3 Mikrometer. Die automatische Luftqualitätsmessung passt die Lüftergeschwindigkeit an. Die Sleep-Mode-Funktion arbeitet besonders leise. Die Timer-Funktion ermöglicht automatisches Ein- und Ausschalten. Die kompakte Bauform passt in jede Ecke. Die Energy-Star-zertifizierte Energieeffizienz reduziert den Stromverbrauch. Perfekt für mittlere Räume.`,
    shortDesc: 'Mittelgroßer Luftreiniger mit HEPAS für mittlere Räume',
    features: ['3-stufige HEPAS', 'Automatische Luftqualität', 'Sleep-Mode', 'Timer-Funktion', 'Energy Star'],
    specs: [
      { key: 'Filter', value: '3-stufig HEPAS' },
      { key: 'Partikelentfernung', value: '99,97% ab 0,3µm' },
      { key: 'Raumgröße', value: 'Bis zu 30 m²' },
      { key: 'Lautstärke', value: '24-50 dB(A)' },
      { key: 'Leistung', value: '15-45 Watt' },
      { key: 'Farbe', value: 'Weiß' },
    ],
  },
  {
    slug: 'levoit-core-400s',
    description: `Der Levoit Core 400S ist ein mittelgroßer Luftreiniger mit WLAN-Steuerung. Die 3-stufige HEPAS-Filterung entfernt 99,97% der Partikel ab 0,3 Mikrometer. Die App-Steuerung ermöglicht die Fernbedienung. Die automatische Luftqualitätsmessung passt die Lüftergeschwindigkeit an. Die Sleep-Mode-Funktion arbeitet besonders leise. Die Timer-Funktion ermöglicht automatisches Ein- und Ausschalten. Die Energy-Star-zertifizierte Energieeffizienz reduziert den Stromverbrauch. Perfekt für vernetzte Räume.`,
    shortDesc: 'Mittelgroßer Luftreiniger mit WLAN und 3-stufiger HEPAS',
    features: ['WLAN-Steuerung', '3-stufige HEPAS', 'Automatische Luftqualität', 'Sleep-Mode', 'Energy Star'],
    specs: [
      { key: 'Filter', value: '3-stufig HEPAS' },
      { key: 'Partikelentfernung', value: '99,97% ab 0,3µm' },
      { key: 'Raumgröße', value: 'Bis zu 30 m²' },
      { key: 'Lautstärke', value: '24-50 dB(A)' },
      { key: 'Leistung', value: '15-45 Watt' },
      { key: 'Farbe', value: 'Weiß' },
    ],
  },
  {
    slug: 'levoit-lv600s-hybrid',
    description: `Der Levoit LV600S Hybrid ist ein großer Luftreiniger mit kombinierter Filtertechnologie. Die 3-stufige HEPAS-Filterung entfernt 99,97% der Partikel ab 0,3 Mikrometer. Die Aktivkohle-Filterung reduziert Gerüche und flüchtige organische Verbindungen. Die WLAN-Steuerung ermöglicht die Fernbedienung. Die automatische Luftqualitätsmessung passt die Lüftergeschwindigkeit an. Die Sleep-Mode-Funktion arbeitet besonders leise. Die Energy-Star-zertifizierte Energieeffizienz reduziert den Stromverbrauch. Perfekt für große Räume.`,
    shortDesc: 'Großer Luftreiniger mit HEPAS und Aktivkohle für große Räume',
    features: ['HEPAS + Aktivkohle', 'WLAN-Steuerung', 'Automatische Luftqualität', 'Sleep-Mode', 'Energy Star'],
    specs: [
      { key: 'Filter', value: '3-stufig HEPAS + Aktivkohle' },
      { key: 'Partikelentfernung', value: '99,97% ab 0,3µm' },
      { key: 'Raumgröße', value: 'Bis zu 50 m²' },
      { key: 'Lautstärke', value: '26-52 dB(A)' },
      { key: 'Leistung', value: '20-65 Watt' },
      { key: 'Farbe', value: 'Weiß' },
    ],
  },
  {
    slug: 'stadler-form-airgoing-kne01',
    description: `Der Stadler Form AirGoing KNE01 ist ein eleganter Raumkühler mit Verdunstungstechnologie. Die Verdunstungskühlung sorgt für natürliche Luftkühlung. Die 2 Kühlstufen bieten individuelle Einstellungen. Die Luftionisierung reinigt die Luft. Die Tankkapazität von 6 Litern ermöglicht langen Betrieb ohne Nachfüllen. Die Fernbedienung ermöglicht bequeme Steuerung. Das elegante Design passt in jede Raumgestaltung. Perfekt für natürliche Kühlung.`,
    shortDesc: 'Eleganter Verdunstungs-Luftkühler mit Ionisierung',
    features: ['Verdunstungskühlung', 'Luftionisierung', '6 Liter Tank', '2 Kühlstufen', 'Fernbedienung'],
    specs: [
      { key: 'Kühlprinzip', value: 'Verdunstung' },
      { key: 'Tankkapazität', value: '6 Liter' },
      { key: 'Raumgröße', value: 'Bis zu 20 m²' },
      { key: 'Lautstärke', value: '45 dB(A)' },
      { key: 'Leistung', value: '65 Watt' },
      { key: 'Farbe', value: 'Weiß' },
    ],
  },
  {
    slug: 'stadler-form-oskar',
    description: `Der Stadler Form Oskar ist ein kompakter Luftbefeuchter für kleine Räume. Die Verdunstungstechnologie sorgt für natürliche Luftbefeuchtung. Die 2 Befeuchtungsstufen bieten individuelle Einstellungen. Die Tankkapazität von 3,5 Litern ermöglicht langen Betrieb ohne Nachfüllen. Die Auto-Shutoff-Funktion schaltet das Gerät bei leerem Tank ab. Die LED-Beleuchtung zeigt den Betriebsstatus. Das elegante Design passt in jede Raumgestaltung. Perfekt für kleine Räume und single Wohnungen.`,
    shortDesc: 'Kompakter Luftbefeuchter mit Verdunstungstechnologie',
    features: ['Verdunstungstechnologie', '3,5 Liter Tank', '2 Befeuchtungsstufen', 'Auto-Shutoff', 'LED-Beleuchtung'],
    specs: [
      { key: 'Befeuchtungsprinzip', value: 'Verdunstung' },
      { key: 'Tankkapazität', value: '3,5 Liter' },
      { key: 'Raumgröße', value: 'Bis zu 20 m²' },
      { key: 'Lautstärke', value: '26-32 dB(A)' },
      { key: 'Leistung', value: '9-14 Watt' },
      { key: 'Farbe', value: 'Weiß' },
    ],
  },
  {
    slug: 'stadler-form-oskar-little',
    description: `Der Stadler Form Oskar Little ist ein kompakter Luftbefeuchter für kleine Räume. Die Verdunstungstechnologie sorgt für natürliche Luftbefeuchtung. Die 1 Befeuchtungsstufe bietet einfache Bedienung. Die Tankkapazität von 2,5 Litern ermöglicht langen Betrieb ohne Nachfüllen. Die Auto-Shutoff-Funktion schaltet das Gerät bei leerem Tank ab. Die LED-Beleuchtung zeigt den Betriebsstatus. Das kompakte Design passt in jede Ecke. Perfekt für kleine Räume und single Wohnungen.`,
    shortDesc: 'Kleinster Luftbefeuchter von Stadler Form mit 2,5L Tank',
    features: ['Verdunstungstechnologie', '2,5 Liter Tank', '1 Befeuchtungsstufe', 'Auto-Shutoff', 'LED-Beleuchtung'],
    specs: [
      { key: 'Befeuchtungsprinzip', value: 'Verdunstung' },
      { key: 'Tankkapazität', value: '2,5 Liter' },
      { key: 'Raumgröße', value: 'Bis zu 15 m²' },
      { key: 'Lautstärke', value: '26-30 dB(A)' },
      { key: 'Leistung', value: '9-12 Watt' },
      { key: 'Farbe', value: 'Weiß' },
    ],
  },
  {
    slug: 'stadler-form-viktor',
    description: `Der Stadler Form Viktor ist ein eleganter Luftbefeuchter mit modernem Design. Die Verdunstungstechnologie sorgt für natürliche Luftbefeuchtung. Die 2 Befeuchtungsstufen bieten individuelle Einstellungen. Die Tankkapazität von 5 Litern ermöglicht langen Betrieb ohne Nachfüllen. Die Auto-Shutoff-Funktion schaltet das Gerät bei leerem Tank ab. Die LED-Beleuchtung zeigt den Betriebsstatus. Das elegante Design in various Farben passt in jede Raumgestaltung. Perfekt für moderne Wohnungen.`,
    shortDesc: 'Eleganter Luftbefeuchter mit 5L Tank und modernem Design',
    features: ['Verdunstungstechnologie', '5 Liter Tank', '2 Befeuchtungsstufen', 'Auto-Shutoff', 'LED-Beleuchtung'],
    specs: [
      { key: 'Befeuchtungsprinzip', value: 'Verdunstung' },
      { key: 'Tankkapazität', value: '5 Liter' },
      { key: 'Raumgröße', value: 'Bis zu 30 m²' },
      { key: 'Lautstärke', value: '26-34 dB(A)' },
      { key: 'Leistung', value: '10-16 Watt' },
      { key: 'Farbe', value: 'Verschiedene' },
    ],
  },
  {
    slug: 'stadler-form-oskar-big',
    description: `Der Stadler Form Oskar Big ist ein großer Luftbefeuchter für große Räume. Die Verdunstungstechnologie sorgt für natürliche Luftbefeuchtung. Die 2 Befeuchtungsstufen bieten individuelle Einstellungen. Die Tankkapazität von 6 Litern ermöglicht langen Betrieb ohne Nachfüllen. Die Auto-Shutoff-Funktion schaltet das Gerät bei leerem Tank ab. Die LED-Beleuchtung zeigt den Betriebsstatus. Das elegante Design passt in jede Raumgestaltung. Perfekt für große Wohnungen und Büros.`,
    shortDesc: 'Großer Luftbefeuchter mit 6L Tank für große Räume',
    features: ['Verdunstungstechnologie', '6 Liter Tank', '2 Befeuchtungsstufen', 'Auto-Shutoff', 'LED-Beleuchtung'],
    specs: [
      { key: 'Befeuchtungsprinzip', value: 'Verdunstung' },
      { key: 'Tankkapazität', value: '6 Liter' },
      { key: 'Raumgröße', value: 'Bis zu 40 m²' },
      { key: 'Lautstärke', value: '28-36 dB(A)' },
      { key: 'Leistung', value: '12-20 Watt' },
      { key: 'Farbe', value: 'Weiß' },
    ],
  },
  {
    slug: 'trotec-pac-2100-e',
    description: `Der Trotec PAC 2100 E ist ein mobiler Luftkühler für kleine Räume. Die 7000 BTU Kühlleistung kühlt Räume bis zu 15 m². Die 2 Kühlstufen bieten individuelle Einstellungen. Die Luftentfeuchtungsfunktion reduziert die Luftfeuchtigkeit. Die Fernbedienung ermöglicht bequeme Steuerung. Das kompakte Design mit Rollen ermöglicht einfache Bewegung. Die_Timer-Funktion ermöglicht automatisches Ein- und Ausschalten. Perfekt für kleine Räume.`,
    shortDesc: 'Mobiler Luftkühler mit 7000 BTU für kleine Räume',
    features: ['7000 BTU Kühlleistung', '2 Kühlstufen', 'Luftentfeuchtung', 'Fernbedienung', 'Tragbar mit Rollen'],
    specs: [
      { key: 'Kühlleistung', value: '7000 BTU' },
      { key: 'Raumgröße', value: 'Bis zu 15 m²' },
      { key: 'Funktionen', value: 'Kühlen, Entfeuchten' },
      { key: 'Lautstärke', value: '54 dB(A)' },
      { key: 'Leistung', value: '900 Watt' },
      { key: 'Farbe', value: 'Weiß' },
    ],
  },
  {
    slug: 'trotec-pac-3200-e',
    description: `Der Trotec PAC 3200 E ist ein mobiler Luftkühler für mittlere Räume. Die 10000 BTU Kühlleistung kühlt Räume bis zu 25 m². Die 3 Kühlstufen bieten individuelle Einstellungen. Die Luftentfeuchtungsfunktion reduziert die Luftfeuchtigkeit. Die Fernbedienung ermöglicht bequeme Steuerung. Das kompakte Design mit Rollen ermöglicht einfache Bewegung. Die_Timer-Funktion ermöglicht automatisches Ein- und Ausschalten. Perfekt für mittlere Räume.`,
    shortDesc: 'Mobiler Luftkühler mit 10000 BTU für mittlere Räume',
    features: ['10000 BTU Kühlleistung', '3 Kühlstufen', 'Luftentfeuchtung', 'Fernbedienung', 'Tragbar mit Rollen'],
    specs: [
      { key: 'Kühlleistung', value: '10000 BTU' },
      { key: 'Raumgröße', value: 'Bis zu 25 m²' },
      { key: 'Funktionen', value: 'Kühlen, Entfeuchten' },
      { key: 'Lautstärke', value: '55 dB(A)' },
      { key: 'Leistung', value: '1200 Watt' },
      { key: 'Farbe', value: 'Weiß' },
    ],
  },
  {
    slug: 'trotec-pac-3900-e',
    description: `Der Trotec PAC 3900 E ist ein mobiler Luftkühler für große Räume. Die 13000 BTU Kühlleistung kühlt Räume bis zu 35 m². Die 3 Kühlstufen bieten individuelle Einstellungen. Die Luftentfeuchtungsfunktion reduziert die Luftfeuchtigkeit. Die Fernbedienung ermöglicht bequeme Steuerung. Das kompakte Design mit Rollen ermöglicht einfache Bewegung. Die_Timer-Funktion ermöglicht automatisches Ein- und Ausschalten. Perfekt für große Räume und Büros.`,
    shortDesc: 'Mobiler Luftkühler mit 13000 BTU für große Räume',
    features: ['13000 BTU Kühlleistung', '3 Kühlstufen', 'Luftentfeuchtung', 'Fernbedienung', 'Tragbar mit Rollen'],
    specs: [
      { key: 'Kühlleistung', value: '13000 BTU' },
      { key: 'Raumgröße', value: 'Bis zu 35 m²' },
      { key: 'Funktionen', value: 'Kühlen, Entfeuchten' },
      { key: 'Lautstärke', value: '56 dB(A)' },
      { key: 'Leistung', value: '1500 Watt' },
      { key: 'Farbe', value: 'Weiß' },
    ],
  },
];

async function main() {
  console.log(`\nMise à jour de ${updates.length} produits Klima...\n`);

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
