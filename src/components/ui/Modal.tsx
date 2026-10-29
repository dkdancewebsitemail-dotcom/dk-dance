"use client";

import React, { useEffect, useCallback } from "react";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "full";
}

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = "lg",
}: ModalProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  const maxWidthClasses = {
    sm: "max-w-md",
    md: "max-w-xl",
    lg: "max-w-3xl",
    xl: "max-w-5xl",
    full: "max-w-[95vw]",
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? "modal-title" : undefined}
      className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-5 md:p-6"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/85 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog */}
      <div
        className={`relative z-10 w-full ${maxWidthClasses[maxWidth]} bg-neutral-950 border border-neutral-800 p-4 sm:p-6 md:p-8 max-h-[92vh] overflow-y-auto shadow-2xl transition-all duration-300`}
      >
        <div className="flex items-center justify-between pb-3.5 sm:pb-4 border-b border-neutral-900 mb-4 sm:mb-6 sticky -top-4 sm:-top-6 md:-top-8 bg-neutral-950/95 backdrop-blur-md -mx-4 px-4 sm:-mx-6 sm:px-6 md:-mx-8 md:px-8 pt-2 z-20">
          {title ? (
            <h3
              id="modal-title"
              className="text-base sm:text-lg font-heading uppercase tracking-wider text-white truncate pr-2"
            >
              {title}
            </h3>
          ) : (
            <div />
          )}
          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-900 transition-colors duration-200 shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {children}
      </div>
    </div>
  );
}
