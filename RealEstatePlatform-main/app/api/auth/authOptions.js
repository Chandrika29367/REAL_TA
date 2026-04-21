// app/api/auth/authOptions.js
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        await connectDB();
        const normalizedEmail = credentials.email.trim().toLowerCase();
        let user = await User.findOne({ email: normalizedEmail }).lean();
        if (!user) return null;

        const valid = await bcrypt.compare(credentials.password, user.password);
        if (!valid) return null;

        // Auto-upgrade role based on email domain
        if (normalizedEmail.endsWith("@realty.com") && user.role === "buyer") {
          user = await User.findOneAndUpdate(
            { email: normalizedEmail },
            { role: "agent" },
            { new: true, lean: true }
          );
        } else if (normalizedEmail === "nehabr.2302@gmail.com" && user.role !== "admin") {
          user = await User.findOneAndUpdate(
            { email: normalizedEmail },
            { role: "admin" },
            { new: true, lean: true }
          );
        }

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.role = token.role;
        session.user.id = token.id;
      }
      return session;
    },
  },
  pages: { signIn: "/login" },
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
};
