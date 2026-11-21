import { ChevronDown } from "lucide-react";
import type { CategoryFaq } from "@/lib/category-content";

export default function CategoryFaq({ faqs }: { faqs: CategoryFaq[] }) {
  if (faqs.length === 0) return null;

  return (
    <section className="mt-12 sm:mt-16 border-t border-[var(--color-border-light)] pt-8 sm:pt-12">
      <h2 className="heading-2 mb-6">Häufige Fragen</h2>
      <div className="divide-y divide-[var(--color-border-light)] rounded-xl border border-[var(--color-border-light)]">
        {faqs.map((faq) => (
          <details key={faq.question} className="group">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-4 py-4 text-left font-semibold text-[var(--color-text-primary)] marker:content-none sm:px-5">
              <span>{faq.question}</span>
              <ChevronDown
                className="h-4 w-4 shrink-0 text-[var(--color-text-muted)] transition-transform duration-200 group-open:rotate-180"
                aria-hidden="true"
              />
            </summary>
            <p className="px-4 pb-4 text-sm leading-relaxed text-[var(--color-text-secondary)] sm:px-5">
              {faq.answer}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}
