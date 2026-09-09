import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import { Inter } from "next/font/google";
import ClientShell from "@/components/layout/ClientShell";
import LazyComparisonBar from "@/components/ui/LazyComparisonBar";
import { ToastProvider } from "@/components/ui/Toast";
import OrganizationJsonLd from "@/components/seo/OrganizationJsonLd";
import WebSiteJsonLd from "@/components/seo/WebSiteJsonLd";
import GoogleTagScript from "@/components/seo/GoogleTagScript";
import ClientProviders from "@/components/ui/ClientProviders";
import { SITE_URL, SITE_NAME } from "@/lib/constants";
import AdminShellHide from "@/components/admin/AdminShellHide";
import Footer from "@/components/layout/Footer";
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
    default: `${SITE_NAME} — Moderne Haushaltsgeräte für Ihr Zuhause`,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "Entdecken Sie hochwertige Küchengeräte, Kaffeevollautomaten, Staubsauger und Smart Home Lösungen. Moderne Haushaltsgeräte für ein komfortables Zuhause.",
  alternates: {
    canonical: SITE_URL,
    languages: {
      "de": SITE_URL,
      "de-DE": SITE_URL,
      "x-default": SITE_URL,
    },
  },
  openGraph: {
    title: `${SITE_NAME} — Moderne Haushaltsgeräte für Ihr Zuhause`,
    description:
      "Hochwertige Küchengeräte, Kaffeevollautomaten und Smart Home Lösungen.",
    url: SITE_URL,
    siteName: SITE_NAME,
    locale: "de_DE",
    type: "website",
    images: [{ url: `${SITE_URL}/logos/logoprincipale.png`, width: 1200, height: 630, alt: `${SITE_NAME} — Premium Haushaltsgeräte` }],
  },
  twitter: {
    card: "summary_large_image",
    site: `@${SITE_NAME}`,
    title: `${SITE_NAME} — Moderne Haushaltsgeräte für Ihr Zuhause`,
    description:
      "Hochwertige Küchengeräte, Kaffeevollautomaten und Smart Home Lösungen.",
    images: [`${SITE_URL}/logos/logoprincipale.png`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
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
        <link rel="alternate" type="application/rss+xml" title={`${SITE_NAME} RSS`} href="/rss.xml" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="HAUSAURA" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="preconnect" href="https://res.cloudinary.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        <link rel="dns-prefetch" href="https://*.sentry.io" />
      </head>
      <body className="min-h-full flex flex-col bg-[var(--color-bg)] font-sans antialiased text-[var(--color-text-primary)]">
        <GoogleTagScript />
        <OrganizationJsonLd />
        <WebSiteJsonLd />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:bg-[var(--color-primary)] focus:text-white focus:px-4 focus:py-2 focus:rounded-lg focus:shadow-lg focus:outline-none"
        >
          Direkt zum Inhalt
        </a>
        <ToastProvider>
          <AdminShellHide footer={<Suspense fallback={null}><Footer /></Suspense>}>
            {children}
          </AdminShellHide>
          <ClientProviders />
          <ClientShell />
          <LazyComparisonBar />
        </ToastProvider>
      </body>
    </html>
  );
}
