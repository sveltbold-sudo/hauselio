import type { Metadata } from "next";
import { SITE_URL, SITE_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Mein Konto",
  description: "Verwalten Sie Ihr HAUSAURA-Konto. Bestellungen ansehen, Profil bearbeiten und Einstellungen vornehmen.",
  robots: { index: false },
  alternates: { canonical: `${SITE_URL}/konto` },
  openGraph: {
    title: `Mein Konto | ${SITE_NAME}`,
    description: "Verwalten Sie Ihr HAUSAURA-Konto. Bestellungen ansehen, Profil bearbeiten und Einstellungen vornehmen.",
    url: `${SITE_URL}/konto`,
    siteName: SITE_NAME,
    locale: "de_DE",
    type: "website",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
