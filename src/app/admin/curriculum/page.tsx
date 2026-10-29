"use client";

import React, { useState, useEffect } from "react";
import {
  Plus,
  GraduationCap,
  Edit2,
  Trash2,
  Check,
  X,
  Loader2,
  Search,
  Eye,
  EyeOff,
  Dumbbell,
  Sparkles,
} from "lucide-react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { Modal } from "@/components/ui/Modal";
import { CurriculumModule } from "@/types";
import { useToast } from "@/context/ToastContext";
import { adminFetch } from "@/lib/admin-fetch";
import { ExpandableText } from "@/components/ui/ExpandableText";

export default function AdminCurriculumPage() {
  const toast = useToast();
  const [modules, setModules] = useState<CurriculumModule[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterActive, setFilterActive] = useState<"all" | "active" | "inactive">("all");

  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingModule, setEditingModule] = useState<CurriculumModule | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<CurriculumModule | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  
  const [formData, setFormData] = useState<Omit<CurriculumModule, "_id">>({
    title: "",
    desc: "",
    badge: "CONDITIONING",
    displayOrder: 1,
    isActive: true,
  });

  const fetchModules = async () => {
    try {
      setLoading(true);
      const res = await adminFetch("/api/curriculum?all=true");
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setModules(
          [...data.data].sort(
            (a, b) => (Number(a.displayOrder) || 1) - (Number(b.displayOrder) || 1)
          )
        );
      }
    } catch (err) {
      console.error("Failed to load curriculum modules:", err);
      toast.error("Failed to load training modules. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchModules();
  }, []);

  const handleOpenAdd = () => {
    setEditingModule(null);
    const nextOrder = modules.length + 1;
    setFormData({
      title: "",
      desc: "",
      badge: "CONDITIONING",
      displayOrder: nextOrder,
      isActive: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (mod: CurriculumModule) => {
    setEditingModule(mod);
    setFormData({
      title: mod.title || "",
      desc: mod.desc || "",
      badge: mod.badge || "CONDITIONING",
      displayOrder: mod.displayOrder ?? 1,
      isActive: mod.isActive !== false,
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.desc.trim()) {
      toast.error("Module title and description are required.", "Validation Error");
      return;
    }

    setActionLoading(true);
    try {
      if (editingModule && editingModule._id) {
        const res = await adminFetch(`/api/curriculum/${editingModule._id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || "Update failed");
        }
      } else {
        const res = await adminFetch("/api/curriculum", {
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
      setEditingModule(null);
      await fetchModules();
      toast.success(
        editingModule
          ? `"${formData.title}" module updated successfully.`
          : `"${formData.title}" module created successfully.`,
        "Saved Successfully"
      );
    } catch (err: any) {
      toast.error(err.message || "Failed to save curriculum module", "Save Failed");
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleActive = async (mod: CurriculumModule) => {
    if (!mod._id) return;
    try {
      const nextActive = !mod.isActive;
      const res = await adminFetch(`/api/curriculum/${mod._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: nextActive }),
      });
      if (res.ok) {
        setModules((prev) =>
          prev.map((m) =>
            m._id === mod._id ? { ...m, isActive: nextActive } : m
          )
        );
        toast.info(
          nextActive
            ? `"${mod.title}" is now active on the public website.`
            : `"${mod.title}" is now deactivated.`,
          "Status Updated"
        );
      } else {
        toast.error("Failed to update module status.");
      }
    } catch (err) {
      console.error("Toggle active status failed:", err);
      toast.error("Network error while updating module status.");
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget || !deleteTarget._id) return;
    setActionLoading(true);
    try {
      const res = await adminFetch(`/api/curriculum/${deleteTarget._id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setModules((prev) => prev.filter((m) => m._id !== deleteTarget._id));
        toast.success(`"${deleteTarget.title}" module removed.`, "Module Deleted");
        setDeleteTarget(null);
        fetchModules();
      } else {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "Failed to delete module");
      }
    } catch (err: any) {
      toast.error(err.message || "Deletion failed", "Error");
    } finally {
      setActionLoading(false);
    }
  };

  const filteredModules = modules.filter((mod) => {
    const matchesSearch =
      mod.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mod.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (mod.badge && mod.badge.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;
    if (filterActive === "active") return mod.isActive !== false;
    if (filterActive === "inactive") return mod.isActive === false;
    return true;
  });

  const activeCount = modules.filter((m) => m.isActive !== false).length;
  const draftCount = modules.length - activeCount;

  return (
    <>
      <AdminHeader
        title="Curriculum"
        subtitle="Manage foundational conditioning modules, body mechanics, kinetic drilling syllabus, and flexibility routines featured on the homepage and dance styles curriculum."
      >
        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-4 py-2 bg-dk-yellow text-black font-mono text-xs uppercase tracking-wider font-semibold hover:bg-yellow-400 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add Module</span>
        </button>
      </AdminHeader>

      <main className="p-4 sm:p-6 lg:p-8 space-y-6 flex-1 max-w-7xl">
        {/* KPI & Filter Header */}
        <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <div className="px-3 py-2 bg-neutral-900 border border-neutral-800 flex items-center gap-2">
              <Dumbbell className="w-4 h-4 text-dk-yellow" />
              <span className="text-xs font-mono uppercase text-neutral-400">Total:</span>
              <span className="text-xs font-mono font-semibold text-white">{modules.length}</span>
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
                placeholder="Search modules..."
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
            <p className="text-xs font-mono uppercase tracking-wider">Loading curriculum...</p>
          </div>
        ) : filteredModules.length === 0 ? (
          <div className="py-20 border border-dashed border-neutral-800 text-center p-6 sm:p-8 space-y-4">
            <GraduationCap className="w-10 h-10 text-neutral-600 mx-auto" />
            <div className="space-y-1">
              <h3 className="text-base font-mono uppercase text-white">No Curriculum Modules Found</h3>
              <p className="text-xs font-mono text-neutral-500">
                {searchQuery ? "Try refining your search query." : "Get started by adding your first training module."}
              </p>
            </div>
            {!searchQuery && (
              <button
                onClick={handleOpenAdd}
                className="inline-flex items-center gap-2 px-4 py-2 bg-dk-yellow text-black font-mono text-xs uppercase tracking-wider font-semibold hover:bg-yellow-400"
              >
                <Plus className="w-4 h-4" />
                <span>Add First Module</span>
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredModules.map((mod) => {
              const isActive = mod.isActive !== false;

              return (
                <div
                  key={mod._id}
                  className={`group relative bg-neutral-950 border flex flex-col justify-between p-4 sm:p-6 transition-all duration-300 min-w-0 max-w-full overflow-hidden ${
                    isActive ? "border-neutral-800 hover:border-neutral-700" : "border-neutral-900 opacity-70"
                  }`}
                >
                  <div className="space-y-4 min-w-0 max-w-full">
                    
                    <div className="flex items-center justify-between gap-2 min-w-0">
                      <div className="flex items-center gap-2 min-w-0 truncate">
                        <span className="px-2 py-0.5 bg-dk-yellow/10 border border-dk-yellow/30 text-dk-yellow font-mono text-[10px] uppercase font-bold tracking-wider truncate">
                          {mod.badge || "CONDITIONING"}
                        </span>
                        <span className="px-1.5 py-0.5 bg-neutral-900 border border-neutral-800 text-neutral-400 font-mono text-[10px] shrink-0">
                          #{mod.displayOrder}
                        </span>
                      </div>

                      <button
                        onClick={() => handleToggleActive(mod)}
                        title={isActive ? "Click to set Draft" : "Click to Publish"}
                        className={`px-2 py-0.5 text-[10px] font-mono uppercase font-semibold flex items-center gap-1.5 transition-colors shrink-0 ${
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

                    
                    <div className="space-y-2 min-w-0 max-w-full">
                      <h3 className="text-lg font-heading font-light tracking-wide text-white uppercase break-words [overflow-wrap:anywhere]">
                        {mod.title}
                      </h3>
                      <ExpandableText
                        text={mod.desc}
                        limit={120}
                        className="text-xs text-neutral-400 leading-relaxed font-light break-words [overflow-wrap:anywhere]"
                      />
                    </div>
                  </div>

                  
                  <div className="pt-5 mt-6 border-t border-neutral-900 flex items-center justify-between gap-2">
                    <button
                      onClick={() => handleOpenEdit(mod)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-neutral-900 hover:bg-white hover:text-black text-neutral-300 border border-neutral-800 text-xs font-mono uppercase tracking-wider transition-colors"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>

                    <button
                      onClick={() => setDeleteTarget(mod)}
                      className="p-2 bg-neutral-900 hover:bg-dk-red/20 text-neutral-400 hover:text-dk-red border border-neutral-800 hover:border-dk-red/50 transition-colors"
                      title="Delete module"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
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
        title={editingModule ? `Edit Module: ${editingModule.title}` : "Add Training Module"}
        maxWidth="md"
      >
        <form onSubmit={handleSave} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                Module Title *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Basic Movements, Tutting, Footwork"
                className="w-full bg-black border border-neutral-800 px-3 py-2 text-xs text-white focus:outline-none focus:border-dk-yellow font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                Badge / Tag
              </label>
              <input
                type="text"
                value={formData.badge}
                onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                placeholder="CONDITIONING"
                className="w-full bg-black border border-neutral-800 px-3 py-2 text-xs text-white focus:outline-none focus:border-dk-yellow font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
              Description *
            </label>
            <textarea
              rows={4}
              required
              value={formData.desc}
              onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
              placeholder="e.g. Fundamental isolations, posture alignment, weight shifting, and dynamic spatial awareness."
              className="w-full bg-black border border-neutral-800 px-3 py-2 text-xs text-white focus:outline-none focus:border-dk-yellow font-mono resize-none leading-relaxed"
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
                Controls visibility inside Special Training Curriculum section.
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
              <span>{editingModule ? "Update Module" : "Create Module"}</span>
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        title="Delete Curriculum Module"
        message={`Are you sure you want to permanently delete "${deleteTarget?.title}"?`}
        confirmText="Permanently Delete"
        isLoading={actionLoading}
        isDestructive={true}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </>
  );
}
