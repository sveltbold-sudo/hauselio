import type { ReactNode } from "react";

/**
 * Minimal renderer for the editorial category copy. Supports `## ` headings,
 * `- ` lists, blank-line paragraphs and **bold** inline text. Keeping it
 * tiny avoids pulling a full Markdown parser into the category bundle.
 */

function renderInline(text: string): ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={index}>{part.slice(2, -2)}</strong>;
    }
    return <span key={index}>{part}</span>;
  });
}

export default function CategoryContent({ text }: { text: string }) {
  const blocks = text
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean);

  return (
    <div className="max-w-none text-[var(--color-text-secondary)] leading-relaxed">
      {blocks.map((block, index) => {
        if (block.startsWith("## ")) {
          return (
            <h2 key={index} className="heading-2 mt-8 mb-4 first:mt-0 text-[var(--color-text-primary)]">
              {block.slice(3)}
            </h2>
          );
        }
        if (block.startsWith("### ")) {
          return (
            <h3 key={index} className="heading-3 mt-6 mb-3 text-[var(--color-text-primary)]">
              {block.slice(4)}
            </h3>
          );
        }
        if (block.startsWith("- ")) {
          const items = block
            .split("\n")
            .map((line) => line.replace(/^-\s+/, "").trim())
            .filter(Boolean);
          return (
            <ul key={index} className="my-4 space-y-2 list-disc pl-5">
              {items.map((item, itemIndex) => (
                <li key={itemIndex}>{renderInline(item)}</li>
              ))}
            </ul>
          );
        }
        return (
          <p key={index} className="my-4">
            {renderInline(block.replace(/\n/g, " "))}
          </p>
        );
      })}
    </div>
  );
}
