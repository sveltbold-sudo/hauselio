import type { Metadata } from "next";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Produktvergleich",
  description: "Vergleichen Sie Produkte Seite an Seite — Preise, Spezifikationen und Bewertungen bei HAUSELIO.",
  alternates: { canonical: "/vergleich" },
  robots: { index: false, follow: true },
  openGraph: {
    title: "Produktvergleich — HAUSELIO",
    description: "Vergleichen Sie Produkte Seite an Seite — Preise, Spezifikationen und Bewertungen.",
    url: `${SITE_URL}/vergleich`,
    siteName: "HAUSELIO",
    locale: "de_DE",
    type: "website",
  },
};

export default function VergleichLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
