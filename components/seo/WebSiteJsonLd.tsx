import { SITE_URL } from "@/lib/constants";

interface WebSiteJsonLdProps {
  name?: string;
  url?: string;
  searchUrl?: string;
}

export default function WebSiteJsonLd({
  name = "HAUSAURA",
  url = SITE_URL,
  searchUrl = `${SITE_URL}/shop?q={search_term_string}`,
}: WebSiteJsonLdProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name,
    url,
    potentialAction: {
      "@type": "SearchAction",
      target: searchUrl,
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
