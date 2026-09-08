"use client";

import { useEffect, useRef, useCallback } from "react";
import { X } from "lucide-react";

interface AdminModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  titleId?: string;
  children: React.ReactNode;
  maxWidth?: string;
}

export default function AdminModal({
  open,
  onClose,
  title,
  titleId,
  children,
  maxWidth = "max-w-md",
}: AdminModalProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key !== "Tab" || !contentRef.current) return;
      const focusable = contentRef.current.querySelectorAll<HTMLElement>(
        'input, textarea, select, button:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length === 0) return;
      const first = focusable[0]!;
      const last = focusable[focusable.length - 1]!;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (!open) return;
    const timer = setTimeout(() => {
      contentRef.current
        ?.querySelector<HTMLElement>(
          'input, button:not([disabled])'
        )
        ?.focus();
    }, 50);
    return () => clearTimeout(timer);
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      onKeyDown={handleKeyDown}
    >
      <div
        ref={contentRef}
        className={`bg-white rounded-2xl p-6 w-full ${maxWidth}`}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 id={titleId} className="text-lg font-bold">
            {title}
          </h2>
          <button
            onClick={onClose}
            aria-label="Modal schließen"
            className="min-w-[44px] min-h-[44px] flex items-center justify-center p-2 hover:bg-[var(--color-bg)] rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
