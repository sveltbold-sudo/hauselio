export interface FaqItem {
  question: string;
  answer: string;
}

export const faqItems: FaqItem[] = [
  {
    question: "Wie kann ich ein Produkt bestellen?",
    answer: "Wählen Sie Ihre Lieblingsprodukte im Shop aus, fügen Sie sie zum Warenkorb hinzu und folgen Sie dem Bestellprozess. Die Zahlung erfolgt per Überweisung (Vorkasse). Sie erhalten nach der Bestellung eine E-Mail mit den Bankverbindungen.",
  },
  {
    question: "Wie lange dauert die Lieferung?",
    answer: "Die Lieferzeit beträgt in der Regel 2-5 Werktage nach Eingang der Zahlung. Bei großen Haushaltsgeräten wie Waschmaschinen oder Geschirrspülern können wir auch einen Wunschtermin vereinbaren.",
  },
  {
    question: "Kann ich ein Gerät zurückgeben?",
    answer: "Ja, Sie haben ein 30-tägiges Rückgaberecht. Kontaktieren Sie uns einfach per E-Mail oder Telefon und wir informieren Sie über den Rückversand.",
  },
  {
    question: "Welche Garantie bieten Sie?",
    answer: "Alle Produkte unterliegen der gesetzlichen Gewährleistung von 24 Monaten. Für ausgewählte Premium-Produkte (Miele, Gaggenau, V-ZUG) bieten wir eine optionale Premium-Garantie bis zu 5 Jahre an. Diese kann direkt beim Kauf gebucht werden.",
  },
  {
    question: "Kann ich eine Beratung vor dem Kauf erhalten?",
    answer: "Selbstverständlich! Unsere Experten beraten Sie gerne telefonisch, per E-Mail oder über unser Kontaktformular. Wir helfen Ihnen, das perfekte Gerät für Ihre Bedürfnisse zu finden.",
  },
  {
    question: "Bieten Sie einen Anschlussservice an?",
    answer: "Derzeit konzentrieren wir uns auf den Verkauf hochwertiger Haushaltsgeräte. Für technische Probleme oder Reparaturwünsche verweisen wir Sie gerne an den jeweiligen Herstellerservice. Bei Garantiefällen helfen wir Ihnen selbstverständlich weiter.",
  },
  {
    question: "Welche Zahlungsarten stehen zur Verfügung?",
    answer: "Wir bieten ausschließlich die Zahlungsart Überweisung (Vorkasse) an. Nach Ihrer Bestellung erhalten Sie eine E-Mail mit unseren Bankverbindungsdaten. Die Zahlungsfrist beträgt 5 Werktage nach Abschluss des Vertrages.",
  },
  {
    question: "Versanden Sie auch nach Österreich und in die Schweiz?",
    answer: "Ja, wir versanden nach Deutschland, Österreich und der Schweiz. Die Versandkosten betragen 4,99€ (DE, ab 50€ versandkostenfrei), 7,99€ (AT, ab 75€ versandkostenfrei) und 9,99€ (CH, ab 100€ versandkostenfrei).",
  },
  {
    question: "Kann ich meine Bestellung nachverfolgen?",
    answer: "Ja, nach Versand Ihrer Bestellung erhalten Sie eine E-Mail mit einer Sendungsverfolgungsnummer. Über diese können Sie den aktuellen Status Ihres Pakets jederzeit online verfolgen.",
  },
  {
    question: "Bieten Sie Ratenzahlung an?",
    answer: "Derzeit bieten wir ausschließlich Zahlung per Überweisung (Vorkasse) an. Eine Ratenzahlung ist leider noch nicht möglich. Wir arbeiten daran, Ihnen weitere Zahlungsmethoden anzubieten.",
  },
  {
    question: "Wie kann ich meinen Newsletter abbestellen?",
    answer: "Klicken Sie in jeder Newsletter-E-Mail auf den Abbestell-Link. Alternativ können Sie sich auch über unser Kontaktformular an uns wenden. Wir verarbeiten Ihre Abbestellung umgehend.",
  },
  {
    question: "Welche Marken führen Sie?",
    answer: "Wir führen eine kuratierte Auswahl an Premium-Marken: Miele, Bosch, Siemens, Dyson, Jura, De'Longhi, Samsung, LG, Liebherr, Thermomix, tado°, Philips Hue, Ring, Netatmo, IKEA Smart Home und weitere. Alle Produkte werden direkt vom Hersteller oder autorisierten Händlern bezogen.",
  },
];

export function buildFaqJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}
