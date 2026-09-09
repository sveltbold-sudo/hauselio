import type { Metadata } from "next";
import { SITE_URL, SITE_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Bestellung erfolgreich",
  description: "Vielen Dank für Ihre Bestellung bei HAUSAURA. Alle Details zu Ihrer Bestellung.",
  robots: { index: false },
  alternates: { canonical: `${SITE_URL}/bestellung/erfolg` },
  openGraph: {
    title: "Bestellung erfolgreich | HAUSAURA",
    description: "Vielen Dank für Ihre Bestellung bei HAUSAURA.",
    url: `${SITE_URL}/bestellung/erfolg`,
    siteName: SITE_NAME,
    locale: "de_DE",
    type: "website",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
