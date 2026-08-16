interface BreadcrumbItem {
  name: string;
  url: string;
}

export default function BreadcrumbJsonLd({ items }: { items: BreadcrumbItem[] }) {
  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://hauselio.de";
  
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.url}`,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
