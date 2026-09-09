interface RatgeberArticleContentProps {
  content: string;
}

export default function RatgeberArticleContent({ content }: RatgeberArticleContentProps) {
  return (
    <div
      className="prose prose-sm sm:prose-base lg:prose-lg max-w-none
        prose-headings:font-bold prose-headings:text-[var(--color-text-primary)]
        prose-h2:text-xl prose-h2:sm:text-2xl prose-h2:mt-10 prose-h2:mb-4
        prose-h3:text-lg prose-h3:sm:text-xl prose-h3:mt-8 prose-h3:mb-3
        prose-p:text-[var(--color-text-secondary)] prose-p:leading-relaxed
        prose-li:text-[var(--color-text-secondary)]
        prose-strong:text-[var(--color-text-primary)] prose-strong:font-semibold
        prose-a:text-[var(--color-primary)] prose-a:no-underline hover:prose-a:underline
        prose-blockquote:border-l-[var(--color-primary)] prose-blockquote:text-[var(--color-text-secondary)]
        prose-ul:my-4 prose-ol:my-4
        prose-li:my-1"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}
