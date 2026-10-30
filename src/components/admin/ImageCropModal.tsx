"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Crop,
  ZoomIn,
  ZoomOut,
  RotateCw,
  X,
  Check,
  RefreshCw,
  Move,
  Sliders,
} from "lucide-react";

interface ImageCropModalProps {
  isOpen: boolean;
  imageUrl: string;
  onClose: () => void;
  onCropComplete: (croppedFile: File, previewUrl: string) => void;
  defaultAspect?: number; // e.g. 16/9 for video posters
}

export function ImageCropModal({
  isOpen,
  imageUrl,
  onClose,
  onCropComplete,
  defaultAspect = 16 / 9,
}: ImageCropModalProps) {
  const [aspectRatio, setAspectRatio] = useState<number>(defaultAspect);
  const [zoom, setZoom] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [imageLoaded, setImageLoaded] = useState<boolean>(false);
  const [imageError, setImageError] = useState<string | null>(null);

  const imageRef = useRef<HTMLImageElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Reset state when modal opens with a new image
  useEffect(() => {
    if (isOpen) {
      setZoom(1);
      setRotation(0);
      setPan({ x: 0, y: 0 });
      setImageLoaded(false);
      setImageError(null);
      setAspectRatio(defaultAspect);
    }
  }, [isOpen, imageUrl, defaultAspect]);

  // Handle Drag / Pan with Mouse & Touch
  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart({
      x: e.clientX - pan.x,
      y: e.clientY - pan.y,
    });
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const handleReset = () => {
    setZoom(1);
    setRotation(0);
    setPan({ x: 0, y: 0 });
  };

  // Perform canvas crop
  const handleApplyCrop = async () => {
    if (!imageRef.current) return;
    setIsProcessing(true);

    try {
      const img = imageRef.current;
      const naturalWidth = img.naturalWidth;
      const naturalHeight = img.naturalHeight;

      if (!naturalWidth || !naturalHeight) {
        throw new Error("Image not fully loaded");
      }

      // Create an offscreen canvas
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Could not initialize canvas context");

      // Compute target crop dimensions
      let cropWidth = naturalWidth;
      let cropHeight = cropWidth / aspectRatio;

      if (cropHeight > naturalHeight) {
        cropHeight = naturalHeight;
        cropWidth = cropHeight * aspectRatio;
      }

      // High-res output dimensions (max 1920px wide)
      const outWidth = Math.min(1920, Math.round(cropWidth));
      const outHeight = Math.round(outWidth / aspectRatio);

      canvas.width = outWidth;
      canvas.height = outHeight;

      // Fill canvas background with black
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, outWidth, outHeight);

      // Save context for transformations
      ctx.save();

      // Move to center of canvas
      ctx.translate(outWidth / 2, outHeight / 2);

      // Apply rotation
      ctx.rotate((rotation * Math.PI) / 180);

      // Apply zoom & pan scaling
      // Ratio between canvas output and natural crop box
      const scaleFactor = outWidth / cropWidth;
      ctx.scale(zoom, zoom);

      // Pan offset scaled
      const panOffsetX = (pan.x * (cropWidth / 300)) * scaleFactor;
      const panOffsetY = (pan.y * (cropHeight / 200)) * scaleFactor;

      // Draw the image centered
      ctx.drawImage(
        img,
        -naturalWidth / 2 + panOffsetX,
        -naturalHeight / 2 + panOffsetY,
        naturalWidth,
        naturalHeight
      );

      ctx.restore();

      // Convert canvas to JPEG blob
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            setIsProcessing(false);
            return;
          }

          const fileName = `cropped-thumb-${Date.now()}.jpg`;
          const file = new File([blob], fileName, { type: "image/jpeg" });
          const previewUrl = URL.createObjectURL(blob);

          setIsProcessing(false);
          onCropComplete(file, previewUrl);
          onClose();
        },
        "image/jpeg",
        0.92
      );
    } catch (err: any) {
      console.error("Cropping failed:", err);
      setImageError(err.message || "Failed to crop image. CORS or size issue.");
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
      onPointerUp={handlePointerUp}
    >
      <div className="relative w-full max-w-2xl bg-neutral-950 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col my-auto max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-neutral-800 bg-neutral-900/60">
          <div className="flex items-center gap-2">
            <Crop className="w-4 h-4 text-dk-yellow" />
            <h3 className="text-xs sm:text-sm font-heading font-medium uppercase tracking-wider text-white">
              Crop & Adjust Thumbnail
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-md text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Aspect Ratio Selector */}
        <div className="px-5 py-2.5 bg-neutral-900/30 border-b border-neutral-800 flex items-center justify-between gap-2 overflow-x-auto text-[11px] font-mono">
          <span className="text-neutral-400 uppercase tracking-wider shrink-0 flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5 text-dk-yellow" />
            Ratio:
          </span>
          <div className="flex items-center gap-1.5 shrink-0">
            {[
              { label: "16:9 Cinema", value: 16 / 9 },
              { label: "4:3 Standard", value: 4 / 3 },
              { label: "1:1 Square", value: 1 },
              { label: "9:16 Reel", value: 9 / 16 },
            ].map((preset) => {
              const isActive = Math.abs(aspectRatio - preset.value) < 0.01;
              return (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => setAspectRatio(preset.value)}
                  className={`px-2.5 py-1 rounded-full uppercase tracking-wider transition-all cursor-pointer ${
                    isActive
                      ? "bg-dk-yellow text-black font-semibold shadow-sm"
                      : "bg-neutral-800 text-neutral-300 hover:bg-neutral-700"
                  }`}
                >
                  {preset.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Crop Viewport */}
        <div
          ref={containerRef}
          className="relative w-full aspect-video sm:h-[340px] bg-neutral-900 overflow-hidden flex items-center justify-center cursor-grab active:cursor-grabbing select-none"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
        >
          {/* Helper overlay instruction */}
          <div className="absolute top-2.5 left-2.5 z-20 pointer-events-none px-2 py-1 rounded bg-black/60 backdrop-blur-sm text-[10px] font-mono text-neutral-400 flex items-center gap-1 border border-white/10">
            <Move className="w-3 h-3 text-dk-yellow" />
            <span>Drag to reposition</span>
          </div>

          {/* Mask crop framing box */}
          <div
            className="pointer-events-none absolute z-10 border-2 border-dk-yellow shadow-[0_0_0_9999px_rgba(0,0,0,0.7)]"
            style={{
              aspectRatio: `${aspectRatio}`,
              width: aspectRatio >= 1 ? "85%" : "auto",
              height: aspectRatio < 1 ? "85%" : "auto",
              maxHeight: "85%",
              maxWidth: "85%",
            }}
          >
            {/* Grid overlay lines */}
            <div className="w-full h-full grid grid-cols-3 grid-rows-3 opacity-40">
              <div className="border-r border-b border-dk-yellow/50" />
              <div className="border-r border-b border-dk-yellow/50" />
              <div className="border-b border-dk-yellow/50" />
              <div className="border-r border-b border-dk-yellow/50" />
              <div className="border-r border-b border-dk-yellow/50" />
              <div className="border-b border-dk-yellow/50" />
              <div className="border-r border-dk-yellow/50" />
              <div className="border-r border-dk-yellow/50" />
              <div />
            </div>
          </div>

          {/* Hidden natural image element for canvas source */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            ref={imageRef}
            src={imageUrl}
            alt="Source image to crop"
            crossOrigin="anonymous"
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError("Could not load image for editing.")}
            className="transition-transform duration-75 select-none pointer-events-none max-w-none"
            style={{
              transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom}) rotate(${rotation}deg)`,
              maxHeight: "80%",
              maxWidth: "80%",
              objectFit: "contain",
            }}
          />
        </div>

        {/* Error notification if any */}
        {imageError && (
          <div className="px-5 py-2 bg-dk-red/20 text-white text-xs font-mono border-t border-dk-red/30">
            {imageError}
          </div>
        )}

        {/* Toolbar Controls */}
        <div className="px-5 py-3 border-t border-neutral-800 bg-neutral-900/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono">
          {/* Zoom Slider */}
          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <span className="text-neutral-400 shrink-0">Zoom:</span>
            <button
              type="button"
              onClick={() => setZoom((z) => Math.max(0.5, z - 0.1))}
              className="p-1.5 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-300"
              title="Zoom out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <input
              type="range"
              min="0.5"
              max="3"
              step="0.05"
              value={zoom}
              onChange={(e) => setZoom(parseFloat(e.target.value))}
              className="w-28 sm:w-36 accent-dk-yellow h-1.5 bg-neutral-800 rounded-lg cursor-pointer"
            />
            <button
              type="button"
              onClick={() => setZoom((z) => Math.min(3, z + 0.1))}
              className="p-1.5 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-300"
              title="Zoom in"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <span className="text-neutral-400 text-[10px] w-8">
              {Math.round(zoom * 100)}%
            </span>
          </div>

          {/* Rotate & Reset */}
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              type="button"
              onClick={handleRotate}
              className="px-2.5 py-1.5 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-300 flex items-center gap-1.5"
              title="Rotate 90° clockwise"
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span>Rotate</span>
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="px-2.5 py-1.5 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white flex items-center gap-1"
              title="Reset position and zoom"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Footer actions */}
        <div className="px-5 py-3 border-t border-neutral-800 bg-neutral-950 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            disabled={isProcessing}
            className="px-4 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white hover:bg-neutral-800 text-xs font-mono uppercase tracking-wider transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleApplyCrop}
            disabled={isProcessing || !imageLoaded}
            className="px-5 py-2 rounded-lg bg-dk-yellow hover:bg-yellow-400 text-black text-xs font-mono uppercase tracking-wider font-semibold transition-all inline-flex items-center gap-1.5 hover:scale-105 active:scale-95 disabled:opacity-50 cursor-pointer shadow-md"
          >
            {isProcessing ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Apply & Save Crop</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

