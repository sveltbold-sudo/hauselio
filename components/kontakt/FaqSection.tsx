"use client";

import { useState, useId } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

const faqItems = [
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

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const panelId = useId();

  return (
    <div className="border border-[var(--color-border-light)] rounded-xl overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-[var(--color-bg-secondary)] transition-colors"
        aria-expanded={isOpen}
        aria-controls={panelId}
      >
        <span className="font-semibold text-sm text-[var(--color-text-primary)] pr-4">
          {question}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-[var(--color-text-muted)] shrink-0 transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
          aria-hidden="true"
        />
      </button>
      {isOpen && (
        <div id={panelId} className="px-5 pb-4">
          <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
            {answer}
          </p>
        </div>
      )}
    </div>
  );
}

export default function FaqSection() {
  return (
    <section id="faq" className="section-py bg-[var(--color-bg-secondary)]">
      <div className="container-hauselio">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-3">
            <HelpCircle className="w-5 h-5 text-[var(--color-primary)]" />
            <p className="caption text-[var(--color-primary)]">Häufige Fragen</p>
          </div>
          <h2 className="heading-2">FAQ — Ihre Fragen, unsere Antworten</h2>
        </div>

        <div className="max-w-3xl mx-auto space-y-3">
          {faqItems.map((item, i) => (
            <FaqItem key={i} question={item.question} answer={item.answer} />
          ))}
        </div>
      </div>
    </section>
  );
}
