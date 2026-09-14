// Import serveur Google Ads via DATA MANAGER API — NE JAMAIS importer cote client.
// Contourne le blocage Consent Mode v2 (ad_storage denied => gtag ignore).
//
// Note: ConversionUploadService (Google Ads API) refuse les nouvelles
// integrations ("use the Data Manager API"). On utilise donc :
//   POST https://datamanager.googleapis.com/v1/events:ingest
// Scope OAuth requis : https://www.googleapis.com/auth/datamanager
// Destination : action de conversion type UPLOAD_CLICKS ("Import from clicks").
//
// Dedup : Google utilise transactionId (= n° commande, identique au tag)
// au sein de la meme action pour dedupliquer les sources.

import { createHash } from "crypto";
import { logger } from "@/lib/logger";
import { prisma } from "@/lib/prisma";

const DM_BASE = "https://datamanager.googleapis.com/v1";

function env(name: string, fallback?: string): string | undefined {
  const v = process.env[name] ?? fallback;
  return v && v.length > 0 ? v : undefined;
}

export function isAdsUploadConfigured(): boolean {
  return Boolean(
    env("GOOGLE_ADS_CLIENT_ID") &&
      env("GOOGLE_ADS_CLIENT_SECRET") &&
      env("GOOGLE_ADS_REFRESH_TOKEN")
  );
}

function customerId(): string {
  return env("GOOGLE_ADS_CUSTOMER_ID", "1270790200")!;
}

function managerId(): string {
  return env("GOOGLE_ADS_MANAGER_ID", "3189801878")!;
}

/** ID de l'action "Import from clicks" (type UPLOAD_CLICKS). */
function offlineActionId(): string {
  const id = env("GOOGLE_ADS_OFFLINE_CONVERSION_ACTION_ID");
  if (!id) {
    throw new Error("GOOGLE_ADS_OFFLINE_CONVERSION_ACTION_ID manquant (.env / Vercel)");
  }
  return id;
}

async function getAccessToken(): Promise<string> {
  const clientId = env("GOOGLE_ADS_CLIENT_ID");
  const clientSecret = env("GOOGLE_ADS_CLIENT_SECRET");
  const refreshToken = env("GOOGLE_ADS_REFRESH_TOKEN");
  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error("Google Ads API non configure (GOOGLE_ADS_CLIENT_ID/SECRET/REFRESH_TOKEN manquants)");
  }
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    }),
    signal: AbortSignal.timeout(15_000),
  });
  const data = (await res.json()) as { access_token?: string; error?: string; error_description?: string };
  if (!res.ok || !data.access_token) {
    throw new Error(`Google OAuth: ${data.error_description || data.error || res.status}`);
  }
  return data.access_token;
}

interface DmErrorDetail {
  errors?: Array<{ message?: string }>;
}

async function dmIngest(body: Record<string, unknown>): Promise<{ requestId?: string; fieldWarnings?: unknown[] }> {
  const token = await getAccessToken();
  const res = await fetch(`${DM_BASE}/events:ingest`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(20_000),
  });
  const data = (await res.json().catch(() => null)) as {
    requestId?: string;
    fieldWarnings?: unknown[];
    error?: { message?: string; status?: string; details?: DmErrorDetail[] };
  } | null;
  if (!res.ok) {
    const detail = data?.error?.details
      ?.flatMap((d) => d.errors ?? [])
      .map((e) => e.message)
      .filter(Boolean)
      .join(" | ");
    const hint = res.status === 403 ? " (scope https://www.googleapis.com/auth/datamanager manquant ? regenerer le refresh token)" : "";
    throw new Error(`Data Manager API ${res.status}${data?.error?.status ? ` ${data.error.status}` : ""}: ${detail || data?.error?.message || "erreur inconnue"}${hint}`);
  }
  return { requestId: data?.requestId, fieldWarnings: data?.fieldWarnings };
}

function sha256Hex(value: string): string {
  return createHash("sha256").update(value, "utf8").digest("hex");
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function normalizePhone(phone: string): string {
  let p = phone.replace(/[\s\-./()]/g, "");
  if (p.startsWith("00")) p = `+${p.slice(2)}`;
  return p;
}

/** Normalisation nom/prenom pour AddressInfo : minuscules, sans ponctuation. */
function normalizeName(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-zßäöü ]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export interface PurchaseConversionInput {
  orderNumber: string;
  total: number;
  email: string;
  phone?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  country?: string | null;
  zip?: string | null;
  gclid?: string | null;
  gbraid?: string | null;
  wbraid?: string | null;
  conversionDate: Date;
  validateOnly?: boolean;
}

export interface PurchaseConversionResult {
  clickUploaded: boolean;
  enhancedUploaded: boolean;
  requestId?: string;
  skippedReason?: string;
}

export async function uploadPurchaseConversion(input: PurchaseConversionInput): Promise<PurchaseConversionResult> {
  const value = Math.round(input.total * 100) / 100;
  const validateOnly = input.validateOnly ?? false;

  const hasClickId = Boolean(input.gclid || input.gbraid || input.wbraid);
  const email = input.email ? normalizeEmail(input.email) : "";
  const phone = input.phone ? normalizePhone(input.phone) : "";

  const userIdentifiers: Array<Record<string, unknown>> = [];
  if (email) userIdentifiers.push({ emailAddress: sha256Hex(email) });
  if (phone) userIdentifiers.push({ phoneNumber: sha256Hex(phone) });

  // Adresse postale (matching renforce) : prenom/nom haches, region/CP en clair
  const givenName = input.firstName ? normalizeName(input.firstName) : "";
  const familyName = input.lastName ? normalizeName(input.lastName) : "";
  const regionCode = (input.country || "").trim().toUpperCase();
  const postalCode = (input.zip || "").trim();
  if (givenName && familyName && /^[A-Z]{2}$/.test(regionCode) && postalCode) {
    userIdentifiers.push({
      address: {
        givenName: sha256Hex(givenName),
        familyName: sha256Hex(familyName),
        regionCode,
        postalCode,
      },
    });
  }

  if (!hasClickId && userIdentifiers.length === 0) {
    return { clickUploaded: false, enhancedUploaded: false, skippedReason: "aucun identifiant (ni click ID ni user data)" };
  }

  const adIdentifiers: Record<string, string> = {};
  if (input.gclid) adIdentifiers.gclid = input.gclid;
  if (input.gbraid) adIdentifiers.gbraid = input.gbraid;
  if (input.wbraid) adIdentifiers.wbraid = input.wbraid;

  const event: Record<string, unknown> = {
    transactionId: input.orderNumber,
    eventTimestamp: input.conversionDate.toISOString(),
    eventSource: "WEB",
    currency: "EUR",
    conversionValue: value,
  };
  if (hasClickId) event.adIdentifiers = adIdentifiers;
  if (userIdentifiers.length > 0) event.userData = { userIdentifiers };

  const res = await dmIngest({
    destinations: [
      {
        operatingAccount: { accountId: customerId(), accountType: "GOOGLE_ADS" },
        loginAccount: { accountId: managerId(), accountType: "GOOGLE_ADS" },
        productDestinationId: offlineActionId(),
      },
    ],
    events: [event],
    encoding: "HEX",
    validateOnly,
  });

  if (res.fieldWarnings?.length) {
    logger.error("ads-conversion-warnings", new Error(JSON.stringify(res.fieldWarnings).slice(0, 500)), {
      orderNumber: input.orderNumber,
    });
  }

  logger.info("ads-conversion-upload", `Conversion uploadee pour ${input.orderNumber}`, {
    orderNumber: input.orderNumber,
    clickUploaded: hasClickId,
    enhancedUploaded: userIdentifiers.length > 0,
    requestId: res.requestId,
    validateOnly,
  });

  return { clickUploaded: hasClickId, enhancedUploaded: userIdentifiers.length > 0, requestId: res.requestId };
}

// Statuts payes (conversion reelle, pas de simple commande en attente)
const PAID_STATUSES = ["PAYMENT_CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED"];

export interface OrderUploadOutcome {
  ok: boolean;
  skipped?: string;
  error?: string;
  clickUploaded?: boolean;
  enhancedUploaded?: boolean;
}

/**
 * Upload la conversion d'une commande si eligible, et persiste le statut.
 * Idempotent: ignore les commandes deja uploadees (sauf validateOnly).
 * Les commandes creees avant GOOGLE_ADS_UPLOAD_FROM_ISO sont ignorees
 * (exclut les commandes de test du 13.09 de l'apprentissage PMax).
 */
export async function uploadOrderConversionById(
  orderId: string,
  opts?: { validateOnly?: boolean }
): Promise<OrderUploadOutcome> {
  const validateOnly = opts?.validateOnly ?? false;
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    select: {
      id: true,
      orderNumber: true,
      status: true,
      total: true,
      customerEmail: true,
      customerPhone: true,
      customerFirstName: true,
      customerLastName: true,
      customerCountry: true,
      customerZip: true,
      gclid: true,
      gbraid: true,
      wbraid: true,
      paidAt: true,
      updatedAt: true,
      createdAt: true,
      adsConversionUploadedAt: true,
    },
  });
  if (!order) return { ok: false, error: "Commande introuvable" };

  if (!PAID_STATUSES.includes(order.status)) {
    return { ok: false, skipped: `statut ${order.status} (attente de paiement)` };
  }
  if (order.adsConversionUploadedAt && !validateOnly) {
    return { ok: false, skipped: "deja uploadee" };
  }

  const cutoffIso = process.env.GOOGLE_ADS_UPLOAD_FROM_ISO;
  if (cutoffIso && !validateOnly) {
    const cutoff = new Date(cutoffIso);
    if (!Number.isNaN(cutoff.getTime()) && order.createdAt < cutoff) {
      return { ok: false, skipped: `creee avant le cutoff (${cutoffIso})` };
    }
  }

  try {
    const result = await uploadPurchaseConversion({
      orderNumber: order.orderNumber,
      total: Number(order.total),
      email: order.customerEmail,
      phone: order.customerPhone,
      firstName: order.customerFirstName,
      lastName: order.customerLastName,
      country: order.customerCountry,
      zip: order.customerZip,
      gclid: order.gclid,
      gbraid: order.gbraid,
      wbraid: order.wbraid,
      conversionDate: order.paidAt ?? order.updatedAt ?? order.createdAt,
      validateOnly,
    });
    if (!validateOnly) {
      await prisma.order.update({
        where: { id: order.id },
        data: {
          adsConversionUploadedAt: new Date(),
          adsUploadAttempts: { increment: 1 },
          adsUploadError: null,
        },
      });
    }
    return { ok: true, clickUploaded: result.clickUploaded, enhancedUploaded: result.enhancedUploaded };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    logger.error("ads-conversion-upload-error", error instanceof Error ? error : new Error(message), {
      orderNumber: order.orderNumber,
    });
    if (!validateOnly) {
      await prisma.order.update({
        where: { id: order.id },
        data: {
          adsUploadAttempts: { increment: 1 },
          adsUploadError: message.slice(0, 500),
        },
      });
    }
    return { ok: false, error: message };
  }
}
