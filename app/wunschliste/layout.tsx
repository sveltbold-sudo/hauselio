import type { Metadata } from "next";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Meine Wunschliste",
  description: "Ihre gespeicherten Produkte bei HAUSAURA. Merken Sie sich Ihre Lieblingsartikel für später.",
  robots: { index: false },
  alternates: { canonical: "/wunschliste" },
  openGraph: {
    title: "Meine Wunschliste",
    description: "Ihre gespeicherten Produkte bei HAUSAURA.",
    url: `${SITE_URL}/wunschliste`,
    siteName: "HAUSAURA",
    locale: "de_DE",
    type: "website",
    images: [{ url: `${SITE_URL}/logos/logoprincipale.png`, width: 1200, height: 630 }],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
