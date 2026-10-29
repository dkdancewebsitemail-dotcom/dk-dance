"use client";

import React, { useState, useEffect } from "react";
import { CheckCircle2, AlertCircle, Loader2, ArrowRight } from "lucide-react";
import { Branch, DanceStyle } from "@/types";
import { DANCE_STYLES } from "@/lib/constants";
import { useToast } from "@/context/ToastContext";

interface ContactFormProps {
  branches?: Branch[];
  danceStyles?: DanceStyle[];
  defaultBranch?: string;
  defaultMode?: "offline" | "online";
}

export function ContactForm({
  branches = [],
  danceStyles = [],
  defaultBranch = "",
  defaultMode = "offline",
}: ContactFormProps) {
  const { toast } = useToast();
  const [stylesList, setStylesList] = useState<DanceStyle[]>(
    danceStyles && danceStyles.length > 0 ? danceStyles : []
  );

  useEffect(() => {
    if (danceStyles && danceStyles.length > 0) {
      setStylesList(danceStyles);
      return;
    }

    let isMounted = true;
    fetch("/api/dance-styles")
      .then((res) => res.json())
      .then((data) => {
        if (isMounted && data.success && Array.isArray(data.data) && data.data.length > 0) {
          setStylesList(data.data);
        }
      })
      .catch((err) => {
        console.error("Failed to load dance styles for enquiry form:", err);
      });

    return () => {
      isMounted = false;
    };
  }, [danceStyles]);

  const effectiveStyles = stylesList.length > 0 ? stylesList : DANCE_STYLES;

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    age: "",
    branch: defaultBranch || "Kunduparamba",
    danceStyle: "All Styles / General",
    mode: defaultMode,
    message: "",
    website_hp: "",
  });

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!formData.name.trim() || !formData.phone.trim() || !formData.email.trim()) {
      setStatus("error");
      const msg = "Please complete all required fields (Name, Phone, Email).";
      setErrorMessage(msg);
      toast.warning(msg);
      return;
    }

    setStatus("loading");

    try {
      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to submit enquiry.");
      }

      setStatus("success");
      toast.success("Enquiry received! Director Dhanesh Krishnan or our team will contact you soon.");
      setFormData({
        name: "",
        phone: "",
        email: "",
        age: "",
        branch: defaultBranch || "Kunduparamba",
        danceStyle: "All Styles / General",
        mode: defaultMode,
        message: "",
        website_hp: "",
      });
    } catch (err: any) {
      setStatus("error");
      const msg = err.message || "An unexpected error occurred. Please try again.";
      setErrorMessage(msg);
      toast.error(msg);
    }
  };

  return (
    <div className="rounded-3xl glass-panel border border-white/[0.08] bg-white/[0.02] p-5 sm:p-8 md:p-12 shadow-2xl">
      {status === "success" ? (
        <div className="py-12 text-center flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-dk-yellow/10 text-dk-yellow flex items-center justify-center mb-6 border border-dk-yellow/20">
            <CheckCircle2 className="w-8 h-8 text-dk-yellow" />
          </div>
          <h3 className="text-2xl font-heading font-light uppercase tracking-tight text-white mb-3">
            Enquiry Received
          </h3>
          <p className="text-sm text-neutral-300 max-w-md leading-relaxed mb-8 font-light">
            Thank you for reaching out to DK Dance Company. Director Dhanesh
            Krishnan or our branch admissions coordinator will contact you
            promptly via Phone or WhatsApp.
          </p>
          <button
            onClick={() => setStatus("idle")}
            className="text-xs font-mono uppercase tracking-widest text-dk-yellow underline hover:text-white transition-colors"
          >
            Submit Another Enquiry
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate className="space-y-6">
          <div className="hidden" aria-hidden="true">
            <input
              type="text"
              name="website_hp"
              tabIndex={-1}
              autoComplete="off"
              value={formData.website_hp}
              onChange={(e) =>
                setFormData({ ...formData, website_hp: e.target.value })
              }
            />
          </div>

          {status === "error" && (
            <div
              role="alert"
              className="flex items-center gap-3 p-4 rounded-2xl bg-dk-red/10 border border-dk-red/30 text-white text-xs"
            >
              <AlertCircle className="w-4 h-4 text-dk-red shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="name"
                className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-2"
              >
                Student / Parent Name <span className="text-dk-red">*</span>
              </label>
              <input
                id="name"
                type="text"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Full Name"
                className="w-full rounded-2xl bg-white/[0.03] border border-white/[0.08] px-4 py-3.5 text-sm text-white focus:outline-none focus:border-dk-yellow/50 focus:bg-white/[0.06] transition-all duration-300 placeholder:text-neutral-500 font-light"
              />
            </div>

            <div>
              <label
                htmlFor="phone"
                className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-2"
              >
                Phone Number / WhatsApp <span className="text-dk-red">*</span>
              </label>
              <input
                id="phone"
                type="tel"
                required
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                placeholder="+91 9995 272 083"
                className="w-full rounded-2xl bg-white/[0.03] border border-white/[0.08] px-4 py-3.5 text-sm text-white focus:outline-none focus:border-dk-yellow/50 focus:bg-white/[0.06] transition-all duration-300 placeholder:text-neutral-500 font-light"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-2"
              >
                Email Address <span className="text-dk-red">*</span>
              </label>
              <input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="email@example.com"
                className="w-full rounded-2xl bg-white/[0.03] border border-white/[0.08] px-4 py-3.5 text-sm text-white focus:outline-none focus:border-dk-yellow/50 focus:bg-white/[0.06] transition-all duration-300 placeholder:text-neutral-500 font-light"
              />
            </div>

            <div>
              <label
                htmlFor="age"
                className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-2"
              >
                Student Age
              </label>
              <input
                id="age"
                type="text"
                value={formData.age}
                onChange={(e) =>
                  setFormData({ ...formData, age: e.target.value })
                }
                placeholder="e.g. 14 or Adult"
                className="w-full rounded-2xl bg-white/[0.03] border border-white/[0.08] px-4 py-3.5 text-sm text-white focus:outline-none focus:border-dk-yellow/50 focus:bg-white/[0.06] transition-all duration-300 placeholder:text-neutral-500 font-light"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="mode"
                className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-2"
              >
                Training Mode
              </label>
              <select
                id="mode"
                value={formData.mode}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    mode: e.target.value as "offline" | "online",
                  })
                }
                className="w-full rounded-2xl bg-neutral-900 border border-white/[0.08] px-4 py-3.5 text-sm text-white focus:outline-none focus:border-dk-yellow/50 transition-all duration-300 font-light"
              >
                <option value="offline">Studio Offline Classes</option>
                <option value="online">Online Digital Classes</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="branch"
                className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-2"
              >
                Preferred Branch
              </label>
              <select
                id="branch"
                value={formData.branch}
                onChange={(e) =>
                  setFormData({ ...formData, branch: e.target.value })
                }
                className="w-full rounded-2xl bg-neutral-900 border border-white/[0.08] px-4 py-3.5 text-sm text-white focus:outline-none focus:border-dk-yellow/50 transition-all duration-300 font-light"
              >
                <option value="General / Not Sure">General / Undecided</option>
                {branches.length > 0 ? (
                  branches.map((b) => (
                    <option key={b.slug} value={b.name}>
                      {b.name} ({b.city})
                    </option>
                  ))
                ) : (
                  <>
                    <option value="Kunduparamba">Kunduparamba</option>
                    <option value="Westhill">Westhill</option>
                    <option value="Balussery">Balussery</option>
                    <option value="Kottooli">Kottooli</option>
                    <option value="Parambilbazar">Parambilbazar</option>
                    <option value="Bournemouth, UK">Bournemouth, UK</option>
                  </>
                )}
              </select>
            </div>
          </div>

          <div>
            <label
              htmlFor="danceStyle"
              className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-2"
            >
              Preferred Dance Style
            </label>
            <select
              id="danceStyle"
              value={formData.danceStyle}
              onChange={(e) =>
                setFormData({ ...formData, danceStyle: e.target.value })
              }
              className="w-full rounded-2xl bg-neutral-900 border border-white/[0.08] px-4 py-3.5 text-sm text-white focus:outline-none focus:border-dk-yellow/50 transition-all duration-300 font-light"
            >
              <option value="All Styles / General">All Styles / General Training</option>
              {effectiveStyles.map((style) => (
                <option key={style.slug || (style as any)._id || style.name} value={style.name}>
                  {style.name}
                </option>
              ))}
              <option value="Special Choreography">Special Choreography Project</option>
              <option value="Acrobatics & Flexibility">Acrobatics & Flexibility</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="message"
              className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-2"
            >
              Message / Specific Requirements
            </label>
            <textarea
              id="message"
              rows={4}
              value={formData.message}
              onChange={(e) =>
                setFormData({ ...formData, message: e.target.value })
              }
              placeholder="Tell us about your dance goals, schedule preferences, or questions..."
              className="w-full rounded-2xl bg-white/[0.03] border border-white/[0.08] px-4 py-3.5 text-sm text-white focus:outline-none focus:border-dk-yellow/50 focus:bg-white/[0.06] transition-all duration-300 placeholder:text-neutral-500 resize-none font-light"
            />
          </div>

          <button
            type="submit"
            disabled={status === "loading"}
            className="w-full py-4 rounded-full bg-white text-black hover:bg-dk-yellow hover:shadow-[0_0_25px_rgba(255,215,0,0.25)] font-heading font-light text-xs uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 group disabled:opacity-50 active:scale-[0.99]"
          >
            {status === "loading" ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Submitting Enquiry...</span>
              </>
            ) : (
              <>
                <span>Submit Admission Enquiry</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
}
