"use client";

import React, { createContext, useContext, useState, useCallback, useMemo } from "react";
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from "lucide-react";

export type ToastType = "success" | "error" | "info" | "warning";

export interface ToastItem {
  id: string;
  type: ToastType;
  message: string;
  title?: string;
  duration?: number;
}

export interface ToastMethods {
  success: (message: string, title?: string) => void;
  error: (message: string, title?: string) => void;
  info: (message: string, title?: string) => void;
  warning: (message: string, title?: string) => void;
}

interface ToastContextValue {
  toast: ToastMethods;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(
    (type: ToastType, message: string, title?: string, duration = 4000) => {
      const id = "toast_" + Math.random().toString(36).substring(2, 9) + Date.now();
      const newToast: ToastItem = { id, type, message, title, duration };

      setToasts((prev) => [...prev, newToast]);

      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }
    },
    [removeToast]
  );

  const toastMethods = useMemo<ToastMethods>(
    () => ({
      success: (message: string, title?: string) =>
        addToast("success", message, title),
      error: (message: string, title?: string) =>
        addToast("error", message, title),
      info: (message: string, title?: string) =>
        addToast("info", message, title),
      warning: (message: string, title?: string) =>
        addToast("warning", message, title),
    }),
    [addToast]
  );

  const contextValue = useMemo(() => ({ toast: toastMethods }), [toastMethods]);

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      {/* Toast Container */}
      <div
        aria-live="polite"
        className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 max-w-md w-full pointer-events-none px-4 sm:px-0"
      >
        {toasts.map((item) => (
          <div
            key={item.id}
            role="status"
            className={`pointer-events-auto flex items-start gap-3 p-4 bg-neutral-950 border shadow-2xl text-white transition-all duration-300 animate-fade-in ${
              item.type === "success"
                ? "border-[#25D366]/40 bg-neutral-950"
                : item.type === "error"
                ? "border-dk-red/50 bg-neutral-950"
                : item.type === "warning"
                ? "border-dk-yellow/50 bg-neutral-950"
                : "border-neutral-700 bg-neutral-950"
            }`}
          >
            <div className="shrink-0 mt-0.5">
              {item.type === "success" && (
                <CheckCircle2 className="w-4 h-4 text-[#25D366]" />
              )}
              {item.type === "error" && (
                <AlertCircle className="w-4 h-4 text-dk-red" />
              )}
              {item.type === "warning" && (
                <AlertTriangle className="w-4 h-4 text-dk-yellow" />
              )}
              {item.type === "info" && (
                <Info className="w-4 h-4 text-white" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              {item.title && (
                <h4 className="text-xs font-heading font-bold uppercase tracking-wider text-white mb-0.5">
                  {item.title}
                </h4>
              )}
              <p className="text-xs text-neutral-300 font-mono leading-relaxed break-words">
                {item.message}
              </p>
            </div>

            <button
              onClick={() => removeToast(item.id)}
              aria-label="Dismiss notification"
              className="p-1 text-neutral-400 hover:text-white shrink-0 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export type UseToastReturn = ToastMethods & { toast: ToastMethods };

export function useToast(): UseToastReturn {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return {
    ...context.toast,
    toast: context.toast,
  };
}
