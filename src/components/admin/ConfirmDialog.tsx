"use client";

import React from "react";
import { Modal } from "@/components/ui/Modal";
import { AlertTriangle } from "lucide-react";

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  isDestructive = true,
  isLoading = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <Modal isOpen={isOpen} onClose={onCancel} title={title} maxWidth="sm">
      <div className="space-y-6">
        <div className="flex items-start gap-4">
          <div
            className={`p-3 rounded-full shrink-0 ${
              isDestructive
                ? "bg-dk-red/10 text-dk-red"
                : "bg-dk-yellow/10 text-dk-yellow"
            }`}
          >
            <AlertTriangle className="w-5 h-5" />
          </div>
          <p className="text-sm text-neutral-300 leading-relaxed pt-1">
            {message}
          </p>
        </div>

        <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-2.5 sm:gap-3 pt-4 border-t border-neutral-900">
          <button
            type="button"
            disabled={isLoading}
            onClick={onCancel}
            className="w-full sm:w-auto px-4 py-2.5 min-h-[44px] sm:min-h-0 text-xs font-mono uppercase text-neutral-400 hover:text-white transition-colors disabled:opacity-50 text-center cursor-pointer"
          >
            {cancelText}
          </button>
          <button
            type="button"
            disabled={isLoading}
            onClick={onConfirm}
            className={`w-full sm:w-auto px-5 py-2.5 min-h-[44px] sm:min-h-0 text-xs font-mono uppercase font-normal transition-all disabled:opacity-50 text-center cursor-pointer ${
              isDestructive
                ? "bg-dk-red text-white hover:bg-red-700"
                : "bg-white text-black hover:bg-dk-yellow"
            }`}
          >
            {isLoading ? "Processing..." : confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
}
