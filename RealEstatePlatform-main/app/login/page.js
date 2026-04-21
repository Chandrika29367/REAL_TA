"use client";
import { useState } from "react";
import { signIn, getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
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
    if (session?.user?.role === "admin") {
      router.push("/admin");
    } else if (session?.user?.role === "agent") {
      router.push("/agent-dashboard");
    } else {
      router.push("/listings");
    }
  };

  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", background: "#F5F5F5", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ width: "100%", maxWidth: 460, background: "white", borderRadius: 18, padding: "38px 34px", boxShadow: "0 24px 80px rgba(0,0,0,0.08)" }}>
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: 32, fontWeight: 800, color: "#1A1A1A", marginBottom: 8 }}>Welcome Back</h1>
          <p style={{ fontSize: 15, color: "#717171" }}>Find your dream property in Vijayawada</p>
        </div>

        {error && (
          <div style={{ background: "#fee2e2", border: "1px solid #fecaca", borderRadius: 10, padding: "14px 16px", marginBottom: 20, color: "#b91c1c", fontSize: 14 }}>
            {error}
          </div>
        )}

        <div style={{ display: "grid", gap: 18 }}>
          <label style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 13, color: "#334155" }}>
            Email Address
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              style={{ width: "100%", border: "1px solid #E0E0E0", borderRadius: 10, padding: "14px 16px", fontSize: 14, outline: "none" }}
            />
          </label>
          <label style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 13, color: "#334155" }}>
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="��������"
              style={{ width: "100%", border: "1px solid #E0E0E0", borderRadius: 10, padding: "14px 16px", fontSize: 14, outline: "none" }}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            />
          </label>
        </div>

        <button
          onClick={handleLogin}
          disabled={loading}
          style={{ width: "100%", marginTop: 24, background: loading ? "#ccc" : "#E03A3C", border: "none", color: "white", padding: "16px 0", borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer" }}
        >
          {loading ? "Signing in..." : "Login"}
        </button>

        <div style={{ marginTop: 22, display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap", fontSize: 14, color: "#64748b" }}>
          <Link href="/register" style={{ color: "#E03A3C", textDecoration: "none", fontWeight: 700 }}>Register</Link>
          <Link href="/agent-login" style={{ color: "#E03A3C", textDecoration: "none", fontWeight: 700 }}>Are you an agent? Login here →</Link>
        </div>
      </div>
    </div>
  );
}
