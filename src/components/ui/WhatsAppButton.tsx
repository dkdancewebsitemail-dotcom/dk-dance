"use client";

import React from "react";
import { MessageCircle } from "lucide-react";
import { formatWhatsAppUrl } from "@/lib/utils";
import { FloatingSocials } from "@/components/ui/FloatingSocials";

interface WhatsAppButtonProps {
  phone?: string;
  message?: string;
  branchName?: string;
  variant?: "floating" | "button" | "minimal";
  className?: string;
  children?: React.ReactNode;
}

export function WhatsAppButton({
  phone,
  message,
  branchName,
  variant = "floating",
  className = "",
  children,
}: WhatsAppButtonProps) {
  const targetPhone =
    phone || process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919995272083";

  const defaultMessage = branchName
    ? `Hello DK Dance Company, I would like to enquire about the ${branchName} branch.`
    : "Hello DK Dance Company, I would like to enquire about dance classes.";

  const text = message || defaultMessage;
  const url = formatWhatsAppUrl(targetPhone, text);

  if (variant === "floating") {
    return (
      <FloatingSocials
        phone={targetPhone}
        message={text}
        className={className}
      />
    );
  }

  if (variant === "minimal") {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className={`inline-flex items-center gap-2 text-neutral-400 hover:text-white transition-colors duration-200 text-xs tracking-wider uppercase ${className}`}
      >
        <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
        <span>{children || "Chat on WhatsApp"}</span>
      </a>
    );
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-full bg-white/[0.04] border border-white/[0.12] text-white hover:border-[#25D366]/60 hover:text-[#25D366] hover:bg-[#25D366]/10 backdrop-blur-md text-xs uppercase tracking-wider font-light transition-all duration-300 hover:scale-105 active:scale-95 ${className}`}
    >
      <MessageCircle className="w-4 h-4" />
      <span>{children || "WhatsApp Enquiry"}</span>
    </a>
  );
}
