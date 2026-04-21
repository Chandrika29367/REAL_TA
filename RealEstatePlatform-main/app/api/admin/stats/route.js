// app/api/admin/stats/route.js
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/authOptions";

export const dynamic = "force-dynamic";
import { connectDB } from "@/lib/mongodb";
import Property from "@/models/Property";
import User from "@/models/User";
import Inquiry from "@/models/Inquiry";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const [totalProperties, available, sold, totalUsers, inquiries, recentProperties] =
      await Promise.all([
        Property.countDocuments(),
        Property.countDocuments({ status: "available" }),
        Property.countDocuments({ status: "sold" }),
        User.countDocuments(),
        Inquiry.countDocuments(),
        Property.find().sort({ createdAt: -1 }).limit(5).lean(),
      ]);

    return NextResponse.json({
      totalProperties,
      available,
      sold,
      totalUsers,
      inquiries,
      totalValue: 0, // scraped prices are strings; skipping aggregate sum
      recentProperties,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
