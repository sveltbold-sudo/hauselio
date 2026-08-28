import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { getCloudinary } from "@/lib/cloudinary";
import { handleApiError, validateContentType, validateCsrfOrigin } from "@/lib/api-helpers";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  try {
    const ctError = validateContentType(request, "multipart/form-data");
    if (ctError) return ctError;

    await requireAdmin();

    const cloudinary = getCloudinary();

    if (!validateCsrfOrigin(request)) {
      return NextResponse.json({ error: "CSRF-Schutz: Ungültige Herkunft" }, { status: 403 });
    }

    const ip = getClientIp(request);
    if (!await checkRateLimit(`admin-upload:${ip}`, 20, 60_000)) {
      return NextResponse.json({ error: "Zu viele Anfragen" }, { status: 429, headers: { "Retry-After": "60" } });
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

    // Validate magic bytes (file signature) to prevent spoofed uploads
    const magicBytes = buffer.subarray(0, 12);
    const isValidImage = (() => {
      // JPEG: FF D8 FF
      if (magicBytes[0] === 0xff && magicBytes[1] === 0xd8 && magicBytes[2] === 0xff) return true;
      // PNG: 89 50 4E 47 0D 0A 1A 0A
      if (magicBytes[0] === 0x89 && magicBytes[1] === 0x50 && magicBytes[2] === 0x4e && magicBytes[3] === 0x47) return true;
      // GIF: 47 49 46 38 (GIF8)
      if (magicBytes[0] === 0x47 && magicBytes[1] === 0x49 && magicBytes[2] === 0x46 && magicBytes[3] === 0x38) return true;
      // WebP: RIFF....WEBP
      if (magicBytes[0] === 0x52 && magicBytes[1] === 0x49 && magicBytes[2] === 0x46 && magicBytes[3] === 0x46 &&
          magicBytes[8] === 0x57 && magicBytes[9] === 0x45 && magicBytes[10] === 0x42 && magicBytes[11] === 0x50) return true;
      return false;
    })();

    if (!isValidImage) {
      return NextResponse.json(
        { error: "Datei ist kein gültiges Bild (Magic-Bytes-Mismatch)" },
        { status: 400 }
      );
    }

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
