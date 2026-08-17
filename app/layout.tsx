import type { Metadata } from "next";
import { Inter } from "next/font/google";
import dynamic from "next/dynamic";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { ToastProvider } from "@/components/ui/Toast";
import OrganizationJsonLd from "@/components/seo/OrganizationJsonLd";
import WebSiteJsonLd from "@/components/seo/WebSiteJsonLd";
import CookieConsent from "@/components/ui/CookieConsent";
import AnalyticsGate from "@/components/analytics/AnalyticsGate";
import { SITE_URL } from "@/lib/constants";
import "./globals.css";

const NewsletterToast = dynamic(() => import("@/components/ui/NewsletterToast"), { ssr: false });

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
          <NewsletterToast />
          <main id="main-content" className="flex-1">
            {children}
          </main>
        </ToastProvider>
        <Footer />
        <CookieConsent />
        <AnalyticsGate />
      </body>
    </html>
  );
}
