import { prisma } from "@/lib/prisma";
import { SITE_URL } from "@/lib/constants";

const fallback = {
  companyName: "HAUSAURA GmbH",
  companyAddress: "Kastanienallee 42, 10435 Berlin",
  contactPhone: "+4915259140453",
  contactEmail: "info@hausaura.de",
};

async function getSettings() {
  try {
    const s = await prisma.siteSettings.findFirst();
    if (!s) return fallback;
    return {
      companyName: s.companyName || fallback.companyName,
      companyAddress: s.companyAddress || fallback.companyAddress,
      contactPhone: s.contactPhone || fallback.contactPhone,
      contactEmail: s.contactEmail || fallback.contactEmail,
    };
  } catch {
    return fallback;
  }
}

export default async function LocalBusinessJsonLd() {
  const s = await getSettings();
  const addrParts = s.companyAddress.split(",").map((p) => p.trim());
  const street = addrParts[0] || "Kastanienallee 42";
  const postalCode = (addrParts[1] || "10435 Berlin").split(" ")[0] || "10435";
  const city = (addrParts[1] || "10435 Berlin").split(" ").slice(1).join(" ") || "Berlin";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: s.companyName,
    url: SITE_URL,
    logo: `${SITE_URL}/logos/logoprincipale.png`,
    image: `${SITE_URL}/logos/logoprincipale.png`,
    description: "Premium Haushaltsgeräte online kaufen — Miele, Bosch, Siemens, Dyson und weitere Top-Marken mit kostenlosem Versand ab 50€.",
    email: s.contactEmail,
    telephone: s.contactPhone,
    address: {
      "@type": "PostalAddress",
      streetAddress: street,
      addressLocality: city,
      postalCode: postalCode,
      addressCountry: "DE",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 52.5461,
      longitude: 13.4047,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "09:00",
        closes: "18:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Saturday",
        opens: "10:00",
        closes: "14:00",
      },
    ],
    priceRange: "€€",
    paymentAccepted: "Banküberweisung, Vorkasse",
    currenciesAccepted: "EUR",
    areaServed: [
      { "@type": "Country", name: "Deutschland" },
      { "@type": "Country", name: "Österreich" },
      { "@type": "Country", name: "Schweiz" },
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "HAUSAURA Haushaltsgeräte",
      itemListElement: [
        {
          "@type": "OfferCatalog",
          name: "Küchengeräte",
          itemListElement: [
            { "@type": "Offer", itemOffered: { "@type": "Product", name: "Backöfen" } },
            { "@type": "Offer", itemOffered: { "@type": "Product", name: "Kühlschränke" } },
            { "@type": "Offer", itemOffered: { "@type": "Product", name: "Geschirrspüler" } },
          ],
        },
        {
          "@type": "OfferCatalog",
          name: "Kaffeevollautomaten",
          itemListElement: [
            { "@type": "Offer", itemOffered: { "@type": "Product", name: "Kaffeevollautomaten" } },
          ],
        },
        {
          "@type": "OfferCatalog",
          name: "Staubsauger",
          itemListElement: [
            { "@type": "Offer", itemOffered: { "@type": "Product", name: "Staubsauger" } },
          ],
        },
      ],
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
