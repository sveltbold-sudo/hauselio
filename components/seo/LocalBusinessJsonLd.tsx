import { prisma } from "@/lib/prisma";
import { SITE_URL } from "@/lib/constants";

const fallback = {
  companyName: "HAUSAURA GmbH",
  companyAddress: "",
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
  const addrParts = s.companyAddress.split(",").map((p) => p.trim()).filter(Boolean);
  const street = addrParts[0] || "";
  const zipCity = addrParts[1] || "";
  const postalCode = zipCity.split(" ")[0] || "";
  const city = zipCity.split(" ").slice(1).join(" ") || "";

  // A LocalBusiness entry without a real address is invalid structured data.
  if (!street) return null;

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
    ...(street
      ? {
          address: {
            "@type": "PostalAddress",
            streetAddress: street,
            addressLocality: city,
            postalCode: postalCode,
            addressCountry: "DE",
          },
        }
      : {}),
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
