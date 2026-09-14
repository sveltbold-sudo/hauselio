// Helpers client (et serveur-safe) pour les Google Ads click IDs.
// Les IDs (gclid/gbraid/wbraid, validite 90j cote Google) sont stockes en
// cookie + localStorage des la landing, puis attaches a la commande au
// checkout pour l'import serveur de conversions.

export interface ClickIds {
  gclid?: string;
  gbraid?: string;
  wbraid?: string;
}

const CLICK_ID_KEYS = ["gclid", "gbraid", "wbraid"] as const;
const STORAGE_KEY = "hausaura_click_ids";
const COOKIE_MAX_AGE = 90 * 24 * 60 * 60; // 90 jours

function sanitizeClickId(value: string | null): string | undefined {
  if (!value) return undefined;
  const v = value.trim().slice(0, 255);
  // gclid/gbraid/wbraid: base64url + quelques caracteres safe
  if (!/^[A-Za-z0-9\-_.*/=+]+$/.test(v)) return undefined;
  return v;
}

function readCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|;\\s*)${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1] ?? "") : null;
}

function writeCookie(name: string, value: string) {
  if (typeof document === "undefined") return;
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${name}=${encodeURIComponent(value)}; Max-Age=${COOKIE_MAX_AGE}; Path=/; SameSite=Lax${secure}`;
}

/** Lit les click IDs depuis l'URL et les persiste (cookie + localStorage). */
export function captureClickIdsFromUrl(search: string): ClickIds {
  const found: ClickIds = {};
  try {
    const params = new URLSearchParams(search);
    for (const key of CLICK_ID_KEYS) {
      const v = sanitizeClickId(params.get(key));
      if (v) {
        found[key] = v;
        writeCookie(`hausaura_${key}`, v);
      }
    }
    if (Object.keys(found).length > 0) {
      const merged = { ...readStoredClickIds(), ...found };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
      } catch {
        // stockage indisponible (mode prive) — le cookie suffit
      }
    }
  } catch {
    // URL illisible — on ignore
  }
  return found;
}

function readStoredClickIds(): ClickIds {
  const ids: ClickIds = {};
  for (const key of CLICK_ID_KEYS) {
    const v = sanitizeClickId(readCookie(`hausaura_${key}`));
    if (v) ids[key] = v;
  }
  if (Object.keys(ids).length === 0 && typeof localStorage !== "undefined") {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Record<string, unknown>;
        for (const key of CLICK_ID_KEYS) {
          const v = sanitizeClickId(typeof parsed[key] === "string" ? (parsed[key] as string) : null);
          if (v) ids[key] = v;
        }
      }
    } catch {
      // stockage corrompu — on ignore
    }
  }
  return ids;
}

/** Retourne les click IDs connus (cookie d'abord, localStorage en fallback). */
export function getClickIds(): ClickIds {
  if (typeof window === "undefined") return {};
  return readStoredClickIds();
}
