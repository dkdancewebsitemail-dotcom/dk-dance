import React from "react";
import { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { FadeUp } from "@/components/ui/Motion";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { Button } from "@/components/ui/Button";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Studio Rules, Regulations & Attendance Policy | DK Dance Company",
  description:
    "Institutional code of conduct, fee remittance rules, attendance guidelines, and studio etiquette for students at DK Dance Company Kozhikode & UK.",
  alternates: {
    canonical: "/rules",
  },
  openGraph: {
    title: "Studio Rules, Regulations & Attendance Policy | DK Dance Company",
    description:
      "Institutional guidelines, studio decorum, and attendance standards for students at DK Dance Company.",
    url: "https://www.dkdancecompany.com/rules",
    type: "website",
    images: [
      {
        url: "/images/logo/logo.png",
        width: 1200,
        height: 630,
        alt: "DK Dance Company Rules & Regulations",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Studio Rules & Regulations | DK Dance Company",
    description: "Guidelines and code of conduct for DK Dance Company studios.",
    images: ["/images/logo/logo.png"],
  },
};

const RULES = [
  {
    number: "01",
    title: "Timely Fee Remittance",
    desc: "Monthly fees must be settled on or before the 10th of every calendar month. Delayed payments may forfeit batch placement or incur administrative surcharges.",
  },
  {
    number: "02",
    title: "Punctuality & Studio Etiquette",
    desc: "Students are required to report at least 10 minutes prior to scheduled session commencement. Warm-up is mandatory to prevent musculoskeletal strain.",
  },
  {
    number: "03",
    title: "Appropriate Dance Attire",
    desc: "Proper stretchable dance wear (track pants, form-fitting tees) and clean indoor footwear or bare feet (as prescribed per style) are required for every class.",
  },
  {
    number: "04",
    title: "Attendance & Consistency",
    desc: "Consistent attendance is prerequisite for choreographic continuity. Unscheduled absences disrupt group formations and may impact stage eligibility.",
  },
  {
    number: "05",
    title: "Discipline & Respect",
    desc: "Students and guardians are expected to maintain professional decorum, respect instructors, support fellow dancers, and honor studio property.",
  },
  {
    number: "06",
    title: "Performance Eligibility",
    desc: "Selection for annual stage shows, competitive teams, and external cultural showcases is contingent upon technique mastery, commitment, and faculty evaluation.",
  },
  {
    number: "07",
    title: "Health & Safety Declarations",
    desc: "Any pre-existing medical conditions, injuries, or physical restrictions must be reported to the administration prior to class participation.",
  },
];

export default function RulesPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-black text-white pt-24 sm:pt-32 pb-24 w-full overflow-x-clip">
        <section className="max-w-7xl mx-auto px-4 sm:px-8 mb-20">
          <Breadcrumbs items={[{ name: "Studio Rules" }]} />

          <FadeUp>
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] backdrop-blur-md mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-dk-yellow animate-pulse" />
              <span className="editorial-eyebrow text-neutral-400">
                INSTITUTIONAL STANDARDS
              </span>
            </div>
            <h1 className="text-4xl xs:text-5xl sm:text-7xl lg:text-8xl font-heading font-extralight sm:font-thin uppercase tracking-tight leading-[0.9] text-white max-w-4xl mb-8">
              <span className="block text-dk-yellow text-xs sm:text-sm font-mono font-normal tracking-widest mb-2">
                DK DANCE COMPANY CODE
              </span>
              Rules & Regulations
            </h1>
            <p className="text-xl sm:text-2xl text-neutral-300 font-light max-w-3xl leading-relaxed">
              Discipline is the foundation of artistic greatness. These guidelines
              ensure a safe, focused, and respectful training environment for all
              DKDC students.
            </p>
          </FadeUp>
        </section>

        {/* Rules List */}
        <section className="max-w-7xl mx-auto px-4 sm:px-8 mb-24">
          <div className="space-y-6">
            {RULES.map((rule, idx) => (
              <FadeUp key={rule.number} delay={idx * 0.05}>
                <div className="p-6 sm:p-10 rounded-3xl glass-panel border border-white/[0.08] bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04] transition-all duration-500 shadow-sm hover:shadow-xl grid grid-cols-1 md:grid-cols-12 gap-6 items-baseline">
                  <div className="md:col-span-2">
                    <span className="font-mono text-xs text-dk-yellow uppercase tracking-widest px-3 py-1 rounded-full bg-dk-yellow/10 border border-dk-yellow/20 inline-block">
                      CLAUSE {rule.number}
                    </span>
                  </div>
                  <div className="md:col-span-4">
                    <h2 className="text-xl sm:text-2xl font-heading font-light uppercase tracking-tight text-white">
                      {rule.title}
                    </h2>
                  </div>
                  <div className="md:col-span-6">
                    <p className="text-neutral-400 text-sm leading-relaxed font-light">
                      {rule.desc}
                    </p>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="max-w-7xl mx-auto px-6 sm:px-8 text-center mb-20">
          <FadeUp>
            <div className="p-10 sm:p-14 rounded-3xl glass-panel border border-white/[0.08] bg-white/[0.02] text-center shadow-xl">
              <p className="text-neutral-400 text-sm mb-6 max-w-md mx-auto font-light">
                Have questions regarding specific branch rules, fee schedules, or
                makeup classes?
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Button href="/contact" variant="primary" size="md">
                  Contact Administration
                </Button>
                <Button href="/dance-styles" variant="secondary" size="md">
                  View Dance Styles
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
