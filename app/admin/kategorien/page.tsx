"use client";

import { useEffect, useState, useTransition } from "react";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import { slugify } from "@/lib/utils";
import { useToast } from "@/components/ui/Toast";
import { logger } from "@/lib/logger";

export const dynamic = "force-dynamic";

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  _count: { products: number };
}

export default function KategorienPage() {
  const toast = useToast();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", slug: "", description: "" });
  const [, startTransition] = useTransition();

  const loadCategories = () => {
    fetch("/api/admin/kategorien")
      .then((r) => r.json())
      .then((data) => startTransition(() => setCategories(data.categories || [])))
      .catch((err) => logger.error("Failed to load data", { error: err }))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const method = editingId ? "PUT" : "POST";
      const url = editingId ? `/api/admin/kategorien/${editingId}` : "/api/admin/kategorien";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Fehler beim Speichern");
      setShowForm(false);
      setEditingId(null);
      setForm({ name: "", slug: "", description: "" });
      loadCategories();
    } catch (error) {
      logger.error("Kategorie speichern fehlgeschlagen", { error });
      toast.error(error instanceof Error ? error.message : "Fehler beim Speichern");
    }
  };

  const handleEdit = (cat: Category) => {
    setForm({ name: cat.name, slug: cat.slug, description: cat.description || "" });
    setEditingId(cat.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Kategorie wirklich löschen?")) return;
    try {
      const res = await fetch(`/api/admin/kategorien/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Fehler beim Löschen");
      loadCategories();
    } catch (error) {
      logger.error("Kategorie löschen fehlgeschlagen", { error });
      toast.error(error instanceof Error ? error.message : "Fehler beim Löschen");
    }
  };

  return (
    <main id="main-content" className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Kategorien</h1>
          <p className="text-[var(--color-text-secondary)] mt-1">{categories.length} Kategorien</p>
        </div>
        <button
          onClick={() => { setShowForm(true); setEditingId(null); setForm({ name: "", slug: "", description: "" }); }}
          className="flex items-center gap-2 px-4 py-3 bg-[var(--color-orange)] text-white rounded-xl text-sm font-medium hover:bg-[var(--color-orange-hover)] transition-colors"
        >
          <Plus className="w-4 h-4" /> Neue Kategorie
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          role="dialog"
          aria-modal="true"
          aria-labelledby="kategorie-modal-title"
          onClick={(e) => { if (e.target === e.currentTarget) setShowForm(false); }}
          onKeyDown={(e) => { if (e.key === "Escape") setShowForm(false); }}
        >
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h2 id="kategorie-modal-title" className="text-lg font-bold">{editingId ? "Kategorie bearbeiten" : "Neue Kategorie"}</h2>
              <button
                onClick={() => setShowForm(false)}
                aria-label="Modal schließen"
                className="p-1 hover:bg-[var(--color-bg)] rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1">Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value, slug: slugify(e.target.value) })}
                  className="w-full px-3 py-3 border border-[var(--color-border)] rounded-xl text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/20"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1">Slug</label>
                <input
                  type="text"
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  className="w-full px-3 py-3 border border-[var(--color-border)] rounded-xl text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/20"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1">Beschreibung</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-3 py-3 border border-[var(--color-border)] rounded-xl text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/20"
                  rows={3}
                />
              </div>
              <div className="flex gap-3 justify-end">
                <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-sm text-[var(--color-text-secondary)] hover:bg-[var(--color-bg)] rounded-lg">
                  Abbrechen
                </button>
                <button type="submit" className="px-4 py-2 bg-[var(--color-orange)] text-white rounded-lg text-sm font-medium hover:bg-[var(--color-orange-hover)]">
                  {editingId ? "Speichern" : "Erstellen"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-xl border border-[var(--color-border-light)] overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[var(--color-border-light)] bg-[var(--color-bg)]">
              <th className="text-left px-4 py-3 text-xs font-semibold text-[var(--color-text-muted)] uppercase">Name</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-[var(--color-text-muted)] uppercase hidden md:table-cell">Slug</th>
              <th className="text-center px-4 py-3 text-xs font-semibold text-[var(--color-text-muted)] uppercase">Produkte</th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-[var(--color-text-muted)] uppercase">Aktionen</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={4} className="px-4 py-12 text-center text-[var(--color-text-muted)]">Laden...</td></tr>
            ) : categories.map((cat) => (
              <tr key={cat.id} className="border-b border-[var(--color-border-light)] last:border-0 hover:bg-[var(--color-bg)]">
                <td className="px-4 py-3">
                  <p className="font-semibold text-[var(--color-text-primary)]">{cat.name}</p>
                  {cat.description && <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{cat.description}</p>}
                </td>
                <td className="px-4 py-3 hidden md:table-cell">
                  <code className="text-xs bg-[var(--color-bg)] px-2 py-1 rounded">{cat.slug}</code>
                </td>
                <td className="px-4 py-3 text-center">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-sm font-bold">
                    {cat._count.products}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button onClick={() => handleEdit(cat)} aria-label={`Kategorie ${cat.name} bearbeiten`} className="p-2 text-[var(--color-text-muted)] hover:text-[var(--color-primary)] hover:bg-[var(--color-primary)]/10 rounded-lg">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(cat.id)} aria-label={`Kategorie ${cat.name} löschen`} className="p-2 text-[var(--color-text-muted)] hover:text-[var(--color-danger)] hover:bg-[var(--color-danger-light)] rounded-lg">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
