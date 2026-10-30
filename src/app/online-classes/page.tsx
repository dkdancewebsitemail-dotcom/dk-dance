import React from "react";
import Image from "next/image";
import { Metadata } from "next";
import { Check, Globe, Video, Clock, ShieldCheck } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ContactForm } from "@/components/forms/ContactForm";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { FadeUp, RevealImage } from "@/components/ui/Motion";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { getSiteSettings, getBranches, getDanceStyles } from "@/lib/db-services";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Online Dance Classes Worldwide | Learn Dance Online | DKDC",
  description:
    "Join online dance classes from anywhere in the world with DK Dance Company. Interactive live digital training in Bollywood, Contemporary, Hip-Hop, and technique conditioning.",
  alternates: {
    canonical: "/online-classes",
  },
  openGraph: {
    title: "Online Dance Classes Worldwide | Learn Dance Online | DKDC",
    description:
      "Interactive live digital dance training connecting dancers across the UK, Middle East, Europe, and worldwide with DK Dance Company.",
    url: "https://www.dkdancecompany.com/online-classes",
    type: "website",
    images: [
      {
        url: "/images/styles/lyrical.jpg",
        width: 1200,
        height: 630,
        alt: "Online Dance Classes with DK Dance Company",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Online Dance Classes Worldwide | DK Dance Company",
    description:
      "Learn dance online with DK Dance Company. Live interactive video coaching.",
    images: ["/images/styles/lyrical.jpg"],
  },
};

export default async function OnlineClassesPage() {
  const [settings, branches, danceStyles] = await Promise.all([
    getSiteSettings(),
    getBranches(),
    getDanceStyles(true),
  ]);

  const onlineData = settings.onlineClasses;
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://www.dkdancecompany.com";

  const onlineCourseSchema = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: "Online Dance Classes Worldwide",
    description: onlineData.description,
    provider: {
      "@type": "DanceSchool",
      name: "DK Dance Company",
      url: baseUrl,
    },
    hasCourseInstance: {
      "@type": "CourseInstance",
      courseMode: "online",
      name: "Global Digital Dance Program",
      description: "Interactive 2-way live video dance sessions across global time zones.",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(onlineCourseSchema) }}
      />
      <Navbar />

      <main className="min-h-screen bg-black text-white pt-24 sm:pt-32 pb-24 w-full overflow-x-clip">
        <section className="max-w-7xl mx-auto px-4 sm:px-8 mb-20">
          <Breadcrumbs items={[{ name: "Online Classes" }]} />

          <FadeUp>
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] backdrop-blur-md mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-dk-yellow animate-pulse" />
              <span className="editorial-eyebrow text-neutral-400">
                WORLDWIDE DIGITAL TRAINING
              </span>
            </div>
            <h1 className="text-4xl xs:text-5xl sm:text-7xl lg:text-8xl font-heading font-extralight sm:font-thin uppercase tracking-tight leading-[0.9] text-white max-w-4xl mb-8">
              <span className="block text-dk-yellow text-xs sm:text-sm font-mono font-normal tracking-widest mb-2">
                WORLDWIDE DIGITAL ACADEMY
              </span>
              Online Dance Classes
            </h1>
            <p className="text-xl sm:text-2xl text-neutral-300 font-light max-w-3xl leading-relaxed">
              {onlineData.headline}. DK Dance Company brings structured dance
              education to international students, diaspora communities, and
              dancers worldwide.
            </p>
          </FadeUp>
        </section>

        {/* Feature Grid & Visual */}
        <section className="max-w-7xl mx-auto px-4 sm:px-8 mb-32">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            <div className="lg:col-span-6 space-y-8">
              <FadeUp>
                <p className="text-neutral-300 text-base sm:text-lg leading-relaxed font-light">
                  {onlineData.description}
                </p>
              </FadeUp>

              <FadeUp delay={0.1}>
                <div className="space-y-4">
                  {onlineData.features.map((feat) => (
                    <div
                      key={feat}
                      className="flex items-center gap-4 p-4 sm:p-5 rounded-2xl glass-panel border border-white/[0.08] bg-white/[0.02] shadow-sm"
                    >
                      <div className="w-6 h-6 rounded-full bg-dk-yellow/15 text-dk-yellow flex items-center justify-center shrink-0 border border-dk-yellow/30">
                        <Check className="w-3.5 h-3.5 text-dk-yellow" />
                      </div>
                      <span className="text-sm font-heading font-light uppercase tracking-wide text-white">
                        {feat}
                      </span>
                    </div>
                  ))}
                </div>
              </FadeUp>

              <FadeUp delay={0.2}>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-white/[0.08] text-center">
                  <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.08] shadow-sm">
                    <Globe className="w-5 h-5 text-neutral-400 mx-auto mb-2" />
                    <span className="text-[10px] font-mono uppercase text-neutral-400 block">
                      Global Access
                    </span>
                  </div>
                  <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.08] shadow-sm">
                    <Video className="w-5 h-5 text-neutral-400 mx-auto mb-2" />
                    <span className="text-[10px] font-mono uppercase text-neutral-400 block">
                      HD 2-Way Video
                    </span>
                  </div>
                  <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.08] shadow-sm">
                    <Clock className="w-5 h-5 text-neutral-400 mx-auto mb-2" />
                    <span className="text-[10px] font-mono uppercase text-neutral-400 block">
                      Flexible Zones
                    </span>
                  </div>
                  <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.08] shadow-sm">
                    <ShieldCheck className="w-5 h-5 text-neutral-400 mx-auto mb-2" />
                    <span className="text-[10px] font-mono uppercase text-neutral-400 block">
                      Certified DKDC
                    </span>
                  </div>
                </div>
              </FadeUp>
            </div>

            <div className="lg:col-span-6 relative aspect-[4/5] bg-neutral-950 overflow-hidden rounded-3xl border border-white/[0.08] shadow-2xl">
              <RevealImage className="w-full h-full relative">
                <Image
                  src="/images/styles/lyrical.jpg"
                  alt="Online dance learning with DK Dance Company live session"
                  fill
                  priority
                  className="object-cover object-center transition-all duration-700 ease-out"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </RevealImage>
            </div>
          </div>
        </section>

        {/* Dedicated Online Enquiry Form */}
        <section className="max-w-4xl mx-auto px-4 sm:px-8">
          <div className="text-center mb-12">
            <span className="editorial-eyebrow text-dk-yellow block mb-2">
              DIGITAL ADMISSIONS
            </span>
            <h2 className="text-3xl sm:text-5xl font-heading font-light uppercase tracking-tight text-white mb-4">
              Enquire For Online Classes
            </h2>
            <p className="text-sm text-neutral-400 max-w-md mx-auto">
              Tell us your location, time zone, and experience level. We will
              match you with the optimal batch or private coaching schedule.
            </p>
          </div>

          <ContactForm branches={branches} danceStyles={danceStyles} defaultMode="online" />
        </section>
      </main>

      <Footer />
      <WhatsAppButton variant="floating" message="Hello DK Dance Company, I would like to enquire about online dance classes." />
    </>
  );
}
