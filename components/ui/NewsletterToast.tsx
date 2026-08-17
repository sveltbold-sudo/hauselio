"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useToast } from "@/components/ui/Toast";

const messages: Record<string, { type: "success" | "error" | "info"; text: string }> = {
  confirmed: { type: "success", text: "E-Mail-Adresse bestätigt! Sie erhalten jetzt unseren Newsletter." },
  "already-confirmed": { type: "info", text: "Diese E-Mail-Adresse ist bereits bestätigt." },
  invalid: { type: "error", text: "Ungültiger Bestätigungslink. Bitte versuchen Sie es erneut." },
  error: { type: "error", text: "Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut." },
  "rate-limited": { type: "error", text: "Zu viele Anfragen. Bitte versuchen Sie es später erneut." },
};

export default function NewsletterToast() {
  const searchParams = useSearchParams();
  const toast = useToast();

  useEffect(() => {
    const status = searchParams.get("newsletter");
    if (status && messages[status]) {
      const { type, text } = messages[status];
      toast[type](text);
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, [searchParams, toast]);

  return null;
}
