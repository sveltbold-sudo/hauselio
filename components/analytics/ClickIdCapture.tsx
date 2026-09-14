"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { captureClickIdsFromUrl } from "@/lib/click-ids";

/**
 * Capture les Google Ads click IDs (gclid/gbraid/wbraid) presents dans l'URL
 * et les persiste 90j (cookie + localStorage) pour l'import serveur.
 * Monte dans le layout racine — aucun rendu.
 */
export default function ClickIdCapture() {
  const searchParams = useSearchParams();

  useEffect(() => {
    captureClickIdsFromUrl(searchParams.toString() ? `?${searchParams.toString()}` : window.location.search);
  }, [searchParams]);

  return null;
}
