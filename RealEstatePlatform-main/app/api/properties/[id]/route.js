// app/api/properties/[id]/route.js
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/authOptions";

export const dynamic = "force-dynamic";
import { connectDB } from "@/lib/mongodb";
import Property from "@/models/Property";
import mongoose from "mongoose";

// Helper: find a property by either Mongo _id or original scraped "id" field
async function findProperty(id) {
  if (mongoose.Types.ObjectId.isValid(id)) {
    const byMongoId = await Property.findById(id).lean();
    if (byMongoId) return byMongoId;
  }
  return Property.findOne({ id }).lean();
}

export async function GET(_, { params }) {
  try {
    await connectDB();
    const property = await findProperty(params.id);
    if (!property) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(property);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const body = await request.json();

    let property;
    if (mongoose.Types.ObjectId.isValid(params.id)) {
      property = await Property.findByIdAndUpdate(params.id, body, { new: true });
    } else {
      property = await Property.findOneAndUpdate({ id: params.id }, body, { new: true });
    }

    if (!property) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(property);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}

export async function DELETE(_, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    let deleted;
    if (mongoose.Types.ObjectId.isValid(params.id)) {
      deleted = await Property.findByIdAndDelete(params.id);
    } else {
      deleted = await Property.findOneAndDelete({ id: params.id });
    }

    if (!deleted) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ message: "Deleted" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
