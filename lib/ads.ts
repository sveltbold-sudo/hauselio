"use client";

import { getCookiePreferences } from "@/components/ui/CookieConsent";

declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
  }
}

const AW_ID = process.env.NEXT_PUBLIC_AW_CONVERSION_ID || "";
const AW_LABELS = {
  purchase: process.env.NEXT_PUBLIC_AW_PURCHASE_LABEL || "",
  addToCart: process.env.NEXT_PUBLIC_AW_ADD_TO_CART_LABEL || "",
  beginCheckout: process.env.NEXT_PUBLIC_AW_BEGIN_CHECKOUT_LABEL || "",
};

function hasAdsConsent(): boolean {
  if (typeof window === "undefined") return false;
  if (!AW_ID) return false;
  const prefs = getCookiePreferences();
  return prefs?.analytics ?? false;
}

function pushConversion(eventName: string, params: Record<string, unknown>, label?: string) {
  if (!hasAdsConsent()) return;
  if (typeof window.gtag !== "function") return;

  const sendTo = label ? `${AW_ID}/${label}` : AW_ID;
  window.gtag("event", eventName, {
    ...params,
    send_to: sendTo,
  });
}

export function trackConversionPurchase(orderId: string, total: number, items: { id: string; name: string; price: number; quantity: number }[]) {
  pushConversion("purchase", {
    transaction_id: orderId,
    currency: "EUR",
    value: total,
    items: items.map((item) => ({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      google_business_vertical: "retail",
    })),
  }, AW_LABELS.purchase);
}

export function trackConversionAddToCart(productId: string, productName: string, price: number) {
  pushConversion("add_to_cart", {
    currency: "EUR",
    value: price,
    items: [{
      id: productId,
      google_business_vertical: "retail",
    }],
  }, AW_LABELS.addToCart);
}

export function trackConversionBeginCheckout(orderTotal: number, items: { id: string; name: string; price: number; quantity: number }[]) {
  pushConversion("begin_checkout", {
    currency: "EUR",
    value: orderTotal,
    items: items.map((item) => ({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      google_business_vertical: "retail",
    })),
  }, AW_LABELS.beginCheckout);
}

export function sendAdsUserData(email?: string, phone?: string) {
  if (!hasAdsConsent()) return;
  if (typeof window.gtag !== "function") return;

  const userData: Record<string, string> = {};
  if (email) {
    userData.email = email;
  }
  if (phone) {
    userData.phone_number = phone;
  }

  if (Object.keys(userData).length > 0) {
    window.gtag("set", "user_data", userData);
  }
}
