"use client";

import { useEffect, useState, useTransition, useRef, useCallback } from "react";
import { Plus, Pencil, Trash2, X, Star, Check, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/components/ui/Toast";
import { logger } from "@/lib/logger";
import ConfirmDialog from "@/components/ui/ConfirmDialog";

export const dynamic = "force-dynamic";

interface Testimonial {
  id: string;
  name: string;
  location: string | null;
  rating: number;
  content: string;
  product: string | null;
  avatar: string | null;
  isApproved: boolean;
  isFeatured: boolean;
  createdAt: string;
}

export default function TestimonialsPage() {
  const toast = useToast();
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [filter, setFilter] = useState<"all" | "pending" | "approved">("all");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, pages: 0 });
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", location: "", rating: 5, content: "", product: "", avatar: "", isApproved: false, isFeatured: false });
  const [submitting, setSubmitting] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [totalPendingCount, setTotalPendingCount] = useState(0);
  const [, startTransition] = useTransition();
  const modalRef = useRef<HTMLDivElement>(null);

  const handleModalKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Escape") { setShowForm(false); return; }
    if (e.key !== "Tab" || !modalRef.current) return;
    const focusable = modalRef.current.querySelectorAll<HTMLElement>(
      'input, textarea, select, button:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    if (focusable.length === 0) return;
    const first = focusable[0]!;
    const last = focusable[focusable.length - 1]!;
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }, []);

  const loadTestimonials = () => {
    setLoading(true);
    fetch(`/api/admin/testimonials?page=${page}&limit=20&filter=${filter}`)
      .then((r) => { if (!r.ok) throw new Error("Failed"); return r.json(); })
      .then((data) => {
        startTransition(() => {
          setTestimonials(data.testimonials || []);
          if (data.pagination) setPagination(data.pagination);
          if (data.pendingCount !== undefined) setTotalPendingCount(data.pendingCount);
        });
      })
      .catch((err) => { logger.error("Failed to load data", { error: err }); setLoadError(true); })
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadTestimonials(); }, [page, filter]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        ...form,
        location: form.location || null,
        product: form.product || null,
        avatar: form.avatar || null,
      };
      const method = editingId ? "PUT" : "POST";
      const url = editingId ? `/api/admin/testimonials/${editingId}` : "/api/admin/testimonials";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || "Fehler beim Speichern");
      }
      toast.success(editingId ? "Testimonial aktualisiert!" : "Testimonial erstellt!");
      setShowForm(false);
      setEditingId(null);
      setForm({ name: "", location: "", rating: 5, content: "", product: "", avatar: "", isApproved: false, isFeatured: false });
      loadTestimonials();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Fehler beim Speichern");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (t: Testimonial) => {
    setForm({
      name: t.name,
      location: t.location || "",
      rating: t.rating,
      content: t.content,
      product: t.product || "",
      avatar: t.avatar || "",
      isApproved: t.isApproved,
      isFeatured: t.isFeatured,
    });
    setEditingId(t.id);
    setShowForm(true);
  };

  const handleToggle = async (id: string, field: "isApproved" | "isFeatured", value: boolean) => {
    try {
      const t = testimonials.find((x) => x.id === id);
      if (!t) return;
      const res = await fetch(`/api/admin/testimonials/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...t, location: t.location || null, product: t.product || null, avatar: t.avatar || null, [field]: value }),
      });
      if (!res.ok) throw new Error("Fehler beim Aktualisieren");
      setTestimonials((prev) => prev.map((x) => (x.id === id ? { ...x, [field]: value } : x)));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Fehler beim Aktualisieren");
    }
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      const res = await fetch(`/api/admin/testimonials/${deleteId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Fehler beim Löschen");
      toast.success("Testimonial gelöscht!");
      loadTestimonials();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Fehler beim Löschen");
    } finally {
      setDeleteId(null);
    }
  };

  const pendingCount = totalPendingCount;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Testimonials</h1>
          <p className="text-[var(--color-text-secondary)] mt-1">
            {pagination.total} insgesamt
            {pendingCount > 0 && (
              <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[var(--color-bg-secondary)] text-[var(--color-text-muted)]">
                {pendingCount} ausstehend
              </span>
            )}
          </p>
        </div>
        <button
          onClick={() => { setShowForm(true); setEditingId(null); setForm({ name: "", location: "", rating: 5, content: "", product: "", avatar: "", isApproved: false, isFeatured: false }); }}
          className="flex items-center gap-2 px-4 py-3 bg-[var(--color-accent)] text-white rounded-xl text-sm font-medium hover:bg-[var(--color-accent-hover)] transition-colors"
        >
          <Plus className="w-4 h-4" /> Neues Testimonial
        </button>
      </div>

      <div role="group" aria-label="Testimonial-Filter" className="flex gap-2 mb-6">
        {(["all", "pending", "approved"] as const).map((f) => (
          <button
            key={f}
            onClick={() => { setFilter(f); setPage(1); }}
            aria-pressed={filter === f}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === f
                ? "bg-[var(--color-primary)] text-white"
                : "bg-white border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-primary)]"
            }`}
          >
            {f === "all" ? "Alle" : f === "pending" ? "Ausstehend" : "Genehmigt"}
          </button>
        ))}
      </div>

      {showForm && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          role="dialog"
          aria-modal="true"
          onClick={(e) => { if (e.target === e.currentTarget) setShowForm(false); }}
          onKeyDown={handleModalKeyDown}
        >
          <div ref={modalRef} className="bg-white rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">{editingId ? "Testimonial bearbeiten" : "Neues Testimonial"}</h2>
              <button onClick={() => setShowForm(false)} aria-label="Modal schließen" className="p-1 hover:bg-[var(--color-bg)] rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="t-name" className="block text-sm font-medium text-[var(--color-text-primary)] mb-1">Name *</label>
                  <input id="t-name" type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-3 border border-[var(--color-border)] rounded-xl text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/20" required />
                </div>
                <div>
                  <label htmlFor="t-location" className="block text-sm font-medium text-[var(--color-text-primary)] mb-1">Standort</label>
                  <input id="t-location" type="text" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="z.B. Berlin" className="w-full px-3 py-3 border border-[var(--color-border)] rounded-xl text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/20" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="t-rating" className="block text-sm font-medium text-[var(--color-text-primary)] mb-1">Bewertung</label>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setForm({ ...form, rating: r })}
                        className="p-0.5"
                        aria-label={`${r} Stern${r > 1 ? "en" : ""}`}
                      >
                        <Star className={`w-6 h-6 ${r <= form.rating ? "text-[var(--color-accent)] fill-[var(--color-accent)]" : "text-[var(--color-star-empty)]"}`} />
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label htmlFor="t-product" className="block text-sm font-medium text-[var(--color-text-primary)] mb-1">Produkt</label>
                  <input id="t-product" type="text" value={form.product} onChange={(e) => setForm({ ...form, product: e.target.value })} placeholder="z.B. Dyson V15" className="w-full px-3 py-3 border border-[var(--color-border)] rounded-xl text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/20" />
                </div>
              </div>
              <div>
                <label htmlFor="t-content" className="block text-sm font-medium text-[var(--color-text-primary)] mb-1">Inhalt *</label>
                <textarea id="t-content" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} className="w-full px-3 py-3 border border-[var(--color-border)] rounded-xl text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/20" rows={3} maxLength={2000} required />
                <p className="mt-1 text-xs text-[var(--color-text-muted)] text-right">{form.content.length} / 2000</p>
              </div>
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={form.isApproved} onChange={(e) => setForm({ ...form, isApproved: e.target.checked })} className="w-4 h-4 rounded border-[var(--color-border)] text-[var(--color-primary)] focus:ring-[var(--color-primary)]/20" />
                  <span className="text-sm text-[var(--color-text-secondary)]">Genehmigt</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={form.isFeatured} onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })} className="w-4 h-4 rounded border-[var(--color-border)] text-[var(--color-primary)] focus:ring-[var(--color-primary)]/20" />
                  <span className="text-sm text-[var(--color-text-secondary)]">Hervorgehoben</span>
                </label>
              </div>
              <div className="flex gap-3 justify-end">
                <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-sm text-[var(--color-text-secondary)] hover:bg-[var(--color-bg)] rounded-lg">Abbrechen</button>
                <button type="submit" disabled={submitting} className="px-4 py-2 bg-[var(--color-accent)] text-white rounded-lg text-sm font-medium hover:bg-[var(--color-accent-hover)] disabled:opacity-50">
                  {submitting ? "Wird gespeichert…" : editingId ? "Speichern" : "Erstellen"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-12 text-[var(--color-text-muted)]" role="status">Laden...</div>
        ) : loadError ? (
          <div className="text-center py-12 text-[var(--color-danger)]" role="alert">Testimonials konnten nicht geladen werden.</div>
        ) : testimonials.length === 0 ? (
          <div className="text-center py-12 text-[var(--color-text-muted)]">Keine Testimonials gefunden.</div>
        ) : (
          testimonials.map((t) => (
            <div key={t.id} className={`bg-white rounded-xl border p-5 ${t.isApproved ? "border-[var(--color-border-light)]" : "border-[var(--color-border)] bg-[var(--color-bg)]"}`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="flex">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={`w-4 h-4 ${i < t.rating ? "text-[var(--color-accent)] fill-[var(--color-accent)]" : "text-[var(--color-star-empty)]"}`} />
                      ))}
                    </div>
                    <span className="text-sm font-semibold text-[var(--color-text-primary)]">{t.rating}/5</span>
                    {!t.isApproved && <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-[var(--color-accent-light)] text-[var(--color-text-primary)]">Ausstehend</span>}
                    {t.isFeatured && <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-[var(--color-primary)]/10 text-[var(--color-primary)]">Hervorgehoben</span>}
                  </div>
                  <p className="text-sm text-[var(--color-text-secondary)] mb-2">{t.content}</p>
                  <div className="flex items-center gap-3 text-xs text-[var(--color-text-muted)]">
                    <span className="font-medium text-[var(--color-text-primary)]">{t.name}</span>
                    {t.location && <span>• {t.location}</span>}
                    {t.product && <span>• {t.product}</span>}
                    <span>• {new Date(t.createdAt).toLocaleDateString("de-DE")}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleToggle(t.id, "isApproved", !t.isApproved)}
                    className={`p-2 rounded-lg transition-colors ${t.isApproved ? "text-[var(--color-success)] hover:bg-[var(--color-success)]/10" : "text-[var(--color-text-muted)] hover:bg-[var(--color-bg)]"}`}
                    aria-label={t.isApproved ? "Genehmigung entziehen" : "Genehmigen"}
                  >
                    {t.isApproved ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => handleToggle(t.id, "isFeatured", !t.isFeatured)}
                    className={`p-2 rounded-lg transition-colors ${t.isFeatured ? "text-[var(--color-primary)] hover:bg-[var(--color-primary)]/10" : "text-[var(--color-text-muted)] hover:bg-[var(--color-bg)]"}`}
                    aria-label={t.isFeatured ? "Hervorhebung entfernen" : "Hervorheben"}
                  >
                    <Star className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleEdit(t)} aria-label="Testimonial bearbeiten" className="p-2 text-[var(--color-text-muted)] hover:text-[var(--color-primary)] hover:bg-[var(--color-primary)]/10 rounded-lg">
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button onClick={() => setDeleteId(t.id)} aria-label="Testimonial löschen" className="p-2 text-[var(--color-text-muted)] hover:text-[var(--color-danger)] hover:bg-[var(--color-danger-light)] rounded-lg">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {pagination.pages > 1 && (
        <div className="flex items-center justify-between mt-6">
          <p className="text-sm text-[var(--color-text-muted)]">Seite {pagination.page} von {pagination.pages}</p>
          <div className="flex gap-2">
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="px-4 py-2 text-sm font-medium rounded-lg border border-[var(--color-border-light)] text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors">Zurück</button>
            <button onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))} disabled={page === pagination.pages} className="px-4 py-2 text-sm font-medium rounded-lg border border-[var(--color-border-light)] text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors">Weiter</button>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={!!deleteId}
        title="Testimonial löschen"
        message="Möchten Sie dieses Testimonial wirklich dauerhaft löschen?"
        confirmLabel="Löschen"
        danger
        onConfirm={confirmDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
