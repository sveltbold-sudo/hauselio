import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const kaffeeUpdates = [
  {
    slug: 'breville-barista-express',
    description: `Die Breville Barista Express ist eine halbautomatische Espressomaschine für ambitionierte Home-Baristas. Das integrierte Kegelmahlwerk aus Edelstahl mahlt frische Bohnen direkt vor dem Brühen für maximalen Geschmack. Der digitale PID-Temperaturregulator hält die Brühtemperatur konstant zwischen 90°C und 96°C. Der Crona-Milchaufschäumer erzeugt samtigen Mikroschaum für Cappuccino und Latte Art. Das 58mm-Brühsystem im Profi-Format sorgt für gleichmäßige Extraktion. Der abnehmbare 2-Liter-Wassertank mit integriertem Active-Water-Management erleichtert die Reinigung. Die integrierte Beleuchtung zeigt den Fortschritt der Kaffeezubereitung an. Die Maschine bietet 30 Einstellungen für die Mahlgradfeinheit und eine manuelle Brühdruckregulierung.`,
    shortDesc: 'Halbautomatische Espressomaschine mit integriertem Mahlwerk und Profi-Brühgruppe',
    features: ['Integriertes Kegelmahlwerk aus Edelstahl', 'PID-Temperaturregulator', '58mm Profi-Brühgruppe', 'Crona-Milchaufschäumer', '30 Mahlgradeinstellungen'],
    specs: [
      { key: 'Brühgruppe', value: '58mm Edelstahl' },
      { key: 'Mahlwerk', value: 'Kegelmahlwerk Edelstahl' },
      { key: 'Temperaturregulator', value: 'PID' },
      { key: 'Wasserkapazität', value: '2,0 Liter' },
      { key: 'Bohnenbehälter', value: '270 g' },
      { key: 'Leistung', value: '1600 Watt' },
      { key: 'Mahlgrade', value: '30 Stufen' },
      { key: 'Garantie', value: '2 Jahre' },
    ],
  },
  {
    slug: 'breville-barista-express-impress',
    description: `Die Breville Barista Express Impress ist die weiterentwickelte Version der beliebten Barista Express. Das innovative Impression Dosing System misst die Bohnenmenge automatisch und füllt die Brühgruppe präzise. Der integrierte Kegelmahlwerk aus Edelstahl bietet 25 Mahlgradeinstellungen für individuelle Brühresultate. Der intelligente Tamper-Erkennungsmechanismus sorgt für gleichmäßigen Stamper-Druck. Der Crona-Milchaufschäumer erzeugt perfekten Mikroschaum für Latte Art. Die LED-Anzeige zeigt Brühzeit, Temperatur und Mahlgrad an. Die Maschine ist kompakt genug für jede Küchenzeile und bietet dennoch professionelle Features. Perfekt für Einsteiger, die eine baristataugliche Maschine suchen.`,
    shortDesc: 'Halbautomat mit Impression Dosing und automatischer Bohnenportionierung',
    features: ['Impression Dosing System', '25 Mahlgradeinstellungen', 'Integriertes Edelstahl-Mahlwerk', 'LED-Brühanzeigen', 'Crona-Milchaufschäumer'],
    specs: [
      { key: 'Brühgruppe', value: '58mm Edelstahl' },
      { key: 'Mahlwerk', value: 'Kegelmahlwerk Edelstahl' },
      { key: 'Mahlgrade', value: '25 Stufen' },
      { key: 'Wasserkapazität', value: '2,5 Liter' },
      { key: 'Bohnenbehälter', value: '120 g' },
      { key: 'Leistung', value: '1400 Watt' },
      { key: 'Abmessungen', value: '30 x 30 x 35 cm' },
      { key: 'Garantie', value: '3 Jahre' },
    ],
  },
  {
    slug: 'breville-barista-touch',
    description: `Die Breville Barista Touch kombiniert professionelle Espresso-Technologie mit einem intuitiven Touchdisplay. Das 4-Zoll-Farbtouchscreen zeigt alle Brühoptionen übersichtlich an und ermöglicht die Speicherung individueller Rezepte. Der integrierte Kegelmahlwerk aus Edelstahl mahlt die Bohnen frisch für jede Tasse. Der automatische Milchaufschäumer erzeugt in Sekunden perfekten Cappuccino-Schaum. Die Maschine bietet 6 voreingestellte Kaffeespezialitäten und individuelle Anpassungsmöglichkeiten. Der PID-Temperaturregulator sorgt für konstante Brühtemperaturen. Das kompakte Design passt in jede Küche und bietet dennoch Profi-Qualität. Ideal für alle, die einfachen Zugang zu Premium-Espresso suchen.`,
    shortDesc: 'Touchscreen-Espressomaschine mit automatischem Milchaufschäumer',
    features: ['4-Zoll-Farbtouchdisplay', '6 voreingestellte Spezialitäten', 'Automatischer Milchaufschäumer', 'PID-Temperaturregulator', 'Integriertes Mahlwerk'],
    specs: [
      { key: 'Display', value: '4-Zoll Farbtouch' },
      { key: 'Brühgruppe', value: '58mm Edelstahl' },
      { key: 'Mahlwerk', value: 'Kegelmahlwerk' },
      { key: 'Wasserkapazität', value: '2,8 Liter' },
      { key: 'Bohnenbehälter', value: '120 g' },
      { key: 'Leistung', value: '1600 Watt' },
      { key: 'Rezept-Speicher', value: '6 Plätze' },
      { key: 'Garantie', value: '2 Jahre' },
    ],
  },
  {
    slug: 'delonghi-dinamica-ecam35055',
    description: `Die De'Longhi Dinamica Ecam35055 ist ein vollautomatischer Kaffeevollautomat mit integriertem MILK-SYSTEM für Cappuccino und Latte Macchiato. Das 13-stufige Mahlwerk aus gehärtetem Stahl zerkleinert Bohnen schonend und leise. Der automatische Latte Crema-Schaumer erzeugt cremigen Milchschaum direkt in die Tasse. Die One-Touch-Funktion bereitet mit einem Knopfdruck bis zu 12 verschiedene Kaffeespezialitäten zu. Die Aromaseal-Technologie schließt den Bohnenbehälter luftdicht und bewahrt das Aroma. Die abnehmbare Brühgruppe und der Milchschaumer sind spülmaschinenfest. Das integrierte Entkalkungssystem warnt rechtzeitig vor Wartungsintervallen. Perfekt für alle, die Vielseitigkeit und Kompaktheit in einem Gerät suchen.`,
    shortDesc: 'Kompakter Vollautomat mit Milk System und 13 Mahlgraden',
    features: ['One-Touch Cappuccino', '13-stufiges Mahlwerk', 'Aromaseal-Technologie', '12 Kaffeespezialitäten', 'Spülmaschinenfeste Teile'],
    specs: [
      { key: 'Mahlwerk', value: '13-stufig, gehärteter Stahl' },
      { key: 'Milchsystem', value: 'Automatisch Latte Crema' },
      { key: 'Kaffeespezialitäten', value: '12 Sorten' },
      { key: 'Wasserkapazität', value: '1,8 Liter' },
      { key: 'Bohnenbehälter', value: '250 g' },
      { key: 'Leistung', value: '1200 Watt' },
      { key: 'Brühdruck', value: '15 bar' },
      { key: 'Garantie', value: '2 Jahre' },
    ],
  },
  {
    slug: 'delonghi-magnifica-evo-ecam29233',
    description: `Die De'Longhi Magnifica Evo Ecam29233 ist ein kompakter Vollautomat für den täglichen Kaffeegenuss. Das 13-stufige Mahlwerk aus gehärtetem Stahl bietet individuelle Einstellungen für jeden Geschmack. Die LatteCrema-Technologie erzeugt automatisch cremigen Milchschaum für Cappuccino und Latte Macchiato. Mit der One-Touch-Funktion bereiten Sie bis zu 8 Kaffeespezialitäten mit einem Knopfdruck zu. Die Aroma-Sperre schützt die Bohnen vor Luftfeuchtigkeit und bewahrt das frische Aroma. Die abnehmbare Brühgruppe lässt sich leicht auswaschen und ist spülmaschinengeeignet. Das kompakte Gehäuse passt in jede Küchenzeile. Die LED-Steuerung mit Symbolen macht die Bedienung kinderleicht.`,
    shortDesc: 'Kompakter Vollautomat mit LatteCrema und 8 Spezialitäten',
    features: ['LatteCrema-Technologie', '13-stufiges Mahlwerk', '8 One-Touch-Spezialitäten', 'Aroma-Sperre', 'LED-Symbolsteuerung'],
    specs: [
      { key: 'Mahlwerk', value: '13-stufig, gehärteter Stahl' },
      { key: 'Milchsystem', value: 'LatteCrema automatisch' },
      { key: 'Kaffeespezialitäten', value: '8 Sorten' },
      { key: 'Wasserkapazität', value: '1,8 Liter' },
      { key: 'Bohnenbehälter', value: '270 g' },
      { key: 'Leistung', value: '1500 Watt' },
      { key: 'Brühdruck', value: '15 bar' },
      { key: 'Garantie', value: '2 Jahre' },
    ],
  },
  {
    slug: 'delonghi-magnifica-s-ecam22110b',
    description: `Die De'Longhi Magnifica S ECAM 22.110.B ist der kompakte Einstiegs-Vollautomat für alle Kaffeeliebhaber. Das 13-stufige Mahlwerk aus gehärtetem Stahl mahlt Bohnen frisch und leise für jedes Getränk. Die LatteCrema-Technologie erzeugt automatisch samtigen Milchschaum. Mit nur einem Knopfdruck bereiten Sie Cappuccino, Espresso, Kaffee oder Milchkaffee zu. Die abnehmbare Brühgruppe und der Milchaufschäumer sind einfach zu reinigen und spülmaschinenfest. Das integrierte Display zeigt alle Funktionen übersichtlich an. Die Kompaktheit von nur 20 cm Breite macht sie ideal für kleine Küchen. Ein echtes Preis-Leistungs-Wunder für den täglichen Kaffeegenuss.`,
    shortDesc: 'Kompakter Einstiegs-Vollautomat mit Milchsystem und 13 Mahlgraden',
    features: ['13-stufiges Mahlwerk', 'LatteCrema-Technologie', 'One-Touch Bedienung', 'Spülmaschinenfeste Teile', 'Nur 20 cm breit'],
    specs: [
      { key: 'Mahlwerk', value: '13-stufig, gehärteter Stahl' },
      { key: 'Milchsystem', value: 'LatteCrema automatisch' },
      { key: 'Kaffeespezialitäten', value: 'Cappuccino, Espresso, Kaffee' },
      { key: 'Wasserkapazität', value: '1,8 Liter' },
      { key: 'Bohnenbehälter', value: '270 g' },
      { key: 'Leistung', value: '1500 Watt' },
      { key: 'Brühdruck', value: '15 bar' },
      { key: 'Garantie', value: '2 Jahre' },
    ],
  },
  {
    slug: 'delonghi-primadonna-soul-ecam61075',
    description: `Die De'Longhi Primadonna Soul Ecam61075 ist der Premium-Vollautomat mit deutscher Technologie. Das feinste Mahlwerk aus gehärtetem Stahl bietet 13 Mahlgradeinstellungen für perfekten Geschmack. Die LatteCrema-System-Technologie erzeugt automatisch crémeigen Milchschaum für jeden Kaffee. Das Large-Cappuccino-System bereitet bis zu 3 Tassen gleichzeitig zu. Die Connession-App ermöglicht die Fernbedienung per Smartphone. Die Aroma-Funktion lässt Sie zwischen mild, mittel und stark wählen. Die Premium-Veredelung aus Metall und Edelstahl unterstreicht den luxuriösen Anspruch. Perfekt für anspruchsvolle Genießer, die das Beste vom Besten wollen.`,
    shortDesc: 'Premium-Vollautomat mit App-Steuerung und Large-Cappuccino-System',
    features: ['Connession-App-Steuerung', 'Large-Cappuccino-System', '13 Mahlgrade', 'Aroma-Wahl调节', 'Premium-Metallgehäuse'],
    specs: [
      { key: 'Mahlwerk', value: '13-stufig, gehärteter Stahl' },
      { key: 'Milchsystem', value: 'LatteCrema Premium' },
      { key: 'Kaffeespezialitäten', value: '12 Sorten' },
      { key: 'Wasserkapazität', value: '2,0 Liter' },
      { key: 'Bohnenbehälter', value: '300 g' },
      { key: 'Leistung', value: '1450 Watt' },
      { key: 'App-Steuerung', value: 'Ja (Connession)' },
      { key: 'Garantie', value: '2 Jahre' },
    ],
  },
  {
    slug: 'jura-d6-dark-inox',
    description: `Die Jura D6 Dark Inox ist ein eleganter Vollautomat im edlen Dunkelchrom-Design. Das feinste Jura-Mahlwerk aus Edelstahl mahlt die Bohnen besonders schonend für optimalen Geschmack. Der automatische Milchschaumer erzeugt in Sekunden perfekten Milchschaum für Cappuccino und Latte. Die P.E.P.-Technologie (Pulse Extraction Process) optimiert die Extraktionszeit für Short und Long Espressos. Die EASY-Schaltmatrix bietet alle Funktionen auf einen Blick. Das Aroma-Schutz-System bewahrt die Bohnen vor Feuchtigkeit und Licht. Die abnehmbare Milchleitung ist einfach zu reinigen und spülmaschinengeeignet. Die kompakte Bauform von nur 23,8 cm Breite passt in jede Küchenzeile.`,
    shortDesc: 'Eleganter Vollautomat mit P.E.P.-Technologie und Inox-Design',
    features: ['P.E.P.-Technologie', 'Automatischer Milchschaumer', 'Edelstahl-Mahlwerk', 'Aroma-Schutz-System', 'Nur 23,8 cm breit'],
    specs: [
      { key: 'Mahlwerk', value: 'Feines Edelstahl-Mahlwerk' },
      { key: 'Brühtechnologie', value: 'P.E.P.' },
      { key: 'Milchsystem', value: 'Automatisch' },
      { key: 'Wasserkapazität', value: '1,9 Liter' },
      { key: 'Bohnenbehälter', value: '250 g' },
      { key: 'Leistung', value: '1450 Watt' },
      { key: 'Brühdruck', value: '15 bar' },
      { key: 'Garantie', value: '2 Jahre' },
    ],
  },
  {
    slug: 'jura-e4-platinum',
    description: `Die Jura E4 Platinum ist der Einstieg in die Premium-Vollautomaten-Welt von Jura. Das professionelle Aromamahlwerk aus Edelstahl mahlt die Bohnen besonders schonend. Die P.E.P.-Technologie optimiert die Extraktionszeit für intensiven Espressogenuss. Der reduzierte Funktionsumfang auf die wichtigsten Kaffeespezialitäten sorgt für intuitive Bedienung. Das Aroma-Schutz-System bewahrt die Bohnen in einem luftdicht versiegelten Behälter. Die abnehmbare Milchleitung ist einfach zu reinigen. Die Elegance-Serie bietet ein zeitloses Design in Dunkelchrom. Perfekt für alle, die reine Kaffeequalität ohne Schnick-Schnack schätzen.`,
    shortDesc: 'Premium-Einstiegsvollautomat mit P.E.P. und Edelstahl-Mahlwerk',
    features: ['P.E.P.-Technologie', 'Aromamahlwerk Edelstahl', 'Aroma-Schutz-System', 'Einfache One-Touch-Bedienung', 'Abnehmbare Milchleitung'],
    specs: [
      { key: 'Mahlwerk', value: 'Aromamahlwerk Edelstahl' },
      { key: 'Brühtechnologie', value: 'P.E.P.' },
      { key: 'Kaffeespezialitäten', value: 'Espresso, Kaffee, Milchgetränke' },
      { key: 'Wasserkapazität', value: '1,9 Liter' },
      { key: 'Bohnenbehälter', value: '250 g' },
      { key: 'Leistung', value: '1450 Watt' },
      { key: 'Brühdruck', value: '15 bar' },
      { key: 'Garantie', value: '2 Jahre' },
    ],
  },
  {
    slug: 'jura-e8-platinum',
    description: `Die Jura E8 Platinum ist der meistverkaufte Vollautomat der Welt. Das professionelle Aromamahlwerk aus Edelstahl mahlt die Bohnen besonders schonend und leise. Die P.E.P.-Technologie (Pulse Extraction Process) pulsiert das Wasser durch das Kaffeemehl für optimalen Geschmack. Der automatische Milchschaumer erzeugt in Sekunden cremigen Milchschaum für Cappuccino und Latte Macchiato. Die EASY-Schaltmatrix bietet 7 Kaffeespezialitäten auf einen Blick. Das Aroma-Schutz-System bewahrt die Bohnen vor Feuchtigkeit. Die abnehmbare Milchleitung ist spülmaschinengeeignet. Mit 1600 Watt Leistung und 15 bar Brühdruck bietet die E8 Professional-Qualität für zuhause.`,
    shortDesc: 'Weltweit meistverkaufter Vollautomat mit P.E.P. und 7 Spezialitäten',
    features: ['P.E.P.-Technologie', 'Professionelles Aromamahlwerk', '7 One-Touch-Spezialitäten', 'Automatischer Milchschaumer', 'Spülmaschinenfeste Milchleitung'],
    specs: [
      { key: 'Mahlwerk', value: 'Aromamahlwerk Edelstahl' },
      { key: 'Brühtechnologie', value: 'P.E.P.' },
      { key: 'Kaffeespezialitäten', value: '7 Sorten' },
      { key: 'Wasserkapazität', value: '1,9 Liter' },
      { key: 'Bohnenbehälter', value: '280 g' },
      { key: 'Leistung', value: '1600 Watt' },
      { key: 'Brühdruck', value: '15 bar' },
      { key: 'Garantie', value: '2 Jahre' },
    ],
  },
  {
    slug: 'jura-s8-chrome',
    description: `Die Jura S8 Chrome ist der Premium-Vollautomat mit Touchdisplay und exklusivem Design. Das 4,3-Zoll-Touchdisplay bietet intuitive Bedienung und individuelle Rezeptanpassung. Das professionelle Aromamahlwerk aus Edelstahl mahlt die Bohnen besonders schonend. Die P.E.P.-Technologie optimiert die Extraktion für intensiven Geschmack. Der automatische Milchschaumer erzeugt in Sekunden perfekten Cappuccino-Schaum. Die S.O.E.-Technologie (Smart Operated Espresso) sorgt für konsistente Qualität. Das elegante Chrome-Gehäuse unterstreicht den Premium-Anspruch. Mit 12 Kaffeespezialitäten und individuellen Anpassungsmöglichkeiten für jeden Geschmack.`,
    shortDesc: 'Premium-Touchvollautomat mit 4,3-Zoll-Display und 12 Spezialitäten',
    features: ['4,3-Zoll-Touchdisplay', 'P.E.P.-Technologie', 'S.O.E.-Technologie', '12 Kaffeespezialitäten', 'Chrome-Gehäuse'],
    specs: [
      { key: 'Display', value: '4,3 Zoll Touch' },
      { key: 'Mahlwerk', value: 'Aromamahlwerk Edelstahl' },
      { key: 'Brühtechnologie', value: 'P.E.P.' },
      { key: 'Wasserkapazität', value: '2,0 Liter' },
      { key: 'Bohnenbehälter', value: '280 g' },
      { key: 'Leistung', value: '1450 Watt' },
      { key: 'Brühdruck', value: '15 bar' },
      { key: 'Garantie', value: '2 Jahre' },
    ],
  },
  {
    slug: 'jura-z10-platinum',
    description: `Die Jura Z10 Platinum ist das Flaggschiff der Jura-Vollautomaten und bietet 32 Kaffeespezialitäten. Die einzigartige Cold-Brew-Technologie bereitet kalte Kaffeespezialitäten mit einer einzigen Maschine. Das professionelle Aromamahlwerk aus Edelstahl mahlt die Bohnen besonders schonend und leise. Die P.E.P.-Technologie optimiert die Extraktion für jede Spezialität. Der automatische Milchschaumer erzeugt in Sekunden cremigen Milchschaum. Das 4,3-Zoll-Touchdisplay bietet intuitive Bedienung und individuelle Anpassungen. Die JURA Smart Connect App ermöglicht die Fernbedienung per Smartphone. Die Premium-Veredelung aus Metall und Edelstahl unterstreicht den luxuriösen Anspruch. Das Absolute Premium-Modell für anspruchsvollste Kaffeekenner.`,
    shortDesc: 'Flaggschiff-Vollautomat mit Cold Brew und 32 Spezialitäten',
    features: ['Cold-Brew-Technologie', '32 Kaffeespezialitäten', '4,3-Zoll-Touchdisplay', 'JURA Smart Connect App', 'Premium-Metallgehäuse'],
    specs: [
      { key: 'Mahlwerk', value: 'Professionelles Aromamahlwerk' },
      { key: 'Brühtechnologie', value: 'P.E.P.' },
      { key: 'Kaffeespezialitäten', value: '32 Sorten inkl. Cold Brew' },
      { key: 'Wasserkapazität', value: '2,4 Liter' },
      { key: 'Bohnenbehälter', value: '280 g' },
      { key: 'Leistung', value: '1450 Watt' },
      { key: 'App-Steuerung', value: 'JURA Smart Connect' },
      { key: 'Garantie', value: '2 Jahre' },
    ],
  },
  {
    slug: 'krups-evidence-plus-ea894c',
    description: `Die Krups Evidence Plus Ecommand ist ein Kaffeevollautomat mit innovativer Quattro-Technologie. Das 4-stufige Mahlwerk bietet individuelle Einstellungen für jeden Geschmack. Die Quattro-Kopf-Technologie verteilt das Wasser gleichmäßig über das Kaffeemehl für optimale Extraktion. Der thermoblock-Heizungsschnelle bringt die Maschine in 40 Sekunden auf Betriebstemperatur. Die Latte-Shot-Funktion bereitet automatisch cremigen Milchschaum. Die intuitive Touch-Steuerung bietet 8 Kaffeespezialitäten auf einen Blick. Die abnehmbare Brühgruppe ist spülmaschinenfeste. Die kompakte Bauform passt in jede Küchenzeile. Ein leistungsstarker Vollautomat für anspruchsvolle Kaffeegenießer.`,
    shortDesc: 'Quattro-Technologie Vollautomat mit 8 Spezialitäten und 40s Aufheizzeit',
    features: ['Quattro-Kopf-Technologie', '40 Sekunden Aufheizzeit', '8 Kaffeespezialitäten', 'Latte-Shot-Funktion', 'Touch-Steuerung'],
    specs: [
      { key: 'Mahlwerk', value: '4-stufig' },
      { key: 'Heizung', value: 'Thermoblock' },
      { key: 'Kaffeespezialitäten', value: '8 Sorten' },
      { key: 'Wasserkapazität', value: '2,2 Liter' },
      { key: 'Bohnenbehälter', value: '270 g' },
      { key: 'Leistung', value: '1400 Watt' },
      { key: 'Brühdruck', value: '15 bar' },
      { key: 'Garantie', value: '2 Jahre' },
    ],
  },
  {
    slug: 'krups-virtuoso-xp442c10',
    description: `Die Krups Virtuoso XP442C10 ist der Premium-Vollautomat mit 15 Kaffeespezialitäten. Das feinste Mahlwerk aus Edelstahl bietet 3 Mahlgradeinstellungen für individuelle Brühresultate. Der integrierte Milchschaumer erzeugt automatisch cremigen Milchschaum für Cappuccino und Latte. Die One-Touch-Funktion bereitet mit einem Knopfdruck alle Spezialitäten zu. Die LED-Anzeige zeigt alle Funktionen übersichtlich an. Das Aroma-System bewahrt die Bohnen vor Feuchtigkeit. Die Premium-Veredelung aus Metall und Edelstahl unterstreicht den Qualitätsanspruch. Perfekt für alle, die Vielseitigkeit und Premium-Qualität in einem Gerät suchen.`,
    shortDesc: 'Premium-Vollautomat mit 15 Spezialitäten und integriertem Milchschaumer',
    features: ['15 Kaffeespezialitäten', 'Integrierter Milchschaumer', '3 Mahlgrade', 'Aroma-System', 'Premium-Metallgehäuse'],
    specs: [
      { key: 'Mahlwerk', value: 'Edelstahl, 3 Stufen' },
      { key: 'Kaffeespezialitäten', value: '15 Sorten' },
      { key: 'Milchsystem', value: 'Automatisch' },
      { key: 'Wasserkapazität', value: '2,5 Liter' },
      { key: 'Bohnenbehälter', value: '270 g' },
      { key: 'Leistung', value: '1400 Watt' },
      { key: 'Brühdruck', value: '15 bar' },
      { key: 'Garantie', value: '2 Jahre' },
    ],
  },
  {
    slug: 'lavazza-a-modo-mio-jl01',
    description: `Die Lavazza A Modo Mio JL01 ist ein kompakter Kapselkaffeemacher im typischen Lavazza-Design. Das专利的A Modo Mio-System extrahiert Kaffee mit optimalem Druck für authentischen italienischen Espresso. Die Kapseln sind speziell für die ideale Extraktionszeit entwickelt. Die Maschine bringt sich in 25 Sekunden auf Betriebstemperatur. Die abnehmbare Auffangschale passt für große und kleine Tassen. Das kompakte Design von nur 20 cm Breite passt in jede Küche. Die Lavazza-Blend-Kapseln bieten authentischen italienischen Kaffee-Geschmack. Perfekt für alle, die italienischen Espresso ohne Aufwand genießen wollen.`,
    shortDesc: 'Kompakter Lavazza-Kapselkaffeemacher für authentischen italienischen Espresso',
    features: ['A Modo Mio System', '25 Sekunden Aufheizzeit', 'Nur 20 cm breit', 'Abnehmbare Auffangschale', 'Italienischer Kaffee-Genuss'],
    specs: [
      { key: 'Kaffeesystem', value: 'Lavazza A Modo Mio' },
      { key: 'Brühdruck', value: '10 bar' },
      { key: 'Wasserkapazität', value: '1,0 Liter' },
      { key: 'Leistung', value: '1500 Watt' },
      { key: 'Aufheizzeit', value: '25 Sekunden' },
      { key: 'Kapselkompatibilität', value: 'Lavazza A Modo Mio' },
      { key: 'Abmessungen', value: '20 x 30 x 35 cm' },
      { key: 'Garantie', value: '2 Jahre' },
    ],
  },
  {
    slug: 'lavazza-idola-clt2020',
    description: `Die Lavazza Idola CLT2020 ist ein modisches Kapselsystem mit 3 Tassengrößen. Das intelligente Kapselsystem erkennt automatisch die Kapselgröße und passt die Brühmenge an. Die 3 Tassengrößen Ristretto, Espresso und Lungo bieten Vielseitigkeit für jeden Moment. Die kompakte Bauform von nur 15 cm Breite passt selbst in die kleinste Küche. Die Energiesparfunktion schaltet die Maschine nach 9 Minuten Inaktivität aus. Das moderne Design in verschiedenen Farben passt zu jeder Kücheneinrichtung. Die Lavazza-Kapseln bieten authentischen italienischen Kaffee-Geschmack. Perfekt für alle, die italienischen Kaffee-Genuss im kompakten Format suchen.`,
    shortDesc: 'Kompaktes Kapselsystem mit 3 Tassengrößen und automatischer Erkennung',
    features: ['Automatische Kapselerkennung', '3 Tassengrößen', 'Nur 15 cm breit', 'Energiesparmodus', 'Modernes Design'],
    specs: [
      { key: 'Kaffeesystem', value: 'Lavazza Idola' },
      { key: 'Tassengrößen', value: 'Ristretto, Espresso, Lungo' },
      { key: 'Brühdruck', value: '10 bar' },
      { key: 'Wasserkapazität', value: '0,8 Liter' },
      { key: 'Leistung', value: '1400 Watt' },
      { key: 'Breite', value: '15 cm' },
      { key: 'Energiesparmodus', value: 'Ja' },
      { key: 'Garantie', value: '2 Jahre' },
    ],
  },
  {
    slug: 'melitta-enjoy-5-purge',
    description: `Die Melitta Enjoy 5 Purge ist ein Kaffeevollautomat mit Aromafavorites-Funktion. Das 5-stufige Mahlwerk bietet individuelle Einstellungen für jeden Geschmack. Die Aromafavorites-Funktion speichert Ihre persönlichen Lieblingseinstellungen. Der integrierte Milchschaumer erzeugt automatisch cremigen Milchschaum. Die One-Touch-Funktion bereitet Espresso, Kaffee, Cappuccino und Latte Macchiato zu. Die abnehmbare Brühgruppe ist einfach zu reinigen. Die Purge-Funktion spült die Leitungen automatisch nach jedem Milchgetränk. Die kompakte Bauform passt in jede Küchenzeile. Ein zuverlässiger Alltags-Vollautomat für den täglichen Kaffeegenuss.`,
    shortDesc: 'Alltags-Vollautomat mit Aromafavorites und automatischer Purge-Funktion',
    features: ['Aromafavorites-Funktion', '5-stufiges Mahlwerk', 'Automatische Purge-Funktion', 'One-Touch Cappuccino', 'Abnehmbare Brühgruppe'],
    specs: [
      { key: 'Mahlwerk', value: '5-stufig' },
      { key: 'Milchsystem', value: 'Automatisch' },
      { key: 'Kaffeespezialitäten', value: 'Espresso, Kaffee, Cappuccino, Latte Macchiato' },
      { key: 'Wasserkapazität', value: '1,5 Liter' },
      { key: 'Bohnenbehälter', value: '250 g' },
      { key: 'Leistung', value: '1200 Watt' },
      { key: 'Brühdruck', value: '15 bar' },
      { key: 'Garantie', value: '2 Jahre' },
    ],
  },
  {
    slug: 'melitta-look-v-style-perfekt',
    description: `Die Melitta Look V Style Perfekt ist ein eleganter Vollautomat im modernen V-Design. Das 5-stufige Mahlwerk bietet individuelle Einstellungen für jeden Geschmack. Die Aromafavorites-Funktion speichert Ihre persönlichen Lieblingseinstellungen. Der integrierte Milchschaumer erzeugt automatisch cremigen Milchschaum. Die One-Touch-Funktion bereitet alle gängigen Kaffeespezialitäten zu. Die abnehmbare Brühgruppe ist spülmaschinenfeste. Das elegante V-Design passt perfekt zu modernen Küchen. Die Energy-Saving-Funktion reduziert den Stromverbrauch im Standby-Modus. Ein stylischer Vollautomat für designbewusste Kaffeegenießer.`,
    shortDesc: 'Eleganter Vollautomat im V-Design mit Aromafavorites',
    features: ['V-Design', 'Aromafavorites', '5-stufiges Mahlwerk', 'Spülmaschinenfeste Brühgruppe', 'Energy-Saving-Modus'],
    specs: [
      { key: 'Mahlwerk', value: '5-stufig' },
      { key: 'Milchsystem', value: 'Automatisch' },
      { key: 'Kaffeespezialitäten', value: 'Espresso, Kaffee, Cappuccino, Latte Macchiato' },
      { key: 'Wasserkapazität', value: '1,5 Liter' },
      { key: 'Bohnenbehälter', value: '250 g' },
      { key: 'Leistung', value: '1200 Watt' },
      { key: 'Brühdruck', value: '15 bar' },
      { key: 'Garantie', value: '2 Jahre' },
    ],
  },
  {
    slug: 'melitta-purista-pure-black',
    description: `Die Melitta Purista Aromatica Pure Black ist ein minimalistischer Filterkaffeevollautomat. Das 3-stufige Mahlwerk bietet individuelle Einstellungen für milden, mittleren oder starken Kaffee. Die Aroma-Funktion past die Brühmenge an die gewünschte Intensität an. Die Large-Carafe-Kanne fasst bis zu 10 Tassen Filterkaffee. Der separate Heißwasserausgang eignet sich für Tee. Die Purista ist besonders kompakt und passt selbst in die kleinste Küche. Die abnehmbare Kaffeebehälter-Auslauf ist leicht zu reinigen. Die Energy-Saving-Funktion reduziert den Stromverbrauch. Perfekt für alle, die reinen Filterkaffee ohne Schnick-Schnack schätzen.`,
    shortDesc: 'Minimalistischer Filterkaffeevollautomat mit 3 Intensitätsstufen',
    features: ['3 Intensitätsstufen', 'Large-Caraque für 10 Tassen', 'Separater Heißwasserausgang', 'Sehr kompakt', 'Energy-Saving-Funktion'],
    specs: [
      { key: 'Mahlwerk', value: '3-stufig' },
      { key: 'Kaffeeart', value: 'Filterkaffee' },
      { key: 'Kannenkapazität', value: '10 Tassen / 1,25 Liter' },
      { key: 'Wasserkapazität', value: '1,0 Liter' },
      { key: 'Bohnenbehälter', value: '200 g' },
      { key: 'Leistung', value: '1450 Watt' },
      { key: 'Heißwasserausgang', value: 'Ja' },
      { key: 'Garantie', value: '2 Jahre' },
    ],
  },
  {
    slug: 'melitta-purista-pure-black-neu',
    description: `Die Melitta Purista Pure Black Neu ist die neue Version des beliebten Filterkaffeevollautomaten. Das 5-stufige Mahlwerk bietet erweiterte Einstellungsmöglichkeiten für individuelle Geschmäcker. Die Aromafavorites-Funktion speichert Ihre persönlichen Lieblingseinstellungen. Der integrierte Milchschaumer erzeugt automatisch cremigen Milchschaum. Die One-Touch-Funktion bereitet Espresso, Kaffee und Milchgetränke zu. Die abnehmbare Brühgruppe ist spülmaschinenfeste. Das elegante Pure-Black-Design passt zu jeder Kücheneinrichtung. Die Energy-Saving-Funktion reduziert den Stromverbrauch. Ein vielseitiger Vollautomat für alle, die Filterkaffee und Espresso in einem Gerät suchen.`,
    shortDesc: 'Neuer Vollautomat mit 5 Mahlgraden, Milchsystem und Aromafavorites',
    features: ['5-stufiges Mahlwerk', 'Aromafavorites', 'Integrierter Milchschaumer', 'One-Touch Bedienung', 'Pure-Black-Design'],
    specs: [
      { key: 'Mahlwerk', value: '5-stufig' },
      { key: 'Milchsystem', value: 'Automatisch' },
      { key: 'Kaffeespezialitäten', value: 'Espresso, Kaffee, Cappuccino, Latte Macchiato' },
      { key: 'Wasserkapazität', value: '1,5 Liter' },
      { key: 'Bohnenbehälter', value: '250 g' },
      { key: 'Leistung', value: '1500 Watt' },
      { key: 'Brühdruck', value: '15 bar' },
      { key: 'Garantie', value: '2 Jahre' },
    ],
  },
  {
    slug: 'nespresso-citiz-en895',
    description: `Die Nespresso Citiz EN895 ist eine elegante Kapselmaschine mit integriertem Milchschaumer. Das Whisper-Quiet-System macht die Maschine besonders leise beim Brühen. Die automatische Tassenhöhenanpassung passt für große und kleine Tassen. Die 19 bar Brühdruck-Technologie extrahiert das Aroma optimal aus jeder Nespresso-Kapsel. Der abnehmbare Milchtank erzeugt automatisch cremigen Milchschaum. Die Energiesparfunktion schaltet die Maschine nach 9 Minuten Inaktivität aus. Das kompakte Design von nur 23 cm Breite passt in jede Küche. Die Nespresso-Recycling-Box ermöglicht umweltgerechte Entsorgung der Kapseln. Perfekt für alle, die Kaffee-Genuss und Design schätzen.`,
    shortDesc: 'Elegante Kapselmaschine mit leisem Betrieb und integriertem Milchschaumer',
    features: ['Whisper-Quiet-System', 'Integrierter Milchschaumer', '19 bar Brühdruck', 'Automatische Tassenhöhe', 'Nespresso-Recycling'],
    specs: [
      { key: 'Kaffeesystem', value: 'Nespresso Original' },
      { key: 'Brühdruck', value: '19 bar' },
      { key: 'Milchsystem', value: 'Abnehmbarer Milchtank' },
      { key: 'Wasserkapazität', value: '1,0 Liter' },
      { key: 'Leistung', value: '1200 Watt' },
      { key: 'Aufheizzeit', value: '25 Sekunden' },
      { key: 'Breite', value: '23 cm' },
      { key: 'Garantie', value: '2 Jahre' },
    ],
  },
  {
    slug: 'nespresso-essenza-mini-d50',
    description: `Die Nespresso Essenza Mini D50 ist die kompakteste Nespresso-Maschine überhaupt. Mit nur 11 cm Breite und 20 cm Tiefe ist sie perfekt für kleine Küchen. Die 19 bar Hochdruck-Technologie extrahiert das volle Aroma aus jeder Nespresso-Kapsel. Die zwei Tassenfunktionen Espresso und Lungo bieten Vielseitigkeit. Die Energiesparfunktion schaltet die Maschine nach 9 Minuten Inaktivität aus. Das minimalistische Design in verschiedenen Farben passt zu jeder Kücheneinrichtung. Die automatische Abschaltfunktion spart Energie. Die Nespresso-Recycling-Box ermöglicht umweltgerechte Entsorgung. Der perfekte Einstieg in die Nespresso-Welt.`,
    shortDesc: 'Kompakteste Nespresso-Maschine mit 19 bar und 2 Tassenfunktionen',
    features: ['Nur 11 cm breit', '19 bar Hochdruck', 'Espresso & Lungo', 'Energiesparmodus', 'Automatische Abschaltung'],
    specs: [
      { key: 'Kaffeesystem', value: 'Nespresso Original' },
      { key: 'Brühdruck', value: '19 bar' },
      { key: 'Tassenfunktionen', value: 'Espresso, Lungo' },
      { key: 'Wasserkapazität', value: '0,6 Liter' },
      { key: 'Leistung', value: '1400 Watt' },
      { key: 'Aufheizzeit', value: '30 Sekunden' },
      { key: 'Breite', value: '11 cm' },
      { key: 'Garantie', value: '2 Jahre' },
    ],
  },
  {
    slug: 'nespresso-lattissima-touch-en560',
    description: `Die Nespresso Lattissima Touch EN560 ist die Premium-Kapselmaschine mit automatischem Milchschaumer. Das patented Fresh-Foam-System erzeugt in Sekunden cremigen Milchschaum für Cappuccino und Latte Macchiato. Die 6 Tasten bieten alle Kaffeespezialitäten auf einen Blick. Die automatische Tassenhöhenanpassung passt für große und kleine Tassen. Der abnehmbare Milchtank ist spülmaschinenfeste. Die 19 bar Brühdruck-Technologie extrahiert das volle Aroma. Die Energiesparfunktion schaltet die Maschine nach 9 Minuten Inaktivität aus. Das elegante Touch-Design in verschiedenen Farben unterstreicht den Premium-Anspruch. Perfekt für alle, die Milchgetränke ohne Aufwand genießen wollen.`,
    shortDesc: 'Premium-Kapselmaschine mit Fresh-Foam-Milchschaumer und 6 Touch-Tasten',
    features: ['Fresh-Foam-System', '6 Touch-Tasten', '19 bar Brühdruck', 'Abnehmbarer Milchtank', 'Spülmaschinenfeste Teile'],
    specs: [
      { key: 'Kaffeesystem', value: 'Nespresso Original' },
      { key: 'Brühdruck', value: '19 bar' },
      { key: 'Milchsystem', value: 'Fresh-Foam automatisch' },
      { key: 'Tassenfunktionen', value: '6 Sorten' },
      { key: 'Wasserkapazität', value: '1,0 Liter' },
      { key: 'Leistung', value: '1400 Watt' },
      { key: 'Aufheizzeit', value: '25 Sekunden' },
      { key: 'Garantie', value: '2 Jahre' },
    ],
  },
  {
    slug: 'nespresso-vertuo-next',
    description: `Die Nespresso Vertuo Next ist die Vielseitigste Nespresso-Maschine mit 5 Tassengrößen. Die innovative Centrifusion-Technologie zentrifugiert die Kapsel mit bis zu 7.000 Umdrehungen pro Minute für optimalen Geschmack. Die Barcode-Technologie erkennt jede Kapsel automatisch und passt Brühzeit, Temperatur und Drehzahl an. Die 5 Tassengrößen Espresso, Double Espresso, Gran Lungo, Mug und Alto bieten Vielseitigkeit für jeden Moment. Die large-Cara-Kanne fasst bis zu 535 ml für große Tassen. Das elegante Design in verschiedenen Farben passt zu jeder Kücheneinrichtung. Die 100% recycelbaren Aluminium-Kapseln sind umweltfreundlich. Perfekt für alle, die Kaffeevielseitigkeit im modernen Design suchen.`,
    shortDesc: 'Vielseitigste Nespresso-Maschine mit Centrifusion und 5 Tassengrößen',
    features: ['Centrifusion-Technologie', '5 Tassengrößen', 'Barcode-Erkennung', 'Bis zu 535 ml Mug', '100% recycelbare Kapseln'],
    specs: [
      { key: 'Kaffeesystem', value: 'Nespresso Vertuo' },
      { key: 'Technologie', value: 'Centrifusion' },
      { key: 'Tassengrößen', value: 'Espresso bis Alto (535 ml)' },
      { key: 'Wasserkapazität', value: '1,7 Liter' },
      { key: 'Leistung', value: '1600 Watt' },
      { key: 'Aufheizzeit', value: '30 Sekunden' },
      { key: 'Kapseln', value: 'Nespresso Vertuo' },
      { key: 'Garantie', value: '2 Jahre' },
    ],
  },
  {
    slug: 'nespresso-vertuo-pop',
    description: `Die Nespresso Vertuo Pop ist die kompakte Variante der Vertuo-Serie mit 5 Tassengrößen. Die Centrifusion-Technologie zentrifugiert die Kapsel mit bis zu 7.000 Umdrehungen pro Minute für optimalen Geschmack. Die Barcode-Technologie erkennt jede Kapsel automatisch und passt die Brühparameter an. Die 5 Tassengrößen bieten Vielseitigkeit für jeden Moment. Das kompakte Design von nur 14 cm Breite passt selbst in die kleinste Küche. Die verschiedenen Farboptionen machen jede Kaffeeecke zum Highlight. Die 100% recycelbaren Aluminium-Kapseln sind umweltfreundlich. Die Vertuo Pop ist der perfekte Einstieg in die Vertuo-Welt.`,
    shortDesc: 'Kompakte Vertuo-Maschine mit 5 Tassengrößen und Centrifusion',
    features: ['Centrifusion-Technologie', '5 Tassengrößen', 'Nur 14 cm breit', 'Barcode-Erkennung', 'Farben-Mix-Design'],
    specs: [
      { key: 'Kaffeesystem', value: 'Nespresso Vertuo' },
      { key: 'Technologie', value: 'Centrifusion' },
      { key: 'Tassengrößen', value: '5 Größen' },
      { key: 'Wasserkapazität', value: '0,8 Liter' },
      { key: 'Leistung', value: '1400 Watt' },
      { key: 'Breite', value: '14 cm' },
      { key: 'Kapseln', value: 'Nespresso Vertuo' },
      { key: 'Garantie', value: '2 Jahre' },
    ],
  },
  {
    slug: 'nespresso-vertuo-pop-plus',
    description: `Die Nespresso Vertuo Pop+ ist die erweiterte Variante der Vertuo Pop mit größerm Wassertank. Die Centrifusion-Technologie zentrifugiert die Kapsel mit bis zu 7.000 Umdrehungen pro Minute für optimalen Geschmack. Die Barcode-Technologie erkennt jede Kapsel automatisch und passt die Brühparameter an. Die 5 Tassengrößen bieten Vielseitigkeit für jeden Moment. Der größere 1,5-Liter-Wassertank ermöglicht mehr Tassen ohne Nachfüllen. Das kompakte Design passt in jede Küche. Die verschiedenen Farboptionen machen jede Kaffeeecke zum Highlight. Die 100% recycelbaren Aluminium-Kapseln sind umweltfreundlich. Die perfekte Kapselmaschine für Vieltrinker.`,
    shortDesc: 'Vertuo Pop mit großem 1,5L-Wassertank und 5 Tassengrößen',
    features: ['Centrifusion-Technologie', '5 Tassengrößen', '1,5 Liter Wassertank', 'Barcode-Erkennung', 'Kompaktes Design'],
    specs: [
      { key: 'Kaffeesystem', value: 'Nespresso Vertuo' },
      { key: 'Technologie', value: 'Centrifusion' },
      { key: 'Tassengrößen', value: '5 Größen' },
      { key: 'Wasserkapazität', value: '1,5 Liter' },
      { key: 'Leistung', value: '1600 Watt' },
      { key: 'Kapseln', value: 'Nespresso Vertuo' },
      { key: 'Abmessungen', value: '14 x 32 x 30 cm' },
      { key: 'Garantie', value: '2 Jahre' },
    ],
  },
  {
    slug: 'saeco-granarista-sm5580',
    description: `Die Saeco Granarista SM5580 ist ein kompakter Vollautomat für den täglichen Kaffeegenuss. Das 5-stufige Mahlwerk bietet individuelle Einstellungen für jeden Geschmack. Der integrierte Milchschaumer erzeugt automatisch cremigen Milchschaum. Die One-Touch-Funktion bereitet Espresso, Kaffee, Cappuccino und Latte Macchiato zu. Die automatische Reinigungsfunktion spült die Leitungen nach jedem Milchgetränk. Die abnehmbare Brühgruppe ist spülmaschinenfeste. Die kompakte Bauform von nur 20 cm Breite passt in jede Küche. Die Energiesparfunktion reduziert den Stromverbrauch im Standby-Modus. Ein zuverlässiger Alltags-Vollautomat für den täglichen Kaffeegenuss.`,
    shortDesc: 'Kompakter Vollautomat mit Milchsystem und 5 Mahlgraden',
    features: ['5-stufiges Mahlwerk', 'Automatischer Milchschaumer', 'One-Touch Bedienung', 'Automatische Reinigung', 'Nur 20 cm breit'],
    specs: [
      { key: 'Mahlwerk', value: '5-stufig' },
      { key: 'Milchsystem', value: 'Automatisch' },
      { key: 'Kaffeespezialitäten', value: 'Espresso, Kaffee, Cappuccino, Latte Macchiato' },
      { key: 'Wasserkapazität', value: '1,5 Liter' },
      { key: 'Bohnenbehälter', value: '250 g' },
      { key: 'Leistung', value: '1200 Watt' },
      { key: 'Brühdruck', value: '15 bar' },
      { key: 'Garantie', value: '2 Jahre' },
    ],
  },
  {
    slug: 'saeco-xelsis-sm8780',
    description: `Die Saeco Xelsis SM8780 ist der Premium-Vollautomat mit HygieSteaM-Technologie. Das feinste Mahlwerk aus gehärtetem Stahl bietet 12 Mahlgradeinstellungen. Die HygieSteaM-Technologie nutztheißen Dampf zur automatischen Reinigung der Milchleitung. Die LatteDuo-Funktion bereitet bis zu 2 Tassen gleichzeitig zu. Die 6 Kaffeespezialitäten sind über die intuitive Touch-Steuerung wählbar. Die abnehmbare Brühgruppe ist spülmaschinenfeste. Die Premium-Veredelung aus Metall und Edelstahl unterstreicht den Qualitätsanspruch. Die inteligente Aroma-Erkennung passt die Brühparameter automatisch an. Perfekt für anspruchsvolle Kaffeegenießer.`,
    shortDesc: 'Premium-Vollautomat mit HygieSteaM-Technologie und Touch-Steuerung',
    features: ['HygieSteaM-Technologie', '12 Mahlgrade', 'LatteDuo-Funktion', 'Touch-Steuerung', 'Premium-Gehäuse'],
    specs: [
      { key: 'Mahlwerk', value: '12-stufig, gehärteter Stahl' },
      { key: 'Milchsystem', value: 'HygieSteaM automatisch' },
      { key: 'Kaffeespezialitäten', value: '6 Sorten' },
      { key: 'Wasserkapazität', value: '2,5 Liter' },
      { key: 'Bohnenbehälter', value: '300 g' },
      { key: 'Leistung', value: '1450 Watt' },
      { key: 'Brühdruck', value: '15 bar' },
      { key: 'Garantie', value: '2 Jahre' },
    ],
  },
  {
    slug: 'siemens-eq300-s300',
    description: `Die Siemens EQ300 S300 ist der Einstiegsvollautomat der EQ-Serie für den täglichen Kaffeegenuss. Das 3-stufige Mahlwerk bietet grundlegende Einstellungen für milden, mittleren oder starken Kaffee. Der automatische Milchschaumer erzeugt cremigen Milchschaum für Cappuccino und Latte Macchiato. Die One-Touch-Funktion bereitet alle gängigen Spezialitäten zu. Die automatische Spülung reinigt die Leitungen nach jedem Milchgetränk. Die abnehmbare Brühgruppe ist spülmaschinenfeste. Die kompakte Bauform passt in jede Küchenzeile. Die Siemens-Qualität bietet Zuverlässigkeit und Langlebigkeit. Der perfekte Einstieg in die Siemens-Vollautomaten-Welt.`,
    shortDesc: 'Einstiegsvollautomat mit 3 Mahlgraden und automatischem Milchschaumer',
    features: ['3-stufiges Mahlwerk', 'Automatischer Milchschaumer', 'One-Touch Bedienung', 'Automatische Spülung', 'Kompaktes Design'],
    specs: [
      { key: 'Mahlwerk', value: '3-stufig' },
      { key: 'Milchsystem', value: 'Automatisch' },
      { key: 'Kaffeespezialitäten', value: 'Espresso, Kaffee, Cappuccino, Latte Macchiato' },
      { key: 'Wasserkapazität', value: '1,4 Liter' },
      { key: 'Bohnenbehälter', value: '250 g' },
      { key: 'Leistung', value: '1200 Watt' },
      { key: 'Brühdruck', value: '15 bar' },
      { key: 'Garantie', value: '2 Jahre' },
    ],
  },
  {
    slug: 'siemens-eq500-plus-s500',
    description: `Die Siemens EQ500 Plus S500 ist der Mittelklasse-Vollautomat mit erweiterten Funktionen. Das 5-stufige Mahlwerk bietet individuelle Einstellungen für jeden Geschmack. Die autoMilk-Technologie erzeugt automatisch cremigen Milchschaum und reinigt die Milchleitung nach jedem Getränk. Die oneTouch DoubleCup-Funktion bereitet 2 Tassen gleichzeitig zu. Die AromaBalance-Funktion passt die Brühparameter an Ihre Vorlieben an. Die abnehmbare Brühgruppe ist spülmaschinenfeste. Die Siemens-Home-Connect-App ermöglicht die Fernbedienung per Smartphone. Die Premium-Veredelung unterstreicht den Qualitätsanspruch. Ein vielseitiger Vollautomat für anspruchsvolle Kaffeegenießer.`,
    shortDesc: 'Mittelklasse-Vollautomat mit autoMilk und Home Connect App',
    features: ['autoMilk-Technologie', '5 Mahlgrade', 'oneTouch DoubleCup', 'Home Connect App', 'AromaBalance-Funktion'],
    specs: [
      { key: 'Mahlwerk', value: '5-stufig' },
      { key: 'Milchsystem', value: 'autoMilk automatisch' },
      { key: 'Kaffeespezialitäten', value: '8 Sorten' },
      { key: 'Wasserkapazität', value: '1,7 Liter' },
      { key: 'Bohnenbehälter', value: '250 g' },
      { key: 'Leistung', value: '1500 Watt' },
      { key: 'App-Steuerung', value: 'Home Connect' },
      { key: 'Garantie', value: '2 Jahre' },
    ],
  },
  {
    slug: 'siemens-eq9-plus-s700',
    description: `Die Siemens EQ9 Plus S700 ist der Premium-Vollautomat mit vielseitigsten Funktionen. Das 5-stufige Mahlwerk bietet individuelle Einstellungen für jeden Geschmack. Die autoMilk-Technologie erzeugt automatisch cremigen Milchschaum und reinigt sich selbst. Die oneTouch DoubleCup-Funktion bereitet 2 Tassen gleichzeitig zu. Die AromaBalance-Funktion passt die Brühparameter an Ihre Vorlieben an. Die Home Connect App ermöglicht die Fernbedienung per Smartphone. Die abnehmbare Brühgruppe ist spülmaschinenfeste. Die Premium-Veredelung aus Metall und Edelstahl unterstreicht den luxuriösen Anspruch. Perfekt für anspruchsvolle Kaffeegenießer, die das Beste vom Besten wollen.`,
    shortDesc: 'Premium-Vollautomat mit autoMilk, DoubleCup und Home Connect',
    features: ['autoMilk-Technologie', 'oneTouch DoubleCup', 'Home Connect App', 'AromaBalance', '5 Mahlgrade'],
    specs: [
      { key: 'Mahlwerk', value: '5-stufig' },
      { key: 'Milchsystem', value: 'autoMilk automatisch' },
      { key: 'Kaffeespezialitäten', value: '10 Sorten' },
      { key: 'Wasserkapazität', value: '2,0 Liter' },
      { key: 'Bohnenbehälter', value: '300 g' },
      { key: 'Leistung', value: '1600 Watt' },
      { key: 'App-Steuerung', value: 'Home Connect' },
      { key: 'Garantie', value: '2 Jahre' },
    ],
  },
  {
    slug: 'tchibo-barista-bean-to-cup',
    description: `Die Tchibo Barista Bean to Cup ist ein Kaffeevollautomat mit integriertem Mahlwerk. Das feinste Mahlwerk aus Edelstahl mahlt die Bohnen frisch für jede Tasse. Die 3 Intensitätsstufen bieten individuelle Einstellungen für milden, mittleren oder starken Kaffee. Der integrierte Milchschaumer erzeugt automatisch cremigen Milchschaum. Die One-Touch-Funktion bereitet Espresso, Kaffee, Cappuccino und Latte Macchiato zu. Die abnehmbare Brühgruppe ist spülmaschinenfeste. Das kompakte Design passt in jede Küchenzeile. Die Tchibo-Qualität bietet Zuverlässigkeit und Langlebigkeit. Perfekt für alle, die frischen Kaffee-Genuss ohne Aufwand suchen.`,
    shortDesc: 'Vollautomat mit Edelstahl-Mahlwerk und 3 Intensitätsstufen',
    features: ['Edelstahl-Mahlwerk', '3 Intensitätsstufen', 'Automatischer Milchschaumer', 'One-Touch Bedienung', 'Spülmaschinenfeste Teile'],
    specs: [
      { key: 'Mahlwerk', value: 'Edelstahl' },
      { key: 'Intensitätsstufen', value: '3 Stufen' },
      { key: 'Milchsystem', value: 'Automatisch' },
      { key: 'Kaffeespezialitäten', value: 'Espresso, Kaffee, Cappuccino, Latte Macchiato' },
      { key: 'Wasserkapazität', value: '1,5 Liter' },
      { key: 'Bohnenbehälter', value: '250 g' },
      { key: 'Leistung', value: '1600 Watt' },
      { key: 'Garantie', value: '2 Jahre' },
    ],
  },
];

async function main() {
  console.log(`\nMise à jour de ${kaffeeUpdates.length} produits Kaffee...\n`);

  let updated = 0;
  let errors = 0;

  for (const data of kaffeeUpdates) {
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

      // Update product with new description, shortDesc, features
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
