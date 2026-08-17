import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { ToastProvider } from "@/components/ui/Toast";
import OrganizationJsonLd from "@/components/seo/OrganizationJsonLd";
import WebSiteJsonLd from "@/components/seo/WebSiteJsonLd";
import CookieConsent from "@/components/ui/CookieConsent";
import ClientProviders from "@/components/ui/ClientProviders";
import { SITE_URL } from "@/lib/constants";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "HAUSELIO — Moderne Haushaltsgeräte für Ihr Zuhause",
    template: "%s | HAUSELIO",
  },
  description:
    "Entdecken Sie hochwertige Küchengeräte, Kaffeevollautomaten, Staubsauger und Smart Home Lösungen. Moderne Haushaltsgeräte für ein komfortables Zuhause.",
  keywords: [
    "Haushaltsgeräte kaufen",
    "Küchengeräte online",
    "Thermomix kaufen",
    "Kaffeemaschine",
    "Staubsauger",
    "Smart Home",
  ],
  alternates: {
    languages: {
      "de": SITE_URL,
    },
  },
  openGraph: {
    title: "HAUSELIO — Moderne Haushaltsgeräte für Ihr Zuhause",
    description:
      "Hochwertige Küchengeräte, Kaffeevollautomaten und Smart Home Lösungen.",
    url: SITE_URL,
    siteName: "HAUSELIO",
    locale: "de_DE",
    type: "website",
    images: [{ url: `${SITE_URL}/logos/logoprincipale.png`, width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "HAUSELIO — Moderne Haushaltsgeräte für Ihr Zuhause",
    description:
      "Hochwertige Küchengeräte, Kaffeevollautomaten und Smart Home Lösungen.",
    images: [`${SITE_URL}/logos/logoprincipale.png`],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
    other: [
      { url: "/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/android-chrome-512x512.png", sizes: "512x512", type: "image/png" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" className={`${inter.variable} h-full`}>
      <head>
        <link rel="preconnect" href="https://res.cloudinary.com" />
        <link rel="preconnect" href="https://GEXPVTXH78-dsn.algolia.net" />
      </head>
      <body className="min-h-full flex flex-col bg-[var(--color-bg)] font-sans antialiased text-[var(--color-text-primary)]">
        <OrganizationJsonLd />
        <WebSiteJsonLd />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:z-[100] focus:p-4 focus:bg-[var(--color-primary)] focus:text-white focus:font-semibold focus:shadow-lg"
        >
          Direkt zum Inhalt
        </a>
        <Header />
        <ToastProvider>
          <main id="main-content" className="flex-1">
            {children}
          </main>
          <ClientProviders />
        </ToastProvider>
        <Footer />
        <CookieConsent />
      </body>
    </html>
  );
}
