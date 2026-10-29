import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getReviewById, updateReview, deleteReview } from "@/lib/db-services";
import { verifyRequestAuth } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const review = await getReviewById(id);
    if (!review) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: review });
  } catch (err: any) {
    console.error("GET /api/reviews/[id] error:", err);
    return NextResponse.json({ error: err.message || "Failed to fetch review" }, { status: 500 });
  }
}

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

    const success = await updateReview(id, body);
    if (!success) {
      return NextResponse.json(
        { error: "Review not found or update failed" },
        { status: 404 }
      );
    }

    revalidatePath("/");
    revalidatePath("/reviews");
    revalidatePath("/admin/reviews");

    return NextResponse.json({
      success: true,
      message: "Review updated successfully",
    });
  } catch (err: any) {
    console.error("PATCH /api/reviews/[id] error:", err);
    return NextResponse.json({ error: err.message || "Failed to update review" }, { status: 500 });
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
    const success = await deleteReview(id);
    if (!success) {
      return NextResponse.json(
        { error: "Review not found or delete failed" },
        { status: 404 }
      );
    }

    revalidatePath("/");
    revalidatePath("/reviews");
    revalidatePath("/admin/reviews");

    return NextResponse.json({
      success: true,
      message: "Review deleted successfully",
    });
  } catch (err: any) {
    console.error("DELETE /api/reviews/[id] error:", err);
    return NextResponse.json({ error: err.message || "Failed to delete review" }, { status: 500 });
  }
}
