import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ClientShell from "@/components/layout/ClientShell";
import LazyComparisonBar from "@/components/ui/LazyComparisonBar";
import { ToastProvider } from "@/components/ui/Toast";
import OrganizationJsonLd from "@/components/seo/OrganizationJsonLd";
import WebSiteJsonLd from "@/components/seo/WebSiteJsonLd";
import ClientProviders from "@/components/ui/ClientProviders";
import GtmNoscript from "@/components/analytics/GtmNoscript";
import { SITE_URL } from "@/lib/constants";
import AdminShellHide from "@/components/admin/AdminShellHide";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "HAUSAURA — Moderne Haushaltsgeräte für Ihr Zuhause",
    template: "%s | HAUSAURA",
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
    canonical: SITE_URL,
    languages: {
      "de": SITE_URL,
      "de-DE": SITE_URL,
    },
  },
  openGraph: {
    title: "HAUSAURA — Moderne Haushaltsgeräte für Ihr Zuhause",
    description:
      "Hochwertige Küchengeräte, Kaffeevollautomaten und Smart Home Lösungen.",
    url: SITE_URL,
    siteName: "HAUSAURA",
    locale: "de_DE",
    type: "website",
    images: [{ url: `${SITE_URL}/logos/logoprincipale.png`, width: 1200, height: 630, alt: "HAUSAURA — Premium Haushaltsgeräte" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "HAUSAURA — Moderne Haushaltsgeräte für Ihr Zuhause",
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

export const viewport: Viewport = {
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" className={`${inter.variable} h-full`} suppressHydrationWarning>
      <head>
        <meta name="color-scheme" content="light" />
        <meta name="theme-color" content="#FAFAF8" />
        <link rel="sitemap" href="/sitemap.xml" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="preconnect" href="https://res.cloudinary.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-full flex flex-col bg-[var(--color-bg)] font-sans antialiased text-[var(--color-text-primary)]">
        <GtmNoscript />
        <OrganizationJsonLd />
        <WebSiteJsonLd />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:bg-[var(--color-primary)] focus:text-white focus:px-4 focus:py-2 focus:rounded-lg focus:shadow-lg focus:outline-none"
        >
          Direkt zum Inhalt
        </a>
        <ToastProvider>
          <AdminShellHide>
            {children}
          </AdminShellHide>
          <ClientProviders />
        </ToastProvider>
        <ClientShell />
        <LazyComparisonBar />
      </body>
    </html>
  );
}
