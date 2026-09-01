"use client";

import { useEffect, useState, useTransition, useRef, useCallback } from "react";
import { Plus, Pencil, Trash2, X, Ticket, Copy } from "lucide-react";
import { useToast } from "@/components/ui/Toast";
import { logger } from "@/lib/logger";
import ConfirmDialog from "@/components/ui/ConfirmDialog";

export const dynamic = "force-dynamic";

interface Coupon {
  id: string;
  code: string;
  discountPercent: number;
  maxUses: number;
  usedCount: number;
  expiresAt: string | null;
  isActive: boolean;
  createdAt: string;
}

export default function CouponsPage() {
  const toast = useToast();
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, pages: 0 });
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ code: "", discountPercent: 10, maxUses: 0, expiresAt: "", isActive: true });
  const [submitting, setSubmitting] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [, startTransition] = useTransition();
  const modalRef = useRef<HTMLDivElement>(null);

  const handleModalKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setShowForm(false);
      return;
    }
    if (e.key !== "Tab" || !modalRef.current) return;
    const focusable = modalRef.current.querySelectorAll<HTMLElement>(
      'input, select, button:not([disabled]), [tabindex]:not([tabindex="-1"])'
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

  const loadCoupons = () => {
    setLoading(true);
    fetch(`/api/admin/coupons?page=${page}&limit=20`)
      .then((r) => {
        if (!r.ok) throw new Error("Failed to load");
        return r.json();
      })
      .then((data) => {
        startTransition(() => {
          setCoupons(data.coupons || []);
          if (data.pagination) setPagination(data.pagination);
        });
      })
      .catch((err) => { logger.error("Failed to load data", { error: err }); setLoadError(true); })
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadCoupons(); }, [page]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        code: form.code.toUpperCase(),
        discountPercent: form.discountPercent,
        maxUses: form.maxUses,
        expiresAt: form.expiresAt ? new Date(form.expiresAt).toISOString() : null,
        isActive: form.isActive,
      };
      const method = editingId ? "PUT" : "POST";
      const url = editingId ? `/api/admin/coupons/${editingId}` : "/api/admin/coupons";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || "Fehler beim Speichern");
      }
      toast.success(editingId ? "Gutschein aktualisiert!" : "Gutschein erstellt!");
      setShowForm(false);
      setEditingId(null);
      setForm({ code: "", discountPercent: 10, maxUses: 0, expiresAt: "", isActive: true });
      loadCoupons();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Fehler beim Speichern");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (coupon: Coupon) => {
    setForm({
      code: coupon.code,
      discountPercent: coupon.discountPercent,
      maxUses: coupon.maxUses,
      expiresAt: coupon.expiresAt ? (coupon.expiresAt.split("T")[0] ?? "") : "",
      isActive: coupon.isActive,
    });
    setEditingId(coupon.id);
    setShowForm(true);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      const res = await fetch(`/api/admin/coupons/${deleteId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Fehler beim Löschen");
      toast.success("Gutschein gelöscht!");
      loadCoupons();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Fehler beim Löschen");
    } finally {
      setDeleteId(null);
    }
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success("Code kopiert!");
  };

  const now = new Date();

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Gutscheine</h1>
          <p className="text-[var(--color-text-secondary)] mt-1">{pagination.total} Gutscheine insgesamt</p>
        </div>
        <button
          onClick={() => { setShowForm(true); setEditingId(null); setForm({ code: "", discountPercent: 10, maxUses: 0, expiresAt: "", isActive: true }); }}
          className="flex items-center gap-2 px-4 py-3 bg-[var(--color-accent)] text-white rounded-xl text-sm font-medium hover:bg-[var(--color-accent-hover)] transition-colors"
        >
          <Plus className="w-4 h-4" /> Neuer Gutschein
        </button>
      </div>

      {showForm && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          role="dialog"
          aria-modal="true"
          onClick={(e) => { if (e.target === e.currentTarget) setShowForm(false); }}
          onKeyDown={handleModalKeyDown}
        >
          <div ref={modalRef} className="bg-white rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">{editingId ? "Gutschein bearbeiten" : "Neuer Gutschein"}</h2>
              <button onClick={() => setShowForm(false)} aria-label="Modal schließen" className="p-1 hover:bg-[var(--color-bg)] rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="coupon-code" className="block text-sm font-medium text-[var(--color-text-primary)] mb-1">Code</label>
                <input
                  id="coupon-code"
                  type="text"
                  value={form.code}
                  onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                  placeholder="z.B. WILLKOMMEN10"
                  className="w-full px-3 py-3 border border-[var(--color-border)] rounded-xl text-sm font-mono uppercase focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/20"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="coupon-discount" className="block text-sm font-medium text-[var(--color-text-primary)] mb-1">Rabatt (%)</label>
                  <input
                    id="coupon-discount"
                    type="number"
                    min={1}
                    max={100}
                    value={form.discountPercent}
                    onChange={(e) => setForm({ ...form, discountPercent: parseInt(e.target.value) || 10 })}
                    className="w-full px-3 py-3 border border-[var(--color-border)] rounded-xl text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/20"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="coupon-max" className="block text-sm font-medium text-[var(--color-text-primary)] mb-1">Max. Nutzungen</label>
                  <input
                    id="coupon-max"
                    type="number"
                    min={0}
                    value={form.maxUses}
                    onChange={(e) => setForm({ ...form, maxUses: parseInt(e.target.value) || 0 })}
                    placeholder="0 = unbegrenzt"
                    className="w-full px-3 py-3 border border-[var(--color-border)] rounded-xl text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/20"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="coupon-expires" className="block text-sm font-medium text-[var(--color-text-primary)] mb-1">Ablaufdatum (optional)</label>
                <input
                  id="coupon-expires"
                  type="date"
                  value={form.expiresAt}
                  onChange={(e) => setForm({ ...form, expiresAt: e.target.value })}
                  className="w-full px-3 py-3 border border-[var(--color-border)] rounded-xl text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/20"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  id="coupon-active"
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                  className="w-4 h-4 rounded border-[var(--color-border)] text-[var(--color-primary)] focus:ring-[var(--color-primary)]/20"
                />
                <label htmlFor="coupon-active" className="text-sm text-[var(--color-text-secondary)]">Aktiv</label>
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
          <caption className="sr-only">Gutscheine</caption>
          <thead>
            <tr className="border-b border-[var(--color-border-light)] bg-[var(--color-bg)]">
              <th className="text-left px-4 py-3 text-xs font-semibold text-[var(--color-text-muted)] uppercase">Code</th>
              <th className="text-center px-4 py-3 text-xs font-semibold text-[var(--color-text-muted)] uppercase">Rabatt</th>
              <th className="text-center px-4 py-3 text-xs font-semibold text-[var(--color-text-muted)] uppercase hidden md:table-cell">Nutzungen</th>
              <th className="text-center px-4 py-3 text-xs font-semibold text-[var(--color-text-muted)] uppercase hidden md:table-cell">Ablauf</th>
              <th className="text-center px-4 py-3 text-xs font-semibold text-[var(--color-text-muted)] uppercase">Status</th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-[var(--color-text-muted)] uppercase">Aktionen</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="px-4 py-12 text-center text-[var(--color-text-muted)]">Laden...</td></tr>
            ) : loadError ? (
              <tr><td colSpan={6} className="px-4 py-12 text-center text-[var(--color-danger)]" role="alert">Gutscheine konnten nicht geladen werden.</td></tr>
            ) : coupons.length === 0 ? (
              <tr><td colSpan={6} className="px-4 py-12 text-center text-[var(--color-text-muted)]">Keine Gutscheine gefunden.</td></tr>
            ) : coupons.map((coupon) => {
              const isExpired = coupon.expiresAt && new Date(coupon.expiresAt) < now;
              const isMaxed = coupon.maxUses > 0 && coupon.usedCount >= coupon.maxUses;
              return (
                <tr key={coupon.id} className="border-b border-[var(--color-border-light)] last:border-0 hover:bg-[var(--color-bg)]">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <code className="text-sm font-bold font-mono text-[var(--color-primary)]">{coupon.code}</code>
                      <button onClick={() => copyCode(coupon.code)} className="p-1 text-[var(--color-text-muted)] hover:text-[var(--color-primary)]" aria-label="Code kopieren">
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-sm font-bold bg-[var(--color-accent-light)] text-[var(--color-accent)]">
                      {coupon.discountPercent}%
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center hidden md:table-cell">
                    <span className="text-sm text-[var(--color-text-secondary)]">
                      {coupon.usedCount}{coupon.maxUses > 0 ? ` / ${coupon.maxUses}` : ""}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center hidden md:table-cell">
                    <span className="text-sm text-[var(--color-text-muted)]">
                      {coupon.expiresAt ? new Date(coupon.expiresAt).toLocaleDateString("de-DE") : "—"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    {isExpired ? (
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-[var(--color-bg-secondary)] text-[var(--color-text-muted)]">Abgelaufen</span>
                    ) : isMaxed ? (
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-[var(--color-bg-secondary)] text-[var(--color-text-muted)]">Aufgebraucht</span>
                    ) : coupon.isActive ? (
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-[var(--color-success-light)] text-[var(--color-success)]">Aktiv</span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-[var(--color-bg-secondary)] text-[var(--color-text-muted)]">Inaktiv</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => handleEdit(coupon)} aria-label="Gutschein bearbeiten" className="p-2 text-[var(--color-text-muted)] hover:text-[var(--color-primary)] hover:bg-[var(--color-primary)]/10 rounded-lg">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button onClick={() => setDeleteId(coupon.id)} aria-label="Gutschein löschen" className="p-2 text-[var(--color-text-muted)] hover:text-[var(--color-danger)] hover:bg-[var(--color-danger-light)] rounded-lg">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
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
        title="Gutschein löschen"
        message="Möchten Sie diesen Gutschein wirklich dauerhaft löschen?"
        confirmLabel="Löschen"
        danger
        onConfirm={confirmDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
