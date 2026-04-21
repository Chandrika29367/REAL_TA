// app/api/saved-properties/route.js
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/authOptions";

export const dynamic = "force-dynamic";
import { connectDB } from "@/lib/mongodb";
import SavedProperty from "@/models/SavedProperty";
import Property from "@/models/Property";
import mongoose from "mongoose";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    if (!userId) return NextResponse.json({ error: "userId required" }, { status: 400 });

    await connectDB();

    const saved = await SavedProperty.find({ userId }).sort({ createdAt: -1 }).lean();

    // Fetch each property (handles both ObjectId and original "P89075154" style IDs)
    const properties = await Promise.all(
      saved.map(async (s) => {
        if (mongoose.Types.ObjectId.isValid(s.propertyId)) {
          try {
            const byMongoId = await Property.findById(s.propertyId).lean();
            if (byMongoId) return byMongoId;
          } catch (e) {
            // Fall through to id search
          }
        }
        return Property.findOne({ id: s.propertyId }).lean();
      })
    );

    return NextResponse.json({
      properties: properties.filter(Boolean),
      total: properties.filter(Boolean).length,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const { propertyId } = await req.json();
    if (!propertyId) return NextResponse.json({ error: "propertyId required" }, { status: 400 });

    const saved = await SavedProperty.create({
      userId: session.user.id,
      propertyId: String(propertyId),
    });

    return NextResponse.json(saved, { status: 201 });
  } catch (err) {
    console.error(err);
    if (err.code === 11000) {
      return NextResponse.json({ error: "Already saved" }, { status: 409 });
    }
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const { searchParams } = new URL(req.url);
    const propertyId = searchParams.get("propertyId");
    if (!propertyId) return NextResponse.json({ error: "propertyId required" }, { status: 400 });

    await SavedProperty.deleteMany({
      userId: session.user.id,
      propertyId: String(propertyId),
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
