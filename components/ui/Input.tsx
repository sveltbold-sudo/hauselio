"use client";

import { forwardRef, useId, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id: idProp, ...props }, ref) => {
    const autoId = useId();
    const id = idProp || autoId;
    const errorId = `${id}-error`;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={id}
            className="block text-sm font-semibold text-[var(--color-text-primary)] mb-1.5"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={id}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
          className={cn(
            "w-full px-4 py-3 border border-[var(--color-border)] rounded-xl text-sm",
            "bg-white text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)]",
            "focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)]",
            "transition-colors duration-300",
            "hover:border-gray-300",
            error && "border-[var(--color-danger)] focus:ring-[var(--color-danger)]/20 focus:border-[var(--color-danger)]",
            className
          )}
          {...props}
        />
        {error && (
          <p id={errorId} className="mt-1.5 text-sm text-[var(--color-danger)] font-medium">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
