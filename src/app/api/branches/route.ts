import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getBranches, createBranch } from "@/lib/db-services";
import { verifyRequestAuth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const includeInactive = searchParams.get("all") === "true";

    const branches = await getBranches();
    const filtered = includeInactive ? branches : branches.filter((b) => b.isActive);

    return NextResponse.json({ success: true, data: filtered });
  } catch (error) {
    console.error("Error in GET /api/branches:", error);
    return NextResponse.json(
      { error: "Failed to retrieve branches" },
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
      name,
      slug,
      country = "India",
      state = "Kerala",
      city = "Kozhikode",
      address,
      phone,
      whatsapp,
      googleMapsUrl,
      latitude,
      longitude,
      description,
      imageUrl,
      imageKey,
      classTimings,
      isActive = true,
      displayOrder = 0,
    } = body;

    if (!name || !slug) {
      return NextResponse.json(
        { error: "Branch name and slug are required" },
        { status: 400 }
      );
    }

    const cleanSlug = slug
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    const newBranch = await createBranch({
      name: name.trim(),
      slug: cleanSlug,
      country,
      state,
      city,
      address,
      phone,
      whatsapp,
      googleMapsUrl,
      latitude: latitude ? Number(latitude) : undefined,
      longitude: longitude ? Number(longitude) : undefined,
      description,
      imageUrl,
      imageKey,
      classTimings,
      isActive: Boolean(isActive),
      displayOrder: Number(displayOrder) || 0,
    });

    revalidatePath("/");
    revalidatePath("/branches");
    revalidatePath(`/branches/${newBranch.slug}`);
    return NextResponse.json(
      { success: true, data: newBranch },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in POST /api/branches:", error);
    return NextResponse.json(
      { error: "Failed to create branch" },
      { status: 500 }
    );
  }
}
