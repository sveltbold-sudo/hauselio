export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.hausaura.de").replace(/\/+$/, "");

export const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || "HAUSAURA";

export const FREE_SHIPPING_THRESHOLD = 50;
export const SHIPPING_COST = 4.99;

export const TRUST_BAR_RATING = 4.8;

// Per-country shipping config: { threshold, cost }
const SHIPPING_BY_COUNTRY: Record<string, { threshold: number; cost: number }> = {
  DE: { threshold: 50, cost: 4.99 },
  AT: { threshold: 75, cost: 7.99 },
  CH: { threshold: 100, cost: 9.99 },
};

const DEFAULT_SHIPPING = { threshold: FREE_SHIPPING_THRESHOLD, cost: SHIPPING_COST };

export function getShippingCost(subtotal: number, country: string = "DE"): number {
  const config = SHIPPING_BY_COUNTRY[country.toUpperCase()] || DEFAULT_SHIPPING;
  return subtotal >= config.threshold ? 0 : config.cost;
}

export function getShippingThreshold(country: string = "DE"): number {
  const config = SHIPPING_BY_COUNTRY[country.toUpperCase()] || DEFAULT_SHIPPING;
  return config.threshold;
}
