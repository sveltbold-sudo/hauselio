import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";
import withBundleAnalyzer from "@next/bundle-analyzer";
import withSerwist from "@serwist/next";

const securityHeaders = [
  {
    key: "X-Frame-Options",
    value: "DENY",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
  {
    key: "X-XSS-Protection",
    value: "0",
  },
  {
    key: "X-Permitted-Cross-Domain-Policies",
    value: "none",
  },
  {
    key: "X-DNS-Prefetch-Control",
    value: "off",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' https://va.vercel-scripts.com https://vercel.live https://www.googletagmanager.com https://www.google-analytics.com https://www.googleadservices.com https://adservice.google.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "img-src 'self' https://res.cloudinary.com https://www.google-analytics.com https://www.googletagmanager.com blob: data:",
      "font-src 'self' https://fonts.gstatic.com",
      "connect-src 'self' https://va.vercel-scripts.com https://*.sentry.io https://www.google-analytics.com https://analytics.google.com https://region1.google-analytics.com https://www.googleadservices.com https://adservice.google.com https://pagead2.googlesyndication.com https://*.algolia.net https://*.algolianet.com",
      "object-src 'none'",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "upgrade-insecure-requests",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  serverExternalPackages: ["jspdf", "jspdf-autotable", "isomorphic-dompurify", "cloudinary", "bcryptjs", "algoliasearch"],
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "2mb",
    },
    optimizePackageImports: ["lucide-react", "@prisma/client"],
  },
  compiler: {
    removeConsole: { exclude: ["error"] },
  },
  redirects: async () => [
    { source: "/kueche", destination: "/kategorie/kueche", permanent: true },
    { source: "/kaffee", destination: "/kategorie/kaffee", permanent: true },
    { source: "/smart-home", destination: "/kategorie/smart-home", permanent: true },
    { source: "/klima", destination: "/kategorie/klima", permanent: true },
    { source: "/reinigung", destination: "/kategorie/reinigung", permanent: true },
    { source: "/haushaltsgeraete", destination: "/kategorie/haushaltsgeraete", permanent: true },
    { source: "/kategorien", destination: "/kategorie", permanent: true },
    { source: "/anmelden", destination: "/konto", permanent: true },
    { source: "/suche", has: [{ type: "query", key: "q" }], destination: "/shop?q=:q", permanent: false },
    { source: "/suche", destination: "/shop", permanent: false },
    { source: "/versandinformationen", destination: "/versand", permanent: true },
    { source: "/widerrufsrecht", destination: "/widerruf", permanent: true },
  ],
  async headers() {
    return [
      {
        source: "/images/(.*)",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

const bundleAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

const serwist = withSerwist({
  swSrc: "app/sw.ts",
  swDest: "public/sw.js",
  cacheOnNavigation: true,
  reloadOnOnline: true,
});

export default serwist(bundleAnalyzer(withSentryConfig(nextConfig, {
  silent: true,
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  sourcemaps: {
    disable: true,
  },
})));
