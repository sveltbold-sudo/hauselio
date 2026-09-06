import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCustomerFromRequest, hashPassword, verifyPassword } from "@/lib/auth";
import { validateCsrfOrigin, validateContentType, handleApiError } from "@/lib/api-helpers";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { z } from "zod";
import { PASSWORD_RULES } from "@/lib/validations";

const ChangePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Aktuelles Passwort ist erforderlich"),
  newPassword: PASSWORD_RULES,
}).refine((data) => data.currentPassword !== data.newPassword, {
  message: "Neues Passwort muss sich vom aktuellen unterscheiden",
  path: ["newPassword"],
});

export async function POST(request: NextRequest) {
  try {
    if (!validateCsrfOrigin(request)) {
      return NextResponse.json({ error: "CSRF-Schutz: Ungültige Herkunft" }, { status: 403 });
    }

    const ctError = validateContentType(request, "application/json");
    if (ctError) return ctError;

    const ip = getClientIp(request);
    if (!await checkRateLimit(`customer-change-pw:${ip}`, 5, 15 * 60_000)) {
      return NextResponse.json({ error: "Zu viele Versuche. Bitte versuchen Sie es später erneut." }, { status: 429, headers: { "Retry-After": "900" } });
    }

    const auth = await getCustomerFromRequest();
    if (!auth) {
      return NextResponse.json({ error: "Nicht angemeldet" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = ChangePasswordSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]!.message }, { status: 400 });
    }

    const { currentPassword, newPassword } = parsed.data;

    const customer = await prisma.customer.findUnique({
      where: { id: auth.id },
      select: { id: true, password: true },
    });

    if (!customer || !customer.password) {
      return NextResponse.json({ error: "Konto nicht gefunden" }, { status: 404 });
    }

    const valid = await verifyPassword(currentPassword, customer.password);
    if (!valid) {
      return NextResponse.json({ error: "Aktuelles Passwort ist falsch" }, { status: 400 });
    }

    const hashed = await hashPassword(newPassword);
    await prisma.customer.update({
      where: { id: auth.id },
      data: { password: hashed },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return handleApiError(error);
  }
}
