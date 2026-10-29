import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { updateCurriculumModule, deleteCurriculumModule } from "@/lib/db-services";
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

    if (body.displayOrder !== undefined) {
      body.displayOrder = Number(body.displayOrder) || 0;
    }
    if (body.isActive !== undefined) {
      body.isActive = Boolean(body.isActive);
    }

    const success = await updateCurriculumModule(id, body);
    if (!success) {
      return NextResponse.json(
        { error: "Curriculum module not found or failed to update" },
        { status: 404 }
      );
    }

    revalidatePath("/");
    revalidatePath("/dance-styles");

    return NextResponse.json({
      success: true,
      message: "Curriculum module updated",
    });
  } catch (error) {
    console.error("Error in PATCH /api/curriculum/[id]:", error);
    return NextResponse.json(
      { error: "Failed to update curriculum module" },
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
    const success = await deleteCurriculumModule(id);
    if (!success) {
      return NextResponse.json(
        { error: "Curriculum module not found or already deleted" },
        { status: 404 }
      );
    }

    revalidatePath("/");
    revalidatePath("/dance-styles");

    return NextResponse.json({
      success: true,
      message: "Curriculum module deleted",
    });
  } catch (error) {
    console.error("Error in DELETE /api/curriculum/[id]:", error);
    return NextResponse.json(
      { error: "Failed to delete curriculum module" },
      { status: 500 }
    );
  }
}
