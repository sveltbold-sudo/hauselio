interface StarRatingProps {
  rating: number;
  size?: "sm" | "md" | "lg";
  showCount?: boolean;
  count?: number;
  className?: string;
}

const sizeMap = {
  sm: "w-3 h-3",
  md: "w-4 h-4",
  lg: "w-5 h-5",
};

const gapMap = {
  sm: "gap-0.5",
  md: "gap-0.5",
  lg: "gap-1",
};

function StarIcon({ filled, half, size }: { filled: boolean; half: boolean; size: string }) {
  if (half) {
    return (
      <span className={`relative ${size}`}>
        <svg className="absolute inset-0 text-gray-200 fill-gray-200" viewBox="0 0 24 24">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
        <span className="absolute inset-0 overflow-hidden" style={{ width: "50%" }}>
          <svg className={`${size} text-amber-400 fill-amber-400`} viewBox="0 0 24 24">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        </span>
      </span>
    );
  }

  return (
    <svg
      className={`${size} ${filled ? "text-amber-400 fill-amber-400" : "text-gray-200 fill-gray-200"}`}
      viewBox="0 0 24 24"
    >
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}

export default function StarRating({ rating, size = "md", showCount = false, count, className = "" }: StarRatingProps) {
  const starSize = sizeMap[size];
  const roundedRating = Math.round(rating * 2) / 2;
  const fullStars = Math.floor(roundedRating);
  const hasHalf = roundedRating % 1 === 0.5;

  return (
    <div className={`flex items-center ${gapMap[size]} ${className}`} role="img" aria-label={`${rating} von 5 Sternen`}>
      {[...Array(5)].map((_, i) => {
        const isFull = i < fullStars;
        const isHalf = !isFull && hasHalf && i === fullStars;
        return (
          <StarIcon
            key={i}
            filled={isFull}
            half={isHalf}
            size={starSize}
          />
        );
      })}
      {showCount && count !== undefined && (
        <span className="text-xs text-[var(--color-text-muted)] ml-0.5">({count})</span>
      )}
    </div>
  );
}
