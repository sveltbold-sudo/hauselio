import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "E-Mail verifizieren",
  description: "Verifizieren Sie Ihre E-Mail-Adresse für Ihr HAUSAURA-Konto.",
  robots: { index: false },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
