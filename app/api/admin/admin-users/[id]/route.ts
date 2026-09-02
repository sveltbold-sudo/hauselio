import { NextRequest, NextResponse } from "next/server";
import { requireRole, hashPassword } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { handleApiError, validateContentType } from "@/lib/api-helpers";
import { UpdateAdminSchema } from "@/lib/validations";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { logger } from "@/lib/logger";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const ip = getClientIp(request);
    if (!await checkRateLimit(`admin-admin-update:${ip}`, 30, 60_000)) {
      return NextResponse.json({ error: "Zu viele Anfragen" }, { status: 429, headers: { "Retry-After": "60" } });
    }

    const ctError = validateContentType(request, "application/json");
    if (ctError) return ctError;

    await requireRole("ADMIN");
    const { id } = await params;
    const body = await request.json();
    const parsed = UpdateAdminSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]!.message }, { status: 400 });
    }

    const existing = await prisma.adminUser.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Admin nicht gefunden" }, { status: 404 });
    }

    const updateData: Record<string, unknown> = {};

    if (parsed.data.email) {
      const duplicate = await prisma.adminUser.findFirst({
        where: { email: parsed.data.email.toLowerCase(), NOT: { id } },
      });
      if (duplicate) {
        return NextResponse.json({ error: "Ein Admin mit dieser E-Mail existiert bereits" }, { status: 409 });
      }
      updateData.email = parsed.data.email.toLowerCase();
    }

    if (parsed.data.password) {
      updateData.password = await hashPassword(parsed.data.password);
    }

    if (parsed.data.name !== undefined) {
      updateData.name = parsed.data.name || null;
    }

    if (parsed.data.role) {
      updateData.role = parsed.data.role;
    }

    const admin = await prisma.adminUser.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ admin });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const ip = getClientIp(_request);
    if (!await checkRateLimit(`admin-admin-delete:${ip}`, 10, 60_000)) {
      return NextResponse.json({ error: "Zu viele Anfragen" }, { status: 429, headers: { "Retry-After": "60" } });
    }

    const currentUser = await requireRole("ADMIN");
    const { id } = await params;

    if (currentUser.id === id) {
      return NextResponse.json({ error: "Sie können Ihr eigenes Konto nicht löschen" }, { status: 400 });
    }

    const existing = await prisma.adminUser.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Admin nicht gefunden" }, { status: 404 });
    }

    const adminCount = await prisma.adminUser.count();
    if (adminCount <= 1) {
      return NextResponse.json({ error: "Der letzte Admin kann nicht gelöscht werden" }, { status: 400 });
    }

    await prisma.adminUser.delete({ where: { id } });

    logger.info("admin-deleted", `Admin deleted: ${existing.email} by ${currentUser.email}`);

    return NextResponse.json({ success: true });
  } catch (error) {
    return handleApiError(error);
  }
}
