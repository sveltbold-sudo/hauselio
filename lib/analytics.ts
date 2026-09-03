"use client";

import { getCookieConsent } from "@/components/ui/CookieConsent";

declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
  }
}

function pushEvent(eventName: string, params: Record<string, unknown>) {
  if (!getCookieConsent()) return;
  if (typeof window.gtag !== "function") return;
  window.gtag("event", eventName, params);
}

export function trackPageView(path: string, title: string) {
  pushEvent("page_view", { page_path: path, page_title: title });
}

export function trackViewItem(product: {
  id: string;
  name: string;
  price: number;
  category?: string;
  brand?: string;
}) {
  pushEvent("view_item", {
    currency: "EUR",
    value: product.price,
    items: [
      {
        item_id: product.id,
        item_name: product.name,
        price: product.price,
        item_category: product.category || "",
        item_brand: product.brand || "",
      },
    ],
  });
}

export function trackAddToCart(product: {
  id: string;
  name: string;
  price: number;
  quantity: number;
  category?: string;
  brand?: string;
}) {
  pushEvent("add_to_cart", {
    currency: "EUR",
    value: product.price * product.quantity,
    items: [
      {
        item_id: product.id,
        item_name: product.name,
        price: product.price,
        quantity: product.quantity,
        item_category: product.category || "",
        item_brand: product.brand || "",
      },
    ],
  });
}

export function trackBeginCheckout(orderTotal: number, items: { id: string; name: string; price: number; quantity: number }[]) {
  pushEvent("begin_checkout", {
    currency: "EUR",
    value: orderTotal,
    items: items.map((item) => ({
      item_id: item.id,
      item_name: item.name,
      price: item.price,
      quantity: item.quantity,
    })),
  });
}

export function trackPurchase(orderId: string, total: number, itemCount: number) {
  pushEvent("purchase", {
    transaction_id: orderId,
    currency: "EUR",
    value: total,
    items: Array(itemCount).fill({ item_id: "item" }),
  });
}

export function trackSearch(query: string) {
  pushEvent("search", { search_term: query });
}

export function trackSelectItem(product: {
  id: string;
  name: string;
  price: number;
  category?: string;
  brand?: string;
}) {
  pushEvent("select_item", {
    items: [
      {
        item_id: product.id,
        item_name: product.name,
        price: product.price,
        item_category: product.category || "",
        item_brand: product.brand || "",
      },
    ],
  });
}
