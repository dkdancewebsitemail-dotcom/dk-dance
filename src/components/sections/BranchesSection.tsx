"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { MapPin, ArrowUpRight, MessageCircle, Phone } from "lucide-react";
import { FadeUp } from "@/components/ui/Motion";
import { Branch } from "@/types";
import { formatWhatsAppUrl } from "@/lib/utils";
import { ExpandableText } from "@/components/ui/ExpandableText";

interface BranchesSectionProps {
  branches: Branch[];
  showAll?: boolean;
}

// Official 4-color Google Maps Pin
export function GoogleMapsPinIcon({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 92.3 132.3" className={className} aria-hidden="true">
      <path fill="#1a73e8" d="M60.2 2.2C55.8.8 51 0 46.1 0 32 0 19.3 6.4 10.8 16.5l21.8 18.3L60.2 2.2z" />
      <path fill="#ea4335" d="M10.8 16.5C4.1 24.5 0 34.9 0 46.1c0 8.7 1.7 15.7 4.6 22l28-33.3-21.8-18.3z" />
      <path fill="#4285f4" d="M46.2 28.5c9.8 0 17.7 7.9 17.7 17.7 0 4.3-1.6 8.3-4.2 11.4 0 0 13.9-16.6 28-33.3C82.2 13.7 72.4 4.8 60.2 2.2L32.6 34.8c3.4-3.8 8.2-6.3 13.6-6.3z" />
      <path fill="#fbbc04" d="M46.2 63.8c-9.8 0-17.7-7.9-17.7-17.7 0-4.3 1.6-8.3 4.2-11.4L4.6 68.1c5.2 11.1 12.3 20 20.3 30.7l27.1-32.3c-3.5 2.7-7.9 4.3-13 4.3z" />
      <path fill="#34a853" d="M65 74.3c-4.9 6.5-11.2 15.7-16 26.2-1.3 2.9-2.6 6-3.8 9.3 4.5 12.3 9.4 22.5 9.4 22.5s33.9-42.3 37.7-65.7c0-.2 0-.3.1-.5L65 74.3z" />
    </svg>
  );
}

export function BranchesSection({ branches, showAll = false }: BranchesSectionProps) {
  const activeBranches = [...branches.filter((b) => b.isActive !== false)].sort(
    (a, b) => (Number(a.displayOrder) || 1) - (Number(b.displayOrder) || 1)
  );
  const displayBranches = showAll ? activeBranches : activeBranches;

  return (
    <section className="bg-black text-white py-28 sm:py-36 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-20">
          <div>
            <FadeUp>
              <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] backdrop-blur-md mb-4 transition-transform duration-300 hover:scale-105">
                <span className="w-1.5 h-1.5 rounded-full bg-dk-yellow animate-pulse" />
                <span className="editorial-eyebrow text-neutral-400">
                  04 — NETWORK & STUDIOS
                </span>
              </div>
              <h2 className="text-4xl sm:text-6xl font-heading font-light uppercase tracking-tight text-white">
                Branch Presence
              </h2>
            </FadeUp>
          </div>
        </div>

        {/* Branch Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayBranches.map((branch, index) => {
            const isInternational = branch.country.toLowerCase() !== "india";
            const whatsappUrl = formatWhatsAppUrl(
              branch.whatsapp || process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919995272083",
              `Hello DK Dance Company, I would like to enquire about the ${branch.name} branch.`
            );

            return (
              <FadeUp key={branch.slug} delay={index * 0.08}>
                <div className="rounded-3xl glass-panel border border-white/[0.08] bg-white/[0.02] hover:border-dk-yellow/40 hover:bg-white/[0.04] hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between h-full group overflow-hidden min-w-0 max-w-full">
                  {/* Branch Image Preview */}
                  <div className="relative aspect-[16/10] bg-neutral-900 overflow-hidden">
                    {branch.imageUrl ? (
                      <Image
                        src={branch.imageUrl}
                        alt={`${branch.name} branch of DK Dance Company`}
                        fill
                        className="object-cover object-center group-hover:scale-105 transition-all duration-700 ease-out"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-neutral-900 via-black to-neutral-950 p-6 text-center">
                        <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-3">
                          <MapPin className="w-5 h-5 text-dk-yellow" />
                        </div>
                        <span className="text-xs font-mono uppercase tracking-widest text-neutral-300 break-words [overflow-wrap:anywhere]">
                          {branch.name} Studio
                        </span>
                        <span className="text-[10px] font-mono uppercase text-neutral-500 mt-1 break-words [overflow-wrap:anywhere]">
                          {branch.city}, {branch.country}
                        </span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent opacity-80" />

                    {/* International Badge */}
                    {isInternational && (
                      <div className="absolute top-4 left-4 z-10">
                        <span className="text-[9px] font-mono uppercase tracking-wider px-3 py-1 rounded-full bg-dk-yellow text-black font-normal">
                          International Branch
                        </span>
                      </div>
                    )}

                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs font-mono uppercase tracking-widest text-neutral-200 px-3.5 py-2 rounded-2xl bg-black/60 backdrop-blur-md border border-white/10 min-w-0">
                      <span className="truncate mr-2">{branch.city}</span>
                      <span className="shrink-0">{branch.country}</span>
                    </div>
                  </div>

                  {/* Branch Details */}
                  <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between min-w-0 max-w-full">
                    <div className="min-w-0 max-w-full">
                      <div className="flex items-center gap-2 text-neutral-500 text-xs font-mono uppercase mb-2 min-w-0">
                        <MapPin className="w-3.5 h-3.5 text-dk-red shrink-0" />
                        <span className="break-words [overflow-wrap:anywhere]">{branch.city}, {branch.country}</span>
                      </div>
                      <h3 className="text-2xl font-heading font-light uppercase tracking-tight text-white mb-3 group-hover:text-dk-yellow transition-colors break-words [overflow-wrap:anywhere]">
                        {branch.name}
                      </h3>
                      {branch.description && (
                        <div className="mb-5">
                          <ExpandableText
                            text={branch.description}
                            limit={140}
                            className="text-xs text-neutral-400 leading-relaxed font-light break-words [overflow-wrap:anywhere]"
                          />
                        </div>
                      )}
                      {branch.classTimings && (
                        <div className="text-[11px] font-mono text-neutral-400 mb-4 bg-white/[0.02] p-3.5 rounded-2xl border border-white/[0.06] backdrop-blur-sm break-words [overflow-wrap:anywhere]">
                          <span className="text-neutral-300 block mb-1">Schedule:</span>
                          {branch.classTimings}
                        </div>
                      )}

                      {branch.phone && (
                        <div className="flex items-center justify-between text-[11px] font-mono text-neutral-400 mb-5 bg-white/[0.02] px-3.5 py-2.5 rounded-2xl border border-white/[0.06]">
                          <span className="text-neutral-400">Desk / Enquiries:</span>
                          <a
                            href={`tel:${branch.phone}`}
                            className="text-white hover:text-dk-yellow font-normal inline-flex items-center gap-1.5 transition-colors"
                          >
                            <Phone className="w-3 h-3 text-dk-yellow" />
                            <span>{branch.phone}</span>
                          </a>
                        </div>
                      )}
                    </div>

                    {/* Action Links */}
                    <div className="pt-4 border-t border-white/[0.08] flex flex-wrap items-center justify-between gap-2.5">
                      {branch.googleMapsUrl ? (
                        <a
                          href={branch.googleMapsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white text-neutral-950 hover:bg-[#1a73e8] hover:text-white border border-white/20 font-mono text-[11px] sm:text-xs uppercase tracking-wider transition-all duration-300 active:scale-95 group/maps shrink-0 hover:scale-105"
                          title={`Open ${branch.name} location on Google Maps`}
                        >
                          <GoogleMapsPinIcon className="w-3.5 h-3.5 shrink-0 group-hover/maps:scale-110 transition-transform" />
                          <span className="font-medium">Google Maps</span>
                          <ArrowUpRight className="w-3.5 h-3.5 text-[#1a73e8] group-hover/maps:text-white transition-colors" />
                        </a>
                      ) : (
                        <span className="text-xs font-mono text-neutral-600 uppercase">
                          Location Pending
                        </span>
                      )}

                      <div className="flex items-center gap-2">
                        {/* Direct Call Button */}
                        <a
                          href={`tel:${branch.phone || "+919995272083"}`}
                          aria-label={`Call ${branch.name} branch`}
                          title={`Call ${branch.phone || "+919995272083"}`}
                          className="p-2.5 rounded-full border border-white/10 text-neutral-300 hover:text-dk-yellow hover:border-dk-yellow/40 hover:bg-white/[0.05] transition-all duration-200 hover:scale-110 active:scale-95"
                        >
                          <Phone className="w-3.5 h-3.5" />
                        </a>

                        {/* WhatsApp Button */}
                        <a
                          href={whatsappUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`Enquire via WhatsApp for ${branch.name}`}
                          className="p-2.5 rounded-full border border-white/10 text-neutral-400 hover:text-[#25D366] hover:border-[#25D366]/40 hover:bg-[#25D366]/10 transition-all duration-200 hover:scale-110 active:scale-95"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                        </a>

                        <Link
                          href={`/branches/${branch.slug}`}
                          className="text-xs font-mono uppercase text-neutral-400 hover:text-white transition-colors duration-200 pl-1 group/det"
                        >
                          <span>Details</span>
                          <span className="inline-block transition-transform duration-200 group-hover/det:translate-x-1"> →</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </FadeUp>
            );
          })}
        </div>

        {!showAll && (
          <div className="mt-16 text-center">
            <Link
              href="/branches"
              className="inline-flex items-center gap-2 text-xs font-heading uppercase tracking-widest text-neutral-400 hover:text-dk-yellow transition-colors duration-200 group"
            >
              <span>Explore All Studio Details & Schedules</span>
              <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
