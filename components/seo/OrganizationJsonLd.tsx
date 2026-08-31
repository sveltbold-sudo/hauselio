import { SITE_URL } from "@/lib/constants";

interface OrganizationJsonLdProps {
  name?: string;
  url?: string;
  logo?: string;
  description?: string;
}

export default function OrganizationJsonLd({
  name = "HAUSAURA GmbH",
  url = SITE_URL,
  logo = `${SITE_URL}/logos/logoprincipale.png`,
  description = "Premium Haushaltsgeräte online kaufen. Miele, Bosch, Siemens, Dyson und weitere Top-Marken.",
}: OrganizationJsonLdProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name,
    url,
    logo,
    description,
    email: "info@hausaura.de",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Kastanienallee 42",
      addressLocality: "Berlin",
      postalCode: "10435",
      addressCountry: "DE",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+49-30-555-78901",
      contactType: "customer service",
      availableLanguage: "German",
    },
    sameAs: [
      "https://www.instagram.com/hausaura",
      "https://www.facebook.com/hausaura",
      "https://www.linkedin.com/company/hausaura",
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
