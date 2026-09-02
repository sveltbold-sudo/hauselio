"use client";

import { useEffect, useState, useTransition, useRef, useCallback } from "react";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import { slugify } from "@/lib/utils";
import { useToast } from "@/components/ui/Toast";
import { logger } from "@/lib/logger";
import ConfirmDialog from "@/components/ui/ConfirmDialog";

interface Brand {
  id: string;
  name: string;
  slug: string;
  _count: { products: number };
}

export default function MarkenPage() {
  const toast = useToast();
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", slug: "" });
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

  const loadBrands = useCallback(() => {
    fetch("/api/admin/marken")
      .then((r) => {
        if (!r.ok) throw new Error("Failed to load");
        return r.json();
      })
      .then((data) => startTransition(() => setBrands(data.brands || [])))
      .catch((err) => { logger.error("Failed to load data", { error: err }); setLoadError(true); })
      .finally(() => setLoading(false));
  }, [startTransition]);

  useEffect(() => { loadBrands(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const method = editingId ? "PUT" : "POST";
      const url = editingId ? `/api/admin/marken/${editingId}` : "/api/admin/marken";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || "Fehler beim Speichern");
      }
      toast.success(editingId ? "Marke aktualisiert!" : "Marke erstellt!");
      setShowForm(false);
      setEditingId(null);
      setForm({ name: "", slug: "" });
      loadBrands();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Fehler beim Speichern");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (brand: Brand) => {
    setForm({ name: brand.name, slug: brand.slug });
    setEditingId(brand.id);
    setShowForm(true);
  };

  const handleDelete = (id: string, name: string, productCount: number) => {
    setDeleteTarget({ id, name, count: productCount });
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      const res = await fetch(`/api/admin/marken/${deleteTarget.id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || "Fehler beim Löschen");
      }
      toast.success("Marke gelöscht!");
      loadBrands();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Fehler beim Löschen");
    } finally {
      setDeleteTarget(null);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Marken</h1>
          <p className="text-[var(--color-text-secondary)] mt-1">{brands.length} Marken</p>
        </div>
        <button
          onClick={() => { setShowForm(true); setEditingId(null); setForm({ name: "", slug: "" }); }}
          className="flex items-center gap-2 px-4 py-3 bg-[var(--color-accent)] text-white rounded-xl text-sm font-medium hover:bg-[var(--color-accent-hover)] transition-colors"
        >
          <Plus className="w-4 h-4" /> Neue Marke
        </button>
      </div>

      {showForm && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          role="dialog"
          aria-modal="true"
          aria-labelledby="marke-modal-title"
          onClick={(e) => { if (e.target === e.currentTarget) setShowForm(false); }}
          onKeyDown={handleModalKeyDown}
        >
          <div ref={modalRef} className="bg-white rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h2 id="marke-modal-title" className="text-lg font-bold">{editingId ? "Marke bearbeiten" : "Neue Marke"}</h2>
              <button onClick={() => setShowForm(false)} aria-label="Modal schließen" className="p-1 hover:bg-[var(--color-bg)] rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="marke-name" className="block text-sm font-medium text-[var(--color-text-primary)] mb-1">Name</label>
                <input
                  id="marke-name"
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value, slug: slugify(e.target.value) })}
                  className="w-full px-3 py-3 border border-[var(--color-border)] rounded-xl text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/20"
                  maxLength={100}
                  required
                />
              </div>
              <div>
                <label htmlFor="marke-slug" className="block text-sm font-medium text-[var(--color-text-primary)] mb-1">Slug</label>
                <input
                  id="marke-slug"
                  type="text"
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  className="w-full px-3 py-3 border border-[var(--color-border)] rounded-xl text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/20"
                  maxLength={100}
                  required
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

      <div className="bg-white rounded-xl border border-[var(--color-border-light)] overflow-hidden">
        <table className="w-full">
          <caption className="sr-only">Marken</caption>
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
            ) : loadError ? (
              <tr><td colSpan={4} className="px-4 py-12 text-center text-[var(--color-danger)]" role="alert">Marken konnten nicht geladen werden.</td></tr>
            ) : brands.length === 0 ? (
              <tr><td colSpan={4} className="px-4 py-12 text-center text-[var(--color-text-muted)]">Keine Marken gefunden.</td></tr>
            ) : brands.map((brand) => (
              <tr key={brand.id} className="border-b border-[var(--color-border-light)] last:border-0 hover:bg-[var(--color-bg)]">
                <td className="px-4 py-3">
                  <p className="font-semibold text-[var(--color-text-primary)]">{brand.name}</p>
                </td>
                <td className="px-4 py-3 hidden md:table-cell">
                  <code className="text-xs bg-[var(--color-bg)] px-2 py-1 rounded">{brand.slug}</code>
                </td>
                <td className="px-4 py-3 text-center">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-sm font-bold">
                    {brand._count.products}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button onClick={() => handleEdit(brand)} aria-label={`Marke ${brand.name} bearbeiten`} className="p-2 text-[var(--color-text-muted)] hover:text-[var(--color-primary)] hover:bg-[var(--color-primary)]/10 rounded-lg">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(brand.id, brand.name, brand._count.products)} aria-label={`Marke ${brand.name} löschen`} className="p-2 text-[var(--color-text-muted)] hover:text-[var(--color-danger)] hover:bg-[var(--color-danger-light)] rounded-lg">
                      <Trash2 className="w-4 h-4" />
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
        title={`Marke "${deleteTarget?.name}" löschen`}
        message={deleteTarget?.count ? `${deleteTarget.count} Produkte sind dieser Marke zugeordnet. Die Marke kann erst gelöscht werden, wenn keine Produkte mehr zugeordnet sind.` : "Möchten Sie diese Marke wirklich löschen?"}
        confirmLabel="Löschen"
        danger
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
