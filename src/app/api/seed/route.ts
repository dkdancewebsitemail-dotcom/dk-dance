import { NextRequest, NextResponse } from "next/server";
import { seedDatabase } from "@/lib/db-services";
import { verifyRequestAuth } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const session = await verifyRequestAuth(req);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized. Admin session required to seed database." }, { status: 401 });
  }

  try {
    const result = await seedDatabase();
    return NextResponse.json({
      success: true,
      message: "Database seed executed successfully",
      result,
    });
  } catch (error) {
    console.error("Seed error:", error);
    return NextResponse.json(
      { error: "Failed to seed database" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  return POST(req);
}
