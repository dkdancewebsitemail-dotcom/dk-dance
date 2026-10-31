"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Crop,
  RotateCw,
  RotateCcw,
  FlipHorizontal,
  FlipVertical,
  X,
  Check,
  RefreshCw,
  Sliders,
  ZoomIn,
  ZoomOut,
  Maximize2,
} from "lucide-react";

export interface ImageCropModalProps {
  isOpen: boolean;
  imageUrl: string;
  onClose: () => void;
  onCropComplete: (croppedFile: File, previewUrl: string) => void;
  defaultAspect?: number;
}

interface CropBox {
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  width: number; // percentage 0-100
  height: number; // percentage 0-100
}

type DragMode =
  | "move"
  | "nw"
  | "ne"
  | "sw"
  | "se"
  | "n"
  | "s"
  | "e"
  | "w"
  | null;

export function ImageCropModal({
  isOpen,
  imageUrl,
  onClose,
  onCropComplete,
  defaultAspect,
}: ImageCropModalProps) {
  const [aspectRatio, setAspectRatio] = useState<number | null>(
    defaultAspect || null
  );
  const [rotation, setRotation] = useState<number>(0);
  const [flipH, setFlipH] = useState<boolean>(false);
  const [flipV, setFlipV] = useState<boolean>(false);
  const [zoom, setZoom] = useState<number>(1);
  const [cropBox, setCropBox] = useState<CropBox>({
    x: 5,
    y: 5,
    width: 90,
    height: 90,
  });

  const [imageLoaded, setImageLoaded] = useState<boolean>(false);
  const [naturalDimensions, setNaturalDimensions] = useState<{
    width: number;
    height: number;
  }>({ width: 0, height: 0 });
  const [displayedDimensions, setDisplayedDimensions] = useState<{
    width: number;
    height: number;
    left: number;
    top: number;
  }>({ width: 0, height: 0, left: 0, top: 0 });

  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [imageError, setImageError] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const dragRef = useRef<{
    mode: DragMode;
    startX: number;
    startY: number;
    startCrop: CropBox;
  } | null>(null);

  // Initialize crop box to target aspect ratio within the image
  const initCropBox = useCallback(
    (targetRatio: number | null, natW: number, natH: number) => {
      if (!natW || !natH) return;

      const isSideways = rotation % 180 !== 0;
      const currentW = isSideways ? natH : natW;
      const currentH = isSideways ? natW : natH;
      const imgAspect = currentW / currentH;

      if (targetRatio === null) {
        // Free: default to 90% centered box
        setCropBox({ x: 5, y: 5, width: 90, height: 90 });
        return;
      }

      // If target ratio is specified, fit the largest centered box with that ratio
      if (targetRatio >= imgAspect) {
        // Target is wider than or equal to image: width is 90%, compute height %
        const boxWidth = 90;
        const boxHeight = Math.min(90, (boxWidth * imgAspect) / targetRatio);
        setCropBox({
          x: (100 - boxWidth) / 2,
          y: (100 - boxHeight) / 2,
          width: boxWidth,
          height: boxHeight,
        });
      } else {
        // Target is taller: height is 90%, compute width %
        const boxHeight = 90;
        const boxWidth = Math.min(90, (boxHeight * targetRatio) / imgAspect);
        setCropBox({
          x: (100 - boxWidth) / 2,
          y: (100 - boxHeight) / 2,
          width: boxWidth,
          height: boxHeight,
        });
      }
    },
    [rotation]
  );

  // Reset and initialize when modal opens
  useEffect(() => {
    if (isOpen) {
      setRotation(0);
      setFlipH(false);
      setFlipV(false);
      setZoom(1);
      setImageLoaded(false);
      setImageError(null);
      setAspectRatio(defaultAspect || null);
    }
  }, [isOpen, imageUrl, defaultAspect]);

  // Update displayed dimensions on load or resize
  const updateDisplayedBounds = useCallback(() => {
    if (!imageRef.current || !containerRef.current) return;
    const imgRect = imageRef.current.getBoundingClientRect();
    const contRect = containerRef.current.getBoundingClientRect();

    setDisplayedDimensions({
      width: imgRect.width,
      height: imgRect.height,
      left: imgRect.left - contRect.left,
      top: imgRect.top - contRect.top,
    });
  }, []);

  const handleImageLoad = () => {
    if (!imageRef.current) return;
    const nw = imageRef.current.naturalWidth;
    const nh = imageRef.current.naturalHeight;
    setNaturalDimensions({ width: nw, height: nh });
    setImageLoaded(true);
    updateDisplayedBounds();
    initCropBox(aspectRatio, nw, nh);
  };

  useEffect(() => {
    if (imageLoaded) {
      updateDisplayedBounds();
    }
  }, [imageLoaded, rotation, zoom, updateDisplayedBounds]);

  // Window resize listener
  useEffect(() => {
    if (!isOpen) return;
    const handleResize = () => updateDisplayedBounds();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isOpen, updateDisplayedBounds]);

  // Handle aspect ratio preset change
  const handleSelectAspectRatio = (ratio: number | null) => {
    setAspectRatio(ratio);
    if (naturalDimensions.width && naturalDimensions.height) {
      initCropBox(ratio, naturalDimensions.width, naturalDimensions.height);
    }
  };

  // Rotation controls
  const handleRotateCw = () => {
    setRotation((r) => (r + 90) % 360);
  };

  const handleRotateCcw = () => {
    setRotation((r) => (r - 90 + 360) % 360);
  };

  const handleFlipH = () => setFlipH((f) => !f);
  const handleFlipV = () => setFlipV((f) => !f);

  const handleReset = () => {
    setRotation(0);
    setFlipH(false);
    setFlipV(false);
    setZoom(1);
    setAspectRatio(defaultAspect || null);
    if (naturalDimensions.width && naturalDimensions.height) {
      initCropBox(
        defaultAspect || null,
        naturalDimensions.width,
        naturalDimensions.height
      );
    }
  };

  // Pointer drag handling for moving crop box or resizing handles
  const handlePointerDown = (e: React.PointerEvent, mode: DragMode) => {
    e.preventDefault();
    e.stopPropagation();
    (e.target as HTMLElement).setPointerCapture(e.pointerId);

    dragRef.current = {
      mode,
      startX: e.clientX,
      startY: e.clientY,
      startCrop: { ...cropBox },
    };
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragRef.current || !displayedDimensions.width || !displayedDimensions.height)
      return;

    const { mode, startX, startY, startCrop } = dragRef.current;
    const deltaXPixels = e.clientX - startX;
    const deltaYPixels = e.clientY - startY;

    // Convert pixel delta to percentage of displayed image
    const deltaX = (deltaXPixels / displayedDimensions.width) * 100;
    const deltaY = (deltaYPixels / displayedDimensions.height) * 100;

    const isSideways = rotation % 180 !== 0;
    const natW = isSideways ? naturalDimensions.height : naturalDimensions.width;
    const natH = isSideways ? naturalDimensions.width : naturalDimensions.height;
    const imgAspect = natW && natH ? natW / natH : 1;

    setCropBox((prev) => {
      let next = { ...prev };

      if (mode === "move") {
        let newX = startCrop.x + deltaX;
        let newY = startCrop.y + deltaY;

        newX = Math.max(0, Math.min(100 - startCrop.width, newX));
        newY = Math.max(0, Math.min(100 - startCrop.height, newY));

        return {
          ...startCrop,
          x: newX,
          y: newY,
        };
      }

      // Handle corner and edge resizing
      let newX = startCrop.x;
      let newY = startCrop.y;
      let newW = startCrop.width;
      let newH = startCrop.height;

      // Unconstrained free resize deltas
      if (mode === "e" || mode === "se" || mode === "ne") {
        newW = Math.max(8, Math.min(100 - startCrop.x, startCrop.width + deltaX));
      }
      if (mode === "w" || mode === "sw" || mode === "nw") {
        const potentialW = Math.max(8, startCrop.width - deltaX);
        if (startCrop.x + startCrop.width - potentialW >= 0) {
          newX = startCrop.x + startCrop.width - potentialW;
          newW = potentialW;
        }
      }
      if (mode === "s" || mode === "se" || mode === "sw") {
        newH = Math.max(8, Math.min(100 - startCrop.y, startCrop.height + deltaY));
      }
      if (mode === "n" || mode === "ne" || mode === "nw") {
        const potentialH = Math.max(8, startCrop.height - deltaY);
        if (startCrop.y + startCrop.height - potentialH >= 0) {
          newY = startCrop.y + startCrop.height - potentialH;
          newH = potentialH;
        }
      }

      // Apply aspect ratio constraint if locked
      if (aspectRatio !== null && aspectRatio > 0) {
        // desired ratio of (pixel width / pixel height) = aspectRatio
        // (newW / newH) * imgAspect = aspectRatio  =>  newW = newH * (aspectRatio / imgAspect)
        const ratioMultiplier = aspectRatio / imgAspect;

        if (mode === "e" || mode === "w") {
          newH = newW / ratioMultiplier;
          if (newY + newH > 100) {
            newH = 100 - newY;
            newW = newH * ratioMultiplier;
          }
        } else {
          newW = newH * ratioMultiplier;
          if (newX + newW > 100) {
            newW = 100 - newX;
            newH = newW / ratioMultiplier;
          }
        }
      }

      // Final boundary clamp
      newX = Math.max(0, Math.min(100 - newW, newX));
      newY = Math.max(0, Math.min(100 - newH, newY));

      return {
        x: newX,
        y: newY,
        width: Math.min(100, newW),
        height: Math.min(100, newH),
      };
    });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (dragRef.current) {
      try {
        (e.target as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {
        // Ignore if pointer capture was already released
      }
      dragRef.current = null;
    }
  };

  // Wheel zoom inside viewport
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomDelta = e.deltaY < 0 ? 0.08 : -0.08;
    setZoom((z) => Math.min(3, Math.max(0.7, parseFloat((z + zoomDelta).toFixed(2)))));
  };

  // Perform mathematically exact canvas crop
  const handleApplyCrop = async () => {
    if (!imageRef.current) return;
    setIsProcessing(true);
    setImageError(null);

    try {
      const img = imageRef.current;
      const naturalWidth = img.naturalWidth;
      const naturalHeight = img.naturalHeight;

      if (!naturalWidth || !naturalHeight) {
        throw new Error("Source image dimensions not ready.");
      }

      // Step 1: Create an offscreen canvas for transformed source (rotation & flip)
      const isSideways = rotation % 180 !== 0;
      const tWidth = isSideways ? naturalHeight : naturalWidth;
      const tHeight = isSideways ? naturalWidth : naturalHeight;

      const transformCanvas = document.createElement("canvas");
      transformCanvas.width = tWidth;
      transformCanvas.height = tHeight;
      const tCtx = transformCanvas.getContext("2d");
      if (!tCtx) throw new Error("Could not initialize canvas context");

      tCtx.translate(tWidth / 2, tHeight / 2);
      tCtx.rotate((rotation * Math.PI) / 180);
      tCtx.scale(flipH ? -1 : 1, flipV ? -1 : 1);
      tCtx.drawImage(
        img,
        -naturalWidth / 2,
        -naturalHeight / 2,
        naturalWidth,
        naturalHeight
      );

      // Step 2: Calculate exact source coordinates from the cropBox percentage
      const sourceX = Math.round((cropBox.x / 100) * tWidth);
      const sourceY = Math.round((cropBox.y / 100) * tHeight);
      const sourceW = Math.round((cropBox.width / 100) * tWidth);
      const sourceH = Math.round((cropBox.height / 100) * tHeight);

      if (sourceW <= 0 || sourceH <= 0) {
        throw new Error("Invalid crop selection area.");
      }

      // Step 3: Draw cropped region into final output canvas
      const outputCanvas = document.createElement("canvas");
      // Clamp output resolution to 2560px for performance, retaining full crispness
      const maxOutputDim = 2560;
      let outW = sourceW;
      let outH = sourceH;
      if (outW > maxOutputDim || outH > maxOutputDim) {
        if (outW >= outH) {
          outH = Math.round((outH * maxOutputDim) / outW);
          outW = maxOutputDim;
        } else {
          outW = Math.round((outW * maxOutputDim) / outH);
          outH = maxOutputDim;
        }
      }

      outputCanvas.width = outW;
      outputCanvas.height = outH;
      const outCtx = outputCanvas.getContext("2d");
      if (!outCtx) throw new Error("Could not initialize output context");

      // Smooth bicubic resampling
      outCtx.imageSmoothingEnabled = true;
      outCtx.imageSmoothingQuality = "high";

      outCtx.drawImage(
        transformCanvas,
        sourceX,
        sourceY,
        sourceW,
        sourceH,
        0,
        0,
        outW,
        outH
      );

      // Step 4: Export to high-quality Blob & File
      outputCanvas.toBlob(
        (blob) => {
          if (!blob) {
            setIsProcessing(false);
            setImageError("Failed to generate cropped image file.");
            return;
          }

          const fileName = `dkdc-cropped-${Date.now()}.jpg`;
          const file = new File([blob], fileName, { type: "image/jpeg" });
          const previewUrl = URL.createObjectURL(blob);

          setIsProcessing(false);
          onCropComplete(file, previewUrl);
          onClose();
        },
        "image/jpeg",
        0.95
      );
    } catch (err: any) {
      console.error("Cropping failed:", err);
      setImageError(err.message || "Failed to crop image.");
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  // Compute live cropped pixel resolution for admin feedback
  const isSideways = rotation % 180 !== 0;
  const currentNatW = isSideways
    ? naturalDimensions.height
    : naturalDimensions.width;
  const currentNatH = isSideways
    ? naturalDimensions.width
    : naturalDimensions.height;
  const livePixelW = Math.round((cropBox.width / 100) * currentNatW);
  const livePixelH = Math.round((cropBox.height / 100) * currentNatH);

  return (
    <div
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto"
      onPointerUp={handlePointerUp}
      onPointerMove={handlePointerMove}
    >
      <div className="relative w-full max-w-4xl bg-neutral-950 border border-neutral-800 shadow-2xl overflow-hidden flex flex-col my-auto max-h-[96vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-neutral-800 bg-neutral-900/80">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-dk-yellow/10 border border-dk-yellow/30 flex items-center justify-center">
              <Crop className="w-4 h-4 text-dk-yellow" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-heading font-medium uppercase tracking-wider text-white">
                Image Crop & Alignment Studio
              </h3>
              <span className="text-[10px] font-mono text-neutral-400 hidden sm:block">
                Drag frame to reposition • Drag corners to resize • 100% WYSIWYG
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
            title="Close editor"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Aspect Ratio Selector Bar */}
        <div className="px-4 sm:px-6 py-2.5 bg-neutral-900/40 border-b border-neutral-800 flex items-center justify-between gap-3 overflow-x-auto text-[11px] font-mono">
          <div className="flex items-center gap-1.5 text-neutral-400 shrink-0">
            <Sliders className="w-3.5 h-3.5 text-dk-yellow" />
            <span className="uppercase tracking-wider">Aspect Ratio:</span>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            {[
              { label: "Free", value: null },
              {
                label: "Original",
                value:
                  naturalDimensions.width && naturalDimensions.height
                    ? (isSideways
                        ? naturalDimensions.height
                        : naturalDimensions.width) /
                      (isSideways
                        ? naturalDimensions.width
                        : naturalDimensions.height)
                    : null,
              },
              { label: "1:1 Square", value: 1 },
              { label: "4:3 Standard", value: 4 / 3 },
              { label: "16:9 Cinema", value: 16 / 9 },
              { label: "3:4 Portrait", value: 3 / 4 },
              { label: "9:16 Reel", value: 9 / 16 },
            ].map((preset) => {
              const isActive =
                preset.value === null
                  ? aspectRatio === null
                  : aspectRatio !== null &&
                    Math.abs(aspectRatio - preset.value) < 0.01;
              return (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => handleSelectAspectRatio(preset.value)}
                  className={`px-3 py-1 rounded-full uppercase tracking-wider transition-all text-[10px] sm:text-[11px] cursor-pointer ${
                    isActive
                      ? "bg-dk-yellow text-black font-semibold shadow-sm"
                      : "bg-neutral-800/80 text-neutral-300 hover:bg-neutral-700 hover:text-white"
                  }`}
                >
                  {preset.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Crop Viewport */}
        <div
          ref={containerRef}
          onWheel={handleWheel}
          className="relative w-full h-[360px] sm:h-[460px] bg-neutral-950 flex items-center justify-center overflow-hidden select-none"
          style={{ touchAction: "none" }}
        >
          {/* Subtle grid background to indicate transparent canvas */}
          <div
            className="absolute inset-0 opacity-15 pointer-events-none"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)",
              backgroundSize: "20px 20px",
            }}
          />

          {/* Source Image */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            ref={imageRef}
            src={imageUrl}
            alt="Source to crop"
            crossOrigin="anonymous"
            onLoad={handleImageLoad}
            onError={() => setImageError("Failed to load image for cropping.")}
            className="max-w-[90%] max-h-[90%] object-contain pointer-events-none transition-transform duration-150 select-none shadow-2xl"
            style={{
              transform: `scale(${zoom}) rotate(${rotation}deg) scaleX(${
                flipH ? -1 : 1
              }) scaleY(${flipV ? -1 : 1})`,
            }}
          />

          {/* Interactive Crop Frame Overlay (Positioned exactly over displayed image) */}
          {imageLoaded && displayedDimensions.width > 0 && (
            <div
              className="absolute pointer-events-none"
              style={{
                width: `${displayedDimensions.width}px`,
                height: `${displayedDimensions.height}px`,
                left: `${displayedDimensions.left}px`,
                top: `${displayedDimensions.top}px`,
              }}
            >
              {/* Semi-transparent dark mask covering outside of crop box */}
              {/* Top mask */}
              <div
                className="absolute top-0 left-0 right-0 bg-black/65 backdrop-blur-[1px]"
                style={{ height: `${cropBox.y}%` }}
              />
              {/* Bottom mask */}
              <div
                className="absolute left-0 right-0 bottom-0 bg-black/65 backdrop-blur-[1px]"
                style={{ height: `${100 - (cropBox.y + cropBox.height)}%` }}
              />
              {/* Left mask */}
              <div
                className="absolute left-0 bg-black/65 backdrop-blur-[1px]"
                style={{
                  top: `${cropBox.y}%`,
                  height: `${cropBox.height}%`,
                  width: `${cropBox.x}%`,
                }}
              />
              {/* Right mask */}
              <div
                className="absolute right-0 bg-black/65 backdrop-blur-[1px]"
                style={{
                  top: `${cropBox.y}%`,
                  height: `${cropBox.height}%`,
                  width: `${100 - (cropBox.x + cropBox.width)}%`,
                }}
              />

              {/* The Active Crop Box */}
              <div
                className="absolute border-2 border-dk-yellow shadow-[0_0_20px_rgba(255,241,2,0.35)] pointer-events-auto cursor-move select-none"
                style={{
                  left: `${cropBox.x}%`,
                  top: `${cropBox.y}%`,
                  width: `${cropBox.width}%`,
                  height: `${cropBox.height}%`,
                }}
                onPointerDown={(e) => handlePointerDown(e, "move")}
              >
                {/* Rule of Thirds 3x3 Grid Overlay */}
                <div className="w-full h-full grid grid-cols-3 grid-rows-3 pointer-events-none opacity-45">
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

                {/* Resolution Pill inside Crop Box */}
                {livePixelW > 0 && livePixelH > 0 && (
                  <div className="absolute bottom-2 right-2 pointer-events-none px-2 py-0.5 rounded bg-black/80 backdrop-blur-md text-[10px] font-mono text-dk-yellow border border-dk-yellow/30 shadow-md">
                    {livePixelW} × {livePixelH} px
                  </div>
                )}

                {/* 4 Corner Resize Handles */}
                <div
                  onPointerDown={(e) => handlePointerDown(e, "nw")}
                  className="absolute -top-2.5 -left-2.5 w-5 h-5 bg-dk-yellow border-2 border-black rounded-sm cursor-nw-resize pointer-events-auto shadow-md hover:scale-125 transition-transform"
                />
                <div
                  onPointerDown={(e) => handlePointerDown(e, "ne")}
                  className="absolute -top-2.5 -right-2.5 w-5 h-5 bg-dk-yellow border-2 border-black rounded-sm cursor-ne-resize pointer-events-auto shadow-md hover:scale-125 transition-transform"
                />
                <div
                  onPointerDown={(e) => handlePointerDown(e, "sw")}
                  className="absolute -bottom-2.5 -left-2.5 w-5 h-5 bg-dk-yellow border-2 border-black rounded-sm cursor-sw-resize pointer-events-auto shadow-md hover:scale-125 transition-transform"
                />
                <div
                  onPointerDown={(e) => handlePointerDown(e, "se")}
                  className="absolute -bottom-2.5 -right-2.5 w-5 h-5 bg-dk-yellow border-2 border-black rounded-sm cursor-se-resize pointer-events-auto shadow-md hover:scale-125 transition-transform"
                />

                {/* 4 Edge Handles */}
                <div
                  onPointerDown={(e) => handlePointerDown(e, "n")}
                  className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-8 h-3 bg-dk-yellow border border-black rounded-full cursor-n-resize pointer-events-auto shadow-sm"
                />
                <div
                  onPointerDown={(e) => handlePointerDown(e, "s")}
                  className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-8 h-3 bg-dk-yellow border border-black rounded-full cursor-s-resize pointer-events-auto shadow-sm"
                />
                <div
                  onPointerDown={(e) => handlePointerDown(e, "w")}
                  className="absolute top-1/2 -translate-y-1/2 -left-1.5 w-3 h-8 bg-dk-yellow border border-black rounded-full cursor-w-resize pointer-events-auto shadow-sm"
                />
                <div
                  onPointerDown={(e) => handlePointerDown(e, "e")}
                  className="absolute top-1/2 -translate-y-1/2 -right-1.5 w-3 h-8 bg-dk-yellow border border-black rounded-full cursor-e-resize pointer-events-auto shadow-sm"
                />
              </div>
            </div>
          )}

          {/* Helper Hint */}
          <div className="absolute top-3 left-3 pointer-events-none px-2.5 py-1 rounded-md bg-black/75 backdrop-blur-md text-[10px] font-mono text-neutral-300 border border-white/10 flex items-center gap-1.5">
            <Maximize2 className="w-3 h-3 text-dk-yellow" />
            <span>Drag corners to frame • Drag center to reposition</span>
          </div>
        </div>

        {/* Error notification */}
        {imageError && (
          <div className="px-5 py-2.5 bg-dk-red/20 text-white text-xs font-mono border-t border-dk-red/40 flex items-center justify-between">
            <span>{imageError}</span>
            <button
              onClick={() => setImageError(null)}
              className="text-neutral-400 hover:text-white"
            >
              ✕
            </button>
          </div>
        )}

        {/* Toolbar & Transformation Controls */}
        <div className="px-4 sm:px-6 py-3 border-t border-neutral-800 bg-neutral-900/70 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
          {/* Zoom Slider */}
          <div className="flex items-center gap-2">
            <span className="text-neutral-400 text-[11px] uppercase tracking-wider shrink-0">
              Zoom:
            </span>
            <button
              type="button"
              onClick={() => setZoom((z) => Math.max(0.7, z - 0.1))}
              className="p-1 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-300"
              title="Zoom out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <input
              type="range"
              min="0.7"
              max="2.5"
              step="0.05"
              value={zoom}
              onChange={(e) => setZoom(parseFloat(e.target.value))}
              className="w-24 sm:w-32 accent-dk-yellow h-1 bg-neutral-800 rounded cursor-pointer"
            />
            <button
              type="button"
              onClick={() => setZoom((z) => Math.min(2.5, z + 0.1))}
              className="p-1 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-300"
              title="Zoom in"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <span className="text-neutral-400 text-[10px] w-9 text-right font-mono">
              {Math.round(zoom * 100)}%
            </span>
          </div>

          {/* Transformation Controls: Rotate & Flip */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              type="button"
              onClick={handleRotateCcw}
              className="px-2.5 py-1.5 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-300 flex items-center gap-1.5 hover:text-white transition-colors"
              title="Rotate 90° counter-clockwise"
            >
              <RotateCcw className="w-3.5 h-3.5 text-dk-yellow" />
              <span className="text-[11px]">-90°</span>
            </button>
            <button
              type="button"
              onClick={handleRotateCw}
              className="px-2.5 py-1.5 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-300 flex items-center gap-1.5 hover:text-white transition-colors"
              title="Rotate 90° clockwise"
            >
              <RotateCw className="w-3.5 h-3.5 text-dk-yellow" />
              <span className="text-[11px]">+90°</span>
            </button>
            <button
              type="button"
              onClick={handleFlipH}
              className={`px-2.5 py-1.5 rounded flex items-center gap-1.5 transition-colors ${
                flipH
                  ? "bg-dk-yellow text-black font-semibold"
                  : "bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white"
              }`}
              title="Flip horizontally (Mirror)"
            >
              <FlipHorizontal className="w-3.5 h-3.5" />
              <span className="text-[11px]">Flip H</span>
            </button>
            <button
              type="button"
              onClick={handleFlipV}
              className={`px-2.5 py-1.5 rounded flex items-center gap-1.5 transition-colors ${
                flipV
                  ? "bg-dk-yellow text-black font-semibold"
                  : "bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white"
              }`}
              title="Flip vertically"
            >
              <FlipVertical className="w-3.5 h-3.5" />
              <span className="text-[11px]">Flip V</span>
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="px-2.5 py-1.5 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white flex items-center gap-1 transition-colors"
              title="Reset all adjustments"
            >
              <RefreshCw className="w-3 h-3" />
              <span className="text-[11px]">Reset</span>
            </button>
          </div>
        </div>

        {/* Modal Action Buttons */}
        <div className="px-4 sm:px-6 py-3 border-t border-neutral-800 bg-neutral-950 flex items-center justify-between gap-3">
          <div className="text-[11px] font-mono text-neutral-400 truncate">
            {naturalDimensions.width > 0 && (
              <span>
                Original: {naturalDimensions.width} × {naturalDimensions.height} px
              </span>
            )}
          </div>
          <div className="flex items-center gap-2.5">
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
              className="px-5 py-2 rounded-lg bg-dk-yellow hover:bg-yellow-400 text-black text-xs font-mono uppercase tracking-wider font-semibold transition-all inline-flex items-center gap-2 hover:scale-[1.02] active:scale-95 disabled:opacity-50 cursor-pointer shadow-md"
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Cropping & Saving...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>Apply & Save Crop</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
