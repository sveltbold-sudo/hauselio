"use client";

import { useState, useEffect, useTransition } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Eye, Loader2 } from "lucide-react";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import { useToast } from "@/components/ui/Toast";
import { RATGEBER_CATEGORIES } from "@/lib/ratgeber";
import { logger } from "@/lib/logger";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[ä]/g, "ae")
    .replace(/[ö]/g, "oe")
    .replace(/[ü]/g, "ue")
    .replace(/[ß]/g, "ss")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function EditRatgeberArticlePage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const { success, error: toastError } = useToast();
  const [isPending, startTransition] = useTransition();
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [category, setCategory] = useState("tipps");
  const [tags, setTags] = useState("");
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDesc, setSeoDesc] = useState("");
  const [readingTime, setReadingTime] = useState("");
  const [isPublished, setIsPublished] = useState(false);

  useEffect(() => {
    fetch(`/api/ratgeber/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.article) {
          const a = data.article;
          setTitle(a.title);
          setSlug(a.slug);
          setExcerpt(a.excerpt || "");
          setContent(a.content);
          setCoverImage(a.coverImage || "");
          setCategory(a.category);
          setTags(a.tags?.join(", ") || "");
          setSeoTitle(a.seoTitle || "");
          setSeoDesc(a.seoDesc || "");
          setReadingTime(a.readingTime?.toString() || "");
          setIsPublished(a.isPublished);
        }
      })
      .catch((e) => logger.error("fetch-article", e))
      .finally(() => setLoading(false));
  }, [id]);

  function handleSave(publish: boolean) {
    startTransition(async () => {
      try {
        const res = await fetch(`/api/ratgeber/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title,
            slug: slug || slugify(title),
            excerpt,
            content,
            coverImage: coverImage || null,
            category,
            tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
            seoTitle: seoTitle || null,
            seoDesc: seoDesc || null,
            readingTime: readingTime ? parseInt(readingTime) : null,
            isPublished: publish,
          }),
        });
        if (!res.ok) throw new Error("Failed");
        success(publish ? "Artikel aktualisiert!" : "Entwurf gespeichert.");
        router.push("/admin/ratgeber");
      } catch {
        toastError("Fehler beim Speichern.");
      }
    });
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-[var(--color-primary)]" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link href="/admin/ratgeber" className="p-2 hover:bg-gray-100 rounded-lg">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-2xl font-bold">Artikel bearbeiten</h1>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => handleSave(false)}
            disabled={isPending || !title || !content}
            className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-50"
          >
            <Save className="w-4 h-4" /> Entwurf speichern
          </button>
          <button
            onClick={() => handleSave(true)}
            disabled={isPending || !title || !content}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg text-sm font-medium hover:bg-[var(--color-primary-hover)] disabled:opacity-50"
          >
            <Eye className="w-4 h-4" /> {isPublished ? "Aktualisieren" : "Veröffentlichen"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <Input label="Titel *" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Artikeltitel" />
          <Input label="Slug" value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="artikel-slug" />
          <Textarea label="Excerpt" value={excerpt} onChange={(e) => setExcerpt(e.target.value)} placeholder="Kurzbeschreibung" rows={3} />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Inhalt *</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="HTML-Inhalt des Artikels"
              rows={20}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent font-mono"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Kategorie *</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            >
              {RATGEBER_CATEGORIES.filter((c) => c.slug !== "alle").map((c) => (
                <option key={c.slug} value={c.slug}>{c.name}</option>
              ))}
            </select>
          </div>
          <Input label="Cover Image URL" value={coverImage} onChange={(e) => setCoverImage(e.target.value)} placeholder="/images/ratgeber/..." />
          <Input label="Tags (kommagetrennt)" value={tags} onChange={(e) => setTags(e.target.value)} placeholder="Kaffee, Tipps" />
          <Input label="Lesezeit (Minuten)" value={readingTime} onChange={(e) => setReadingTime(e.target.value)} type="number" />
          <Input label="SEO Titel" value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} />
          <Textarea label="SEO Beschreibung" value={seoDesc} onChange={(e) => setSeoDesc(e.target.value)} rows={3} />
        </div>
      </div>
    </div>
  );
}
