import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { handleApiError, validateCsrfOrigin, validateContentType } from "@/lib/api-helpers";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { z } from "zod";

const ActivityLogSchema = z.object({
  action: z.string().min(1).max(100),
  entity: z.string().min(1).max(50),
  entityId: z.string().max(50).optional(),
  details: z.record(z.unknown()).optional(),
});

export async function GET(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    if (!await checkRateLimit(`admin-activity:${ip}`, 60, 60_000)) {
      return NextResponse.json({ error: "Zu viele Anfragen" }, { status: 429, headers: { "Retry-After": "60" } });
    }

    await requireAdmin();

    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "50")));
    const entity = searchParams.get("entity");
    const action = searchParams.get("action");
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};
    if (entity) where.entity = entity;
    if (action) where.action = action;

    const [logs, total] = await Promise.all([
      prisma.activityLog.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.activityLog.count({ where }),
    ]);

    return NextResponse.json({
      logs,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!validateCsrfOrigin(request)) {
      return NextResponse.json({ error: "CSRF-Schutz: Ungültige Herkunft" }, { status: 403 });
    }

    const ctError = validateContentType(request, "application/json");
    if (ctError) return ctError;

    const admin = await requireAdmin();
    const body = await request.json();

    const parsed = ActivityLogSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]!.message }, { status: 400 });
    }

    const { logActivity } = await import("@/lib/activity-log");
    await logActivity({
      action: parsed.data.action,
      entity: parsed.data.entity,
      entityId: parsed.data.entityId,
      adminId: admin.id,
      adminEmail: admin.email,
      details: parsed.data.details,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return handleApiError(error);
  }
}
