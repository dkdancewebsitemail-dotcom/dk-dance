"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, ArrowLeft, ArrowUpRight } from "lucide-react";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Classes", href: "/classes" },
  { label: "Styles", href: "/dance-styles" },
  { label: "Branches", href: "/branches" },
  { label: "Videos", href: "/videos" },
  { label: "Gallery", href: "/gallery" },
  { label: "Reviews", href: "/reviews" },
  { label: "Online", href: "/online-classes" },
  { label: "Contact", href: "/contact" },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileMenuOpen]);

  // Hide public navbar on admin pages
  if (pathname.startsWith("/admin")) {
    return null;
  }

  const isHome = pathname === "/";
  const isLightHero = isHome && !isScrolled;

  return (
    <>
      {/* Spacious, Elegant, Transparent Navbar */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-neutral-950/90 backdrop-blur-2xl border-b border-white/[0.08] py-3.5 sm:py-4.5 px-4 sm:px-8 lg:px-14 text-white"
            : isLightHero
            ? "bg-transparent py-4 sm:py-6 px-4 sm:px-8 lg:px-14 text-neutral-900"
            : "bg-transparent py-4 sm:py-6 px-4 sm:px-8 lg:px-14 text-white"
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Left Brand Lockup & Return Button */}
          <div className="flex items-center gap-3 sm:gap-4">
            {!isHome && (
              <button
                onClick={() => {
                  if (typeof window !== "undefined" && window.history.length > 1) {
                    router.back();
                  } else {
                    router.push("/");
                  }
                }}
                aria-label="Back to previous page"
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider transition-all cursor-pointer shrink-0 hover:scale-105 active:scale-95 ${
                  isLightHero
                    ? "bg-black/[0.05] hover:bg-black/[0.1] border border-black/10 text-neutral-800 hover:text-black"
                    : "bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 hover:border-dk-yellow/50 text-neutral-300 hover:text-white"
                }`}
              >
                <ArrowLeft className="w-3.5 h-3.5 text-dk-yellow" />
                <span className="hidden sm:inline">Back</span>
              </button>
            )}

            {/* Prominent, Large Brand Logo without any Box/Background */}
            <Link
              href="/"
              className="flex items-center group relative focus-visible:outline-none"
              aria-label="DK Dance Company Homepage"
            >
              <div
                className={`relative w-44 xs:w-52 sm:w-64 md:w-72 lg:w-80 h-11 xs:h-13 sm:h-16 md:h-18 lg:h-20 transition-all duration-300 group-hover:scale-[1.03] active:scale-[0.98] ${
                  isScrolled
                    ? "filter drop-shadow-[0_0_1px_rgba(255,255,255,0.9)]"
                    : ""
                }`}
              >
                <Image
                  src="/images/logo/logo.png"
                  alt="DK Dance Company"
                  fill
                  priority
                  className="object-contain object-left"
                  sizes="(max-width: 640px) 160px, (max-width: 768px) 224px, 256px"
                />
              </div>
            </Link>
          </div>

          {/* Desktop Navigation Links - Pure Clean Typography with Subtle Hairline Indicator */}
          <nav
            aria-label="Main Navigation"
            className="hidden lg:flex items-center gap-6 xl:gap-8"
          >
            {NAV_LINKS.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-[13px] sm:text-sm font-light tracking-wide transition-all duration-200 relative py-1 group/nav ${
                    isLightHero
                      ? isActive
                        ? "text-black font-medium"
                        : "text-neutral-700 hover:text-black"
                      : isActive
                      ? "text-white font-medium"
                      : "text-neutral-400 hover:text-white"
                  }`}
                >
                  <span>{link.label}</span>
                  {/* Subtle Expanding Hairline Accent */}
                  <span
                    className={`absolute bottom-0 left-0 h-[1.5px] bg-dk-yellow transition-all duration-300 ${
                      isActive ? "w-full" : "w-0 group-hover/nav:w-full"
                    }`}
                  />
                </Link>
              );
            })}
          </nav>

          {/* Right Action CTA & Mobile Trigger */}
          <div className="flex items-center gap-3 sm:gap-4">
            <Link
              href="/contact"
              className={`hidden sm:inline-flex items-center gap-1.5 px-6 py-2.5 rounded-full font-medium text-xs uppercase tracking-wider transition-all duration-300 hover:scale-105 active:scale-95 group/cta ${
                isLightHero
                  ? "bg-neutral-950 text-white hover:bg-dk-yellow hover:text-neutral-950 border border-neutral-950/20"
                  : "bg-dk-yellow hover:bg-[#fff433] text-neutral-950 border border-dk-yellow/40 hover:border-amber-400"
              }`}
            >
              <span>Enquire</span>
              <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover/cta:translate-x-0.5 group-hover/cta:-translate-y-0.5" />
            </Link>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={mobileMenuOpen}
              className={`lg:hidden p-2.5 rounded-full transition-all duration-200 focus:outline-none hover:scale-105 active:scale-95 ${
                isLightHero
                  ? "bg-black/[0.06] hover:bg-black/[0.12] border border-black/10 text-neutral-900"
                  : "bg-white/[0.08] hover:bg-white/[0.14] border border-white/10 text-white hover:text-dk-yellow"
              }`}
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      <div
        className={`fixed inset-0 h-[100dvh] w-full z-40 bg-neutral-950/95 backdrop-blur-3xl flex flex-col justify-between px-5 sm:px-10 pt-20 sm:pt-24 pb-8 overflow-y-auto overscroll-contain transition-all duration-500 lg:hidden text-white ${
          mobileMenuOpen
            ? "opacity-100 pointer-events-auto translate-y-0"
            : "opacity-0 pointer-events-none -translate-y-4"
        }`}
      >
        <div className="flex flex-col gap-6 mt-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
            <span className="text-xs uppercase tracking-widest text-neutral-400 font-mono">
              DIRECTORY
            </span>
            <span className="text-xs uppercase tracking-widest text-dk-yellow font-mono">
              DK DANCE COMPANY
            </span>
          </div>

          <nav aria-label="Mobile Navigation" className="flex flex-col gap-2">
            {NAV_LINKS.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-2xl font-light tracking-tight flex items-center justify-between py-2 transition-all duration-200 ${
                    isActive
                      ? "text-dk-yellow pl-2 border-l-2 border-dk-yellow"
                      : "text-neutral-300 hover:text-white"
                  }`}
                >
                  <span>{link.label}</span>
                  <span className="text-xs font-mono text-neutral-500">→</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Mobile Footer CTAs */}
        <div className="flex flex-col gap-4 pt-6 border-t border-white/[0.08]">
          <Link
            href="/contact"
            onClick={() => setMobileMenuOpen(false)}
            className="w-full text-center py-3.5 rounded-full bg-dk-yellow text-neutral-950 font-medium text-xs uppercase tracking-wider hover:scale-[1.02] active:scale-98 transition-all"
          >
            Enquire Now
          </Link>

          <div className="flex items-center justify-between text-xs text-neutral-400 font-mono pt-1">
            <span>Kozhikode • Bournemouth</span>
            <a
              href="tel:+919995272083"
              className="text-white hover:text-dk-yellow transition-colors"
            >
              +91 9995 272 083
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
