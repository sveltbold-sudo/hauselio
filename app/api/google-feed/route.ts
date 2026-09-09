import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { SITE_URL, SITE_NAME } from "@/lib/constants";

export const dynamic = "force-dynamic";

function escapeXml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        price: true,
        originalPrice: true,
        images: { select: { url: true }, take: 1, orderBy: { position: "asc" } },
        rating: true,
        reviewCount: true,
        isNew: true,
        isPromo: true,
        stockQuantity: true,
        brand: { select: { name: true } },
        category: { select: { name: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    const items = products
      .map((p) => {
        const productUrl = `${SITE_URL}/produkt/${p.slug}`;
        const imageUrl = p.images[0]?.url
          ? p.images[0].url.startsWith("http")
            ? p.images[0].url
            : `${SITE_URL}${p.images[0].url}`
          : `${SITE_URL}/logos/logoprincipale.png`;
        const availability = p.stockQuantity === null ? "in_stock" : p.stockQuantity > 0 ? "in_stock" : "out_of_stock";
        const brand = p.brand?.name || SITE_NAME;

        return `    <item>
      <g:id>${escapeXml(p.id)}</g:id>
      <g:title>${escapeXml(p.name)}</g:title>
      <g:description>${escapeXml((p.description || p.name).substring(0, 5000))}</g:description>
      <g:link>${escapeXml(productUrl)}</g:link>
      <g:image_link>${escapeXml(imageUrl)}</g:image_link>
      <g:availability>${availability}</g:availability>
      <g:price>${p.price.toFixed(2)} EUR</g:price>
      <g:condition>new</g:condition>
      <g:brand>${escapeXml(brand)}</g:brand>
      <g:-item_group_id>${escapeXml(p.slug)}</g:-item_group_id>
      <g:google_product_category>${escapeXml(p.category?.name || "Haushaltsgeräte")}</g:google_product_category>
      <g:identifier_exists>false</g:identifier_exists>
      <g:is_bundle>false</g:is_bundle>
      <g:adult>false</g:adult>
      <g:shipping>
        <g:country>DE</g:country>
        <g:service>Standard</g:service>
        <g:price>4.99 EUR</g:price>
      </g:shipping>
      <g:shipping_weight>5000 g</g:shipping_weight>
      ${p.originalPrice ? `<g:sale_price>${p.price.toFixed(2)} EUR</g:sale_price>` : ""}
      ${Number(p.rating) > 0 ? `<g:custom_label_0>${Number(p.rating).toFixed(1)}</g:custom_label_0>` : ""}
    </item>`;
      })
      .join("\n");

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>${escapeXml(SITE_NAME)}</title>
    <link>${escapeXml(SITE_URL)}</link>
    <description>${escapeXml(SITE_NAME)} — Moderne Haushaltsgeräte für Ihr Zuhause</description>
    <language>de</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${items}
  </channel>
</rss>`;

    return new NextResponse(xml, {
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "public, max-age=3600, s-maxage=3600",
      },
    });
  } catch (error) {
    console.error("Google feed error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
