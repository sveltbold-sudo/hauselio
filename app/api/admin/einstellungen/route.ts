import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { handleApiError, validateContentType } from "@/lib/api-helpers";
import { UpdateSettingsSchema } from "@/lib/validations";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { logger } from "@/lib/logger";

export async function GET(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    if (!await checkRateLimit(`admin-einstellungen-get:${ip}`, 60, 60_000)) {
      return NextResponse.json(
        { error: "Zu viele Anfragen. Bitte versuchen Sie es später erneut." },
        { status: 429, headers: { "Retry-After": "60" } }
      );
    }

    const adminUser = await requireAdmin();

    let settings = await prisma.siteSettings.findFirst();

    if (!settings) {
      settings = await prisma.siteSettings.create({
        data: {
          bankIban: "",
          bankBic: "",
          bankAccountName: "",
          bankName: "",
          shippingInfo: "",
          contactEmail: "",
          contactPhone: "",
          contactAddress: "",
        },
      });
    }

    const settingsData = settings ? { ...settings } : null;
    if (settingsData && adminUser.role !== "ADMIN" && settingsData.bankIban) {
      settingsData.bankIban = settingsData.bankIban.replace(/.{4}(?=.{4}$)/g, "*");
    }

    return NextResponse.json({ settings: settingsData });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    const allowed = await checkRateLimit(`admin-einstellungen:${ip}`, 30, 60_000);
    if (!allowed) {
      return NextResponse.json(
        { error: "Zu viele Anfragen. Bitte versuchen Sie es später erneut." },
        { status: 429, headers: { "Retry-After": "60" } }
      );
    }

    const ctError = validateContentType(request, "application/json");
    if (ctError) return ctError;

    const admin = await requireAdmin();
    const body = await request.json();

    // Convert empty strings and nulls to undefined so .optional() fields pass validation
    const cleaned = Object.fromEntries(
      Object.entries(body).map(([k, v]) => [k, v === "" || v === null ? undefined : v])
    );

    const parsed = UpdateSettingsSchema.safeParse(cleaned);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]!.message },
        { status: 400 }
      );
    }

    const data = parsed.data;

    const existing = await prisma.siteSettings.findFirst();

    let settings;
    if (existing) {
      settings = await prisma.siteSettings.update({
        where: { id: existing.id },
        data,
      });
    } else {
      settings = await prisma.siteSettings.create({ data });
    }

    try {
      logger.info("settings-updated", `Site settings updated by ${admin.email}`);
    } catch (auditErr) {
      logger.error("settings-update-audit-failed", auditErr);
    }

    return NextResponse.json({ settings });
  } catch (error) {
    return handleApiError(error);
  }
}
