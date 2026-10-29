import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getReviews, createReview } from "@/lib/db-services";
import { verifyRequestAuth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const includeAll = searchParams.get("all") === "true";
    const reviews = await getReviews(!includeAll);

    return NextResponse.json({
      success: true,
      data: reviews,
      count: reviews.length,
    });
  } catch (err: any) {
    console.error("GET /api/reviews error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to fetch reviews" },
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
    const { author, text, rating, badge, timeAgo, published, displayOrder } = body;

    if (!author || !author.trim()) {
      return NextResponse.json({ error: "Author name is required" }, { status: 400 });
    }
    if (!text || !text.trim()) {
      return NextResponse.json({ error: "Review text is required" }, { status: 400 });
    }

    const newReview = await createReview({
      author: author.trim(),
      text: text.trim(),
      rating: Number(rating) || 5,
      badge: badge ? badge.trim() : "Verified Student",
      timeAgo: timeAgo ? timeAgo.trim() : "Recently",
      published: published !== false,
      displayOrder: Number(displayOrder) || 1,
    });

    revalidatePath("/");
    revalidatePath("/reviews");
    revalidatePath("/admin/reviews");

    return NextResponse.json(
      {
        success: true,
        message: "Google review created successfully",
        data: newReview,
      },
      { status: 201 }
    );
  } catch (err: any) {
    console.error("POST /api/reviews error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to create review" },
      { status: 500 }
    );
  }
}
