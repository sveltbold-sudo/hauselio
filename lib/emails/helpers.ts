import { getResendClient, FROM_EMAIL } from "@/lib/resend";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import { escapeHtml } from "@/lib/html";
import { SITE_URL } from "@/lib/constants";

export const SITE = SITE_URL.startsWith("http") ? SITE_URL : `https://${SITE_URL}`;
export const LOGO_URL = `${SITE}/logos/logosecondaire.png`;

export function stripHtml(html: string): string {
  return html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

export async function sendEmail(params: { from: string; to: string; subject: string; html: string }) {
  return getResendClient().emails.send({
    from: params.from,
    to: params.to,
    subject: params.subject,
    html: params.html,
    text: stripHtml(params.html),
  });
}

export interface OrderEmailData {
  orderNumber: string;
  customerEmail: string;
  customerName: string;
  items: { name: string; quantity: number; price: number }[];
  subtotal: number;
  couponDiscount: number;
  couponCode?: string;
  total: number;
  shippingCost: number;
}

export function baseTemplate(content: string): string {
  return `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
</head>
<body style="margin:0;padding:0;font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;background-color:#F0F2F5;-webkit-font-smoothing:antialiased;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#F0F2F5;padding:32px 16px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

          <!-- Logo -->
          <tr>
            <td align="center" style="padding:0 0 24px 0;">
              <a href="${SITE}" style="text-decoration:none;">
                <img src="${LOGO_URL}" alt="HAUSAURA" width="180" style="display:block;height:auto;border:0;" />
              </a>
            </td>
          </tr>

          <!-- Main Card -->
          <tr>
            <td style="background-color:#FFFFFF;border-radius:16px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.06);">
              ${content}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:24px 0;text-align:center;">
              <p style="color:#9CA3AF;font-size:11px;margin:0 0 4px 0;">
                &copy; ${new Date().getFullYear()} HAUSAURA GmbH &middot; Kastanienallee 42, 10435 Berlin
              </p>
              <p style="color:#9CA3AF;font-size:11px;margin:0;">
                <a href="${SITE}/impressum" style="color:#9CA3AF;text-decoration:underline;">Impressum</a>
                &nbsp;&middot;&nbsp;
                <a href="${SITE}/datenschutz" style="color:#9CA3AF;text-decoration:underline;">Datenschutz</a>
                &nbsp;&middot;&nbsp;
                <a href="mailto:info@HAUSAURA.de" style="color:#9CA3AF;text-decoration:underline;">Kontakt</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function headerBanner(title: string, subtitle: string, bgColor: string = "#0A2540"): string {
  return `<table width="100%" cellpadding="0" cellspacing="0" style="background-color:${bgColor};">
    <tr>
      <td style="padding:36px 40px 32px 40px;">
        <h1 style="color:#FFFFFF;font-size:22px;font-weight:800;margin:0 0 6px 0;letter-spacing:-0.3px;">${title}</h1>
        <p style="color:rgba(255,255,255,0.7);font-size:13px;margin:0;font-weight:400;">${subtitle}</p>
      </td>
    </tr>
  </table>`;
}

export function badge(text: string, bgColor: string, textColor: string): string {
  return `<span style="display:inline-block;background-color:${bgColor};color:${textColor};font-size:11px;font-weight:700;padding:4px 12px;border-radius:20px;text-transform:uppercase;letter-spacing:0.5px;">${text}</span>`;
}

export function divider(): string {
  return `<div style="border-top:1px solid #E8ECF1;margin:0;"></div>`;
}

export function orderItemsTable(items: OrderEmailData["items"]): string {
  return items
    .map(
      (item) => `
    <tr>
      <td style="padding:14px 0;border-bottom:1px solid #F0F2F5;font-size:14px;color:#1A1A1A;">
        ${escapeHtml(item.name)}
        <span style="color:#9CA3AF;font-size:13px;">&nbsp;&times;&nbsp;${item.quantity}</span>
      </td>
      <td style="padding:14px 0;border-bottom:1px solid #F0F2F5;font-size:14px;color:#1A1A1A;text-align:right;font-weight:600;">
        ${formatPrice(item.price * item.quantity)}
      </td>
    </tr>`
    )
    .join("");
}

export async function getBankDetails() {
  const settings = await prisma.siteSettings.findFirst();
  return {
    accountName: settings?.bankAccountName || "HAUSAURA GmbH",
    iban: settings?.bankIban || "",
    bic: settings?.bankBic || "",
  };
}
