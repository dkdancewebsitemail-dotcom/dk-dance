import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { cookies, headers } from "next/headers";
import { NextRequest } from "next/server";
import { verifySessionToken, COOKIE_NAME } from "@/lib/auth";

const f = createUploadthing();

/**
 * Server-side authorization check for UploadThing uploads.
 * Validates either the Authorization: Bearer token or the HTTP-only session cookie.
 * Strictly throws UploadThingError if the caller is not an authenticated admin.
 */
async function checkAdminAuth(req?: NextRequest) {
  try {
    // 1. Check Authorization Bearer header (req or next/headers)
    let authHeader = req?.headers.get("authorization");
    if (!authHeader) {
      const headerStore = await headers();
      authHeader = headerStore.get("authorization");
    }

    if (authHeader?.startsWith("Bearer ")) {
      const bearer = authHeader.substring(7).trim();
      const session = await verifySessionToken(bearer);
      if (session?.username && session.role === "admin") {
        return { username: session.username };
      }
    }

    // 2. Check HTTP-only session cookie (req or next/headers)
    let token = req?.cookies.get(COOKIE_NAME)?.value;
    if (!token) {
      const cookieStore = await cookies();
      token = cookieStore.get(COOKIE_NAME)?.value;
    }

    if (token) {
      const session = await verifySessionToken(token);
      if (session?.username && session.role === "admin") {
        return { username: session.username };
      }
    }
  } catch (err) {
    console.warn("Auth verification warning in uploadthing:", err);
  }

  // Strictly block unauthorized upload attempts across all environments
  throw new UploadThingError("Unauthorized: Admin authentication required to upload media.");
}

export const ourFileRouter = {
  // Dedicated image uploader: photos strictly up to 10 MB
  imageUploader: f({
    image: {
      maxFileSize: "16MB",
      maxFileCount: 1,
    },
  })
    .middleware(async ({ req, files }) => {
      const user = await checkAdminAuth(req);
      const maxBytes = 10 * 1024 * 1024; // Strict 10 MB photo limit
      for (const file of files) {
        if (file.size > maxBytes) {
          throw new UploadThingError("Image size exceeds the strict 10 MB limit.");
        }
      }
      return { uploadedBy: user.username };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      const fileUrl =
        (file as any).ufsUrl ||
        (file as any).url ||
        (file.key ? `https://utfs.io/f/${file.key}` : "");
      return {
        uploadedBy: metadata.uploadedBy,
        url: fileUrl,
        key: file.key,
        name: file.name,
        type: "image" as const,
      };
    }),

  // Dedicated regular video uploader: videos strictly up to 50 MB
  videoUploader: f({
    video: {
      maxFileSize: "64MB",
      maxFileCount: 1,
    },
  })
    .middleware(async ({ req, files }) => {
      const user = await checkAdminAuth(req);
      const maxBytes = 50 * 1024 * 1024; // Strict 50 MB regular video limit
      for (const file of files) {
        if (file.size > maxBytes) {
          throw new UploadThingError("Video size exceeds the strict 50 MB limit.");
        }
      }
      return { uploadedBy: user.username };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      const fileUrl =
        (file as any).ufsUrl ||
        (file as any).url ||
        (file.key ? `https://utfs.io/f/${file.key}` : "");
      return {
        uploadedBy: metadata.uploadedBy,
        url: fileUrl,
        key: file.key,
        name: file.name,
        type: "video" as const,
      };
    }),

  // Dedicated hero video uploader: homepage hero video strictly up to 15 MB
  heroVideoUploader: f({
    video: {
      maxFileSize: "16MB",
      maxFileCount: 1,
    },
  })
    .middleware(async ({ req, files }) => {
      const user = await checkAdminAuth(req);
      const maxBytes = 15 * 1024 * 1024; // Strict 15 MB hero video limit
      for (const file of files) {
        if (file.size > maxBytes) {
          throw new UploadThingError("Hero video size exceeds the strict 15 MB limit.");
        }
      }
      return { uploadedBy: user.username };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      const fileUrl =
        (file as any).ufsUrl ||
        (file as any).url ||
        (file.key ? `https://utfs.io/f/${file.key}` : "");
      return {
        uploadedBy: metadata.uploadedBy,
        url: fileUrl,
        key: file.key,
        name: file.name,
        type: "video" as const,
      };
    }),

  // Combined media uploader for backward compatibility
  mediaUploader: f({
    image: {
      maxFileSize: "16MB",
      maxFileCount: 1,
    },
    video: {
      maxFileSize: "64MB",
      maxFileCount: 1,
    },
  })
    .middleware(async ({ req, files }) => {
      const user = await checkAdminAuth(req);
      for (const file of files) {
        const isVideo =
          file.type?.startsWith("video/") ||
          Boolean(file.name.match(/\.(mp4|mov|webm|m4v)$/i));
        const limitMb = isVideo ? 50 : 10;
        if (file.size > limitMb * 1024 * 1024) {
          throw new UploadThingError(`${isVideo ? "Video" : "Image"} size exceeds the strict ${limitMb} MB limit.`);
        }
      }
      return { uploadedBy: user.username };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      const fileUrl =
        (file as any).ufsUrl ||
        (file as any).url ||
        (file.key ? `https://utfs.io/f/${file.key}` : "");
      const isVideo =
        file.type?.startsWith("video/") ||
        Boolean(file.name.match(/\.(mp4|mov|webm|m4v)$/i));
      return {
        uploadedBy: metadata.uploadedBy,
        url: fileUrl,
        key: file.key,
        name: file.name,
        type: (isVideo ? "video" : "image") as "image" | "video",
      };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
