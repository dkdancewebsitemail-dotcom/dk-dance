import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getSiteSettings, updateSiteSettings } from "@/lib/db-services";
import { verifyRequestAuth } from "@/lib/auth";

export async function GET() {
  try {
    const settings = await getSiteSettings();
    return NextResponse.json(
      { success: true, data: settings },
      {
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
        },
      }
    );
  } catch (error) {
    console.error("Error in GET /api/settings:", error);
    return NextResponse.json(
      { error: "Failed to retrieve site settings" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  const session = await verifyRequestAuth(req);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const success = await updateSiteSettings(body);
    if (!success) {
      return NextResponse.json(
        { error: "Failed to update settings" },
        { status: 500 }
      );
    }

    revalidatePath("/", "layout");
    revalidatePath("/");
    revalidatePath("/about");
    revalidatePath("/classes");
    revalidatePath("/reviews");
    revalidatePath("/contact");
    revalidatePath("/dance-styles");
    revalidatePath("/branches");
    revalidatePath("/gallery");
    revalidatePath("/videos");

    return NextResponse.json({
      success: true,
      message: "Site settings updated successfully",
    });
  } catch (error) {
    console.error("Error in PATCH /api/settings:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
