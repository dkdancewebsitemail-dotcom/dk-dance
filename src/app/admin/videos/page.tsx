"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Film,
  Plus,
  Trash2,
  Edit2,
  Eye,
  EyeOff,
  Star,
  Loader2,
  Check,
  AlertCircle,
} from "lucide-react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { Modal } from "@/components/ui/Modal";
import { MediaItem, MediaCategory, MediaType } from "@/types";
import { MediaUploaderWithPreview } from "@/components/admin/MediaUploaderWithPreview";
import { useToast } from "@/context/ToastContext";
import { adminFetch } from "@/lib/admin-fetch";

const CATEGORIES: MediaCategory[] = [
  "Performances",
  "Classes",
  "Stage Shows",
  "Competitions",
  "Workshops",
  "Special Training",
  "Branch Activities",
  "Bournemouth",
  "Cultural Events",
  "School Programs",
];

export default function AdminVideosPage() {
  const toast = useToast();
  const [videos, setVideos] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<"all" | "featured" | "published" | "draft">("all");

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MediaItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<MediaItem | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [formData, setFormData] = useState<{
    title: string;
    category: MediaCategory;
    type: MediaType;
    url: string;
    key: string;
    thumbnailUrl: string;
    thumbnailKey: string;
    featuredOnHome: boolean;
    published: boolean;
    displayOrder: number;
  }>({
    title: "",
    category: "Performances",
    type: "video",
    url: "",
    key: "",
    thumbnailUrl: "",
    thumbnailKey: "",
    featuredOnHome: true,
    published: true,
    displayOrder: 1,
  });

  const fetchVideos = async () => {
    try {
      setLoading(true);
      const res = await adminFetch("/api/media?type=video&all=true");
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setVideos(
          [...data.data].sort(
            (a, b) => (Number(a.displayOrder) || 1) - (Number(b.displayOrder) || 1)
          )
        );
      }
    } catch (err) {
      console.error("Failed to load videos:", err);
      toast.error("Failed to load video library. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const handleOpenAdd = () => {
    if (videos.length >= 10) {
      toast.warning(
        "Maximum limit reached (10/10 videos). Please delete an existing video before uploading a new one.",
        "Capacity Reached"
      );
      return;
    }
    setUploadError("");
    setEditingItem(null);
    setFormData({
      title: "",
      category: "Performances",
      type: "video",
      url: "",
      key: "",
      thumbnailUrl: "",
      thumbnailKey: "",
      featuredOnHome: true,
      published: true,
      displayOrder: videos.length + 1,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: MediaItem) => {
    setUploadError("");
    setEditingItem(item);
    setFormData({
      title: item.title,
      category: item.category,
      type: "video",
      url: item.url,
      key: item.key || "",
      thumbnailUrl: item.thumbnailUrl || "",
      thumbnailKey: item.thumbnailKey || "",
      featuredOnHome: item.featuredOnHome !== false,
      published: item.published,
      displayOrder: item.displayOrder,
    });
    setIsModalOpen(true);
  };

  const handleSaveVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.url.trim() || !formData.title.trim()) {
      setUploadError("Please upload a video file and enter a routine title.");
      return;
    }

    setActionLoading(true);
    setUploadError("");

    try {
      if (editingItem && editingItem._id) {
        const res = await adminFetch(`/api/media/${editingItem._id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || "Update failed");
        }
        toast.success(`Video "${formData.title}" updated successfully.`);
      } else {
        const res = await adminFetch("/api/media", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || "Creation failed");
        }
        toast.success(`New video routine "${formData.title}" added to showcase.`);
      }

      setIsModalOpen(false);
      setEditingItem(null);
      await fetchVideos();
    } catch (err: any) {
      const msg = err.message || "Failed to save video.";
      setUploadError(msg);
      toast.error(msg);
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleFeatured = async (item: MediaItem) => {
    if (!item._id) return;
    const nextState = !item.featuredOnHome;
    try {
      const res = await adminFetch(`/api/media/${item._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ featuredOnHome: nextState }),
      });
      if (res.ok) {
        setVideos((prev) =>
          prev.map((v) => (v._id === item._id ? { ...v, featuredOnHome: nextState } : v))
        );
        toast.success(
          nextState
            ? `"${item.title}" will now display on the homepage video showcase.`
            : `"${item.title}" removed from homepage video showcase.`
        );
      } else {
        toast.error("Failed to update homepage status.");
      }
    } catch (err) {
      console.error("Failed to toggle featured:", err);
      toast.error("Network error while updating video status.");
    }
  };

  const handleTogglePublish = async (item: MediaItem) => {
    if (!item._id) return;
    const nextState = !item.published;
    try {
      const res = await adminFetch(`/api/media/${item._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ published: nextState }),
      });
      if (res.ok) {
        setVideos((prev) =>
          prev.map((v) => (v._id === item._id ? { ...v, published: nextState } : v))
        );
        toast.info(
          nextState ? `"${item.title}" is now published and live.` : `"${item.title}" moved to draft.`
        );
      } else {
        toast.error("Failed to change publish status.");
      }
    } catch (err) {
      console.error("Failed to toggle publish:", err);
      toast.error("Network error while updating publish status.");
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget || !deleteTarget._id) return;
    setActionLoading(true);
    try {
      const res = await adminFetch(`/api/media/${deleteTarget._id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setVideos((prev) => prev.filter((v) => v._id !== deleteTarget._id));
        toast.success(`Video "${deleteTarget.title}" deleted successfully.`);
        setDeleteTarget(null);
      } else {
        throw new Error("Failed to delete video");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to delete video");
    } finally {
      setActionLoading(false);
    }
  };

  const filteredVideos = videos.filter((v) => {
    if (activeFilter === "featured") return v.featuredOnHome !== false && v.published;
    if (activeFilter === "published") return v.published;
    if (activeFilter === "draft") return !v.published;
    return true;
  });

  return (
    <>
      <AdminHeader
        title="Video Showcase & Performance Reels"
        subtitle="Upload, feature, and manage video routines displayed on the DKDC homepage showcase"
      >
        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-black hover:bg-dk-yellow font-heading font-light text-xs uppercase tracking-widest transition-colors shadow-lg active:scale-95 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Upload Video</span>
        </button>
      </AdminHeader>

      <main className="p-4 sm:p-6 lg:p-8 space-y-6 flex-1">
        {/* Filter & Metric Tabs */}
        <div className="flex items-center justify-between gap-4 flex-wrap pb-2 border-b border-neutral-900">
          <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto">
            {[
              { id: "all", label: "All Videos", count: videos.length },
              {
                id: "featured",
                label: "Homepage Showcase",
                count: videos.filter((v) => v.featuredOnHome !== false && v.published).length,
              },
              {
                id: "published",
                label: "Published",
                count: videos.filter((v) => v.published).length,
              },
              {
                id: "draft",
                label: "Drafts",
                count: videos.filter((v) => !v.published).length,
              },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id as any)}
                className={`px-3.5 py-2 text-xs font-mono uppercase tracking-wider transition-colors flex items-center gap-2 cursor-pointer min-h-[38px] ${
                  activeFilter === tab.id
                    ? "bg-white text-black font-normal"
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

          <div className="flex items-center gap-3">
            <span
              className={`px-3 py-1.5 text-xs font-mono uppercase border ${
                videos.length >= 10
                  ? "bg-dk-red/20 border-dk-red text-dk-red font-bold"
                  : "bg-neutral-900 border-neutral-800 text-neutral-300"
              }`}
            >
              Capacity: <strong className="text-white">{videos.length}</strong> / 10 Videos (Max 50 MB)
            </span>
          </div>
        </div>

        {/* Capacity Warning Banner */}
        {videos.length >= 10 && (
          <div className="p-3.5 bg-dk-red/10 border border-dk-red/40 flex items-center justify-between gap-3 text-xs font-mono text-white">
            <div className="flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 text-dk-red shrink-0" />
              <span>
                <strong>Video Showcase Limit Reached (10/10):</strong> Maximum capacity of 10 videos in the showcase has been reached. Please delete an existing video before uploading a new one. (Max size: 50 MB per video).
              </span>
            </div>
          </div>
        )}

        {/* Video Cards Grid */}
        {loading ? (
          <div className="py-24 text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-dk-yellow mb-2" />
            <p className="text-xs font-mono text-neutral-500 uppercase">
              Loading performance videos...
            </p>
          </div>
        ) : filteredVideos.length === 0 ? (
          <div className="py-24 text-center border border-dashed border-neutral-800 bg-neutral-950 p-6 sm:p-8 space-y-4">
            <Film className="w-10 h-10 text-neutral-600 mx-auto" />
            <p className="text-neutral-400 font-mono text-xs uppercase tracking-wider">
              No videos found in this view.
            </p>
            <p className="text-xs text-neutral-500 max-w-sm mx-auto">
              Upload MP4 choreography routines, rehearsals, or stage reels to feature them on the homepage showcase.
            </p>
            <button
              onClick={handleOpenAdd}
              className="px-5 py-2.5 bg-white text-black text-xs font-heading font-light uppercase tracking-widest hover:bg-dk-yellow transition-colors cursor-pointer"
            >
              Upload First Video
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredVideos.map((item) => (
              <div
                key={item._id || item.url}
                className="bg-neutral-950 border border-neutral-800 overflow-hidden flex flex-col justify-between group hover:border-neutral-700 transition-colors min-w-0 max-w-full"
              >
                {/* Video Player or Thumbnail */}
                <div className="relative aspect-video bg-black overflow-hidden">
                  <video
                    src={item.url}
                    poster={item.thumbnailUrl}
                    controls
                    preload="metadata"
                    className="w-full h-full object-cover"
                  />

                  {/* Badges on Top */}
                  <div className="absolute top-2 left-2 flex items-center gap-1.5 pointer-events-none">
                    <span className="p-1 bg-black/80 backdrop-blur-md text-dk-red flex items-center gap-1 text-[10px] font-mono uppercase px-2">
                      <Film className="w-3 h-3" />
                      <span>Video Reel</span>
                    </span>
                    {item.featuredOnHome !== false && (
                      <span className="p-1 bg-dk-yellow text-black flex items-center gap-1 text-[10px] font-mono uppercase font-bold px-2">
                        <Star className="w-3 h-3 fill-black" />
                        <span>Homepage</span>
                      </span>
                    )}
                  </div>

                  {/* Top Right Live/Draft Control */}
                  <div className="absolute top-2 right-2 flex items-center gap-1">
                    <button
                      onClick={() => handleTogglePublish(item)}
                      title={item.published ? "Live on site" : "Draft (Hidden)"}
                      className={`p-1.5 text-xs font-mono uppercase tracking-wider flex items-center gap-1 cursor-pointer ${
                        item.published
                          ? "bg-black/90 text-dk-yellow"
                          : "bg-black/90 text-neutral-500"
                      }`}
                    >
                      {item.published ? (
                        <>
                          <Eye className="w-3.5 h-3.5" />
                          <span className="text-[9px]">Live</span>
                        </>
                      ) : (
                        <>
                          <EyeOff className="w-3.5 h-3.5" />
                          <span className="text-[9px]">Draft</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Video Info */}
                <div className="p-4 flex-1 flex flex-col justify-between min-w-0 max-w-full">
                  <div className="space-y-2 min-w-0 max-w-full">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-mono uppercase text-dk-yellow">
                        {item.category}
                      </span>
                    </div>

                    <h3 className="text-sm font-heading font-light uppercase text-white tracking-wide break-words [overflow-wrap:anywhere]">
                      {item.title}
                    </h3>
                  </div>

                  {/* Action Bar */}
                  <div className="pt-4 mt-4 border-t border-neutral-900 flex items-center justify-between gap-2">
                    <button
                      onClick={() => handleToggleFeatured(item)}
                      className={`inline-flex items-center gap-1.5 text-[10px] font-mono uppercase px-3 py-1.5 min-h-[36px] transition-colors border cursor-pointer ${
                        item.featuredOnHome !== false
                          ? "border-dk-yellow/50 bg-dk-yellow/10 text-dk-yellow hover:bg-dk-yellow/20"
                          : "border-neutral-800 bg-neutral-900 text-neutral-400 hover:text-white"
                      }`}
                    >
                      <Star
                        className={`w-3 h-3 ${
                          item.featuredOnHome !== false ? "fill-dk-yellow" : ""
                        }`}
                      />
                      <span>
                        {item.featuredOnHome !== false ? "Featured on Home" : "Add to Home"}
                      </span>
                    </button>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleOpenEdit(item)}
                        aria-label="Edit video details"
                        title="Edit video"
                        className="p-2 min-h-[36px] min-w-[36px] flex items-center justify-center text-neutral-400 hover:text-white hover:bg-neutral-900 transition-colors cursor-pointer"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(item)}
                        aria-label="Delete video"
                        title="Delete video"
                        className="p-2 min-h-[36px] min-w-[36px] flex items-center justify-center text-neutral-400 hover:text-dk-red hover:bg-neutral-900 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Add / Edit Video Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          if (!actionLoading) {
            setIsModalOpen(false);
            setEditingItem(null);
          }
        }}
        title={editingItem ? "Edit Video Routine" : "Upload Video to Showcase"}
        maxWidth="lg"
      >
        <form onSubmit={handleSaveVideo} className="space-y-6">
          {uploadError && (
            <div
              role="alert"
              className="flex items-center gap-2.5 p-3.5 bg-dk-red/10 border border-dk-red/30 text-white text-xs font-mono"
            >
              <AlertCircle className="w-4 h-4 text-dk-red shrink-0" />
              <span>{uploadError}</span>
            </div>
          )}

          
          <MediaUploaderWithPreview
            label="Performance Video File * (Max 50 MB)"
            value={formData.url}
            fileKey={formData.key}
            mediaType="video"
            maxSizeMb={50}
            onChange={(data) => {
              const cleanTitle = data.name
                ? data.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ").trim()
                : "";
              setFormData((prev) => ({
                ...prev,
                url: data.url,
                key: data.key || "",
                title: prev.title.trim() ? prev.title : cleanTitle,
              }));
              setUploadError("");
            }}
            onClear={() => setFormData((prev) => ({ ...prev, url: "", key: "" }))}
            placeholder="https://... or upload MP4/WebM video"
          />

          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                Routine Title <span className="text-dk-red">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Stage Choreography Mega Routine"
                className="w-full bg-black border border-neutral-800 px-3 py-2.5 text-xs text-white focus:outline-none focus:border-dk-yellow font-heading font-light"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value as MediaCategory })
                }
                className="w-full bg-black border border-neutral-800 px-3 py-2.5 text-xs text-white focus:outline-none focus:border-dk-yellow cursor-pointer"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          
          <MediaUploaderWithPreview
            label="Video Poster / Thumbnail Photo (Optional, Max 10 MB)"
            aspectRatio={16 / 9}
            value={formData.thumbnailUrl}
            fileKey={formData.thumbnailKey}
            mediaType="image"
            maxSizeMb={10}
            onChange={(data) => {
              setFormData((prev) => ({
                ...prev,
                thumbnailUrl: data.url,
                thumbnailKey: data.key || "",
              }));
            }}
            onClear={() => setFormData((prev) => ({ ...prev, thumbnailUrl: "", thumbnailKey: "" }))}
            placeholder="https://... or upload poster image"
          />

          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-neutral-950 border border-neutral-800">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.featuredOnHome}
                onChange={(e) => setFormData({ ...formData, featuredOnHome: e.target.checked })}
                className="w-4 h-4 rounded-none accent-dk-yellow cursor-pointer"
              />
              <div>
                <span className="text-xs font-mono uppercase text-white block">
                  Show on Homepage Showcase
                </span>
                <span className="text-[10px] text-neutral-400 block font-light">
                  Directly renders in the homepage video theater
                </span>
              </div>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.published}
                onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                className="w-4 h-4 rounded-none accent-[#25D366] cursor-pointer"
              />
              <div>
                <span className="text-xs font-mono uppercase text-white block">
                  Live & Published
                </span>
                <span className="text-[10px] text-neutral-400 block font-light">
                  Uncheck to keep as draft
                </span>
              </div>
            </label>
          </div>

          
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
              disabled={actionLoading || !formData.url}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 min-h-[44px] sm:min-h-0 bg-white text-black hover:bg-dk-yellow font-heading font-light text-xs uppercase tracking-widest transition-colors disabled:opacity-50 cursor-pointer"
            >
              {actionLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving Video...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>{editingItem ? "Update Video" : "Save & Feature Video"}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteTarget !== null}
        title="Delete Video Routine?"
        message={`Delete "${deleteTarget?.title}"? The video will be removed from the site.`}
        confirmText="Delete Video"
        isDestructive={true}
        isLoading={actionLoading}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </>
  );
}
