import { createHash } from "crypto";

export function toCustomerId(email: string): string {
  return createHash("sha256").update(email.toLowerCase().trim()).digest("hex").slice(0, 16);
}
