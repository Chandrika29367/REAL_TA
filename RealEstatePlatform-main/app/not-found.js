import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function NotFound() {
  return (
    <div style={{ fontFamily: "sans-serif", minHeight: "100vh", background: "#f5f5f5" }}>
      <Navbar />
      <div style={{ textAlign: "center", padding: "80px 20px" }}>
        <div style={{ fontSize: 64, marginBottom: 16 }}>🏠</div>
        <h1 style={{ fontSize: 32, fontWeight: 800, color: "#1a1a1a", marginBottom: 8 }}>Page Not Found</h1>
        <p style={{ color: "#999", fontSize: 16, marginBottom: 24 }}>The page you are looking for does not exist.</p>
        <Link href="/" style={{ background: "#E03A3C", color: "white", padding: "12px 28px", borderRadius: 8, textDecoration: "none", fontWeight: 700, fontSize: 15 }}>
          Go to Homepage
        </Link>
      </div>
    </div>
  );
}
