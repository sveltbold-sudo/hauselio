import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { UnauthorizedError, NotFoundError, ValidationError } from "./errors";
import { logger } from "./logger";
import { SITE_URL } from "./constants";

export function getExpectedOrigin(request: NextRequest): string {
  if (SITE_URL) {
    try {
      return new URL(SITE_URL).origin;
    } catch {}
  }
  const proto = request.headers.get("x-forwarded-proto") || "https";
  const host = request.headers.get("x-forwarded-host") || request.headers.get("host") || "HAUSAURA.de";
  return `${proto}://${host}`;
}

export function validateCsrfOrigin(request: NextRequest): boolean {
  const method = request.method.toUpperCase();
  if (method === "GET" || method === "HEAD" || method === "OPTIONS") {
    return true;
  }

  const origin = request.headers.get("origin");
  const referer = request.headers.get("referer");
  const expected = getExpectedOrigin(request);

  const source = origin || referer;
  if (!source) {
    return false;
  }

  try {
    const sourceUrl = new URL(source);
    const expectedUrl = new URL(expected);
    return sourceUrl.origin === expectedUrl.origin;
  } catch {
    return false;
  }
}

export function validateContentType(
  request: NextRequest,
  ...allowed: string[]
): NextResponse | null {
  const contentType = request.headers.get("content-type") || "";
  if (!allowed.some((type) => contentType.includes(type))) {
    return NextResponse.json(
      { error: "Ungültiger Content-Type. Erwartet: " + allowed.join(" oder ") },
      { status: 415 }
    );
  }
  return null;
}

export function handleApiError(error: unknown): NextResponse {
  if (error instanceof UnauthorizedError) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }
  if (error instanceof NotFoundError) {
    return NextResponse.json({ error: error.message }, { status: 404 });
  }
  if (error instanceof ValidationError) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case "P2025":
        return NextResponse.json({ error: "Eintrag nicht gefunden" }, { status: 404 });
      case "P2002":
        return NextResponse.json({ error: "Eintrag mit diesen Daten existiert bereits" }, { status: 409 });
      case "P2003":
        return NextResponse.json({ error: "Abhängige Einträge vorhanden" }, { status: 400 });
      case "P2014":
        return NextResponse.json({ error: "Referenziertes Feld fehlt" }, { status: 400 });
      default:
        logger.error("prisma", error, { code: error.code });
        return NextResponse.json({ error: "Datenbankfehler" }, { status: 500 });
    }
  }

  if (error instanceof Prisma.PrismaClientValidationError) {
    logger.error("prisma-validation", error);
    return NextResponse.json(
      { error: "Ungültige Daten für diese Operation" },
      { status: 400 }
    );
  }

  if (error instanceof Prisma.PrismaClientUnknownRequestError) {
    logger.error("prisma-unknown", error);
    return NextResponse.json(
      { error: "Datenbankfehler" },
      { status: 500 }
    );
  }

  logger.error("unhandled", error);
  return NextResponse.json({ error: "Interner Serverfehler" }, { status: 500 });
}
