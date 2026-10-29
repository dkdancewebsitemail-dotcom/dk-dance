"use client";

import React, { useState, useEffect } from "react";
import {
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowRight,
  MessageCircle,
  ExternalLink,
} from "lucide-react";
import { Branch, DanceStyle } from "@/types";
import { DANCE_STYLES } from "@/lib/constants";
import { useToast } from "@/context/ToastContext";

interface ContactFormProps {
  branches?: Branch[];
  danceStyles?: DanceStyle[];
  defaultBranch?: string;
  defaultMode?: "offline" | "online";
}

const TARGET_WHATSAPP_NUMBER = "919995272083";

function generateWhatsAppUrl(data: {
  name: string;
  phone: string;
  email: string;
  age?: string;
  mode: "offline" | "online";
  branch: string;
  danceStyle: string;
  message?: string;
}): string {
  const modeText =
    data.mode === "online" ? "Online Digital Classes" : "Studio Offline Classes";

  const messageLines = [
    "🌟 *NEW ADMISSION ENQUIRY - DK DANCE COMPANY*",
    "──────────────────────────",
    `👤 *Student / Parent Name:* ${data.name.trim()}`,
    `📞 *Phone / WhatsApp:* ${data.phone.trim()}`,
    `✉️ *Email Address:* ${data.email.trim()}`,
    ...(data.age && data.age.trim() ? [`🎂 *Student Age:* ${data.age.trim()}`] : []),
    `🎓 *Training Mode:* ${modeText}`,
    `📍 *Preferred Branch:* ${data.branch}`,
    `💃 *Dance Style:* ${data.danceStyle}`,
    ...(data.message && data.message.trim()
      ? [
          "──────────────────────────",
          `💬 *Message / Requirements:*`,
          data.message.trim(),
        ]
      : []),
    "──────────────────────────",
    "🌐 _Submitted via DK Dance Company Website Form_",
  ];

  const fullMessage = messageLines.join("\n");
  return `https://wa.me/${TARGET_WHATSAPP_NUMBER}?text=${encodeURIComponent(fullMessage)}`;
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
  const [whatsappRedirectUrl, setWhatsappRedirectUrl] = useState<string>("");
  const [lastSubmitted, setLastSubmitted] = useState<typeof formData | null>(null);

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

    // 1. Build the WhatsApp URL with all autofilled form details
    const waUrl = generateWhatsAppUrl(formData);
    setWhatsappRedirectUrl(waUrl);
    setLastSubmitted({ ...formData });

    // 2. Open WhatsApp in a new window/tab immediately
    try {
      if (typeof window !== "undefined") {
        window.open(waUrl, "_blank", "noopener,noreferrer");
      }
    } catch (openErr) {
      console.warn("Direct WhatsApp popup was blocked by browser:", openErr);
    }

    // 3. Save enquiry into database so admin retains a lead record
    try {
      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        console.warn("Enquiry DB save warning:", data.error);
      }
    } catch (err: any) {
      console.warn("Failed to persist enquiry in DB:", err);
    }

    setStatus("success");
    toast.success("Enquiry received! Opening WhatsApp (+91 99952 72083)...");
  };

  return (
    <div className="rounded-3xl glass-panel border border-white/[0.08] bg-white/[0.02] p-5 sm:p-8 md:p-12 shadow-2xl">
      {status === "success" ? (
        <div className="py-6 sm:py-10 text-center flex flex-col items-center max-w-xl mx-auto">
          {/* Animated WhatsApp Success Icon */}
          <div className="w-16 h-16 rounded-full bg-[#25D366]/15 text-[#25D366] flex items-center justify-center mb-5 border border-[#25D366]/30 shadow-[0_0_30px_rgba(37,211,102,0.25)]">
            <CheckCircle2 className="w-8 h-8 text-[#25D366]" />
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#25D366]/10 border border-[#25D366]/25 text-[#25D366] text-[11px] font-mono uppercase tracking-widest mb-3">
            <MessageCircle className="w-3.5 h-3.5" />
            <span>DETAILS FORMATTED FOR WHATSAPP</span>
          </div>

          <h3 className="text-2xl sm:text-3xl font-heading font-light uppercase tracking-tight text-white mb-3">
            Enquiry Registered
          </h3>

          <p className="text-sm text-neutral-300 leading-relaxed mb-6 font-light max-w-md">
            Your admission enquiry has been saved and directed to Director Dhanesh
            Krishnan via WhatsApp (
            <strong className="text-white font-mono">+91 99952 72083</strong>
            ).
          </p>

          {/* Prominent WhatsApp Redirect Button */}
          {whatsappRedirectUrl && (
            <a
              href={whatsappRedirectUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-black font-heading font-semibold text-xs sm:text-sm uppercase tracking-widest transition-all duration-300 shadow-[0_0_35px_rgba(37,211,102,0.35)] hover:scale-105 active:scale-95 mb-8"
            >
              <MessageCircle className="w-4 h-4 fill-black" />
              <span>Continue to WhatsApp (+91 99952 72083)</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-80" />
            </a>
          )}

          {/* Autofilled Details Summary Card */}
          {lastSubmitted && (
            <div className="w-full text-left p-5 sm:p-6 rounded-2xl bg-white/[0.03] border border-white/[0.08] text-xs font-mono mb-8 space-y-2.5">
              <div className="text-[11px] uppercase tracking-wider text-dk-yellow pb-2 border-b border-white/[0.08] flex items-center justify-between">
                <span>Autofilled Message Preview:</span>
                <span className="text-neutral-500 font-normal">Desk: 9995272083</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/[0.04]">
                <span className="text-neutral-400">Name:</span>
                <span className="text-white font-sans">{lastSubmitted.name}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/[0.04]">
                <span className="text-neutral-400">Phone:</span>
                <span className="text-white">{lastSubmitted.phone}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/[0.04]">
                <span className="text-neutral-400">Email:</span>
                <span className="text-neutral-300">{lastSubmitted.email}</span>
              </div>
              {lastSubmitted.age && (
                <div className="flex justify-between py-1 border-b border-white/[0.04]">
                  <span className="text-neutral-400">Age:</span>
                  <span className="text-white">{lastSubmitted.age}</span>
                </div>
              )}
              <div className="flex justify-between py-1 border-b border-white/[0.04]">
                <span className="text-neutral-400">Branch:</span>
                <span className="text-dk-yellow">{lastSubmitted.branch}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-neutral-400">Style & Mode:</span>
                <span className="text-white">
                  {lastSubmitted.danceStyle} • {lastSubmitted.mode === "online" ? "Online" : "Studio Offline"}
                </span>
              </div>
            </div>
          )}

          <button
            onClick={() => {
              setStatus("idle");
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
            }}
            className="text-xs font-mono uppercase tracking-widest text-neutral-400 underline underline-offset-4 hover:text-white transition-colors cursor-pointer"
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
                className="w-full rounded-2xl bg-neutral-900 border border-white/[0.08] px-4 py-3.5 text-sm text-white focus:outline-none focus:border-dk-yellow/50 transition-all duration-300 font-light cursor-pointer"
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
                className="w-full rounded-2xl bg-neutral-900 border border-white/[0.08] px-4 py-3.5 text-sm text-white focus:outline-none focus:border-dk-yellow/50 transition-all duration-300 font-light cursor-pointer"
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
              className="w-full rounded-2xl bg-neutral-900 border border-white/[0.08] px-4 py-3.5 text-sm text-white focus:outline-none focus:border-dk-yellow/50 transition-all duration-300 font-light cursor-pointer"
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

          {/* Submit Button with direct WhatsApp Indicator */}
          <button
            type="submit"
            disabled={status === "loading"}
            className="w-full py-4 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-black hover:shadow-[0_0_30px_rgba(37,211,102,0.35)] font-heading font-semibold text-xs sm:text-sm uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2.5 group disabled:opacity-50 active:scale-[0.99] cursor-pointer"
          >
            {status === "loading" ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-black" />
                <span>Redirecting to WhatsApp (+91 99952 72083)...</span>
              </>
            ) : (
              <>
                <MessageCircle className="w-4 h-4 fill-black" />
                <span>Submit & Send on WhatsApp</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
}
