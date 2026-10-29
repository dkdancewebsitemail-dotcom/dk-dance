"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Plus,
  Sparkles,
  Edit2,
  Trash2,
  Check,
  X,
  Loader2,
  Search,
  ExternalLink,
  ArrowUpDown,
  Eye,
  EyeOff,
  Layers,
} from "lucide-react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { Modal } from "@/components/ui/Modal";
import { DanceStyle } from "@/types";
import { useToast } from "@/context/ToastContext";
import { adminFetch } from "@/lib/admin-fetch";
import { MediaUploaderWithPreview } from "@/components/admin/MediaUploaderWithPreview";
import { ExpandableText } from "@/components/ui/ExpandableText";

export default function AdminDanceStylesPage() {
  const toast = useToast();
  const [styles, setStyles] = useState<DanceStyle[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterActive, setFilterActive] = useState<"all" | "active" | "inactive">("all");

  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStyle, setEditingStyle] = useState<DanceStyle | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<DanceStyle | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  
  const [formData, setFormData] = useState<Omit<DanceStyle, "_id">>({
    number: "01",
    name: "",
    slug: "",
    tagline: "",
    description: "",
    image: "",
    imageKey: "",
    features: [],
    displayOrder: 1,
    isActive: true,
  });

  const [featureInput, setFeatureInput] = useState("");

  const fetchStyles = async () => {
    try {
      setLoading(true);
      const res = await adminFetch("/api/dance-styles?all=true");
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setStyles(
          [...data.data].sort(
            (a, b) => (Number(a.displayOrder) || 1) - (Number(b.displayOrder) || 1)
          )
        );
      }
    } catch (err) {
      console.error("Failed to load dance styles:", err);
      toast.error("Failed to load dance styles. Please refresh the page.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStyles();
  }, []);

  const handleOpenAdd = () => {
    setEditingStyle(null);
    const nextOrder = styles.length + 1;
    const formattedNum = nextOrder < 10 ? `0${nextOrder}` : `${nextOrder}`;
    setFormData({
      number: formattedNum,
      name: "",
      slug: "",
      tagline: "",
      description: "",
      image: "",
      imageKey: "",
      features: [],
      displayOrder: nextOrder,
      isActive: true,
    });
    setFeatureInput("");
    setIsModalOpen(true);
  };

  const handleOpenEdit = (style: DanceStyle) => {
    setEditingStyle(style);
    setFormData({
      number: style.number || "01",
      name: style.name || "",
      slug: style.slug || "",
      tagline: style.tagline || "",
      description: style.description || "",
      image: style.image || "",
      imageKey: style.imageKey || "",
      features: Array.isArray(style.features) ? [...style.features] : [],
      displayOrder: style.displayOrder ?? 1,
      isActive: style.isActive !== false,
    });
    setFeatureInput("");
    setIsModalOpen(true);
  };

  const handleNameChange = (name: string) => {
    const generatedSlug = name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    setFormData((prev) => ({
      ...prev,
      name,
      slug: editingStyle ? prev.slug : generatedSlug,
    }));
  };

  const handleAddFeature = () => {
    const trimmed = featureInput.trim();
    if (!trimmed) return;
    if (formData.features.includes(trimmed)) {
      toast.error("This feature bullet point already exists.");
      return;
    }
    setFormData((prev) => ({
      ...prev,
      features: [...prev.features, trimmed],
    }));
    setFeatureInput("");
  };

  const handleRemoveFeature = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.number.trim()) {
      toast.error("Style number and style name are required.", "Validation Error");
      return;
    }

    setActionLoading(true);
    try {
      if (editingStyle) {
        const targetId = editingStyle._id || editingStyle.slug;
        const res = await adminFetch(`/api/dance-styles/${targetId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || "Update failed");
        }
      } else {
        const res = await adminFetch("/api/dance-styles", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || "Create failed");
        }
      }

      setIsModalOpen(false);
      setEditingStyle(null);
      await fetchStyles();
      toast.success(
        editingStyle
          ? `"${formData.name}" style updated successfully.`
          : `"${formData.name}" style created successfully.`,
        "Saved Successfully"
      );
    } catch (err: any) {
      toast.error(err.message || "Failed to save dance style", "Save Failed");
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleActive = async (style: DanceStyle) => {
    try {
      const nextActive = !style.isActive;
      const targetId = style._id || style.slug;
      const res = await adminFetch(`/api/dance-styles/${targetId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: nextActive }),
      });
      if (res.ok) {
        setStyles((prev) =>
          prev.map((s) =>
            s._id === style._id || s.slug === style.slug
              ? { ...s, isActive: nextActive }
              : s
          )
        );
        toast.info(
          nextActive
            ? `"${style.name}" is now live on the website.`
            : `"${style.name}" is now set to draft/inactive.`,
          "Visibility Updated"
        );
      } else {
        toast.error("Failed to update style status.");
      }
    } catch (err) {
      console.error("Toggle active status failed:", err);
      toast.error("Network error while updating style status.");
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setActionLoading(true);
    try {
      const targetId = deleteTarget._id || deleteTarget.slug;
      const res = await adminFetch(`/api/dance-styles/${targetId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setStyles((prev) =>
          prev.filter((s) =>
            deleteTarget._id ? s._id !== deleteTarget._id : s.slug !== deleteTarget.slug
          )
        );
        toast.success(
          `"${deleteTarget.name}" deleted successfully.`,
          "Style Deleted"
        );
        setDeleteTarget(null);
        fetchStyles();
      } else {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "Failed to delete style");
      }
    } catch (err: any) {
      toast.error(err.message || "Deletion failed", "Error");
    } finally {
      setActionLoading(false);
    }
  };

  const filteredStyles = styles.filter((style) => {
    const matchesSearch =
      style.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      style.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      style.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      style.slug.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;
    if (filterActive === "active") return style.isActive !== false;
    if (filterActive === "inactive") return style.isActive === false;
    return true;
  });

  const activeCount = styles.filter((s) => s.isActive !== false).length;
  const draftCount = styles.length - activeCount;

  return (
    <>
      <AdminHeader
        title="Dance Styles"
        subtitle="Manage the dance genres, curriculum highlights, syllabi bullet points, and promotional imagery featured on the homepage and dance styles page."
      >
        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-4 py-2 bg-dk-yellow text-black font-mono text-xs uppercase tracking-wider font-semibold hover:bg-yellow-400 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add Dance Style</span>
        </button>
      </AdminHeader>

      <main className="p-4 sm:p-6 lg:p-8 space-y-6 flex-1 max-w-7xl">
        {/* KPI & Filter Header */}
        <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <div className="px-3 py-2 bg-neutral-900 border border-neutral-800 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-dk-yellow" />
              <span className="text-xs font-mono uppercase text-neutral-400">Total:</span>
              <span className="text-xs font-mono font-semibold text-white">{styles.length}</span>
            </div>
            <div className="px-3 py-2 bg-neutral-900 border border-neutral-800 flex items-center gap-2">
              <Eye className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-mono uppercase text-neutral-400">Active:</span>
              <span className="text-xs font-mono font-semibold text-white">{activeCount}</span>
            </div>
            {draftCount > 0 && (
              <div className="px-3 py-2 bg-neutral-900 border border-neutral-800 flex items-center gap-2">
                <EyeOff className="w-4 h-4 text-neutral-500" />
                <span className="text-xs font-mono uppercase text-neutral-400">Drafts:</span>
                <span className="text-xs font-mono font-semibold text-white">{draftCount}</span>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
            <div className="relative flex-1 sm:w-64 min-w-0">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search styles..."
                className="w-full bg-neutral-900 border border-neutral-800 pl-9 pr-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-dk-yellow font-mono min-h-[38px]"
              />
            </div>
            <div className="flex border border-neutral-800 bg-neutral-900 w-full sm:w-auto">
              <button
                onClick={() => setFilterActive("all")}
                className={`flex-1 sm:flex-none px-3.5 py-2 text-xs font-mono uppercase transition-colors text-center ${
                  filterActive === "all" ? "bg-white text-black font-semibold" : "text-neutral-400 hover:text-white"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilterActive("active")}
                className={`flex-1 sm:flex-none px-3.5 py-2 text-xs font-mono uppercase transition-colors text-center ${
                  filterActive === "active" ? "bg-white text-black font-semibold" : "text-neutral-400 hover:text-white"
                }`}
              >
                Active
              </button>
              <button
                onClick={() => setFilterActive("inactive")}
                className={`flex-1 sm:flex-none px-3.5 py-2 text-xs font-mono uppercase transition-colors text-center ${
                  filterActive === "inactive" ? "bg-white text-black font-semibold" : "text-neutral-400 hover:text-white"
                }`}
              >
                Draft
              </button>
            </div>
          </div>
        </div>

        
        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center gap-3 text-neutral-500">
            <Loader2 className="w-8 h-8 animate-spin text-dk-yellow" />
            <p className="text-xs font-mono uppercase tracking-wider">Loading dance styles...</p>
          </div>
        ) : filteredStyles.length === 0 ? (
          <div className="py-20 border border-dashed border-neutral-800 text-center p-8 space-y-4">
            <Sparkles className="w-10 h-10 text-neutral-600 mx-auto" />
            <div className="space-y-1">
              <h3 className="text-base font-mono uppercase text-white">No Dance Styles Found</h3>
              <p className="text-xs font-mono text-neutral-500">
                {searchQuery ? "Try refining your search query." : "Get started by adding your first dance style."}
              </p>
            </div>
            {!searchQuery && (
              <button
                onClick={handleOpenAdd}
                className="inline-flex items-center gap-2 px-4 py-2 bg-dk-yellow text-black font-mono text-xs uppercase tracking-wider font-semibold hover:bg-yellow-400"
              >
                <Plus className="w-4 h-4" />
                <span>Add First Dance Style</span>
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStyles.map((style) => {
              const isActive = style.isActive !== false;

              return (
                <div
                  key={style._id || style.slug}
                  className={`group relative bg-neutral-950 border flex flex-col transition-all duration-300 min-w-0 max-w-full overflow-hidden ${
                    isActive ? "border-neutral-800 hover:border-neutral-700" : "border-neutral-900 opacity-70"
                  }`}
                >
                  {/* Top Image Preview Banner */}
                  <div className="relative aspect-[16/10] w-full bg-neutral-900 overflow-hidden border-b border-neutral-800/80">
                    {style.image ? (
                      <Image
                        src={style.image}
                        alt={style.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-neutral-600 gap-1">
                        <Sparkles className="w-8 h-8 opacity-30" />
                        <span className="text-[10px] font-mono uppercase">No photo uploaded</span>
                      </div>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/20 to-transparent" />

                    {/* Number & Active Badges */}
                    <div className="absolute top-3 left-3 flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-black/80 backdrop-blur-md border border-white/20 text-dk-yellow font-mono text-[11px] font-bold tracking-widest">
                        {style.number}
                      </span>
                      <span className="px-2 py-0.5 bg-neutral-900/90 border border-neutral-700 text-neutral-300 font-mono text-[10px] uppercase">
                        Order #{style.displayOrder}
                      </span>
                    </div>

                    <div className="absolute top-3 right-3">
                      <button
                        onClick={() => handleToggleActive(style)}
                        title={isActive ? "Click to set Draft" : "Click to Publish"}
                        className={`px-2 py-0.5 text-[10px] font-mono uppercase font-semibold flex items-center gap-1.5 transition-colors ${
                          isActive
                            ? "bg-emerald-950/80 border border-emerald-500/50 text-emerald-400"
                            : "bg-neutral-900/80 border border-neutral-700 text-neutral-400"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            isActive ? "bg-emerald-400 animate-pulse" : "bg-neutral-500"
                          }`}
                        />
                        {isActive ? "Active" : "Draft"}
                      </button>
                    </div>

                    <div className="absolute bottom-3 left-3 right-3 min-w-0">
                      <h3 className="text-xl font-heading font-light tracking-wide text-white uppercase break-words [overflow-wrap:anywhere]">
                        {style.name}
                      </h3>
                      <p className="text-[11px] font-mono text-dk-yellow/90 truncate">
                        /{style.slug}
                      </p>
                    </div>
                  </div>

                  
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4 min-w-0 max-w-full">
                    <div className="space-y-3 min-w-0 max-w-full">
                      <p className="text-xs text-neutral-300 font-medium leading-relaxed line-clamp-2 break-words [overflow-wrap:anywhere]">
                        {style.tagline || "No summary tagline provided."}
                      </p>

                      <ExpandableText
                        text={style.description || "No full description provided."}
                        limit={120}
                        className="text-[11px] text-neutral-400 leading-relaxed font-light break-words [overflow-wrap:anywhere]"
                      />

                      
                      {Array.isArray(style.features) && style.features.length > 0 && (
                        <div className="pt-2 border-t border-neutral-900 flex flex-wrap gap-1.5">
                          {style.features.slice(0, 3).map((feat, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 bg-neutral-900 border border-neutral-800 text-[10px] font-mono text-neutral-400 truncate max-w-[180px]"
                            >
                              • {feat}
                            </span>
                          ))}
                          {style.features.length > 3 && (
                            <span className="px-1.5 py-0.5 text-[10px] font-mono text-dk-yellow">
                              +{style.features.length - 3} more
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    
                    <div className="pt-3 border-t border-neutral-900 flex items-center justify-between gap-2">
                      <button
                        onClick={() => handleOpenEdit(style)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-neutral-900 hover:bg-white hover:text-black text-neutral-300 border border-neutral-800 text-xs font-mono uppercase tracking-wider transition-colors"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>

                      <button
                        onClick={() => setDeleteTarget(style)}
                        className="p-2 bg-neutral-900 hover:bg-dk-red/20 text-neutral-400 hover:text-dk-red border border-neutral-800 hover:border-dk-red/50 transition-colors"
                        title="Delete dance style"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Add / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingStyle ? `Edit Style: ${editingStyle.name}` : "Add New Dance Style"}
        maxWidth="lg"
      >
        <form onSubmit={handleSave} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                Style Number *
              </label>
              <input
                type="text"
                required
                value={formData.number}
                onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                placeholder="01"
                className="w-full bg-black border border-neutral-800 px-3 py-2 text-xs text-white focus:outline-none focus:border-dk-yellow font-mono"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                Dance Style Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g. BOLLYWOOD, HIP-HOP, CONTEMPORARY"
                className="w-full bg-black border border-neutral-800 px-3 py-2 text-xs text-white focus:outline-none focus:border-dk-yellow font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                URL Slug *
              </label>
              <input
                type="text"
                required
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="e.g. bollywood"
                className="w-full bg-black border border-neutral-800 px-3 py-2 text-xs text-white focus:outline-none focus:border-dk-yellow font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                Display Order
              </label>
              <input
                type="number"
                min="1"
                value={formData.displayOrder}
                onChange={(e) =>
                  setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 1 })
                }
                className="w-full bg-black border border-neutral-800 px-3 py-2 text-xs text-white focus:outline-none focus:border-dk-yellow font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
              Tagline (Headline Overview)
            </label>
            <input
              type="text"
              value={formData.tagline}
              onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
              placeholder="e.g. High-energy commercial, cinematic, and semi-classical fusion choreography"
              className="w-full bg-black border border-neutral-800 px-3 py-2 text-xs text-white focus:outline-none focus:border-dk-yellow font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
              Detailed Description
            </label>
            <textarea
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="In-depth explanation of the dance style, movement dynamics, curriculum approach, and performance outcomes..."
              className="w-full bg-black border border-neutral-800 px-3 py-2 text-xs text-white focus:outline-none focus:border-dk-yellow font-mono resize-none leading-relaxed"
            />
          </div>

          {/* Style Cover Image with UploadThing preview */}
          <MediaUploaderWithPreview
            label="Style High-Resolution Imagery"
            value={formData.image}
            fileKey={formData.imageKey}
            onChange={({ url, key }) => {
              setFormData((prev) => ({
                ...prev,
                image: url,
                imageKey: key || prev.imageKey,
              }));
              toast.success("Cover image attached successfully!");
            }}
            onClear={() => {
              setFormData((prev) => ({ ...prev, image: "", imageKey: "" }));
            }}
            placeholder="https://... or /images/gallery/..."
          />

          {/* Features List Manager */}
          <div className="space-y-2 pt-2 border-t border-neutral-900">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-mono uppercase text-neutral-400">
                Key Curriculum & Syllabus Points ({formData.features.length})
              </label>
              <span className="text-[10px] font-mono text-neutral-500">
                Type bullet point and press Enter
              </span>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={featureInput}
                onChange={(e) => setFeatureInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddFeature();
                  }
                }}
                placeholder="e.g. Commercial Choreography, Facial Expressions, Spatial Awareness"
                className="flex-1 bg-black border border-neutral-800 px-3 py-2 text-xs text-white focus:outline-none focus:border-dk-yellow font-mono"
              />
              <button
                type="button"
                onClick={handleAddFeature}
                className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white border border-neutral-700 text-xs font-mono uppercase transition-colors"
              >
                Add
              </button>
            </div>

            {formData.features.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {formData.features.map((feat, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-neutral-900 border border-neutral-800 text-xs font-mono text-neutral-300"
                  >
                    <span>{feat}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveFeature(idx)}
                      className="text-neutral-500 hover:text-dk-red ml-1"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Active Status Checkbox */}
          <div className="flex items-center gap-3 pt-3 border-t border-neutral-900">
            <label className="relative flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-neutral-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-dk-yellow"></div>
            </label>
            <div>
              <span className="text-xs font-mono uppercase text-white block">
                {formData.isActive ? "Published (Active on site)" : "Draft (Hidden from site)"}
              </span>
              <span className="text-[10px] font-mono text-neutral-500">
                Draft styles stay saved here, but won&apos;t be shown to website visitors.
              </span>
            </div>
          </div>

          <div className="pt-4 border-t border-neutral-900 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 border border-neutral-800 text-xs font-mono uppercase text-neutral-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={actionLoading}
              className="px-6 py-2 bg-dk-yellow hover:bg-yellow-400 text-black text-xs font-mono uppercase font-semibold tracking-wider transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {actionLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>{editingStyle ? "Update Style" : "Create Style"}</span>
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        title="Delete Dance Style"
        message={`Are you sure you want to permanently delete "${deleteTarget?.name}"? Its cover photo and all details will be removed.`}
        confirmText="Permanently Delete"
        isLoading={actionLoading}
        isDestructive={true}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </>
  );
}
