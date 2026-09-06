"use client";

import { useEffect, useRef } from "react";
import { useCartStore } from "@/lib/store";

const MERGE_KEY = "HAUSAURA_cart_merged";

export function useCartMergeOnLogin(isLoggedIn: boolean) {
  const merged = useRef(false);

  useEffect(() => {
    if (!isLoggedIn || merged.current) return;

    // Check if we already merged for this session
    if (sessionStorage.getItem(MERGE_KEY)) {
      merged.current = true;
      return;
    }

    // Mark as merged to prevent re-merging
    sessionStorage.setItem(MERGE_KEY, "1");
    merged.current = true;
  }, [isLoggedIn]);
}
