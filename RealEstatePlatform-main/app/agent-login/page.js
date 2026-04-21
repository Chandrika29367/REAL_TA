"use client";
import { useState } from "react";
import { signIn, getSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AgentLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Please enter email and password");
      return;
    }

    setLoading(true);
    setError("");

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Invalid email or password");
      setLoading(false);
      return;
    }

    const session = await getSession();
    if (!session || (session.user.role !== "agent" && session.user.role !== "admin")) {
      setError("This portal is for agents only.");
      await signOut({ redirect: false });
      setLoading(false);
      return;
    }

    router.push("/agent-dashboard");
  };

  return (
    <div style={{ minHeight: "100vh", background: "#1a1a2e", color: "white", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
      <div style={{ width: "100%", maxWidth: 420, background: "#16213e", borderRadius: 20, padding: "36px 32px", boxShadow: "0 24px 80px rgba(0,0,0,0.25)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 22 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: "#E03A3C", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontWeight: 800, fontSize: 18 }}>R</span>
          </div>
          <div>
            <div style={{ fontSize: 20, fontWeight: 800, letterSpacing: "-0.03em" }}>REALTA</div>
            <div style={{ fontSize: 13, color: "#cbd5e1" }}>Agent Portal</div>
          </div>
        </div>

        <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>Agent Portal</h1>
        <p style={{ color: "#cbd5e1", fontSize: 14, marginBottom: 28 }}>Manage your listings and client inquiries</p>

        {error && (
          <div style={{ background: "#581c38", border: "1px solid #E03A3C", padding: "12px 14px", borderRadius: 10, marginBottom: 18, color: "#fee2e2", fontSize: 13 }}>
            {error}
          </div>
        )}

        <div style={{ display: "grid", gap: 16, marginBottom: 24 }}>
          <label style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 13, color: "#cbd5e1" }}>
            Email address
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@company.com"
              style={{ background: "transparent", border: "1px solid #cbd5e1", borderRadius: 10, color: "white", padding: "12px 14px", outline: "none", fontSize: 14 }}
            />
          </label>
          <label style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 13, color: "#cbd5e1" }}>
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{ background: "transparent", border: "1px solid #cbd5e1", borderRadius: 10, color: "white", padding: "12px 14px", outline: "none", fontSize: 14 }}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            />
          </label>
        </div>

        <button
          onClick={handleLogin}
          disabled={loading}
          style={{ width: "100%", background: loading ? "#51557a" : "#E03A3C", border: "none", borderRadius: 10, color: "white", padding: "14px 16px", fontSize: 15, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", transition: "background 0.2s" }}
        >
          {loading ? "Signing in..." : "Agent Login"}
        </button>

        <div style={{ marginTop: 20, fontSize: 13, color: "#94a3b8", display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
          <Link href="/admin-login" style={{ color: "#E03A3C", textDecoration: "none" }}>Admin login →</Link>
          <Link href="/register?role=agent" style={{ color: "#E03A3C", textDecoration: "none" }}>Register as agent →</Link>
        </div>

        <div style={{ marginTop: 18, borderTop: "1px solid rgba(203,213,225,0.2)", paddingTop: 18, fontSize: 13, color: "#cbd5e1" }}>
          <Link href="/login" style={{ color: "#E03A3C", textDecoration: "none" }}>← Back to buyer login</Link>
        </div>
      </div>
    </div>
  );
}
