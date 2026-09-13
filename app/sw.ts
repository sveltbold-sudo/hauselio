import { Serwist, ExpirationPlugin, CacheFirst, NetworkFirst } from "serwist";

declare global {
  interface Window {
    serwist: Serwist;
  }
}

const serwist = new Serwist({
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  disableDevLogs: true,
  runtimeCaching: [
    {
      matcher: /^https:\/\/res\.cloudinary\.com\/.*/i,
      handler: new CacheFirst({
        cacheName: "cloudinary-images",
        plugins: [
          new ExpirationPlugin({ maxEntries: 200, maxAgeSeconds: 60 * 60 * 24 * 30 }),
        ],
      }),
    },
    {
      matcher: /^https:\/\/fonts\.(googleapis|gstatic)\.com\/.*/i,
      handler: new CacheFirst({
        cacheName: "google-fonts",
        plugins: [
          new ExpirationPlugin({ maxEntries: 20, maxAgeSeconds: 60 * 60 * 24 * 365 }),
        ],
      }),
    },
    {
      matcher: /\/_next\/static\/.*/i,
      handler: new CacheFirst({
        cacheName: "next-static",
        plugins: [
          new ExpirationPlugin({ maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 * 30 }),
        ],
      }),
    },
    {
      matcher: /\/images\/.*/i,
      handler: new CacheFirst({
        cacheName: "local-images",
        plugins: [
          new ExpirationPlugin({ maxEntries: 200, maxAgeSeconds: 60 * 60 * 24 * 30 }),
        ],
      }),
    },
    {
      matcher: ({ url, request }: { url: URL; request: Request }) =>
        request.method === "GET" &&
        /^\/api\//i.test(url.pathname) &&
        !/^\/(api\/(customer|bestellungen|coupon|cart|newsletter|contact|reviews)|admin)/i.test(url.pathname),
      handler: new NetworkFirst({
        cacheName: "api-cache",
        networkTimeoutSeconds: 5,
        plugins: [
          new ExpirationPlugin({ maxEntries: 50, maxAgeSeconds: 60 * 60 }),
        ],
      }),
    },
    {
      matcher: ({ url }: { url: URL }) => /^\//.test(url.pathname) && !url.pathname.startsWith("/admin"),
      handler: new NetworkFirst({
        cacheName: "pages",
        networkTimeoutSeconds: 5,
        plugins: [
          new ExpirationPlugin({ maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 * 7 }),
        ],
      }),
    },
  ],
  fallbacks: {
    entries: [
      {
        url: "/offline",
        matcher: ({ request }: { request: Request }) => request.mode === "navigate" && !request.url.includes("/api/"),
      },
    ],
  },
});

serwist.addEventListeners();
