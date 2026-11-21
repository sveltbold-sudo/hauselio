import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";
import { AI_CRAWLERS } from "@/lib/seo";

const PRIVATE_PATHS = [
  "/admin",
  "/api",
  "/warenkorb",
  "/bestellung",
  "/konto",
  "/vergleich",
  "/wunschliste",
  "/email-verifizieren",
  "/passwort-zuruecksetzen",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/api/google-feed"],
        disallow: PRIVATE_PATHS,
      },
      {
        // AI assistants and answer engines: allowed so product data can be
        // quoted in AI answers. The private paths stay excluded.
        userAgent: AI_CRAWLERS,
        allow: ["/", "/api/google-feed"],
        disallow: PRIVATE_PATHS,
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
