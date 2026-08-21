import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { handleApiError, validateContentType } from "@/lib/api-helpers";
import { CreateBrandSchema } from "@/lib/validations";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

export async function GET() {
  try {
    await requireAdmin();

    const brands = await prisma.brand.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true, slug: true },
    });
    return NextResponse.json({ brands });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    const allowed = await checkRateLimit(`admin-marke-create:${ip}`, 30, 60_000);
    if (!allowed) {
      return NextResponse.json(
        { error: "Zu viele Anfragen. Bitte versuchen Sie es später erneut." },
        { status: 429, headers: { "Retry-After": "60" } }
      );
    }

    const ctError = validateContentType(request, "application/json");
    if (ctError) return ctError;

    await requireAdmin();

    const body = await request.json();
    const parsed = CreateBrandSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const { name } = parsed.data;

    const slug = name
      .toLowerCase()
      .replace(/[äöüß]/g, (m) => ({ ä: "ae", ö: "oe", ü: "ue", ß: "ss" }[m] || m))
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const existing = await prisma.brand.findFirst({
      where: { slug },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Eine Marke mit diesem Namen existiert bereits" },
        { status: 409 }
      );
    }

    const brand = await prisma.brand.create({
      data: { name: name.trim(), slug },
      select: { id: true, name: true, slug: true },
    });

    return NextResponse.json(brand, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
