import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { syncProductsToAlgolia } from "@/lib/algolia-sync";
import { handleApiError } from "@/lib/api-helpers";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    const allowed = await checkRateLimit(`admin-algoliasync:${ip}`, 10, 60_000);
    if (!allowed) {
      return NextResponse.json(
        { error: "Zu viele Anfragen. Bitte versuchen Sie es später erneut." },
        { status: 429, headers: { "Retry-After": "60" } }
      );
    }

    await requireAdmin();

    const result = await syncProductsToAlgolia();

    return NextResponse.json(result);
  } catch (error) {
    return handleApiError(error);
  }
}
