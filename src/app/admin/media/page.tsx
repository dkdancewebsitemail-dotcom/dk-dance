"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Trash2,
  Edit2,
  Eye,
  EyeOff,
  Image as ImageIcon,
  Plus,
  Loader2,
  Check,
  AlertCircle,
  FileCheck2,
  Film,
  Search,
  Maximize2,
  RefreshCw,
  FolderOpen,
  X,
  SlidersHorizontal,
} from "lucide-react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { Modal } from "@/components/ui/Modal";
import { MediaItem, MediaCategory } from "@/types";
import { UploadDropzone } from "@/lib/uploadthing";
import { useToast } from "@/context/ToastContext";
import { adminFetch } from "@/lib/admin-fetch";
import { MediaUploaderWithPreview } from "@/components/admin/MediaUploaderWithPreview";

const CATEGORIES: MediaCategory[] = [
  "Classes",
  "Performances",
  "Stage Shows",
  "Competitions",
  "School Programs",
  "Cultural Events",
  "Workshops",
  "Special Training",
  "Branch Activities",
  "Bournemouth",
];

function cleanFilenameToTitle(name: string): string {
  if (!name) return "";
  const withoutExt = name.replace(/\.[^/.]+$/, "");
  const spaced = withoutExt.replace(/[-_]+/g, " ").trim();
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}

export default function AdminPhotoLibraryPage() {
  const toast = useToast();
  const [photos, setPhotos] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);

  
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "live" | "draft">("all");

  
  const [previewPhoto, setPreviewPhoto] = useState<MediaItem | null>(null);

  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MediaItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<MediaItem | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState("");
  const [isReplacingFile, setIsReplacingFile] = useState(false);

  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "Classes" as MediaCategory,
    url: "",
    key: "",
    name: "",
    published: true,
    displayOrder: 1,
  });

  const fetchPhotos = async () => {
    try {
      setLoading(true);
      // Fetch all photos (both published and draft)
      const res = await adminFetch("/api/media?type=image&all=true");
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setPhotos(
          [...data.data].sort(
            (a, b) => (Number(a.displayOrder) || 1) - (Number(b.displayOrder) || 1)
          )
        );
      } else {
        setPhotos([]);
      }
    } catch (err) {
      console.error("Failed to load photo library:", err);
      toast.error("Could not load gallery photos. Please try again.", "Fetch Error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPhotos();
  }, []);

  const handleOpenAdd = () => {
    if (photos.length >= 15) {
      toast.warning(
        "Maximum limit reached (15/15 photos). Please delete an existing photo before uploading a new one.",
        "Capacity Reached"
      );
      return;
    }
    setUploadError("");
    setUploadSuccess("");
    setIsReplacingFile(false);
    setFormData({
      title: "",
      description: "",
      category: "Classes",
      url: "",
      key: "",
      name: "",
      published: true,
      displayOrder: photos.length + 1,
    });
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (item: MediaItem) => {
    setUploadError("");
    setUploadSuccess("");
    setIsReplacingFile(false);
    setEditingItem(item);
    setFormData({
      title: item.title || "",
      description: item.description || "",
      category: item.category || "Classes",
      url: item.url || "",
      key: item.key || "",
      name: item.name || "",
      published: Boolean(item.published),
      displayOrder: typeof item.displayOrder === "number" ? item.displayOrder : 1,
    });
  };

  const handleCloseModal = () => {
    setIsAddModalOpen(false);
    setEditingItem(null);
    setIsReplacingFile(false);
    setUploadError("");
    setUploadSuccess("");
  };

  const handleSavePhoto = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.url.trim()) {
      setUploadError("Please upload a photo via the dropzone before saving.");
      toast.error("Please upload a photo first.", "Photo Missing");
      return;
    }

    if (!formData.title.trim()) {
      setUploadError("Please give this photo a title or caption.");
      toast.error("Photo title is required.", "Validation Error");
      return;
    }

    setActionLoading(true);
    setUploadError("");

    try {
      const payload = {
        type: "image",
        url: formData.url.trim(),
        key: formData.key.trim(),
        name: formData.name.trim(),
        title: formData.title.trim(),
        description: formData.description.trim(),
        category: formData.category,
        published: Boolean(formData.published),
        displayOrder: Number(formData.displayOrder) || 1,
      };

      if (editingItem && editingItem._id) {
        // Edit mode
        const res = await adminFetch(`/api/media/${editingItem._id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...payload,
            previousKey: editingItem.key && editingItem.key !== formData.key ? editingItem.key : undefined,
          }),
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || "Failed to update photo.");
        }

        toast.success(`"${payload.title}" updated successfully.`, "Photo Updated");
      } else {
        // Create mode
        const res = await adminFetch("/api/media", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || "Failed to save photo.");
        }

        toast.success(`"${payload.title}" saved to photo library and live gallery.`, "Photo Added");
      }

      handleCloseModal();
      await fetchPhotos();
    } catch (err: any) {
      console.error("Save photo error:", err);
      const msg = err.message || "Failed to save photo.";
      setUploadError(msg);
      toast.error(msg, "Save Failed");
    } finally {
      setActionLoading(false);
    }
  };

  const handleTogglePublish = async (item: MediaItem) => {
    if (!item._id) return;
    try {
      const nextState = !item.published;
      const res = await adminFetch(`/api/media/${item._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ published: nextState }),
      });

      if (res.ok) {
        setPhotos((prev) =>
          prev.map((p) => (p._id === item._id ? { ...p, published: nextState } : p))
        );
        toast.info(
          nextState
            ? `"${item.title}" is now LIVE on the public gallery.`
            : `"${item.title}" moved to DRAFT status.`,
          "Status Updated"
        );
      } else {
        toast.error("Failed to update status on server.");
      }
    } catch (err) {
      console.error("Toggle publish failed:", err);
      toast.error("Network error updating status.");
    }
  };

  const handleDeletePhoto = async () => {
    if (!deleteTarget || !deleteTarget._id) return;
    setActionLoading(true);
    try {
      const res = await adminFetch(`/api/media/${deleteTarget._id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setPhotos((prev) => prev.filter((p) => p._id !== deleteTarget._id));
        toast.success(
          `"${deleteTarget.title}" deleted successfully.`,
          "Photo Removed"
        );
        setDeleteTarget(null);
      } else {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "Failed to delete photo.");
      }
    } catch (err: any) {
      console.error("Delete photo error:", err);
      toast.error(err.message || "Deletion failed", "Error");
    } finally {
      setActionLoading(false);
    }
  };

  // Filter & Search Logic
  const filteredPhotos = useMemo(() => {
    return photos.filter((item) => {
      // Category filter
      if (selectedCategory !== "All" && item.category !== selectedCategory) {
        return false;
      }
      // Status filter
      if (statusFilter === "live" && !item.published) return false;
      if (statusFilter === "draft" && item.published) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const titleMatch = item.title?.toLowerCase().includes(q);
        const descMatch = item.description?.toLowerCase().includes(q);
        const catMatch = item.category?.toLowerCase().includes(q);
        if (!titleMatch && !descMatch && !catMatch) return false;
      }

      return true;
    });
  }, [photos, selectedCategory, statusFilter, searchQuery]);

  // Library statistics
  const totalPhotos = photos.length;
  const livePhotos = photos.filter((p) => p.published).length;
  const draftPhotos = totalPhotos - livePhotos;

  return (
    <>
      <AdminHeader
        title="Photo Library"
        subtitle="Upload, curate, and organize dance photos for the public gallery"
      >
        <div className="flex items-center gap-3">
          <Link
            href="/admin/videos"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white hover:border-dk-yellow font-heading font-light text-xs uppercase tracking-widest transition-colors"
          >
            <Film className="w-3.5 h-3.5 text-dk-red" />
            <span>Video Showcase</span>
          </Link>
          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-black hover:bg-dk-yellow font-heading font-bold text-xs uppercase tracking-widest transition-colors shadow-lg active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Add Photo</span>
          </button>
        </div>
      </AdminHeader>

      <main className="p-4 sm:p-6 lg:p-8 space-y-6 flex-1 max-w-7xl">
        {/* Statistics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4">
          <div className="bg-neutral-950 border border-neutral-800 p-3 sm:p-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-mono uppercase text-neutral-500">
                Total Photos
              </span>
              <span
                className={`text-[9px] font-mono uppercase px-1.5 py-0.5 border ${
                  totalPhotos >= 15
                    ? "bg-dk-red/20 border-dk-red text-dk-red font-bold"
                    : "bg-neutral-900 border-neutral-800 text-dk-yellow"
                }`}
              >
                {totalPhotos >= 15 ? "15/15 FULL" : "Max 15 Photos"}
              </span>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl sm:text-2xl font-heading font-extralight text-white">
                {totalPhotos}
              </span>
              <span className="text-xs font-mono text-neutral-500">
                / 15
              </span>
            </div>
            <span className="text-[10px] font-mono text-neutral-500 block mt-1">
              Max 10 MB per image
            </span>
          </div>

          <div className="bg-neutral-950 border border-neutral-800 p-3 sm:p-4">
            <span className="text-[10px] font-mono uppercase text-[#25D366] block mb-1 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse" />
              Live on Gallery
            </span>
            <span className="text-xl sm:text-2xl font-heading font-extralight text-white block">
              {livePhotos}
            </span>
          </div>

          <div className="bg-neutral-950 border border-neutral-800 p-3 sm:p-4">
            <span className="text-[10px] font-mono uppercase text-neutral-400 block mb-1">
              Draft Photos
            </span>
            <span className="text-xl sm:text-2xl font-heading font-extralight text-white block">
              {draftPhotos}
            </span>
          </div>

          <div className="bg-neutral-950 border border-neutral-800 p-3 sm:p-4 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono uppercase text-dk-yellow block mb-1">
                Categories
              </span>
              <span className="text-xl sm:text-2xl font-heading font-extralight text-white block">
                {CATEGORIES.length}
              </span>
            </div>
            <button
              onClick={fetchPhotos}
              title="Refresh photo library"
              className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-900 border border-neutral-800 transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-dk-yellow" : ""}`} />
            </button>
          </div>
        </div>

        {/* Capacity Warning Banner */}
        {totalPhotos >= 15 && (
          <div className="p-3.5 bg-dk-red/10 border border-dk-red/40 flex items-center justify-between gap-3 text-xs font-mono text-white">
            <div className="flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 text-dk-red shrink-0" />
              <span>
                <strong>Photo Limit Reached (15/15):</strong> Maximum capacity of 15 photos in the library has been reached. Please delete an existing photo before uploading a new one. (Max size: 10 MB per image).
              </span>
            </div>
          </div>
        )}

        {/* Filter & Search Bar */}
        <div className="space-y-3 bg-neutral-950 border border-neutral-800 p-3.5 sm:p-4">
          {/* Top row: search + status selector */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-full sm:max-w-md">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search photos by title, caption, category..."
                className="w-full bg-black border border-neutral-800 pl-9 pr-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-dk-yellow min-h-[38px] font-mono"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white p-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="flex items-center justify-between sm:justify-start gap-2">
              <span className="text-[10px] font-mono uppercase text-neutral-500 flex items-center gap-1 shrink-0">
                <SlidersHorizontal className="w-3 h-3" />
                Status:
              </span>
              <div className="flex border border-neutral-800 bg-neutral-900 flex-1 sm:flex-none">
                {(["all", "live", "draft"] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => setStatusFilter(s)}
                    className={`flex-1 sm:flex-none px-3 py-1.5 text-xs font-mono uppercase tracking-wider transition-colors text-center ${
                      statusFilter === s
                        ? "bg-white text-black font-semibold"
                        : "text-neutral-400 hover:text-white"
                    }`}
                  >
                    {s === "all" ? "All" : s === "live" ? "Live" : "Draft"}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom row: category pills */}
          <div className="flex items-center gap-2 overflow-x-auto pt-2 border-t border-neutral-900 scrollbar-none">
            {["All", ...CATEGORIES].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 text-xs font-mono uppercase tracking-wider transition-colors shrink-0 ${
                  selectedCategory === cat
                    ? "bg-dk-yellow text-black font-bold"
                    : "bg-neutral-900 text-neutral-400 hover:text-white hover:bg-neutral-800"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Photos Grid */}
        {loading ? (
          <div className="py-24 text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-dk-yellow mb-3" />
            <p className="text-xs font-mono text-neutral-500 uppercase tracking-widest">
              Loading gallery photos...
            </p>
          </div>
        ) : filteredPhotos.length === 0 ? (
          <div className="py-24 text-center border border-dashed border-neutral-800 bg-neutral-950 p-8 space-y-4">
            <div className="w-12 h-12 mx-auto rounded-full bg-neutral-900 flex items-center justify-center text-neutral-500">
              <FolderOpen className="w-6 h-6" />
            </div>
            <div>
              <p className="text-neutral-300 font-heading text-sm uppercase tracking-wider">
                No photos found
              </p>
              <p className="text-neutral-500 font-mono text-xs mt-1">
                {searchQuery || selectedCategory !== "All" || statusFilter !== "all"
                  ? "Try adjusting your filters or search keywords."
                  : "Start populating the live gallery by uploading your first high-resolution dance photo."}
              </p>
            </div>
            <button
              onClick={handleOpenAdd}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-neutral-900 border border-neutral-800 text-xs font-mono uppercase text-dk-yellow hover:border-dk-yellow transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Upload First Photo</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredPhotos.map((item) => (
              <div
                key={item._id || item.url}
                className="bg-neutral-950 border border-neutral-800 overflow-hidden flex flex-col justify-between group hover:border-neutral-700 transition-colors min-w-0 max-w-full"
              >
                {/* Photo Preview Container */}
                <div className="relative aspect-[4/3] bg-neutral-900 overflow-hidden">
                  <Image
                    src={item.url}
                    alt={item.title || "DK Dance Photo"}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />

                  {/* Category Pill Overlay */}
                  <div className="absolute top-2 left-2 z-10">
                    <span className="px-2 py-1 bg-black/80 backdrop-blur-sm text-dk-yellow text-[10px] font-mono uppercase font-bold tracking-wider border border-white/10">
                      {item.category}
                    </span>
                  </div>

                  {/* Publish Status Toggle Button */}
                  <div className="absolute top-2 right-2 z-10">
                    <button
                      onClick={() => handleTogglePublish(item)}
                      title={item.published ? "Click to move to Draft" : "Click to publish live"}
                      className={`px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-md ${
                        item.published
                          ? "bg-black/90 text-[#25D366] border border-[#25D366]/40 hover:bg-black"
                          : "bg-black/90 text-neutral-400 border border-neutral-700 hover:text-white"
                      }`}
                    >
                      {item.published ? (
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

                  {/* Full size preview trigger on hover */}
                  <button
                    onClick={() => setPreviewPhoto(item)}
                    title="View full-size photo"
                    className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white"
                  >
                    <span className="p-2.5 rounded-full bg-black/80 backdrop-blur-md border border-white/20 text-white hover:scale-110 transition-transform">
                      <Maximize2 className="w-4 h-4" />
                    </span>
                  </button>
                </div>

                {/* Details Section */}
                <div className="p-4 flex-1 flex flex-col justify-between min-w-0 max-w-full">
                  <div className="min-w-0 max-w-full">
                    <h3 className="text-sm font-heading font-bold uppercase text-white truncate mb-1 break-words [overflow-wrap:anywhere]">
                      {item.title}
                    </h3>
                    {item.description ? (
                      <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed break-words [overflow-wrap:anywhere]">
                        {item.description}
                      </p>
                    ) : (
                      <p className="text-[11px] text-neutral-600 italic">No description provided</p>
                    )}
                  </div>

                  {/* Card Bottom Actions */}
                  <div className="pt-3 mt-3 border-t border-neutral-900 flex items-center justify-between">
                    <span className="text-[10px] font-mono text-neutral-500">
                      Order: {item.displayOrder}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleOpenEdit(item)}
                        aria-label={`Edit ${item.title}`}
                        title="Edit Photo Details"
                        className="p-2 min-h-[36px] min-w-[36px] flex items-center justify-center text-neutral-400 hover:text-white hover:bg-neutral-900 transition-colors cursor-pointer"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(item)}
                        aria-label={`Delete ${item.title}`}
                        title="Delete Photo"
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

      {/* Full-Screen Photo Preview Modal */}
      {previewPhoto && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setPreviewPhoto(null)}
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 sm:p-8"
        >
          <button
            onClick={() => setPreviewPhoto(null)}
            className="fixed top-6 right-6 p-2 rounded-full bg-neutral-900/90 text-neutral-300 hover:text-white border border-neutral-700 transition-colors z-50"
          >
            <X className="w-6 h-6" />
          </button>
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-5xl w-full max-h-[90vh] flex flex-col items-center"
          >
            <div className="relative w-full h-[70vh] bg-black border border-neutral-800">
              <Image
                src={previewPhoto.url}
                alt={previewPhoto.title}
                fill
                className="object-contain"
                sizes="100vw"
              />
            </div>
            <div className="w-full mt-4 flex items-center justify-between text-white border-t border-neutral-800 pt-3">
              <div>
                <span className="text-xs font-mono uppercase text-dk-yellow mr-3">
                  {previewPhoto.category}
                </span>
                <span className="text-sm font-heading font-light uppercase">
                  {previewPhoto.title}
                </span>
                {previewPhoto.description && (
                  <p className="text-xs text-neutral-400 mt-1">{previewPhoto.description}</p>
                )}
              </div>
              <span className="text-xs font-mono text-neutral-500">
                {previewPhoto.published ? "Live on Gallery" : "Draft"}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Photo Modal */}
      <Modal
        isOpen={isAddModalOpen || editingItem !== null}
        onClose={handleCloseModal}
        title={editingItem ? "Edit Photo" : "Add New Photo"}
        maxWidth="lg"
      >
        <form onSubmit={handleSavePhoto} className="space-y-5">
          {/* Error Message Alert */}
          {uploadError && (
            <div
              role="alert"
              className="flex items-center gap-2.5 p-3.5 bg-dk-red/10 border border-dk-red/30 text-white text-xs font-mono"
            >
              <AlertCircle className="w-4 h-4 text-dk-red shrink-0" />
              <span>{uploadError}</span>
            </div>
          )}

          {/* Success Notification Alert */}
          {uploadSuccess && (
            <div className="flex items-center gap-2.5 p-3.5 bg-[#25D366]/10 border border-[#25D366]/30 text-white text-xs font-mono">
              <FileCheck2 className="w-4 h-4 text-[#25D366] shrink-0" />
              <span>{uploadSuccess}</span>
            </div>
          )}

          {/* Photo Uploader with Instant Client Preview */}
          <MediaUploaderWithPreview
            label="Dance Studio / Gallery Photo (Max 10 MB)"
            value={formData.url}
            fileKey={formData.key}
            mediaType="image"
            maxSizeMb={10}
            onChange={({ url, key, name }) => {
              const cleanTitle = name ? cleanFilenameToTitle(name) : "";
              setFormData((prev) => ({
                ...prev,
                url,
                key: key || prev.key,
                name: name || prev.name,
                title: prev.title.trim() ? prev.title : cleanTitle,
              }));
              setUploadSuccess(`Photo uploaded and ready!`);
              setUploadError("");
              toast.success("Photo attached and ready for gallery!");
            }}
            onClear={() => {
              setFormData((prev) => ({ ...prev, url: "", key: "", name: "" }));
            }}
            placeholder="https://... or /images/..."
          />

          {/* Form Fields: Category & Display Order */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    category: e.target.value as MediaCategory,
                  })
                }
                className="w-full bg-black border border-neutral-800 px-3 py-2.5 text-xs text-white focus:outline-none focus:border-dk-yellow font-mono"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                Display Order
              </label>
              <input
                type="number"
                min={1}
                value={formData.displayOrder}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    displayOrder: Number(e.target.value),
                  })
                }
                className="w-full bg-black border border-neutral-800 px-3 py-2.5 text-xs text-white focus:outline-none focus:border-dk-yellow font-mono"
              />
            </div>
          </div>

          {/* Title / Caption */}
          <div>
            <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
              Title / Caption *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Kozhikode Stage Show Choreography"
              className="w-full bg-black border border-neutral-800 px-3 py-2.5 text-xs text-white focus:outline-none focus:border-dk-yellow"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
              Description (Optional)
            </label>
            <textarea
              rows={2}
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Brief performance, workshop, or class details..."
              className="w-full bg-black border border-neutral-800 px-3 py-2 text-xs text-white focus:outline-none focus:border-dk-yellow resize-none"
            />
          </div>

          {/* Publish Checkbox */}
          <div className="flex items-center gap-2.5 p-3 bg-neutral-900 border border-neutral-800">
            <input
              id="photo-published"
              type="checkbox"
              checked={formData.published}
              onChange={(e) =>
                setFormData({ ...formData, published: e.target.checked })
              }
              className="w-4 h-4 rounded-none accent-dk-yellow cursor-pointer"
            />
            <label
              htmlFor="photo-published"
              className="text-xs font-mono uppercase text-neutral-200 cursor-pointer select-none"
            >
              Publish to Live Gallery Immediately
            </label>
          </div>

          {/* Modal Actions */}
          <div className="pt-4 border-t border-neutral-900 flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
            <button
              type="button"
              onClick={handleCloseModal}
              className="w-full sm:w-auto px-4 py-2.5 min-h-[44px] sm:min-h-0 text-xs font-mono uppercase text-neutral-400 hover:text-white text-center cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={actionLoading || !formData.url}
              className="w-full sm:w-auto px-6 py-2.5 min-h-[44px] sm:min-h-0 bg-white text-black hover:bg-dk-yellow font-heading font-bold text-xs uppercase tracking-wider transition-colors disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg cursor-pointer"
            >
              {actionLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving Photo...</span>
                </>
              ) : (
                <span>{editingItem ? "Update Photo" : "Save Photo"}</span>
              )}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteTarget !== null}
        title="Delete Photo?"
        message={`Are you sure you want to permanently delete "${deleteTarget?.title}"? This photo will be removed from your website and gallery.`}
        confirmText="Delete Photo"
        isDestructive={true}
        isLoading={actionLoading}
        onConfirm={handleDeletePhoto}
        onCancel={() => setDeleteTarget(null)}
      />
    </>
  );
}
