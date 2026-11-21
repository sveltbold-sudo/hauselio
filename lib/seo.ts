import { SITE_URL, SITE_NAME } from "@/lib/constants";

/**
 * Default social preview image (1200x630). Used everywhere a page does not
 * provide a more specific image (product, category, article).
 */
export const OG_IMAGE_PATH = "/og/hausaura-og.png";
export const OG_IMAGE_URL = `${SITE_URL}${OG_IMAGE_PATH}`;

export const OG_IMAGE = {
  url: OG_IMAGE_URL,
  width: 1200,
  height: 630,
  alt: `${SITE_NAME} – Haushaltsgeräte online kaufen`,
};

export const OG_IMAGE_TWITTER = [OG_IMAGE_URL];

/**
 * Crawlers used by AI assistants and answer engines. They are allowed
 * explicitly so that product data can be quoted in AI answers.
 * Training-only crawlers (CCBot, Google-Extended) are allowed as well:
 * blocking them does not improve visibility and only removes the brand
 * from the training corpus.
 */
export const AI_CRAWLERS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-User",
  "Claude-SearchBot",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "Applebot-Extended",
  "CCBot",
  "meta-externalagent",
  "Bytespider",
  "Amazonbot",
  "cohere-ai",
];

/** Trim a text to a meta-description friendly length without cutting a word. */
export function metaDescription(text: string, max = 155): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max);
  const lastSpace = cut.lastIndexOf(" ");
  return `${cut.slice(0, lastSpace > 60 ? lastSpace : max).replace(/[,;:.\-–—]$/, "")}…`;
}

/** Absolute URL for a path or an already absolute URL. */
export function absoluteUrl(pathOrUrl: string): string {
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  return `${SITE_URL}${pathOrUrl.startsWith("/") ? "" : "/"}${pathOrUrl}`;
}
