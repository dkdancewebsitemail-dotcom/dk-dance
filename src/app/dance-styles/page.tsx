import React from "react";
import Image from "next/image";
import { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { FadeUp, RevealImage } from "@/components/ui/Motion";
import { Button } from "@/components/ui/Button";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { DANCE_STYLES, SPECIAL_TRAINING_MODULES } from "@/lib/constants";
import { getDanceStyles, getCurriculumModules } from "@/lib/db-services";
import { ExpandableText } from "@/components/ui/ExpandableText";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Dance Styles & Special Training | DK Dance Company",
  description:
    "Explore dance styles offered by DK Dance Company: Bollywood, Hip-Hop, Contemporary, Lyrical, Western, and Freestyle dance, along with specialized conditioning and acrobatics.",
};

export default async function DanceStylesPage() {
  const [dbStyles, dbCurriculum] = await Promise.all([
    getDanceStyles(true),
    getCurriculumModules(true),
  ]);

  const styles = [...(dbStyles.length > 0 ? dbStyles : DANCE_STYLES)].sort(
    (a: any, b: any) => (Number(a.displayOrder) || 1) - (Number(b.displayOrder) || 1)
  );
  const modules = [...(dbCurriculum.length > 0 ? dbCurriculum : SPECIAL_TRAINING_MODULES)].sort(
    (a: any, b: any) => (Number(a.displayOrder) || 1) - (Number(b.displayOrder) || 1)
  );

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-black text-white pt-24 sm:pt-32 pb-24 w-full overflow-x-clip">
        
        <section className="max-w-7xl mx-auto px-4 sm:px-8 mb-24">
          <FadeUp>
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] backdrop-blur-md mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-dk-yellow animate-pulse" />
              <span className="editorial-eyebrow text-neutral-400">
                CURRICULUM & DISCIPLINES
              </span>
            </div>
            <h1 className="text-4xl xs:text-5xl sm:text-7xl lg:text-8xl font-heading font-extralight sm:font-thin uppercase tracking-tight leading-[0.9] text-white max-w-4xl mb-8">
              Dance Styles
            </h1>
            <p className="text-xl sm:text-2xl text-neutral-300 font-light max-w-3xl leading-relaxed">
              We teach diverse international and contemporary dance vocabularies,
              each anchored in anatomical conditioning, expressive theatricality,
              and rhythmic mastery.
            </p>
          </FadeUp>
        </section>

        {/* Detailed Styles Breakdown */}
        <section className="max-w-7xl mx-auto px-4 sm:px-8 space-y-32 mb-36">
          {styles.map((style, index) => {
            const isReversed = index % 2 === 1;

            return (
              <div
                key={style.slug}
                id={style.slug}
                className={`grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center pt-16 border-t border-white/[0.08] ${
                  isReversed ? "lg:flex-row-reverse" : ""
                }`}
              >
                {/* Visual */}
                <div
                  className={`lg:col-span-6 relative aspect-[16/11] bg-neutral-950 overflow-hidden rounded-3xl border border-white/[0.08] shadow-2xl ${
                    isReversed ? "lg:order-2" : "lg:order-1"
                  }`}
                >
                  <RevealImage className="w-full h-full relative">
                    <Image
                      src={style.image}
                      alt={style.name}
                      fill
                      className="object-cover object-center transition-all duration-700 ease-out"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
                    <div className="absolute top-4 left-4 z-10">
                      <span className="font-mono text-xs px-3 py-1 rounded-full bg-black/70 text-dk-yellow border border-white/10 backdrop-blur-md">
                        {style.number}{" // DISCIPLINE"}
                      </span>
                    </div>
                  </RevealImage>
                </div>

                {/* Content */}
                <div
                  className={`lg:col-span-6 flex flex-col justify-between ${
                    isReversed ? "lg:order-1" : "lg:order-2"
                  }`}
                >
                  <FadeUp delay={0.1}>
                    <span className="text-xs font-mono uppercase tracking-widest text-neutral-500 block mb-2">
                      {style.tagline}
                    </span>
                    <h2 className="text-3xl sm:text-5xl font-heading font-light uppercase tracking-tight text-white mb-6">
                      {style.name}
                    </h2>
                    <p className="text-neutral-300 text-sm sm:text-base leading-relaxed mb-8 font-light">
                      {style.description}
                    </p>
                  </FadeUp>

                  <FadeUp delay={0.2}>
                    <div className="mb-8 p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] backdrop-blur-sm">
                      <span className="text-xs font-mono uppercase tracking-widest text-neutral-400 block mb-3">
                        Key Training Objectives:
                      </span>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono text-neutral-400 uppercase">
                        {(style.features || []).map((f) => (
                          <li
                            key={f}
                            className="flex items-center gap-2 py-2 border-b border-white/[0.06]"
                          >
                            <span className="text-dk-yellow">✦</span>
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
                      <Button
                        href={`/contact?style=${encodeURIComponent(style.name)}`}
                        variant="primary"
                        size="md"
                        icon
                        className="w-full sm:w-auto text-center justify-center"
                      >
                        Enroll In {style.name}
                      </Button>
                      <Button
                        href="/branches"
                        variant="ghost"
                        size="md"
                        className="text-center justify-center"
                      >
                        View Branch Studios
                      </Button>
                    </div>
                  </FadeUp>
                </div>
              </div>
            );
          })}
        </section>

        {/* Special Training Section */}
        <section className="bg-neutral-950/60 py-28 border-t border-white/[0.08] mb-24 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-8">
            <div className="max-w-3xl mb-16">
              <FadeUp>
                <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] backdrop-blur-md mb-4">
                  <span className="w-1.5 h-1.5 rounded-full bg-dk-red animate-pulse" />
                  <span className="editorial-eyebrow text-neutral-400">
                    ANATOMICAL RIGOR
                  </span>
                </div>
                <h2 className="text-4xl sm:text-5xl font-heading font-light uppercase tracking-tight text-white mb-4">
                  Special Training Curriculum
                </h2>
                <p className="text-neutral-400 text-sm sm:text-base font-light">
                  Dance mastery requires targeted physiological conditioning.
                  These specialized modules are embedded into all student levels.
                </p>
              </FadeUp>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {modules.map((item, idx) => (
                <FadeUp key={`${item.title}-${idx}`} delay={idx * 0.07}>
                  <div className="p-8 rounded-3xl glass-panel border border-white/[0.08] bg-white/[0.02] hover:border-dk-yellow/40 hover:bg-white/[0.04] transition-all duration-500 group shadow-sm hover:shadow-xl min-w-0 max-w-full overflow-hidden flex flex-col justify-between">
                    <div className="min-w-0 max-w-full">
                      <span className="text-xs font-mono text-neutral-500 block mb-3 group-hover:text-dk-yellow transition-colors break-words [overflow-wrap:anywhere]">
                        MODULE {idx < 9 ? `0${idx + 1}` : idx + 1}{" // "}{String((item as any).badge || "CONDITIONING")}
                      </span>
                      <h3 className="text-xl font-heading font-light uppercase text-white mb-3 break-words [overflow-wrap:anywhere]">
                        {item.title}
                      </h3>
                      <ExpandableText
                        text={item.desc}
                        limit={130}
                        className="text-xs sm:text-sm text-neutral-400 leading-relaxed font-light break-words [overflow-wrap:anywhere]"
                      />
                    </div>
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>
        </section>

        
        <section className="max-w-7xl mx-auto px-4 sm:px-8 mb-20 text-center">
          <FadeUp>
            <div className="p-10 sm:p-16 rounded-3xl glass-panel border border-white/[0.08] bg-white/[0.02] text-center shadow-2xl relative overflow-hidden">
              <h2 className="text-3xl sm:text-5xl font-heading font-light uppercase tracking-tight text-white mb-6">
                Find the right style for you
              </h2>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 max-w-sm sm:max-w-none mx-auto">
                <Button href="/contact" variant="accent" size="lg" icon>
                  Book An Audition / Trial
                </Button>
                <Button href="/branches" variant="secondary" size="lg">
                  View Studio Locations
                </Button>
              </div>
            </div>
          </FadeUp>
        </section>
      </main>

      <Footer />
      <WhatsAppButton variant="floating" />
    </>
  );
}
