import { NextRequest } from "next/server";
import { toCustomerId } from "@/lib/customer-id";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ email: string }> }
) {
  const { email } = await params;
  const decodedEmail = decodeURIComponent(email);
  const customerId = toCustomerId(decodedEmail);
  return Response.redirect(new URL(`/api/admin/kunden/${customerId}`, _request.url), 301);
}
