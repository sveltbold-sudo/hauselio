import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const diagnostics: Record<string, unknown> = {
    timestamp: new Date().toISOString(),
    nodeEnv: process.env.NODE_ENV,
    hasDatabaseUrl: !!process.env.DATABASE_URL,
    databaseUrlPrefix: process.env.DATABASE_URL ? process.env.DATABASE_URL.slice(0, 40) + "..." : "missing",
    hasJwtSecret: !!process.env.JWT_SECRET,
    hasUpstash: !!(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN),
  };

  try {
    const { validateEnv } = await import("@/lib/env");
    validateEnv();
    diagnostics.envValid = true;
  } catch (e: unknown) {
    diagnostics.envValid = false;
    diagnostics.envError = e instanceof Error ? e.message : String(e);
    return NextResponse.json(diagnostics, { status: 503 });
  }

  try {
    const { prisma } = await import("@/lib/prisma");
    await prisma.$queryRaw`SELECT 1`;
    diagnostics.database = "ok";

    const count = await prisma.product.count();
    diagnostics.productCount = count;
  } catch (e: unknown) {
    diagnostics.database = "error";
    diagnostics.dbError = e instanceof Error ? e.message : String(e);
    return NextResponse.json(diagnostics, { status: 503 });
  }

  return NextResponse.json({ status: "ok", ...diagnostics });
}
