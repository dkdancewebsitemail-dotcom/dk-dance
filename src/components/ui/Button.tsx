import React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "accent" | "ghost";
  size?: "sm" | "md" | "lg";
  href?: string;
  icon?: boolean;
  external?: boolean;
}

export function Button({
  children,
  variant = "primary",
  size = "md",
  href,
  icon = false,
  external = false,
  className = "",
  ...props
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center font-light transition-all duration-300 tracking-wider uppercase text-xs rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dk-yellow select-none disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98] min-h-[42px] sm:min-h-[44px] touch-manipulation";

  const sizeStyles = {
    sm: "px-5 py-2 text-[11px] gap-1.5",
    md: "px-7 py-3 text-xs gap-2",
    lg: "px-9 py-3.5 text-xs gap-2.5",
  };

  const variantStyles = {
    primary:
      "bg-white text-black hover:bg-neutral-100 hover:border-white font-normal border border-white/20 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]",
    secondary:
      "bg-white/[0.04] text-white border border-white/10 hover:border-white/30 hover:bg-white/[0.08] backdrop-blur-md transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]",
    accent:
      "bg-dk-yellow text-black hover:bg-[#fff433] hover:border-amber-400 font-normal border border-dk-yellow/40 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]",
    ghost:
      "bg-transparent text-neutral-400 hover:text-white underline-offset-8 hover:underline p-0 border-none transition-colors duration-300",
  };

  const content = (
    <>
      <span>{children}</span>
      {icon && (
        <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
      )}
    </>
  );

  const combinedClasses = cn(
    baseStyles,
    sizeStyles[size],
    variantStyles[variant],
    "group",
    className
  );

  if (href) {
    if (external) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={combinedClasses}
        >
          {content}
        </a>
      );
    }
    return (
      <Link href={href} className={combinedClasses}>
        {content}
      </Link>
    );
  }

  return (
    <button className={combinedClasses} {...props}>
      {content}
    </button>
  );
}
