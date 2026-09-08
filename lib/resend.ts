import { Resend } from "resend";
import { logger } from "./logger";

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

async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function sendEmailWithRetry(
  params: { from: string; to: string; subject: string; html: string },
  maxRetries = 3
): Promise<void> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      await getResendClient().emails.send(params);
      return;
    } catch (err) {
      const isLastAttempt = attempt === maxRetries;
      if (isLastAttempt) {
        throw err;
      }
      const delay = Math.pow(2, attempt) * 1000;
      logger.warn("resend", `Email send failed (attempt ${attempt}/${maxRetries}), retrying in ${delay}ms`, {
        to: params.to,
        subject: params.subject,
        error: err instanceof Error ? err.message : String(err),
      });
      await sleep(delay);
    }
  }
}
