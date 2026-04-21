// app/api/admin/users/route.js
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/authOptions";

export const dynamic = "force-dynamic";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const users = await User.find()
      .select("name email role phone createdAt")
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ users, total: users.length });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
