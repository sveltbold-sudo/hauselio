import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger" | "gradient";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      type = "button",
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-semibold rounded-xl transition-colors transition-shadow duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.97] motion-reduce:scale-100 select-none";

    const variants = {
      primary:
        "bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)] focus-visible:ring-[var(--color-primary)] shadow-lg shadow-[var(--color-primary)]/20 hover:shadow-[var(--color-primary)]/30 hover:shadow-xl",
      gradient:
        "bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)] focus-visible:ring-[var(--color-primary)] shadow-lg shadow-[var(--color-primary)]/20 hover:shadow-[var(--color-primary)]/30 hover:shadow-xl",
      secondary:
        "bg-[var(--color-secondary)] text-white hover:bg-[var(--color-secondary-hover)] focus-visible:ring-[var(--color-secondary)] shadow-lg shadow-[var(--color-primary)]/20",
      outline:
        "border-2 border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white focus-visible:ring-[var(--color-primary)]",
      ghost:
        "text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)] focus-visible:ring-[var(--color-primary)]",
      danger:
        "bg-[var(--color-danger)] text-white hover:bg-[var(--color-danger)]/90 focus-visible:ring-[var(--color-danger)] shadow-lg shadow-[var(--color-danger)]/20",
    };

    const sizes = {
      sm: "px-3.5 py-3 text-sm gap-1.5 min-h-[44px] min-w-[44px]",
      md: "px-5 py-2.5 text-sm gap-2 min-h-[44px] min-w-[44px]",
      lg: "px-7 py-3.5 text-base gap-2.5 min-h-[48px] min-w-[48px]",
    };

    return (
      <button
        ref={ref}
        type={type}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        disabled={disabled || isLoading}
        aria-busy={isLoading || undefined}
        aria-disabled={disabled || isLoading || undefined}
        {...props}
      >
        {isLoading && (
          <svg
            className="animate-spin -ml-1 h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
