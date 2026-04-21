// app/api/inquiries/[id]/route.js
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Inquiry from "@/models/Inquiry";

export const dynamic = "force-dynamic";

export async function GET(req, { params }) {
  try {
    await connectDB();
    const inquiry = await Inquiry.findById(params.id)
      .populate("userId", "name email phone")
      .lean();

    if (!inquiry) return NextResponse.json({ error: "Inquiry not found" }, { status: 404 });
    return NextResponse.json({ inquiry, messages: [] });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(req, { params }) {
  try {
    await connectDB();
    const { status } = await req.json();
    const inquiry = await Inquiry.findByIdAndUpdate(params.id, { status }, { new: true })
      .populate("userId", "name email phone")
      .lean();
    if (!inquiry) return NextResponse.json({ error: "Inquiry not found" }, { status: 404 });
    return NextResponse.json({ inquiry });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    await connectDB();
    await Inquiry.findByIdAndDelete(params.id);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
