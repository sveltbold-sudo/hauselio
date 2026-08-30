import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const updates = [
  {
    slug: 'ikea-dirigera-hub',
    description: `Die IKEA DIRIGERA Hub ist die zentrale Steuerungseinheit für Ihr smartes Zuhause. Das Hub verbindet alle IKEA TRADFRI- und DIRIGERA-fähigen Geräte über Zigbee 3.0. Die intuitive App-Steuerung ermöglicht die Einrichtung und Steuerung aller Geräte über Smartphone. Die Kompatibilität mit Matter und Thread sorgt für zukunftssichere Konnektivität. Die kompakte Bauform lässt sich dezent in jeder Ecke platzieren. Die einfache Einrichtung in wenigen Minuten macht den Einstieg in die Smart-Home-Welt kinderleicht. Die雷迪格拉-Unterstützung für bis zu 50 Geräte bietet Platz für Erweiterungen. Das Herzstück für ein vernetztes Zuhause.`,
    shortDesc: 'Zentrale Smart-Home-Steuerung mit Zigbee 3.0, Matter und Thread',
    features: ['Zigbee 3.0, Matter, Thread', 'Bis zu 50 Geräte', 'Einfache App-Steuerung', 'Kompaktes Design', 'Zukunftssicher'],
    specs: [
      { key: 'Protokoll', value: 'Zigbee 3.0, Matter, Thread' },
      { key: 'Max. Geräte', value: '50' },
      { key: 'App-Steuerung', value: 'Ja (iOS/Android)' },
      { key: 'Abmessungen', value: 'Ø 10 cm, H 3,5 cm' },
      { key: 'Farbe', value: 'Schwarz/Weiß' },
    ],
  },
  {
    slug: 'ikea-parasoll-door-window-sensor',
    description: `Der IKEA PARASOLL Door/Window Sensor erkennt automatisch das Öffnen und Schließen von Türen und Fenstern. Der Magnetkontakt meldet den Zustand an das DIRIGERA- oder TRADFRI-Hub. Die einfache Installation mit Doppelseitigem Klebeband erfordert keine Bohrungen. Die kleine Bauform passt unauffällig an jede Tür oder jedes Fenster. Die Batterielaufzeit von bis zu 2 Jahren sorgt für langfristigen Einsatz. Die Kompatibilität mit Zigbee 3.0 sorgt für zuverlässige Kommunikation. Perfekt für die Überwachung und Steuerung Ihres smarten Zuhauses.`,
    shortDesc: 'Magnetischer Tür-/Fenstersensor für Zigbee-Smart-Home-Systeme',
    features: ['Zigbee 3.0 Kompatibel', 'Batterielaufzeit 2 Jahre', 'Einfache Klebeband-Montage', 'Kompaktes Design', 'DIRIGERA/TRADFRI kompatibel'],
    specs: [
      { key: 'Protokoll', value: 'Zigbee 3.0' },
      { key: 'Batterie', value: 'CR2032 (2 Jahre)' },
      { key: 'Abmessungen', value: '4,5 x 2,2 x 1,0 cm' },
      { key: 'Reichweite', value: 'Bis zu 10 m (hindernisfrei)' },
      { key: 'Farbe', value: 'Weiß' },
    ],
  },
  {
    slug: 'ikea-praktlysing-smart-blind',
    description: `Die IKEA PRAKTLYSING Smart Blind ist eine elektrisch verstellbare Jalousie für smarte Fensterbedeckung. Die präzise Motorsteuerung ermöglicht millimetergenaue Einstellungen. Die Fernbedienung über App oder Sprachsteuerung (Alexa, Google) bietet Komfort. Die vorprogrammierten Timer ermöglichen automatisches Öffnen und Schließen. Die leise Motorsteuerung stört nicht im Alltag. Die einfache Installation in vorhandene Fensterrahmen erfordert keine professionelle Montage. Die Batterielaufzeit von bis zu 6 Monaten sorgt für langfristigen Einsatz. Perfekt für Komfort und Energieeinsparung.`,
    shortDesc: 'Elektrische Jalousie mit App- und Sprachsteuerung',
    features: ['Motorisierte Steuerung', 'App- & Sprachsteuerung', 'Timer-Funktion', 'Leiser Betrieb', 'Einfache Installation'],
    specs: [
      { key: 'Steuerung', value: 'App, Sprache (Alexa, Google)' },
      { key: 'Motor', value: 'Leise Motorsteuerung' },
      { key: 'Batterielaufzeit', value: 'Bis zu 6 Monate' },
      { key: 'Protokoll', value: 'Zigbee 3.0' },
      { key: 'Farbe', value: 'Weiß' },
    ],
  },
  {
    slug: 'ikea-starkvind-air-purifier',
    description: `Der IKEA STARKVIND Air Purifier ist einLuftreiniger mit smarter Steuerung. Der HEPA-Filter entfernt 99,97% der Partikel ab 0,3 Mikrometer. Die automatische Luftqualitätsmessung passt die Lüftergeschwindigkeit an. Die App-Steuerung ermöglicht die Fernbedienung und Timer-Einstellungen. Die 5 Stufen bieten individuelle Einstellungen. Die leise Arbeitsweise stört nicht im Alltag. Die kompakte Bauform passt in jede Raumgröße. Die einfache Filterwechsel sorgt für langfristige Hygiene. Perfekt für Allergiker und saubere Luft im Zuhause.`,
    shortDesc: 'Luftreiniger mit HEPA-Filter und smarter Steuerung',
    features: ['HEPA-Filter (99,97%)', 'Automatische Luftqualitätsmessung', '5 Stufen', 'App-Steuerung', 'Leiser Betrieb'],
    specs: [
      { key: 'Filter', value: 'HEPA (99,97% ab 0,3µm)' },
      { key: 'Luftleistung', value: 'Bis zu 200 m³/h' },
      { key: 'Raumgröße', value: 'Bis zu 30 m²' },
      { key: 'Lautstärke', value: 'Bis zu 52 dB(A)' },
      { key: 'Leistung', value: '10-30 Watt' },
      { key: 'Farbe', value: 'Schwarz/Weiß' },
    ],
  },
  {
    slug: 'ikea-symfonisk-table-speaker',
    description: `Der IKEA SYMFONISK Table Speaker ist ein kompakter WLAN-Lautsprecher mit Sonos-Integration. Der integrierte Subwoofer sorgt für kraftvollen Klang. Die WLAN-Verbindung ermöglicht das Abspielen von Musik aus diversen Streaming-Diensten. Die stereofonische Klangqualität sorgt für ein immersives Hörerlebnis. Die einfache Einrichtung über die Sonos-App ist in wenigen Minuten erledigt. Die kompakte Bauform passt als Tischlautsprecher in jede Ecke. Die Kombination aus IKEA-Design und Sonos-Qualität macht den SYMFONISK zu einem besonderen Lautsprecher.`,
    shortDesc: 'Kompakter WLAN-Lautsprecher mit Sonos-Integration',
    features: ['Sonos-Integration', 'WLAN-Verbindung', 'Integrierter Subwoofer', 'Stereofonisch', 'Streaming-fähig'],
    specs: [
      { key: 'Konnektivität', value: 'WLAN (Wi-Fi)' },
      { key: 'Lautsprecher', value: 'Woofer + Tweeter' },
      { key: 'Streaming', value: 'Spotify, AirPlay 2, Alexa' },
      { key: 'Abmessungen', value: '16 x 16 x 10 cm' },
      { key: 'Farbe', value: 'Schwarz/Weiß' },
    ],
  },
  {
    slug: 'ikea-tradfri-starter-kit-e27',
    description: `Das IKEA TRADFRI Starter Kit E27 ist der perfekte Einstieg in die smarte Beleuchtung. Der Hub und 2 E27-LED-Lampen bieten alles für den Anfang. Die einfache Installation in vorhandene Leuchtmittel-Fassungen erfordert keine Fachkenntnisse. Die dimmbare Lichtstärke (100-2200 Lumen) passt jede Stimmung. Die Farbtemperatur (2200-6500K) reicht von warmweiß bis tageslichtweiß. Die Fernbedienung über App oder Sprachsteuerung (Alexa, Google) bietet Komfort. Die Kompatibilität mit Zigbee 3.0 sorgt für zuverlässige Kommunikation. Der ideale Einstieg in die smarte Beleuchtung.`,
    shortDesc: 'Smart-Home-Starter-Kit mit Hub und 2 E27-LED-Lampen',
    features: ['Zigbee 3.0 Hub inklusive', '2 dimmbare E27-LED-Lampen', 'Farbtemperatur 2200-6500K', 'App- & Sprachsteuerung', 'Einfache Installation'],
    specs: [
      { key: 'Protokoll', value: 'Zigbee 3.0' },
      { key: 'Lichtstrom', value: '100-2200 Lumen' },
      { key: 'Farbtemperatur', value: '2200-6500K' },
      { key: 'Leistung', value: '8,06 Watt pro Lampe' },
      { key: 'Lebensdauer', value: '25.000 Stunden' },
      { key: 'Farbe', value: 'Weiß' },
    ],
  },
  {
    slug: 'ikea-vallhorn-motion-sensor',
    description: `Der IKEA VALLHORN Motion Sensor erkennt Bewegungen und passt die Beleuchtung automatisch an. Der Infrarotsensor erkennt Bewegungen bis zu 10 Meter Entfernung. Die integrierte Beleuchtungssensibilität passt sich an die Helligkeit an. Die Fernbedienung über App oder Sprachsteuerung (Alexa, Google) bietet Komfort. Die einfache Installation mit Doppelseitigem Klebeband erfordert keine Bohrungen. Die Batterielaufzeit von bis zu 2 Jahren sorgt für langfristigen Einsatz. Die Kompatibilität mit Zigbee 3.0 sorgt für zuverlässige Kommunikation. Perfekt für Bewegungsmelder und smarte Beleuchtung.`,
    shortDesc: 'Bewegungsmelder mit integriertem Beleuchtungssensor',
    features: ['Infrarotsensor (10 m Reichweite)', 'Automatische Beleuchtung', 'Zigbee 3.0', '2 Jahre Batterielaufzeit', 'Einfache Montage'],
    specs: [
      { key: 'Sensor', value: 'Infrarot' },
      { key: 'Reichweite', value: 'Bis zu 10 m' },
      { key: 'Protokoll', value: 'Zigbee 3.0' },
      { key: 'Batterie', value: '2x AAA (2 Jahre)' },
      { key: 'Abmessungen', value: '8 x 8 x 4 cm' },
      { key: 'Farbe', value: 'Schwarz/Weiß' },
    ],
  },
  {
    slug: 'nanoleaf-elements-hexagons',
    description: `Die Nanoleaf Elements Hexagons sind modulare LED-Wandpaneale für kreative Lichtdesigns. Die abgerundeten Kanten sorgen für ein weiches, organisches Licht. Die 16 Millionen Farben und diverse White-Shades bieten endlose Möglichkeiten. Die Touch-Integration ermöglicht interaktive Lichtszenen. Die Music-Sync-Funktion reagiert auf Musik und erstellt dynamische Lichtshows. Die einfache Installation mit 3M-Klebepads erfordert keine professionelle Montage. Die Kompatibilität mit HomeKit, Google Home und Alexa bietet maximale Konnektivität. Perfekt für kreative Wandgestaltung und stimmungsvolles Licht.`,
    shortDesc: 'Modulare LED-Wandpaneale mit Touch- und Music-Sync',
    features: ['16 Millionen Farben', 'Touch-Integration', 'Music-Sync', 'HomeKit/Google/Alexa', 'Modulare Hexagon-Form'],
    specs: [
      { key: 'Farben', value: '16 Millionen + White-Shades' },
      { key: 'Panels', value: '7 pro Starter Kit' },
      { key: 'Lichtstrom', value: '100 Lumen pro Panel' },
      { key: 'Leistung', value: '6 Watt pro Panel' },
      { key: 'Lebensdauer', value: '25.000 Stunden' },
      { key: 'Konnektivität', value: 'Wi-Fi, Bluetooth, Thread' },
    ],
  },
  {
    slug: 'nanoleaf-essential-a19-bulb',
    description: `Die Nanoleaf Essential A19 Bulb ist eine smarte LED-Lampe mit Thread-Unterstützung. Die 16 Millionen Farben und diverse White-Shades bieten endlose Möglichkeiten. Die Thread-Unterstützung sorgt für schnelle und zuverlässige Kommunikation. Die einfache Installation in vorhandene E27-Fassungen erfordert keine Fachkenntnisse. Die dimmbare Lichtstärke passt jede Stimmung. Die Kompatibilität mit HomeKit, Google Home und Alexa bietet maximale Konnektivität. Die Nanoleaf-App ermöglicht die Erstellung individueller Lichtszenen. Perfekt für smarte Beleuchtung im ganzen Zuhause.`,
    shortDesc: 'Smarte E27-LED-Lampe mit 16 Millionen Farben und Thread',
    features: ['16 Millionen Farben', 'Thread-Unterstützung', 'Dimmbar', 'HomeKit/Google/Alexa', 'Einfache E27-Installation'],
    specs: [
      { key: 'Farben', value: '16 Millionen + White-Shades' },
      { key: 'Lichtstrom', value: '806 Lumen' },
      { key: 'Farbtemperatur', value: '2700-6500K' },
      { key: 'Leistung', value: '9 Watt' },
      { key: 'Lebensdauer', value: '15.000 Stunden' },
      { key: 'Fassung', value: 'E27' },
    ],
  },
  {
    slug: 'nanoleaf-shapes-hexagons',
    description: `Die Nanoleaf Shapes Hexagons sind modulare LED-Wandpaneale mit abgerundeten Kanten. Die 16 Millionen Farben und diverse White-Shades bieten endlose Möglichkeiten. Die Touch-Integration ermöglicht interaktive Lichtszenen. Die Music-Sync-Funktion reagiert auf Musik und erstellt dynamische Lichtshows. Die einfache Installation mit 3M-Klebepads erfordert keine professionelle Montage. Die Kompatibilität mit HomeKit, Google Home und Alexa bietet maximale Konnektivität. Die erweiterten Panels bieten mehr Gestaltungsspielraum. Perfekt für kreative Wandgestaltung und stimmungsvolles Licht.`,
    shortDesc: 'Modulare Hexagon-LED-Paneale mit Touch- und Music-Sync',
    features: ['16 Millionen Farben', 'Touch-Integration', 'Music-Sync', 'HomeKit/Google/Alexa', 'Abgerundete Kanten'],
    specs: [
      { key: 'Farben', value: '16 Millionen + White-Shades' },
      { key: 'Panels', value: '7 pro Starter Kit' },
      { key: 'Lichtstrom', value: '140 Lumen pro Panel' },
      { key: 'Leistung', value: '9 Watt pro Panel' },
      { key: 'Lebensdauer', value: '25.000 Stunden' },
      { key: 'Konnektivität', value: 'Wi-Fi, Bluetooth' },
    ],
  },
  {
    slug: 'nanoleaf-shapes-squares',
    description: `Die Nanoleaf Shapes Squares sind modulare LED-Wandpaneale im quadratischen Design. Die 16 Millionen Farben und diverse White-Shades bieten endlose Möglichkeiten. Die Touch-Integration ermöglicht interaktive Lichtszenen. Die Music-Sync-Funktion reagiert auf Musik und erstellt dynamische Lichtshows. Die einfache Installation mit 3M-Klebepads erfordert keine professionelle Montage. Die Kompatibilität mit HomeKit, Google Home und Alexa bietet maximale Konnektivität. Die quadratische Form bietet andere Gestaltungsmöglichkeiten als die Hexagons. Perfekt für kreative Wandgestaltung.`,
    shortDesc: 'Modulare Square-LED-Paneale mit Touch- und Music-Sync',
    features: ['16 Millionen Farben', 'Touch-Integration', 'Music-Sync', 'HomeKit/Google/Alexa', 'Quadratisches Design'],
    specs: [
      { key: 'Farben', value: '16 Millionen + White-Shades' },
      { key: 'Panels', value: '7 pro Starter Kit' },
      { key: 'Lichtstrom', value: '140 Lumen pro Panel' },
      { key: 'Leistung', value: '9 Watt pro Panel' },
      { key: 'Lebensdauer', value: '25.000 Stunden' },
      { key: 'Konnektivität', value: 'Wi-Fi, Bluetooth' },
    ],
  },
  {
    slug: 'nanoleaf-shapes-triangles',
    description: `Die Nanoleaf Shapes Triangles sind modulare LED-Wandpaneale im dreieckigen Design. Die 16 Millionen Farben und diverse White-Shades bieten endlose Möglichkeiten. Die Touch-Integration ermöglicht interaktive Lichtszenen. Die Music-Sync-Funktion reagiert auf Musik und erstellt dynamische Lichtshows. Die einfache Installation mit 3M-Klebepads erfordert keine professionelle Montage. Die Kompatibilität mit HomeKit, Google Home und Alexa bietet maximale Konnektivität. Die dreieckige Form bietet andere Gestaltungsmöglichkeiten. Perfekt für kreative Wandgestaltung und stimmungsvolles Licht.`,
    shortDesc: 'Modulare Triangle-LED-Paneale mit Touch- und Music-Sync',
    features: ['16 Millionen Farben', 'Touch-Integration', 'Music-Sync', 'HomeKit/Google/Alexa', 'Dreieckiges Design'],
    specs: [
      { key: 'Farben', value: '16 Millionen + White-Shades' },
      { key: 'Panels', value: '7 pro Starter Kit' },
      { key: 'Lichtstrom', value: '140 Lumen pro Panel' },
      { key: 'Leistung', value: '9 Watt pro Panel' },
      { key: 'Lebensdauer', value: '25.000 Stunden' },
      { key: 'Konnektivität', value: 'Wi-Fi, Bluetooth' },
    ],
  },
  {
    slug: 'netatmo-smart-thermostat',
    description: `Das Netatmo Smart Thermostat ist ein intelligentes Heizungssystem für energieeffizientes Heizen. Die automatische Temperaturregelung passt die Heizung an Ihren Rhythmus an. Die App-Steuerung ermöglicht die Fernbedienung von überall. Die KI-gestützte Lernfunktion passt sich an Ihre Gewohnheiten an. Die Kompatibilität mit Apple HomeKit, Google Home und Alexa bietet maximale Konnektivität. Die einfache Installation an vorhandenen Heizkörpern erfordert keine Fachkenntnisse. Die Batterielaufzeit von bis zu 2 Jahren sorgt für langfristigen Einsatz. Sparen Sie bis zu 30% Heizkosten mit intelligenter Steuerung.`,
    shortDesc: 'Intelligentes Thermostat mit KI-Lernfunktion und App-Steuerung',
    features: ['KI-gestützte Lernfunktion', 'App-Steuerung', 'HomeKit/Google/Alexa', 'Bis zu 30% Heizkosten sparen', 'Einfache Installation'],
    specs: [
      { key: 'Steuerung', value: 'App, Sprache (HomeKit, Google, Alexa)' },
      { key: 'Energieeinsparung', value: 'Bis zu 30%' },
      { key: 'Kompatibilität', value: 'Alle Heizungstypen' },
      { key: 'Batterielaufzeit', value: 'Bis zu 2 Jahre' },
      { key: 'Protokoll', value: 'Wi-Fi, Bluetooth' },
    ],
  },
  {
    slug: 'netatmo-smart-video-doorbell',
    description: `Das Netatmo Smart Video Doorbell ist eine smarte Klingel mit HD-Videosprachfunktion. Die 1080p-HD-Kamera liefert klare Bilder von Besuchern. Die Nachtsichtfunktion sorgt auch bei Dunkelheit für gute Bilder. Die Zweistufige-Sprachfunktion ermöglicht die Kommunikation mit Besuchern. Die automatische Benachrichtigung bei Bewegungserkennung informiert Sie sofort. Die einfache Installation an vorhandenen Klingeldrähten erfordert keine Fachkenntnisse. Die Kompatibilität mit Apple HomeKit bietet maximale Sicherheit. Perfekt für die sichere Überwachung Ihres Eingangsbereichs.`,
    shortDesc: 'Smarte Videoklingel mit HD-Kamera und Zweistufiger-Sprachfunktion',
    features: ['1080p HD-Kamera', 'Nachtsicht', 'Zweistufige-Sprachfunktion', 'Bewegungserkennung', 'HomeKit-kompatibel'],
    specs: [
      { key: 'Kamera', value: '1080p HD' },
      { key: 'Nachtsicht', value: 'Ja, Infrarot' },
      { key: 'Sprachfunktion', value: 'Zweistufig' },
      { key: 'Speicherung', value: 'Cloud (Abonnement) + microSD' },
      { key: 'Installation', value: 'Vorhandene Klingeldrähte' },
    ],
  },
  {
    slug: 'netatmo-wetterstation',
    description: `Die Netatmo Wetterstation misst Indoor- und Outdoor-Wetterdaten präzise. Die Innenmodule messen Temperatur, Luftfeuchtigkeit, Luftqualität und Lärmpegel. Das Außenmodul misst Temperatur und Luftfeuchtigkeit. Die App-Visualisierung zeigt alle Daten übersichtlich an. Die Vorhersage-Informationen basieren auf lokalen Wetterdaten. Die Kompatibilität mit Apple HomeKit und Google Home bietet maximale Konnektivität. Die einfache Installation erfordert keine Fachkenntnisse. Die Batterielaufzeit von bis zu 6 Monaten sorgt für langfristigen Einsatz. Perfekt für alle, die das Wetter im Auge behalten wollen.`,
    shortDesc: 'Indoor/Outdoor-Wetterstation mit Luftqualitätsmessung',
    features: ['Indoor & Outdoor', 'Luftqualitätsmessung', 'Temperatur & Feuchtigkeit', 'App-Visualisierung', 'HomeKit/Google-kompatibel'],
    specs: [
      { key: 'Module', value: 'Indoor + Outdoor' },
      { key: 'Messwerte', value: 'Temperatur, Feuchtigkeit, Luftqualität, Lärm' },
      { key: 'Genauigkeit', value: '±0,1°C / ±1% Feuchtigkeit' },
      { key: 'Protokoll', value: 'Wi-Fi' },
      { key: 'Batterielaufzeit', value: 'Bis zu 6 Monate (Outdoor)' },
    ],
  },
  {
    slug: 'philips-hue-gradient-lightstrip-2m',
    description: `Die Philips Hue Gradient Lightstrip 2m ist eine flexible LED-Lichtleiste für farbenfrohe Lichteffekte. Die 16 Millionen Farben und diverse White-Shades bieten endlose Möglichkeiten. Die Gradient-Technologie verteilt die Farben gleichmäßig über die gesamte Länge. Die Music-Sync-Funktion reagiert auf Musik und erstellt dynamische Lichtshows. Die einfache Installation mit Klebepads erfordert keine professionelle Montage. Die Kompatibilität mit Hue Bridge und diversen Sprachassistenten bietet maximale Konnektivität. Die 2 Meter Länge eignet sich für Möbel, Regale und andere Oberflächen. Perfekt für stimmungsvolles Ambientelicht.`,
    shortDesc: 'Flexible Gradient-LED-Leiste mit 2m für farbenfrohe Lichteffekte',
    features: ['16 Millionen Farben', 'Gradient-Technologie', 'Music-Sync', 'Hue Bridge kompatibel', '2 Meter Länge'],
    specs: [
      { key: 'Farben', value: '16 Millionen + White-Shades' },
      { key: 'Länge', value: '2 Meter' },
      { key: 'Lichtstrom', value: '950 Lumen' },
      { key: 'Leistung', value: '24 Watt' },
      { key: 'Lebensdauer', value: '25.000 Stunden' },
      { key: 'Konnektivität', value: 'Zigbee (via Hue Bridge)' },
    ],
  },
  {
    slug: 'philips-hue-lightstrip-plus-2m',
    description: `Die Philips Hue Lightstrip Plus 2m ist eine flexible LED-Lichtleiste für vielseitige Beleuchtung. Die 16 Millionen Farben und diverse White-Shades bieten endlose Möglichkeiten. Die Plus-Version bietet höhere Lichtstärke als die Standard-Version. Die Music-Sync-Funktion reagiert auf Musik und erstellt dynamische Lichtshows. Die einfache Installation mit Klebepads erfordert keine professionelle Montage. Die Kompatibilität mit Hue Bridge und diversen Sprachassistenten bietet maximale Konnektivität. Die 2 Meter Länge eignet sich für Möbel, Regale und andere Oberflächen. Perfekt für stimmungsvolles Ambientelicht und Akzente.`,
    shortDesc: 'Flexible Plus-LED-Leiste mit 2m für verstärkte Lichtstärke',
    features: ['16 Millionen Farben', 'Plus-Version (höhere Lichtstärke)', 'Music-Sync', 'Hue Bridge kompatibel', '2 Meter Länge'],
    specs: [
      { key: 'Farben', value: '16 Millionen + White-Shades' },
      { key: 'Länge', value: '2 Meter' },
      { key: 'Lichtstrom', value: '1600 Lumen' },
      { key: 'Leistung', value: '20 Watt' },
      { key: 'Lebensdauer', value: '25.000 Stunden' },
      { key: 'Konnektivität', value: 'Zigbee (via Hue Bridge)' },
    ],
  },
  {
    slug: 'philips-hue-play-gradient-lightstrip-55',
    description: `Die Philips Hue Play Gradient Lightstrip 55" ist eine LED-Lichtleiste für Fernseher und Monitore. Die 16 Millionen Farben und diverse White-Shades bieten endlose Möglichkeiten. Die Gradient-Technologie synchronisiert das Licht mit dem Bildschirminhalt. Die Music-Sync-Funktion reagiert auf Musik und erstellt dynamische Lichtshows. Die einfache Installation am hinteren Teil des Bildschirms erfordert keine professionelle Montage. Die Kompatibilität mit Hue Bridge und diversen Sprachassistenten bietet maximale Konnektivität. Die 55-Zoll-Länge eignet sich für mittlere bis große Bildschirme. Perfekt für ein immersives Unterhaltungserlebnis.`,
    shortDesc: 'Gradient-LED-Leiste für 55" TV mit Bildschirm-Sync',
    features: ['Bildschirm-Sync-Technologie', '16 Millionen Farben', 'Music-Sync', 'Hue Bridge kompatibel', 'Für 55" Bildschirme'],
    specs: [
      { key: 'Farben', value: '16 Millionen + White-Shades' },
      { key: 'Bildschirmgröße', value: '55 Zoll' },
      { key: 'Lichtstrom', value: '1600 Lumen' },
      { key: 'Leistung', value: '24 Watt' },
      { key: 'Lebensdauer', value: '25.000 Stunden' },
      { key: 'Konnektivität', value: 'Zigbee (via Hue Bridge)' },
    ],
  },
  {
    slug: 'philips-hue-secure-doorbell-camera',
    description: `Die Philips Hue Secure Doorbell Camera ist eine smarte Videoklingel mit Hue-Integration. Die 1080p-HD-Kamera liefert klare Bilder von Besuchern. Die Nachtsichtfunktion sorgt auch bei Dunkelheit für gute Bilder. Die Zweistufige-Sprachfunktion ermöglicht die Kommunikation mit Besuchern. Die automatische Benachrichtigung bei Bewegungserkennung informiert Sie sofort. Die Integration in das Hue-Ökosystem ermöglicht die Steuerung über die Hue-App. Die einfache Installation an vorhandenen Klingeldrähten erfordert keine Fachkenntnisse. Perfekt für die sichere Überwachung Ihres Eingangsbereichs im Hue-Ökosystem.`,
    shortDesc: 'Smarte Videoklingel mit 1080p HD und Hue-Integration',
    features: ['1080p HD-Kamera', 'Nachtsicht', 'Zweistufige-Sprachfunktion', 'Hue-Ökosystem-Integration', 'Bewegungserkennung'],
    specs: [
      { key: 'Kamera', value: '1080p HD' },
      { key: 'Nachtsicht', value: 'Ja, Infrarot' },
      { key: 'Sprachfunktion', value: 'Zweistufig' },
      { key: 'Speicherung', value: 'Hue Secure Cloud' },
      { key: 'Installation', value: 'Vorhandene Klingeldrähte' },
    ],
  },
  {
    slug: 'philips-hue-secure-camera',
    description: `Die Philips Hue Secure Camera ist eine smarte Überwachungskamera für den Innenbereich. Die 1080p-HD-Kamera liefert klare Bilder. Die Nachtsichtfunktion sorgt auch bei Dunkelheit für gute Bilder. Die Bewegungserkennung mit KI-Technologie erkennt Personen von Tieren. Die automatische Benachrichtigung informiert Sie sofort. Die Integration in das Hue-Ökosystem ermöglicht die Steuerung über die Hue-App. Die einfache Installation erfordert keine Fachkenntnisse. Die-cloud-Speicherung sorgt für sichere Aufbewahrung der Aufnahmen. Perfekt für die Überwachung Ihres Zuhauses im Hue-Ökosystem.`,
    shortDesc: 'Smarte Innenkamera mit 1080p HD und KI-Bewegungserkennung',
    features: ['1080p HD-Kamera', 'KI-Bewegungserkennung', 'Nachtsicht', 'Hue-Ökosystem-Integration', 'Cloud-Speicherung'],
    specs: [
      { key: 'Kamera', value: '1080p HD' },
      { key: 'Nachtsicht', value: 'Ja, Infrarot' },
      { key: 'Bewegungserkennung', value: 'KI-gestützt' },
      { key: 'Speicherung', value: 'Hue Secure Cloud' },
      { key: 'Abmessungen', value: '8 x 8 x 12 cm' },
    ],
  },
  {
    slug: 'philips-hue-starter-kit-e14',
    description: `Das Philips Hue Starter Kit E14 ist der perfekte Einstieg in die smarte Beleuchtung. Die Hue Bridge und 2 E14-LED-Lampen bieten alles für den Anfang. Die dimmbare Lichtstärke (100-2200 Lumen) passt jede Stimmung. Die Farbtemperatur (2200-6500K) reicht von warmweiß bis tageslichtweiß. Die Fernbedienung über App oder Sprachsteuerung (Alexa, Google, HomeKit) bietet Komfort. Die einfache Installation in vorhandene Leuchtmittel-Fassungen erfordert keine Fachkenntnisse. Die Hue Bridge steuert bis zu 50 Geräte. Der ideale Einstieg in die smarte Beleuchtung.`,
    shortDesc: 'Hue-Starter-Kit mit Bridge und 2 E14-LED-Lampen',
    features: ['Hue Bridge inklusive', '2 dimmbare E14-LED-Lampen', 'Farbtemperatur 2200-6500K', 'App- & Sprachsteuerung', 'Bis zu 50 Geräte'],
    specs: [
      { key: 'Protokoll', value: 'Zigbee (via Hue Bridge)' },
      { key: 'Lichtstrom', value: '100-2200 Lumen' },
      { key: 'Farbtemperatur', value: '2200-6500K' },
      { key: 'Leistung', value: '5,7 Watt pro Lampe' },
      { key: 'Lebensdauer', value: '25.000 Stunden' },
      { key: 'Fassung', value: 'E14' },
    ],
  },
  {
    slug: 'philips-hue-starter-kit-e27',
    description: `Das Philips Hue Starter Kit E27 ist der perfekte Einstieg in die smarte Beleuchtung. Die Hue Bridge und 2 E27-LED-Lampen bieten alles für den Anfang. Die dimmbare Lichtstärke (100-2200 Lumen) passt jede Stimmung. Die Farbtemperatur (2200-6500K) reicht von warmweiß bis tageslichtweiß. Die Fernbedienung über App oder Sprachsteuerung (Alexa, Google, HomeKit) bietet Komfort. Die einfache Installation in vorhandene Leuchtmittel-Fassungen erfordert keine Fachkenntnisse. Die Hue Bridge steuert bis zu 50 Geräte. Der ideale Einstieg in die smarte Beleuchtung.`,
    shortDesc: 'Hue-Starter-Kit mit Bridge und 2 E27-LED-Lampen',
    features: ['Hue Bridge inklusive', '2 dimmbare E27-LED-Lampen', 'Farbtemperatur 2200-6500K', 'App- & Sprachsteuerung', 'Bis zu 50 Geräte'],
    specs: [
      { key: 'Protokoll', value: 'Zigbee (via Hue Bridge)' },
      { key: 'Lichtstrom', value: '100-2200 Lumen' },
      { key: 'Farbtemperatur', value: '2200-6500K' },
      { key: 'Leistung', value: '8,06 Watt pro Lampe' },
      { key: 'Lebensdauer', value: '25.000 Stunden' },
      { key: 'Fassung', value: 'E27' },
    ],
  },
  {
    slug: 'philips-hue-starter-kit-e27-neu',
    description: `Das Philips Hue Starter Kit E27 Neu ist die neueste Version des beliebten Hue-Starter-Kits. Die Hue Bridge V2 und 2 neue E27-LED-Lampen bieten modernste Technologie. Die dimmbare Lichtstärke (100-2200 Lumen) passt jede Stimmung. Die Farbtemperatur (2200-6500K) reicht von warmweiß bis tageslichtweiß. Die Fernbedienung über App oder Sprachsteuerung (Alexa, Google, HomeKit) bietet Komfort. Die einfache Installation in vorhandene Leuchtmittel-Fassungen erfordert keine Fachkenntnisse. Die neue Hue Bridge bietet mehr Leistung und Zuverlässigkeit. Der ideale Einstieg in die smarte Beleuchtung.`,
    shortDesc: 'Neues Hue-Starter-Kit mit Bridge V2 und 2 E27-LED-Lampen',
    features: ['Hue Bridge V2', '2 neue dimmbare E27-LED-Lampen', 'Farbtemperatur 2200-6500K', 'App- & Sprachsteuerung', 'Bis zu 50 Geräte'],
    specs: [
      { key: 'Protokoll', value: 'Zigbee (via Hue Bridge V2)' },
      { key: 'Lichtstrom', value: '100-2200 Lumen' },
      { key: 'Farbtemperatur', value: '2200-6500K' },
      { key: 'Leistung', value: '8,06 Watt pro Lampe' },
      { key: 'Lebensdauer', value: '25.000 Stunden' },
      { key: 'Fassung', value: 'E27' },
    ],
  },
  {
    slug: 'philips-hue-white-ambiance-e27',
    description: `Die Philips Hue White Ambiance E27 ist eine dimmbare LED-Lampe mit weißem Licht. Die Farbtemperatur (2200-6500K) reicht von warmweiß bis tageslichtweiß. Die dimmbare Lichtstärke (100-2200 Lumen) passt jede Stimmung. Die Fernbedienung über App oder Sprachsteuerung (Alexa, Google, HomeKit) bietet Komfort. Die einfache Installation in vorhandene E27-Fassungen erfordert keine Fachkenntnisse. Die Kompatibilität mit Hue Bridge bietet maximale Funktionalität. Perfekt für alle, die weiße Atmosphäre ohne Farben suchen.`,
    shortDesc: 'Dimmbare E27-LED-Lampe mit weißer Atmosphäre (2200-6500K)',
    features: ['Weiße Ambiance', 'Farbtemperatur 2200-6500K', 'Dimmbar', 'App- & Sprachsteuerung', 'Hue Bridge kompatibel'],
    specs: [
      { key: 'Farbtemperatur', value: '2200-6500K' },
      { key: 'Lichtstrom', value: '100-2200 Lumen' },
      { key: 'Leistung', value: '8,06 Watt' },
      { key: 'Lebensdauer', value: '25.000 Stunden' },
      { key: 'Fassung', value: 'E27' },
    ],
  },
  {
    slug: 'ring-alarm-flood-freeze-sensor',
    description: `Der Ring Alarm Flood and Freeze Sensor erkennt Überschwemmungen und Frost. Der Wasser-Sensor meldet Überschwemmungen sofort über die Ring-App. Der Frost-Sensor warnt vor Temperaturen unter 0°C. Die einfache Installation in Kellern, Bädern oder anderen feuchten Bereichen erfordert keine Fachkenntnisse. Die Batterielaufzeit von bis zu 3 Jahren sorgt für langfristigen Einsatz. Die Kompatibilität mit Ring Alarm bietet maximale Integration. Die Benachrichtigung bei Gefahren informiert Sie sofort. Perfekt für die Überwachung von Feuchtigkeit und Frost.`,
    shortDesc: 'Überschwemmungs- und Frostsensor für Ring-Alarm-Systeme',
    features: ['Wasser- und Frosterkennung', 'Sofortige Benachrichtigung', '3 Jahre Batterielaufzeit', 'Einfache Installation', 'Ring Alarm kompatibel'],
    specs: [
      { key: 'Sensoren', value: 'Wasser, Frost' },
      { key: 'Protokoll', value: 'Zigbee' },
      { key: 'Batterielaufzeit', value: 'Bis zu 3 Jahre' },
      { key: 'Abmessungen', value: '6 x 6 x 3 cm' },
      { key: 'Farbe', value: 'Weiß' },
    ],
  },
  {
    slug: 'ring-alarm-security-kit-5',
    description: `Das Ring Alarm Security Kit 5 ist ein umfassendes Alarmsystem für bis zu 5 Zimmer. Das Kit enthält Base Station, 5 Sensoren und eine Tastatur. Die einfache Installation erfordert keine professionelle Montage. Die App-Steuerung ermöglicht die Fernbedienung von überall. Die sirene mit 100 dB(A) warnt vor Einbrüchen. Die Kompatibilität mit Ring-Doorbells und Kameras bietet maximale Integration. Die 24/7-Überwachung sorgt für maximale Sicherheit. Perfekt für Familien, die Wert auf Sicherheit legen.`,
    shortDesc: 'Alarmsystem-Kit mit 5 Sensoren, Base Station und Tastatur',
    features: ['5 Zimmer abgedeckt', '100 dB(A) Sirene', 'App-Steuerung', '24/7-Überwachung', 'Ring-Integration'],
    specs: [
      { key: 'Komponenten', value: 'Base Station, 5 Sensoren, Tastatur' },
      { key: 'Sirene', value: '100 dB(A)' },
      { key: 'Protokoll', value: 'Zigbee, Wi-Fi' },
      { key: 'Abdeckung', value: 'Bis zu 5 Zimmer' },
      { key: 'Farbe', value: 'Weiß' },
    ],
  },
  {
    slug: 'ring-floodlight-cam-wired-pro',
    description: `Die Ring Floodlight Cam Wired Pro ist eine Überwachungskamera mit integrierten Flutlichtern. Die 1080p-HD-Kamera liefert klare Bilder. Die 2 Flutlichter mit 1500 Lumen sorgen für optimale Ausleuchtung. Die Nachtsichtfunktion sorgt auch bei Dunkelheit für gute Bilder. Die Zweistufige-Sprachfunktion ermöglicht die Kommunikation mit Besuchern. Die automatische Benachrichtigung bei Bewegungserkennung informiert Sie sofort. Die 3D-Bewegungserkennung mit Radar reduziert Fehlalarme. Die einfache Installation erfordert professionelle Montage. Perfekt für die Überwachung von Außenbereichen.`,
    shortDesc: 'Überwachungskamera mit 1080p HD und 1500 Lumen Flutlicht',
    features: ['1080p HD-Kamera', '2 Flutlichter (1500 Lumen)', '3D-Bewegungserkennung', 'Zweistufige-Sprachfunktion', 'Nachtsicht'],
    specs: [
      { key: 'Kamera', value: '1080p HD' },
      { key: 'Flutlichter', value: '2 x 1500 Lumen' },
      { key: 'Bewegungserkennung', value: '3D-Radar' },
      { key: 'Sprachfunktion', value: 'Zweistufig' },
      { key: 'Installation', value: 'Verkabelt (Elektriker)' },
    ],
  },
  {
    slug: 'ring-indoor-cam-gen2',
    description: `Die Ring Indoor Cam Gen2 ist eine kompakte Überwachungskamera für den Innenbereich. Die 1080p-HD-Kamera liefert klare Bilder. Die Nachtsichtfunktion sorgt auch bei Dunkelheit für gute Bilder. Die Zweistufige-Sprachfunktion ermöglicht die Kommunikation. Die automatische Benachrichtigung bei Bewegungserkennung informiert Sie sofort. Die einfache Installation auf Regalen oder Tischen erfordert keine Montage. Die Ring-App ermöglicht die Fernbedienung von überall. Perfekt für die Überwachung von Wohnzimmern, Kinderzimmern oder Büros.`,
    shortDesc: 'Kompakte Innenkamera mit 1080p HD und Nachtsicht',
    features: ['1080p HD-Kamera', 'Nachtsicht', 'Zweistufige-Sprachfunktion', 'Bewegungserkennung', 'Kompaktes Design'],
    specs: [
      { key: 'Kamera', value: '1080p HD' },
      { key: 'Nachtsicht', value: 'Ja, Infrarot' },
      { key: 'Sprachfunktion', value: 'Zweistufig' },
      { key: 'Abmessungen', value: '7 x 7 x 10 cm' },
      { key: 'Farbe', value: 'Weiß/Schwarz' },
    ],
  },
  {
    slug: 'ring-spotlight-cam-pro',
    description: `Die Ring Spotlight Cam Pro ist eine Überwachungskamera mit integriertem Spotlight. Die 1080p-HD-Kamera liefert klare Bilder. Der Spotlight mit 500 Lumen sorgt für Ausleuchtung bei Dunkelheit. Die Nachtsichtfunktion sorgt auch ohne Spotlight für gute Bilder. Die Zweistufige-Sprachfunktion ermöglicht die Kommunikation. Die automatische Benachrichtigung bei Bewegungserkennung informiert Sie sofort. Die 3D-Bewegungserkennung mit Radar reduziert Fehlalarme. Die einfache Installation auf Wänden erfordert keine professionelle Montage. Perfekt für die Überwachung von Außenbereichen.`,
    shortDesc: 'Überwachungskamera mit 1080p HD und 500 Lumen Spotlight',
    features: ['1080p HD-Kamera', 'Spotlight (500 Lumen)', '3D-Bewegungserkennung', 'Zweistiguouse-Sprachfunktion', 'Nachtsicht'],
    specs: [
      { key: 'Kamera', value: '1080p HD' },
      { key: 'Spotlight', value: '500 Lumen' },
      { key: 'Bewegungserkennung', value: '3D-Radar' },
      { key: 'Sprachfunktion', value: 'Zweistufig' },
      { key: 'Installation', value: 'Wandmontage' },
    ],
  },
  {
    slug: 'ring-video-doorbell-4',
    description: `Die Ring Video Doorbell 4 ist eine smarte Videoklingel mit 1080p-HD-Kamera. Die Nachtsichtfunktion sorgt auch bei Dunkelheit für gute Bilder. Die Zweistufige-Sprachfunktion ermöglicht die Kommunikation mit Besuchern. Die Pre-Roll-Videos zeigen die Sekunden vor dem Bewegungsereignis. Die automatische Benachrichtigung bei Bewegungserkennung informiert Sie sofort. Die einfache Installation an vorhandenen Klingeldrähten oder kabellos erfordert keine Fachkenntnisse. Die Ring-App ermöglicht die Fernbedienung von überall. Perfekt für die Überwachung Ihres Eingangsbereichs.`,
    shortDesc: 'Smarte Videoklingel mit 1080p HD und Pre-Roll-Videos',
    features: ['1080p HD-Kamera', 'Pre-Roll-Videos', 'Nachtsicht', 'Zweistiguouse-Sprachfunktion', 'Kabellos oder verkabelt'],
    specs: [
      { key: 'Kamera', value: '1080p HD' },
      { key: 'Nachtsicht', value: 'Ja, Infrarot' },
      { key: 'Sprachfunktion', value: 'Zweistiguous' },
      { key: 'Speicherung', value: 'Ring Protect (Abonnement)' },
      { key: 'Installation', value: 'Kabellos oder verkabelt' },
    ],
  },
  {
    slug: 'ring-video-doorbell-4-neu',
    description: `Die Ring Video Doorbell 4 Neu ist die neueste Version der beliebten Ring-Videoklingel. Die 1080p-HD-Kamera liefert klare Bilder. Die Nachtsichtfunktion sorgt auch bei Dunkelheit für gute Bilder. Die Zweistiguouse-Sprachfunktion ermöglicht die Kommunikation mit Besuchern. Die Pre-Roll-Videos zeigen die Sekunden vor dem Bewegungsereignis. Die automatische Benachrichtigung bei Bewegungserkennung informiert Sie sofort. Die einfache Installation erfordert keine professionelle Montage. Die Ring-App ermöglicht die Fernbedienung von überall. Die neueste Version mit verbesserter Bildqualität.`,
    shortDesc: 'Neueste Ring-Videoklingel mit 1080p HD und Pre-Roll',
    features: ['1080p HD-Kamera (verbessert)', 'Pre-Roll-Videos', 'Nachtsicht', 'Zweistiguouse-Sprachfunktion', 'Neueste Version'],
    specs: [
      { key: 'Kamera', value: '1080p HD (verbessert)' },
      { key: 'Nachtsicht', value: 'Ja, Infrarot' },
      { key: 'Sprachfunktion', value: 'Zweistiguous' },
      { key: 'Speicherung', value: 'Ring Protect (Abonnement)' },
      { key: 'Installation', value: 'Kabellos oder verkabelt' },
    ],
  },
  {
    slug: 'samsung-family-hub-rb38b7929s9',
    description: `Der Samsung Family Hub RB38B7929S9 ist ein Premium-Kühlschrank mit 38 cm Breite und Family-Hub-Technologie. Das 21,5-Zoll-Touchdisplay ermöglicht die Fernbedienung und Information. Die Smart-Home-Integration steuert kompatible Geräte über das Display. Die Interior-Cam zeigt den Inhalt des Kühlschranks auf dem Smartphone. Die Twin-Cooling-Plus-Technologie hält Lebensmittel frisch. Die No-Frost-Technologie verhindert Eisbildung. Die的能量效率klasse A++ sorgt für Energieeinsparung. Das Family Hub macht den Kühlschrank zum digitalen Herzstück der Küche.`,
    shortDesc: 'Premium-Kühlschrank mit 21,5" Touchdisplay und Family Hub',
    features: ['21,5" Touchdisplay', 'Family Hub Technologie', 'Twin-Cooling-Plus', 'No-Frost', 'Interior-Cam'],
    specs: [
      { key: 'Volumen', value: '385 Liter' },
      { key: 'Display', value: '21,5 Zoll Touch' },
      { key: 'Kühltechnologie', value: 'Twin-Cooling-Plus' },
      { key: 'Energieklasse', value: 'A++' },
      { key: 'Abmessungen', value: '59,5 x 185 x 64,8 cm' },
      { key: 'Farbe', value: 'Edelstahl' },
    ],
  },
  {
    slug: 'tado-smart-ac-control-v3plus',
    description: `Die Tado Smart AC Control V3+ ist ein smarter WLAN-Controller für Klimaanlagen. Die App-Steuerung ermöglicht die Fernbedienung von überall. Die Geofencing-Technologie passt die Temperatur an Ihren Standort an. Die Kompatibilität mit Alexa, Google Home und HomeKit bietet maximale Konnektivität. Die einfache Installation erfordert keine Fachkenntnisse. Die Energieberichtsfunktion zeigt den Stromverbrauch an. Die Luftqualitätsmessung informiert über die Raumluft. Die党派-fähige Steuerung mit Timern ermöglicht automatische Anpassungen. Perfekt für die intelligente Steuerung Ihrer Klimaanlage.`,
    shortDesc: 'Smarter WLAN-Controller für Klimaanlagen mit Geofencing',
    features: ['Geofencing-Technologie', 'App-Steuerung', 'HomeKit/Alexa/Google', 'Luftqualitätsmessung', 'Energiebericht'],
    specs: [
      { key: 'Steuerung', value: 'App, Sprache (Alexa, Google, HomeKit)' },
      { key: 'Konnektivität', value: 'WLAN, Infrarot' },
      { key: 'Funktionen', value: 'Geofencing, Timer, Energiebericht' },
      { key: 'Kompatibilität', value: 'Die党派 Klimaanlagen' },
      { key: 'Abmessungen', value: '10 x 10 x 2,4 cm' },
      { key: 'Farbe', value: 'Weiß' },
    ],
  },
  {
    slug: 'tado-smart-ac-control-v3plus-neu',
    description: `Die Tado Smart AC Control V3+ Neu ist die neueste Version des smarteren WLAN-Controllers für Klimaanlagen. Die App-Steuerung ermöglicht die Fernbedienung von überall. Die Geofencing-Technologie passt die Temperatur an Ihren Standort an. Die Kompatibilität mit Alexa, Google Home und HomeKit bietet maximale Konnektivität. Die einfache Installation erfordert keine Fachkenntnisse. Die Energieberichtsfunktion zeigt den Stromverbrauch an. Die Luftqualitätsmessung informiert über die Raumluft. Die党派-fähige Steuerung mit Timern ermöglicht automatische Anpassungen. Die neueste Version mit verbesserter Kompatibilität.`,
    shortDesc: 'Neueste Tado-AC-Steuerung mit Geofencing und improved Kompatibilität',
    features: ['Geofencing (verbessert)', 'App-Steuerung', 'HomeKit/Alexa/Google', 'Luftqualitätsmessung', 'Neueste Version'],
    specs: [
      { key: 'Steuerung', value: 'App, Sprache (Alexa, Google, HomeKit)' },
      { key: 'Konnektivität', value: 'WLAN, Infrarot' },
      { key: 'Funktionen', value: 'Geofencing, Timer, Energiebericht' },
      { key: 'Kompatibilität', value: 'Die党派 Klimaanlagen' },
      { key: 'Abmessungen', value: '10 x 10 x 2,4 cm' },
      { key: 'Farbe', value: 'Weiß' },
    ],
  },
  {
    slug: 'tado-smart-radiator-starter-kit',
    description: `Das Tado Smart Radiator Starter Kit ist der perfekte Einstieg in die intelligente Heizungssteuerung. Das Kit enthält 2 intelligente Heizkörperregler und den Bridge-Adapter. Die App-Steuerung ermöglicht die Fernbedienung von überall. Die Geofencing-Technologie passt die Temperatur an Ihren Standort an. Die Kompatibilität mit Alexa, Google Home und HomeKit bietet maximale Konnektivität. Die einfache Installation an vorhandenen Heizkörpern erfordert keine Fachkenntnisse. Die党派-fähige Steuerung mit Timern ermöglicht automatische Anpassungen. Sparen Sie bis zu 28% Heizkosten mit intelligenter Steuerung.`,
    shortDesc: 'Starter-Kit mit 2 Heizkörperreglern für intelligente Heizungssteuerung',
    features: ['2 intelligente Heizkörperregler', 'Geofencing', 'App-Steuerung', 'HomeKit/Alexa/Google', 'Bis zu 28% Heizkosten sparen'],
    specs: [
      { key: 'Inhalt', value: '2 Heizkörperregler, Bridge-Adapter' },
      { key: 'Steuerung', value: 'App, Sprache (Alexa, Google, HomeKit)' },
      { key: 'Funktionen', value: 'Geofencing, Timer, Energiebericht' },
      { key: 'Energieeinsparung', value: 'Bis zu 28%' },
      { key: 'Farbe', value: 'Weiß' },
    ],
  },
  {
    slug: 'tado-smart-thermostat-v3plus',
    description: `Der Tado Smart Thermostat V3+ ist ein intelligentes Thermostat für die Heizungssteuerung. Die App-Steuerung ermöglicht die Fernbedienung von überall. Die Geofencing-Technologie passt die Temperatur an Ihren Standort an. Die Kompatibilität mit Alexa, Google Home und HomeKit bietet maximale Konnektivität. Die einfache Installation an vorhandenen Heizungen erfordert keine Fachkenntnisse. Die党派-fähige Steuerung mit Timern ermöglicht automatische Anpassungen. Die Luftqualitätsmessung informiert über die Raumluft. Sparen Sie bis zu 28% Heizkosten mit intelligenter Steuerung.`,
    shortDesc: 'Intelligentes Thermostat mit Geofencing und App-Steuerung',
    features: ['Geofencing', 'App-Steuerung', 'HomeKit/Alexa/Google', 'Luftqualitätsmessung', 'Bis zu 28% Heizkosten sparen'],
    specs: [
      { key: 'Steuerung', value: 'App, Sprache (Alexa, Google, HomeKit)' },
      { key: 'Funktionen', value: 'Geofencing, Timer, Luftqualität' },
      { key: 'Kompatibilität', value: 'Alle Heizungstypen' },
      { key: 'Energieeinsparung', value: 'Bis zu 28%' },
      { key: 'Abmessungen', value: '10 x 10 x 2,4 cm' },
      { key: 'Farbe', value: 'Weiß' },
    ],
  },
  {
    slug: 'tado-smart-thermostat-v3plus-single',
    description: `Der Tado Smart Thermostat V3+ Single ist ein einzelnes intelligentes Thermostat für die Heizungssteuerung. Die App-Steuerung ermöglicht die Fernbedienung von überall. Die Geofencing-Technologie passt die Temperatur an Ihren Standort an. Die Kompatibilität mit Alexa, Google Home und HomeKit bietet maximale Konnektivität. Die einfache Installation an vorhandenen Heizungen erfordert keine Fachkenntnisse. Die党派-fähige Steuerung mit Timern ermöglicht automatische Anpassungen. Sparen Sie bis zu 28% Heizkosten mit intelligenter Steuerung. Das einzelne Thermostat für alle, die nur einen Raum steuern möchten.`,
    shortDesc: 'Einzelnes intelligentes Thermostat mit Geofencing',
    features: ['Geofencing', 'App-Steuerung', 'HomeKit/Alexa/Google', 'Einzelthermostat', 'Bis zu 28% Heizkosten sparen'],
    specs: [
      { key: 'Steuerung', value: 'App, Sprache (Alexa, Google, HomeKit)' },
      { key: 'Funktionen', value: 'Geofencing, Timer' },
      { key: 'Kompatibilität', value: 'Alle Heizungstypen' },
      { key: 'Energieeinsparung', value: 'Bis zu 28%' },
      { key: 'Abmessungen', value: '10 x 10 x 2,4 cm' },
      { key: 'Farbe', value: 'Weiß' },
    ],
  },
  {
    slug: 'tado-smart-thermostat-v3plus-extension',
    description: `Der Tado Smart Thermostat V3+ Extension ist ein Erweiterungsmodul für das Tado-Heizungssystem. Das Modul ergänzt bestehende Tado-Thermostate um zusätzliche Funktionalität. Die App-Steuerung ermöglicht die Fernbedienung von überall. Die Kompatibilität mit Alexa, Google Home und HomeKit bietet maximale Konnektivität. Die einfache Installation erfordert keine Fachkenntnisse. Die党派-fähige Steuerung mit Timern ermöglicht automatische Anpassungen. Die Erweiterung eignet sich für alle, die ihr Tado-System ausbauen möchten.`,
    shortDesc: 'Erweiterungsmodul für das Tado-Heizungssystem',
    features: ['Erweiterung für Tado-System', 'App-Steuerung', 'HomeKit/Alexa/Google', 'Einfache Installation', 'Kompatibel mit V3+'],
    specs: [
      { key: 'Typ', value: 'Erweiterungsmodul' },
      { key: 'Kompatibilität', value: 'Tado Smart Thermostat V3+' },
      { key: 'Steuerung', value: 'App, Sprache (Alexa, Google, HomeKit)' },
      { key: 'Abmessungen', value: '10 x 10 x 2,4 cm' },
      { key: 'Farbe', value: 'Weiß' },
    ],
  },
  {
    slug: 'tado-smart-thermostat-v3plus-neu',
    description: `Der Tado Smart Thermostat V3+ Neu ist die neueste Version des intelligenten Thermostats. Die App-Steuerung ermöglicht die Fernbedienung von überall. Die Geofencing-Technologie passt die Temperatur an Ihren Standort an. Die Kompatibilität mit Alexa, Google Home und HomeKit bietet maximale Konnektivität. Die einfache Installation an vorhandenen Heizungen erfordert keine Fachkenntnisse. Die党派-fähige Steuerung mit Timern ermöglicht automatische Anpassungen. Die Luftqualitätsmessung informiert über die Raumluft. Die neueste Version mit verbesserter Genauigkeit und Zuverlässigkeit. Sparen Sie bis zu 28% Heizkosten mit intelligenter Steuerung.`,
    shortDesc: 'Neuestes Tado-Thermostat mit verbesserter Genauigkeit',
    features: ['Geofencing (verbessert)', 'App-Steuerung', 'HomeKit/Alexa/Google', 'Luftqualitätsmessung', 'Neueste Version'],
    specs: [
      { key: 'Steuerung', value: 'App, Sprache (Alexa, Google, HomeKit)' },
      { key: 'Funktionen', value: 'Geofencing, Timer, Luftqualität' },
      { key: 'Kompatibilität', value: 'Alle Heizungstypen' },
      { key: 'Energieeinsparung', value: 'Bis zu 28%' },
      { key: 'Abmessungen', value: '10 x 10 x 2,4 cm' },
      { key: 'Farbe', value: 'Weiß' },
    ],
  },
];

async function main() {
  console.log(`\nMise à jour de ${updates.length} produits Smart Home...\n`);

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
