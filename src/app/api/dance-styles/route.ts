import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getDanceStyles, createDanceStyle } from "@/lib/db-services";
import { verifyRequestAuth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const includeInactive = searchParams.get("all") === "true";

    const styles = await getDanceStyles(!includeInactive);
    return NextResponse.json({ success: true, data: styles });
  } catch (error) {
    console.error("Error in GET /api/dance-styles:", error);
    return NextResponse.json(
      { error: "Failed to retrieve dance styles" },
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
      number,
      name,
      slug,
      tagline = "",
      description = "",
      image = "",
      imageKey,
      features = [],
      displayOrder = 0,
      isActive = true,
    } = body;

    if (!name || !number) {
      return NextResponse.json(
        { error: "Style number and name are required" },
        { status: 400 }
      );
    }

    const cleanSlug = (slug || name)
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    const newStyle = await createDanceStyle({
      number: String(number).trim(),
      name: String(name).trim(),
      slug: cleanSlug,
      tagline: String(tagline).trim(),
      description: String(description).trim(),
      image: String(image).trim(),
      imageKey,
      features: Array.isArray(features) ? features.filter(Boolean) : [],
      displayOrder: Number(displayOrder) || 0,
      isActive: Boolean(isActive),
    });

    revalidatePath("/");
    revalidatePath("/dance-styles");
    revalidatePath("/contact");
    revalidatePath("/online-classes");
    return NextResponse.json(
      { success: true, data: newStyle },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in POST /api/dance-styles:", error);
    return NextResponse.json(
      { error: "Failed to create dance style" },
      { status: 500 }
    );
  }
}
