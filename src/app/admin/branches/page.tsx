"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Plus,
  MapPin,
  Edit2,
  Trash2,
  Check,
  X,
  ExternalLink,
  Loader2,
} from "lucide-react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { Modal } from "@/components/ui/Modal";
import { Branch } from "@/types";
import { useToast } from "@/context/ToastContext";
import { UploadButton } from "@/lib/uploadthing";
import { adminFetch } from "@/lib/admin-fetch";
import { MediaUploaderWithPreview } from "@/components/admin/MediaUploaderWithPreview";
import { ExpandableText } from "@/components/ui/ExpandableText";

export default function AdminBranchesPage() {
  const toast = useToast();
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);

  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState<Branch | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Branch | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const [formData, setFormData] = useState<Omit<Branch, "_id">>({
    name: "",
    slug: "",
    country: "India",
    state: "Kerala",
    city: "Kozhikode",
    address: "",
    phone: "+91 9995 272 083",
    whatsapp: "919995272083",
    googleMapsUrl: "",
    latitude: undefined,
    longitude: undefined,
    description: "",
    imageUrl: "",
    imageKey: "",
    classTimings: "",
    isActive: true,
    displayOrder: 1,
  });

  const fetchBranches = async () => {
    try {
      setLoading(true);
      const res = await adminFetch("/api/branches?all=true");
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setBranches(
          [...data.data].sort(
            (a, b) => (Number(a.displayOrder) || 1) - (Number(b.displayOrder) || 1)
          )
        );
      }
    } catch (err) {
      console.error("Failed to load branches:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBranches();
  }, []);

  const handleOpenAdd = () => {
    setEditingBranch(null);
    setFormData({
      name: "",
      slug: "",
      country: "India",
      state: "Kerala",
      city: "Kozhikode",
      address: "",
      phone: "+91 9995 272 083",
      whatsapp: "919995272083",
      googleMapsUrl: "",
      description: "",
      imageUrl: "",
      imageKey: "",
      classTimings: "",
      isActive: true,
      displayOrder: branches.length + 1,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (branch: Branch) => {
    setEditingBranch(branch);
    setFormData({
      name: branch.name,
      slug: branch.slug,
      country: branch.country || "India",
      state: branch.state || "Kerala",
      city: branch.city || "Kozhikode",
      address: branch.address || "",
      phone: branch.phone || "+91 9995 272 083",
      whatsapp: branch.whatsapp || "919995272083",
      googleMapsUrl: branch.googleMapsUrl || "",
      latitude: branch.latitude,
      longitude: branch.longitude,
      description: branch.description || "",
      imageUrl: branch.imageUrl || "",
      imageKey: branch.imageKey || "",
      classTimings: branch.classTimings || "",
      isActive: branch.isActive,
      displayOrder: branch.displayOrder || 1,
    });
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
      slug: editingBranch ? prev.slug : generatedSlug,
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.slug.trim()) {
      toast.error("Branch name and slug are required.", "Validation Error");
      return;
    }

    setActionLoading(true);
    try {
      if (editingBranch) {
        const res = await adminFetch(`/api/branches/${editingBranch._id || editingBranch.slug}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || "Update failed");
        }
      } else {
        const res = await adminFetch("/api/branches", {
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
      setEditingBranch(null);
      await fetchBranches();
      toast.success(
        editingBranch ? `"${formData.name}" branch updated successfully.` : `"${formData.name}" branch created.`,
        "Branch Saved"
      );
    } catch (err: any) {
      toast.error(err.message || "Failed to save branch", "Save Failed");
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleActive = async (branch: Branch) => {
    try {
      const nextActive = !branch.isActive;
      const res = await adminFetch(`/api/branches/${branch._id || branch.slug}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: nextActive }),
      });
      if (res.ok) {
        setBranches((prev) =>
          prev.map((b) =>
            b.slug === branch.slug ? { ...b, isActive: nextActive } : b
          )
        );
        toast.info(
          nextActive ? `"${branch.name}" is now active on the public website.` : `"${branch.name}" is now deactivated.`,
          "Status Updated"
        );
      } else {
        toast.error("Failed to update branch status.");
      }
    } catch (err) {
      console.error("Toggle active status failed:", err);
      toast.error("Network error while updating branch status.");
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setActionLoading(true);
    try {
      const targetId = deleteTarget._id || deleteTarget.slug;
      const res = await adminFetch(`/api/branches/${targetId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setBranches((prev) =>
          prev.filter((b) => (deleteTarget._id ? b._id !== deleteTarget._id : b.slug !== deleteTarget.slug))
        );
        toast.success(`"${deleteTarget.name}" branch removed from directory.`, "Branch Deleted");
        setDeleteTarget(null);
        fetchBranches();
      } else {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "Failed to delete branch");
      }
    } catch (err: any) {
      toast.error(err.message || "Deletion failed", "Error");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <>
      <AdminHeader
        title="Branch Management"
        subtitle="Configure studio locations, Google Maps directions, and class schedules"
      >
        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-white text-black hover:bg-dk-yellow font-heading font-light text-xs uppercase tracking-widest transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Branch</span>
        </button>
      </AdminHeader>

      <main className="p-4 sm:p-6 lg:p-8 space-y-6 flex-1 max-w-7xl">
        {loading ? (
          <div className="py-24 text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-dk-yellow mb-2" />
            <p className="text-xs font-mono text-neutral-500 uppercase">
              Loading branches...
            </p>
          </div>
        ) : branches.length === 0 ? (
          <div className="py-24 text-center border border-dashed border-neutral-800 bg-neutral-950 p-6 sm:p-8">
            <p className="text-neutral-400 font-mono text-xs uppercase tracking-wider mb-4">
              No branch studios registered yet.
            </p>
            <button
              onClick={handleOpenAdd}
              className="px-4 py-2 bg-neutral-900 border border-neutral-800 text-xs font-mono uppercase text-dk-yellow"
            >
              Add First Branch
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {branches.map((b) => (
              <div
                key={b.slug}
                className="bg-neutral-950 border border-neutral-800 flex flex-col justify-between overflow-hidden group"
              >
                
                <div className="relative aspect-[16/9] bg-neutral-900 overflow-hidden">
                  {b.imageUrl ? (
                    <Image
                      src={b.imageUrl}
                      alt={b.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="350px"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-neutral-900/90 p-4 text-center border-b border-neutral-800">
                      <div className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center mb-1 text-neutral-400">
                        <MapPin className="w-5 h-5 text-dk-yellow" />
                      </div>
                      <span className="text-[11px] font-mono text-neutral-300 uppercase tracking-wider">
                        No Studio Photo
                      </span>
                      <span className="text-[9px] font-mono text-neutral-500 uppercase">
                        Click edit to upload
                      </span>
                    </div>
                  )}
                  <div className="absolute top-2 right-2">
                    <button
                      onClick={() => handleToggleActive(b)}
                      title={b.isActive ? "Active (Click to deactivate)" : "Inactive (Click to activate)"}
                      className={`px-2 py-1 text-[10px] font-mono uppercase font-normal ${
                        b.isActive
                          ? "bg-black/90 text-[#25D366] border border-[#25D366]/40"
                          : "bg-black/90 text-neutral-500 border border-neutral-800"
                      }`}
                    >
                      {b.isActive ? "Active" : "Inactive"}
                    </button>
                  </div>
                  <div className="absolute bottom-2 left-2">
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 bg-black/80 text-white">
                      Order: {b.displayOrder}
                    </span>
                  </div>
                </div>

                
                <div className="p-5 flex-1 flex flex-col justify-between min-w-0 max-w-full">
                  <div className="min-w-0 max-w-full">
                    <div className="flex items-center gap-1.5 text-[10px] font-mono text-neutral-500 uppercase mb-1 min-w-0">
                      <MapPin className="w-3 h-3 text-dk-red shrink-0" />
                      <span className="break-words [overflow-wrap:anywhere]">{b.city}, {b.country}</span>
                    </div>
                    <h3 className="text-lg font-heading font-light uppercase text-white mb-2 break-words [overflow-wrap:anywhere]">
                      {b.name}
                    </h3>
                    <div className="mb-3">
                      <ExpandableText
                        text={b.description || "Studio branch in " + b.city}
                        limit={120}
                        className="text-xs text-neutral-400 break-words [overflow-wrap:anywhere]"
                      />
                    </div>
                    {b.address && (
                      <p className="text-[11px] font-mono text-neutral-500 mb-2 break-words [overflow-wrap:anywhere]">
                        Address: {b.address}
                      </p>
                    )}
                    {b.googleMapsUrl && (
                      <a
                        href={b.googleMapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] font-mono uppercase text-dk-yellow hover:underline mb-2"
                      >
                        <span>Verified Location Link</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>

                  
                  <div className="pt-4 border-t border-neutral-900 flex items-center justify-between">
                    <a
                      href={`/branches/${b.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] font-mono text-neutral-400 hover:text-white"
                    >
                      View Live Page →
                    </a>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOpenEdit(b)}
                        aria-label="Edit branch"
                        className="p-1.5 text-neutral-400 hover:text-white"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(b)}
                        aria-label="Delete branch"
                        className="p-1.5 text-neutral-400 hover:text-dk-red"
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

      {/* Add / Edit Branch Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingBranch ? `Edit ${editingBranch.name} Branch` : "Add New Studio Branch"}
        maxWidth="lg"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                Branch Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g. Kunduparamba"
                className="w-full bg-black border border-neutral-800 px-3 py-2 text-xs text-white focus:outline-none focus:border-dk-yellow"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                Slug (URL Identifier) *
              </label>
              <input
                type="text"
                required
                value={formData.slug}
                onChange={(e) =>
                  setFormData({ ...formData, slug: e.target.value })
                }
                placeholder="e.g. kunduparamba"
                className="w-full bg-black border border-neutral-800 px-3 py-2 text-xs text-white focus:outline-none focus:border-dk-yellow font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                City *
              </label>
              <input
                type="text"
                required
                value={formData.city}
                onChange={(e) =>
                  setFormData({ ...formData, city: e.target.value })
                }
                className="w-full bg-black border border-neutral-800 px-3 py-2 text-xs text-white focus:outline-none focus:border-dk-yellow"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                State
              </label>
              <input
                type="text"
                value={formData.state}
                onChange={(e) =>
                  setFormData({ ...formData, state: e.target.value })
                }
                className="w-full bg-black border border-neutral-800 px-3 py-2 text-xs text-white focus:outline-none focus:border-dk-yellow"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                Country *
              </label>
              <input
                type="text"
                required
                value={formData.country}
                onChange={(e) =>
                  setFormData({ ...formData, country: e.target.value })
                }
                className="w-full bg-black border border-neutral-800 px-3 py-2 text-xs text-white focus:outline-none focus:border-dk-yellow"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
              Studio Address
            </label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
              placeholder="e.g. 2nd Floor, Near Main Junction, Kunduparamba"
              className="w-full bg-black border border-neutral-800 px-3 py-2 text-xs text-white focus:outline-none focus:border-dk-yellow"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
              Google Maps URL (Official Link)
            </label>
            <input
              type="url"
              value={formData.googleMapsUrl}
              onChange={(e) =>
                setFormData({ ...formData, googleMapsUrl: e.target.value })
              }
              placeholder="https://maps.google.com/?q=..."
              className="w-full bg-black border border-neutral-800 px-3 py-2 text-xs text-white focus:outline-none focus:border-dk-yellow font-mono"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                Phone Number
              </label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                placeholder="+91 9995 272 083"
                className="w-full bg-black border border-neutral-800 px-3 py-2 text-xs text-white focus:outline-none focus:border-dk-yellow"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                WhatsApp Number (e.g. 919995272083)
              </label>
              <input
                type="text"
                value={formData.whatsapp}
                onChange={(e) =>
                  setFormData({ ...formData, whatsapp: e.target.value })
                }
                placeholder="919995272083"
                className="w-full bg-black border border-neutral-800 px-3 py-2 text-xs text-white focus:outline-none focus:border-dk-yellow font-mono"
              />
            </div>
          </div>

          {/* Studio Image File Upload & Instant Preview */}
          <MediaUploaderWithPreview
            label="Studio Branch Photo"
            value={formData.imageUrl}
            fileKey={formData.imageKey}
            onChange={({ url, key }) => {
              setFormData((prev) => ({
                ...prev,
                imageUrl: url,
                imageKey: key || prev.imageKey,
              }));
              toast.success("Studio photo attached successfully!");
            }}
            onClear={() => {
              setFormData((prev) => ({ ...prev, imageUrl: "", imageKey: "" }));
            }}
            placeholder="https://... or /images/..."
          />

          <div>
            <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
              Class Timetable / Schedule Notes
            </label>
            <input
              type="text"
              value={formData.classTimings}
              onChange={(e) =>
                setFormData({ ...formData, classTimings: e.target.value })
              }
              placeholder="e.g. Weekday batches: Tue & Thu 5 PM - 7 PM"
              className="w-full bg-black border border-neutral-800 px-3 py-2 text-xs text-white focus:outline-none focus:border-dk-yellow"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
              Studio Description
            </label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Overview of dance floor, facilities, and programs at this studio..."
              className="w-full bg-black border border-neutral-800 px-3 py-2 text-xs text-white focus:outline-none focus:border-dk-yellow resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            <div>
              <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                Display Order
              </label>
              <input
                type="number"
                value={formData.displayOrder}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    displayOrder: Number(e.target.value),
                  })
                }
                className="w-full bg-black border border-neutral-800 px-3 py-2 text-xs text-white focus:outline-none focus:border-dk-yellow"
              />
            </div>

            <div className="flex items-center gap-2 pt-0 sm:pt-5">
              <input
                id="isActive"
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) =>
                  setFormData({ ...formData, isActive: e.target.checked })
                }
                className="w-4 h-4 rounded-none accent-dk-yellow cursor-pointer"
              />
              <label
                htmlFor="isActive"
                className="text-xs font-mono uppercase text-neutral-300 cursor-pointer select-none"
              >
                Active Branch on Website
              </label>
            </div>
          </div>

          <div className="pt-4 border-t border-neutral-900 flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="w-full sm:w-auto px-4 py-2.5 min-h-[44px] sm:min-h-0 text-xs font-mono uppercase text-neutral-400 hover:text-white text-center cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={actionLoading}
              className="w-full sm:w-auto px-6 py-2.5 min-h-[44px] sm:min-h-0 bg-white text-black hover:bg-dk-yellow font-heading font-light text-xs uppercase tracking-wider transition-colors disabled:opacity-50 text-center cursor-pointer"
            >
              {actionLoading ? "Saving..." : "Save Branch"}
            </button>
          </div>
        </form>
      </Modal>

      
      <ConfirmDialog
        isOpen={deleteTarget !== null}
        title="Delete Branch?"
        message={`Are you sure you want to delete the "${deleteTarget?.name}" branch studio? This action will remove it from the website directory.`}
        confirmText="Delete Branch"
        isDestructive={true}
        isLoading={actionLoading}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </>
  );
}
