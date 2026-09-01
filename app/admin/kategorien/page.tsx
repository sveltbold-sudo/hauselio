"use client";

import { useEffect, useState, useTransition, useRef, useCallback } from "react";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import { slugify } from "@/lib/utils";
import { useToast } from "@/components/ui/Toast";
import { logger } from "@/lib/logger";
import ConfirmDialog from "@/components/ui/ConfirmDialog";

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
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string; count: number } | null>(null);
  const [, startTransition] = useTransition();
  const modalRef = useRef<HTMLDivElement>(null);

  const handleModalKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setShowForm(false);
      return;
    }
    if (e.key !== "Tab" || !modalRef.current) return;
    const focusable = modalRef.current.querySelectorAll<HTMLElement>(
      'input, button:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    if (focusable.length === 0) return;
    const first = focusable[0]!;
    const last = focusable[focusable.length - 1]!;
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }, []);

  const loadCategories = () => {
    fetch("/api/admin/kategorien")
      .then((r) => {
        if (!r.ok) throw new Error("Failed to load");
        return r.json();
      })
      .then((data) => startTransition(() => setCategories(data.categories || [])))
      .catch((err) => { logger.error("Failed to load data", { error: err }); setError("Kategorien konnten nicht geladen werden."); })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const method = editingId ? "PUT" : "POST";
      const url = editingId ? `/api/admin/kategorien/${editingId}` : "/api/admin/kategorien";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Fehler beim Speichern");
      toast.success(editingId ? "Kategorie aktualisiert!" : "Kategorie erstellt!");
      setShowForm(false);
      setEditingId(null);
      setForm({ name: "", slug: "", description: "" });
      loadCategories();
    } catch (error) {
      logger.error("Kategorie speichern fehlgeschlagen", { error });
      toast.error(error instanceof Error ? error.message : "Fehler beim Speichern");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (cat: Category) => {
    setForm({ name: cat.name, slug: cat.slug, description: cat.description || "" });
    setEditingId(cat.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string, name: string, productCount: number) => {
    setDeleteTarget({ id, name, count: productCount });
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      const res = await fetch(`/api/admin/kategorien/${deleteTarget.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Fehler beim Löschen");
      toast.success("Kategorie gelöscht!");
      loadCategories();
    } catch (error) {
      logger.error("Kategorie löschen fehlgeschlagen", { error });
      toast.error(error instanceof Error ? error.message : "Fehler beim Löschen");
    } finally {
      setDeleteTarget(null);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Kategorien</h1>
          <p className="text-[var(--color-text-secondary)] mt-1">{categories.length} Kategorien</p>
        </div>
        <button
          onClick={() => { setShowForm(true); setEditingId(null); setForm({ name: "", slug: "", description: "" }); }}
          aria-expanded={showForm}
          className="flex items-center gap-2 px-4 py-3 bg-[var(--color-accent)] text-white rounded-xl text-sm font-medium hover:bg-[var(--color-accent-hover)] transition-colors"
        >
          <Plus className="w-4 h-4" aria-hidden="true" /> Neue Kategorie
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
          onKeyDown={handleModalKeyDown}
        >
          <div ref={modalRef} className="bg-white rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h2 id="kategorie-modal-title" className="text-lg font-bold">{editingId ? "Kategorie bearbeiten" : "Neue Kategorie"}</h2>
              <button
                onClick={() => setShowForm(false)}
                aria-label="Modal schließen"
                className="p-1 hover:bg-[var(--color-bg)] rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="cat-name" className="block text-sm font-medium text-[var(--color-text-primary)] mb-1">Name</label>
                <input
                  id="cat-name"
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value, slug: slugify(e.target.value) })}
                  className="w-full px-3 py-3 border border-[var(--color-border)] rounded-xl text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/20"
                  required
                />
              </div>
              <div>
                <label htmlFor="cat-slug" className="block text-sm font-medium text-[var(--color-text-primary)] mb-1">Slug</label>
                <input
                  id="cat-slug"
                  type="text"
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  className="w-full px-3 py-3 border border-[var(--color-border)] rounded-xl text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/20"
                  required
                />
              </div>
              <div>
                <label htmlFor="cat-desc" className="block text-sm font-medium text-[var(--color-text-primary)] mb-1">Beschreibung</label>
                <textarea
                  id="cat-desc"
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
                <button type="submit" disabled={submitting} className="px-4 py-2 bg-[var(--color-accent)] text-white rounded-lg text-sm font-medium hover:bg-[var(--color-accent-hover)] disabled:opacity-50">
                  {submitting ? "Wird gespeichert…" : editingId ? "Speichern" : "Erstellen"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-xl border border-[var(--color-border-light)] overflow-hidden">
        <table className="w-full">
          <caption className="sr-only">Kategorien</caption>
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
            ) : error ? (
              <tr><td colSpan={4} className="px-4 py-12 text-center text-[var(--color-danger)]" role="alert">{error}</td></tr>
            ) : categories.length === 0 ? (
              <tr><td colSpan={4} className="px-4 py-12 text-center text-[var(--color-text-muted)]">Keine Kategorien gefunden.</td></tr>
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
                      <Pencil className="w-4 h-4" aria-hidden="true" />
                    </button>
                    <button onClick={() => handleDelete(cat.id, cat.name, cat._count.products)} aria-label={`Kategorie ${cat.name} löschen`} className="p-2 text-[var(--color-text-muted)] hover:text-[var(--color-danger)] hover:bg-[var(--color-danger-light)] rounded-lg">
                      <Trash2 className="w-4 h-4" aria-hidden="true" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ConfirmDialog
        open={!!deleteTarget}
        title={`Kategorie "${deleteTarget?.name}" löschen`}
        message={deleteTarget?.count ? `${deleteTarget.count} Produkte sind dieser Kategorie zugeordnet. Die Kategorie kann erst gelöscht werden, wenn keine Produkte mehr zugeordnet sind.` : "Möchten Sie diese Kategorie wirklich löschen?"}
        confirmLabel="Löschen"
        danger
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
