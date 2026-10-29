import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { updateDanceStyle, deleteDanceStyle } from "@/lib/db-services";
import { verifyRequestAuth } from "@/lib/auth";

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

    if (body.slug) {
      body.slug = body.slug
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
    }
    if (body.displayOrder !== undefined) {
      body.displayOrder = Number(body.displayOrder) || 0;
    }
    if (body.isActive !== undefined) {
      body.isActive = Boolean(body.isActive);
    }
    if (body.features !== undefined && Array.isArray(body.features)) {
      body.features = body.features.filter(Boolean);
    }

    const success = await updateDanceStyle(id, body);
    if (!success) {
      return NextResponse.json(
        { error: "Dance style not found or failed to update" },
        { status: 404 }
      );
    }

    revalidatePath("/");
    revalidatePath("/dance-styles");
    revalidatePath("/contact");
    revalidatePath("/online-classes");
    return NextResponse.json({ success: true, message: "Dance style updated" });
  } catch (error) {
    console.error("Error in PATCH /api/dance-styles/[id]:", error);
    return NextResponse.json(
      { error: "Failed to update dance style" },
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
    const success = await deleteDanceStyle(id);
    if (!success) {
      return NextResponse.json(
        { error: "Dance style not found or already deleted" },
        { status: 404 }
      );
    }

    revalidatePath("/");
    revalidatePath("/dance-styles");
    revalidatePath("/contact");
    revalidatePath("/online-classes");
    return NextResponse.json({ success: true, message: "Dance style deleted" });
  } catch (error) {
    console.error("Error in DELETE /api/dance-styles/[id]:", error);
    return NextResponse.json(
      { error: "Failed to delete dance style" },
      { status: 500 }
    );
  }
}
