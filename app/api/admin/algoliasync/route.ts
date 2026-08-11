import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { syncProductsToAlgolia } from "@/lib/algolia-sync";
import { handleApiError } from "@/lib/api-helpers";

export async function POST() {
  try {
    await requireAdmin();

    const result = await syncProductsToAlgolia();

    return NextResponse.json(result);
  } catch (error) {
    return handleApiError(error);
  }
}
