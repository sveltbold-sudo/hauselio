"use client";

import { useState, useMemo } from "react";
import { Star, Filter, Check } from "lucide-react";

interface Review {
  id: string;
  authorName: string;
  rating: number;
  title: string | null;
  content: string | null;
  createdAt: Date;
  product: { name: string; slug: string };
}

interface ReviewFiltersProps {
  reviews: Review[];
}

export default function ReviewFilters({ reviews }: ReviewFiltersProps) {
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState("newest");

  const filteredReviews = useMemo(() => {
    return reviews
      .filter((r) => (selectedRating ? r.rating === selectedRating : true))
      .sort((a, b) => {
        if (sortBy === "newest") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        if (sortBy === "highest") return b.rating - a.rating;
        if (sortBy === "lowest") return a.rating - b.rating;
        return 0;
      });
  }, [reviews, selectedRating, sortBy]);

  return (
    <div className="lg:col-span-2 space-y-4">
      {/* Filter controls */}
      <div className="bg-[var(--color-bg)] rounded-2xl p-6">
        <div className="mt-4 space-y-3">
          <p className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
            Filtern nach
          </p>
          <div className="flex flex-wrap gap-2">
            {[5, 4, 3, 2, 1].map((rating) => (
              <button
                key={rating}
                onClick={() => setSelectedRating(selectedRating === rating ? null : rating)}
                className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  selectedRating === rating
                    ? "bg-[var(--color-primary)] text-white"
                    : "bg-white border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-primary)]"
                }`}
              >
                {rating} <Star className="w-3 h-3" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Sort bar */}
      <div className="flex items-center justify-between bg-[var(--color-bg)] rounded-xl p-4">
        <p className="text-sm font-medium text-[var(--color-text-secondary)]">
          {filteredReviews.length} Bewertungen
        </p>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-[var(--color-text-muted)]" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            aria-label="Bewertungen sortieren"
            className="text-sm border-0 bg-transparent font-medium text-[var(--color-text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] rounded-lg cursor-pointer"
          >
            <option value="newest">Neueste zuerst</option>
            <option value="highest">Beste Bewertung</option>
            <option value="lowest">Schlechteste Bewertung</option>
          </select>
        </div>
      </div>

      {/* Reviews list */}
      {filteredReviews.map((review, i) => (
        <div
          key={review.id}
          className="bg-white rounded-2xl p-6 border border-[var(--color-border-light)] animate-fade-in-up"
          style={{ animationDelay: `${i * 80}ms` }}
        >
          <div className="flex items-start justify-between mb-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-[var(--color-text-primary)]">
                  {review.authorName}
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[var(--color-success-light)] text-[var(--color-success)] text-xs font-bold rounded-full">
                  <Check className="w-3 h-3" />
                  Verifiziert
                </span>
              </div>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, j) => (
                  <Star
                    key={j}
                    aria-hidden="true"
                    className={`w-4 h-4 ${
                      j < review.rating
                        ? "text-amber-400 fill-amber-400"
                        : "text-gray-200"
                    }`}
                  />
                ))}
              </div>
            </div>
            <span className="text-xs text-[var(--color-text-muted)]">
              {new Date(review.createdAt).toLocaleDateString("de-DE", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>

          {review.title && (
            <h4 className="font-bold text-[var(--color-text-primary)] mb-2">
              {review.title}
            </h4>
          )}
          {review.content && (
            <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
              {review.content}
            </p>
          )}

          <div className="flex items-center gap-4 mt-4 pt-4 border-t border-[var(--color-border-light)]">
            <span className="text-xs text-[var(--color-text-muted)]">
              {review.product.name}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
