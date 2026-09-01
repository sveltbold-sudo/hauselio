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
    <nav className="flex items-center gap-1.5 text-xs text-[var(--color-text-muted)] mb-6 overflow-hidden min-w-0" aria-label="Breadcrumb">
      <Link href="/" className="hover:text-[var(--color-primary)] transition-colors shrink-0">Startseite</Link>
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1.5">
          <span>/</span>
          {item.href ? (
            <Link href={item.href} className="hover:text-[var(--color-primary)] transition-colors truncate">
              {item.label}
            </Link>
          ) : (
            <span className="text-[var(--color-text-primary)] font-medium truncate" aria-current="page">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
