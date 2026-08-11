const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://hauselio.de";

interface OrganizationJsonLdProps {
  name?: string;
  url?: string;
  logo?: string;
  description?: string;
}

export default function OrganizationJsonLd({
  name = "HAUSELIO GmbH",
  url = SITE_URL,
  logo = `${SITE_URL}/images/logo.svg`,
  description = "Premium Haushaltsgeräte online kaufen. Miele, Bosch, Siemens, Dyson und weitere Top-Marken.",
}: OrganizationJsonLdProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name,
    url,
    logo,
    description,
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
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
