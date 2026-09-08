import type { Metadata } from "next";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Produkte vergleichen",
  description: "Vergleichen Sie Produkte Seiten an Seite — Preise, Bewertungen und Funktionen im direkten Vergleich.",
  robots: { index: false },
  alternates: { canonical: `${SITE_URL}/vergleich` },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
