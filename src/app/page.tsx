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

  const homeFaqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Where are DK Dance Company studio branches located?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "DK Dance Company operates head offices and dance studios across Kozhikode (Kunduparamba, Westhill, Balussery, Kottooli, Parambilbazar) in Kerala, India, and an international studio in Bournemouth, Dorset, United Kingdom, along with online dance classes worldwide.",
        },
      },
      {
        "@type": "Question",
        name: "Who directs and leads DK Dance Company?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "DK Dance Company was founded and is directed by Artistic Director and Choreographer Dhanesh Krishnan K, dedicated to high-standard contemporary, urban, and cinematic dance training.",
        },
      },
      {
        "@type": "Question",
        name: "What dance styles can I learn at DKDC?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "DK Dance Company teaches Bollywood Dance, Hip-Hop, Contemporary Dance, Lyrical Dance, Western Commercial Dance, and Freestyle, alongside special conditioning in acrobatics, flexibility, tutting, and footwork.",
        },
      },
      {
        "@type": "Question",
        name: "What are the fees for dance classes at DK Dance Company?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Registration requires a one-time admission fee of ₹1,000. Monthly class fees start at ₹500/month for 1 class per week and ₹800/month for 2 classes per week.",
        },
      },
      {
        "@type": "Question",
        name: "Are dance classes available for beginners and adults?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, DK Dance Company welcomes beginners of all age groups. We have dedicated batches for Juniors/Kids (ages 4–12), Teens & Youth (ages 13–17), and Adults/Working Professionals (ages 18+).",
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homeFaqSchema) }}
      />
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
