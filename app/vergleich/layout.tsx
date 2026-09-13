import type { Metadata } from "next";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Produkte vergleichen",
  description: "Vergleichen Sie Produkte Seiten an Seite \u2014 Preise, Bewertungen und Funktionen im direkten Vergleich.",
  robots: { index: false, follow: false },
  alternates: { canonical: `${SITE_URL}/vergleich` },
  openGraph: {
    title: "Produkte vergleichen | HAUSAURA",
    description: "Vergleichen Sie Produkte Seiten an Seite \u2014 Preise, Bewertungen und Funktionen im direkten Vergleich.",
    url: `${SITE_URL}/vergleich`,
    siteName: "HAUSAURA",
    locale: "de_DE",
    type: "website",
    images: [{ url: `${SITE_URL}/logos/logoprincipale.png`, width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Produkte vergleichen | HAUSAURA",
    description: "Vergleichen Sie Produkte Seiten an Seite \u2014 Preise, Bewertungen und Funktionen im direkten Vergleich.",
    images: [`${SITE_URL}/logos/logoprincipale.png`],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}