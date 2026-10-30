import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ClassesFeesSection } from "@/components/sections/ClassesFeesSection";
import { WhatsAppButton, WhatsAppIcon } from "@/components/ui/WhatsAppButton";
import { FadeUp } from "@/components/ui/Motion";
import { Button } from "@/components/ui/Button";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { getSiteSettings, getBranches, getDanceStyles, getCurriculumModules } from "@/lib/db-services";
import { ArrowRight, CheckCircle2, Users, Calendar, Sparkles } from "lucide-react";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Dance Classes, Batches & Fee Structure | DK Dance Company Kozhikode",
  description:
    "Explore professional dance classes, training batches for children, teenagers and adults, and transparent monthly fee schedules at DK Dance Company branches in Kozhikode and online.",
  alternates: {
    canonical: "/classes",
  },
  openGraph: {
    title: "Dance Classes & Fee Structure | DK Dance Company Kozhikode",
    description:
      "Structured dance training for kids, teenagers, and adults across Kozhikode branches and online. View admission fees and batch schedules.",
    url: "https://www.dkdancecompany.com/classes",
    type: "website",
    images: [
      {
        url: "/images/styles/contemporary.jpg",
        width: 1200,
        height: 630,
        alt: "DK Dance Company Classes and Training",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Dance Classes & Fee Structure | DK Dance Company",
    description:
      "Professional dance education in Kozhikode, Kerala & Bournemouth, UK. Transparent fees, certified curriculum.",
    images: ["/images/styles/contemporary.jpg"],
  },
};

export default async function ClassesPage() {
  const [settings, branches, danceStyles, curriculum] = await Promise.all([
    getSiteSettings(),
    getBranches(),
    getDanceStyles(true),
    getCurriculumModules(true),
  ]);

  const batches = [
    {
      group: "Juniors / Kids Batch",
      ageRange: "Ages 4 – 12",
      badge: "Foundation Level",
      focus: "Motor coordination, rhythm recognition, posture alignment, basic movement vocabulary, and confidence building.",
      timings: "Weekend mornings & weekday evening batches",
      highlights: [
        "Safe, playful physical development",
        "Rhythm & beat synchronization",
        "Stage performance debut in annual showcase",
        "Personalized instructor guidance",
      ],
    },
    {
      group: "Teens & Youth Batch",
      ageRange: "Ages 13 – 17",
      badge: "Intermediate / Advanced",
      focus: "Urban hip-hop fundamentals, contemporary floorwork, Bollywood performance conditioning, body isolations, and choreography retention.",
      timings: "Weekday evenings & Saturday intensives",
      highlights: [
        "Style exploration & freestyle agility",
        "Ensemble coordination & stagecraft",
        "Competition & championship training",
        "Advanced flexibility and stamina",
      ],
    },
    {
      group: "Adults & Working Professionals",
      ageRange: "Ages 18+",
      badge: "Open Level & Fitness",
      focus: "Stress relief, fitness conditioning, lyrical expression, contemporary fluid movement, and creative release in a supportive studio environment.",
      timings: "Flexible evening & weekend batches",
      highlights: [
        "No prior dance experience required",
        "Cardio conditioning & flexibility",
        "Body awareness & artistic expression",
        "Welcoming, non-judgmental atmosphere",
      ],
    },
  ];

  const courseSchema = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: "Professional Dance Training & Performance Program",
    description:
      "Comprehensive multi-genre dance education covering Bollywood, Hip-Hop, Contemporary, Lyrical, and Western dance styles for kids, teenagers, and adults.",
    provider: {
      "@type": "DanceSchool",
      name: "DK Dance Company",
      sameAs: "https://www.dkdancecompany.com",
    },
    hasCourseInstance: [
      {
        "@type": "CourseInstance",
        courseMode: "onsite",
        name: "Foundational Track (1 Class/Week)",
        offers: {
          "@type": "Offer",
          price: "500",
          priceCurrency: "INR",
          description: "Monthly fee for weekly 1 session track",
        },
      },
      {
        "@type": "CourseInstance",
        courseMode: "onsite",
        name: "Performance Track (2 Classes/Week)",
        offers: {
          "@type": "Offer",
          price: "800",
          priceCurrency: "INR",
          description: "Monthly fee for intensive weekly 2 sessions track",
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(courseSchema) }}
      />
      <Navbar />

      <main className="min-h-screen bg-black text-white pt-24 sm:pt-32 pb-24 w-full overflow-x-clip">
        {/* Page Header */}
        <section className="max-w-7xl mx-auto px-4 sm:px-8 mb-16">
          <Breadcrumbs items={[{ name: "Classes & Fees" }]} />

          <FadeUp>
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] backdrop-blur-md mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-dk-yellow animate-pulse" />
              <span className="editorial-eyebrow text-neutral-400">
                TRAINING PROGRAMS & TUITION
              </span>
            </div>
            <h1 className="text-4xl xs:text-5xl sm:text-7xl lg:text-8xl font-heading font-extralight sm:font-thin uppercase tracking-tight leading-[0.9] text-white max-w-4xl mb-8">
              Dance Classes & Batches
            </h1>
            <p className="text-xl sm:text-2xl text-neutral-300 font-light max-w-3xl leading-relaxed">
              Structured dance curriculum designed by Artistic Director Dhanesh Krishnan.
              Catering to children, teenagers, and adult learners across Kozhikode and global online classrooms.
            </p>
          </FadeUp>
        </section>

        {/* Batches Overview Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-8 mb-24">
          <div className="mb-12 border-b border-white/[0.08] pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-neutral-500 block mb-2">
                Program Categorization
              </span>
              <h2 className="text-2xl sm:text-4xl font-heading font-light uppercase text-white">
                Batches By Age & Experience
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-neutral-400 max-w-md font-light">
              Every student is evaluated and placed in an age-appropriate batch ensuring individual attention, progressive difficulty, and comfortable peer learning.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {batches.map((b, idx) => (
              <FadeUp key={b.group} delay={idx * 0.1}>
                <div className="p-8 rounded-3xl glass-panel border border-white/[0.08] bg-white/[0.02] flex flex-col justify-between h-full hover:border-white/20 transition-all duration-300">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-[10px] font-mono uppercase tracking-widest px-3 py-1 rounded-full bg-white/5 border border-white/10 text-neutral-300">
                        {b.badge}
                      </span>
                      <span className="text-xs font-mono text-dk-yellow font-medium">
                        {b.ageRange}
                      </span>
                    </div>

                    <h3 className="text-xl sm:text-2xl font-heading font-light uppercase text-white mb-3">
                      {b.group}
                    </h3>
                    <p className="text-xs sm:text-sm text-neutral-300 font-light leading-relaxed mb-6">
                      {b.focus}
                    </p>

                    <div className="space-y-2.5 mb-8">
                      {b.highlights.map((h, i) => (
                        <div key={i} className="flex items-start gap-2.5 text-xs text-neutral-400 font-light">
                          <CheckCircle2 className="w-3.5 h-3.5 text-dk-yellow shrink-0 mt-0.5" />
                          <span>{h}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-6 border-t border-white/[0.08] flex items-center justify-between gap-3 flex-wrap">
                    <span className="text-[11px] font-mono text-neutral-500">
                      {b.timings}
                    </span>
                    <div className="flex items-center gap-3">
                      <a
                        href={`https://wa.me/${settings?.contact?.whatsapp || "919995272083"}?text=${encodeURIComponent(`Hello DK Dance Company, I would like to enquire about enrolling in the ${b.group} (${b.ageRange}).`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-white text-[11px] font-mono uppercase tracking-wider font-medium transition-all duration-300 shadow-sm hover:shadow-[0_2px_12px_rgba(37,211,102,0.4)] active:scale-95 group"
                      >
                        <WhatsAppIcon className="w-3.5 h-3.5 fill-white shrink-0 group-hover:scale-110 transition-transform" />
                        <span>Enquire</span>
                      </a>
                      <Link
                        href="/contact"
                        className="text-xs font-mono uppercase tracking-wider text-dk-yellow hover:text-white inline-flex items-center gap-1 transition-colors"
                      >
                        <span>Enroll</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </section>

        {/* Official Fee Structure Component */}
        <ClassesFeesSection fees={settings?.fees} />

        {/* Styles & Curriculum Link Banner */}
        <section className="max-w-7xl mx-auto px-4 sm:px-8 my-20">
          <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-neutral-950 via-neutral-900 to-black border border-white/10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-2 max-w-xl text-center md:text-left">
              <span className="text-xs font-mono uppercase tracking-widest text-dk-yellow">
                Curriculum Details
              </span>
              <h3 className="text-2xl sm:text-3xl font-heading font-light uppercase text-white">
                Explore The 6 Specialized Dance Styles
              </h3>
              <p className="text-xs sm:text-sm text-neutral-400 font-light leading-relaxed">
                From Bollywood theatricality and urban Hip-Hop to Contemporary floorwork, explore our complete training syllabus.
              </p>
            </div>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button href="/dance-styles" variant="accent" size="md" icon>
                View Dance Styles
              </Button>
              <Button href="/branches" variant="secondary" size="md">
                Find Nearest Studio
              </Button>
            </div>
          </div>
        </section>

        {/* FAQ Section for AI Search & Search Engine Snippets */}
        <section className="max-w-4xl mx-auto px-4 sm:px-8 mb-24">
          <div className="text-center mb-12">
            <span className="text-xs font-mono uppercase tracking-widest text-neutral-500 block mb-2">
              Frequently Asked Questions
            </span>
            <h2 className="text-3xl sm:text-4xl font-heading font-light uppercase text-white">
              Common Questions About Classes
            </h2>
          </div>

          <div className="space-y-6">
            <div className="p-6 sm:p-8 rounded-2xl glass-panel border border-white/[0.08] bg-white/[0.02]">
              <h3 className="text-lg font-heading font-normal text-white mb-2">
                Can beginners with no prior dance experience join?
              </h3>
              <p className="text-sm text-neutral-300 font-light leading-relaxed">
                Yes, absolutely. Most students begin as complete novices. Our instructors introduce dance through foundational technique, basic rhythm conditioning, and step-by-step posture alignment in a friendly, encouraging atmosphere.
              </p>
            </div>

            <div className="p-6 sm:p-8 rounded-2xl glass-panel border border-white/[0.08] bg-white/[0.02]">
              <h3 className="text-lg font-heading font-normal text-white mb-2">
                What are the class timings and days?
              </h3>
              <p className="text-sm text-neutral-300 font-light leading-relaxed">
                Each studio branch maintains dedicated morning, evening, and weekend batches for school students, college students, and working professionals. Timings vary slightly across branches (Kunduparamba, Westhill, Balussery, Kottooli, Parambilbazar). Please confirm specific batch availability with your preferred branch desk.
              </p>
            </div>

            <div className="p-6 sm:p-8 rounded-2xl glass-panel border border-white/[0.08] bg-white/[0.02]">
              <h3 className="text-lg font-heading font-normal text-white mb-2">
                How do monthly fee payments work?
              </h3>
              <p className="text-sm text-neutral-300 font-light leading-relaxed">
                There is a one-time enrollment admission fee of ₹1,000. Monthly tuition is ₹500 for the weekly 1-class track and ₹800 for the intensive 2-classes track. Monthly fees are payable on or before the 10th of each calendar month.
              </p>
            </div>

            <div className="p-6 sm:p-8 rounded-2xl glass-panel border border-white/[0.08] bg-white/[0.02]">
              <h3 className="text-lg font-heading font-normal text-white mb-2">
                Are online dance classes available for students outside Kozhikode?
              </h3>
              <p className="text-sm text-neutral-300 font-light leading-relaxed">
                Yes. DK Dance Company provides live interactive digital dance classes for international students, diaspora families, and dancers outside Kerala. Visit our Online Classes page or connect via WhatsApp for digital batch registration.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer settings={settings} />
      <WhatsAppButton variant="floating" phone={settings?.contact?.whatsapp} />
    </>
  );
}
