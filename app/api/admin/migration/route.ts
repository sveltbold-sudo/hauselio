import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function POST() {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const results: string[] = [];

  try {
    const tables = await prisma.$queryRaw<{ tablename: string }[]>`
      SELECT tablename FROM pg_tables WHERE schemaname = 'public'
    `;

    const categoryTable = tables.find((t) => t.tablename.toLowerCase() === "category");
    const productTable = tables.find((t) => t.tablename.toLowerCase() === "product");

    if (!categoryTable || !productTable) {
      return NextResponse.json({ error: "Tables not found", tables: tables.map(t => t.tablename) }, { status: 500 });
    }

    const catColumns = await prisma.$queryRaw<{ column_name: string }[]>`
      SELECT column_name FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = ${categoryTable.tablename}
    `;
    const prodColumns = await prisma.$queryRaw<{ column_name: string }[]>`
      SELECT column_name FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = ${productTable.tablename}
    `;

    if (!catColumns.some((c) => c.column_name === "longDescription")) {
      await prisma.$executeRawUnsafe(
        `ALTER TABLE "${categoryTable.tablename}" ADD COLUMN IF NOT EXISTS "longDescription" TEXT`
      );
      results.push(`Added longDescription to ${categoryTable.tablename}`);
    } else {
      results.push(`${categoryTable.tablename}.longDescription already exists`);
    }

    if (!prodColumns.some((c) => c.column_name === "longDescription")) {
      await prisma.$executeRawUnsafe(
        `ALTER TABLE "${productTable.tablename}" ADD COLUMN IF NOT EXISTS "longDescription" TEXT`
      );
      results.push(`Added longDescription to ${productTable.tablename}`);
    } else {
      results.push(`${productTable.tablename}.longDescription already exists`);
    }

    return NextResponse.json({ success: true, results });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
