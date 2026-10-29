import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getCurriculumModules, createCurriculumModule } from "@/lib/db-services";
import { verifyRequestAuth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const includeInactive = searchParams.get("all") === "true";

    const modules = await getCurriculumModules(!includeInactive);
    return NextResponse.json({ success: true, data: modules });
  } catch (error) {
    console.error("Error in GET /api/curriculum:", error);
    return NextResponse.json(
      { error: "Failed to retrieve curriculum modules" },
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
      title,
      desc,
      badge = "CONDITIONING",
      displayOrder = 0,
      isActive = true,
    } = body;

    if (!title || !desc) {
      return NextResponse.json(
        { error: "Module title and description are required" },
        { status: 400 }
      );
    }

    const newModule = await createCurriculumModule({
      title: String(title).trim(),
      desc: String(desc).trim(),
      badge: String(badge).trim() || "CONDITIONING",
      displayOrder: Number(displayOrder) || 0,
      isActive: Boolean(isActive),
    });

    revalidatePath("/");
    revalidatePath("/dance-styles");

    return NextResponse.json(
      { success: true, data: newModule },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in POST /api/curriculum:", error);
    return NextResponse.json(
      { error: "Failed to create curriculum module" },
      { status: 500 }
    );
  }
}
