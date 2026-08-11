interface ProductJsonLdProps {
  name: string;
  description: string;
  image: string;
  price: number;
  currency?: string;
  brand: string;
  sku: string;
  rating?: number;
  reviewCount?: number;
  availability?: "InStock" | "OutOfStock";
  url?: string;
}

export default function ProductJsonLd({
  name,
  description,
  image,
  price,
  currency = "EUR",
  brand,
  sku,
  rating,
  reviewCount,
  availability = "InStock",
  url,
}: ProductJsonLdProps) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://hauselio.de";
  const productUrl = url || `${baseUrl}/produkt/${sku.toLowerCase()}`;

  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description,
    image,
    sku,
    brand: {
      "@type": "Brand",
      name: brand,
    },
    offers: {
      "@type": "Offer",
      url: productUrl,
      priceCurrency: currency,
      price: price.toFixed(2),
      availability: `https://schema.org/${availability}`,
      itemCondition: "https://schema.org/NewCondition",
      seller: {
        "@type": "Organization",
        name: "HAUSELIO GmbH",
      },
    },
  };

  if (rating && reviewCount) {
    jsonLd.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: rating.toFixed(1),
      reviewCount: reviewCount.toString(),
      bestRating: "5",
      worstRating: "1",
    };
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
