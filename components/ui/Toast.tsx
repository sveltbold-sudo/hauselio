"use client";

import { createContext, useContext, useState, useCallback, useRef, ReactNode } from "react";
import { X, CheckCircle, AlertCircle, Info } from "lucide-react";

type ToastType = "success" | "error" | "info";

interface Toast {
  id: number;
  type: ToastType;
  message: string;
  removing?: boolean;
}

interface ToastContextValue {
  toast: {
    success: (message: string) => void;
    error: (message: string) => void;
    info: (message: string) => void;
  };
}

const ToastContext = createContext<ToastContextValue | null>(null);

const TOAST_DURATION = 4000;
const EXIT_DURATION = 300;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const toastIdRef = useRef(0);
  const timersRef = useRef<Map<number, ReturnType<typeof setTimeout>>>(new Map());

  const removeToast = useCallback((id: number) => {
    const timer = timersRef.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timersRef.current.delete(id);
    }
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const startAutoDismiss = useCallback((id: number) => {
    const timer = setTimeout(() => {
      setToasts((prev) =>
        prev.map((t) => (t.id === id ? { ...t, removing: true } : t))
      );
      const exitTimer = setTimeout(() => {
        removeToast(id);
      }, EXIT_DURATION);
      timersRef.current.set(id, exitTimer);
    }, TOAST_DURATION);
    timersRef.current.set(id, timer);
  }, [removeToast]);

  const addToast = useCallback((type: ToastType, message: string) => {
    const id = ++toastIdRef.current;
    setToasts((prev) => [...prev, { id, type, message }]);
    startAutoDismiss(id);
  }, [startAutoDismiss]);

  const handleMouseEnter = useCallback((id: number) => {
    const timer = timersRef.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timersRef.current.delete(id);
    }
  }, []);

  const handleMouseLeave = useCallback((id: number) => {
    startAutoDismiss(id);
  }, [startAutoDismiss]);

  const toast = {
    success: (message: string) => addToast("success", message),
    error: (message: string) => addToast("error", message),
    info: (message: string) => addToast("info", message),
  };

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-[var(--color-success)]" />,
    error: <AlertCircle className="w-5 h-5 text-[var(--color-danger)]" />,
    info: <Info className="w-5 h-5 text-[var(--color-primary)]" />,
  };

  const bgColors = {
    success: "bg-[var(--color-success-light)] border-[var(--color-success)]/20",
    error: "bg-[var(--color-danger-light)] border-[var(--color-danger)]/20",
    info: "bg-[var(--color-primary-50)] border-[var(--color-primary)]/20",
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div aria-live="polite" aria-atomic="true" className="fixed bottom-24 lg:bottom-4 right-4 pb-[env(safe-area-inset-bottom,0px)] z-[100] flex flex-col gap-2 pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            role={t.type === "error" ? "alert" : "status"}
            aria-live={t.type === "error" ? "assertive" : "polite"}
            onMouseEnter={() => handleMouseEnter(t.id)}
            onMouseLeave={() => handleMouseLeave(t.id)}
            className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg max-w-[calc(100vw-2rem)] sm:max-w-sm ${
              t.removing ? "animate-slide-out-right" : "animate-slide-in-right"
            } ${bgColors[t.type]}`}
          >
            {icons[t.type]}
            <p className="text-sm font-medium text-[var(--color-text-primary)] flex-1">
              {t.message}
            </p>
            <button
              onClick={() => removeToast(t.id)}
              className="min-w-[44px] min-h-[44px] p-2.5 flex items-center justify-center text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] rounded-lg hover:bg-white/50 transition-colors"
              aria-label="Schließen"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context.toast;
}
