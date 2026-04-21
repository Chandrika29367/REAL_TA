"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";

function RegisterContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedRole, setSelectedRole] = useState("buyer");
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "", phone: "", company: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (searchParams?.get("role") === "agent") {
      setSelectedRole("agent");
    }
  }, [searchParams]);

  const handleRegister = async () => {
    if (!form.name || !form.email || !form.password || !form.confirmPassword) {
      setError("Please fill in all required fields");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    if (selectedRole === "agent" && (!form.phone || !form.company)) {
      setError("Please provide company name and phone number");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
          role: selectedRole,
          phone: form.phone,
          company: form.company,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Registration failed");
        setLoading(false);
        return;
      }
      router.push(selectedRole === "agent" ? "/agent-login" : "/login");
    } catch (err) {
      setError("Something went wrong");
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#F5F5F5", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
      <div style={{ width: "100%", maxWidth: 520, background: "white", borderRadius: 18, padding: "36px 34px", boxShadow: "0 24px 60px rgba(0,0,0,0.08)" }}>
        <div style={{ display: "flex", gap: 8, marginBottom: 28, background: "#f8fafc", padding: 4, borderRadius: 999 }}>
          {[
            { value: "buyer", label: "Buyer" },
            { value: "agent", label: "Agent" },
          ].map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => { setSelectedRole(option.value); setError(""); }}
              style={{
                flex: 1,
                padding: "12px 0",
                borderRadius: 999,
                border: "none",
                fontSize: 15,
                fontWeight: selectedRole === option.value ? 700 : 500,
                background: selectedRole === option.value ? "#E03A3C" : "transparent",
                color: selectedRole === option.value ? "white" : "#475569",
                cursor: "pointer",
                transition: "background 0.2s, color 0.2s",
              }}
            >
              {option.label}
            </button>
          ))}
        </div>

        <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 10 }}>Create your account</h1>
        <p style={{ fontSize: 14, color: "#64748b", marginBottom: 24 }}>
          {selectedRole === "agent"
            ? "Register as an agent to manage listings and client inquiries."
            : "Register to save properties, compare listings, and contact agents."}
        </p>

        {error && (
          <div style={{ background: "#fee2e2", border: "1px solid #fecaca", borderRadius: 10, color: "#b91c1c", padding: "12px 14px", marginBottom: 18, fontSize: 13 }}>
            {error}
          </div>
        )}

        <div style={{ display: "grid", gap: 16 }}>
          <label style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 13, color: "#334155" }}>
            Full Name
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Your full name"
              style={{ border: "1px solid #E2E8F0", borderRadius: 10, padding: "13px 14px", outline: "none", fontSize: 14 }}
            />
          </label>
          <label style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 13, color: "#334155" }}>
            Email Address
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="you@example.com"
              style={{ border: "1px solid #E2E8F0", borderRadius: 10, padding: "13px 14px", outline: "none", fontSize: 14 }}
            />
          </label>
          <label style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 13, color: "#334155" }}>
            Password
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="••••••••"
              style={{ border: "1px solid #E2E8F0", borderRadius: 10, padding: "13px 14px", outline: "none", fontSize: 14 }}
            />
          </label>
          <label style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 13, color: "#334155" }}>
            Confirm Password
            <input
              type="password"
              value={form.confirmPassword}
              onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
              placeholder="••••••••"
              style={{ border: "1px solid #E2E8F0", borderRadius: 10, padding: "13px 14px", outline: "none", fontSize: 14 }}
            />
          </label>
          {selectedRole === "agent" && (
            <>
              <label style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 13, color: "#334155" }}>
                Company / Agency Name
                <input
                  value={form.company}
                  onChange={(e) => setForm({ ...form, company: e.target.value })}
                  placeholder="Your agency name"
                  style={{ border: "1px solid #E2E8F0", borderRadius: 10, padding: "13px 14px", outline: "none", fontSize: 14 }}
                />
              </label>
              <label style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 13, color: "#334155" }}>
                Phone Number
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="9876543210"
                  style={{ border: "1px solid #E2E8F0", borderRadius: 10, padding: "13px 14px", outline: "none", fontSize: 14 }}
                />
              </label>
            </>
          )}
        </div>

        <button
          onClick={handleRegister}
          disabled={loading}
          style={{ width: "100%", marginTop: 24, background: "#E03A3C", border: "none", borderRadius: 12, color: "white", padding: "14px 16px", fontSize: 15, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer" }}
        >
          {loading ? "Creating account..." : "Create Account"}
        </button>

        <p style={{ marginTop: 22, fontSize: 13, color: "#475569", textAlign: "center" }}>
          Already have account? <Link href="/login" style={{ color: "#E03A3C", textDecoration: "none", fontWeight: 700 }}>Login</Link>
        </p>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={
      <div style={{ 
        minHeight: "100vh", 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center",
        fontFamily: "sans-serif",
        color: "#999",
        fontSize: 16,
      }}>
        Loading...
      </div>
    }>
      <RegisterContent />
    </Suspense>
  );
}
