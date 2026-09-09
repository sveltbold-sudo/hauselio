import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    if (!await checkRateLimit(`verify-email-confirm:${ip}`, 5, 15 * 60 * 1000)) {
      return NextResponse.json(
        { error: "Zu viele Anfragen. Bitte versuchen Sie es später erneut." },
        { status: 429, headers: { "Retry-After": "900" } }
      );
    }

    const body = await request.json();
    const { token } = body as { token?: string };

    if (!token || typeof token !== "string") {
      return NextResponse.json(
        { error: "Ungültiges Token" },
        { status: 400 }
      );
    }

    const verificationToken = await prisma.verificationToken.findUnique({
      where: { token },
    });

    if (!verificationToken) {
      return NextResponse.json(
        { error: "Ungültiges oder abgelaufenes Token" },
        { status: 400 }
      );
    }

    if (verificationToken.expiresAt < new Date()) {
      await prisma.verificationToken.delete({ where: { token } });
      return NextResponse.json(
        { error: "Token ist abgelaufen. Bitte fordern Sie einen neuen an." },
        { status: 400 }
      );
    }

    const customer = await prisma.customer.findUnique({
      where: { email: verificationToken.email },
    });

    if (!customer) {
      await prisma.verificationToken.delete({ where: { token } });
      return NextResponse.json(
        { error: "Konto nicht gefunden" },
        { status: 400 }
      );
    }

    if (customer.emailVerified) {
      await prisma.verificationToken.delete({ where: { token } });
      return NextResponse.json({ success: true });
    }

    await prisma.$transaction([
      prisma.customer.update({
        where: { id: customer.id },
        data: { emailVerified: new Date() },
      }),
      prisma.verificationToken.delete({ where: { token } }),
    ]);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Fehler bei der Verifizierung" },
      { status: 500 }
    );
  }
}
