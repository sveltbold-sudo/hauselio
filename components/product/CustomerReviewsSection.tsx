"use client";

import { useState, useEffect, useMemo } from "react";
import { Star, Filter, Check } from "lucide-react";

interface Review {
  id: string;
  authorName: string;
  rating: number;
  title: string | null;
  content: string | null;
  createdAt: string;
  product: { name: string; slug: string };
}

interface ReviewStats {
  averageRating: number;
  totalReviews: number;
  distribution: { stars: number; count: number; percentage: number }[];
  reviews: Review[];
}

export default function CustomerReviewsSection() {
  const [stats, setStats] = useState<ReviewStats | null>(null);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    fetch("/api/reviews")
      .then((res) => res.json())
      .then((data) => {
        if (data.reviews) {
          setStats(data);
        }
      })
      .catch(() => setStats(null));
  }, []);

  if (!stats || stats.totalReviews === 0) return null;

  const filteredReviews = useMemo(() => {
    if (!stats) return [];
    return stats.reviews
      .filter((r) => (selectedRating ? r.rating === selectedRating : true))
      .sort((a, b) => {
        if (sortBy === "newest") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        if (sortBy === "highest") return b.rating - a.rating;
        if (sortBy === "lowest") return a.rating - b.rating;
        return 0;
      });
  }, [stats, selectedRating, sortBy]);

  const fullStars = Math.floor(stats.averageRating);

  return (
    <section className="section-py bg-white">
      <div className="container-hauselio">
        <div className="text-center mb-12">
          <p className="caption text-[var(--color-primary)] mb-3">Bewertungen</p>
          <h2 className="heading-2">Was unsere Kunden sagen</h2>
          <p className="body-large mt-2">
            Basierend auf {stats.totalReviews} Bewertungen
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Rating Summary */}
          <div className="bg-[var(--color-bg)] rounded-2xl p-6">
            <div className="text-center mb-6">
              <p className="text-5xl font-black text-[var(--color-text-primary)]">
                {stats.averageRating.toFixed(1)}
              </p>
              <div className="flex items-center justify-center gap-1 mt-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < fullStars ? "text-amber-400 fill-amber-400" : "text-gray-200"
                    }`}
                  />
                ))}
              </div>
              <p className="text-sm text-[var(--color-text-muted)] mt-2">
                Basierend auf {stats.totalReviews} Bewertungen
              </p>
            </div>

            <div className="space-y-2">
              {stats.distribution.map((dist) => (
                <div key={dist.stars} className="flex items-center gap-2">
                  <span className="text-xs font-medium w-8">{dist.stars}★</span>
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-400 rounded-full transition-all duration-500"
                      style={{ width: `${dist.percentage}%` }}
                    />
                  </div>
                  <span className="text-xs text-[var(--color-text-muted)] w-10 text-right">
                    {dist.count}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-6 space-y-3">
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

          {/* Reviews List */}
          <div className="lg:col-span-2 space-y-4">
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
        </div>
      </div>
    </section>
  );
}
