/**
 * Editorial content for the six category pages.
 *
 * `longDescription` is rendered below the product grid and is only used when
 * the category has no longDescription in the database (the admin can override
 * it at any time). The text uses a very small subset of Markdown: `## ` for a
 * heading, `- ` for list items and blank lines for paragraphs.
 */

export interface CategoryFaq {
  question: string;
  answer: string;
}

export interface CategoryContent {
  longDescription: string;
  faqs: CategoryFaq[];
}

export const CATEGORY_CONTENT: Record<string, CategoryContent> = {
  kaffee: {
    longDescription: `## Vollautomat, Siebträger oder Kapsel?

Die Wahl der richtigen Kaffeemaschine entscheidet darüber, wie viel Arbeit jeder Kaffee macht und wie viel Spielraum Sie bei Bohnen und Geschmack haben. Ein Kaffeevollautomat mahlt die Bohnen frisch, brüht auf Knopfdruck und reinigt sich weitgehend selbst. Er passt zu Haushalten, in denen täglich mehrere Tassen getrunken werden und der Aufwand pro Tasse klein bleiben soll. Achten Sie auf ein leicht zugängliches Milchsystem, eine ausreichend große Wassertank-Kapazität und ein Mahlwerk aus Stahl.

Eine Siebträgermaschine gibt Ihnen die volle Kontrolle über Mahlgrad, Menge und Brühzeit. Dafür brauchen Sie eine eigene Mühle, etwas Übung und mehr Zeit pro Bezug. Wer Espresso mit fester Crema und wechselnden Bohnen liebt, ist hier richtig. Kapselmaschinen sind die bequemste Variante: wenig Reinigung, konstantes Ergebnis, aber laufende Kosten pro Tasse und ein festes Kapselsortiment. Filterkaffeemaschinen bleiben die günstigste Lösung für größere Mengen und sind mit einer guten Mühle geschmacklich unterschätzt.

## Worauf Sie beim Kauf achten sollten

- **Bohnen oder Kapseln:** Frisch gemahlene Bohnen bieten mehr Aroma und Auswahl. Kapseln sparen Zeit, kosten aber dauerhaft mehr.
- **Milchschaum:** Integrierte Milchkaraffen sind bequem, externe Milchaufschäumer leichter zu reinigen.
- **Reinigung:** Programme für Entkalkung und Milchsystem verlängern die Lebensdauer deutlich.
- **Wasserhärte:** In Berlin und vielen Regionen Deutschlands ist Wasser hart. Eine Maschine mit einstellbarer Wasserhärte und Entkalkungsanzeige ist sinnvoll.
- **Platzbedarf:** Messen Sie die Nische vor dem Kauf; besonders Vollautomaten mit Milchbehälter brauchen Tiefe.

## Marken und Preisklassen

Im Sortiment finden Sie Vollautomaten von Jura, De'Longhi, Siemens, Melitta, Saeco und Krups, Siebträger von Sage und Gastroback sowie Kapsel- und Filterlösungen von Nespresso, Lavazza, Tchibo und Melitta. Einsteigermodelle mit Kapseln beginnen im niedrigen dreistelligen Bereich, solide Vollautomaten liegen meist zwischen 400 und 900 Euro, Oberklasse-Geräte mit Doppelmahlwerk und Komfort-Milchsystem darüber.

## Beratung und Service

Alle Geräte werden mit deutscher Rechnung, gesetzlicher Gewährleistung und einem freiwilligen 30-tägigen Rückgaberecht geliefert. Wenn Sie unsicher sind, welche Maschine zu Ihrem Trinkverhalten passt, hilft unser Kundenservice per E-Mail oder Telefon weiter. Passende Kaufberatungen finden Sie außerdem in unserem Ratgeber.`,
    faqs: [
      {
        question: "Welche Kaffeemaschine lohnt sich für den täglichen Gebrauch?",
        answer:
          "Für mehrere Tassen pro Tag ist ein Kaffeevollautomat mit Stahlmahlwerk meist die bequemste Wahl. Wer Espresso mit vollem Aroma selbst steuern möchte, greift zur Siebträgermaschine. Kapselmaschinen sind sinnvoll, wenn Geschwindigkeit und geringer Reinigungsaufwand im Vordergrund stehen.",
      },
      {
        question: "Wie oft muss ein Kaffeevollautomat entkalkt werden?",
        answer:
          "Das hängt von der Wasserhärte und der Zahl der Bezüge ab. Bei hartem Wasser kann eine Entkalkung alle zwei bis drei Monate nötig sein, bei weichem Wasser seltener. Geräte mit Wasserhärte-Einstellung melden den Bedarf automatisch.",
      },
      {
        question: "Sind Kapseln günstiger als Bohnenkaffee?",
        answer:
          "Pro Tasse ist Kapselkaffee in der Regel teurer als selbst gemahlener Kaffee. Dafür entfallen Mühle, Mahlgrad-Einstellung und ein Teil der Reinigung. Bei hohem Verbrauch rechnet sich ein Vollautomat meist nach einiger Zeit.",
      },
    ],
  },

  kueche: {
    longDescription: `## Küchengeräte für Alltag und Hobbyküche

Die Küche ist der Raum, in dem die meisten Geräte täglich benutzt werden. Deshalb lohnt es sich, vor dem Kauf nicht nur auf die Leistung, sondern auf Handhabung, Reinigung und Platzbedarf zu achten. Eine Küchenmaschine mit Knethaken, Schneebesen und Rührschüssel ersetzt viele einzelne Geräte und ist für alle interessant, die regelmäßig backen oder Teig zubereiten. Handmixer sind günstiger, leichter und für kleinere Mengen ausreichend.

Beim Kochen entscheidet die Kochfeldart über Tempo und Komfort: Induktionsfelder reagieren schnell, sind leicht zu reinigen und effizient, benötigen aber passendes Kochgeschirr mit magnetischem Boden. Ceranfelder sind günstiger und mit jedem Topf nutzbar, brauchen aber länger zum Aufheizen. Ein Standherd kombiniert beides mit einem Backofen und ist eine platzsparende Lösung für Mietwohnungen.

## Airfryer, Backofen und Grill

Airfryer sind kleine Heißluftöfen mit starkem Lüfter. Sie garen Pommes, Gemüse oder Hähnchen mit wenig Fett und werden schnell heiß. Für Familien reicht das Volumen oft nicht aus, für ein bis zwei Personen ist ein Modell mit 4 bis 6 Litern meist passend. Ein Backofen mit Umluft und Pyrolyse oder Hydrolyse spart Reinigungsaufwand; wer viel brät, sollte auf eine gute Türdämmung und eine versenkbare Schiene achten. Kontaktgrills und Multigrills eignen sich für Fleisch, Panini und Gemüse und sind eine platzsparende Alternative zum großen Grill.

## Worauf Sie beim Kauf achten sollten

- **Einsatzzweck:** Teig, Smoothies, Suppen oder trockene Zutaten verlangen unterschiedliche Aufsätze und Leistungsreserven.
- **Reinigung:** Spülmaschinenfeste Teile und glatte Flächen sparen täglich Zeit.
- **Geräuschentwicklung:** Mixer und Küchenmaschinen werden oft unterschätzt; ein leiser Motor ist in offenen Küchen wichtig.
- **Sicherheit:** Rutschfeste Füße, Überhitzungsschutz und eine stabile Bauweise sind bei hoher Leistung Pflicht.
- **Energie:** Bei Backofen und Kochfeld lohnt der Blick auf Effizienzklasse und Aufheizzeit.

## Marken im Sortiment

Sie finden Küchenmaschinen von KitchenAid, Kenwood, Bosch und Thermomix, Mixer und Airfryer von Ninja, Cosori, Philips und Tefal, Kochfelder und Backöfen von Bosch, Siemens, Neff, AEG, Miele und Gaggenau sowie Kleingeräte von Smeg, WMF, Braun und Russell Hobbs.

## Service und Rückgabe

Alle Geräte kommen mit deutscher Rechnung und gesetzlicher Gewährleistung. Zusätzlich gilt unser freiwilliges 30-tägiges Rückgaberecht für unbenutzte Ware in der Originalverpackung. Bei Fragen zur Ausstattung oder zu den Maßen hilft der Kundenservice vor dem Kauf.`,
    faqs: [
      {
        question: "Küchenmaschine oder Handmixer – was brauche ich?",
        answer:
          "Eine Küchenmaschine lohnt sich, wenn Sie regelmäßig größere Teigmengen, Sahne oder Aufstriche zubereiten und mehrere Aufsätze nutzen wollen. Für gelegentliches Backen und kleine Mengen reicht ein Handmixer, der weniger Platz braucht und günstiger ist.",
      },
      {
        question: "Ist Induktion besser als Ceran?",
        answer:
          "Induktion heizt schneller, reagiert direkter und verbraucht weniger Energie. Ceran ist günstiger und funktioniert mit jedem Topf. Wer viel kocht und passendes Geschirr besitzt, profitiert meist von Induktion.",
      },
      {
        question: "Wie groß sollte ein Airfryer sein?",
        answer:
          "Für eine Person reichen etwa 3 bis 4 Liter, für zwei Personen 4 bis 6 Liter. Für Familien mit vier Personen sind 7 Liter oder mehr sinnvoll, damit alle Portionen gleichzeitig Platz haben.",
      },
    ],
  },

  haushaltsgeraete: {
    longDescription: `## Waschmaschine, Kühlschrank und Geschirrspüler im Überblick

Große Haushaltsgeräte werden selten spontan gekauft. Sie bleiben viele Jahre im Einsatz und verbrauchen täglich Strom und Wasser. Deshalb zählen neben dem Preis vor allem Maße, Effizienz und die passende Ausstattung für den eigenen Haushalt.

Bei Waschmaschinen ist das Fassungsvermögen der wichtigste Wert: 7 bis 8 Kilogramm reichen für zwei bis drei Personen, 9 bis 10 Kilogramm für größere Familien oder Bettwäsche und Handtücher in großen Mengen. Modelle mit Dampffunktion reduzieren Knitter und Allergene. Achten Sie auf eine einstellbare Schleuderdrehzahl, eine Kurzprogramm-Option und einen leisen Betrieb, wenn die Maschine in der Wohnung steht.

## Kühlen und Gefrieren

Kühlschränke unterscheiden sich vor allem in Bauform und Nutzvolumen. Einbaukühlschränke sparen sichtbaren Platz in der Küche, freistehende Geräte bieten oft mehr Volumen fürs Geld. No-S Frost verhindert Eisbildung im Gefrierteil, eine gute Luftverteilung hält Lebensmittel länger frisch. Prüfen Sie vor dem Kauf die Nischenmaße und die Anschlagseite der Tür.

## Geschirrspüler und Trockner

Geschirrspüler werden in Maßgedecken angegeben. Für zwei Personen reichen 9 bis 10 Maßgedecke, für Familien sind 13 bis 14 üblich. Besteckschublade, flexible Körbe und ein leises Betriebsgeräusch machen den Alltag angenehmer. Trockner mit Wärmepumpe arbeiten deutlich effizienter als Kondenstrockner, brauchen aber etwas länger. Wer wenig Platz hat, findet kompakte Modelle für den Unterschrank.

## Worauf Sie beim Kauf achten sollten

- **Maße und Anschlüsse:** Nische, Türanschlag, Wassertemperatur und Steckdose vorher prüfen.
- **Energieeffizienz:** Ein niedriger Verbrauch rechnet sich über die Jahre, besonders bei täglicher Nutzung.
- **Geräuschpegel:** In offenen Wohnungen sind Werte unter 50 dB beim Waschen und Trocknen angenehm.
- **Bedienung:** Klare Programme und eine Restzeitanzeige erleichtern den Alltag mehr als viele Sondermodi.
- **Lieferung und Anschluss:** Bei großen Geräten sollten Lieferweg und Montage vorab geklärt sein.

## Marken und Beratung

Zum Sortiment gehören Bosch, Siemens, Miele, AEG, Samsung, LG, Beko, Electrolux, Liebherr, Haier, Neff und Gaggenau. Alle Geräte werden mit deutscher Rechnung und gesetzlicher Gewährleistung geliefert. Unser Kundenservice beantwortet Fragen zu Maßen, Anschlüssen und Programmen vor der Bestellung.`,
    faqs: [
      {
        question: "Welche Waschmaschinen-Größe passt zu meinem Haushalt?",
        answer:
          "Für ein bis zwei Personen reichen meist 7 bis 8 Kilogramm. Für drei bis vier Personen sind 9 bis 10 Kilogramm sinnvoll, vor allem wenn Bettwäsche und Handtücher regelmäßig gewaschen werden.",
      },
      {
        question: "Lohnt sich ein Trockner mit Wärmepumpe?",
        answer:
          "Ja, bei regelmäßiger Nutzung. Wärmepumpentrockner verbrauchen deutlich weniger Strom als Kondenstrockner, trocknen dafür etwas langsamer. Die höheren Anschaffungskosten amortisieren sich bei häufiger Nutzung.",
      },
      {
        question: "Brauche ich für einen Einbaukühlschrank besondere Maße?",
        answer:
          "Ja. Einbaukühlschränke werden nach Nischenmaßen ausgewählt, nicht nach Außenmaßen. Messen Sie Höhe, Breite und Tiefe der Nische und prüfen Sie zusätzlich die Türanschlagseite.",
      },
    ],
  },

  "smart-home": {
    longDescription: `## Smart Home: Schritt für Schritt zum vernetzten Zuhause

Smart Home beginnt selten mit dem kompletten Umbau. Meist ist es eine smarte Lampe, ein Heizkörperthermostat oder eine Türklingel mit Kamera. Der wichtigste Unterschied zwischen den Systemen liegt im Funkstandard: WLAN-Geräte brauchen kein Gateway, belasten aber das Heimnetz. Zigbee- und Thread-Geräte sind stromsparend und bilden ein eigenes Mesh-Netz, benötigen aber einen Hub oder Border Router. Matter soll langfristig die Kompatibilität zwischen Herstellern vereinfachen.

## Beleuchtung, Heizung und Sicherheit

Smarte Beleuchtung lässt sich zeitgesteuert, per App oder per Sprachbefehl steuern. Dimmen, Farbtemperatur und Szenen sind die häufigsten Funktionen; im Alltag zählt vor allem, dass der Lichtschalter weiterhin normal funktioniert. Smarte Thermostate regeln einzelne Räume und können Heizkosten senken, wenn Fenster-offen-Erkennung und Zeitpläne genutzt werden. Kameras und Türklingeln erhöhen das Sicherheitsgefühl, werfen aber Fragen zu Speicherort und Datenschutz auf: Lokale Speicherung ist häufig die bessere Wahl.

## Worauf Sie beim Kauf achten sollten

- **Kompatibilität:** Prüfen Sie vor dem Kauf, ob Gerät, App und vorhandener Hub zusammenarbeiten.
- **Standard:** Matter oder Zigbee sind zukunftssicherer als reine Hersteller-Ökosysteme.
- **Datenschutz:** Kameras mit lokaler Speicherung oder deutschen Serverstandorten bevorzugen.
- **Stromversorgung:** Sensoren laufen oft mit Batterien; achten Sie auf Laufzeit und einfachen Wechsel.
- **Bedienung im Alltag:** Sprache und App sind praktisch, aber ein physischer Schalter bleibt der zuverlässigste Weg.

## Marken im Sortiment

Sie finden Beleuchtung von Philips Hue, Nanoleaf und IKEA, Heizungssteuerung von tado° und Netatmo, Überwachung von Ring und Kameras sowie Hubs und Sensoren für den Einstieg. Für Einsteiger ist ein Starter-Set mit Hub und zwei bis drei Geräten meist günstiger als der Kauf einzelner Komponenten.

## Installation und Service

Die meisten Geräte lassen sich ohne Fachbetrieb einrichten. Bei fest installierten Türklingeln oder Heizungsventilen sollte die Montage vorab geprüft werden. Bei Fragen zur Kompatibilität hilft der Kundenservice vor der Bestellung.`,
    faqs: [
      {
        question: "Brauche ich für Smart Home immer einen Hub?",
        answer:
          "Nein. WLAN-Geräte lassen sich oft direkt per App steuern. Zigbee-, Thread- und viele Matter-Geräte benötigen dagegen einen Hub oder Border Router, der die Geräte miteinander verbindet.",
      },
      {
        question: "Welcher Funkstandard ist zukunftssicher?",
        answer:
          "Matter ist der vielversprechendste Standard für herstellerübergreifende Kompatibilität. Zigbee ist ebenfalls weit verbreitet und ausgereift. Reine WLAN-Geräte sind einfach, können aber bei vielen Geräten das Netz belasten.",
      },
      {
        question: "Kann ich mit smarten Thermostaten wirklich Heizkosten sparen?",
        answer:
          "Ja, vor allem durch Zeitpläne und Fenster-offen-Erkennung. Die Einsparung hängt vom Gebäude, den Heizgewohnheiten und der korrekten Installation ab. In schlecht gedämmten Räumen ist der Effekt kleiner.",
      },
    ],
  },

  reinigung: {
    longDescription: `## Staubsauger und Reinigungsgeräte für jeden Boden

Die richtige Reinigungslösung hängt weniger vom Preis als vom Boden und vom Grundriss ab. Auf Teppich braucht es eine starke Bürste und guten Staubfang, auf Hartboden sind weiche Rollen und eine feine Saugleistung wichtiger. Ein Bodenstaubsauger mit Kabel liefert dauerhaft volle Leistung und ist bei großen Flächen meist die günstigste Wahl. Akkusauger sind schneller griffbereit und eignen sich für die tägliche Zwischenreinigung, verlieren aber mit leerem Akku an Kraft.

## Saugroboter richtig einschätzen

Saugroboter übernehmen die regelmäßige Grundreinigung, ersetzen aber keinen vollwertigen Staubsauger. Wichtig sind die Navigation per Laser oder Kamera, eine ausreichende Akkulaufzeit und die Höhe des Geräts, wenn es unter Möbel fahren soll. Absaugstationen reduzieren den Aufwand, benötigen aber Platz und Strom. Für Haushalte mit Teppich und Hartboden lohnt ein Modell mit automatischer Teppicherkennung.

## Filter, Akku und Zubehör

Bei Allergikern zählt ein guter HEPA-Filter und ein geschlossenes System, damit Feinstaub nicht wieder in die Raumluft gelangt. Waschbare Filter sparen Folgekosten, müssen aber regelmäßig gereinigt werden. Bei Akkusaugern ist die Laufzeit im Eco-Modus oft deutlich länger als im Boost-Modus; die Herstellerangaben beziehen sich meist auf den sparsamsten Betrieb. Prüfen Sie außerdem, ob Ersatzakkus und Bürsten langfristig erhältlich sind.

## Dampfreiniger und Waschsauger

Dampfreiniger arbeiten ohne Chemie und eignen sich für Fliesen, Fugen und hartnäckige Verschmutzungen. Auf versiegelten Holzböden und empfindlichen Oberflächen sind sie nicht geeignet. Waschsauger nehmen Schmutz und Flüssigkeit auf und sind bei Polstern, Teppichen und nach Renovierungen nützlich. Für den normalen Haushalt reicht meist ein guter Staubsauger mit passender Bürste.

## Worauf Sie beim Kauf achten sollten

- **Bodenbelag:** Teppich braucht Bürste und starken Luftstrom, Hartboden weiche Rollen und Feinstaubfilter.
- **Gewicht und Lautstärke:** Ein leiser, leichter Sauger wird häufiger benutzt.
- **Wartung:** Filter, Bürsten und Behälter sollten ohne Werkzeug zugänglich sein.
- **Ersatzteile:** Akku und Bürsten sind Verschleißteile; prüfen Sie die Verfügbarkeit.
- **Stauraum:** Wandhalterung oder Standstation vor dem Kauf einplanen.

## Marken im Sortiment

Im Shop finden Sie Staubsauger und Akkusauger von Dyson, Miele, Bosch, Siemens, AEG, Philips und Electrolux, Saugroboter von iRobot, Roborock und Xiaomi sowie Dampfreiniger und Zubehör von Kärcher und Vorwerk. Alle Geräte kommen mit deutscher Rechnung und gesetzlicher Gewährleistung.`,
    faqs: [
      {
        question: "Saugroboter oder Akkusauger – was ist sinnvoller?",
        answer:
          "Ein Saugroboter übernimmt die regelmäßige Grundreinigung auf glatten Flächen und hält den Boden sauber, ersetzt aber keine gründliche Reinigung von Ecken, Treppen und Polstern. Ein Akkusauger ist flexibler und für die schnelle Zwischenreinigung besser geeignet.",
      },
      {
        question: "Was bringt ein HEPA-Filter im Staubsauger?",
        answer:
          "Ein HEPA-Filter hält einen großen Teil feiner Partikel zurück und verhindert, dass sie beim Saugen wieder in die Raumluft gelangen. Für Allergiker ist ein geschlossenes System mit gutem Filter besonders sinnvoll.",
      },
      {
        question: "Wie lange hält ein Akku in Akkusaugern?",
        answer:
          "Die Laufzeit liegt je nach Modell und Leistungsstufe meist zwischen 10 und 60 Minuten. Im Eco-Modus sind die Herstellerangaben realistisch, im Boost-Modus oft nur wenige Minuten. Ein zweiter Akku verlängert die Einsatzzeit.",
      },
    ],
  },

  klima: {
    longDescription: `## Luftreiniger, Luftbefeuchter und Klimageräte

Saubere Luft und ein angenehmes Raumklima sind besonders in Städten und in gut gedämmten Wohnungen wichtig. Luftreiniger filtern Staub, Pollen, Feinstaub und teilweise Gerüche. Entscheidend ist die Reinigungsleistung, angegeben als CADR (Clean Air Delivery Rate), und der passende Filter: HEPA H13 oder H14 für Allergiker, Aktivkohle gegen Gerüche und Formaldehyd. Die angegebene Raumgröße sollte eher großzügig gewählt werden, damit das Gerät im Alltag leise laufen kann.

## Luftbefeuchter und Luftkühler

Luftbefeuchter helfen bei trockener Heizungsluft. Verdunster arbeiten mit einem Lüfter und sind hygienisch unproblematisch, benötigen aber mehr Pflege. Ultraschallgeräte sind leise, können bei unsauberem Wasser aber Mineralstaub verteilen. Luftkühler sind keine Klimaanlagen: Sie senken die Temperatur nur durch Verdunstung und wirken am besten in trockener, gut durchlüfteter Luft. Für echte Kühlung in geschlossenen Räumen ist ein Klimagerät mit Abluftschlauch nötig.

## Worauf Sie beim Kauf achten sollten

- **Raumgröße:** CADR und Herstellerangabe zur Fläche mit Reserve wählen.
- **Filterkosten:** HEPA- und Aktivkohlefilter müssen regelmäßig ersetzt werden; Folgekosten einplanen.
- **Geräuschpegel:** Im Schlafzimmer sind Werte unter 30 dB im Nachtmodus wichtig.
- **Stromverbrauch:** Luftreiniger laufen oft rund um die Uhr; ein niedriger Verbrauch zählt mehr als die maximale Leistung.
- **Sensoren:** Automatikmodus und Luftqualitätsanzeige erleichtern den Betrieb, ersetzen aber keine Filterpflege.

## Marken und Einsatzbereiche

Zum Sortiment gehören Luftreiniger von Dyson, Blueair, Levoit und Philips, Luftbefeuchter und Luftkühler von Stadler Form, Trotec, Klarstein und Comfee sowie Kombigeräte mit Ventilatorfunktion. Für Allergiker empfiehlt sich ein Gerät mit HEPA-Filter und automatischer Leistungsregelung; für kleine Räume reicht oft ein kompaktes Modell mit 20 bis 30 Watt.

## Beratung und Rückgabe

Bei Fragen zur passenden Raumgröße oder zu Filterkosten hilft der Kundenservice vor der Bestellung. Alle Geräte werden mit deutscher Rechnung und gesetzlicher Gewährleistung geliefert; zusätzlich gilt das freiwillige 30-tägige Rückgaberecht für unbenutzte Ware.`,
    faqs: [
      {
        question: "Welchen Luftreiniger brauche ich für Allergien?",
        answer:
          "Sinnvoll ist ein Gerät mit HEPA-Filter (mindestens H13), automatischer Leistungsregelung und einem CADR, der zur Raumgröße passt. Im Schlafzimmer ist ein leiser Nachtmodus wichtig. Die Filter sollten regelmäßig ersetzt werden.",
      },
      {
        question: "Kühlt ein Luftkühler einen Raum wirklich?",
        answer:
          "Ein Luftkühler senkt die Temperatur nur durch Verdunstung und erreicht am besten in trockener Luft eine spürbare Wirkung. In feuchten oder geschlossenen Räumen ist der Effekt gering. Für echte Kühlung ist ein Klimagerät mit Abluftschlauch nötig.",
      },
      {
        question: "Wie oft müssen HEPA-Filter gewechselt werden?",
        answer:
          "Je nach Hersteller und Nutzung meist alle sechs bis zwölf Monate. Bei stark belasteter Luft oder Dauerbetrieb kann ein Wechsel früher nötig sein. Viele Geräte zeigen den Filterzustand automatisch an.",
      },
    ],
  },
};
