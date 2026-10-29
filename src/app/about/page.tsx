import React from "react";
import Image from "next/image";
import { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { FadeUp, RevealImage } from "@/components/ui/Motion";
import { Button } from "@/components/ui/Button";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { ExpandableText } from "@/components/ui/ExpandableText";
import { getSiteSettings } from "@/lib/db-services";

export const metadata: Metadata = {
  title: "About Us | DK Dance Company",
  description:
    "Learn about DK Dance Company (DKDC), founded by Artistic Director Dhanesh Krishnan. Professional dance education across Kozhikode, Kerala and Bournemouth, UK.",
};

export default async function AboutPage() {
  const settings = await getSiteSettings();

  const trainingFocus = [
    {
      title: "Technique",
      desc: "Foundational anatomical alignment, muscle engagement, posture discipline, and controlled movement mechanics.",
    },
    {
      title: "Rhythm & Musicality",
      desc: "Deep listening, syncopation drills, tempo shifts, and learning to embody beats across diverse music genres.",
    },
    {
      title: "Body Movement",
      desc: "Kinetic awareness, seamless weight transitions, grounded floorwork, and fluid upper body coordination.",
    },
    {
      title: "Flexibility & Conditioning",
      desc: "Targeted elongation, core conditioning, safe stretching protocols, and joint mobility enhancement.",
    },
    {
      title: "Coordination",
      desc: "Polyrhythmic limb independence, complex movement combinations, and swift spatial orientation.",
    },
    {
      title: "Creativity & Improvisation",
      desc: "Unlocking individual artistic voice, movement exploration, emotional storytelling, and freestyle confidence.",
    },
    {
      title: "Performance Skills",
      desc: "Stage presence, projection, eye contact, spatial synchronization, and commanding audience connection.",
    },
  ];

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-black text-white pt-24 sm:pt-32 pb-24 w-full overflow-x-clip">
        {/* Header Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-8 mb-24">
          <FadeUp>
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] backdrop-blur-md mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-dk-yellow animate-pulse" />
              <span className="editorial-eyebrow text-neutral-400">
                THE INSTITUTION
              </span>
            </div>
            <h1 className="text-4xl xs:text-5xl sm:text-7xl lg:text-8xl font-heading font-extralight sm:font-thin uppercase tracking-tight leading-[0.9] text-white max-w-4xl mb-8">
              Movement As An Art Form.
            </h1>
            <p className="text-xl sm:text-2xl text-neutral-300 font-light max-w-3xl leading-relaxed">
              DK Dance Company (DKDC) is a professional dance training institution
              founded on discipline, creativity, and the relentless pursuit of
              artistic excellence.
            </p>
          </FadeUp>
        </section>

        {/* Story & Asymmetrical Image */}
        <section className="max-w-7xl mx-auto px-4 sm:px-8 mb-32">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            <div className="lg:col-span-6 relative aspect-[4/5] bg-neutral-950 overflow-hidden rounded-3xl border border-white/[0.08] shadow-2xl">
              <RevealImage className="w-full h-full relative">
                <Image
                  src="/images/branches/balussery.jpg"
                  alt="DK Dance Company studio practice session"
                  fill
                  priority
                  className="object-cover object-center transition-all duration-700 ease-out"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
                <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between text-xs font-mono uppercase tracking-widest text-neutral-200 px-4 py-2.5 rounded-2xl bg-black/60 backdrop-blur-md border border-white/10 shadow-lg">
                  <span>Founded by Dhanesh Krishnan</span>
                  <span>Kozhikode • Bournemouth</span>
                </div>
              </RevealImage>
            </div>

            <div className="lg:col-span-6 flex flex-col justify-between">
              <FadeUp delay={0.1}>
                <span className="inline-block px-3 py-1 rounded-full text-[10px] font-mono tracking-widest uppercase bg-dk-red/10 text-dk-red border border-dk-red/20 mb-4">
                  Welcome To DKDC
                </span>
                <p className="text-neutral-300 text-base sm:text-lg leading-relaxed mb-6 font-light">
                  {settings.intro}
                </p>
                <p className="text-neutral-400 text-sm leading-relaxed mb-8 font-light">
                  From absolute beginners taking their first steps to advanced
                  performers conditioning for international stages, our curriculum
                  is crafted with anatomical precision, musical depth, and
                  uncompromising dedication to dance as a serious discipline.
                </p>
              </FadeUp>

              {/* Mission & Vision Blocks */}
              <div className="space-y-4 pt-6 border-t border-white/[0.08]">
                <FadeUp delay={0.2}>
                  <div className="p-6 rounded-2xl glass-panel border border-white/[0.08] bg-white/[0.02] relative overflow-hidden group hover:border-dk-yellow/40 transition-all duration-500 min-w-0 max-w-full">
                    <div className="absolute top-0 left-0 bottom-0 w-1 bg-gradient-to-b from-dk-yellow to-transparent" />
                    <span className="editorial-eyebrow text-dk-yellow block mb-2">
                      Our Mission
                    </span>
                    <ExpandableText
                      text={settings.mission}
                      limit={200}
                      className="text-base sm:text-lg font-heading text-white font-light leading-snug break-words [overflow-wrap:anywhere]"
                    />
                  </div>
                </FadeUp>

                <FadeUp delay={0.3}>
                  <div className="p-6 rounded-2xl glass-panel border border-white/[0.08] bg-white/[0.02] relative overflow-hidden group hover:border-dk-red/40 transition-all duration-500 min-w-0 max-w-full">
                    <div className="absolute top-0 left-0 bottom-0 w-1 bg-gradient-to-b from-dk-red to-transparent" />
                    <span className="editorial-eyebrow text-dk-red block mb-2">
                      Our Vision
                    </span>
                    <ExpandableText
                      text={settings.vision}
                      limit={200}
                      className="text-base sm:text-lg font-heading text-white font-light leading-snug break-words [overflow-wrap:anywhere]"
                    />
                  </div>
                </FadeUp>
              </div>
            </div>
          </div>
        </section>

        {/* Leadership: Director Dhanesh Krishnan */}
        <section className="bg-neutral-950/60 py-24 border-y border-white/[0.08] mb-32 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-7">
                <FadeUp>
                  <span className="inline-block px-3 py-1 rounded-full text-[10px] font-mono tracking-widest uppercase bg-white/[0.03] text-dk-yellow border border-white/[0.08] mb-4">
                    Choreographer • Founder & Artistic Director
                  </span>
                  <h2 className="text-3xl sm:text-5xl font-heading font-light uppercase tracking-tight text-white mb-6">
                    Dhanesh Krishnan K
                  </h2>
                  <p className="text-neutral-300 text-base sm:text-lg font-light leading-relaxed mb-6">
                    Under the visionary direction of Dhanesh Krishnan K, DK Dance
                    Company has developed a distinct movement vocabulary that
                    bridges traditional Indian emotional storytelling with the
                    athleticism and geometry of modern contemporary and commercial
                    dance.
                  </p>
                  <p className="text-neutral-400 text-sm leading-relaxed mb-8 font-light">
                    Overseeing training programs across Kozhikode and our
                    international branch in Bournemouth, United Kingdom, Dhanesh
                    Krishnan personally establishes the pedagogy, teacher
                    training standards, and artistic direction for every company
                    production.
                  </p>
                  <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs font-mono text-neutral-400 uppercase px-4 py-2 rounded-2xl sm:rounded-full bg-white/[0.02] border border-white/[0.06] inline-flex">
                    <div>Head Office: Kozhikode, Kerala</div>
                    <div>•</div>
                    <div>Branch: Bournemouth, UK</div>
                  </div>
                </FadeUp>
              </div>

              <div className="lg:col-span-5 relative aspect-[4/5] bg-black border border-white/[0.08] overflow-hidden rounded-3xl shadow-2xl">
                <Image
                  src="/images/dhanesh-krishnan.png"
                  alt="Dhanesh Krishnan K - Choreographer, Founder & Director of DK Dance Company"
                  fill
                  priority
                  className="object-cover object-[center_20%] transition-all duration-700"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs font-mono uppercase tracking-widest text-white/90 px-4 py-2 rounded-xl bg-black/60 backdrop-blur-md border border-white/10">
                  <span>Dhanesh Krishnan K</span>
                  <span className="text-dk-yellow">Founder & Director</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* The 7 Focus Areas of Training */}
        <section className="max-w-7xl mx-auto px-4 sm:px-8 mb-32">
          <div className="max-w-3xl mb-16">
            <FadeUp>
              <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] backdrop-blur-md mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-dk-yellow animate-pulse" />
                <span className="editorial-eyebrow text-neutral-400">
                  Curriculum Foundations
                </span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-heading font-light uppercase tracking-tight text-white mb-4">
                What We Train
              </h2>
              <p className="text-neutral-400 text-sm sm:text-base font-light">
                Our curriculum is built around seven interconnected pillars
                ensuring holistic dancer development.
              </p>
            </FadeUp>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {trainingFocus.map((item, idx) => (
              <FadeUp key={item.title} delay={idx * 0.06}>
                <div className="p-8 rounded-3xl glass-panel border border-white/[0.08] bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04] transition-all duration-500 group shadow-sm hover:shadow-xl">
                  <span className="text-xs font-mono text-dk-yellow block mb-4">
                    PILLAR 0{idx + 1}
                  </span>
                  <h3 className="text-xl font-heading font-light uppercase text-white mb-3">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed font-light">
                    {item.desc}
                  </p>
                </div>
              </FadeUp>
            ))}
          </div>
        </section>

        
        <section className="max-w-7xl mx-auto px-4 sm:px-8 mb-20">
          <FadeUp>
            <div className="p-6 sm:p-16 rounded-3xl glass-panel border border-white/[0.08] bg-white/[0.02] text-center shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-1/2 translate-x-1/2 w-96 h-96 bg-dk-yellow/5 rounded-full blur-3xl pointer-events-none" />
              <h2 className="text-2xl sm:text-5xl font-heading font-light uppercase tracking-tight text-white mb-6">
                Ready to begin?
              </h2>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 max-w-sm sm:max-w-none mx-auto relative z-10">
                <Button href="/dance-styles" variant="primary" size="lg" icon className="w-full sm:w-auto">
                  Explore Dance Styles
                </Button>
                <Button href="/contact" variant="secondary" size="lg" className="w-full sm:w-auto">
                  Contact Admissions
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
