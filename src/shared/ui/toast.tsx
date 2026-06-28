"use client";

import { CheckCircle2, Info, X, XCircle } from "lucide-react";
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";

type ToastTone = "success" | "error" | "info";

type ToastInput = {
  description?: string;
  durationMs?: number;
  title: string;
  tone?: ToastTone;
};

type ToastItem = Required<Pick<ToastInput, "title" | "tone">> &
  Pick<ToastInput, "description"> & {
    id: string;
  };

type ToastContextValue = {
  dismissToast: (id: string) => void;
  showToast: (toast: ToastInput) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);
const defaultDurationMs = 3600;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismissToast = useCallback((id: string) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback(
    ({
      description,
      durationMs = defaultDurationMs,
      title,
      tone = "info",
    }: ToastInput) => {
      const id =
        crypto.randomUUID?.() ??
        `${Date.now()}-${Math.random().toString(36).slice(2)}`;

      setToasts((current) => [
        ...current.slice(-3),
        {
          description,
          id,
          title,
          tone,
        },
      ]);

      window.setTimeout(() => dismissToast(id), durationMs);
    },
    [dismissToast],
  );

  const value = useMemo(
    () => ({
      dismissToast,
      showToast,
    }),
    [dismissToast, showToast],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastViewport dismissToast={dismissToast} toasts={toasts} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used within ToastProvider.");
  }

  return context;
}

function ToastViewport({
  dismissToast,
  toasts,
}: {
  dismissToast: (id: string) => void;
  toasts: ToastItem[];
}) {
  if (!toasts.length) {
    return null;
  }

  return (
    <div
      aria-live="polite"
      aria-relevant="additions text"
      className="fixed bottom-4 right-4 z-50 grid w-[calc(100vw-2rem)] max-w-sm gap-3 sm:bottom-6 sm:right-6"
    >
      {toasts.map((toast) => {
        const Icon = getToastIcon(toast.tone);

        return (
          <div
            className={cn(
              "grid grid-cols-[auto_minmax(0,1fr)_auto] gap-3 rounded-lg border bg-[#071020]/95 p-4 text-white shadow-2xl shadow-black/30 backdrop-blur",
              getToastToneClassName(toast.tone),
            )}
            key={toast.id}
          >
            <Icon className="mt-0.5 size-5" />
            <div className="min-w-0">
              <p className="text-sm font-bold text-white">{toast.title}</p>
              {toast.description ? (
                <p className="mt-1 text-sm leading-5 text-slate-300">
                  {toast.description}
                </p>
              ) : null}
            </div>
            <Button
              aria-label="Dismiss notification"
              className="-mr-2 -mt-2 text-slate-400 hover:bg-white/10 hover:text-white"
              onClick={() => dismissToast(toast.id)}
              size="icon-sm"
              type="button"
              variant="ghost"
            >
              <X className="size-4" />
            </Button>
          </div>
        );
      })}
    </div>
  );
}

function getToastIcon(tone: ToastTone) {
  if (tone === "success") {
    return CheckCircle2;
  }

  if (tone === "error") {
    return XCircle;
  }

  return Info;
}

function getToastToneClassName(tone: ToastTone) {
  if (tone === "success") {
    return "border-emerald-400/25 text-emerald-300";
  }

  if (tone === "error") {
    return "border-red-400/25 text-red-300";
  }

  return "border-violet-400/25 text-violet-300";
}
