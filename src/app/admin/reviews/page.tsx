"use client";

import React, { useState, useEffect } from "react";
import {
  Star,
  Plus,
  Trash2,
  Edit2,
  Eye,
  EyeOff,
  Loader2,
  Check,
  AlertCircle,
  MessageSquare,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { Modal } from "@/components/ui/Modal";
import { ReviewItem } from "@/types";
import { useToast } from "@/context/ToastContext";
import { adminFetch } from "@/lib/admin-fetch";
import { ExpandableText } from "@/components/ui/ExpandableText";

const GOOGLE_COLORS = [
  "bg-[#EA4335]", // Google Red
  "bg-[#4285F4]", // Google Blue
  "bg-[#34A853]", // Google Green
  "bg-[#FBBC05] text-neutral-900 font-medium", // Google Yellow
  "bg-[#9C27B0]", // Google Purple
  "bg-[#009688]", // Google Teal
];

export default function AdminReviewsPage() {
  const toast = useToast();
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<"all" | "published" | "draft">("all");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ReviewItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ReviewItem | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [formError, setFormError] = useState("");

  const [formData, setFormData] = useState<{
    author: string;
    avatarLetter: string;
    avatarBg: string;
    badge: string;
    rating: number;
    timeAgo: string;
    text: string;
    published: boolean;
    displayOrder: number;
  }>({
    author: "",
    avatarLetter: "A",
    avatarBg: GOOGLE_COLORS[0],
    badge: "Verified Student",
    rating: 5,
    timeAgo: "Recently",
    text: "",
    published: true,
    displayOrder: 1,
  });

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await adminFetch("/api/reviews?all=true");
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setReviews(
          [...data.data].sort(
            (a, b) => (Number(a.displayOrder) || 1) - (Number(b.displayOrder) || 1)
          )
        );
      }
    } catch (err) {
      console.error("Failed to load reviews:", err);
      toast.error("Failed to load customer reviews. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleOpenAdd = () => {
    setFormError("");
    setEditingItem(null);
    setFormData({
      author: "",
      avatarLetter: "A",
      avatarBg: GOOGLE_COLORS[Math.floor(Math.random() * GOOGLE_COLORS.length)],
      badge: "Local Guide • Verified Student",
      rating: 5,
      timeAgo: "Recently",
      text: "",
      published: true,
      displayOrder: reviews.length + 1,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: ReviewItem) => {
    setFormError("");
    setEditingItem(item);
    setFormData({
      author: item.author,
      avatarLetter: item.avatarLetter || (item.author ? item.author[0].toUpperCase() : "G"),
      avatarBg: item.avatarBg || GOOGLE_COLORS[0],
      badge: item.badge || "Verified Student",
      rating: item.rating || 5,
      timeAgo: item.timeAgo || "Recently",
      text: item.text,
      published: item.published !== false,
      displayOrder: item.displayOrder || 1,
    });
    setIsModalOpen(true);
  };

  const handleSaveReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.author.trim() || !formData.text.trim()) {
      setFormError("Please enter both the reviewer's name and their review testimonial.");
      return;
    }

    setActionLoading(true);
    setFormError("");

    try {
      const payload = {
        ...formData,
        avatarLetter: formData.author.trim()[0].toUpperCase(),
      };

      if (editingItem && editingItem._id) {
        const res = await adminFetch(`/api/reviews/${editingItem._id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || "Update failed");
        }
        toast.success(`Review by "${formData.author}" updated successfully.`);
      } else {
        const res = await adminFetch("/api/reviews", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || "Creation failed");
        }
        toast.success(`New Google review by "${formData.author}" added.`);
      }

      setIsModalOpen(false);
      setEditingItem(null);
      await fetchReviews();
    } catch (err: any) {
      const msg = err.message || "Failed to save review.";
      setFormError(msg);
      toast.error(msg);
    } finally {
      setActionLoading(false);
    }
  };

  const handleTogglePublish = async (item: ReviewItem) => {
    if (!item._id) return;
    const nextState = !item.published;
    try {
      const res = await adminFetch(`/api/reviews/${item._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ published: nextState }),
      });
      if (res.ok) {
        setReviews((prev) =>
          prev.map((r) => (r._id === item._id ? { ...r, published: nextState } : r))
        );
        toast.info(
          nextState
            ? `Review by "${item.author}" is now live on the public site.`
            : `Review by "${item.author}" moved to drafts.`
        );
      } else {
        toast.error("Failed to update review status.");
      }
    } catch (err) {
      console.error("Failed to toggle publish:", err);
      toast.error("Network error while updating status.");
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget || !deleteTarget._id) return;
    setActionLoading(true);
    try {
      const res = await adminFetch(`/api/reviews/${deleteTarget._id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setReviews((prev) => prev.filter((r) => r._id !== deleteTarget._id));
        toast.success(`Review by "${deleteTarget.author}" deleted.`);
        setDeleteTarget(null);
      } else {
        throw new Error("Failed to delete review");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to delete review");
    } finally {
      setActionLoading(false);
    }
  };

  const filteredReviews = reviews.filter((r) => {
    if (activeFilter === "published") return r.published !== false;
    if (activeFilter === "draft") return r.published === false;
    return true;
  });

  return (
    <>
      <AdminHeader
        title="Google Reviews & Testimonials"
        subtitle="Manage verified student and parent reviews shown on the homepage and reviews showcase"
      >
        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-black hover:bg-dk-yellow font-heading font-light text-xs uppercase tracking-widest transition-colors shadow-lg active:scale-95 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Google Review</span>
        </button>
      </AdminHeader>

      <main className="p-4 sm:p-6 lg:p-8 space-y-6 flex-1">
        {/* KPI / Metric Chips */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4">
          <div className="p-4 bg-neutral-950 border border-neutral-800">
            <span className="text-[10px] font-mono uppercase text-neutral-400 block mb-1">
              Total Reviews
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-heading font-light text-white">
                {reviews.length}
              </span>
              <span className="text-[11px] font-mono text-neutral-500">Recorded</span>
            </div>
          </div>

          <div className="p-4 bg-neutral-950 border border-neutral-800">
            <span className="text-[10px] font-mono uppercase text-[#25D366] block mb-1">
              Live on Site
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-heading font-light text-white">
                {reviews.filter((r) => r.published !== false).length}
              </span>
              <span className="text-[11px] font-mono text-neutral-500">Public</span>
            </div>
          </div>

          <div className="p-4 bg-neutral-950 border border-neutral-800">
            <span className="text-[10px] font-mono uppercase text-dk-yellow block mb-1">
              Average Rating
            </span>
            <div className="flex items-center gap-1.5">
              <span className="text-2xl font-heading font-light text-white">
                5.0
              </span>
              <div className="flex text-[#FBBC05]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-[#FBBC05]" />
                ))}
              </div>
            </div>
          </div>

          <div className="p-4 bg-neutral-950 border border-neutral-800">
            <span className="text-[10px] font-mono uppercase text-neutral-400 block mb-1">
              Drafts (Hidden)
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-heading font-light text-white">
                {reviews.filter((r) => r.published === false).length}
              </span>
              <span className="text-[11px] font-mono text-neutral-500">Unpublished</span>
            </div>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex items-center justify-between gap-4 flex-wrap pb-2 border-b border-neutral-900">
          <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto">
            {[
              { id: "all", label: "All Reviews", count: reviews.length },
              {
                id: "published",
                label: "Published (Live)",
                count: reviews.filter((r) => r.published !== false).length,
              },
              {
                id: "draft",
                label: "Drafts",
                count: reviews.filter((r) => r.published === false).length,
              },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id as any)}
                className={`px-3.5 py-2 text-xs font-mono uppercase tracking-wider transition-colors flex items-center gap-2 cursor-pointer min-h-[38px] ${
                  activeFilter === tab.id
                    ? "bg-white text-black font-semibold"
                    : "bg-neutral-900 text-neutral-400 hover:text-white"
                }`}
              >
                <span>{tab.label}</span>
                <span className="text-[10px] px-1.5 py-0.2 bg-black/40 text-neutral-300">
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          <span className="text-[11px] font-mono text-neutral-500 uppercase">
            Syncs automatically with Homepage & /reviews
          </span>
        </div>

        {/* Review Cards Grid */}
        {loading ? (
          <div className="py-24 text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-dk-yellow mb-2" />
            <p className="text-xs font-mono text-neutral-500 uppercase">
              Loading customer reviews...
            </p>
          </div>
        ) : filteredReviews.length === 0 ? (
          <div className="py-24 text-center border border-dashed border-neutral-800 bg-neutral-950 p-6 sm:p-8 space-y-4">
            <MessageSquare className="w-10 h-10 text-neutral-600 mx-auto" />
            <p className="text-neutral-400 font-mono text-xs uppercase tracking-wider">
              No reviews found in this view.
            </p>
            <p className="text-xs text-neutral-500 max-w-sm mx-auto">
              Add student feedback and Google testimonials to display them dynamically on the public website.
            </p>
            <button
              onClick={handleOpenAdd}
              className="px-5 py-2.5 bg-white text-black text-xs font-heading font-light uppercase tracking-widest hover:bg-dk-yellow transition-colors cursor-pointer"
            >
              Add First Review
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredReviews.map((review) => (
              <div
                key={review._id || review.author}
                className="bg-neutral-950 border border-neutral-800 overflow-hidden flex flex-col justify-between group hover:border-neutral-700 transition-colors p-5 sm:p-6 min-w-0 max-w-full"
              >
                <div className="min-w-0 max-w-full">
                  {/* Top Bar: Reviewer Info + Live Pill */}
                  <div className="flex items-start justify-between gap-3 mb-4 min-w-0">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-semibold shrink-0 ${
                          review.avatarBg || "bg-[#4285F4]"
                        }`}
                      >
                        {review.avatarLetter || (review.author ? review.author[0].toUpperCase() : "G")}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-sm font-heading font-medium text-white truncate break-words [overflow-wrap:anywhere]">
                          {review.author}
                        </h3>
                        <span className="text-[11px] font-mono text-neutral-400 block truncate break-words [overflow-wrap:anywhere]">
                          {review.badge || "Verified Reviewer"}
                        </span>
                      </div>
                    </div>

                    {/* Publish Toggle Button */}
                    <button
                      onClick={() => handleTogglePublish(review)}
                      title={review.published !== false ? "Live on website" : "Draft (Hidden)"}
                      className={`px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 ${
                        review.published !== false
                          ? "bg-black/90 text-[#25D366] border border-[#25D366]/40 hover:bg-black"
                          : "bg-black/90 text-neutral-400 border border-neutral-700 hover:text-white"
                      }`}
                    >
                      {review.published !== false ? (
                        <>
                          <Eye className="w-3 h-3 text-[#25D366]" />
                          <span>Live</span>
                        </>
                      ) : (
                        <>
                          <EyeOff className="w-3 h-3 text-neutral-500" />
                          <span>Draft</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Rating Stars & Time */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < (review.rating || 5)
                              ? "fill-[#FBBC05] text-[#FBBC05]"
                              : "fill-neutral-800 text-neutral-800"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-[11px] font-mono text-neutral-500">
                      {review.timeAgo || "Recently"}
                    </span>
                  </div>

                  {/* Review Text */}
                  <ExpandableText
                    text={`"${review.text}"`}
                    limit={150}
                    className="text-neutral-300 text-xs sm:text-sm font-light leading-relaxed break-words [overflow-wrap:anywhere]"
                  />
                </div>

                {/* Bottom Actions */}
                <div className="pt-4 mt-4 border-t border-neutral-900 flex items-center justify-between">
                  <span className="text-[10px] font-mono text-neutral-500">
                    Order: {review.displayOrder || 1}
                  </span>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(review)}
                      aria-label="Edit review details"
                      title="Edit review"
                      className="p-2 min-h-[36px] min-w-[36px] flex items-center justify-center text-neutral-400 hover:text-white hover:bg-neutral-900 transition-colors cursor-pointer"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeleteTarget(review)}
                      aria-label="Delete review"
                      title="Delete review"
                      className="p-2 min-h-[36px] min-w-[36px] flex items-center justify-center text-neutral-400 hover:text-dk-red hover:bg-neutral-900 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Add / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          if (!actionLoading) {
            setIsModalOpen(false);
            setEditingItem(null);
          }
        }}
        title={editingItem ? "Edit Google Review" : "Add New Google Review"}
        maxWidth="lg"
      >
        <form onSubmit={handleSaveReview} className="space-y-5">
          {formError && (
            <div
              role="alert"
              className="flex items-center gap-2.5 p-3.5 bg-dk-red/10 border border-dk-red/30 text-white text-xs font-mono"
            >
              <AlertCircle className="w-4 h-4 text-dk-red shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          {/* Reviewer Name & Badge */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                Reviewer / Student Name <span className="text-dk-red">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                placeholder="e.g. Anusree K."
                className="w-full bg-black border border-neutral-800 px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-dk-yellow font-heading font-light"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                Badge / Role Description
              </label>
              <input
                type="text"
                value={formData.badge}
                onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                placeholder="e.g. Local Guide • 24 reviews or Student"
                className="w-full bg-black border border-neutral-800 px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-dk-yellow font-mono"
              />
            </div>
          </div>

          {/* Rating (1 to 5) & Date Note */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                Rating (Stars)
              </label>
              <div className="flex items-center gap-2 bg-black border border-neutral-800 px-3.5 py-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setFormData({ ...formData, rating: star })}
                    className="p-1 cursor-pointer hover:scale-110 transition-transform"
                  >
                    <Star
                      className={`w-5 h-5 ${
                        star <= formData.rating
                          ? "fill-[#FBBC05] text-[#FBBC05]"
                          : "text-neutral-700 fill-transparent"
                      }`}
                    />
                  </button>
                ))}
                <span className="text-xs font-mono text-neutral-400 ml-2">
                  {formData.rating} of 5 Stars
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                Relative Date / Time Display
              </label>
              <input
                type="text"
                value={formData.timeAgo}
                onChange={(e) => setFormData({ ...formData, timeAgo: e.target.value })}
                placeholder="e.g. 2 weeks ago or 1 month ago"
                className="w-full bg-black border border-neutral-800 px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-dk-yellow font-mono"
              />
            </div>
          </div>

          {/* Avatar Color Picker */}
          <div>
            <label className="block text-xs font-mono uppercase text-neutral-400 mb-2">
              Google Avatar Accent Color
            </label>
            <div className="flex items-center gap-3 flex-wrap">
              {GOOGLE_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setFormData({ ...formData, avatarBg: color })}
                  className={`w-8 h-8 rounded-full ${color} flex items-center justify-center text-xs font-bold text-white transition-transform cursor-pointer ${
                    formData.avatarBg === color
                      ? "ring-2 ring-white ring-offset-2 ring-offset-black scale-110"
                      : "opacity-70 hover:opacity-100"
                  }`}
                >
                  {formData.avatarBg === color && <Check className="w-4 h-4 text-white" />}
                </button>
              ))}
            </div>
          </div>

          {/* Review Text */}
          <div>
            <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
              Review Testimonial Text <span className="text-dk-red">*</span>
            </label>
            <textarea
              required
              rows={4}
              value={formData.text}
              onChange={(e) => setFormData({ ...formData, text: e.target.value })}
              placeholder="e.g. DK Dance Company is undeniably the best dance academy in Kozhikode! Dhanesh master's teaching methodology is exceptional..."
              className="w-full bg-black border border-neutral-800 p-3 text-xs text-white focus:outline-none focus:border-dk-yellow font-light leading-relaxed"
            />
          </div>

          {/* Display Order & Published */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-neutral-950 border border-neutral-800">
            <div>
              <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                Display Order Priority
              </label>
              <input
                type="number"
                min={1}
                value={formData.displayOrder}
                onChange={(e) =>
                  setFormData({ ...formData, displayOrder: Number(e.target.value) || 1 })
                }
                className="w-full bg-black border border-neutral-800 px-3 py-2 text-xs text-white focus:outline-none focus:border-dk-yellow font-mono"
              />
            </div>

            <label className="flex items-center gap-3 cursor-pointer pt-2 sm:pt-4">
              <input
                type="checkbox"
                checked={formData.published}
                onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                className="w-4 h-4 rounded-none accent-[#25D366] cursor-pointer"
              />
              <div>
                <span className="text-xs font-mono uppercase text-white block">
                  Publish Live on Website
                </span>
                <span className="text-[10px] text-neutral-400 block font-light">
                  Uncheck to keep as draft
                </span>
              </div>
            </label>
          </div>

          {/* Modal Actions */}
          <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-3 pt-4 border-t border-neutral-900">
            <button
              type="button"
              disabled={actionLoading}
              onClick={() => {
                setIsModalOpen(false);
                setEditingItem(null);
              }}
              className="w-full sm:w-auto px-4 py-2.5 min-h-[44px] sm:min-h-0 text-xs font-mono uppercase text-neutral-400 hover:text-white cursor-pointer disabled:opacity-50 text-center"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={actionLoading}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 min-h-[44px] sm:min-h-0 bg-white text-black hover:bg-dk-yellow font-heading font-light text-xs uppercase tracking-widest transition-colors disabled:opacity-50 cursor-pointer"
            >
              {actionLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving Review...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>{editingItem ? "Update Review" : "Save & Publish Review"}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </Modal>

      
      <ConfirmDialog
        isOpen={deleteTarget !== null}
        title="Delete Google Review?"
        message={`Delete review by "${deleteTarget?.author}"? This review will be permanently removed from the website.`}
        confirmText="Permanently Delete"
        isDestructive={true}
        isLoading={actionLoading}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </>
  );
}
