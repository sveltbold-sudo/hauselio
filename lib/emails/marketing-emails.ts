import { FROM_EMAIL } from "@/lib/resend";
import { escapeHtml } from "@/lib/html";
import { SITE_URL } from "@/lib/constants";
import { createUnsubscribeToken } from "@/lib/auth";
import { sendEmail, baseTemplate, headerBanner, divider } from "./helpers";

const SITE = SITE_URL.startsWith("http") ? SITE_URL : `https://${SITE_URL}`;

const activeCampaigns = new Map<string, number>();

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
    const safeContent = data.content.replace(/\n/g, "<br>");

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
