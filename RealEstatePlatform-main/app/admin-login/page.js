"use client";
import { useState } from "react";
import { signIn, getSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminLoginPage() {
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
    if (!session || session.user.role !== "admin") {
      setError("Access denied. Admin credentials required.");
      await signOut({ redirect: false });
      setLoading(false);
      return;
    }

    router.push("/admin");
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0f172a", color: "white", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
      <div style={{ width: "100%", maxWidth: 420, background: "#1e293b", borderRadius: 20, padding: "36px 32px", boxShadow: "0 24px 80px rgba(0,0,0,0.25)" }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 6 }}>REALTA Administration</h1>
        <p style={{ color: "#cbd5e1", fontSize: 14, marginBottom: 28 }}>Restricted access — authorized personnel only</p>

        {error && (
          <div style={{ background: "#1f2937", border: "1px solid #E03A3C", padding: "12px 14px", borderRadius: 10, marginBottom: 18, color: "#fecaca", fontSize: 13 }}>
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
              placeholder="admin@realty.com"
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
          style={{ width: "100%", background: loading ? "#334155" : "#E03A3C", border: "none", borderRadius: 10, color: "white", padding: "14px 16px", fontSize: 15, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", transition: "background 0.2s" }}
        >
          {loading ? "Signing in..." : "Admin Login"}
        </button>

        <div style={{ marginTop: 18, borderTop: "1px solid rgba(148,163,184,0.25)", paddingTop: 18, fontSize: 13, color: "#94a3b8" }}>
          <Link href="/agent-login" style={{ color: "#E03A3C", textDecoration: "none" }}>← Agent login</Link>
        </div>
      </div>
    </div>
  );
}
