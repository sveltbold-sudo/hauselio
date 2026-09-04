import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { UpdateProfileSchema } from "@/lib/validations";
import { getCustomerFromRequest } from "@/lib/auth";
import { validateContentType, validateCsrfOrigin } from "@/lib/api-helpers";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { logger } from "@/lib/logger";

export async function GET(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    const allowed = await checkRateLimit(`customer-me:${ip}`, 30, 60_000);
    if (!allowed) {
      return NextResponse.json({ error: "Zu viele Anfragen" }, { status: 429 });
    }

    const auth = await getCustomerFromRequest();
    if (!auth) {
      return NextResponse.json({ error: "Nicht angemeldet" }, { status: 401 });
    }

    const customer = await prisma.customer.findUnique({
      where: { id: auth.id },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        address: true,
        zip: true,
        city: true,
        country: true,
        createdAt: true,
      },
    });

    if (!customer) {
      const admin = await prisma.adminUser.findUnique({
        where: { id: auth.id },
        select: {
          id: true,
          email: true,
          name: true,
          createdAt: true,
        },
      });
      if (!admin) {
        return NextResponse.json({ error: "Konto nicht gefunden" }, { status: 404 });
      }
      return NextResponse.json({
        customer: {
          ...admin,
          phone: null,
          address: null,
          zip: null,
          city: null,
          country: "DE",
        },
      });
    }

    return NextResponse.json({ customer });
  } catch (error) {
    logger.error("customer-me-get", error);
    return NextResponse.json({ error: "Serverfehler" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    if (!await checkRateLimit(`customer-me:${ip}`, 10, 60_000)) {
      return NextResponse.json(
        { error: "Zu viele Anfragen. Bitte versuchen Sie es später erneut." },
        { status: 429, headers: { "Retry-After": "60" } }
      );
    }

    const auth = await getCustomerFromRequest();
    if (!auth) {
      return NextResponse.json({ error: "Nicht angemeldet" }, { status: 401 });
    }

    if (!validateCsrfOrigin(request)) {
      return NextResponse.json(
        { error: "CSRF-Schutz: Ungültige Herkunft" },
        { status: 403 }
      );
    }

    const ctError = validateContentType(request, "application/json");
    if (ctError) return ctError;

    const body = await request.json();
    const parsed = UpdateProfileSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]!.message },
        { status: 400 }
      );
    }

    const data = parsed.data;

    // Filter out undefined values
    const updateData: Record<string, unknown> = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.phone !== undefined) updateData.phone = data.phone || null;
    if (data.address !== undefined) updateData.address = data.address || null;
    if (data.zip !== undefined) updateData.zip = data.zip || null;
    if (data.city !== undefined) updateData.city = data.city || null;
    if (data.country !== undefined) updateData.country = data.country || "DE";

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: "Keine Änderungen angegeben" }, { status: 400 });
    }

    const customer = await prisma.customer.update({
      where: { id: auth.id },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        address: true,
        zip: true,
        city: true,
        country: true,
      },
    });

    return NextResponse.json({ customer });
  } catch (error) {
    logger.error("customer-me-put", error);
    return NextResponse.json({ error: "Serverfehler" }, { status: 500 });
  }
}
