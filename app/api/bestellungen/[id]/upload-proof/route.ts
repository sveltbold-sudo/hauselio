import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCloudinary } from "@/lib/cloudinary";
import { handleApiError, validateCsrfOrigin } from "@/lib/api-helpers";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { logger } from "@/lib/logger";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!validateCsrfOrigin(request)) {
      return NextResponse.json(
        { error: "CSRF-Schutz: Ungültige Herkunft" },
        { status: 403 }
      );
    }

    const ip = getClientIp(request);
    if (!await checkRateLimit(`upload-proof:${ip}`, 5, 60_000)) {
      return NextResponse.json(
        { error: "Zu viele Anfragen" },
        { status: 429, headers: { "Retry-After": "60" } }
      );
    }

    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");
    const orderNumber = searchParams.get("orderNumber");

    if (!email || !orderNumber) {
      return NextResponse.json(
        { error: "E-Mail und Bestellnummer erforderlich" },
        { status: 400 }
      );
    }

    // Verify order belongs to this email
    const order = await prisma.order.findFirst({
      where: {
        id,
        orderNumber,
        customerEmail: { equals: email, mode: "insensitive" },
      },
    });

    if (!order) {
      return NextResponse.json(
        { error: "Bestellung nicht gefunden" },
        { status: 404 }
      );
    }

    if (order.status !== "PENDING_PAYMENT") {
      return NextResponse.json(
        { error: "Diese Bestellung kann keine Zahlungsbeweise mehr annehmen" },
        { status: 400 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "Keine Datei hochgeladen" },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Nur JPG, PNG, WebP und PDF sind erlaubt" },
        { status: 400 }
      );
    }

    // Max 10MB
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Datei darf maximal 10MB groß sein" },
        { status: 400 }
      );
    }

    const cloudinary = getCloudinary();
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = `data:${file.type};base64,${buffer.toString("base64")}`;

    const result = await new Promise<{ secure_url: string; public_id: string }>(
      (resolve, reject) => {
        cloudinary.uploader.upload(
          base64,
          {
            folder: "HAUSAURA/payment-proofs",
            resource_type: file.type === "application/pdf" ? "raw" : "image",
            quality: "auto",
            fetch_format: "auto",
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result as { secure_url: string; public_id: string });
          }
        );
      }
    );

    await prisma.order.update({
      where: { id },
      data: { paymentProofUrl: result.secure_url },
    });

    logger.info("payment-proof-uploaded", "Payment proof uploaded", {
      orderNumber: order.orderNumber,
      fileUrl: result.secure_url,
    });

    return NextResponse.json({
      success: true,
      url: result.secure_url,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
