export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://HAUSAURA.de").replace(/\/+$/, "");

export const FREE_SHIPPING_THRESHOLD = 50;
export const SHIPPING_COST = 4.99;

export const TRUST_BAR_RATING = 4.8;

export function getShippingCost(subtotal: number): number {
  return subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
}
