import { redirect } from "next/navigation";
import { toCustomerId } from "@/lib/customer-id";

export default async function OldCustomerDetailPage({
  params,
}: {
  params: Promise<{ email: string }>;
}) {
  const { email } = await params;
  const decodedEmail = decodeURIComponent(email);
  const customerId = toCustomerId(decodedEmail);
  redirect(`/admin/kunden/${customerId}`);
}
