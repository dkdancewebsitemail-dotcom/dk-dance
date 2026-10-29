"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { MessageCircle, Instagram, Facebook, Youtube } from "lucide-react";
import { SiteSettings } from "@/types";

export function Footer({ settings }: { settings?: SiteSettings }) {
  const pathname = usePathname();
  const [liveSettings, setLiveSettings] = React.useState<SiteSettings | null>(settings || null);

  React.useEffect(() => {
    if (settings) {
      setLiveSettings(settings);
    } else {
      fetch("/api/settings")
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.data) {
            setLiveSettings(data.data);
          }
        })
        .catch(() => {});
    }
  }, [settings]);

  // Hide footer on admin panel pages
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  const currentYear = new Date().getFullYear();

  const instagramUrl =
    liveSettings?.socialLinks?.instagram ||
    process.env.NEXT_PUBLIC_INSTAGRAM_URL ||
    "https://instagram.com/dkdancecompany";
  const facebookUrl =
    liveSettings?.socialLinks?.facebook ||
    process.env.NEXT_PUBLIC_FACEBOOK_URL ||
    "https://facebook.com/dkdancecompany";
  const youtubeUrl =
    liveSettings?.socialLinks?.youtube ||
    process.env.NEXT_PUBLIC_YOUTUBE_URL ||
    "https://youtube.com/@dkdancecompany";
  const rawWhatsapp =
    liveSettings?.contact?.whatsapp ||
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ||
    "919995272083";
  const cleanWhatsapp = rawWhatsapp.replace(/\D/g, "") || "919995272083";
  const officePhone =
    liveSettings?.contact?.phone || "+91 9995 272 083";
  const officeEmail =
    liveSettings?.contact?.email || "info@dkdancecompany.com";
  const officeAddress =
    liveSettings?.contact?.address || "Kozhikode, Kerala, India";

  return (
    <footer className="relative z-20 bg-black pt-16 sm:pt-20 pb-24 sm:pb-12 text-white">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 pb-16 border-b border-white/[0.08]">
          {/* Brand Column */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              <Link href="/" className="inline-block relative w-48 h-14 mb-6 transition-transform duration-300 hover:scale-105">
                <Image
                  src="/images/logo/logo.png"
                  alt="DK Dance Company Official Logo"
                  fill
                  className="object-contain object-left"
                  sizes="192px"
                />
              </Link>
              <p className="text-neutral-400 text-sm leading-relaxed max-w-sm mb-6 font-light">
                DK Dance Company (DKDC) is a premier contemporary and commercial
                dance training institution founded by Director Dhanesh Krishnan.
                Dedicated to developing technique, creative expression, and stage
                confidence.
              </p>
              <div className="text-xs uppercase tracking-widest text-neutral-500 font-mono">
                Learn • Train • Perform • Grow
              </div>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-3 mt-8">
              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="DK Dance Company on Instagram"
                className="w-10 h-10 rounded-full flex items-center justify-center border border-white/10 bg-white/[0.02] text-neutral-400 hover:text-dk-yellow hover:border-dk-yellow/40 hover:bg-white/[0.05] hover:-translate-y-0.5 hover:scale-110 active:scale-95 transition-all duration-300"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href={facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="DK Dance Company on Facebook"
                className="w-10 h-10 rounded-full flex items-center justify-center border border-white/10 bg-white/[0.02] text-neutral-400 hover:text-dk-yellow hover:border-dk-yellow/40 hover:bg-white/[0.05] hover:-translate-y-0.5 hover:scale-110 active:scale-95 transition-all duration-300"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href={youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="DK Dance Company on YouTube"
                className="w-10 h-10 rounded-full flex items-center justify-center border border-white/10 bg-white/[0.02] text-neutral-400 hover:text-dk-yellow hover:border-dk-yellow/40 hover:bg-white/[0.05] hover:-translate-y-0.5 hover:scale-110 active:scale-95 transition-all duration-300"
              >
                <Youtube className="w-4 h-4" />
              </a>
              <a
                href={`https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent("Hello DK Dance Company, I would like to enquire about dance classes.")}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Chat on WhatsApp"
                className="w-10 h-10 rounded-full flex items-center justify-center border border-white/10 bg-white/[0.02] text-neutral-400 hover:text-[#25D366] hover:border-[#25D366]/40 hover:bg-[#25D366]/10 hover:-translate-y-0.5 hover:scale-110 active:scale-95 transition-all duration-300"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="lg:col-span-2">
            <h4 className="text-xs font-mono uppercase tracking-widest text-neutral-500 mb-6">
              Navigation
            </h4>
            <ul className="flex flex-col gap-3 text-sm text-neutral-400">
              {[
                { href: "/about", label: "About DKDC" },
                { href: "/dance-styles", label: "Dance Styles" },
                { href: "/branches", label: "Branches" },
                { href: "/gallery", label: "Gallery" },
                { href: "/videos", label: "Videos Archive" },
                { href: "/reviews", label: "Google Reviews" },
                { href: "/online-classes", label: "Online Classes" },
                { href: "/rules", label: "Rules & Regulations" },
                { href: "/contact", label: "Contact" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="hover:text-dk-yellow hover:translate-x-1 transition-all duration-200 inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Branches Column */}
          <div className="lg:col-span-2">
            <h4 className="text-xs font-mono uppercase tracking-widest text-neutral-500 mb-6">
              Branches
            </h4>
            <ul className="flex flex-col gap-3 text-sm text-neutral-400">
              {[
                { href: "/branches/kunduparamba", label: "Kunduparamba" },
                { href: "/branches/westhill", label: "Westhill" },
                { href: "/branches/balussery", label: "Balussery" },
                { href: "/branches/kottooli", label: "Kottooli" },
                { href: "/branches/parambilbazar", label: "Parambilbazar" },
                { href: "/branches/bournemouth-uk", label: "Bournemouth, UK", isUk: true },
              ].map((b) => (
                <li key={b.href}>
                  <Link
                    href={b.href}
                    className={`hover:text-dk-yellow hover:translate-x-1 transition-all duration-200 inline-block ${b.isUk ? "text-dk-yellow" : ""}`}
                  >
                    {b.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Column */}
          <div className="lg:col-span-3">
            <h4 className="text-xs font-mono uppercase tracking-widest text-neutral-500 mb-6">
              Head Office
            </h4>
            <p className="text-sm text-neutral-400 leading-relaxed mb-4">
              {officeAddress}
            </p>
            <div className="flex flex-col gap-2 text-sm text-neutral-400 mb-6">
              <span className="text-white font-medium">Director: Dhanesh Krishnan</span>
              <a
                href={`tel:${officePhone.replace(/\s+/g, "")}`}
                className="hover:text-dk-yellow transition-colors duration-150 font-mono text-xs"
              >
                {officePhone}
              </a>
              <a
                href={`mailto:${officeEmail}`}
                className="hover:text-dk-yellow transition-colors duration-150 font-mono text-xs"
              >
                {officeEmail}
              </a>
            </div>

            <div className="pt-2">
              <span className="text-xs font-mono text-neutral-500 uppercase block mb-1">
                International Branch
              </span>
              <span className="text-sm text-white">Bournemouth, United Kingdom</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500 text-center sm:text-left">
          <div>
            © {currentYear} DK Dance Company (DKDC). All rights reserved.
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
            <Link href="/privacy" className="hover:text-neutral-300 transition-colors duration-150 py-1">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-neutral-300 transition-colors duration-150 py-1">
              Terms & Conditions
            </Link>
            <Link href="/admin/login" className="hover:text-neutral-300 transition-colors duration-150 py-1">
              Admin Access
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
