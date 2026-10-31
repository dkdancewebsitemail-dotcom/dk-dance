"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Banknote,
  Plus,
  Trash2,
  Edit2,
  ExternalLink,
  Loader2,
  Save,
  RotateCcw,
  MessageCircle,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  Users,
  Info,
} from "lucide-react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { Modal } from "@/components/ui/Modal";
import { SiteSettings, ClassBatch } from "@/types";
import { DEFAULT_CLASS_BATCHES, INITIAL_SITE_SETTINGS } from "@/lib/constants";
import { useToast } from "@/context/ToastContext";
import { adminFetch } from "@/lib/admin-fetch";

export default function AdminClassesFeesPage() {
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Fee Structure State
  const [fees, setFees] = useState({
    admissionFee: "₹1,000",
    weeklyOneClassFee: "₹500 / month",
    weeklyTwoClassesFee: "₹800 / month",
    disclaimer:
      "Fees and schedules may vary by branch, program, or special training course. Students should confirm the applicable fee and timetable with the respective branch before admission.",
    paymentNote:
      "Monthly fees should be paid on or before the 10th of every month.",
  });

  // WhatsApp Number State
  const [whatsapp, setWhatsapp] = useState("919995272083");

  // Batches State
  const [batches, setBatches] = useState<ClassBatch[]>(DEFAULT_CLASS_BATCHES);

  // Modal State for adding/editing a batch
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [batchFormData, setBatchFormData] = useState<ClassBatch>({
    id: "",
    group: "",
    ageRange: "",
    badge: "Foundation Level",
    focus: "",
    timings: "",
    highlights: [""],
  });
  const [deleteTargetIndex, setDeleteTargetIndex] = useState<number | null>(null);

  // Fetch current settings on mount
  useEffect(() => {
    let isMounted = true;
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const res = await adminFetch("/api/settings");
        if (!res.ok) throw new Error("Failed to load settings");
        const data = await res.json();
        if (isMounted && data.success && data.data) {
          const s: SiteSettings = data.data;
          if (s.fees) {
            setFees({
              admissionFee: s.fees.admissionFee || "₹1,000",
              weeklyOneClassFee: s.fees.weeklyOneClassFee || "₹500 / month",
              weeklyTwoClassesFee: s.fees.weeklyTwoClassesFee || "₹800 / month",
              disclaimer:
                s.fees.disclaimer ||
                "Fees and schedules may vary by branch, program, or special training course. Students should confirm the applicable fee and timetable with the respective branch before admission.",
              paymentNote:
                s.fees.paymentNote ||
                "Monthly fees should be paid on or before the 10th of every month.",
            });
          }
          if (s.contact?.whatsapp) {
            setWhatsapp(s.contact.whatsapp);
          }
          if (s.classBatches && Array.isArray(s.classBatches) && s.classBatches.length > 0) {
            setBatches(s.classBatches);
          }
        }
      } catch (err: any) {
        console.error("Failed to load classes & fees data:", err);
        toast.error("Could not load current classes and fees settings.");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchSettings();
    return () => {
      isMounted = false;
    };
  }, []);

  // Save all changes to MongoDB
  const handleSaveAll = async () => {
    setSaving(true);
    try {
      const payload: Partial<SiteSettings> = {
        fees,
        classBatches: batches,
        contact: {
          whatsapp: whatsapp.trim(),
        } as any,
      };

      const res = await adminFetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to update Classes & Fees");
      }

      toast.success("Classes & Fees updated successfully! Changes are live on the website.");
    } catch (err: any) {
      console.error("Save error:", err);
      toast.error(err.message || "Failed to save settings.");
    } finally {
      setSaving(false);
    }
  };

  // Open modal for creating a new batch
  const handleOpenAddBatch = () => {
    setEditingIndex(null);
    setBatchFormData({
      id: `batch-${Date.now()}`,
      group: "",
      ageRange: "",
      badge: "Foundation Level",
      focus: "",
      timings: "",
      highlights: [""],
    });
    setIsModalOpen(true);
  };

  // Open modal for editing an existing batch
  const handleOpenEditBatch = (index: number) => {
    setEditingIndex(index);
    const target = batches[index];
    setBatchFormData({
      ...target,
      highlights: target.highlights && target.highlights.length > 0 ? [...target.highlights] : [""],
    });
    setIsModalOpen(true);
  };

  // Save batch from modal
  const handleSaveBatchModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!batchFormData.group.trim()) {
      toast.warning("Please provide a batch group name.");
      return;
    }

    const cleanHighlights = batchFormData.highlights.map((h) => h.trim()).filter(Boolean);

    const updatedBatch: ClassBatch = {
      ...batchFormData,
      group: batchFormData.group.trim(),
      ageRange: batchFormData.ageRange.trim(),
      badge: batchFormData.badge.trim(),
      focus: batchFormData.focus.trim(),
      timings: batchFormData.timings.trim(),
      highlights: cleanHighlights.length > 0 ? cleanHighlights : ["Structured foundational training"],
    };

    if (editingIndex !== null) {
      // Update existing
      const next = [...batches];
      next[editingIndex] = updatedBatch;
      setBatches(next);
      toast.info(`Updated batch: ${updatedBatch.group}. Remember to click "Save & Publish".`);
    } else {
      // Add new
      setBatches([...batches, updatedBatch]);
      toast.info(`Added batch: ${updatedBatch.group}. Remember to click "Save & Publish".`);
    }

    setIsModalOpen(false);
  };

  // Confirm delete batch
  const handleConfirmDeleteBatch = () => {
    if (deleteTargetIndex === null) return;
    const next = batches.filter((_, idx) => idx !== deleteTargetIndex);
    setBatches(next);
    setDeleteTargetIndex(null);
    toast.info('Batch removed. Remember to click "Save & Publish" to update live site.');
  };

  // Reset to official defaults
  const handleResetToDefaults = () => {
    if (confirm("Reset Classes, Fees & Batches to official defaults? (You must click Save & Publish afterwards to apply).")) {
      setFees({ ...INITIAL_SITE_SETTINGS.fees });
      setBatches([...DEFAULT_CLASS_BATCHES]);
      toast.info("Reset to default curriculum & fee structure. Click Save & Publish to save.");
    }
  };

  const cleanWhatsapp = (whatsapp || "").replace(/[^0-9]/g, "") || "919995272083";

  if (loading) {
    return (
      <div className="py-24 text-center">
        <Loader2 className="w-8 h-8 animate-spin mx-auto text-dk-yellow mb-3" />
        <p className="text-xs font-mono text-neutral-500 uppercase tracking-wider">
          Loading Classes & Tuition Rates...
        </p>
      </div>
    );
  }

  return (
    <>
      <AdminHeader
        title="Classes & Fees Management"
        subtitle="Configure tuition schedules, registration rates, payment policies, training batches, and admission WhatsApp routing"
      >
        <div className="flex items-center gap-3">
          <Link
            href="/classes"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-neutral-900 border border-neutral-800 text-xs font-mono uppercase text-neutral-300 hover:text-white hover:border-neutral-700 transition-colors"
          >
            <span>View Public Page</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <button
            onClick={handleSaveAll}
            disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-2 bg-dk-yellow text-black text-xs font-heading font-semibold uppercase tracking-wider hover:bg-yellow-400 transition-all shadow-[0_0_15px_rgba(255,200,0,0.2)] disabled:opacity-50 cursor-pointer active:scale-95"
          >
            {saving ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" />
                <span>Save & Publish</span>
              </>
            )}
          </button>
        </div>
      </AdminHeader>

      <main className="p-4 sm:p-6 lg:p-8 space-y-8 flex-1 max-w-7xl">
        {/* SECTION 1: WHATSAPP NUMBER CONFIGURATION (Addresses Requirement 2 directly) */}
        <div className="p-6 sm:p-8 bg-neutral-950 border border-neutral-800 rounded-2xl relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-neutral-800/80">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#25D366]/10 text-[#25D366] flex items-center justify-center border border-[#25D366]/20">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-heading font-light uppercase tracking-wide text-white">
                  Admission Enquiry WhatsApp Destination
                </h2>
                <p className="text-xs text-neutral-400 font-light">
                  The phone number that receives all form submissions from the website & powers the &quot;Submit & Send on WhatsApp&quot; button.
                </p>
              </div>
            </div>

            <a
              href={`https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent("Test WhatsApp configuration from DK Dance Company admin panel.")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-[11px] font-mono text-[#25D366] uppercase tracking-wider transition-colors shrink-0"
            >
              <span>Test Current Link</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div>
              <label className="block text-xs font-mono uppercase text-neutral-300 mb-2">
                WhatsApp Phone Number (With Country Code)
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="e.g. 919995272083"
                  className="w-full bg-black border border-neutral-700 focus:border-dk-yellow px-4 py-3 text-sm text-white font-mono rounded-xl focus:outline-none transition-colors"
                />
              </div>
              <p className="text-[11px] text-neutral-500 font-mono mt-2">
                Enter clean digits with country code (e.g., <span className="text-dk-yellow">919995272083</span> or <span className="text-dk-yellow">919567272083</span>). No spaces or + symbols needed.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-start gap-3">
              <Info className="w-4 h-4 text-dk-yellow shrink-0 mt-0.5" />
              <div className="text-xs text-neutral-400 leading-relaxed space-y-1 font-light">
                <p className="text-white font-mono text-[11px] uppercase tracking-wider">
                  Live Preview on Forms:
                </p>
                <p>
                  Button label will display:{" "}
                  <strong className="text-dk-yellow font-mono">
                    Submit & Send on WhatsApp ({cleanWhatsapp.length === 12 && cleanWhatsapp.startsWith("91") ? cleanWhatsapp.slice(2) : cleanWhatsapp})
                  </strong>
                </p>
                <p>
                  When user submits any enquiry form, it will autofill their complete details and open chat with +{cleanWhatsapp}.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2: TUITION & FEE STRUCTURE CARDS */}
        <div className="p-6 sm:p-8 bg-neutral-950 border border-neutral-800 rounded-2xl space-y-6">
          <div className="flex items-center justify-between gap-4 pb-4 border-b border-neutral-800/80">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-dk-yellow/10 text-dk-yellow flex items-center justify-center border border-dk-yellow/20">
                <Banknote className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-heading font-light uppercase tracking-wide text-white">
                  Tuition & Admission Fee Rates
                </h2>
                <p className="text-xs text-neutral-400 font-light">
                  Edit the 3 pricing tiers displayed on the public Classes & Fees section.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleResetToDefaults}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-400 hover:text-white rounded-lg text-xs font-mono uppercase transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span className="hidden sm:inline">Reset Defaults</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: Admission */}
            <div className="p-5 bg-black border border-neutral-800 rounded-xl space-y-4 hover:border-neutral-700 transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-500">
                  Tier 01 // Registration
                </span>
                <span className="text-[10px] font-mono text-neutral-400 px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800">
                  One-time
                </span>
              </div>
              <div>
                <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                  Admission Fee Title
                </label>
                <div className="text-sm font-heading font-light uppercase text-white mb-3">
                  Admission Fee
                </div>
                <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                  Fee Amount Display
                </label>
                <input
                  type="text"
                  value={fees.admissionFee}
                  onChange={(e) => setFees({ ...fees, admissionFee: e.target.value })}
                  placeholder="e.g. ₹1,000"
                  className="w-full bg-neutral-900 border border-neutral-700 focus:border-dk-yellow px-3 py-2 text-sm text-white font-mono rounded-lg focus:outline-none"
                />
              </div>
              <p className="text-[11px] text-neutral-500 font-light">
                Displayed under Enrollment with subtitle &quot;One-time registration and institutional admission fee upon joining.&quot;
              </p>
            </div>

            {/* Card 2: 1 Class Weekly */}
            <div className="p-5 bg-black border border-dk-yellow/30 rounded-xl space-y-4 hover:border-dk-yellow/60 transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-widest text-dk-yellow">
                  Tier 02 // Foundational
                </span>
                <span className="text-[10px] font-mono text-dk-yellow px-2 py-0.5 rounded bg-dk-yellow/10 border border-dk-yellow/20">
                  Monthly
                </span>
              </div>
              <div>
                <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                  Track Title
                </label>
                <div className="text-sm font-heading font-light uppercase text-white mb-3">
                  1 Class / Week
                </div>
                <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                  Monthly Fee Display
                </label>
                <input
                  type="text"
                  value={fees.weeklyOneClassFee}
                  onChange={(e) => setFees({ ...fees, weeklyOneClassFee: e.target.value })}
                  placeholder="e.g. ₹500 / month"
                  className="w-full bg-neutral-900 border border-neutral-700 focus:border-dk-yellow px-3 py-2 text-sm text-white font-mono rounded-lg focus:outline-none"
                />
              </div>
              <p className="text-[11px] text-neutral-500 font-light">
                Foundational Track: 1 class per week for beginners and students balancing school routines.
              </p>
            </div>

            {/* Card 3: 2 Classes Weekly */}
            <div className="p-5 bg-black border border-dk-red/40 rounded-xl space-y-4 hover:border-dk-red transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-widest text-dk-red">
                  Tier 03 // Performance
                </span>
                <span className="text-[10px] font-mono text-dk-red px-2 py-0.5 rounded bg-dk-red/10 border border-dk-red/20">
                  Recommended
                </span>
              </div>
              <div>
                <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                  Track Title
                </label>
                <div className="text-sm font-heading font-light uppercase text-white mb-3">
                  2 Classes / Week
                </div>
                <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                  Monthly Fee Display
                </label>
                <input
                  type="text"
                  value={fees.weeklyTwoClassesFee}
                  onChange={(e) => setFees({ ...fees, weeklyTwoClassesFee: e.target.value })}
                  placeholder="e.g. ₹800 / month"
                  className="w-full bg-neutral-900 border border-neutral-700 focus:border-dk-yellow px-3 py-2 text-sm text-white font-mono rounded-lg focus:outline-none"
                />
              </div>
              <p className="text-[11px] text-neutral-500 font-light">
                Performance Track: 2 classes per week for accelerated growth, stagecraft, and choreography retention.
              </p>
            </div>
          </div>

          {/* Payment Notes & Policy Texts */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-neutral-800">
            <div>
              <label className="block text-xs font-mono uppercase text-neutral-300 mb-2">
                Monthly Due Date Notice (Highlighted)
              </label>
              <input
                type="text"
                value={fees.paymentNote}
                onChange={(e) => setFees({ ...fees, paymentNote: e.target.value })}
                placeholder="e.g. Monthly fees should be paid on or before the 10th of every month."
                className="w-full bg-black border border-neutral-700 focus:border-dk-yellow px-3 py-2.5 text-xs text-white rounded-xl focus:outline-none"
              />
              <span className="text-[11px] text-neutral-500 font-mono mt-1 block">
                Displayed in bold gold text below fee cards.
              </span>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-neutral-300 mb-2">
                Branch & Program Disclaimer Note
              </label>
              <textarea
                rows={3}
                value={fees.disclaimer}
                onChange={(e) => setFees({ ...fees, disclaimer: e.target.value })}
                placeholder="Fees and schedules may vary by branch..."
                className="w-full bg-black border border-neutral-700 focus:border-dk-yellow px-3 py-2 text-xs text-white rounded-xl focus:outline-none resize-none"
              />
              <span className="text-[11px] text-neutral-500 font-mono mt-1 block">
                Official branch policy statement.
              </span>
            </div>
          </div>
        </div>

        {/* SECTION 3: STUDENT TRAINING BATCHES MANAGER */}
        <div className="p-6 sm:p-8 bg-neutral-950 border border-neutral-800 rounded-2xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-800/80">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/[0.05] text-white flex items-center justify-center border border-white/10">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-heading font-light uppercase tracking-wide text-white">
                  Student Training Batches ({batches.length})
                </h2>
                <p className="text-xs text-neutral-400 font-light">
                  Manage the age groups, schedule timings, and syllabus highlights shown on the Classes page.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleOpenAddBatch}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white text-black hover:bg-dk-yellow text-xs font-mono uppercase tracking-wider rounded-lg transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Batch</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {batches.map((batch, index) => (
              <div
                key={batch.id || `batch-${index}`}
                className="p-6 bg-black border border-neutral-800 hover:border-neutral-700 rounded-2xl flex flex-col justify-between transition-all duration-300 shadow-lg group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-dk-yellow">
                      {batch.ageRange || "All Ages"}
                    </span>
                    <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-white/[0.05] border border-white/10 text-neutral-300 uppercase">
                      {batch.badge || "Track"}
                    </span>
                  </div>

                  <h3 className="text-lg font-heading font-light uppercase text-white mb-2 group-hover:text-dk-yellow transition-colors">
                    {batch.group}
                  </h3>

                  <p className="text-xs text-neutral-400 font-light leading-relaxed mb-4 line-clamp-3">
                    {batch.focus}
                  </p>

                  <div className="space-y-1.5 mb-6 pt-3 border-t border-white/[0.06]">
                    <span className="text-[10px] font-mono uppercase text-neutral-500 block mb-1">
                      Key Highlights:
                    </span>
                    {(batch.highlights || []).map((h, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-neutral-300 font-light">
                        <CheckCircle2 className="w-3 h-3 text-dk-yellow shrink-0 mt-0.5" />
                        <span className="line-clamp-1">{h}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-neutral-800 flex items-center justify-between gap-2 text-xs font-mono">
                  <span className="text-[11px] text-neutral-400 truncate flex items-center gap-1.5">
                    <Clock className="w-3 h-3 text-neutral-500 shrink-0" />
                    <span className="truncate">{batch.timings}</span>
                  </span>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleOpenEditBatch(index)}
                      className="p-1.5 hover:text-dk-yellow text-neutral-400 hover:bg-white/[0.05] rounded transition-colors"
                      title="Edit Batch"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteTargetIndex(index)}
                      className="p-1.5 hover:text-dk-red text-neutral-400 hover:bg-white/[0.05] rounded transition-colors"
                      title="Delete Batch"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* BATCH ADD/EDIT MODAL */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingIndex !== null ? "Edit Training Batch" : "Create New Training Batch"}
      >
        <form onSubmit={handleSaveBatchModal} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                Batch Name / Group <span className="text-dk-red">*</span>
              </label>
              <input
                type="text"
                required
                value={batchFormData.group}
                onChange={(e) => setBatchFormData({ ...batchFormData, group: e.target.value })}
                placeholder="e.g. Juniors / Kids Batch"
                className="w-full bg-neutral-900 border border-neutral-800 focus:border-dk-yellow px-3 py-2 text-xs text-white rounded focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                Age Range <span className="text-dk-red">*</span>
              </label>
              <input
                type="text"
                required
                value={batchFormData.ageRange}
                onChange={(e) => setBatchFormData({ ...batchFormData, ageRange: e.target.value })}
                placeholder="e.g. Ages 4 – 12"
                className="w-full bg-neutral-900 border border-neutral-800 focus:border-dk-yellow px-3 py-2 text-xs text-white rounded focus:outline-none font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                Badge / Track Level
              </label>
              <input
                type="text"
                value={batchFormData.badge}
                onChange={(e) => setBatchFormData({ ...batchFormData, badge: e.target.value })}
                placeholder="e.g. Foundation Level, Intermediate / Advanced"
                className="w-full bg-neutral-900 border border-neutral-800 focus:border-dk-yellow px-3 py-2 text-xs text-white rounded focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                Schedule Timings
              </label>
              <input
                type="text"
                value={batchFormData.timings}
                onChange={(e) => setBatchFormData({ ...batchFormData, timings: e.target.value })}
                placeholder="e.g. Weekend mornings & weekday evening batches"
                className="w-full bg-neutral-900 border border-neutral-800 focus:border-dk-yellow px-3 py-2 text-xs text-white rounded focus:outline-none font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
              Curriculum Focus & Objective
            </label>
            <textarea
              rows={3}
              value={batchFormData.focus}
              onChange={(e) => setBatchFormData({ ...batchFormData, focus: e.target.value })}
              placeholder="Describe the training focus, body conditioning, or dance styles practiced..."
              className="w-full bg-neutral-900 border border-neutral-800 focus:border-dk-yellow px-3 py-2 text-xs text-white rounded focus:outline-none resize-none font-light"
            />
          </div>

          {/* Highlights List */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-mono uppercase text-neutral-400">
                Key Highlights / Bullet Points
              </label>
              <button
                type="button"
                onClick={() => setBatchFormData({
                  ...batchFormData,
                  highlights: [...batchFormData.highlights, ""],
                })}
                className="text-[11px] font-mono uppercase text-dk-yellow hover:text-white transition-colors"
              >
                + Add Point
              </button>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {batchFormData.highlights.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => {
                      const next = [...batchFormData.highlights];
                      next[idx] = e.target.value;
                      setBatchFormData({ ...batchFormData, highlights: next });
                    }}
                    placeholder={`Highlight point ${idx + 1}`}
                    className="flex-1 bg-neutral-900 border border-neutral-800 focus:border-dk-yellow px-3 py-1.5 text-xs text-white rounded focus:outline-none"
                  />
                  {batchFormData.highlights.length > 1 && (
                    <button
                      type="button"
                      onClick={() => {
                        const next = batchFormData.highlights.filter((_, i) => i !== idx);
                        setBatchFormData({ ...batchFormData, highlights: next });
                      }}
                      className="p-1.5 text-neutral-500 hover:text-dk-red transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-neutral-800 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 border border-neutral-800 text-xs font-mono uppercase text-neutral-400 hover:text-white rounded transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-dk-yellow text-black text-xs font-heading font-semibold uppercase tracking-wider hover:bg-yellow-400 rounded transition-colors"
            >
              {editingIndex !== null ? "Apply Changes" : "Create Batch"}
            </button>
          </div>
        </form>
      </Modal>

      {/* CONFIRM DELETE MODAL */}
      <ConfirmDialog
        isOpen={deleteTargetIndex !== null}
        onCancel={() => setDeleteTargetIndex(null)}
        onConfirm={handleConfirmDeleteBatch}
        title="Delete Batch"
        message={`Are you sure you want to remove this batch? You can re-add it or reset to default anytime.`}
        confirmText="Delete Batch"
        isDestructive={true}
      />
    </>
  );
}
