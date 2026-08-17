import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkRateLimit } from "@/lib/rate-limit";
import { logger } from "@/lib/logger";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");

    if (!token || token.length > 100) {
      return NextResponse.redirect(new URL("/?newsletter=invalid", request.url));
    }

    const ip = request.headers.get("x-forwarded-for") || "unknown";
    if (!await checkRateLimit(`newsletter-confirm:${ip}`, 10, 60 * 1000)) {
      return NextResponse.redirect(new URL("/?newsletter=rate-limited", request.url));
    }

    const subscriber = await prisma.newsletter.findFirst({
      where: { confirmToken: token },
    });

    if (!subscriber) {
      return NextResponse.redirect(new URL("/?newsletter=invalid", request.url));
    }

    if (subscriber.confirmed) {
      return NextResponse.redirect(new URL("/?newsletter=already-confirmed", request.url));
    }

    await prisma.newsletter.update({
      where: { id: subscriber.id },
      data: {
        confirmed: true,
        confirmedAt: new Date(),
        confirmToken: null,
      },
    });

    return NextResponse.redirect(new URL("/?newsletter=confirmed", request.url));
  } catch (error) {
    logger.error("newsletter-confirm", error);
    return NextResponse.redirect(new URL("/?newsletter=error", request.url));
  }
}
