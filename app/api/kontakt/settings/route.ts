import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { handleApiError } from "@/lib/api-helpers";

export async function GET() {
  try {
    const settings = await prisma.siteSettings.findFirst();

    return NextResponse.json({
      contactEmail: settings?.contactEmail || "info@hauselio.de",
      contactPhone: settings?.contactPhone || "+49 (0)30 555 789 01",
      contactAddress: settings?.contactAddress || "Kastanienallee 42, 10435 Berlin",
    });
  } catch (error) {
    return handleApiError(error);
  }
}
