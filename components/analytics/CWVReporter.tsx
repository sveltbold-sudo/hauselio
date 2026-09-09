"use client";

import { useEffect } from "react";
import { initCWVMonitoring } from "@/lib/cwv-monitor";

export default function CWVReporter() {
  useEffect(() => {
    initCWVMonitoring();
  }, []);

  return null;
}
