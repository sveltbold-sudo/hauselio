"use client";

import { useEffect, useState, useTransition } from "react";
import { Star, Check, X, Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/Toast";
import { logger } from "@/lib/logger";
import ConfirmDialog from "@/components/ui/ConfirmDialog";

export const dynamic = "force-dynamic";

interface Review {
  id: string;
  rating: number;
  title: string;
  content: string;
  authorName: string;
  authorEmail: string;
  isApproved: boolean;
  createdAt: string;
  product: { name: string; slug: string };
}

export default function BewertungenPage() {
  const toast = useToast();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [filter, setFilter] = useState<"all" | "pending" | "approved">("all");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, pages: 0 });
  const [pendingCount, setPendingCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  useEffect(() => {
    setLoading(true);
    fetch(`/api/admin/bewertungen?page=${page}&limit=20&filter=${filter}`)
      .then((r) => {
        if (!r.ok) throw new Error("Failed to load");
        return r.json();
      })
      .then((data) => {
        startTransition(() => {
          setReviews(data.reviews || []);
          if (data.pagination) setPagination(data.pagination);
          if (typeof data.pendingCount === "number") setPendingCount(data.pendingCount);
        });
      })
      .catch((err) => { logger.error("Failed to load data", { error: err }); setLoadError(true); })
      .finally(() => setLoading(false));
  }, [page, filter, startTransition]);

  const handleApprove = async (id: string, approved: boolean) => {
    try {
      const res = await fetch(`/api/admin/bewertungen/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isApproved: approved }),
      });
      if (!res.ok) throw new Error("Fehler beim Aktualisieren");
      setReviews((prev) =>
        prev.map((r) => (r.id === id ? { ...r, isApproved: approved } : r))
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
      const res = await fetch(`/api/admin/bewertungen/${deleteId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Fehler beim Löschen");
      setReviews((prev) => prev.filter((r) => r.id !== deleteId));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Fehler beim Löschen");
    } finally {
      setDeleteId(null);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Bewertungen</h1>
        <p className="text-[var(--color-text-secondary)] mt-1">
          {reviews.length} Bewertungen insgesamt
          {pendingCount > 0 && (
            <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[var(--color-bg-secondary)] text-[var(--color-text-muted)]">
              {pendingCount} ausstehend
            </span>
          )}
        </p>
      </div>

      {/* Filters */}
      <div role="group" aria-label="Bewertungsfilter" className="flex gap-2 mb-6">
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

      {/* Reviews */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-12 text-[var(--color-text-muted)]" role="status" aria-label="Wird geladen">Laden...</div>
        ) : loadError ? (
          <div className="text-center py-12 text-[var(--color-danger)]" role="alert">Bewertungen konnten nicht geladen werden. Bitte versuchen Sie es später erneut.</div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-12 text-[var(--color-text-muted)]">Keine Bewertungen gefunden.</div>
        ) : (
          reviews.map((review) => (
            <div
              key={review.id}
              className={`bg-white rounded-xl border p-5 ${
                review.isApproved
                  ? "border-[var(--color-border-light)]"
                  : "border-[var(--color-border)] bg-[var(--color-bg)]"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="flex" role="img" aria-label={`Bewertung: ${review.rating} von 5 Sternen`}>
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          aria-hidden="true"
                          className={`w-4 h-4 ${
                            i < review.rating
                              ? "text-[var(--color-accent)] fill-[var(--color-accent)]"
                              : "text-[var(--color-star-empty)]"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm font-semibold text-[var(--color-text-primary)]">
                      {review.rating}/5
                    </span>
                    {!review.isApproved && (
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-[var(--color-accent-light)] text-[var(--color-text-primary)]">
                        Ausstehend
                      </span>
                    )}
                  </div>
                  <h3 className="font-semibold text-[var(--color-text-primary)] mb-1">
                    {review.title}
                  </h3>
                  <p className="text-sm text-[var(--color-text-secondary)] mb-2">
                    {review.content}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-[var(--color-text-muted)]">
                    <span>{review.authorName}</span>
                    <span>•</span>
                    <span>{review.authorEmail}</span>
                    <span>•</span>
                    <span>{review.product.name}</span>
                    <span>•</span>
                    <span>{new Date(review.createdAt).toLocaleDateString("de-DE")}</span>
                  </div>
                </div>
                <div className="flex items-center gap-0.5 sm:gap-2 shrink-0">
                  {!review.isApproved && (
                    <button
                      onClick={() => handleApprove(review.id, true)}
                      className="p-1.5 sm:p-2 text-[var(--color-success)] hover:bg-[var(--color-success)]/10 rounded-lg transition-colors"
                      aria-label="Bewertung genehmigen"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  )}
                  {review.isApproved && (
                    <button
                      onClick={() => handleApprove(review.id, false)}
                      className="p-1.5 sm:p-2 text-[var(--color-accent)] hover:bg-[var(--color-accent-light)] rounded-lg transition-colors"
                      aria-label="Genehmigung entziehen"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(review.id)}
                    className="p-1.5 sm:p-2 text-[var(--color-danger)] hover:bg-[var(--color-danger-light)] rounded-lg transition-colors"
                    aria-label="Bewertung löschen"
                  >
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
          <p className="text-sm text-[var(--color-text-muted)]">
            Seite {pagination.page} von {pagination.pages}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 text-sm font-medium rounded-lg border border-[var(--color-border-light)] text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Zurück
            </button>
            <button
              onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))}
              disabled={page === pagination.pages}
              className="px-4 py-2 text-sm font-medium rounded-lg border border-[var(--color-border-light)] text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Weiter
            </button>
          </div>
        </div>
      )}
      <ConfirmDialog
        open={!!deleteId}
        title="Bewertung löschen"
        message="Möchten Sie diese Bewertung wirklich dauerhaft löschen?"
        confirmLabel="Löschen"
        danger
        onConfirm={confirmDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
