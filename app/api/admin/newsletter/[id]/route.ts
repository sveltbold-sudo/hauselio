import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { handleApiError, validateContentType } from "@/lib/api-helpers";
import { checkRateLimit } from "@/lib/rate-limit";
import { z } from "zod";

const UpdateNewsletterSchema = z.object({
  isActive: z.boolean(),
});

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const ctError = validateContentType(request, "application/json");
    if (ctError) return ctError;

    await requireAdmin();
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    if (!await checkRateLimit(`admin-newsletter:${ip}`, 30, 60_000)) {
      return NextResponse.json({ error: "Zu viele Anfragen" }, { status: 429 });
    }
    const { id } = await params;
    const body = await request.json();
    const parsed = UpdateNewsletterSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const subscriber = await prisma.newsletter.update({
      where: { id },
      data: { isActive: parsed.data.isActive },
    });

    return NextResponse.json({ subscriber });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;

    await prisma.newsletter.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    return handleApiError(error);
  }
}
