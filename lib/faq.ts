export interface FaqItem {
  question: string;
  answer: string;
}

export const faqItems: FaqItem[] = [
  {
    question: "Wie kann ich ein Produkt bestellen?",
    answer: "Wählen Sie Ihre Lieblingsprodukte im Shop aus, fügen Sie sie zum Warenkorb hinzu und folgen Sie dem Bestellprozess. Die Zahlung erfolgt per Überweisung (SEPA). Sie erhalten nach der Bestellung eine E-Mail mit den Bankverbindungen.",
  },
  {
    question: "Wie lange dauert die Lieferung?",
    answer: "Die Lieferzeit beträgt in der Regel 2-5 Werktage nach Eingang der Zahlung. Bei großen Haushaltsgeräten wie Waschmaschinen oder Geschirrspülern können wir auch einen Wunschtermin vereinbaren.",
  },
  {
    question: "Kann ich ein Gerät zurückgeben?",
    answer: "Ja, Sie haben ein 30-tägiges Rückgaberecht. Die Rücksendung ist kostenlos. Kontaktieren Sie uns einfach per E-Mail oder Telefon und wir organisieren den Rückversand für Sie.",
  },
  {
    question: "Welche Garantie bieten Sie?",
    answer: "Wir bieten eine erweiterte Garantie von bis zu 5 Jahren auf alle Geräte. Zusätzlich haben Sie die gesetzliche Gewährleistung. Bei Defekten übernehmen wir die Reparatur oder den Ersatz kostenfrei.",
  },
  {
    question: "Kann ich eine Beratung vor dem Kauf erhalten?",
    answer: "Selbstverständlich! Unsere Experten beraten Sie gerne telefonisch, per E-Mail oder über unser Kontaktformular. Wir helfen Ihnen, das perfekte Gerät für Ihre Bedürfnisse zu finden.",
  },
  {
    question: "Bieten Sie einen Anschlussservice an?",
    answer: "Ja, bei vielen Geräten bieten wir einen kostenlosen Anschlussservice an. Bei der Bestellung können Sie angeben, ob Sie eine fachgerechte Installation wünschen.",
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
