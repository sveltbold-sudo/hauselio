import { type HTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "primary" | "success" | "warning" | "danger" | "promo";
}

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = "default", children, ...props }, ref) => {
    const variants = {
      default: "bg-gray-100 text-gray-700 border border-gray-200",
      primary:
        "bg-[var(--color-primary-50)] text-[var(--color-primary)] border border-[var(--color-primary)]/20",
      success:
        "bg-[var(--color-success-light)] text-[var(--color-success)] border border-[var(--color-success)]/20",
      warning:
        "bg-amber-50 text-amber-700 border border-amber-200",
      danger:
        "bg-[var(--color-danger-light)] text-[var(--color-danger)] border border-[var(--color-danger)]/20",
      promo:
        "bg-gradient-to-r from-amber-500 to-orange-500 text-[var(--color-text-primary)] shadow-sm",
    };

    return (
      <span
        ref={ref}
        className={cn(
          "inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-bold animate-scale-in",
          variants[variant],
          className
        )}
        {...props}
      >
        {children}
      </span>
    );
  }
);

Badge.displayName = "Badge";

export default Badge;
