import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import cloudinary from "@/lib/cloudinary";
import { handleApiError, validateContentType, validateCsrfOrigin } from "@/lib/api-helpers";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  try {
    const ctError = validateContentType(request, "multipart/form-data");
    if (ctError) return ctError;

    await requireAdmin();

    if (!validateCsrfOrigin(request)) {
      return NextResponse.json({ error: "CSRF-Schutz: Ungültige Herkunft" }, { status: 403 });
    }

    const ip = getClientIp(request);
    if (!await checkRateLimit(`admin-upload:${ip}`, 20, 60_000)) {
      return NextResponse.json({ error: "Zu viele Anfragen" }, { status: 429 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;
    const rawFolder = (formData.get("folder") as string) || "hauselio/products";
    const ALLOWED_FOLDERS = ["hauselio/products", "hauselio/brands", "hauselio/categories", "hauselio"];
    const folder = ALLOWED_FOLDERS.includes(rawFolder) ? rawFolder : "hauselio/products";

    if (!file) {
      return NextResponse.json({ error: "Keine Datei hochgeladen" }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Nur JPG, PNG, WebP und GIF sind erlaubt" },
        { status: 400 }
      );
    }

    // Validate file extension
    const allowedExtensions = ["jpg", "jpeg", "png", "webp", "gif"];
    const ext = file.name.split(".").pop()?.toLowerCase();
    if (!ext || !allowedExtensions.includes(ext)) {
      return NextResponse.json(
        { error: "Nur .jpg, .jpeg, .png, .webp und .gif Dateien sind erlaubt" },
        { status: 400 }
      );
    }

    // Max 5MB
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Datei darf maximal 5MB groß sein" },
        { status: 400 }
      );
    }

    // Convert to base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = `data:${file.type};base64,${buffer.toString("base64")}`;

    // Upload to Cloudinary
    const result = await new Promise<{ secure_url: string; public_id: string }>(
      (resolve, reject) => {
        cloudinary.uploader.upload(
          base64,
          {
            folder,
            resource_type: "image",
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

    return NextResponse.json({
      url: result.secure_url,
      publicId: result.public_id,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
