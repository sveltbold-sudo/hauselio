import { getResendClient, FROM_EMAIL } from "@/lib/resend";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import { createUnsubscribeToken } from "@/lib/auth";
import { escapeHtml } from "@/lib/html";

import { SITE_URL } from "@/lib/constants";

const activeCampaigns = new Map<string, number>();

const SITE = SITE_URL.startsWith("http") ? SITE_URL : `https://${SITE_URL}`;
const LOGO_URL = `${SITE}/logos/logosecondaire.png`;

function stripHtml(html: string): string {
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

async function sendEmail(params: { from: string; to: string; subject: string; html: string }) {
  return getResendClient().emails.send({
    from: params.from,
    to: params.to,
    subject: params.subject,
    html: params.html,
    text: stripHtml(params.html),
  });
}

interface OrderEmailData {
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

function baseTemplate(content: string): string {
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

function headerBanner(title: string, subtitle: string, bgColor: string = "#0A2540"): string {
  return `<table width="100%" cellpadding="0" cellspacing="0" style="background-color:${bgColor};">
    <tr>
      <td style="padding:36px 40px 32px 40px;">
        <h1 style="color:#FFFFFF;font-size:22px;font-weight:800;margin:0 0 6px 0;letter-spacing:-0.3px;">${title}</h1>
        <p style="color:rgba(255,255,255,0.7);font-size:13px;margin:0;font-weight:400;">${subtitle}</p>
      </td>
    </tr>
  </table>`;
}

function badge(text: string, bgColor: string, textColor: string): string {
  return `<span style="display:inline-block;background-color:${bgColor};color:${textColor};font-size:11px;font-weight:700;padding:4px 12px;border-radius:20px;text-transform:uppercase;letter-spacing:0.5px;">${text}</span>`;
}

function divider(): string {
  return `<div style="border-top:1px solid #E8ECF1;margin:0;"></div>`;
}

function orderItemsTable(items: OrderEmailData["items"]): string {
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

async function getBankDetails() {
  const settings = await prisma.siteSettings.findFirst();
  return {
    accountName: settings?.bankAccountName || "HAUSAURA GmbH",
    iban: settings?.bankIban || "",
    bic: settings?.bankBic || "",
  };
}

// ─────────────────────────────────────────────
// 1. ORDER CONFIRMATION
// ─────────────────────────────────────────────
export async function sendOrderConfirmation(data: OrderEmailData) {
  const { orderNumber, customerEmail, customerName, items, subtotal, couponDiscount, couponCode, total, shippingCost } = data;
  const bank = await getBankDetails();
  const safeName = escapeHtml(customerName);
  const safeOrderNumber = escapeHtml(orderNumber);

  const html = baseTemplate(`
    ${headerBanner("Bestellbest\u00e4tigung", `Bestellung ${safeOrderNumber} erfolgreich eingegangen`)}

    <div style="padding:36px 40px;">

      <!-- Greeting -->
      <p style="color:#4B5563;font-size:15px;margin:0 0 24px 0;line-height:1.6;">
        Hallo <strong style="color:#0A2540;">${safeName}</strong>,<br/>
        vielen Dank f\u00fcr Ihre Bestellung bei HAUSAURA! Wir haben Ihre Bestellung erhalten und bearbeiten diese jetzt.
      </p>

      <!-- Order Number Card -->
      <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
        <tr>
          <td style="background-color:#F0F4F8;border-radius:12px;padding:20px 24px;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td>
                  <p style="color:#6B7280;font-size:11px;margin:0;text-transform:uppercase;letter-spacing:1px;font-weight:600;">Bestellnummer</p>
                  <p style="color:#0A2540;font-size:20px;font-weight:800;margin:6px 0 0 0;letter-spacing:-0.5px;">${safeOrderNumber}</p>
                </td>
                <td align="right" valign="top">
                  ${badge("Offen", "#FEF3C7", "#92400E")}
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>

      ${divider()}

      <!-- Items -->
      <div style="padding:24px 0;">
        <p style="color:#6B7280;font-size:11px;margin:0 0 16px 0;text-transform:uppercase;letter-spacing:1px;font-weight:600;">Bestellte Artikel</p>
        <table width="100%" cellpadding="0" cellspacing="0">
          ${orderItemsTable(items)}
        </table>
      </div>

      <!-- Totals -->
      <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:8px;">
        <tr>
          <td style="padding:6px 0;font-size:14px;color:#6B7280;">Zwischensumme</td>
          <td style="padding:6px 0;font-size:14px;color:#1A1A1A;text-align:right;">${formatPrice(subtotal)}</td>
        </tr>
        ${couponDiscount > 0 ? `<tr>
          <td style="padding:6px 0;font-size:14px;color:#059669;">Rabatt (${escapeHtml(couponCode || "Gutschein")})</td>
          <td style="padding:6px 0;font-size:14px;color:#059669;text-align:right;font-weight:600;">-${formatPrice(couponDiscount)}</td>
        </tr>` : ""}
        <tr>
          <td style="padding:6px 0;font-size:14px;color:#6B7280;">Versand</td>
          <td style="padding:6px 0;font-size:14px;color:${shippingCost === 0 ? "#059669" : "#1A1A1A"};text-align:right;font-weight:${shippingCost === 0 ? "600" : "400"};">
            ${shippingCost === 0 ? "Kostenlos" : formatPrice(shippingCost)}
          </td>
        </tr>
        <tr>
          <td style="padding:16px 0 6px 0;font-size:16px;font-weight:700;color:#0A2540;border-top:2px solid #0A2540;">Gesamtbetrag</td>
          <td style="padding:16px 0 6px 0;font-size:16px;font-weight:700;color:#0A2540;text-align:right;border-top:2px solid #0A2540;">${formatPrice(total)}</td>
        </tr>
      </table>

      ${divider()}

      <!-- Payment Info -->
      <div style="padding:24px 0;">
        <p style="color:#6B7280;font-size:11px;margin:0 0 16px 0;text-transform:uppercase;letter-spacing:1px;font-weight:600;">Zahlungsinformationen</p>
        <div style="background-color:#FFF8F0;border:1px solid #FFE4CC;border-radius:12px;padding:20px;">
          <p style="color:#4B5563;font-size:13px;margin:0 0 12px 0;line-height:1.5;">
            Bitte \u00fcberweisen Sie den Gesamtbetrag innerhalb von <strong>5 Werktagen</strong> auf folgendes Konto:
          </p>
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td style="padding:4px 0;font-size:13px;color:#6B7280;">Empf\u00e4nger</td>
              <td style="padding:4px 0;font-size:13px;color:#0A2540;text-align:right;font-weight:600;">${escapeHtml(bank.accountName)}</td>
            </tr>
            <tr>
              <td style="padding:4px 0;font-size:13px;color:#6B7280;">IBAN</td>
              <td style="padding:4px 0;font-size:13px;color:#0A2540;text-align:right;font-weight:600;font-family:monospace;">${escapeHtml(bank.iban)}</td>
            </tr>
            <tr>
              <td style="padding:4px 0;font-size:13px;color:#6B7280;">BIC</td>
              <td style="padding:4px 0;font-size:13px;color:#0A2540;text-align:right;font-weight:600;font-family:monospace;">${escapeHtml(bank.bic)}</td>
            </tr>
            <tr>
              <td style="padding:8px 0 4px 0;font-size:13px;color:#6B7280;">Verwendungszweck</td>
              <td style="padding:8px 0 4px 0;font-size:14px;color:#D14A0C;text-align:right;font-weight:800;font-family:monospace;">${safeOrderNumber}</td>
            </tr>
          </table>
        </div>
      </div>

      <!-- CTA -->
      <div style="text-align:center;padding:8px 0 0 0;">
        <a href="${SITE}/bestellung/erfolg?order=${safeOrderNumber}" style="display:inline-block;background-color:#0A2540;color:#FFFFFF;font-size:14px;font-weight:700;text-decoration:none;padding:14px 32px;border-radius:10px;">
          Bestellung ansehen
        </a>
      </div>

    </div>
  `);

  return sendEmail({
    from: FROM_EMAIL,
    to: customerEmail,
    subject: `Bestellbest\u00e4tigung ${safeOrderNumber} \u2013 HAUSAURA`,
    html,
  });
}

// ─────────────────────────────────────────────
// 2. PAYMENT CONFIRMED
// ─────────────────────────────────────────────
export async function sendPaymentConfirmed(data: OrderEmailData) {
  const safeOrderNumber = escapeHtml(data.orderNumber);
  const safeName = escapeHtml(data.customerName);

  const html = baseTemplate(`
    ${headerBanner("Zahlung best\u00e4tigt", `Bestellung ${safeOrderNumber}`, "#059669")}

    <div style="padding:36px 40px;">

      <p style="color:#4B5563;font-size:15px;margin:0 0 24px 0;line-height:1.6;">
        Hallo <strong style="color:#0A2540;">${safeName}</strong>,
      </p>

      <!-- Success Card -->
      <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
        <tr>
          <td style="background-color:#F0FDF4;border:1px solid #BBF7D0;border-radius:12px;padding:24px;text-align:center;">
            <p style="font-size:32px;margin:0 0 8px 0;">&#x2705;</p>
            <p style="color:#059669;font-size:16px;font-weight:700;margin:0 0 4px 0;">Zahlung eingegangen</p>
            <p style="color:#6B7280;font-size:13px;margin:0;">Bestellung ${safeOrderNumber} wurde erfolgreich bezahlt.</p>
          </td>
        </tr>
      </table>

      <p style="color:#4B5563;font-size:14px;margin:0 0 24px 0;line-height:1.6;">
        Wir bereiten Ihre Bestellung nun zur Versendung vor. Sie erhalten eine weitere E-Mail, sobald Ihre Bestellung auf dem Weg zu Ihnen ist.
      </p>

      <div style="text-align:center;">
        <a href="${SITE}/bestellung/erfolg?order=${safeOrderNumber}" style="display:inline-block;background-color:#0A2540;color:#FFFFFF;font-size:14px;font-weight:700;text-decoration:none;padding:14px 32px;border-radius:10px;">
          Bestellung verfolgen
        </a>
      </div>

    </div>
  `);

  return sendEmail({
    from: FROM_EMAIL,
    to: data.customerEmail,
    subject: `Zahlung best\u00e4tigt ${safeOrderNumber} \u2013 HAUSAURA`,
    html,
  });
}

// ─────────────────────────────────────────────
// 3. SHIPPED CONFIRMATION
// ─────────────────────────────────────────────
export async function sendShippedConfirmation(
  data: OrderEmailData,
  trackingNumber: string
) {
  const safeOrderNumber = escapeHtml(data.orderNumber);
  const safeTracking = escapeHtml(trackingNumber);
  const safeName = escapeHtml(data.customerName);
  const trackingUrl = `https://www.dhl.de/de/privatkunden/pakete-empfangen/verfolgen.html?piececode=${encodeURIComponent(trackingNumber)}`;

  const html = baseTemplate(`
    ${headerBanner("Versandbest\u00e4tigung", `Bestellung ${safeOrderNumber} ist unterwegs`, "#1D4ED8")}

    <div style="padding:36px 40px;">

      <p style="color:#4B5563;font-size:15px;margin:0 0 24px 0;line-height:1.6;">
        Hallo <strong style="color:#0A2540;">${safeName}</strong>,<br/>
        Gute Nachrichten! Ihre Bestellung wurde versendet und ist auf dem Weg zu Ihnen.
      </p>

      <!-- Tracking Card -->
      <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
        <tr>
          <td style="background-color:#EFF6FF;border:1px solid #BFDBFE;border-radius:12px;padding:24px;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td>
                  <p style="color:#1D4ED8;font-size:11px;margin:0 0 4px 0;text-transform:uppercase;letter-spacing:1px;font-weight:600;">Sendungsverfolgung</p>
                  <p style="color:#0A2540;font-size:18px;font-weight:800;margin:0;font-family:monospace;">${safeTracking}</p>
                </td>
                <td align="right" valign="middle">
                  ${badge("Versendet", "#DBEAFE", "#1E40AF")}
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>

      <p style="color:#4B5563;font-size:14px;margin:0 0 24px 0;line-height:1.6;">
        Verfolgen Sie Ihre Sendung mit der obigen Nummer bei DHL. Die Lieferung erfolgt in der Regel innerhalb von 2\u20135 Werktagen.
      </p>

      <div style="text-align:center;">
        <a href="${trackingUrl}" style="display:inline-block;background-color:#1D4ED8;color:#FFFFFF;font-size:14px;font-weight:700;text-decoration:none;padding:14px 32px;border-radius:10px;">
          Sendung bei DHL verfolgen &#x2192;
        </a>
      </div>

    </div>
  `);

  return sendEmail({
    from: FROM_EMAIL,
    to: data.customerEmail,
    subject: `Ihre Bestellung wurde versendet ${safeOrderNumber} \u2013 HAUSAURA`,
    html,
  });
}

// ─────────────────────────────────────────────
// 4. ORDER CANCELLED
// ─────────────────────────────────────────────
export async function sendOrderCancelled(data: OrderEmailData) {
  const safeOrderNumber = escapeHtml(data.orderNumber);
  const safeName = escapeHtml(data.customerName);

  const html = baseTemplate(`
    ${headerBanner("Bestellung storniert", `Bestellung ${safeOrderNumber}`, "#DC2626")}

    <div style="padding:36px 40px;">

      <p style="color:#4B5563;font-size:15px;margin:0 0 24px 0;line-height:1.6;">
        Hallo <strong style="color:#0A2540;">${safeName}</strong>,
      </p>

      <p style="color:#4B5563;font-size:14px;margin:0 0 24px 0;line-height:1.6;">
        Ihre Bestellung <strong>${safeOrderNumber}</strong> wurde storniert.
      </p>

      <!-- Info Card -->
      <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
        <tr>
          <td style="background-color:#FEF2F2;border:1px solid #FECACA;border-radius:12px;padding:20px;">
            <p style="color:#DC2626;font-size:14px;font-weight:600;margin:0 0 4px 0;">Erstattung</p>
            <p style="color:#6B7280;font-size:13px;margin:0;line-height:1.5;">
              Falls Sie eine Zahlung geleistet haben, wird diese innerhalb von 3\u20135 Werktagen auf Ihr Konto zur\u00fcck\u00fcberwiesen.
            </p>
          </td>
        </tr>
      </table>

      <p style="color:#4B5563;font-size:14px;margin:0 0 8px 0;line-height:1.6;">
        Bei Fragen zu dieser Stornierung stehen wir Ihnen gerne zur Verf\u00fcgung:
      </p>

      <div style="text-align:center;padding:8px 0;">
        <a href="mailto:hilfe@HAUSAURA.de" style="display:inline-block;background-color:#0A2540;color:#FFFFFF;font-size:14px;font-weight:700;text-decoration:none;padding:14px 32px;border-radius:10px;">
          Kontakt aufnehmen
        </a>
      </div>

    </div>
  `);

  return sendEmail({
    from: FROM_EMAIL,
    to: data.customerEmail,
    subject: `Bestellung ${safeOrderNumber} storniert \u2013 HAUSAURA`,
    html,
  });
}

// ─────────────────────────────────────────────
// 5. CONTACT FORWARD (to admin)
// ─────────────────────────────────────────────
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
    ${headerBanner("Neue Kontaktanfrage", "Eingegangen \u00fcber das Kontaktformular")}

    <div style="padding:36px 40px;">

      <!-- Sender Card -->
      <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
        <tr>
          <td style="background-color:#F0F4F8;border-radius:12px;padding:20px;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="padding:3px 0;width:100px;font-size:13px;color:#6B7280;">Absender</td>
                <td style="padding:3px 0;font-size:13px;color:#0A2540;font-weight:600;">${safe.firstName} ${safe.lastName}</td>
              </tr>
              <tr>
                <td style="padding:3px 0;font-size:13px;color:#6B7280;">E-Mail</td>
                <td style="padding:3px 0;font-size:13px;color:#0A2540;font-weight:600;"><a href="mailto:${safe.email}" style="color:#0A2540;">${safe.email}</a></td>
              </tr>
              <tr>
                <td style="padding:3px 0;font-size:13px;color:#6B7280;">Betreff</td>
                <td style="padding:3px 0;font-size:13px;color:#0A2540;font-weight:600;">${safe.subject}</td>
              </tr>
            </table>
          </td>
        </tr>
      </table>

      ${divider()}

      <!-- Message -->
      <div style="padding:24px 0;">
        <p style="color:#6B7280;font-size:11px;margin:0 0 12px 0;text-transform:uppercase;letter-spacing:1px;font-weight:600;">Nachricht</p>
        <div style="background-color:#F9FAFB;border-left:3px solid #D14A0C;padding:16px 20px;border-radius:0 8px 8px 0;">
          <p style="color:#374151;font-size:14px;margin:0;line-height:1.7;white-space:pre-wrap;">${safe.message}</p>
        </div>
      </div>

      <div style="text-align:center;padding:8px 0;">
        <a href="mailto:${safe.email}?subject=Re: ${encodeURIComponent(safe.subject)}" style="display:inline-block;background-color:#0A2540;color:#FFFFFF;font-size:14px;font-weight:700;text-decoration:none;padding:14px 32px;border-radius:10px;">
          Antworten
        </a>
      </div>

    </div>
  `);

  return sendEmail({
    from: FROM_EMAIL,
    to: "hilfe@HAUSAURA.de",
    subject: `[Kontakt] ${safe.subject}`,
    html,
  });
}

// ─────────────────────────────────────────────
// 6. CONTACT AUTO-REPLY (to customer)
// ─────────────────────────────────────────────
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
    ${headerBanner("Vielen Dank f\u00fcr Ihre Nachricht!", "Wir melden uns bei Ihnen")}

    <div style="padding:36px 40px;">

      <p style="color:#4B5563;font-size:15px;margin:0 0 24px 0;line-height:1.6;">
        Hallo <strong style="color:#0A2540;">${safe.firstName} ${safe.lastName}</strong>,
      </p>

      <p style="color:#4B5563;font-size:14px;margin:0 0 24px 0;line-height:1.6;">
        vielen Dank f\u00fcr Ihre Nachricht! Wir haben Ihre Anfrage erhalten und melden uns innerhalb von <strong>24 Stunden</strong> bei Ihnen.
      </p>

      <!-- Info Card -->
      <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
        <tr>
          <td style="background-color:#F0F4F8;border-radius:12px;padding:20px;text-align:center;">
            <p style="color:#6B7280;font-size:12px;margin:0 0 4px 0;text-transform:uppercase;letter-spacing:1px;font-weight:600;">Antwortzeit</p>
            <p style="color:#0A2540;font-size:18px;font-weight:800;margin:0;">Innerhalb von 24 Stunden</p>
          </td>
        </tr>
      </table>

      <p style="color:#4B5563;font-size:14px;margin:0 0 24px 0;line-height:1.6;">
        In der Zwischenzeit k\u00f6nnen Sie auch unsere <a href="${SITE}/kontakt#faq" style="color:#D14A0C;text-decoration:underline;">H\u00e4ufig gestellten Fragen</a> besuchen.
      </p>

      <div style="text-align:center;padding:8px 0;">
        <a href="${SITE}" style="display:inline-block;background-color:#0A2540;color:#FFFFFF;font-size:14px;font-weight:700;text-decoration:none;padding:14px 32px;border-radius:10px;">
          Zur\u00fcck zum Shop
        </a>
      </div>

    </div>
  `);

  return sendEmail({
    from: FROM_EMAIL,
    to: data.email,
    subject: "Ihre Nachricht bei HAUSAURA",
    html,
  });
}

// ─────────────────────────────────────────────
// 7. NEWSLETTER CONFIRMATION
// ─────────────────────────────────────────────
export async function sendNewsletterConfirmation(email: string, confirmToken: string) {
  const confirmUrl = `${SITE_URL}/api/newsletter/confirm?token=${encodeURIComponent(confirmToken)}`;

  const html = baseTemplate(`
    ${headerBanner("Newsletter best\u00e4tigen", "Einen Schritt zum Empfang")}

    <div style="padding:36px 40px;">

      <p style="color:#4B5563;font-size:15px;margin:0 0 24px 0;line-height:1.6;">
        Hallo!
      </p>

      <p style="color:#4B5563;font-size:14px;margin:0 0 24px 0;line-height:1.6;">
        Vielen Dank f\u00fcr Ihre Anmeldung zu unserem Newsletter. Bitte best\u00e4tigen Sie Ihre E-Mail-Adresse, um den Newsletter zu erhalten.
      </p>

      <div style="text-align:center;padding:16px 0 24px 0;">
        <a href="${confirmUrl}" style="display:inline-block;background-color:#D14A0C;color:#FFFFFF;font-size:15px;font-weight:700;text-decoration:none;padding:16px 40px;border-radius:10px;">
          E-Mail best\u00e4tigen
        </a>
      </div>

      <div style="border-top:1px solid #E8ECF1;padding-top:20px;">
        <p style="color:#9CA3AF;font-size:12px;margin:0;line-height:1.5;">
          Dieser Link ist 24 Stunden g\u00fcltig. Wenn Sie sich nicht f\u00fcr den HAUSAURA Newsletter angemeldet haben, k\u00f6nnen Sie diese E-Mail ignorieren.
        </p>
      </div>

    </div>
  `);

  return sendEmail({
    from: FROM_EMAIL,
    to: email,
    subject: "Newsletter best\u00e4tigen \u2013 HAUSAURA",
    html,
  });
}

// ─────────────────────────────────────────────
// 8. PASSWORD RESET
// ─────────────────────────────────────────────
export async function sendPasswordResetEmail(
  email: string,
  name: string,
  token: string
) {
  const resetUrl = `${SITE_URL}/passwort-zuruecksetzen?token=${encodeURIComponent(token)}`;
  const safeName = escapeHtml(name);

  const html = baseTemplate(`
    ${headerBanner("Passwort zurücksetzen", "Ihre Anfrage zur Passwortänderung")}

    <div style="padding:36px 40px;">

      <p style="color:#4B5563;font-size:15px;margin:0 0 24px 0;line-height:1.6;">
        Hallo <strong style="color:#0A2540;">${safeName}</strong>,
      </p>

      <p style="color:#4B5563;font-size:14px;margin:0 0 24px 0;line-height:1.6;">
        Wir haben eine Anfrage zum Zurücksetzen Ihres Passworts erhalten. Klicken Sie auf den folgenden Button, um ein neues Passwort festzulegen:
      </p>

      <div style="text-align:center;padding:16px 0 24px 0;">
        <a href="${resetUrl}" style="display:inline-block;background-color:#D14A0C;color:#FFFFFF;font-size:15px;font-weight:700;text-decoration:none;padding:16px 40px;border-radius:10px;">
          Passwort zurücksetzen
        </a>
      </div>

      <div style="border-top:1px solid #E8ECF1;padding-top:20px;">
        <p style="color:#9CA3AF;font-size:12px;margin:0;line-height:1.5;">
          Dieser Link ist <strong>1 Stunde</strong> gültig. Wenn Sie Ihr Passwort nicht zurücksetzen wollten, können Sie diese E-Mail ignorieren.
        </p>
      </div>

    </div>
  `);

  return sendEmail({
    from: FROM_EMAIL,
    to: email,
    subject: "Passwort zurücksetzen \u2013 HAUSAURA",
    html,
  });
}

// ─────────────────────────────────────────────
// 9. NEWSLETTER CAMPAIGN
// ─────────────────────────────────────────────
export async function sendNewsletterCampaign(data: {
  subject: string;
  content: string;
  emails: string[];
}) {
  const campaignKey = `newsletter-campaign:${data.subject}:${data.emails.length}`;
  const now = Date.now();
  for (const [key, timestamp] of activeCampaigns) {
    if (now - timestamp > 5 * 60_000) activeCampaigns.delete(key);
  }
  if (activeCampaigns.has(campaignKey)) {
    throw new Error("Eine Newsletter-Kampagne wird gerade bereits versendet. Bitte warten Sie.");
  }
  activeCampaigns.set(campaignKey, now);

  try {
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
            ${headerBanner(safeSubject, "HAUSAURA Newsletter")}

            <div style="padding:36px 40px;">

              <div style="color:#4B5563;font-size:15px;line-height:1.7;">
                ${safeContent}
              </div>

              ${divider()}

              <div style="padding:20px 0 0 0;text-align:center;">
                <a href="${SITE}" style="display:inline-block;background-color:#D14A0C;color:#FFFFFF;font-size:14px;font-weight:700;text-decoration:none;padding:14px 32px;border-radius:10px;">
                  Jetzt entdecken
                </a>
              </div>

              <div style="padding:20px 0 0 0;text-align:center;">
                <p style="color:#9CA3AF;font-size:12px;margin:0;">
                  Sie erhalten diese E-Mail, weil Sie sich f\u00fcr unseren Newsletter angemeldet haben.
                  <a href="${unsubscribeUrl}" style="color:#D14A0C;text-decoration:underline;">Abmelden</a>
                </p>
              </div>

            </div>
          `);

          return sendEmail({
            from: FROM_EMAIL,
            to: email,
            subject: `${data.subject} \u2013 HAUSAURA`,
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
  } finally {
    activeCampaigns.delete(campaignKey);
  }
}

export async function sendEmailVerification(data: {
  to: string;
  name: string;
  verificationUrl: string;
}) {
  const safeName = escapeHtml(data.name);

  const html = baseTemplate(`
    ${headerBanner("E-Mail verifizieren", "Bestätigen Sie Ihre E-Mail-Adresse")}

    <div style="padding:36px 40px;">

      <p style="color:#4B5563;font-size:15px;margin:0 0 24px 0;line-height:1.6;">
        Hallo <strong style="color:#0A2540;">${safeName}</strong>,
      </p>

      <p style="color:#4B5563;font-size:14px;margin:0 0 24px 0;line-height:1.6;">
        Vielen Dank für Ihre Registrierung bei HAUSAURA. Klicken Sie auf den folgenden Button, um Ihre E-Mail-Adresse zu verifizieren:
      </p>

      <div style="text-align:center;padding:16px 0 24px 0;">
        <a href="${data.verificationUrl}" style="display:inline-block;background-color:#D14A0C;color:#FFFFFF;font-size:15px;font-weight:700;text-decoration:none;padding:16px 40px;border-radius:10px;">
          E-Mail verifizieren
        </a>
      </div>

      <div style="border-top:1px solid #E8ECF1;padding-top:20px;">
        <p style="color:#9CA3AF;font-size:12px;margin:0;line-height:1.5;">
          Dieser Link ist <strong>24 Stunden</strong> gültig. Wenn Sie sich nicht bei HAUSAURA registriert haben, können Sie diese E-Mail ignorieren.
        </p>
      </div>

    </div>
  `);

  return sendEmail({
    from: FROM_EMAIL,
    to: data.to,
    subject: "E-Mail verifizieren \u2013 HAUSAURA",
    html,
  });
}

// ─────────────────────────────────────────────
// 11. NEW ORDER ADMIN NOTIFICATION
// ─────────────────────────────────────────────
interface AdminOrderNotificationData {
  orderNumber: string;
  customerEmail: string;
  customerName: string;
  customerAddress: string;
  customerCity: string;
  customerZip: string;
  items: { name: string; quantity: number; price: number }[];
  subtotal: number;
  couponDiscount: number;
  total: number;
  shippingCost: number;
}

export async function sendNewOrderAdminNotification(data: AdminOrderNotificationData) {
  const settings = await prisma.siteSettings.findFirst();
  const adminEmail = settings?.contactEmail || "hilfe@HAUSAURA.de";

  const safeOrderNumber = escapeHtml(data.orderNumber);
  const safeName = escapeHtml(data.customerName);
  const safeEmail = escapeHtml(data.customerEmail);
  const safeAddress = escapeHtml(data.customerAddress);
  const safeCity = escapeHtml(data.customerCity);
  const safeZip = escapeHtml(data.customerZip);

  const html = baseTemplate(`
    ${headerBanner("Neue Bestellung", `Bestellung ${safeOrderNumber} eingegangen`, "#D14A0C")}

    <div style="padding:36px 40px;">

      <p style="color:#4B5563;font-size:15px;margin:0 0 24px 0;line-height:1.6;">
        Eine neue Bestellung wurde auf HAUSAURA aufgegeben.
      </p>

      <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
        <tr>
          <td style="background-color:#F0F4F8;border-radius:12px;padding:20px 24px;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td>
                  <p style="color:#6B7280;font-size:11px;margin:0;text-transform:uppercase;letter-spacing:1px;font-weight:600;">Bestellnummer</p>
                  <p style="color:#0A2540;font-size:20px;font-weight:800;margin:6px 0 0 0;letter-spacing:-0.5px;">${safeOrderNumber}</p>
                </td>
                <td align="right" valign="top">
                  ${badge("Ausstehend", "#FEF3C7", "#92400E")}
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>

      ${divider()}

      <div style="padding:24px 0;">
        <p style="color:#6B7280;font-size:11px;margin:0 0 16px 0;text-transform:uppercase;letter-spacing:1px;font-weight:600;">Kunde</p>
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="padding:3px 0;width:100px;font-size:13px;color:#6B7280;">Name</td>
            <td style="padding:3px 0;font-size:13px;color:#0A2540;font-weight:600;">${safeName}</td>
          </tr>
          <tr>
            <td style="padding:3px 0;font-size:13px;color:#6B7280;">E-Mail</td>
            <td style="padding:3px 0;font-size:13px;color:#0A2540;font-weight:600;"><a href="mailto:${safeEmail}" style="color:#0A2540;">${safeEmail}</a></td>
          </tr>
          <tr>
            <td style="padding:3px 0;font-size:13px;color:#6B7280;">Adresse</td>
            <td style="padding:3px 0;font-size:13px;color:#0A2540;font-weight:600;">${safeAddress}, ${safeZip} ${safeCity}</td>
          </tr>
        </table>
      </div>

      ${divider()}

      <div style="padding:24px 0;">
        <p style="color:#6B7280;font-size:11px;margin:0 0 16px 0;text-transform:uppercase;letter-spacing:1px;font-weight:600;">Bestellte Artikel</p>
        <table width="100%" cellpadding="0" cellspacing="0">
          ${orderItemsTable(data.items)}
        </table>
      </div>

      <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:8px;">
        <tr>
          <td style="padding:6px 0;font-size:14px;color:#6B7280;">Zwischensumme</td>
          <td style="padding:6px 0;font-size:14px;color:#1A1A1A;text-align:right;">${formatPrice(data.subtotal)}</td>
        </tr>
        ${data.couponDiscount > 0 ? `<tr>
          <td style="padding:6px 0;font-size:14px;color:#059669;">Rabatt</td>
          <td style="padding:6px 0;font-size:14px;color:#059669;text-align:right;font-weight:600;">-${formatPrice(data.couponDiscount)}</td>
        </tr>` : ""}
        <tr>
          <td style="padding:6px 0;font-size:14px;color:#6B7280;">Versand</td>
          <td style="padding:6px 0;font-size:14px;color:#1A1A1A;text-align:right;">${formatPrice(data.shippingCost)}</td>
        </tr>
        <tr>
          <td style="padding:16px 0 6px 0;font-size:16px;font-weight:700;color:#0A2540;border-top:2px solid #0A2540;">Gesamtbetrag</td>
          <td style="padding:16px 0 6px 0;font-size:16px;font-weight:700;color:#0A2540;text-align:right;border-top:2px solid #0A2540;">${formatPrice(data.total)}</td>
        </tr>
      </table>

      <div style="text-align:center;padding:16px 0 0 0;">
        <a href="${SITE}/admin/bestellungen" style="display:inline-block;background-color:#0A2540;color:#FFFFFF;font-size:14px;font-weight:700;text-decoration:none;padding:14px 32px;border-radius:10px;">
          Bestellung im Admin ansehen
        </a>
      </div>

    </div>
  `);

  return sendEmail({
    from: FROM_EMAIL,
    to: adminEmail,
    subject: `[Neue Bestellung] ${safeOrderNumber} \u2013 HAUSAURA`,
    html,
  });
}

// ─────────────────────────────────────────────
// 12. PAYMENT REMINDER
// ─────────────────────────────────────────────
interface PaymentReminderData {
  orderNumber: string;
  customerEmail: string;
  customerName: string;
  total: number;
  createdAt: string;
  reminderCount: number;
}

export async function sendPaymentReminder(data: PaymentReminderData) {
  const bank = await getBankDetails();
  const safeOrderNumber = escapeHtml(data.orderNumber);
  const safeName = escapeHtml(data.customerName);

  const daysSinceOrder = Math.floor(
    (Date.now() - new Date(data.createdAt).getTime()) / (1000 * 60 * 60 * 24)
  );

  const html = baseTemplate(`
    ${headerBanner("Zahlungserinnerung", `Bestellung ${safeOrderNumber}`, "#D97706")}

    <div style="padding:36px 40px;">

      <p style="color:#4B5563;font-size:15px;margin:0 0 24px 0;line-height:1.6;">
        Hallo <strong style="color:#0A2540;">${safeName}</strong>,
      </p>

      <p style="color:#4B5563;font-size:14px;margin:0 0 24px 0;line-height:1.6;">
        wir haben Ihre Bestellung <strong>${safeOrderNumber}</strong> vom ${new Date(data.createdAt).toLocaleDateString("de-DE")} noch nicht als bezahlt erhalten. Bitte begleichen Sie den Gesamtbetrag innerhalb von <strong>5 Werktagen</strong>.
      </p>

      <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
        <tr>
          <td style="background-color:#FFFBEB;border:1px solid #FDE68A;border-radius:12px;padding:20px;">
            <p style="color:#92400E;font-size:14px;font-weight:600;margin:0 0 8px 0;">Ausstehende Zahlung</p>
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="padding:3px 0;font-size:13px;color:#6B7280;">Betrag</td>
                <td style="padding:3px 0;font-size:13px;color:#92400E;text-align:right;font-weight:700;">${formatPrice(data.total)}</td>
              </tr>
              <tr>
                <td style="padding:3px 0;font-size:13px;color:#6B7280;">Bestellt seit</td>
                <td style="padding:3px 0;font-size:13px;color:#92400E;text-align:right;font-weight:600;">${daysSinceOrder} Tagen</td>
              </tr>
            </table>
          </td>
        </tr>
      </table>

      ${divider()}

      <div style="padding:24px 0;">
        <p style="color:#6B7280;font-size:11px;margin:0 0 16px 0;text-transform:uppercase;letter-spacing:1px;font-weight:600;">Zahlungsinformationen</p>
        <div style="background-color:#F0F4F8;border-radius:12px;padding:20px;">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td style="padding:4px 0;font-size:13px;color:#6B7280;">Empfänger</td>
              <td style="padding:4px 0;font-size:13px;color:#0A2540;text-align:right;font-weight:600;">${escapeHtml(bank.accountName)}</td>
            </tr>
            <tr>
              <td style="padding:4px 0;font-size:13px;color:#6B7280;">IBAN</td>
              <td style="padding:4px 0;font-size:13px;color:#0A2540;text-align:right;font-weight:600;font-family:monospace;">${escapeHtml(bank.iban)}</td>
            </tr>
            <tr>
              <td style="padding:4px 0;font-size:13px;color:#6B7280;">BIC</td>
              <td style="padding:4px 0;font-size:13px;color:#0A2540;text-align:right;font-weight:600;font-family:monospace;">${escapeHtml(bank.bic)}</td>
            </tr>
            <tr>
              <td style="padding:8px 0 4px 0;font-size:13px;color:#6B7280;">Verwendungszweck</td>
              <td style="padding:8px 0 4px 0;font-size:14px;color:#D14A0C;text-align:right;font-weight:800;font-family:monospace;">${safeOrderNumber}</td>
            </tr>
          </table>
        </div>
      </div>

      <div style="text-align:center;padding:8px 0;">
        <a href="${SITE}/bestellung/erfolg?order=${safeOrderNumber}" style="display:inline-block;background-color:#0A2540;color:#FFFFFF;font-size:14px;font-weight:700;text-decoration:none;padding:14px 32px;border-radius:10px;">
          Bestellung ansehen
        </a>
      </div>

    </div>
  `);

  return sendEmail({
    from: FROM_EMAIL,
    to: data.customerEmail,
    subject: `Zahlungserinnerung ${safeOrderNumber} \u2013 HAUSAURA`,
    html,
  });
}

// ─────────────────────────────────────────────
// 13. PAYMENT RECEIPT (after admin validates)
// ─────────────────────────────────────────────
interface PaymentReceiptData {
  orderNumber: string;
  invoiceNumber: string;
  customerEmail: string;
  customerName: string;
  customerAddress: string;
  customerCity: string;
  customerZip: string;
  customerCountry: string;
  items: { name: string; quantity: number; price: number }[];
  subtotal: number;
  couponDiscount: number;
  total: number;
  shippingCost: number;
  paidAt: string;
}

export async function sendPaymentReceipt(data: PaymentReceiptData) {
  const safeOrderNumber = escapeHtml(data.orderNumber);
  const safeInvoice = escapeHtml(data.invoiceNumber);
  const safeName = escapeHtml(data.customerName);
  const safeAddress = escapeHtml(data.customerAddress);
  const safeCity = escapeHtml(data.customerCity);
  const safeZip = escapeHtml(data.customerZip);

  const html = baseTemplate(`
    ${headerBanner("Zahlungsbestätigung", `Rechnung ${safeInvoice}`, "#059669")}

    <div style="padding:36px 40px;">

      <p style="color:#4B5563;font-size:15px;margin:0 0 24px 0;line-height:1.6;">
        Hallo <strong style="color:#0A2540;">${safeName}</strong>,
      </p>

      <p style="color:#4B5563;font-size:14px;margin:0 0 24px 0;line-height:1.6;">
        wir haben Ihre Zahlung für Bestellung <strong>${safeOrderNumber}</strong> erhalten und bestätigt. Vielen Dank!
      </p>

      <!-- Success Card -->
      <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
        <tr>
          <td style="background-color:#ECFDF5;border:1px solid #A7F3D0;border-radius:12px;padding:20px 24px;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td>
                  <p style="color:#065F46;font-size:11px;margin:0;text-transform:uppercase;letter-spacing:1px;font-weight:600;">Zahlung bestätigt</p>
                  <p style="color:#059669;font-size:18px;font-weight:800;margin:6px 0 0 0;">${formatPrice(data.total)}</p>
                </td>
                <td align="right" valign="top">
                  ${badge("Bezahlt", "#D1FAE5", "#065F46")}
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>

      ${divider()}

      <!-- Invoice Details -->
      <div style="padding:24px 0;">
        <p style="color:#6B7280;font-size:11px;margin:0 0 16px 0;text-transform:uppercase;letter-spacing:1px;font-weight:600;">Rechnungsdetails</p>
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="padding:3px 0;width:140px;font-size:13px;color:#6B7280;">Rechnungsnummer</td>
            <td style="padding:3px 0;font-size:13px;color:#0A2540;font-weight:700;font-family:monospace;">${safeInvoice}</td>
          </tr>
          <tr>
            <td style="padding:3px 0;font-size:13px;color:#6B7280;">Bestellnummer</td>
            <td style="padding:3px 0;font-size:13px;color:#0A2540;font-weight:600;font-family:monospace;">${safeOrderNumber}</td>
          </tr>
          <tr>
            <td style="padding:3px 0;font-size:13px;color:#6B7280;">Zahlungsdatum</td>
            <td style="padding:3px 0;font-size:13px;color:#0A2540;font-weight:600;">${new Date(data.paidAt).toLocaleDateString("de-DE")}</td>
          </tr>
          <tr>
            <td style="padding:3px 0;font-size:13px;color:#6B7280;">Rechnungsadresse</td>
            <td style="padding:3px 0;font-size:13px;color:#0A2540;font-weight:600;">${safeName}<br/>${safeAddress}<br/>${safeZip} ${safeCity}</td>
          </tr>
        </table>
      </div>

      ${divider()}

      <!-- Items -->
      <div style="padding:24px 0;">
        <p style="color:#6B7280;font-size:11px;margin:0 0 16px 0;text-transform:uppercase;letter-spacing:1px;font-weight:600;">Bestellte Artikel</p>
        <table width="100%" cellpadding="0" cellspacing="0">
          ${orderItemsTable(data.items)}
        </table>
      </div>

      <!-- Totals -->
      <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:8px;">
        <tr>
          <td style="padding:6px 0;font-size:14px;color:#6B7280;">Zwischensumme</td>
          <td style="padding:6px 0;font-size:14px;color:#1A1A1A;text-align:right;">${formatPrice(data.subtotal)}</td>
        </tr>
        ${data.couponDiscount > 0 ? `<tr>
          <td style="padding:6px 0;font-size:14px;color:#059669;">Rabatt</td>
          <td style="padding:6px 0;font-size:14px;color:#059669;text-align:right;font-weight:600;">-${formatPrice(data.couponDiscount)}</td>
        </tr>` : ""}
        <tr>
          <td style="padding:6px 0;font-size:14px;color:#6B7280;">Versand</td>
          <td style="padding:6px 0;font-size:14px;color:#1A1A1A;text-align:right;">${formatPrice(data.shippingCost)}</td>
        </tr>
        <tr>
          <td style="padding:16px 0 6px 0;font-size:16px;font-weight:700;color:#059669;border-top:2px solid #059669;">Gezahlt</td>
          <td style="padding:16px 0 6px 0;font-size:16px;font-weight:700;color:#059669;text-align:right;border-top:2px solid #059669;">${formatPrice(data.total)}</td>
        </tr>
      </table>

      <div style="background-color:#F0F4F8;border-radius:12px;padding:20px;margin-top:24px;">
        <p style="color:#6B7280;font-size:13px;margin:0;line-height:1.6;">
          Diese E-Mail dient als Ihre Zahlungsbestätigung und Rechnung. Bitte bewahren Sie diese Aufzeichnung auf.
        </p>
      </div>

      <div style="text-align:center;padding:16px 0 0 0;">
        <a href="${SITE}/bestellung/erfolg?order=${safeOrderNumber}" style="display:inline-block;background-color:#0A2540;color:#FFFFFF;font-size:14px;font-weight:700;text-decoration:none;padding:14px 32px;border-radius:10px;">
          Bestellung ansehen
        </a>
      </div>

    </div>
  `);

  return sendEmail({
    from: FROM_EMAIL,
    to: data.customerEmail,
    subject: `Zahlungsbestätigung ${safeOrderNumber} \u2013 HAUSAURA`,
    html,
  });
}
