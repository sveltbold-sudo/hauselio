import { SITE_URL, SHIPPING_COST, SHIPPING_BASE_RATES } from "@/lib/constants";

interface Review {
  author: string;
  rating: number;
  title?: string;
  content?: string;
  date: string;
}

interface Spec {
  key: string;
  value: string;
}

interface ProductJsonLdProps {
  name: string;
  description: string;
  image: string;
  price: number;
  currency?: string;
  brand: string;
  slug: string;
  category?: string;
  sku?: string;
  gtin?: string;
  rating?: number;
  reviewCount?: number;
  reviews?: Review[];
  specs?: Spec[];
  availability?: "InStock" | "OutOfStock" | "PreOrder";
  url?: string;
  sellerName?: string;
  shippingRate?: number;
  shippingCurrency?: string;
}

export default function ProductJsonLd({
  name,
  description,
  image,
  price,
  currency = "EUR",
  brand,
  slug,
  category,
  sku,
  gtin,
  rating,
  reviewCount,
  reviews = [],
  specs = [],
  availability = "InStock",
  url,
  sellerName = "HAUSAURA GmbH",
  shippingRate = SHIPPING_COST,
  shippingCurrency = "EUR",
}: ProductJsonLdProps) {
  const productUrl = url || `${SITE_URL}/produkt/${slug}`;
  const absoluteImage = image.startsWith("http") ? image : `${SITE_URL}${image}`;

  // Google expects a typed GTIN (gtin8/12/13/14), not the generic `gtin`.
  const gtinKey = !gtin
    ? null
    : gtin.length === 8
      ? "gtin8"
      : gtin.length === 12
        ? "gtin12"
        : gtin.length === 13
          ? "gtin13"
          : gtin.length === 14
            ? "gtin14"
            : "gtin";

  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description,
    image: absoluteImage,
    ...(sku ? { sku } : {}),
    ...(brand ? { brand: { "@type": "Brand", name: brand } } : {}),
    ...(gtin && gtinKey ? { [gtinKey]: gtin } : {}),
    ...(category ? { category } : {}),
    offers: {
      "@type": "Offer",
      url: productUrl,
      priceCurrency: currency,
      price: price.toFixed(2),
      availability: `https://schema.org/${availability}`,
      itemCondition: "https://schema.org/NewCondition",
      seller: {
        "@type": "Organization",
        name: sellerName,
      },
      shippingDetails: (["DE", "AT", "CH"] as const).map((country) => ({
        "@type": "OfferShippingDetails",
        shippingRate: {
          "@type": "MonetaryAmount",
          value: (SHIPPING_BASE_RATES[country] ?? shippingRate).toFixed(2),
          currency: shippingCurrency,
        },
        shippingDestination: {
          "@type": "DefinedRegion",
          addressCountry: country,
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
      })),
      hasMerchantReturnPolicy: {
        "@type": "MerchantReturnPolicy",
        applicableCountry: ["DE", "AT", "CH"],
        returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
        merchantReturnDays: 30,
        returnMethod: "https://schema.org/ReturnByMail",
        // The 30-day return window is a voluntary extra. Return shipping is
        // paid by the customer, so this must not be advertised as FreeReturn.
        returnFees: "https://schema.org/ReturnShippingFees",
        returnShippingFees: {
          "@type": "MonetaryAmount",
          value: SHIPPING_COST.toFixed(2),
          currency: "EUR",
        },
        merchantReturnLink: `${SITE_URL}/widerruf`,
      },
    },
  };

  if (specs.length > 0) {
    jsonLd.additionalProperty = specs.map((s) => ({
      "@type": "PropertyValue",
      name: s.key,
      value: s.value,
    }));
  }

  if (rating != null && rating > 0 && reviewCount) {
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
