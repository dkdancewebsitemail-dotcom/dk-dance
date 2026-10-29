"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { FadeUp } from "@/components/ui/Motion";

interface EligibilityItem {
  number: string;
  category: string;
  question: string;
  answer: string;
}

const ELIGIBILITY_QUESTIONS: EligibilityItem[] = [
  {
    number: "01",
    category: "Beginners",
    question: "Can beginners with no prior dance experience join?",
    answer:
      "Absolutely! No prior dance experience is needed. We provide foundational posture training, rhythm conditioning, muscle memory, and step-by-step guidance so you can build confidence from day one.",
  },
  {
    number: "02",
    category: "Children & Teenagers",
    question: "Are there dedicated batches for children and teenagers?",
    answer:
      "Yes. We offer specialized, age-appropriate batches that focus on building confidence, stage presence, kinetic coordination, discipline, and artistic expression in a structured, inspiring environment.",
  },
  {
    number: "03",
    category: "Adults",
    question: "Can adults join for fitness, flexibility, or as a creative hobby?",
    answer:
      "Dance has no age limit! Our adult batches welcome enthusiasts looking to learn technique, enhance stamina, improve flexibility, de-stress, and express themselves freely through movement.",
  },
  {
    number: "04",
    category: "Aspiring Performers",
    question: "Do you provide advanced training for aspiring performers and artists?",
    answer:
      "Yes. For dancers aiming to perform on professional stages, we provide advanced choreography training, stage spatial awareness, camera projection, and performance dynamics.",
  },
  {
    number: "05",
    category: "Competition Students",
    question: "Can students prepare for stage shows, championships, and dance competitions?",
    answer:
      "Yes. DKDC trains rigorously conditioned teams and audition-selected crews prepared for state, national, and international dance championships, battle arenas, and premier showcases.",
  },
  {
    number: "06",
    category: "Technique Improvement",
    question: "Can experienced dancers join to sharpen specific techniques and styles?",
    answer:
      "Definitely. Dancers of any background looking to sharpen their footwork precision, body isolations, tutting geometry, and lyrical emotional execution can enroll in our intensive technique-focused sessions.",
  },
];

export function WhoCanJoinSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleItem = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section className="bg-neutral-950 text-white py-24 sm:py-32 relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-8">
        
        <div className="max-w-2xl mb-16 sm:mb-20">
          <FadeUp>
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] backdrop-blur-md mb-4 transition-transform duration-300 hover:scale-105">
              <span className="w-1.5 h-1.5 rounded-full bg-dk-red animate-pulse" />
              <span className="editorial-eyebrow text-neutral-400">
                03 — ELIGIBILITY & INCLUSIVITY
              </span>
            </div>
            <h2 className="text-4xl sm:text-6xl font-heading font-light uppercase tracking-tight text-white mb-6">
              Who Can Join
            </h2>
            <p className="text-neutral-400 text-sm sm:text-base font-light leading-relaxed">
              Dance is a universal language. At DKDC, our curriculum is engineered
              to meet you where you are and elevate your potential.
            </p>
          </FadeUp>
        </div>

        {/* Q&A Accordion List */}
        <div className="divide-y divide-white/[0.08] border-y border-white/[0.08]">
          {ELIGIBILITY_QUESTIONS.map((item, index) => {
            const isOpen = openIndex === index;

            return (
              <FadeUp key={item.number} delay={index * 0.05}>
                <div
                  className={`group transition-all duration-300 px-2 sm:px-5 -mx-2 sm:-mx-5 rounded-2xl ${
                    isOpen ? "bg-white/[0.03]" : "hover:bg-white/[0.02]"
                  }`}
                >
                  {/* Question Row / Toggle Button */}
                  <button
                    type="button"
                    onClick={() => toggleItem(index)}
                    aria-expanded={isOpen}
                    className="w-full py-6 sm:py-8 flex items-center justify-between gap-4 sm:gap-6 text-left cursor-pointer transition-all"
                  >
                    <div className="flex items-start sm:items-center gap-4 sm:gap-6 flex-1 min-w-0">
                      {/* Numbering: 01, 02, etc. */}
                      <span className="font-mono text-xs sm:text-sm text-neutral-500 group-hover:text-dk-yellow transition-colors shrink-0 pt-1 sm:pt-0">
                        {item.number}
                      </span>

                      <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-4 flex-1 min-w-0">
                        <span className="text-[11px] font-mono tracking-wider text-neutral-400 uppercase sm:hidden">
                          {item.category}
                        </span>
                        <h3 className="text-lg sm:text-2xl font-heading font-light uppercase tracking-tight text-white group-hover:text-dk-yellow transition-colors leading-snug">
                          {item.question}
                        </h3>
                      </div>
                    </div>

                    {/* Arrow Button */}
                    <div
                      className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full border flex items-center justify-center shrink-0 transition-all duration-300 ${
                        isOpen
                          ? "bg-white/10 border-dk-yellow/50 text-dk-yellow"
                          : "border-white/10 bg-white/[0.02] text-neutral-400 group-hover:text-white group-hover:border-white/20 group-hover:bg-white/[0.05]"
                      }`}
                      aria-hidden="true"
                    >
                      <ChevronDown
                        className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 ease-out ${
                          isOpen ? "rotate-180 text-dk-yellow" : ""
                        }`}
                      />
                    </div>
                  </button>

                  {/* Collapsible Answer */}
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="pb-7 sm:pb-9 pl-4 sm:pl-12 pr-2 sm:pr-14">
                          <p className="text-neutral-300 text-sm sm:text-base font-light leading-relaxed border-l-2 border-dk-yellow/40 pl-4 py-1">
                            {item.answer}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </FadeUp>
            );
          })}
        </div>
      </div>
    </section>
  );
}
