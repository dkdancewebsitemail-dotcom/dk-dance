import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export interface BreadcrumbItem {
  name: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumbs({ items, className = "" }: BreadcrumbsProps) {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://www.dkdancecompany.com";

  // Build BreadcrumbList Schema
  const schemaItems = [
    { name: "Home", href: "/" },
    ...items,
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: schemaItems.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.href
        ? `${baseUrl}${item.href === "/" ? "" : item.href}`
        : undefined,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav
        aria-label="Breadcrumbs"
        className={`inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-neutral-400 mb-6 ${className}`}
      >
        <Link
          href="/"
          className="hover:text-white transition-colors duration-200"
        >
          Home
        </Link>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <React.Fragment key={index}>
              <ChevronRight className="w-3 h-3 text-neutral-600 shrink-0" />
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className="hover:text-white transition-colors duration-200"
                >
                  {item.name}
                </Link>
              ) : (
                <span className="text-neutral-200 font-medium truncate max-w-[200px] sm:max-w-none">
                  {item.name}
                </span>
              )}
            </React.Fragment>
          );
        })}
      </nav>
    </>
  );
}
