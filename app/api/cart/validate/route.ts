import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { handleApiError, validateCsrfOrigin, validateContentType } from "@/lib/api-helpers";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { z } from "zod";

const CartItemSchema = z.object({
  id: z.string().min(1),
  quantity: z.number().int().min(1).max(99),
  price: z.number().min(0),
});

const CartValidateSchema = z.object({
  items: z.array(CartItemSchema).min(1, "Keine Artikel angegeben").max(50, "Maximal 50 Artikel erlaubt"),
});

export async function POST(request: NextRequest) {
  try {
    if (!validateCsrfOrigin(request)) {
      return NextResponse.json(
        { error: "CSRF-Schutz: Ungültige Herkunft" },
        { status: 403 }
      );
    }

    const ctError = validateContentType(request, "application/json");
    if (ctError) return ctError;

    const ip = getClientIp(request);
    if (!await checkRateLimit(`cart:${ip}`, 20, 60_000)) {
      return NextResponse.json(
        { error: "Zu viele Anfragen. Bitte versuchen Sie es später erneut." },
        { status: 429, headers: { "Retry-After": "60" } }
      );
    }

    const body = await request.json();
    const parsed = CartValidateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const { items } = parsed.data;
    const productIds = items.map((item) => item.id);

    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
      select: {
        id: true,
        name: true,
        slug: true,
        price: true,
        originalPrice: true,
        inStock: true,
        images: {
          take: 1,
          orderBy: { position: "asc" },
          select: { url: true },
        },
      },
    });

    const validatedItems = items.map((item) => {
      const product = products.find((p) => p.id === item.id);

      if (!product) {
        return {
          id: item.id,
          valid: false,
          error: "Produkt nicht gefunden",
        };
      }

      if (!product.inStock) {
        return {
          id: product.id,
          valid: false,
          error: `${product.name} ist leider nicht verfügbar`,
        };
      }

      const currentPrice = Number(product.price);
      if (Math.abs(item.price - currentPrice) > 0.01) {
        return {
          id: product.id,
          valid: true,
          priceChanged: true,
          price: currentPrice,
          oldPrice: item.price,
          newPrice: currentPrice,
          name: product.name,
          slug: product.slug,
          image: product.images[0]?.url || "/images/placeholder-product.svg",
          quantity: item.quantity,
          maxQuantity: 99,
        };
      }

      return {
        id: product.id,
        valid: true,
        priceChanged: false,
        name: product.name,
        slug: product.slug,
        price: currentPrice,
        image: product.images[0]?.url || "/images/placeholder-product.svg",
        quantity: item.quantity,
        maxQuantity: 99,
      };
    });

    const invalidItems = validatedItems.filter((item) => !item.valid);
    const priceChanges = validatedItems.filter((item) => item.valid && item.priceChanged);

    return NextResponse.json({
      items: validatedItems,
      invalidCount: invalidItems.length,
      priceChangeCount: priceChanges.length,
      isValid: invalidItems.length === 0 && priceChanges.length === 0,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
