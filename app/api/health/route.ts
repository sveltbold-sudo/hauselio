import { NextResponse } from "next/server";

export async function GET() {
  const diagnostics: Record<string, unknown> = {};

  // Check env vars
  diagnostics.hasDATABASE_URL = !!process.env.DATABASE_URL;
  diagnostics.dbUrlLength = process.env.DATABASE_URL?.length || 0;
  diagnostics.dbUrlFirstChars = process.env.DATABASE_URL?.substring(0, 30) || "MISSING";
  diagnostics.dbUrlHasBrackets = process.env.DATABASE_URL?.includes("[") || false;
  diagnostics.hasJWT_SECRET = !!process.env.JWT_SECRET;
  diagnostics.jwtSecretLength = process.env.JWT_SECRET?.length || 0;

  // Try Prisma connection
  try {
    const { prisma } = await import("@/lib/prisma");
    await prisma.$queryRaw`SELECT 1`;
    diagnostics.dbConnection = "OK";
  } catch (e) {
    diagnostics.dbConnection = "FAILED";
    diagnostics.dbError = e instanceof Error ? e.message : String(e);
  }

  // Try JWT secret validation
  try {
    const { getJWTSecret } = await import("@/lib/auth");
    getJWTSecret();
    diagnostics.jwtSecret = "VALID";
  } catch (e) {
    diagnostics.jwtSecret = "INVALID";
    diagnostics.jwtError = e instanceof Error ? e.message : String(e);
  }

  return NextResponse.json(diagnostics, { status: 200 });
}
