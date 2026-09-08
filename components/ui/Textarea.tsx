"use client";

import { forwardRef, useId, type TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, id: idProp, required, ...props }, ref) => {
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
            {label}{required && <span className="text-[var(--color-danger)] ml-0.5" aria-hidden="true">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          id={id}
          required={required}
          aria-required={required || undefined}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
          className={cn(
            "w-full min-h-[120px] px-4 py-3 border border-[var(--color-border)] rounded-xl text-sm resize-y appearance-none",
            "bg-white text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)]",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)]",
            "transition-colors duration-300",
            "hover:border-[var(--color-border)]",
            error && "border-[var(--color-danger)] focus-visible:ring-[var(--color-danger)]/20 focus-visible:border-[var(--color-danger)]",
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

Textarea.displayName = "Textarea";

export default Textarea;
