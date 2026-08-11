import { NextRequest, NextResponse } from "next/server";
import { ContactSchema } from "@/lib/validations";
import { sendContactForward, sendContactAutoReply } from "@/lib/emails";
import { checkRateLimit } from "@/lib/rate-limit";
import { validateCsrfOrigin, validateContentType, handleApiError } from "@/lib/api-helpers";

export async function POST(request: NextRequest) {
  try {
    if (!validateCsrfOrigin(request)) {
      return NextResponse.json(
        { error: "CSRF-Schutz: Ungültige Herkunft" },
        { status: 403 }
      );
    }

    const ctError = validateContentType(request, "application/json");
    if (ctError) return ctError;

    const ip = request.headers.get("x-forwarded-for") || "unknown";
    if (!await checkRateLimit(`contact:${ip}`, 3, 60 * 1000)) {
      return NextResponse.json(
        { error: "Zu viele Anfragen. Bitte versuchen Sie es später erneut." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const parsed = ContactSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const { firstName, lastName, email, subject, message } = parsed.data;

    await Promise.all([
      sendContactForward({ firstName, lastName, email, subject, message }),
      sendContactAutoReply({ firstName, lastName, email }),
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    return handleApiError(error);
  }
}
