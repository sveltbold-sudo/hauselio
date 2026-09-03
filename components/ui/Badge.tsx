import { type HTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "primary" | "success" | "warning" | "danger" | "promo" | "accent";
}

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = "default", children, ...props }, ref) => {
    const variants = {
      default: "bg-[var(--color-bg-secondary)] text-[var(--color-text-secondary)] border border-[var(--color-border-light)]",
      primary:
        "bg-[var(--color-primary-50)] text-[var(--color-primary)] border border-[var(--color-primary)]/20",
      success:
        "bg-[var(--color-success-light)] text-[var(--color-success)] border border-[var(--color-success)]/20",
      warning:
        "bg-[var(--color-primary-50)] text-[var(--color-text-secondary)] border border-[var(--color-border)]",
      danger:
        "bg-[var(--color-danger-light)] text-[var(--color-danger)] border border-[var(--color-danger)]/20",
      promo:
        "bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-accent-hover)] text-white shadow-sm",
      accent:
        "bg-[var(--color-accent)] text-white",
    };

    return (
      <span
        ref={ref}
        className={cn(
          "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold animate-scale-in",
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
