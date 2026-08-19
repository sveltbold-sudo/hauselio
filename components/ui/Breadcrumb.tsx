import Link from "next/link";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="flex items-center gap-1.5 text-xs text-[var(--color-text-muted)] mb-6" aria-label="Breadcrumb">
      <Link href="/" className="hover:text-[var(--color-primary)] transition-colors">Startseite</Link>
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1.5">
          <span>/</span>
          {item.href ? (
            <Link href={item.href} className="hover:text-[var(--color-primary)] transition-colors">
              {item.label}
            </Link>
          ) : (
            <span className="text-[var(--color-text-primary)] font-medium">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
