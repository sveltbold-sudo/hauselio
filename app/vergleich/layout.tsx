import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Produktvergleich",
  description: "Vergleichen Sie Produkte Seite an Seite — Preise, Spezifikationen und Bewertungen bei HAUSELIO.",
  alternates: { canonical: "/vergleich" },
  openGraph: {
    title: "Produktvergleich — HAUSELIO",
    description: "Vergleichen Sie Produkte Seite an Seite — Preise, Spezifikationen und Bewertungen.",
    url: "https://hauselio.vercel.app/vergleich",
    siteName: "HAUSELIO",
    locale: "de_DE",
    type: "website",
  },
};

export default function VergleichLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
