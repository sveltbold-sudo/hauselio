import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Warenkorb | HAUSELIO",
  description: "Überprüfen Sie Ihre Bestellung im HAUSELIO Warenkorb.",
  robots: { index: false, follow: false },
  openGraph: {
    title: "Warenkorb | HAUSELIO",
    description: "Überprüfen Sie Ihre Bestellung im HAUSELIO Warenkorb.",
    url: "https://hauselio.vercel.app/warenkorb",
    siteName: "HAUSELIO",
    locale: "de_DE",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Warenkorb | HAUSELIO",
    description: "Überprüfen Sie Ihre Bestellung im HAUSELIO Warenkorb.",
  },
  alternates: { canonical: "https://hauselio.vercel.app/warenkorb" },
};

export default function WarenkorbLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
