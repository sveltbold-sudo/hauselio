"use client";

import { useEffect, useState, useTransition } from "react";
import { Star, Check, X, Trash2 } from "lucide-react";
import { logger } from "@/lib/logger";

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
  const [reviews, setReviews] = useState<Review[]>([]);
  const [filter, setFilter] = useState<"all" | "pending" | "approved">("all");
  const [loading, setLoading] = useState(true);
  const [, startTransition] = useTransition();

  useEffect(() => {
    fetch("/api/admin/bewertungen")
      .then((r) => r.json())
      .then((data) => startTransition(() => setReviews(data.reviews || [])))
      .catch((err) => logger.error("Failed to load data", { error: err }))
      .finally(() => setLoading(false));
  }, [startTransition]);

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
    } catch {
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bewertung wirklich löschen?")) return;
    try {
      const res = await fetch(`/api/admin/bewertungen/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Fehler beim Löschen");
      setReviews((prev) => prev.filter((r) => r.id !== id));
    } catch {
    }
  };

  const filtered = reviews.filter((r) => {
    if (filter === "pending") return !r.isApproved;
    if (filter === "approved") return r.isApproved;
    return true;
  });

  const pendingCount = reviews.filter((r) => !r.isApproved).length;

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Bewertungen</h1>
        <p className="text-[var(--color-text-secondary)] mt-1">
          {reviews.length} Bewertungen insgesamt
          {pendingCount > 0 && (
            <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
              {pendingCount} ausstehend
            </span>
          )}
        </p>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6">
        {(["all", "pending", "approved"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
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
          <div className="text-center py-12 text-[var(--color-text-muted)]">Laden...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 text-[var(--color-text-muted)]">Keine Bewertungen gefunden.</div>
        ) : (
          filtered.map((review) => (
            <div
              key={review.id}
              className={`bg-white rounded-xl border p-5 ${
                review.isApproved
                  ? "border-[var(--color-border-light)]"
                  : "border-amber-300 bg-amber-50/30"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="flex">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < review.rating
                              ? "text-[var(--color-orange)] fill-[var(--color-orange)]"
                              : "text-gray-200"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm font-semibold text-[var(--color-text-primary)]">
                      {review.rating}/5
                    </span>
                    {!review.isApproved && (
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
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
                <div className="flex items-center gap-2">
                  {!review.isApproved && (
                    <button
                      onClick={() => handleApprove(review.id, true)}
                      className="p-2 text-[var(--color-success)] hover:bg-[var(--color-success)]/10 rounded-lg transition-colors"
                      aria-label="Bewertung genehmigen"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  )}
                  {review.isApproved && (
                    <button
                      onClick={() => handleApprove(review.id, false)}
                      className="p-2 text-amber-600 hover:bg-amber-100 rounded-lg transition-colors"
                      aria-label="Genehmigung entziehen"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(review.id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
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
    </div>
  );
}
