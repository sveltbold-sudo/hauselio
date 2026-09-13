import { prisma } from "@/lib/prisma";
import { SITE_URL, SITE_NAME } from "@/lib/constants";

export const dynamic = "force-dynamic";

export async function GET() {
  const articles = await prisma.ratgeberArticle.findMany({
    where: { isPublished: true },
    orderBy: { publishedAt: "desc" },
    take: 20,
    select: {
      title: true,
      slug: true,
      excerpt: true,
      publishedAt: true,
      category: true,
    },
  });

  const items = articles
    .map((a) => {
      const pubDate = a.publishedAt ? new Date(a.publishedAt).toUTCString() : "";
      return `    <item>
      <title><![CDATA[${a.title}]]></title>
      <link>${SITE_URL}/ratgeber/${a.slug}</link>
      <description><![CDATA[${a.excerpt || ""}]]></description>
      <category>${a.category.replace(/&/g, "&amp;").replace(/</g, "&lt;")}</category>
      <pubDate>${pubDate}</pubDate>
      <guid>${SITE_URL}/ratgeber/${a.slug}</guid>
    </item>`;
    })
    .join("\n");

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${SITE_NAME} — Tipps &amp; Ratgeber</title>
    <link>${SITE_URL}/ratgeber</link>
    <description>Tipps, Vergleiche und Kaufberatung rund um Haushaltsgeräte von HAUSAURA.</description>
    <language>de</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${SITE_URL}/rss" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
