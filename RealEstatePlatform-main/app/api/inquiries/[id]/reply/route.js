// app/api/inquiries/[id]/reply/route.js
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/authOptions";

export const dynamic = "force-dynamic";
import { connectDB } from "@/lib/mongodb";
import Inquiry from "@/models/Inquiry";

export async function POST(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();
    const { message } = await req.json();
    if (!message) return NextResponse.json({ error: "Message required" }, { status: 400 });

    const inquiry = await Inquiry.findById(params.id);
    if (!inquiry) return NextResponse.json({ error: "Inquiry not found" }, { status: 404 });

    // Append reply to the message thread
    inquiry.message = `${inquiry.message}\n\n---\n[${new Date().toLocaleString()}] ${session.user.name}: ${message}`;
    if (inquiry.status === "pending") inquiry.status = "contacted";
    await inquiry.save();

    return NextResponse.json({
      message: {
        id: `reply-${Date.now()}`,
        content: message,
        sender: { id: session.user.id, name: session.user.name },
        createdAt: new Date(),
      },
      inquiry,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
