import { Star } from "lucide-react";
import { prisma } from "@/lib/prisma";
import ReviewFilters from "./ReviewFilters";

interface CustomerReviewsSectionProps {
  productId?: string;
}

export default async function CustomerReviewsSection({ productId }: CustomerReviewsSectionProps) {
  const where = productId ? { productId, isApproved: true } : { isApproved: true };

  const reviews = await prisma.review.findMany({
    where,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      authorName: true,
      rating: true,
      title: true,
      content: true,
      createdAt: true,
      product: { select: { name: true, slug: true } },
    },
  });

  if (reviews.length === 0) return null;

  const totalReviews = reviews.length;
  const averageRating = reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews;

  const distribution = [5, 4, 3, 2, 1].map((stars) => {
    const count = reviews.filter((r) => r.rating === stars).length;
    return { stars, count, percentage: totalReviews > 0 ? (count / totalReviews) * 100 : 0 };
  });

  const fullStars = Math.floor(averageRating);

  return (
    <section className="section-py bg-white">
      <div className="container-hauselio">
        <div className="text-center mb-12">
          <p className="caption text-[var(--color-primary)] mb-3">Bewertungen</p>
          <h2 className="heading-2">Was unsere Kunden sagen</h2>
          <p className="body-large mt-2">
            Basierend auf {totalReviews} Bewertungen
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Rating Summary */}
          <div className="bg-[var(--color-bg)] rounded-2xl p-6">
            <div className="text-center mb-6">
              <p className="text-5xl font-black text-[var(--color-text-primary)]">
                {averageRating.toFixed(1)}
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
                Basierend auf {totalReviews} Bewertungen
              </p>
            </div>

            <div className="space-y-2">
              {distribution.map((dist) => (
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
          </div>

          {/* Reviews List */}
          <ReviewFilters reviews={reviews} />
        </div>
      </div>
    </section>
  );
}
