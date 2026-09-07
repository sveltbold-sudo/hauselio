import { formatPrice } from "@/lib/utils";

interface ProductPricingProps {
  price: number;
  originalPrice: number | null;
  isPromo: boolean;
  discount: number;
}

export default function ProductPricing({ price, originalPrice, isPromo, discount }: ProductPricingProps) {
  return (
    <div className="flex flex-wrap items-baseline gap-3 mb-5 pb-5 border-b border-[var(--color-border-light)]">
      <span className="text-3xl lg:text-4xl font-extrabold text-[var(--color-text-primary)] tabular-nums">
        {formatPrice(price)}
      </span>
      {isPromo && originalPrice && (
        <>
          <span className="text-base text-[var(--color-text-muted)] line-through">
            {formatPrice(originalPrice)}
          </span>
          <span className="text-sm font-bold text-[var(--color-danger)] bg-[var(--color-danger-light)] px-2.5 py-1 rounded-lg">
            -{discount}%
          </span>
          <span className="text-sm font-bold text-[var(--color-success)] bg-[var(--color-success)]/10 px-2.5 py-1 rounded-lg">
            Sie sparen {formatPrice(originalPrice - price)}
          </span>
        </>
      )}
    </div>
  );
}
