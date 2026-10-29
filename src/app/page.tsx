import React, { Suspense } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { HeroSection } from "@/components/sections/HeroSection";
import { BrandIntroSection } from "@/components/sections/BrandIntroSection";
import { StatsCounterSection } from "@/components/sections/StatsCounterSection";
import { LowerHomeSections, LowerHomeSectionsFallback } from "@/components/home/LowerHomeSections";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { getSiteSettings } from "@/lib/db-services";

export const revalidate = 60;

export default async function HomePage() {
  const siteSettings = await getSiteSettings();

  return (
    <>
      <Navbar />
      <main className="w-full overflow-x-clip">
        <HeroSection videoUrl={siteSettings.heroVideoUrl} />

        <div className="relative z-10 bg-black shadow-2xl">
          <BrandIntroSection settings={siteSettings} />
          <StatsCounterSection stats={siteSettings.stats} />
          <Suspense fallback={<LowerHomeSectionsFallback />}>
            <LowerHomeSections settings={siteSettings} />
          </Suspense>
        </div>
      </main>

      <WhatsAppButton
        variant="floating"
        phone={siteSettings.contact.whatsapp}
      />
    </>
  );
}
