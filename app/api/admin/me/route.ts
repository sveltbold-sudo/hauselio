import { NextResponse } from "next/server";
import { getAdminFromRequest } from "@/lib/auth";
import { handleApiError } from "@/lib/api-helpers";

export async function GET() {
  try {
    const admin = await getAdminFromRequest();

    if (!admin) {
      return NextResponse.json(
        { error: "Nicht authentifiziert" },
        { status: 401 }
      );
    }

    return NextResponse.json({ admin });
  } catch (error) {
    return handleApiError(error);
  }
}
