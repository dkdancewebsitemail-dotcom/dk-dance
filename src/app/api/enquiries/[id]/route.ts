import { NextRequest, NextResponse } from "next/server";
import { updateEnquiryStatus, deleteEnquiry } from "@/lib/db-services";
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
    const { status } = body;

    if (!["new", "read", "contacted", "closed"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const success = await updateEnquiryStatus(id, status);
    if (!success) {
      return NextResponse.json(
        { error: "Enquiry not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: "Status updated" });
  } catch (error) {
    console.error("Error in PATCH /api/enquiries/[id]:", error);
    return NextResponse.json(
      { error: "Failed to update enquiry status" },
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
    const success = await deleteEnquiry(id);
    if (!success) {
      return NextResponse.json(
        { error: "Enquiry not found or already deleted" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: "Enquiry deleted" });
  } catch (error) {
    console.error("Error in DELETE /api/enquiries/[id]:", error);
    return NextResponse.json(
      { error: "Failed to delete enquiry" },
      { status: 500 }
    );
  }
}
