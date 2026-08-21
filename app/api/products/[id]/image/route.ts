import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

const ALLOWED_HOSTS = ["res.cloudinary.com"];

function isAllowedUrl(urlString: string): boolean {
  try {
    const url = new URL(urlString);
    if (url.protocol === "http:" || url.protocol === "https:") {
      return ALLOWED_HOSTS.includes(url.hostname);
    }
  } catch {
    // Relative URL — always safe
    return true;
  }
  return false;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const ip = getClientIp(request);
    const allowed = await checkRateLimit(`product-image:${ip}`, 60, 60_000);
    if (!allowed) {
      return NextResponse.json({ error: "Zu viele Anfragen" }, { status: 429, headers: { "Retry-After": "60" } });
    }

    const { id } = await params;

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        images: {
          take: 1,
          orderBy: { position: "asc" },
          select: { url: true },
        },
      },
    });

    if (!product || !product.images[0]) {
      return NextResponse.redirect(
        new URL("/images/placeholder-product.svg", request.url)
      );
    }

    const imageUrl = product.images[0].url;

    if (!isAllowedUrl(imageUrl)) {
      return NextResponse.redirect(
        new URL("/images/placeholder-product.svg", request.url)
      );
    }

    if (imageUrl.startsWith("http")) {
      return NextResponse.redirect(imageUrl);
    }

    return NextResponse.redirect(new URL(imageUrl, request.url));
  } catch {
    return NextResponse.redirect(
      new URL("/images/placeholder-product.svg", request.url)
    );
  }
}
