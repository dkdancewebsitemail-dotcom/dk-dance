import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { updateBranch, deleteBranch } from "@/lib/db-services";
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

    const success = await updateBranch(id, body);
    if (!success) {
      return NextResponse.json(
        { error: "Branch not found or failed to update" },
        { status: 404 }
      );
    }

    revalidatePath("/");
    revalidatePath("/branches");
    if (body.slug) revalidatePath(`/branches/${body.slug}`);
    return NextResponse.json({ success: true, message: "Branch updated" });
  } catch (error) {
    console.error("Error in PATCH /api/branches/[id]:", error);
    return NextResponse.json(
      { error: "Failed to update branch" },
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
    const success = await deleteBranch(id);
    if (!success) {
      return NextResponse.json(
        { error: "Branch not found or already deleted" },
        { status: 404 }
      );
    }

    revalidatePath("/");
    revalidatePath("/branches");
    return NextResponse.json({ success: true, message: "Branch deleted" });
  } catch (error) {
    console.error("Error in DELETE /api/branches/[id]:", error);
    return NextResponse.json(
      { error: "Failed to delete branch" },
      { status: 500 }
    );
  }
}
