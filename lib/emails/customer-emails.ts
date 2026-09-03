import { FROM_EMAIL } from "@/lib/resend";
import { escapeHtml } from "@/lib/html";
import { SITE_URL } from "@/lib/constants";
import { sendEmail, baseTemplate, headerBanner } from "./helpers";

const SITE = SITE_URL.startsWith("http") ? SITE_URL : `https://${SITE_URL}`;

export async function sendPasswordResetEmail(email: string, name: string, token: string) {
  const resetUrl = `${SITE_URL}/passwort-zuruecksetzen?token=${encodeURIComponent(token)}`;
  const safeName = escapeHtml(name);

  const html = baseTemplate(`
    ${headerBanner("Passwort zur\u00fccksetzen", "Ihre Anfrage zur Passwort\u00e4nderung")}
    <div style="padding:36px 40px;">
      <p style="color:#4B5563;font-size:15px;margin:0 0 24px 0;line-height:1.6;">
        Hallo <strong style="color:#0A2540;">${safeName}</strong>,
      </p>
      <p style="color:#4B5563;font-size:14px;margin:0 0 24px 0;line-height:1.6;">
        Wir haben eine Anfrage zum Zur\u00fccksetzen Ihres Passworts erhalten. Klicken Sie auf den folgenden Button, um ein neues Passwort festzulegen:
      </p>
      <div style="text-align:center;padding:16px 0 24px 0;">
        <a href="${resetUrl}" style="display:inline-block;background-color:#D14A0C;color:#FFFFFF;font-size:15px;font-weight:700;text-decoration:none;padding:16px 40px;border-radius:10px;">
          Passwort zur\u00fccksetzen
        </a>
      </div>
      <div style="border-top:1px solid #E8ECF1;padding-top:20px;">
        <p style="color:#9CA3AF;font-size:12px;margin:0;line-height:1.5;">
          Dieser Link ist <strong>1 Stunde</strong> g\u00fcltig. Wenn Sie Ihr Passwort nicht zur\u00fccksetzen wollten, k\u00f6nnen Sie diese E-Mail ignorieren.
        </p>
      </div>
    </div>
  `);

  return sendEmail({
    from: FROM_EMAIL,
    to: email,
    subject: "Passwort zur\u00fccksetzen \u2013 HAUSAURA",
    html,
  });
}

export async function sendEmailVerification(data: {
  to: string;
  name: string;
  verificationUrl: string;
}) {
  const safeName = escapeHtml(data.name);

  const html = baseTemplate(`
    ${headerBanner("E-Mail verifizieren", "Best\u00e4tigen Sie Ihre E-Mail-Adresse")}
    <div style="padding:36px 40px;">
      <p style="color:#4B5563;font-size:15px;margin:0 0 24px 0;line-height:1.6;">
        Hallo <strong style="color:#0A2540;">${safeName}</strong>,
      </p>
      <p style="color:#4B5563;font-size:14px;margin:0 0 24px 0;line-height:1.6;">
        Vielen Dank f\u00fcr Ihre Registrierung bei HAUSAURA. Klicken Sie auf den folgenden Button, um Ihre E-Mail-Adresse zu verifizieren:
      </p>
      <div style="text-align:center;padding:16px 0 24px 0;">
        <a href="${data.verificationUrl}" style="display:inline-block;background-color:#D14A0C;color:#FFFFFF;font-size:15px;font-weight:700;text-decoration:none;padding:16px 40px;border-radius:10px;">
          E-Mail verifizieren
        </a>
      </div>
      <div style="border-top:1px solid #E8ECF1;padding-top:20px;">
        <p style="color:#9CA3AF;font-size:12px;margin:0;line-height:1.5;">
          Dieser Link ist <strong>24 Stunden</strong> g\u00fcltig. Wenn Sie sich nicht bei HAUSAURA registriert haben, k\u00f6nnen Sie diese E-Mail ignorieren.
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
