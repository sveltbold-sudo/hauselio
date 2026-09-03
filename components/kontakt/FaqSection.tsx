"use client";

import { useState, useId, useCallback, useRef } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";
import { faqItems } from "@/lib/faq";

function FaqItem({ question, answer, index, onkeydown }: { question: string; answer: string; index: number; onkeydown: (e: React.KeyboardEvent, index: number) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const panelId = useId();
  const buttonId = useId();
  const buttonRef = useRef<HTMLButtonElement>(null);

  return (
    <div className="border border-[var(--color-border-light)] rounded-xl overflow-hidden">
      <button
        ref={buttonRef}
        id={buttonId}
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={(e) => onkeydown(e, index)}
        className="w-full flex items-center justify-between px-4 py-3.5 sm:px-5 sm:py-4 text-left hover:bg-[var(--color-bg-secondary)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-inset"
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
        <div id={panelId} role="region" aria-labelledby={buttonId} className="px-4 pb-3 sm:px-5 sm:pb-4">
          <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
            {answer}
          </p>
        </div>
      )}
    </div>
  );
}

export default function FaqSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = useCallback((e: React.KeyboardEvent, index: number) => {
    const items = containerRef.current?.querySelectorAll('[aria-controls]');
    if (!items) return;

    let nextIndex = index;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        nextIndex = (index + 1) % items.length;
        break;
      case "ArrowUp":
        e.preventDefault();
        nextIndex = (index - 1 + items.length) % items.length;
        break;
      case "Home":
        e.preventDefault();
        nextIndex = 0;
        break;
      case "End":
        e.preventDefault();
        nextIndex = items.length - 1;
        break;
      default:
        return;
    }

    (items[nextIndex] as HTMLElement).focus();
  }, []);

  return (
    <section id="faq" className="section-py bg-[var(--color-bg-secondary)]">
      <div className="container-hausaura">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-3">
            <HelpCircle className="w-5 h-5 text-[var(--color-primary)]" />
            <p className="caption text-[var(--color-primary)]">Häufige Fragen</p>
          </div>
          <h2 className="heading-2">FAQ — Ihre Fragen, unsere Antworten</h2>
        </div>

        <div ref={containerRef} className="max-w-3xl mx-auto space-y-3" role="group" aria-label="Häufige Fragen">
          {faqItems.map((item, i) => (
            <FaqItem key={i} question={item.question} answer={item.answer} index={i} onkeydown={handleKeyDown} />
          ))}
        </div>
      </div>
    </section>
  );
}
