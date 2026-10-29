"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface ExpandableTextProps {
  text: string;
  limit?: number;
  className?: string;
  buttonClassName?: string;
  moreText?: string;
  lessText?: string;
}

export function ExpandableText({
  text,
  limit = 140,
  className = "text-xs text-neutral-400 leading-relaxed font-light break-words [overflow-wrap:anywhere]",
  buttonClassName = "inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-mono uppercase tracking-wider text-dk-yellow hover:text-white transition-colors mt-2 select-none",
  moreText = "Read More",
  lessText = "Show Less",
}: ExpandableTextProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!text) return null;

  const needsTruncation = text.length > limit;

  if (!needsTruncation) {
    return <p className={className}>{text}</p>;
  }

  const displayText = isExpanded ? text : `${text.slice(0, limit).trim()}...`;

  return (
    <div className="min-w-0 max-w-full">
      <p className={className}>{displayText}</p>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setIsExpanded((prev) => !prev);
        }}
        className={buttonClassName}
        aria-expanded={isExpanded}
      >
        <span>{isExpanded ? lessText : moreText}</span>
        {isExpanded ? (
          <ChevronUp className="w-3 h-3 text-dk-yellow" />
        ) : (
          <ChevronDown className="w-3 h-3 text-dk-yellow" />
        )}
      </button>
    </div>
  );
}
