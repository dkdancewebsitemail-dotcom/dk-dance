import { NextRequest, NextResponse } from "next/server";
import { verifyRequestAuth } from "@/lib/auth";
import { getUploadThingStorageUsage } from "@/lib/uploadthing-server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const session = await verifyRequestAuth(req);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const usage = await getUploadThingStorageUsage();
    return NextResponse.json({
      success: true,
      ...usage,
    });
  } catch (error: any) {
    console.error("Error in GET /api/storage/usage:", error);
    return NextResponse.json(
      { error: "Failed to fetch storage usage" },
      { status: 500 }
    );
  }
}
