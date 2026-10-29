import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getMedia, getVideos, createMedia } from "@/lib/db-services";
import { verifyRequestAuth } from "@/lib/auth";
import { MediaCategory, MediaType, MediaItem } from "@/types";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category") || undefined;
    const type = (searchParams.get("type") as "image" | "video" | "all") || undefined;
    const includeUnpublished = searchParams.get("all") === "true";

    let items: MediaItem[];
    if (type === "video") {
      items = await getVideos({
        onlyPublished: !includeUnpublished,
      });
      if (category && category !== "All") {
        items = items.filter((m) => m.category === category);
      }
    } else if (type === "image") {
      items = await getMedia(category, "image");
    } else {
      items = await getMedia(category, "all");
    }

    const filtered = includeUnpublished ? items : items.filter((m) => m.published);

    return NextResponse.json({ success: true, data: filtered });
  } catch (error) {
    console.error("Error in GET /api/media:", error);
    return NextResponse.json(
      { error: "Failed to retrieve media items" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const session = await verifyRequestAuth(req);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const {
      type = "image",
      url,
      key,
      name,
      title,
      description,
      category = "Classes",
      thumbnailUrl,
      thumbnailKey,
      duration,
      featuredOnHome = type === "video",
      published = true,
      displayOrder = 0,
    } = body;

    if (!url || !title) {
      return NextResponse.json(
        { error: "Media URL and title are required" },
        { status: 400 }
      );
    }

    // Strict library capacity limits: max 10 videos, max 15 images
    if (type === "video") {
      const existingVideos = await getVideos({ onlyPublished: false });
      if (existingVideos.length >= 10) {
        return NextResponse.json(
          {
            error:
              "Maximum limit of 10 videos reached in the showcase. Please remove an existing video before uploading a new one.",
          },
          { status: 400 }
        );
      }
    } else {
      const existingPhotos = await getMedia(undefined, "image");
      if (existingPhotos.length >= 15) {
        return NextResponse.json(
          {
            error:
              "Maximum limit of 15 images reached in the photo library. Please remove an existing photo before uploading a new one.",
          },
          { status: 400 }
        );
      }
    }

    const newItem = await createMedia({
      type: type as MediaType,
      url,
      key,
      name,
      title: title.trim(),
      description,
      category: category as MediaCategory,
      thumbnailUrl,
      thumbnailKey,
      duration,
      featuredOnHome: Boolean(featuredOnHome),
      published: Boolean(published),
      displayOrder: Number(displayOrder) || 0,
    });

    revalidatePath("/");
    revalidatePath("/gallery");
    revalidatePath("/admin/videos");

    return NextResponse.json(
      { success: true, data: newItem },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in POST /api/media:", error);
    return NextResponse.json(
      { error: "Failed to save media metadata" },
      { status: 500 }
    );
  }
}
