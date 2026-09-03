import { SITE_URL } from "@/lib/constants";

interface Review {
  author: string;
  rating: number;
  title?: string;
  content?: string;
  date: string;
}

interface ProductJsonLdProps {
  name: string;
  description: string;
  image: string;
  price: number;
  currency?: string;
  brand: string;
  slug: string;
  sku?: string;
  gtin?: string;
  rating?: number;
  reviewCount?: number;
  reviews?: Review[];
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
  slug,
  sku,
  gtin,
  rating,
  reviewCount,
  reviews = [],
  availability = "InStock",
  url,
}: ProductJsonLdProps) {
  const productUrl = url || `${SITE_URL}/produkt/${slug}`;
  const absoluteImage = image.startsWith("http") ? image : `${SITE_URL}${image}`;

  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description,
    image: absoluteImage,
    sku,
    brand: {
      "@type": "Brand",
      name: brand,
    },
    ...(gtin ? { gtin } : {}),
    offers: {
      "@type": "Offer",
      url: productUrl,
      priceCurrency: currency,
      price: price.toFixed(2),
      availability: `https://schema.org/${availability}`,
      itemCondition: "https://schema.org/NewCondition",
      seller: {
        "@type": "Organization",
        name: "HAUSAURA GmbH",
      },
      shippingDetails: {
        "@type": "OfferShippingDetails",
        shippingRate: {
          "@type": "MonetaryAmount",
          value: "0",
          currency: "EUR",
        },
        shippingDestination: {
          "@type": "DefinedRegion",
          addressCountry: ["DE", "AT", "CH"],
        },
        deliveryTime: {
          "@type": "ShippingDeliveryTime",
          handlingTime: {
            "@type": "QuantitativeValue",
            minValue: 1,
            maxValue: 2,
            unitCode: "DAY",
          },
          transitTime: {
            "@type": "QuantitativeValue",
            minValue: 2,
            maxValue: 5,
            unitCode: "DAY",
          },
        },
      },
      hasMerchantReturnPolicy: {
        "@type": "MerchantReturnPolicy",
        applicableCountry: "DE",
        returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
        merchantReturnDays: 30,
        returnMethod: "https://schema.org/ReturnByMail",
        returnFees: "https://schema.org/FreeReturn",
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

  if (reviews.length > 0) {
    jsonLd.review = reviews.map((r) => ({
      "@type": "Review",
      author: {
        "@type": "Person",
        name: r.author,
      },
      datePublished: r.date,
      reviewRating: {
        "@type": "Rating",
        ratingValue: r.rating,
        bestRating: 5,
        worstRating: 1,
      },
      ...(r.title ? { name: r.title } : {}),
      ...(r.content ? { reviewBody: r.content } : {}),
    }));
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
