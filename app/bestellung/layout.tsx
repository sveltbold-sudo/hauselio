import type { Metadata } from "next";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Bestellung",
  description: "Schließen Sie Ihre Bestellung bei HAUSAURA ab.",
  robots: { index: false, follow: false },
  openGraph: {
    title: "Bestellung",
    description: "Schließen Sie Ihre Bestellung bei HAUSAURA ab.",
    url: `${SITE_URL}/bestellung`,
    siteName: "HAUSAURA",
    locale: "de_DE",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bestellung",
    description: "Schließen Sie Ihre Bestellung bei HAUSAURA ab.",
  },
  alternates: { canonical: `${SITE_URL}/bestellung` },
};

export default function BestellungLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
