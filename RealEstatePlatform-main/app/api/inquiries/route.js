// app/api/inquiries/route.js
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/authOptions";

export const dynamic = "force-dynamic";
import { connectDB } from "@/lib/mongodb";
import Inquiry from "@/models/Inquiry";
import User from "@/models/User";

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Please login to send inquiry" }, { status: 401 });

    await connectDB();
    const { message, propertyId } = await request.json();
    if (!message || !propertyId) return NextResponse.json({ error: "Message and propertyId required" }, { status: 400 });

    const user = await User.findOne({ email: session.user.email }).lean();
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const inquiry = await Inquiry.create({
      message,
      propertyId: String(propertyId),
      userId: user._id,
      status: "pending",
    });

    return NextResponse.json(inquiry, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to send inquiry" }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();
    const { searchParams } = new URL(request.url);
    const userId  = searchParams.get("userId");
    const agentId = searchParams.get("agentId");

    const filter = {};
    if (userId)  filter.userId = userId;
    // agentId filter not needed here — agents see inquiries via their property IDs

    const inquiries = await Inquiry.find(filter)
      .populate("userId", "name email phone")
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ inquiries, total: inquiries.length });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch inquiries" }, { status: 500 });
  }
}
