import { SITE_URL } from "@/lib/constants";
import { prisma } from "@/lib/prisma";

const fallback = {
  companyName: "HAUSAURA GmbH",
  companyAddress: "",
  contactPhone: "+4915259140453",
  contactEmail: "info@hausaura.de",
  vatId: "",
};

/** Public profiles of the shop (used for schema.org sameAs). */
const SOCIAL_PROFILES = ["https://www.instagram.com/HAUSAURA"];

async function getSettings() {
  try {
    const s = await prisma.siteSettings.findFirst();
    if (!s) return fallback;
    return {
      companyName: s.companyName || fallback.companyName,
      companyAddress: s.companyAddress || fallback.companyAddress,
      contactPhone: s.contactPhone || fallback.contactPhone,
      contactEmail: s.contactEmail || fallback.contactEmail,
      vatId: s.vatId || fallback.vatId,
    };
  } catch {
    return fallback;
  }
}

export default async function OrganizationJsonLd() {
  const s = await getSettings();
  const addrParts = s.companyAddress.split(",").map((p) => p.trim()).filter(Boolean);
  const street = addrParts[0] || "";
  const zipCity = addrParts[1] || "";
  const postalCode = zipCity.split(" ")[0] || "";
  const city = zipCity.split(" ").slice(1).join(" ") || "";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: s.companyName,
    url: SITE_URL,
    logo: {
      "@type": "ImageObject",
      url: `${SITE_URL}/logos/logoprincipale.png`,
      width: 1478,
      height: 323,
    },
    image: `${SITE_URL}/og/hausaura-og.png`,
    description:
      "Premium Haushaltsgeräte online kaufen. Miele, Bosch, Siemens, Dyson und weitere Top-Marken.",
    email: s.contactEmail,
    foundingDate: "2024",
    ...(s.vatId ? { vatID: s.vatId } : {}),
    sameAs: SOCIAL_PROFILES,
    areaServed: [
      { "@type": "Country", name: "Deutschland" },
      { "@type": "Country", name: "Österreich" },
      { "@type": "Country", name: "Schweiz" },
    ],
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
    contactPoint: {
      "@type": "ContactPoint",
      telephone: s.contactPhone,
      contactType: "customer service",
      availableLanguage: "German",
      areaServed: "DE",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
