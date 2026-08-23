import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bestellung | HAUSELIO",
  description: "Schließen Sie Ihre Bestellung bei HAUSELIO ab.",
  robots: { index: false, follow: false },
  openGraph: {
    title: "Bestellung | HAUSELIO",
    description: "Schließen Sie Ihre Bestellung bei HAUSELIO ab.",
    url: "https://hauselio.vercel.app/bestellung",
    siteName: "HAUSELIO",
    locale: "de_DE",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bestellung | HAUSELIO",
    description: "Schließen Sie Ihre Bestellung bei HAUSELIO ab.",
  },
  alternates: { canonical: "https://hauselio.vercel.app/bestellung" },
};

export default function BestellungLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
