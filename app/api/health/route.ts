import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkRateLimit } from "@/lib/rate-limit";
import { getClientIp } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const ip = getClientIp(request);
  const allowed = await checkRateLimit(`health:${ip}`, 30, 60_000);
  if (!allowed) {
    return NextResponse.json({ error: "Zu viele Anfragen" }, { status: 429 });
  }

  try {
    await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json({
      status: "ok",
      timestamp: new Date().toISOString(),
      database: "ok",
    });
  } catch {
    return NextResponse.json(
      {
        status: "error",
        timestamp: new Date().toISOString(),
        database: "unreachable",
      },
      { status: 503 }
    );
  }
}
