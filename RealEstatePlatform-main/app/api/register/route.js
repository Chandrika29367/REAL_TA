// app/api/register/route.js
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export const dynamic = "force-dynamic";

export async function POST(request) {
  try {
    const { name, email, password, role } = await request.json();
    if (!name || !email || !password) {
      return NextResponse.json({ error: "All fields required" }, { status: 400 });
    }

    await connectDB();
    const normalizedEmail = email.trim().toLowerCase();

    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) return NextResponse.json({ error: "Email already registered" }, { status: 409 });

    const hashed = await bcrypt.hash(password, 10);
    const inferredRole = role || (normalizedEmail.endsWith("@realty.com") ? "agent" : "buyer");

    const user = await User.create({
      name,
      email: normalizedEmail,
      password: hashed,
      role: inferredRole,
    });

    return NextResponse.json(
      { id: user._id.toString(), name: user.name, email: user.email, role: user.role },
      { status: 201 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}
