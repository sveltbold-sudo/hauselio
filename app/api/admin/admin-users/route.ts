import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { handleApiError, validateContentType } from "@/lib/api-helpers";
import { CreateAdminSchema } from "@/lib/validations";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { hashPassword } from "@/lib/auth";
import { logger } from "@/lib/logger";

export async function GET(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    if (!await checkRateLimit(`admin-admins:${ip}`, 60, 60_000)) {
      return NextResponse.json({ error: "Zu viele Anfragen" }, { status: 429, headers: { "Retry-After": "60" } });
    }

    await requireAdmin();

    const admins = await prisma.adminUser.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        lastLogin: true,
        createdAt: true,
      },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json({ admins });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    if (!await checkRateLimit(`admin-admin-create:${ip}`, 10, 60_000)) {
      return NextResponse.json({ error: "Zu viele Anfragen" }, { status: 429, headers: { "Retry-After": "60" } });
    }

    const ctError = validateContentType(request, "application/json");
    if (ctError) return ctError;

    await requireAdmin();
    const body = await request.json();
    const parsed = CreateAdminSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]!.message }, { status: 400 });
    }

    const { email, password, name, role } = parsed.data;

    const existing = await prisma.adminUser.findUnique({ where: { email: email.toLowerCase() } });
    if (existing) {
      return NextResponse.json({ error: "Ein Admin mit dieser E-Mail existiert bereits" }, { status: 409 });
    }

    const hashedPassword = await hashPassword(password);

    const admin = await prisma.adminUser.create({
      data: {
        email: email.toLowerCase(),
        password: hashedPassword,
        name: name || null,
        role: role || "ADMIN",
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
    });

    logger.info("admin-created", `Admin created: ${admin.email} (${admin.role})`);

    return NextResponse.json({ admin }, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
