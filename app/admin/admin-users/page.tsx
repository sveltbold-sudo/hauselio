"use client";

import { useEffect, useState, useTransition, useRef, useCallback } from "react";
import { Plus, Pencil, Trash2, X, Shield, ShieldOff } from "lucide-react";
import { useToast } from "@/components/ui/Toast";
import { logger } from "@/lib/logger";
import ConfirmDialog from "@/components/ui/ConfirmDialog";

export const dynamic = "force-dynamic";

interface AdminUser {
  id: string;
  email: string;
  name: string | null;
  role: string;
  lastLogin: string | null;
  createdAt: string;
}

export default function AdminUsersPage() {
  const toast = useToast();
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ email: "", password: "", name: "", role: "ADMIN" });
  const [submitting, setSubmitting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; email: string } | null>(null);
  const [, startTransition] = useTransition();
  const modalRef = useRef<HTMLDivElement>(null);

  const handleModalKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Escape") { setShowForm(false); return; }
    if (e.key !== "Tab" || !modalRef.current) return;
    const focusable = modalRef.current.querySelectorAll<HTMLElement>(
      'input, select, button:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    if (focusable.length === 0) return;
    const first = focusable[0]!;
    const last = focusable[focusable.length - 1]!;
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }, []);

  const loadAdmins = () => {
    setLoading(true);
    fetch("/api/admin/admin-users")
      .then((r) => { if (!r.ok) throw new Error("Failed"); return r.json(); })
      .then((data) => startTransition(() => setAdmins(data.admins || [])))
      .catch((err) => { logger.error("Failed to load data", { error: err }); setLoadError(true); })
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadAdmins(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId && form.password && form.password.length < 8) {
      toast.error("Passwort muss mindestens 8 Zeichen lang sein");
      return;
    }
    setSubmitting(true);
    try {
      const payload: Record<string, unknown> = {
        email: form.email,
        name: form.name || null,
        role: form.role,
      };
      if (form.password || !editingId) {
        payload.password = form.password;
      }
      const method = editingId ? "PUT" : "POST";
      const url = editingId ? `/api/admin/admin-users/${editingId}` : "/api/admin/admin-users";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || "Fehler beim Speichern");
      }
      toast.success(editingId ? "Admin aktualisiert!" : "Admin erstellt!");
      setShowForm(false);
      setEditingId(null);
      setForm({ email: "", password: "", name: "", role: "ADMIN" });
      loadAdmins();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Fehler beim Speichern");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (admin: AdminUser) => {
    setForm({ email: admin.email, password: "", name: admin.name || "", role: admin.role });
    setEditingId(admin.id);
    setShowForm(true);
  };

  const handleDelete = (id: string, email: string) => {
    setDeleteTarget({ id, email });
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      const res = await fetch(`/api/admin/admin-users/${deleteTarget.id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || "Fehler beim Löschen");
      }
      toast.success("Admin gelöscht!");
      loadAdmins();
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
          <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Admin-Benutzer</h1>
          <p className="text-[var(--color-text-secondary)] mt-1">{admins.length} Benutzer</p>
        </div>
        <button
          onClick={() => { setShowForm(true); setEditingId(null); setForm({ email: "", password: "", name: "", role: "ADMIN" }); }}
          className="flex items-center gap-2 px-4 py-3 bg-[var(--color-accent)] text-white rounded-xl text-sm font-medium hover:bg-[var(--color-accent-hover)] transition-colors"
        >
          <Plus className="w-4 h-4" /> Neuer Admin
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
              <h2 className="text-lg font-bold">{editingId ? "Admin bearbeiten" : "Neuer Admin"}</h2>
              <button onClick={() => setShowForm(false)} aria-label="Modal schließen" className="p-1 hover:bg-[var(--color-bg)] rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="admin-name" className="block text-sm font-medium text-[var(--color-text-primary)] mb-1">Name</label>
                <input id="admin-name" type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-3 border border-[var(--color-border)] rounded-xl text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/20" />
              </div>
              <div>
                <label htmlFor="admin-email" className="block text-sm font-medium text-[var(--color-text-primary)] mb-1">E-Mail *</label>
                <input id="admin-email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full px-3 py-3 border border-[var(--color-border)] rounded-xl text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/20" required />
              </div>
              <div>
                <label htmlFor="admin-password" className="block text-sm font-medium text-[var(--color-text-primary)] mb-1">
                  Passwort {editingId ? "(leer lassen, um nicht zu ändern)" : "*"}
                </label>
                <input id="admin-password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} minLength={editingId ? undefined : 8} className="w-full px-3 py-3 border border-[var(--color-border)] rounded-xl text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/20" required={!editingId} />
              </div>
              <div>
                <label htmlFor="admin-role" className="block text-sm font-medium text-[var(--color-text-primary)] mb-1">Rolle</label>
                <select id="admin-role" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="w-full px-3 py-3 border border-[var(--color-border)] rounded-xl text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/20">
                  <option value="ADMIN">ADMIN</option>
                  <option value="EDITOR">EDITOR</option>
                </select>
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

      <div className="bg-white rounded-xl border border-[var(--color-border-light)] overflow-hidden">
        <table className="w-full">
          <caption className="sr-only">Admin-Benutzer</caption>
          <thead>
            <tr className="border-b border-[var(--color-border-light)] bg-[var(--color-bg)]">
              <th className="text-left px-4 py-3 text-xs font-semibold text-[var(--color-text-muted)] uppercase">E-Mail</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-[var(--color-text-muted)] uppercase hidden md:table-cell">Name</th>
              <th className="text-center px-4 py-3 text-xs font-semibold text-[var(--color-text-muted)] uppercase">Rolle</th>
              <th className="text-center px-4 py-3 text-xs font-semibold text-[var(--color-text-muted)] uppercase hidden md:table-cell">Letzter Login</th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-[var(--color-text-muted)] uppercase">Aktionen</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="px-4 py-12 text-center text-[var(--color-text-muted)]">Laden...</td></tr>
            ) : loadError ? (
              <tr><td colSpan={5} className="px-4 py-12 text-center text-[var(--color-danger)]" role="alert">Admins konnten nicht geladen werden.</td></tr>
            ) : admins.length === 0 ? (
              <tr><td colSpan={5} className="px-4 py-12 text-center text-[var(--color-text-muted)]">Keine Admins gefunden.</td></tr>
            ) : admins.map((admin) => (
              <tr key={admin.id} className="border-b border-[var(--color-border-light)] last:border-0 hover:bg-[var(--color-bg)]">
                <td className="px-4 py-3">
                  <p className="font-semibold text-[var(--color-text-primary)]">{admin.email}</p>
                </td>
                <td className="px-4 py-3 hidden md:table-cell">
                  <span className="text-sm text-[var(--color-text-secondary)]">{admin.name || "—"}</span>
                </td>
                <td className="px-4 py-3 text-center">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                    admin.role === "ADMIN" ? "bg-[var(--color-primary)]/10 text-[var(--color-primary)]" : "bg-[var(--color-bg-secondary)] text-[var(--color-text-secondary)]"
                  }`}>
                    {admin.role === "ADMIN" ? <Shield className="w-3 h-3" /> : <ShieldOff className="w-3 h-3" />}
                    {admin.role}
                  </span>
                </td>
                <td className="px-4 py-3 text-center hidden md:table-cell">
                  <span className="text-sm text-[var(--color-text-muted)]">
                    {admin.lastLogin ? new Date(admin.lastLogin).toLocaleDateString("de-DE") : "Nie"}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button onClick={() => handleEdit(admin)} aria-label="Admin bearbeiten" className="p-2 text-[var(--color-text-muted)] hover:text-[var(--color-primary)] hover:bg-[var(--color-primary)]/10 rounded-lg">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(admin.id, admin.email)} aria-label="Admin löschen" className="p-2 text-[var(--color-text-muted)] hover:text-[var(--color-danger)] hover:bg-[var(--color-danger-light)] rounded-lg">
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
        title={`Admin "${deleteTarget?.email}" löschen`}
        message="Möchten Sie dieses Admin-Konto wirklich dauerhaft löschen?"
        confirmLabel="Löschen"
        danger
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
