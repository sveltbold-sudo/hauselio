"use client";

import { useEffect, useState, useTransition } from "react";
import { Mail, Search, Trash2, Download, Send } from "lucide-react";
import { useToast } from "@/components/ui/Toast";
import { logger } from "@/lib/logger";
import DOMPurify from "isomorphic-dompurify";
import ConfirmDialog from "@/components/ui/ConfirmDialog";

export const dynamic = "force-dynamic";

interface Subscriber {
  id: string;
  email: string;
  isActive: boolean;
  createdAt: string;
}

export default function NewsletterPage() {
  const toast = useToast();
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [activeCount, setActiveCount] = useState(0);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [showCompose, setShowCompose] = useState(false);
  const [campaignSubject, setCampaignSubject] = useState("");
  const [campaignContent, setCampaignContent] = useState("");
  const [sending, setSending] = useState(false);
  const [previewTab, setPreviewTab] = useState<"edit" | "preview">("edit");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showSendConfirm, setShowSendConfirm] = useState(false);
  const [, startTransition] = useTransition();

  useEffect(() => {
    fetch("/api/admin/newsletter?limit=1000")
      .then((r) => {
        if (!r.ok) throw new Error("Failed to load");
        return r.json();
      })
      .then((data) => startTransition(() => {
        setSubscribers(data.subscribers || []);
        setTotalCount(data.pagination?.total ?? data.subscribers?.length ?? 0);
        setActiveCount(data.activeCount ?? data.subscribers?.filter((s: Subscriber) => s.isActive).length ?? 0);
      }))
      .catch((err) => { logger.error("Failed to load data", { error: err }); setLoadError(true); })
      .finally(() => setLoading(false));
  }, [startTransition]);

  const handleToggle = async (id: string, isActive: boolean) => {
    try {
      const res = await fetch(`/api/admin/newsletter/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !isActive }),
      });
      if (!res.ok) throw new Error("Fehler beim Aktualisieren");
      setSubscribers((prev) =>
        prev.map((s) => (s.id === id ? { ...s, isActive: !isActive } : s))
      );
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Fehler beim Aktualisieren");
    }
  };

  const handleDelete = async (id: string) => {
    setDeleteId(id);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      const res = await fetch(`/api/admin/newsletter/${deleteId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Fehler beim Löschen");
      setSubscribers((prev) => prev.filter((s) => s.id !== deleteId));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Fehler beim Löschen");
    } finally {
      setDeleteId(null);
    }
  };

  const handleSendCampaign = async () => {
    if (!campaignSubject.trim() || !campaignContent.trim()) {
      toast.error("Betreff und Inhalt sind erforderlich.");
      return;
    }

    if (sending) return;
    setShowSendConfirm(true);
  };

  const confirmSend = async () => {
    setShowSendConfirm(false);
    setSending(true);
    try {
      const res = await fetch("/api/admin/newsletter/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: campaignSubject,
          content: campaignContent,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Fehler beim Senden");
      }

      toast.success(`Newsletter erfolgreich gesendet! (${data.sent}/${data.total} zugestellt)`);
      setShowCompose(false);
      setCampaignSubject("");
      setCampaignContent("");
      setPreviewTab("edit");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Fehler beim Senden");
    } finally {
      setSending(false);
    }
  };

  const exportCSV = () => {
    const escapeCSV = (val: string) => {
      if (val.includes(";") || val.includes('"') || val.includes("\n")) {
        return `"${val.replace(/"/g, '""')}"`;
      }
      return val;
    };
    const csv = "E-Mail;Aktiv;Datum\n" + subscribers.map((s) => `${escapeCSV(s.email)};${s.isActive};${new Date(s.createdAt).toLocaleDateString("de-DE")}`).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `newsletter-abonnenten-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filtered = subscribers.filter((s) =>
    s.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Newsletter</h1>
          <p className="text-[var(--color-text-secondary)] mt-1">
            {totalCount} Abonnenten ({activeCount} aktiv)
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowCompose(!showCompose)}
            aria-expanded={showCompose}
            className="flex items-center gap-2 px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg text-sm font-medium hover:bg-[var(--color-primary-hover)] transition-colors"
          >
            <Send className="w-4 h-4" aria-hidden="true" /> Newsletter senden
          </button>
          <button
            onClick={exportCSV}
            aria-label="CSV exportieren"
            className="flex items-center gap-2 px-4 py-2 border border-[var(--color-border)] text-[var(--color-text-secondary)] rounded-lg text-sm font-medium hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors"
          >
            <Download className="w-4 h-4" aria-hidden="true" /> CSV
          </button>
        </div>
      </div>

      {/* Compose Newsletter */}
      {showCompose && (
        <div className="bg-white rounded-xl border border-[var(--color-border-light)] p-6 mb-8">
          <h2 className="font-bold text-[var(--color-text-primary)] mb-4">Newsletter verfassen</h2>
          <p className="text-sm text-[var(--color-text-muted)] mb-4">
            Wird an {activeCount} aktive Abonnenten gesendet.
          </p>
          <div className="space-y-4">
            <div>
              <label htmlFor="campaign-subject" className="block text-sm font-semibold text-[var(--color-text-primary)] mb-1.5">Betreff *</label>
              <input
                id="campaign-subject"
                type="text"
                value={campaignSubject}
                onChange={(e) => setCampaignSubject(e.target.value)}
                placeholder="z. B. Neue Angebote im Mai"
                className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-xl text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/20"
              />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <label htmlFor="campaign-content" className="text-sm font-semibold text-[var(--color-text-primary)]">Inhalt (HTML) *</label>
                <div className="flex items-center gap-1 ml-auto">
                  <button
                    type="button"
                    onClick={() => setPreviewTab("edit")}
                    className={`px-2 py-0.5 text-xs font-medium rounded transition-colors ${
                      previewTab === "edit"
                        ? "bg-[var(--color-primary)] text-white"
                        : "text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
                    }`}
                  >
                    Bearbeiten
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewTab("preview")}
                    className={`px-2 py-0.5 text-xs font-medium rounded transition-colors ${
                      previewTab === "preview"
                        ? "bg-[var(--color-primary)] text-white"
                        : "text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
                    }`}
                  >
                    Vorschau
                  </button>
                </div>
              </div>
              {previewTab === "edit" ? (
                <textarea
                  id="campaign-content"
                  rows={8}
                  value={campaignContent}
                  onChange={(e) => setCampaignContent(e.target.value)}
                  placeholder="<h2>Ueberschrift</h2><p>Ihr Text hier...</p>"
                  className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-xl text-sm font-mono focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/20 resize-none"
                />
              ) : (
                <div className="border border-[var(--color-border)] rounded-xl overflow-hidden">
                  <div className="bg-[var(--color-bg)] px-4 py-2 border-b border-[var(--color-border-light)]">
                    <p className="text-xs text-[var(--color-text-muted)]">Vorschau — {campaignSubject || "(kein Betreff)"}</p>
                  </div>
                  <div
                    className="p-4 bg-white min-h-[200px] prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(campaignContent || "<p class='text-[var(--color-text-muted)]'>Kein Inhalt eingegeben.</p>", { ALLOWED_TAGS: ["h1","h2","h3","h4","p","br","hr","strong","em","b","i","u","s","a","ul","ol","li","table","thead","tbody","tr","th","td","img","div","span","blockquote","pre","code","sub","sup","small","mark"], ALLOWED_ATTR: ["href","src","alt","width","height","class","style","target","rel","title","align","valign","border","cellpadding","cellspacing","bgcolor","color","face","size"] }) }}
                  />
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleSendCampaign}
                disabled={sending || activeCount === 0}
                className="flex items-center gap-2 px-5 py-2.5 bg-[var(--color-primary)] text-white rounded-lg text-sm font-medium hover:bg-[var(--color-primary-hover)] transition-colors disabled:opacity-50"
              >
                {sending ? "Wird gesendet…" : `An ${activeCount} Abonnenten senden`}
              </button>
              <button
                onClick={() => setShowCompose(false)}
                className="px-5 py-2.5 border border-[var(--color-border)] text-[var(--color-text-secondary)] rounded-lg text-sm font-medium hover:bg-[var(--color-bg)] transition-colors"
              >
                Abbrechen
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-[var(--color-border-light)] p-4">
          <p className="text-sm text-[var(--color-text-muted)]">Gesamt</p>
          <p className="text-2xl font-bold text-[var(--color-text-primary)]">{totalCount}</p>
        </div>
        <div className="bg-white rounded-xl border border-[var(--color-border-light)] p-4">
          <p className="text-sm text-[var(--color-text-muted)]">Aktiv</p>
          <p className="text-2xl font-bold text-[var(--color-success)]">{activeCount}</p>
        </div>
        <div className="bg-white rounded-xl border border-[var(--color-border-light)] p-4">
          <p className="text-sm text-[var(--color-text-muted)]">Inaktiv</p>
          <p className="text-2xl font-bold text-[var(--color-text-muted)]">{totalCount - activeCount}</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-text-muted)]" aria-hidden="true" />
        <input
          type="text"
          placeholder="E-Mail suchen…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Abonnenten suchen"
          className="w-full pl-10 pr-4 py-3 border border-[var(--color-border)] rounded-xl text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/20"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-[var(--color-border-light)] overflow-hidden">
        <table className="w-full">
          <caption className="sr-only">Newsletter-Abonnenten</caption>
          <thead>
            <tr className="border-b border-[var(--color-border-light)] bg-[var(--color-bg)]">
              <th className="text-left px-4 py-3 text-xs font-semibold text-[var(--color-text-muted)] uppercase">E-Mail</th>
              <th className="text-center px-4 py-3 text-xs font-semibold text-[var(--color-text-muted)] uppercase">Status</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-[var(--color-text-muted)] uppercase hidden md:table-cell">Datum</th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-[var(--color-text-muted)] uppercase">Aktionen</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={4} className="px-4 py-12 text-center text-[var(--color-text-muted)]">Laden…</td></tr>
            ) : loadError ? (
              <tr><td colSpan={4} className="px-4 py-12 text-center text-[var(--color-danger)]" role="alert">Abonnenten konnten nicht geladen werden. Bitte versuchen Sie es später erneut.</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={4} className="px-4 py-12 text-center text-[var(--color-text-muted)]">Keine Abonnenten gefunden.</td></tr>
            ) : (
              filtered.map((sub) => (
                <tr key={sub.id} className="border-b border-[var(--color-border-light)] last:border-0 hover:bg-[var(--color-bg)]">
                   <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-[var(--color-text-muted)]" aria-hidden="true" />
                      <span className="text-sm text-[var(--color-text-primary)]">{sub.email}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => handleToggle(sub.id, sub.isActive)}
                      aria-label={sub.isActive ? `${sub.email} deaktivieren` : `${sub.email} aktivieren`}
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        sub.isActive
                      ? "bg-[var(--color-success)]/10 text-[var(--color-success)]"
                           : "bg-[var(--color-bg-secondary)] text-[var(--color-text-muted)]"
                      }`}
                    >
                      {sub.isActive ? "Aktiv" : "Inaktiv"}
                    </button>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className="text-xs text-[var(--color-text-muted)]">
                      {new Date(sub.createdAt).toLocaleDateString("de-DE")}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => handleDelete(sub.id)}
                      aria-label="Abonnent löschen"
                      className="p-2 text-[var(--color-text-muted)] hover:text-[var(--color-danger)] hover:bg-[var(--color-danger-light)] rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" aria-hidden="true" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <ConfirmDialog
        open={!!deleteId}
        title="Abonnent löschen"
        message="Möchten Sie diesen Abonnenten wirklich dauerhaft löschen?"
        confirmLabel="Löschen"
        danger
        onConfirm={confirmDelete}
        onCancel={() => setDeleteId(null)}
      />
      <ConfirmDialog
        open={showSendConfirm}
        title="Newsletter senden"
        message={`Newsletter wirklich an ${activeCount} aktive Abonnenten senden?`}
        confirmLabel="Senden"
        onConfirm={confirmSend}
        onCancel={() => setShowSendConfirm(false)}
      />
    </div>
  );
}
