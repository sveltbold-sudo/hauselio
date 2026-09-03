import { FROM_EMAIL } from "@/lib/resend";
import { formatPrice } from "@/lib/utils";
import { escapeHtml } from "@/lib/html";
import { SITE_URL } from "@/lib/constants";
import {
  sendEmail,
  baseTemplate,
  headerBanner,
  badge,
  divider,
  orderItemsTable,
  getBankDetails,
  type OrderEmailData,
} from "./helpers";

const SITE = SITE_URL.startsWith("http") ? SITE_URL : `https://${SITE_URL}`;

export interface AdminOrderNotificationData {
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

export interface PaymentReminderData {
  orderNumber: string;
  customerEmail: string;
  customerName: string;
  total: number;
  createdAt: string;
  reminderCount: number;
}

export interface PaymentReceiptData {
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
  companyName: string;
  companyAddress: string;
  vatId: string;
  defaultVatRate: number;
}

export async function sendOrderConfirmation(data: OrderEmailData) {
  const { orderNumber, customerEmail, customerName, items, subtotal, couponDiscount, couponCode, total, shippingCost } = data;
  const bank = await getBankDetails();
  const safeName = escapeHtml(customerName);
  const safeOrderNumber = escapeHtml(orderNumber);

  const html = baseTemplate(`
    ${headerBanner("Bestellbest\u00e4tigung", `Bestellung ${safeOrderNumber} erfolgreich eingegangen`)}

    <div style="padding:36px 40px;">
      <p style="color:#4B5563;font-size:15px;margin:0 0 24px 0;line-height:1.6;">
        Hallo <strong style="color:#0A2540;">${safeName}</strong>,<br/>
        vielen Dank f\u00fcr Ihre Bestellung bei HAUSAURA! Wir haben Ihre Bestellung erhalten und bearbeiten diese jetzt.
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
                  ${badge("Offen", "#FEF3C7", "#92400E")}
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>

      ${divider()}

      <div style="padding:24px 0;">
        <p style="color:#6B7280;font-size:11px;margin:0 0 16px 0;text-transform:uppercase;letter-spacing:1px;font-weight:600;">Bestellte Artikel</p>
        <table width="100%" cellpadding="0" cellspacing="0">
          ${orderItemsTable(items)}
        </table>
      </div>

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

export async function sendPaymentConfirmed(data: OrderEmailData) {
  const safeOrderNumber = escapeHtml(data.orderNumber);
  const safeName = escapeHtml(data.customerName);

  const html = baseTemplate(`
    ${headerBanner("Zahlung best\u00e4tigt", `Bestellung ${safeOrderNumber}`, "#059669")}
    <div style="padding:36px 40px;">
      <p style="color:#4B5563;font-size:15px;margin:0 0 24px 0;line-height:1.6;">
        Hallo <strong style="color:#0A2540;">${safeName}</strong>,
      </p>
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

export async function sendShippedConfirmation(data: OrderEmailData, trackingNumber: string) {
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

export async function sendNewOrderAdminNotification(data: AdminOrderNotificationData) {
  const { prisma } = await import("@/lib/prisma");
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

export async function sendPaymentReceipt(data: PaymentReceiptData) {
  const safeOrderNumber = escapeHtml(data.orderNumber);
  const safeInvoice = escapeHtml(data.invoiceNumber);
  const safeName = escapeHtml(data.customerName);
  const safeAddress = escapeHtml(data.customerAddress);
  const safeCity = escapeHtml(data.customerCity);
  const safeZip = escapeHtml(data.customerZip);
  const safeCompanyName = escapeHtml(data.companyName);
  const safeCompanyAddress = escapeHtml(data.companyAddress);
  const safeVatId = escapeHtml(data.vatId);

  const vatRate = data.defaultVatRate;
  const netTotal = data.subtotal - data.couponDiscount + data.shippingCost;
  const vatAmount = netTotal * (vatRate / (100 + vatRate));
  const netBeforeVat = netTotal - vatAmount;

  const html = baseTemplate(`
    ${headerBanner("Zahlungsbest\u00e4tigung", `Rechnung ${safeInvoice}`, "#059669")}
    <div style="padding:36px 40px;">
      <p style="color:#4B5563;font-size:15px;margin:0 0 24px 0;line-height:1.6;">
        Hallo <strong style="color:#0A2540;">${safeName}</strong>,
      </p>
      <p style="color:#4B5563;font-size:14px;margin:0 0 24px 0;line-height:1.6;">
        wir haben Ihre Zahlung f\u00fcr Bestellung <strong>${safeOrderNumber}</strong> erhalten und best\u00e4tigt. Vielen Dank!
      </p>
      <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
        <tr>
          <td style="background-color:#ECFDF5;border:1px solid #A7F3D0;border-radius:12px;padding:20px 24px;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td>
                  <p style="color:#065F46;font-size:11px;margin:0;text-transform:uppercase;letter-spacing:1px;font-weight:600;">Zahlung best\u00e4tigt</p>
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
      <div style="padding:24px 0;">
        <p style="color:#6B7280;font-size:11px;margin:0 0 16px 0;text-transform:uppercase;letter-spacing:1px;font-weight:600;">Aussteller</p>
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="padding:3px 0;width:140px;font-size:13px;color:#6B7280;">Firma</td>
            <td style="padding:3px 0;font-size:13px;color:#0A2540;font-weight:600;">${safeCompanyName}</td>
          </tr>
          <tr>
            <td style="padding:3px 0;font-size:13px;color:#6B7280;">Adresse</td>
            <td style="padding:3px 0;font-size:13px;color:#0A2540;font-weight:600;">${safeCompanyAddress}</td>
          </tr>
          ${safeVatId ? `<tr>
            <td style="padding:3px 0;font-size:13px;color:#6B7280;">USt-IdNr.</td>
            <td style="padding:3px 0;font-size:13px;color:#0A2540;font-weight:600;font-family:monospace;">${safeVatId}</td>
          </tr>` : ""}
        </table>
      </div>
      ${divider()}
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
      <div style="padding:24px 0;">
        <p style="color:#6B7280;font-size:11px;margin:0 0 16px 0;text-transform:uppercase;letter-spacing:1px;font-weight:600;">Bestellte Artikel</p>
        <table width="100%" cellpadding="0" cellspacing="0">
          ${orderItemsTable(data.items)}
        </table>
      </div>
      <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:8px;">
        <tr>
          <td style="padding:6px 0;font-size:14px;color:#6B7280;">Zwischensumme (netto)</td>
          <td style="padding:6px 0;font-size:14px;color:#1A1A1A;text-align:right;">${formatPrice(netBeforeVat)}</td>
        </tr>
        ${data.couponDiscount > 0 ? `<tr>
          <td style="padding:6px 0;font-size:14px;color:#059669;">Rabatt</td>
          <td style="padding:6px 0;font-size:14px;color:#059669;text-align:right;font-weight:600;">-${formatPrice(data.couponDiscount)}</td>
        </tr>` : ""}
        <tr>
          <td style="padding:6px 0;font-size:14px;color:#6B7280;">Versand (netto)</td>
          <td style="padding:6px 0;font-size:14px;color:#1A1A1A;text-align:right;">${formatPrice(data.shippingCost > 0 ? data.shippingCost / (1 + vatRate / 100) : 0)}</td>
        </tr>
        <tr>
          <td style="padding:6px 0;font-size:14px;color:#6B7280;">MwSt. (${vatRate}%)</td>
          <td style="padding:6px 0;font-size:14px;color:#1A1A1A;text-align:right;">${formatPrice(vatAmount)}</td>
        </tr>
        <tr>
          <td style="padding:16px 0 6px 0;font-size:16px;font-weight:700;color:#059669;border-top:2px solid #059669;">Gezahlt (brutto)</td>
          <td style="padding:16px 0 6px 0;font-size:16px;font-weight:700;color:#059669;text-align:right;border-top:2px solid #059669;">${formatPrice(data.total)}</td>
        </tr>
      </table>
      <div style="background-color:#F0F4F8;border-radius:12px;padding:20px;margin-top:24px;">
        <p style="color:#6B7280;font-size:13px;margin:0;line-height:1.6;">
          Diese E-Mail dient als Ihre Zahlungsbest\u00e4tigung und Rechnung gem\u00e4\u00df \u00a714 UStG. Bitte bewahren Sie diese Aufzeichnung auf.
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
    subject: `Zahlungsbest\u00e4tigung ${safeOrderNumber} \u2013 HAUSAURA`,
    html,
  });
}
