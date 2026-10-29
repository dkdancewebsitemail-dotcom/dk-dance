import { NextRequest, NextResponse } from "next/server";
import { getEnquiries, createEnquiry } from "@/lib/db-services";
import { verifyRequestAuth, checkRateLimit } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const session = await verifyRequestAuth(req);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const enquiries = await getEnquiries();
    return NextResponse.json({ success: true, data: enquiries });
  } catch (error) {
    console.error("Error in GET /api/enquiries:", error);
    return NextResponse.json(
      { error: "Failed to retrieve enquiries" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
      req.headers.get("x-real-ip") ||
      "enquiry-ip";

    // Rate limit: max 5 enquiry submissions per 10 minutes per IP
    if (!checkRateLimit(`enq_${ip}`, 5, 10 * 60 * 1000)) {
      return NextResponse.json(
        { error: "Too many requests. Please wait a while before sending another enquiry." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const {
      name,
      phone,
      email,
      age,
      branch = "General / Head Office",
      danceStyle = "All Styles",
      mode = "offline",
      message,
      
      website_hp,
    } = body;

    // Silent rejection for spam bots triggering honeypot
    if (website_hp) {
      return NextResponse.json({ success: true, message: "Enquiry received." });
    }

    if (!name || !phone || !email) {
      return NextResponse.json(
        { error: "Name, phone number, and email are required" },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address" },
        { status: 400 }
      );
    }

    const newEnquiry = await createEnquiry({
      name: String(name).trim(),
      phone: String(phone).trim(),
      email: String(email).trim().toLowerCase(),
      age: age ? String(age).trim() : undefined,
      branch: String(branch).trim(),
      danceStyle: String(danceStyle).trim(),
      mode: mode === "online" ? "online" : "offline",
      message: message ? String(message).trim() : undefined,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Thank you for reaching out to DK Dance Company. We will contact you soon.",
        data: { id: newEnquiry._id },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in POST /api/enquiries:", error);
    return NextResponse.json(
      { error: "Failed to submit enquiry. Please try again or WhatsApp us directly." },
      { status: 500 }
    );
  }
}
