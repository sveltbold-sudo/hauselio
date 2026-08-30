import { Star } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/logger";
import ReviewFilters from "./ReviewFilters";

interface CustomerReviewsSectionProps {
  productId?: string;
}

export default async function CustomerReviewsSection({ productId }: CustomerReviewsSectionProps) {
  const where = productId ? { productId, isApproved: true } : { isApproved: true };

  let reviews;
  try {
    reviews = await prisma.review.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: 20,
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
  } catch (error) {
    logger.error("customer-reviews", error);
    return null;
  }

  if (reviews.length === 0) {
    if (productId) {
      return (
        <section className="section-py bg-white" aria-label="Kundenbewertungen">
          <div className="container-hauselio">
            <div className="text-center py-12">
              <p className="caption text-[var(--color-primary)] mb-3">Bewertungen</p>
              <h2 className="heading-2 mb-4">Produktbewertungen</h2>
              <p className="text-[var(--color-text-muted)] mb-6">
                Für dieses Produkt liegen noch keine Bewertungen vor. Seien Sie der Erste!
              </p>
            </div>
          </div>
        </section>
      );
    }
    return null;
  }

  const totalReviews = reviews.length;
  const averageRating = reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews;

  const distribution = [5, 4, 3, 2, 1].map((stars) => {
    const count = reviews.filter((r) => r.rating === stars).length;
    return { stars, count, percentage: totalReviews > 0 ? (count / totalReviews) * 100 : 0 };
  });

  const fullStars = Math.floor(averageRating);

  const reviewsWithFormattedDates = reviews.map((r) => ({
    ...r,
    formattedDate: new Date(r.createdAt).toLocaleDateString("de-DE", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
  }));

  return (
    <section className="section-py bg-white" aria-label="Kundenbewertungen">
      <div className="container-hauselio">
        <div className="text-center mb-6 md:mb-10">
          <p className="caption text-[var(--color-primary)] mb-3">Bewertungen</p>
          <h2 className="heading-2">
            {productId ? "Produktbewertungen" : "Was unsere Kunden sagen"}
          </h2>
          <p className="body-large mt-2">
            {productId
              ? `${totalReviews} ${totalReviews === 1 ? "Bewertung" : "Bewertungen"} für dieses Produkt`
              : `Basierend auf ${totalReviews} Bewertungen`
            }
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {/* Rating Summary */}
          <div className="bg-[var(--color-bg)] rounded-2xl p-4 sm:p-6 self-start">
            <div className="text-center mb-6">
              <p className="text-4xl sm:text-5xl font-extrabold text-[var(--color-text-primary)]">
                {averageRating.toFixed(1)}
              </p>
              <div className="flex items-center justify-center gap-1 mt-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    aria-hidden="true"
                    className={`w-5 h-5 ${
                      i < fullStars ? "text-[var(--color-star-filled)] fill-[var(--color-star-filled)]" : "text-[var(--color-star-empty)]"
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
                  <div className="flex-1 h-2 bg-[var(--color-border-light)] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[var(--color-star-filled)] rounded-full transition-transform duration-500"
                      style={{ width: `${dist.percentage}%` }}
                      role="meter"
                      aria-valuenow={dist.percentage}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-label={`${dist.stars} Sterne: ${dist.count} Bewertungen`}
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
          <ReviewFilters reviews={reviewsWithFormattedDates} />
        </div>
      </div>
    </section>
  );
}
