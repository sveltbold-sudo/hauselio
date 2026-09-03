import { FROM_EMAIL } from "@/lib/resend";
import { escapeHtml } from "@/lib/html";
import { SITE_URL } from "@/lib/constants";
import { sendEmail, baseTemplate, headerBanner, divider } from "./helpers";

const SITE = SITE_URL.startsWith("http") ? SITE_URL : `https://${SITE_URL}`;

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
