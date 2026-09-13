/**
 * Seed les 10 articles Ratgeber
 * Usage: npx tsx prisma/seed-ratgeber.ts
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface ArticleData {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  authorName: string;
  category: string;
  tags: string[];
  seoTitle: string;
  seoDesc: string;
  readingTime: number;
}

const articles: ArticleData[] = [
  {
    title: "Die richtige Kaffeemaschine wählen: Vollautomat, Siebträger oder Kapselmaschine?",
    slug: "kaffeemaschine-waehlen",
    excerpt: "Vollautomat, Siebträger oder Kapselmaschine? Wir erklären die Unterschiede und helfen Ihnen bei der Auswahl der perfekten Kaffeemaschine für Ihren Alltag.",
    coverImage: "/images/ratgeber/kaffeemaschine-waehlen.jpg",
    authorName: "HAUSAURA Redaktion",
    category: "kaffee",
    tags: ["Kaffee", "Vollautomat", "Siebträger", "Kapselmaschine", "Kaufberatung"],
    seoTitle: "Kaffeemaschine wählen: Vollautomat, Siebträger oder Kapsel? | HAUSAURA",
    seoDesc: "Vollautomat, Siebträger oder Kapselmaschine — welche Kaffeemaschine passt zu Ihnen? Erfahren Sie die Vor- und Nachteile jeder Art.",
    readingTime: 6,
    content: `<h2>Welche Kaffeemaschine passt zu Ihnen?</h2>
<p>Die Auswahl der richtigen Kaffeemaschine ist eine Entscheidung, die Ihren täglichen Kaffeegenuss nachhaltig beeinflusst. Ob Vollautomat, Siebträgermaschine oder Kapselmaschine — jede Art hat ihre Vor- und Nachteile. In diesem Ratgeber helfen wir Ihnen, die perfekte Maschine für Ihre Bedürfnisse zu finden.</p>

<h2>Kaffeevollautomat: Der Vielseitigste</h2>
<p>Kaffeevollautomaten gelten als die vielseitigste Lösung für Kaffeeliebhaber. Sie mahlen die Bohnen frisch und bereiten mit einem Knopfdruck Espresso, Cappuccino, Latte Macchiato und viele weitere Spezialitäten zu. Die integrierten Mahlwerke ermöglichen individuelle Einstellungen der Mahlfeinheit.</p>
<ul>
<li><strong>Vorteile:</strong> Frisch gemahlen, vielseitig, milchgebundene Getränke automatisch</li>
<li><strong>Nachteile:</strong> Höherer Anschaffungspreis, regelmäßige Reinigung nötig</li>
<li><strong>Ideal für:</strong> Kaffeeliebhaber, die Vielseitigkeit und Frische schätzen</li>
</ul>

<h2>Siebträgermaschine: Für Barista-Genießer</h2>
<p>Siebträgermaschinen bieten das Authentic-Café-Erlebnis zuhause. Mit einem Siebträger, Tamper und Milchaufschäumer können Sie sich wie ein Profi-Barista fühlen. Die Maschinen erfordern etwas Übung, belohnen Sie aber mit espresso von höchster Qualität.</p>
<ul>
<li><strong>Vorteile:</strong> Höchste Espress-Qualität, Barista-Erlebnis, langlebig</li>
<li><strong>Nachteile:</strong> Lernkurve, manuelle Zubereitung, separater Kaffeevollautomat nötig</li>
<li><strong>Ideal für:</strong> Espresso-Enthusiasten und Hobby-Baristas</li>
</ul>

<h2>Kapselmaschine: Schnell und unkompliziert</h2>
<p>Kapselmaschinen sind die kompakteste und einfachste Lösung. Mit einer großen Auswahl an Kapseln von Nespresso, Tchibo und anderen Herstellern genießen Sie in Sekunden einen aromatischen Kaffee. Die Maschinen sind platzsparend und einfach zu bedienen.</p>
<ul>
<li><strong>Vorteile:</strong> Schnell, einfach, kompakt, große Kapselauswahl</li>
<li><strong>Nachteile:</strong> Höhere laufende Kosten, weniger frisch als Bohnen, Müll</li>
<li><strong>Ideal für:</strong> Schnellen Kaffee im Alltag, kleine Küchen</li>
</ul>

<h2>Unser Fazit</h2>
<p>Für die meisten Kaffeeliebhaber ist ein <strong>Kaffeevollautomat</strong> die beste Wahl. Er bietet die perfekte Kombination aus Frische, Vielseitigkeit und Komfort. Wer Wert auf das Barista-Erlebnis legt, sollte eine <strong>Siegträgermaschine</strong> in Betracht ziehen. Für den schnellen Kaffee im Alltag ist eine <strong>Kapselmaschine</strong> die praktischste Lösung.</p>
<p>Entdecken Sie unsere Auswahl an Kaffeemaschinen und finden Sie Ihre perfekte Maschine bei HAUSAURA.</p>`,
  },
  {
    title: "Induktion vs. Ceranfeld: Vor- und Nachteile im Vergleich",
    slug: "induction-vs-ceranfeld",
    excerpt: "Induktions- oder Ceranfeld? Wir vergleichen beide Technologien und erklären, welches Kochfeld für Ihre Küche am besten geeignet ist.",
    coverImage: "/images/ratgeber/induction-vs-ceranfeld.jpg",
    authorName: "HAUSAURA Redaktion",
    category: "kueche",
    tags: ["Induktion", "Ceranfeld", "Kochfeld", "Küche", "Energieeffizienz"],
    seoTitle: "Induktion vs. Ceranfeld: Vor- und Nachteile | HAUSAURA",
    seoDesc: "Induktion oder Ceranfeld — welches Kochfeld ist besser? Erfahren Sie die Unterschiede bei Geschwindigkeit, Energieeffizienz und Bedienung.",
    readingTime: 5,
    content: `<h2>Induktion oder Ceranfeld — die große Entscheidung</h2>
<p>Bei der Modernisierung der Küche stellt sich häufig die Frage: Induktion oder Ceranfeld? Beide Technologien bieten Vorteile, unterscheiden sich jedoch in wichtigen Aspekten. Wir helfen Ihnen bei der Entscheidung.</p>

<h2>So funktioniert Induktion</h2>
<p>Induktionskochfelder nutzen ein elektromagnetisches Feld, um die Kochgeschirr direkt zu erhitzen. Das Kochgeschirr muss magnetleitend sein (Eisen oder Edelstahl mit Eisenkern). Die Hitze entsteht direkt im Topf, nicht auf der Kochfläche.</p>
<ul>
<li><strong>Vorteile:</strong> Schnellstes Aufheizen (2-3 Sekunden), hohe Energieeffizienz (90%), präzise Temperaturregelung, leicht zu reinigen</li>
<li><strong>Nachteile:</strong> Höherer Anschaffungspreis, spezielles Kochgeschirr erforderlich</li>
</ul>

<h2>So funktioniert Keramik</h2>
<p>Keramikkochfelder verwenden Heizstrahler unter einer glatten Glasoberfläche. Die Wärme wird über die Glasfläche auf das Kochgeschirr übertragen. Es gibt zwei Varianten: Standard-Keramik und Halogen-Keramik.</p>
<ul>
<li><strong>Vorteile:</strong> Niedrigerer Anschaffungspreis, alle Kochgeschirr-Typen geeignet, einfach zu bedienen</li>
<li><strong>Nachteile:</strong> Langsameres Aufheizen (4-6 Minuten), geringere Energieeffizienz (55-60%), Restwärmenutzung</li>
</ul>

<h2>Direktvergleich: Geschwindigkeit und Energie</h2>
<p>Induktion gewinnt bei der Geschwindigkeit klar: Wasser kocht in 2 Minuten statt 6 Minuten. Auch bei der Energieeffizienz liegt Induktion mit 90% weit vor Keramik mit 55-60%. Langfristig sparen Sie mit Induktion bis zu 30% Energiekosten.</p>

<h2>Fazit: Was ist besser?</h2>
<p>Für die meisten modernen Küchen ist <strong>Induktion die bessere Wahl</strong>. Die höhere Anschaffungskompensiert sich durch Energieeinsparungen und schnellere Zubereitung. Wer bereits gutes Kochgeschirr hat oder wenig Kochgeschirr benötigt, kann auch mit einem <strong>Keramikfeld</strong> gut bedient sein.</p>
<p>Entdecken Sie unsere Induktions- und Keramikkochfelder bei HAUSAURA.</p>`,
  },
  {
    title: "Saugroboter vs. kabelloser Staubsauger: Was ist besser?",
    slug: "saugroboter-vs-staubsauger",
    excerpt: "Saugroboter oder kabelloser Staubsauger? Beide haben ihre Stärken. Erfahren Sie, welches Gerät für Ihren Haushalt am besten geeignet ist.",
    coverImage: "/images/ratgeber/saugroboter-vs-staubsauger.jpg",
    authorName: "HAUSAURA Redaktion",
    category: "reinigung",
    tags: ["Saugroboter", "Staubsauger", "Reinigung", "Vergleich", "Dyson"],
    seoTitle: "Saugroboter vs. kabelloser Staubsauger | HAUSAURA",
    seoDesc: "Saugroboter oder kabelloser Staubsauger — was ist besser? Vergleich von Preis, Leistung und Einsatzmöglichkeiten.",
    readingTime: 5,
    content: `<h2>Die große Frage: Saugroboter oder Staubsauger?</h2>
<p>Die moderne Reinigungstechnik bietet zwei Hauptlösungen: Saugroboter, die automatisch und selbstständig saugen, und kabellose Staubsauger für die manuelle Reinigung. Beide haben ihre Berechtigung — aber welches Gerät passt zu Ihrem Haushalt?</p>

<h2>Saugroboter: Automatischer Reiniger</h2>
<p>Saugroboter arbeiten komplett selbstständig. Sie navigieren mittels Laser oder Kamera durch Ihre Räume und saugen Böden und Teppiche automatisch. Viele Modelle bieten Wischfunktion und automatische Staubertertiung.</p>
<ul>
<li><strong>Vorteile:</strong> Zeitersparnis, automatisch, im Alltag unsichtbar, App-Steuerung</li>
<li><strong>Nachteile:</strong> Höherer Anschaffungspreis, kann Treppen nicht erkennen, Ecken manuell nachreinigen</li>
</ul>

<h2>Kabelloser Staubsauger: Manuell und leistungsstark</h2>
<p>Kabellose Staubsauger bieten maximale Flexibilität und hohe Saugleistung. Sie sind ideal für schnelle Reinigungen, Treppen und Polstermöbel. Moderne Akkusauger erreichen 60+ Minuten Laufzeit.</p>
<ul>
<li><strong>Vorteile:</strong> Hohe Saugleistung, flexibel, für alle Oberflächen, kompakt</li>
<li><strong>Nachteile:</strong> Manuelle Arbeit, Akkulaufzeit begrenzt, Aufbewahrung nötig</li>
</ul>

<h2>Unser Vergleich</h2>
<p><strong>Für wen ist ein Saugroboter ideal?</strong> Große Wohnungen mit harten Böden, Vielverdiener, Allergiker (tägliche Reinigung).<br/>
<strong>Für wen ist ein kabelloser Staubsauger besser?</strong> Kleine Wohnungen, Treppen, Polstermöbel, gründliche Reinigung.</p>

<h2>Die beste Lösung: Beides!</h2>
<p>Die ideale Kombination ist ein <strong>Saugroboter für den täglichen Grundbetrieb</strong> und ein <strong>kabelloser Staubsauger für die gründliche Reinigung</strong>. So sparen Sie Zeit und haben immer ein sauberes Zuhause.</p>
<p>Entdecken Sie unsere Auswahl an Saugrobotern und kabellosen Staubsaugern bei HAUSAURA.</p>`,
  },
  {
    title: "Smart Home für Einsteiger: So starten Sie vernetztes Wohnen",
    slug: "smart-home-einsteiger",
    excerpt: "Smart Home muss nicht kompliziert sein. Mit diesen einfachen Schritten starten Sie in die Welt des vernetzten Wohnens und sparen Energie.",
    coverImage: "/images/ratgeber/smart-home-einsteiger.jpg",
    authorName: "HAUSAURA Redaktion",
    category: "smart-home",
    tags: ["Smart Home", "Einsteiger", "Alexa", "Google Home", "HomeKit"],
    seoTitle: "Smart Home für Einsteiger: So starten Sie | HAUSAURA",
    seoDesc: "Smart Home Einsteiger-Guide: So starten Sie mit einfachen Geräten in vernetztes Wohnen und sparen Energie.",
    readingTime: 7,
    content: `<h2>Was ist Smart Home?</h2>
<p>Unter Smart Home versteht man die Vernetzung von Haushaltsgeräten und -systemen über WLAN oder andere Funksignale. Geräte lassen sich per App, Sprache oder automatisiert steuern — für mehr Komfort, Sicherheit und Energieeffizienz.</p>

<h2>Schritt 1: Die richtige Hub-Plattform wählen</h2>
<p>Bevor Sie mit Smart Home beginnen, sollten Sie sich für eine Plattform entscheiden:</p>
<ul>
<li><strong>Amazon Alexa:</strong> Größtes Ökosystem, viele kompatible Geräte, günstige Einstiegslösung</li>
<li><strong>Google Home:</strong> Gute Spracherkennung, enge Integration mit Android</li>
<li><strong>Apple HomeKit:</strong> Bestes Datenschutzniveau, für Apple-Nutzer ideal</li>
</ul>

<h2>Schritt 2: Mit einfachen Geräten starten</h2>
<p>Beginnen Sie mit einfachen Smart-Home-Produkten:</p>
<ul>
<li><strong>Smart-Beleuchtung:</strong> Philips Hue oder IKEA TRADFRI — Licht per App oder Sprache steuern</li>
<li><strong>Smart-Thermostat:</strong> tado° oder Netatmo — Heizung intelligent steuern und Energie sparen</li>
<li><strong>Smart-Steckdose:</strong> Beliebige Geräte per App ein- und ausschalten</li>
</ul>

<h2>Schritt 3: Automatisierungen erstellen</h2>
<p>Der wahre Komfort entsteht durch Automatisierungen:</p>
<ul>
<li>Lichter gehen automatisch bei Sonnenuntergang an</li>
<li>Heizung senkt Temperatur wenn das Haus verlassen wird</li>
<li>Kamera nimmt bei Bewegungserkennung auf</li>
</ul>

<h2>Unser Tipp für Einsteiger</h2>
<p>Starten Sie mit einem <strong>Smart-Thermostat</strong> — es spart bis zu 28% Heizkosten und ist einfach nachzurüsten. Kombinieren Sie es mit <strong>smarten Leuchtmitteln</strong> für maximales Wohnkomfort.</p>
<p>Entdecken Sie unsere Smart-Home-Auswahl bei HAUSAURA.</p>`,
  },
  {
    title: "Geschirrspüler richtig beladen und sparen: Die besten Tipps",
    slug: "geschirrspuelaer-tipps",
    excerpt: "Geschirrspüler richtig beladen spart Wasser, Energie und Zeit. Mit unseren Tipps schonen Sie Ihr Geschirr und die Umwelt.",
    coverImage: "/images/ratgeber/geschirrspuelaer-tipps.jpg",
    authorName: "HAUSAURA Redaktion",
    category: "haushaltsgeraete",
    tags: ["Geschirrspüler", "Tipps", "Energie sparen", "Reinigung"],
    seoTitle: "Geschirrspüler richtig beladen: Tipps zum Sparen | HAUSAURA",
    seoDesc: "Geschirrspüler richtig beladen und sparen: Die besten Tipps für sparsames und effektives Spülen.",
    readingTime: 4,
    content: `<h2>Richtig beladen = besser spülen</h2>
<p>Ein Geschirrspüler spült nur dann optimal, wenn er richtig beladen ist. Falsch beladene Maschinen verbrauchen mehr Wasser und Energie, und das Ergebnis ist oft unbefriedigend.</p>

<h2>Die Grundregeln der Beladung</h2>
<ul>
<li><strong>Teller:</strong> Im unteren Korb aufstellen, nicht überlappen, Schmutzseite zum Zentrum</li>
<li><strong>Glas:</strong> Im oberen Korb kopfüber einstellen, Abstand halten</li>
<li><strong>Töpfe & Pfannen:</strong> Im unteren Korb mit der Schmutzseite nach unten</li>
<li><strong>Messer:</strong> Im Messerkorb mit der Schneide nach unten</li>
<li><strong>Plastik:</strong> Im oberen Korb, leicht nach unten geneigt (Wasser läuft sonst ab)</li>
</ul>

<h2>Energie sparen mit der richtigen Einstellung</h2>
<p>Nutzen Sie das Eco-Programm für normale Verschmutzungen. Es dauert zwar länger, spart aber bis zu 50% Energie und Wasser. Das Intensiv-Programm nur für stark verschmutztes Geschirr verwenden.</p>

<h2>Regelmäßig reinigen</h2>
<p>Reinigen Sie den Filter wöchentlich und führen Sie monatlich einen Reinigungslauf mit Spülmaschinenreiniger durch. So bleibt Ihre Maschine effizient und geruchsfrei.</p>

<h2>Voll beladen — niemals halb!</h2>
<p>Ein halbvoller Geschirrspüler verschwendet Wasser und Energie. Warten Sie, bis die Maschine voll ist, oder nutzen Sie das Halbprogramm falls verfügbar.</p>`,
  },
  {
    title: "Luftreiniger gegen Allergien: Worauf Sie achten müssen",
    slug: "luftreiniger-allergien",
    excerpt: "Luftreiniger können Allergiesymptome deutlich lindern. Erfahren Sie, worauf Sie bei der Auswahl achten und welche Technologien wirklich helfen.",
    coverImage: "/images/ratgeber/luftreiniger-allergien.jpg",
    authorName: "HAUSAURA Redaktion",
    category: "klima",
    tags: ["Luftreiniger", "Allergien", "HEPA-Filter", "Raumluft", "Gesundheit"],
    seoTitle: "Luftreiniger gegen Allergien: Worauf achten | HAUSAURA",
    seoDesc: "Luftreiniger gegen Allergien: Worauf Sie bei der Auswahl achten müssen und welche Technologien helfen.",
    readingTime: 5,
    content: `<h2>Luftreiniger: Helfer gegen Allergien</h2>
<p>Für Allergiker ist saubere Luft essenziell. Ein guter Luftreiniger kann Pollen, Feinstaub und andere Allergene aus der Luft filtern und so die Lebensqualität deutlich verbessern.</p>

<h2>Die richtige Filtertechnologie</h2>
<p>Nicht jeder Luftreiniger ist gleich. Entscheidend ist die Filtertechnologie:</p>
<ul>
<li><strong>HEPA-Filter (H13):</strong> Entfernen 99,95% aller Partikel ab 0,3 Mikrometer — der Goldstandard für Allergiker</li>
<li><strong>Aktivkohlefilter:</strong> Binden Gerüche und Schadstoffe wie Formaldehyd</li>
<li><strong>Vorfilter:</strong> Fangen große Partikel wie Haare und Staub ab</li>
</ul>

<h2>Raumgröße beachten</h2>
<p>Die Leistung eines Luftreinigers wird in CADR (Clean Air Delivery Rate) gemessen. Für einen 20m²-Raum benötigen Sie mindestens 200 m³/h CADR. Für größere Räume entsprechend mehr.</p>

<h2>Worauf Sie achten sollten</h2>
<ul>
<li>HEPA-Filter der Klasse H13 oder höher</li>
<li>Ausreichende CADR für Ihre Raumgröße</li>
<li>Geräuscharmer Betrieb (unter 30 dB im Sleep-Modus)</li>
<li>Filterkosten und Austauschintervalle</li>
<li>App-Steuerung und Luftqualitätsanzeige</li>
</ul>

<h2>Unser Tipp</h2>
<p>Für Allergiker empfehlen wir einen Luftreiniger mit <strong>HEPA H13-Filter</strong> und <strong>Aktivkohlefilter</strong>. Kombinieren Sie ihn mit regelmäßigen Lüften für optimale Raumluft.</p>
<p>Entdecken Sie unsere Luftreiniger bei HAUSAURA.</p>`,
  },
  {
    title: "Waschmaschine richtig beladen: Pflegetipps für lange Lebensdauer",
    slug: "waschmaschine-beladen",
    excerpt: "Richtiges Beladen und Pflegen verlängert die Lebensdauer Ihrer Waschmaschine erheblich. Die wichtigsten Tipps und Tricks.",
    coverImage: "/images/ratgeber/waschmaschine-beladen.jpg",
    authorName: "HAUSAURA Redaktion",
    category: "haushaltsgeraete",
    tags: ["Waschmaschine", "Pflege", "Tipps", "Wäsche", "Energie sparen"],
    seoTitle: "Waschmaschine richtig beladen: Pflegetipps | HAUSAURA",
    seoDesc: "Waschmaschine richtig beladen und pflegen: Die besten Tipps für lange Lebensdauer und saubere Wäsche.",
    readingTime: 5,
    content: `<h2>Richtiges Beladen spart Energie und schont die Wäsche</h2>
<p>Eine richtig beladene Waschmaschine wäscht effektiver und verbraucht weniger Energie. Die Beladungsmenge richtet sich nach dem Fassungsvermögen Ihres Geräts.</p>

<h2>Beladungsregeln</h2>
<ul>
<li><strong>Nicht überladen:</strong> Die Trommel darf max. 80% gefüllt sein (Faustregel: Hand passt zwischen Wäsche und Trommelrand)</li>
<li><strong>Nicht unterladen:</strong> Mindestens die halbe Trommel füllen für optimales Ergebnis</li>
<li><strong>Trennen:</strong> Weiße und bunte Wäsche getrennt waschen</li>
<li><strong>Wäsche wenden:</strong> Jacken und Hosen vor dem Waschen wenden</li>
</ul>

<h2>Die richtige Temperatur</h2>
<p>Niedrige Temperaturen schonen Fasern und sparen Energie:</p>
<ul>
<li><strong>30°C:</strong> Leicht verschmutzte Wäsche, empfindliche Stoffe</li>
<li><strong>40°C:</strong> Alltagswäsche, Handtücher</li>
<li><strong>60°C:</strong> Bettwäsche, Küchentücher, Babysachen</li>
<li><strong>90°C:</strong> Kochwäsche, Bettwaren (nur bei Bedarf)</li>
</ul>

<h2>Regelmäßige Pflege</h2>
<p>Reinigen Sie die Dichtung, das Fach für Waschmittel und den Filter monatlich. Führen Sie alle 2-3 Monate einen 90°C-Heißlauf ohne Wäsche durch, um Gerüche und Keime zu entfernen.</p>

<h2>Dosierungsrichtlinien</h2>
<p>Überdosieren Sie Waschmittel nicht — es hinterlässt Rückstände und schadet der Umwelt. Nutzen Sie Dosierhilfen oder die Automatikfunktion Ihrer Maschine.</p>`,
  },
  {
    title: "Energie sparen mit modernen Küchengeräten: Ratgeber zum Energiesparen",
    slug: "energie-sparen-kueche",
    excerpt: "Moderne Küchengeräte可以帮助您节省大量能源。了解如何通过正确的使用方式减少 Strom- und Wasserkosten.",
    coverImage: "/images/ratgeber/energie-sparen-kueche.jpg",
    authorName: "HAUSAURA Redaktion",
    category: "kueche",
    tags: ["Energie sparen", "Küche", "Nachhaltigkeit", "Energieeffizienz", "Tipps"],
    seoTitle: "Energie sparen mit Küchengeräten: Tipps | HAUSAURA",
    seoDesc: "Energie sparen mit modernen Küchengeräten: Erfahren Sie, wie Sie Strom- und Wasserkosten in der Küche reduzieren.",
    readingTime: 6,
    content: `<h2>Energieeffizient kochen und sparen</h2>
<p>Der Haushalt ist einer der größten Stromverbraucher. Mit modernen, energieeffizienten Küchengeräten und der richtigen Nutzung können Sie Ihre Energiekosten deutlich senken.</p>

<h2>Energieeffizienzklasse verstehen</h2>
<p>Die EU-Energieeffizienzklasse reicht von A+++ (beste) bis D (schlechteste). A+++ Geräte verbrauchen bis zu 60% weniger Energie als Klasse-G-Geräte. Achten Sie beim Kauf auf die höchste mögliche Klasse.</p>

<h2>Tipps für jede Gerät</h2>
<h3>Backofen</h3>
<ul>
<li>Heißluft statt Ober-/Unterhitze verwenden — spart 20% Energie</li>
<li>Ofentür nicht unnötig öffnen — jede Öffnung kostet 4% Wärme</li>
<li>Restwärme nutzen: Ofen 5 Minuten vor Ende ausschalten</li>
</ul>

<h3>Kühlschrank</h3>
<ul>
<li>Temperatur zwischen 5-7°C (Kühlschrank) und -18°C (Gefrierfach)</li>
<li>Heiße Speise erst abkühlen lassen, bevor sie in den Kühlschrank kommt</li>
<li>Dichtungen regelmäßig prüfen und reinigen</li>
</ul>

<h3>Waschmaschine</h3>
<ul>
<li>Niedrige Temperaturen (30-40°C) verwenden</li>
<li>Volle Maschinen statt zweimal halbvoll</li>
<li>Eco-Programm für normale Verschmutzungen nutzen</li>
</ul>

<h3>Geschirrspüler</h3>
<ul>
<li>Immer voll beladen</li>
<li>Eco-Programm verwenden — spart bis zu 50% Energie</li>
<li>Vorspülen ist unnötig bei modernen Maschinen</li>
</ul>

<h2>Das spart am meisten</h2>
<p>Der größte Einsparungseffekt entsteht durch den <strong>Austausch alter Geräte</strong> (älter als 10 Jahre) gegen neue A+++ Modelle. Die Investition amortisiert sich oft innerhalb von 3-5 Jahren durch Energieeinsparungen.</p>`,
  },
  {
    title: "Die besten Küchengeräte für kleine Küchen",
    slug: "kuechengeraete-kleine-kueche",
    excerpt: "Kleine Küche, große Wirkung? Mit den richtigen Geräten und cleveren Lösungen nutzen Sie jeden Zentimeter optimal aus.",
    coverImage: "/images/ratgeber/kuechengeraete-kleine-kueche.jpg",
    authorName: "HAUSAURA Redaktion",
    category: "kueche",
    tags: ["Kleine Küche", "Küchengeräte", "Platzsparend", "Kompakt", "Tipps"],
    seoTitle: "Küchengeräte für kleine Küchen | HAUSAURA",
    seoDesc: "Die besten Küchengeräte für kleine Küchen: Kompakte, platzsparende Lösungen für mehr Platz und Komfort.",
    readingTime: 5,
    content: `<h2>Kleine Küche — große Möglichkeiten</h2>
<p>Auch in einer kleinen Küche muss auf Komfort und Funktionalität nicht verzichtet werden. Mit den richtigen Geräten und cleveren Platzierungsideen nutzen Sie jeden Zentimeter optimal aus.</p>

<h2>Kompakte Küchengeräte</h2>
<p>Für kleine Küchen gibt es speziell entwickelte Kompaktgeräte:</p>
<ul>
<li><strong>Kompakt-Geschirrspüler (45cm):</strong> Perfekt für 2-3 Personen, spart Platz und Wasser</li>
<li><strong>Schmale Kühlschränke (45-55cm Breite):</strong> Hohe Modelle nutzen Vertikale</li>
<li><strong>Induktionskochfelder (30-45cm):</strong> Platzsparend für kleine Küchen</li>
<li><strong>Kompakte Waschmaschinen (40-45cm):</strong> Ideal für kleine Bäder</li>
</ul>

<h2>Platzsparende Lösungen</h2>
<ul>
<li><strong>Einbau-Geräte:</strong> Schrankfronten kaschieren die Geräte</li>
<li><strong>Kombigeräte:</strong> Waschtrockner statt separate Maschinen</li>
<li><strong>Untertisch-Geräte:</strong> Kühlschrank unter der Arbeitsplatte</li>
<li><strong>Wandmontage:</strong> Mikrowellen oder Kaffeevollautomaten an der Wand</li>
</ul>

<h2>Unsere Empfehlungen</h2>
<p>Für die kleine Küche empfehlen wir:</p>
<ol>
<li>Einen <strong>kompakten Kaffeevollautomaten</strong> (20cm Breite)</li>
<li>Einen <strong>45cm-Geschirrspüler</strong> für 8-9 Gedecke</li>
<li>Einen <strong>Schrank-Kühlschrank</strong> unter der Arbeitsplatte</li>
<li>Einen <strong>2-Feld-Induktionsherd</strong> für schnelles Kochen</li>
</ol>

<p>Entdecken Sie unsere Kompaktgeräte bei HAUSAURA und optimieren Sie Ihre kleine Küche.</p>`,
  },
  {
    title: "Heizen mit Wärmepumpe: Funktionsweise und Vorteile",
    slug: "waermepumpe-heizen",
    excerpt: "Wärmepumpen gehören zu den effizientesten Heizsystemen. Erfahren Sie, wie sie funktionieren und warum sie sich lohnen.",
    coverImage: "/images/ratgeber/waermepumpe-heizen.jpg",
    authorName: "HAUSAURA Redaktion",
    category: "klima",
    tags: ["Wärmepumpe", "Heizen", "Energieeffizienz", "Nachhaltigkeit", "Heizung"],
    seoTitle: "Heizen mit Wärmepumpe: Funktionsweise & Vorteile | HAUSAURA",
    seoDesc: "Wärmepumpe: Funktionsweise, Vorteile und Kosten. Erfahren Sie, warum Wärmepumpen die Zukunft des Heizens sind.",
    readingTime: 6,
    content: `<h2>Was ist eine Wärmepumpe?</h2>
<p>Eine Wärmepumpe nutzt die free Energiewärme aus Luft, Erde oder Wasser und wandelt sie in nutzbare Heizwärme um. Sie arbeitet wie ein Kühlschrank — nur umgekehrt: Statt Wärme abzuführen, wird sie zugeführt.</p>

<h2>So funktioniert eine Wärmepumpe</h2>
<p>Das Prinzip ist einfach:</p>
<ol>
<li><strong>Aufnahme:</strong> Das Kältemittel in der Außeneinheit nimmt Umgebungswärme auf</li>
<li><strong>Verdichtung:</strong> Ein Verdichter erhöht die Temperatur des Kältemittels</li>
<li><strong>Abgabe:</strong> Die entstandene Wärme wird an das Heizsystem abgegeben</li>
<li><strong>Rückführung:</strong> Das Kältemittel kehrt in den Kreislauf zurück</li>
</ol>

<h2>Die drei Wärmepumpen-Typen</h2>
<ul>
<li><strong>Luft-Wasser-Wärmepumpe:</strong> Nutzt Außenluft, einfachste Installation, beliebteste Variante</li>
<li><strong>Erdwärmepumpe:</strong> Nutzt Erdwärme über Kollektoren oder Bohrungen, höchste Effizienz</li>
<li><strong>Wasser-Wasser-Wärmepumpe:</strong> Nutzt Grundwasser, höchste Leistung, aufwendigste Installation</li>
</ul>

<h2>Vorteile einer Wärmepumpe</h2>
<ul>
<li><strong>Energieeffizienz:</strong> 3-5 kWh Wärme aus 1 kWh Strom (COP 3-5)</li>
<li><strong>Niedrigere Betriebskosten:</strong> Bis zu 50% Einsparung gegenüber Öl oder Gas</li>
<li><strong>Förderung:</strong> Bis zu 40% Zuschuss vom BAFA</li>
<li><strong>Umweltfreundlich:</strong> Keine direkten CO2-Emissionen</li>
<li><strong>Langfristige Sicherheit:</strong> Unabhängig von fossilen Brennstoffen</li>
</ul>

<h2>Wann lohnt sich eine Wärmepumpe?</h2>
<p>Eine Wärmepumpe lohnt sich besonders bei:</p>
<ul>
<li>Neubauten mit guter Dämmung</li>
<li>Altbauten mit Fußbodenheizung oder large Heizflächen</li>
<li>Dem Austausch alter Öl- oder Gasheizungen</li>
</ul>

<p>Informieren Sie sich über unsere Klima-Lösungen bei HAUSAURA.</p>`,
  },
];

async function main() {
  if (process.env.NODE_ENV === "production" && !process.env.ALLOW_SEED) {
    throw new Error("Refusing to seed in production without ALLOW_SEED=1. This script wipes ratgeber articles.");
  }
  console.log("🗑️  Deleting existing RatgeberArticle records...");
  await prisma.ratgeberArticle.deleteMany();

  console.log("📝 Seeding RatgeberArticle records...");
  let created = 0;

  for (const article of articles) {
    await prisma.ratgeberArticle.create({
      data: {
        ...article,
        isPublished: true,
        publishedAt: new Date(),
        viewCount: Math.floor(Math.random() * 500) + 50,
      },
    });
    created++;
    console.log(`  ✅ ${article.slug}`);
  }

  console.log(`\n🎉 ${created} RatgeberArticle records seeded successfully!`);
}

main()
  .catch((e) => {
    console.error("❌ Error seeding RatgeberArticle:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
