"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import {
  Upload,
  Check,
  X,
  ExternalLink,
  Loader2,
  AlertCircle,
  RefreshCw,
  Crop,
} from "lucide-react";
import { uploadFiles } from "@/lib/uploadthing";
import { ImageCropModal } from "./ImageCropModal";

interface MediaUploaderWithPreviewProps {
  label?: string;
  value?: string;
  fileKey?: string;
  mediaType?: "image" | "video";
  maxSizeMb?: number;
  aspectRatio?: number;
  onChange: (data: { url: string; key?: string; name?: string; type?: "image" | "video" }) => void;
  onClear?: () => void;
  placeholder?: string;
}

export function MediaUploaderWithPreview({
  label = "Upload Media",
  value = "",
  fileKey = "",
  mediaType = "image",
  maxSizeMb,
  aspectRatio,
  onChange,
  onClear,
  placeholder = "https://... or /images/...",
}: MediaUploaderWithPreviewProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [localPreview, setLocalPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [selectedFileSize, setSelectedFileSize] = useState<string | null>(null);
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);

  const effectiveMaxMb = maxSizeMb || (mediaType === "video" ? 50 : 10);

  // Format bytes to human readable string
  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Strict client-side file size limit enforcement (10MB for photos, 50MB for videos, 15MB for hero video)
    const maxBytes = effectiveMaxMb * 1024 * 1024;
    if (file.size > maxBytes) {
      const err = `${mediaType === "video" ? "Video" : "Image"} size exceeds ${effectiveMaxMb} MB limit (Selected: ${formatBytes(file.size)}). Please select a ${mediaType === "video" ? "video" : "photo"} under ${effectiveMaxMb} MB.`;
      setUploadError(err);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return;
    }

    const isVideo =
      mediaType === "video" ||
      file.type.startsWith("video/") ||
      Boolean(file.name.match(/\.(mp4|mov|webm|m4v)$/i));

    if (isVideo && !file.name.match(/\.(mp4|mov|webm|m4v)$/i)) {
      setUploadError("Invalid video format. Allowed formats: .mp4, .mov, .webm, .m4v");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return;
    }

    // 1. Instant Client Preview
    const previewUrl = URL.createObjectURL(file);
    setLocalPreview(previewUrl);
    setSelectedFileName(file.name);
    setSelectedFileSize(formatBytes(file.size));
    setUploadError(null);
    setIsUploading(true);
    setUploadProgress(0);

    try {
      // 2. Select appropriate UploadThing endpoint
      const endpoint = isVideo
        ? (effectiveMaxMb === 15 ? "heroVideoUploader" : "videoUploader")
        : "imageUploader";

      // 3. Upload file binaries directly from the browser to UploadThing Cloud Storage
      const res = await uploadFiles(endpoint, {
        files: [file],
        headers: () => {
          const authHeaders: Record<string, string> = {};
          if (typeof window !== "undefined") {
            const token = localStorage.getItem("dkdc_token");
            if (token) {
              authHeaders.Authorization = `Bearer ${token}`;
            }
          }
          return authHeaders;
        },
        onUploadProgress: ({ progress }) => {
          setUploadProgress(Math.round(progress));
        },
      });

      if (!res || res.length === 0) {
        throw new Error("No response received from UploadThing cloud storage.");
      }

      const uploaded = res[0];
      const cloudUrl =
        uploaded.ufsUrl ||
        uploaded.url ||
        (uploaded.serverData as any)?.url ||
        `https://utfs.io/f/${uploaded.key}`;

      const cloudKey =
        uploaded.key ||
        (uploaded.serverData as any)?.key ||
        "";

      const uploadedName =
        uploaded.name ||
        (uploaded.serverData as any)?.name ||
        file.name;

      const detectedType: "image" | "video" =
        (uploaded.serverData as any)?.type ||
        (isVideo ? "video" : "image");

      // 4. Update parent form with permanent cloud URL & metadata
      onChange({
        url: cloudUrl,
        key: cloudKey,
        name: uploadedName,
        type: detectedType,
      });
    } catch (err: any) {
      console.error("Direct upload failed:", err);
      setLocalPreview(null);
      setSelectedFileName(null);
      setSelectedFileSize(null);
      setUploadError(err.message || "Failed to upload media file. Please try again.");
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleCropComplete = async (croppedFile: File, previewUrl: string) => {
    setLocalPreview(previewUrl);
    setSelectedFileName(croppedFile.name);
    setSelectedFileSize(formatBytes(croppedFile.size));
    setUploadError(null);
    setIsUploading(true);
    setUploadProgress(0);

    try {
      const res = await uploadFiles("imageUploader", {
        files: [croppedFile],
        headers: () => {
          const authHeaders: Record<string, string> = {};
          if (typeof window !== "undefined") {
            const token = localStorage.getItem("dkdc_token");
            if (token) {
              authHeaders.Authorization = `Bearer ${token}`;
            }
          }
          return authHeaders;
        },
        onUploadProgress: ({ progress }) => {
          setUploadProgress(Math.round(progress));
        },
      });

      if (!res || res.length === 0) {
        throw new Error("No response received from UploadThing cloud storage.");
      }

      const uploaded = res[0];
      const cloudUrl =
        uploaded.ufsUrl ||
        uploaded.url ||
        (uploaded.serverData as any)?.url ||
        `https://utfs.io/f/${uploaded.key}`;

      const cloudKey =
        uploaded.key ||
        (uploaded.serverData as any)?.key ||
        "";

      onChange({
        url: cloudUrl,
        key: cloudKey,
        name: croppedFile.name,
        type: "image",
      });
    } catch (err: any) {
      console.error("Upload of cropped image failed:", err);
      setUploadError(err.message || "Failed to upload cropped image. Please try again.");
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleRemove = () => {
    setLocalPreview(null);
    setSelectedFileName(null);
    setSelectedFileSize(null);
    setUploadError(null);
    if (onClear) {
      onClear();
    } else {
      onChange({ url: "", key: "", type: mediaType });
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const displayUrl = localPreview || value;
  const isVideo =
    mediaType === "video" ||
    Boolean(displayUrl?.match(/\.(mp4|mov|webm|m4v)$/i)) ||
    Boolean(selectedFileName?.match(/\.(mp4|mov|webm|m4v)$/i));

  return (
    <div className="space-y-3 p-4 bg-neutral-950 border border-neutral-800 rounded-none">
      {/* Header with status */}
      <div className="flex items-center justify-between">
        <label className="block text-xs font-mono uppercase text-neutral-300">
          {label}
        </label>
        {displayUrl ? (
          <span className="text-[10px] font-mono uppercase text-[#25D366] flex items-center gap-1 font-semibold">
            {isUploading ? (
              <>
                <Loader2 className="w-3 h-3 animate-spin text-dk-yellow" />
                <span className="text-dk-yellow">
                  Uploading... {uploadProgress > 0 ? `${uploadProgress}%` : ""}
                </span>
              </>
            ) : (
              <>
                <Check className="w-3 h-3" />
                <span>{isVideo ? "Video Ready" : "Photo Ready"}</span>
              </>
            )}
          </span>
        ) : (
          <span className="text-[10px] font-mono uppercase text-neutral-500">
            File Preview & Upload
          </span>
        )}
      </div>

      {/* Error alert */}
      {uploadError && (
        <div className="flex items-center gap-2 p-2.5 bg-dk-red/10 border border-dk-red/30 text-white text-xs font-mono">
          <AlertCircle className="w-4 h-4 text-dk-red shrink-0" />
          <span>{uploadError}</span>
        </div>
      )}

      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept={
          mediaType === "video"
            ? "video/mp4,video/quicktime,video/webm"
            : "image/png,image/jpeg,image/webp,image/gif"
        }
        className="hidden"
      />

      {/* Media Preview Box */}
      {displayUrl ? (
        <div className="space-y-3">
          <div className="relative aspect-video max-h-56 w-full bg-black border border-neutral-800 overflow-hidden group">
            {isVideo ? (
              <video
                key={displayUrl}
                src={displayUrl}
                controls
                playsInline
                className="w-full h-full object-contain bg-black relative z-10"
              />
            ) : (
              <>
                <Image
                  src={displayUrl}
                  alt="Selected media preview"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  unoptimized={displayUrl.startsWith("blob:")}
                />
                {/* Overlay Actions on Hover for Images */}
                <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-3 z-10">
                  <button
                    type="button"
                    onClick={() => setIsCropModalOpen(true)}
                    disabled={isUploading}
                    className="px-3 py-1.5 bg-dk-yellow text-black hover:bg-yellow-400 text-xs font-mono uppercase tracking-wider transition-colors inline-flex items-center gap-1.5 disabled:opacity-50 cursor-pointer font-medium"
                    title="Crop and reposition image"
                  >
                    <Crop className="w-3 h-3" />
                    <span>Crop</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="px-3 py-1.5 bg-white text-black hover:bg-neutral-200 text-xs font-mono uppercase tracking-wider transition-colors inline-flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Change</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleRemove}
                    disabled={isUploading}
                    className="px-3 py-1.5 bg-dk-red text-white hover:bg-red-700 text-xs font-mono uppercase tracking-wider transition-colors inline-flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                    <span>Remove</span>
                  </button>
                  {value && (
                    <a
                      href={value}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 bg-neutral-800 text-white hover:bg-neutral-700 text-xs font-mono uppercase tracking-wider transition-colors inline-flex items-center gap-1"
                    >
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </>
            )}

            {/* Uploading Spinner Overlay */}
            {isUploading && (
              <div className="absolute inset-0 bg-black/85 flex flex-col items-center justify-center gap-2.5 z-20 p-4">
                <Loader2 className="w-6 h-6 animate-spin text-dk-yellow" />
                <span className="text-xs font-mono uppercase tracking-wider text-white">
                  Uploading file... {uploadProgress > 0 ? `${uploadProgress}%` : ""}
                </span>
                {uploadProgress > 0 && (
                  <div className="w-48 bg-neutral-800 h-1.5 overflow-hidden rounded-full">
                    <div
                      className="bg-dk-yellow h-full transition-all duration-200"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                )}
                {selectedFileSize && (
                  <span className="text-[10px] font-mono text-neutral-400">
                    {selectedFileSize}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Action buttons and file details */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-1">
            <div className="flex items-center gap-2 text-[11px] font-mono text-neutral-400 truncate max-w-full sm:max-w-[280px]">
              {selectedFileName ? (
                <span className="truncate">File: {selectedFileName}</span>
              ) : (
                <span className="truncate text-neutral-500">
                  {isVideo ? "Video loaded" : "Image loaded"}
                </span>
              )}
              {selectedFileSize && <span>• {selectedFileSize}</span>}
            </div>

            <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
              {/* Crop / Edit Button for Photos */}
              {!isVideo && (
                <button
                  type="button"
                  onClick={() => setIsCropModalOpen(true)}
                  disabled={isUploading}
                  className="px-3 py-1.5 bg-neutral-900 border border-dk-yellow/40 text-dk-yellow hover:bg-dk-yellow hover:text-black text-xs font-mono uppercase tracking-wider transition-all inline-flex items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer min-h-[36px]"
                  title="Crop & reposition thumbnail image"
                >
                  <Crop className="w-3.5 h-3.5" />
                  <span>Crop & Adjust</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="flex-1 sm:flex-none px-3 py-1.5 bg-neutral-800 text-neutral-200 hover:text-white hover:bg-neutral-700 text-xs font-mono uppercase tracking-wider transition-colors inline-flex items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer min-h-[36px]"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Change {mediaType === "video" ? "Video" : "Photo"}</span>
              </button>
              <button
                type="button"
                onClick={handleRemove}
                disabled={isUploading}
                className="px-3 py-1.5 bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-dk-red hover:border-dk-red/50 text-xs font-mono uppercase tracking-wider transition-colors inline-flex items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer min-h-[36px]"
              >
                <X className="w-3.5 h-3.5" />
                <span>Remove</span>
              </button>
              {value && (
                <a
                  href={value}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Open in new tab"
                  className="p-2 bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-700 transition-colors flex items-center justify-center min-h-[36px] min-w-[36px]"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Dropzone / Upload Trigger Button */
        <div className="space-y-3">
          <div
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              const file = e.dataTransfer.files?.[0];
              if (file && fileInputRef.current) {
                const dataTransfer = new DataTransfer();
                dataTransfer.items.add(file);
                fileInputRef.current.files = dataTransfer.files;
                handleFileSelect({ target: fileInputRef.current } as any);
              }
            }}
            className="p-6 bg-black border border-dashed border-neutral-800 hover:border-dk-yellow transition-colors flex flex-col items-center justify-center gap-2.5 text-center cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-full bg-neutral-900 group-hover:bg-neutral-800 flex items-center justify-center text-neutral-400 group-hover:text-dk-yellow transition-colors">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-heading font-light uppercase tracking-wider text-white group-hover:text-dk-yellow transition-colors block">
                Choose or Drop {mediaType === "video" ? "Video" : "Photo"}
              </span>
              <span className="text-[10px] font-mono text-neutral-500 mt-1 block">
                Instant preview before saving • Max file size: {effectiveMaxMb} MB ({mediaType === "video" ? "MP4, WebM" : "JPEG, PNG, WebP"})
              </span>
            </div>
            <button
              type="button"
              className="mt-1 px-4 py-2 bg-white text-black hover:bg-dk-yellow font-heading font-light text-xs uppercase tracking-widest transition-colors pointer-events-none"
            >
              Select {mediaType === "video" ? "Video" : "File"} from Computer
            </button>
          </div>
        </div>
      )}

      {/* Image Crop Modal */}
      {isCropModalOpen && displayUrl && (
        <ImageCropModal
          isOpen={isCropModalOpen}
          imageUrl={displayUrl}
          onClose={() => setIsCropModalOpen(false)}
          onCropComplete={handleCropComplete}
          defaultAspect={aspectRatio}
        />
      )}
    </div>
  );
}
