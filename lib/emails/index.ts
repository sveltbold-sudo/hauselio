import { getResendClient, FROM_EMAIL } from "@/lib/resend";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import { createUnsubscribeToken } from "@/lib/auth";

import { SITE_URL } from "@/lib/constants";

export function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

interface OrderEmailData {
  orderNumber: string;
  customerEmail: string;
  customerName: string;
  items: { name: string; quantity: number; price: number }[];
  total: number;
  shippingCost: number;
}

function baseTemplate(content: string): string {
  return `
    <!DOCTYPE html>
    <html lang="de">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background-color:#FAFAF8;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#FAFAF8;padding:40px 20px;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color:#FFFFFF;border-radius:16px;overflow:hidden;box-shadow:0 4px 6px rgba(0,0,0,0.05);">
              <tr>
                <td style="background-color:#0A2540;padding:32px 40px;text-align:center;">
                  <h1 style="color:#FFFFFF;font-size:24px;font-weight:800;margin:0;">HAUSELIO</h1>
                  <p style="color:rgba(255,255,255,0.7);font-size:14px;margin:8px 0 0 0;">Premium Haushaltsgeräte</p>
                </td>
              </tr>
              <tr>
                <td style="padding:40px;">
                  ${content}
                </td>
              </tr>
              <tr>
                <td style="background-color:#F5F5F5;padding:24px 40px;text-align:center;border-top:1px solid #E8E8E8;">
                  <p style="color:#6B7280;font-size:12px;margin:0;">
                    HAUSELIO GmbH | Kastanienallee 42, 10435 Berlin | info@hauselio.de | +49 (0)30 555 789 01
                  </p>
                  <p style="color:#9CA3AF;font-size:11px;margin:8px 0 0 0;">
                    <a href="${SITE_URL}/impressum" style="color:#6B7280;">Impressum</a> |
                    <a href="${SITE_URL}/datenschutz" style="color:#6B7280;">Datenschutz</a>
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}

function orderItemsTable(items: OrderEmailData["items"]): string {
  return items
    .map(
      (item) => `
      <tr>
        <td style="padding:12px 0;border-bottom:1px solid #E8E8E8;font-size:14px;color:#1A1A1A;">
          ${escapeHtml(item.name)} × ${item.quantity}
        </td>
        <td style="padding:12px 0;border-bottom:1px solid #E8E8E8;font-size:14px;color:#1A1A1A;text-align:right;">
          ${formatPrice(item.price * item.quantity)}
        </td>
      </tr>
    `
    )
    .join("");
}

async function getBankDetails() {
  const settings = await prisma.siteSettings.findFirst();
  return {
    accountName: settings?.bankAccountName || "HAUSELIO GmbH",
    iban: settings?.bankIban || "",
    bic: settings?.bankBic || "",
  };
}

export async function sendOrderConfirmation(data: OrderEmailData) {
  const { orderNumber, customerEmail, customerName, items, total, shippingCost } = data;
  const bank = await getBankDetails();
  const safeName = escapeHtml(customerName);
  const safeOrderNumber = escapeHtml(orderNumber);

  const html = baseTemplate(`
    <h2 style="color:#0A2540;font-size:20px;font-weight:700;margin:0 0 8px 0;">Bestellbestätigung</h2>
    <p style="color:#6B7280;font-size:14px;margin:0 0 24px 0;">
      Vielen Dank für Ihre Bestellung, ${safeName}!
    </p>

    <div style="background-color:#F5F5F5;border-radius:12px;padding:20px;margin-bottom:24px;">
      <p style="color:#6B7280;font-size:12px;margin:0 0 4px 0;">Bestellnummer</p>
      <p style="color:#0A2540;font-size:18px;font-weight:800;margin:0;">${safeOrderNumber}</p>
    </div>

    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
      <tr style="border-bottom:2px solid #E8E8E8;">
        <td style="padding:8px 0;font-size:12px;color:#6B7280;font-weight:600;">ARTIKEL</td>
        <td style="padding:8px 0;font-size:12px;color:#6B7280;font-weight:600;text-align:right;">PREIS</td>
      </tr>
      ${orderItemsTable(items)}
    </table>

    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td style="padding:4px 0;font-size:14px;color:#6B7280;">Zwischensumme</td>
        <td style="padding:4px 0;font-size:14px;color:#1A1A1A;text-align:right;">${formatPrice(total)}</td>
      </tr>
      <tr>
        <td style="padding:4px 0;font-size:14px;color:#6B7280;">Versand</td>
        <td style="padding:4px 0;font-size:14px;color:${shippingCost === 0 ? "#16A34A" : "#1A1A1A"};text-align:right;">
          ${shippingCost === 0 ? "Kostenlos" : formatPrice(shippingCost)}
        </td>
      </tr>
      <tr>
        <td style="padding:12px 0 4px 0;font-size:16px;font-weight:700;color:#0A2540;border-top:2px solid #E8E8E8;">Gesamt</td>
        <td style="padding:12px 0 4px 0;font-size:16px;font-weight:700;color:#0A2540;text-align:right;border-top:2px solid #E8E8E8;">${formatPrice(total + shippingCost)}</td>
      </tr>
    </table>

    <div style="background-color:#FFF7ED;border:1px solid #FFEDD5;border-radius:12px;padding:20px;margin-top:24px;">
      <h3 style="color:#0A2540;font-size:14px;font-weight:700;margin:0 0 8px 0;">Zahlungsinformationen</h3>
      <p style="color:#6B7280;font-size:13px;margin:0 0 12px 0;">
        Bitte überweisen Sie den Gesamtbetrag innerhalb von 5 Werktagen:
      </p>
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td style="padding:2px 0;font-size:13px;color:#6B7280;">Empfänger</td>
          <td style="padding:2px 0;font-size:13px;color:#1A1A1A;text-align:right;font-weight:600;">${escapeHtml(bank.accountName)}</td>
        </tr>
        <tr>
          <td style="padding:2px 0;font-size:13px;color:#6B7280;">IBAN</td>
          <td style="padding:2px 0;font-size:13px;color:#1A1A1A;text-align:right;font-weight:600;">${escapeHtml(bank.iban)}</td>
        </tr>
        <tr>
          <td style="padding:2px 0;font-size:13px;color:#6B7280;">BIC</td>
          <td style="padding:2px 0;font-size:13px;color:#1A1A1A;text-align:right;font-weight:600;">${escapeHtml(bank.bic)}</td>
        </tr>
        <tr>
          <td style="padding:2px 0;font-size:13px;color:#6B7280;">Verwendungszweck</td>
          <td style="padding:2px 0;font-size:13px;color:#F5A623;text-align:right;font-weight:700;">${safeOrderNumber}</td>
        </tr>
      </table>
    </div>
  `);

  return getResendClient().emails.send({
    from: FROM_EMAIL,
    to: customerEmail,
    subject: `Bestellbestätigung ${safeOrderNumber} – HAUSELIO`,
    html,
  });
}

export async function sendPaymentConfirmed(data: OrderEmailData) {
  const safeOrderNumber = escapeHtml(data.orderNumber);

  const html = baseTemplate(`
    <h2 style="color:#0A2540;font-size:20px;font-weight:700;margin:0 0 8px 0;">Zahlung bestätigt</h2>
    <p style="color:#6B7280;font-size:14px;margin:0 0 24px 0;">
      Ihre Zahlung für Bestellung ${safeOrderNumber} wurde erhalten.
    </p>
    <div style="background-color:#F0FDF4;border:1px solid #BBF7D0;border-radius:12px;padding:20px;margin-bottom:24px;">
      <p style="color:#16A34A;font-size:14px;font-weight:600;margin:0;">
        Wir bereiten Ihre Bestellung nun zur Versendung vor.
      </p>
    </div>
    <p style="color:#6B7280;font-size:14px;margin:0;">
      Sie erhalten eine weitere E-Mail, sobald Ihre Bestellung versendet wurde.
    </p>
  `);

  return getResendClient().emails.send({
    from: FROM_EMAIL,
    to: data.customerEmail,
    subject: `Zahlung bestätigt ${safeOrderNumber} – HAUSELIO`,
    html,
  });
}

export async function sendShippedConfirmation(
  data: OrderEmailData,
  trackingNumber: string
) {
  const safeOrderNumber = escapeHtml(data.orderNumber);
  const safeTracking = escapeHtml(trackingNumber);
  const trackingUrl = `https://www.dhl.de/de/privatkunden/pakete-empfangen/verfolgen.html?piececode=${encodeURIComponent(trackingNumber)}`;

  const html = baseTemplate(`
    <h2 style="color:#0A2540;font-size:20px;font-weight:700;margin:0 0 8px 0;">Versandbestätigung</h2>
    <p style="color:#6B7280;font-size:14px;margin:0 0 24px 0;">
      Ihre Bestellung ${safeOrderNumber} wurde versendet!
    </p>
    <div style="background-color:#EFF6FF;border:1px solid #BFDBFE;border-radius:12px;padding:20px;margin-bottom:24px;">
      <p style="color:#1D4ED8;font-size:14px;font-weight:600;margin:0 0 4px 0;">Sendungsverfolgung</p>
      <p style="color:#0A2540;font-size:16px;font-weight:800;margin:0;">${safeTracking}</p>
    </div>
    <p style="color:#6B7280;font-size:14px;margin:0 0 24px 0;">
      Sie können Ihre Sendung mit der obigen Nummer beim DHL Pakettracking verfolgen.
    </p>
    <a href="${trackingUrl}"
       style="display:inline-block;background-color:#F5A623;color:#FFFFFF;font-weight:700;padding:12px 24px;border-radius:12px;text-decoration:none;font-size:14px;">
      Sendung verfolgen →
    </a>
  `);

  return getResendClient().emails.send({
    from: FROM_EMAIL,
    to: data.customerEmail,
    subject: `Ihre Bestellung wurde versendet ${safeOrderNumber} – HAUSELIO`,
    html,
  });
}

export async function sendOrderCancelled(data: OrderEmailData) {
  const safeOrderNumber = escapeHtml(data.orderNumber);
  const safeName = escapeHtml(data.customerName);

  const html = baseTemplate(`
    <h2 style="color:#0A2540;font-size:20px;font-weight:700;margin:0 0 8px 0;">Bestellung storniert</h2>
    <p style="color:#6B7280;font-size:14px;margin:0 0 24px 0;">
      Sehr geehrte(r) ${safeName},
    </p>
    <p style="color:#6B7280;font-size:14px;margin:0 0 16px 0;">
      Ihre Bestellung ${safeOrderNumber} wurde storniert.
    </p>
    <div style="background-color:#FEF2F2;border:1px solid #FECACA;border-radius:12px;padding:20px;margin-bottom:24px;">
      <p style="color:#DC2626;font-size:14px;font-weight:600;margin:0;">
        Falls Sie eine Zahlung geleistet haben, wird diese innerhalb von 3-5 Werktagen erstattet.
      </p>
    </div>
    <p style="color:#6B7280;font-size:14px;margin:0 0 16px 0;">
      Bei Fragen zu dieser Stornierung kontaktieren Sie uns bitte unter
      <a href="mailto:support@hauselio.de" style="color:#F5A623;">support@hauselio.de</a>.
    </p>
    <p style="color:#6B7280;font-size:14px;margin:0;">
      Mit freundlichen Grüßen,<br/>HAUSELIO Team
    </p>
  `);

  return getResendClient().emails.send({
    from: FROM_EMAIL,
    to: data.customerEmail,
    subject: `Bestellung ${safeOrderNumber} storniert – HAUSELIO`,
    html,
  });
}

export async function sendContactForward(data: {
  firstName: string;
  lastName: string;
  email: string;
  subject: string;
  message: string;
}) {
  const safe = {
    firstName: escapeHtml(data.firstName),
    lastName: escapeHtml(data.lastName),
    email: escapeHtml(data.email),
    subject: escapeHtml(data.subject),
    message: escapeHtml(data.message),
  };

  const html = baseTemplate(`
    <h2 style="color:#0A2540;font-size:20px;font-weight:700;margin:0 0 16px 0;">Neue Kontaktanfrage</h2>
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
      <tr>
        <td style="padding:8px 0;font-size:13px;color:#6B7280;width:120px;">Von</td>
        <td style="padding:8px 0;font-size:13px;color:#1A1A1A;font-weight:600;">${safe.firstName} ${safe.lastName}</td>
      </tr>
      <tr>
        <td style="padding:8px 0;font-size:13px;color:#6B7280;">E-Mail</td>
        <td style="padding:8px 0;font-size:13px;color:#1A1A1A;font-weight:600;">${safe.email}</td>
      </tr>
      <tr>
        <td style="padding:8px 0;font-size:13px;color:#6B7280;">Betreff</td>
        <td style="padding:8px 0;font-size:13px;color:#1A1A1A;font-weight:600;">${safe.subject}</td>
      </tr>
    </table>
    <div style="background-color:#F5F5F5;border-radius:12px;padding:20px;">
      <p style="color:#6B7280;font-size:12px;margin:0 0 8px 0;font-weight:600;">NACHRICHT</p>
      <p style="color:#1A1A1A;font-size:14px;margin:0;white-space:pre-wrap;">${safe.message}</p>
    </div>
  `);

  return getResendClient().emails.send({
    from: FROM_EMAIL,
    to: "support@hauselio.de",
    subject: `Kontakt: ${safe.subject}`,
    html,
  });
}

export async function sendContactAutoReply(data: {
  firstName: string;
  lastName: string;
  email: string;
}) {
  const safe = {
    firstName: escapeHtml(data.firstName),
    lastName: escapeHtml(data.lastName),
  };

  const html = baseTemplate(`
    <h2 style="color:#0A2540;font-size:20px;font-weight:700;margin:0 0 8px 0;">Vielen Dank für Ihre Nachricht!</h2>
    <p style="color:#6B7280;font-size:14px;margin:0 0 16px 0;">
      Sehr geehrte(r) ${safe.firstName} ${safe.lastName},
    </p>
    <p style="color:#6B7280;font-size:14px;margin:0 0 16px 0;">
      Wir haben Ihre Nachricht erhalten und melden uns innerhalb von 24 Stunden bei Ihnen.
    </p>
    <div style="background-color:#F5F5F5;border-radius:12px;padding:20px;margin-bottom:20px;">
      <p style="color:#6B7280;font-size:12px;margin:0 0 4px 0;">IHRE ANFRAGE</p>
      <p style="color:#1A1A1A;font-size:14px;margin:0;">Wir werden uns schnellstmöglich bei Ihnen melden.</p>
    </div>
    <p style="color:#6B7280;font-size:14px;margin:0;">
      Mit freundlichen Grüßen,<br/>HAUSELIO Team
    </p>
  `);

  return getResendClient().emails.send({
    from: FROM_EMAIL,
    to: data.email,
    subject: "Ihre Nachricht bei HAUSELIO",
    html,
  });
}

export async function sendNewsletterCampaign(data: {
  subject: string;
  content: string;
  emails: string[];
}) {
  const safeSubject = escapeHtml(data.subject);
  const safeContent = escapeHtml(data.content).replace(/\n/g, "<br>");

  const BATCH_SIZE = 50;
  const results: { status: string }[] = [];

  for (let i = 0; i < data.emails.length; i += BATCH_SIZE) {
    const batch = data.emails.slice(i, i + BATCH_SIZE);
    const batchResults = await Promise.allSettled(
      batch.map(async (email) => {
        const token = await createUnsubscribeToken(email);
        const unsubscribeUrl = `${SITE_URL}/api/newsletter/unsubscribe?token=${encodeURIComponent(token)}`;
        const html = baseTemplate(`
          <h2 style="color:#0A2540;font-size:20px;font-weight:700;margin:0 0 16px 0;">${safeSubject}</h2>
          <div style="color:#6B7280;font-size:14px;line-height:1.7;">
            ${safeContent}
          </div>
          <div style="margin-top:32px;padding-top:24px;border-top:1px solid #E8E8E8;">
            <p style="color:#9CA3AF;font-size:12px;margin:0;">
              Sie erhalten diese E-Mail, weil Sie sich für unseren Newsletter angemeldet haben.
              <a href="${unsubscribeUrl}" style="color:#F5A623;">Abmelden</a>
            </p>
          </div>
        `);
        return getResendClient().emails.send({
          from: FROM_EMAIL,
          to: email,
          subject: `${safeSubject} – HAUSELIO`,
          html,
        });
      })
    );
    results.push(...batchResults);

    if (i + BATCH_SIZE < data.emails.length) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }

  const sent = results.filter((r) => r.status === "fulfilled").length;
  const failed = results.filter((r) => r.status === "rejected").length;

  return { sent, failed, total: data.emails.length };
}
