import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { logger } from "@/lib/logger";
import Link from "next/link";
import { Plus, Pencil, Trash2, Eye, EyeOff } from "lucide-react";
import DeleteArticleButton from "@/components/admin/DeleteArticleButton";

export const dynamic = "force-dynamic";

export default async function AdminRatgeberPage() {
  await requireAdmin();

  let articles: Array<{
    id: string;
    title: string;
    slug: string;
    category: string;
    isPublished: boolean;
    publishedAt: Date | null;
    viewCount: number;
    createdAt: Date;
  }> = [];

  try {
    articles = await prisma.ratgeberArticle.findMany({
      select: {
        id: true,
        title: true,
        slug: true,
        category: true,
        isPublished: true,
        publishedAt: true,
        viewCount: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });
  } catch (e) {
    logger.error("admin-ratgeber", e);
  }

  const CATEGORY_LABELS: Record<string, string> = {
    kueche: "Küche",
    kaffee: "Kaffee",
    reinigung: "Reinigung",
    klima: "Klima",
    "smart-home": "Smart Home",
    haushaltsgeraete: "Haushaltsgeräte",
    tipps: "Tipps & Tricks",
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Ratgeber-Artikel</h1>
          <p className="text-sm text-gray-500 mt-1">{articles.length} Artikel insgesamt</p>
        </div>
        <Link
          href="/admin/ratgeber/neu"
          className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary-hover)] transition-colors text-sm font-medium"
        >
          <Plus className="w-4 h-4" />
          Neuer Artikel
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <caption className="sr-only">Ratgeber-Artikel</caption>
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Titel</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Kategorie</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Status</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Aufrufe</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Erstellt</th>
              <th className="text-right px-4 py-3 font-medium text-gray-600">Aktionen</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {articles.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                  Noch keine Artikel vorhanden.
                </td>
              </tr>
            ) : (
              articles.map((article) => (
                <tr key={article.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <Link
                      href={`/ratgeber/${article.slug}`}
                      target="_blank"
                      className="font-medium text-gray-900 hover:text-[var(--color-primary)]"
                    >
                      {article.title}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {CATEGORY_LABELS[article.category] || article.category}
                  </td>
                  <td className="px-4 py-3">
                    {article.isPublished ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full bg-green-100 text-green-800">
                        <Eye className="w-3 h-3" /> Veröffentlicht
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full bg-gray-100 text-gray-600">
                        <EyeOff className="w-3 h-3" /> Entwurf
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{article.viewCount}</td>
                  <td className="px-4 py-3 text-gray-600">
                    {new Intl.DateTimeFormat("de-DE").format(article.createdAt)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/ratgeber/${article.id}/bearbeiten`}
                        className="p-1.5 text-gray-500 hover:text-[var(--color-primary)] hover:bg-gray-100 rounded-lg transition-colors"
                        aria-label={`Bearbeiten: ${article.title}`}
                      >
                        <Pencil className="w-4 h-4" />
                      </Link>
                      <DeleteArticleButton articleId={article.id} articleTitle={article.title} />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
