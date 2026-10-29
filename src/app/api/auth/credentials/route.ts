import { NextRequest, NextResponse } from "next/server";
import { verifyRequestAuth, createSessionToken, COOKIE_NAME } from "@/lib/auth";
import { getAdminUser, updateAdminUser } from "@/lib/db-services";

export async function GET(req: NextRequest) {
  const session = await verifyRequestAuth(req);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const admin = await getAdminUser();
    return NextResponse.json({
      success: true,
      username: admin.username,
      updatedAt: admin.updatedAt,
    });
  } catch (error) {
    console.error("Error in GET /api/auth/credentials:", error);
    return NextResponse.json(
      { error: "Failed to load admin profile" },
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
    const { currentPassword, newUsername, newPassword } = body;

    if (!currentPassword) {
      return NextResponse.json(
        { error: "Current password is required to verify your identity." },
        { status: 400 }
      );
    }

    if (!newUsername || newUsername.trim().length < 3) {
      return NextResponse.json(
        { error: "Username must be at least 3 characters long." },
        { status: 400 }
      );
    }

    if (newPassword && newPassword.trim().length < 6) {
      return NextResponse.json(
        { error: "New password must be at least 6 characters long." },
        { status: 400 }
      );
    }

    const result = await updateAdminUser(
      currentPassword.trim(),
      newUsername.trim(),
      newPassword ? newPassword.trim() : undefined
    );

    if (!result.success || !result.username) {
      return NextResponse.json(
        { error: result.error || "Failed to update credentials." },
        { status: 400 }
      );
    }

    // Refresh JWT session cookie with new username
    const newToken = await createSessionToken(result.username);
    const isProduction = process.env.NODE_ENV === "production";

    const response = NextResponse.json({
      success: true,
      message: newPassword
        ? "Admin username and password updated successfully."
        : "Admin username updated successfully.",
      username: result.username,
    });

    response.cookies.set({
      name: COOKIE_NAME,
      value: newToken,
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error) {
    console.error("Error in PATCH /api/auth/credentials:", error);
    return NextResponse.json(
      { error: "An unexpected server error occurred." },
      { status: 500 }
    );
  }
}
