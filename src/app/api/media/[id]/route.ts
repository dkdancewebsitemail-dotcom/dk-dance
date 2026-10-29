import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { updateMedia, deleteMedia } from "@/lib/db-services";
import { verifyRequestAuth } from "@/lib/auth";
import { deleteUploadThingFile } from "@/lib/uploadthing-server";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await verifyRequestAuth(req);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await req.json();
    const { previousKey, ...updatePayload } = body;

    const success = await updateMedia(id, updatePayload);
    if (!success) {
      return NextResponse.json(
        { error: "Media item not found or failed to update" },
        { status: 404 }
      );
    }

    // Clean up old UploadThing file if key was changed
    if (previousKey && updatePayload.key && previousKey !== updatePayload.key) {
      await deleteUploadThingFile(previousKey);
    }

    revalidatePath("/");
    revalidatePath("/gallery");
    revalidatePath("/admin/videos");

    return NextResponse.json({ success: true, message: "Media updated" });
  } catch (error) {
    console.error("Error in PATCH /api/media/[id]:", error);
    return NextResponse.json(
      { error: "Failed to update media item" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await verifyRequestAuth(req);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const deletedItem = await deleteMedia(id);
    if (!deletedItem) {
      return NextResponse.json(
        { error: "Media item not found or already deleted" },
        { status: 404 }
      );
    }

    // Attempt to delete from UploadThing if storage keys are present
    if (deletedItem.key) {
      await deleteUploadThingFile(deletedItem.key);
    }
    if (deletedItem.thumbnailKey) {
      await deleteUploadThingFile(deletedItem.thumbnailKey);
    }

    revalidatePath("/");
    revalidatePath("/gallery");
    revalidatePath("/admin/videos");

    return NextResponse.json({
      success: true,
      message: "Media deleted successfully",
      deletedKey: deletedItem.key,
    });
  } catch (error) {
    console.error("Error in DELETE /api/media/[id]:", error);
    return NextResponse.json(
      { error: "Failed to delete media item" },
      { status: 500 }
    );
  }
}
