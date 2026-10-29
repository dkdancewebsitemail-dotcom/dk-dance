import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  MapPin,
  Image as ImageIcon,
  Video,
  Inbox,
  Sparkles,
  GraduationCap,
  Star,
  HardDrive,
  AlertTriangle,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { getAuthSession } from "@/lib/auth";
import {
  getBranches,
  getMedia,
  getEnquiries,
  getDanceStyles,
  getCurriculumModules,
  getReviews,
} from "@/lib/db-services";
import { getUploadThingStorageUsage } from "@/lib/uploadthing-server";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const session = await getAuthSession();
  if (!session) {
    redirect("/admin/login");
  }

  const [
    branches,
    mediaItems,
    enquiries,
    danceStyles,
    curriculum,
    reviews,
    storageUsage,
  ] = await Promise.all([
    getBranches(),
    getMedia(),
    getEnquiries(),
    getDanceStyles(),
    getCurriculumModules(),
    getReviews(),
    getUploadThingStorageUsage(),
  ]);

  const publishedReviews = reviews.filter(
    (r) => r.published !== false
  ).length;

  const publishedImages = mediaItems.filter(
    (m) => m.type === "image" && m.published
  ).length;

  const publishedVideos = mediaItems.filter(
    (m) => m.type === "video" && m.published
  ).length;

  const newEnquiriesCount = enquiries.filter(
    (e) => e.status === "new"
  ).length;

  const recentEnquiries = enquiries.slice(0, 5);

  return (
    <>
      <AdminHeader
        title="Admin Overview"
        subtitle={`Signed in as ${session.username} • Role: ${session.role}`}
      >
        <Link
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-900 border border-neutral-800 text-xs font-mono uppercase text-neutral-300 hover:text-white hover:border-neutral-700 transition-colors"
        >
          <span>Open Public Site</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </AdminHeader>

      <main className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 flex-1 max-w-7xl">
        {/* Cloud Storage Warning Banner if usage reaches 1 GB (50%) or higher */}
        {storageUsage.isWarning && (
          <div
            className={`p-4 border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
              storageUsage.isCritical
                ? "bg-red-950/30 border-dk-red text-red-200"
                : "bg-amber-950/30 border-amber-500/60 text-amber-200"
            }`}
          >
            <div className="flex items-start sm:items-center gap-3">
              <AlertTriangle
                className={`w-5 h-5 shrink-0 mt-0.5 sm:mt-0 ${
                  storageUsage.isCritical ? "text-dk-red" : "text-amber-400"
                }`}
              />
              <div>
                <p className="text-xs sm:text-sm font-medium">
                  {storageUsage.isCritical
                    ? "Storage Alert: Media space is almost full (85%+ used)!"
                    : "Storage Notice: More than half of your media space is used"}
                </p>
                <p className="text-[11px] font-mono text-neutral-400 mt-0.5">
                  You have used{" "}
                  <span className="font-semibold text-white">
                    {storageUsage.totalMb >= 1024
                      ? `${storageUsage.totalGb} GB`
                      : `${storageUsage.totalMb} MB`}
                  </span>{" "}
                  of your 2 GB total media storage space ({storageUsage.percentageUsed}% used across {storageUsage.filesUploaded} photos & videos).
                  Consider deleting old photos or videos to free up space for new uploads.
                </p>
              </div>
            </div>
            <Link
              href="/admin/media"
              className={`shrink-0 px-3.5 py-1.5 text-xs font-mono uppercase tracking-wider transition-colors border ${
                storageUsage.isCritical
                  ? "bg-dk-red text-white border-dk-red hover:bg-red-600"
                  : "bg-amber-400 text-black border-amber-400 hover:bg-amber-300 font-semibold"
              }`}
            >
              Manage Media Space →
            </Link>
          </div>
        )}

        {/* Metric Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          <div className="p-4 sm:p-6 bg-neutral-950 border border-neutral-800 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <span className="text-xs font-mono uppercase text-neutral-400">
                Dance Styles
              </span>
              <Sparkles className="w-4 h-4 text-dk-yellow" />
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl sm:text-4xl font-heading font-extralight text-white">
                  {danceStyles.filter((s) => s.isActive !== false).length}
                </span>
                <span className="text-xs font-mono text-neutral-500">
                  / {danceStyles.length} total
                </span>
              </div>
              <Link
                href="/admin/dance-styles"
                className="text-[11px] font-mono uppercase text-neutral-500 hover:text-dk-yellow mt-2 sm:mt-3 inline-block"
              >
                Manage dance styles →
              </Link>
            </div>
          </div>

          <div className="p-4 sm:p-6 bg-neutral-950 border border-neutral-800 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <span className="text-xs font-mono uppercase text-neutral-400">
                Curriculum Modules
              </span>
              <GraduationCap className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl sm:text-4xl font-heading font-extralight text-white">
                  {curriculum.filter((m) => m.isActive !== false).length}
                </span>
                <span className="text-xs font-mono text-neutral-500">
                  / {curriculum.length} total
                </span>
              </div>
              <Link
                href="/admin/curriculum"
                className="text-[11px] font-mono uppercase text-neutral-500 hover:text-white mt-2 sm:mt-3 inline-block"
              >
                Manage curriculum →
              </Link>
            </div>
          </div>

          <div className="p-4 sm:p-6 bg-neutral-950 border border-neutral-800 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <span className="text-xs font-mono uppercase text-neutral-400">
                Active Branches
              </span>
              <MapPin className="w-4 h-4 text-dk-yellow" />
            </div>
            <div>
              <span className="text-3xl sm:text-4xl font-heading font-extralight text-white block">
                {branches.length}
              </span>
              <Link
                href="/admin/branches"
                className="text-[11px] font-mono uppercase text-neutral-500 hover:text-dk-yellow mt-2 sm:mt-3 inline-block"
              >
                Manage branches →
              </Link>
            </div>
          </div>

          <div className="p-4 sm:p-6 bg-neutral-950 border border-neutral-800 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <span className="text-xs font-mono uppercase text-neutral-400">
                Google Reviews
              </span>
              <Star className="w-4 h-4 text-dk-yellow" />
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl sm:text-4xl font-heading font-extralight text-white">
                  {publishedReviews}
                </span>
                <span className="text-xs font-mono text-neutral-500">
                  / {reviews.length} total
                </span>
              </div>
              <Link
                href="/admin/reviews"
                className="text-[11px] font-mono uppercase text-neutral-500 hover:text-dk-yellow mt-2 sm:mt-3 inline-block"
              >
                Manage reviews →
              </Link>
            </div>
          </div>

          <div className="p-4 sm:p-6 bg-neutral-950 border border-neutral-800 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <span className="text-xs font-mono uppercase text-neutral-400">
                Photo Library
              </span>
              <ImageIcon className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="text-3xl sm:text-4xl font-heading font-extralight text-white block">
                {publishedImages}
              </span>
              <Link
                href="/admin/media"
                className="text-[11px] font-mono uppercase text-neutral-500 hover:text-white mt-2 sm:mt-3 inline-block"
              >
                Manage photo library →
              </Link>
            </div>
          </div>

          <div className="p-4 sm:p-6 bg-neutral-950 border border-neutral-800 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <span className="text-xs font-mono uppercase text-neutral-400">
                Published Videos
              </span>
              <Video className="w-4 h-4 text-dk-red" />
            </div>
            <div>
              <span className="text-3xl sm:text-4xl font-heading font-extralight text-white block">
                {publishedVideos}
              </span>
              <Link
                href="/admin/videos"
                className="text-[11px] font-mono uppercase text-neutral-500 hover:text-dk-red mt-2 sm:mt-3 inline-block"
              >
                Manage video showcase →
              </Link>
            </div>
          </div>

          <div className="p-4 sm:p-6 bg-neutral-950 border border-neutral-800 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <span className="text-xs font-mono uppercase text-neutral-400">
                Media Space (2 GB Total)
              </span>
              <HardDrive
                className={`w-4 h-4 ${
                  storageUsage.isCritical
                    ? "text-dk-red"
                    : storageUsage.isWarning
                    ? "text-amber-400"
                    : "text-dk-yellow"
                }`}
              />
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl sm:text-4xl font-heading font-extralight text-white">
                  {storageUsage.totalMb >= 1024
                    ? `${storageUsage.totalGb} GB`
                    : `${storageUsage.totalMb} MB`}
                </span>
                <span className="text-xs font-mono text-neutral-500">
                  / {storageUsage.limitGb} GB
                </span>
              </div>

              {/* Visual Storage Bar */}
              <div className="w-full bg-neutral-900 h-1.5 rounded-full overflow-hidden mt-2.5">
                <div
                  className={`h-full transition-all duration-500 ${
                    storageUsage.isCritical
                      ? "bg-dk-red"
                      : storageUsage.isWarning
                      ? "bg-amber-400"
                      : "bg-dk-yellow"
                  }`}
                  style={{
                    width: `${Math.max(2, Math.min(100, storageUsage.percentageUsed))}%`,
                  }}
                />
              </div>

              <div className="flex items-center justify-between text-[10px] font-mono text-neutral-500 mt-2">
                <span>{storageUsage.percentageUsed}% used</span>
                <span>{storageUsage.filesUploaded} files</span>
              </div>

              <Link
                href="/admin/media"
                className="text-[11px] font-mono uppercase text-neutral-500 hover:text-dk-yellow mt-2 sm:mt-2.5 inline-block"
              >
                Manage media files →
              </Link>
            </div>
          </div>

          <div className="p-4 sm:p-6 bg-neutral-950 border border-neutral-800 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <span className="text-xs font-mono uppercase text-neutral-400">
                New Enquiries
              </span>
              <Inbox className="w-4 h-4 text-dk-yellow" />
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl sm:text-4xl font-heading font-extralight text-white">
                  {newEnquiriesCount}
                </span>
                <span className="text-xs font-mono text-neutral-500">
                  / {enquiries.length} total
                </span>
              </div>
              <Link
                href="/admin/enquiries"
                className="text-[11px] font-mono uppercase text-neutral-500 hover:text-dk-yellow mt-2 sm:mt-3 inline-block"
              >
                View unread leads →
              </Link>
            </div>
          </div>
        </div>

        {/* Recent Enquiries Section */}
        <div className="bg-neutral-950 border border-neutral-800 p-4 sm:p-6 lg:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div>
              <h2 className="text-base sm:text-lg font-heading font-light uppercase tracking-tight text-white">
                Recent Admission Enquiries
              </h2>
              <p className="text-[11px] sm:text-xs font-mono text-neutral-400 mt-1">
                Latest student inquiries submitted across all branches and online tracks
              </p>
            </div>
            <Link
              href="/admin/enquiries"
              className="text-xs font-mono uppercase tracking-widest text-dk-yellow hover:underline inline-flex items-center gap-1 self-start sm:self-auto"
            >
              <span>All Enquiries</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {recentEnquiries.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-neutral-800 text-neutral-500 text-xs font-mono uppercase tracking-wider">
              No inquiries submitted yet.
            </div>
          ) : (
            <>
              
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead>
                    <tr className="border-b border-neutral-800 text-neutral-500 uppercase">
                      <th className="pb-3 font-medium">Date</th>
                      <th className="pb-3 font-medium">Student / Parent</th>
                      <th className="pb-3 font-medium">Phone</th>
                      <th className="pb-3 font-medium">Branch</th>
                      <th className="pb-3 font-medium">Style</th>
                      <th className="pb-3 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-900 text-neutral-300">
                    {recentEnquiries.map((enq) => (
                      <tr key={enq._id} className="hover:bg-neutral-900/40">
                        <td className="py-3 text-neutral-500">
                          {formatDate(enq.createdAt)}
                        </td>
                        <td className="py-3 font-medium text-white">{enq.name}</td>
                        <td className="py-3">{enq.phone}</td>
                        <td className="py-3">{enq.branch}</td>
                        <td className="py-3 text-neutral-400">{enq.danceStyle}</td>
                        <td className="py-3">
                          <span
                            className={`px-2 py-0.5 text-[10px] uppercase font-normal ${
                              enq.status === "new"
                                ? "bg-dk-yellow text-black font-semibold"
                                : enq.status === "contacted"
                                ? "bg-neutral-800 text-white"
                                : "bg-neutral-900 text-neutral-400"
                            }`}
                          >
                            {enq.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              
              <div className="md:hidden divide-y divide-neutral-900 -mx-4">
                {recentEnquiries.map((enq) => (
                  <div key={enq._id} className="p-4 space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-heading uppercase text-white text-sm font-semibold truncate">
                        {enq.name}
                      </span>
                      <span
                        className={`px-2 py-0.5 text-[10px] font-mono uppercase shrink-0 ${
                          enq.status === "new"
                            ? "bg-dk-yellow text-black font-bold"
                            : enq.status === "contacted"
                            ? "bg-neutral-800 text-white"
                            : "bg-neutral-900 text-neutral-400"
                        }`}
                      >
                        {enq.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-mono text-neutral-400">
                      <span>{enq.phone}</span>
                      <span>•</span>
                      <span className="text-dk-yellow">{enq.branch}</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] font-mono text-neutral-500 pt-1">
                      <span>{enq.danceStyle || "General Admission"}</span>
                      <span>{formatDate(enq.createdAt)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </main>
    </>
  );
}
