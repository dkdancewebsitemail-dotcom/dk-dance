import React from "react";
import Link from "next/link";
import { DanceStylesSection } from "@/components/sections/DanceStylesSection";
import { WhoCanJoinSection } from "@/components/sections/WhoCanJoinSection";
import { BranchesSection } from "@/components/sections/BranchesSection";
import { HomeVideoSection } from "@/components/sections/HomeVideoSection";
import { OnlineClassesSection } from "@/components/sections/OnlineClassesSection";
import { GoogleReviewsSection } from "@/components/sections/GoogleReviewsSection";
import { GalleryMarquee } from "@/components/gallery/GalleryMarquee";
import { EnquiryCTASection } from "@/components/sections/EnquiryCTASection";
import { Footer } from "@/components/layout/Footer";
import { FadeUp } from "@/components/ui/Motion";
import { SiteSettings } from "@/types";
import {
  getBranches,
  getMedia,
  getVideos,
  getDanceStyles,
  getCurriculumModules,
  getReviews,
} from "@/lib/db-services";

export async function LowerHomeSections({ settings }: { settings: SiteSettings }) {
  const [branches, mediaItems, videos, danceStyles, curriculum, reviews] =
    await Promise.all([
      getBranches(),
      getMedia(),
      getVideos({ onlyPublished: true, onlyFeatured: true }),
      getDanceStyles(true),
      getCurriculumModules(true),
      getReviews(true),
    ]);

  return (
    <>
      
      <DanceStylesSection styles={danceStyles} curriculum={curriculum} />

      
      <WhoCanJoinSection />

      
      <BranchesSection branches={branches} />

      
      <HomeVideoSection videos={videos} />

      
      <section className="bg-black text-white py-14 sm:py-20 lg:py-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 mb-8 sm:mb-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <FadeUp>
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] backdrop-blur-md mb-4">
                  <span className="w-2 h-2 rounded-full bg-dk-yellow animate-pulse" />
                  <span className="editorial-eyebrow text-neutral-300 font-medium">
                    PHOTO ARCHIVE
                  </span>
                </div>
                <h2 className="text-4xl sm:text-6xl font-heading font-light uppercase tracking-tight text-white">
                  Movement In Frame
                </h2>
              </FadeUp>
            </div>
            <FadeUp delay={0.1}>
              <Link
                href="/gallery"
                className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-dk-yellow hover:text-white px-5 py-2.5 rounded-full bg-white/[0.03] border border-white/[0.08] backdrop-blur-sm transition-all duration-300 hover:border-dk-yellow/40 hover:bg-white/[0.06]"
              >
                View Full Gallery ({mediaItems.length}) →
              </Link>
            </FadeUp>
          </div>
        </div>

        {/* 2-layer horizontal infinite loop photo marquee */}
        <GalleryMarquee items={mediaItems} />
      </section>

      
      <OnlineClassesSection onlineData={settings.onlineClasses} />

      
      <GoogleReviewsSection reviews={reviews} />

      
      <EnquiryCTASection />

      
      <Footer settings={settings} />
    </>
  );
}

export function LowerHomeSectionsFallback() {
  return (
    <div className="w-full bg-black py-20 px-6 sm:px-12 flex flex-col items-center justify-center space-y-8 select-none">
      <div className="w-24 h-[1px] bg-neutral-800" />
      <div className="text-[10px] font-mono uppercase tracking-[0.25em] text-neutral-600 animate-pulse">
        DK DANCE COMPANY • LOADING CURRICULUM & ARCHIVE
      </div>
    </div>
  );
}
