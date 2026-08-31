import type { Metadata } from "next";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Mein Konto",
  description: "Verwalten Sie Ihre Bestellungen, Adressen und Kontodaten bei HAUSAURA.",
  alternates: { canonical: `${SITE_URL}/konto` },
  robots: { index: false, follow: true },
  openGraph: {
    title: "Mein Konto | HAUSAURA",
    description: "Verwalten Sie Ihre Bestellungen, Adressen und Kontodaten bei HAUSAURA.",
    url: `${SITE_URL}/konto`,
    siteName: "HAUSAURA",
    locale: "de_DE",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mein Konto | HAUSAURA",
    description: "Verwalten Sie Ihre Bestellungen, Adressen und Kontodaten bei HAUSAURA.",
  },
};

export default function KontoLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
