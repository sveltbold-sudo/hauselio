import { Resend } from "resend";

let _resend: Resend | null = null;

export function getResendClient(): Resend {
  if (!_resend) {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      throw new Error("RESEND_API_KEY is not configured.");
    }
    _resend = new Resend(apiKey);
  }
  return _resend;
}

export const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "HAUSAURA <info@hausaura.de>";
