import { UTApi } from "uploadthing/server";
import dns from "dns";

// Ensure IPv4 lookup for UploadThing API on dual-stack / NAT64 Windows environments
const originalLookup = dns.lookup;
if (!(dns as any).__ipv4HookedServer) {
  (dns as any).lookup = function (hostname: any, options: any, callback: any) {
    if (typeof options === "function") {
      callback = options;
      options = {};
    }
    if (typeof options === "number") {
      options = { family: options };
    }
    options = Object.assign({}, options, { family: 4, verbatim: false });
    return (originalLookup as any).call(dns, hostname, options, callback);
  };
  (dns as any).__ipv4HookedServer = true;
}

/**
 * Extracts UploadThing file key from either a raw key string or a full CDN URL
 * Examples:
 * - "P0pLE4vyUn8HaHYKw54VsXtEDibqTNURJwL62mhQr3vnaHjo" -> returns as-is
 * - "https://utfs.io/f/P0pLE4vyUn8HaHYKw54VsXtEDibqTNURJwL62mhQr3vnaHjo" -> "P0pLE4vyUn8HaHYKw54VsXtEDibqTNURJwL62mhQr3vnaHjo"
 * - "https://igfozd2k6k.ufs.sh/f/P0pLE4vyUn8HaHYKw54VsXtEDibqTNURJwL62mhQr3vnaHjo" -> "P0pLE4vyUn8HaHYKw54VsXtEDibqTNURJwL62mhQr3vnaHjo"
 */
export function extractUploadThingKey(keyOrUrl?: string | null): string | null {
  if (!keyOrUrl) return null;
  const str = keyOrUrl.trim();
  if (!str) return null;

  // Don't process non-UploadThing local paths
  if (str.startsWith("/images/") || str.startsWith("/videos/")) {
    return null;
  }

  // If it's a URL containing /f/
  if (str.includes("/f/")) {
    const key = str.split("/f/").pop()?.split("?")[0]?.trim();
    return key || null;
  }

  // If it's already a plain file key (no protocols or hostnames)
  if (!str.startsWith("http://") && !str.startsWith("https://") && !str.includes("/")) {
    return str;
  }

  return null;
}

/**
 * Deletes multiple files from UploadThing Cloud Storage in a single call.
 * Accepts keys or URLs.
 */
export async function deleteUploadThingFiles(
  keysOrUrls: (string | undefined | null)[]
): Promise<boolean> {
  const keys = Array.from(
    new Set(
      keysOrUrls
        .map(extractUploadThingKey)
        .filter((k): k is string => Boolean(k))
    )
  );

  if (keys.length === 0) {
    return true;
  }

  try {
    const token = process.env.UPLOADTHING_TOKEN || process.env.UPLOADTHING_SECRET;
    if (!token) {
      console.warn(
        "[UploadThing] Token not configured; skipping remote cloud deletion for keys:",
        keys
      );
      return true;
    }

    const utapi = new UTApi({ token });
    console.log(`[UploadThing] Deleting ${keys.length} cloud file(s):`, keys);
    const res = await utapi.deleteFiles(keys);
    console.log("[UploadThing] Cloud deletion result:", res);
    invalidateStorageUsageCache();
    return res.success;
  } catch (err) {
    console.error("[UploadThing] Error deleting cloud file(s):", err);
    return false;
  }
}

/**
 * Deletes a single file from UploadThing Cloud Storage.
 * Accepts a key or full URL.
 */
export async function deleteUploadThingFile(keyOrUrl?: string | null): Promise<boolean> {
  return deleteUploadThingFiles([keyOrUrl]);
}

export interface StorageUsageInfo {
  totalBytes: number;
  totalMb: number;
  totalGb: number;
  limitBytes: number;
  limitGb: number;
  percentageUsed: number;
  filesUploaded: number;
  isWarning: boolean; // >= 50% (1 GB)
  isCritical: boolean; // >= 85% (1.7 GB)
}

let cachedStorageUsage: { data: StorageUsageInfo; timestamp: number } | null = null;
const STORAGE_USAGE_CACHE_TTL = 2 * 60 * 1000; // 2 minutes in-memory cache

export function invalidateStorageUsageCache(): void {
  cachedStorageUsage = null;
}

/**
 * Fetches real-time cloud storage usage from UploadThing.
 * Free tier limit is 2 GB (2048 MB).
 * Flags warning when usage >= 1 GB (50%).
 * In-memory cached for 2 minutes to keep admin dashboard responses instant (<50ms).
 */
export async function getUploadThingStorageUsage(): Promise<StorageUsageInfo> {
  const token = process.env.UPLOADTHING_TOKEN || process.env.UPLOADTHING_SECRET;
  const DEFAULT_LIMIT_BYTES = 2 * 1024 * 1024 * 1024; // 2 GB

  const fallbackData: StorageUsageInfo = {
    totalBytes: 0,
    totalMb: 0,
    totalGb: 0,
    limitBytes: DEFAULT_LIMIT_BYTES,
    limitGb: 2,
    percentageUsed: 0,
    filesUploaded: 0,
    isWarning: false,
    isCritical: false,
  };

  if (!token) {
    return fallbackData;
  }

  const now = Date.now();
  if (cachedStorageUsage && now - cachedStorageUsage.timestamp < STORAGE_USAGE_CACHE_TTL) {
    return cachedStorageUsage.data;
  }

  try {
    const utapi = new UTApi({ token });
    // 1500ms max timeout so external network delays never block the admin dashboard
    const usagePromise = utapi.getUsageInfo();
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error("UploadThing getUsageInfo timeout")), 1500)
    );
    const usage = await Promise.race([usagePromise, timeoutPromise]);

    const usedBytes = usage.appTotalBytes ?? usage.totalBytes ?? 0;
    const limitBytes = usage.limitBytes || DEFAULT_LIMIT_BYTES;
    const totalMb = Number((usedBytes / (1024 * 1024)).toFixed(2));
    const totalGb = Number((usedBytes / (1024 * 1024 * 1024)).toFixed(3));
    const limitGb = Number((limitBytes / (1024 * 1024 * 1024)).toFixed(1));
    const percentageUsed = Math.min(
      100,
      Number(((usedBytes / limitBytes) * 100).toFixed(1))
    );

    const result: StorageUsageInfo = {
      totalBytes: usedBytes,
      totalMb,
      totalGb,
      limitBytes,
      limitGb: limitGb || 2,
      percentageUsed,
      filesUploaded: usage.filesUploaded ?? 0,
      isWarning: usedBytes >= 1024 * 1024 * 1024 || percentageUsed >= 50,
      isCritical: percentageUsed >= 85,
    };

    cachedStorageUsage = { data: result, timestamp: now };
    return result;
  } catch (err) {
    console.warn(
      "[UploadThing] Could not fetch live cloud usage info, using fallback/cached data:",
      err
    );
    if (cachedStorageUsage) {
      return cachedStorageUsage.data;
    }
    return fallbackData;
  }
}

