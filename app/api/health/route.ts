import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    const count = await prisma.product.count();
    return NextResponse.json({
      status: "ok",
      timestamp: new Date().toISOString(),
      database: "ok",
      productCount: count,
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        timestamp: new Date().toISOString(),
        database: "unreachable",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 503 }
    );
  }
}
