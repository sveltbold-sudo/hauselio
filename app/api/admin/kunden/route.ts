import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { handleApiError } from "@/lib/api-helpers";

export async function GET(request: NextRequest) {
  try {
    await requireAdmin();

    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "20", 10) || 20));
    const search = searchParams.get("search") || "";
    const offset = (page - 1) * limit;

    const whereClause = search
      ? `WHERE LOWER("customerEmail") LIKE LOWER($1)
         OR LOWER("customerFirstName") LIKE LOWER($1)
         OR LOWER("customerLastName") LIKE LOWER($1)`
      : "";
    const params = search ? [`%${search}%`] : [];

    const countResult = await prisma.$queryRawUnsafe<{ count: bigint }[]>(
      `SELECT COUNT(DISTINCT LOWER("customerEmail")) as count FROM "Order" ${whereClause}`,
      ...params
    );
    const total = Number(countResult[0]?.count ?? 0);

    const customers = await prisma.$queryRawUnsafe<
      {
        email: string;
        firstName: string;
        lastName: string;
        phone: string | null;
        address: string;
        city: string;
        zip: string;
        country: string;
        orderCount: bigint;
        totalSpent: unknown;
        lastOrderAt: Date;
      }[]
    >(
      `SELECT
        "customerEmail" as email,
        "customerFirstName" as "firstName",
        "customerLastName" as "lastName",
        "customerPhone" as phone,
        "customerAddress" as address,
        "customerCity" as city,
        "customerZip" as zip,
        "customerCountry" as country,
        COUNT(*) as "orderCount",
        SUM("total") as "totalSpent",
        MAX("createdAt") as "lastOrderAt"
      FROM "Order"
      ${whereClause}
      GROUP BY LOWER("customerEmail"), "customerEmail", "customerFirstName",
               "customerLastName", "customerPhone", "customerAddress",
               "customerCity", "customerZip", "customerCountry"
      ORDER BY MAX("createdAt") DESC
      LIMIT $${params.length + 1} OFFSET $${params.length + 2}`,
      ...params,
      limit,
      offset
    );

    return NextResponse.json({
      customers: customers.map((c) => ({
        email: c.email,
        firstName: c.firstName,
        lastName: c.lastName,
        phone: c.phone,
        address: c.address,
        city: c.city,
        zip: c.zip,
        country: c.country,
        orderCount: Number(c.orderCount),
        totalSpent: Number(c.totalSpent),
        lastOrderAt: c.lastOrderAt,
      })),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}
